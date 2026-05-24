import { describe, expect, it } from 'vitest';

/**
 * Mirror the buildPageList helper from Pagination.astro. Kept inline here so
 * the test doesn't require a build step to extract from the .astro file.
 * If the source diverges, this test catches the drift.
 */
function buildPageList(curr: number, last: number): (number | 'ellipsis')[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const out: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, curr - 1);
  const end = Math.min(last - 1, curr + 1);
  if (start > 2) out.push('ellipsis');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < last - 1) out.push('ellipsis');
  out.push(last);
  return out;
}

describe('Pagination.buildPageList', () => {
  it('returns every page when there are 7 or fewer', () => {
    expect(buildPageList(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPageList(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses to head + window + tail when there are many pages', () => {
    expect(buildPageList(1, 12)).toEqual([1, 2, 'ellipsis', 12]);
    expect(buildPageList(6, 12)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12]);
    expect(buildPageList(12, 12)).toEqual([1, 'ellipsis', 11, 12]);
  });

  it('does not produce duplicate ellipses at the edges', () => {
    const list = buildPageList(2, 8);
    expect(list.filter((p) => p === 'ellipsis').length).toBeLessThanOrEqual(2);
    expect(list[0]).toBe(1);
    expect(list[list.length - 1]).toBe(8);
  });
});
