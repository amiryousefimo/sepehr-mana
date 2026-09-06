import {NextResponse} from "next/server";
import {appendContact} from "@/lib/store";
import {site} from "@/lib/site";

export const runtime = "nodejs";

const requestWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const requestsByAddress = new Map<string, {count: number; resetAt: number}>();

function getText(formData: FormData, key: string, maxLength: number) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isRateLimited(request: Request) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const now = Date.now();
  const current = requestsByAddress.get(address);

  if (!current || current.resetAt <= now) {
    requestsByAddress.set(address, {count: 1, resetAt: now + requestWindowMs});
    return false;
  }

  current.count += 1;
  return current.count > maxRequestsPerWindow;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json({error: "Too many requests."}, {status: 429});
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({error: "Invalid form data."}, {status: 400});
  }

  if (getText(formData, "website", 200)) {
    return NextResponse.json({ok: true});
  }

  const name = getText(formData, "name", 100);
  const organization = getText(formData, "organization", 120);
  const phone = getText(formData, "phone", 30);
  const email = getText(formData, "email", 160);
  const message = getText(formData, "message", 5000);
  const locale = getText(formData, "locale", 2) === "fa" ? "fa" : "en";

  if (!name || !phone || !isEmail(email) || !message) {
    return NextResponse.json({error: "Required fields are missing."}, {status: 400});
  }

  // Save to JSON first — this is the source of truth.
  // If the save fails we return an error; email failure is silent.
  const record = {id: crypto.randomUUID(), ts: Date.now(), name, organization, phone, email, message, locale};
  try {
    await appendContact(record);
  } catch (err) {
    console.error("Failed to save contact submission to JSON:", err);
    return NextResponse.json({error: "Could not save submission. Please try again."}, {status: 500});
  }

  // Attempt email delivery — best effort, never blocks the success response.
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.COLLABORATION_FROM_EMAIL;

    if (apiKey && fromEmail) {
      const labels = locale === "fa"
        ? {subject: "درخواست جدید از وب‌سایت", name: "نام", organization: "سازمان", phone: "تلفن", email: "ایمیل", message: "شرح نیاز"}
        : {subject: "New website inquiry", name: "Name", organization: "Organization", phone: "Phone", email: "Email", message: "Project need"};

      const body = [
        `${labels.name}: ${name}`,
        `${labels.organization}: ${organization || "—"}`,
        `${labels.phone}: ${phone}`,
        `${labels.email}: ${email}`,
        "",
        `${labels.message}:`,
        message
      ].join("\n");

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `contact-${crypto.randomUUID()}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [site.contactEmail],
          reply_to: email,
          subject: `${labels.subject} — ${name}`,
          text: body
        })
      });

      if (!response.ok) {
        console.error(`Contact email failed with status ${response.status}.`);
      }
    } else {
      console.warn("Contact email not configured — submission saved to JSON only.");
    }
  } catch (err) {
    console.error("Contact email error:", err);
  }

  return NextResponse.json({ok: true});
}
