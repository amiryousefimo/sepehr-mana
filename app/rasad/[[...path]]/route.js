export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const getPaths = new Set([
  "/", "/api/meta", "/api/governance", "/api/search", "/api/profile", "/api/followups", "/api/runs",
  "/app.js", "/pages.js", "/app.css", "/rasad.css", "/Vazirmatn-Regular.ttf",
  "/iran-provinces.json", "/iran-provinces.metadata.json", "/company-logo.jpeg", "/social-security-logo.png",
]);
const postPaths = new Set(["/api/login", "/api/logout", "/api/followup", "/api/scenario", "/api/export-audit"]);
const responseFields = ["content-type", "x-content-type-options", "x-frame-options", "content-security-policy", "set-cookie"];

async function proxy(request, context) {
  const path = "/" + (context.params.path ?? []).join("/");
  if (!(request.method === "GET" ? getPaths : postPaths).has(path)) {
    return Response.json({ error: "نشانی پیدا نشد." }, { status: 404 });
  }
  const upstream = process.env.RASAD_UPSTREAM_URL;
  const secret = process.env.RASAD_PROXY_SECRET;
  if (!upstream || !secret) return unavailable();
  try {
    const target = new URL(upstream);
    if (!["https:", "http:"].includes(target.protocol) || target.username || target.password) return unavailable();
    target.pathname = target.pathname.replace(/\/$/, "") + path;
    target.search = request.nextUrl.search;
    const headers = new Headers({ "x-rasad-proxy": secret });
    for (const header of ["cookie", "origin", "content-type"]) {
      const value = request.headers.get(header);
      if (value) headers.set(header, value);
    }
    const body = request.method === "POST" ? await request.text() : undefined;
    if (body && Buffer.byteLength(body, "utf8") > 8192) return Response.json({ error: "ورودی بیش از حد مجاز است." }, { status: 413 });
    const result = await fetch(target, {
      method: request.method, headers, body, cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(55000),
    });
    if (result.status >= 300 && result.status < 400) return unavailable();
    const outgoing = new Headers({ "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" });
    for (const header of responseFields) {
      const value = result.headers.get(header);
      if (value) outgoing.set(header, header === "set-cookie" ? value.replace("Path=/;", "Path=/rasad;") : value);
    }
    const content = path === "/" ? (await result.text()).replace(/\b(src|href)="\/(?!\/)/g, '$1="/rasad/') : result.body;
    return new Response(content, { status: result.status, headers: outgoing });
  } catch {
    return unavailable();
  }
}

function unavailable() {
  return new Response("رصد ۱ موقتاً در دسترس نیست.", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
}

export { proxy as GET, proxy as POST };
