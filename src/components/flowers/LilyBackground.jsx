import LilyCluster from './LilyCluster';

// Fixed edge garden: different sizes and depths so the background never looks repeated.
const SPOTS = [
  { cls: 'lb-1', poses: [1, 0, 2], tones: ['pink', 'butter', 'lilac'], delay: 1.2 },
  { cls: 'lb-2', poses: [2, 3, 0], tones: ['lilac', 'coral', 'pink'], delay: 1.5 },
  { cls: 'lb-3', poses: [3, 1], tones: ['butter', 'pink'], delay: 2 },
  { cls: 'lb-4', poses: [0, 2], tones: ['coral', 'lilac'], delay: 2.2 },
  { cls: 'lb-5', poses: [3], tones: ['pink'], delay: 2.6 }
];
export default function LilyBackground() {
  return <>{SPOTS.map((s) => <LilyCluster key={s.cls} className={s.cls} poses={s.poses} tones={s.tones} delay={s.delay} />)}</>;
}
