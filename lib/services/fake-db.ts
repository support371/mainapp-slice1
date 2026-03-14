import type { EscalationRequest, SupportMessageInput } from "@/lib/contracts/support";

export type StoredSession = {
  session_id: string;
  user_id: string;
  membership_tier: string;
  role: string;
  entry_route: string;
  entry_trigger: string;
  consent_status: "PENDING" | "ACCEPTED" | "DECLINED";
  queue_candidate: string;
  support_mode: string;
  state: string;
  created_at: string;
  profile_completion_state?: string;
};

const globalStore = globalThis as typeof globalThis & {
  __mainappStore?: {
    bridgeNonces: Set<string>;
    sessions: Map<string, StoredSession>;
    messages: Map<string, SupportMessageInput[]>;
    escalations: EscalationRequest[];
    tickets: unknown[];
    bookings: unknown[];
  };
};

if (!globalStore.__mainappStore) {
  globalStore.__mainappStore = {
    bridgeNonces: new Set(),
    sessions: new Map(),
    messages: new Map(),
    escalations: [],
    tickets: [],
    bookings: [],
  };
}

export const db = globalStore.__mainappStore;
