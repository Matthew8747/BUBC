import { describe, expect, it } from 'vitest';
import { escapeHtml, sanitizeUrl, youtubeId, vimeoId } from '../../src/lib/html';

describe('escapeHtml', () => {
  it('escapes the five core HTML special chars', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    );
    expect(escapeHtml("it's")).toBe('it&#39;s');
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('handles null/undefined/empty without throwing', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml('')).toBe('');
  });
});

describe('sanitizeUrl', () => {
  it('allows http, https, mailto, tel', () => {
    expect(sanitizeUrl('https://bubc.co.uk')).toBe('https://bubc.co.uk');
    expect(sanitizeUrl('http://example.com/path')).toBe('http://example.com/path');
    expect(sanitizeUrl('mailto:captain@bubc.co.uk')).toBe('mailto:captain@bubc.co.uk');
    expect(sanitizeUrl('tel:+441225386000')).toBe('tel:+441225386000');
  });

  it('allows relative URLs', () => {
    expect(sanitizeUrl('/news/')).toBe('/news/');
    expect(sanitizeUrl('#section')).toBe('#section');
    expect(sanitizeUrl('?q=x')).toBe('?q=x');
    expect(sanitizeUrl('./relative')).toBe('./relative');
  });

  it('rejects javascript: in any case or with embedded whitespace', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('#');
    expect(sanitizeUrl('JavaScript:alert(1)')).toBe('#');
    // Tab-smuggled scheme — historically bypassed naive regex checks.
    expect(sanitizeUrl('java\tscript:alert(1)')).toBe('#');
    expect(sanitizeUrl('java\nscript:alert(1)')).toBe('#');
    expect(sanitizeUrl('  javascript:alert(1)')).toBe('#');
  });

  it('rejects data:, vbscript:, file:, blob:, intent:', () => {
    expect(sanitizeUrl('data:text/html,<script>')).toBe('#');
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
    expect(sanitizeUrl('file:///etc/passwd')).toBe('#');
    expect(sanitizeUrl('blob:https://example.com/abc')).toBe('#');
    expect(sanitizeUrl('intent://launch')).toBe('#');
  });

  it('rejects protocol-relative URLs', () => {
    expect(sanitizeUrl('//evil.com')).toBe('#');
    expect(sanitizeUrl('//bubc.co.uk/news/')).toBe('#');
  });

  it('handles null/undefined/empty gracefully', () => {
    expect(sanitizeUrl(null)).toBe('#');
    expect(sanitizeUrl(undefined)).toBe('#');
    expect(sanitizeUrl('')).toBe('#');
    expect(sanitizeUrl('   ')).toBe('#');
  });

  it('treats a no-protocol bare string as a relative path', () => {
    expect(sanitizeUrl('news')).toBe('news');
  });
});

describe('youtubeId', () => {
  it('extracts ID from common YouTube URL forms', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(youtubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(youtubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(youtubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns null for non-YouTube URLs even if they contain youtube.com in the path', () => {
    expect(youtubeId('https://evil.example.com/?fake=youtube.com/watch?v=xxxxxxxxxxx')).toBe(null);
    expect(youtubeId('https://example.com')).toBe(null);
  });

  it('returns null for malformed input', () => {
    expect(youtubeId(null)).toBe(null);
    expect(youtubeId(undefined)).toBe(null);
    expect(youtubeId('not a url')).toBe(null);
    expect(youtubeId('javascript:alert(1)')).toBe(null);
  });
});

describe('vimeoId', () => {
  it('extracts a numeric ID from a Vimeo URL', () => {
    expect(vimeoId('https://vimeo.com/123456789')).toBe('123456789');
    expect(vimeoId('https://player.vimeo.com/video/987654321')).toBe('987654321');
  });

  it('returns null for non-Vimeo hosts', () => {
    expect(vimeoId('https://example.com/vimeo.com/123456789')).toBe(null);
    expect(vimeoId('https://evil.com/123456789')).toBe(null);
  });

  it('returns null for malformed input', () => {
    expect(vimeoId(null)).toBe(null);
    expect(vimeoId('not a url')).toBe(null);
  });
});
