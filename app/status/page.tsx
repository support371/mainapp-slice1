import Link from "next/link";
import { getSessionUser } from "@/lib/auth/demo-auth";

export default async function StatusPage() {
  const user = await getSessionUser();

  return (
    <main className="container">
      <div className="panel hero" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="kicker">Approval control gate</div>
        <h1 style={{ marginTop: 10, marginBottom: 8 }}>Onboarding and review status</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          This page is the controlled fallback for users who are not yet eligible for protected portal routes.
        </p>

        <div className="grid grid-2" style={{ marginBottom: 20 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Current session state</h3>
            {user ? (
              <div style={{ display: "grid", gap: 10 }}>
                {[
                  { label: "Email", value: user.email },
                  { label: "Approval", value: user.approval_state },
                  { label: "KYC Status", value: user.kyc_status },
                  { label: "Membership", value: user.membership_tier },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #1e293b", paddingBottom: 8 }}>
                    <span className="muted">{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No active session detected.</p>
            )}
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Allowed next steps</h3>
            <ul className="muted" style={{ fontSize: 13 }}>
              <li>Complete or correct your onboarding data.</li>
              <li>Wait for a manual review decision from the team.</li>
              <li>Contact support only through approved review channels.</li>
              <li>Check back once you receive an approval notification.</li>
            </ul>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn btn-secondary" href="/login">Back to Login</Link>
          {user?.approval_state === "APPROVED" && (
            <Link className="btn btn-primary" href="/portal/dashboard">Open Dashboard</Link>
          )}
        </div>
      </div>
    </main>
  );
}
