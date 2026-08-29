import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('@claim:sample-lens enters the isolated sample from the landing action', async ({ page }) => {
  const releaseUrl = 'https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases?per_page=1';
  let noteReleaseRequest: () => void = () => undefined;
  const releaseRequested = new Promise<void>((resolve) => { noteReleaseRequest = resolve; });
  let releaseResponse: () => void = () => undefined;
  const releaseGate = new Promise<void>((resolve) => { releaseResponse = resolve; });
  await page.route(releaseUrl, async (route) => {
    noteReleaseRequest();
    await releaseGate;
    try {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([{ assets: [{ name: 'Color.Signal.Lens_0.1.8_amd64.AppImage', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.8_amd64.AppImage' }] }]),
      });
    } catch {
      // The landing lookup is intentionally aborted as the demo opens.
    }
  });
  await page.goto('/');
  await releaseRequested;
  const before = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('checkout-totals.diff.png')).toBeVisible();
  const canvas = page.locator('#lens-canvas');
  await expect(canvas).toBeVisible();
  await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(984, 504, 1, 1).data.slice(0, 3)).join(','))).not.toBe('22,113,74');
  releaseResponse();
  await expect.poll(() => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => !key.startsWith('demo:'))))).toEqual(before);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect.poll(() => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => !key.startsWith('demo:'))))).toEqual(before);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/lens$/);
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => !key.startsWith('demo:'))))).toEqual(before);
});

test('@claim:demo-isolation keeps licensed real settings unchanged from the landing demo action', async ({ page }) => {
  const realPresets = JSON.stringify([{ id: 'real-1', name: 'Real preset', colour: '#16714a', mode: 'patterns', mapping: 'blue' }]);
  await page.addInitScript((presets) => {
    localStorage.setItem('sb_license:color-signal-lens', 'fixture-license');
    localStorage.setItem('sb_license_check:color-signal-lens', JSON.stringify({ checked: Date.now(), valid: true, license: 'fixture-license' }));
    localStorage.setItem('color-signal-lens:presets', presets);
  }, realPresets);
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Saved presets' })).toHaveCount(0);
  await page.getByLabel('Add a label').check();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('color-signal-lens:presets'))).toBe(realPresets);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:color-signal-lens'))).toBe('fixture-license');
  await page.goto('/?demo=1');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/lens$/);
  expect(await page.evaluate(() => localStorage.getItem('color-signal-lens:presets'))).toBe(realPresets);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:color-signal-lens'))).toBe('fixture-license');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
});

test('@claim:local-screenshots keeps screenshot data local across routes and inputs', async ({ page }) => {
  await page.addInitScript(() => {
    const track = { stop: () => undefined, getSettings: () => ({ width: 120, height: 80 }) };
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getDisplayMedia: async () => ({ getVideoTracks: () => [track] }) } });
    Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', { configurable: true, get: () => null, set: () => undefined });
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: async () => undefined });
    const original = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (source: CanvasImageSource, ...args: number[]) {
      if (source instanceof HTMLVideoElement) {
        this.fillStyle = '#16714a';
        this.fillRect(0, 0, this.canvas.width, this.canvas.height);
        return;
      }
      original.call(this, source, ...(args as [number, number]));
    };
  });
  const crossOriginRequests: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') crossOriginRequests.push(request.url()); });
  for (const path of ['/demo', '/lens', '/privacy', '/terms']) await page.goto(path);
  await page.goto('/lens');
  await page.locator('#file-input').setInputFiles({ name: 'private.png', mimeType: 'image/png', buffer: readFileSync('src-tauri/icons/icon.png') });
  await expect(page.locator('#source-status')).toHaveText('private.png');
  await page.evaluate(async () => {
    const response = await fetch('/apple-touch-icon.png');
    const data = new DataTransfer();
    data.items.add(new File([await response.blob()], 'private-paste.png', { type: 'image/png' }));
    document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }));
  });
  await expect(page.locator('#source-status')).toHaveText('Pasted screenshot');
  await page.getByRole('button', { name: 'Capture screen region' }).click();
  await page.locator('#capture-x').fill('0');
  await page.locator('#capture-y').fill('0');
  await page.locator('#capture-width').fill('60');
  await page.locator('#capture-height').fill('40');
  await page.getByRole('button', { name: 'Use selected region' }).click();
  await expect(page.locator('#source-status')).toHaveText('Selected screen region');
  const scripts = await page.locator('script[src]').evaluateAll((nodes) => nodes.map((node) => new URL((node as HTMLScriptElement).src).origin));
  expect(scripts).toEqual(['http://127.0.0.1:4173']);
  expect(crossOriginRequests.filter((url) => !url.startsWith('https://api.github.com/'))).toEqual([]);
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

    await page.getByLabel('Add a label').check();
    await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(990, 460, 1, 1).data.slice(0, 3)).join(','))).toBe('23,35,46');

    await page.getByLabel('Use blue-orange colors').check();
    await page.getByLabel('Blue', { exact: true }).check();
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

