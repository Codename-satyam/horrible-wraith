import { getMemory } from '../../data/memories';
import { fill } from '../../lib/text';
import { birthday } from '../../data/birthday';
import QuizScene from './QuizScene';
import HandButton from '../shared/HandButton';
import Photo from '../shared/Photo';

export default function QuizOutcome({ outcome, found, total, onRestart, onGo }) {
  const m = outcome.memoryId ? getMemory(outcome.memoryId) : null;
  return (
    <div className="quiz-card quiz-out">
      <QuizScene scene={outcome.scene} memoryId={outcome.scene === 'photo' ? outcome.memoryId : undefined} />
      <h3 id="quiz-q" className="hand quiz-prompt">{outcome.title}</h3>
      <p className="serif quiz-msg">{outcome.message}</p>
      {m && outcome.scene !== 'photo' && (
        <figure className="qo-photo"><div className="frame"><div className="pic"><Photo m={m} /></div></div><figcaption className="hand note">{m.annotation || m.caption}</figcaption></figure>
      )}
      <p className="hand quiz-wish">{fill(outcome.wish, { name: birthday.recipientName })}</p>
      <p className="quiz-found">Little worlds found so far: {found} of {total}</p>
      <div className="quiz-actions">
        <HandButton onClick={onRestart}>Try another path</HandButton>
        <HandButton variant="ghost" onClick={() => onGo('cake')}>On to the cake</HandButton>
        <HandButton variant="ghost" onClick={() => onGo('welcome')}>Back to the cover</HandButton>
      </div>
    </div>
  );
}
