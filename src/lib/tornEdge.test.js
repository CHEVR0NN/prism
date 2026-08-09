import { describe, expect, it } from 'vitest';
import { tornEdgeClipPath } from './tornEdge';

describe('tornEdgeClipPath', () => {
  it('returns the same clip-path for the same seed', () => {
    const a = tornEdgeClipPath('chip-0');
    const b = tornEdgeClipPath('chip-0');
    expect(a).toBe(b);
  });

  it('returns a different clip-path for a different seed', () => {
    const a = tornEdgeClipPath('chip-0');
    const b = tornEdgeClipPath('chip-1');
    expect(a).not.toBe(b);
  });

  it('returns a valid CSS polygon() string', () => {
    const clip = tornEdgeClipPath('chip-x');
    expect(clip.startsWith('polygon(')).toBe(true);
    expect(clip.endsWith(')')).toBe(true);
  });
});
