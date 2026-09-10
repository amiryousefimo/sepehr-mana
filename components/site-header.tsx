import {ArrowUpLeft, Languages, Menu} from "lucide-react";
import {BrandMark} from "@/components/brand-mark";
import type {SiteContent} from "@/lib/content";
import type {Locale} from "@/lib/site";

export function SiteHeader({
  locale,
  content,
  page = "home"
}: {
  locale: Locale;
  content: SiteContent;
   page?: "home" | "collaboration" | "projects";
}) {
  const otherLocale = locale === "fa" ? "en" : "fa";
  const homeHref = `/${locale}`;
  const otherLocaleHref = page === "collaboration"
      ? `/${otherLocale}/collaboration`
      : page === "projects"
        ? `/${otherLocale}`       
        : `/${otherLocale}`;
  const navigation = [
    ["services", content.nav.services],
    ["solutions", content.nav.solutions],
    ["approach", content.nav.approach],
    ["about", content.nav.about],
    ["team", content.nav.team]
  ];

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <a className="site-header__brand" href={homeHref} aria-label={content.meta.title}>
          <BrandMark />
        </a>

        <nav className="desktop-nav" aria-label={content.nav.menu}>
          {navigation.map(([id, label]) => (
            <a href={page === "home" ? `#${id}` : `${homeHref}#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="language-link" href={otherLocaleHref} hrefLang={otherLocale}>
            <Languages aria-hidden="true" />
            <span>{content.nav.language}</span>
          </a>
          <a
            className="button button--small button--primary header-cta"
            href={`/${locale}/collaboration`}
            aria-current={page === "collaboration" ? "page" : undefined}
          >
            {content.nav.cta}
            <ArrowUpLeft aria-hidden="true" />
          </a>
          <details className="mobile-menu">
            <summary aria-label={content.nav.menu}>
              <Menu aria-hidden="true" />
            </summary>
            <nav aria-label={content.nav.menu}>
              {navigation.map(([id, label]) => (
                <a href={page === "home" ? `#${id}` : `${homeHref}#${id}`} key={id}>
                  {label}
                </a>
              ))}
              <a href={otherLocaleHref} hrefLang={otherLocale}>
                {content.nav.language}
              </a>
              <a href={`/${locale}/collaboration`}>{content.nav.cta}</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
