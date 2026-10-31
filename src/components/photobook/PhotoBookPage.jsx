import Photo from '../shared/Photo';

// One spread: the photograph on the left page, the story on the right.
export default function PhotoBookPage({ m, i, total, dir }) {
  const paras = String(m.story || '').split(/\n\s*\n/).filter(Boolean);
  return (
    <div className="pbk-spread">
      <div className="pbk-left">
        <figure className={`pbk-photo ${m.shape || 'portrait'}`}>
          <span className="corner c1" /><span className="corner c2" /><span className="corner c3" /><span className="corner c4" />
          <div className="frame"><div className="pic"><Photo m={m} index={i} eager /></div></div>
        </figure>
        {m.annotation && <p className="hand pbk-note">{m.annotation}</p>}
        <span className="hand pbk-no l">{i * 2 + 1}</span>
      </div>
      <article className={`pbk-right turn-${dir}`} key={m.id}>
        <h3 className="hand pbk-title">{m.title}</h3>
        {m.date && <p className="pbk-date">{m.date}</p>}
        <div className="pbk-story serif">{paras.map((p, k) => <p key={k}>{p}</p>)}</div>
        <span className="hand pbk-no r">{i * 2 + 2}</span>
        <span className="pbk-count">{i + 1} of {total}</span>
      </article>
    </div>
  );
}
