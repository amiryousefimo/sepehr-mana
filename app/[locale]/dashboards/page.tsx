import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {getManagedContent} from "@/lib/managed-content";
import {isLocale} from "@/lib/site";

export const metadata: Metadata = {
  title: "داشبوردها | Dashboards | سپهر مانا",
  description: "نمونه تعاملی تحلیل منابع و مصارف، پایداری بیمه، درمان، بودجه و سناریوهای نقدینگی با داده کاملاً ساختگی."
};

export default async function DashboardsPage({params}: {params: {locale: string}}) {
  if (!isLocale(params.locale)) notFound();
  const locale=params.locale;
  const copy=await getManagedContent(locale,content[locale]);
  const fa=locale==="fa";
  return <><SiteHeader locale={locale} content={copy} page="dashboards" />
    <main id="main" style={{paddingTop:110}}>
      <section className="shell" style={{paddingBottom:24}}>
        <p style={{color:"var(--color-muted)",fontSize:14}}>{fa?"نمونه‌کار هوش تجاری و تحلیل تصمیم":"Business intelligence and decision analytics portfolio"}</p>
        <h1>{fa?"داشبوردها":"Dashboards"}</h1>
        <p>{fa?"رصد؛ نمونه تعاملی حکمرانی مالی بیمه‌های اجتماعی. ۹ گزارش برای تحلیل منابع و مصارف، طرح‌ها و مناطق، درمان، بودجه، مطالبات دولت، وصول حق بیمه، شرکت‌داری، ریسک نقدینگی و کیفیت داده.":"Rasad: nine interactive social insurance analytics reports covering financial balance, schemes, healthcare, budgets, government receivables, collections, subsidiaries, liquidity and data quality. The report interface is in Persian."}</p>
        <p>{fa?"تمام ارقام ساختگی‌اند و عملکرد واقعی سازمان تأمین اجتماعی را نشان نمی‌دهند. نمونه مستقل است و به پایگاه داده محلی یا سامانه‌های سازمان متصل نیست.":"All figures are synthetic, with no representation of actual Social Security Organization performance. This self-contained sample has no connection to a local database or organizational systems."}</p>
        <a className="button button--primary" href="/dashboard-demo/index.html" target="_blank" rel="noopener noreferrer">{fa?"بازکردن داشبورد در صفحه کامل ↗":"Open full-screen dashboard ↗"}</a>
        {" "}
        <a className="button button--secondary" href="/dashboard_2">{fa?"داشبورد ۲ در Power BI":"Dashboard 2 in Power BI"}</a>
      </section>
      <iframe title={fa?"رصد؛ داشبورد نمایشی با داده ساختگی":"Rasad synthetic financial dashboard"} src="/dashboard-demo/index.html" loading="lazy" style={{width:"100%",height:"88vh",minHeight:740,border:0,display:"block"}} />
    </main>
  </>;
}
