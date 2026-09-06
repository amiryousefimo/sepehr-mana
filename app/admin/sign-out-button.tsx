"use client";

import {LogOut} from "lucide-react";

export function SignOutButton() {
  async function handleSignOut() {
    await fetch("/api/admin/auth", {method: "DELETE"});
    window.location.href = "/admin/login";
  }

  return (
    <button className="admin__logout" onClick={handleSignOut} type="button">
      <LogOut aria-hidden="true" />
      Sign out
    </button>
  );
}
