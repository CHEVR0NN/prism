import { describe, expect, it } from 'vitest';
import { averagePaletteHsl, describeMood } from './colorAnalysis';

describe('averagePaletteHsl', () => {
  it('averages lightness and saturation across the palette', () => {
    const result = averagePaletteHsl(['#ffffff', '#000000']);
    expect(result.l).toBeCloseTo(0.5, 1);
  });

  it('computes a circular mean for hue (red palette stays near 0/360)', () => {
    const result = averagePaletteHsl(['#ff0000', '#fe0101']);
    expect(result.h).toBeGreaterThanOrEqual(350);
    expect(result.h).toBeLessThanOrEqual(360);
  });

  it('ignores hue for grayscale colors (no saturation)', () => {
    const result = averagePaletteHsl(['#888888', '#cccccc']);
    expect(result.s).toBeCloseTo(0, 1);
    expect(result.h).toBe(0);
  });

  it('returns zeros for an empty palette', () => {
    const result = averagePaletteHsl([]);
    expect(result).toEqual({ h: 0, s: 0, l: 0 });
  });
});

describe('describeMood', () => {
  it('describes a warm, rich, mid-light mood', () => {
    expect(describeMood({ h: 30, s: 0.35, l: 0.55 })).toBe('warm, rich, balanced');
  });

  it('describes a cool, vibrant, airy mood', () => {
    expect(describeMood({ h: 200, s: 0.7, l: 0.8 })).toBe('cool, vibrant, airy');
  });

  it('describes a moody dark neutral', () => {
    expect(describeMood({ h: 0, s: 0.05, l: 0.2 })).toBe('warm, muted, moody');
  });
});
