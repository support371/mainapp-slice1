import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/services/fake-db";
import type { BridgeTokenPayload } from "@/lib/contracts/support";

export const DEMO_USERS: Record<string, BridgeTokenPayload> = {
  approved_vip: {
    user_id: "demo-vip",
    email: "vip@example.com",
    approval_state: "APPROVED",
    kyc_status: "APPROVED",
    membership_tier: "VIP",
    role: "member",
    redirect_target: "/portal/dashboard",
    profile_completion_state: "PARTIAL",
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    session_nonce: "nonce-approved-vip-001",
  },
  approved_paid: {
    user_id: "demo-paid",
    email: "paid@example.com",
    approval_state: "APPROVED",
    kyc_status: "APPROVED",
    membership_tier: "PAID",
    role: "member",
    redirect_target: "/portal/dashboard",
    profile_completion_state: "COMPLETE",
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    session_nonce: "nonce-approved-paid-001",
  },
  pending_review: {
    user_id: "demo-pending",
    email: "pending@example.com",
    approval_state: "PENDING_APPROVAL",
    kyc_status: "SUBMITTED",
    membership_tier: "MEMBER",
    role: "member",
    redirect_target: "/status",
    profile_completion_state: "PARTIAL",
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    session_nonce: "nonce-pending-001",
  },
};

export function ensureSeededUsers() {
  Object.values(DEMO_USERS).forEach((user) => {
    if (!db.users.get(user.user_id)) db.users.set(user.user_id, user);
  });
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("mainapp_session", userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false,
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("mainapp_session");
}

export async function getSessionUser(): Promise<BridgeTokenPayload | null> {
  ensureSeededUsers();
  const cookieStore = await cookies();
  const userId = cookieStore.get("mainapp_session")?.value;
  if (!userId) return null;
  return db.users.get(userId) ?? null;
}

export async function requireApprovedUser(): Promise<BridgeTokenPayload> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.approval_state !== "APPROVED") redirect("/status");
  return user;
}
