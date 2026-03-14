import type { QueueClass } from "@/lib/services/policy-types";

export type PolicyDecision = {
  action: "ALLOW_AI" | "ESCALATE_HUMAN" | "RESTRICTED";
  queueClass: QueueClass;
  reason: string;
  slaClass: "P4" | "P3" | "P2" | "P1";
};

const INCIDENT_PATTERNS = ["breach", "compromise", "hack", "stolen", "wallet", "cyber", "incident"];
const BILLING_PATTERNS = ["refund", "invoice", "billing", "charge", "payment"];
const VIP_PATTERNS = ["vip", "priority"];

export function classifySupportIntent(text: string, membershipTier: string): PolicyDecision {
  const lower = text.toLowerCase();
  if (INCIDENT_PATTERNS.some((word) => lower.includes(word))) {
    return {
      action: "ESCALATE_HUMAN",
      queueClass: "CYBERSECURITY_INCIDENT",
      reason: "security_incident_detected",
      slaClass: "P1",
    };
  }
  if (BILLING_PATTERNS.some((word) => lower.includes(word))) {
    return {
      action: "ESCALATE_HUMAN",
      queueClass: "BILLING_ACCOUNTS",
      reason: "billing_review_required",
      slaClass: "P2",
    };
  }
  if (membershipTier === "VIP" || VIP_PATTERNS.some((word) => lower.includes(word))) {
    return {
      action: "ALLOW_AI",
      queueClass: "VIP_CONCIERGE",
      reason: "vip_priority_route",
      slaClass: "P2",
    };
  }
  return {
    action: "ALLOW_AI",
    queueClass: "GENERAL_MEMBER_SUPPORT",
    reason: "standard_ai_first_flow",
    slaClass: "P4",
  };
}
