import { useState } from 'react';
import { buildCssExport } from '../lib/cssExport';
import WobblyButton from './WobblyButton';
import './ExportPanel.css';

export default function ExportPanel({ colors, pairing, variant, selectedHexes }) {
  const [feedback, setFeedback] = useState(false);

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
    const hexesToCopy = selectedHexes?.length ? selectedHexes : colors;
    await navigator.clipboard.writeText(hexesToCopy.join(', '));
    setFeedback(true);
    setTimeout(() => setFeedback(false), 1500);
  };

  if (variant === 'hex') {
    const label = selectedHexes?.length ? `Copy ${selectedHexes.length} selected` : 'Copy hex codes';
    return (
      <div className="export-panel">
        <WobblyButton seed="export-copy" onClick={handleCopy}>
          {label}
        </WobblyButton>
        {feedback && (
          <span className="export-panel__stamp" role="status">
            Copied!
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="export-panel">
      <WobblyButton seed="export-download" onClick={handleDownload}>
        Download CSS
      </WobblyButton>
    </div>
  );
}
