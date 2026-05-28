# Security

> How BUBC.co.uk handles trust boundaries, secrets, and user input. Read this before changing forms, headers, the CMS schema, or anything that crosses into the DOM. Last updated: 2026-05-28.

## Posture

The public site is a **static Astro build deployed to Vercel**. There is no application server, no database, no user-session state. Every page is pre-rendered at build time. That removes most of the OWASP Top 10 by construction:

| OWASP risk                          | How it's handled here                                                                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 Broken Access Control           | No private routes — there's nothing to access-control on the public site. Editorial access goes through Sanity Studio's own auth.                                |
| A02 Cryptographic Failures          | TLS terminated at Vercel; HSTS + `upgrade-insecure-requests` enforced via `vercel.json`. No secret material is stored client-side.                               |
| A03 Injection                       | No SQL. GROQ queries are parameterised (`$slug`, `$year`). PortableText/embeds go through `sanitizeUrl` + `escapeHtml`. See `lib/html.ts`.                       |
| A04 Insecure Design                 | Forms post directly to managed third parties (Formspree, Buttondown). Zod schemas at the boundary in `lib/validation.ts`. Honeypot + minimum-fill-time anti-bot. |
| A05 Security Misconfiguration       | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all set in `vercel.json`.                                                |
| A06 Vulnerable Components           | `pnpm audit` runnable locally + CI catches lockfile drift. See **Dependencies** below.                                                                           |
| A07 Identification & Authentication | No bespoke auth. Editorial auth = Sanity. Deploy auth = GitHub + Vercel.                                                                                         |
| A08 Software & Data Integrity       | Lockfile-pinned installs (`--frozen-lockfile`). Vercel deploys are immutable; rollback is a one-click promote.                                                   |
| A09 Logging & Monitoring            | Sentry (browser, error-only, no DSN-by-default no-op). Cloudflare Web Analytics. Filtered for bots.                                                              |
| A10 SSRF                            | Static site, no server-side fetches at request time. Build-time fetches go only to Sanity's CDN over HTTPS.                                                      |

## Trust boundaries

```
┌─────────────────┐    build-time       ┌──────────────┐
│  Sanity (CMS)   │ ──── HTTPS GROQ ───▶│ Astro build  │
└─────────────────┘                     └──────┬───────┘
                                               │ static HTML
                                               ▼
┌─────────────────┐  visitor ◀── HTTPS ──┌──────────────┐
│   browser       │ ──── form POST ─────▶│ Formspree    │
│                 │ ──── form POST ─────▶│ Buttondown   │
│                 │ ──── error JS  ─────▶│ Sentry       │
│                 │ ──── beacon    ─────▶│ Cloudflare   │
└─────────────────┘                      └──────────────┘
```

Anything **inside the Astro build** is trusted: it's our code or Sanity content we've already validated. Anything **leaving the browser** goes to a managed third party that owns its own rate-limiting + abuse handling.

The two surfaces we own and have to defend:

1. **HTML output.** Anything that ends up in a string concatenated into HTML (PortableText, the live race banner URL, share URLs, OG metadata). All routes through `lib/html.ts` (`escapeHtml` + `sanitizeUrl`). See **Input/output handling** below.
2. **Form input on the way out.** Trial form (Formspree) and newsletter signup (Buttondown). Validated client-side with Zod in `lib/validation.ts` before the network request fires.

## Secrets handling

There are **no server-only secrets in the public bundle.** Audit the file `apps/web/src/env.d.ts` — every variable is either:

- Public-by-design: `PUBLIC_FORMSPREE_TRIAL_ID`, `PUBLIC_BUTTONDOWN_USERNAME`, `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`, `PUBLIC_SENTRY_DSN`. These are designed to be visible client-side; the third parties handle rate-limiting + verification server-side.
- Build-time only: `SANITY_PROJECT_ID`, `SANITY_DATASET`. Sanity project IDs are public (they appear in CDN URLs).
- Server-only and not currently used: `SANITY_API_READ_TOKEN`. If we ever wire draft previews, this token will be used in a server endpoint, **never embedded client-side**.

### Rules

- **Never** prefix a secret with `PUBLIC_` unless it's already public.
- **Never** hardcode a token in source. Use environment variables exclusively.
- **Never** commit `.env*` files. The `.gitignore` blocks `.env` and `.env.local`; `apps/web/.env.example` is the only checked-in env template.
- Use Vercel project settings → Environment Variables for production secrets. Apply to Production + Preview unless a value is environment-specific.
- For key rotation: in Vercel, replace the variable value and trigger a redeploy. Old deploys keep the old value (immutable), so rotate by promoting the new deploy.

## Input / output handling

