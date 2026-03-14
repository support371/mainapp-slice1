"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/portal/dashboard";
  const [status, setStatus] = useState("Choose a demo profile to enter the portal.");
  const [loading, setLoading] = useState(false);

  async function login(profile: string) {
    setLoading(true);
    setStatus("Authenticating…");
    const res = await fetch("/api/auth/demo-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Login failed.");
      setLoading(false);
      return;
    }
    setStatus(`Logged in as ${data.user.email}. Redirecting…`);
    router.push(data.redirect_target === "/portal/dashboard" ? next : data.redirect_target);
    router.refresh();
  }

  return (
    <main className="container">
      <div className="panel hero" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="kicker">Demo access</div>
        <h1 style={{ marginTop: 10, marginBottom: 8 }}>Portal sign in</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          Choose a profile below to simulate an approved user, a paid member, or a pending review case.
        </p>

        <div className="grid grid-3" style={{ marginBottom: 20 }}>
          <div className="card">
            <span className="badge badge-purple" style={{ marginBottom: 10, display: "inline-block" }}>VIP</span>
            <h3 style={{ marginTop: 0, marginBottom: 6 }}>Approved VIP</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
              Full dashboard access with VIP priority queue in all support routing decisions.
            </p>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => login("approved_vip")} disabled={loading}>
              Enter as VIP
            </button>
          </div>
          <div className="card">
            <span className="badge badge-green" style={{ marginBottom: 10, display: "inline-block" }}>PAID</span>
            <h3 style={{ marginTop: 0, marginBottom: 6 }}>Approved Paid</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
              Standard approved product entry with a complete profile and member-tier support.
            </p>
            <button className="btn btn-success" style={{ width: "100%" }} onClick={() => login("approved_paid")} disabled={loading}>
              Enter as Paid
            </button>
          </div>
          <div className="card">
            <span className="badge badge-orange" style={{ marginBottom: 10, display: "inline-block" }}>PENDING</span>
            <h3 style={{ marginTop: 0, marginBottom: 6 }}>Pending Review</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
              Simulates a user at KYC/approval hold. Will be routed to the status gate, not the dashboard.
            </p>
            <button className="btn btn-warn" style={{ width: "100%" }} onClick={() => login("pending_review")} disabled={loading}>
              Open Review Status
            </button>
          </div>
        </div>

        <div className="card">
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            {loading ? <span style={{ color: "#60a5fa" }}>⟳ {status}</span> : status}
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="container"><p className="muted">Loading…</p></main>}>
      <LoginContent />
    </Suspense>
  );
}
