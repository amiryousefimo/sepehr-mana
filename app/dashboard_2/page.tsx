import type {Metadata} from "next";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {viewSession} from "@/lib/rasad-session";
import {ReportFrame} from "./report-frame";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "داشبورد ۲ | رصد بیمه و حکمرانی مالی | سپهر مانا",
  robots: {index: false, follow: false}
};

export default function DashboardTwoPage({searchParams}: {searchParams: {status?: string}}) {
  const signedIn = viewSession();
  const error = searchParams.status === "invalid" ? "نام کاربری یا گذرواژه درست نیست."
    : searchParams.status === "unavailable" ? "ورود موقتاً در دسترس نیست. با پشتیبان سایت تماس بگیرید." : "";

  return (
    <>
      <a className="skip-link" href="#main">رفتن به محتوای اصلی</a>
      <SiteHeader locale="fa" content={content.fa} page="inner" />
      <main id="main" className={styles.page} dir="rtl">
        <div className={styles.container}>
          <header className={styles.intro}>
            <div>
              <p className={styles.kicker}>داشبوردها / رصد بیمه و حکمرانی مالی</p>
              <h1>داشبورد ۲</h1>
              <p>۲۲ گزارش تعاملی حکمرانی و پرونده‌های نمونه. تمام ارقام و پرونده‌ها آزمایشی‌اند.</p>
            </div>
            {signedIn && <form action="/dashboard_2/session" method="post">
              <button className="button button--secondary" name="action" value="logout">خروج از حساب سایت</button>
            </form>}
          </header>
          {signedIn ? <ReportFrame /> : (
            <section className={styles.empty} aria-labelledby="report-login">
              <h2 id="report-login">ورود به داشبورد ۲</h2>
              <p className={styles.help}>برای مشاهده گزارش‌ها، با حسابی که پشتیبان سایت به شما داده وارد شوید.</p>
              <form className={styles.form} action="/dashboard_2/session" method="post">
                <label>نام کاربری<input name="username" autoComplete="username" dir="ltr" required maxLength={41} /></label>
                <label>گذرواژه<input name="password" autoComplete="current-password" type="password" dir="ltr" required maxLength={96} /></label>
                {error && <p role="alert" className={styles.error}>{error}</p>}
                <button className="button button--primary">ورود به سایت</button>
              </form>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
