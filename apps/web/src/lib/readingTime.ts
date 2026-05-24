/**
 * Reading-time estimate for Sanity PortableText body content.
 *
 * Walks the PortableText array, concatenates child text nodes, counts words,
 * and divides by 220 words/min — a common average for editorial prose.
 * Image-only or embed-only posts get a minimum of 1 min so the label is
 * never "0 min read".
 */

interface PortableSpan {
  _type?: string;
  text?: string;
  children?: PortableSpan[];
}

const WPM = 220;

export function readingTimeMinutes(value: unknown): number {
  if (!value) return 1;
  const blocks = Array.isArray(value) ? (value as PortableSpan[]) : [value as PortableSpan];
  let words = 0;
  const visit = (node: PortableSpan): void => {
    if (typeof node.text === 'string') {
      words += node.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (Array.isArray(node.children)) node.children.forEach(visit);
  };
  blocks.forEach(visit);
  return Math.max(1, Math.round(words / WPM));
}

export function readingTimeLabel(value: unknown): string {
  const mins = readingTimeMinutes(value);
  return `${mins} min read`;
}
