import { describe, it, expect } from 'vitest';
import { parseHubbubTotals } from './hubbub';

describe('parseHubbubTotals', () => {
  it('reads raised + donors from real Hubbub project markup', () => {
    // Lifted verbatim from https://bath.hubbub.net/p/BUBC/
    const html =
      '<p><strong><var>£5,442</var></strong> has been raised from <strong><var>51</var></strong> donors.</p>';
    expect(parseHubbubTotals(html)).toEqual({ raised: 5442, donors: 51 });
  });

  it('handles large comma-separated amounts and donor counts', () => {
    const html =
      '<strong><var>£152,500</var></strong> has been raised from <strong><var>1,203</var></strong> donors.';
    expect(parseHubbubTotals(html)).toEqual({ raised: 152500, donors: 1203 });
  });

  it('returns null when the expected markup is absent', () => {
    expect(parseHubbubTotals('<p>Support our club!</p>')).toBeNull();
    expect(parseHubbubTotals('')).toBeNull();
  });
});
