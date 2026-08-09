# Prism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Prism — a static client-side tool that extracts a color palette + font pairing from an uploaded image, with a cozy/handmade UI, exportable as CSS.

**Architecture:** Vite + React SPA, no backend. Pure-logic modules (hash/seed, color math, font-pairing scoring, CSS export) live in `src/lib/` and are TDD'd with Vitest. UI components in `src/components/` consume them; UI itself is verified manually (no component test framework — static visual tool, per spec).

**Tech Stack:** Vite 8, React 19, colorthief 3.5, culori 4.0, Vitest 4.

---

## Repo & Commit Policy — read before starting

**Do not run `git add`, `git commit`, or `git push` at any point in this plan.** The repo owner commits manually. Every task's final step is **"Report commit message"** — print a single `type:details` line for the owner to use, and stop there. This overrides any default "commit after each step" behavior from the executing skill.

---

## File Structure

```
index.html
package.json
vite.config.js
src/
  main.jsx
  App.jsx
  App.css
  index.css
  lib/
    hash.js            (+ hash.test.js)
    wobblyBorder.js     (+ wobblyBorder.test.js)
    tornEdge.js         (+ tornEdge.test.js)
    colorAnalysis.js    (+ colorAnalysis.test.js)
    fontPairings.js     (+ fontPairings.test.js)
    fontPairingScorer.js (+ fontPairingScorer.test.js)
    cssExport.js        (+ cssExport.test.js)
    colorExtraction.js
  hooks/
    useWobblyBorder.js
    useGoogleFontLink.js
  components/
    NoiseOverlay.jsx / .css
    WobblyCard.jsx / .css
    WobblyButton.jsx / .css
    Doodles.jsx
    PaintChip.jsx / .css
    PaletteRow.jsx / .css
    SwatchCountSlider.jsx / .css
    UploadZone.jsx / .css
    FontPairingCard.jsx / .css
    ExportPanel.jsx / .css
```

---

### Task 1: Scaffold project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/App.css`
- Create: `src/index.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "prism",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "colorthief": "^3.5.0",
    "culori": "^4.0.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.5",
    "vite": "^8.2.1",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 3: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Prism — image to palette & type</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Karla:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 5: Create `src/index.css`**

```css
:root {
  --paper: #f4efe4;
  --paper-dark: #e9e1d0;
  --ink: #2b241d;
  --ink-soft: #5c5346;
  --accent: #b5482f;
  --font-display: 'Fraunces', serif;
  --font-body: 'Karla', sans-serif;
  --shadow-color: rgba(43, 36, 29, 0.35);
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 600;
  margin: 0;
}
```

- [ ] **Step 6: Create `src/App.jsx` (placeholder, wired fully in Task 17)**

```jsx
import './App.css';

export default function App() {
  return (
    <div className="app">
      <h1>Prism</h1>
    </div>
  );
}
```

- [ ] **Step 7: Create `src/App.css` (placeholder, expanded in Task 17)**

```css
.app {
  position: relative;
  min-height: 100vh;
  padding: 2rem;
}
```

- [ ] **Step 8: Install dependencies and verify dev build**

Run: `npm install`
Run: `npm run build`
Expected: build completes, `dist/` produced, no errors.

- [ ] **Step 9: Report commit message**

Do not run `git add`/`git commit`/`git push`. Print for the owner to use:

`chore:scaffold Vite+React project`

---

### Task 2: Deterministic hash/seed utility

**Files:**
- Create: `src/lib/hash.js`
- Test: `src/lib/hash.test.js`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/hash.test.js`
Expected: FAIL — `hash.js` does not exist / exports undefined.

- [ ] **Step 3: Write implementation**

```js
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function seededRandom(seed) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return function next() {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/hash.test.js`
Expected: PASS (6 tests)

- [ ] **Step 5: Report commit message**

`feat:add deterministic hash/seed utility`

---

### Task 3: Wobbly border path generator

