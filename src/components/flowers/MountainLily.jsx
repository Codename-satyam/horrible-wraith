import { memo } from 'react';

// A hand-drawn mountain lily: six long recurved tepals, prominent stamens, a tall stem and narrow leaves.
// tone: pink | butter | lilac | coral     pose: 0-3 (stem curve, bloom tilt, bud)
const bez = (p, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]); };
const POSES = [
  { stem: [[60, 224], [58, 172], [62, 132], [60, 98]], bloom: [60, 84], tilt: 0 },
  { stem: [[60, 224], [50, 174], [42, 134], [52, 102]], bloom: [54, 88], tilt: -16 },
  { stem: [[58, 224], [70, 178], [80, 136], [70, 104]], bloom: [68, 90], tilt: 18 },
  { stem: [[60, 224], [62, 178], [50, 142], [56, 112]], bloom: [56, 96], tilt: -6, bud: true }
];
const PETALS = [[-97, 0.8], [-58, 0.96], [-22, 1], [22, 1], [58, 0.96], [97, 0.8]];
const PETAL = 'M0 0C-8-12-11-28-6-42C-3-51 3-57 10-58C6-52 6-44 6-38C7-24 6-10 0 0Z';
const SHADE = 'M0 0C6-10 7-24 6-38C6-44 6-50 10-58C3-50 1-40 0-28C-1-18 0-8 0 0Z';
const LEAF = 'M0 0C6-14 10-34 6-58C0-38-4-16 0 0Z';
const LEAVES = [[0.05, -58, 1.15], [0.15, 52, 1.05], [0.3, -42, 0.85], [0.44, 40, 0.7]];
const STAMENS = [[-16, -40], [-8, -47], [-24, -30], [16, -40], [8, -47], [24, -30]];

function MountainLily({ tone = 'pink', pose = 0, flip = false, delay = 0, className = '', style }) {
  const P = POSES[pose % POSES.length];
  const [bx, by] = P.bloom;
  const d = (extra = 0) => ({ '--dl': `${(delay + extra).toFixed(2)}s` });
  const [sx, sy] = bez(P.stem, 0.6);
  return (
    <svg viewBox="0 0 120 230" className={`lily sway ${className}`} style={{ '--tone': `var(--${tone})`, animationDelay: `${-delay * 2}s`, ...style }} aria-hidden="true" focusable="false">
      <g filter="url(#rough)" transform={flip ? 'translate(120 0) scale(-1 1)' : undefined}>
        <path className="stem ink" pathLength="1" style={d(0)} d={`M${P.stem[0]}C${P.stem[1]} ${P.stem[2]} ${P.stem[3]}`} />
        {LEAVES.map(([t, a, s], i) => {
          const [x, y] = bez(P.stem, t);
          return (
            <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a}) scale(${s})`}>
              <path className="leaf ink" pathLength="1" style={d(0.5 + i * 0.18)} d={LEAF} />
              <path className="vein ink" pathLength="1" style={d(0.9 + i * 0.18)} d="M0-3C3-18 5-34 3-50" />
              <path d={LEAF} fill="url(#hatch)" opacity=".3" />
            </g>
          );
        })}
        {P.bud && (
          <g transform={`translate(${sx.toFixed(1)} ${sy.toFixed(1)})`}>
            <path className="stem ink" pathLength="1" style={d(1)} d="M0 0C10-6 18-14 22-26" />
            <g transform="translate(22 -26) rotate(24)"><path className="p ink" pathLength="1" style={d(1.3)} d="M0 0C-6-6-6-17 0-26C6-17 6-6 0 0Z" /></g>
          </g>
        )}
        <g transform={`translate(${bx} ${by}) rotate(${P.tilt})`}>
          {[...PETALS].sort((a, b) => Math.abs(a[0]) - Math.abs(b[0])).map(([a, l], i) => (
            <g className="petal" key={a} style={{ '--a': `${a}deg`, '--l': l, ...d(1.1 + i * 0.12) }}>
              <g transform={`scale(${a < 0 ? -1 : 1} 1)`}>
                <path className="p ink" pathLength="1" d={PETAL} />
                <path className="shade" d={SHADE} fill="url(#hatch)" />
                <path className="vein ink" pathLength="1" d="M0-3C-1-20 0-38 5-54" />
              </g>
            </g>
          )).reverse()}
          <g className="stamens">
            {STAMENS.map(([x, y], i) => (
              <g key={i}>
                <path className="fil ink" pathLength="1" style={d(1.8 + i * 0.05)} d={`M0 0Q${x * 0.3} ${y * 0.7} ${x} ${y}`} />
                <ellipse className="anther" cx={x} cy={y} rx="2.2" ry="4.2" transform={`rotate(${x * 1.6} ${x} ${y})`} />
              </g>
            ))}
            <path className="fil ink" pathLength="1" style={d(2)} d="M0 0C1-20 0-36 2-52" />
            <circle className="anther" cx="2" cy="-54" r="2.3" />
          </g>
        </g>
      </g>
    </svg>
  );
}
export default memo(MountainLily);
