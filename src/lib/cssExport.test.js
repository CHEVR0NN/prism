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
