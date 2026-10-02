import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import { chromium } from '@playwright/test';
import { repositoryRoot } from '../src/bundle.ts';
import { record } from '../src/model.ts';
import { startPreview } from '../tests/preview.ts';

// Audits only the synthetic fixture on an owned loopback preview. No remote URL argument.
const preview = await startPreview();
const root = path.join(repositoryRoot, 'output/performance', randomUUID());
await mkdir(root, { recursive: true });
interface Run {
  profile: string;
  iteration: number;
  lcp: number;
  cls: number;
  tbt: number;
  report: string;
  settings: unknown;
}
const results: Run[] = [];
let browserVersion = '';
async function availablePort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  await new Promise<void>((resolve, reject) =>
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    }),
  );
  if (!address || typeof address === 'string') throw new Error('No debug port');
  return address.port;
}
function metric(audits: Record<string, unknown>, key: string): number {
  const value = record(audits[key])['numericValue'];
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new Error(`Missing valid metric ${key}`);
  return value;
}
function run(args: string[], log: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(repositoryRoot, 'node_modules/lighthouse/cli/index.js'),
        ...args,
      ],
      {
        cwd: repositoryRoot,
        env: { ...process.env, CHROME_PATH: chromium.executablePath() },
        windowsHide: true,
      },
    );
    const chunks: Buffer[] = [];
    child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
    child.stderr.on('data', (chunk: Buffer) => chunks.push(chunk));
    child.once('error', reject);
    child.once('exit', (code) => {
      writeFile(log, Buffer.concat(chunks))
        .then(() => {
          if (code === 0) resolve();
          else
            reject(
              new Error(`Lighthouse exit ${String(code)}; inspect ${log}`),
            );
        })
        .catch(reject);
    });
  });
}
function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const value = sorted[Math.floor(sorted.length / 2)];
  if (value === undefined) throw new Error('No measurements');
  return value;
}
try {
  for (const profile of ['mobile', 'desktop']) {
    for (let iteration = 1; iteration <= 3; iteration++) {
      const name = `${profile}-${String(iteration)}`;
      const output = path.join(root, name);
      const port = await availablePort();
      const browser = await chromium.launch({
        args: [
          `--remote-debugging-port=${String(port)}`,
          '--remote-debugging-address=127.0.0.1',
        ],
      });
      browserVersion = browser.version();
      const args = [
        preview.url + '/static/',
        '--only-categories=performance,accessibility,seo',
        '--output=json',
        '--output=html',
        `--output-path=${output}`,
        '--chrome-flags=--headless',
        '--save-assets',
        '--quiet',
        `--port=${String(port)}`,
      ];
      if (profile === 'desktop') args.push('--preset=desktop');
      try {
        await run(args, output + '.log');
      } finally {
        await browser.close();
      }
      const report = record(
        JSON.parse(await readFile(output + '.report.json', 'utf8')),
      );
      if (report['runtimeError'])
        throw new Error(JSON.stringify(report['runtimeError']));
      const audits = record(report['audits']);
      results.push({
        profile,
        iteration,
        lcp: metric(audits, 'largest-contentful-paint'),
        cls: metric(audits, 'cumulative-layout-shift'),
        tbt: metric(audits, 'total-blocking-time'),
        report: output + '.report.json',
        settings: report['configSettings'],
      });
      console.log(JSON.stringify({ completed: name }));
    }
  }
  const summaries = ['mobile', 'desktop'].map((profile) => {
    const subset = results.filter((r) => r.profile === profile);
    const lcp = median(subset.map((r) => r.lcp));
    const cls = median(subset.map((r) => r.cls));
    const tbt = median(subset.map((r) => r.tbt));
    return {
      profile,
      median: { lcp, cls, tbt },
      range: {
        lcp: subset.map((r) => r.lcp),
        cls: subset.map((r) => r.cls),
        tbt: subset.map((r) => r.tbt),
      },
      status: lcp <= 2500 && cls <= 0.1 && tbt <= 200 ? 'PASS' : 'FAIL',
    };
  });
  const status = summaries.some((s) => s.status === 'FAIL') ? 'FAIL' : 'PASS';
  await writeFile(
    path.join(root, 'results.json'),
    JSON.stringify(
      {
        status,
        url: preview.url + '/static/',
        fixture:
          'Synthetic built static HTML/CSS/JS, not a deployed VINASIG product',
        environment: {
          node: process.version,
          browserMode:
            'Playwright-managed default headless Chromium connected over loopback CDP',
          browserVersion,
          lighthouse: '13.5.0',
          cache: 'fresh profile per CLI run',
          mode: 'Lighthouse default simulated mobile and desktop presets; exact settings retained per run',
        },
        runs: results,
        summaries,
        fieldINP: 'NOT_RUN',
        repeatVisit: 'NOT_RUN',
        interactionTrace: 'NOT_RUN',
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ status, summaries, artifact: root }));
  if (status === 'FAIL') process.exitCode = 1;
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  await writeFile(
    path.join(root, 'results.json'),
    JSON.stringify(
      {
        status: 'FAIL',
        reason,
        completedRuns: results,
        expectedRuns: 6,
        missingMeasurements: 'NOT_RUN',
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ status: 'FAIL', reason, artifact: root }));
  process.exitCode = 1;
} finally {
  await preview.stop();
}
