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
    </>
  );
}