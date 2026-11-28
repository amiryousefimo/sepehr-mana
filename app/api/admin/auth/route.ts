import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {checkAdminPassword, rasadAdminName, siteAdminSession} from "@/lib/rasad-admin";
import {readAuthBody} from "@/lib/rasad-auth-forms";
import {recordLogin, type AuditReason, type AuditResult} from "@/lib/rasad-login-audit";
import {configuredOrigin, noStore} from "@/lib/rasad-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const audit = (result: AuditResult, reason: AuditReason) => recordLogin(request, "site-admin", result, reason,
    reason === "invalid_origin" || reason === "invalid_form" ? null : rasadAdminName);
  const origin = configuredOrigin(request) || (
    request.headers.get("origin") && process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") === request.headers.get("origin")
      ? request.headers.get("origin") : null
  );
  const fail = async (status: number, error: string, result: AuditResult, reason: AuditReason) => {
    const ref = await audit(result, reason);
    return NextResponse.json({error, ref}, {status, headers: {...noStore, "X-Rasad-Event": ref}});
  };
  if (!origin) return fail(403, "Invalid request origin.", "blocked", "invalid_origin");
  const parsed = await readAuthBody(request, "application/json");
  if (parsed.status !== 200) return fail(parsed.status, "Invalid login request.", "blocked", "invalid_form");
  let body: unknown;
  try {body = JSON.parse(parsed.body);}
  catch {return fail(400, "Invalid login request.", "blocked", "invalid_form");}
  if (!body || typeof body !== "object" || !("password" in body) || typeof body.password !== "string") {
    return fail(400, "Invalid login request.", "blocked", "invalid_form");
  }

  const adminSecret = process.env.ADMIN_SECRET;
  const outcome = checkAdminPassword(body.password);

  if (!adminSecret || outcome === "unavailable") {
    return fail(503, "Admin login is not configured.", "unavailable", "server_not_configured");
  }
  if (outcome === "wrong_password") return fail(401, "Invalid password.", "rejected", outcome);

  cookies().set("admin_session", adminSecret, {
    httpOnly: true,
    secure: origin.startsWith("https:"),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  const ref = await audit("accepted", "credentials_verified");
  return NextResponse.json({ok: true}, {headers: {...noStore, "X-Rasad-Event": ref}});
}

export async function DELETE() {
  if (!siteAdminSession()) {
    return NextResponse.json({error: "Unauthorized."}, {status: 401});
  }

  cookies().delete("admin_session");
  return NextResponse.json({ok: true});
}
