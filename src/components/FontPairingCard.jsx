import WobblyCard from './WobblyCard';
import WobblyButton from './WobblyButton';
import './FontPairingCard.css';

export default function FontPairingCard({ pairing, onShuffle, rationale }) {
  if (!pairing) return null;

  return (
    <WobblyCard seed={`font-${pairing.id}`} className="font-pairing-card">
      {rationale && (
        <p className="font-pairing-card__rationale">
          Your palette reads {rationale}, paired with {pairing.display.name} and {pairing.body.name}.
        </p>
      )}
      <div className="font-pairing-card__specimens">
        <div className="font-pairing-card__specimen">
          <span className="font-pairing-card__specimen-label">Display</span>
          <p className="font-pairing-card__specimen-name" style={{ fontFamily: `'${pairing.display.name}', serif` }}>
            {pairing.display.name}
          </p>
        </div>
        <div className="font-pairing-card__specimen">
          <span className="font-pairing-card__specimen-label">Body</span>
          <p className="font-pairing-card__specimen-name" style={{ fontFamily: `'${pairing.body.name}', sans-serif` }}>
            {pairing.body.name}
          </p>
        </div>
      </div>

      <div className="font-pairing-card__combo">
        <h2 className="font-pairing-card__combo-heading" style={{ fontFamily: `'${pairing.display.name}', serif` }}>
          The quick brown fox
        </h2>
        <p className="font-pairing-card__combo-body" style={{ fontFamily: `'${pairing.body.name}', sans-serif` }}>
          jumps over the lazy dog. Here's how {pairing.display.name} and {pairing.body.name} read together.
        </p>
      </div>

      <WobblyButton seed={`shuffle-${pairing.id}`} onClick={onShuffle}>
        Shuffle pairing
      </WobblyButton>
    </WobblyCard>
  );
}
