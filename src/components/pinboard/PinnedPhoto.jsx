import { forwardRef } from 'react';
import Photo from '../shared/Photo';

const HOLDS = ['pin', 'tape', 'clip'];
const PinnedPhoto = forwardRef(function PinnedPhoto({ m, i, open, onToggle, children }, ref) {
  const hold = HOLDS[i % 3];
  return (
    <div ref={ref} className={`pb-item ${m.shape || 'portrait'} ${open ? 'lifted' : ''}`} style={{ '--r': `${m.rotation || 0}deg`, '--i': i }}>
      <button type="button" className="pb-btn" aria-expanded={open} aria-label={`${open ? 'Close' : 'Open'} the note for ${m.caption}`} onClick={onToggle}>
        {hold === 'clip'
          ? <svg className="hold clip" viewBox="0 0 24 60" aria-hidden="true"><path d="M8 52V14a6 6 0 0 1 12 0v34a9 9 0 0 1-18 0V18" fill="none" stroke="#3b3835" strokeWidth="2.2" strokeLinecap="round" /></svg>
          : <span className={`hold ${hold}`} aria-hidden="true" />}
        <span className="frame"><span className="pic"><Photo m={m} index={i} /></span></span>
        <span className="hand pb-cap">{m.caption}</span>
      </button>
      {children}
    </div>
  );
});
export default PinnedPhoto;
