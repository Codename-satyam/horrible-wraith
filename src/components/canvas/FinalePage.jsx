import { useEffect, useState } from 'react';
import { birthday as b } from '../../data/birthday';
import { quiz } from '../../data/quiz';
import { fill } from '../../lib/text';
import HandButton from '../shared/HandButton';
import LilyCluster from '../flowers/LilyCluster';
import CakeCelebration from '../cake/CakeCelebration';
import { CapybaraArt } from '../capybara/Capybara';
import { useCapy } from '../capybara/CapybaraController';
import VoiceNote from './VoiceNote';

export default function FinalePage({ onGo, outcome = null, wish = '' }) {
  const f = b.finale, vars = { name: b.recipientName };
  const world = outcome ? quiz.outcomes[outcome] : null;
  const tones = world?.tones;
  const { say } = useCapy();
  const [open, setOpen] = useState(false);

  // after the page-enter line has had its moment, Capy mentions the world she ended up in
  useEffect(() => {
    if (!world) return undefined;
    const t = setTimeout(() => say('finaleWorld', { world: world.title }), 6000);
    return () => clearTimeout(t);
  }, [world, say]);

  return (
    <section className="page finale" aria-labelledby="fin-h">
      <CakeCelebration count={26} />
      <LilyCluster className="fin-lily f1" poses={[1, 0, 2]} tones={tones || ['pink', 'butter', 'lilac']} delay={0.2} />
      <LilyCluster className="fin-lily f2" poses={[2, 3, 0]} tones={tones ? [...tones].reverse() : ['coral', 'lilac', 'pink']} delay={0.5} />
      <div className="fin-card sheet">
        <h2 id="fin-h" className="hand fin-title">{fill(f.heading, vars)}</h2>

        {world ? (
          <div className="fin-world">
            <p className="hand fin-world-tag">Your little world: {world.title}</p>
            <p className="serif fin-p fin-world-line">{fill(world.finale, vars)}</p>
          </div>
        ) : (
          <div className="fin-world fin-world--empty">
            <p className="hand fin-world-tag">{f.noWorldLine}</p>
            <HandButton variant="ghost" onClick={() => onGo('quiz')}>{f.noWorldButton}</HandButton>
          </div>
        )}

        {f.paragraphs.map((p, i) => <p className="serif fin-p" key={i}>{fill(p, vars)}</p>)}

        <VoiceNote cfg={b.voiceNote} vars={vars} />

        {wish && (
          <div className="fin-wish">
            <p className="hand fin-wish-title">{f.keptWishTitle}</p>
            {open && <p className="hand fin-wish-text">&ldquo;{wish}&rdquo;</p>}
            <button type="button" className="linkish" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? f.keptWishClose : f.keptWishOpen}</button>
          </div>
        )}

        <p className="hand fin-sign">{b.closingLine}</p>
        <p className="hand fin-sign2">{f.signature}</p>
        <div className="fin-capy"><CapybaraArt hat /></div>
        <div className="quiz-actions">
          <HandButton onClick={() => onGo('cake')}>Back to the cake</HandButton>
          <HandButton variant="ghost" onClick={() => onGo('welcome')}>Start from the cover</HandButton>
        </div>
      </div>
    </section>
  );
}
