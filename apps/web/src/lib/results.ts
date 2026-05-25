/**
 * Helpers for the /results/ regatta archive.
 *
 * Pure functions: grouping + filter-pill counts. Keeps the Astro page slim
 * and the logic unit-testable.
 */
import type { RegattaResult } from './types';

export interface YearGroup {
  year: number;
  results: RegattaResult[];
}

/**
 * Group results by year (newest first), then sort within each year by regatta
 * then event so the page renders predictably.
 */
export function groupByYear(results: RegattaResult[]): YearGroup[] {
  const map = new Map<number, RegattaResult[]>();
  for (const r of results) {
    if (!map.has(r.year)) map.set(r.year, []);
    map.get(r.year)!.push(r);
  }
  for (const list of map.values()) {
    list.sort((a, b) => {
      const r = (a.regatta ?? '').localeCompare(b.regatta ?? '');
      if (r !== 0) return r;
      return (a.event ?? '').localeCompare(b.event ?? '');
    });
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, results: list }));
}

/** Return a sorted, deduped list of regatta names for the filter pills. */
export function uniqueRegattas(results: RegattaResult[]): string[] {
  const set = new Set<string>();
  for (const r of results) {
    if (r.regatta) set.add(r.regatta);
  }
  return Array.from(set).sort();
}

/** Slug-safe key for a regatta name — used as data-attribute hooks. */
export function regattaKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
