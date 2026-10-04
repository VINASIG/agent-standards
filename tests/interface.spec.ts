import { test, expect, type Page } from '@playwright/test';
import {
  inspectInterface,
  inspectHeaderBrand,
  inspectControlIndicators,
  inspectControlSurfaces,
} from '../templates/web/interface.mjs';

async function surfaceFixture(page: Page, css = '') {
  await page.setContent(`<!doctype html><style>
    :root { scrollbar-color: #70696a #f7f6f4; scrollbar-width:thin; }
    ::-webkit-scrollbar-thumb { background:#70696a; }
    body { font:16px sans-serif; }
    input[type=checkbox],input[type=radio],input[type=range],input[type=search],progress,meter { appearance:none; }
    input[type=checkbox],input[type=radio] { width:18px;height:18px;border:1px solid #70696a;background:white; }
    input[type=range]::-webkit-slider-runnable-track { height:6px;background:#ddd; }
    input[type=range]::-webkit-slider-thumb { appearance:none;width:18px;height:18px;background:#214f7e; }
    input[type=range]::-moz-range-track { height:6px;background:#ddd; }
    input[type=range]::-moz-range-thumb { width:18px;height:18px;background:#214f7e; }
    progress::-webkit-progress-value { background:#214f7e; }
    progress::-moz-progress-bar { background:#214f7e; }
    progress { height:10px;width:200px; }
    summary { list-style:none;padding-left:24px; }
    summary::marker { content:''; }
    summary::before { content:'';display:inline-block;width:16px;height:16px;background:black;mask:url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath d="m9 18 6-6-6-6"/%3E%3C/svg%3E'); }
    #popup { position:fixed;top:120px;left:10px;width:200px;height:100px;overflow:auto;background:white;scrollbar-color:#70696a #f7f6f4;scrollbar-width:thin; }
    .option { height:44px; }
    ${css}
  </style><label><input type="checkbox" id="check">Remember preference</label><label><input type="radio" id="radio">Choose value</label><label>Level<input type="range" id="range"></label><label>Find<input type="search" id="find"></label><progress id="progress" max="10" value="5">5</progress><details><summary id="summary">More settings</summary><p>Details</p></details><button id="trigger" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="true" aria-controls="popup">Choice</button><div id="popup" role="listbox" aria-label="Choices">${Array.from({ length: 10 }, (_, index) => `<div class="option" role="option">Value ${String(index)}</div>`).join('')}</div>`);
}

test('full control gate accepts authored parts, disclosure and scrolling popup', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await surfaceFixture(page);
  expect(await page.evaluate(inspectControlSurfaces)).toEqual([]);
  await page.screenshot({
    path: info.outputPath('authored-control-surfaces.png'),
  });
});

for (const [css, kind] of [
  ['#check { appearance:auto; }', 'control-native-surface'],
  ['#popup { left:340px; }', 'control-popup-viewport'],
  ['#popup { background:transparent; }', 'control-popup-surface'],
  [
    '#summary { list-style:disclosure-closed; } #summary::marker { content:normal; }',
    'control-disclosure-marker',
  ],
] as const)
  test(`full control gate rejects ${kind}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await surfaceFixture(page, css);
    expect(
      (await page.evaluate(inspectControlSurfaces)).map((item) => item.kind),
    ).toContain(kind);
  });

test('full control gate rejects an unstyled scrollable surface in each engine', async ({
  page,
}) => {
  await page.setContent(
    '<!doctype html><style>:root{scrollbar-color:gray white;scrollbar-width:thin}html::-webkit-scrollbar-thumb{background:gray}#list{height:100px;width:200px;overflow:auto;scrollbar-color:auto;scrollbar-width:auto}</style><div id="list"><div style="height:500px">Scrollable choices</div></div>',
  );
  expect(
    (await page.evaluate(inspectControlSurfaces)).map((item) => item.kind),
  ).toContain('control-scrollbar');
});

test('catalog examples below the fold are measured when their control is in view', async ({
  page,
}) => {
  await surfaceFixture(
    page,
    '#trigger{position:absolute;top:1200px}#popup{position:absolute;top:1240px}',
  );
  expect(await page.evaluate(inspectControlSurfaces)).toEqual([]);
  await page.locator('#trigger').scrollIntoViewIfNeeded();
  expect(await page.evaluate(inspectControlSurfaces)).toEqual([]);
  await page.locator('#popup').evaluate((element) => {
    element.style.left = '2000px';
  });
  expect(
    (await page.evaluate(inspectControlSurfaces)).map((item) => item.kind),
  ).toContain('control-popup-viewport');
});

test('appearance none alone does not certify slider tracks or thumbs', async ({
  page,
}) => {
  await page.setContent(
    '<style>html{scrollbar-color:gray white}input{appearance:none}</style><label>Level<input type="range"></label>',
  );
  expect(
    (await page.evaluate(inspectControlSurfaces)).map((item) => item.kind),
  ).toContain('control-range-part');
});

async function indicatorFixture(page: Page, style = '', direction = 'ltr') {
  await page.setContent(`<style>
    * { box-sizing: border-box; }
    .select-control { display:flex; align-items:center; justify-content:space-between; gap:12px; width:260px; min-height:48px; padding:12px; padding-inline-end:16px; border:1px solid; direction:${direction}; font:16px sans-serif; }
    [data-control-value] { min-width:0; overflow-wrap:anywhere; }
    [data-control-indicator] { flex:none; }
    ${style}
    </style><button id="choice" type="button" class="select-control" role="combobox" aria-expanded="false" aria-label="Choice"><span data-control-value>Selected value</span><svg data-control-indicator aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" /></svg></button>`);
}

