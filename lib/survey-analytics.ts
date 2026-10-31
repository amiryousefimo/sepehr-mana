import {surveyQuestions} from "@/lib/elderly-care-survey";

export type SurveyRecordLike = {
  id: string;
  ts: number;
  needScore: number | null;
  adoptionScore: number | null;
  paymentScore: number | null;
  reliabilityScore: number;
  segment: string;
  decisionLabel: string;
  contradictionFlags: string[];
  answers: Record<string, string>;
};

export type ScoreAverages = {
  need: number | null;
  adoption: number | null;
  payment: number | null;
  reliability: number | null;
};

export type LabeledCount = {label: string; count: number; pct: number};

export type SurveyAnalytics = {
  total: number;
  averages: ScoreAverages;
  segments: LabeledCount[];
  decisions: LabeledCount[];
  contradictionFlags: LabeledCount[];
  needBuckets: LabeledCount[];
  adoptionBuckets: LabeledCount[];
  paymentBuckets: LabeledCount[];
  qualifiedCount: number;
  resistantCount: number;
  lowPaymentCount: number;
  outsideCoreCount: number;
};

function avg(values: (number | null | undefined)[]): number | null {
  const nums = values.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  if (!nums.length) return null;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function countBy<T>(items: T[], keyFn: (item: T) => string): LabeledCount[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item) || "—";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const total = items.length || 1;
  return [...map.entries()]
    .map(([label, count]) => ({
      label,
      count,
      pct: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

function scoreBuckets(
  records: SurveyRecordLike[],
  field: "needScore" | "adoptionScore" | "paymentScore"
): LabeledCount[] {
  const labels = ["۰–۲۴", "۲۵–۴۹", "۵۰–۶۹", "۷۰–۱۰۰", "نامشخص"];
  const counts = [0, 0, 0, 0, 0];

  for (const r of records) {
    const v = r[field];
    if (v === null || v === undefined) {
      counts[4]++;
      continue;
    }
    if (v < 25) counts[0]++;
    else if (v < 50) counts[1]++;
    else if (v < 70) counts[2]++;
    else counts[3]++;
  }

  const total = records.length || 1;
  return labels.map((label, i) => ({
    label,
    count: counts[i],
    pct: Math.round((counts[i] / total) * 100)
  }));
}

export function analyzeSurveyRecords(records: SurveyRecordLike[]): SurveyAnalytics {
  const flagRows = records.flatMap((r) => r.contradictionFlags);
  const withoutFlags = records.filter((r) => !r.contradictionFlags.length).length;
  const flagCounts = countBy(flagRows, (f) => f);
  if (withoutFlags) {
    flagCounts.push({
      label: "بدون پرچم",
      count: withoutFlags,
      pct: Math.round((withoutFlags / (records.length || 1)) * 100)
    });
  }

  return {
    total: records.length,
    averages: {
      need: avg(records.map((r) => r.needScore)),
      adoption: avg(records.map((r) => r.adoptionScore)),
      payment: avg(records.map((r) => r.paymentScore)),
      reliability: avg(records.map((r) => r.reliabilityScore))
    },
    segments: countBy(records, (r) => r.segment),
    decisions: countBy(records, (r) => r.decisionLabel),
    contradictionFlags: flagCounts,
    needBuckets: scoreBuckets(records, "needScore"),
    adoptionBuckets: scoreBuckets(records, "adoptionScore"),
    paymentBuckets: scoreBuckets(records, "paymentScore"),
    qualifiedCount: records.filter((r) => r.segment === "S1").length,
    resistantCount: records.filter((r) => r.segment === "S2").length,
    lowPaymentCount: records.filter((r) => r.segment === "S3").length,
    outsideCoreCount: records.filter((r) => r.answers.Q02 === "خیر").length
  };
}

export function answerRowsForRecord(answers: Record<string, string>) {
  return surveyQuestions.map((q) => ({
    id: q.id,
    section: q.section,
    question: q.text,
    answer: answers[q.id]?.trim() || "—"
  }));
}
