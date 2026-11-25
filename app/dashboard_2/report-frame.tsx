"use client";

import {useEffect, useState} from "react";
import styles from "./dashboard.module.css";

type FrameState = "loading" | "loaded" | "slow" | "failed";

export function ReportFrame({src, title}: {src: string; title: string}) {
  const [mounted, setMounted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<FrameState>("loading");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted || state !== "loading") return;
    const timer = window.setTimeout(() => setState("slow"), 15000);
    return () => window.clearTimeout(timer);
  }, [mounted, state, attempt]);

  const retry = () => {
    setState("loading");
    setAttempt(previous => previous + 1);
  };
  const showRecovery = state === "slow" || state === "failed";

  return (
    <section aria-label="گزارش تعاملی">
      <div className={styles.viewer}>
        <div className={styles.frame} aria-busy={state === "loading"}>
          {mounted && (
            <iframe
              key={attempt}
              title={title + " — Power BI"}
              src={src}
              allowFullScreen
              referrerPolicy="no-referrer"
              onLoad={() => setState("loaded")}
              onError={() => setState("failed")}
            />
          )}
        </div>
        <div className={state === "loading" ? undefined : styles.status} role="status">
          {state === "loading" && <p className={styles.loading}>در حال بارگذاری Power BI…</p>}
          {state === "slow" && "پاسخ Power BI طول کشیده است. می‌توانید کمی صبر کنید یا گزارش را در تب جدید باز کنید."}
          {state === "failed" && "ارتباط با Power BI برقرار نشد. دوباره تلاش کنید یا گزارش را در تب جدید باز کنید."}
        </div>
      </div>
      {showRecovery && <button className="button button--secondary" type="button" onClick={retry}>تلاش دوباره</button>}
      <p className={styles.help}>
        اگر صفحهٔ ورود باز نمی‌شود، گزارش را در تب جدید باز کنید. اگر Power BI خطای دسترسی نشان می‌دهد، از مالک گزارش بخواهید به حساب سازمانی شما مجوز بدهد.
      </p>
    </section>
  );
}
