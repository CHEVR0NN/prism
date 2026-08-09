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
