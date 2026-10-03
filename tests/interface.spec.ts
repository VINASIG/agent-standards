import { test, expect, type Page } from '@playwright/test';
import {
  inspectInterface,
  inspectHeaderBrand,
} from '../templates/web/interface.mjs';

test('copy inspector rejects punctuation, uppercase, bullets and platform popups', async ({
  page,
}) => {
  await page.setContent(
    '<h1>YOUR WORKSPACE</h1><p>Status: ready; waiting — next / later (optional)</p><p>• Round bullet</p><ul><li>Round marker</li></ul><label>Choice<select><option>One</option></select></label><label>Date<input type="date"></label><label>Color<input type="color"></label><label>Range<input type="range"></label>',
  );
  const kinds = (await page.evaluate(inspectInterface)).map(
    (finding) => finding.kind,
  );
  for (const kind of [
    'all-caps-copy',
    'label-colon',
    'semicolon',
    'long-dash',
    'slash-separator',
    'parenthetical-copy',
    'default-list-marker',
    'round-bullet',
    'platform-popup',
    'platform-slider',
  ])
    expect(kinds).toContain(kind);
});

test('notation exceptions cannot mute a page or omit a reason', async ({
  page,
}) => {
  await page.setContent(
    '<main data-copy-notation="Entire page"><p>Status: ready; next — later</p></main><span data-copy-notation="">Unexplained</span>',
  );
  const findings = await page.evaluate(inspectInterface);
  expect(
    findings.filter((finding) => finding.kind === 'invalid-notation-exception'),
  ).toHaveLength(2);
});

test('copy inspector preserves required syntax and user-controlled output', async ({
  page,
}) => {
  await page.setContent(
    '<h1>QR Generator</h1><p>Download PNG or SVG.</p><p>BMI</p><p>2.4 MB</p><p>#0A6CFF</p><p>Meet at 09:30.</p><a href="https://example.com">https://example.com</a><code>WIFI:T:WPA;S:Network;</code><p data-user-content>USER: input; untouched — example (note)</p><ul style="list-style:none"><li>Custom row</li></ul><p data-copy-notation="Verbatim legal citation">Article 10(3)</p>',
  );
  expect(await page.evaluate(inspectInterface)).toEqual([]);
});

test('a hidden attribute cannot hide a control from inspection when CSS exposes it', async ({
  page,
}) => {
  await page.setContent(
    '<p hidden>HIDDEN COPY</p><p hidden style="display:block">VISIBLE COPY</p><select hidden style="display:block"><option>One</option></select>',
  );
  const findings = await page.evaluate(inspectInterface);
  expect(findings).toContainEqual({
    kind: 'all-caps-copy',
    text: 'VISIBLE COPY',
    element: 'p',
  });
  expect(findings).toContainEqual({
    kind: 'platform-popup',
    text: 'select',
    element: 'select',
  });
  expect(findings.some((finding) => finding.text === 'HIDDEN COPY')).toBe(
    false,
  );
});

async function headerFixture(page: Page, file: string, surface: string) {
  // Deliberately synthetic geometry exercises the gate, not VINASIG artwork.
  await page.route('https://brand.test/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 540 140"><rect width="540" height="140" fill="#21497b"/></svg>',
    }),
  );
  await page.setContent(
    `<style>body{background:#f7f6f4}header{background:${surface}}a{display:inline-flex;align-items:center;min-height:44px}img{display:block;width:135px;height:auto}</style><header><a href="https://brand.test/" data-brand-logo><img src="https://brand.test/${file}" width="540" height="140" alt="VINASIG"></a></header>`,
  );
  await page.locator('img').evaluate((image) => {
    if (!(image instanceof HTMLImageElement))
      throw new Error('The header fixture must contain an image');
    return image.decode();
  });
  await page.screenshot({
    path: test.info().outputPath(`header-${file}-${surface}.png`),
  });
}

test('header variant follows the actual surface including a light-only site', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await headerFixture(page, 'primary-color.svg', '#f7f6f4');
  expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
  await page.emulateMedia({ colorScheme: 'light' });
  await headerFixture(page, 'reversed.svg', '#443a3b');
  expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
  await page.locator('[data-brand-logo]').focus();
  expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
});

test('header inspector rejects padded cards, altered artwork and distortion', async ({
  page,
}) => {
  await headerFixture(page, 'primary-color.svg', '#f7f6f4');
  await page.locator('[data-brand-logo]').evaluate((link) => {
    link.setAttribute(
      'style',
      'background:white;padding:8px;border-radius:8px',
    );
  });
  await page.locator('img').evaluate((image) => {
    image.style.cssText =
      'width:100px;height:100px;border-radius:8px;filter:invert(1)';
    image.setAttribute('width', '100');
    image.setAttribute('height', '100');
  });
  const kinds = (await page.evaluate(inspectHeaderBrand)).map(
    (finding) => finding.kind,
  );
  for (const kind of [
    'header-logo-background',
    'header-logo-frame',
    'header-logo-crop',
    'header-logo-effect',
    'header-logo-ratio',
    'header-logo-intrinsic-ratio',
  ])
    expect(kinds).toContain(kind);
});

test('header inspector rejects a mismatched variant or missing artwork', async ({
  page,
}) => {
  await headerFixture(page, 'primary-color.svg', '#443a3b');
  expect(
    (await page.evaluate(inspectHeaderBrand)).map((finding) => finding.kind),
  ).toContain('header-logo-variant');
  await page.locator('img').evaluate((image) => {
    image.remove();
  });
  expect(
    (await page.evaluate(inspectHeaderBrand)).map((finding) => finding.kind),
  ).toContain('header-logo-image');
  await page.setContent('<h1>A fixture without a brand link</h1>');
  expect(
    (await page.evaluate(inspectHeaderBrand)).map((finding) => finding.kind),
  ).toContain('header-logo-count');
});
