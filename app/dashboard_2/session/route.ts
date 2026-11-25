import {NextResponse} from "next/server";
import {checkViewer, configuredOrigin, noStore, setViewSession} from "@/lib/rasad-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = configuredOrigin(request);
  if (!origin) return new Response("درخواست از مبدأ نامعتبر است.", {status: 403, headers: noStore});
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
    return new Response("فرم ورود نامعتبر است.", {status: 415, headers: noStore});
  }
  const reader = request.body?.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let bytes = 0;
  if (reader) {
    for (let part = await reader.read(); !part.done; part = await reader.read()) {
      bytes += part.value.byteLength;
      if (bytes > 1024) {
        await reader.cancel();
        return new Response("فرم ورود نامعتبر است.", {status: 413, headers: noStore});
      }
      body += decoder.decode(part.value, {stream: true});
    }
    body += decoder.decode();
  }
  const fields = new URLSearchParams(body);
  const redirect = (suffix = "") => NextResponse.redirect(origin + "/dashboard_2" + suffix, {status: 303, headers: noStore});
  if (fields.get("action") === "logout") {
    const response = redirect();
    setViewSession(response, origin);
    response.cookies.set("admin_session", "", {path: "/", maxAge: 0, httpOnly: true, secure: origin.startsWith("https:")});
    return response;
  }
  const username = (fields.get("username") ?? "").trim().toLowerCase();
  const password = fields.get("password") ?? "";
  if (!checkViewer(username, password)) return redirect("?status=invalid");
  const response = redirect();
  if (!setViewSession(response, origin, username)) return redirect("?status=unavailable");
  return response;
}
