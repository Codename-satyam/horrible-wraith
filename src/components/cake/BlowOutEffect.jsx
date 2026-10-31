// A gentle gust travelling left to right: pencil wind lines, swirls and drifting specks.
const LINES = [0, 1, 2].map((k) => `M24 ${172 + k * 22}C90 ${152 + k * 22} 140 ${196 + k * 22} 210 ${176 + k * 22}S300 ${166 + k * 22} 360 ${180 + k * 22}`);
const SPECKS = Array.from({ length: 9 }, (_, i) => ({ x: 60 + i * 26, y: 170 + ((i * 29) % 70), dx: 120 + (i % 3) * 40, dy: -10 - (i % 4) * 10, d: (i * 0.09).toFixed(2) }));
export default function BlowOutEffect() {
  return (
    <g className="gust" aria-hidden="true" fill="none" stroke="#3b3835" strokeLinecap="round">
      <path className="gust-shape" d="M16 160C90 140 190 150 300 168C200 190 110 232 16 214C40 196 40 180 16 160Z" stroke="none" />
      {LINES.map((d, k) => <path key={k} className="wind" pathLength="1" style={{ '--wd': `${k * 0.12}s` }} d={d} strokeWidth="2" />)}
      <path className="wind swirl" pathLength="1" style={{ '--wd': '.25s' }} d="M150 196c10-16 34-10 28 8c-6 16-30 8-20-8" strokeWidth="1.8" />
      <path className="wind swirl" pathLength="1" style={{ '--wd': '.4s' }} d="M232 170c8-12 26-8 22 6c-5 12-24 6-16-6" strokeWidth="1.6" />
      {SPECKS.map((s, i) => <circle key={i} className="speck" cx={s.x} cy={s.y} r="1.8" fill="#3b3835" stroke="none" style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px`, '--pd': `${s.d}s` }} />)}
    </g>
  );
}