**Files:**
- Create: `src/lib/wobblyBorder.js`
- Test: `src/lib/wobblyBorder.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest';
import { wobblyRectPath } from './wobblyBorder';

describe('wobblyRectPath', () => {
  it('returns the same path for the same seed and size', () => {
    const a = wobblyRectPath(200, 100, 'card-1');
    const b = wobblyRectPath(200, 100, 'card-1');
    expect(a).toBe(b);
  });

  it('returns a different path for a different seed', () => {
    const a = wobblyRectPath(200, 100, 'card-1');
    const b = wobblyRectPath(200, 100, 'card-2');
    expect(a).not.toBe(b);
  });

  it('returns a valid SVG path string starting with M and ending with Z', () => {
    const path = wobblyRectPath(150, 80, 'x');
    expect(path.startsWith('M')).toBe(true);
    expect(path.trim().endsWith('Z')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/wobblyBorder.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/wobblyBorder.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Report commit message**

`feat:add seeded wobbly border path generator`

---

### Task 4: Torn-edge clip-path generator

**Files:**
- Create: `src/lib/tornEdge.js`
- Test: `src/lib/tornEdge.test.js`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/tornEdge.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/tornEdge.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Report commit message**

`feat:add seeded torn-edge clip-path generator`

---

### Task 5: Palette HSL analysis

**Files:**
- Create: `src/lib/colorAnalysis.js`
- Test: `src/lib/colorAnalysis.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest';
import { averagePaletteHsl } from './colorAnalysis';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/colorAnalysis.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```js
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
  }

  return { h, s: sSum / n, l: lSum / n };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/colorAnalysis.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Report commit message**

`feat:add palette HSL averaging with circular hue mean`

---

### Task 6: Curated font-pairing table + Google Fonts URL builder

**Files:**
- Create: `src/lib/fontPairings.js`
- Test: `src/lib/fontPairings.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest';
import { fontPairings, buildGoogleFontsUrl } from './fontPairings';

