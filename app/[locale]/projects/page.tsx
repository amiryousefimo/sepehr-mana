import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowLeft, ArrowRight} from "lucide-react";
import Image from "next/image";
import {Reveal} from "@/components/reveal";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {projectsContent} from "@/lib/projects";
import {content} from "@/lib/content";
import {isLocale, site, type Locale} from "@/lib/site";

type PageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) return {};

  const locale = localeValue as Locale;
  const copy = projectsContent[locale];
  const siteCopy = content[locale];
  const canonical = `${site.url}/${locale}/projects`;

  const title =
    locale === "fa"
      ? `نمونه کارها و پروژه‌ها | ${siteCopy.meta.title}`
      : `Projects & Case Studies | ${siteCopy.meta.title}`;

  const description =
    locale === "fa"
      ? "نمونه کارهای واقعی تکاپوگران سپهر مانا: سوپر اپلیکیشن فرودگاهی، سامانه سلامت دیجیتال، سامانه گردش کار سازمانی و سایر پروژه‌های نرم‌افزاری."
      : "Real projects by Takapoo Garan Sepehr Mana: Airport Super App, Digital Health Platform, Enterprise Workflow System and other software case studies.";

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa/projects`,
        en: `${site.url}/en/projects`,
        "x-default": `${site.url}/fa/projects`,
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ProjectsListPage({params}: PageProps) {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) notFound();

  const locale = localeValue as Locale;
  const copy = projectsContent[locale];
  const siteCopy = content[locale];
  const projects = copy.projects.filter((p) => p.published);

  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric",
  }).format(new Date());

  const navigation = [
    ["services", siteCopy.nav.services],
    ["solutions", siteCopy.nav.solutions],
    ["approach", siteCopy.nav.approach],
    ["about", siteCopy.nav.about],
    ["team", siteCopy.nav.team],
    ["contact", siteCopy.nav.contact],
  ];

  return (
    <>
      <SiteHeader locale={locale} content={siteCopy} page="projects" />

      <main id="main" className="project-page">
        {/* Hero */}
        <section className="project-hero" style={{minHeight: "auto"}}>
          <div className="project-hero__grid" aria-hidden="true" />
          <div className="project-hero__orb" aria-hidden="true" />

          <div className="shell project-hero__nav">
            <a className="project-hero__back" href={`/${locale}`}>
              <ArrowLeft aria-hidden="true" />
              {copy.backToHome}
            </a>
          </div>

          <div className="shell" style={{paddingBlock: "160px 72px"}}>
            <Reveal>
              <span className="project-hero__kicker">
                <i />
                {copy.label}
              </span>
              <h1 style={{margin: "28px 0 20px", maxWidth: 820}}>{copy.title}</h1>
              <p
                style={{
                  maxWidth: 640,
                  color: "#c1d4e2",
                  fontSize: "1.12rem",
                  lineHeight: 1.95,
                }}
              >
                {copy.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Grid */}
        <section className="section projects" style={{paddingTop: 20}}>
          <div className="shell">
            <div className="projects__grid">
              {projects.map((project, index) => (
                <Reveal className="project-card" delay={index * 0.07} key={project.slug}>
                  <article className="project-card__inner">
                    <div className="project-card__media">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 33vw"
                        className="project-card__image"
                      />
                      <div className="project-card__overlay">
                        {project.category && (
                          <span className="project-card__category">{project.category}</span>
                        )}
                        {project.year && (
                          <span className="project-card__year">{project.year}</span>
                        )}
                      </div>
                    </div>
                    <div className="project-card__content">
                      <h3>{project.title}</h3>
                      <p>{project.shortDescription}</p>
                      <div className="project-card__meta">
                        {project.client && (
                          <span className="project-card__client">{project.client}</span>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="project-card__tech">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span key={tech} className="project-card__tech-tag">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="project-card__tech-tag project-card__tech-more">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <a
                        className="project-card__cta"
                        href={`/${locale}/projects/${project.slug}`}
                      >
                        <span>{copy.cta}</span>
                        <ArrowRight aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        locale={locale}
        year={year}
        summary={siteCopy.footer.summary}
        rights={siteCopy.footer.rights}
        backToTop={siteCopy.footer.backToTop}
        navigation={navigation.map(([id, label]) => ({
          href: `/${locale}#${id}`,
          label,
        }))}
      />
    </>
  );
}