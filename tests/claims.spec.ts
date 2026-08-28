import { expect, test } from '@playwright/test';

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
  await page.getByLabel('Label the signal').check();
  await expect(page.getByText('A text label marks the selected signal.')).toBeVisible();
  await page.getByLabel('Remap the colour').check();
  await page.getByLabel('Blue').check();
  await expect(page.getByText('The selected signal is remapped.')).toBeVisible();
});

test('@claim:demo-reset discards the sample demo namespace', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('checkout-totals.diff.png')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('demo:color-signal-lens:started'))).toBe('1');
});
