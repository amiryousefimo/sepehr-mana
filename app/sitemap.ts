import type {MetadataRoute} from "next";
import {locales, site} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) => [
    {
      url: `${site.url}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: locale === "fa" ? 1 : 0.9,
      alternates: {
        languages: {
          fa: `${site.url}/fa`,
          en: `${site.url}/en`
        }
      }
    },
    {
      url: `${site.url}/${locale}/collaboration`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: locale === "fa" ? 0.9 : 0.8,
      alternates: {
        languages: {
          fa: `${site.url}/fa/collaboration`,
          en: `${site.url}/en/collaboration`
        }
      }
    }
  ]);
}
