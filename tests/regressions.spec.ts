import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('real workspace deep link loads after a cold navigation', async ({ page }) => {
  await page.goto('/lens');
  await expect(page.getByRole('heading', { name: 'Inspect a screenshot status color.' })).toBeVisible();
  await expect(page.getByText('Page not found')).toHaveCount(0);
});

test('a valid verdict cached for another token cannot unlock Lens Plus', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:color-signal-lens', 'replacement-invalid');
    localStorage.setItem('sb_license_check:color-signal-lens', JSON.stringify({ checked: Date.now(), valid: true, license: 'different-license' }));
  });
  await page.route('https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=replacement-invalid', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ valid: false, reason: 'invalid' }),
  }));
  await page.goto('/lens');
  await expect(page.locator('#preset-name')).toHaveCount(0);
  await expect(page.getByText('This license is no longer active. Buy Lens Plus to save named presets.')).toBeVisible();
});

test('an uncached active license unlocks Lens Plus only after verification', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb_license:color-signal-lens', 'active-fixture'));
  await page.route('https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=active-fixture', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok' }),
  }));
  await page.goto('/lens');
  await expect(page.locator('#preset-name')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_check:color-signal-lens') || 'null'))).toEqual(
    expect.objectContaining({ valid: true, license: 'active-fixture' }),
  );
});

test('Start for real discards the demo image and opens the reloadable workspace', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/lens$/);
  await expect(page.getByText('No screenshot is open.')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Inspect a screenshot status color.' })).toBeVisible();
});

test('a corrupt image keeps the last valid image and announces recovery', async ({ page }) => {
  await page.goto('/demo');
  const before = await page.locator('#lens-canvas').evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL());
  await page.locator('#file-input').setInputFiles({ name: 'corrupt.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.locator('#source-status')).toHaveText('Could not open corrupt.png. Choose a valid PNG, JPEG, or WebP image.');
  await expect.poll(() => page.locator('#lens-canvas').evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL())).toBe(before);
});

test('every route has its own title, metadata, landmarks, and legal links', async ({ page }) => {
  const routes = [
    ['/', 'Color Signal Lens — Make status colors distinct', 'https://color-signal-lens.sociobot.in/'],
    ['/demo', 'Demo — Color Signal Lens', 'https://color-signal-lens.sociobot.in/demo'],
    ['/?demo=1', 'Demo — Color Signal Lens', 'https://color-signal-lens.sociobot.in/demo'],
    ['/lens', 'Color Signal Lens — Inspect screenshot colors', 'https://color-signal-lens.sociobot.in/lens'],
    ['/privacy', 'Privacy — Color Signal Lens', 'https://color-signal-lens.sociobot.in/privacy'],
    ['/terms', 'Terms — Color Signal Lens', 'https://color-signal-lens.sociobot.in/terms'],
  ] as const;
  for (const [path, title, canonical] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://color-signal-lens.sociobot.in/social-card.png');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://color-signal-lens.sociobot.in/social-card.png');
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms');
  }
});

test('the app 404 has plain recovery copy, metadata, and the shared legal footer', async ({ page }) => {
  await page.goto('/missing-review-route');
  await expect(page).toHaveTitle('Page not found — Color Signal Lens');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://color-signal-lens.sociobot.in/404.html');
  await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toBeVisible();
  await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toBeVisible();
});

