import { NextResponse } from "next/server";
import { consumeBridgeToken } from "@/lib/services/auth-bridge-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = consumeBridgeToken(body);
    return NextResponse.json({
      ok: true,
      redirect_target: payload.redirect_target,
      user: {
        user_id: payload.user_id,
        email: payload.email,
        membership_tier: payload.membership_tier,
        role: payload.role,
        profile_completion_state: payload.profile_completion_state,
      },
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Bridge consume failed." }, { status: 400 });
  }
}
