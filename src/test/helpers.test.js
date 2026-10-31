import { describe, it, expect } from 'vitest';
import { dragProgress, settleTarget } from '../lib/pageCurl';
import { isOnCake, autoSpot, sanitize, makeSticker, MAX_STICKERS } from '../lib/decor';

describe('page curl maths', () => {
  const wide = { wide: true, left: 0, width: 1000 };
  it('two pages: the page edge follows the pointer around the spine', () => {
    expect(dragProgress({ ...wide, dir: 'next', x0: 900, x: 900 })).toBe(0);
    expect(dragProgress({ ...wide, dir: 'next', x0: 900, x: 500 })).toBeGreaterThan(0.3);
    expect(dragProgress({ ...wide, dir: 'next', x0: 900, x: 500 })).toBeLessThan(0.45);
    expect(dragProgress({ ...wide, dir: 'next', x0: 900, x: 0 })).toBe(1);
    expect(dragProgress({ ...wide, dir: 'next', x0: 900, x: 990 })).toBe(0);
    expect(dragProgress({ ...wide, dir: 'prev', x0: 100, x: 100 })).toBe(1);
    expect(dragProgress({ ...wide, dir: 'prev', x0: 100, x: 1000 })).toBe(0);
  });
  it('one page: a plain horizontal drag', () => {
    const one = { wide: false, left: 0, width: 400 };
    expect(dragProgress({ ...one, dir: 'next', x0: 300, x: 120 })).toBeCloseTo(0.5);
    expect(dragProgress({ ...one, dir: 'next', x0: 300, x: 380 })).toBe(0);
    expect(dragProgress({ ...one, dir: 'prev', x0: 50, x: 50 })).toBe(1);
    expect(dragProgress({ ...one, dir: 'prev', x0: 50, x: 500 })).toBe(0);
  });
  it('a released page settles to the nearer side', () => {
    expect(settleTarget('next', 0.2)).toBe(0);
    expect(settleTarget('next', 0.5)).toBe(1);
    expect(settleTarget('prev', 0.8)).toBe(1);
    expect(settleTarget('prev', 0.4)).toBe(0);
  });
});

describe('cake decorating helpers', () => {
  it('knows where the cake is', () => {
    expect(isOnCake(300, 240)).toBe(true);
    expect(isOnCake(300, 400)).toBe(true);
    expect(isOnCake(20, 20)).toBe(false);
    expect(isOnCake(300, 500)).toBe(false);
  });
  it('auto-placement avoids stickers already there and stays on the cake', () => {
    let items = [];
    for (let k = 0; k < 20; k++) { const p = autoSpot(items); expect(isOnCake(p.x, p.y)).toBe(true); items = [...items, makeSticker('heart', p.x, p.y)]; }
    expect(new Set(items.map((d) => d.id)).size).toBe(20);
  });
  it('ignores anything from storage that it cannot draw', () => {
    const list = sanitize([{ kind: 'heart', x: 10, y: 20 }, { kind: 'dragon', x: 1, y: 1 }, null, { kind: 'star', x: 'a', y: 2 }]);
    expect(list).toHaveLength(1);
    expect(sanitize('nope')).toEqual([]);
    expect(sanitize(Array.from({ length: 50 }, () => ({ kind: 'cookie', x: 1, y: 1 })))).toHaveLength(MAX_STICKERS);
  });
});
