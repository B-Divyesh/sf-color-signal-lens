import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('demo has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  const important = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(important).toEqual([]);
});

test('390px demo has no serious or critical accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  const important = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(important).toEqual([]);
});

test('keyboard users can skip to the workspace and move from canvas to colour input', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.locator('#lens-canvas').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#color-input')).toBeFocused();
});

test('keyboard users can focus the screenshot picker and route headings', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Open screenshot' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Capture screen region' })).toBeFocused();

  await page.getByLabel('Main navigation').getByRole('link', { name: 'Privacy' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('focus indicators and compact controls meet contrast and 44px target requirements', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const selector of ['.wordmark', '#color-input', '#file-input']) {
    const element = page.locator(selector);
    const box = await element.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page.getByRole('button', { name: 'Open screenshot' }).focus();
  const focusStyle = await page.getByRole('button', { name: 'Open screenshot' }).evaluate((element) => {
    const style = getComputedStyle(element);
    return { outline: style.outlineColor, width: style.outlineWidth, shadow: style.boxShadow };
  });
  expect(focusStyle.outline).toBe('rgb(0, 0, 0)');
  expect(focusStyle.width).toBe('3px');
  expect(focusStyle.shadow).toContain('rgb(255, 255, 255)');
});
