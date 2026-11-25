"use client";

import {useEffect, useState} from "react";
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
      {state === "loading" && <p className={styles.loading} role="status">در حال باز کردن گزارش‌ها…</p>}
    </div>
    {state === "slow" && <p className={styles.status} role="status">پاسخ گزارش طول کشید. می‌توانید صفحه را دوباره بارگذاری کنید.</p>}
    <a className={styles.help} href="/dashboard_2/report" target="_blank" rel="noopener noreferrer">باز کردن گزارش‌ها در صفحهٔ کامل ↗</a>
  </div>;
}
