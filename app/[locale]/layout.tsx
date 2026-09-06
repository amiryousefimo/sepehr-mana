import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {LocaleAttributes} from "@/app/locale-attributes";
import {content} from "@/lib/content";
import {
  isLocale,
  localeDirection,
  locales,
  site,
  type Locale
} from "@/lib/site";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale: localeValue} = await params;
  if (!isLocale(localeValue)) {
    return {};
  }

  const locale = localeValue as Locale;
  const copy = content[locale];
  const canonical = `${site.url}/${locale}`;

  return {
    metadataBase: new URL(site.url),
    title: copy.meta.title,
    description: copy.meta.description,
    keywords: copy.meta.keywords,
    alternates: {
      canonical,
      languages: {
        fa: `${site.url}/fa`,
        en: `${site.url}/en`,
        "x-default": `${site.url}/fa`
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
      url: canonical,
      siteName: locale === "fa" ? site.nameFa : site.nameEn,
      title: copy.meta.title,
      description: copy.meta.description,
      images: [{url: "/opengraph-image", width: 1200, height: 630}]
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.description,
      images: ["/opengraph-image"]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };
}

export default async function LocaleLayout({children, params}: LayoutProps) {
  const {locale: localeValue} = await params;

  if (!isLocale(localeValue)) {
    notFound();
  }

  const locale = localeValue as Locale;

  const dir = localeDirection(locale);

  return (
    <>
      <LocaleAttributes locale={locale} dir={dir} />
      <a className="skip-link" href="#main">
        {locale === "fa" ? "رفتن به محتوای اصلی" : "Skip to main content"}
      </a>
      {children}
    </>
  );
}
