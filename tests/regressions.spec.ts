import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('real workspace deep link loads after a cold navigation', async ({ page }) => {
  await page.goto('/lens');
  await expect(page.getByRole('heading', { name: 'Inspect a screenshot signal.' })).toBeVisible();
  await expect(page.getByText('This paper layer is missing.')).toHaveCount(0);
});

test('Start for real discards the demo image and opens the reloadable workspace', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/lens$/);
  await expect(page.getByText('No screenshot is open.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Inspect a screenshot signal.' })).toBeVisible();
});

test('a corrupt image keeps the last valid image and announces recovery', async ({ page }) => {
  await page.goto('/demo');
  const before = await page.locator('#lens-canvas').evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL());
  await page.locator('#file-input').setInputFiles({ name: 'corrupt.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.locator('#source-status')).toHaveText('Could not open corrupt.png. Choose a valid PNG, JPEG, or WebP image.');
  await expect.poll(() => page.locator('#lens-canvas').evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL())).toBe(before);
});

test('@claim:capture-consent capture requires and retains a selected region without a native whole-screen command', async ({ page }) => {
  await page.addInitScript(() => {
    const track = { stop: () => { (window as Window & { captureStopped?: boolean }).captureStopped = true; }, getSettings: () => ({ width: 1200, height: 800 }) };
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getDisplayMedia: async () => ({ getVideoTracks: () => [track] }) } });
    Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', { configurable: true, get: () => null, set: () => undefined });
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: async () => undefined });
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Capture screen region' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('#capture-x').fill('100');
  await page.locator('#capture-y').fill('120');
  await page.locator('#capture-width').fill('300');
  await page.locator('#capture-height').fill('200');
  await expect(page.getByRole('button', { name: 'Use selected region' })).toBeEnabled();
  await page.getByRole('button', { name: 'Use selected region' }).click();
  await expect(page.locator('#source-status')).toHaveText('Selected screen region');
  expect(await page.evaluate(() => (window as Window & { captureStopped?: boolean }).captureStopped)).toBe(true);
});

test('landing release lookup handles an empty release list without a console error', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.route('https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases?per_page=1', (route) => route.fulfill({ contentType: 'application/json', body: '[]' }));
  await page.goto('/');
  await expect(page.getByText('Downloads are being published.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('the loaded demo remains usable offline', async ({ page, context }) => {
  await page.goto('/demo');
  await context.setOffline(true);
  await page.getByLabel('Label the signal').check();
  await expect(page.getByText('A text label marks the selected signal.')).toBeVisible();
  await context.setOffline(false);
});

test('390px navigation, demo controls, and radio rows have 44px touch targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const controls = page.locator('.topbar nav a, .demo-banner button, .controls fieldset label');
  const count = await controls.count();
  for (let index = 0; index < count; index += 1) {
    if (!await controls.nth(index).isVisible()) continue;
    const box = await controls.nth(index).boundingBox();
    expect(box, `control ${index} has a bounding box`).not.toBeNull();
    expect(Math.min(box!.width, box!.height), `control ${index} is at least 44px in both dimensions`).toBeGreaterThanOrEqual(44);
  }
});

test('hashed static assets have immutable cache headers configured', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as { routes: { route: string; headers: Record<string, string> }[] };
  expect(config.routes).toContainEqual({ route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });
});
