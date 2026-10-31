import { useEffect, useRef } from 'react';

export const SLICES = 10;

// The turning page. It is cut into SLICES thin strips; each strip hangs off the one before it and turns a
// little further, so the sheet really bends as it lifts. All angles come from the CSS variable --prog
// (0 = flat on the right, 1 = flipped to the left) which the book animates or the finger drags.
// front/back are the two sides of the paper.
export default function PageLeaf({ front, back }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.setAttribute('inert', ''); }, []);

  const strip = (k) => (k >= SLICES ? null : (
    <div className="pbk-slice" style={{ '--k': k }} key={k}>
      <div className="pbk-face front"><div className="pbk-face-in" style={{ left: `${-100 * k}%` }}>{front}</div><i className="pbk-shade" /></div>
      <div className="pbk-face back"><div className="pbk-face-in" style={{ left: `${-100 * (SLICES - k - 1)}%` }}>{back}</div><i className="pbk-shade" /></div>
      {strip(k + 1)}
    </div>
  ));

  return (
    <div className="pbk-leaf-fade" ref={ref} aria-hidden="true" style={{ '--n': SLICES }}>
      <div className="pbk-leaf">{strip(0)}</div>
    </div>
  );
}
