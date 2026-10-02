import { parseArgs } from 'node:util';
import {
  doctor,
  execute,
  planInstall,
  planRollback,
  planUninstall,
} from './installer.ts';
import { digest, profile, string } from './model.ts';

const help = `VINASIG SI Agent Standards
Usage: node dist/cli.js COMMAND --target DIRECTORY [options]
Commands: init (install), update, doctor (check), diff, uninstall, rollback
init/update/diff: --bundle DIRECTORY --sha256 APPROVED_DIGEST --profile core|web-static|web-typescript
rollback: --backup ID from an earlier operation
All mutations support --dry-run. --json prints machine-readable results.
Exit codes: 0 successful check/operation; 1 check failure; 2 conflict or invalid input.
No command installs project dependencies, changes global Codex/MCP config, commits or connects to production.
`;
try {
  const args = parseArgs({
    allowPositionals: true,
    options: {
      target: { type: 'string' },
      bundle: { type: 'string' },
      sha256: { type: 'string' },
      profile: { type: 'string' },
      backup: { type: 'string' },
      'dry-run': { type: 'boolean' },
      json: { type: 'boolean' },
      help: { type: 'boolean' },
    },
  });
  const command = args.positionals[0];
  if (args.values.help || !command || command === 'help') {
    console.log(help);
  } else {
    if (args.positionals.length !== 1)
      throw new Error('Unexpected positional argument');
    const target = string(args.values.target);
    let result: unknown;
    if (command === 'doctor' || command === 'check') {
      const checks = await doctor(target);
      result = { command, checks };
      process.exitCode = checks.some((c) => c.status === 'FAIL') ? 1 : 0;
    } else {
      let plan;
      if (
        command === 'init' ||
        command === 'install' ||
        command === 'update' ||
        command === 'diff'
      )
        plan = await planInstall(
          target,
          string(args.values.bundle),
          digest(args.values.sha256),
          profile(args.values.profile),
          command === 'update' || command === 'diff',
        );
      else if (command === 'uninstall') plan = await planUninstall(target);
      else if (command === 'rollback')
        plan = await planRollback(target, string(args.values.backup));
      else throw new Error('Unknown command');
      const dry = command === 'diff' || (args.values['dry-run'] ?? false);
      result = {
        command,
        dryRun: dry,
        ...(await execute(target, plan, dry)),
        diff: plan.changes.map((c) => ({
          path: c.path,
          before: c.before === null ? null : decodeText(c.before),
          after: c.after === null ? null : decodeText(c.after),
        })),
        instructionDiff: { before: plan.oldBlock, after: plan.newBlock },
      };
    }
    console.log(JSON.stringify(result, null, args.values.json ? undefined : 2));
  }
} catch (error) {
  console.error(
    JSON.stringify({
      status: 'FAIL',
      error: error instanceof Error ? error.message : String(error),
    }),
  );
  process.exitCode = 2;
}

function decodeText(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf8');
}
