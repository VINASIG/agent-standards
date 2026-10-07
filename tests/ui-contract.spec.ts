import { test, expect, type Page } from '@playwright/test';
import { inspectUiContract } from '../templates/web/ui-contract.mjs';

const contract = {
  cards: [{ selector: '.choices', count: 2, singleRow: true }],
  icons: [{ selector: '.icon-row', count: 1, label: '.icon-label' }],
  errors: ['#count'],
  outputs: [{ selector: '.output', actions: '.actions' }],
  rows: [{ selector: '.row', members: '.row-label, .row-buttons', count: 2 }],
  progress: ['#progress'],
};

async function fixture(page: Page, defect = '') {
  await page.setContent(`<!doctype html><html lang="en"><head><title>Interface acceptance fixture</title><style>
  * { box-sizing:border-box; }
  body { font:16px/1.5 sans-serif; background:#f7f6f4; margin:24px; }
  .choices { display:flex;gap:12px;margin-bottom:24px; }
  [data-choice-card] { position:relative;display:flex;align-items:center;width:130px;min-height:48px;padding:12px;border:1px solid #777;background:white; }
  [data-choice-card]:has(:checked) { border-color:#214f7e;background:#e9eff5; }
  [data-choice-card]:has(:focus-visible) { outline:3px solid #214f7e;outline-offset:4px; }
  [data-choice-card] input { position:absolute;inset:0;width:100%;height:100%;opacity:0;margin:0; }
  .icon-row { display:flex;align-items:center;gap:8px; }
  .icon-row svg { width:20px;height:20px; }
  #count { display:block;width:200px;height:44px; }
  .field-error { margin:8px 0 16px;color:#a00; }
  .output { width:300px;padding:16px;background:white;border:1px solid #777; }
  textarea { display:block;width:100%;height:24px;padding:0;border:0;font:16px/24px monospace;resize:none; }
  .actions { margin-top:12px; }
  button { min-height:44px; }
  .row { display:flex;align-items:center;gap:12px;margin:16px 0; }
  .row-buttons { display:flex;gap:8px; }
  progress { appearance:none;width:300px;height:8px;border:0;background:#bbb;color:#214f7e; }
  progress::-webkit-progress-bar { background:#bbb; }
  progress::-webkit-progress-value { background:#214f7e; }
  progress::-moz-progress-bar { background:#214f7e; }
  @media (forced-colors:active) { [data-choice-card]:has(:checked) { outline:2px solid Highlight; } }
  ${defect}
  </style></head><body>
  <fieldset><legend>Mode</legend><div class="choices"><label data-choice-card><input type="radio" name="mode" value="first" checked><span class="icon-row"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"/></svg><span class="icon-label">First</span></span></label><label data-choice-card><input type="radio" name="mode" value="second"><span>Second</span></label></div></fieldset>
  <label for="count">Count</label><input id="count" aria-invalid="true" aria-describedby="count-error"><p id="count-error" class="field-error" role="status">Enter a whole number.</p>
  <div class="output"><label for="result">Fixture result</label><textarea id="result" rows="1" readonly>synthetic</textarea></div><div class="actions"><button type="button">Copy fixture</button></div>
  <div class="row"><span class="row-label">Set a target</span><div class="row-buttons"><button type="button">80 bits</button><button type="button">128 bits</button></div></div>
  <progress id="progress" max="60" value="30" aria-label="Countdown"></progress>
  </body></html>`);
}

test('declared card, error, output, row, icon and progress contract passes', async ({
  page,
}, info) => {
  await fixture(page);
  expect(await page.evaluate(inspectUiContract, contract)).toEqual([]);
  await page.locator('[value="first"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[value="second"]')).toBeChecked();
  await expect(page.locator('[value="second"]')).toBeFocused();
  expect(await page.evaluate(inspectUiContract, contract)).toEqual([]);
  await page.screenshot({
    path: info.outputPath('ui-contract-reviewed-fixture.png'),
    fullPage: true,
  });
  await page.emulateMedia({ forcedColors: 'active' });
  expect(await page.evaluate(inspectUiContract, contract)).toEqual([]);
});

for (const [css, kind] of [
  ['.choices { gap:0; }', 'ui-card-gap'],
  ['[data-choice-card] input { opacity:1; }', 'ui-card-marker'],
  [
    '[data-choice-card]:has(:checked) { background:white;border-color:#777; }',
    'ui-card-selection',
  ],
  ['[data-choice-card] input { display:none; }', 'ui-card-semantics'],
  ['.icon-label { transform:translateY(6px); }', 'ui-icon-alignment'],
  ['#count-error { margin-top:160px; }', 'ui-field-error-position'],
  ['.actions { margin-top:72px; }', 'ui-output-actions'],
  ['.row { align-items:flex-start; }', 'ui-row-alignment'],
  ['progress { background:#f7f6f4; }', 'ui-progress-track'],
] as const) {
  test(`acceptance gate rejects ${kind}`, async ({ page }) => {
    await fixture(page, css);
    expect(
      (await page.evaluate(inspectUiContract, contract)).map(
        (finding) => finding.kind,
      ),
    ).toContain(kind);
  });
}

test('acceptance gate rejects detached descriptions and clipped output without returning values', async ({
  page,
}) => {
  await fixture(page);
  await page.locator('#count').evaluate((node) => {
    node.removeAttribute('aria-describedby');
  });
  await page.locator('#result').evaluate((node: HTMLTextAreaElement) => {
    node.value = 'synthetic-only-'.repeat(50);
  });
  const findings = await page.evaluate(inspectUiContract, contract);
  expect(findings.map((finding) => finding.kind)).toContain(
    'ui-field-error-link',
  );
  expect(findings.map((finding) => finding.kind)).toContain('ui-output-fit');
  expect(JSON.stringify(findings)).not.toContain('synthetic-only');
});

test('deleting a declared element or changing its inventory cannot bypass the contract', async ({
  page,
}) => {
  await fixture(page);
  await page.locator('.icon-row svg').evaluate((node) => {
    node.remove();
  });
  expect(
    (await page.evaluate(inspectUiContract, contract)).map(
      (finding) => finding.kind,
    ),
  ).toContain('ui-icon-inventory');
  const altered = { ...contract, cards: [{ selector: '.choices', count: 3 }] };
  expect(
    (await page.evaluate(inspectUiContract, altered)).map(
      (finding) => finding.kind,
    ),
  ).toContain('ui-card-inventory');
  await expect(page.evaluate(inspectUiContract, {})).rejects.toThrow(
    'Declare the UI acceptance inventory',
  );
});
