"use client";

export function ConsentPrompt({ onAccept }: { onAccept: () => void }) {
  return (
    <div style={{ padding: 12, background: "#111827", borderRadius: 10, border: "1px solid #374151" }}>
      <p style={{ marginTop: 0 }}>Before AI assistance starts, consent to session logging, transcript retention, and controlled escalation.</p>
      <button onClick={onAccept} style={{ padding: "10px 14px", borderRadius: 8, border: 0, background: "#059669", color: "white" }}>
        Accept and Continue
      </button>
    </div>
  );
}
