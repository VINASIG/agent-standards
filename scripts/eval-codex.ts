import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createBundle, repositoryRoot } from '../src/bundle.ts';
import { execute, planInstall } from '../src/installer.ts';
import { record } from '../src/model.ts';
import { scoreCodex } from './score-codex.ts';

const cli = process.env['VINASIG_CODEX_EXE'];
if (!cli)
  throw new Error(
    'Set VINASIG_CODEX_EXE to a verified existing Codex executable. No global setup is performed.',
  );
const root = path.join(repositoryRoot, 'output/codex', randomUUID());
const target = path.join(root, 'consumer');
await mkdir(target, { recursive: true });
await writeFile(
  path.join(target, 'AGENTS.md'),
  '# Owner fixture\nDo not edit files or perform external actions in this read-only evaluation.\n',
);
await writeFile(
  path.join(target, 'owner-work.txt'),
  'Keep this uncommitted owner content.\n',
);
const bundle = await createBundle(
  repositoryRoot,
  path.join(root, 'bundle'),
  '0.1.0',
);
await execute(
  target,
  await planInstall(target, bundle.path, bundle.sha256, 'web-static'),
);
const cases = record(
  JSON.parse(
    await readFile(path.join(repositoryRoot, 'tests/evals/cases.json'), 'utf8'),
  ),
);
const inputs = cases['cases'];
assert.ok(Array.isArray(inputs));
const prompts = inputs.map((item) => {
  const c = record(item);
  return { id: c['id'], input: c['input'] };
});
const prompt = `This is an authorized, read-only Codex integration smoke test and a small policy-routing evaluation. Your working directory is a temporary consumer. Read its AGENTS.md, manifest and task-relevant installed local policies/skills. Report the version/profile and the VINASIG skills actually available in this session. List concrete local paths used as policyEvidence. Do not edit any files, create commits, publish, browse the Internet or execute the simulated tasks. For each case, select one primary skill and return its decision, with a short reason based on the policy you read. verificationStatus must be NOT_RUN because these are simulations, not completed product checks. Available decision labels are use-task-skill, preserve-scope, preserve-user-work, verify-current-source, report-blocker, keep-quality-gate and report-unverified. Cases: ${JSON.stringify(prompts)}`;
// The fixture is not a separate Git checkout. skip-git-repo-check is explicit;
// ancestor instructions may apply and are reported as an evaluation limitation.
await writeFile(path.join(root, 'prompt.txt'), prompt);
const resultPath = path.join(root, 'response.json');
const schemaPath = path.join(repositoryRoot, 'schemas/eval.schema.json');
const args = [
  'exec',
  '--ephemeral',
  '--sandbox',
  'read-only',
  '--ignore-user-config',
  '--skip-git-repo-check',
  '--json',
  '-C',
  target,
  '--output-schema',
  schemaPath,
  '--output-last-message',
  resultPath,
  '-',
];
await writeFile(
  path.join(root, 'invocation.json'),
  JSON.stringify(
    {
      executable: cli,
      args,
      bundle,
      limitations: [
        'Ancestor repository/global instructions may apply',
        'Classifications are read-only simulations',
        'Not an independent blind website task',
        'One local Codex version/model/account only',
      ],
    },
    null,
    2,
  ),
);
const outcome = await new Promise<{
  code: number | null;
  stdout: string;
  stderr: string;
}>((resolve, reject) => {
  const child = spawn(cli, args, { cwd: target, windowsHide: true });
  const stdout: Buffer[] = [];
  const stderr: Buffer[] = [];
  child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk));
  child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk));
  child.once('error', reject);
  child.once('exit', (code) => {
    resolve({
      code,
      stdout: Buffer.concat(stdout).toString(),
      stderr: Buffer.concat(stderr).toString(),
    });
  });
  child.stdin.end(prompt);
});
await writeFile(path.join(root, 'events.jsonl'), outcome.stdout);
await writeFile(path.join(root, 'stderr.log'), outcome.stderr);
if (outcome.code !== 0) {
  await writeFile(
    path.join(root, 'results.json'),
    JSON.stringify(
      {
        status: 'NOT_RUN',
        reason: 'Codex did not complete; inspect stderr and events',
        exitCode: outcome.code,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      status: 'NOT_RUN',
      artifact: root,
      exitCode: outcome.code,
    }),
  );
  process.exitCode = 1;
} else {
  const result = await scoreCodex(root);
  console.log(JSON.stringify(result));
  if (result.status !== 'PASS') process.exitCode = 1;
}
