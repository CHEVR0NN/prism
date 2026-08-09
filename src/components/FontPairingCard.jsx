import WobblyCard from './WobblyCard';
import WobblyButton from './WobblyButton';
import './FontPairingCard.css';

export default function FontPairingCard({ pairing, onShuffle }) {
  if (!pairing) return null;

  return (
    <WobblyCard seed={`font-${pairing.id}`} className="font-pairing-card">
      <h2 className="font-pairing-card__heading" style={{ fontFamily: `'${pairing.display.name}', serif` }}>
        {pairing.display.name}
      </h2>
      <p className="font-pairing-card__body" style={{ fontFamily: `'${pairing.body.name}', sans-serif` }}>
        Paired with {pairing.body.name} — the quick brown fox jumps over the lazy dog.
      </p>
      <WobblyButton seed={`shuffle-${pairing.id}`} onClick={onShuffle}>
        Shuffle pairing
      </WobblyButton>
    </WobblyCard>
  );
}
