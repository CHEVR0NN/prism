import './Skeleton.css';

export default function ResultsSkeleton() {
  return (
    <div className="results-skeleton" aria-hidden="true">
      <div className="results-skeleton__row">
        <div className="results-skeleton__chip" />
        <div className="results-skeleton__chip" />
        <div className="results-skeleton__chip" />
        <div className="results-skeleton__chip" />
        <div className="results-skeleton__chip" />
      </div>
      <div className="results-skeleton__block" />
    </div>
  );
}
