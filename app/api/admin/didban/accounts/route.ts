import {cookies} from "next/headers";
import {createHmac} from "node:crypto";
import {ensureDidbanWorker} from "@/lib/didban-worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  const headers = {"Cache-Control": "no-store"};
  if (!secret || cookies().get("admin_session")?.value !== secret) {
    return Response.json({error: "Unauthorized"}, {status: 401, headers});
  }
  const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;
  if (request.headers.get("origin") !== origin) {
    return Response.json({error: "Invalid origin"}, {status: 403, headers});
  }
  if (!request.headers.get("content-type")?.startsWith("application/json") || Number(request.headers.get("content-length") || 0) > 4096) {
    return Response.json({error: "Invalid request"}, {status: 400, headers});
  }
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > 4096) return Response.json({error: "Request too large"}, {status: 413, headers});
    let passwords: Record<string, unknown>;
    try {passwords = JSON.parse(body);} catch {return Response.json({error: "Invalid JSON"}, {status: 400, headers});}
    if (!passwords || Array.isArray(passwords) || Object.keys(passwords).sort().join(",") !== "admin,monir.sadat,test" ||
        Object.values(passwords).some(value => typeof value !== "string" || value.length < 8 || value.length > 128)) {
      return Response.json({error: "Provide passwords for the three requested accounts"}, {status: 400, headers});
    }
    await ensureDidbanWorker();
    const response = await fetch(`http://127.0.0.1:${process.env.WORKBENCH_PORT || "8877"}/api/internal/provision`, {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(15_000),
      headers: {"Content-Type": "application/json", "X-Didban-Bridge": createHmac("sha256", secret).update("didban-provision-v1").digest("hex")},
      body: JSON.stringify(passwords)
    });
    return Response.json(await response.json(), {status: response.status, headers});
  } catch {
    return Response.json({error: "راه‌اندازی حساب‌های دیدبان موقتاً در دسترس نیست."}, {status: 503, headers});
  }
}
