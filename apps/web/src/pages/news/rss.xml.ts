/**
 * RSS feed for the news section.
 *
 * Served at `/news/rss.xml`. Astro generates the document at build time from
 * the same Sanity query the index page uses, so every post that's visible to
 * readers shows up in the feed within one deploy. Subscribers that follow
 * the spec see new posts within ~60s once the Sanity webhook + Vercel deploy
 * hook are wired (see docs/DEPLOYMENT.md).
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { safeFetch } from '../../lib/sanity';
import { newsIndexQuery } from '../../lib/queries';
import { SITE } from '../../lib/seo';
import type { NewsCardData } from '../../lib/types';

export async function GET(context: APIContext) {
  const posts = (await safeFetch<NewsCardData[]>(newsIndexQuery)) ?? [];
  return rss({
    title: 'BUBC — News',
    description:
      'Race reports, squad updates, and announcements from the University of Bath Boat Club.',
    site: context.site ?? SITE.url,
    customData: '<language>en-gb</language>',
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.publishDate),
      description: post.excerpt,
      link: `/news/${post.slug}/`,
      categories: post.category ? [post.category.title] : [],
      author: post.author ?? 'BUBC',
    })),
    stylesheet: '/rss/styles.xsl',
  });
}
