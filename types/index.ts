export type ApprovalState =
  | "UNREGISTERED"
  | "REGISTERED_PENDING_KYC"
  | "KYC_IN_PROGRESS"
  | "KYC_SUBMITTED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "REQUIRES_REVIEW";

export type MembershipTier = "MEMBER" | "PAID" | "VIP" | "ADMIN";

export type SupportMode = "AI_FIRST" | "HUMAN_ASSISTED" | "VIP_PRIORITY" | "ESCALATE_ONLY";

export type QueueClass =
  | "GENERAL_MEMBER_SUPPORT"
  | "PREMIUM_MEMBER_SUPPORT"
  | "VIP_CONCIERGE"
  | "BILLING_ACCOUNTS"
  | "TECHNICAL_SUPPORT"
  | "CYBERSECURITY_INCIDENT"
  | "CONSULTATION_SCHEDULING"
  | "ADMIN_ESCALATIONS";

export type UserContext = {
  user_id: string;
  email: string;
  approval_state: ApprovalState;
  membership_tier: MembershipTier;
  role: "member" | "admin" | "support";
  profile_completion_state: "COMPLETE" | "PARTIAL";
};
