import type { BridgeTokenPayload } from "@/lib/contracts/support";

const globalStore = globalThis as typeof globalThis & {
  __mainappStore?: {
    users: Map<string, BridgeTokenPayload>;
    sessions: Map<string, any>;
    messages: Map<string, any[]>;
    escalations: Map<string, any[]>;
    tickets: Map<string, any[]>;
    bookings: Map<string, any[]>;
  };
};

if (!globalStore.__mainappStore) {
  globalStore.__mainappStore = {
    users: new Map(),
    sessions: new Map(),
    messages: new Map(),
    escalations: new Map(),
    tickets: new Map(),
    bookings: new Map(),
  };
}

export const db = globalStore.__mainappStore;
