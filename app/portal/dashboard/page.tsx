import Link from "next/link";
import { SupportLauncher } from "@/components/support/SupportLauncher";
import { requireApprovedUser } from "@/lib/auth/demo-auth";

const STEPS = [
  { num: "01", title: "Bridge Auth", desc: "User arrives via signed bridge token. Approval state and membership are resolved before entry." },
  { num: "02", title: "Session Init", desc: "POST /api/support/sessions creates a typed session scoped to the user's membership tier." },
  { num: "03", title: "Consent Capture", desc: "User agrees to session logging and transcript retention before AI assistance begins." },
  { num: "04", title: "Message Ingest", desc: "POST /api/support/messages receives the user message and routes it through the policy engine." },
  { num: "05", title: "Policy Routing", desc: "Intent is classified and a queue class is assigned. Security keywords trigger immediate P1 escalation." },
  { num: "06", title: "Escalation Handoff", desc: "High-priority decisions generate a structured ops payload, ready for Jira or internal tooling." },
];

const QUEUES = [
  { label: "CYBERSECURITY_INCIDENT", sla: "P1", color: "#ef4444", keywords: "breach, hack, compromise, cyber, stolen" },
  { label: "BILLING_ACCOUNTS", sla: "P2", color: "#f97316", keywords: "refund, invoice, billing, charge, payment" },
  { label: "VIP_CONCIERGE", sla: "P2", color: "#a855f7", keywords: "vip, priority (or VIP tier)" },
  { label: "GENERAL_MEMBER_SUPPORT", sla: "P4", color: "#22c55e", keywords: "all other messages → AI response" },
];

const ENDPOINTS = [
  { method: "POST", path: "/api/support/sessions", desc: "Create support session" },
  { method: "POST", path: "/api/support/consent", desc: "Record user consent" },
  { method: "POST", path: "/api/support/messages", desc: "Ingest message + AI reply & policy" },
  { method: "POST", path: "/api/support/escalate", desc: "Trigger escalation + ops handoff" },
  { method: "POST", path: "/api/auth/demo-login", desc: "Demo profile login" },
  { method: "POST", path: "/api/auth/logout", desc: "Clear session" },
  { method: "GET", path: "/api/auth/session", desc: "Read current session user" },
];

function Metric({ title, value, accent }: { title: string; value: string; accent?: string }) {
  return (
    <div className="card" style={{ padding: "14px 16px" }}>
      <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: accent ?? "#e2e8f0" }}>{value}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireApprovedUser();

  return (
    <main className="container">
      {/* Hero */}
      <div className="panel hero" style={{ marginBottom: 20 }}>
        <div className="kicker">Authenticated product entry</div>
        <h1 style={{ marginTop: 10, marginBottom: 8 }}>Portal dashboard</h1>
        <p className="muted" style={{ marginBottom: 12 }}>
          Locked landing route after approval and bridge handoff. Welcome back, <strong>{user.email}</strong>.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="tag">{user.membership_tier}</span>
          <span className="tag">{user.role}</span>
          <span className="tag">{user.profile_completion_state === "PARTIAL" ? "⚠ Profile partial" : "✓ Profile complete"}</span>
          <span className="tag">{user.approval_state}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <Metric title="Approval State" value={user.approval_state} accent="#22c55e" />
        <Metric title="Membership" value={user.membership_tier} accent="#a855f7" />
        <Metric title="Role" value={user.role} accent="#60a5fa" />
        <Metric title="Support Route" value="AI-first" accent="#f97316" />
      </div>

      {/* How It Works */}
      <div className="panel hero" style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>How It Works</h2>
        <div className="grid grid-3">
          {STEPS.map((s) => (
            <div key={s.num} style={{ background: "#0f172a", borderRadius: 10, padding: 14, border: "1px solid #1e293b" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#3b82f6", letterSpacing: "0.12em", marginBottom: 6 }}>STEP {s.num}</div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 5 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy + Endpoints */}
      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>Policy Engine — Routing Table</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {QUEUES.map((q) => (
              <div key={q.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                <span style={{ background: q.color + "22", color: q.color, borderRadius: 5, padding: "3px 8px", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{q.sla}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{q.label}</div>
                  <div style={{ fontSize: 11, color: "#4b5563" }}>triggers: {q.keywords}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>API Endpoints</h2>
          <div style={{ display: "grid", gap: 7 }}>
            {ENDPOINTS.map((e) => (
              <div key={e.path} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                <span className="badge badge-blue" style={{ flexShrink: 0 }}>{e.method}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontFamily: "monospace", color: "#c084fc", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.path}</div>
                  <div style={{ fontSize: 11, color: "#4b5563" }}>{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support launcher */}
      <div className="panel hero" style={{ borderColor: "#1d4ed8" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700 }}>Try the Full Support Flow</h2>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              Launch the chat → start session → accept consent → send a message. Try{" "}
              <code>breach</code>, <code>refund</code>, or <code>vip</code> to trigger escalation routing.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/portal/support" className="btn btn-secondary" style={{ fontSize: 13 }}>Support Center</Link>
            <SupportLauncher />
          </div>
        </div>
      </div>
    </main>
  );
}
