import raw from "@/lib/elderly-care-survey-data.json";

export type SurveyQuestion = {
  id: string;
  section: string;
  text: string;
  type: "single" | "text";
  options?: string[];
  indicator: string;
  note?: string;
};

export type SurveyAnswers = Record<string, string>;

export const surveyIntro = raw.intro as Record<string, string>;
export const surveyQuestions = raw.questions as SurveyQuestion[];
export const scoringMap = raw.scoring as Record<
  string,
  Record<
    string,
    {
      optionCode: string;
      need?: number;
      adoption?: number;
      payment?: number;
    }
  >
>;

const NEED_WEIGHTS: Record<string, number> = {
  Q08: 0.2,
  Q10: 0.2,
  Q13: 0.15,
  Q15: 0.15,
  Q17: 0.15,
  Q18: 0.15
};

const ADOPTION_WEIGHTS: Record<string, number> = {
  Q21: 0.2,
  Q23: 0.25,
  Q25: 0.25,
  Q29: 0.15,
  Q31: 0.15
};

const PAYMENT_WEIGHTS: Record<string, number> = {
  Q33: 0.15,
  Q34: 0.15,
  Q35: 0.25,
  Q36: 0.25,
  Q37: 0.2
};

export const surveySections = [...new Set(surveyQuestions.map((q) => q.section))];

export function questionsForSection(section: string) {
  return surveyQuestions.filter((q) => q.section === section);
}

function weightedScore(
  answers: SurveyAnswers,
  weights: Record<string, number>,
  field: "need" | "adoption" | "payment"
): number | null {
  let total = 0;
  let weightSum = 0;

  for (const [questionId, weight] of Object.entries(weights)) {
    const answer = answers[questionId]?.trim();
    if (!answer) continue;
    const points = scoringMap[questionId]?.[answer]?.[field];
    if (points === undefined) continue;
    total += points * weight;
    weightSum += weight;
  }

  if (weightSum === 0) return null;
  return Math.round(total / weightSum);
}

export function computeScores(answers: SurveyAnswers) {
  return {
    need: weightedScore(answers, NEED_WEIGHTS, "need"),
    adoption: weightedScore(answers, ADOPTION_WEIGHTS, "adoption"),
    payment: weightedScore(answers, PAYMENT_WEIGHTS, "payment")
  };
}

export type ContradictionFlag = {
  code: string;
  label: string;
  severity: "کم" | "متوسط" | "زیاد";
};

export function detectContradictions(answers: SurveyAnswers): ContradictionFlag[] {
  const flags: ContradictionFlag[] = [];
  const q = (id: string) => answers[id]?.trim() ?? "";

  if (q("Q08") === "صفر" && q("Q10") === "به‌صورت مکرر") {
    flags.push({code: "C01", label: "تناقض فراوانی نگرانی", severity: "متوسط"});
  }

  if (q("Q15") === "کاملاً راضی" && q("Q16") && q("Q16") !== "نبود مشکل") {
    flags.push({code: "C02", label: "رضایت در برابر مشکل", severity: "کم"});
  }

  const blockers = ["پیچیدگی", "بی‌میلی به استفاده از گوشی", "نگرانی از کنترل‌شدن"];
  if (q("Q23") === "قطعاً بله" && blockers.includes(q("Q24"))) {
    flags.push({code: "C03", label: "پذیرش در برابر مانع", severity: "متوسط"});
  }

  if (q("Q25") === "بسیار زیاد" && q("Q36") === "خیر") {
    flags.push({code: "C04", label: "قصد استفاده در برابر اقدام", severity: "زیاد"});
  }

  const highPrice = ["۴۰۰ تا ۷۰۰ هزار", "بیش از ۷۰۰ هزار"];
  if (highPrice.includes(q("Q35")) && q("Q34") === "حاضر به پرداخت نیستم") {
    flags.push({code: "C05", label: "قیمت اعلامی در برابر مدل پرداخت", severity: "زیاد"});
  }

  if (q("Q10") === "به‌صورت مکرر" && !q("Q14")) {
    flags.push({code: "C06", label: "نیاز ادعایی بدون مثال", severity: "کم"});
  }

  return flags;
}

export function computeReliability(flags: ContradictionFlag[]): number {
  let score = 100;
  for (const flag of flags) {
    if (flag.severity === "زیاد") score -= 15;
    else if (flag.severity === "متوسط") score -= 10;
    else score -= 5;
  }
  return Math.max(0, score);
}

export type SurveyDecision =
  | "outside_core"
  | "low_need"
  | "resistant"
  | "low_payment"
  | "needs_validation"
  | "qualified_lead"
  | "interested_low_need"
  | "review";

export function deriveDecision(
  answers: SurveyAnswers,
  scores: ReturnType<typeof computeScores>,
  reliability: number
): {decision: SurveyDecision; segment: string; label: string} {
  if (answers.Q02 === "خیر") {
    return {
      decision: "outside_core",
      segment: "—",
      label: "خارج از جامعه اصلی"
    };
  }

  const need = scores.need ?? 0;
  const adoption = scores.adoption ?? 0;
  const payment = scores.payment ?? 0;

  if (need < 25) {
    return {decision: "low_need", segment: "S4", label: "کم‌نیاز"};
  }

  if (need >= 50 && adoption < 60) {
    return {decision: "resistant", segment: "S2", label: "کاربر مقاوم"};
  }

  if (need >= 50 && adoption >= 60 && payment < 60) {
    return {decision: "low_payment", segment: "S3", label: "نیازمند اما کم‌پرداخت"};
  }

  if (need >= 50 && adoption >= 60 && payment >= 60 && reliability < 70) {
    return {
      decision: "needs_validation",
      segment: "S5",
      label: "پاسخ نیازمند اعتبارسنجی"
    };
  }

  if (need >= 50 && adoption >= 60 && payment >= 60 && reliability >= 70) {
    return {
      decision: "qualified_lead",
      segment: "S1",
      label: "مشتری بالقوه واجد شرایط"
    };
  }

  if (need < 50 && (adoption >= 60 || payment >= 60)) {
    return {
      decision: "interested_low_need",
      segment: "S5",
      label: "علاقه‌مند بدون نیاز فوری"
    };
  }

  return {decision: "review", segment: "S5", label: "میانی / نیازمند بررسی"};
}

export function validateSectionAnswers(section: string, answers: SurveyAnswers): string | null {
  for (const question of questionsForSection(section)) {
    const value = answers[question.id]?.trim();
    if (!value) {
      return question.id;
    }
    if (question.type === "single" && question.options && !question.options.includes(value)) {
      return question.id;
    }
  }
  return null;
}
