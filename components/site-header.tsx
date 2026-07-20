import {ArrowUpLeft, Languages, Menu} from "lucide-react";
import {BrandMark} from "@/components/brand-mark";
import type {SiteContent} from "@/lib/content";
import type {Locale} from "@/lib/site";

export function SiteHeader({
  locale,
  content
}: {
  locale: Locale;
  content: SiteContent;
}) {
  const otherLocale = locale === "fa" ? "en" : "fa";
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
        <a className="site-header__brand" href={`/${locale}`} aria-label={content.meta.title}>
          <BrandMark />
        </a>

        <nav className="desktop-nav" aria-label={content.nav.menu}>
          {navigation.map(([id, label]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="language-link" href={`/${otherLocale}`} hrefLang={otherLocale}>
            <Languages aria-hidden="true" />
            <span>{content.nav.language}</span>
          </a>
          <a className="button button--small button--primary header-cta" href="#contact">
            {content.nav.cta}
            <ArrowUpLeft aria-hidden="true" />
          </a>
          <details className="mobile-menu">
            <summary aria-label={content.nav.menu}>
              <Menu aria-hidden="true" />
            </summary>
            <nav aria-label={content.nav.menu}>
              {navigation.map(([id, label]) => (
                <a href={`#${id}`} key={id}>
                  {label}
                </a>
              ))}
              <a href={`/${otherLocale}`} hrefLang={otherLocale}>
                {content.nav.language}
              </a>
              <a href="#contact">{content.nav.cta}</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
