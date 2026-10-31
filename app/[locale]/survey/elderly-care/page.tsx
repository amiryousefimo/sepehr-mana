import type {Metadata} from "next";
import {ArrowLeft} from "lucide-react";
import {notFound} from "next/navigation";
import {ElderlyCareSurveyForm} from "@/components/elderly-care-survey-form";
import {Reveal} from "@/components/reveal";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {elderlyCareSurveyPage} from "@/lib/survey-page-content";
import {isLocale, site, type Locale} from "@/lib/site";

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) return {};

  const locale = localeValue as Locale;
  const copy = elderlyCareSurveyPage[locale];
  const canonical = `${site.url}/${locale}/survey/elderly-care`;

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    keywords: copy.meta.keywords,
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa/survey/elderly-care`,
        en: `${site.url}/en/survey/elderly-care`,
        "x-default": `${site.url}/fa/survey/elderly-care`
      }
    },
    robots: {index: true, follow: true}
  };
}

export default async function ElderlyCareSurveyPage({params}: PageProps) {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) notFound();

  const locale = localeValue as Locale;
  const copy = elderlyCareSurveyPage[locale];
  const siteCopy = content[locale];
  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric"
  }).format(new Date());

  return (
    <>
      <SiteHeader locale={locale} content={siteCopy} page="home" />

      <main id="main" className="survey-page">
        <section className="survey-hero">
          <div className="shell survey-hero__nav">
            <a className="collaboration-hero__back" href={`/${locale}`}>
              <ArrowLeft aria-hidden="true" />
              {copy.nav.back}
            </a>
          </div>
          <div className="shell survey-hero__inner">
            <Reveal className="survey-hero__copy">
              <span className="hero__eyebrow">
                <i />
                {copy.hero.eyebrow}
              </span>
              <h1>
                {copy.hero.title}
                <strong>{copy.hero.accent}</strong>
              </h1>
              <p>{copy.hero.description}</p>
            </Reveal>
          </div>
        </section>

        <section className="survey-body">
          <div className="shell">
            <Reveal className="survey-card">
              <ElderlyCareSurveyForm copy={copy.form} intro={copy.intro} locale={locale} />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter
        locale={locale}
        year={year}
        summary={siteCopy.footer.summary}
        rights={siteCopy.footer.rights}
        backToTop={siteCopy.footer.backToTop}
        navigation={[
          {href: `/${locale}#services`, label: siteCopy.nav.services},
          {href: `/${locale}#contact`, label: siteCopy.nav.contact}
        ]}
      />
    </>
  );
}
