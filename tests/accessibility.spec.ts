import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('demo has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page }).analyze();
  const important = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');
  expect(important).toEqual([]);
});
