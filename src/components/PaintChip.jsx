import { hashString, seededRandom } from '../lib/hash';
import { tornEdgeClipPath } from '../lib/tornEdge';
import './PaintChip.css';

export default function PaintChip({ hex, index, onCopy, selected, onToggleSelect }) {
  const seed = `${hex}-${index}`;
  const rand = seededRandom(hashString(seed));
  const rotation = (rand() - 0.5) * 6;
  const clipPath = tornEdgeClipPath(seed);

  return (
    <div className="paint-chip" style={{ transform: `rotate(${rotation.toFixed(2)}deg)` }}>
      <button
        type="button"
        className="paint-chip__copy"
        style={{ backgroundColor: hex, clipPath }}
        onClick={() => onCopy(hex)}
        aria-label={`Copy hex code ${hex}`}
      >
        <span className="paint-chip__hex">{hex}</span>
      </button>
      <button
        type="button"
        className={`paint-chip__select ${selected ? 'paint-chip__select--active' : ''}`}
        aria-pressed={selected}
        aria-label={selected ? `Deselect ${hex}` : `Select ${hex}`}
        onClick={() => onToggleSelect(index)}
      >
        ✓
      </button>
    </div>
  );
}
