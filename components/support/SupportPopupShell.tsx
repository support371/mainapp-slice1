"use client";

import { useState } from "react";
import { ConsentPrompt } from "@/components/support/ConsentPrompt";
import { TranscriptPanel } from "@/components/support/TranscriptPanel";

type Message = { role: string; content: string; policy?: PolicyDecision };
type PolicyDecision = { action: string; queueClass: string; slaClass: string; reason: string };

const STEPS = ["Session", "Consent", "Chat"];

const SLA_COLORS: Record<string, string> = { P1: "#ef4444", P2: "#f97316", P3: "#facc15", P4: "#22c55e" };
const ACTION_COLORS: Record<string, string> = { ESCALATE_HUMAN: "#ef4444", ALLOW_AI: "#22c55e", RESTRICTED: "#f97316" };

export function SupportPopupShell({ onClose }: { onClose: () => void }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastPolicy, setLastPolicy] = useState<PolicyDecision | null>(null);

  const step = !sessionId ? 0 : !consentAccepted ? 1 : 2;

  async function startSession() {
    setLoading(true);
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
    setLoading(false);
  }

  async function acceptConsent() {
    if (!sessionId) return;
    await fetch("/api/support/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, granted: true }),
    });
    setConsentAccepted(true);
  }

  async function sendMessage() {
    if (!sessionId || !input.trim() || loading) return;
    const userText = input;
    setInput("");
    setLoading(true);
    const res = await fetch("/api/support/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, role: "user", content: userText }),
    });
    const data = await res.json();
    const policy: PolicyDecision = data.policy;
    setLastPolicy(policy);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: data.assistant_message, policy },
    ]);
    setLoading(false);
  }

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 24, width: 440,
      background: "#020617", border: "1px solid #334155", borderRadius: 18,
      boxShadow: "0 24px 60px rgba(0,0,0,0.6)", overflow: "hidden", zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0b1220" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <strong style={{ fontSize: 14 }}>AI Concierge Support</strong>
        </div>
        <button onClick={onClose} style={{ background: "transparent", color: "#64748b", border: 0, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", padding: "10px 16px", gap: 4, borderBottom: "1px solid #0f172a" }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, flexShrink: 0,
              background: i < step ? "#1d4ed8" : i === step ? "#2563eb" : "#1e293b",
              color: i <= step ? "white" : "#475569",
            }}>{i < step ? "✓" : i + 1}</div>
            <span style={{ fontSize: 11, color: i === step ? "#e2e8f0" : i < step ? "#64748b" : "#334155", fontWeight: i === step ? 600 : 400 }}>{label}</span>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? "#1d4ed8" : "#1e293b", marginLeft: 4 }} />}
          </div>
        ))}
      </div>

      {/* Session ID badge */}
      {sessionId && (
        <div style={{ padding: "6px 16px", background: "#0f172a", borderBottom: "1px solid #0b1120" }}>
          <span style={{ fontSize: 10, color: "#334155" }}>session: </span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#475569" }}>{sessionId}</span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: 16 }}>
        {step === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>Start a support session to begin AI-assisted help.</div>
            <button
              onClick={startSession}
              disabled={loading}
              style={{ padding: "11px 24px", borderRadius: 10, border: 0, background: loading ? "#1e293b" : "#2563eb", color: "white", cursor: loading ? "default" : "pointer", fontWeight: 600, fontSize: 14 }}
            >
              {loading ? "Starting…" : "Start Support Session"}
            </button>
          </div>
        )}

        {step === 1 && <ConsentPrompt onAccept={acceptConsent} />}

        {step === 2 && (
          <>
            <TranscriptPanel messages={messages} />

            {/* Policy badge */}
            {lastPolicy && (
              <div style={{ margin: "10px 0", padding: "8px 12px", background: "#0f172a", borderRadius: 8, border: `1px solid ${ACTION_COLORS[lastPolicy.action] ?? "#334155"}33`, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: ACTION_COLORS[lastPolicy.action], background: ACTION_COLORS[lastPolicy.action] + "22", padding: "2px 7px", borderRadius: 4 }}>{lastPolicy.action}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: SLA_COLORS[lastPolicy.slaClass], background: SLA_COLORS[lastPolicy.slaClass] + "22", padding: "2px 7px", borderRadius: 4 }}>{lastPolicy.slaClass}</span>
                <span style={{ fontSize: 11, color: "#64748b", flex: 1 }}>{lastPolicy.queueClass}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Describe your issue… try 'breach', 'refund', or 'vip'"
                disabled={loading}
                style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #1e293b", background: "#0f172a", color: "white", fontSize: 13, outline: "none" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{ padding: "10px 14px", borderRadius: 8, border: 0, background: loading || !input.trim() ? "#1e293b" : "#059669", color: "white", cursor: loading || !input.trim() ? "default" : "pointer", fontWeight: 600, fontSize: 13 }}
              >
                {loading ? "…" : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
