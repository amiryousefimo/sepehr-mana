import {site, type Locale} from "@/lib/site";
import type {SiteContent} from "@/lib/content";

export function JsonLd({
  locale,
  content,
}: {
  locale: Locale;
  content: SiteContent;
}) {
  const name = locale === "fa" ? site.nameFa : site.nameEn;
  const alternateName = locale === "fa" ? site.nameEn : site.nameFa;

  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name,
    alternateName,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/icon.svg`,
    },
    description: content.meta.description,
    telephone: "+989912777691",
    email: site.contactEmail,
    areaServed: {
      "@type": "Country",
      name: "Iran",
    },
    knowsAbout: content.meta.keywords,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+989912777691",
      contactType: "customer service",
      availableLanguage: ["Persian", "English"],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name,
    alternateName,
    inLanguage: locale === "fa" ? "fa-IR" : "en",
    publisher: {
      "@id": `${site.url}/#organization`,
    },
  };

  // Person Schema برای اعضای تیم
  const people = (content.team?.people || []).map((person, index) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person-${index + 1}`,
    name: person.name,
    jobTitle: person.role,
    description: person.introduction,
    worksFor: {
      "@id": `${site.url}/#organization`,
    },
    ...(person.photoUrl
      ? {
          image: person.photoUrl.startsWith("http")
            ? person.photoUrl
            : `${site.url}${person.photoUrl}`,
        }
      : {}),
    ...(person.education?.length
      ? {
          alumniOf: person.education.map((edu) => ({
            "@type": "EducationalOrganization",
            name: edu,
          })),
        }
      : {}),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(organization)}}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(website)}}
      />
      {people.map((person, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(person)}}
        />
      ))}
    </>
  );
}