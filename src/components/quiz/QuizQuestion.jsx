const LETTERS = 'ABCDEFGH';
export default function QuizQuestion({ node, onPick, onBack, canBack }) {
  return (
    <div className="quiz-card">
      <h3 id="quiz-q" className="hand quiz-prompt">{node.prompt}</h3>
      <ul className="quiz-opts" aria-labelledby="quiz-q">
        {node.answers.map((a, i) => (
          <li key={a.id}>
            <button type="button" className="opt" onClick={() => onPick(a)}>
              <span className="hand opt-l">{LETTERS[i]}.</span><span className="opt-t">{a.text}</span>
            </button>
          </li>
        ))}
      </ul>
      {canBack && <button type="button" className="linkish" onClick={onBack}>Go back to my last answer</button>}
    </div>
  );
}
