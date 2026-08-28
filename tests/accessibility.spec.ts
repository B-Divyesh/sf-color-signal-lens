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
