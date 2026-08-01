/**
 * Trial application routing — which inbox hears about a given application.
 *
 * Every application reaches the coaches regardless of what this module says:
 * `coaches@bubc.co.uk` is the Formspree form's target address, configured in
 * the dashboard. That covers submissions this code never touches — a no-JS
 * native POST, or anyone posting straight at the endpoint.
 *
 * On top of that, one squad contact is CC'd (Formspree's `_cc` field) so the
 * relevant captain sees the application without a coach forwarding it by hand.
 *
 * Deliberately transport-agnostic: this maps answers to an address, nothing
 * more. `_cc` is a Formspree feature we don't control, so if it ever stops
 * being honoured the fallback is one form per destination — and only the
 * caller changes. This mapping and its tests stay exactly as they are.
 */

/**
 * Squad contacts. These must stay in step with the published list on
 * `/contact/` — an address that only exists here is an application that
 * silently goes nowhere.
 */
export const TRIAL_RECIPIENTS = {
  coaches: 'coaches@bubc.co.uk',
  novice: 'novice@bubc.co.uk',
  mens: 'captain.m@bubc.co.uk',
  womens: 'captain.w@bubc.co.uk',
} as const;

export type TrialExperience = 'none' | 'school' | 'gb' | 'other';
export type TrialSquad = 'mens' | 'womens' | 'unspecified';

export interface TrialRouteInput {
  experience: TrialExperience;
  squad?: TrialSquad;
}

/**
 * Pick the squad contact to CC alongside the coaches.
 *
 * `null` means nobody beyond the coaches gets a copy. That is the deliberate
 * answer for "prefer not to say": copying both captains would give someone who
 * declined to state a squad *more* exposure than they asked for, not less. A
 * coach picks it up and routes it discreetly instead.
 */
export function routeTrialSubmission({ experience, squad }: TrialRouteInput): {
  cc: string | null;
} {
  // No prior rowing goes to the novice programme whatever squad was picked —
  // the novice intake is taught from scratch and isn't split by squad.
  if (experience === 'none') return { cc: TRIAL_RECIPIENTS.novice };
  if (squad === 'mens') return { cc: TRIAL_RECIPIENTS.mens };
  if (squad === 'womens') return { cc: TRIAL_RECIPIENTS.womens };
  return { cc: null };
}
