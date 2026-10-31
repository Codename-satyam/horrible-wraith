// A group of cake artwork that is revealed (drawn) when `on` becomes true.
export default function CakeLayer({ on, className = '', children }) {
  return <g className={`cl ${className} ${on ? 'on' : ''}`}>{children}</g>;
}
