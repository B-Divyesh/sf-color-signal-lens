import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const origin = 'https://color-signal-lens.sociobot.in';
const routes = ['/', '/demo', '/lens', '/privacy', '/terms', '/missing-verification-12'];
const viewports = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }];
const report = { generatedAt: new Date().toISOString(), routeAudits: [], demo: {}, invalidInput: {}, zoom: {} };
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  for (const route of routes) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
    page.on('requestfailed', request => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText || ''}`));
    page.on('request', request => requests.push(request.url()));
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page }).analyze();
    const serious = axe.violations.filter(item => item.impact === 'serious' || item.impact === 'critical');
    const semantics = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      h1Count: document.querySelectorAll('h1').length,
      mainCount: document.querySelectorAll('main').length,
      imagesWithoutAlt: [...document.querySelectorAll('img')].filter(image => !image.hasAttribute('alt')).length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    report.routeAudits.push({ viewport: viewport.name, route, status: response?.status(), ...semantics, serious: serious.map(v => v.id), errors, requests });
    if (route === '/' || route === '/demo') await page.screenshot({ path: `.factory/evidence/verification-12/${viewport.name}-${route === '/' ? 'home' : 'demo'}.png`, fullPage: false });
    await context.close();
  }
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', request => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText || ''}`));
  page.on('request', request => requests.push(request.url()));
  await page.goto(origin, { waitUntil: 'networkidle' });
  const cta = page.getByRole('link', { name: 'Try it with sample data' });
  await cta.focus();
  const focus = await cta.evaluate(element => { const style = getComputedStyle(element); return { outlineColor: style.outlineColor, outlineWidth: style.outlineWidth, boxShadow: style.boxShadow }; });
  await page.keyboard.press('Enter');
  await page.waitForURL(`${origin}/demo`);
  const banner = await page.getByText('Demo — sample data, nothing is saved', { exact: true }).isVisible();
  const samplePixel = await page.locator('#lens-canvas').evaluate(canvas => Array.from(canvas.getContext('2d').getImageData(600, 360, 1, 1).data));
  for (const cue of ['Add a label', 'Add a pattern', 'Use blue-orange colors']) {
    await page.getByLabel(cue).check();
  }
  const boundaryOutputs = [];
  for (const value of ['#000000', '#FFFFFF']) {
    await page.locator('#color-input').fill(value);
    await page.getByRole('button', { name: 'Apply selected color' }).click();
    boundaryOutputs.push(await page.locator('#color-value').textContent());
  }
  await page.getByRole('button', { name: 'Clear overlay' }).click();
  const clearState = await page.locator('#meaning-name').textContent();
  const motion = await page.locator('.button').first().evaluate(element => ({ transitionDuration: getComputedStyle(element).transitionDuration, animationDuration: getComputedStyle(element).animationDuration }));
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const demoKeysAfterReset = await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:color-signal-lens:')));
  const overflow = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  report.demo = { banner, focus, samplePixel, boundaryOutputs, clearState, motion, demoKeysAfterReset, overflow, requests, crossOriginRequests: requests.filter(url => new URL(url).origin !== origin), errors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${origin}/lens`, { waitUntil: 'networkidle' });
  const before = await page.getByText('No screenshot is open.').isVisible();
  await page.locator('#file-input').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await page.locator('#source-status').getAttribute('role');
  const recovery = await page.locator('#source-status').textContent();
  const stillEmpty = await page.getByText('No screenshot is open.').isVisible();
  report.invalidInput = { before, recovery, stillEmpty };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${origin}/demo`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  report.zoom = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, h1Visible: !!document.querySelector('h1')?.getClientRects().length, controlsVisible: !!document.querySelector('.controls')?.getClientRects().length }));
  await context.close();
}

await browser.close();
writeFileSync('.factory/evidence/verification-12/live-audit.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
