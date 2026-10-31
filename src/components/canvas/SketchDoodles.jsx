// Little pencil doodles. Each fills with watercolor once the world wakes up (CSS: [data-world=color]).
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const wrap = (cls, vb, style, body, w) => (
  <svg className={`doodle ${cls}`} viewBox={vb} style={style} aria-hidden="true" focusable="false" width={w}>
    <g filter="url(#rough-lite)" {...base}>{body}</g>
  </svg>
);
export const Star = ({ c = 'var(--butter)', className = '', style }) => wrap(className, '0 0 50 50', { '--c': c, ...style },
  <path className="ink fillable" pathLength="1" d="M25 5l6.5 14.5 15.5 1.5-11.7 10.4 3.5 15.4L25 38.8 11.2 46.8l3.5-15.4L3 21l15.5-1.5z" />);
export const Heart = ({ c = 'var(--pink)', className = '', style }) => wrap(className, '0 0 50 50', { '--c': c, ...style },
  <path className="ink fillable" pathLength="1" d="M25 43C9 31 6 20 12.5 14c5-4.5 10-1.5 12.5 4 2.5-5.5 7.5-8.5 12.5-4C44 20 41 31 25 43z" />);
export const Sparkle = ({ className = '', style }) => wrap(className, '0 0 40 40', style,
  <path className="ink" pathLength="1" d="M20 4v32M4 20h32M9 9l22 22M31 9L9 31" />);
export const Swirl = ({ className = '', style }) => wrap(className, '0 0 80 60', style,
  <path className="ink" pathLength="1" d="M8 40C8 14 46 8 56 28c8 16-14 24-22 12-6-9 4-18 12-12" />);
export const Arrow = ({ className = '', style }) => wrap(className, '0 0 120 60', style,
  <path className="ink" pathLength="1" d="M6 46C32 6 74 6 112 36M112 36l-3-17M112 36l-17 3" />);
export const Squiggle = ({ className = '', style }) => wrap(className, '0 0 160 30', style,
  <path className="ink" pathLength="1" d="M4 18q10-14 20 0t20 0 20 0 20 0 20 0 20 0 20 0" />);
export const Dash = ({ className = '', style }) => wrap(className, '0 0 40 20', style, <path className="ink" pathLength="1" d="M4 14L36 6M10 18L30 12" />);

const SPOTS = [
  [Star, 'dd', { left: '12%', top: '14%', width: 26, '--dur': '9s' }],
  [Heart, 'dd', { left: '86%', top: '28%', width: 30, '--dur': '8s' }],
  [Sparkle, 'dd', { left: '30%', top: '8%', width: 22, '--dur': '10s' }],
  [Swirl, 'dd', { left: '70%', top: '10%', width: 64, '--dur': '11s' }],
  [Heart, 'dd', { left: '6%', top: '56%', width: 24, '--dur': '9.5s', '--c': 'var(--lilac)' }],
  [Star, 'dd', { left: '92%', top: '62%', width: 24, '--dur': '10s', '--c': 'var(--pink)' }],
  [Dash, 'dd', { left: '48%', top: '90%', width: 36, '--dur': '12s' }],
  [Sparkle, 'dd', { left: '60%', top: '84%', width: 20, '--dur': '8s' }],
  [Heart, 'dd', { left: '22%', top: '78%', width: 22, '--dur': '10.5s', '--c': 'var(--coral)' }]
];
export default function SketchDoodles() {
  return <>{SPOTS.map(([C, cls, st], i) => <C key={i} className={`${cls} float`} style={{ position: 'absolute', animationDelay: `${-i * 1.3}s`, ...st }} />)}</>;
}
