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
/** Fill everything except experience/squad, which each test drives itself. */
async function fillCommonFields(page: import('@playwright/test').Page) {
  await page.getByLabel(/First name/).fill('Testy');
  await page.getByLabel(/Last name/).fill('McTestface');
  await page.getByLabel(/Bath email address/).fill('testy@bath.ac.uk');
  await page.getByLabel(/Mobile/).fill('07000000000');
  await page.getByLabel(/Course & year/).fill('Mechanical Engineering, 3rd year');
  await page.getByRole('radio', { name: /September \(Fresher\)/ }).check();
}

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

/**
 * Recipient routing. `coaches@bubc.co.uk` is the Formspree form's target
 * address, so it is set in the dashboard and never appears in the payload —
 * what we assert here is the second recipient, the CC'd squad contact.
 */
test.describe('trial form routing', () => {
  /**
   * Read one field out of a request body.
   *
   * The page submits a `FormData`, so fetch encodes it as `multipart/form-data`
   * rather than url-encoded. Reading it as a query string silently returns null
   * for every field, which would make "no CC expected" assertions pass for
   * entirely the wrong reason. Handles both encodings.
   */
  function readField(body: string, name: string): string | null {
    const multipart = new RegExp(`name="${name}"\\r?\\n\\r?\\n([\\s\\S]*?)\\r?\\n--`).exec(body);
    if (multipart) return multipart[1];

    const urlencoded = new RegExp(`(?:^|&)${name}=([^&]*)`).exec(body);
    return urlencoded ? decodeURIComponent(urlencoded[1].replace(/\+/g, ' ')) : null;
  }

  /** Submit a filled form and return the `_cc` value that went over the wire. */
  async function submitAndReadCc(
    page: import('@playwright/test').Page,
    experience: RegExp,
    squad?: RegExp,
  ): Promise<string | null> {
    let body = '';
    await page.route('https://formspree.io/**', async (route) => {
      body = route.request().postData() ?? '';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"ok":true}',
      });
    });

    await page.goto('/squads/trial/');

    // The CC is attached after the "is Formspree configured?" check, so an
    // unconfigured build never reaches it and there is no request to inspect.
    // CI builds with a dummy form ID precisely so these run; a local build
    // without one skips instead of failing misleadingly.
    const configured =
      (await page.locator('#trial-form').getAttribute('data-formspree')) === 'true';
    test.skip(!configured, 'build has no PUBLIC_FORMSPREE_TRIAL_ID; run pnpm build with one set');

    await fillCommonFields(page);
    await page.getByRole('radio', { name: experience }).check();
    if (squad) await page.getByRole('radio', { name: squad }).check();
    await page.getByRole('checkbox', { name: /I confirm I have read the welfare/ }).check();

    await page.waitForTimeout(2500);
    await page.getByRole('button', { name: 'Send my application' }).click();
    await expect(page.locator('#trial-success')).toBeVisible();

    // Prove the body parser works before trusting a null `_cc` to mean
    // "nobody was copied" rather than "the parser found nothing".
    expect(readField(body, 'firstName')).toBe('Testy');

    return readField(body, '_cc');
  }

  test('the squad question is hidden until prior experience is selected', async ({ page }) => {
    await page.goto('/squads/trial/');
    const squadField = page.locator('#squad-field');

    // Nothing selected yet.
    await expect(squadField).toBeHidden();

    await page.getByRole('radio', { name: /None at all/ }).check();
    await expect(squadField).toBeHidden();

    await page.getByRole('radio', { name: /School \/ club rowing/ }).check();
    await expect(squadField).toBeVisible();

    // Going back to novice must clear the answer, not leave a stale one set —
    // otherwise a novice silently carries a squad into the payload.
    await page.getByRole('radio', { name: /Men's squad/ }).check();
    await page.getByRole('radio', { name: /None at all/ }).check();
    await expect(squadField).toBeHidden();

    // Addressed by selector, not by role: once hidden and `inert`, the radio
    // is out of the accessibility tree and getByRole cannot resolve it.
    await expect(page.locator('input[name="squad"][value="mens"]')).not.toBeChecked();
  });

  test('a novice is not blocked by the hidden squad question', async ({ page }) => {
    const cc = await submitAndReadCc(page, /None at all/);
    expect(cc).toBe('novice@bubc.co.uk');
  });

  test("an experienced applicant choosing men's is copied to the men's captain", async ({
    page,
  }) => {
    const cc = await submitAndReadCc(page, /School \/ club rowing/, /Men's squad/);
    expect(cc).toBe('captain.m@bubc.co.uk');
  });

  test("an experienced applicant choosing women's is copied to the women's captain", async ({
    page,
  }) => {
    const cc = await submitAndReadCc(page, /GB \/ national pathway/, /Women's squad/);
    expect(cc).toBe('captain.w@bubc.co.uk');
  });

  test('"prefer not to say" copies nobody beyond the coaches', async ({ page }) => {
    const cc = await submitAndReadCc(page, /School \/ club rowing/, /Prefer not to say/);
    expect(cc).toBeNull();
  });
});
