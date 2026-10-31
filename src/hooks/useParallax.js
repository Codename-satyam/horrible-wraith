import { useEffect } from 'react';
import useReducedMotion from './useReducedMotion';
export default function useParallax(ref) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia?.('(pointer: fine)').matches || window.innerWidth < 900) return undefined;
    let raf = 0, nx = 0, ny = 0;
    const apply = () => { raf = 0; el.style.setProperty('--px', nx.toFixed(3)); el.style.setProperty('--py', ny.toFixed(3)); };
    const move = (e) => {
      nx = (e.clientX / window.innerWidth - 0.5) * 2;
      ny = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, [ref, reduced]);
}
