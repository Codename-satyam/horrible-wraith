import { useMemo, useState } from 'react';
import { birthday as b } from '../../data/birthday';
import { quiz } from '../../data/quiz';
import { isOutcome, resolveNext, validateQuiz } from '../../data/quizGraph';
import { memories } from '../../data/memories';
import { useCapy } from '../capybara/CapybaraController';
import HandButton from '../shared/HandButton';
import LilyCluster from '../flowers/LilyCluster';
import QuizQuestion from './QuizQuestion';
import QuizOutcome from './QuizOutcome';
import QuizScene from './QuizScene';

// phase: intro -> question -> reaction -> (question ...) -> outcome. Everything is data-driven (src/data/quiz.js).
if (import.meta.env?.DEV) {
  const errs = validateQuiz(quiz, memories.map((m) => m.id));
  if (errs.length) console.warn('[quiz] data problems:\n - ' + errs.join('\n - '));
}

export default function BirthdayQuiz({ onGo, onOutcome }) {
  const [phase, setPhase] = useState('intro');
  const [qid, setQid] = useState(quiz.start);
  const [path, setPath] = useState([]);          // [{ q, a }]
  const [pending, setPending] = useState(null);  // { answer, to }
  const [found, setFound] = useState(() => new Set());
  const [outId, setOutId] = useState(null);
  const { say, sayText } = useCapy();
  const total = useMemo(() => Object.keys(quiz.outcomes).length, []);

  const reset = (announce) => { setPhase('question'); setQid(quiz.start); setPath([]); setPending(null); setOutId(null); say(announce); };
  const pick = (answer) => {
    const to = resolveNext(answer, path);
    const valid = isOutcome(quiz, to) || quiz.questions[to];
    setPending({ answer, to: valid ? to : quiz.start });
    setPath((p) => [...p, { q: qid, a: answer.id }]);
    setPhase('reaction');
    if (answer.capy) sayText(answer.capy); else say('quizAnswerSelected');
  };
  const back = () => { // revisit the previous answer
    const last = path[path.length - 1];
    if (!last) return;
    setPath((p) => p.slice(0, -1)); setQid(last.q); setPending(null); setPhase('question');
  };
  const proceed = () => {
    const to = pending.to;
    if (isOutcome(quiz, to)) {
      setOutId(to); onOutcome?.(to); setFound((f) => new Set(f).add(to)); setPhase('outcome');
      const o = quiz.outcomes[to];
      if (o.capy) sayText(o.capy, 'quizOutcome'); else say('quizOutcome');
    } else { setQid(to); setPhase('question'); }
  };
  const changeAnswer = () => { setPath((p) => p.slice(0, -1)); setPending(null); setPhase('question'); };

  return (
    <section className="page quiz" aria-labelledby="quiz-h">
      <LilyCluster className="quiz-lily ql1" poses={[2, 0, 1]} tones={['lilac', 'pink', 'butter']} delay={0.3} />
      <LilyCluster className="quiz-lily ql2" poses={[1, 3]} tones={['coral', 'butter']} delay={0.6} />
      <div className="quiz-sheet sheet">
        {phase === 'intro' && (
          <div className="quiz-card quiz-intro">
            <h2 id="quiz-h" className="hand page-title">{b.quizTitle}</h2>
            <p className="serif quiz-msg">{b.quizIntro}</p>
            <div className="quiz-actions"><HandButton onClick={() => { reset('quizStarted'); }}>Let me play</HandButton></div>
          </div>
        )}
        {phase === 'question' && <div key={qid + path.length}><h2 id="quiz-h" className="sr-only">{b.quizTitle}</h2><QuizQuestion node={quiz.questions[qid]} onPick={pick} onBack={back} canBack={path.length > 0} /></div>}
        {phase === 'reaction' && pending && (
          <div className="quiz-card quiz-react" key={pending.answer.id}>
            <h2 id="quiz-h" className="sr-only">{b.quizTitle}</h2>
            <QuizScene scene={pending.answer.reaction.scene} memoryId={pending.answer.reaction.memoryId} />
            <p className="hand quiz-chose">{pending.answer.text}</p>
            <p className="serif quiz-msg">{pending.answer.reaction.line}</p>
            <div className="quiz-actions">
              <HandButton onClick={proceed}>Continue</HandButton>
              <HandButton variant="ghost" onClick={changeAnswer}>Pick something else</HandButton>
            </div>
          </div>
        )}
        {phase === 'outcome' && outId && (
          <div key={outId}><h2 id="quiz-h" className="sr-only">{b.quizTitle}</h2><QuizOutcome outcome={quiz.outcomes[outId]} found={found.size} total={total} onRestart={() => reset('quizRestarted')} onGo={onGo} /></div>
        )}
      </div>
    </section>
  );
}
