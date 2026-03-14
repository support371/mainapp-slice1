import {
  createSupportSessionSchema,
  recordConsentSchema,
  supportMessageSchema,
  type CreateSupportSessionInput,
  type RecordConsentInput,
  type SupportMessageInput,
} from "@/lib/contracts/support";
import { db } from "@/lib/services/fake-db";
import { makeId } from "@/lib/utils/id";

export function createSupportSession(input: CreateSupportSessionInput) {
  const parsed = createSupportSessionSchema.parse(input);
  const session_id = makeId("ssn");
  const session = {
    ...parsed,
    session_id,
    state: "SESSION_INITIATED",
    created_at: new Date().toISOString(),
  };
  db.sessions.set(session_id, session);
  db.messages.set(session_id, []);
  return session;
}

export function recordConsent(input: RecordConsentInput) {
  const parsed = recordConsentSchema.parse(input);
  const session = db.sessions.get(parsed.session_id);
  if (!session) throw new Error("Session not found.");
  session.consent_status = parsed.granted ? "ACCEPTED" : "DECLINED";
  session.state = parsed.granted ? "CONSENT_ACCEPTED" : "CLOSED";
  db.sessions.set(parsed.session_id, session);
  return session;
}

export function appendMessage(input: SupportMessageInput) {
  const parsed = supportMessageSchema.parse(input);
  const session = db.sessions.get(parsed.session_id);
  if (!session) throw new Error("Session not found.");
  if (session.consent_status !== "ACCEPTED") throw new Error("Consent required before message processing.");
  const message = {
    ...parsed,
    message_id: parsed.message_id ?? makeId("msg"),
    created_at: parsed.created_at ?? new Date().toISOString(),
  };
  const current = db.messages.get(parsed.session_id) ?? [];
  current.push(message);
  db.messages.set(parsed.session_id, current);
  session.state = session.state === "CONSENT_ACCEPTED" ? "INTENT_CLASSIFIED" : session.state;
  db.sessions.set(parsed.session_id, session);
  return { session, message };
}

export function getSession(sessionId: string) {
  return {
    session: db.sessions.get(sessionId) ?? null,
    messages: db.messages.get(sessionId) ?? [],
  };
}
