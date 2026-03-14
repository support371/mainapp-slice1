"use client";

import { useState } from "react";
import { SupportPopupShell } from "@/components/support/SupportPopupShell";

export function SupportLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Open AI Concierge
      </button>
      {open ? <SupportPopupShell onClose={() => setOpen(false)} /> : null}
    </>
  );
}
