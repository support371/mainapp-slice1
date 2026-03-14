import { z } from "zod";

export const approvalStateSchema = z.enum([
  "UNREGISTERED",
  "REGISTERED_PENDING_KYC",
  "KYC_IN_PROGRESS",
  "KYC_SUBMITTED",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "REQUIRES_REVIEW",
]);

export const membershipTierSchema = z.enum(["MEMBER", "PAID", "VIP", "ADMIN"]);

export const queueClassSchema = z.enum([
  "GENERAL_MEMBER_SUPPORT",
  "PREMIUM_MEMBER_SUPPORT",
  "VIP_CONCIERGE",
  "BILLING_ACCOUNTS",
  "TECHNICAL_SUPPORT",
  "CYBERSECURITY_INCIDENT",
  "CONSULTATION_SCHEDULING",
  "ADMIN_ESCALATIONS",
]);

export const bridgeTokenPayloadSchema = z.object({
  user_id: z.string().min(1),
  email: z.string().email(),
  approval_state: approvalStateSchema,
  kyc_status: z.string().min(1),
  membership_tier: membershipTierSchema,
  role: z.string().min(1),
  redirect_target: z.string().min(1),
  profile_completion_state: z.enum(["COMPLETE", "PARTIAL"]),
  issued_at: z.string(),
  expires_at: z.string(),
  session_nonce: z.string().min(8),
});

export const createSupportSessionSchema = z.object({
  user_id: z.string().min(1),
  membership_tier: membershipTierSchema,
  role: z.string().min(1),
  entry_route: z.string().min(1),
  entry_trigger: z.string().min(1),
  consent_status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  queue_candidate: queueClassSchema,
  support_mode: z.enum(["AI_FIRST", "HUMAN_ASSISTED", "VIP_PRIORITY", "ESCALATE_ONLY"]),
});

export const supportMessageSchema = z.object({
  session_id: z.string().min(1),
  message_id: z.string().optional(),
  role: z.enum(["user", "assistant", "system", "agent"]),
  content: z.string().min(1),
  created_at: z.string().optional(),
});

export const recordConsentSchema = z.object({
  session_id: z.string().min(1),
  granted: z.boolean(),
  captured_at: z.string().optional(),
});

export const escalationSchema = z.object({
  session_id: z.string().min(1),
  escalation_reason: z.string().min(1),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

export type BridgeTokenPayload = z.infer<typeof bridgeTokenPayloadSchema>;
export type BridgeConsumeInput = BridgeTokenPayload;
export type CreateSupportSessionInput = z.infer<typeof createSupportSessionSchema>;
export type SupportMessageInput = z.infer<typeof supportMessageSchema>;
export type RecordConsentInput = z.infer<typeof recordConsentSchema>;
export type EscalationInput = z.infer<typeof escalationSchema>;
