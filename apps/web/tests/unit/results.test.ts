import { describe, expect, it } from 'vitest';
import { groupByYear, uniqueRegattas, regattaKey } from '../../src/lib/results';
import type { RegattaResult } from '../../src/lib/types';

const sample: RegattaResult[] = [
  { _id: '1', year: 2024, regatta: 'BUCS Regatta', event: 'Champ 8+', finish: 'Winners' },
  { _id: '2', year: 2024, regatta: 'BUCS Regatta', event: 'Beginner 4+', finish: 'A final' },
  {
    _id: '3',
    year: 2023,
    regatta: 'Henley Royal Regatta',
    event: 'Temple Challenge Cup',
    finish: 'QF',
  },
  { _id: '4', year: 2024, regatta: 'Henley Royal Regatta', event: 'Temple', finish: 'R32' },
];

describe('groupByYear', () => {
  it('groups by year, newest first', () => {
    const out = groupByYear(sample);
    expect(out.map((g) => g.year)).toEqual([2024, 2023]);
  });

  it('sorts entries inside a year by regatta then event', () => {
    const out = groupByYear(sample);
    const year2024 = out.find((g) => g.year === 2024)!;
    expect(year2024.results.map((r) => r.event)).toEqual(['Beginner 4+', 'Champ 8+', 'Temple']);
  });

  it('returns an empty array for empty input', () => {
    expect(groupByYear([])).toEqual([]);
  });
});

describe('uniqueRegattas', () => {
  it('returns a sorted, deduped regatta list', () => {
    expect(uniqueRegattas(sample)).toEqual(['BUCS Regatta', 'Henley Royal Regatta']);
  });
});

describe('regattaKey', () => {
  it('produces a stable slug', () => {
    expect(regattaKey('BUCS Regatta')).toBe('bucs-regatta');
    expect(regattaKey("Henley Women's Regatta")).toBe('henley-women-s-regatta');
    expect(regattaKey('Tideway Head')).toBe('tideway-head');
  });
});
