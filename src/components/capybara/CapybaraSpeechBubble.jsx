// A single hand-drawn speech bubble. The wrapper is always rendered so screen readers get a live region.
export default function CapybaraSpeechBubble({ bubble }) {
  return (
    <div className="capy-bubble" role="status" aria-live="polite">
      {bubble && <p key={bubble.id}>{bubble.text}</p>}
    </div>
  );
}