test('@claim:capture-consent capture requires and retains a selected region without a native whole-screen command', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { captureStopped?: boolean; captureRequests?: number };
    state.captureRequests = 0;
    const track = { stop: () => { state.captureStopped = true; }, getSettings: () => ({ width: 120, height: 80 }) };
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getDisplayMedia: async () => { state.captureRequests = (state.captureRequests || 0) + 1; return { getVideoTracks: () => [track] }; } } });
    Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', { configurable: true, get: () => null, set: () => undefined });
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: async () => undefined });
    const original = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (source: CanvasImageSource, ...args: number[]) {
      if (source instanceof HTMLVideoElement) {
        const sourceX = args.length === 8 ? args[0] : 0;
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.fillStyle = sourceX >= 60 ? '#16714a' : '#9c2d20';
        this.fillRect(0, 0, width, height);
        if (args.length !== 8) { this.fillStyle = '#16714a'; this.fillRect(width / 2, 0, width / 2, height); }
        return;
      }
      original.call(this, source, ...(args as [number, number]));
    };
  });
  await page.goto('/demo');
  expect(await page.evaluate(() => (window as Window & { captureRequests?: number }).captureRequests)).toBe(0);
  await page.getByRole('button', { name: 'Capture screen region' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { captureRequests?: number }).captureRequests)).toBe(1);
  await page.locator('#capture-x').fill('60');
  await page.locator('#capture-y').fill('0');
  await page.locator('#capture-width').fill('60');
  await page.locator('#capture-height').fill('80');
  await expect(page.getByRole('button', { name: 'Use selected region' })).toBeEnabled();
  await page.getByRole('button', { name: 'Use selected region' }).click();
  await expect(page.locator('#source-status')).toHaveText('Selected screen region');
  expect(await page.evaluate(() => (window as Window & { captureStopped?: boolean }).captureStopped)).toBe(true);
  await expect.poll(() => page.locator('#lens-canvas').evaluate((canvas) => ({ width: (canvas as HTMLCanvasElement).width, height: (canvas as HTMLCanvasElement).height, pixel: Array.from((canvas as HTMLCanvasElement).getContext('2d')!.getImageData(30, 40, 1, 1).data.slice(0, 3)).join(',') }))).toEqual({ width: 60, height: 80, pixel: '22,113,74' });
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
  await page.getByLabel('Add a label').check();
  await expect(page.getByText('A text label marks the selected status color.', { exact: true })).toBeVisible();
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

test('390px mobile download state and workspace stay within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('https://api.github.com/**', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ assets: [{ name: 'Color.Signal.Lens_0.1.7_amd64.AppImage', browser_download_url: 'https://example.test/Color.Signal.Lens_0.1.7_amd64.AppImage' }] }]) }));
  await page.goto('/');
  await expect(page.locator('#download-button')).toContainText('Download for Linux');
  await expect(page.locator('#download-state')).toHaveText('Download the Linux installer.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.goto('/demo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('390px demo shows the sample result and active cue before scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  const canvas = await page.locator('#lens-canvas').boundingBox();
  const cue = await page.locator('#demo-active-cue').boundingBox();
  expect(canvas).not.toBeNull();
  expect(cue).not.toBeNull();
  expect(canvas!.y).toBeLessThan(844);
  expect(cue!.y + cue!.height).toBeLessThanOrEqual(844);
  await expect(page.getByRole('button', { name: 'Load sample screenshot' })).toHaveCount(0);
});

test('How it works reaches and announces its section through keyboard, Back, and a direct hash link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const link = page.getByRole('link', { name: 'How it works' });
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/#how$/);
  await expect.poll(() => page.evaluate(() => document.querySelector('#how')!.getBoundingClientRect().top)).toBeLessThan(80);
  await expect(page.getByRole('heading', { name: 'How Color Signal Lens works' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('How Color Signal Lens works');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Make status colors distinct.' })).toBeFocused();
  await page.goto('/#how');
  await expect.poll(() => page.evaluate(() => document.querySelector('#how')!.getBoundingClientRect().top)).toBeLessThan(80);
  await expect(page.getByRole('heading', { name: 'How Color Signal Lens works' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('How Color Signal Lens works');
});

test('How it works renders, focuses, and announces the landing section from another route', async ({ page }) => {
  await page.goto('/privacy');
  await page.getByRole('link', { name: 'How it works' }).click();
  await expect(page).toHaveURL(/\/#how$/);
  await expect(page.getByRole('heading', { name: 'How Color Signal Lens works' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('How Color Signal Lens works');
  await expect.poll(() => page.evaluate(() => document.querySelector('#how')!.getBoundingClientRect().top)).toBeLessThan(80);
});

test('capture failures explain the fallback without exposing platform errors', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getDisplayMedia: async () => { throw new Error('Invalid constraint'); } } }));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Capture screen region' }).click();
  await expect(page.locator('#source-status')).toHaveText('Screen capture did not start. Check screen-sharing permission, then try again or open a screenshot.');
  await expect(page.getByText('Invalid constraint')).toHaveCount(0);
});

test('static deployment maps known routes and leaves unknown paths to a real 404', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as { navigationFallback: { exclude: string[] }; routes: { route: string; rewrite?: string }[]; responseOverrides: Record<string, { rewrite: string }> };
  for (const route of ['/demo', '/lens', '/privacy', '/terms']) expect(config.routes).toContainEqual(expect.objectContaining({ route, rewrite: '/index.html' }));
  expect(config.navigationFallback.exclude).toContain('/*');
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
});

test('hashed static assets have immutable cache headers configured', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as { routes: { route: string; headers: Record<string, string> }[] };
  expect(config.routes).toContainEqual({ route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });
});
