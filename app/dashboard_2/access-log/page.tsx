import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {rasadAdminSession} from "@/lib/rasad-admin";
import {auditDays, readLoginAudit, type AuditReason, type AuditResult} from "@/lib/rasad-login-audit";
import styles from "./access-log.module.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {title: "گزارش ورودها | رصد", robots: {index: false, follow: false}};

const resultNames: Record<AuditResult, string> = {
  accepted: "ورود موفق", rejected: "ورود ناموفق", blocked: "درخواست رد شد",
  unavailable: "سرویس ورود آماده نبود", report_open: "گزارش باز شد"
};
const reasonNames: Record<AuditReason, string> = {
  credentials_verified: "اعتبار حساب تأیید و نشست صادر شد",
  wrong_password: "حساب شناخته شد؛ گذرواژه مطابقت نداشت",
  unknown_account: "نام کاربری در حساب‌های مشاهده‌گر پیدا نشد",
  invalid_origin: "مبدأ درخواست مجاز نبود؛ گذرواژه بررسی نشد",
  invalid_form: "فرمت یا حجم درخواست نامعتبر بود؛ گذرواژه بررسی نشد",
  server_not_configured: "تنظیمات ورود مدیر در سرور کامل نبود",
  session_error: "گذرواژه تأیید شد؛ سرور نتوانست نشست بسازد",
  report_loaded: "HTML گزارش برای یک نشست معتبر ارسال شد"
};
const ipLabels = {
  trusted_header: "پراکسی تنظیم‌شده", forwarded_hint: "گزارش پراکسی؛ تأیید نشده", unknown: "در دسترس نیست"
};
const formatter = new Intl.DateTimeFormat("fa-IR", {dateStyle: "short", timeStyle: "medium", timeZone: "Asia/Tehran"});

export default async function RasadAccessLog({searchParams}: {searchParams: Record<string, string | string[] | undefined>}) {
  if (!rasadAdminSession()) notFound();
  const query = (key: string, validate: RegExp) => {
    const raw = searchParams[key];
    return typeof raw === "string" && validate.test(raw.trim().toLowerCase()) ? raw.trim().toLowerCase() : undefined;
  };
  const result = typeof searchParams.result === "string" && Object.hasOwn(resultNames, searchParams.result) ? searchParams.result : undefined;
  const account = query("account", /^[a-z0-9][a-z0-9._-]{0,40}$/);
  const ref = query("ref", /^[a-f0-9-]{36}$/);
  const audit = await readLoginAudit({result, account, ref});
  return (
    <main className={styles.page} dir="rtl">
      <div className={styles.inner}>
        <header className={styles.head}>
          <span>فقط مدیران · داشبورد ۲</span>
          <h1>گزارش ورودها</h1>
          <p>برای پیگیری ورود ناموفق، شناسه‌ای را که کاربر دیده جست‌وجو کنید. این صفحه تلاش‌های رسیده به سرور و بازشدن گزارش را تا {auditDays.toLocaleString("fa-IR")} روز نشان می‌دهد.</p>
          <a href="/dashboard_2">بازگشت به رصد</a>
        </header>
        <section className={styles.panel} aria-label="جست‌وجوی تلاش‌های ورود">
          <form className={styles.filters} method="get" action="/dashboard_2/access-log">
            <label>نتیجه<select name="result" defaultValue={result ?? ""}><option value="">همهٔ رویدادها</option>
              {Object.entries(resultNames).map(([value, name]) => <option key={value} value={value}>{name}</option>)}
            </select></label>
            <label>نام حساب<input dir="ltr" name="account" defaultValue={account} maxLength={41} placeholder="admin" /></label>
            <label>شناسهٔ پیگیری<input dir="ltr" name="ref" defaultValue={ref} maxLength={36} /></label>
            <button className="button button--primary">جست‌وجو</button>
            <a href="/dashboard_2/access-log">پاک‌کردن فیلترها</a>
          </form>
          <p className={styles.info}>ساعت به وقت تهران است. در حساب مشترک <bdi>admin</bdi> این جدول حساب و IP را نشان می‌دهد؛ نام شخص را از آن نمی‌توان فهمید. «بازشدن گزارش» با «درست بودن گذرواژه» دو رخداد جداست. چیزی که به سرور نرسد در این فهرست دیده نمی‌شود.</p>
          {audit.unavailable && <p role="alert" className={styles.notice}>ذخیره‌گاه رویدادها موقتاً در دسترس نیست. نتیجهٔ خالی در این وضعیت نشان نمی‌دهد که کسی تلاش نکرده است.</p>}
          {audit.partial && <p className={styles.notice}>نمایش محدود به جدیدترین بخش فایل‌ها و ۲۰۰ نتیجه است. برای پیدا کردن رویداد مشخص، نام حساب یا شناسهٔ پیگیری را جست‌وجو کنید.</p>}
          {!audit.events.length && !audit.unavailable && <p className={styles.info}>با این فیلترها رویدادی پیدا نشد.</p>}
          {!!audit.events.length && <div className={styles.scroll}>
            <table className={styles.table}>
              <caption className={styles.caption}>تازه‌ترین رویدادهای مطابق جست‌وجو</caption>
              <thead><tr><th scope="col">زمان</th><th scope="col">حساب</th><th scope="col">IP و منبع آن</th><th scope="col">مسیر</th><th scope="col">نتیجه و علت</th><th scope="col">شناسهٔ پیگیری</th></tr></thead>
              <tbody>{audit.events.map(event => <tr key={event.id}>
                <td><time dateTime={event.time}>{formatter.format(new Date(event.time))}</time></td>
                <td><bdi>{event.account ?? "—"}</bdi></td>
                <td><bdi>{event.ip ?? "—"}</bdi><small>{ipLabels[event.ipSource]}</small></td>
                <td>{event.source === "site-admin" ? "ورود مدیر سایت" : "داشبورد رصد"}</td>
                <td><strong data-outcome={event.result}>{resultNames[event.result]}</strong><small>{reasonNames[event.reason]}</small></td>
                <td><a href={`/dashboard_2/access-log?ref=${event.id}`}><bdi>{event.id}</bdi></a></td>
              </tr>)}</tbody>
            </table>
          </div>}
        </section>
      </div>
    </main>
  );
}
