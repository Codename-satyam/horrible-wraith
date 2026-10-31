import { ChevronL, ChevronR } from '../shared/Chevrons';

export default function PageTurn({ index, total, onPrev, onNext, onClose }) {
  return (
    <div className="pbk-ctl">
      <button type="button" className="hbtn hbtn--ghost" onClick={onPrev} disabled={index === 0} aria-label="Previous page"><span><ChevronL /> Back</span></button>
      <button type="button" className="hbtn hbtn--ghost" onClick={onClose}><span>Close the book</span></button>
      <button type="button" className="hbtn hbtn--ghost" onClick={onNext} disabled={index === total} aria-label="Next page"><span>Next <ChevronR /></span></button>
    </div>
  );
}
