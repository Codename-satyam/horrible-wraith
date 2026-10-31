import { useState } from 'react';

// Draws the photograph; if the file is missing, a pencil-sketch placeholder takes its place.
const SCENES = [
  <g key="a"><path d="M0 150 C40 110 80 130 120 105 C160 80 190 110 240 100 L240 200 L0 200Z" /><circle cx="180" cy="48" r="18" /><path d="M180 22v-8M180 82v8M154 48h-8M214 48h8M162 30l-6-6M198 30l6-6" /></g>,
  <g key="b"><path d="M70 150V100L120 62L170 100V150Z" /><path d="M105 150v-34h30v34" /><path d="M20 160H220" /><path d="M200 160v-40M200 120c-16-6-20-26-4-34c4 14 12 20 4 34" /></g>,
  <g key="c"><path d="M30 165C70 120 110 140 150 110C185 84 210 120 215 165Z" /><path d="M60 60q16-14 32 0q16-14 32 0" /><path d="M140 40q12-10 24 0q12-10 24 0" /></g>
];

export function PlaceholderSketch({ m, index = 0 }) {
  const file = m.image.split('/').pop();
  return (
    <span className="ph-sketch" role="img" aria-label={`Placeholder for ${m.alt}`}>
      <svg viewBox="0 0 240 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="240" height="200" className="ph-bg" />
        <g className="ph-lines" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#rough-lite)">{SCENES[index % SCENES.length]}</g>
        <path d="M0 200L240 140V200Z" fill="url(#hatch)" opacity=".5" />
      </svg>
      <small>{file} goes here</small>
    </span>
  );
}

export default function Photo({ m, index = 0, eager = false }) {
  const [bad, setBad] = useState(false);
  if (bad) return <PlaceholderSketch m={m} index={index} />;
  return <img className="photo-img" src={m.image} alt={m.alt} loading={eager ? 'eager' : 'lazy'} onError={() => setBad(true)} draggable="false" />;
}
