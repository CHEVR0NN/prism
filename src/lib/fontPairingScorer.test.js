import { describe, expect, it } from 'vitest';
import { scorePairing, rankPairings, pickPairing } from './fontPairingScorer';

const pairings = [
  { id: 'a', mood: { h: 0, s: 0.1, l: 0.2 } },
  { id: 'b', mood: { h: 180, s: 0.5, l: 0.5 } },
  { id: 'c', mood: { h: 30, s: 0.4, l: 0.55 } },
];

describe('scorePairing', () => {
  it('returns 0 for an identical mood vector', () => {
    expect(scorePairing({ h: 30, s: 0.4, l: 0.55 }, pairings[2].mood)).toBe(0);
  });

  it('treats hue as circular (350 close to 10)', () => {
    const near = scorePairing({ h: 350, s: 0, l: 0 }, { h: 10, s: 0, l: 0 });
    const far = scorePairing({ h: 350, s: 0, l: 0 }, { h: 170, s: 0, l: 0 });
    expect(near).toBeLessThan(far);
  });
});

describe('rankPairings', () => {
  it('sorts pairings from closest to farthest match', () => {
    const ranked = rankPairings({ h: 30, s: 0.4, l: 0.55 }, pairings);
    expect(ranked[0].pairing.id).toBe('c');
    expect(ranked[0].score).toBeLessThanOrEqual(ranked[1].score);
    expect(ranked[1].score).toBeLessThanOrEqual(ranked[2].score);
  });
});

describe('pickPairing', () => {
  it('picks the closest match when nothing is excluded', () => {
    const picked = pickPairing({ h: 30, s: 0.4, l: 0.55 }, pairings, []);
    expect(picked.id).toBe('c');
  });

  it('skips excluded ids and picks the next closest', () => {
    const picked = pickPairing({ h: 30, s: 0.4, l: 0.55 }, pairings, ['c']);
    expect(picked.id).not.toBe('c');
  });

  it('wraps around to the full ranked list once everything is excluded', () => {
    const picked = pickPairing({ h: 30, s: 0.4, l: 0.55 }, pairings, ['a', 'b', 'c']);
    expect(picked.id).toBe('c');
  });
});
