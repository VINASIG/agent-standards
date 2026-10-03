import { test, expect } from '@playwright/test';
import { inspectInterface } from '../templates/web/interface.mjs';

test('copy inspector rejects punctuation, uppercase, bullets and platform popups', async ({
  page,
}) => {
  await page.setContent(
    '<h1>YOUR WORKSPACE</h1><p>Status: ready; waiting — next / later (optional)</p><ul><li>Round marker</li></ul><label>Choice<select><option>One</option></select></label><label>Date<input type="date"></label><label>Color<input type="color"></label><label>Range<input type="range"></label>',
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
