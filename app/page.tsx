import Link from "next/link";
import { getSessionUser } from "@/lib/auth/demo-auth";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <main className="container">
      <div className="panel hero" style={{ marginBottom: 20 }}>
        <div className="kicker">GEM Mainapp · Customer Portal</div>
        <h1 style={{ marginTop: 10, marginBottom: 8 }}>Authenticated AI Concierge Platform</h1>
        <p className="muted" style={{ maxWidth: 680, marginBottom: 20 }}>
          A self-contained, deployable portal with protected routes, bridge-auth intake, AI-first support sessions, policy-based escalation routing, and internal ops handoff.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {user?.approval_state === "APPROVED" ? (
            <Link className="btn btn-primary" href="/portal/dashboard">Open Dashboard</Link>
          ) : (
            <Link className="btn btn-primary" href="/login">Sign In</Link>
          )}
          <Link className="btn btn-secondary" href="/status">Check Status</Link>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="kicker" style={{ marginBottom: 8 }}>Auth flow</div>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Bridge-ready auth</h3>
          <p className="muted" style={{ marginBottom: 12 }}>
            <code>/api/auth/bridge/consume</code> accepts approved-user payloads and can be wired to any frontend later.
          </p>
          <Link href="/login" className="btn btn-secondary" style={{ fontSize: 13, padding: "7px 14px" }}>Demo Login</Link>
        </div>
        <div className="card">
          <div className="kicker" style={{ marginBottom: 8 }}>Route protection</div>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Middleware guards</h3>
          <p className="muted" style={{ marginBottom: 12 }}>
            All <code>/portal/*</code> routes are protected by middleware. Unauthenticated users are redirected to login.
          </p>
          <Link href="/portal/dashboard" className="btn btn-secondary" style={{ fontSize: 13, padding: "7px 14px" }}>Try Protected Route</Link>
        </div>
        <div className="card">
          <div className="kicker" style={{ marginBottom: 8 }}>Support runtime</div>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>AI concierge</h3>
          <p className="muted" style={{ marginBottom: 12 }}>
            Consent capture, message ingest, policy routing, and escalation handoff are all live inside the portal.
          </p>
          <Link href="/portal/support" className="btn btn-secondary" style={{ fontSize: 13, padding: "7px 14px" }}>Support Center</Link>
        </div>
      </div>

      <div className="panel hero">
        <div className="kicker" style={{ marginBottom: 10 }}>Quick start</div>
        <div className="grid grid-3">
          {[
            { step: "01", label: "Sign in", desc: "Choose a demo profile — VIP, Paid, or Pending — to simulate different approval states." },
            { step: "02", label: "Access dashboard", desc: "Once approved, you land on the protected portal dashboard with your session context." },
            { step: "03", label: "Open support", desc: "Launch the AI concierge, accept consent, and send a message to see live policy routing." },
          ].map((s) => (
            <div key={s.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ background: "#1d4ed8", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
