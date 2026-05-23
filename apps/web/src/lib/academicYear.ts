/**
 * UK academic year helpers.
 *
 * The UK academic year runs September through August. We treat anything from
 * 1 September onwards as the new year. Pre-September we report the year that
 * began the previous September.
 */

export function getCurrentAcademicYear(now: Date = new Date()): string {
  const year = now.getFullYear();
  const monthIndex = now.getMonth(); // 0 = Jan, 8 = Sep
  const startYear = monthIndex >= 8 ? year : year - 1;
  const endShort = (startYear + 1).toString().slice(-2);
  return `${startYear}/${endShort}`;
}
