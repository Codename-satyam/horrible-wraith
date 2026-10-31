// The typed wish appears on a little paper card, folds into a paper plane, and flies up and away.
export default function WishPlane({ text }) {
  return (
    <div className="wish-plane" aria-hidden="true">
      <div className="wp-fly">
        <div className="wp-card"><p className="hand">{text}</p></div>
        <svg className="wp-plane" viewBox="0 0 120 80" focusable="false">
          <g strokeLinejoin="round" strokeLinecap="round" stroke="#3b3835" strokeWidth="2.2">
            <path d="M4 36L116 4L84 76L58 52L40 66L40 46Z" fill="var(--paper-2)" />
            <path d="M116 4L40 46" fill="none" />
            <path d="M116 4L58 52" fill="none" strokeWidth="1.6" />
            <path d="M40 46L58 52L40 66Z" fill="var(--paper-3)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
