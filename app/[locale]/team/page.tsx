import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Image from "next/image";
import {PageBackLink} from "@/components/page-back-link";
import {Reveal} from "@/components/reveal";
import {SectionHeading} from "@/components/section-heading";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {getManagedContent} from "@/lib/managed-content";
import {isLocale, site, slugifyName, type Locale} from "@/lib/site";

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) return {};

  const locale = localeValue as Locale;
  const copy = await getManagedContent(locale, content[locale]);
  const canonical = `${site.url}/${locale}/team`;

  const title =
    locale === "fa"
      ? `تیم | ${copy.meta.title}`
      : `Team | ${copy.meta.title}`;

  const description =
    locale === "fa"
      ? "آشنایی با اعضای تیم تکاپوگران سپهر مانا؛ متخصصان نرم‌افزار، داده، مدیریت و مشاوره فناوری."
      : "Meet the team at Takapoo Garan Sepehr Mana — software, data, management and technology experts.";

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa/team`,
        en: `${site.url}/en/team`,
        "x-default": `${site.url}/fa/team`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: canonical,
      siteName: locale === "fa" ? site.nameFa : site.nameEn,
      title,
      description,
      images: [{url: "/opengraph-image", width: 1200, height: 630}],
    },
  };
}

export default async function TeamPage({params}: PageProps) {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) notFound();

  const locale = localeValue as Locale;
  const copy = await getManagedContent(locale, content[locale]);
  const people = copy.team?.people || [];

  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <SiteHeader locale={locale} content={copy} />
      <main id="main">
        <section className="section inner-page-section">
          <div className="shell">
            <PageBackLink href={`/${locale}`} locale={locale} />
            <Reveal>
              <SectionHeading
                label={copy.team.label}
                title={copy.team.title}
                description={copy.team.description}
              />
            </Reveal>

            <div className="team__grid" style={{marginTop: 56}}>
              {people.map((person, index) => {
                const slug = slugifyName(person.name);
                return (
                  <Reveal key={person.name + index} delay={index * 0.07}>
                    <a
                      href={`/${locale}/team/${slug}`}
                      className="person-card"
                      style={{textDecoration: "none", color: "inherit", display: "block"}}
                    >
                      <div className="person-card__portrait">
                        {person.photoUrl ? (
                          <Image
                            src={person.photoUrl}
                            alt={person.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            style={{objectFit: "cover"}}
                          />
                        ) : (
                          <>
                            <span>{person.initials}</span>
                            <small>{copy.team.photoPending}</small>
                          </>
                        )}
                      </div>
                      <div className="person-card__content">
                        <span className="person-card__role">{person.role}</span>
                        <h3>{person.name}</h3>
                        <p className="person-card__introduction">{person.introduction}</p>
                      </div>
                    </a>
                  </Reveal>
                );
              })}
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
        navigation={[]}
      />
    </>
  );
}