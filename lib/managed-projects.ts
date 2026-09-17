import type {Locale} from "@/lib/site";
import {projectsContent, type Project, type ProjectsContent} from "@/lib/projects";

type PayloadProject = {
  id: number | string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string | {url?: string};
  images?: Array<string | {url?: string}>;
  published?: boolean;
  year?: string;
  category?: string;
  client?: string;
  technologies?: string[] | Array<{value?: string} | string>;
  outcomes?: string[] | Array<{value?: string} | string>;
  slogan?: string;
  features?: Array<{
    title?: string;
    items?: string[] | Array<{value?: string} | string>;
  }>;
  locale?: string;
};

type PayloadList<T> = {
  docs: T[];
};

function unwrapArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "value" in item) {
        return String((item as {value: unknown}).value || "");
      }
      return "";
    })
    .filter(Boolean);
}

function resolveMediaUrl(value: unknown, apiOrigin: string): string {
  if (!value) return "";
  if (typeof value === "string") {
    return value.startsWith("http") ? value : `${apiOrigin}${value}`;
  }
  if (typeof value === "object" && value && "url" in value) {
    const url = String((value as {url?: unknown}).url || "");
    return url.startsWith("http") ? url : `${apiOrigin}${url}`;
  }
  return "";
}

function normalizeProject(doc: PayloadProject, apiOrigin: string): Project | null {
  if (!doc.slug || !doc.title) return null;

  return {
    title: doc.title,
    slug: doc.slug,
    shortDescription: doc.shortDescription || "",
    description: doc.description || "",
    thumbnail: resolveMediaUrl(doc.thumbnail, apiOrigin),
    images: Array.isArray(doc.images)
      ? doc.images.map((img) => resolveMediaUrl(img, apiOrigin)).filter(Boolean)
      : [],
    published: doc.published !== false,
    year: doc.year || undefined,
    category: doc.category || undefined,
    client: doc.client || undefined,
    technologies: unwrapArray(doc.technologies),
    outcomes: unwrapArray(doc.outcomes),
    slogan: doc.slogan || undefined,
    features: Array.isArray(doc.features)
      ? doc.features
          .filter((f) => f?.title)
          .map((f) => ({
            title: f.title as string,
            items: unwrapArray(f.items),
          }))
      : undefined,
  };
}

export async function getManagedProjects(locale: Locale): Promise<ProjectsContent> {
  const fallback = projectsContent[locale];
  const apiOrigin = process.env.PAYLOAD_PUBLIC_URL?.replace(/\/$/, "");
  const projectKey = process.env.PAYLOAD_PROJECT_KEY || "tgsepma";

  if (!apiOrigin) return fallback;

  try {
    // اول پروژه اصلی رو پیدا می‌کنیم
    const projectRes = await fetch(
      `${apiOrigin}/api/projects?where[key][equals]=${encodeURIComponent(projectKey)}&limit=1`,
      {next: {revalidate: 60}}
    );
    if (!projectRes.ok) return fallback;

    const projectsData = (await projectRes.json()) as PayloadList<{id: string | number}>;
    const mainProject = projectsData.docs[0];
    if (!mainProject) return fallback;

    // حالا لیست پروژه‌های پورتفولیو رو می‌گیریم
    // فرض بر اینه که کالکشن پروژه‌های پورتفولیو اسمش "portfolio-projects" یا "case-studies" باشه
    // اگر اسم کالکشن فرق داره بگو تا درستش کنم
    const portfolioRes = await fetch(
      `${apiOrigin}/api/portfolio-projects?where[project][equals]=${encodeURIComponent(String(mainProject.id))}` +
        `&where[locale][equals]=${locale}&where[published][equals]=true&depth=1&limit=50&sort=-createdAt`,
      {next: {revalidate: 60}}
    );

    // اگر این endpoint کار نکرد، endpointهای رایج دیگه رو امتحان می‌کنیم
    if (!portfolioRes.ok) {
      // حالت جایگزین
      const altRes = await fetch(
        `${apiOrigin}/api/projects-items?where[project][equals]=${encodeURIComponent(String(mainProject.id))}` +
          `&where[locale][equals]=${locale}&limit=50`,
        {next: {revalidate: 60}}
      );
      if (!altRes.ok) return fallback;

      const altData = (await altRes.json()) as PayloadList<PayloadProject>;
      const normalized = altData.docs
        .map((doc) => normalizeProject(doc, apiOrigin))
        .filter((p): p is Project => p !== null);

      if (normalized.length === 0) return fallback;

      return {
        ...fallback,
        projects: normalized,
      };
    }

    const data = (await portfolioRes.json()) as PayloadList<PayloadProject>;
    const normalized = data.docs
      .map((doc) => normalizeProject(doc, apiOrigin))
      .filter((p): p is Project => p !== null);

    if (normalized.length === 0) return fallback;

    return {
      ...fallback,
      projects: normalized,
    };
  } catch {
    return fallback;
  }
}