test('@claim:paste-input opens a pasted image in the workspace', async ({ page }) => {
  await page.goto('/lens');
  await page.evaluate(async () => {
    const response = await fetch('/apple-touch-icon.png');
    const blob = await response.blob();
    const data = new DataTransfer();
    data.items.add(new File([blob], 'paste.png', { type: 'image/png' }));
    document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }));
  });
  await expect(page.locator('#source-status')).toHaveText('Pasted screenshot');
});

test('@claim:keyboard-color-input applies a color entered through the color field', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Selected color').fill('#16714a');
  await page.getByRole('button', { name: 'Apply selected color' }).click();
  await expect(page.locator('#color-value')).toHaveText('#16714A');
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
  await page.getByLabel('Selected color').fill('#16714a');
  await page.getByRole('button', { name: 'Apply selected color' }).click();
  await page.getByLabel('Use blue-orange colors').check();
  await page.getByLabel('Orange', { exact: true }).check();
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

test('@claim:lens-plus-price matches the recorded Sociobot checkout contract', async ({ page }) => {
  const contract = JSON.parse(readFileSync('tests/fixtures/checkout-contract.json', 'utf8')) as { product_slug: string; product_name: string; amount_cents: number; currency: string; billing_mode: string };
  expect(contract).toMatchObject({ product_slug: 'color-signal-lens', product_name: 'Color Signal Lens Plus', amount_cents: 1200, currency: 'USD', billing_mode: 'one_time' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Save named presets for $12 once.' })).toBeVisible();
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page.getByText('Lens Plus costs $12 as a one-time purchase through the registered Sociobot checkout.')).toBeVisible();
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

test('@claim:clear-overlay restores the unmodified screenshot', async ({ page }) => {
  await page.goto('/demo');
  const canvas = page.locator('#lens-canvas');
  const bounds = await canvas.boundingBox();
  await canvas.click({ position: { x: 983 * bounds!.width / 1200, y: 503 * bounds!.height / 720 } });
  await page.getByLabel('Use blue-orange colors').check();
  await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(983, 503, 1, 1).data.slice(0, 3)).join(','))).toBe('7,90,134');
  await page.getByRole('button', { name: 'Clear overlay' }).click();
  await expect(page.getByText('The original screenshot is shown without an overlay.', { exact: true })).toBeVisible();
  await expect(page.locator('input[name="mode"]:checked')).toHaveCount(0);
  await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(983, 503, 1, 1).data.slice(0, 3)).join(','))).toBe('22,113,74');
});

