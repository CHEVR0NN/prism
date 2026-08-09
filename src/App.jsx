import { lazy, Suspense, useCallback, useState } from 'react';
import NoiseOverlay from './components/NoiseOverlay';
import UploadZone from './components/UploadZone';
import SwatchCountSlider from './components/SwatchCountSlider';
import PaletteRow from './components/PaletteRow';
import ResultsSkeleton from './components/Skeleton';
import { DoodleUnderline } from './components/Doodles';
import { extractPalette } from './lib/colorExtraction';
import { averagePaletteHsl, describeMood } from './lib/colorAnalysis';
import { pickPairing } from './lib/fontPairingScorer';
import { fontPairings } from './lib/fontPairings';
import { useGoogleFontLink } from './hooks/useGoogleFontLink';
import './App.css';

const FontPairingCard = lazy(() => import('./components/FontPairingCard'));
const ExportPanel = lazy(() => import('./components/ExportPanel'));

export default function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [swatchCount, setSwatchCount] = useState(5);
  const [colors, setColors] = useState([]);
  const [pairing, setPairing] = useState(null);
  const [moodVector, setMoodVector] = useState(null);
  const [triedPairingIds, setTriedPairingIds] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [imageDims, setImageDims] = useState(null);

  useGoogleFontLink(pairing);

  const runExtraction = useCallback(async (imageFile, count) => {
    setStatus('loading');
    setError('');
    setColors([]);
    setPairing(null);
    try {
      const palette = await extractPalette(imageFile, count);
      setColors(palette);
      const vector = averagePaletteHsl(palette);
      setMoodVector(vector);
      const chosen = pickPairing(vector, fontPairings, []);
      setPairing(chosen);
      setTriedPairingIds([chosen.id]);
      setStatus('done');
    } catch {
      setError('Could not read that image. Try a different file.');
      setStatus('error');
    }
  }, []);

  const handleImageSelected = useCallback(
    (imageFile) => {
      setFile(imageFile);
      setImageDims(null);
      setImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(imageFile);
      });
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
    const next = pickPairing(moodVector, fontPairings, triedPairingIds);
    setPairing(next);
    setTriedPairingIds((prev) => [...prev, next.id]);
  }, [moodVector, triedPairingIds]);

  const handleCopyHex = useCallback((hex) => {
    navigator.clipboard.writeText(hex);
  }, []);

  return (
    <div className="app">
      <NoiseOverlay />
      <header className="app__header">
        <h1 className="app__title">Prism</h1>
        <DoodleUnderline className="app__title-underline" />
        <p className="app__tagline">Turn any image into a color palette and font pairing.</p>
      </header>
      <main id="main-content" className={`app__body ${status === 'idle' ? 'app__body--empty' : ''}`}>
        <div className="app__upload-pane">
          {imageUrl && (
            <div className="app__image-showcase">
              <img
                className="app__preview-image"
                src={imageUrl}
                alt="Uploaded"
                width={imageDims?.width}
                height={imageDims?.height}
                decoding="async"
                onLoad={(event) =>
                  setImageDims({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  })
                }
              />
            </div>
          )}
          <UploadZone onImageSelected={handleImageSelected} compact={Boolean(imageUrl)} />
        </div>
        {status !== 'idle' && (
          <div className="app__results-pane">
            <div className="app__status" role="status" aria-live="polite">
              {status === 'loading' && 'Reading colors…'}
            </div>
            {status === 'error' && (
              <p className="app__status app__status--error" role="alert">
                {error}
              </p>
            )}
            {status === 'loading' && <ResultsSkeleton />}
            {colors.length > 0 && (
              <Suspense fallback={<ResultsSkeleton />}>
                <div className="app__section">
                  <SwatchCountSlider value={swatchCount} onChange={handleSwatchCountChange} />
                  <PaletteRow colors={colors} onCopyHex={handleCopyHex} />
                  <ExportPanel colors={colors} pairing={pairing} variant="hex" />
                </div>
                <div className="app__section">
                  <FontPairingCard
                    pairing={pairing}
                    onShuffle={handleShuffle}
                    rationale={moodVector ? describeMood(moodVector) : ''}
                  />
                  <ExportPanel colors={colors} pairing={pairing} variant="css" />
                </div>
              </Suspense>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
