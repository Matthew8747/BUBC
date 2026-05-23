import { describe, expect, it } from 'vitest';
import { resolveSeo, SITE } from '../../src/lib/seo';

describe('resolveSeo', () => {
  const url = new URL('https://bubc.co.uk/squads/senior-men/');

  it('falls back to site name when no title is provided', () => {
    const out = resolveSeo({}, url);
    expect(out.title).toBe(SITE.name);
  });

  it('suffixes the short name when a page title is provided', () => {
    const out = resolveSeo({ title: 'News' }, url);
    expect(out.title).toBe(`News — ${SITE.shortName}`);
  });

  it('uses the default description when none is provided', () => {
    const out = resolveSeo({}, url);
    expect(out.description).toBe(SITE.defaultDescription);
  });

  it('derives canonical URL from the current pathname when not overridden', () => {
    const out = resolveSeo({}, url);
    expect(out.canonical).toBe('https://bubc.co.uk/squads/senior-men/');
  });

  it('honours an explicit canonical override', () => {
    const out = resolveSeo({ canonical: 'https://bubc.co.uk/canonical-target/' }, url);
    expect(out.canonical).toBe('https://bubc.co.uk/canonical-target/');
  });

  it('flags noIndex when requested', () => {
    expect(resolveSeo({ noIndex: true }, url).noIndex).toBe(true);
    expect(resolveSeo({ noIndex: false }, url).noIndex).toBe(false);
    expect(resolveSeo({}, url).noIndex).toBe(false);
  });
});