describe('fontPairings', () => {
  it('has between 15 and 20 curated pairings', () => {
    expect(fontPairings.length).toBeGreaterThanOrEqual(15);
    expect(fontPairings.length).toBeLessThanOrEqual(20);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/fontPairings.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```js
export function buildGoogleFontsUrl(fonts) {
  const params = fonts
    .map((font) => `family=${encodeURIComponent(font.name)}:wght@${font.weights.join(';')}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

function font(name, weights) {
  return { name, weights };
}

export const fontPairings = [
  { id: 'fraunces-karla', display: font('Fraunces', [400, 600, 700]), body: font('Karla', [400, 600]), mood: { h: 30, s: 0.35, l: 0.55 } },
  { id: 'playfair-source-sans', display: font('Playfair Display', [400, 700]), body: font('Source Sans 3', [400, 600]), mood: { h: 210, s: 0.2, l: 0.4 } },
  { id: 'abril-nunito-sans', display: font('Abril Fatface', [400]), body: font('Nunito Sans', [400, 600]), mood: { h: 20, s: 0.7, l: 0.55 } },
  { id: 'cormorant-lato', display: font('Cormorant Garamond', [500, 600]), body: font('Lato', [400]), mood: { h: 280, s: 0.15, l: 0.7 } },
  { id: 'caveat-inter', display: font('Caveat', [600, 700]), body: font('Inter', [400, 500]), mood: { h: 50, s: 0.6, l: 0.65 } },
  { id: 'kalam-nunito', display: font('Kalam', [400, 700]), body: font('Nunito', [400, 600]), mood: { h: 30, s: 0.5, l: 0.6 } },
  { id: 'dmserif-dmsans', display: font('DM Serif Display', [400]), body: font('DM Sans', [400, 500]), mood: { h: 200, s: 0.1, l: 0.5 } },
  { id: 'bitter-work-sans', display: font('Bitter', [500, 700]), body: font('Work Sans', [400, 500]), mood: { h: 25, s: 0.4, l: 0.4 } },
  { id: 'libre-baskerville-pt-sans', display: font('Libre Baskerville', [400, 700]), body: font('PT Sans', [400]), mood: { h: 210, s: 0.15, l: 0.45 } },
  { id: 'archivo-black-archivo', display: font('Archivo Black', [400]), body: font('Archivo', [400, 500]), mood: { h: 0, s: 0.05, l: 0.2 } },
  { id: 'space-grotesk-mono', display: font('Space Grotesk', [500, 700]), body: font('Space Mono', [400]), mood: { h: 220, s: 0.3, l: 0.5 } },
  { id: 'amatic-open-sans', display: font('Amatic SC', [700]), body: font('Open Sans', [400]), mood: { h: 340, s: 0.5, l: 0.6 } },
  { id: 'yeseva-mulish', display: font('Yeseva One', [400]), body: font('Mulish', [400, 600]), mood: { h: 15, s: 0.6, l: 0.5 } },
  { id: 'spectral-karla', display: font('Spectral', [500, 600]), body: font('Karla', [400]), mood: { h: 180, s: 0.2, l: 0.55 } },
  { id: 'poppins-nunito-sans', display: font('Poppins', [600, 700]), body: font('Nunito Sans', [400]), mood: { h: 40, s: 0.3, l: 0.65 } },
  { id: 'zilla-slab-karla', display: font('Zilla Slab', [500, 700]), body: font('Karla', [400]), mood: { h: 35, s: 0.35, l: 0.45 } },
  { id: 'comfortaa-quicksand', display: font('Comfortaa', [600, 700]), body: font('Quicksand', [400, 500]), mood: { h: 260, s: 0.3, l: 0.7 } },
  { id: 'righteous-work-sans', display: font('Righteous', [400]), body: font('Work Sans', [400]), mood: { h: 10, s: 0.65, l: 0.5 } },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/fontPairings.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Report commit message**

`feat:add curated font-pairing table and Google Fonts URL builder`

---

### Task 7: Font-pairing scorer

**Files:**
- Create: `src/lib/fontPairingScorer.js`
- Test: `src/lib/fontPairingScorer.test.js`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/fontPairingScorer.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/fontPairingScorer.test.js`
Expected: PASS (6 tests)

- [ ] **Step 5: Report commit message**

`feat:add font-pairing scoring and shuffle selection`

---

### Task 8: CSS export builder

**Files:**
- Create: `src/lib/cssExport.js`
- Test: `src/lib/cssExport.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest';
import { buildCssExport } from './cssExport';

const pairing = {
  display: { name: 'Fraunces', weights: [400, 600] },
  body: { name: 'Karla', weights: [400] },
};

describe('buildCssExport', () => {
  it('includes one --color-N variable per swatch, in order', () => {
    const css = buildCssExport(['#ff0000', '#00ff00', '#0000ff'], pairing);
    expect(css).toContain('--color-1: #ff0000;');
    expect(css).toContain('--color-2: #00ff00;');
    expect(css).toContain('--color-3: #0000ff;');
  });

  it('includes font-family custom properties for display and body', () => {
    const css = buildCssExport(['#ff0000'], pairing);
    expect(css).toContain("--font-display: 'Fraunces', serif;");
    expect(css).toContain("--font-body: 'Karla', sans-serif;");
  });

  it('includes the Google Fonts URL for the pairing as a comment', () => {
    const css = buildCssExport(['#ff0000'], pairing);
    expect(css).toContain('https://fonts.googleapis.com/css2?');
    expect(css).toContain('family=Fraunces');
    expect(css).toContain('family=Karla');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/cssExport.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write implementation**

```js
import { buildGoogleFontsUrl } from './fontPairings';

export function buildCssExport(colors, pairing) {
  const colorLines = colors
    .map((hex, index) => `  --color-${index + 1}: ${hex};`)
    .join('\n');
  const fontsUrl = buildGoogleFontsUrl([pairing.display, pairing.body]);

  return `/* Generated by Prism — fonts: ${fontsUrl} */
:root {
${colorLines}
  --font-display: '${pairing.display.name}', serif;
  --font-body: '${pairing.body.name}', sans-serif;
}
`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/cssExport.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Report commit message**

`feat:add CSS custom-properties export builder`

---

### Task 9: Color extraction (colorthief wrapper)

No unit test — `colorthief` reads from an `<img>`/canvas element, which needs a real DOM/browser; per spec this is verified manually (Task 18), not with Vitest.

**Files:**
- Create: `src/lib/colorExtraction.js`

- [ ] **Step 1: Write the implementation**

```js
import ColorThief from 'colorthief';

const colorThief = new ColorThief();

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export function extractPalette(imageFile, count) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, count);
        resolve(palette.map(rgbToHex));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image'));
    };
    img.src = objectUrl;
  });
}
```

- [ ] **Step 2: Verify the build still compiles**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 3: Report commit message**

`feat:add colorthief-based palette extraction`

---

### Task 10: Shell — noise overlay

**Files:**
- Create: `src/components/NoiseOverlay.jsx`
- Create: `src/components/NoiseOverlay.css`

- [ ] **Step 1: Create `src/components/NoiseOverlay.jsx`**

```jsx
import './NoiseOverlay.css';

export default function NoiseOverlay() {
  return (
    <svg className="noise-overlay" aria-hidden="true">
      <filter id="prism-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#prism-noise)" />
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/NoiseOverlay.css`**

```css
.noise-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  pointer-events: none;
  z-index: 0;
}
```

This is rendered **once**, at the `App` root (wired in Task 17) — never per-component, per the spec's performance note.

- [ ] **Step 3: Report commit message**

`feat:add shared page-level noise overlay`

---

### Task 11: Wobbly border hook + card + button — STYLE PROTOTYPE CHECKPOINT

**This task ends with a stop for the repo owner's visual approval before continuing to Task 12.** It builds the reusable hand-drawn primitives everything else in the UI depends on.

**Files:**
- Create: `src/hooks/useWobblyBorder.js`
- Create: `src/components/WobblyCard.jsx`
- Create: `src/components/WobblyCard.css`
- Create: `src/components/WobblyButton.jsx`
- Create: `src/components/WobblyButton.css`
- Modify: `src/App.jsx` (temporary prototype content, replaced in Task 17)

- [ ] **Step 1: Create `src/hooks/useWobblyBorder.js`**

```js
import { useEffect, useMemo, useRef, useState } from 'react';
import { wobblyRectPath } from '../lib/wobblyBorder';

export function useWobblyBorder(seed) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const path = useMemo(
    () => (size.width && size.height ? wobblyRectPath(size.width, size.height, seed) : ''),
    [size.width, size.height, seed]
  );

  return { ref, size, path };
}
```

- [ ] **Step 2: Create `src/components/WobblyCard.jsx`**

```jsx
import { useWobblyBorder } from '../hooks/useWobblyBorder';
import './WobblyCard.css';

export default function WobblyCard({ seed, className = '', children }) {
  const { ref, size, path } = useWobblyBorder(seed);

  return (
    <div ref={ref} className={`wobbly-card ${className}`}>
      {size.width > 0 && (
        <svg className="wobbly-card__border" width={size.width} height={size.height}>
          <path d={path} className="wobbly-card__path" />
        </svg>
      )}
      <div className="wobbly-card__content">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/WobblyCard.css`**

```css
.wobbly-card {
  position: relative;
  padding: 1.5rem;
}

.wobbly-card__border {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.wobbly-card__path {
  fill: var(--paper);
  stroke: var(--ink);
  stroke-width: 2;
  filter: drop-shadow(3px 3px 0 var(--shadow-color));
}

.wobbly-card__content {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 4: Create `src/components/WobblyButton.jsx`**

```jsx
import { useWobblyBorder } from '../hooks/useWobblyBorder';
import './WobblyButton.css';

export default function WobblyButton({ seed, className = '', children, ...props }) {
  const { ref, size, path } = useWobblyBorder(seed);

  return (
    <button ref={ref} type="button" className={`wobbly-button ${className}`} {...props}>
      {size.width > 0 && (
        <svg className="wobbly-button__border" width={size.width} height={size.height}>
          <path d={path} className="wobbly-button__path" />
        </svg>
      )}
      <span className="wobbly-button__label">{children}</span>
    </button>
  );
}
```

- [ ] **Step 5: Create `src/components/WobblyButton.css`**

```css
.wobbly-button {
  position: relative;
  border: none;
  background: none;
  padding: 0.6rem 1.4rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  color: var(--ink);
  cursor: pointer;
  transition: transform 300ms cubic-bezier(0.34, 1.2, 0.64, 1);
}

.wobbly-button:hover {
  transform: translate(-2px, -2px);
}

.wobbly-button__border {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.wobbly-button__path {
  fill: var(--paper-dark);
  stroke: var(--ink);
  stroke-width: 2;
  filter: drop-shadow(3px 3px 0 var(--shadow-color));
}

.wobbly-button__label {
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 6: Temporarily wire a style prototype into `src/App.jsx`**

```jsx
import NoiseOverlay from './components/NoiseOverlay';
import WobblyCard from './components/WobblyCard';
import WobblyButton from './components/WobblyButton';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <NoiseOverlay />
      <h1>Prism</h1>
      <WobblyCard seed="prototype-card">
        <p>This is a wobbly card, hand-drawn border, hard-offset shadow.</p>
        <WobblyButton seed="prototype-button">Sample button</WobblyButton>
      </WobblyCard>
    </div>
  );
}
```

- [ ] **Step 7: Run the dev server for visual review**

Run: `npm run dev`

Open the local URL and confirm: cream/kraft background with visible grain, wobbly (non-uniform) card border, hard-offset (non-blurred) shadow on both card and button, button lifts slightly on hover.

- [ ] **Step 8: STOP — get repo owner's approval on the visual direction**

Do not proceed to Task 12 until the owner confirms the look is right. This is the checkpoint called out in the spec's build order.

- [ ] **Step 9: Report commit message**

`feat:add wobbly-border hook, card, and button primitives`

---

### Task 12: Doodle accents, paint chips, palette row

**Files:**
- Create: `src/components/Doodles.jsx`
- Create: `src/components/PaintChip.jsx`
- Create: `src/components/PaintChip.css`
- Create: `src/components/PaletteRow.jsx`
- Create: `src/components/PaletteRow.css`

- [ ] **Step 1: Create `src/components/Doodles.jsx`**

```jsx
export function DoodleArrow({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 60 24" aria-hidden="true">
      <path d="M2 18 C 18 4, 34 4, 50 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M40 6 L50 12 L42 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleUnderline({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 12" aria-hidden="true">
      <path
        d="M2 8 C 20 2, 40 10, 60 6 C 80 2, 100 10, 118 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/PaintChip.jsx`**

```jsx
import { hashString, seededRandom } from '../lib/hash';
import { tornEdgeClipPath } from '../lib/tornEdge';
import './PaintChip.css';

export default function PaintChip({ hex, index, onCopy }) {
  const seed = `${hex}-${index}`;
  const rand = seededRandom(hashString(seed));
  const rotation = (rand() - 0.5) * 6;
  const clipPath = tornEdgeClipPath(seed);

  return (
    <button
      type="button"
      className="paint-chip"
      style={{ backgroundColor: hex, clipPath, transform: `rotate(${rotation.toFixed(2)}deg)` }}
      onClick={() => onCopy(hex)}
    >
      <span className="paint-chip__hex">{hex}</span>
    </button>
  );
}
```

- [ ] **Step 3: Create `src/components/PaintChip.css`**

```css
.paint-chip {
  position: relative;
  width: 90px;
  height: 110px;
  border: none;
  cursor: pointer;
  filter: drop-shadow(3px 3px 0 var(--shadow-color));
  transition: transform 300ms cubic-bezier(0.34, 1.2, 0.64, 1);
}

.paint-chip:hover {
  transform: translateY(-3px) scale(1.03);
}

.paint-chip__hex {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--ink);
  background: rgba(244, 239, 228, 0.85);
  padding: 2px 0;
}
```

- [ ] **Step 4: Create `src/components/PaletteRow.jsx`**

```jsx
import PaintChip from './PaintChip';
import './PaletteRow.css';

export default function PaletteRow({ colors, onCopyHex }) {
  if (!colors.length) return null;

  return (
    <div className="palette-row">
      {colors.map((hex, index) => (
        <PaintChip key={`${hex}-${index}`} hex={hex} index={index} onCopy={onCopyHex} />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/PaletteRow.css`**

```css
.palette-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 0.5rem 0;
}
```

- [ ] **Step 6: Verify the build compiles**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 7: Report commit message**

`feat:add doodle accents and paint-chip swatches`

---

### Task 13: Swatch count slider

**Files:**
- Create: `src/components/SwatchCountSlider.jsx`
- Create: `src/components/SwatchCountSlider.css`

- [ ] **Step 1: Create `src/components/SwatchCountSlider.jsx`**

```jsx
import './SwatchCountSlider.css';

export default function SwatchCountSlider({ value, onChange }) {
  return (
    <label className="swatch-slider">
      <span className="swatch-slider__label">Swatches: {value}</span>
      <input
        type="range"
        min={3}
        max={8}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
```

- [ ] **Step 2: Create `src/components/SwatchCountSlider.css`**

```css
.swatch-slider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-body);
  color: var(--ink-soft);
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Report commit message**

`feat:add adjustable swatch-count slider`

---

### Task 14: Upload zone with tape corners

**Files:**
- Create: `src/components/UploadZone.jsx`
- Create: `src/components/UploadZone.css`

- [ ] **Step 1: Create `src/components/UploadZone.jsx`**

```jsx
import { useCallback, useRef, useState } from 'react';
import WobblyCard from './WobblyCard';
import './UploadZone.css';

export default function UploadZone({ onImageSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setError("That's not an image file — try a jpg, png, or webp.");
        return;
      }
      setError('');
      onImageSelected(file);
    },
    [onImageSelected]
  );

  return (
    <WobblyCard seed="upload-zone" className="upload-zone-card">
      <div
        className={`upload-zone ${isDragging ? 'upload-zone--dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <span className="upload-zone__tape upload-zone__tape--left" aria-hidden="true" />
        <span className="upload-zone__tape upload-zone__tape--right" aria-hidden="true" />
        <p className="upload-zone__text">Drop an image here, or click to choose one</p>
        {error && <p className="upload-zone__error">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="upload-zone__input"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    </WobblyCard>
  );
}
```

- [ ] **Step 2: Create `src/components/UploadZone.css`**

```css
.upload-zone {
  position: relative;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  cursor: pointer;
}

.upload-zone--dragging {
  background: var(--paper-dark);
}

.upload-zone__tape {
  position: absolute;
  top: -12px;
  width: 60px;
  height: 24px;
  background-color: rgba(230, 220, 190, 0.7);
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0.5) 4px,
    rgba(255, 255, 255, 0.25) 4px,
    rgba(255, 255, 255, 0.25) 8px
  );
  opacity: 0.8;
}

.upload-zone__tape--left {
  left: 20px;
  transform: rotate(-6deg);
}

.upload-zone__tape--right {
  right: 20px;
  transform: rotate(4deg);
}

.upload-zone__text {
  font-family: var(--font-body);
  color: var(--ink-soft);
  margin: 0;
}

.upload-zone__error {
  color: var(--accent);
  font-size: 0.85rem;
  margin: 0;
}

.upload-zone__input {
  display: none;
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Report commit message**

`feat:add drag-and-drop upload zone with tape corners`

---

### Task 15: Font pairing card + live Google Font loading

**Files:**
- Create: `src/hooks/useGoogleFontLink.js`
- Create: `src/components/FontPairingCard.jsx`
- Create: `src/components/FontPairingCard.css`

- [ ] **Step 1: Create `src/hooks/useGoogleFontLink.js`**

```js
import { useEffect } from 'react';
import { buildGoogleFontsUrl } from '../lib/fontPairings';

export function useGoogleFontLink(pairing) {
  useEffect(() => {
    if (!pairing) return undefined;
    const href = buildGoogleFontsUrl([pairing.display, pairing.body]);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [pairing]);
}
```

- [ ] **Step 2: Create `src/components/FontPairingCard.jsx`**

```jsx
import WobblyCard from './WobblyCard';
import WobblyButton from './WobblyButton';
import './FontPairingCard.css';

export default function FontPairingCard({ pairing, onShuffle }) {
  if (!pairing) return null;

  return (
    <WobblyCard seed={`font-${pairing.id}`} className="font-pairing-card">
      <h2 className="font-pairing-card__heading" style={{ fontFamily: `'${pairing.display.name}', serif` }}>
        {pairing.display.name}
      </h2>
      <p className="font-pairing-card__body" style={{ fontFamily: `'${pairing.body.name}', sans-serif` }}>
        Paired with {pairing.body.name} — the quick brown fox jumps over the lazy dog.
      </p>
      <WobblyButton seed={`shuffle-${pairing.id}`} onClick={onShuffle}>
        Shuffle pairing
      </WobblyButton>
    </WobblyCard>
  );
}
```

- [ ] **Step 3: Create `src/components/FontPairingCard.css`**

```css
.font-pairing-card__heading {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.font-pairing-card__body {
  color: var(--ink-soft);
  margin-bottom: 1rem;
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 5: Report commit message**

`feat:add font-pairing card with live Google Font loading`

---

### Task 16: Export panel

**Files:**
- Create: `src/components/ExportPanel.jsx`
- Create: `src/components/ExportPanel.css`

- [ ] **Step 1: Create `src/components/ExportPanel.jsx`**

```jsx
import { useState } from 'react';
import { buildCssExport } from '../lib/cssExport';
import WobblyButton from './WobblyButton';
import './ExportPanel.css';

export default function ExportPanel({ colors, pairing }) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const css = buildCssExport(colors, pairing);
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prism-palette.css';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(colors.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="export-panel">
      <WobblyButton seed="export-download" onClick={handleDownload}>
        Download CSS
      </WobblyButton>
      <WobblyButton seed="export-copy" onClick={handleCopy}>
        Copy hex codes
      </WobblyButton>
      {copied && <span className="export-panel__stamp">Copied!</span>}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/ExportPanel.css`**

```css
.export-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.export-panel__stamp {
  font-family: var(--font-display);
  color: var(--accent);
  transform: rotate(-4deg);
  border: 2px solid var(--accent);
  padding: 0.1rem 0.6rem;
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 4: Report commit message**

`feat:add CSS download and copy-hex export panel`

---

### Task 17: Wire up App — full interface

**Files:**
- Modify: `src/App.jsx` (replace prototype content from Task 11)
- Modify: `src/App.css`

- [ ] **Step 1: Replace `src/App.jsx` with the full orchestration**

```jsx
import { useCallback, useState } from 'react';
import NoiseOverlay from './components/NoiseOverlay';
import UploadZone from './components/UploadZone';
import SwatchCountSlider from './components/SwatchCountSlider';
import PaletteRow from './components/PaletteRow';
import FontPairingCard from './components/FontPairingCard';
import ExportPanel from './components/ExportPanel';
import { DoodleUnderline } from './components/Doodles';
import { extractPalette } from './lib/colorExtraction';
import { averagePaletteHsl } from './lib/colorAnalysis';
import { pickPairing } from './lib/fontPairingScorer';
import { fontPairings } from './lib/fontPairings';
import { useGoogleFontLink } from './hooks/useGoogleFontLink';
import './App.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [swatchCount, setSwatchCount] = useState(5);
  const [colors, setColors] = useState([]);
  const [pairing, setPairing] = useState(null);
  const [triedPairingIds, setTriedPairingIds] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useGoogleFontLink(pairing);

  const runExtraction = useCallback(async (imageFile, count) => {
    setStatus('loading');
    setError('');
    try {
      const palette = await extractPalette(imageFile, count);
      setColors(palette);
      const moodVector = averagePaletteHsl(palette);
      const chosen = pickPairing(moodVector, fontPairings, []);
      setPairing(chosen);
      setTriedPairingIds([chosen.id]);
      setStatus('done');
    } catch {
      setError('Could not read that image — try a different file.');
      setStatus('error');
    }
  }, []);

  const handleImageSelected = useCallback(
    (imageFile) => {
      setFile(imageFile);
      setImageUrl(URL.createObjectURL(imageFile));
      runExtraction(imageFile, swatchCount);
    },
    [runExtraction, swatchCount]
  );

  const handleSwatchCountChange = useCallback(
    (count) => {
      setSwatchCount(count);
      if (file) runExtraction(file, count);
    },
    [file, runExtraction]
  );

  const handleShuffle = useCallback(() => {
    const moodVector = averagePaletteHsl(colors);
    const next = pickPairing(moodVector, fontPairings, triedPairingIds);
    setPairing(next);
    setTriedPairingIds((prev) => [...prev, next.id]);
  }, [colors, triedPairingIds]);

  const handleCopyHex = useCallback((hex) => {
    navigator.clipboard.writeText(hex);
  }, []);

  return (
    <div className="app">
      <NoiseOverlay />
      <header className="app__header">
        <h1 className="app__title">Prism</h1>
        <DoodleUnderline className="app__title-underline" />
      </header>
      <div className="app__body">
        <div className="app__upload-pane">
          <UploadZone onImageSelected={handleImageSelected} />
          {imageUrl && <img className="app__preview-image" src={imageUrl} alt="Uploaded" />}
        </div>
        <div className="app__results-pane">
          {status === 'loading' && <p className="app__status">Reading colors…</p>}
          {status === 'error' && <p className="app__status app__status--error">{error}</p>}
          {colors.length > 0 && (
            <>
              <SwatchCountSlider value={swatchCount} onChange={handleSwatchCountChange} />
              <PaletteRow colors={colors} onCopyHex={handleCopyHex} />
              <FontPairingCard pairing={pairing} onShuffle={handleShuffle} />
              <ExportPanel colors={colors} pairing={pairing} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/App.css` with full layout + responsive rules**

```css
.app {
  position: relative;
  min-height: 100vh;
  padding: 2rem;
}

.app__header {
  margin-bottom: 2rem;
}

.app__title {
  font-size: 2.5rem;
}

.app__title-underline {
  width: 140px;
  height: 12px;
  color: var(--accent);
}

.app__body {
  display: flex;
  gap: 2rem;
}

.app__upload-pane {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app__results-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.app__preview-image {
  width: 100%;
  display: block;
}

.app__status {
  font-style: italic;
  color: var(--ink-soft);
}

.app__status--error {
  color: var(--accent);
}

@media (max-width: 720px) {
  .app__body {
    flex-direction: column;
  }

  .app__upload-pane {
    flex: none;
  }
}
```

- [ ] **Step 3: Run all Vitest suites**

Run: `npm run test`
Expected: all pure-logic test files pass (hash, wobblyBorder, tornEdge, colorAnalysis, fontPairings, fontPairingScorer, cssExport).

- [ ] **Step 4: Verify the production build**

Run: `npm run build`
Expected: no errors.

- [ ] **Step 5: Report commit message**

`feat:wire up full Prism interface end-to-end`

---

### Task 18: Manual verification pass

Use the `run` skill to launch the dev server and drive the app in a browser — this task has no automated test, it's the "does the real thing work" check called for in the spec's testing section.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Upload a light, low-saturation image**

Confirm: palette extracts, swatches render as rotated torn-edge chips, a font pairing appears with airy/muted mood, shuffle cycles to a different pairing, no console errors.

- [ ] **Step 3: Upload a dark, saturated/vibrant image**

Confirm: palette skews darker/richer, font pairing suggestion differs from Step 2's, live fonts render correctly (not fallback serif/sans).

- [ ] **Step 4: Drag the swatch-count slider from 3 to 8**

Confirm: palette re-extracts at each step without errors, swatch row reflows.

- [ ] **Step 5: Test the export panel**

Confirm: "Download CSS" produces a `prism-palette.css` with correct `--color-N`, `--font-display`, `--font-body` values and a working Google Fonts URL in the comment. "Copy hex codes" copies a comma-separated hex list and shows the stamp confirmation.

- [ ] **Step 6: Drop a non-image file onto the upload zone**

Confirm: inline error message appears, no crash.

- [ ] **Step 7: Resize the browser window below 720px width**

Confirm: layout stacks vertically (upload zone on top, results below), no horizontal overflow.

- [ ] **Step 8: Report commit message**

Only if manual verification surfaced fixes:

`fix:<describe what manual verification caught>`

If nothing needed fixing, no commit message to report — plan is complete.
