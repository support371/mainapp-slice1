import { NextResponse } from "next/server";
import { recordConsent } from "@/lib/services/support-session-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = recordConsent(body);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Consent update failed." }, { status: 400 });
  }
}
