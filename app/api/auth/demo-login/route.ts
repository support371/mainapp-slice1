import { NextResponse } from "next/server";
import { DEMO_USERS, ensureSeededUsers, setSessionCookie } from "@/lib/auth/demo-auth";

export async function POST(request: Request) {
  try {
    ensureSeededUsers();
    const { profile = "approved_vip" } = await request.json();
    const user = DEMO_USERS[profile as keyof typeof DEMO_USERS];
    if (!user) return NextResponse.json({ error: "Unknown demo profile." }, { status: 400 });

    if (user.approval_state === "APPROVED") {
      await setSessionCookie(user.user_id);
      return NextResponse.json({ ok: true, redirect_target: "/portal/dashboard", user });
    }

    return NextResponse.json({ ok: true, redirect_target: "/status", user });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed." }, { status: 400 });
  }
}
