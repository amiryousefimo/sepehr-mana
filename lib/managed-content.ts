import type {SiteContent} from "@/lib/content";
import type {Locale} from "@/lib/site";

type PayloadProject = {
  id: number | string;
};

type PayloadContentDocument = {
  content?: Partial<SiteContent> & {
    team?: {
      people?: Array<Record<string, unknown>>;
    };
  };
  structuredData?: Partial<SiteContent>;
};

type PayloadList<T> = {
  docs: T[];
};

function mergeContent<T>(fallback: T, override: unknown): T {
  if (override === null) return fallback;

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

function unwrapValueArrays(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.every((item) => item && typeof item === "object" && "value" in item)) {
      return value.map((item) => (item as {value: unknown}).value);
    }

    return value.map(unwrapValueArrays);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, unwrapValueArrays(child)])
    );
  }

  return value;
}

function normalizeManagedContent(document: PayloadContentDocument, apiOrigin: string) {
  const managed = unwrapValueArrays(document.content ?? document.structuredData);
  if (!managed || typeof managed !== "object") return managed;

  const result = structuredClone(managed) as Record<string, unknown>;
  const team = result.team;
  if (!team || typeof team !== "object") return result;

  const people = (team as Record<string, unknown>).people;
  if (!Array.isArray(people)) return result;

  (team as Record<string, unknown>).people = people.map((person) => {
    if (!person || typeof person !== "object") return person;
    const normalized = {...person} as Record<string, unknown>;
    const photo = normalized.photo;

    if (photo && typeof photo === "object" && "url" in photo) {
      const url = String((photo as {url?: unknown}).url || "");
      normalized.photoUrl = url.startsWith("http") ? url : `${apiOrigin}${url}`;
    }

    delete normalized.photo;
    return normalized;
  });

  return result;
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
        `&where[key][equals]=home&where[locale][equals]=${locale}&draft=false&depth=1&limit=1`,
      {next: {revalidate: 60}}
    );
    if (!contentResponse.ok) return fallback;

    const documents = await contentResponse.json() as PayloadList<PayloadContentDocument>;
    const document = documents.docs[0];
    return document ? mergeContent(fallback, normalizeManagedContent(document, apiOrigin)) : fallback;
  } catch {
    return fallback;
  }
}
