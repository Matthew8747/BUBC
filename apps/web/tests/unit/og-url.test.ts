import { describe, expect, it } from 'vitest';
import { ogImage } from '../../src/lib/og/url';

describe('ogImage', () => {
  it('returns the known page card when slug is in the catalog', () => {
    expect(ogImage({ kind: 'page', slug: 'home' })).toBe('/og/home.png');
    expect(ogImage({ kind: 'page', slug: 'alumni' })).toBe('/og/alumni.png');
    expect(ogImage({ kind: 'page', slug: 'henley-honours' })).toBe('/og/henley-honours.png');
  });

  it('falls back to the default card when page slug is unknown', () => {
    expect(ogImage({ kind: 'page', slug: 'unknown-slug-here' })).toBe('/og/default.png');
  });

  it('prefixes dynamic content kinds with the type', () => {
    expect(ogImage({ kind: 'news', slug: 'temple-win' })).toBe('/og/news-temple-win.png');
    expect(ogImage({ kind: 'squad', slug: 'senior-men' })).toBe('/og/squad-senior-men.png');
    expect(ogImage({ kind: 'olympian', slug: 'matt-langridge' })).toBe(
      '/og/olympian-matt-langridge.png',
    );
    expect(ogImage({ kind: 'alumni', slug: 'jane-doe' })).toBe('/og/alumni-jane-doe.png');
    expect(ogImage({ kind: 'boat', slug: 'avon-blade' })).toBe('/og/boat-avon-blade.png');
    expect(ogImage({ kind: 'campaign', slug: 'training-camp-2026' })).toBe(
      '/og/campaign-training-camp-2026.png',
    );
  });
});
