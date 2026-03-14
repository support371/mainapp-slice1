import { SupportLauncher } from "@/components/support/SupportLauncher";
import { requireApprovedUser } from "@/lib/auth/demo-auth";

const QUEUES = [
  { label: "VIP Concierge", sla: "P2", color: "#a855f7", desc: "Priority routing for VIP members with AI-first handling." },
  { label: "Billing & Accounts", sla: "P2", color: "#f97316", desc: "Invoice, refund, and payment issues routed to human review." },
  { label: "Technical Support", sla: "P3", color: "#60a5fa", desc: "Platform bugs, access issues, and integration failures." },
  { label: "Cybersecurity Incident", sla: "P1", color: "#ef4444", desc: "Breach, compromise, or account theft — immediate escalation." },
];

export default async function SupportPage() {
  const user = await requireApprovedUser();

  return (
    <main className="container">
      <div className="panel hero" style={{ marginBottom: 20 }}>
        <div className="kicker">Dedicated support route</div>
        <h1 style={{ marginTop: 10, marginBottom: 8 }}>Support center</h1>
        <p className="muted">
          Authenticated support access for <strong>{user.email}</strong> · <span className="tag" style={{ fontSize: 11 }}>{user.membership_tier}</span>
        </p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 16 }}>Launch AI Concierge</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
            Start a support session, accept consent, and describe your issue. The AI will respond or escalate based on what you say.
          </p>
          <p className="muted" style={{ fontSize: 12, marginBottom: 16 }}>
            Try keywords: <code>breach</code>, <code>refund</code>, or <code>vip</code> to see routing in action.
          </p>
          <SupportLauncher />
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 16 }}>Queue Design</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {QUEUES.map((q) => (
              <div key={q.label} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                <span style={{ background: q.color + "22", color: q.color, borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{q.sla}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{q.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{q.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
