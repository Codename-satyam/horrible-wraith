import { useCallback, useEffect, useRef, useState } from 'react';

// status: 'off' | 'listening' | 'denied' | 'unsupported'
export default function useBlowDetector(onBlow) {
  const [status, setStatus] = useState('off');
  const res = useRef({ stream: null, ctx: null, raf: 0 });
  const cb = useRef(onBlow);
  cb.current = onBlow;

  const stop = useCallback(() => {
    const r = res.current;
    cancelAnimationFrame(r.raf);
    r.stream?.getTracks().forEach((t) => t.stop());
    r.ctx?.close?.().catch?.(() => {});
    res.current = { stream: null, ctx: null, raf: 0 };
    setStatus((s) => (s === 'listening' ? 'off' : s));
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) { setStatus('unsupported'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const an = ctx.createAnalyser();
      an.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Float32Array(an.fftSize);
      res.current = { stream, ctx, raf: 0 };
      setStatus('listening');
      let loud = 0;
      const tick = () => {
        an.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        loud = rms > 0.12 ? loud + 1 : Math.max(0, loud - 2);
        if (loud > 14) { stop(); cb.current(); return; } // ~0.25 s of steady breath
        res.current.raf = requestAnimationFrame(tick);
      };
      res.current.raf = requestAnimationFrame(tick);
    } catch {
      setStatus('denied');
    }
  }, [stop]);

  useEffect(() => stop, [stop]);
  return { status, start, stop };
}
