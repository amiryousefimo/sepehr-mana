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
    process.env.CONTACT_RECIPIENT_EMAIL || "amiryousefimo@gmail.com",
  collaborationEmail:
    process.env.COLLABORATION_RECIPIENT_EMAIL || "amiryousefimo@gmail.com"
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeDirection(locale: Locale) {
  return locale === "fa" ? "rtl" : "ltr";
}
