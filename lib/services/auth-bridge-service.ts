import { bridgeTokenPayloadSchema, type BridgeTokenPayload } from "@/lib/contracts/support";
import { db } from "@/lib/services/fake-db";

export function consumeBridgeToken(payload: unknown): BridgeTokenPayload {
  const parsed = bridgeTokenPayloadSchema.parse(payload);
  if (parsed.approval_state !== "APPROVED") {
    throw new Error("Approval state invalid for product entry.");
  }
  const expiresAt = new Date(parsed.expires_at).getTime();
  if (Number.isNaN(expiresAt) || expiresAt < Date.now()) {
    throw new Error("Bridge token expired.");
  }
  if (db.bridgeNonces.has(parsed.session_nonce)) {
    throw new Error("Bridge token replay detected.");
  }
  db.bridgeNonces.add(parsed.session_nonce);
  return parsed;
}
