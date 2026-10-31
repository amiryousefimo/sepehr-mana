import type {Locale} from "@/lib/site";

export const elderlyCareSurveyPage = {
  fa: {
    meta: {
      title: "پرسشنامه تحقیق بازار | مراقبت سالمند",
      description:
        "پرسشنامه ناشناس برای بررسی تجربه خانواده‌ها در اطلاع از وضعیت والدین سالمند و اعتبارسنجی نیاز به راه‌حل دیجیتال.",
      keywords: ["تحقیق بازار", "مراقبت سالمند", "پرسشنامه", "تکاپوگران"]
    },
    nav: {back: "بازگشت به سایت"},
    hero: {
      eyebrow: "تحقیق محصول",
      title: "پرسشنامه",
      accent: "مراقبت روزمره سالمند",
      description:
        "این پرسشنامه حدود ۱۰ تا ۱۵ دقیقه زمان می‌برد. پاسخ‌های شما به طراحی سرویس خانوادگی کمک می‌کند."
    },
    intro: {
      title: "قبل از شروع",
      start: "شروع پرسشنامه",
      serviceLabel: "تعریف سرویس",
      goalLabel: "هدف تحقیق",
      privacyLabel: "محرمانگی"
    },
    form: {
      sectionOf: "بخش",
      of: "از",
      previous: "بخش قبل",
      next: "بخش بعد",
      submit: "ثبت نهایی پاسخ‌ها",
      sending: "در حال ثبت…",
      required: "لطفاً به همه سؤالات این بخش پاسخ دهید.",
      q02Notice:
        "با توجه به پاسخ شما، خارج از جامعه اصلی این تحقیق هستید؛ با این حال می‌توانید ادامه دهید و پاسخ در تحلیل فرعی ثبت می‌شود.",
      followUpTitle: "پیگیری اختیاری",
      followUpDescription:
        "در صورت تمایل به تماس برای آزمایش نسخه اولیه، رضایت و راه ارتباطی خود را وارد کنید.",
      followUpConsent: "مایلم در صورت نیاز برای پیگیری تحقیق با من تماس گرفته شود.",
      contactPhone: "شماره تماس (اختیاری)",
      contactEmail: "ایمیل (اختیاری)",
      successTitle: "پاسخ شما ثبت شد",
      successBody:
        "از مشارکت شما سپاسگزاریم. اگر برای آزمایش اولیه واجد شرایط باشید، ممکن است با شما تماس بگیریم.",
      successId: "شناسه پاسخ",
      error: "ثبت پاسخ انجام نشد. لطفاً دوباره تلاش کنید.",
      progress: "پیشرفت"
    }
  },
  en: {
    meta: {
      title: "Market research survey | Elderly care",
      description:
        "Anonymous survey on family experience caring for elderly parents. The questionnaire is in Persian.",
      keywords: ["market research", "elderly care", "survey"]
    },
    nav: {back: "Back to site"},
    hero: {
      eyebrow: "Product research",
      title: "Survey",
      accent: "Daily elderly care",
      description:
        "Takes about 10–15 minutes. Questions are in Persian; responses help shape a family care product."
    },
    intro: {
      title: "Before you start",
      start: "Start survey",
      serviceLabel: "Service concept",
      goalLabel: "Research goal",
      privacyLabel: "Privacy"
    },
    form: {
      sectionOf: "Section",
      of: "of",
      previous: "Previous",
      next: "Next",
      submit: "Submit responses",
      sending: "Submitting…",
      required: "Please answer every question in this section.",
      q02Notice:
        "Based on your answers you are outside the main target group; you may still continue and your response will be kept for secondary analysis.",
      followUpTitle: "Optional follow-up",
      followUpDescription:
        "If you agree to be contacted about a pilot, share your contact details below.",
      followUpConsent: "I agree to be contacted for research follow-up.",
      contactPhone: "Phone (optional)",
      contactEmail: "Email (optional)",
      successTitle: "Thank you",
      successBody:
        "Your responses were saved. We may reach out if you qualify for an early pilot.",
      successId: "Response ID",
      error: "Could not submit. Please try again.",
      progress: "Progress"
    }
  }
} satisfies Record<Locale, unknown>;

export type ElderlyCareSurveyPageCopy =
  (typeof elderlyCareSurveyPage)[Locale];
