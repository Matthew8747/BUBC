// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bubc.co.uk',
  output: 'static',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/styleguide') && !page.includes('/privacy') && !page.includes('/404'),
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
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['cdn.sanity.io'],
  },
});
