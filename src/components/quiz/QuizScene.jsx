import MountainLily from '../flowers/MountainLily';
import { CapybaraArt } from '../capybara/Capybara';
import { Star, Sparkle, Heart } from '../canvas/SketchDoodles';
import Photo from '../shared/Photo';
import { getMemory } from '../../data/memories';

// Tiny pencil scenes used by quiz reactions and endings.
const S = { fill: 'none', stroke: '#3b3835', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ink = ({ d, className = '', ...r }) => <path className={`ink ${className}`} pathLength="1" d={d} {...r} />;

export default function QuizScene({ scene, memoryId }) {
  const m = memoryId ? getMemory(memoryId) : null;
  let body;
  switch (scene) {
    case 'lily':
      body = <div className="qs-lily"><MountainLily pose={0} tone="pink" delay={0.1} /><MountainLily pose={1} tone="butter" delay={0.4} flip /></div>;
      break;
    case 'capy':
      body = <div className="qs-capy"><CapybaraArt hat /><Star className="qd q1 float" style={{ position: 'absolute' }} /><Heart className="qd q2 float" style={{ position: 'absolute' }} /></div>;
      break;
    case 'photo':
      body = m ? <figure className={`qs-photo ${m.shape || 'portrait'}`}><span className="hold tape" /><div className="frame"><div className="pic"><Photo m={m} /></div></div></figure> : null;
      break;
    case 'stars':
      body = <div className="qs-stars"><Star className="qd q1 float" style={{ position: 'absolute' }} /><Sparkle className="qd q2" style={{ position: 'absolute' }} /><Star className="qd q3 float" style={{ position: 'absolute' }} c="var(--pink)" /><Heart className="qd q4 float" style={{ position: 'absolute' }} c="var(--lilac)" /><Sparkle className="qd q5" style={{ position: 'absolute' }} /></div>;
      break;
    case 'moon':
      body = (
        <svg viewBox="0 0 240 180" aria-hidden="true"><g filter="url(#rough)" {...S}>
          <Ink className="fillable moon" d="M150 24a48 48 0 1 0 34 82a38 38 0 0 1-34-82z" />
          <Ink d="M40 40l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1zM200 120l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" />
          <Ink d="M96 170h48M120 170v-26" /><Ink className="fillable cndl" d="M112 144h16v26h-16z" /><Ink className="flm" d="M120 140c-6-6-3-14 0-20c3 6 6 14 0 20z" />
        </g></svg>
      );
      break;
    case 'door':
      body = (
        <svg viewBox="0 0 240 180" aria-hidden="true"><g filter="url(#rough)" {...S}>
          <Ink className="fillable tree" d="M86 176C92 140 90 100 82 70C100 58 140 58 158 70C150 100 148 140 154 176" />
          <Ink className="fillable door" d="M108 176v-44a12 12 0 0 1 24 0v44" /><circle cx="126" cy="154" r="1.8" fill="#3b3835" />
          <Ink className="fillable crown" d="M54 80C28 76 26 40 54 36C56 14 94 8 108 24C126 6 164 14 168 36C198 36 204 76 176 80" />
          <Ink d="M40 176H200" />
        </g></svg>
      );
      break;
    case 'path':
    default:
      body = (
        <svg viewBox="0 0 240 180" aria-hidden="true"><g filter="url(#rough)" {...S}>
          <Ink className="fillable hills" d="M0 120C40 84 80 104 120 84C160 64 200 90 240 78V180H0z" />
          <Ink d="M96 180C60 160 150 146 118 124C98 110 140 100 130 88" strokeWidth="3" />
          <circle className="fillable sun" cx="190" cy="34" r="16" /><Ink d="M190 8v-6M190 60v6M164 34h-6M216 34h6" />
          <Ink className="fillable tree" d="M44 112V90M44 90c-14-4-14-24 0-26c14 2 14 22 0 26z" />
        </g></svg>
      );
  }
  return <div className={`qscene qs-${scene}`}>{body}</div>;
}
