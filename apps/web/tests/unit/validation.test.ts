import { describe, expect, it } from 'vitest';
import {
  liveRaceBannerSchema,
  newsletterSchema,
  parseTrialForm,
  validateLiveRaceBanner,
} from '../../src/lib/validation';

describe('liveRaceBannerSchema', () => {
  it('accepts a valid banner with an https URL', () => {
    const result = liveRaceBannerSchema.safeParse({
      active: true,
      eventName: 'BUCS Regatta',
      message: 'Day one results',
      liveResultsUrl: 'https://results.britishrowing.org/',
      ctaLabel: 'Follow live',
      tone: 'gold',
    });
    expect(result.success).toBe(true);
  });

  it('rejects javascript: URL in liveResultsUrl', () => {
    const result = liveRaceBannerSchema.safeParse({
      active: true,
      eventName: 'X',
      liveResultsUrl: 'javascript:alert(1)',
    });
    expect(result.success).toBe(false);
  });

  it('returns null when validateLiveRaceBanner sees a hostile shape', () => {
    expect(validateLiveRaceBanner({ liveResultsUrl: 'data:text/html,<script>' })).toBeNull();
    expect(validateLiveRaceBanner(null)).toBeNull();
    expect(validateLiveRaceBanner('not an object')).toBeNull();
  });

  it('returns a clean object when validateLiveRaceBanner sees a valid payload', () => {
    const out = validateLiveRaceBanner({
      active: true,
      eventName: 'Henley',
      tone: 'navy',
    });
    expect(out).toMatchObject({ active: true, eventName: 'Henley', tone: 'navy' });
  });
});

describe('newsletterSchema', () => {
  it('accepts a valid email and empty honeypot', () => {
    const out = newsletterSchema.safeParse({ email: 'rower@bath.ac.uk', htmlemail: '' });
    expect(out.success).toBe(true);
    if (out.success) expect(out.data.email).toBe('rower@bath.ac.uk');
  });

  it('rejects a malformed email', () => {
    const out = newsletterSchema.safeParse({ email: 'not-an-email', htmlemail: '' });
    expect(out.success).toBe(false);
  });

  it('rejects when the honeypot is filled in', () => {
    const out = newsletterSchema.safeParse({
      email: 'rower@bath.ac.uk',
      htmlemail: 'bot@example.com',
    });
    expect(out.success).toBe(false);
  });
});

describe('parseTrialForm', () => {
  function makeData(overrides: Record<string, string> = {}): FormData {
    const fd = new FormData();
    const base: Record<string, string> = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@bath.ac.uk',
      phone: '07123456789',
      course: 'Mathematics, 1st year',
      intake: 'september',
      experience: 'none',
      // Must match what `Checkbox.astro` actually renders — see the regression
      // test below.
      welfare: 'yes',
      _gotcha: '',
    };
    for (const [k, v] of Object.entries({ ...base, ...overrides })) fd.set(k, v);
    return fd;
  }

  it('accepts a well-formed submission', () => {
    const out = parseTrialForm(makeData());
    expect(out.ok).toBe(true);
  });

  it('rejects a missing required field', () => {
    const out = parseTrialForm(makeData({ firstName: '' }));
    expect(out.ok).toBe(false);
  });

  it('rejects an invalid email', () => {
    const out = parseTrialForm(makeData({ email: 'not-an-email' }));
    expect(out.ok).toBe(false);
  });

  it('rejects a filled honeypot', () => {
    const out = parseTrialForm(makeData({ _gotcha: 'I am a bot' }));
    expect(out.ok).toBe(false);
  });

  it('rejects an out-of-range height', () => {
    const out = parseTrialForm(makeData({ height: '50' }));
    expect(out.ok).toBe(false);
  });

  it('rejects an out-of-range weight', () => {
    const out = parseTrialForm(makeData({ weight: '500' }));
    expect(out.ok).toBe(false);
  });

  // Regression: the schema used to only accept `welfare === 'on'`, while
  // `Checkbox.astro` renders `value="yes"`. Every real submission was rejected
  // with "You must agree to the welfare policy" even with the box ticked.
  it.each(['yes', 'on', 'true', '1'])('accepts a ticked welfare box valued %s', (value) => {
    const out = parseTrialForm(makeData({ welfare: value }));
    expect(out.ok).toBe(true);
  });

  it('rejects an unticked welfare box', () => {
    const fd = makeData();
    fd.delete('welfare');
    const out = parseTrialForm(fd);
    expect(out.ok).toBe(false);
  });

  // The squad question decides which captain gets CC'd. It is only shown to
  // applicants with prior rowing, so it must be required for them and ignored
  // for novices — a novice blocked by an unanswered hidden field is the same
  // class of bug as the welfare checkbox.
  describe('squad', () => {
    it('accepts a novice who never saw the squad question', () => {
      const out = parseTrialForm(makeData({ experience: 'none' }));
      expect(out.ok).toBe(true);
    });

    it.each(['school', 'gb', 'other'])(
      'rejects a %s applicant who did not pick a squad',
      (experience) => {
        const out = parseTrialForm(makeData({ experience }));
        expect(out.ok).toBe(false);
        if (!out.ok) expect(out.errors.join(' ')).toMatch(/squad/i);
      },
    );

    it.each(['mens', 'womens', 'unspecified'])('accepts squad %s', (squad) => {
      const out = parseTrialForm(makeData({ experience: 'school', squad }));
      expect(out.ok).toBe(true);
      if (out.ok) expect(out.data.squad).toBe(squad);
    });

    it('rejects a squad value that is not one of the options', () => {
      const out = parseTrialForm(makeData({ experience: 'school', squad: 'mixed' }));
      expect(out.ok).toBe(false);
    });
  });
});
