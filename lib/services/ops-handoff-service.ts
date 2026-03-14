import { escalationRequestSchema, type EscalationRequest } from "@/lib/contracts/support";
import { db } from "@/lib/services/fake-db";
import { makeId } from "@/lib/utils/id";

export function createOpsHandoff(input: EscalationRequest) {
  const parsed = escalationRequestSchema.parse(input);
  db.escalations.push(parsed);
  return {
    handoff_id: makeId("ops"),
    event: "ops_handoff_created",
    ...parsed,
    created_at: new Date().toISOString(),
  };
}
