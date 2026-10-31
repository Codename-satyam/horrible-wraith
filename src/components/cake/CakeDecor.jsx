import { useCallback, useRef, useState } from 'react';
import { KINDS, MAX_STICKERS, autoSpot, clientToSvg, isOnCake, makeSticker, sanitize } from '../../lib/decor';
import CakeLayer from './CakeLayer';

export const LABELS = { strawberry: 'a strawberry', cherry: 'cherries', heart: 'a heart', star: 'a star', flower: 'a little flower', swirl: 'a swirl of cream', cookie: 'a cookie', sprinkles: 'sprinkles' };

// Original hand-drawn stickers, each about 44 x 44 around (0,0). Outlines come from the parent group's stroke.
export function StickerArt({ kind }) {
  switch (kind) {
    case 'strawberry': return (
      <g>
        <path d="M0 18C-14 12-18-2-14-10C-8-16 8-16 14-10C18-2 14 12 0 18Z" fill="var(--coral)" />
        <path d="M-9-13C-5-19-2-15 0-13C2-15 5-19 9-13C4-12-4-12-9-13Z" fill="var(--sage)" />
        <path d="M0-13V-20M-6-2v2.5M0 3v2.5M6-2v2.5M-3 9v2.5M3 9v2.5" fill="none" strokeWidth="1.5" />
      </g>);
    case 'cherry': return (
      <g>
        <path d="M-8 3C-8-8-2-14 4-18M9 5C9-6 6-14 4-18" fill="none" />
        <path d="M4-18C10-22 16-18 18-14C12-12 7-14 4-18Z" fill="var(--sage)" />
        <circle cx="-8" cy="11" r="8" fill="var(--coral)" />
        <circle cx="9" cy="13" r="8" fill="var(--coral)" />
        <path d="M-12 8q2-3 5-2M5 10q2-3 5-2" fill="none" strokeWidth="1.4" />
      </g>);
    case 'heart': return <path d="M0 15C-23-1-15-21 0-9C15-21 23-1 0 15Z" fill="var(--pink)" />;
    case 'star': return <path d="M0-19L5.8-6 19-5.3 8.6 3.6 12 16.8 0 9.1-12 16.8-8.6 3.6-19-5.3-5.8-6Z" fill="var(--butter)" />;
    case 'flower': return (
      <g>
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-10" rx="6.5" ry="10" fill="var(--lilac)" transform={`rotate(${a})`} />)}
        <circle r="5.5" fill="var(--butter)" />
      </g>);
    case 'swirl': return (
      <g>
        <path d="M-15 15C-22 15-22 6-15 6C-17-2-8-5-6-7C-9-13-2-19 2-14C7-19 11-10 6-7C13-5 17 1 15 6C22 6 22 15 15 15Z" fill="#FFFAF0" />
        <path d="M-9 7C-2 11 6 11 9 7M-5-2C0 1 4 1 6-2" fill="none" strokeWidth="1.5" />
      </g>);
    case 'cookie': return (
      <g>
        <circle r="15" fill="var(--butter)" />
        <circle cx="-5" cy="-5" r="2.4" fill="#3b3835" stroke="none" /><circle cx="6" cy="-2" r="2.4" fill="#3b3835" stroke="none" />
        <circle cx="-2" cy="7" r="2.4" fill="#3b3835" stroke="none" /><circle cx="8" cy="9" r="1.8" fill="#3b3835" stroke="none" />
      </g>);
    case 'sprinkles': return (
      <g fill="none" strokeWidth="5" strokeLinecap="round">
        <path d="M-14-9l6-4" stroke="var(--pink)" /><path d="M4-14l2 7" stroke="var(--butter)" /><path d="M-4 0l7 3" stroke="var(--lilac)" />
        <path d="M12-2l5-4" stroke="var(--coral)" /><path d="M-13 10l6 2" stroke="var(--sage)" /><path d="M5 13l5-5" stroke="var(--pink)" />
      </g>);
    default: return null;
  }
}