### `lib/html.ts`

The single hardening surface for any string that ends up in HTML.

- `escapeHtml(s)` — encodes `& < > " '`. Null-safe.
- `sanitizeUrl(s)` — deny-by-default URL allow-list. Allows relative URLs (`/`, `#`, `?`, `.`), and `http:`, `https:`, `mailto:`, `tel:` only. **Drops `javascript:`, `data:`, `vbscript:`, `file:`, `blob:`, protocol-relative `//evil.com`, and control-character-smuggled schemes (`java\tscript:`) to `#`.**
- `youtubeId(s)` / `vimeoId(s)` — strict `new URL()`-based parsers. They cannot be tricked by URLs that contain `youtube.com` in their path or query.

Every editor-controlled URL field passes through `sanitizeUrl` before reaching `href` / `src`. Every editor-controlled text field passes through `escapeHtml` before being interpolated into raw HTML.

### `lib/validation.ts`

Zod schemas at the form boundary:

- `trialFormSchema` — full schema for `/squads/trial/`. Enforces required fields, max lengths, email format, phone format, height/weight ranges, honeypot empty, consent checkbox checked.
- `newsletterSchema` — email format + honeypot.
- `liveRaceBannerSchema` — re-validates the editor-controlled live race banner before the layout renders it. URL must pass the same allow-list as `sanitizeUrl`.

### `set:html` audit (3 sites)

- `BaseLayout.astro` JSON-LD — stringifies a hardcoded object of `SITE` constants. No user input. Safe.
- `JsonLd.astro` — generic helper; callers are pages we control. The Astro `set:html` plus `JSON.stringify` is the standard JSON-LD injection pattern.
- `PortableText.astro` — renders `@portabletext/to-html` output with our serializers. Every serializer escapes text with `escapeHtml()` and sanitises URLs with `sanitizeUrl()`. Embeds (YouTube/Vimeo) parse the URL with the strict `youtubeId`/`vimeoId` helpers before reaching the iframe `src`.

## Forms: anti-abuse

Both forms layer three defences:

1. **Honeypot** — hidden `_gotcha` / `htmlemail` field that real browsers skip. Bots fill it; we drop the submission silently.
2. **Minimum fill time** — submissions less than 2s (trial) / 1.5s (newsletter) after the form mounts are rejected client-side. Real humans take seconds; bots submit instantly.
3. **Zod schema** — strict shape + format validation before the network request. Bad payloads never leave the browser.

Server-side, **Formspree** and **Buttondown** each have their own rate limiting and abuse detection — we rely on those for IP-based throttling we can't implement on a static site.

For mass-spam protection, both third parties offer Turnstile / reCAPTCHA upgrades from their dashboards if needed.

## Security headers

Set in `vercel.json` at the project root. Applied by Vercel to every response.

- **`Content-Security-Policy`** — strict allow-list; `default-src 'self'`, no remote scripts except Cloudflare Insights and Sentry, `frame-ancestors 'none'`, `object-src 'none'`, `upgrade-insecure-requests`.
- **`Strict-Transport-Security`** — `max-age=2y; includeSubDomains; preload`.
- **`X-Content-Type-Options: nosniff`** — disables MIME sniffing.
- **`X-Frame-Options: DENY`** — belt-and-braces with the CSP `frame-ancestors`.
- **`Referrer-Policy: strict-origin-when-cross-origin`** — preserves analytics while not leaking paths to third parties.
- **`Permissions-Policy`** — denies camera, microphone, geolocation, payment APIs, etc. We don't use them.
- **`Cross-Origin-Opener-Policy: same-origin`** + **`Cross-Origin-Resource-Policy: same-origin`** — site isolation defaults; OG images and fonts override to `cross-origin` so they're embeddable.

### CSP allow-list rationale

| Source                                                    | Why                           |
| --------------------------------------------------------- | ----------------------------- |
| `cdn.sanity.io`                                           | All CMS imagery               |
| `static.cloudflareinsights.com`                           | Web Analytics beacon          |
| `*.ingest.sentry.io` + `browser.sentry-cdn.com`           | Error reporting transport     |
| `formspree.io`                                            | Trial form submission         |
| `buttondown.com`, `buttondown.email`                      | Newsletter signup             |
| `youtube-nocookie.com`, `youtube.com`, `player.vimeo.com` | PortableText video embeds     |
| `openstreetmap.org`                                       | Boathouse location map iframe |

If you add a new external dependency, **update the CSP first**, deploy to preview, verify the new resource loads without browser CSP-violation console errors, then merge to main.

### Local vs Vercel

`vercel.json` headers are **only honoured on Vercel deploys**, not on the local `pnpm dev` server or `pnpm preview`. The Playwright security-headers test skips itself when run locally.

