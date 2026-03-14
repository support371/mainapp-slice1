import { NextResponse } from "next/server";
import { appendMessage } from "@/lib/services/support-session-service";
import { decideSupportPolicy } from "@/lib/services/policy-engine-service";
import { db } from "@/lib/services/fake-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session, message } = appendMessage(body);
    const policy = decideSupportPolicy({ content: message.content, membership_tier: session.membership_tier });

    session.state = policy.action === "ALLOW_AI" ? "AI_ACTIVE" : "HUMAN_ESCALATION_PENDING";
    session.queue_candidate = policy.queue;
    db.sessions.set(session.session_id, session);

    return NextResponse.json({
      session_id: session.session_id,
      policy,
      assistant_message: policy.suggested_reply,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Message processing failed." }, { status: 400 });
  }
}
