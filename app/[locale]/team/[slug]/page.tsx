import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Image from "next/image";
import {GraduationCap} from "lucide-react";
import {PageBackLink} from "@/components/page-back-link";
import {Reveal} from "@/components/reveal";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {getManagedContent} from "@/lib/managed-content";
import {isLocale, site, slugifyName, type Locale} from "@/lib/site";

type PageProps = {
  params: Promise<{locale: string; slug: string}>;
};

export async function generateStaticParams() {
  const locales = ["fa", "en"] as const;
  const params: {locale: string; slug: string}[] = [];

  for (const locale of locales) {
    try {
      const copy = await getManagedContent(locale, content[locale]);
      const people = copy.team?.people || [];
      for (const person of people) {
        params.push({
          locale,
          slug: slugifyName(person.name),
        });
      }
    } catch {
      // fallback خالی
    }
  }

  return params;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeValue, slug} = await params;
  if (!isLocale(localeValue)) return {};

  const locale = localeValue as Locale;
  const copy = await getManagedContent(locale, content[locale]);
  const person = (copy.team?.people || []).find(
    (p) => slugifyName(p.name) === slug
  );

  if (!person) return {};

  const canonical = `${site.url}/${locale}/team/${slug}`;
  const title =
    locale === "fa"
      ? `${person.name} | ${person.role} | ${site.nameFa}`
      : `${person.name} | ${person.role} | ${site.nameEn}`;

  const description = person.introduction || copy.meta.description;

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa/team/${slug}`,
        en: `${site.url}/en/team/${slug}`,
        "x-default": `${site.url}/fa/team/${slug}`,
      },
    },
    openGraph: {
      type: "profile",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: canonical,
      siteName: locale === "fa" ? site.nameFa : site.nameEn,
      title,
      description,
      images: person.photoUrl
        ? [{url: person.photoUrl, width: 800, height: 800, alt: person.name}]
        : [{url: "/opengraph-image", width: 1200, height: 630}],
    },
  };
}

export default async function TeamMemberPage({params}: PageProps) {
  const {locale: localeValue, slug} = await params;
  if (!isLocale(localeValue)) notFound();

  const locale = localeValue as Locale;
  const copy = await getManagedContent(locale, content[locale]);
  const person = (copy.team?.people || []).find(
    (p) => slugifyName(p.name) === slug
  );

  if (!person) notFound();

  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <SiteHeader locale={locale} content={copy} />
      <main id="main">
        <section className="section inner-page-section">
          <div className="shell" style={{maxWidth: 900}}>
            <PageBackLink
              href={`/${locale}/team`}
              locale={locale}
              label={locale === "fa" ? "بازگشت به تیم" : "Back to team"}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                gap: 48,
                alignItems: "start",
              }}
            >
              <Reveal>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 24,
                    overflow: "hidden",
                    background: "var(--paper)",
                  }}
                >
                  {person.photoUrl ? (
                    <Image
                      src={person.photoUrl}
                      alt={person.name}
                      fill
                      sizes="280px"
                      style={{objectFit: "cover"}}
                      priority
                    />
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        placeItems: "center",
                        height: "100%",
                        fontSize: "3rem",
                        fontWeight: 800,
                        color: "var(--blue)",
                      }}
                    >
                      {person.initials}
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <span
                  style={{
                    display: "inline-block",
                    marginBottom: 12,
                    color: "var(--blue)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  {person.role}
                </span>
                <h1 style={{margin: "0 0 20px", fontSize: "clamp(1.8rem, 4vw, 2.6rem)"}}>
                  {person.name}
                </h1>
                <p style={{fontSize: "1.15rem", lineHeight: 1.9, color: "#4e6679"}}>
                  {person.introduction}
                </p>

                {person.education && person.education.length > 0 && (
                  <div style={{marginTop: 36}}>
                    <h3 style={{marginBottom: 16, fontSize: "1.1rem"}}>
                      {locale === "fa" ? "سوابق تحصیلی و تخصصی" : "Education & Background"}
                    </h3>
                    <ul style={{listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12}}>
                      {person.education.map((edu) => (
                        <li
                          key={edu}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            color: "#334155",
                          }}
                        >
                          <GraduationCap size={18} style={{marginTop: 3, flexShrink: 0}} />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Reveal>
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