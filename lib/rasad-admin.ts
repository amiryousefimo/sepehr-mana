import {createHash, createHmac, randomBytes, timingSafeEqual} from "node:crypto";
import {cookies} from "next/headers";
import type {NextResponse} from "next/server";

export const rasadAdminName = "admin";
const adminCookie = "rasad_admin";
const lifetime = 8 * 60 * 60;

export function secureEqual(left: string, right: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(left), digest(right));
}

export function checkAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !process.env.ADMIN_SECRET) return "unavailable";
  return secureEqual(password, expected) ? "accepted" : "wrong_password";
}

function signingKey(payload: string) {
  const secret = process.env.ADMIN_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  return secret && password
    ? createHmac("sha256", secret).update("rasad-admin-v1:").update(password).update(":").update(payload).digest("base64url")
    : null;
}

export function siteAdminSession() {
  const value = cookies().get("admin_session")?.value;
  const secret = process.env.ADMIN_SECRET;
  return !!value && !!secret && secureEqual(value, secret);
}

export function rasadAdminSession() {
  if (siteAdminSession()) return true;
  const value = cookies().get(adminCookie)?.value;
  if (!value) return false;
  const [expiry, nonce, signature] = value.split(".");
  if (!/^\d{10}$/.test(expiry) || Number(expiry) <= Date.now() / 1000 ||
      !/^[A-Za-z0-9_-]{22}$/.test(nonce ?? "") || !/^[A-Za-z0-9_-]{43}$/.test(signature ?? "") ||
      value !== `${expiry}.${nonce}.${signature}`) return false;
  const expected = signingKey(`${expiry}.${nonce}`);
  return !!expected && secureEqual(signature, expected);
}

export function setRasadAdminSession(response: NextResponse, secure: boolean, create: boolean) {
  let token = "";
  if (create) {
    const payload = `${Math.floor(Date.now() / 1000) + lifetime}.${randomBytes(16).toString("base64url")}`;
    const signature = signingKey(payload);
    if (!signature) return false;
    token = payload + "." + signature;
  }
  response.cookies.set(adminCookie, token, {
    httpOnly: true, secure, sameSite: "strict", path: "/dashboard_2", maxAge: create ? lifetime : 0
  });
  return true;
}
