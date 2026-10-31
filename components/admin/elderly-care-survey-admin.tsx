"use client";

import {Fragment, useMemo, useState} from "react";
import {Download} from "lucide-react";
import {
  analyzeSurveyRecords,
  answerRowsForRecord,
  type SurveyAnalytics
} from "@/lib/survey-analytics";

export type SurveyRecord = {
  id: string;
  ts: number;
  locale: string;
  followUpConsent: boolean;
  contactPhone: string;
  contactEmail: string;
  needScore: number | null;
  adoptionScore: number | null;
  paymentScore: number | null;
  reliabilityScore: number;
  segment: string;
  decisionLabel: string;
  contradictionFlags: string[];
  answers: Record<string, string>;
};

function formatDate(ts: number) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(ts));
}

function ScoreCard({
  label,
  value,
  hint,
  threshold
}: {
  label: string;
  value: number | null;
  hint?: string;
  threshold?: number;
}) {
  const display = value ?? "—";
  const ok = typeof value === "number" && threshold !== undefined && value >= threshold;
  return (
    <div className="admin-stat-card">
      <span>{label}</span>
      <strong className={ok ? "admin-stat-card__value--ok" : undefined}>{display}</strong>
      {hint && <small>{hint}</small>}
    </div>
  );
}

function BarChart({title, items, maxBars = 8}: {title: string; items: {label: string; count: number; pct: number}[]; maxBars?: number}) {
  const slice = items.slice(0, maxBars);
  const max = Math.max(1, ...slice.map((i) => i.count));

  return (
    <div className="admin-chart">
      <h3>{title}</h3>
      <ul className="admin-chart__bars">
        {slice.map((item) => (
          <li key={item.label}>
            <div className="admin-chart__row-head">
              <span>{item.label}</span>
              <b>
                {item.count} ({item.pct}%)
              </b>
            </div>
            <div className="admin-chart__track">
              <i style={{width: `${(item.count / max) * 100}%`}} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BucketChart({title, items}: {title: string; items: SurveyAnalytics["needBuckets"]}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="admin-chart admin-chart--compact">
      <h3>{title}</h3>
      <div className="admin-chart__columns">
        {items.map((item) => (
          <div className="admin-chart__column" key={item.label}>
            <i style={{height: `${(item.count / max) * 100}%`}} title={`${item.count}`} />
            <span>{item.label}</span>
            <b>{item.count}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function SurveyDashboard({analytics}: {analytics: SurveyAnalytics}) {
  if (!analytics.total) {
    return <p className="admin-empty">هنوز پاسخی ثبت نشده — نمودارها پس از اولین پاسخ نمایش داده می‌شوند.</p>;
  }

  return (
    <div className="admin-survey-dashboard">
      <div className="admin-stat-grid">
        <ScoreCard label="تعداد پاسخ" value={analytics.total} />
        <ScoreCard label="میانگین Need" value={analytics.averages.need} threshold={50} hint="آستانه بالا: ≥۵۰" />
        <ScoreCard label="میانگین Adoption" value={analytics.averages.adoption} threshold={60} hint="آستانه بالا: ≥۶۰" />
        <ScoreCard label="میانگین Payment" value={analytics.averages.payment} threshold={60} hint="آستانه بالا: ≥۶۰" />
        <ScoreCard label="میانگین Reliability" value={analytics.averages.reliability} threshold={70} hint="قابل قبول: ≥۷۰" />
      </div>

      <div className="admin-pill-row">
        <span className="admin-pill admin-pill--ok">مشتری واجد شرایط (S1): {analytics.qualifiedCount}</span>
        <span className="admin-pill">کاربر مقاوم (S2): {analytics.resistantCount}</span>
        <span className="admin-pill">کم‌پرداخت (S3): {analytics.lowPaymentCount}</span>
        <span className="admin-pill admin-pill--muted">خارج از جامعه (Q02=خیر): {analytics.outsideCoreCount}</span>
      </div>

      <div className="admin-chart-grid">
        <BarChart title="بخش‌بندی (Segment)" items={analytics.segments} />
        <BarChart title="تصمیم / برچسب" items={analytics.decisions} />
        <BarChart title="پرچم‌های تناقض" items={analytics.contradictionFlags} maxBars={10} />
      </div>

      <div className="admin-chart-grid admin-chart-grid--three">
        <BucketChart title="توزیع Need" items={analytics.needBuckets} />
        <BucketChart title="توزیع Adoption" items={analytics.adoptionBuckets} />
        <BucketChart title="توزیع Payment" items={analytics.paymentBuckets} />
      </div>
    </div>
  );
}

function AnswerDetailTable({answers}: {answers: Record<string, string>}) {
  const rows = answerRowsForRecord(answers);
  let lastSection = "";

  return (
    <div className="admin-answer-table-wrap">
      <table className="admin-table admin-answer-table">
        <thead>
          <tr>
            <th>کد</th>
            <th>بخش</th>
            <th>سؤال</th>
            <th>پاسخ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const showSection = row.section !== lastSection;
            lastSection = row.section;
            return (
              <tr key={row.id}>
                <td>
                  <span className="admin-badge">{row.id}</span>
                </td>
                <td>{showSection ? row.section : ""}</td>
                <td>{row.question}</td>
                <td className="admin-answer-table__answer">{row.answer}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ElderlyCareSurveyAdmin({records}: {records: SurveyRecord[]}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<"dashboard" | "responses">("dashboard");
  const [exporting, setExporting] = useState(false);
  const analytics = useMemo(() => analyzeSurveyRecords(records), [records]);

  async function downloadExcel() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/survey-export/elderly-care");
      if (!res.ok) return;
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? "elderly-care-survey.xlsx";
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="admin-survey-panel">
      <div className="admin-survey-panel__toolbar">
        <div className="admin-subtabs">
        <button
          type="button"
          className={`admin-subtab ${view === "dashboard" ? "admin-subtab--active" : ""}`}
          onClick={() => setView("dashboard")}
        >
          داشبورد و نمودارها
        </button>
        <button
          type="button"
          className={`admin-subtab ${view === "responses" ? "admin-subtab--active" : ""}`}
          onClick={() => setView("responses")}
        >
          جدول پاسخ‌ها ({records.length})
        </button>
        </div>
        <button
          type="button"
          className="admin-export-btn"
          onClick={() => void downloadExcel()}
          disabled={exporting || !records.length}
          title={records.length ? "دانلود اکسل" : "پاسخی برای خروجی نیست"}
        >
          <Download aria-hidden="true" />
          {exporting ? "در حال آماده‌سازی…" : "خروجی Excel"}
        </button>
      </div>

      {view === "dashboard" ? (
        <SurveyDashboard analytics={analytics} />
      ) : !records.length ? (
        <p className="admin-empty">No survey responses yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>تاریخ</th>
                <th>سگمنت</th>
                <th>تصمیم</th>
                <th>Need</th>
                <th>Adoption</th>
                <th>Payment</th>
                <th>Reliability</th>
                <th>پرچم‌ها</th>
                <th>تماس</th>
                <th>جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <Fragment key={r.id}>
                  <tr className={expanded === r.id ? "admin-table__row--active" : ""}>
                    <td dir="ltr">{formatDate(r.ts)}</td>
                    <td>
                      <span className="admin-badge">{r.segment}</span>
                    </td>
                    <td>{r.decisionLabel}</td>
                    <td>{r.needScore ?? "—"}</td>
                    <td>{r.adoptionScore ?? "—"}</td>
                    <td>{r.paymentScore ?? "—"}</td>
                    <td>{r.reliabilityScore}</td>
                    <td>
                      {r.contradictionFlags.length ? (
                        <span className="admin-flag-list">{r.contradictionFlags.join(" · ")}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td dir="ltr">
                      {r.followUpConsent
                        ? [r.contactPhone, r.contactEmail].filter(Boolean).join(" · ") || "رضایت بدون تماس"
                        : "—"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn-link"
                        onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      >
                        {expanded === r.id ? "بستن" : "مشاهده پاسخ‌ها"}
                      </button>
                    </td>
                  </tr>
                  {expanded === r.id && (
                    <tr className="admin-table__expand">
                      <td colSpan={10}>
                        <AnswerDetailTable answers={r.answers} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
