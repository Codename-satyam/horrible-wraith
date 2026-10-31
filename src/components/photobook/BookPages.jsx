import { memories } from '../../data/memories';
import Photo from '../shared/Photo';
import HandButton from '../shared/HandButton';
import LilyCluster from '../flowers/LilyCluster';

// The pieces of the book. index k < n is a memory, k === n is the last page.
// They are used twice: as the real page, and as inert copies glued onto the turning leaf.
export const Shell = ({ kind, children }) => <div className={`pbk-pg pbk-pg--${kind}`}>{children}</div>;

export function LeftPage({ k }) {
  const n = memories.length;
  if (k >= n) {
    return (
      <div className="pbk-left pbk-left--end">
        <LilyCluster className="pbk-end-lily" poses={[0, 2]} tones={['pink', 'lilac']} delay={0.2} />
        <p className="hand pbk-theend">the end</p>
      </div>
    );
  }
  const m = memories[k];
  return (
    <div className="pbk-left">
      <figure className={`pbk-photo ${m.shape || 'portrait'}`}>
        <span className="corner c1" /><span className="corner c2" /><span className="corner c3" /><span className="corner c4" />
        <div className="frame"><div className="pic"><Photo m={m} index={k} eager /></div></div>
      </figure>
      {m.annotation && <p className="hand pbk-note">{m.annotation}</p>}
      <span className="hand pbk-no l">{k * 2 + 1}</span>
    </div>
  );
}

export function RightPage({ k, onGo, onRestart }) {
  const n = memories.length;
  if (k >= n) {
    return (
      <div className="pbk-right pbk-end">
        <p className="hand pbk-title">That was the last page, for now.</p>
        <p className="serif">Every memory here is waiting for you to come back to it. There is a little quiz next, if you feel like playing.</p>
        <div className="pbk-actions"><HandButton onClick={() => onGo?.('quiz')}>Go to the quiz</HandButton><HandButton variant="ghost" onClick={() => onRestart?.()}>Read it again</HandButton></div>
      </div>
    );
  }
  const m = memories[k];
  const paras = String(m.story || '').split(/\n\s*\n/).filter(Boolean);
  return (
    <article className="pbk-right">
      <h3 className="hand pbk-title">{m.title}</h3>
      {m.date && <p className="pbk-date">{m.date}</p>}
      <div className="pbk-story serif">{paras.map((p, j) => <p key={j}>{p}</p>)}</div>
      <span className="hand pbk-no r">{k * 2 + 2}</span>
      <span className="pbk-count">{k + 1} of {n}</span>
    </article>
  );
}

