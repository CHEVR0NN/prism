import { hashString, seededRandom } from '../lib/hash';
import { tornEdgeClipPath } from '../lib/tornEdge';
import './PaintChip.css';

export default function PaintChip({ hex, index, onCopy }) {
  const seed = `${hex}-${index}`;
  const rand = seededRandom(hashString(seed));
  const rotation = (rand() - 0.5) * 6;
  const clipPath = tornEdgeClipPath(seed);

  return (
    <button
      type="button"
      className="paint-chip"
      style={{ backgroundColor: hex, clipPath, transform: `rotate(${rotation.toFixed(2)}deg)` }}
      onClick={() => onCopy(hex)}
      aria-label={`Copy hex code ${hex}`}
    >
      <span className="paint-chip__hex">{hex}</span>
    </button>
  );
}
