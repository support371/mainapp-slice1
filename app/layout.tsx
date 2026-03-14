import type { ReactNode } from "react";
import "./globals.css";
import { AppNav } from "@/components/layouts/AppNav";

export const metadata = {
  title: "GEM Mainapp",
  description: "Authenticated portal, AI concierge support, and escalation routing.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppNav />
        {children}
      </body>
    </html>
  );
}
