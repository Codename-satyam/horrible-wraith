// Pure helpers for decorating the cake. Positions are in the cake drawing's own coordinates (viewBox 600 x 520).
export const MAX_STICKERS = 24;
export const KINDS = ['strawberry', 'cherry', 'heart', 'star', 'flower', 'swirl', 'cookie', 'sprinkles'];

// The two tiers of the cake (where a sticker may sit).
export const isOnCake = (x, y) =>
  (x >= 184 && x <= 416 && y >= 232 && y <= 346) || (x >= 126 && x <= 474 && y >= 324 && y <= 458);

const SPOTS = [[300, 240], [248, 244], [352, 244], [215, 300], [385, 300], [300, 302], [165, 392], [435, 392], [300, 398], [232, 398], [368, 398], [165, 348], [435, 348], [262, 300], [338, 300]];

export function autoSpot(items) {
  const free = (x, y) => items.every((it) => Math.hypot(it.x - x, it.y - y) > 26);
  const hit = SPOTS.find(([x, y]) => free(x, y));
  if (hit) return { x: hit[0], y: hit[1] };
  for (let k = 0; k < 40; k++) { // somewhere random on the lower tier
    const x = 140 + Math.random() * 320, y = 340 + Math.random() * 110;
    if (isOnCake(x, y) && free(x, y)) return { x, y };
  }
  return { x: 300, y: 400 };
}

let seq = 0;
export const makeSticker = (kind, x, y) => ({
  id: `s${Date.now().toString(36)}${(seq++).toString(36)}`,
  kind, x: Math.round(x), y: Math.round(y),
  r: Math.round((Math.random() - 0.5) * 28), s: 1,
});

// Whatever came out of storage, keep only things we can draw.
export const sanitize = (list) => (Array.isArray(list) ? list : [])
  .filter((d) => d && KINDS.includes(d.kind) && Number.isFinite(d.x) && Number.isFinite(d.y))
  .slice(0, MAX_STICKERS)
  .map((d, k) => ({ id: String(d.id || `s${k}`), kind: d.kind, x: d.x, y: d.y, r: Number.isFinite(d.r) ? d.r : 0, s: Number.isFinite(d.s) ? d.s : 1 }));

// Screen pixels -> cake drawing coordinates (null if the browser cannot tell us).
export function clientToSvg(svg, clientX, clientY) {
  if (!svg?.createSVGPoint || !svg.getScreenCTM) return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}
