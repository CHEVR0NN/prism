import { hashString, seededRandom } from './hash';

export function tornEdgeClipPath(seed, options = {}) {
  const { segments = 8, jitter = 4 } = options;
  const rand = seededRandom(hashString(String(seed)) + 1);

  const top = [];
  const bottom = [];
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 100;
    const yTop = (rand() - 0.5) * jitter;
    const yBottom = 100 + (rand() - 0.5) * jitter;
    top.push(`${x.toFixed(2)}% ${yTop.toFixed(2)}%`);
    bottom.push(`${x.toFixed(2)}% ${yBottom.toFixed(2)}%`);
  }

  const points = [...top, ...bottom.reverse()];
  return `polygon(${points.join(', ')})`;
}
