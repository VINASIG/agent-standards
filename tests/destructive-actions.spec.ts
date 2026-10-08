import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { inspectDestructiveActions } from '../templates/web/destructive-actions.mjs';

const css = await readFile(
  new URL('../tests/fixtures/destructive-actions.css', import.meta.url),
  'utf8',
);
const inventory = [{ selector: '#clear', count: 1 }];

for (const theme of ['light', 'dark'] as const) {
  test(`destructive action remains red and usable in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.setContent(
      `<style>:root{color-scheme:${theme};--color-error:${theme === 'light' ? '#7b1105' : '#efc2bb'};--color-surface:${theme === 'light' ? '#fcfcfc' : '#191919'};--color-error-background:${theme === 'light' ? '#f8eae8' : '#3f2926'}}body{background:var(--color-surface)}button{padding:12px;font:16px sans-serif}${css}</style><button id="clear" type="button" data-destructive-action>Clear session</button>`,
    );
    for (const state of ['default', 'hover', 'active', 'focus']) {
      if (state === 'hover') await page.locator('#clear').hover();
      if (state === 'active') await page.mouse.down();
      if (state === 'focus') {
        await page.mouse.move(0, 0);
        await page.keyboard.press('Tab');
      }
      expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual(
        [],
      );
      if (state === 'active') await page.mouse.up();
    }
    await page.locator('#clear').evaluate((node: HTMLButtonElement) => {
      node.disabled = true;
    });
    expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual(
      [],
    );
    await expect(page.locator('#clear')).toBeDisabled();
    await page.emulateMedia({ forcedColors: 'active' });
    await page.locator('#clear').evaluate((node: HTMLButtonElement) => {
      node.disabled = false;
    });
    expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual(
      [],
    );
    await page.locator('#clear').hover();
    expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual(
      [],
    );
    await page.mouse.down();
    expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual(
      [],
    );
    await page.mouse.move(0, 0);
    await page.mouse.up();
  });
}

test('filled confirmations reject blue backgrounds', async ({ page }) => {
  await page.setContent(
    `<style>:root{--color-error:#7b1105;--color-error-accent:#971607;--color-auditor-red-strong:#7b1105;--color-white:#ffffff;--color-surface:#fcfcfc;--color-error-background:#f8eae8}body{background:var(--color-surface)}button{padding:12px;font:16px sans-serif}${css}</style><button id="clear" type="button" data-destructive-action="filled">Delete draft</button>`,
  );
  expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual([]);
  await page.locator('#clear').hover();
  expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual([]);
  await page.addStyleTag({
    content:
      '#clear{background:#21497b!important;border-color:#21497b!important}',
  });
  await page.mouse.move(0, 0);
  expect(
    (await page.evaluate(inspectDestructiveActions, inventory)).map(
      (item) => item.kind,
    ),
  ).toContain('destructive-color');
});

test('reference colors remain exact when the host animates inherited colors', async ({
  page,
}) => {
  await page.setContent(
    `<style>:root{--color-error:#7b1105;--color-error-accent:#971607;--color-auditor-red-strong:#7b1105;--color-white:#fff;--color-surface:#fcfcfc;--color-error-background:#f8eae8}body{background:var(--color-surface)}button{padding:12px;font:16px sans-serif}button span{color:#7b1105!important;transition:color 1s!important}${css}</style><button id="clear" type="button" data-destructive-action="filled">Delete draft</button>`,
  );
  expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual([]);
  await page.addStyleTag({
    content:
      '#clear{background:#21497b!important;border-color:#21497b!important}',
  });
  expect(
    (await page.evaluate(inspectDestructiveActions, inventory)).map(
      (item) => item.kind,
    ),
  ).toContain('destructive-color');
});

test('color probes preserve flex hover geometry and scoped semantic roles', async ({
  page,
}) => {
  await page.setContent(
    `<!doctype html><style>:root{--color-error:#7b1105;--color-surface:#fcfcfc;--color-error-background:#f8eae8}.region{--color-error:#efc2bb;--color-surface:#191919;--color-error-background:#3f2926;background:#191919;padding:20px}button{display:flex;gap:20px;padding:12px;font:16px sans-serif}${css}</style><div class="region"><button id="clear" type="button" data-destructive-action>Clear session</button></div>`,
  );
  await page.locator('#clear').hover();
  const geometry = await page.locator('#clear').boundingBox();
  await page.mouse.move(0, 0);
  await page.locator('#clear').hover();
  expect(
    await page.locator('#clear').evaluate((node) => node.matches(':hover')),
  ).toBe(true);
  expect(await page.evaluate(inspectDestructiveActions, inventory)).toEqual([]);
  expect(await page.locator('#clear').boundingBox()).toEqual(geometry);
  expect(
    await page.locator('#clear').evaluate((node) => node.matches(':hover')),
  ).toBe(true);
});

for (const [defect, kind] of [
  ['color:#21497b;border-color:#21497b', 'destructive-color'],
  ['color:#f8eae8;border-color:#f8eae8', 'destructive-text-contrast'],
  ['opacity:0.4', 'destructive-opacity'],
] as const) {
  test(`inspector rejects ${kind} without disclosing content`, async ({
    page,
  }) => {
    await page.setContent(
      `<style>:root{--color-error:#7b1105;--color-surface:#fcfcfc}body{background:#fcfcfc}button{padding:12px;font:16px sans-serif}${css}#clear{${defect}}</style><button id="clear" type="button" data-destructive-action>Clear synthetic session</button>`,
    );
    const findings = await page.evaluate(inspectDestructiveActions, inventory);
    expect(findings.map((item) => item.kind)).toContain(kind);
    expect(JSON.stringify(findings)).not.toContain('synthetic session');
  });
}

test('missing markers, actions and unlisted additions cannot bypass the inventory', async ({
  page,
}) => {
  await page.setContent(
    '<button id="clear" type="button">Clear session</button><button data-destructive-action>Delete draft</button>',
  );
  expect(
    (await page.evaluate(inspectDestructiveActions, inventory)).map(
      (item) => item.kind,
    ),
  ).toEqual(
    expect.arrayContaining(['destructive-marker', 'destructive-undeclared']),
  );
  await page.locator('#clear').evaluate((node) => {
    node.remove();
  });
  expect(
    (await page.evaluate(inspectDestructiveActions, inventory)).map(
      (item) => item.kind,
    ),
  ).toContain('destructive-inventory');
  await expect(page.evaluate(inspectDestructiveActions, [])).rejects.toThrow(
    'Declare the destructive action inventory',
  );
});
