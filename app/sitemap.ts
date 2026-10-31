import type {MetadataRoute} from "next";
import {locales, site, slugifyName} from "@/lib/site";
import {projectsContent} from "@/lib/projects";
import {content} from "@/lib/content";
import {getManagedContent} from "@/lib/managed-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = locales.flatMap((locale) => [
    {
      url: `${site.url}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: locale === "fa" ? 1 : 0.9,
      alternates: {
        languages: {
          fa: `${site.url}/fa`,
          en: `${site.url}/en`,
        },
      },
    },
    {
      url: `${site.url}/${locale}/collaboration`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          fa: `${site.url}/fa/collaboration`,
          en: `${site.url}/en/collaboration`,
        },
      },
    },
    {
      url: `${site.url}/${locale}/projects`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: {
        languages: {
          fa: `${site.url}/fa/projects`,
          en: `${site.url}/en/projects`,
        },
      },
    },
    {
      url: `${site.url}/${locale}/team`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          fa: `${site.url}/fa/team`,
          en: `${site.url}/en/team`,
        },
      },
    },
    {
      url: `${site.url}/${locale}/survey/elderly-care`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      alternates: {
        languages: {
          fa: `${site.url}/fa/survey/elderly-care`,
          en: `${site.url}/en/survey/elderly-care`,
        },
      },
    },
  ]);

  // صفحات پروژه‌ها
  const projectPages = locales.flatMap((locale) =>
    projectsContent[locale].projects
      .filter((p) => p.published)
      .map((project) => ({
        url: `${site.url}/${locale}/projects/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            fa: `${site.url}/fa/projects/${project.slug}`,
            en: `${site.url}/en/projects/${project.slug}`,
          },
        },
      }))
  );

  // صفحات اعضای تیم (از CMS)
  const teamPages: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    try {
      const copy = await getManagedContent(locale, content[locale]);
      const people = copy.team?.people || [];
      for (const person of people) {
        const slug = slugifyName(person.name);
        teamPages.push({
          url: `${site.url}/${locale}/team/${slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: {
            languages: {
              fa: `${site.url}/fa/team/${slug}`,
              en: `${site.url}/en/team/${slug}`,
            },
          },
        });
      }
    } catch {
      // اگر CMS در دسترس نبود، رد شو
    }
  }

  return [...staticPages, ...projectPages, ...teamPages];
}