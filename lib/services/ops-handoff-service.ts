import { db } from "@/lib/services/fake-db";
import { makeId } from "@/lib/utils/id";

export function buildOpsHandoff(sessionId: string, escalationReason: string, urgency: string) {
  const session = db.sessions.get(sessionId);
  const messages = db.messages.get(sessionId) ?? [];
  const transcript_summary = messages
    .slice(-4)
    .map((m: any) => `[${m.role}]: ${m.content}`)
    .join("\n");

  const handoff = {
    handoff_id: makeId("ops"),
    session_id: sessionId,
    user_id: session?.user_id ?? "unknown",
    membership_tier: session?.membership_tier ?? "MEMBER",
    queue_class: session?.queue_candidate ?? "GENERAL_MEMBER_SUPPORT",
    sla_class: session?.membership_tier === "VIP" ? "P2" : "P4",
    escalation_reason: escalationReason,
    urgency: urgency ?? "MEDIUM",
    transcript_summary: transcript_summary || escalationReason,
    ticket_id: null,
    booking_id: null,
    artifact_links: [],
    created_at: new Date().toISOString(),
  };

  return handoff;
}
