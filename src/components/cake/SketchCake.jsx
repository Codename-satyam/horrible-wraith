import CakeLayer from './CakeLayer';
import SketchCandle from './SketchCandle';
import CandleFlame from './CandleFlame';
import BlowOutEffect from './BlowOutEffect';

// An original pencil-drawn cake, built from independent layers (see `stage`):
// 0 construction marks · 1 plate + lower tier · 2 upper tier · 3 shading + decorations · 4 candles · 5 flames can ignite
const A_BODY = 'M120 335L118 440C118 472 482 472 482 440L480 335C480 365 120 365 120 335Z';
const A_ICING = 'M120 336C122 372 148 374 152 346C158 396 190 398 196 352C204 372 226 372 232 350C240 392 268 394 274 356C282 376 306 376 312 352C320 400 352 402 358 354C366 374 390 374 396 350C404 388 434 390 438 346C442 370 466 370 480 336C480 366 120 366 120 336Z';
const B_BODY = 'M180 250L180 330C180 352 420 352 420 330L420 250C420 272 180 272 180 250Z';
const B_ICING = 'M180 251C182 280 204 282 208 262C212 296 240 298 246 266C252 284 272 284 278 266C284 300 316 302 322 268C328 286 350 286 356 266C362 292 390 294 394 262C398 280 412 280 420 251C420 272 180 272 180 251Z';
const HEART = 'M0 6C-12-3-8-13 0-7C8-13 12-3 0 6Z';
const STAR = 'M0-8L2.4-2.5 8-2.2 3.6 1.5 5 7 0 3.8-5 7-3.6 1.5-8-2.2-2.4-2.5Z';
const SCALLOP = `M120 432${Array.from({ length: 12 }, () => 'q15 14 30 0').join('')}`;
const WISH_STARS = [[80, 130, 2.4], [520, 150, 2.2], [150, 60, 1.8], [450, 70, 2.1], [300, 36, 2.6], [40, 320, 1.8], [560, 330, 2], [230, 110, 1.4], [380, 105, 1.5]];

export const candleSpots = (n) => {
  const w = n === 1 ? 12 : Math.max(6, Math.min(12, 144 / (n - 1) - 4));
  return Array.from({ length: n }, (_, i) => {
    const x = n === 1 ? 300 : 228 + (144 * i) / (n - 1);
    return { x, y: 252 + 7 * Math.sqrt(Math.max(0, 1 - ((x - 300) / 120) ** 2)), w };
  });
};

