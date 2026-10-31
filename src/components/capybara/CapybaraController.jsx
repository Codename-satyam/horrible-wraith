import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { capybaraMessages } from '../../data/capybara';
import { birthday } from '../../data/birthday';
import { fill } from '../../lib/text';

// One place decides what Capy says. Components only announce events: say('pinboardPhotoOpened').
const Ctx = createContext({ say() {}, sayText() {}, setAway() {}, setBeside() {}, bubble: null, away: false, beside: false, tap() {} });
export const useCapy = () => useContext(Ctx);

export function CapybaraProvider({ children }) {
  const [bubble, setBubble] = useState(null);
  const [away, setAway] = useState(false);
  const [beside, setBeside] = useState(false);
  const lastIdx = useRef({}), lastKey = useRef('welcomeOpened'), timer = useRef(0), lastCall = useRef({ k: '', t: 0 });

  const show = useCallback((text) => {
    clearTimeout(timer.current);
    setBubble({ text, id: Math.random() });
    timer.current = setTimeout(() => setBubble(null), 5600); // only one bubble, and it tidies itself away
  }, []);

  const say = useCallback((key, vars = {}, force = false) => {
    const list = capybaraMessages[key];
    if (!list?.length) return;
    const now = Date.now();
    if (!force && lastCall.current.k === key && now - lastCall.current.t < 500) return;
    lastCall.current = { k: key, t: now };
    let i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === lastIdx.current[key]) i = (i + 1) % list.length;
    lastIdx.current[key] = i;
    lastKey.current = key;
    show(fill(list[i], { name: birthday.recipientName, ...vars }));
  }, [show]);

  const sayText = useCallback((text, tapKey = 'quizAnswerSelected') => {
    lastKey.current = tapKey;
    show(fill(text, { name: birthday.recipientName }));
  }, [show]);

  const tap = useCallback(() => say(lastKey.current, {}, true), [say]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ say, sayText, tap, bubble, away, beside, setAway, setBeside }), [say, sayText, tap, bubble, away, beside]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
