import { useRef, useState } from 'react';
import { fill } from '../../lib/text';
import { useCapy } from '../capybara/CapybaraController';

// A hand-drawn voice-message player. Hidden if the audio file is missing or cannot play.
const BARS = Array.from({ length: 32 }, (_, i) => 0.28 + 0.72 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.55)));
const fmt = (s) => (Number.isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

export default function VoiceNote({ cfg, vars }) {
  const audio = useRef(null);
  const { say } = useCapy();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const told = useRef(false);

  if (!cfg?.src || failed) return null;
  const p = d ? Math.min(1, t / d) : 0;

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      if (!told.current) { told.current = true; say('voiceNotePlayed'); }
      const r = a.play();
      if (r?.catch) r.catch(() => setFailed(true));
    } else a.pause();
  };

  return (
    <div className="voice" role="group" aria-label={fill(cfg.title, vars)}>
      <audio ref={audio} src={cfg.src} preload="metadata"
        onError={() => setFailed(true)}
        onLoadedMetadata={(e) => setD(e.currentTarget.duration)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setT(0); }} />
      <p className="hand voice-title">{fill(cfg.title, vars)}</p>
      <div className="voice-row">
        <button type="button" className={`voice-btn ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pause the message' : 'Play the message'}>
          {playing
            ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6v12M16 6v12" /></svg>
            : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" /></svg>}
        </button>
        <div className="voice-wave" style={{ '--p': p }}>
          {BARS.map((h, i) => <span key={i} className={i / BARS.length < p ? 'on' : ''} style={{ height: `${Math.round(h * 100)}%` }} />)}
          <input type="range" className="voice-seek" min="0" max={d || 1} step="0.1" value={t} aria-label="Move through the message" disabled={!d}
            onChange={(e) => { const v = Number(e.target.value); if (audio.current) audio.current.currentTime = v; setT(v); }} />
        </div>
        <span className="voice-time">{fmt(t)} / {fmt(d)}</span>
      </div>
      {cfg.caption && <p className="voice-cap">{fill(cfg.caption, vars)}</p>}
      {cfg.transcript && <details className="voice-text"><summary>Read it instead</summary><p className="serif">{fill(cfg.transcript, vars)}</p></details>}
    </div>
  );
}
