import { describe, expect, it } from 'vitest';
import { hashString, seededRandom } from './hash';

describe('hashString', () => {
  it('returns the same hash for the same input', () => {
    expect(hashString('#ff0000')).toBe(hashString('#ff0000'));
  });

  it('returns different hashes for different input', () => {
    expect(hashString('#ff0000')).not.toBe(hashString('#00ff00'));
  });

  it('always returns a non-negative integer', () => {
    expect(hashString('anything')).toBeGreaterThanOrEqual(0);
  });
});

describe('seededRandom', () => {
  it('produces the same sequence for the same seed', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('produces values between 0 and 1', () => {
    const rand = seededRandom(7);
    for (let i = 0; i < 20; i++) {
      const value = rand();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('produces different sequences for different seeds', () => {
    const a = seededRandom(1);
    const b = seededRandom(2);
    expect(a()).not.toBe(b());
  });
});
