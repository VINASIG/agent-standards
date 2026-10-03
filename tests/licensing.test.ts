import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash, randomUUID } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot } from '../src/bundle.ts';

await test('license records preserve verbatim texts and explicit software/prose scopes', async () => {
  const pkg = JSON.parse(
    await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'),
  ) as { license: string };
  assert.equal(pkg.license, 'GPL-3.0-or-later');
  const sources = JSON.parse(
    await readFile(
      path.join(repositoryRoot, 'docs/license-text-sources.json'),
      'utf8',
    ),
  ) as { id: string; sha256: string; files: string[] }[];
  assert.deepEqual(sources.map((source) => source.id).sort(), [
    'CC-BY-SA-4.0',
    'GPL-3.0-or-later',
  ]);
  for (const source of sources)
    for (const file of source.files)
      assert.equal(
        createHash('sha256')
          .update(await readFile(path.join(repositoryRoot, file)))
          .digest('hex'),
        source.sha256,
      );
  const scope = await readFile(
    path.join(repositoryRoot, 'LICENSES.md'),
    'utf8',
  );
  assert.match(scope, /any later version/);
  assert.match(
    scope,
    /Importing them does not by itself change the host license/,
  );
});

await test('managed license drift is detected without overwriting owner changes', async () => {
  const { createBundle } = await import('../src/bundle.ts');
  const { planInstall, execute, doctor, planUninstall } =
    await import('../src/installer.ts');
  const root = path.join(repositoryRoot, 'output/tests', randomUUID());
  const target = path.join(root, 'consumer');
  await mkdir(target, { recursive: true });
  const bundle = await createBundle(
    repositoryRoot,
    path.join(root, 'bundle'),
    '0.1.0',
  );
  await execute(
    target,
    await planInstall(target, bundle.path, bundle.sha256, 'core'),
  );
  const filename = path.join(target, '.vinasig/standards/LICENSE');
  await writeFile(filename, 'Locally altered license');
  assert(
    (await doctor(target)).some(
      (check) => check.status === 'FAIL' && check.name.includes('LICENSE'),
    ),
  );
  await assert.rejects(
    planUninstall(target),
    /Local conflict: \.vinasig\/standards\/LICENSE/,
  );
  assert.equal(await readFile(filename, 'utf8'), 'Locally altered license');
});

await test('license CLI rejects missing grants, metadata drift and changed legal text', async () => {
  const target = path.join(repositoryRoot, 'output/tests', randomUUID());
  for (const folder of ['docs', 'LICENSES'])
    await mkdir(path.join(target, folder), { recursive: true });
  for (const file of [
    'package.json',
    'package-lock.json',
    'LICENSE',
    'LICENSES.md',
    'LICENSES/CC-BY-SA-4.0.txt',
    'BRAND_POLICY.md',
    'docs/license-text-sources.json',
  ])
    await copyFile(path.join(repositoryRoot, file), path.join(target, file));
  const run = () =>
    spawnSync(
      process.execPath,
      [path.join(repositoryRoot, 'templates/check-licenses.mjs')],
      {
        cwd: target,
        encoding: 'utf8',
      },
    );
  assert.equal(run().status, 0);
  const filename = path.join(target, 'package.json');
  const original = await readFile(filename, 'utf8');
  await writeFile(filename, original.replace('GPL-3.0-or-later', 'UNLICENSED'));
  assert.notEqual(run().status, 0);
  await writeFile(filename, original);
  const lock = path.join(target, 'package-lock.json');
  const oldLock = await readFile(lock, 'utf8');
  await writeFile(lock, oldLock.replace('GPL-3.0-or-later', 'MIT'));
  assert.notEqual(run().status, 0);
  await writeFile(lock, oldLock);
  await writeFile(path.join(target, 'LICENSE'), 'Not the legal text');
  const changed = run();
  assert.notEqual(changed.status, 0);
  assert.match(changed.stderr, /Changed standard license text/);
});
