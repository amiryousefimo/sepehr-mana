import {site, type Locale} from "@/lib/site";
import type {SiteContent} from "@/lib/content";

export function JsonLd({
  locale,
  content
}: {
  locale: Locale;
  content: SiteContent;
}) {
  const name = locale === "fa" ? site.nameFa : site.nameEn;
  const address = locale === "fa" ? site.locationFa : site.locationEn;
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name,
    alternateName: locale === "fa" ? site.nameEn : site.nameFa,
    url: `${site.url}/${locale}`,
    logo: `${site.url}/brand-mark.svg`,
    description: content.meta.description,
    telephone: "+98-991-277-7691",
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: locale === "fa" ? "تهران" : "Tehran",
      addressCountry: "IR"
    },
    areaServed: {
      "@type": "Country",
      name: "Iran"
    },
    knowsAbout: content.meta.keywords
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}
