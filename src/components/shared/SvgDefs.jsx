// One hidden SVG that holds the pencil-drawing toolbox: wobble filters, graphite grain and hatch patterns.
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="rough" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="rough-lite" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.7" result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
        </filter>
        <filter id="smudge" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#3b3835" strokeWidth="0.7" opacity="0.55" />
        </pattern>
        <pattern id="cross" patternUnits="userSpaceOnUse" width="6" height="6">
          <path d="M0 0L6 6M6 0L0 6" stroke="#3b3835" strokeWidth="0.6" opacity="0.5" />
        </pattern>
      </defs>
    </svg>
  );
}
