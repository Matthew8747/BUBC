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
      welfare: 'on',
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
});
