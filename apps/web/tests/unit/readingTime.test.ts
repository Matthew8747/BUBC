import { describe, expect, it } from 'vitest';
import { readingTimeMinutes, readingTimeLabel } from '../../src/lib/readingTime';

describe('readingTimeMinutes', () => {
  it('returns a minimum of 1 for empty input', () => {
    expect(readingTimeMinutes(undefined)).toBe(1);
    expect(readingTimeMinutes(null)).toBe(1);
    expect(readingTimeMinutes([])).toBe(1);
  });

  it('counts words across nested PortableText spans', () => {
    const body = [
      {
        _type: 'block',
        children: [
          { _type: 'span', text: 'one two three' },
          { _type: 'span', text: 'four five' },
        ],
      },
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'six seven eight nine ten' }],
      },
    ];
    // 10 words / 220 wpm → rounds to 1.
    expect(readingTimeMinutes(body)).toBe(1);
  });

  it('rounds longer articles up to a few minutes', () => {
    const word = { _type: 'span', text: 'word' };
    const longBlock = {
      _type: 'block',
      children: Array.from({ length: 660 }, () => word),
    };
    // 660 words / 220 wpm = 3 mins exactly.
    expect(readingTimeMinutes([longBlock])).toBe(3);
  });

  it('produces a readable label', () => {
    expect(readingTimeLabel(undefined)).toBe('1 min read');
  });

  it('ignores nodes that are not strings', () => {
    expect(readingTimeMinutes([{ _type: 'imageBlock' }])).toBe(1);
  });
});
