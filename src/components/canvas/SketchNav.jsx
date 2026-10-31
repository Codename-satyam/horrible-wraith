import { birthday as b } from '../../data/birthday';

// Small sketchbook tabs across the top. The current page gets a pencil underline.
export default function SketchNav({ page, onGo, finished }) {
  return (
    <nav className="sketch-nav" aria-label="Sketchbook sections">
      <ul>
        {b.nav.map((n) => {
          const locked = n.id === 'finale' && !finished;
          return (
            <li key={n.id}>
              <button type="button" className={`tab hand ${page === n.id ? 'on' : ''} ${locked ? 'locked' : ''}`} aria-current={page === n.id ? 'page' : undefined} aria-disabled={locked || undefined} onClick={() => onGo(n.id)}>
                {n.label}
                {page === n.id && <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true"><path className="ink" pathLength="1" d="M2 5q12-5 24 0t24 0 24 0 22-1" fill="none" stroke="#3b3835" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" /></svg>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