const GROUP = { stroke: '#3b3835', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

// All the decoration state: add, move, remove, undo. `onChange` is called whenever something should be saved.
export function useDecor(initial, onChange) {
  const [items, setItems] = useState(() => sanitize(initial));
  const [history, setHistory] = useState([]);
  const ref = useRef(items);
  const commit = useCallback((next, before) => {
    if (before) setHistory((h) => [...h.slice(-19), before]);
    ref.current = next; setItems(next); onChange?.(next);
  }, [onChange]);

  return {
    items, canUndo: history.length > 0, full: items.length >= MAX_STICKERS,
    add: (kind, x, y) => {
      if (ref.current.length >= MAX_STICKERS) return false;
      commit([...ref.current, makeSticker(kind, x, y)], ref.current); return true;
    },
    addAuto: (kind) => {
      if (ref.current.length >= MAX_STICKERS) return false;
      const { x, y } = autoSpot(ref.current);
      commit([...ref.current, makeSticker(kind, x, y)], ref.current); return true;
    },
    moveLive: (id, x, y) => { const next = ref.current.map((d) => (d.id === id ? { ...d, x, y } : d)); ref.current = next; setItems(next); },
    finishMove: (id, before, keep) => {
      const now = ref.current.find((d) => d.id === id);
      if (!keep) { commit(ref.current.filter((d) => d.id !== id), before); return; }
      const moved = before.find((d) => d.id === id);
      const changed = !moved || !now || moved.x !== now.x || moved.y !== now.y;
      commit([...ref.current.filter((d) => d.id !== id), now], changed ? before : undefined); // newest on top
    },
    undo: () => { const prev = history[history.length - 1]; if (!prev) return; setHistory(history.slice(0, -1)); ref.current = prev; setItems(prev); onChange?.(prev); },
    clear: () => { if (ref.current.length) commit([], ref.current); }
  };
}

// The stickers drawn on the cake (an SVG group). When `editable`, they can be dragged; drop one off the cake to take it away.
export function DecorLayer({ items, visible, editable, svgRef, onMoveLive, onFinish }) {
  const st = useRef(null);
  const down = (e, it) => {
    if (!editable || (e.button != null && e.button > 0)) return;
    const p = clientToSvg(svgRef.current, e.clientX, e.clientY);
    if (!p) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    st.current = { id: it.id, pid: e.pointerId, dx: it.x - p.x, dy: it.y - p.y, before: items, moved: false, last: { x: it.x, y: it.y } };
  };
  const move = (e) => {
    const s = st.current;
    if (!s || s.pid !== e.pointerId) return;
    const p = clientToSvg(svgRef.current, e.clientX, e.clientY);
    if (!p) return;
    s.moved = true; s.last = { x: p.x + s.dx, y: p.y + s.dy };
    onMoveLive(s.id, s.last.x, s.last.y);
  };
  const up = (e) => {
    const s = st.current;
    if (!s || s.pid !== e.pointerId) return;
    st.current = null;
    if (s.moved) onFinish(s.id, s.before, isOnCake(s.last.x, s.last.y));
  };
  return (
    <CakeLayer on={visible} className={`cl-decor ${editable ? 'editable' : ''}`}>
      <g {...GROUP}>
        {items.map((it) => (
          <g key={it.id} className="sticker" transform={`translate(${it.x} ${it.y}) rotate(${it.r}) scale(${it.s})`}
            onPointerDown={(e) => down(e, it)} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            <g className="stk-in"><StickerArt kind={it.kind} /></g>
          </g>
        ))}
      </g>
    </CakeLayer>
  );
}

// The row of things to put on the cake. Drag one onto the cake, or just press it and it finds a spot.
export function DecorTray({ svgRef, onDrop, onAuto }) {
  const [ghost, setGhost] = useState(null);
  const st = useRef(null);
  const quiet = useRef(0);

  const down = (e, kind) => {
    if (e.button != null && e.button > 0) return;
    st.current = { pid: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false, kind };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    const s = st.current;
    if (!s || s.pid !== e.pointerId) return;
    if (!s.moved && Math.hypot(e.clientX - s.x0, e.clientY - s.y0) < 8) return;
    s.moved = true; setGhost({ kind: s.kind, x: e.clientX, y: e.clientY });
  };
  const up = (e) => {
    const s = st.current;
    st.current = null; setGhost(null);
    if (!s || !s.moved || e.type === 'pointercancel') return;
    quiet.current = Date.now() + 400; // the click that follows a drag is not a press
    const p = clientToSvg(svgRef.current, e.clientX, e.clientY);
    if (p && isOnCake(p.x, p.y)) onDrop(s.kind, p.x, p.y);
  };

  return (
    <div className="deco-tray" role="group" aria-label="Cake decorations">
      {KINDS.map((kind) => (
        <button key={kind} type="button" className="deco-item" aria-label={`Add ${LABELS[kind]}`} title={LABELS[kind]}
          onPointerDown={(e) => down(e, kind)} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          onClick={() => { if (Date.now() > quiet.current) onAuto(kind); }}>
          <svg viewBox="-26 -26 52 52" aria-hidden="true"><g {...GROUP}><StickerArt kind={kind} /></g></svg>
        </button>
      ))}
      {ghost && (
        <div className="deco-ghost" style={{ left: ghost.x, top: ghost.y }} aria-hidden="true">
          <svg viewBox="-26 -26 52 52"><g {...GROUP}><StickerArt kind={ghost.kind} /></g></svg>
        </div>
      )}
    </div>
  );
}
