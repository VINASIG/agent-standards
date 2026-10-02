import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { createBundle, repositoryRoot } from '../src/bundle.ts';
import { record } from '../src/model.ts';

await test('CLI JSON, schemas, dry-run and documented exit codes', async () => {
  const root = path.join(repositoryRoot, 'output/tests', randomUUID());
  const target = path.join(root, 'consumer');
  await mkdir(target, { recursive: true });
  const bundle = await createBundle(
    repositoryRoot,
    path.join(root, 'bundle'),
    '0.1.0',
  );
  const invoke = (command: string, args: string[] = []) =>
    spawnSync(
      process.execPath,
      [
        path.join(repositoryRoot, 'src/cli.ts'),
        command,
        '--target',
        target,
        '--json',
        ...args,
      ],
      { encoding: 'utf8' },
    );
  const params = [
    '--bundle',
    bundle.path,
    '--sha256',
    bundle.sha256,
    '--profile',
    'core',
  ];
  assert.equal(invoke('doctor').status, 1);
  const dry = invoke('init', [...params, '--dry-run']);
  assert.equal(dry.status, 0);
  assert.equal(record(JSON.parse(dry.stdout))['dryRun'], true);
  const first = invoke('init', params);
  assert.equal(first.status, 0, first.stderr);
  const summary = record(JSON.parse(first.stdout));
  assert.equal(summary['changed'], true);
  assert.equal(invoke('init', params).status, 0);
  const check = invoke('doctor');
  assert.equal(check.status, 0);
  const checks = record(JSON.parse(check.stdout))['checks'];
  assert.ok(Array.isArray(checks));
  assert.ok(checks.some((c) => record(c)['status'] === 'NOT_RUN'));
  const ajv = new Ajv2020({ strict: true });
  const outputSchema = ajv.compile(
    record(
      JSON.parse(
        await readFile(
          path.join(repositoryRoot, 'schemas/cli-result.schema.json'),
          'utf8',
        ),
      ),
    ),
  );
  for (const output of [dry.stdout, first.stdout, check.stdout])
    assert.ok(
      outputSchema(JSON.parse(output)),
      JSON.stringify(outputSchema.errors),
    );
  for (const [file, schema] of [
    [path.join(bundle.path, 'bundle.json'), 'bundle'],
    [path.join(target, '.vinasig/manifest.json'), 'manifest'],
  ] as const) {
    const validate = ajv.compile(
      record(
        JSON.parse(
          await readFile(
            path.join(repositoryRoot, `schemas/${schema}.schema.json`),
            'utf8',
          ),
        ),
      ),
    );
    assert.ok(
      validate(JSON.parse(await readFile(file, 'utf8'))),
      JSON.stringify(validate.errors),
    );
  }
  const diff = invoke('diff', params);
  assert.equal(diff.status, 0);
  assert.equal(record(JSON.parse(diff.stdout))['changed'], false);
  assert.equal(
    invoke('init', [
      '--bundle',
      bundle.path,
      '--sha256',
      '0'.repeat(64),
      '--profile',
      'core',
    ]).status,
    2,
  );
  assert.equal(invoke('unknown').status, 2);
  await writeFile(
    path.join(target, '.vinasig/standards/policies/core.md'),
    'Owner modified',
  );
  assert.equal(invoke('doctor').status, 1);
  assert.equal(invoke('uninstall').status, 2);
  const conflict = invoke('update', params);
  assert.equal(conflict.status, 2);
  assert.match(conflict.stderr, /Local conflict/);
  assert.ok(
    outputSchema(JSON.parse(conflict.stderr)),
    JSON.stringify(outputSchema.errors),
  );
});
