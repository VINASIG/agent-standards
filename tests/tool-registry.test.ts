import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

type Registry = {
  runtime: { selected: string; packageManager: string };
  packages: { package: string; selected: string }[];
};
type Package = {
  packageManager: string;
  devDependencies: Record<string, string>;
};

const registry = JSON.parse(
  await readFile(new URL('../tools.lock.json', import.meta.url), 'utf8'),
) as Registry;
const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
) as Package;

await test('the source registry follows the pinned verification runtime', async () => {
  const node = (
    await readFile(new URL('../.node-version', import.meta.url), 'utf8')
  ).trim();
  assert.equal(registry.runtime.selected, node);
  assert.equal(registry.runtime.packageManager, packageJson.packageManager);
});

await test('installed verification packages match their selected registry versions', () => {
  for (const [name, version] of Object.entries(packageJson.devDependencies)) {
    const entry = registry.packages.find((item) => item.package === name);
    assert.ok(entry, `Missing tool registry entry for ${name}`);
    assert.equal(
      entry.selected,
      version,
      `Selected version differs for ${name}`,
    );
  }
});
