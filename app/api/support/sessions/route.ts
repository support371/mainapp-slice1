import { NextResponse } from "next/server";
import { createSupportSession } from "@/lib/services/support-session-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = createSupportSession(body);
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Session create failed." }, { status: 400 });
  }
}
