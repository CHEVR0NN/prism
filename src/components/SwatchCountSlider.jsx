import { hashString, seededRandom } from '../lib/hash';
import './SwatchCountSlider.css';

const COUNTS = [3, 4, 5, 6, 7, 8];

export default function SwatchCountSlider({ value, onChange }) {
  return (
    <div className="swatch-slider">
      <span className="swatch-slider__label">Swatches</span>
      <div className="swatch-slider__tabs" role="radiogroup" aria-label="Number of swatches">
        {COUNTS.map((count) => {
          const rand = seededRandom(hashString(`swatch-tab-${count}`));
          const rotation = (rand() - 0.5) * 6;
          return (
            <button
              key={count}
              type="button"
              role="radio"
              aria-checked={value === count}
              className={`swatch-slider__tab ${value === count ? 'swatch-slider__tab--active' : ''}`}
              style={{ '--tab-rotation': `${rotation.toFixed(2)}deg` }}
              onClick={() => onChange(count)}
            >
              {count}
            </button>
          );
        })}
      </div>
    </div>
  );
}
