import { useEffect, useRef } from 'react';
import { birthday as b } from '../../data/birthday';
import { getMemory } from '../../data/memories';
import { fill } from '../../lib/text';
import Photo from '../shared/Photo';
import HandButton from '../shared/HandButton';
import LilyCluster from '../flowers/LilyCluster';
import { Arrow, Heart, Squiggle, Star } from './SketchDoodles';
import { useCapy } from '../capybara/CapybaraController';

const Hold = ({ kind }) => kind === 'clip'
  ? <svg className="hold clip" viewBox="0 0 24 60" aria-hidden="true"><path className="ink" pathLength="1" d="M8 52V14a6 6 0 0 1 12 0v34a9 9 0 0 1-18 0V18" fill="none" stroke="#3b3835" strokeWidth="2.2" strokeLinecap="round" /></svg>
  : kind === 'pin'
    ? <span className="hold pin" aria-hidden="true" />
    : <span className="hold tape" aria-hidden="true" />;

export default function WelcomeCanvas({ world, onOpen, onContinue }) {
  const { say } = useCapy();
  const worldRef = useRef(world);
  worldRef.current = world;
  const featured = b.featuredMemoryIds.map(getMemory).filter(Boolean).slice(0, 5);

  useEffect(() => {
    const t1 = setTimeout(() => say('welcomeOpened'), 2000);
    const t2 = setTimeout(() => { if (worldRef.current === 'sketch') say('featuredShown'); }, 8200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [say]);

  const awake = world === 'color';
  return (
    <section className="page welcome" aria-labelledby="welcome-h">
      <div className="w-photos">
        {featured.map((m, i) => {
          const w = m.welcome || {};
          return (
            <figure key={m.id} className={`wphoto ${m.shape || 'portrait'}`} style={{ '--x': w.x, '--y': w.y, '--w': w.w, '--r': `${w.rot ?? 0}deg`, '--i': i }}>
              <Hold kind={w.hold} />
              <div className="frame"><div className="pic"><Photo m={m} index={i} eager /></div></div>
              <figcaption className="hand note">{w.note || m.annotation || m.caption}</figcaption>
            </figure>
          );
        })}
      </div>

      <div className="w-center">
        <p className="hand w-ann">{b.welcomeLabel}</p>
        <h1 id="welcome-h" className="w-title">
          <span className="sr-only">{b.welcomeTitle}</span>
          <svg viewBox="0 0 640 150" aria-hidden="true"><text x="320" y="118" textAnchor="middle" className="w-title-text">{b.welcomeTitle}</text></svg>
        </h1>
        <p className="w-sub serif">{b.welcomeSubtitle}</p>
        <div className="w-actions">
          {!awake
            ? <HandButton onClick={onOpen} className="w-open">{b.welcomeButton}</HandButton>
            : <HandButton onClick={onContinue} className="w-open w-next">{b.welcomeAfterButton}</HandButton>}
        </div>
        <p className="hand w-handle"><Arrow className="w-arrow" />{b.welcomeNote}</p>
      </div>

      <Heart className="wd wd-1 float" style={{ position: 'absolute' }} />
      <Star className="wd wd-2 float" style={{ position: 'absolute' }} c="var(--pink)" />
      <Squiggle className="wd wd-3" style={{ position: 'absolute' }} />
      <LilyCluster className="w-lilies w-l1" poses={[1, 3]} tones={['pink', 'butter']} delay={1.3} />
      <LilyCluster className="w-lilies w-l2" poses={[2, 0]} tones={['lilac', 'coral']} delay={1.6} />
      <span className="sr-only">{fill('Made for {name}', { name: b.recipientName })}</span>
    </section>
  );
}
