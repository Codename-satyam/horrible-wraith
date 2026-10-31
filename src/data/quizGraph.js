// Pure helpers for the branching quiz (no React). Used by the UI, by `npm run check` and by the tests.
export const isOutcome = (quiz, id) => Object.prototype.hasOwnProperty.call(quiz.outcomes, id);
export const isQuestion = (quiz, id) => Object.prototype.hasOwnProperty.call(quiz.questions, id);

// Every destination an answer can lead to (static, for validation).
export const destinations = (answer) => {
  const n = answer.next;
  if (typeof n === 'string') return [n];
  if (n && typeof n === 'object') return [...Object.values(n.map || {}), n.otherwise].filter(Boolean);
  return [];
};

// Where does this answer lead, given the answers chosen so far? path = [{q, a}]
export const resolveNext = (answer, path = []) => {
  const n = answer.next;
  if (typeof n === 'string') return n;
  const chosen = path.find((p) => p.q === n.by)?.a;
  return (chosen && n.map[chosen]) || n.otherwise;
};

export function validateQuiz(quiz, memoryIds = []) {
  const errors = [];
  const { questions, outcomes, start } = quiz;
  if (!isQuestion(quiz, start)) errors.push(`start "${start}" is not a question`);
  const seen = new Set();
  Object.entries(questions).forEach(([qid, q]) => {
    if (!q.answers?.length) errors.push(`${qid} has no answers`);
    q.answers?.forEach((a) => {
      if (seen.has(a.id)) errors.push(`duplicate answer id ${a.id}`);
      seen.add(a.id);
      if (!a.reaction?.line) errors.push(`${a.id} has no reaction line`);
      if (a.reaction?.memoryId && !memoryIds.includes(a.reaction.memoryId)) errors.push(`${a.id} uses unknown memory ${a.reaction.memoryId}`);
      const d = destinations(a);
      if (!d.length) errors.push(`${a.id} has no destination`);
      d.forEach((t) => { if (!isQuestion(quiz, t) && !isOutcome(quiz, t)) errors.push(`${a.id} leads to unknown "${t}"`); });
      if (a.next?.by && !isQuestion(quiz, a.next.by)) errors.push(`${a.id} branches on unknown question ${a.next.by}`);
    });
  });
  Object.entries(outcomes).forEach(([oid, o]) => {
    if (!o.message || !o.title) errors.push(`${oid} needs a title and a message`);
    if (!o.finale) errors.push(`${oid} needs a finale line (shown on the finale page)`);
    if (o.memoryId && !memoryIds.includes(o.memoryId)) errors.push(`${oid} uses unknown memory ${o.memoryId}`);
  });
  // reachability + loop detection (depth-first over question -> question edges)
  const reach = new Set(), stack = new Set();
  const visit = (id) => {
    if (isOutcome(quiz, id)) { reach.add(id); return; }
    if (!isQuestion(quiz, id)) return;
    if (stack.has(id)) { errors.push(`loop detected at ${id}`); return; }
    if (reach.has(id)) return;
    stack.add(id); reach.add(id);
    questions[id].answers.forEach((a) => destinations(a).forEach(visit));
    stack.delete(id);
  };
  if (isQuestion(quiz, start)) visit(start);
  [...Object.keys(questions), ...Object.keys(outcomes)].forEach((id) => { if (!reach.has(id)) errors.push(`${id} is unreachable`); });
  return errors;
}

// Walk every possible route and return the set of outcomes actually reachable with real branching.
export function enumerateRoutes(quiz) {
  const found = new Map();
  const walk = (qid, path) => {
    quiz.questions[qid].answers.forEach((a) => {
      const to = resolveNext(a, path);
      const next = [...path, { q: qid, a: a.id }];
      if (isOutcome(quiz, to)) found.set(to, (found.get(to) || 0) + 1);
      else walk(to, next);
    });
  };
  walk(quiz.start, []);
  return found;
}
