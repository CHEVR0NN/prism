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
  { id: 'prata-manrope', display: font('Prata', [400]), body: font('Manrope', [400, 600]), mood: { h: 110, s: 0.25, l: 0.4 } },
  { id: 'alfaslab-jost', display: font('Alfa Slab One', [400]), body: font('Jost', [400, 600]), mood: { h: 55, s: 0.55, l: 0.55 } },
  { id: 'sora-plexsans', display: font('Sora', [500, 700]), body: font('IBM Plex Sans', [400, 500]), mood: { h: 175, s: 0.4, l: 0.5 } },
  { id: 'unbounded-outfit', display: font('Unbounded', [600, 700]), body: font('Outfit', [400, 500]), mood: { h: 270, s: 0.35, l: 0.35 } },
  { id: 'grandhotel-rubik', display: font('Grand Hotel', [400]), body: font('Rubik', [400, 600]), mood: { h: 350, s: 0.4, l: 0.75 } },
  { id: 'bigshoulders-publicsans', display: font('Big Shoulders Display', [700, 900]), body: font('Public Sans', [400, 500]), mood: { h: 0, s: 0.02, l: 0.15 } },
  { id: 'bricolage-figtree', display: font('Bricolage Grotesque', [500, 700]), body: font('Figtree', [400, 500]), mood: { h: 18, s: 0.5, l: 0.5 } },
  { id: 'instrument-manrope', display: font('Instrument Serif', [400]), body: font('Manrope', [400]), mood: { h: 220, s: 0.08, l: 0.6 } },
  { id: 'josefin-epilogue', display: font('Josefin Sans', [400, 600]), body: font('Epilogue', [400, 500]), mood: { h: 75, s: 0.3, l: 0.45 } },
  { id: 'marcellus-jost', display: font('Marcellus', [400]), body: font('Jost', [400]), mood: { h: 350, s: 0.55, l: 0.3 } },
];
