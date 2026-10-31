// One hand-drawn candle with stripes, a wick and a tiny ember.
export default function SketchCandle({ x, y, w, i }) {
  const h = 58, hw = w / 2;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <path className="draw candle-body" pathLength="1" style={{ '--dl': `${i * 0.18}s` }} d={`M${-hw} 0L${-hw} ${-h}Q0 ${-h - 4} ${hw} ${-h}L${hw} 0Q0 5 ${-hw} 0Z`} />
      <path className="draw" pathLength="1" style={{ '--dl': `${0.4 + i * 0.18}s` }} fill="none" d={`M${-hw} -8L${hw} -18M${-hw} -26L${hw} -36M${-hw} -44L${hw} -54`} />
      <path className="draw" pathLength="1" style={{ '--dl': `${0.7 + i * 0.18}s` }} fill="none" d={`M0 ${-h - 2}C2 ${-h - 7} -2 ${-h - 10} 1 ${-h - 14}`} />
      <circle className="ember" cx="1" cy={-h - 14} r="2.4" />
    </g>
  );
}
