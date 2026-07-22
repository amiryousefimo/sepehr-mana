import type {SiteContent} from "@/lib/content";
import type {Locale} from "@/lib/site";

type PayloadProject = {
  id: number | string;
};

type PayloadContentDocument = {
  structuredData?: Partial<SiteContent>;
};

type PayloadList<T> = {
  docs: T[];
};

function mergeContent<T>(fallback: T, override: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(override) ? override : fallback) as T;
  }

  if (fallback && typeof fallback === "object") {
    const source = override && typeof override === "object" ? override as Record<string, unknown> : {};
    const result = {...fallback} as Record<string, unknown>;

    for (const [key, value] of Object.entries(source)) {
      const fallbackValue = (fallback as Record<string, unknown>)[key];
      result[key] = fallbackValue === undefined ? value : mergeContent(fallbackValue, value);
    }

    return result as T;
  }

  return (override === undefined ? fallback : override) as T;
}

export async function getManagedContent(locale: Locale, fallback: SiteContent) {
  const apiOrigin = process.env.PAYLOAD_PUBLIC_URL?.replace(/\/$/, "");
  const projectKey = process.env.PAYLOAD_PROJECT_KEY || "tgsepma";

  if (!apiOrigin) return fallback;

  try {
    const projectResponse = await fetch(
      `${apiOrigin}/api/projects?where[key][equals]=${encodeURIComponent(projectKey)}&limit=1`,
      {next: {revalidate: 60}}
    );
    if (!projectResponse.ok) return fallback;

    const projects = await projectResponse.json() as PayloadList<PayloadProject>;
    const project = projects.docs[0];
    if (!project) return fallback;

    const contentResponse = await fetch(
      `${apiOrigin}/api/site-content?where[project][equals]=${encodeURIComponent(String(project.id))}` +
        `&where[key][equals]=home&where[locale][equals]=${locale}&draft=false&limit=1`,
      {next: {revalidate: 60}}
    );
    if (!contentResponse.ok) return fallback;

    const documents = await contentResponse.json() as PayloadList<PayloadContentDocument>;
    return mergeContent(fallback, documents.docs[0]?.structuredData);
  } catch {
    return fallback;
  }
}
