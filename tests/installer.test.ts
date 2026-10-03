import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdir, readFile, writeFile, symlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createBundle, repositoryRoot } from '../src/bundle.ts';
import {
  doctor,
  execute,
  installed,
  planInstall,
  planRollback,
  planUninstall,
} from '../src/installer.ts';
import { readOptional, sha256 } from '../src/model.ts';
import { begin, end } from '../src/model.ts';
import type { Profile } from '../src/model.ts';

async function workspace(): Promise<string> {
  const root = path.join(repositoryRoot, 'output/tests', randomUUID());
  await mkdir(root, { recursive: true });
  return root;
}
async function setup() {
  const root = await workspace();
  const target = path.join(root, 'consumer');
  await mkdir(target);
  const bundle = await createBundle(
    repositoryRoot,
    path.join(root, 'bundle'),
    '0.1.0',
  );
  return { root, target, bundle };
}
for (const p of ['core', 'web-static', 'web-typescript'] satisfies Profile[]) {
  await test(`install, dry run, reinstall, doctor and exact preservation for ${p}`, async () => {
    const { target, bundle } = await setup();
    const original =
      '# Project rules\r\nKeep custom behavior. No trailing newline';
    await writeFile(path.join(target, 'AGENTS.md'), original);
    await writeFile(path.join(target, 'package.json'), '{}');
    await writeFile(path.join(target, 'project.config.json'), 'custom config');
    const plan = await planInstall(target, bundle.path, bundle.sha256, p);
    await execute(target, plan, true);
    assert.equal(await readOptional(target, '.vinasig/manifest.json'), null);
    assert.equal(
      await readFile(path.join(target, 'AGENTS.md'), 'utf8'),
      original,
    );
    const result = await execute(target, plan);
    assert.equal(result.changed, true);
    assert.deepEqual(
      (await doctor(target)).filter((c) => c.status === 'FAIL'),
      [],
    );
    assert.equal(
      (
        await execute(
          target,
          await planInstall(target, bundle.path, bundle.sha256, p),
        )
      ).changed,
      false,
    );
    assert.equal(
      await readFile(path.join(target, 'package.json'), 'utf8'),
      '{}',
    );
    assert.equal(
      await readFile(path.join(target, 'project.config.json'), 'utf8'),
      'custom config',
    );
    const snapshot = await installed(target);
    assert.ok(snapshot);
    for (const file of [
      'LICENSE',
      'LICENSES.md',
      'LICENSES/CC-BY-SA-4.0.txt',
      'BRAND_POLICY.md',
      'docs/audits/licensing-2026-10-04.md',
      'docs/license-text-sources.json',
      'policies/licensing.md',
      'templates/license-review.md',
    ]) {
      assert.deepEqual(
        await readFile(path.join(target, '.vinasig/standards', file)),
        await readFile(path.join(repositoryRoot, file)),
        `Preserve license and review material for ${p}: ${file}`,
      );
    }
    assert.match(
      await readFile(path.join(target, 'AGENTS.md'), 'utf8'),
      /Importing this standard does not relicense the host project/,
    );
    if (p === 'core')
      assert.equal(
        Object.keys(snapshot.manifest.files).some((file) =>
          /web\/|responsive|configs\//.test(file),
        ),
        false,
      );
    await execute(target, await planUninstall(target));
    assert.equal(
      await readFile(path.join(target, 'AGENTS.md'), 'utf8'),
      original,
    );
    assert.equal(await readOptional(target, '.vinasig/manifest.json'), null);
    assert.equal(
      (await execute(target, await planUninstall(target))).changed,
      false,
    );
  });
}
await test('profile update, reviewed diff, rollback and unowned AGENTS edits', async () => {
  const { target, bundle } = await setup();
  await writeFile(path.join(target, 'AGENTS.md'), 'Original\n');
  await execute(
    target,
    await planInstall(target, bundle.path, bundle.sha256, 'core'),
  );
  const update = await planInstall(
    target,
    bundle.path,
    bundle.sha256,
    'web-static',
    true,
  );
  const before = await readFile(path.join(target, '.vinasig/manifest.json'));
  const diff = await execute(target, update, true);
  assert.ok(diff.paths.some((p) => p.includes('vinasig-responsive')));
  assert.deepEqual(
    await readFile(path.join(target, '.vinasig/manifest.json')),
    before,
  );
  const changed = await execute(target, update);
  assert.ok(changed.backup);
  const current = await readFile(path.join(target, 'AGENTS.md'), 'utf8');
  await writeFile(
    path.join(target, 'AGENTS.md'),
    'New owner instruction\n' + current,
  );
  await execute(target, await planRollback(target, changed.backup));
  assert.equal((await installed(target))?.manifest.profile, 'core');
  assert.ok(
    (await readFile(path.join(target, 'AGENTS.md'), 'utf8')).startsWith(
      'New owner instruction\nOriginal\n',
    ),
  );
});
await test('source version update remains pinned; uninstall can be rolled back', async () => {
  const { root, target, bundle } = await setup();
  await execute(
    target,
    await planInstall(target, bundle.path, bundle.sha256, 'web-typescript'),
  );
  const newer = await createBundle(
    repositoryRoot,
    path.join(root, 'newer'),
    '0.1.1',
  );
  await execute(
    target,
    await planInstall(target, newer.path, newer.sha256, 'web-typescript', true),
  );
  assert.equal((await installed(target))?.manifest.version, '0.1.1');
  await assert.rejects(
    planInstall(target, bundle.path, newer.sha256, 'web-typescript', true),
    /digest/,
  );
  const removed = await execute(target, await planUninstall(target));
  assert.ok(removed.backup);
  assert.equal(await readOptional(target, 'AGENTS.md'), null);
  await execute(target, await planRollback(target, removed.backup));
  assert.equal((await installed(target))?.manifest.version, '0.1.1');
});
await test('local modified files block update, uninstall and rollback', async () => {
  const { target, bundle } = await setup();
  const first = await execute(
    target,
    await planInstall(target, bundle.path, bundle.sha256, 'core'),
  );
  assert.ok(first.backup);
  const file = '.vinasig/standards/policies/core.md';
  await writeFile(path.join(target, file), 'User changed the rule');
  await assert.rejects(
    planInstall(target, bundle.path, bundle.sha256, 'core', true),
    /conflict/,
  );
  await assert.rejects(planUninstall(target), /conflict/);
  await assert.rejects(planRollback(target, first.backup), /conflict/);
  assert.equal(
    await readFile(path.join(target, file), 'utf8'),
    'User changed the rule',
  );
});
await test('unowned files, duplicate blocks and root override fail safely', async () => {
  const { target, bundle } = await setup();
  await writeFile(path.join(target, 'AGENTS.override.md'), 'Owner override');
  await assert.rejects(
    planInstall(target, bundle.path, bundle.sha256, 'core'),
    /shadows/,
  );
  const another = await workspace();
  await mkdir(path.join(another, '.agents/skills/vinasig-workflow'), {
    recursive: true,
  });
  await writeFile(
    path.join(another, '.agents/skills/vinasig-workflow/SKILL.md'),
    'Owner skill',
  );
  await assert.rejects(
    planInstall(another, bundle.path, bundle.sha256, 'core'),
    /collision/,
  );
});
await test('modified bundle and malicious traversal cannot write outside the target', async () => {
  const { target, bundle } = await setup();
  await writeFile(
    path.join(bundle.path, 'policies/core.md'),
    'Tampered source',
  );
  await assert.rejects(
    planInstall(target, bundle.path, bundle.sha256, 'core'),
    /integrity/,
  );
  const { target: other, bundle: second } = await setup();
  const text = await readFile(path.join(second.path, 'bundle.json'), 'utf8');
  const changed = text.replace('"policies/core.md"', '"../outside.md"');
  await writeFile(path.join(second.path, 'bundle.json'), changed);
  await assert.rejects(
    planInstall(other, second.path, sha256(changed), 'core'),
    /Unsafe path/,
  );
});
await test('symlink or Windows junction boundary is rejected', async () => {
  const { root, target, bundle } = await setup();
  const outside = path.join(root, 'outside');
  await mkdir(outside);
  await symlink(
    outside,
    path.join(target, '.vinasig'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );
  await assert.rejects(
    planInstall(target, bundle.path, bundle.sha256, 'core'),
    /Symlink/,
  );
  assert.equal(await readOptional(outside, 'manifest.json'), null);
});
await test('changes after planning are detected before mutation', async () => {
  const { target, bundle } = await setup();
  const plan = await planInstall(target, bundle.path, bundle.sha256, 'core');
  await writeFile(path.join(target, 'AGENTS.md'), 'Different owner text');
  await execute(target, plan);
  assert.ok(
    (await readFile(path.join(target, 'AGENTS.md'), 'utf8')).startsWith(
      'Different owner text',
    ),
  );
  const second = await planUninstall(target);
  await writeFile(
    path.join(target, '.vinasig/standards/policies/core.md'),
    'Changed since planning',
  );
  await assert.rejects(execute(target, second), /changed after planning/);
  assert.equal(
    await readFile(
      path.join(target, '.vinasig/standards/policies/core.md'),
      'utf8',
    ),
    'Changed since planning',
  );
});
await test('invalid instruction markers and existing operation lock preserve owner state', async () => {
  const { target, bundle } = await setup();
  const malformed = `${begin}\n${begin}\n${end}`;
  await writeFile(path.join(target, 'AGENTS.md'), malformed);
  await assert.rejects(
    planInstall(target, bundle.path, bundle.sha256, 'core'),
    /block|marker/i,
  );
  assert.equal(
    await readFile(path.join(target, 'AGENTS.md'), 'utf8'),
    malformed,
  );
  const other = await workspace();
  const plan = await planInstall(other, bundle.path, bundle.sha256, 'core');
  await mkdir(path.join(other, '.vinasig'));
  await writeFile(
    path.join(other, '.vinasig/install.lock'),
    'Another operation owns this lock',
  );
  await assert.rejects(execute(other, plan), /EEXIST/);
  assert.equal(await readOptional(other, '.vinasig/manifest.json'), null);
  assert.equal(
    await readFile(path.join(other, '.vinasig/install.lock'), 'utf8'),
    'Another operation owns this lock',
  );
});
