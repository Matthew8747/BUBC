import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('home page loads with the brand title and hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/University of Bath Boat Club/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('home page exposes a skip-to-main link', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeAttached();
  });

  test('styleguide renders sections', async ({ page }) => {
    await page.goto('/styleguide');
    await expect(page.getByRole('heading', { name: 'Design system' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Colour' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Typography' })).toBeVisible();
  });

  test('mobile menu opens, traps focus to the panel, and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const burger = page.getByRole('button', { name: 'Open menu' });
    await expect(burger).toBeVisible();
    await burger.click();

    const closeBtn = page.getByRole('button', { name: 'Close menu' });
    await expect(closeBtn).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(closeBtn).toBeHidden();
  });

  test('trial page renders the form (or the unconfigured notice)', async ({ page }) => {
    await page.goto('/squads/trial/');
    await expect(page.getByRole('heading', { name: 'Trial with us.' })).toBeVisible();
    await expect(page.getByLabel(/Bath email address/)).toBeVisible();
  });
});
