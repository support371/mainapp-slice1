import { NextResponse } from "next/server";
import { createOpsHandoff } from "@/lib/services/ops-handoff-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const handoff = createOpsHandoff(body);
    return NextResponse.json(handoff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Escalation failed." }, { status: 400 });
  }
}
