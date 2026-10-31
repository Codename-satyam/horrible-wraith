// Maths for dragging a page. Progress p runs from 0 (page lying flat on the right) to 1 (flipped over to the left).
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
const arc = (f) => Math.acos(Math.max(-1, Math.min(1, f)));

// wide: two-page spread. The page edge follows the pointer around the spine (x = hinge + W*cos(pi*p)).
// single: one page at a time, a plain horizontal drag across ~90% of the page.
export function dragProgress({ wide, dir, x, x0, left, width }) {
  if (wide) {
    const hinge = left + width / 2, W = width / 2;
    const a = arc((x - hinge) / W), a0 = arc((x0 - hinge) / W);
    if (dir === 'next') return clamp01((a - a0) / ((Math.PI - a0) || 1));
    return clamp01(a0 ? a / a0 : 1);
  }
  const span = width * 0.9;
  return dir === 'next' ? clamp01((x0 - x) / span) : clamp01(1 - (x - x0) / span);
}

// Where a released page should settle.
export const settleTarget = (dir, p) => (dir === 'next' ? (p > 0.3 ? 1 : 0) : (p < 0.7 ? 0 : 1));
