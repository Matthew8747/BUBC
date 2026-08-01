import { expect, test } from '@playwright/test';

/**
 * Trial form — end-to-end submit path.
 *
 * Regression cover for a live outage: `Checkbox.astro` renders the welfare
 * consent box as `value="yes"`, but `trialFormSchema` only accepted `'on'`.
 * Every genuine application was rejected client-side with "You must agree to
 * the welfare policy" — with the box ticked. The unit tests passed throughout
 * because they hand-built FormData using `'on'`, a value the page never sends.
 *
 * So this test drives the *rendered* form. It is the only layer that would
 * have caught the mismatch, and it must stay that way: fill via the real
 * controls, never by constructing FormData by hand.
 *
 * The Formspree POST is intercepted, so running this never sends a real
 * application.
 */
test.describe('trial form', () => {
  test('a fully filled form clears client-side validation and submits', async ({ page }) => {
    let submittedBody = '';

    await page.route('https://formspree.io/**', async (route) => {
      submittedBody = route.request().postData() ?? '';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/squads/trial/');

    const form = page.locator('#trial-form');
    await expect(form).toBeVisible();

    await page.getByLabel(/First name/).fill('Testy');
    await page.getByLabel(/Last name/).fill('McTestface');
    await page.getByLabel(/Bath email address/).fill('testy@bath.ac.uk');
    await page.getByLabel(/Mobile/).fill('07000000000');
    await page.getByLabel(/Course & year/).fill('Mechanical Engineering, 3rd year');
    await page.getByRole('radio', { name: /September \(Fresher\)/ }).check();
    await page.getByRole('radio', { name: /None at all/ }).check();
    await page.getByLabel(/Height \(cm\)/).fill('185');
    await page.getByLabel(/Weight \(kg\)/).fill('70');
    await page.getByLabel(/2k erg PB/).fill('8:27.0');

    const welfare = page.getByRole('checkbox', { name: /I confirm I have read the welfare/ });
    await welfare.check();
    await expect(welfare).toBeChecked();

    // The submit handler rejects anything faster than MIN_FILL_TIME_MS (2s) as
    // bot traffic, so wait it out rather than racing it.
    await page.waitForTimeout(2500);

    await page.getByRole('button', { name: 'Send my application' }).click();

    const status = page.locator('#trial-form-status');

    // The bug surfaced here, before the "is Formspree configured?" branch — so
    // this assertion holds for configured and unconfigured builds alike.
    await expect(status).not.toContainText(/welfare policy/i);
    await expect(status).not.toContainText(/needs? checking/i);
    await expect(status).not.toContainText(/double-check/i);

    const isConfigured = (await form.getAttribute('data-formspree')) === 'true';

    if (isConfigured) {
      await expect(page.locator('#trial-success')).toBeVisible();
      await expect(form).toBeHidden();
      expect(submittedBody).toContain('welfare');
    } else {
      // No form ID in this build; validation still had to pass to get here.
      await expect(status).toContainText(/not yet configured/i);
    }
  });

  test('an unticked welfare box blocks submission', async ({ page }) => {
    await page.route('https://formspree.io/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );

    await page.goto('/squads/trial/');

    await page.getByLabel(/First name/).fill('Testy');
    await page.getByLabel(/Last name/).fill('McTestface');
    await page.getByLabel(/Bath email address/).fill('testy@bath.ac.uk');
    await page.getByLabel(/Mobile/).fill('07000000000');
    await page.getByLabel(/Course & year/).fill('Mechanical Engineering, 3rd year');
    await page.getByRole('radio', { name: /September \(Fresher\)/ }).check();
    await page.getByRole('radio', { name: /None at all/ }).check();

    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Send my application' }).click();

    // Native `required` validation stops it; the success state must not appear.
    await expect(page.locator('#trial-success')).toBeHidden();
    await expect(page.locator('#trial-form')).toBeVisible();
  });
});
