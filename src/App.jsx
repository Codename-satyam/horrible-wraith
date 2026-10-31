import { useCallback, useEffect, useRef, useState } from 'react';
import SvgDefs from './components/shared/SvgDefs';
import CanvasBackground from './components/canvas/CanvasBackground';
import WelcomeCanvas from './components/canvas/WelcomeCanvas';
import SketchNav from './components/canvas/SketchNav';
import FinalePage from './components/canvas/FinalePage';
import PhotoPinboard from './components/pinboard/PhotoPinboard';
import PhotoBook from './components/photobook/PhotoBook';
import BirthdayQuiz from './components/quiz/BirthdayQuiz';
import CakeScene from './components/cake/CakeScene';
import Capybara from './components/capybara/Capybara';
import { CapybaraProvider, useCapy } from './components/capybara/CapybaraController';
import useReducedMotion from './hooks/useReducedMotion';
import { loadProgress, saveProgress } from './lib/progress';

// world: 'sketch' (graphite) -> 'color' (watercolor). waking: 'idle' | '1' (outlines retrace) | 'done'
function Shell({ initialPage, initialWorld, initialFinished }) {
  const saved = useRef(null);
  if (saved.current === null) saved.current = loadProgress();
  const sv = saved.current;
  const startWorld = initialWorld ?? sv.world ?? 'sketch';
  const [page, setPage] = useState(initialPage ?? 'welcome');
  const [world, setWorld] = useState(startWorld);
  const [waking, setWaking] = useState(startWorld === 'color' ? 'done' : 'idle');
  const [finished, setFinished] = useState(initialFinished ?? !!sv.finished);
  const [outcome, setOutcome] = useState(sv.outcome || null);   // which little world the quiz ended in
  const [decor, setDecor] = useState(sv.decor || []);              // stickers she put on the cake
  const [wish, setWish] = useState(sv.wish || '');               // typed on the cake page, never leaves this device
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const { say } = useCapy();
  const reduced = useReducedMotion();
  const main = useRef(null);
  const first = useRef(true);

  useEffect(() => { setOrigin({ x: window.innerWidth / 2, y: window.innerHeight * 0.55 }); }, []);

  const go = useCallback((id) => {
    if (id === 'finale' && !finished) { setPage('cake'); say('finaleLocked'); return; }
    setPage(id);
  }, [finished, say]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo?.(0, 0);
    main.current?.focus({ preventScroll: true });
    if (page !== 'cake') say(`pageEnter_${page}`);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const openWorld = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2 });
    setWorld('color');
    saveProgress({ world: 'color' });
    setWaking(reduced ? 'done' : '1');
    say('worldAwake');
    if (!reduced) setTimeout(() => setWaking('done'), 2800);
  };

  const pickOutcome = useCallback((id) => { setOutcome(id); saveProgress({ outcome: id }); }, []);
  const makeWish = useCallback((text) => { setWish(text); saveProgress({ wish: text }); }, []);
  const saveDecor = useCallback((list) => { setDecor(list); saveProgress({ decor: list }); }, []);
  const finish = useCallback(() => { setFinished(true); saveProgress({ finished: true }); }, []);

  return (
    <div className="app" data-world={world} data-waking={waking} data-page={page}>
      <SvgDefs />
      <CanvasBackground origin={origin} />
      {world === 'color' && <SketchNav page={page} onGo={go} finished={finished} />}
      <main ref={main} tabIndex={-1} className="stage" key={page}>
        {page === 'welcome' && <WelcomeCanvas world={world} onOpen={openWorld} onContinue={() => go('pinboard')} />}
        {page === 'pinboard' && <PhotoPinboard />}
        {page === 'book' && <PhotoBook onGo={go} />}
        {page === 'quiz' && <BirthdayQuiz onGo={go} onOutcome={pickOutcome} />}
        {page === 'cake' && <CakeScene onGo={go} onFinished={finish} savedWish={wish} onWish={makeWish} savedDecor={decor} onDecor={saveDecor} />}
        {page === 'finale' && <FinalePage onGo={go} outcome={outcome} wish={wish} />}
      </main>
      <Capybara page={page} />
    </div>
  );
}

export default function App({ initialPage, initialWorld, initialFinished }) {
  return <CapybaraProvider><Shell initialPage={initialPage} initialWorld={initialWorld} initialFinished={initialFinished} /></CapybaraProvider>;
}
