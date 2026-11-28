import {createHash, createHmac, timingSafeEqual} from "node:crypto";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {rasadAdminName, rasadAdminSession} from "@/lib/rasad-admin";
import demoAccount from "@/reports/rasad/viewer.json";

const cookieName = "rasad_session";
const lifetime = 8 * 60 * 60;
export const noStore = {"Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow"};

function signature(value: string) {
  const secret = process.env.ADMIN_SECRET;
  return secret ? createHmac("sha256", secret).update("rasad-view-v1:" + value).digest("base64url") : null;
}

function equal(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function account(name: string): string | undefined {
  const configured = process.env.RASAD_VIEWER_ACCOUNTS;
  if (!configured) return name === demoAccount.username ? demoAccount.verifier : undefined;
  try {
    const accounts: unknown = JSON.parse(configured);
    if (!accounts || typeof accounts !== "object" || !Object.hasOwn(accounts, name)) return;
    const verifier = (accounts as Record<string, unknown>)[name];
    if (typeof verifier === "string" && /^[a-f0-9]{32}:[a-f0-9]{64}$/.test(verifier)) return verifier;
  } catch {
    return undefined;
  }
}

export function checkViewer(name: string, password: string) {
  const verifier = /^[a-z0-9][a-z0-9._-]{0,40}$/.test(name) ? account(name) : undefined;
  const [salt, digest] = (verifier ?? demoAccount.verifier).split(":");
  const actual = createHash("sha256").update(salt + ":" + password).digest("hex");
  const match = equal(actual, digest);
  return !verifier ? "unknown_account" : match && /^[a-zA-Z0-9_-]{32,96}$/.test(password) ? "accepted" : "wrong_password";
}

export function rasadIdentity(): {username: string; admin: boolean} | null {
  if (rasadAdminSession()) return {username: rasadAdminName, admin: true};
  const raw = cookies().get(cookieName)?.value;
  const parts = raw?.split("~") ?? [];
  if (parts.length !== 3) return null;
  const [name, expiry, mac] = parts;
  if (!/^\d{10}$/.test(expiry) || Number(expiry) <= Date.now() / 1000) return null;
  const verifier = account(name);
  const expected = verifier && signature(`${name}.${expiry}:${verifier}`);
  return expected && equal(mac, expected) ? {username: name, admin: false} : null;
}

export function viewSession() {
  return !!rasadIdentity();
}

export function configuredOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin === "https://tgsepma.com") return origin;
  if (origin && process.env.RASAD_SITE_ORIGIN && origin === process.env.RASAD_SITE_ORIGIN) return origin;
  if (origin && /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d{1,5})?$/.test(origin) && new URL(origin).host === request.headers.get("host")) return origin;
  return null;
}

export function setViewSession(response: NextResponse, origin: string, name?: string) {
  let token = "";
  if (name) {
    const expiry = Math.floor(Date.now() / 1000) + lifetime;
    const verifier = account(name);
    const mac = verifier && signature(`${name}.${expiry}:${verifier}`);
    if (!mac) return false;
    token = `${name}~${expiry}~${mac}`;
  }
  response.cookies.set(cookieName, token, {
    httpOnly: true, secure: origin.startsWith("https:"), sameSite: "strict", path: "/dashboard_2", maxAge: name ? lifetime : 0
  });
  return true;
}
