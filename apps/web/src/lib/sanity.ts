/**
 * Sanity client + helpers for the Astro frontend.
 *
 * Used at build time by Astro pages to fetch content via GROQ. The client is
 * configured against the `production` dataset by default with the CDN enabled —
 * we're a static site, so we want the cached, faster CDN response. Override via
 * env vars for preview / draft mode.
 */
import { createClient, type ClientConfig } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

const projectId = import.meta.env.SANITY_PROJECT_ID ?? 'j7zcx618';
const dataset = import.meta.env.SANITY_DATASET ?? 'production';
const apiVersion = '2025-01-01';

const config: ClientConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
};

export const sanity = createClient(config);

/** Build responsive image URLs from a Sanity image reference. */
const builder = createImageUrlBuilder({ projectId, dataset });
export const urlFor = (source: SanityImageSource) => builder.image(source);

/**
 * Whether the site is running with a real Sanity project that has content.
 * Pages should fall back to placeholders / sample data when this is false.
 */
export const hasSanityConfig = Boolean(projectId);

/**
 * Safe wrapper that returns null when a query fails (e.g. empty dataset, no
 * network, missing document). Lets pages render gracefully during build before
 * the editor has populated content.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  try {
    return await sanity.fetch<T>(query, params);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[sanity] query failed, returning null:', error);
    }
    return null;
  }
}
