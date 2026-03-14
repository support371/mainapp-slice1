import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mainapp Slice 1",
  description: "Authenticated dashboard and support-session scaffold",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, Arial, sans-serif", background: "#0b1220", color: "#e5e7eb" }}>
        {children}
      </body>
    </html>
  );
}
