"use client";

type PolicyDecision = { action: string; queueClass: string; slaClass: string; reason: string };
type Message = { role: string; content: string; policy?: PolicyDecision };

const ROLE_LABELS: Record<string, string> = { user: "You", assistant: "AI Concierge", system: "System", agent: "Agent" };
const ROLE_COLORS: Record<string, string> = { user: "#1d4ed8", assistant: "#1f2937", system: "#0f172a", agent: "#1f2937" };

export function TranscriptPanel({ messages }: { messages: Message[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflowY: "auto", padding: "4px 0" }}>
      {messages.length === 0 ? (
        <div style={{ color: "#334155", fontSize: 13, padding: "16px 0", textAlign: "center" }}>No messages yet. Send one below.</div>
      ) : null}
      {messages.map((msg, idx) => (
        <div key={`${msg.role}-${idx}`} style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: ROLE_COLORS[msg.role] ?? "#1f2937",
          alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
          maxWidth: "88%",
          border: "1px solid",
          borderColor: msg.role === "user" ? "#2563eb" : "#1e293b",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: msg.role === "user" ? "#93c5fd" : "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {ROLE_LABELS[msg.role] ?? msg.role}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "#f1f5f9" }}>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
