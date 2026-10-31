import type {Metadata} from "next";
import {ArrowUpLeft, ClipboardList, Clock3} from "lucide-react";
import {notFound} from "next/navigation";
import {PageBackLink} from "@/components/page-back-link";
import {Reveal} from "@/components/reveal";
import {SectionHeading} from "@/components/section-heading";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {getManagedContent} from "@/lib/managed-content";
import {publicSurveys} from "@/lib/surveys-catalog";
import {isLocale, site, type Locale} from "@/lib/site";

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) return {};

  const locale = localeValue as Locale;
  const copy = content[locale];
  const canonical = `${site.url}/${locale}/surveys`;

  return {
    title: `${copy.nav.surveys} | ${locale === "fa" ? site.nameFa : site.nameEn}`,
    description: copy.surveys.description,
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa/surveys`,
        en: `${site.url}/en/surveys`,
        "x-default": `${site.url}/fa/surveys`
      }
    }
  };
}

export default async function SurveysPage({params}: PageProps) {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) notFound();

  const locale = localeValue as Locale;
  const copy = await getManagedContent(locale, content[locale]);
  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric"
  }).format(new Date());
  const activeSurveys = publicSurveys.filter((s) => s.active);

  return (
    <>
      <SiteHeader locale={locale} content={copy} page="surveys" />

      <main id="main" className="surveys-page">
        <section className="surveys-hero">
          <div className="shell">
            <Reveal>
              <SectionHeading
                label={copy.surveys.label}
                title={copy.surveys.title}
                description={copy.surveys.description}
              />
            </Reveal>
          </div>
        </section>

        <section className="section surveys-list">
          <div className="shell">
            <PageBackLink href={`/${locale}`} locale={locale} />
            <div className="surveys-list__grid">
            {activeSurveys.map((survey, index) => (
              <Reveal className="survey-list-card" delay={index * 0.08} key={survey.id}>
                <span className="survey-list-card__icon">
                  <ClipboardList aria-hidden="true" />
                </span>
                <h2>{survey.title[locale]}</h2>
                <p>{survey.description[locale]}</p>
                <ul className="survey-list-card__meta">
                  <li>
                    <Clock3 aria-hidden="true" />
                    {survey.duration[locale]}
                  </li>
                  <li>{survey.audience[locale]}</li>
                </ul>
                <a className="button button--primary" href={survey.href(locale)}>
                  {copy.surveys.cardAction}
                  <ArrowUpLeft aria-hidden="true" />
                </a>
              </Reveal>
            ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        locale={locale}
        year={year}
        summary={copy.footer.summary}
        rights={copy.footer.rights}
        backToTop={copy.footer.backToTop}
        navigation={[
          {href: `/${locale}#services`, label: copy.nav.services},
          {href: `/${locale}/surveys`, label: copy.nav.surveys},
          {href: `/${locale}#contact`, label: copy.nav.contact}
        ]}
      />
    </>
  );
}
