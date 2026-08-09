import { useWobblyBorder } from '../hooks/useWobblyBorder';
import './WobblyButton.css';

export default function WobblyButton({ seed, className = '', children, ...props }) {
  const { ref, size, path } = useWobblyBorder(seed);

  return (
    <button ref={ref} type="button" className={`wobbly-button ${className}`} {...props}>
      {size.width > 0 && (
        <svg className="wobbly-button__border" width={size.width} height={size.height} aria-hidden="true">
          <path d={path} className="wobbly-button__path" />
        </svg>
      )}
      <span className="wobbly-button__label">{children}</span>
    </button>
  );
}
