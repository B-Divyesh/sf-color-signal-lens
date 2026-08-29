import { expect, test } from '@playwright/test';
import { execFile, spawn, type ChildProcess } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
let server: ChildProcess | undefined;

async function waitForDesktopBuild() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4174/');
      if (response.ok) return;
    } catch {
      // The local preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Timed out waiting for the desktop artifact preview.');
}

test.beforeAll(async () => {
  await run('npm', ['run', 'build:app']);
  server = spawn(process.execPath, ['./node_modules/vite/bin/vite.js', 'preview', '--outDir', 'dist/app', '--host', '127.0.0.1', '--port', '4174'], { stdio: 'ignore' });
  await waitForDesktopBuild();
});

test.afterAll(() => server?.kill());

test('@claim:desktop-paid-flow uses the native verification bridge in the built desktop app', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { nativeLicenseCalls?: { command: string; arguments: Record<string, string> }[]; __TAURI__?: unknown };
    state.nativeLicenseCalls = [];
    Object.defineProperty(window, '__TAURI__', {
      configurable: true,
      value: { core: { invoke: async (command: string, args: Record<string, string>) => {
        state.nativeLicenseCalls?.push({ command, arguments: args });
        return { valid: true };
      } } },
    });
  });
  await page.route('https://api.sociobot.in/api/v1/products/color-signal-lens/verify**', (route) => route.abort());
  await page.goto('http://127.0.0.1:4174/');
  await expect(page.getByRole('link', { name: 'Buy Lens Plus' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/color-signal-lens/checkout');
  const restore = page.locator('#restore-license');
  await restore.scrollIntoViewIfNeeded();
  await restore.click();
  await page.getByLabel('Paste your license').fill('desktop-fixture');
  await page.locator('#save-license').click();
  await expect(page.locator('#license-note')).toHaveText('License is active.');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:color-signal-lens'))).toBe('desktop-fixture');
  expect(await page.evaluate(() => (window as Window & { nativeLicenseCalls?: unknown[] }).nativeLicenseCalls)).toEqual([
    { command: 'verify_license', arguments: { license: 'desktop-fixture' } },
  ]);
});

test('production desktop origin uses the native license command without a CORS-readable webview response', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { nativeLicenseCalls?: { command: string; arguments: Record<string, string> }[]; __TAURI__?: unknown };
    state.nativeLicenseCalls = [];
    Object.defineProperty(window, '__TAURI__', {
      configurable: true,
      value: { core: { invoke: async (command: string, args: Record<string, string>) => {
        state.nativeLicenseCalls?.push({ command, arguments: args });
        return { valid: false };
      } } },
    });
  });
  await page.route('https://api.sociobot.in/api/v1/products/color-signal-lens/verify**', (route) => route.abort());
  await page.goto('http://127.0.0.1:4174/lens');
  await page.getByRole('button', { name: 'Restore license' }).click();
  await page.getByLabel('Paste your license').fill('invalid-regression-token');
  await page.getByRole('button', { name: 'Restore license' }).last().click();
  await expect(page.locator('#license-note')).toHaveText('This license is no longer active. You can buy Lens Plus again.');
  expect(await page.evaluate(() => (window as Window & { nativeLicenseCalls?: unknown[] }).nativeLicenseCalls)).toEqual([
    { command: 'verify_license', arguments: { license: 'invalid-regression-token' } },
  ]);
});

test('desktop Restore license has a 44px input target and a real How it works destination', async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 810 });
  await page.goto('http://127.0.0.1:4174/lens');
  await page.getByRole('button', { name: 'Restore license' }).click();
  const bounds = await page.getByLabel('Paste your license').boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  await page.getByRole('link', { name: 'How it works' }).click();
  await expect(page).toHaveURL(/\/lens#how$/);
  await expect(page.locator('#how')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How Color Signal Lens works' })).toBeFocused();
});
