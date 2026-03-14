import Link from "next/link";
import { getSessionUser } from "@/lib/auth/demo-auth";
import { LogoutButton } from "@/components/layouts/LogoutButton";

export async function AppNav() {
  const user = await getSessionUser();

  return (
    <div className="nav">
      <div className="nav-inner">
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>GEM Mainapp</div>
          <div className="muted" style={{ fontSize: 11 }}>AI Concierge Portal</div>
        </div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/portal/dashboard">Dashboard</Link>
          <Link href="/portal/support">Support</Link>
          <Link href="/status">Status</Link>
          {user
            ? <span className="tag" style={{ fontSize: 11 }}>{user.membership_tier} · {user.approval_state}</span>
            : <Link href="/login" className="btn btn-primary" style={{ padding: "7px 14px", fontSize: 13 }}>Login</Link>
          }
          {user ? <LogoutButton /> : null}
        </div>
      </div>
    </div>
  );
}
