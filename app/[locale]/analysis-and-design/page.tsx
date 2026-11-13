import {notFound} from "next/navigation";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {getManagedContent} from "@/lib/managed-content";
import {isLocale} from "@/lib/site";
import {getDidbanContent} from "@/lib/didban-content";

export const metadata = {title: "تحلیل و طراحی | دیدبان", robots: {index: false, follow: false}};
export default async function AnalysisPage({params}: {params: {locale: string}}) {
  if (!isLocale(params.locale)) notFound();
  const locale=params.locale;
  const copy=await getManagedContent(locale, content[locale]);
  const page=await getDidbanContent(locale);
  return <><SiteHeader locale={locale} content={copy} />
    <main id="main" style={{paddingTop: 110}} dir="rtl">
      <div className="shell" style={{paddingBottom: 24}}><h1>{page.title}</h1>
        <p>{page.summary}</p>
        <p>با حساب شخصی وارد شوید. راهنمای گام‌به‌گام در اولین صفحهٔ میزکار قرار دارد.</p>
        <a href="/didban" target="_blank" rel="noopener noreferrer">بازکردن دیدبان در صفحهٔ کامل</a>
      </div>
      <iframe title="دیدبان؛ میزکار تحلیل و طراحی" src="/didban" style={{width: "100%", height: "85vh", minHeight: 650, border: 0}} />
    </main></>;
}
