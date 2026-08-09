import { hashString, seededRandom } from './hash';

export function wobblyRectPath(width, height, seed, options = {}) {
  const perimeter = 2 * (width + height);
  const { jitter = Math.min(14, Math.max(3, perimeter / 160)), pointsPerSide = 5 } = options;
  const rand = seededRandom(hashString(String(seed)));
  const corners = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];

  let d = `M ${corners[0][0].toFixed(2)} ${corners[0][1].toFixed(2)} `;
  for (let side = 0; side < 4; side++) {
    const [x1, y1] = corners[side];
    const [x2, y2] = corners[(side + 1) % 4];
    for (let p = 1; p < pointsPerSide; p++) {
      const t = p / pointsPerSide;
      const x = x1 + (x2 - x1) * t + (rand() - 0.5) * jitter;
      const y = y1 + (y2 - y1) * t + (rand() - 0.5) * jitter;
      d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    d += `L ${x2.toFixed(2)} ${y2.toFixed(2)} `;
  }
  d += 'Z';
  return d;
}
