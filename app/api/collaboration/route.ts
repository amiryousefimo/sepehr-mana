import {NextResponse} from "next/server";
import {appendCollaboration} from "@/lib/store";
import {site} from "@/lib/site";

export const runtime = "nodejs";

const maxResumeSize = 5 * 1024 * 1024;
const allowedExtensions = new Set(["pdf", "doc", "docx"]);
const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream"
]);

function getText(formData: FormData, key: string, maxLength: number) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeFilename(filename: string) {
  return filename
    .split(/[\\/]/)
    .pop()
    ?.replace(/[\r\n"]/g, "_")
    .slice(0, 180) || "resume.pdf";
}

export async function POST(request: Request) {
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
  const role = getText(formData, "role", 100);
  const phone = getText(formData, "phone", 30);
  const email = getText(formData, "email", 160);
  const collaborationType = getText(formData, "collaborationType", 120);
  const budget = getText(formData, "budget", 120);
  const timeline = getText(formData, "timeline", 120);
  const message = getText(formData, "message", 5000);
  const locale = getText(formData, "locale", 2) === "fa" ? "fa" : "en";
  const consent = formData.get("consent");
  const resume = formData.get("resume");

  if (!name || !phone || !isEmail(email) || !message || !consent) {
    return NextResponse.json({error: "Required fields are missing."}, {status: 400});
  }

  if (!(resume instanceof File) || !resume.size || resume.size > maxResumeSize) {
    return NextResponse.json({error: "Invalid resume."}, {status: 400});
  }

  const filename = safeFilename(resume.name);
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  if (!allowedExtensions.has(extension) || (resume.type && !allowedTypes.has(resume.type))) {
    return NextResponse.json({error: "Unsupported resume format."}, {status: 400});
  }

  // Save to JSON first — this is the source of truth.
  // If the save fails we return an error; email failure is silent.
  const record = {
    id: crypto.randomUUID(), ts: Date.now(), name, organization, role, phone, email,
    collaborationType, budget, timeline, message, locale, resumeFilename: filename
  };
  try {
    await appendCollaboration(record);
  } catch (err) {
    console.error("Failed to save collaboration submission to JSON:", err);
    return NextResponse.json({error: "Could not save submission. Please try again."}, {status: 500});
  }

  // Attempt email delivery — best effort, never blocks the success response.
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.COLLABORATION_FROM_EMAIL;

    if (apiKey && fromEmail) {
      const resumeContent = Buffer.from(await resume.arrayBuffer()).toString("base64");
      const labels = locale === "fa"
        ? {subject: "درخواست همکاری جدید", name: "نام", organization: "سازمان", role: "سمت", phone: "تلفن", email: "ایمیل", type: "زمینه همکاری", budget: "بودجه", timeline: "زمان شروع", message: "پیام"}
        : {subject: "New collaboration request", name: "Name", organization: "Organization", role: "Role", phone: "Phone", email: "Email", type: "Collaboration area", budget: "Budget", timeline: "Preferred start", message: "Message"};

      const body = [
        `${labels.name}: ${name}`,
        `${labels.organization}: ${organization || "—"}`,
        `${labels.role}: ${role || "—"}`,
        `${labels.phone}: ${phone}`,
        `${labels.email}: ${email}`,
        `${labels.type}: ${collaborationType || "—"}`,
        `${labels.budget}: ${budget || "—"}`,
        `${labels.timeline}: ${timeline || "—"}`,
        "",
        `${labels.message}:`,
        message
      ].join("\n");

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `collaboration-${crypto.randomUUID()}`
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [site.collaborationEmail],
          reply_to: email,
          subject: `${labels.subject} — ${name}`,
          text: body,
          attachments: [{filename, content: resumeContent}]
        })
      });

      if (!response.ok) {
        console.error(`Collaboration email failed with status ${response.status}.`);
      }
    } else {
      console.warn("Collaboration email not configured — submission saved to JSON only.");
    }
  } catch (err) {
    console.error("Collaboration email error:", err);
  }

  return NextResponse.json({ok: true});
}
