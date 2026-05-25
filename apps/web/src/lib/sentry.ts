/**
 * Sentry browser bootstrap — only runs in the browser, and only when a DSN
 * is configured. Imported by `BaseLayout.astro` via a client script.
 *
 * Design notes:
 *   - Dynamic import keeps Sentry out of the bundle when unused. The
 *     `PUBLIC_SENTRY_DSN` check is statically known to Vite, so when unset
 *     the entire branch (and the @sentry/browser dep) gets tree-shaken.
 *   - Bot user-agents are dropped client-side before send to keep the
 *     monthly event quota for real users.
 *   - We disable session replay and tracing — error tracking only — which
 *     keeps the runtime footprint to ~25KB gzipped and well under the
 *     free-tier monthly event budget.
 */
const BOT_UA_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /pingdom/i,
  /headless/i,
  /lighthouse/i,
  /chrome-lighthouse/i,
  /uptime/i,
];

function isBot(ua: string | undefined): boolean {
  if (!ua) return false;
  return BOT_UA_PATTERNS.some((re) => re.test(ua));
}

export async function initSentry(): Promise<void> {
  const dsn = import.meta.env.PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  if (typeof window === 'undefined') return;
  if (isBot(navigator.userAgent)) return;

  try {
    const Sentry = await import('@sentry/browser');
    Sentry.init({
      dsn,
      // Errors only — no tracing, no replays. Free tier is 5k events/mo.
      tracesSampleRate: 0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
      // Environment hint based on the host. Vercel previews get tagged so
      // they don't pollute production error trends.
      environment:
        window.location.hostname === 'bubc.co.uk' || window.location.hostname === 'www.bubc.co.uk'
          ? 'production'
          : 'preview',
      // Don't send breadcrumbs for cookie / 3rd-party resource failures; we
      // can't action them and they're noisy.
      beforeSend(event) {
        const ua = navigator.userAgent;
        if (isBot(ua)) return null;
        // Filter common browser extension noise.
        const msg = event.message ?? event.exception?.values?.[0]?.value ?? '';
        if (/ResizeObserver loop|Script error\.?$/i.test(msg)) return null;
        return event;
      },
    });
  } catch {
    // Never let monitoring crash the app.
  }
}
