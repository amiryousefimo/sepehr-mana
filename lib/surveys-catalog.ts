import type {Locale} from "@/lib/site";

export type PublicSurvey = {
  id: string;
  href: (locale: Locale) => string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  duration: Record<Locale, string>;
  audience: Record<Locale, string>;
  active: boolean;
};

export const publicSurveys: PublicSurvey[] = [
  {
    id: "elderly-care",
    href: (locale) => `/${locale}/survey/elderly-care`,
    title: {
      fa: "تحقیق بازار مراقبت روزمره سالمند",
      en: "Elderly daily care market research"
    },
    description: {
      fa: "پرسشنامه ناشناس برای خانواده‌هایی که والد ۶۰+ دارند؛ نیاز، پذیرش و تمایل پرداخت را می‌سنجد.",
      en: "Anonymous questionnaire for families with a parent aged 60+; measures need, adoption, and payment intent."
    },
    duration: {
      fa: "حدود ۱۰–۱۵ دقیقه",
      en: "About 10–15 minutes"
    },
    audience: {
      fa: "فرزندان بزرگسال",
      en: "Adult children caregivers"
    },
    active: true
  }
];
