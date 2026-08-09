import './SwatchCountSlider.css';

export default function SwatchCountSlider({ value, onChange }) {
  return (
    <label className="swatch-slider">
      <span className="swatch-slider__label">Swatches: {value}</span>
      <input
        type="range"
        min={3}
        max={8}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
