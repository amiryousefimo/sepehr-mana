import type {Metadata} from "next";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {viewSession} from "@/lib/rasad-session";
import {ReportFrame} from "./report-frame";
import {InlineGuide} from "./inline-guide";
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
              <p className={styles.kicker}>داشبوردها / رصد بیمه و حکمرانی مالی <InlineGuide title="مسیر داشبورد" text="از فهرست داشبوردهای سایت می‌توانید به رصد برگردید. این صفحه ورودی گزارش‌های حکمرانی و پرونده‌های نمونه است." /></p>
              <div className={styles.guideRow}><h1>داشبورد ۲</h1><InlineGuide title="داشبورد ۲" text="پس از ورود، «حکمرانی» را برای دیدن آمار کل و «پروفایل فرد» را برای یک پروندهٔ نمونه انتخاب کنید. علامت سؤال کنار هر گزارش یا شاخص، روش خواندن و محاسبه را توضیح می‌دهد." /></div>
              <p>۲۲ گزارش تعاملی حکمرانی و پرونده‌های نمونه. تمام ارقام و پرونده‌ها آزمایشی‌اند.</p>
            </div>
            {signedIn && <form className={styles.guideRow} action="/dashboard_2/session" method="post">
              <button className="button button--secondary" name="action" value="logout">خروج از حساب سایت</button>
              <InlineGuide title="خروج از حساب سایت" text="نشست داشبورد را پایان می‌دهد. اگر از دستگاه مشترک استفاده می‌کنید پس از پایان کار خارج شوید؛ برای دیدن دوباره گزارش، ورود لازم است." />
            </form>}
          </header>
          {signedIn ? <ReportFrame /> : (
            <section className={styles.empty} aria-labelledby="report-login">
              <div className={styles.guideRow}><h2 id="report-login">ورود به داشبورد ۲</h2><InlineGuide title="ورود به داشبورد ۲" text="این فرم حساب خود سایت را بررسی می‌کند. اگر حساب ندارید، از پشتیبان سایت دسترسی داشبورد ۲ را بخواهید." /></div>
              <p className={styles.help}>برای مشاهده گزارش‌ها، با حسابی که پشتیبان سایت به شما داده وارد شوید.</p>
              <form className={styles.form} action="/dashboard_2/session" method="post">
                <div className={styles.guideField}><div className={styles.guideRow}><label htmlFor="rasad-username">نام کاربری</label><InlineGuide title="نام کاربری" text="شناسه‌ای را وارد کنید که پشتیبان سایت برای داشبورد به شما داده است. اگر آن را ندارید، از پشتیبان درخواست کنید." /></div><input id="rasad-username" name="username" autoComplete="username" dir="ltr" required maxLength={41} /></div>
                <div className={styles.guideField}><div className={styles.guideRow}><label htmlFor="rasad-password">گذرواژه</label><InlineGuide title="گذرواژه" text="گذرواژهٔ همان حساب سایت را وارد کنید. اگر ورود ناموفق بود، زبان صفحه‌کلید و فاصلهٔ اضافه را بررسی کنید." /></div><input id="rasad-password" name="password" autoComplete="current-password" type="password" dir="ltr" required maxLength={96} /></div>
                {error && <div className={styles.guideRow}><p role="alert" className={styles.error}>{error}</p><InlineGuide title="مشکل ورود" text="اگر نام کاربری و گذرواژه درست‌اند، یک‌بار دیگر تلاش کنید. اگر پیام ادامه داشت، متن پیام را به پشتیبان سایت بگویید." /></div>}
                <div className={styles.guideRow}><button className="button button--primary">ورود به سایت</button><InlineGuide title="دکمهٔ ورود" text="اطلاعات حساب را بررسی می‌کند و در صورت داشتن دسترسی، گزارش‌ها را همین‌جا باز می‌کند." /></div>
              </form>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
