import { useWobblyBorder } from '../hooks/useWobblyBorder';
import './WobblyCard.css';

export default function WobblyCard({ seed, className = '', children }) {
  const { ref, size, path } = useWobblyBorder(seed);

  return (
    <div ref={ref} className={`wobbly-card ${className}`}>
      {size.width > 0 && (
        <svg className="wobbly-card__border" width={size.width} height={size.height}>
          <path d={path} className="wobbly-card__path" />
        </svg>
      )}
      <div className="wobbly-card__content">{children}</div>
    </div>
  );
}
