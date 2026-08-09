function circularHueDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export function scorePairing(palette, mood) {
  const hueDist = circularHueDistance(palette.h, mood.h) / 180;
  const satDist = Math.abs(palette.s - mood.s);
  const lightDist = Math.abs(palette.l - mood.l);
  return hueDist + satDist + lightDist;
}

export function rankPairings(palette, pairings) {
  return pairings
    .map((pairing) => ({ pairing, score: scorePairing(palette, pairing.mood) }))
    .sort((a, b) => a.score - b.score);
}

export function pickPairing(palette, pairings, excludeIds = []) {
  const ranked = rankPairings(palette, pairings);
  const untried = ranked.filter((entry) => !excludeIds.includes(entry.pairing.id));
  const pool = untried.length > 0 ? untried : ranked;
  return pool[0].pairing;
}
