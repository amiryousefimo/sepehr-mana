import {NextResponse} from "next/server";
import {checkAdminPassword, rasadAdminName, setRasadAdminSession} from "@/lib/rasad-admin";
import {readAuthBody} from "@/lib/rasad-auth-forms";
import {recordLogin, type AuditReason, type AuditResult} from "@/lib/rasad-login-audit";
import {checkViewer, configuredOrigin, noStore, setViewSession} from "@/lib/rasad-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const audit = (result: AuditResult, reason: AuditReason, account: string | null = null) => recordLogin(request, "rasad", result, reason, account);
  const origin = configuredOrigin(request);
  if (!origin) {
    const ref = await audit("blocked", "invalid_origin");
    return new Response("درخواست از مبدأ نامعتبر است.", {status: 403, headers: {...noStore, "X-Rasad-Event": ref}});
  }
  const parsed = await readAuthBody(request, "application/x-www-form-urlencoded");
  if (parsed.status !== 200) {
    const ref = await audit("blocked", "invalid_form");
    return new Response("فرم ورود نامعتبر است.", {status: parsed.status, headers: {...noStore, "X-Rasad-Event": ref}});
  }
  const fields = new URLSearchParams(parsed.body);
  const redirect = (status?: "invalid" | "unavailable", ref?: string) => {
    const target = new URL("/dashboard_2", origin);
    if (status && ref) {
      target.searchParams.set("status", status);
      target.searchParams.set("ref", ref);
    }
    return NextResponse.redirect(target, {status: 303, headers: {...noStore, ...(ref ? {"X-Rasad-Event": ref} : {})}});
  };
  const secure = origin.startsWith("https:");
  if (fields.get("action") === "logout") {
    const response = redirect();
    setViewSession(response, origin);
    setRasadAdminSession(response, secure, false);
    response.cookies.set("admin_session", "", {path: "/", maxAge: 0, httpOnly: true, secure});
    return response;
  }
  const username = (fields.get("username") ?? "").trim().toLowerCase();
  const password = fields.get("password") ?? "";
  const account = /^[a-z0-9][a-z0-9._-]{0,40}$/.test(username) ? username : null;
  const admin = username === rasadAdminName;
  const outcome = admin ? checkAdminPassword(password) : checkViewer(username, password);
  if (outcome === "unavailable") {
    const ref = await audit("unavailable", "server_not_configured", account);
    return redirect("unavailable", ref);
  }
  if (outcome !== "accepted") {
    const ref = await audit("rejected", outcome, account);
    return redirect("invalid", ref);
  }
  const response = redirect();
  const issued = admin ? setRasadAdminSession(response, secure, true) : setViewSession(response, origin, username);
  if (!issued) {
    const ref = await audit("unavailable", "session_error", account);
    return redirect("unavailable", ref);
  }
  if (admin) setViewSession(response, origin);
  else setRasadAdminSession(response, secure, false);
  const ref = await audit("accepted", "credentials_verified", account);
  response.headers.set("X-Rasad-Event", ref);
  return response;
}
