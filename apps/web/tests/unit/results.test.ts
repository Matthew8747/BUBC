import { describe, expect, it } from 'vitest';
import { groupByYear, uniqueRegattas, regattaKey, ordinal } from '../../src/lib/results';
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

describe('ordinal', () => {
  it('uses st / nd / rd for 1, 2, 3', () => {
    expect(ordinal(1)).toBe('1st');
    expect(ordinal(2)).toBe('2nd');
    expect(ordinal(3)).toBe('3rd');
  });

  it('uses th for 4 through 10', () => {
    expect(ordinal(4)).toBe('4th');
    expect(ordinal(7)).toBe('7th');
    expect(ordinal(10)).toBe('10th');
  });

  it('uses th for the 11-13 exceptions', () => {
    expect(ordinal(11)).toBe('11th');
    expect(ordinal(12)).toBe('12th');
    expect(ordinal(13)).toBe('13th');
  });

  it('handles the tens correctly above 20', () => {
    expect(ordinal(21)).toBe('21st');
    expect(ordinal(22)).toBe('22nd');
    expect(ordinal(23)).toBe('23rd');
    expect(ordinal(111)).toBe('111th');
  });
});
