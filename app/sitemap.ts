import type {MetadataRoute} from "next";
import {locales, site} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.map((locale) => ({
    url: `${site.url}/${locale}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: locale === "fa" ? 1 : 0.9,
    alternates: {
      languages: {
        fa: `${site.url}/fa`,
        en: `${site.url}/en`
      }
    }
  }));
}
