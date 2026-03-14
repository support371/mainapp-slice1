import { SupportLauncher } from "@/components/support/SupportLauncher";

export default function DashboardPage() {
  return (
    <main style={{ padding: 32 }}>
      <div style={{ display: "grid", gap: 20, maxWidth: 980 }}>
        <section style={{ background: "#111827", padding: 24, borderRadius: 16, border: "1px solid #374151" }}>
          <h1 style={{ marginTop: 0 }}>Mainapp Portal Dashboard</h1>
          <p>This scaffold assumes the user is approved, authenticated, and entering from the Vercel-to-Mainapp bridge.</p>
        </section>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          <div style={{ background: "#111827", padding: 18, borderRadius: 16, border: "1px solid #374151" }}>
            <h3>Membership</h3>
            <p>VIP</p>
          </div>
          <div style={{ background: "#111827", padding: 18, borderRadius: 16, border: "1px solid #374151" }}>
            <h3>Approval State</h3>
            <p>APPROVED</p>
          </div>
          <div style={{ background: "#111827", padding: 18, borderRadius: 16, border: "1px solid #374151" }}>
            <h3>Next Step</h3>
            <p>Launch support, access services, or continue onboarding prompts.</p>
          </div>
        </section>
        <section style={{ background: "#111827", padding: 24, borderRadius: 16, border: "1px solid #374151" }}>
          <h2>Support</h2>
          <p>Slice 1 proves authenticated support-session startup, consent capture, message ingest, policy routing, and escalation handoff.</p>
          <SupportLauncher />
        </section>
      </div>
    </main>
  );
}
