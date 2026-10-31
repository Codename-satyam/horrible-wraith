import { useEffect, useState } from 'react';
const Q = '(prefers-reduced-motion: reduce)';
export default function useReducedMotion() {
  const [r, setR] = useState(() => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(Q).matches);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const m = window.matchMedia(Q);
    const f = () => setR(m.matches);
    m.addEventListener?.('change', f);
    return () => m.removeEventListener?.('change', f);
  }, []);
  return r;
}
