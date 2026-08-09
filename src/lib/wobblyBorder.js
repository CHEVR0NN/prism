import { hashString, seededRandom } from './hash';

export function wobblyRectPath(width, height, seed, options = {}) {
  const { jitter = 4, pointsPerSide = 3 } = options;
  const rand = seededRandom(hashString(String(seed)));
  const corners = [
    [0, 0],
    [width, 0],
    [width, height],
    [0, height],
  ];

  const points = [];
  for (let side = 0; side < 4; side++) {
    const [x1, y1] = corners[side];
    const [x2, y2] = corners[(side + 1) % 4];
    for (let p = 0; p < pointsPerSide; p++) {
      const t = p / pointsPerSide;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      const dx = (rand() - 0.5) * jitter;
      const dy = (rand() - 0.5) * jitter;
      points.push([x + dx, y + dy]);
    }
  }

  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)} `;
  for (let i = 1; i <= points.length; i++) {
    const [cx, cy] = points[i % points.length];
    const [px, py] = points[i - 1];
    const mx = (px + cx) / 2;
    const my = (py + cy) / 2;
    d += `Q ${px.toFixed(2)} ${py.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)} `;
  }
  d += 'Z';
  return d;
}
