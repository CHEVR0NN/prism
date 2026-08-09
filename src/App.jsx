import NoiseOverlay from './components/NoiseOverlay';
import WobblyCard from './components/WobblyCard';
import WobblyButton from './components/WobblyButton';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <NoiseOverlay />
      <h1>Prism</h1>
      <WobblyCard seed="prototype-card">
        <p>This is a wobbly card, hand-drawn border, hard-offset shadow.</p>
        <WobblyButton seed="prototype-button">Sample button</WobblyButton>
      </WobblyCard>
    </div>
  );
}
