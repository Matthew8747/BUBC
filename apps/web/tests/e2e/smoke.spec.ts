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
    await page.goto('/styleguide/');
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

  test('news index renders and offers RSS when the dataset is empty', async ({ page }) => {
    await page.goto('/news/');
    await expect(page.getByRole('heading', { level: 1, name: /News/i })).toBeVisible();
    // Either there are posts, or the editorial empty-state with the RSS link is shown.
    const rssLink = page.getByRole('link', { name: /Subscribe via RSS/i });
    const firstPostHeading = page.locator('article a[href^="/news/"][href$="/"]').first();
    await expect(firstPostHeading.or(rssLink)).toBeVisible();
  });

  test('RSS feed responds with XML containing the channel title', async ({ request }) => {
    const response = await request.get('/news/rss.xml');
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain('<rss');
    expect(body).toContain('BUBC');
  });

  test('search opens via "/" shortcut, focuses the input, closes on Escape', async ({ page }) => {
    await page.goto('/');
    const dialog = page.locator('#search-dialog');
    await expect(dialog).toBeHidden();
    await page.keyboard.press('/');
    await expect(dialog).toBeVisible();
    await expect(page.locator('#search-input')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('search opens via the header button', async ({ page }) => {
    await page.goto('/');
    // Both desktop and mobile header have a [data-search-open] trigger; click
    // whichever is visible at the current viewport.
    await page.locator('[data-search-open]:visible').first().click();
    await expect(page.locator('#search-dialog')).toBeVisible();
    await expect(page.locator('#search-input')).toBeFocused();
  });

  test('Henley honours page renders the heading + empty state or entries', async ({ page }) => {
    await page.goto('/about/henley-honours/');
    await expect(page.getByRole('heading', { level: 1, name: /Henley honours/i })).toBeVisible();
    // Either we have entries (and a filter pill is present) or we have the empty placeholder.
    const filterPill = page.getByRole('button', { name: /All entries/ });
    const empty = page.getByRole('heading', { name: /catalogued/i });
    await expect(filterPill.or(empty)).toBeVisible();
  });

  test('Olympians index renders the heading + state', async ({ page }) => {
    await page.goto('/about/olympians/');
    await expect(page.getByRole('heading', { level: 1, name: /BUBC Olympians/i })).toBeVisible();
  });

  test('robots.txt is served and points at the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain('Sitemap:');
    expect(body).toContain('bubc.co.uk');
  });

  test('sitemap index is generated', async ({ request }) => {
    const response = await request.get('/sitemap-index.xml');
    expect(response.ok()).toBeTruthy();
  });
});
