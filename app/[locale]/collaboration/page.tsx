import type {Metadata} from "next";
import {
  Check,
  Clock3
} from "lucide-react";
import {notFound} from "next/navigation";
import {BrandMark} from "@/components/brand-mark";
import {CollaborationForm} from "@/components/collaboration-form";
import {PageBackLink} from "@/components/page-back-link";
import {Reveal} from "@/components/reveal";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {collaborationContent} from "@/lib/collaboration-content";
import {content} from "@/lib/content";
import {isLocale, site, type Locale} from "@/lib/site";

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) return {};

  const locale = localeValue as Locale;
  const copy = collaborationContent[locale];
  const canonical = `${site.url}/${locale}/collaboration`;

  return {
    title: copy.meta.title,
    description: copy.meta.description,
    keywords: copy.meta.keywords,
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa/collaboration`,
        en: `${site.url}/en/collaboration`,
        "x-default": `${site.url}/fa/collaboration`
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
      url: canonical,
      siteName: locale === "fa" ? site.nameFa : site.nameEn,
      title: copy.meta.title,
      description: copy.meta.description,
      images: [{url: "/opengraph-image", width: 1200, height: 630}]
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
      images: ["/opengraph-image"]
    }
  };
}

export default async function CollaborationPage({params}: PageProps) {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) notFound();

  const locale = localeValue as Locale;
  const copy = collaborationContent[locale];
  const siteCopy = content[locale];
  const phone = locale === "fa" ? site.phoneDisplayFa : site.phoneDisplayEn;
  const navigation = [
    ["services", siteCopy.nav.services],
    ["solutions", siteCopy.nav.solutions],
    ["approach", siteCopy.nav.approach],
    ["about", siteCopy.nav.about],
    ["team", siteCopy.nav.team],
    ["contact", siteCopy.nav.contact]
  ];
  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric"
  }).format(new Date());

  return (
    <>
      <SiteHeader
        locale={locale}
        content={siteCopy}
        page="collaboration"
      />

      <main id="main" className="collaboration-page">
        <section className="collaboration-hero" id="top">
          <div className="collaboration-hero__grid" aria-hidden="true" />
          <div className="collaboration-hero__orb" aria-hidden="true" />
          <div className="shell collaboration-hero__inner">
            <Reveal className="collaboration-hero__copy">
              <span className="hero__eyebrow">
                <i />
                {copy.hero.eyebrow}
              </span>
              <h1>
                {copy.hero.title}
                <strong>{copy.hero.accent}</strong>
              </h1>
              <p>{copy.hero.description}</p>
              <div className="collaboration-hero__response">
                <span><Clock3 aria-hidden="true" /></span>
                <div>
                  <small>{copy.hero.responseTime}</small>
                  <b>{copy.hero.responseValue}</b>
                </div>
              </div>
            </Reveal>

            <Reveal className="collaboration-hero__signal" delay={0.12}>
              <div className="collaboration-signal" aria-hidden="true">
                <span className="collaboration-signal__ring collaboration-signal__ring--one" />
                <span className="collaboration-signal__ring collaboration-signal__ring--two" />
                <span className="collaboration-signal__ring collaboration-signal__ring--three" />
                <span className="collaboration-signal__core">
                  <BrandMark compact />
                </span>
                <i className="collaboration-signal__node collaboration-signal__node--one" />
                <i className="collaboration-signal__node collaboration-signal__node--two" />
                <i className="collaboration-signal__node collaboration-signal__node--three" />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="collaboration-body">
          <div className="shell">
            <PageBackLink href={`/${locale}`} locale={locale} label={copy.nav.back} />
            <div className="collaboration-body__grid">
            <Reveal className="collaboration-form-card">
              <div className="collaboration-form-card__heading">
                <span className="section-kicker">
                  <i />
                  {copy.form.stepLabel}
                </span>
                <h2>{copy.form.title}</h2>
                <p>{copy.form.description}</p>
              </div>

              <CollaborationForm
                copy={copy.form}
                locale={locale}
                phone={phone}
                phoneHref={site.phoneHref}
              />
            </Reveal>

            <aside className="collaboration-aside">
              <Reveal>
                <span className="section-kicker">
                  <i />
                  {copy.aside.label}
                </span>
                <h2>{copy.aside.title}</h2>
                <p>{copy.aside.description}</p>
              </Reveal>

              <div className="collaboration-steps">
                {copy.aside.steps.map((step, index) => (
                  <Reveal className="collaboration-step" delay={index * 0.08} key={step.number}>
                    <span>{step.number}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal className="collaboration-fit" delay={0.16}>
                <h3>{copy.aside.suitableLabel}</h3>
                <ul>
                  {copy.aside.suitableItems.map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </aside>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        locale={locale}
        year={year}
        summary={copy.footer.summary}
        rights={copy.footer.rights}
        backToTop={siteCopy.footer.backToTop}
        navigation={navigation.map(([id, label]) => ({href: `/${locale}#${id}`, label}))}
      />
    </>
  );
}
