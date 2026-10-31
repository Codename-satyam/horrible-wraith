import { useCapy } from './CapybaraController';
import CapybaraSpeechBubble from './CapybaraSpeechBubble';

// Pencil-drawn capybara (faces left). Reused for the quiz scenes.
export function CapybaraArt({ hat = false, className = '' }) {
  return (
    <svg className={`capy-art ${className}`} viewBox="0 0 180 120" aria-hidden="true" focusable="false">
      <ellipse cx="96" cy="110" rx="66" ry="6" fill="url(#hatch)" opacity=".45" />
      <g filter="url(#rough-lite)" strokeLinecap="round" strokeLinejoin="round" stroke="#3b3835" strokeWidth="2.2">
        <g className="capy-bodybob">
          <path className="capy-leg" d="M112 92h18v17h-18zM52 94h16v15H52z" fill="var(--capy)" />
          <path className="capy-fur" d="M38 72C36 46 64 36 100 36c40 0 64 18 60 42-2 18-20 26-60 26-38 0-60-8-62-32z" />
          <path d="M70 100C100 108 140 104 156 82C150 96 120 106 70 100z" fill="url(#hatch)" stroke="none" opacity=".55" />
          <path d="M92 44c20-4 42 0 54 12" fill="none" strokeWidth="1.2" opacity=".45" />
          <g className="capy-head">
            <path className="capy-fur" d="M18 66C8 54 14 38 30 36c16-2 28 6 30 22 2 18-10 30-26 30-10 0-14-10-16-22z" />
            <path className="capy-nose" d="M10 58c-4 4-3 14 4 16c6 1 10-6 8-14c-2-5-9-6-12-2z" />
            <circle cx="12" cy="62" r="1.6" fill="#3b3835" stroke="none" />
            <path d="M16 76q6 5 13 0" fill="none" strokeWidth="1.6" />
            <circle className="capy-ear" cx="50" cy="38" r="6" />
            <g className="capy-eye"><circle cx="33" cy="52" r="2.8" fill="#3b3835" stroke="none" /></g>
            <circle className="capy-blush" cx="40" cy="66" r="5" stroke="none" />
            <path d="M18 70l-12 2M18 72l-12 8" fill="none" strokeWidth="1" opacity=".5" />
            {hat && <g><path d="M24 38L38 8l14 30z" fill="var(--butter)" /><path d="M31 26l14 2M28 33l20 2" fill="none" strokeWidth="1.4" /><circle cx="38" cy="8" r="3.5" fill="var(--pink)" /></g>}
          </g>
        </g>
      </g>
    </svg>
  );
}

export default function Capybara({ page }) {
  const { bubble, away, beside, tap } = useCapy();
  return (
    <div className={`capy ${away ? 'capy--away' : ''} ${beside ? 'capy--beside' : ''}`} data-page={page}>
      <CapybaraSpeechBubble bubble={bubble} />
      <button type="button" className="capy-btn" onClick={tap} aria-label="Tap Capy for another message">
        <div key={bubble?.id || 'idle'} className={bubble ? 'capy-hop' : ''}><CapybaraArt /></div>
      </button>
    </div>
  );
}
