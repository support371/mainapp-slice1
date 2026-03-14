export type QueueClass =
  | "GENERAL_MEMBER_SUPPORT"
  | "PREMIUM_MEMBER_SUPPORT"
  | "VIP_CONCIERGE"
  | "BILLING_ACCOUNTS"
  | "TECHNICAL_SUPPORT"
  | "CYBERSECURITY_INCIDENT"
  | "CONSULTATION_SCHEDULING"
  | "ADMIN_ESCALATIONS";

export type PolicyDecision = {
  action: "ALLOW_AI" | "ESCALATE_HUMAN" | "RESTRICTED";
  queue: QueueClass;
  reason: string;
  suggested_reply: string;
};
