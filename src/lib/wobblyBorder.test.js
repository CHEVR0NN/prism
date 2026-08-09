import { describe, expect, it } from 'vitest';
import { wobblyRectPath } from './wobblyBorder';

describe('wobblyRectPath', () => {
  it('returns the same path for the same seed and size', () => {
    const a = wobblyRectPath(200, 100, 'card-1');
    const b = wobblyRectPath(200, 100, 'card-1');
    expect(a).toBe(b);
  });

  it('returns a different path for a different seed', () => {
    const a = wobblyRectPath(200, 100, 'card-1');
    const b = wobblyRectPath(200, 100, 'card-2');
    expect(a).not.toBe(b);
  });

  it('returns a valid SVG path string starting with M and ending with Z', () => {
    const path = wobblyRectPath(150, 80, 'x');
    expect(path.startsWith('M')).toBe(true);
    expect(path.trim().endsWith('Z')).toBe(true);
  });
});
