import { describe, expect, it } from 'vitest';
import { fontPairings, buildGoogleFontsUrl } from './fontPairings';

describe('fontPairings', () => {
  it('has between 15 and 30 curated pairings', () => {
    expect(fontPairings.length).toBeGreaterThanOrEqual(15);
    expect(fontPairings.length).toBeLessThanOrEqual(30);
  });

  it('gives every pairing a unique id, display font, body font, and mood vector', () => {
    const ids = new Set();
    for (const pairing of fontPairings) {
      expect(typeof pairing.id).toBe('string');
      expect(ids.has(pairing.id)).toBe(false);
      ids.add(pairing.id);
      expect(pairing.display.name).toBeTruthy();
      expect(pairing.body.name).toBeTruthy();
      expect(pairing.mood.h).toBeGreaterThanOrEqual(0);
      expect(pairing.mood.s).toBeGreaterThanOrEqual(0);
      expect(pairing.mood.l).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('buildGoogleFontsUrl', () => {
  it('builds a css2 URL containing both family names', () => {
    const url = buildGoogleFontsUrl([
      { name: 'Fraunces', weights: [400, 600] },
      { name: 'Karla', weights: [400] },
    ]);
    expect(url).toContain('https://fonts.googleapis.com/css2?');
    expect(url).toContain('family=Fraunces');
    expect(url).toContain('family=Karla');
    expect(url).toContain('display=swap');
  });
});
