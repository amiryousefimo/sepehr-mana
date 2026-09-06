import {
  ArrowDown,
  ArrowUpLeft,
  Check,
  GraduationCap,
  Phone
} from "lucide-react";
import {notFound} from "next/navigation";
import {ContactForm} from "@/components/contact-form";
import {FeatureIcon} from "@/components/icon";
import {JsonLd} from "@/components/json-ld";
import {NetworkVisual} from "@/components/network-visual";
import {Reveal} from "@/components/reveal";
import {SectionHeading} from "@/components/section-heading";
import {SiteFooter} from "@/components/site-footer";
import {SiteHeader} from "@/components/site-header";
import {content} from "@/lib/content";
import {getManagedContent} from "@/lib/managed-content";
import {isLocale, site, type Locale} from "@/lib/site";

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) {
    notFound();
  }

  const locale = localeValue as Locale;
  const copy = await getManagedContent(locale, content[locale]);
  const phone = locale === "fa" ? site.phoneDisplayFa : site.phoneDisplayEn;
  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en", {
    year: "numeric"
  }).format(new Date());

  const navigation = [
    ["services", copy.nav.services],
    ["solutions", copy.nav.solutions],
    ["approach", copy.nav.approach],
    ["about", copy.nav.about],
    ["team", copy.nav.team],
    ["contact", copy.nav.contact]
  ];

  return (
    <>
      <JsonLd locale={locale} content={copy} />
      <SiteHeader locale={locale} content={copy} />
      <main id="main">
        <section className="hero" id="top">
          <div className="hero__ambient" aria-hidden="true" />
          <div className="shell hero__grid">
            <div className="hero__content">
              <Reveal>
                <span className="hero__eyebrow">
                  <i />
                  {copy.hero.eyebrow}
                </span>
                <h1>
                  {copy.hero.titleStart}
                  <strong>{copy.hero.titleAccent}</strong>
                </h1>
                <p>{copy.hero.description}</p>
                <div className="hero__actions">
                  <a className="button button--primary" href="#solutions">
                    {copy.hero.primary}
                    <ArrowDown aria-hidden="true" />
                  </a>
                  <a className="button button--ghost" href="#about">
                    {copy.hero.secondary}
                    <ArrowUpLeft aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal className="hero__visual" delay={0.12}>
              <span className="hero__visual-label">{copy.hero.signalLabel}</span>
              <NetworkVisual signals={copy.hero.signals} />
            </Reveal>
          </div>
          <a className="hero__scroll" href="#intro" aria-label={copy.hero.secondary}>
            <span />
          </a>
        </section>

        <section className="section intro" id="intro">
          <div className="shell intro__grid">
            <Reveal>
              <SectionHeading
                label={copy.intro.label}
                title={copy.intro.title}
                description={copy.intro.description}
              />
            </Reveal>
            <div className="metrics">
              {copy.intro.metrics.map((metric, index) => (
                <Reveal className="metric" delay={index * 0.08} key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="shell">
            <Reveal>
              <SectionHeading
                align="center"
                label={copy.services.label}
                title={copy.services.title}
                description={copy.services.description}
              />
            </Reveal>
            <div className="services__grid">
              {copy.services.items.map((service, index) => (
                <Reveal
                  className="service-card"
                  delay={(index % 3) * 0.06}
                  key={service.title}
                >
                  <div className="service-card__icon">
                    <FeatureIcon name={service.icon} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.items.map((item) => (
                      <li key={item}>
                        <Check aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section solutions" id="solutions">
          <div className="solutions__orb" aria-hidden="true" />
          <div className="shell">
            <Reveal>
              <SectionHeading
                label={copy.solutions.label}
                title={copy.solutions.title}
                description={copy.solutions.description}
              />
            </Reveal>
            <div className="solutions__grid">
              {copy.solutions.items.map((solution, index) => (
                <Reveal
                  className="solution-card"
                  delay={(index % 2) * 0.08}
                  key={solution.title}
                >
                  <span className="solution-card__number">{solution.number}</span>
                  <div className="solution-card__icon">
                    <FeatureIcon name={solution.icon} />
                  </div>
                  <h3>{solution.title}</h3>
                  <p>{solution.description}</p>
                  <div className="solution-card__tags">
                    {solution.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section approach" id="approach">
          <div className="shell">
            <Reveal>
              <SectionHeading
                align="center"
                label={copy.approach.label}
                title={copy.approach.title}
                description={copy.approach.description}
              />
              <p className="approach__resume-note">
                <span>{copy.approach.resumeNote}</span>
                <b dir="ltr">{copy.approach.resumePhone}</b>
              </p>
            </Reveal>
            <div className="approach__track">
              {copy.approach.steps.map((step, index) => (
                <Reveal className="approach-step" delay={index * 0.08} key={step.number}>
                  <span className="approach-step__number">{step.number}</span>
                  <i aria-hidden="true" />
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="shell about__grid">
            <Reveal className="about__story">
              <SectionHeading
                label={copy.about.label}
                title={copy.about.title}
                description={copy.about.description}
              />
              <div className="values">
                {copy.about.values.map((value, index) => (
                  <article key={value.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
            <Reveal className="technology-panel" delay={0.12}>
              <span className="section-kicker">
                <i />
                {copy.about.technologyLabel}
              </span>
              <h3>{copy.about.technologyTitle}</h3>
              <div className="technology-cloud" dir="ltr">
                {copy.about.technologies.map((technology, index) => (
                  <span
                    className={index % 4 === 0 ? "technology-pill--accent" : ""}
                    key={technology}
                  >
                    {technology}
                  </span>
                ))}
              </div>
              <div className="technology-panel__graphic" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section team" id="team">
          <div className="shell">
            <Reveal>
              <SectionHeading
                align="center"
                label={copy.team.label}
                title={copy.team.title}
                description={copy.team.description}
              />
            </Reveal>
            <div className="team__grid">
              {copy.team.people.map((person, index) => (
                <Reveal className="person-card" delay={index * 0.1} key={person.name}>
                  <div className="person-card__portrait">
                    {person.photoUrl ? (
                      <img alt={person.name} src={person.photoUrl} />
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
                    {person.education.length > 0 && (
                      <ul>
                        {person.education.map((education) => (
                          <li key={education}>
                            <GraduationCap aria-hidden="true" />
                            {education}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="contact__mesh" aria-hidden="true" />
          <div className="shell contact__grid">
            <Reveal className="contact__content">
              <SectionHeading
                label={copy.contact.label}
                title={copy.contact.title}
                description={copy.contact.description}
              />
              <div className="contact__details">
                <a href={site.phoneHref}>
                  <span><Phone aria-hidden="true" /></span>
                  <div>
                    <small>{copy.contact.phoneLabel}</small>
                    <b dir="ltr">{phone}</b>
                  </div>
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <ContactForm copy={copy.contact} locale={locale} phoneHref={site.phoneHref} />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter
        locale={locale}
        year={year}
        summary={copy.footer.summary}
        rights={copy.footer.rights}
        backToTop={copy.footer.backToTop}
        navigation={navigation.map(([id, label]) => ({href: `#${id}`, label}))}
      />
    </>
  );
}
