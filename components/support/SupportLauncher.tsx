"use client";

import { useState } from "react";
import { SupportPopupShell } from "@/components/support/SupportPopupShell";

export function SupportLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: "12px 18px",
          background: "#2563eb",
          color: "white",
          border: 0,
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Open AI Concierge Support
      </button>
      {open ? <SupportPopupShell onClose={() => setOpen(false)} /> : null}
    </>
  );
}
