"use client";

import {Suspense, useState, type FormEvent} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Lock, LogIn} from "lucide-react";
import {site} from "@/lib/site";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({password})
    });

    if (res.ok) {
      router.push(params.get("from") ?? "/admin");
    } else {
      const data = await res.json() as {error?: string};
      setError(data.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          autoComplete="current-password"
        />
      </label>
      {error && <p className="admin-login__error">{error}</p>}
      <button type="submit" disabled={loading}>
        <LogIn aria-hidden="true" />
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__icon">
          <Lock aria-hidden="true" />
        </div>
        <h1>Admin</h1>
        <p>{site.nameEn}</p>
        <Suspense fallback={<p className="admin-login__error">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
