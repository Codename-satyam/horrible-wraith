import { quiz } from '../src/data/quiz.js';
import { memories } from '../src/data/memories.js';
import { birthday } from '../src/data/birthday.js';
import { validateQuiz, enumerateRoutes } from '../src/data/quizGraph.js';

const ids = memories.map((m) => m.id);
const errors = validateQuiz(quiz, ids);
const dup = (arr) => arr.filter((v, i) => arr.indexOf(v) !== i);
dup(ids).forEach((i) => errors.push(`duplicate memory id ${i}`));
dup(memories.map((m) => m.quote)).forEach((q) => errors.push(`duplicate quote: ${q}`));
birthday.featuredMemoryIds.forEach((i) => { if (!ids.includes(i)) errors.push(`featured id ${i} not in memories.js`); });
if (birthday.featuredMemoryIds.length !== 5) errors.push('featuredMemoryIds must contain exactly 5 ids');
Object.entries(quiz.outcomes).forEach(([id, o]) => { if (!o.finale) errors.push(`outcome ${id} has no finale line`); if (!Array.isArray(o.tones) || !o.tones.length) errors.push(`outcome ${id} has no lily tones`); });
if (birthday.candleCount < 1 || birthday.candleCount > 12) errors.push('candleCount must be 1-12');

const routes = enumerateRoutes(quiz);
console.log('Quiz routes per ending:', Object.fromEntries(routes));
if (errors.length) { console.error('\nProblems found:\n - ' + errors.join('\n - ')); process.exit(1); }
console.log(`OK: ${Object.keys(quiz.questions).length} questions, ${Object.keys(quiz.outcomes).length} endings, ${memories.length} memories.`);
