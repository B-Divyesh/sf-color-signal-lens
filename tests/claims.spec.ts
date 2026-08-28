import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('@claim:sample-lens loads the sample diff with a visible lens', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('checkout-totals.diff.png')).toBeVisible();
  await expect(page.locator('#lens-canvas')).toBeVisible();
});

test('@claim:local-screenshots demo sends no screenshot to another origin', async ({ page }) => {
  const crossOriginRequests: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOriginRequests.push(request.url()); });
  await page.goto('/demo');
  await page.locator('#lens-canvas').click({ position: { x: 120, y: 250 } });
  await expect(page.locator('#meaning-name')).toBeVisible();
  expect(crossOriginRequests).toEqual([]);
});

test('@claim:reading-cues applies patterns, labels, and blue remapping', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Add a pattern').check();
  await expect(page.getByText('A pattern sits over the selected signal.')).toBeVisible();
  await page.getByLabel('Label the signal').check();
  await expect(page.getByText('A text label marks the selected signal.')).toBeVisible();
  await page.getByLabel('Remap the colour').check();
  await page.getByLabel('Blue').check();
  await expect(page.getByText('The selected signal is remapped.')).toBeVisible();
});

test('@claim:screenshot-input opens a screenshot from the device', async ({ page }) => {
  await page.goto('/lens');
  await page.locator('#file-input').setInputFiles({
    name: 'review-signal.png',
    mimeType: 'image/png',
    buffer: readFileSync('src-tauri/icons/icon.png'),
  });
  await expect(page.locator('#source-status')).toHaveText('review-signal.png');
  await expect(page.locator('#canvas-empty')).toBeHidden();
});

test('@claim:named-presets saves a named preset in the local app storage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:color-signal-lens', 'fixture-license');
    localStorage.setItem('sb_license_check:color-signal-lens', JSON.stringify({ checked: Date.now(), valid: true }));
  });
  await page.goto('/lens');
  await page.locator('#preset-name').fill('Code review');
  await page.getByRole('button', { name: 'Save preset' }).click();
  await expect(page.locator('#preset-note')).toHaveText('Code review is saved on this device.');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('color-signal-lens:presets') || '[]'))).toEqual([
    expect.objectContaining({ name: 'Code review', colour: '#9c2d20', mode: 'patterns', mapping: 'blue' }),
  ]);
});

test('@claim:lens-plus-price displays the exact one-time Lens Plus price', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Save custom lenses for $12 once.' })).toBeVisible();
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page.getByText('Lens Plus costs $12 as a one-time purchase.')).toBeVisible();
});

test('@claim:demo-reset discards the sample demo namespace', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('checkout-totals.diff.png')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('demo:color-signal-lens:started'))).toBe('1');
});
