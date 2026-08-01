/**
 * Runtime validation schemas using Zod.
 *
 * Why bother on a static build? Two reasons:
 *
 *   1. CMS shape drift. A schema change in `apps/studio` could silently
 *      misalign with the hand-maintained types in `lib/types.ts`. Zod gives
 *      us a *runtime* tripwire: validate the shape of the most security- or
 *      render-critical query results before they reach the renderer. If the
 *      shape is wrong, we log + fall back, never render broken markup.
 *
 *   2. Form input. Zod gives consistent client-side validation with clear
 *      messages before we hand the payload to Formspree / Buttondown. The
 *      third party still validates server-side — Zod is the first defence,
 *      not the only one.
 *
 * Keep the schemas narrow: validate only what we render or send. Over-broad
 * schemas trip on harmless future additions and become a maintenance burden.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

const isAllowedUrl = (v: string): boolean => {
  if (!v) return true;
  if (v.startsWith('//')) return false;
  if (v.startsWith('/') || v.startsWith('#') || v.startsWith('?') || v.startsWith('.')) return true;
  const colon = v.indexOf(':');
  if (colon === -1) return true;
  const scheme = v.slice(0, colon).toLowerCase();
  return scheme === 'http' || scheme === 'https' || scheme === 'mailto' || scheme === 'tel';
};

/**
 * URL whose protocol is in our allow-list. Tracks `lib/html.ts` `sanitizeUrl`.
 * Empty / missing values are tolerated — editors can leave Sanity fields blank.
 */
export const safeUrlSchema = z.preprocess(
  (val) => (val == null ? undefined : val),
  z
    .string()
    .trim()
    .max(2048, 'URL too long')
    .refine(isAllowedUrl, { message: 'URL protocol not allowed' })
    .optional(),
);

// ---------------------------------------------------------------------------
// CMS — Live race banner (lightly editor-controlled, renders into the DOM)
// ---------------------------------------------------------------------------

export const liveRaceBannerSchema = z
  .object({
    active: z.boolean().optional(),
    eventName: z.string().max(120).optional(),
    message: z.string().max(280).optional(),
    liveResultsUrl: safeUrlSchema,
    ctaLabel: z.string().max(40).optional(),
    tone: z.enum(['navy', 'gold', 'blade']).optional(),
  })
  .strip();

export type LiveRaceBannerInput = z.infer<typeof liveRaceBannerSchema>;

/**
 * Validate an editor-controlled live race banner. Returns null if validation
 * fails — that's the same shape `safeFetch` returns when content is missing,
 * so the renderer just skips the banner instead of throwing during build.
 */
export function validateLiveRaceBanner(input: unknown): LiveRaceBannerInput | null {
  if (input == null || typeof input !== 'object') return null;
  const result = liveRaceBannerSchema.safeParse(input);
  if (!result.success) {
    if (import.meta.env.DEV) {
      const summary = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      console.warn('[validation] liveRaceBanner rejected:', summary);
    }
    return null;
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// Form input — Trial form (client-side validation before AJAX submit)
// ---------------------------------------------------------------------------

const requiredString = (max: number, label: string) =>
  z
    .string({ message: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`);

/** Treat null / '' / undefined as "not provided"; otherwise pass through. */
const blankToUndefined = (val: unknown): unknown => {
  if (val == null) return undefined;
  if (typeof val === 'string' && val.trim() === '') return undefined;
  return val;
};

const optionalString = (max: number) =>
  z.preprocess(blankToUndefined, z.string().trim().max(max).optional());

const optionalIntInRange = (min: number, max: number, low: string, high: string) =>
  z.preprocess(blankToUndefined, z.coerce.number().int().min(min, low).max(max, high).optional());

/**
 * Trial-form schema. Matches the field names rendered in `/squads/trial/`.
 *
 * The honeypot (`_gotcha`) and the consent checkbox are intentionally also
 * validated — if either is missing or the honeypot is non-empty, we reject
 * before the network call even fires.
 */
export const trialFormSchema = z
  .object({
    firstName: requiredString(60, 'First name'),
    lastName: requiredString(60, 'Last name'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Email is required')
      .max(254, 'Email too long')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is not valid'),
    phone: z
      .string()
      .trim()
      .min(7, 'Phone number is too short')
      .max(20, 'Phone number is too long')
      .regex(/^[0-9+()\-\s]+$/, 'Phone number contains invalid characters'),
    course: requiredString(120, 'Course'),
    intake: z.enum(['september', 'january', 'unsure'], {
      message: 'Select which intake',
    }),
    experience: z.enum(['none', 'school', 'gb', 'other'], {
      message: 'Select an experience level',
    }),
    // Only asked of applicants with prior rowing — it decides which captain is
    // copied. Optional here, then required conditionally in the refinement
    // below, so a novice is never blocked by a question they never saw.
    squad: z.preprocess(blankToUndefined, z.enum(['mens', 'womens', 'unspecified']).optional()),
    height: optionalIntInRange(140, 220, 'Height seems too low', 'Height seems too high'),
    weight: optionalIntInRange(40, 140, 'Weight seems too low', 'Weight seems too high'),
    pb2k: optionalString(20),
    message: optionalString(1000),
    // An unchecked checkbox is omitted from FormData entirely, so *presence*
    // is the consent signal. Deliberately not matched against a specific
    // string: hard-coding `'on'` here silently rejected every real submission
    // once `Checkbox.astro` started rendering `value="yes"`.
    welfare: z.preprocess(
      (val) => (val == null || val === '' || val === false || val === 'false' ? undefined : true),
      z.literal(true, { message: 'You must agree to the welfare policy' }),
    ),
    _gotcha: z.preprocess(blankToUndefined, z.undefined({ message: 'Spam detected' })),
  })
  .strip()
  .superRefine((val, ctx) => {
    if (val.experience !== 'none' && val.squad === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['squad'],
        message: 'Select which squad you would be looking to compete with',
      });
    }
  });

export type TrialFormInput = z.infer<typeof trialFormSchema>;

/**
 * Parse a FormData payload into a validated trial submission. Returns either
 * a `{ ok: true, data }` or `{ ok: false, errors }` shape so call sites can
 * surface errors inline.
 */
export function parseTrialForm(
  data: FormData,
): { ok: true; data: TrialFormInput } | { ok: false; errors: string[] } {
  const raw: Record<string, unknown> = {};
  for (const key of [
    'firstName',
    'lastName',
    'email',
    'phone',
    'course',
    'intake',
    'experience',
    'squad',
    'height',
    'weight',
    'pb2k',
    'message',
    'welfare',
    '_gotcha',
  ]) {
    const v = data.get(key);
    raw[key] = v == null ? undefined : v;
  }
  const result = trialFormSchema.safeParse(raw);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    return { ok: false, errors };
  }
  return { ok: true, data: result.data };
}

// ---------------------------------------------------------------------------
// Newsletter signup
// ---------------------------------------------------------------------------

export const newsletterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Email is required')
      .max(254, 'Email too long')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is not valid'),
    htmlemail: z.preprocess(blankToUndefined, z.undefined({ message: 'Spam detected' })),
  })
  .strip();
