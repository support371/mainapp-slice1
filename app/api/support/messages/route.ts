import { NextResponse } from "next/server";
import { appendMessage } from "@/lib/services/support-session-service";
import { classifySupportIntent } from "@/lib/services/policy-engine-service";
import { createOpsHandoff } from "@/lib/services/ops-handoff-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session, message } = appendMessage(body);
    const policy = classifySupportIntent(message.content, session.membership_tier);

    if (policy.action === "ESCALATE_HUMAN") {
      const handoff = createOpsHandoff({
        session_id: session.session_id,
        user_id: session.user_id,
        membership_tier: session.membership_tier as "MEMBER" | "PAID" | "VIP" | "ADMIN",
        queue_class: policy.queueClass,
        intent_classification: policy.reason,
        escalation_reason: policy.reason,
        urgency: "HIGH",
        sla_class: policy.slaClass,
        transcript_summary: message.content,
        ticket_id: null,
        booking_id: null,
        artifact_links: [],
      });
      return NextResponse.json({
        session_id: session.session_id,
        policy,
        assistant_message: "I am escalating this to the appropriate internal team now.",
        handoff,
      });
    }

    return NextResponse.json({
      session_id: session.session_id,
      policy,
      assistant_message: "I have captured your request and can continue helping from here.",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Message processing failed." }, { status: 400 });
  }
}
