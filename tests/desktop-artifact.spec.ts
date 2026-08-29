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

test('@claim:desktop-paid-flow exposes Buy and Restore in the built desktop app', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/color-signal-lens/verify?license=desktop-fixture', (route) => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ valid: true, reason: 'ok' }),
  }));
  await page.goto('http://127.0.0.1:4174/');
  await expect(page.getByRole('link', { name: 'Buy Lens Plus' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/color-signal-lens/checkout');
  const restore = page.locator('#restore-license');
  await restore.scrollIntoViewIfNeeded();
  await restore.click();
  await page.getByLabel('Paste your license').fill('desktop-fixture');
  await page.locator('#save-license').click();
  await expect(page.locator('#license-note')).toHaveText('License is active.');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:color-signal-lens'))).toBe('desktop-fixture');
});
