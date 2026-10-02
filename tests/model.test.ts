import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseBundle, parseManifest } from '../src/model.ts';

const bundle = {
  format: 1,
  version: '0.1.0',
  source: {
    repository: 'VINASIG/agent-standards',
    ref: 'sha256:reviewed',
    kind: 'local-content-snapshot',
  },
  files: { 'policies/core.md': 'a'.repeat(64) },
};
await test('native metadata validation rejects unknown fields, unsupported formats and invalid ownership', () => {
  assert.equal(parseBundle(bundle).version, '0.1.0');
  assert.throws(() => parseBundle({ ...bundle, format: 2 }), /format/);
  assert.throws(() => parseBundle({ ...bundle, surprise: true }), /Unknown/);
  assert.throws(
    () => parseBundle({ ...bundle, source: { ...bundle.source, ref: '' } }),
    /nonempty/,
  );
  assert.throws(
    () => parseBundle({ ...bundle, files: { '../outside': 'a'.repeat(64) } }),
    /Unsafe/,
  );
  const manifest = {
    ...bundle,
    files: { '.vinasig/standards/policies/core.md': 'a'.repeat(64) },
    profile: 'core',
    bundleSha256: 'b'.repeat(64),
    agentBlock: 'c'.repeat(64),
    agentsCreated: false,
  };
  assert.equal(parseManifest(manifest).agentsCreated, false);
  assert.throws(
    () => parseManifest({ ...manifest, agentsCreated: 'false' }),
    /agentsCreated/,
  );
  assert.throws(
    () =>
      parseManifest({ ...manifest, files: { 'package.json': 'a'.repeat(64) } }),
    /Unmanaged/,
  );
});
