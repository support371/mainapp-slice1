"use client";

import { useState } from "react";
import { ConsentPrompt } from "@/components/support/ConsentPrompt";
import { TranscriptPanel } from "@/components/support/TranscriptPanel";

type Message = { role: string; content: string; created_at?: string };

export function SupportPopupShell({ onClose }: { onClose: () => void }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Ready");

  async function startSession() {
    const res = await fetch("/api/support/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "demo-user",
        membership_tier: "VIP",
        role: "member",
        entry_route: "/portal/dashboard",
        entry_trigger: "dashboard_help",
        consent_status: "PENDING",
        queue_candidate: "VIP_CONCIERGE",
        support_mode: "AI_FIRST",
      }),
    });
    const data = await res.json();
    setSessionId(data.session_id);
    setStatus(`Session ${data.session_id} started`);
  }

  async function acceptConsent() {
    if (!sessionId) return;
    await fetch("/api/support/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, granted: true }),
    });
    setConsentAccepted(true);
    setStatus("Consent accepted");
  }

  async function sendMessage() {
    if (!sessionId || !input.trim()) return;
    const userText = input;
    setInput("");
    const res = await fetch("/api/support/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, role: "user", content: userText }),
    });
    const data = await res.json();
    const nextMessages = [...messages, { role: "user", content: userText }, { role: "assistant", content: data.assistant_message }];
    setMessages(nextMessages);
    setStatus(data.policy.action === "ESCALATE_HUMAN" ? "Escalated to internal ops" : "AI response delivered");
  }

  return (
    <div style={{ position: "fixed", right: 24, bottom: 24, width: 420, background: "#020617", border: "1px solid #334155", borderRadius: 16, padding: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <strong>AI Concierge Support</strong>
        <button onClick={onClose} style={{ background: "transparent", color: "#94a3b8", border: 0, cursor: "pointer" }}>Close</button>
      </div>
      {!sessionId ? <button onClick={startSession} style={{ padding: "10px 14px", borderRadius: 8, border: 0, background: "#2563eb", color: "white" }}>Start Support Session</button> : null}
      {sessionId && !consentAccepted ? <ConsentPrompt onAccept={acceptConsent} /> : null}
      {sessionId && consentAccepted ? (
        <>
          <TranscriptPanel messages={messages} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe your issue" style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #475569", background: "#0f172a", color: "white" }} />
            <button onClick={sendMessage} style={{ padding: "10px 14px", borderRadius: 8, border: 0, background: "#059669", color: "white" }}>Send</button>
          </div>
        </>
      ) : null}
      <div style={{ marginTop: 12, color: "#94a3b8", fontSize: 12 }}>{status}</div>
    </div>
  );
}
