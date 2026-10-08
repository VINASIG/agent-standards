import { test, expect } from '@playwright/test';
import {
  assertAutomatedAccessibility,
  assertNoPageOverflow,
  breakpointWidths,
  captureFullPage,
  viewports,
} from '../templates/web/responsive.mjs';

function url(route: string): string {
  const root = process.env['STANDARDS_TEST_URL'];
  if (!root) throw new Error('Local preview URL missing');
  return new URL(route, root).href;
}
const sizes = [
  ...viewports,
  ...breakpointWidths([520])
    .filter((width) => !viewports.some((v) => v.width === width))
    .map((width) => ({ width, height: 900 })),
];
for (const viewport of sizes) {
  test(`static ${String(viewport.width)}x${String(viewport.height)} controls, reflow and accessibility`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto(url('/static/'));
    await assertNoPageOverflow(page);
    await captureFullPage(page, info, 'default');
    await assertAutomatedAccessibility(page);
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Skip to content' }),
    ).toBeFocused();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Menu', exact: true }),
    ).toHaveAttribute('aria-expanded', 'true');
    await captureFullPage(page, info, 'menu-open');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
    await page.getByRole('button', { name: 'Validate locally' }).click();
    await expect(page.getByRole('alert')).toHaveText(
      'Enter a valid email address.',
    );
    await captureFullPage(page, info, 'invalid-form');
    await page.getByLabel('Email address').fill('fixture@example.invalid');
    await page.getByRole('button', { name: 'Validate locally' }).click();
    await expect(page.getByRole('status')).toHaveText(
      'Validation complete. No data was sent.',
    );
    await page.getByRole('button', { name: 'Open details' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Details', exact: true }),
    ).toBeVisible();
    const box = await page.getByRole('dialog').boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    }
    await assertAutomatedAccessibility(page);
    await captureFullPage(page, info, 'dialog-open');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Open details' }),
    ).toBeFocused();
    for (let index = 0; index < 3; index++) {
      await page.getByRole('button', { name: 'Open details' }).click();
      await page.getByRole('button', { name: 'Close details' }).click();
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await captureFullPage(page, info, 'text-200');
    await assertNoPageOverflow(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect
      .poll(() =>
        page
          .getByRole('button', { name: 'Menu', exact: true })
          .evaluate((node) => getComputedStyle(node).transitionDuration),
      )
      .toBe('0s');
    await expect(page.getByRole('contentinfo')).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test('static long heading at 320px and 200% text remains within the page', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(url('/static/'));
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
    const heading = document.querySelector('h1');
    if (!heading) throw new Error('Fixture heading missing');
    heading.textContent = 'SuperIntelligenceAgentStandards';
  });
  await captureFullPage(page, info, 'long-heading-200');
  await assertNoPageOverflow(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'SuperIntelligenceAgentStandards',
  );
});
for (const viewport of viewports) {
  test(`typed web ${String(viewport.width)}x${String(viewport.height)} compiled form flow`, async ({
    page,
  }, info) => {
    await page.setViewportSize(viewport);
    await page.goto(url('/typed/'));
    await page.getByLabel('Email address').fill('fixture@example.invalid');
    await page.getByRole('button', { name: 'Validate locally' }).click();
    await expect(page.getByRole('status')).toHaveText('Validation complete.');
    await assertNoPageOverflow(page);
    await assertAutomatedAccessibility(page);
    await captureFullPage(page, info, 'typed-success');
  });
}
test('typed validation reports invalid input locally and requires its script', async ({
  page,
}) => {
  await page.goto(url('/typed/'));
  await page.getByLabel('Email address').fill('invalid');
  await page.getByRole('button', { name: 'Validate locally' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Enter a valid email address.',
  );
  await page.route('**/typed/app.js', (route) => route.abort());
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Validate locally' }),
  ).toBeDisabled();
});

test('negative controls detect an accessible-name and page-width defect', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(url('/broken/'));
  await page.evaluate(() => {
    document.body.style.width = '1000px';
  });
  let detected = false;
  try {
    await assertNoPageOverflow(page);
  } catch {
    detected = true;
  }
  expect(detected).toBe(true);
  let axeDetected = false;
  try {
    await assertAutomatedAccessibility(page);
  } catch {
    axeDetected = true;
  }
  expect(axeDetected).toBe(true);
  await captureFullPage(page, info, 'intentional-negative-baseline');
  await page.evaluate(() => {
    document.body.style.width = 'auto';
  });
  await assertNoPageOverflow(page);
  await captureFullPage(page, info, 'width-fixed');
});
