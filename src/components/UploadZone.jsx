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
