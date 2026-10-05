import { test, expect, type Page } from '@playwright/test';
import { inspectSiteChrome } from '../templates/web/site-chrome.mjs';

async function fixture(page: Page, locale: 'vi' | 'en', dark: boolean) {
  // Synthetic geometry fixture. It does not reproduce VINASIG artwork.
  const origin = process.env['STANDARDS_TEST_URL'];
  if (!origin) throw new Error('Missing fixture preview');
  await page.goto(origin + '/static/');
  await page.setContent(`<html lang="${locale}"><style>
    body { margin:16px; font:16px sans-serif; color:${dark ? '#fff' : '#222'}; background:${dark ? '#222' : '#fff'}; }
    header { display:flex;align-items:center;justify-content:space-between; }
    [data-brand-logo] { display:flex;align-items:center;min-height:44px; }
    img { display:block;width:132px;height:auto; }
    .site-preferences { display:flex;gap:4px; }
    .site-preferences button,.site-preferences a { box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:44px;height:44px; }
    footer { margin-top:32px;border-top:1px solid;padding:16px 0; }
    footer a { display:inline-flex;align-items:center;min-height:44px;margin-right:12px; }
  </style><header data-site-header>
    <a data-brand-logo href="https://vinasig.io.vn/" aria-label="VINASIG homepage"><img alt="Synthetic geometry placeholder" width="540" height="140" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='540' height='140'/%3E"></a>
    <div class="site-preferences"><button data-theme-toggle type="button" aria-label="Change appearance">T</button><a class="language-switch" href="/">${locale === 'vi' ? 'EN' : 'VI'}</a></div>
  </header><main><h1>Geometry fixture</h1></main><footer data-site-footer>
    <a href="https://vinasig.io.vn/">VINASIG</a>
    <a href="https://github.com/VINASIG/example/tree/reviewed">${locale === 'vi' ? 'Mã nguồn' : 'Source code'}</a>
    <a href="https://github.com/VINASIG/example/issues">${locale === 'vi' ? 'Báo lỗi' : 'Report an issue'}</a>
    <a href="/licenses/">${locale === 'vi' ? 'Giấy phép' : 'Licenses'}</a>
  </footer></html>`);
}

test('shared chrome accepts localized light/dark geometry and native links', async ({
  page,
}, info) => {
  for (const locale of ['vi', 'en'] as const) {
    for (const dark of [false, true]) {
      for (const width of [320, 360, 390, 759, 760, 761, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 800 });
        await fixture(page, locale, dark);
        expect(await page.evaluate(inspectSiteChrome)).toEqual([]);
      }
      await page.screenshot({
        path: info.outputPath(`${locale}-${dark ? 'dark' : 'light'}.png`),
      });
    }
  }
});

test('shared chrome rejects omitted elements, layout drift and wrong destinations', async ({
  page,
}) => {
  const defects = [
    ['chrome-header-count', 'document.querySelector("header")?.remove()'],
    ['chrome-footer-count', 'document.querySelector("footer")?.remove()'],
    ['chrome-logo-size', 'document.querySelector("img").style.width="164px"'],
    [
      'chrome-preferences',
      'document.querySelector(".site-preferences")?.remove()',
    ],
    [
      'chrome-preference-order',
      'document.querySelector(".language-switch").className="wrong"',
    ],
    ['chrome-target', 'document.querySelector("button").style.height="20px"'],
    [
      'chrome-preference-gap',
      'document.querySelector(".site-preferences").style.gap="20px"',
    ],
    [
      'chrome-identity-row',
      'document.querySelector(".site-preferences").style.transform="translateY(48px)"',
    ],
    [
      'chrome-footer-links',
      'document.querySelector("footer a:last-child")?.remove()',
    ],
    [
      'chrome-footer-home',
      'document.querySelector("footer a").href="https://github.com/VINASIG"',
    ],
    [
      'chrome-footer-source',
      'document.querySelectorAll("footer a")[1].href="https://example.com/"',
    ],
    [
      'chrome-footer-issues',
      'document.querySelectorAll("footer a")[2].href="https://github.com/VINASIG/other/issues"',
    ],
    [
      'chrome-footer-license',
      'document.querySelectorAll("footer a")[3].textContent="Wrong"',
    ],
    [
      'chrome-footer-target',
      'document.querySelectorAll("footer a")[3].style.minHeight="20px"',
    ],
  ] as const;
  for (const [kind, change] of defects) {
    await fixture(page, 'en', false);
    await page.evaluate(change);
    expect(
      (await page.evaluate(inspectSiteChrome)).map((finding) => finding.kind),
    ).toContain(kind);
  }
});
