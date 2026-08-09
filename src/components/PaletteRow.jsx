import PaintChip from './PaintChip';
import './PaletteRow.css';

export default function PaletteRow({ colors, onCopyHex }) {
  if (!colors.length) return null;

  return (
    <div className="palette-row">
      {colors.map((hex, index) => (
        <PaintChip key={`${hex}-${index}`} hex={hex} index={index} onCopy={onCopyHex} />
      ))}
    </div>
  );
}
