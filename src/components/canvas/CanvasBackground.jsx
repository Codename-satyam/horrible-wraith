import { useRef } from 'react';
import useParallax from '../../hooks/useParallax';
import LilyBackground from '../flowers/LilyBackground';
import SketchDoodles from './SketchDoodles';
import ColorReveal from './ColorReveal';

// The drawing paper: CSS texture + graphite marks + three softly parallaxed layers + the watercolor wash.
export default function CanvasBackground({ origin }) {
  const ref = useRef(null);
  useParallax(ref);
  return (
    <div className="canvas-bg" ref={ref} aria-hidden="true">
      <div className="paper" />
      <div className="hatch-corner tl" /><div className="hatch-corner br" />
      <svg className="marks" viewBox="0 0 1000 700" preserveAspectRatio="none" focusable="false">
        <g fill="none" stroke="#3b3835" strokeLinecap="round">
          <path d="M0 140H1000M0 560H1000M180 0V700M820 0V700" strokeWidth="0.6" strokeDasharray="2 9" opacity=".18" vectorEffect="non-scaling-stroke" />
          <path d="M60 640q40-20 90-8M70 650q50-18 100-4" strokeWidth="1" opacity=".18" vectorEffect="non-scaling-stroke" />
          <path d="M880 60l30 12M884 72l34 8M890 84l24 6" strokeWidth="1" opacity=".16" vectorEffect="non-scaling-stroke" />
          <path d="M430 40q30 8 60 0" strokeWidth="1" opacity=".14" vectorEffect="non-scaling-stroke" />
        </g>
        <g fill="#3b3835" filter="url(#smudge)">
          <ellipse cx="230" cy="120" rx="46" ry="14" opacity=".05" /><ellipse cx="760" cy="520" rx="60" ry="16" opacity=".05" />
          <ellipse cx="520" cy="620" rx="40" ry="10" opacity=".04" />
        </g>
      </svg>
      <div className="layer l1"><SketchDoodles /></div>
      <div className="layer l2"><LilyBackground /></div>
      <ColorReveal origin={origin} />
      <div className="sketch-frame" />
    </div>
  );
}
