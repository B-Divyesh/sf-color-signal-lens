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
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/demo');
    const canvas = page.locator('#lens-canvas');
    const bounds = await canvas.boundingBox();
    await canvas.click({ position: { x: 983 * bounds!.width / 1200, y: 503 * bounds!.height / 720 } });
    await expect(page.locator('#color-value')).toHaveText('#16714A');

    await page.getByLabel('Add a pattern').check();
    await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(984, 504, 1, 1).data.slice(0, 3)).join(','))).not.toBe('22,113,74');

    await page.getByLabel('Label the signal').check();
    await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(990, 460, 1, 1).data.slice(0, 3)).join(','))).toBe('23,35,46');

    await page.getByLabel('Remap the colour').check();
    await page.getByLabel('Blue').check();
    await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(983, 503, 1, 1).data.slice(0, 3)).join(','))).toBe('7,90,134');
  }
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

test('@claim:named-presets saves, lists, applies, renames, and deletes a persisted preset', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:color-signal-lens', 'fixture-license');
    localStorage.setItem('sb_license_check:color-signal-lens', JSON.stringify({ checked: Date.now(), valid: true, license: 'fixture-license' }));
  });
  await page.goto('/lens');
  await page.locator('#preset-name').fill('Code review');
  await page.getByRole('button', { name: 'Save preset' }).click();
  await expect(page.locator('#preset-note')).toHaveText('Code review is saved on this device.');
  await page.reload();
  await expect(page.locator('#preset-list')).toContainText('Code review');
  await page.getByLabel('Selected colour').fill('#16714a');
  await page.getByRole('button', { name: 'Apply selected colour' }).click();
  await page.getByLabel('Remap the colour').check();
  await page.getByLabel('Orange').check();
  await page.getByRole('button', { name: 'Apply Code review' }).click();
  await expect(page.locator('#color-value')).toHaveText('#9C2D20');
  await expect(page.getByLabel('Add a pattern')).toBeChecked();
  await page.getByLabel('Preset name', { exact: true }).fill('Review alerts');
  await page.getByRole('button', { name: 'Rename Code review' }).click();
  await page.reload();
  await expect(page.locator('#preset-list')).toContainText('Review alerts');
  await page.getByRole('button', { name: 'Delete Review alerts' }).click();
  await expect(page.locator('#preset-empty')).toHaveText('No presets saved yet.');
  await page.reload();
  await expect(page.getByText('Review alerts', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('color-signal-lens:presets') || '[]'))).toEqual([]);
});

test('@claim:license-entitlement rejects an invalid license on a direct workspace visit', async ({ page }) => {
  let verificationRequests = 0;
  await page.addInitScript(() => localStorage.setItem('sb_license:color-signal-lens', 'definitely-invalid'));
  await page.route('https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=definitely-invalid', async (route) => {
    verificationRequests += 1;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) });
  });
  await page.goto('/lens');
  await expect(page.locator('#preset-name')).toHaveCount(0);
  await expect(page.getByText('This license is no longer active. Buy Lens Plus to save named presets.')).toBeVisible();
  expect(verificationRequests).toBe(1);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:color-signal-lens'))).toBeNull();
});

test('@claim:lens-plus-price displays the exact one-time Lens Plus price', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Save custom lenses for $12 once.' })).toBeVisible();
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page.getByText('Lens Plus costs $12 as a one-time purchase.')).toBeVisible();
});

test('@claim:demo-reset discards the sample demo namespace', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('color-signal-lens:presets', JSON.stringify([{ id: 'real-1', name: 'Real preset' }])));
  await page.goto('/demo');
  await page.evaluate(() => localStorage.setItem('demo:color-signal-lens:started', 'changed'));
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('checkout-totals.diff.png')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('demo:color-signal-lens:started'))).toBe('1');
  expect(await page.evaluate(() => localStorage.getItem('color-signal-lens:presets'))).toBe(JSON.stringify([{ id: 'real-1', name: 'Real preset' }]));
});

test('@claim:clear-lens restores the unmodified screenshot', async ({ page }) => {
  await page.goto('/demo');
  const canvas = page.locator('#lens-canvas');
  const bounds = await canvas.boundingBox();
  await canvas.click({ position: { x: 983 * bounds!.width / 1200, y: 503 * bounds!.height / 720 } });
  await page.getByLabel('Remap the colour').check();
  await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(983, 503, 1, 1).data.slice(0, 3)).join(','))).toBe('7,90,134');
  await page.getByRole('button', { name: 'Clear lens' }).click();
  await expect(page.getByText('The original screenshot is shown without an overlay.')).toBeVisible();
  await expect(page.locator('input[name="mode"]:checked')).toHaveCount(0);
  await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(983, 503, 1, 1).data.slice(0, 3)).join(','))).toBe('22,113,74');
});

test('@claim:license-daily-cache uses a fresh verified entitlement without another request', async ({ page }) => {
  let requests = 0;
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:color-signal-lens', 'daily-fixture');
    localStorage.setItem('sb_license_check:color-signal-lens', JSON.stringify({ checked: Date.now(), valid: true, license: 'daily-fixture' }));
  });
  page.on('request', (request) => { if (request.url().includes('/verify?license=')) requests += 1; });
  await page.goto('/lens');
  await expect(page.getByRole('heading', { name: 'Saved presets' })).toBeVisible();
  expect(requests).toBe(0);
});

test('@claim:license-restore stores and verifies a pasted license', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=restored-fixture', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }) }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Have a license?' }).click();
  await page.getByLabel('Paste your license').fill('restored-fixture');
  await page.getByRole('button', { name: 'Restore license' }).click();
  await expect(page.locator('#license-note')).toHaveText('License is active.');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:color-signal-lens'))).toBe('restored-fixture');
});

test('@claim:release-fallback keeps a direct release link when metadata is unavailable', async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByText('Downloads are being published.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'See downloads' })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-color-signal-lens/releases');
});

test('@claim:sociobot-checkout-path keeps the registered controller purchase URL', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Buy Lens Plus' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/color-signal-lens/checkout');
});

test('@claim:macos-installer-architecture offers correctly labelled DMGs for Intel and Apple-Silicon Macs', async ({ browser }) => {
  const assets = [
    { name: 'Color.Signal.Lens_0.1.7_aarch64.dmg', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.7_aarch64.dmg' },
    { name: 'Color.Signal.Lens_0.1.7_x64.dmg', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.7_x64.dmg' },
  ];
  for (const [kind, userAgent] of [
    ['Intel', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/128 Safari/537.36'],
    ['Apple Silicon', 'Mozilla/5.0 (Macintosh; ARM Mac OS X 14_0) AppleWebKit/537.36 Chrome/128 Safari/537.36'],
  ]) {
    const context = await browser.newContext({ userAgent });
    const page = await context.newPage();
    await page.route('https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases?per_page=1', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ assets }]) }));
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Download for Intel Mac' }), `${kind} Mac can choose the Intel installer`).toHaveAttribute('href', /_x64\.dmg$/);
    await expect(page.getByRole('link', { name: 'Download for Apple Silicon' }), `${kind} Mac can choose the Apple-Silicon installer`).toHaveAttribute('href', /_aarch64\.dmg$/);
    await expect(page.locator('#download-state')).toHaveText('Choose the macOS installer that matches your chip.');
    await context.close();
  }
});
