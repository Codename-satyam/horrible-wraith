// A soft watercolor wash that spreads out from wherever the welcome button was pressed.
const DABS = [[10, 20, 90, 'pink'], [88, 14, 110, 'butter'], [50, 52, 130, 'lilac'], [14, 80, 100, 'sage'], [84, 78, 120, 'coral'], [60, 12, 70, 'sage']];
export default function ColorReveal({ origin }) {
  return (
    <div className="wash" style={{ '--cx': `${origin.x}px`, '--cy': `${origin.y}px` }}>
      <i className="blob b1" /><i className="blob b2" /><i className="blob b3" /><i className="blob b4" />
      {DABS.map(([x, y, s, c], i) => <i key={i} className="dab" style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, '--i': i, background: `var(--${c})` }} />)}
    </div>
  );
}
