import { useCallback, useEffect, useRef, useState } from 'react';
import { birthday as b } from '../../data/birthday';
import useReducedMotion from '../../hooks/useReducedMotion';
import useBlowDetector from '../../hooks/useBlowDetector';
import { useCapy } from '../capybara/CapybaraController';
import HandButton from '../shared/HandButton';
import LilyCluster from '../flowers/LilyCluster';
import SketchCake from './SketchCake';
import CakeCelebration from './CakeCelebration';
import WishPlane from './WishPlane';
import { DecorLayer, DecorTray, useDecor } from './CakeDecor';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Math.round(n) || lo));

export default function CakeScene({ onGo, onFinished, savedWish = '', onWish, savedDecor = [], onDecor }) {
  const reduced = useReducedMotion();
  const { say, setAway, setBeside } = useCapy();
  const n = clamp(b.candleCount, 1, 12);
  const [stage, setStage] = useState(0);
  const [lit, setLit] = useState(0);
  const [flame, setFlame] = useState('lit');       // lit | blowing | out
  const [wished, setWished] = useState(false);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  const [micAsk, setMicAsk] = useState(false);
  const [mode, setMode] = useState('decorate');     // decorate -> wish -> blow
  const svgRef = useRef(null);
  const decor = useDecor(savedDecor, onDecor);
  const [draft, setDraft] = useState('');          // what she is typing
  const [wishText, setWishText] = useState('');    // what she wished (this round)
  const timers = useRef([]);
  const later = (f, ms) => timers.current.push(setTimeout(f, ms));
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const ready = useCallback(() => { setStage(6); setLit(n); setAway(false); say('candlesLit'); }, [n, say, setAway]);

  // The drawing sequence: marks -> plate + lower tier -> upper tier -> shading -> candles -> flames, one by one.
  useEffect(() => {
    clear();
    setStage(0); setLit(0); setFlame('lit'); setWished(false); setDone(false); setMicAsk(false); setDraft(''); setWishText(''); setMode('decorate');
    setAway(true); setBeside(true);
    later(() => say('cakeDrawing'), 400);
    if (reduced) { later(ready, 50); } else {
      [[1, 700], [2, 2200], [3, 3600], [4, 5000], [5, 6100]].forEach(([s, t]) => later(() => setStage(s), t));
      for (let i = 1; i <= n; i++) later(() => setLit(i), 6200 + i * 380);
      later(ready, 6200 + n * 380 + 600);
    }
    return () => { clear(); setAway(false); setBeside(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reduced]);

  const skip = () => { clear(); setStage(6); setLit(n); setAway(false); say('candlesLit'); };
  const wish = () => {
    const text = draft.trim().slice(0, 140);
    setWishText(text); if (text) onWish?.(text);
    setWished(true); say('wishMade');
  };

  const blow = useCallback(() => {
    if (flame !== 'lit') return;
    clear();
    setMicAsk(false);
    const settle = () => { setFlame('out'); say('candlesBlown'); onFinished?.(); };
    if (reduced) { settle(); setDone(true); later(() => say('finalMessage'), 1500); return; }
    setFlame('blowing');
    later(settle, 1900);
    later(() => setDone(true), 2600);
    later(() => say('finalMessage'), 4300);
  }, [flame, reduced, say, onFinished]);

  const mic = useBlowDetector(() => blow());

  const relight = () => {
    clear(); setDone(false); setWished(false); setWishText(''); setDraft(''); setMode('wish'); setFlame('lit'); setLit(0);
    for (let i = 1; i <= n; i++) later(() => setLit(i), reduced ? 0 : i * 250);
    say('candlesRelit');
  };

  const placed = useRef(false);
  const afterPlace = (ok) => { if (ok && !placed.current) { placed.current = true; say('stickerFirst'); } };
  const finishDecor = () => { setMode('wish'); say(decor.items.length ? 'decorateDone' : 'wishPrompt'); };

  const ready6 = stage >= 6 && flame === 'lit' && !wished;
  const showDecor = ready6 && mode === 'decorate';
  const showWish = ready6 && mode === 'wish';
  const showBlow = stage >= 6 && flame === 'lit' && wished;

  return (
    <section className={`page cake-page ${wished && flame === 'lit' ? 'quiet' : ''}`} aria-labelledby="cake-h">
      <h2 id="cake-h" className="sr-only">The birthday cake</h2>
      <div className="cake-dim" aria-hidden="true" />
      <LilyCluster className="cake-lily cl1" poses={[1, 0, 2]} tones={['pink', 'butter', 'lilac']} delay={0.5} />
      <LilyCluster className="cake-lily cl2" poses={[2, 3, 1]} tones={['lilac', 'coral', 'butter']} delay={0.8} />
      <LilyCluster className="cake-lily cl3" poses={[0, 3]} tones={['coral', 'pink']} delay={1.1} />

      <div className={`cake-wrap ${showDecor ? 'decorating' : ''}`}>
        <SketchCake stage={stage} count={n} flame={flame} lit={lit} wished={wished} gust={flame === 'blowing'} svgRef={svgRef}
          decor={<DecorLayer items={decor.items} visible={stage >= 5} editable={showDecor} svgRef={svgRef} onMoveLive={decor.moveLive} onFinish={decor.finishMove} />} />
        {flame === 'out' && <CakeCelebration key={`c${run}${done}`} />}
        {flame === 'out' && wishText && <WishPlane key={`w${run}`} text={wishText} />}
      </div>

      <div className="cake-ui">
        {stage < 6 && <button type="button" className="linkish" onClick={skip}>Skip the drawing</button>}

        {showDecor && (
          <div className="cake-step" key="decorate">
            <p className="hand cake-prompt">{b.decoratePrompt}</p>
            <DecorTray svgRef={svgRef} onDrop={(k, x, y) => afterPlace(decor.add(k, x, y))} onAuto={(k) => afterPlace(decor.addAuto(k))} />
            <p className="deco-hint">{decor.full ? b.decorateFull : b.decorateHint}</p>
            <div className="quiz-actions">
              <HandButton onClick={finishDecor}>{decor.items.length ? b.decorateDone : b.decorateSkip}</HandButton>
              <HandButton variant="ghost" onClick={decor.undo} disabled={!decor.canUndo}>Undo</HandButton>
              <HandButton variant="ghost" onClick={decor.clear} disabled={!decor.items.length}>Clear</HandButton>
            </div>
          </div>
        )}

        {showWish && (
          <div className="cake-step" key="wish">
            <p className="hand cake-prompt">{b.cakeWishPrompt}</p>
            <div className="wish-field">
              <label htmlFor="wish-input" className="sr-only">Your wish</label>
              <textarea id="wish-input" className="wish-input hand" rows={2} maxLength={140} value={draft} placeholder={b.wishPlaceholder}
                onChange={(e) => setDraft(e.target.value)} />
              <span className="wish-note">{b.wishNote}</span>
            </div>
            <HandButton onClick={wish}>{b.wishButton}</HandButton>
            <button type="button" className="linkish" onClick={() => setMode('decorate')}>{b.decorateAgain}</button>
          </div>
        )}

        {showBlow && (
          <div className="cake-step" key="blow">
            <p className="hand cake-wish">{b.wishMessage}</p>
            {wishText && <p className="hand cake-yourwish">&ldquo;{wishText}&rdquo;</p>}
            <HandButton onClick={blow}>{b.blowButton}</HandButton>
            {mic.status === 'listening' ? (
              <p className="cake-mic">Listening. Blow gently toward your screen. Nothing is recorded or saved.
                <button type="button" className="linkish" onClick={mic.stop}>Stop listening</button></p>
            ) : micAsk ? (
              <div className="cake-mic" role="group" aria-label="Microphone permission">
                <p>If you like, I can listen for the sound of you blowing so the candles go out on their own. I only listen on this screen, and nothing is recorded, saved or sent anywhere.</p>
                <HandButton variant="ghost" onClick={() => { mic.start(); }}>Allow microphone</HandButton>
                <button type="button" className="linkish" onClick={() => setMicAsk(false)}>No thanks</button>
              </div>
            ) : (
              <button type="button" className="linkish" onClick={() => setMicAsk(true)}>Or blow into your microphone</button>
            )}
            {(mic.status === 'denied' || mic.status === 'unsupported') && <p className="cake-mic" role="status">The microphone is not available here, which is completely fine. The button works just as well.</p>}
          </div>
        )}

        {flame === 'blowing' && <p className="hand cake-wish" aria-live="polite">Whoosh...</p>}

        {done && (
          <div className="cake-step cake-final" key="final">
            <p className="hand cake-final-msg">{b.finalMessage}</p>
            {wishText && <p className="hand cake-sent">{b.wishSent}</p>}
            <p className="hand cake-closing">{b.closingLine}</p>
            <div className="quiz-actions">
              <HandButton onClick={() => onGo('finale')}>On to the finale</HandButton>
              <HandButton variant="ghost" onClick={relight}>Light them again</HandButton>
              <HandButton variant="ghost" onClick={() => setRun((r) => r + 1)}>Watch it drawn again</HandButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
