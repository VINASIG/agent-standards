import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { repositoryRoot } from '../src/bundle.ts';
import { record, string } from '../src/model.ts';

export async function scoreCodex(
  root: string,
): Promise<{ status: string; cases: number; artifact: string }> {
  const response: unknown = JSON.parse(
    await readFile(path.join(root, 'response.json'), 'utf8'),
  );
  const cases = record(
    JSON.parse(
      await readFile(
        path.join(repositoryRoot, 'tests/evals/cases.json'),
        'utf8',
      ),
    ),
  );
  const schema = record(
    JSON.parse(
      await readFile(
        path.join(repositoryRoot, 'schemas/eval.schema.json'),
        'utf8',
      ),
    ),
  );
  const validate = new Ajv2020({ strict: true, allErrors: true }).compile(
    schema,
  );
  assert.ok(validate(response), JSON.stringify(validate.errors));
  const value = record(response);
  const actualSkills = value['skills'];
  assert.ok(Array.isArray(actualSkills));
  const names = await readdir(path.join(root, 'consumer/.agents/skills'));
  const catalogMatches =
    JSON.stringify(actualSkills.map(string).sort()) ===
    JSON.stringify(names.sort());
  const expected = cases['cases'];
  const actual = value['cases'];
  assert.ok(Array.isArray(expected) && Array.isArray(actual));
  const expectedIds = expected.map((e) => string(record(e)['id'])).sort();
  const actualIds = actual.map((a) => string(record(a)['id'])).sort();
  const idsMatch = JSON.stringify(expectedIds) === JSON.stringify(actualIds);
  const scored = expected.map((item) => {
    const e = record(item);
    const found: unknown = actual.find((a) => record(a)['id'] === e['id']);
    const a = found ? record(found) : {};
    return {
      id: e['id'],
      status:
        a['skill'] === e['expectedSkill'] &&
        a['decision'] === e['expectedDecision'] &&
        a['verificationStatus'] === 'NOT_RUN'
          ? 'PASS'
          : 'FAIL',
      actual: a,
      expected: e,
    };
  });
  const evidence = value['policyEvidence'];
  assert.ok(Array.isArray(evidence));
  const blocked = evidence
    .map(string)
    .some((s) => /blocked|could not|unverified|rejected/i.test(s));
  const manifestMatches =
    value['version'] === '0.1.0' && value['profile'] === 'web-static';
  const ownerPreserved =
    (await readFile(path.join(root, 'consumer/owner-work.txt'), 'utf8')) ===
    'Keep this uncommitted owner content.\n';
  const checks = [
    {
      id: 'skill-catalog',
      status: catalogMatches ? 'PASS' : 'FAIL',
      reason:
        'Fresh CLI response names compared with seven installed skills. This is catalog discovery, not skill-body execution.',
    },
    {
      id: 'policy-manifest-reading',
      status: blocked ? 'NOT_RUN' : manifestMatches ? 'PASS' : 'FAIL',
      reason: blocked
        ? 'Session reports local reads rejected by execution policy. Do not bypass it.'
        : 'Exact version/profile and reported local policy evidence',
    },
    {
      id: 'behavior-classification',
      status:
        idsMatch && scored.every((c) => c.status === 'PASS') ? 'PASS' : 'FAIL',
      reason:
        'Seven read-only scenarios, expectation data withheld from prompt; no product tasks executed',
    },
    {
      id: 'owner-work-preserved',
      status: ownerPreserved ? 'PASS' : 'FAIL',
      reason: 'Existing fixture bytes unchanged',
    },
    {
      id: 'independent-website-task',
      status: 'NOT_RUN',
      reason:
        'This integration probe is not a blind browser-agent website evaluation',
    },
  ];
  const status = checks.some((c) => c.status === 'FAIL')
    ? 'FAIL'
    : blocked
      ? 'NOT_RUN'
      : 'PASS';
  await writeFile(
    path.join(root, 'results.json'),
    JSON.stringify(
      {
        status,
        scope: cases['scope'],
        checks,
        scored,
        response,
        limitations: [
          'Ancestor/global instructions may apply',
          'One local Codex version/model/account',
          'Routing simulations do not prove real website task success',
        ],
      },
      null,
      2,
    ),
  );
  return { status, cases: scored.length, artifact: root };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = process.argv[2];
  if (!root)
    throw new Error(
      'Pass an existing local Codex evaluation artifact directory',
    );
  const result = await scoreCodex(path.resolve(root));
  console.log(JSON.stringify(result));
  if (result.status !== 'PASS') process.exitCode = 1;
}
