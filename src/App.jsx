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
