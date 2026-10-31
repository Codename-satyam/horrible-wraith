// A gentle, one-time float of pencil hearts, stars and confetti strokes.
const KINDS = ['M0 6C-12-3-8-13 0-7C8-13 12-3 0 6Z', 'M0-8L2.4-2.5 8-2.2 3.6 1.5 5 7 0 3.8-5 7-3.6 1.5-8-2.2-2.4-2.5Z', 'M-6 0L6 -3', 'M-5 -4L5 4'];
export default function CakeCelebration({ count = 22 }) {
  return (
    <div className="celebrate" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const k = i % KINDS.length;
        return (
          <svg key={i} className={`cm k${k}`} viewBox="-12 -12 24 24" style={{ '--x': `${6 + ((i * 41) % 90)}%`, '--dl': `${(i * 0.13).toFixed(2)}s`, '--dur': `${4 + (i % 5) * 0.7}s`, '--dx': `${((i % 7) - 3) * 14}px`, '--c': ['var(--pink)', 'var(--butter)', 'var(--lilac)', 'var(--coral)', 'var(--sage)'][i % 5] }}>
            <path d={KINDS[k]} fill={k < 2 ? 'var(--c)' : 'none'} stroke="#3b3835" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      })}
    </div>
  );
}
