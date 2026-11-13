import {NextRequest} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function relay(request: NextRequest, {params}: {params: {path?: string[]}}) {
  const path = params.path ?? [];
  if (path[0] === "api" && (path[1] === "internal" || path[1] === "local-login")) {
    return new Response("Not found", {status: 404});
  }
  const target = new URL(`http://127.0.0.1:${process.env.WORKBENCH_PORT || "8877"}/` + path.map(encodeURIComponent).join("/"));
  target.search = request.nextUrl.search;
  const headers = new Headers();
  for (const key of ["content-type", "cookie", "x-csrf-token", "origin"]) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }
  headers.set("x-forwarded-host", request.headers.get("host") ?? request.nextUrl.host);
  const publicOrigin=process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://tgsepma.com" : request.url);
  headers.set("x-forwarded-proto", new URL(publicOrigin).protocol.replace(":", ""));
  headers.set("x-forwarded-prefix", "/didban");
  headers.set("x-forwarded-for", request.headers.get("x-real-ip") ?? "unknown");
  try {
    const response = await fetch(target, {
      method: request.method, headers, cache: "no-store", redirect: "manual",
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      signal: AbortSignal.timeout(30_000)
    });
    const output = new Headers();
    for (const key of ["content-type", "content-disposition", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy"]) {
      const value = response.headers.get(key);
      if (value) output.set(key, value);
    }
    output.set("cache-control", "no-store");
    const cookie = response.headers.get("set-cookie");
    if (cookie) output.set("set-cookie", cookie.replace(/Path=\//i, "Path=/didban"));
    return new Response(response.body, {status: response.status, headers: output});
  } catch {
    return Response.json({error: "دیدبان موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید."}, {status: 503});
  }
}
export {relay as GET, relay as POST, relay as PUT};
