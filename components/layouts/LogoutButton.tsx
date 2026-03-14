"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="btn btn-secondary" onClick={logout} style={{ padding: "7px 14px", fontSize: 13 }}>
      Logout
    </button>
  );
}
