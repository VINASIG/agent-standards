import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { repositoryRoot } from '../src/bundle.ts';

interface Result {
  name: string;
  expected: 'PASS' | 'FAIL';
  exitCode: number | null;
  output: string;
}
const results: Result[] = [];
function run(
  name: string,
  bin: string,
  args: string[],
  expected: 'PASS' | 'FAIL',
  cwd = repositoryRoot,
): void {
  const result = spawnSync(
    process.execPath,
    [path.join(repositoryRoot, 'node_modules', bin), ...args],
    { cwd, encoding: 'utf8' },
  );
  const output = result.stdout + result.stderr;
  results.push({ name, expected, exitCode: result.status, output });
  assert.equal(result.error, undefined);
  assert.notEqual(result.status, null);
  assert.equal(result.status === 0, expected === 'PASS', `${name}: ${output}`);
}
const root = path.join(repositoryRoot, 'output/quality', randomUUID());
await mkdir(root, { recursive: true });
const tsconfig = {
  extends: path.join(repositoryRoot, 'configs/tsconfig-js.json'),
  include: [
    path.join(repositoryRoot, 'tests/fixtures/broken/type.ts'),
    path.join(repositoryRoot, 'tests/fixtures/broken/javascript.js'),
    path.join(repositoryRoot, 'tests/fixtures/broken/promise.ts'),
  ],
};
await writeFile(path.join(root, 'tsconfig.json'), JSON.stringify(tsconfig));
run(
  'valid static checked JavaScript',
  'typescript/bin/tsc',
  ['-p', 'tests/fixtures/static/tsconfig.json'],
  'PASS',
);
run(
  'valid TypeScript web',
  'typescript/bin/tsc',
  ['-p', 'tests/fixtures/web-typescript/tsconfig.json'],
  'PASS',
);
run(
  'invalid TypeScript and JavaScript',
  'typescript/bin/tsc',
  ['-p', path.join(root, 'tsconfig.json')],
  'FAIL',
);
assert.ok(results.at(-1)?.output.includes('not assignable'));
run(
  'valid HTML',
  'html-validate/bin/html-validate.mjs',
  [
    '--config',
    'configs/htmlvalidate.json',
    'tests/fixtures/static/index.html',
    'tests/fixtures/web-typescript/index.html',
  ],
  'PASS',
);
run(
  'invalid HTML',
  'html-validate/bin/html-validate.mjs',
  ['--config', 'configs/htmlvalidate.json', 'tests/fixtures/broken/index.html'],
  'FAIL',
);
run(
  'valid CSS',
  'stylelint/bin/stylelint.mjs',
  [
    'tests/fixtures/static/style.css',
    '--config',
    'configs/stylelint.json',
    '--max-warnings',
    '0',
  ],
  'PASS',
);
run(
  'invalid CSS',
  'stylelint/bin/stylelint.mjs',
  [
    'tests/fixtures/broken/style.css',
    '--config',
    'configs/stylelint.json',
    '--max-warnings',
    '0',
  ],
  'FAIL',
);
run(
  'valid checked JavaScript typed lint',
  'eslint/bin/eslint.js',
  [
    '--config',
    path.join(repositoryRoot, 'configs/eslint.mjs'),
    'app.js',
    '--max-warnings',
    '0',
  ],
  'PASS',
  path.join(repositoryRoot, 'tests/fixtures/static'),
);
run(
  'valid typed lint',
  'eslint/bin/eslint.js',
  [
    '--config',
    path.join(repositoryRoot, 'configs/eslint.mjs'),
    'app.ts',
    '--max-warnings',
    '0',
  ],
  'PASS',
  path.join(repositoryRoot, 'tests/fixtures/web-typescript'),
);
const config = path.join(root, 'eslint.config.mjs');
await writeFile(
  config,
  `import base from ${JSON.stringify(new URL('../configs/eslint.mjs', import.meta.url).href)};\nexport default [...base,{files:['**/*.ts'],languageOptions:{parserOptions:{projectService:false,project:${JSON.stringify(path.join(root, 'tsconfig.json'))}}}}];\n`,
);
run(
  'floating Promise typed lint',
  'eslint/bin/eslint.js',
  [
    '--config',
    config,
    'tests/fixtures/broken/promise.ts',
    '--max-warnings',
    '0',
  ],
  'FAIL',
);
assert.ok(results.at(-1)?.output.includes('no-floating-promises'));
await writeFile(
  path.join(root, 'results.json'),
  JSON.stringify({ status: 'PASS', results }, null, 2),
);
console.log(
  JSON.stringify({ status: 'PASS', checks: results.length, artifact: root }),
);
