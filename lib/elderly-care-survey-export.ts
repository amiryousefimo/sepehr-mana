import * as XLSX from "xlsx";
import {surveyQuestions} from "@/lib/elderly-care-survey";
import {analyzeSurveyRecords} from "@/lib/survey-analytics";
import type {ElderlyCareSurveyRecord} from "@/lib/store";

function questionHeader(id: string): string {
  if (id === "Q14") return "Q14 - تجربه واقعی";
  if (id === "Q20") return "Q20 - مشکل اصلی";
  return id;
}

function formatExportDate(ts: number): string {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(ts));
}

function followUpLabel(consent: boolean): string {
  return consent ? "بله" : "خیر";
}

export function buildElderlyCareSurveyWorkbook(records: ElderlyCareSurveyRecord[]) {
  const questionIds = surveyQuestions.map((q) => q.id);
  const responseHeaders = [
    "ID",
    "تاریخ",
    "رضایت پیگیری تماس؟",
    "شماره تماس",
    "ایمیل",
    ...questionIds.map(questionHeader),
    "Need Score",
    "Adoption Score",
    "Payment Score",
    "Reliability Score",
    "Segment",
    "Decision",
    "پرچم‌های تناقض",
    "تفسیر پرچم‌ها",
    "Locale"
  ];

  const responseRows = records.map((r) => [
    r.id,
    formatExportDate(r.ts),
    followUpLabel(r.followUpConsent),
    r.contactPhone || "",
    r.contactEmail || "",
    ...questionIds.map((id) => r.answers[id] ?? ""),
    r.needScore ?? "",
    r.adoptionScore ?? "",
    r.paymentScore ?? "",
    r.reliabilityScore,
    r.segment,
    r.decisionLabel,
    r.contradictionFlags.join(" | "),
    r.contradictionLabels.join(" | "),
    r.locale
  ]);

  const analytics = analyzeSurveyRecords(records);
  const dashboardRows: (string | number)[][] = [
    ["داشبورد تحقیق بازار", ""],
    ["شاخص", "مقدار"],
    ["تعداد پاسخ‌های ثبت‌شده", analytics.total],
    ["میانگین Need Score", analytics.averages.need ?? ""],
    ["میانگین Adoption Score", analytics.averages.adoption ?? ""],
    ["میانگین Payment Score", analytics.averages.payment ?? ""],
    ["میانگین Reliability Score", analytics.averages.reliability ?? ""],
    ["مشتریان واجد شرایط (S1)", analytics.qualifiedCount],
    ["کاربران مقاوم (S2)", analytics.resistantCount],
    ["نیازمند اما کم‌پرداخت (S3)", analytics.lowPaymentCount],
    ["خارج از جامعه اصلی (Q02=خیر)", analytics.outsideCoreCount],
    ["", ""],
    ["بخش‌بندی", "تعداد", "درصد"],
    ...analytics.segments.map((s) => [s.label, s.count, `${s.pct}%`]),
    ["", ""],
    ["تصمیم / برچسب", "تعداد", "درصد"],
    ...analytics.decisions.map((d) => [d.label, d.count, `${d.pct}%`])
  ];

  const bankHeaders = ["کد", "بخش", "متن سؤال", "نوع پاسخ", "شاخص"];
  const bankRows = surveyQuestions.map((q) => [
    q.id,
    q.section,
    q.text,
    q.type === "text" ? "تشریحی" : "تک‌گزینه‌ای",
    q.indicator
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([responseHeaders, ...responseRows]),
    "پاسخ‌ها"
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dashboardRows), "داشبورد");
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([bankHeaders, ...bankRows]),
    "بانک سؤالات"
  );

  return XLSX.write(wb, {type: "buffer", bookType: "xlsx"}) as Buffer;
}

export function elderlyCareExportFilename() {
  const stamp = new Date().toISOString().slice(0, 10);
  return `elderly-care-survey-${stamp}.xlsx`;
}
