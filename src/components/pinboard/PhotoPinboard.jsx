import { useCallback, useEffect, useRef, useState } from 'react';
import { birthday as b } from '../../data/birthday';
import { memories } from '../../data/memories';
import useReducedMotion from '../../hooks/useReducedMotion';
import useMedia from '../../hooks/useMedia';
import { useCapy } from '../capybara/CapybaraController';
import LilyCluster from '../flowers/LilyCluster';
import { Arrow, Heart, Squiggle, Star, Sparkle } from '../canvas/SketchDoodles';
import PinnedPhoto from './PinnedPhoto';
import QuoteReveal from './QuoteReveal';

const COLS = 4, ROW_H = 340;
const jit = (i, k) => { const x = Math.sin((i + 1) * 91.7 + k * 37.1) * 10000; return x - Math.floor(x) - 0.5; };
const place = (m, i) => {
  if (m.board) return { x: m.board.x, y: m.board.y };
  const col = i % COLS, row = Math.floor(i / COLS);
  return { x: 3.5 + col * 24.5 + jit(i, 1) * 3 + (row % 2 ? 4 : 0), y: 36 + row * ROW_H + jit(i, 2) * 40 };
};

export default function PhotoPinboard() {
  const [openId, setOpenId] = useState(null);
  const refs = useRef({});
  const reduced = useReducedMotion();
  const phone = useMedia('(max-width: 899px)');
  const { say } = useCapy();
  const n = memories.length, rows = Math.ceil(n / COLS);
  const idx = memories.findIndex((m) => m.id === openId);

  const open = useCallback((id, viaStep) => {
    setOpenId(id);
    say(viaStep ? 'quoteRevealed' : 'pinboardPhotoOpened');
    if (viaStep || phone) setTimeout(() => refs.current[id]?.scrollIntoView?.({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }), 30);
  }, [say, reduced, phone]);
  const step = useCallback((d) => { if (idx >= 0) open(memories[(idx + d + n) % n].id, true); }, [idx, n, open]);

  useEffect(() => {
    if (idx < 0) return undefined;
    const key = (e) => {
      if (e.key === 'Escape') setOpenId(null);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [idx, step]);

  const pts = memories.map((m, i) => { const p = place(m, i); return [p.x + 9, p.y + 130]; });
  const string = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(0)}`).join(' ');

  return (
    <section className="page pinboard" aria-labelledby="pb-h">
      <header className="page-head">
        <h2 id="pb-h" className="hand page-title">{b.pinboardTitle}</h2>
        <p className="page-hint">{b.pinboardHint}</p>
      </header>
      <div className="pb-board sheet" style={{ '--rows': rows, '--h': `${rows * ROW_H + 80}px` }}>
        <svg className="pb-string" viewBox={`0 0 100 ${rows * ROW_H + 80}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={string} fill="none" stroke="#3b3835" strokeOpacity=".28" strokeWidth="1.2" strokeDasharray="3 7" vectorEffect="non-scaling-stroke" />
        </svg>
        <LilyCluster className="pb-lily pb-l1" poses={[1, 0]} tones={['pink', 'lilac']} delay={0.4} />
        <LilyCluster className="pb-lily pb-l2" poses={[2, 3, 0]} tones={['butter', 'coral', 'pink']} delay={0.7} />
        <Heart className="pb-dd d1 float" style={{ position: 'absolute' }} />
        <Star className="pb-dd d2 float" style={{ position: 'absolute' }} c="var(--pink)" />
        <Squiggle className="pb-dd d3" style={{ position: 'absolute' }} />
        <Sparkle className="pb-dd d4" style={{ position: 'absolute' }} />
        <Arrow className="pb-dd d5" style={{ position: 'absolute' }} />
        <div className="pb-grid">
          {memories.map((m, i) => {
            const p = place(m, i), col = i % COLS;
            return (
              <div key={m.id} className="pb-slot" style={{ '--x': `${p.x}%`, '--y': `${p.y}px` }} data-open={openId === m.id || undefined}>
                <PinnedPhoto ref={(el) => { refs.current[m.id] = el; }} m={m} i={i} open={openId === m.id} onToggle={() => (openId === m.id ? setOpenId(null) : open(m.id))}>
                  {openId === m.id && <QuoteReveal sheet={phone} m={m} side={col >= 2 ? 'left' : 'right'} onClose={() => setOpenId(null)} onStep={step} />}
                </PinnedPhoto>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
