import type { PolicyDecision } from "@/lib/services/policy-types";

type DecideArgs = {
  content: string;
  membership_tier: string;
};

export function decideSupportPolicy({ content, membership_tier }: DecideArgs): PolicyDecision {
  const text = content.toLowerCase();

  if (
    text.includes("breach") ||
    text.includes("incident") ||
    text.includes("compromise") ||
    text.includes("stolen") ||
    text.includes("hack") ||
    text.includes("cyber") ||
    text.includes("wallet")
  ) {
    return {
      action: "ESCALATE_HUMAN",
      queue: "CYBERSECURITY_INCIDENT",
      reason: "Security-sensitive content detected.",
      suggested_reply: "This issue requires controlled human handling. We are escalating it to the security team now.",
    };
  }

  if (
    text.includes("billing") ||
    text.includes("invoice") ||
    text.includes("refund") ||
    text.includes("charge") ||
    text.includes("payment")
  ) {
    return {
      action: "ESCALATE_HUMAN",
      queue: "BILLING_ACCOUNTS",
      reason: "Billing or account handling requires human review.",
      suggested_reply: "Your billing-related issue is being routed to the accounts team.",
    };
  }

  if (membership_tier === "VIP" || text.includes("vip") || text.includes("priority")) {
    return {
      action: "ALLOW_AI",
      queue: "VIP_CONCIERGE",
      reason: "VIP session with AI-first handling.",
      suggested_reply: "I can help immediately and will preserve your priority context if escalation is needed.",
    };
  }

  return {
    action: "ALLOW_AI",
    queue: "GENERAL_MEMBER_SUPPORT",
    reason: "Standard support flow.",
    suggested_reply: "I have your request and can guide you through the next steps.",
  };
}

export { decideSupportPolicy as classifySupportIntent };