## Dependency security

### Cadence

- **Every PR:** CI runs `pnpm install --frozen-lockfile`. Lockfile drift fails the install.
- **Every commit-or-push to main:** Vercel reinstalls from the lockfile. Same drift-check.
- **Quarterly (or before launch):** `pnpm audit --prod` from the repo root. Address any production-level moderate-or-higher vulnerabilities; document any deferrals here.
- **Annually:** review `package.json` dependency list. Remove anything unused.

### Current known issues (acceptable)

`pnpm audit --prod` reports two moderate vulnerabilities, both in **transitive dependencies of the Sanity Studio CLI** (`apps/studio`):

- `js-yaml@<3.14.2` — prototype pollution. Path: `@vercel/frameworks → js-yaml`.
- `uuid@<11.1.1` — buffer-bounds check. Path: `@sanity/uuid → uuid`.

**Why not blocking:** the Studio app is the editorial CMS, deployed separately to `bubc.sanity.studio`, accessed by ~5 authenticated editors. The vulnerabilities are not in `apps/web` (the public bundle) and not reachable from public requests. Track upstream Sanity for fixes; upgrade when Sanity Studio v5 ships a release that re-pins both.

### Reporting a vulnerability

Email **press@bubc.co.uk** with subject `Security: <short summary>`. We'll acknowledge within 7 days. For sensitive material, request a PGP key in the first message; we'll generate and reply with the public key.

## Sanity (CMS) authorisation

| Role                                            | Can do                                                                                                            | Cannot do                                                                        |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Admin** (1–2 people max)                      | Edit any document type. Edit `settings` and `homePage` singletons. Manage editors. Manage webhooks.               | Push code.                                                                       |
| **Editor** (committee comms officer + captains) | Create/edit `newsPost`, `event`, `boat`, `committeeMember`, `campaign`, `chair`, `coach`. Upload images. Publish. | Touch `settings` / `homePage` singletons. Touch webhook config. Add new editors. |

These roles are configured at <https://www.sanity.io/manage> → project `j7zcx618` → Members. The boundaries are enforced by Sanity, not by us.

The studio-internal `structure.ts` config marks singletons (`homePage`, `settings`) so editors can't accidentally duplicate or delete them — but real admin-tier access still goes through Sanity's own role system.

### Sanity webhook → Vercel deploy hook

The webhook URL is a secret (anyone with it can trigger an unlimited number of Vercel builds, exhausting our free-tier deploy quota). Steps:

- Generate at Vercel → Project → Git → Deploy Hooks. Treat the resulting URL as sensitive.
- Paste only into Sanity webhook config. Never log it or commit it.
- If rotated, immediately remove the old hook from Sanity to avoid double-deploys.

## Deployment authorisation

- **GitHub `main`** — requires a passing CI run + (when there's more than one developer) one approving review. Branch protection enforces this server-side.
- **Vercel** — only the connected GitHub account can promote a preview to production via the dashboard. Deploys from `main` happen automatically.
- **Pre-push hook** (`.husky/pre-push`) — runs `format:check && lint && typecheck` locally so CI rarely catches anything pre-push misses.

## Incident response (rollback)

A regression goes live:

1. Vercel → Deployments → previous good deploy → "Promote to Production". Live within seconds.
2. If the regression is content-side (someone published a bad post), the editor can un-publish in Sanity; the webhook redeploys automatically.

A security regression is discovered:

1. Promote the previous deploy immediately (step 1 above).
2. Open a PR with the fix. CI must pass.
3. Once merged, the new deploy supersedes the rolled-back one.
4. Document the incident as a comment on the closing PR + add to this file if the threat model changes.

## File pointers

| What                                     | Where                                                   |
| ---------------------------------------- | ------------------------------------------------------- |
| HTML escape / URL sanitiser              | `apps/web/src/lib/html.ts`                              |
| Zod validation schemas                   | `apps/web/src/lib/validation.ts`                        |
| Security response headers                | `vercel.json` (repo root)                               |
| Sentry init (browser, error-only)        | `apps/web/src/lib/sentry.ts`                            |
| Trial form (input, AJAX submit)          | `apps/web/src/pages/squads/trial.astro`                 |
| Newsletter signup                        | `apps/web/src/components/layout/NewsletterSignup.astro` |
| Live race banner (editor-controlled URL) | `apps/web/src/components/layout/LiveRaceBanner.astro`   |
| PortableText serializers                 | `apps/web/src/components/content/PortableText.astro`    |
| Unit tests for hardening surfaces        | `apps/web/tests/unit/{html,validation}.test.ts`         |
