import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches;
  const [m, setM] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener?.('change', f);
    return () => mq.removeEventListener?.('change', f);
  }, [query]);
  return m;
}
