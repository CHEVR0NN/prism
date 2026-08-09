export function DoodleArrow({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 60 24" aria-hidden="true">
      <path d="M2 18 C 18 4, 34 4, 50 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M40 6 L50 12 L42 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleUnderline({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 12" aria-hidden="true">
      <path
        d="M2 8 C 20 2, 40 10, 60 6 C 80 2, 100 10, 118 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
