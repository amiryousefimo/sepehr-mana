export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

const fallbackUrl = "http://localhost:3000";

export const site = {
  nameFa: "تکاپوگران سپهر مانا",
  nameEn: "Takapoo Garan Sepehr Mana",
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl).replace(/\/$/, ""),
  phoneDisplayFa: "۰۹۹۱۲۷۷۲۶۹۱",
  phoneDisplayEn: "0991 277 7691",
  phoneHref: "tel:+989912777691",
  contactEmail:
    process.env.CONTACT_RECIPIENT_EMAIL || "tgsepma@gmail.com",
  collaborationEmail:
    process.env.COLLABORATION_RECIPIENT_EMAIL || "tgsepma@gmail.com"
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeDirection(locale: Locale) {
  return locale === "fa" ? "rtl" : "ltr";
}

export function slugifyName(name: string): string {
  const map: Record<string, string> = {
    "آ": "a", "ا": "a", "ب": "b", "پ": "p", "ت": "t", "ث": "s",
    "ج": "j", "چ": "ch", "ح": "h", "خ": "kh", "د": "d", "ذ": "z",
    "ر": "r", "ز": "z", "ژ": "zh", "س": "s", "ش": "sh", "ص": "s",
    "ض": "z", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f",
    "ق": "gh", "ک": "k", "گ": "g", "ل": "l", "م": "m", "ن": "n",
    "و": "v", "ه": "h", "ی": "y", "ئ": "y", "ى": "y",
    " ": "-",
  };

  return name
    .trim()
    .split("")
    .map((char) => map[char] || (/[a-z0-9]/i.test(char) ? char.toLowerCase() : ""))
    .join("")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}