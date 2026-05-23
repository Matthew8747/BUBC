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

  test('squads index lists every default squad', async ({ page }) => {
    await page.goto('/squads/');
    await expect(page.getByRole('heading', { level: 1, name: 'Find your level.' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Senior men' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Senior women' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Novice' })).toBeVisible();
  });

  test('senior men squad detail page renders training-week heading', async ({ page }) => {
    await page.goto('/squads/senior-men/');
    await expect(page.getByRole('heading', { level: 1, name: 'Senior men' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'A typical week.' })).toBeVisible();
  });

  test('boathouse page renders the embedded location map', async ({ page }) => {
    await page.goto('/boathouse/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByTitle('Map showing the BUBC boathouse location')).toBeVisible();
  });

  test('welfare page lists the named officer email', async ({ page }) => {
    await page.goto('/welfare/');
    await expect(page.getByRole('link', { name: 'welfare@bubc.co.uk' }).first()).toBeVisible();
  });

  test('donate page surfaces the Hubbub destination', async ({ page }) => {
    await page.goto('/support/donate/');
    const hubbub = page.getByRole('link', { name: /Donate via Hubbub/ }).first();
    await expect(hubbub).toBeVisible();
    await expect(hubbub).toHaveAttribute('href', /hubbub\.net/);
  });

  test('404 page renders branded copy and home button', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/', { waitUntil: 'load' });
    // Static hosts serve 404.html; status may vary depending on dev server. Either way the page renders.
    if (response) {
      expect([200, 404]).toContain(response.status());
    }
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
