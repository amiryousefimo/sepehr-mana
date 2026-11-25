import type {Metadata} from "next";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {readPowerBiEmbed} from "@/lib/powerbi-embed";
import {ReportFrame} from "./report-frame";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "داشبورد ۲ | گزارش Power BI | سپهر مانا",
  robots: {index: false, follow: false}
};

export default function DashboardTwoPage() {
  const embedUrl = readPowerBiEmbed(process.env.POWERBI_EMBED_URL);
  const reportTitle = process.env.POWERBI_REPORT_TITLE?.trim().slice(0, 100);

  return (
    <>
      <a className="skip-link" href="#main">رفتن به محتوای اصلی</a>
      <SiteHeader locale="fa" content={content.fa} page="inner" />
      <main id="main" className={styles.page} dir="rtl">
        <div className={styles.container}>
          <header className={styles.intro}>
            <div>
              <p className={styles.kicker}>داشبوردها / Microsoft Power BI</p>
              <h1>داشبورد ۲</h1>
              {reportTitle && <p>{reportTitle}</p>}
              <p>برای دیدن گزارش، با حساب سازمانی مایکروسافت که به گزارش دسترسی دارد وارد شوید.</p>
            </div>
            {embedUrl && (
              <a className="button button--primary" href={embedUrl} target="_blank" rel="noopener noreferrer">
                ورود و بازکردن در Power BI <span aria-hidden="true">↗</span>
              </a>
            )}
          </header>
          {embedUrl ? <ReportFrame src={embedUrl} title={reportTitle || "داشبورد ۲"} /> : (
            <section className={styles.empty} aria-labelledby="report-unavailable">
              <h2 id="report-unavailable">گزارش هنوز برای این صفحه تنظیم نشده است</h2>
              <p>برای پیگیری دسترسی یا زمان انتشار گزارش، با پشتیبان سایت تماس بگیرید.</p>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