test('indicator inspector accepts tokens, logical spacing, long text and initial disabled HTML', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const direction of ['ltr', 'rtl']) {
    await indicatorFixture(page, '', direction);
    expect(await page.evaluate(inspectControlIndicators)).toEqual([]);
    await page.locator('[data-control-value]').evaluate((element) => {
      element.textContent =
        'A deliberately long selected value that wraps across several lines';
    });
    await page.locator('#choice').evaluate((element) => {
      element.style.fontSize = '32px';
      element.setAttribute('disabled', '');
    });
    expect(await page.evaluate(inspectControlIndicators)).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`indicator-${direction}-enlarged.png`),
    });
  }
});

for (const inset of [0, 8, 12, 15.5])
  test(`indicator inspector rejects a ${String(inset)} px inset`, async ({
    page,
  }) => {
    await indicatorFixture(
      page,
      `.select-control { padding-inline-end:${String(inset)}px; }`,
    );
    expect(
      (await page.evaluate(inspectControlIndicators)).map(
        (finding) => finding.kind,
      ),
    ).toContain('control-indicator-inset');
  });

test('indicator inspector rejects crowded text, shrunken icons, clipping and missing markers', async ({
  page,
}) => {
  for (const [style, kind] of [
    [
      '.select-control { justify-content:flex-start; gap:4px; }',
      'control-indicator-gap',
    ],
    ['[data-control-indicator] { width:10px; }', 'control-indicator-size'],
    [
      '[data-control-indicator] { position:relative; left:30px; }',
      'control-indicator-clipping',
    ],
  ]) {
    await indicatorFixture(page, style);
    expect(
      (await page.evaluate(inspectControlIndicators)).map(
        (finding) => finding.kind,
      ),
    ).toContain(kind);
  }
  await indicatorFixture(page);
  await page.locator('[data-control-indicator]').evaluate((element) => {
    element.removeAttribute('data-control-indicator');
  });
  expect(
    (await page.evaluate(inspectControlIndicators)).map(
      (finding) => finding.kind,
    ),
  ).toContain('control-indicator-markup');
});

test('indicator inspector ignores hidden controls and compact unmarked platform specimens', async ({
  page,
}) => {
  await indicatorFixture(page, '.select-control { padding-inline-end:0; }');
  await page.locator('#choice').evaluate((element) => {
    element.setAttribute('hidden', '');
    element.style.display = 'none';
  });
  expect(await page.evaluate(inspectControlIndicators)).toEqual([]);
  await page.setContent(
    '<details><summary>Closed</summary><button class="select-control">Hidden content</button></details><button class="platform-reference">Compact platform example</button>',
  );
  expect(await page.evaluate(inspectControlIndicators)).toEqual([]);
});

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
    `<style>body{background:#f7f6f4}header{background:${surface}}a{display:inline-flex;align-items:center;min-height:44px}img{display:block;width:135px;height:auto}</style><header><a href="https://vinasig.io.vn/" aria-label="VINASIG home" data-brand-logo><img src="https://brand.test/${file}" width="540" height="140" alt="VINASIG"></a></header>`,
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

test('header logo opens the canonical VINASIG homepage by click and keyboard', async ({
  page,
}) => {
  await page.route('https://vinasig.io.vn/', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1>VINASIG home</h1>' }),
  );
  for (const activation of ['click', 'keyboard']) {
    await headerFixture(page, 'reversed.svg', '#443a3b');
    expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
    const logo = page.getByRole('link', { name: 'VINASIG home' });
    if (activation === 'click') await logo.click();
    else {
      await logo.focus();
      await page.keyboard.press('Enter');
    }
    await expect(page).toHaveURL('https://vinasig.io.vn/');
    await expect(
      page.getByRole('heading', { name: 'VINASIG home' }),
    ).toBeVisible();
  }
});

test('header inspector rejects organization, project and locale destinations', async ({
  page,
}) => {
  await headerFixture(page, 'primary-color.svg', '#f7f6f4');
  for (const href of [
    'https://github.com/VINASIG',
    'https://qr.vinasig.io.vn/',
    'https://vinasig.io.vn/vi/',
    '#main',
  ]) {
    await page.locator('[data-brand-logo]').evaluate((link, value) => {
      link.setAttribute('href', value);
    }, href);
    expect(
      (await page.evaluate(inspectHeaderBrand)).map((finding) => finding.kind),
    ).toContain('header-logo-home');
  }
  await page.locator('[data-brand-logo]').evaluate((link) => {
    link.removeAttribute('href');
  });
  expect(
    (await page.evaluate(inspectHeaderBrand)).map((finding) => finding.kind),
  ).toContain('header-logo-link');
});
