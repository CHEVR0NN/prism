# Prism — Design Spec

Date: 2026-08-09

## Summary

Prism is a static, client-side web tool: upload an image, get an extracted
color palette and a matching Google Fonts pairing, previewed live, exportable
as a CSS variables file or copied hex codes. No backend, deployable to
GitHub Pages / Cloudflare Pages.

## Stack

- **Vite + React**. Palette/font/preview state changes together on every
  upload and every control tweak (swatch-count slider, shuffle button);
  React's state model keeps these in sync without manual DOM bookkeeping.
- **colorthief** (v3.5.0, actively maintained) for palette extraction —
  works directly off an `<img>`/canvas, no worker setup required, smaller
  API surface than node-vibrant for a one-shot extract-on-upload flow.
- **culori** (v4.0.2) for HSL conversion/color math.
- Google Fonts via `<link>`/`@import` tags — no API key. Curated list of
  15–20 pairings, not the full catalog.
- No router — single-screen SPA. No backend, no persistence (no
  localStorage) — reload clears state.

## Architecture & data flow

State lives in a top-level `App` component:

```
image -> palette[] (adjustable 3-8 count) -> fontPairing -> rendered preview
```

Flow: upload image -> colorthief extracts N colors from canvas -> culori
converts each swatch to HSL -> aggregate avg hue/saturation/lightness ->
score against curated font-pairing list -> pick best match (shuffle = next-
closest untried pairing, wraps around) -> render.

Components:

- `UploadZone` — drag/drop + file input, taped-corner visual
- `SwatchCountSlider` — 3–8, re-runs extraction on change
- `PaletteRow` — paint-chip swatches, hex labels, click-to-copy per chip
- `FontPairingCard` — display/body sample text, shuffle button
- `ExportPanel` — download CSS file, copy-all-hex button
- `App` — orchestrates the upload -> extract -> analyze -> suggest pipeline

## Extraction & font-pairing logic

For each palette, compute average HSL via culori. Map to 3 mood axes:

- **Lightness** — low = moody/bold, high = airy/soft
- **Saturation** — low = muted/organic, high = vibrant/playful
- **Hue** — warm (red/orange/yellow) vs cool (blue/green/purple) vs neutral

Curated list: 15–20 Google Font pairings, each hand-tagged with mood-axis
values (e.g. Fraunces+Karla tagged "warm, muted, moderate-lightness"). Score
= distance between the palette's HSL vector and each pairing's tag vector;
pick the closest. This is a fixed, hand-authored table — deterministic and
debuggable, not ML.

Shuffle button steps to the next-closest untried pairing in the list, wraps
around when exhausted.

## Visual design — cozy/handmade shell

The UI chrome uses its own warm palette, independent of whatever the
uploaded image produces.

- **Background**: warm cream/kraft (`#f4efe4`-ish) with a subtle noise
  overlay — **one shared, fixed-position** inline SVG `feTurbulence` layer
  covering the whole page. Never instantiate per-component — expensive and
  unnecessary.
- **Ink text**: warm near-black brown (`#2b241d`-ish), not pure `#000`.
- **Fonts**: **Fraunces** (display/headers — has a "wonky" optical axis,
  reads hand-set rather than corporate) + **Karla** (body — plain, warm,
  readable). Both available via Google Fonts, no API key.

### Hand-drawn touches

- **Deterministic seeding**: a single shared hash function derives a seed
  from stable per-item data (e.g. a swatch's hex value, or its index) — never
  `Math.random()` on mount/render. This is what keeps wobble/rotation stable
  across re-renders instead of jumping on every state update.
- **Wobbly borders**: reusable SVG-border component — irregular rounded-rect
  path with jittered control points driven by the shared seed function.
  Wraps cards, upload zone, buttons instead of CSS `border-radius`.
- **Torn-edge swatches**: jagged `clip-path` path generated programmatically
  by a small seeded function (same hash/seed logic as the wobbly borders),
  not hand-written polygon points.
- **Doodle accents**: small inline SVGs (arrow, underline scribble) near
  section headers/CTAs — hand-drawn paths, not icon-font glyphs.
- **Paint-chip swatches**: each chip gets a few-degree rotation (seeded by
  index) + torn-edge clip-path + hard-offset drop shadow (no blur).
- **Buttons**: paper-cutout/sticker feel — slight rotation, hard-offset
  shadow (e.g. `3px 3px 0 rgba(...)`, no blur), lifts on hover via
  translate (not scale/glow).
- **Upload zone**: "taped" corners — small rotated, semi-transparent striped
  SVG rects overlapping the zone's top edge, like a photo taped to a page.

### Motion

Custom easing with slight overshoot-then-settle
(`cubic-bezier(0.34, 1.2, 0.64, 1)`), 250–400ms, translate + slight rotation
on enter — elements feel "placed down" like paper. No spring-physics
libraries, no slick symmetric ease.

### Explicitly avoided

Gradients-as-decoration, glassmorphism, soft centered blur-blobs, uniform
CSS `border-radius` rounded cards, generic "AI app" look.

### Layout

Split-screen: upload zone pinned left/top; palette, font pairing, and
preview populate right/below as soon as an image lands. Feels like a
workbench, not a wizard.

Below a breakpoint (narrow viewport — phone/tablet), the split-screen
reflows to a vertical stack: upload zone on top, palette/fonts/preview
stacked below in the same order. Same components, no separate mobile
layout to build — just a CSS breakpoint change (flex-direction/grid
reflow), not a different visual design.

## Export

- **Download CSS** → `prism-palette.css`:
  ```css
  :root {
    --color-1: #...;
    /* ...one per swatch... */
    --font-display: 'Fraunces', serif;
    --font-body: 'Karla', sans-serif;
  }
  /* @import url('...') — Google Fonts link for the two suggested fonts */
  ```
- **Copy hex codes** → comma-separated hex list to clipboard, stamp-style
  confirmation (not a generic snackbar/toast).

## Error handling

Only real boundary cases:

- Non-image file dropped → inline message near upload zone, no crash.
- Large image / slow decode → lightweight loading state during extraction;
  no artificial timeout or retry logic.
- Extraction throws → generic inline error, re-prompt to upload. Not
  expected to occur with valid image input, so no elaborate recovery.

## Testing

- Manual verification via running the dev server and uploading test images
  spanning light/dark/saturated/muted — confirm palette, font pairing, and
  export all update correctly.
- No component/UI test framework — static visual tool, not worth the
  overhead.
- Pure-function logic (HSL mood scoring, hash/seed function) gets plain
  Vitest unit tests since they're cheap to isolate and verify.

## Build order

1. Scaffold project (Vite + React)
2. Image upload + color extraction (colorthief + culori)
3. Font-pairing logic (curated table + scoring)
4. **Style-prototype checkpoint** — static shell only: background/noise
   layer, one card, one button, one swatch row, upload zone with tape
   corners. User approves visual direction before the full interface is
   built out.
5. Full interface (split-screen layout, all components wired to state)
6. Export functionality (CSS download, copy hex)
