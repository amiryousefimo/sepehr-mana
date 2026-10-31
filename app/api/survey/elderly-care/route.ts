import {NextResponse} from "next/server";
import {
  computeReliability,
  computeScores,
  detectContradictions,
  deriveDecision,
  surveyQuestions,
  type SurveyAnswers
} from "@/lib/elderly-care-survey";
import {appendElderlyCareSurvey} from "@/lib/store";

export const runtime = "nodejs";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeAnswers(raw: unknown): SurveyAnswers | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Record<string, unknown>;
  const answers: SurveyAnswers = {};

  for (const question of surveyQuestions) {
    const value = input[question.id];
    if (typeof value !== "string") continue;
    const trimmed = value.trim().slice(0, 4000);
    if (!trimmed) continue;
    if (question.type === "single" && question.options && !question.options.includes(trimmed)) {
      continue;
    }
    answers[question.id] = trimmed;
  }

  for (const question of surveyQuestions) {
    if (!answers[question.id]?.trim()) {
      return null;
    }
  }

  return answers;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({error: "Invalid JSON."}, {status: 400});
  }

  const payload = body as Record<string, unknown>;
  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ok: true, id: crypto.randomUUID()});
  }

  const answers = sanitizeAnswers(payload.answers);
  if (!answers) {
    return NextResponse.json({error: "Incomplete survey answers."}, {status: 400});
  }

  const followUpConsent = payload.followUpConsent === true;
  const contactPhone =
    followUpConsent && typeof payload.contactPhone === "string"
      ? payload.contactPhone.trim().slice(0, 30)
      : "";
  const contactEmail =
    followUpConsent && typeof payload.contactEmail === "string"
      ? payload.contactEmail.trim().slice(0, 160)
      : "";
  const locale = payload.locale === "en" ? "en" : "fa";

  if (contactEmail && !isEmail(contactEmail)) {
    return NextResponse.json({error: "Invalid email."}, {status: 400});
  }

  const scores = computeScores(answers);
  const flags = detectContradictions(answers);
  const reliability = computeReliability(flags);
  const {decision, segment, label} = deriveDecision(answers, scores, reliability);

  const record = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    locale,
    answers,
    followUpConsent,
    contactPhone,
    contactEmail,
    needScore: scores.need,
    adoptionScore: scores.adoption,
    paymentScore: scores.payment,
    reliabilityScore: reliability,
    segment,
    decision,
    decisionLabel: label,
    contradictionFlags: flags.map((f) => f.code),
    contradictionLabels: flags.map((f) => f.label)
  };

  try {
    await appendElderlyCareSurvey(record);
  } catch (err) {
    console.error("Failed to save survey:", err);
    return NextResponse.json({error: "Could not save."}, {status: 500});
  }

  return NextResponse.json({ok: true, id: record.id});
}
