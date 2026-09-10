import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft, ArrowRight, Check, Clock, Globe, Layers, Users} from "lucide-react";
import Image from "next/image";
import {BrandMark} from "@/components/brand-mark";
import {Reveal} from "@/components/reveal";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {projectsContent} from "@/lib/projects";
import {content} from "@/lib/content";
import {isLocale, site, type Locale} from "@/lib/site";

type PageProps = {
  params: Promise<{locale: string; slug: string}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale: localeValue, slug} = await params;
  if (!isLocale(localeValue)) return {};

  const locale = localeValue as Locale;
  const projects = projectsContent[locale].projects;
  const project = projects.find((p) => p.slug === slug && p.published);
  if (!project) return {};

  const copy = content[locale];
  const canonical = `${site.url}/${locale}/projects/${slug}`;

  return {
    metadataBase: new URL(site.url),
    title: `${project.title} | ${copy.meta.title}`,
    description: project.shortDescription,
    keywords: [...copy.meta.keywords, project.title, project.category || "", "case study"],
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa/projects/${slug}`,
        en: `${site.url}/en/projects/${slug}`,
        "x-default": `${site.url}/fa/projects/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
      url: canonical,
      siteName: locale === "fa" ? site.nameFa : site.nameEn,
      title: `${project.title} | ${copy.meta.title}`,
      description: project.shortDescription,
      images: [{url: project.thumbnail, width: 1200, height: 630}],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${copy.meta.title}`,
      description: project.shortDescription,
      images: [project.thumbnail],
    },
  };
}

export async function generateStaticParams() {
  const params: {locale: Locale; slug: string}[] = [];
  for (const locale of ["fa", "en"] as Locale[]) {
    for (const project of projectsContent[locale].projects) {
      if (project.published) {
        params.push({locale, slug: project.slug});
      }
    }
  }
  return params;
}

export default async function ProjectPage({params}: PageProps) {
  const {locale: localeValue, slug} = await params;
  if (!isLocale(localeValue)) notFound();

  const locale = localeValue as Locale;
  const copy = projectsContent[locale];
  const siteCopy = content[locale];
  const project = copy.projects.find((p) => p.slug === slug && p.published);
  if (!project) notFound();

  const phone = locale === "fa" ? site.phoneDisplayFa : site.phoneDisplayEn;
  const navigation = [
    ["services", siteCopy.nav.services],
    ["solutions", siteCopy.nav.solutions],
    ["approach", siteCopy.nav.approach],
    ["about", siteCopy.nav.about],
    ["team", siteCopy.nav.team],
    ["contact", siteCopy.nav.contact],
  ];
  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <SiteHeader
        locale={locale}
        content={siteCopy}
        page="projects"
      />

      <main id="main" className="project-page">
        {/* Hero Section */}
        <section className="project-hero" id="top">
          <div className="project-hero__grid" aria-hidden="true" />
          <div className="project-hero__orb" aria-hidden="true" />
          <div className="shell project-hero__nav">
            <a className="project-hero__back" href={`/${locale}/projects`}>
              <ArrowLeft aria-hidden="true" />
              {copy.viewAllProjects}
            </a>
          </div>
          <div className="shell project-hero__inner">
            <Reveal className="project-hero__copy">
              <span className="project-hero__kicker">
                <i />
                {project.category || (locale === "fa" ? "پروژه" : "Project")}
              </span>
              <h1>{project.title}</h1>
              {project.slogan && (
                <p
                  style={{
                    marginTop: 18,
                    marginBottom: 28,
                    padding: "14px 20px",
                    borderRadius: 12,
                    background: "rgba(14, 165, 233, 0.12)",
                    border: "1px solid rgba(14, 165, 233, 0.25)",
                    color: "#7dd3fc",
                    fontSize: "1.05rem",
                    fontWeight: 650,
                    lineHeight: 1.7,
                    maxWidth: 720,
                  }}
                >
                  {project.slogan}
                </p>
              )}
              <p>{project.description}</p>
              <div className="project-hero__meta">
                {project.year && (
                  <div className="project-hero__meta-item">
                    <Clock aria-hidden="true" />
                    <div>
                      <small>{locale === "fa" ? "سال" : "Year"}</small>
                      <b>{project.year}</b>
                    </div>
                  </div>
                )}
                {project.client && (
                  <div className="project-hero__meta-item">
                    <Globe aria-hidden="true" />
                    <div>
                      <small>{locale === "fa" ? "مشتری" : "Client"}</small>
                      <b>{project.client}</b>
                    </div>
                  </div>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-hero__meta-item">
                    <Layers aria-hidden="true" />
                    <div>
                      <small>{locale === "fa" ? "فناوری‌ها" : "Technologies"}</small>
                      <b>{project.technologies.length} {locale === "fa" ? "فناوری" : "technologies"}</b>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal className="project-hero__visual" delay={0.12}>
              <div className="project-hero__image-wrapper">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="project-hero__image"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Gallery Section */}
        {project.images.length > 0 && (
          <section className="project-gallery">
            <div className="shell">
              <Reveal>
                <h2 className="project-gallery__title">
                  {locale === "fa" ? "نمای پروژه" : "Project Gallery"}
                </h2>
              </Reveal>
              <div className="project-gallery__grid">
                {project.images.map((image, index) => (
                  <Reveal className="project-gallery__item" delay={index * 0.06} key={image}>
                    <Image
                      src={image}
                      alt={`${project.title} - ${locale === "fa" ? "تصویر" : "Image"} ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 33vw"
                      className="project-gallery__image"
                      loading="lazy"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Details Section */}
        <section className="project-details">
          <div className="shell project-details__grid">
            <Reveal className="project-details__main">
              <h2>{locale === "fa" ? "شرح پروژه" : "Project Overview"}</h2>
              <p>{project.description}</p>
              {project.features && project.features.length > 0 && (
                <div className="project-features" style={{ marginTop: 48 }}>
                  <h3 style={{ marginBottom: 28 }}>
                    {locale === "fa" ? "قابلیت‌های اصلی سامانه" : "Core System Features"}
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 20,
                    }}
                  >
                    {project.features.map((feature) => (
                      <div
                        key={feature.title}
                        style={{
                          padding: "22px 20px",
                          borderRadius: 16,
                          border: "1px solid var(--border-light)",
                          background: "linear-gradient(145deg, #ffffff, #f5fbff)",
                          boxShadow: "0 10px 30px rgba(7, 19, 34, 0.05)",
                        }}
                      >
                        <h4
                          style={{
                            margin: "0 0 14px",
                            fontSize: "1.05rem",
                            fontWeight: 800,
                            color: "var(--ink-900)",
                          }}
                        >
                          {feature.title}
                        </h4>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                          {feature.items.map((item) => (
                            <li
                              key={item}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: "0.92rem",
                                color: "#4e6679",
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: "var(--blue)",
                                  flexShrink: 0,
                                }}
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {project.outcomes && project.outcomes.length > 0 && (
                <div className="project-outcomes">
                  <h3>{locale === "fa" ? "نتایج و دستاوردها" : "Outcomes & Results"}</h3>
                  <ul>
                    {project.outcomes.map((outcome, index) => (
                      <li key={index}>
                        <Check aria-hidden="true" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.technologies && project.technologies.length > 0 && (
                <div className="project-technologies">
                  <h3>{locale === "fa" ? "فناوری‌های به کار رفته" : "Technologies Used"}</h3>
                  <div className="project-tech-cloud">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="project-tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>

            <Reveal className="project-details__sidebar" delay={0.12}>
              <div className="project-sidebar">
                <div className="project-sidebar__card">
                  <h3>{locale === "fa" ? "اطلاعات پروژه" : "Project Info"}</h3>
                  <dl className="project-sidebar__list">
                    {project.year && (
                      <>
                        <dt>{locale === "fa" ? "سال اجرا" : "Year"}</dt>
                        <dd>{project.year}</dd>
                      </>
                    )}
                    {project.category && (
                      <>
                        <dt>{locale === "fa" ? "دسته‌بندی" : "Category"}</dt>
                        <dd>{project.category}</dd>
                      </>
                    )}
                    {project.client && (
                      <>
                        <dt>{locale === "fa" ? "مشتری" : "Client"}</dt>
                        <dd>{project.client}</dd>
                      </>
                    )}
                  </dl>
                </div>

                <div className="project-sidebar__card">
                  <h3>{locale === "fa" ? "تیم پروژه" : "Project Team"}</h3>
                  <p className="project-sidebar__note">
                    {locale === "fa"
                      ? "تیم چندتخصصی از مهندسان، طراحان و تحلیل‌گران"
                      : "Multidisciplinary team of engineers, designers, and analysts"}
                  </p>
                </div>

                <a
                  className="project-sidebar__cta"
                  href={`/${locale}#contact`}
                >
                  <ArrowRight aria-hidden="true" />
                  <span>{locale === "fa" ? "شروع یک همکاری" : "Start a conversation"}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="project-cta">
          <div className="shell">
            <Reveal>
              <div className="project-cta__inner">
                <h2>{locale === "fa" ? "یک پروژه مشابه در ذهن دارید؟" : "Have a similar project in mind?"}</h2>
                <p>
                  {locale === "fa"
                    ? "ما برای بررسی چالش بعدی سازمان شما آماده‌یم. بیایید درباره آن گفتگو کنیم."
                    : "We are ready for your organization's next challenge. Let's talk about it."}
                </p>
                <a className="button button--primary" href={`/${locale}#contact`}>
                  {locale === "fa" ? "تماس با ما" : "Contact us"}
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
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
        navigation={navigation.map(([id, label]) => ({href: `/${locale}#${id}`, label}))}
      />
    </>
  );
}