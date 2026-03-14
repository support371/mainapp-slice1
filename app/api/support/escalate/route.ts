import { NextResponse } from "next/server";
import { buildOpsHandoff } from "@/lib/services/ops-handoff-service";
import { createEscalation } from "@/lib/services/support-session-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const escalation = createEscalation(body);
    const ops_handoff = buildOpsHandoff(body.session_id, body.escalation_reason, body.urgency ?? "MEDIUM");
    return NextResponse.json({ escalation, ops_handoff }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Escalation failed." }, { status: 400 });
  }
}
