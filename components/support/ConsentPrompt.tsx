"use client";

export function ConsentPrompt({ onAccept }: { onAccept: () => void }) {
  return (
    <div style={{ padding: 14, background: "#0f172a", borderRadius: 12, border: "1px solid #1e293b" }}>
      <p style={{ marginTop: 0, marginBottom: 4, fontWeight: 600, fontSize: 14 }}>Before we begin</p>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        By continuing, you consent to session logging, transcript retention, and controlled escalation to internal support teams when required.
      </p>
      <button className="btn btn-success" onClick={onAccept} style={{ width: "100%" }}>
        Accept and Continue
      </button>
    </div>
  );
}
