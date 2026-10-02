import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { repositoryRoot } from '../src/bundle.ts';

export async function startPreview(): Promise<{
  url: string;
  stop: () => Promise<void>;
}> {
  const allowed = new Map([
    ['/static/', 'static/index.html'],
    ['/static/index.html', 'static/index.html'],
    ['/static/style.css', 'static/style.css'],
    ['/static/app.js', 'static/app.js'],
    ['/typed/', 'web-typescript/index.html'],
    ['/typed/index.html', 'web-typescript/index.html'],
    ['/broken/', 'broken/index.html'],
  ]);
  const typed = ts.transpileModule(
    await readFile(
      path.join(repositoryRoot, 'tests/fixtures/web-typescript/app.ts'),
      'utf8',
    ),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2023,
        module: ts.ModuleKind.ESNext,
      },
    },
  ).outputText;
  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
    if (pathname === '/typed/app.js') {
      response.setHeader('Content-Type', 'text/javascript');
      response.end(typed);
      return;
    }
    const file = allowed.get(pathname);
    if (!file) {
      response.statusCode = 404;
      response.end('Not found');
      return;
    }
    const type = file.endsWith('.css')
      ? 'text/css'
      : file.endsWith('.js')
        ? 'text/javascript'
        : 'text/html';
    response.setHeader('Content-Type', type);
    readFile(path.join(repositoryRoot, 'tests/fixtures', file))
      .then((content) => response.end(content))
      .catch(() => {
        response.statusCode = 500;
        response.end('Fixture unavailable');
      });
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Preview did not bind a port');
  return {
    url: `http://127.0.0.1:${String(address.port)}`,
    stop: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        }),
      ),
  };
}
export default async function setup(): Promise<() => Promise<void>> {
  const preview = await startPreview();
  process.env['STANDARDS_TEST_URL'] = preview.url;
  console.log(`Fixture preview: ${preview.url}`);
  return preview.stop;
}
