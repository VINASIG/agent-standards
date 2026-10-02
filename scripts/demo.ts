import assert from 'node:assert/strict';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createBundle, repositoryRoot } from '../src/bundle.ts';
import {
  doctor,
  execute,
  planInstall,
  planRollback,
  planUninstall,
} from '../src/installer.ts';
import { profiles, readOptional } from '../src/model.ts';

const root = path.join(repositoryRoot, 'output/demo', randomUUID());
await mkdir(root, { recursive: true });
const bundle = await createBundle(
  repositoryRoot,
  path.join(root, 'bundle'),
  '0.1.0',
);
const results = [];
for (const profile of profiles) {
  const target = path.join(root, profile);
  const fixture =
    profile === 'core'
      ? 'non-web'
      : profile === 'web-static'
        ? 'static'
        : 'web-typescript';
  await cp(path.join(repositoryRoot, 'tests/fixtures', fixture), target, {
    recursive: true,
    errorOnExist: true,
  });
  const owner = '# Owner instructions\r\nPreserve this project.\r\n';
  await writeFile(path.join(target, 'AGENTS.md'), owner);
  const packageBefore = await readOptional(target, 'package.json');
  if (profile !== 'core')
    await writeFile(
      path.join(target, 'tsconfig.json'),
      JSON.stringify({
        extends: `./.vinasig/standards/configs/${profile === 'web-static' ? 'tsconfig-js' : 'tsconfig-strict'}.json`,
        include: [profile === 'web-static' ? 'app.js' : 'app.ts'],
      }),
    );
  const configBefore = await readOptional(target, 'tsconfig.json');
  const first = await planInstall(target, bundle.path, bundle.sha256, profile);
  await execute(target, first, true);
  assert.equal(await readOptional(target, '.vinasig/manifest.json'), null);
  const installation = await execute(target, first);
  assert.equal(installation.changed, true);
  assert.equal(
    (await doctor(target)).some((c) => c.status === 'FAIL'),
    false,
  );
  let quality: unknown = {
    status: 'NOT_APPLICABLE',
    reason: 'Documentation-only nonweb fixture has no JS/TS code',
  };
  if (profile !== 'core') {
    const app = path.join(
      target,
      profile === 'web-static' ? 'app.js' : 'app.ts',
    );
    const original = await readFile(app, 'utf8');
    const checkSource = () =>
      spawnSync(
        process.execPath,
        [
          path.join(repositoryRoot, 'node_modules/typescript/bin/tsc'),
          '-p',
          path.join(target, 'tsconfig.json'),
        ],
        { encoding: 'utf8' },
      );
    const initial = checkSource();
    assert.equal(initial.status, 0, initial.stdout + initial.stderr);
    const defect =
      profile === 'web-static'
        ? '\n/** @type {number} */\nconst qualityProbe = "intentional-type-defect";\n'
        : '\nconst qualityProbe: number = "intentional-type-defect";\n';
    let failure;
    try {
      await writeFile(app, original + defect);
      failure = checkSource();
      assert.notEqual(failure.status, 0);
      assert.match(failure.stdout + failure.stderr, /not assignable/);
    } finally {
      await writeFile(app, original);
    }
    const repaired = checkSource();
    assert.equal(repaired.status, 0, repaired.stdout + repaired.stderr);
    quality = {
      initial: { status: 'PASS', output: initial.stdout },
      intentionalDefect: { status: 'FAIL', output: failure.stdout },
      repaired: { status: 'PASS', output: repaired.stdout },
      method:
        'Demonstration inserts a named type defect into its own copied consumer source, then restores the valid source; no quality rule changes',
    };
    await writeFile(
      path.join(root, `${profile}-quality.json`),
      JSON.stringify(quality, null, 2),
    );
  }
  assert.equal(
    (
      await execute(
        target,
        await planInstall(target, bundle.path, bundle.sha256, profile),
      )
    ).changed,
    false,
  );
  const next = profile === 'core' ? 'web-static' : 'core';
  const update = await execute(
    target,
    await planInstall(target, bundle.path, bundle.sha256, next, true),
  );
  assert.ok(update.backup);
  await execute(target, await planRollback(target, update.backup));
  await execute(target, await planUninstall(target));
  assert.equal(await readFile(path.join(target, 'AGENTS.md'), 'utf8'), owner);
  assert.deepEqual(await readOptional(target, 'package.json'), packageBefore);
  assert.deepEqual(await readOptional(target, 'tsconfig.json'), configBefore);
  assert.equal(await readOptional(target, 'node_modules/package.json'), null);
  results.push({
    profile,
    status: 'PASS',
    target,
    actions: [
      'dry-run',
      'install',
      'doctor',
      'reinstall',
      'profile-update',
      'rollback',
      'uninstall',
    ],
    discovery: 'NOT_RUN',
    quality,
  });
}
await writeFile(
  path.join(root, 'results.json'),
  JSON.stringify({ bundle, results }, null, 2),
);
console.log(
  JSON.stringify({
    status: 'PASS',
    artifact: root,
    bundle,
    profiles: results.length,
  }),
);