test('@claim:privacy-limits keeps the source screenshot unchanged and does not capture before a user action', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { captureRequests?: number };
    state.captureRequests = 0;
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getDisplayMedia: async () => { state.captureRequests = (state.captureRequests || 0) + 1; throw new Error('unused'); } } });
  });
  await page.goto('/demo');
  const canvas = page.locator('#lens-canvas');
  const bounds = await canvas.boundingBox();
  await canvas.click({ position: { x: 983 * bounds!.width / 1200, y: 503 * bounds!.height / 720 } });
  await page.getByLabel('Use blue-orange colors').check();
  await page.getByRole('button', { name: 'Clear overlay' }).click();
  await expect.poll(() => canvas.evaluate((element) => Array.from((element as HTMLCanvasElement).getContext('2d')!.getImageData(983, 503, 1, 1).data.slice(0, 3)).join(','))).toBe('22,113,74');
  expect(await page.evaluate(() => (window as Window & { captureRequests?: number }).captureRequests)).toBe(0);
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
  await page.locator('#restore-license').click();
  await page.getByLabel('Paste your license').fill('restored-fixture');
  await page.locator('#save-license').click();
  await expect(page.locator('#license-note')).toHaveText('License is active.');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:color-signal-lens'))).toBe('restored-fixture');
});

test('@claim:release-fallback keeps a direct release link when metadata is unavailable', async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByText('Choose a download from the Releases page.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open release downloads' })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-color-signal-lens/releases');
});

test('@claim:sociobot-checkout-path keeps the registered controller purchase URL', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Buy Lens Plus' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/color-signal-lens/checkout');
});

test('@claim:desktop-download-platforms gives desktop installers only to desktop platforms', async ({ browser }) => {
  const assets = [
    { name: 'Color.Signal.Lens_0.1.7_aarch64.dmg', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.7_aarch64.dmg' },
    { name: 'Color.Signal.Lens_0.1.7_x64.dmg', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.7_x64.dmg' },
    { name: 'Color.Signal.Lens_0.1.7_x64_en-US.msi', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.7_x64_en-US.msi' },
    { name: 'Color.Signal.Lens_0.1.7_amd64.AppImage', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.7_amd64.AppImage' },
  ];
  for (const [kind, userAgent] of [
    ['Intel', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/128 Safari/537.36'],
    ['Apple Silicon', 'Mozilla/5.0 (Macintosh; ARM Mac OS X 14_0) AppleWebKit/537.36 Chrome/128 Safari/537.36'],
    ['Windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36'],
    ['Linux', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36'],
  ]) {
    const context = await browser.newContext({ userAgent });
    const page = await context.newPage();
    await page.route('https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases?per_page=1', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ assets }]) }));
    await page.goto('/');
    if (kind === 'Intel' || kind === 'Apple Silicon') {
      await expect(page.getByRole('link', { name: 'Download for Intel Mac' }), `${kind} Mac can choose the Intel installer`).toHaveAttribute('href', /_x64\.dmg$/);
      await expect(page.getByRole('link', { name: 'Download for Apple Silicon' }), `${kind} Mac can choose the Apple-Silicon installer`).toHaveAttribute('href', /_aarch64\.dmg$/);
      await expect(page.locator('#download-state')).toHaveText('Choose the macOS installer that matches your chip.');
    } else {
      await expect(page.getByRole('link', { name: `Download for ${kind}` })).toBeVisible();
      await expect(page.locator('#download-state')).toHaveText(`Download the ${kind} installer.`);
    }
    await context.close();
  }

  for (const [kind, userAgent] of [
    ['Android', 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'],
    ['iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'],
  ]) {
    const context = await browser.newContext({ userAgent });
    const page = await context.newPage();
    await page.route('https://api.github.com/repos/B-Divyesh/sf-color-signal-lens/releases?per_page=1', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ assets }]) }));
    await page.goto('/');
    await expect(page.locator('#download-state'), `${kind} gets the platform requirement instead of an installer`).toHaveText('Downloads require macOS, Windows, or Linux.');
    await expect(page.getByRole('link', { name: 'Open desktop downloads' })).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-color-signal-lens/releases');
    await expect(page.getByRole('link', { name: /Download for/ })).toHaveCount(0);
    await context.close();
  }
});

test('@claim:offline-reader keeps the free screenshot reader usable after the desktop app has loaded', async ({ page, context }) => {
  await page.goto('/demo');
  await context.setOffline(true);
  await page.getByLabel('Use blue-orange colors').check();
  await page.getByLabel('Blue', { exact: true }).check();
  await expect(page.getByText('The selected status color uses blue-orange colors.', { exact: true })).toBeVisible();
  await context.setOffline(false);
});
