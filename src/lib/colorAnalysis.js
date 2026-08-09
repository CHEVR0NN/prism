import { hsl } from 'culori';

export function averagePaletteHsl(hexColors) {
  const n = hexColors.length;
  if (n === 0) return { h: 0, s: 0, l: 0 };

  let sSum = 0;
  let lSum = 0;
  let sinSum = 0;
  let cosSum = 0;
  let hueCount = 0;

  for (const hex of hexColors) {
    const color = hsl(hex);
    if (!color) continue;
    const s = color.s ?? 0;
    const l = color.l ?? 0;
    sSum += s;
    lSum += l;

    if (s > 0.05 && !Number.isNaN(color.h) && color.h !== undefined) {
      const rad = (color.h * Math.PI) / 180;
      sinSum += Math.sin(rad);
      cosSum += Math.cos(rad);
      hueCount++;
    }
  }

  let h = 0;
  if (hueCount > 0) {
    h = (Math.atan2(sinSum / hueCount, cosSum / hueCount) * 180) / Math.PI;
    if (h < 0) h += 360;
    if (h === 0) h = 360;
  }

  return { h, s: sSum / n, l: lSum / n };
}

export function describeMood(mood) {
  const lightness = mood.l < 0.35 ? 'moody' : mood.l < 0.65 ? 'balanced' : 'airy';
  const saturation = mood.s < 0.25 ? 'muted' : mood.s < 0.55 ? 'rich' : 'vibrant';
  const hue = mood.h < 90 || mood.h >= 300 ? 'warm' : mood.h < 270 ? 'cool' : 'balanced';
  return `${hue}, ${saturation}, ${lightness}`;
}
