"use client";

import {useEffect, useState} from "react";
import {InlineGuide} from "./inline-guide";
import styles from "./dashboard.module.css";

export function ReportFrame() {
  const [state, setState] = useState<"loading" | "ready" | "slow">("loading");
  useEffect(() => {
    const timeout = window.setTimeout(() => setState(value => value === "loading" ? "slow" : value), 12000);
    return () => window.clearTimeout(timeout);
  }, []);

  return <div className={styles.viewer}>
    <div className={styles.frame}>
      <iframe src="/dashboard_2/report" title="رصد بیمه و حکمرانی مالی" onLoad={() => setState("ready")} />
      {state === "loading" && <div className={styles.loading} role="status"><img alt="سازمان تأمین اجتماعی" src="/dashboard_2/report/social-security-logo.png" width={36} height={36} /><img alt="تکاپوگران سپهر مانا" src="/dashboard_2/report/company-logo.jpeg" width={36} height={36} /><span>در حال باز کردن گزارش رصد…</span></div>}
    </div>
    {state === "slow" && <div className={styles.guideRow}><p className={styles.status} role="status">پاسخ گزارش طول کشید. می‌توانید صفحه را دوباره بارگذاری کنید.</p><InlineGuide title="تأخیر در باز شدن گزارش" text="اگر صفحه طول کشید، دوباره بارگذاری کنید یا گزارش را در صفحهٔ کامل باز کنید. دسترسی از همان نشست فعلی سایت می‌آید." /></div>}
    <div className={styles.guideRow}><a className={styles.help} href="/dashboard_2/report" target="_blank" rel="noopener noreferrer">باز کردن گزارش‌ها در صفحهٔ کامل ↗</a><InlineGuide title="باز کردن گزارش‌ها در صفحهٔ کامل" text="همین گزارش‌ها در یک زبانهٔ جدا با فضای بیشتری باز می‌شوند. تا زمانی که نشست سایت معتبر است، ورود دوباره لازم نیست." /></div>
  </div>;
}