export default function SketchCake({ stage = 0, count = 5, flame = 'lit', lit = 0, wished = false, gust = false, decor = null, svgRef }) {
  const spots = candleSpots(count);
  return (
    <svg ref={svgRef} className={`cake ${wished ? 'wished' : ''}`} data-phase={flame} viewBox="0 0 600 520" role="img" aria-label="A hand-drawn birthday cake with lit candles">
      <defs>
        <radialGradient id="cglow"><stop offset="0" stopColor="#ffd98a" stopOpacity=".9" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
      </defs>
      <g filter="url(#rough)" strokeLinecap="round" strokeLinejoin="round" stroke="#3b3835" strokeWidth="2.4">
        <CakeLayer on className="cl-marks">
          <g fill="none" strokeWidth="1" opacity=".35" strokeDasharray="1">
            <path className="draw" pathLength="1" d="M300 100V500M40 335H560M170 250H430" style={{ '--dl': '0s' }} />
            <ellipse className="draw" pathLength="1" cx="300" cy="335" rx="180" ry="30" style={{ '--dl': '.4s' }} />
            <ellipse className="draw" pathLength="1" cx="300" cy="250" rx="120" ry="22" style={{ '--dl': '.8s' }} />
            <path className="draw" pathLength="1" d="M92 470l12 0M96 466v8M500 100l10 0M505 95v10" style={{ '--dl': '1.1s' }} />
          </g>
        </CakeLayer>

        <CakeLayer on={stage >= 1} className="cl-base">
          <path d="M60 470C150 505 450 505 540 470C450 490 150 490 60 470Z" fill="url(#hatch)" stroke="none" opacity=".4" />
          <ellipse className="draw f-plate" pathLength="1" cx="300" cy="462" rx="250" ry="34" />
          <ellipse className="draw" pathLength="1" cx="300" cy="460" rx="212" ry="26" fill="none" style={{ '--dl': '.5s' }} />
          <path className="draw f-a" pathLength="1" d={A_BODY} style={{ '--dl': '.7s' }} />
          <ellipse className="draw f-top" pathLength="1" cx="300" cy="335" rx="180" ry="30" style={{ '--dl': '1.2s' }} />
          <path className="draw f-icing" pathLength="1" d={A_ICING} style={{ '--dl': '1.5s' }} />
        </CakeLayer>

        <CakeLayer on={stage >= 2} className="cl-top">
          <path className="draw f-b" pathLength="1" d={B_BODY} />
          <ellipse className="draw f-top" pathLength="1" cx="300" cy="250" rx="120" ry="22" style={{ '--dl': '.5s' }} />
          <path className="draw f-icing" pathLength="1" d={B_ICING} style={{ '--dl': '.8s' }} />
        </CakeLayer>

        <CakeLayer on={stage >= 3} className="cl-shade">
          <path d="M404 352C440 356 466 348 480 336L482 440C482 470 430 472 400 470C440 440 420 380 404 352Z" fill="url(#hatch)" stroke="none" opacity=".55" />
          <path d="M120 420L118 440C118 472 482 472 482 440L480 420C480 450 120 450 120 420Z" fill="url(#cross)" stroke="none" opacity=".5" />
          <path d="M372 270C396 268 412 262 420 250L420 330C420 350 380 352 366 351C384 320 380 292 372 270Z" fill="url(#hatch)" stroke="none" opacity=".55" />
          <ellipse cx="300" cy="354" rx="120" ry="10" fill="#3b3835" stroke="none" opacity=".1" filter="url(#smudge)" />
          <path className="draw" pathLength="1" fill="none" d={SCALLOP} strokeWidth="1.8" />
          <path className="draw" pathLength="1" fill="none" d="M180 306C180 326 420 326 420 306M180 316C180 336 420 336 420 316" strokeWidth="1.8" style={{ '--dl': '.3s' }} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <path key={k} className="draw deco" pathLength="1" d={k % 2 ? STAR : HEART} transform={`translate(${165 + k * 54} 412) scale(1.5)`} style={{ '--dl': `${0.5 + k * 0.15}s` }} />
          ))}
          {[0, 1, 2, 3].map((k) => <path key={`b${k}`} className="draw deco" pathLength="1" d={k % 2 ? HEART : STAR} transform={`translate(${222 + k * 52} 296) scale(.9)`} style={{ '--dl': `${0.9 + k * 0.12}s` }} />)}
          <path className="draw" pathLength="1" fill="none" d="M150 346q-14-6-6-16M450 346q14-6 6-16" strokeWidth="1.6" style={{ '--dl': '1.4s' }} />
        </CakeLayer>

      </g>
      {/* stickers sit between the cake and the candles; kept outside the pencil filter so dragging stays smooth */}
      <g className="cake-decor">{decor}</g>
      <g filter="url(#rough)" strokeLinecap="round" strokeLinejoin="round" stroke="#3b3835" strokeWidth="2.4">
        <CakeLayer on={stage >= 4} className="cl-candles">
          {spots.map((s, i) => <SketchCandle key={i} i={i} {...s} />)}
        </CakeLayer>

        <g className={`cl-flames ${stage >= 5 ? 'on' : ''}`}>
          {spots.map((s, i) => (
            <CandleFlame key={i} i={i} x={s.x} y={s.y} state={flame === 'lit' ? (stage >= 5 && i < lit ? 'lit' : 'unlit') : flame} />
          ))}
        </g>

        <g className="wish-stars" fill="none">
          {WISH_STARS.map(([x, y, s], i) => (
            <path key={i} className="wstar" d={STAR} transform={`translate(${x} ${y}) scale(${s})`} style={{ '--wd': `${i * 0.12}s` }} />
          ))}
        </g>
        {gust && <BlowOutEffect />}
      </g>
    </svg>
  );
}
