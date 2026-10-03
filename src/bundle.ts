import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './model.ts';
import type { Bundle } from './model.ts';

export const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
export async function filesUnder(
  root: string,
  relative: string,
): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(path.join(root, relative), {
    withFileTypes: true,
  })) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...(await filesUnder(root, name)));
    else if (entry.isFile()) result.push(name);
    else throw new Error(`Unsupported bundle entry: ${name}`);
  }
  return result.sort();
}
export async function createBundle(
  root: string,
  destination: string,
  version: string,
): Promise<{ path: string; sha256: string }> {
  const paths: string[] = [];
  for (const folder of [
    'policies',
    'profiles',
    'skills',
    'configs',
    'schemas',
    'templates',
  ])
    paths.push(...(await filesUnder(root, folder)));
  paths.push('standards.json', 'tools.lock.json');
  paths.push(
    'LICENSE',
    'LICENSES.md',
    'LICENSES/CC-BY-SA-4.0.txt',
    'BRAND_POLICY.md',
    'docs/audits/licensing-2026-10-04.md',
    'docs/license-text-sources.json',
  );
  paths.push('docs/sources.md', 'docs/tool-registry.md');
  const files: Record<string, string> = {};
  for (const relative of paths.sort()) {
    const content = await readFile(path.join(root, relative));
    files[relative] = sha256(content);
  }
  const sourceDigest = sha256(JSON.stringify(files));
  const manifest: Bundle = {
    format: 1,
    version,
    source: {
      repository: 'VINASIG/agent-standards',
      ref: `sha256:${sourceDigest}`,
      kind: 'local-content-snapshot',
    },
    files,
  };
  const output = path.resolve(destination);
  await mkdir(output, { recursive: true });
  for (const relative of paths) {
    const content = await readFile(path.join(root, relative));
    if (sha256(content) !== files[relative])
      throw new Error('Source changed during bundling');
    await mkdir(path.dirname(path.join(output, relative)), { recursive: true });
    await writeFile(path.join(output, relative), content, { flag: 'wx' });
  }
  const text = JSON.stringify(manifest, null, 2) + '\n';
  await writeFile(path.join(output, 'bundle.json'), text, { flag: 'wx' });
  return { path: output, sha256: sha256(text) };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const version: unknown = JSON.parse(
    await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'),
  );
  if (
    typeof version !== 'object' ||
    version === null ||
    !('version' in version) ||
    typeof version.version !== 'string'
  )
    throw new Error('Package version missing');
  console.log(
    JSON.stringify(
      await createBundle(
        repositoryRoot,
        process.argv[2] ??
          path.join(repositoryRoot, 'output/bundles', version.version),
        version.version,
      ),
    ),
  );
}
