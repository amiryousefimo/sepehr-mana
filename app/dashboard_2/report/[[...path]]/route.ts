import {readFile, stat} from "node:fs/promises";
import {createReadStream} from "node:fs";
import {join} from "node:path";
import {Readable} from "node:stream";
import {gunzipSync} from "node:zlib";
import {noStore, rasadIdentity} from "@/lib/rasad-session";
import {recordLogin} from "@/lib/rasad-login-audit";
import {demoCoverage, demoHousehold} from "@/lib/rasad-family";
import {readGoldCalendar} from "@/lib/rasad-gold";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const root = join(process.cwd(), "reports", "rasad");
const headers = {...noStore, "X-Content-Type-Options": "nosniff"};
const files = new Map(Object.entries({
  "index.html": "text/html; charset=utf-8",
  "app.js": "text/javascript; charset=utf-8",
  "pages.js": "text/javascript; charset=utf-8",
  "help-reports.js": "text/javascript; charset=utf-8",
  "help.js": "text/javascript; charset=utf-8",
  "profile-insights.js": "text/javascript; charset=utf-8",
  "profile-math.js": "text/javascript; charset=utf-8",
  "help-topics.js": "text/javascript; charset=utf-8",
  "guide.html": "text/html; charset=utf-8",
  "guide.js": "text/javascript; charset=utf-8",
  "guide-tracks.js": "text/javascript; charset=utf-8",
  "guide-governance.js": "text/javascript; charset=utf-8",
  "guide-profiles.js": "text/javascript; charset=utf-8",
  "guide-erd.js": "text/javascript; charset=utf-8",
  "guide-erd-view.js": "text/javascript; charset=utf-8",
  "app.css": "text/css; charset=utf-8",
  "rasad.css": "text/css; charset=utf-8",
  "Vazirmatn-Regular.ttf": "font/ttf",
  "company-logo.jpeg": "image/jpeg",
  "social-security-logo.png": "image/png",
  "iran-provinces.json": "application/json"
}));
const contentPolicy = "default-src 'self'; frame-ancestors 'self'; style-src 'self' 'unsafe-inline'; base-uri 'none'; object-src 'none'; form-action 'self'";
type Person = {PersonKey: number; CaseCode: string; DisplayName: string; Status: string; RegionKey: number};
type Profile = {person: [Person]; benefit: Parameters<typeof demoHousehold>[1]; membership: Parameters<typeof demoCoverage>[1]};
let cases: Promise<Record<string, Profile>> | undefined;
const readJson = async (name: string) => JSON.parse(gunzipSync(await readFile(join(root, name))).toString("utf8"));
const reply = (value: unknown, status = 200) => Response.json(value, {status, headers});

async function file(name: string, type: string, extra = {}) {
  const path = join(root, name);
  const {size} = await stat(path);
  const body = Readable.toWeb(createReadStream(path)) as ReadableStream<Uint8Array>;
  return new Response(body, {headers: {...headers, "Content-Type": type, "Content-Length": String(size), ...extra}});
}

export async function GET(request: Request, {params}: {params: {path?: string[]}}) {
  const identity = rasadIdentity();
  if (!identity) return reply({error: "برای مشاهده گزارش وارد حساب سایت شوید."}, 401);
  const path = params.path?.join("/") || "index.html";
  const url = new URL(request.url);
  try {
    const type = files.get(path);
    if (type) {
      const response = await file(path, type, {"Content-Security-Policy": contentPolicy});
      if (path === "index.html") {
        const ref = await recordLogin(request, "rasad", "report_open", "report_loaded", identity.username);
        response.headers.set("X-Rasad-Event", ref);
      }
      return response;
    }
    if (path === "api/meta") {
      const meta = await readJson("meta.json.gz");
      return reply({...meta, authenticated: true, role: "viewer", roles: {
        viewer: {name: "مشاهده گزارش آزمایشی", scope: "all", gov: true, scenario: false, export: false}
      }});
    }
    if (path === "api/gold") return reply(await readGoldCalendar(root));
    if (path === "api/governance") {
      const acceptsGzip = (request.headers.get("accept-encoding") ?? "").split(",").some(value => /^\s*gzip\s*$/i.test(value));
      if (acceptsGzip) return await file("governance.json.gz", "application/json", {"Content-Encoding": "gzip", Vary: "Accept-Encoding"});
      const data = gunzipSync(await readFile(join(root, "governance.json.gz")));
      return new Response(new Uint8Array(data), {headers: {...headers, "Content-Type": "application/json", Vary: "Accept-Encoding"}});
    }
    if (path === "api/search" || path === "api/profile") {
      const digits = "۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩";
      const rawCode = (url.searchParams.get(path === "api/search" ? "q" : "person") ?? "").trim().toUpperCase().replace(/[۰-۹٠-٩]/g, value => String(digits.indexOf(value) % 10));
      if (!/^(?:DEMO-)?\d{1,4}$/.test(rawCode)) return reply({error: "شناسه نمونه را وارد کنید؛ برای مثال DEMO-0001."}, 400);
      cases ??= readJson("profiles.json.gz").catch(error => { cases = undefined; throw error; });
      const profile = (await cases)[String(Number(rawCode.replace(/^DEMO-/, "")))];
      if (path === "api/profile") return profile ? reply({
        ...profile,
        household: demoHousehold(profile.person[0].PersonKey, profile.benefit),
        coverageHistory: demoCoverage(profile.person[0].PersonKey, profile.membership)
      }) : reply({error: "پرونده پیدا نشد."}, 404);
      const person = profile?.person[0];
      const status = url.searchParams.get("status");
      const branch = url.searchParams.get("branch");
      return reply(person && (!status || person.Status === status) && (!branch || branch === "0" || String(person.RegionKey) === branch) ? [person] : []);
    }
    if (path === "api/runs" || path === "api/followups") return reply([]);
    return reply({error: "گزارش پیدا نشد."}, 404);
  } catch {
    return reply({error: "بستهٔ گزارش موقتاً در دسترس نیست. دوباره تلاش کنید."}, 503);
  }
}
