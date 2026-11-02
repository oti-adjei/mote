/** The hero's nested-arch study. Ported verbatim from the design export. */
export function StudyMark(): React.ReactElement {
  return (
    <svg viewBox="0 0 240 320" width="240" height="320" role="presentation">
      <path d="M32 280V120a88 88 0 0 1 176 0v160" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M56 280V120a64 64 0 0 1 128 0v160M80 280V120a40 40 0 0 1 80 0v160M104 280V120a16 16 0 0 1 32 0v160"
        fill="none" stroke="currentColor" strokeWidth="1"
      />
      <circle className="study-orb" cx="120" cy="160" r="56" />
      <path
        d="M16 280h208M120 16v288"
        fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5"
      />
    </svg>
  );
}
