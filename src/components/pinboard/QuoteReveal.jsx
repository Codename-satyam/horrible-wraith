import { createPortal } from 'react-dom';
import { ChevronL, ChevronR } from '../shared/Chevrons';

// The handwritten note that appears next to a lifted photograph (bottom sheet on phones).
export default function QuoteReveal({ m, side, onClose, onStep, sheet }) {
  const node = (
    <aside className={`quote-note side-${side} ${sheet ? 'sheet-mode' : ''}`} role="region" aria-label={`Note for ${m.caption}`}>
      <svg className="q-line" viewBox="0 0 60 30" aria-hidden="true"><path className="ink" pathLength="1" d="M2 15C16 4 30 26 58 14" fill="none" stroke="#3b3835" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1" /></svg>
      <p className="hand q-cap">{m.caption}{m.date ? ` · ${m.date}` : ''}</p>
      <p className="hand q-text">{m.quote}</p>
      <div className="q-ctl">
        <button type="button" onClick={() => onStep(-1)} aria-label="Previous photograph"><ChevronL /></button>
        <button type="button" onClick={onClose} className="q-close">Close note</button>
        <button type="button" onClick={() => onStep(1)} aria-label="Next photograph"><ChevronR /></button>
      </div>
    </aside>
  );
  return sheet ? createPortal(node, document.body) : node;
}
