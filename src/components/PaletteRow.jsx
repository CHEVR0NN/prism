import PaintChip from './PaintChip';
import './PaletteRow.css';

export default function PaletteRow({ colors, onCopyHex, selectedIndexes, onToggleSelect }) {
  if (!colors.length) return null;

  return (
    <div className="palette-row">
      {colors.map((hex, index) => (
        <PaintChip
          key={`${hex}-${index}`}
          hex={hex}
          index={index}
          onCopy={onCopyHex}
          selected={selectedIndexes.has(index)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
