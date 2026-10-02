import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { parse } from 'yaml';
import { filesUnder, repositoryRoot } from '../src/bundle.ts';
import { record, string } from '../src/model.ts';

const ajv = new Ajv2020({ allErrors: true, strict: true });
async function json(relative: string): Promise<unknown> {
  return JSON.parse(
    await readFile(path.join(repositoryRoot, relative), 'utf8'),
  );
}
for (const [file, schema] of [
  ['standards.json', 'standards'],
  ['templates/report.json', 'report'],
] as const) {
  const validate = ajv.compile(
    record(await json(`schemas/${schema}.schema.json`)),
  );
  assert.ok(
    validate(await json(string(file))),
    JSON.stringify(validate.errors),
  );
}
const names = new Set<string>();
for (const file of await filesUnder(repositoryRoot, 'skills')) {
  if (!file.endsWith('/SKILL.md')) continue;
  const text = await readFile(path.join(repositoryRoot, file), 'utf8');
  const match = /^---\r?\n([\s\S]+?)\r?\n---\r?\n/.exec(text);
  assert.ok(match?.[1], `Missing frontmatter: ${file}`);
  const metadata = record(parse(match[1]));
  const name = string(metadata['name']);
  assert.match(name, /^vinasig-[a-z0-9-]{1,55}$/);
  assert.equal(file, `skills/${name}/SKILL.md`);
  assert.ok(string(metadata['description']).length > 20);
  assert.equal(names.has(name), false, `Duplicate skill: ${name}`);
  names.add(name);
  assert.doesNotMatch(text, /\bTODO\b|\[INSERT|placeholder skill/i);
}
assert.equal(names.size, 7);
for (const folder of [
  'policies',
  'profiles',
  'docs',
  'adapters',
  'skills',
  'templates',
]) {
  for (const file of await filesUnder(repositoryRoot, folder)) {
    if (!file.endsWith('.md')) continue;
    const text = await readFile(path.join(repositoryRoot, file), 'utf8');
    for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
      const href = match[1];
      if (!href || /^(https?:|#)/.test(href)) continue;
      const target = href.split('#')[0];
      assert.ok(target);
      await stat(path.resolve(repositoryRoot, path.dirname(file), target));
    }
  }
}
for (const file of [
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CODE_OF_CONDUCT.md',
  'CHANGELOG.md',
]) {
  const content = await readFile(path.join(repositoryRoot, file), 'utf8');
  for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
    const href = match[1];
    if (!href || /^(https?:|#)/.test(href)) continue;
    const target = href.split('#')[0];
    assert.ok(target);
    await stat(path.resolve(repositoryRoot, target));
  }
}
for (const folder of ['schemas', 'configs', '.github', 'tests/evals']) {
  for (const file of await filesUnder(repositoryRoot, folder)) {
    const content = await readFile(path.join(repositoryRoot, file), 'utf8');
    if (file.endsWith('.json')) {
      const value: unknown = JSON.parse(content);
      record(value);
    }
    if (/\.ya?ml$/.test(file)) record(parse(content));
  }
}
const rules = record(await json('standards.json'))['rules'];
assert.ok(Array.isArray(rules));
const ids = rules.map((item) => string(record(item)['id']));
assert.equal(ids.length, new Set(ids).size);
const workflows = await filesUnder(repositoryRoot, '.github/workflows');
for (const file of workflows) {
  const content = await readFile(path.join(repositoryRoot, file), 'utf8');
  record(parse(content));
  for (const match of content.matchAll(/uses:\s*([^\s]+)/g))
    assert.match(
      string(match[1]),
      /^[^@]+@[a-f0-9]{40}$/,
      'Pin each external workflow action to its verified commit',
    );
}
console.log(
  JSON.stringify({
    status: 'PASS',
    skills: names.size,
    rules: ids.length,
    schemas: 'validated',
    localLinks: 'resolved',
    workflowPins: 'validated',
  }),
);
