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
