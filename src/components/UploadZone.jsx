import { useCallback, useEffect, useRef, useState } from 'react';
import WobblyCard from './WobblyCard';
import './UploadZone.css';

export default function UploadZone({ onImageSelected, compact = false }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setError("That's not an image file. Try a jpg, png, or webp.");
        return;
      }
      setError('');
      onImageSelected(file);
    },
    [onImageSelected]
  );

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (file) handleFiles([file]);
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFiles]);

  return (
    <WobblyCard seed="upload-zone" className={`upload-zone-card ${compact ? 'upload-zone-card--compact' : ''}`}>
      <div
        className={`upload-zone ${compact ? 'upload-zone--compact' : ''} ${isDragging ? 'upload-zone--dragging' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={compact ? 'Drop a new image, or press Enter to replace' : 'Drop an image here, or press Enter to choose one'}
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
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {!compact && (
          <>
            <span className="upload-zone__tape upload-zone__tape--left" aria-hidden="true" />
            <span className="upload-zone__tape upload-zone__tape--right" aria-hidden="true" />
          </>
        )}
        <p className="upload-zone__text">
          {compact ? 'Drop a new image, or click to replace' : 'Drop an image here, or click to choose one'}
        </p>
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
