import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const origin = 'https://color-signal-lens.sociobot.in';
const evidence = '.factory/evidence/repair-10-live';
const routes = [
  ['/', 200, 'Color Signal Lens — Make status colors distinct'],
  ['/demo', 200, 'Demo — Color Signal Lens'],
  ['/lens', 200, 'Color Signal Lens — Inspect screenshot colors'],
  ['/privacy', 200, 'Privacy — Color Signal Lens'],
  ['/terms', 200, 'Terms — Color Signal Lens'],
  ['/missing-repair-10-route', 404, 'Page not found — Color Signal Lens'],
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844 },
];
const report = { generatedAt: new Date().toISOString(), routes: [], firstRead: {}, demo: {}, recovery: {}, offline: {}, navigation: {} };
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  for (const [path, expectedStatus, expectedTitle] of routes) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page }).analyze();
    const structure = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1: document.querySelectorAll('h1').length,
      main: document.querySelectorAll('main').length,
      missingAlt: [...document.querySelectorAll('img')].filter(image => !image.hasAttribute('alt')).length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    const item = { viewport: viewport.name, path, status: response?.status(), expectedStatus, expectedTitle, ...structure, axe: axe.violations.map(v => ({ id: v.id, impact: v.impact })), errors };
    report.routes.push(item);
    assert.equal(item.status, expectedStatus, `${viewport.name} ${path} status`);
    assert.equal(item.title, expectedTitle, `${viewport.name} ${path} title`);
    assert.equal(item.lang, 'en');
    assert.equal(item.h1, 1);
    assert.equal(item.main, 1);
    assert.equal(item.missingAlt, 0);
    assert.ok(item.scrollWidth <= item.clientWidth, `${viewport.name} ${path} has no horizontal overflow`);
    assert.deepEqual(item.axe, [], `${viewport.name} ${path} has no Axe violations`);
    if (expectedStatus === 200) assert.deepEqual(errors, [], `${viewport.name} ${path} has no console or page errors`);
    if (path === '/' || path === '/demo') await page.screenshot({ path: `${evidence}/${viewport.name}-${path === '/' ? 'home' : 'demo'}.png`, fullPage: false });
    await context.close();
  }
}

{
  const context = await browser.newContext({ viewport: viewports[1], reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  const headline = page.getByRole('heading', { level: 1 });
  const audience = page.getByText('For people who cannot rely on red and green during code reviews, charts, or status screens.');
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  const facts = page.locator('.facts');
  const bounds = Object.fromEntries(await Promise.all([
    ['headline', headline], ['audience', audience], ['action', action], ['facts', facts],
  ].map(async ([name, locator]) => [name, await locator.boundingBox()])));
  for (const [name, box] of Object.entries(bounds)) assert.ok(box && box.y + box.height <= 844, `${name} is visible before scrolling`);
  report.firstRead = { headline: await headline.textContent(), audience: await audience.textContent(), action: await action.textContent(), bounds };

  await page.evaluate(() => {
    localStorage.setItem('sb_license:color-signal-lens', 'real-license-marker');
    localStorage.setItem('color-signal-lens:presets', '[{"name":"Real preset"}]');
    localStorage.setItem('unrelated-real-key', 'keep-me');
  });
  const nonDemoStorage = () => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => !key.startsWith('demo:color-signal-lens:')).sort()));
  const before = await nonDemoStorage();
  await action.click();
  await page.waitForURL(`${origin}/demo`);
  const banner = page.locator('.demo-banner');
  assert.equal(await banner.getAttribute('role'), null, 'interactive demo banner has no live-region role');
  assert.equal(await banner.getAttribute('aria-label'), 'Demo mode');
  await page.getByLabel('Use blue-orange colors').check();
  const populated = {
    banner: await banner.getByText('Demo — sample data, nothing is saved', { exact: true }).isVisible(),
    sample: await page.locator('#source-status').textContent(),
    cue: await page.locator('#demo-active-cue').textContent(),
    canvas: await page.locator('#lens-canvas').isVisible(),
  };
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const afterReset = await nonDemoStorage();
  const demoKeysAfterReset = await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:color-signal-lens:')));
  const bannerAfterReset = await page.getByText('Demo — sample data, nothing is saved', { exact: true }).isVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(`${origin}/lens`);
  const afterExit = await nonDemoStorage();
  const realEmpty = await page.getByText('No screenshot is open.').isVisible();
  assert.deepEqual(afterReset, before, 'Reset preserves every real key');
  assert.deepEqual(afterExit, before, 'Start for real preserves every real key');
  assert.deepEqual(demoKeysAfterReset, [], 'Reset clears every demo key');
  assert.ok(populated.banner && populated.canvas && /checkout-totals/.test(populated.sample || '') && /blue-orange/i.test(populated.cue || ''));
  assert.ok(bannerAfterReset);
  assert.ok(realEmpty);
  const motion = await page.locator('.button').first().evaluate(element => ({ transitionDuration: getComputedStyle(element).transitionDuration, animationDuration: getComputedStyle(element).animationDuration }));
  report.demo = {
    populated,
    realStorageUnchanged: JSON.stringify(afterReset) === JSON.stringify(before) && JSON.stringify(afterExit) === JSON.stringify(before),
    nonDemoKeys: Object.keys(before),
    demoKeysAfterReset,
    bannerAfterReset,
    realEmpty,
    motion,
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: viewports[0] });
  const page = await context.newPage();
  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  const before = await page.locator('#lens-canvas').evaluate(canvas => canvas.toDataURL());
  await page.locator('#file-input').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await page.waitForFunction(() => document.querySelector('#source-status')?.textContent?.startsWith('Could not open'));
  const message = await page.locator('#source-status').textContent();
  const after = await page.locator('#lens-canvas').evaluate(canvas => canvas.toDataURL());
  assert.equal(message, 'Could not open broken.png. Choose a valid PNG, JPEG, or WebP image.');
  assert.equal(after, before, 'invalid input preserves the last valid screenshot');
  report.recovery = { message, preserved: after === before };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: viewports[1] });
  const page = await context.newPage();
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await context.setOffline(true);
  await page.getByLabel('Add a label').check();
  const cue = await page.getByText('A text label marks the selected status color.', { exact: true }).isVisible();
  assert.ok(cue, 'loaded reader changes cues offline');
  report.offline = { cue, requests, crossOrigin: requests.filter(url => new URL(url).origin !== origin) };
  assert.deepEqual(report.offline.crossOrigin, [], 'direct demo makes only first-party requests');
  await context.setOffline(false);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: viewports[1] });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: 'networkidle' });
  const link = page.getByRole('link', { name: 'How it works' });
  await link.focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(`${origin}/#how`);
  const focused = await page.getByRole('heading', { name: 'How Color Signal Lens works' }).evaluate(element => document.activeElement === element);
  const announced = await page.locator('#route-announcement').textContent();
  await page.goBack();
  const restored = await page.getByRole('heading', { name: 'Make status colors distinct.' }).evaluate(element => document.activeElement === element);
  assert.ok(focused && restored);
  assert.equal(announced, 'How Color Signal Lens works');
  report.navigation = { focused, announced, restored };
  await context.close();
}

await browser.close();
writeFileSync(`${evidence}/live-audit.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ routes: report.routes.length, axeViolations: report.routes.flatMap(item => item.axe).length, demo: report.demo, recovery: report.recovery, offline: { cue: report.offline.cue, crossOrigin: report.offline.crossOrigin }, navigation: report.navigation }, null, 2));
