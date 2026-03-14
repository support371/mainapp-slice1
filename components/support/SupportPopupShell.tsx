"use client";

import { useState } from "react";
import { ConsentPrompt } from "@/components/support/ConsentPrompt";
import { TranscriptPanel } from "@/components/support/TranscriptPanel";

type Message = { role: string; content: string };
type PolicyDecision = { action: string; queue: string; reason: string; suggested_reply: string };
type OpsHandoff = { handoff_id: string; queue_class: string; sla_class: string; escalation_reason: string; urgency: string; transcript_summary: string };

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
  const [opsPayload, setOpsPayload] = useState<OpsHandoff | null>(null);
  const [status, setStatus] = useState("Ready");

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
    setStatus(`Session ${data.session_id} created`);
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
    setStatus("Consent accepted — ready for messages");
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

    if (policy.action === "ESCALATE_HUMAN") {
      const escRes = await fetch("/api/support/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, escalation_reason: policy.reason, urgency: "HIGH" }),
      });
      const escData = await escRes.json();
      setOpsPayload(escData.ops_handoff);
      setStatus("Escalated to internal operations");
    } else {
      setStatus(`AI response via ${policy.queue}`);
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: data.assistant_message },
    ]);
    setLoading(false);
  }

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 24, width: 460, maxWidth: "calc(100vw - 20px)",
      background: "#020617", border: "1px solid #334155", borderRadius: 18,
      boxShadow: "0 24px 60px rgba(0,0,0,0.6)", zIndex: 1000, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #0f172a", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0b1220" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <strong style={{ fontSize: 14 }}>AI Concierge Support</strong>
        </div>
        <button onClick={onClose} style={{ background: "transparent", color: "#64748b", border: 0, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", padding: "10px 16px", gap: 4, borderBottom: "1px solid #0a0f1a" }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, flexShrink: 0,
              background: i < step ? "#1d4ed8" : i === step ? "#2563eb" : "#1e293b",
              color: i <= step ? "white" : "#475569",
            }}>{i < step ? "✓" : i + 1}</div>
            <span style={{ fontSize: 11, color: i === step ? "#e2e8f0" : i < step ? "#64748b" : "#334155", fontWeight: i === step ? 600 : 400 }}>{label}</span>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? "#1d4ed8" : "#1e293b" }} />}
          </div>
        ))}
      </div>

      {/* Session ID */}
      {sessionId && (
        <div style={{ padding: "5px 16px", background: "#070d18", borderBottom: "1px solid #0a0f1a" }}>
          <span style={{ fontSize: 10, color: "#334155" }}>session: </span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "#475569" }}>{sessionId}</span>
        </div>
      )}

      {/* Body */}
      <div style={{ padding: 16 }}>
        {step === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Start a support session to begin AI-assisted help.</p>
            <button className="btn btn-primary" onClick={startSession} disabled={loading}>
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
              <div style={{ margin: "10px 0", padding: "8px 12px", background: "#0f172a", borderRadius: 8, border: `1px solid ${(ACTION_COLORS[lastPolicy.action] ?? "#334155") + "33"}`, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ background: (ACTION_COLORS[lastPolicy.action] ?? "#334155") + "22", color: ACTION_COLORS[lastPolicy.action] ?? "#94a3b8", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 700 }}>{lastPolicy.action}</span>
                <span style={{ fontSize: 11, color: "#64748b", flex: 1 }}>{lastPolicy.queue}</span>
              </div>
            )}

            <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
              <textarea
                className="msg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your issue… try 'breach', 'refund', or 'vip'"
                disabled={loading}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span className="muted" style={{ fontSize: 11 }}>Security or billing language triggers escalation.</span>
                <button className="btn btn-success" onClick={sendMessage} disabled={loading || !input.trim()}>
                  {loading ? "Sending…" : "Send"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Ops handoff card */}
        {opsPayload && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "#1e293b", border: "1px solid #475569" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>⚠ Internal Handoff Ready</span>
            </div>
            <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
              Queue: <strong style={{ color: "#e2e8f0" }}>{opsPayload.queue_class}</strong> · SLA: <strong style={{ color: SLA_COLORS[opsPayload.sla_class] ?? "#e2e8f0" }}>{opsPayload.sla_class}</strong> · Urgency: {opsPayload.urgency}
            </div>
            <div className="code" style={{ maxHeight: 160, overflow: "auto" }}>{JSON.stringify(opsPayload, null, 2)}</div>
          </div>
        )}

        <div className="muted" style={{ marginTop: 10, fontSize: 11 }}>{status}</div>
      </div>
    </div>
  );
}
