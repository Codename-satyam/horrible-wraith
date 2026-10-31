import { useCallback, useEffect, useRef, useState } from 'react';
import { birthday as b } from '../../data/birthday';
import { memories } from '../../data/memories';
import useReducedMotion from '../../hooks/useReducedMotion';
import useMediaQuery from '../../hooks/useMediaQuery';
import { dragProgress, settleTarget } from '../../lib/pageCurl';
import { useCapy } from '../capybara/CapybaraController';
import HandButton from '../shared/HandButton';
import LilyCluster from '../flowers/LilyCluster';
import { Shell, LeftPage, RightPage } from './BookPages';
import PageLeaf from './PageLeaf';
import PageTurn from './PageTurn';

const TURN_MS = 950;

// index 0..n-1 are memories, index n is the last page.
// While a page turns, `turn` = { lo, hi, prog, go, drag }: the leaf carries page `lo` on its front and the
// left side of page `hi` on its back; underneath, the right side of `hi` waits to be uncovered.
export default function PhotoBook({ onGo }) {
  const reduced = useReducedMotion();
  const wide = useMediaQuery('(min-width: 760px)');
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [turn, setTurn] = useState(null);
  const { say } = useCapy();
  const iRef = useRef(0), busy = useRef(false), drag = useRef(null), spread = useRef(null);
  const timers = useRef([]), frames = useRef([]);
  const n = memories.length;

  const later = (f, ms) => { timers.current.push(setTimeout(f, ms)); };
  const nextFrames = (f) => {
    const raf = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : (cb) => setTimeout(cb, 16);
    frames.current.push(raf(() => frames.current.push(raf(f))));
  };
  const clearAll = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    frames.current.forEach((f) => window.cancelAnimationFrame?.(f)); frames.current = [];
  };
  useEffect(() => clearAll, []);

  const commit = useCallback((idx) => { iRef.current = idx; setI(idx); setTurn(null); busy.current = false; }, []);

  const openBook = () => { setOpen(true); commit(0); say('photoBookOpened'); };
  const closeBook = useCallback(() => { clearAll(); commit(iRef.current); setOpen(false); say('photoBookClosed'); }, [commit, say]);

  // a button or key press: play the whole turn
  const flip = useCallback((d) => {
    if (busy.current) return;
    const cur = iRef.current, nx = Math.min(n, Math.max(0, cur + d));
    if (nx === cur) return;
    say('pageTurned');
    if (reduced) { commit(nx); return; }
    busy.current = true;
    const lo = Math.min(cur, nx), hi = Math.max(cur, nx), from = d > 0 ? 0 : 1, to = d > 0 ? 1 : 0;
    setTurn({ lo, hi, prog: from, go: false, drag: false });
    nextFrames(() => setTurn((t) => t && { ...t, prog: to, go: true }));
    later(() => commit(to ? hi : lo), TURN_MS + 80);
  }, [n, reduced, say, commit]);

  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => {
      if (e.key === 'ArrowRight') flip(1);
      else if (e.key === 'ArrowLeft') flip(-1);
      else if (e.key === 'Escape') closeBook();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, flip, closeBook]);

  // dragging a page with a finger or the mouse
  const onDown = (e) => {
    if (busy.current || reduced || (e.button != null && e.button > 0) || e.target.closest?.('button, a, input, summary')) return;
    drag.current = { pid: e.pointerId, x0: e.clientX, y0: e.clientY, rect: spread.current.getBoundingClientRect(), started: false };
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d || d.pid !== e.pointerId) return;
    if (!d.started) {
      const dx = e.clientX - d.x0;
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - d.y0)) return;
      const cur = iRef.current;
      const dir = wide ? (d.x0 > d.rect.left + d.rect.width / 2 ? 'next' : 'prev') : (dx < 0 ? 'next' : 'prev');
      if ((dir === 'next' && cur >= n) || (dir === 'prev' && cur <= 0)) { drag.current = null; return; }
      Object.assign(d, { started: true, dir, lo: dir === 'next' ? cur : cur - 1, hi: dir === 'next' ? cur + 1 : cur, p: dir === 'next' ? 0 : 1 });
      busy.current = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      window.getSelection?.()?.removeAllRanges();
      setTurn({ lo: d.lo, hi: d.hi, prog: d.p, go: false, drag: true });
    }
    const p = dragProgress({ wide, dir: d.dir, x: e.clientX, x0: d.x0, left: d.rect.left, width: d.rect.width });
    d.p = p;
    setTurn((t) => t && { ...t, prog: p });
  };
  const onUp = (e) => {
    const d = drag.current;
    if (!d || d.pid !== e.pointerId) return;
    drag.current = null;
    if (!d.started) return;
    const target = e.type === 'pointercancel' ? (d.dir === 'next' ? 0 : 1) : settleTarget(d.dir, d.p);
    if ((d.dir === 'next') === (target === 1)) say('pageTurned');
    setTurn((t) => t && { ...t, prog: target, go: true, drag: false });
    later(() => commit(target ? d.hi : d.lo), TURN_MS + 80);
  };

  const lo = turn ? turn.lo : i, hi = turn ? turn.hi : i;
  const restart = () => commit(0);
  const right = (k, dead) => <RightPage k={k} onGo={dead ? undefined : onGo} onRestart={dead ? undefined : restart} />;
  const cls = ['pbk-spread', wide ? 'wide' : 'single', turn && 'turning', turn?.go && 'go', turn?.drag && 'dragging'].filter(Boolean).join(' ');

  return (
    <section className="page photobook" aria-labelledby="pbk-h">
      <LilyCluster className="pbk-lily pbk-l1" poses={[1, 0, 2]} tones={['pink', 'butter', 'lilac']} delay={0.3} />
      <LilyCluster className="pbk-lily pbk-l2" poses={[2, 3]} tones={['coral', 'lilac']} delay={0.6} />
      {!open ? (
        <div className="pbk-closed">
          <div className="pbk-cover">
            <span className="pbk-spine" aria-hidden="true" />
            <p className="hand pbk-ckick">for {b.recipientName}</p>
            <h2 id="pbk-h" className="hand pbk-ctitle">{b.bookTitle}</h2>
            <LilyCluster className="pbk-cover-lily" poses={[0, 1]} tones={['pink', 'butter']} delay={0.2} />
          </div>
          <div className="pbk-actions">
            <HandButton onClick={openBook}>{b.bookOpenButton}</HandButton>
            <HandButton variant="ghost" onClick={() => onGo('welcome')}>Back to the cover</HandButton>
          </div>
        </div>
      ) : (
        <div className="pbk-open">
          <h2 id="pbk-h" className="sr-only">{b.bookTitle}</h2>
          <div className="pbk-book sheet">
            <div className={cls} ref={spread} style={turn ? { '--prog': turn.prog } : undefined}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              {wide ? (
                <>
                  <div className="pbk-pgwrap pbk-pgwrap-l">
                    <Shell kind="l"><LeftPage k={lo} /></Shell>
                    {turn && <i className="pbk-cast pbk-cast-l" aria-hidden="true" />}
                  </div>
                  <div className="pbk-pgwrap pbk-pgwrap-r">
                    <Shell kind="r">{right(hi)}</Shell>
                    {turn && (
                      <>
                        <div className="pbk-ghost" aria-hidden="true"><Shell kind="r">{right(lo, true)}</Shell></div>
                        <i className="pbk-cast" aria-hidden="true" />
                        <PageLeaf front={<Shell kind="r">{right(lo, true)}</Shell>} back={<Shell kind="l"><LeftPage k={hi} /></Shell>} />
                      </>
                    )}
                  </div>
                  <i className="pbk-gutter" aria-hidden="true" />
                </>
              ) : (
                <div className="pbk-pgwrap">
                  <Shell kind="one"><LeftPage k={hi} />{right(hi)}</Shell>
                  {turn && (
                    <>
                      <div className="pbk-ghost" aria-hidden="true"><Shell kind="one"><LeftPage k={lo} />{right(lo, true)}</Shell></div>
                      <PageLeaf front={<Shell kind="one"><LeftPage k={lo} />{right(lo, true)}</Shell>} back={<Shell kind="blank" />} />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <PageTurn index={i} total={n} onPrev={() => flip(-1)} onNext={() => flip(1)} onClose={closeBook} />
          <p className="pbk-hint">{b.bookHint}</p>
        </div>
      )}
    </section>
  );
}
