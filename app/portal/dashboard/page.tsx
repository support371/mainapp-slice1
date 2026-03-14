import { SupportLauncher } from "@/components/support/SupportLauncher";

const STEPS = [
  { num: "01", title: "Bridge Auth", desc: "User arrives from Vercel via signed bridge token. Approval state and membership are resolved." },
  { num: "02", title: "Session Init", desc: "POST /api/support/sessions creates a typed session scoped to the user's membership tier and role." },
  { num: "03", title: "Consent Capture", desc: "User agrees to session logging and transcript retention before AI assistance begins." },
  { num: "04", title: "Message Ingest", desc: "POST /api/support/messages receives the user message and runs it through the policy engine." },
  { num: "05", title: "Policy Routing", desc: "Intent is classified and a queue class (P1–P4) is assigned. Security keywords trigger immediate P1 escalation." },
  { num: "06", title: "Escalation Handoff", desc: "High-priority decisions generate an EscalationRequest payload ready for Jira or internal ops dashboards." },
];

const QUEUES = [
  { label: "CYBERSECURITY_INCIDENT", sla: "P1", color: "#ef4444", keywords: "breach, hack, compromise, cyber, stolen, wallet" },
  { label: "BILLING_ACCOUNTS", sla: "P2", color: "#f97316", keywords: "refund, invoice, billing, charge, payment" },
  { label: "VIP_CONCIERGE", sla: "P2", color: "#a855f7", keywords: "vip, priority" },
  { label: "GENERAL_MEMBER_SUPPORT", sla: "P4", color: "#22c55e", keywords: "all other messages → AI response" },
];

const ENDPOINTS = [
  { method: "POST", path: "/api/support/sessions", desc: "Create a support session" },
  { method: "POST", path: "/api/support/consent", desc: "Record user consent" },
  { method: "POST", path: "/api/support/messages", desc: "Ingest message + get AI reply & policy decision" },
  { method: "POST", path: "/api/support/escalate", desc: "Trigger manual escalation" },
  { method: "POST", path: "/api/support/tickets", desc: "Create a support ticket" },
  { method: "POST", path: "/api/support/bookings", desc: "Create a concierge booking" },
  { method: "POST", path: "/api/auth/bridge/consume", desc: "Consume auth bridge token" },
];

const card: React.CSSProperties = {
  background: "#111827",
  padding: 20,
  borderRadius: 14,
  border: "1px solid #1f2937",
};

export default function DashboardPage() {
  return (
    <main style={{ padding: "32px 24px", maxWidth: 1040, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ background: "#1d4ed8", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✦</div>
          <span style={{ color: "#818cf8", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Mainapp · Slice 1</span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>AI Concierge Support Portal</h1>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: 14, maxWidth: 620, lineHeight: 1.6 }}>
          End-to-end proof-of-concept: authenticated session startup, consent capture, AI message routing, policy classification, and escalation handoff — built on Next.js 15 + TypeScript + Zod.
        </p>
      </div>

      {/* Status bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Membership Tier", value: "VIP", accent: "#a855f7", bg: "#a855f722" },
          { label: "Approval State", value: "APPROVED", accent: "#22c55e", bg: "#22c55e22" },
          { label: "Support Mode", value: "AI_FIRST", accent: "#60a5fa", bg: "#2563eb22" },
        ].map((c) => (
          <div key={c.label} style={{ ...card, padding: "14px 18px" }}>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{c.label}</div>
            <span style={{ background: c.bg, color: c.accent, borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 700 }}>{c.value}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ ...card, marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.02em" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {STEPS.map((s) => (
            <div key={s.num} style={{ background: "#0f172a", borderRadius: 10, padding: 14, border: "1px solid #1e293b" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#3b82f6", letterSpacing: "0.12em", marginBottom: 6 }}>STEP {s.num}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 5, color: "#f1f5f9" }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy + Endpoints */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={card}>
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>Policy Engine — Routing Table</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {QUEUES.map((q) => (
              <div key={q.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                <span style={{ background: q.color + "22", color: q.color, borderRadius: 5, padding: "3px 8px", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{q.sla}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 3 }}>{q.label}</div>
                  <div style={{ fontSize: 11, color: "#4b5563" }}>triggers: {q.keywords}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>API Endpoints</h2>
          <div style={{ display: "grid", gap: 7 }}>
            {ENDPOINTS.map((e) => (
              <div key={e.path} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                <span style={{ background: "#1d4ed822", color: "#60a5fa", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{e.method}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontFamily: "monospace", color: "#c084fc", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.path}</div>
                  <div style={{ fontSize: 11, color: "#4b5563" }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Try it */}
      <div style={{ ...card, border: "1px solid #1d4ed8", background: "#0c1428" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h2 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700 }}>Try the Full Support Flow</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
              Click the button → start a session → accept consent → send a message. Try{" "}
              <code style={{ background: "#0f172a", padding: "2px 6px", borderRadius: 4, color: "#f472b6", fontSize: 12 }}>breach</code>,{" "}
              <code style={{ background: "#0f172a", padding: "2px 6px", borderRadius: 4, color: "#fb923c", fontSize: 12 }}>refund</code>, or{" "}
              <code style={{ background: "#0f172a", padding: "2px 6px", borderRadius: 4, color: "#c084fc", fontSize: 12 }}>vip</code>{" "}
              to trigger policy routing and see the escalation response.
            </p>
          </div>
          <SupportLauncher />
        </div>
      </div>

    </main>
  );
}
