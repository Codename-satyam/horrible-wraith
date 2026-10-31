import MountainLily from './MountainLily';

// Three lilies of different height growing from one spot. Size it with --h (CSS) or the `size` prop.
export default function LilyCluster({ className = '', tones = ['pink', 'butter', 'lilac'], poses = [1, 0, 2], delay = 0, size, style }) {
  return (
    <div className={`lily-cluster ${className}`} style={{ ...(size ? { '--h': size } : null), ...style }} aria-hidden="true">
      {poses.map((p, i) => (
        <MountainLily key={i} pose={p} tone={tones[i % tones.length]} delay={delay + i * 0.35} flip={i === 2} className={`lc-${i}`} />
      ))}
    </div>
  );
}
