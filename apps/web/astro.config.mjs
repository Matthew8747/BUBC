// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * 301 redirects from legacy WordPress URLs to the new site structure.
 *
 * Source: plan.md §1 (URL migration map). Every old URL must 301 so:
 *   - existing inbound links survive
 *   - bookmarks and shared social posts still resolve
 *   - search engines pick up the new URL with link equity preserved
 *
 * Keep this table in sync with plan.md §1. If the IA changes, update both.
 */
const legacyRedirects = {
  '/coaching-team/': '/coaching/',
  '/facilities-fleet/': '/boathouse/',
  '/sponsors/': '/support/sponsor/',
  '/history-2/': '/about/history/',
  '/senior-squad/': '/squads/senior-men/',
  '/women-senior-squad/': '/squads/senior-women/',
  '/fundraising/': '/support/campaigns/',
  '/donate/': '/support/donate/',
  '/single-donation/': '/support/donate/',
  '/bubc-alumni/': '/alumni/',
  '/meles-boat-club/': '/alumni/meles/',
  '/join-meles-bc/': '/alumni/meles/#join',
  '/our-impact/': '/support/campaigns/',
  '/buy-a-boat/': '/support/buy-a-boat/',
  '/chairs-of-bubc/': '/about/chairs/',
  '/henley-honours/': '/about/henley-honours/',
  '/blazers/': '/about/blazers/',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://bubc.co.uk',
  output: 'static',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  redirects: legacyRedirects,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/styleguide') &&
        !page.includes('/privacy') &&
        !page.includes('/404') &&
        !page.includes('/og/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // Boost home + main hubs; demote deep detail pages.
        if (item.url === 'https://bubc.co.uk/') return { ...item, priority: 1.0 };
        if (/\/(squads|news|about|support|coaching|boathouse|committee|alumni)\/$/.test(item.url))
          return { ...item, priority: 0.9 };
        return item;
      },
    }),
  ],
  vite: {
    // @ts-expect-error vite version conflict between workspace dependencies
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['cdn.sanity.io'],
  },
});
