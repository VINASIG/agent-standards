import { defineConfig } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { repositoryRoot } from '../src/bundle.ts';

const run = process.env['VINASIG_RESPONSIVE_RUN'] ?? randomUUID();
process.env['VINASIG_RESPONSIVE_RUN'] = run;
const output = path.join(repositoryRoot, 'output/responsive', run);
export default defineConfig({
  testDir: '.',
  testMatch: ['web.spec.ts', 'interface.spec.ts'],
  globalSetup: './preview.ts',
  fullyParallel: true,
  workers: 3,
  retries: 0,
  timeout: 30000,
  outputDir: path.join(output, 'screenshots'),
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(output, 'results.json') }],
  ],
  use: { trace: 'retain-on-failure', video: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
