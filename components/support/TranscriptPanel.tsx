"use client";

type Message = { role: string; content: string };

export function TranscriptPanel({ messages }: { messages: Message[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto", padding: "4px 0" }}>
      {messages.length === 0 ? (
        <div className="muted" style={{ fontSize: 13, padding: "12px 0", textAlign: "center" }}>No messages yet.</div>
      ) : null}
      {messages.map((msg, idx) => (
        <div key={`${msg.role}-${idx}`} style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: msg.role === "user" ? "#1d4ed8" : "#1f2937",
          alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
          maxWidth: "88%",
          border: "1px solid",
          borderColor: msg.role === "user" ? "#2563eb" : "#1e293b",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: msg.role === "user" ? "#93c5fd" : "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {msg.role === "user" ? "You" : "AI Concierge"}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "#f1f5f9" }}>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
