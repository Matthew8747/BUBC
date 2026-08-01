import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  TRIAL_RECIPIENTS,
  routeTrialSubmission,
  type TrialExperience,
  type TrialSquad,
} from '../../src/lib/trial-routing';

const EXPERIENCED: TrialExperience[] = ['school', 'gb', 'other'];

describe('routeTrialSubmission', () => {
  it('sends applicants with no rowing experience to the novice programme', () => {
    expect(routeTrialSubmission({ experience: 'none' })).toEqual({
      cc: 'novice@bubc.co.uk',
    });
  });

  it('keeps novices on the novice route even if a squad was somehow answered', () => {
    // The squad question is hidden for novices, but a stale value could still
    // ride along — experience wins.
    for (const squad of ['mens', 'womens', 'unspecified'] as TrialSquad[]) {
      expect(routeTrialSubmission({ experience: 'none', squad })).toEqual({
        cc: 'novice@bubc.co.uk',
      });
    }
  });

  it.each(EXPERIENCED)('routes an experienced %s applicant by squad', (experience) => {
    expect(routeTrialSubmission({ experience, squad: 'mens' })).toEqual({
      cc: 'captain.m@bubc.co.uk',
    });
    expect(routeTrialSubmission({ experience, squad: 'womens' })).toEqual({
      cc: 'captain.w@bubc.co.uk',
    });
  });

  it('copies nobody beyond the coaches when the squad is not disclosed', () => {
    // Deliberate: "prefer not to say" must not fan out to both captains.
    expect(routeTrialSubmission({ experience: 'school', squad: 'unspecified' })).toEqual({
      cc: null,
    });
  });

  it('copies nobody beyond the coaches when an experienced applicant has no squad', () => {
    expect(routeTrialSubmission({ experience: 'gb' })).toEqual({ cc: null });
  });

  it('never returns the coaches address as the CC', () => {
    // The coaches are the Formspree target, so CC'ing them would duplicate.
    const inputs: { experience: TrialExperience; squad?: TrialSquad }[] = [
      { experience: 'none' },
      { experience: 'school', squad: 'mens' },
      { experience: 'gb', squad: 'womens' },
      { experience: 'other', squad: 'unspecified' },
    ];
    for (const input of inputs) {
      expect(routeTrialSubmission(input).cc).not.toBe(TRIAL_RECIPIENTS.coaches);
    }
  });
});

describe('TRIAL_RECIPIENTS', () => {
  // A routing address that isn't published on /contact/ is an application that
  // silently goes nowhere, so keep the two lists in step.
  const contactPage = readFileSync(
    new URL('../../src/pages/contact.astro', import.meta.url),
    'utf8',
  );

  it.each(Object.entries(TRIAL_RECIPIENTS))(
    'lists the %s address (%s) on the contact page',
    (_role, email) => {
      expect(contactPage).toContain(email);
    },
  );

  it('uses a bubc.co.uk address for every recipient', () => {
    for (const email of Object.values(TRIAL_RECIPIENTS)) {
      expect(email).toMatch(/^[a-z.]+@bubc\.co\.uk$/);
    }
  });
});
