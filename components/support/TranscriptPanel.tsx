"use client";

type Message = { role: string; content: string; created_at?: string };

export function TranscriptPanel({ messages }: { messages: Message[] }) {
  return (
    <div style={{ display: "grid", gap: 8, maxHeight: 260, overflowY: "auto", padding: 8, background: "#0f172a", borderRadius: 10 }}>
      {messages.length === 0 ? <div style={{ color: "#94a3b8" }}>No messages yet.</div> : null}
      {messages.map((msg, idx) => (
        <div key={`${msg.role}-${idx}`} style={{ padding: 10, borderRadius: 8, background: msg.role === "user" ? "#1d4ed8" : "#1f2937" }}>
          <strong style={{ display: "block", textTransform: "capitalize" }}>{msg.role}</strong>
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
