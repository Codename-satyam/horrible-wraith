// Individually illustrated flame + its smoke wisp. state: unlit | lit | blowing | out
export default function CandleFlame({ x, y, i, state }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${(y - 72).toFixed(1)})`}>
      <g className="flame" data-s={state} style={{ '--bd': `${0.3 + i * 0.15}s`, '--fd': `${(i * 0.37) % 1}s` }}>
        <circle className="glow" cx="0" cy="-14" r="26" fill="url(#cglow)" />
        <g className="flame-shape">
          <g className="flame-flick">
            <path className="flame-out" d="M0 0C-9-9-7-22 0-36C7-22 9-9 0 0Z" />
            <path className="flame-in" d="M0 -2C-4-7-3-14 0-21C3-14 4-7 0 -2Z" />
          </g>
        </g>
      </g>
      <g className="smoke-g" style={{ '--sd': `${0.1 + i * 0.15}s` }}>
        <path className="smoke" pathLength="1" d="M0 -2C-8-14 8-26 0-42C-6-54 6-62 2-78" />
      </g>
    </g>
  );
}
