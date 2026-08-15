import type {Locale} from "@/lib/site";

export type CollaborationContent = {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  nav: {
    back: string;
    language: string;
    menu: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    responseTime: string;
    responseValue: string;
  };
  form: {
    stepLabel: string;
    title: string;
    description: string;
    name: string;
    organization: string;
    role: string;
    phone: string;
    email: string;
    collaborationType: string;
    collaborationPlaceholder: string;
    collaborationOptions: string[];
    budget: string;
    budgetPlaceholder: string;
    budgetOptions: string[];
    timeline: string;
    timelinePlaceholder: string;
    timelineOptions: string[];
    resume: string;
    resumeAction: string;
    resumeHint: string;
    resumeRequired: string;
    resumeInvalid: string;
    resumeTooLarge: string;
    message: string;
    messagePlaceholder: string;
    consent: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    note: string;
    call: string;
  };
  aside: {
    label: string;
    title: string;
    description: string;
    steps: {number: string; title: string; description: string}[];
    suitableLabel: string;
    suitableItems: string[];
  };
  footer: {
    summary: string;
    rights: string;
  };
};

const fa: CollaborationContent = {
  meta: {
    title: "درخواست همکاری | تکاپوگران سپهر مانا",
    description:
      "برای شروع همکاری در زمینه توسعه نرم‌افزار، داده، یکپارچه‌سازی سامانه‌ها، بهبود فرایند و زیرساخت فناوری با تکاپوگران سپهر مانا گفتگو کنید.",
    keywords: [
      "درخواست همکاری فناوری",
      "مشاوره نرم افزار سازمانی",
      "شروع پروژه نرم افزاری",
      "همکاری تحول دیجیتال"
    ]
  },
  nav: {
    back: "بازگشت به خانه",
    language: "English",
    menu: "فهرست",
    cta: "درخواست همکاری"
  },
  hero: {
    eyebrow: "شروع یک همکاری نتیجه‌محور",
    title: "مسئله را با ما",
    accent: "در میان بگذارید.",
    description:
      "چند نکته درباره هدف، شرایط و زمان‌بندی مدنظر خود بنویسید. ما درخواست را بررسی می‌کنیم و برای یک گفت‌وگوی کوتاه و متمرکز با شما هماهنگ می‌شویم.",
    responseTime: "زمان پاسخ‌گویی معمول",
    responseValue: "یک تا دو روز کاری"
  },
  form: {
    stepLabel: "فرم درخواست",
    title: "از کجا شروع کنیم؟",
    description:
      "اطلاعات اولیه کمک می‌کند گفت‌وگوی نخست را با شناخت بهتر و افراد مناسب آغاز کنیم.",
    name: "نام و نام خانوادگی",
    organization: "نام سازمان",
    role: "سمت سازمانی",
    phone: "شماره تماس",
    email: "ایمیل کاری",
    collaborationType: "زمینه همکاری",
    collaborationPlaceholder: "یک گزینه انتخاب کنید",
    collaborationOptions: [
      "تحلیل و مشاوره",
      "توسعه نرم‌افزار سفارشی",
      "داده و هوش تجاری",
      "یکپارچه‌سازی و اتوماسیون فرایند",
      "زیرساخت و پایایی",
      "آموزش و پژوهش",
      "سایر موارد"
    ],
    budget: "بازه بودجه",
    budgetPlaceholder: "در صورت تمایل انتخاب کنید",
    budgetOptions: [
      "نیازمند برآورد",
      "کمتر از ۵۰۰ میلیون تومان",
      "۵۰۰ میلیون تا ۲ میلیارد تومان",
      "بیشتر از ۲ میلیارد تومان"
    ],
    timeline: "زمان مطلوب شروع",
    timelinePlaceholder: "یک بازه انتخاب کنید",
    timelineOptions: [
      "در اولین فرصت",
      "یک تا سه ماه آینده",
      "سه تا شش ماه آینده",
      "در حال بررسی اولیه"
    ],
    resume: "رزومه",
    resumeAction: "انتخاب و بارگذاری رزومه",
    resumeHint: "فایل PDF، DOC یا DOCX — حداکثر ۵ مگابایت",
    resumeRequired: "لطفاً فایل رزومه را انتخاب کنید.",
    resumeInvalid: "فرمت فایل باید PDF، DOC یا DOCX باشد.",
    resumeTooLarge: "حجم فایل رزومه نباید بیشتر از ۵ مگابایت باشد.",
    message: "کمی درباره نیاز یا فرصت همکاری توضیح دهید",
    messagePlaceholder:
      "هدف، وضعیت فعلی، مهم‌ترین محدودیت و نتیجه‌ای که انتظار دارید را بنویسید.",
    consent:
      "با ثبت این فرم، موافقت می‌کنم برای بررسی این درخواست با من تماس گرفته شود.",
    submit: "ثبت درخواست همکاری",
    sending: "در حال ارسال…",
    success: "درخواست و رزومه شما با موفقیت ارسال شد.",
    error: "ارسال انجام نشد. لطفاً دوباره تلاش کنید یا مستقیماً تماس بگیرید.",
    note:
      "اطلاعات این فرم و فایل رزومه فقط برای بررسی درخواست همکاری استفاده می‌شود.",
    call: "تماس مستقیم"
  },
  aside: {
    label: "پس از ثبت درخواست",
    title: "یک مسیر روشن، از گفت‌وگو تا اقدام",
    description:
      "هدف جلسه نخست، رسیدن به درک مشترک از مسئله و مشخص‌کردن بهترین گام بعدی است.",
    steps: [
      {
        number: "۰۱",
        title: "بررسی اولیه",
        description: "درخواست شما را از نظر زمینه تخصصی، هدف و فوریت مرور می‌کنیم."
      },
      {
        number: "۰۲",
        title: "گفت‌وگوی شناخت",
        description: "در یک جلسه کوتاه، مسئله، ذی‌نفعان و معیار موفقیت را روشن می‌کنیم."
      },
      {
        number: "۰۳",
        title: "پیشنهاد گام بعدی",
        description: "مسیر مناسب را به‌صورت کارگاه، ارزیابی، نمونه اولیه یا پروژه پیشنهاد می‌دهیم."
      }
    ],
    suitableLabel: "این فرم مناسب شماست اگر به دنبال این موارد هستید:",
    suitableItems: [
      "ساخت یا نوسازی یک محصول نرم‌افزاری",
      "یکپارچه‌سازی سامانه‌ها و داده‌های پراکنده",
      "دیجیتال‌سازی و بهبود فرایندهای سازمانی",
      "ارزیابی فنی، معماری یا نقشه راه اجرا"
    ]
  },
  footer: {
    summary: "راهکارهای نرم‌افزار، داده و فرایند برای سازمان‌های رو به آینده.",
    rights: "تمامی حقوق برای تکاپوگران سپهر مانا محفوظ است."
  }
};

const en: CollaborationContent = {
  meta: {
    title: "Collaboration Request | Takapoo Garan Sepehr Mana",
    description:
      "Start a conversation about software, data, systems integration, process improvement, or technology infrastructure with Takapoo Garan Sepehr Mana.",
    keywords: [
      "technology collaboration request",
      "enterprise software consultation",
      "start a software project",
      "digital transformation partner"
    ]
  },
  nav: {
    back: "Back to home",
    language: "فارسی",
    menu: "Menu",
    cta: "Collaboration request"
  },
  hero: {
    eyebrow: "Start an outcome-focused partnership",
    title: "Tell us what you are",
    accent: "working to solve.",
    description:
      "Share a little about your goal, context, and preferred timing. We will review the request and arrange a short, focused conversation with the right people.",
    responseTime: "Typical response time",
    responseValue: "One to two business days"
  },
  form: {
    stepLabel: "Request form",
    title: "Where should we begin?",
    description:
      "A little context helps us bring the right people and better questions to the first conversation.",
    name: "Full name",
    organization: "Organization",
    role: "Your role",
    phone: "Phone number",
    email: "Work email",
    collaborationType: "Area of collaboration",
    collaborationPlaceholder: "Select an area",
    collaborationOptions: [
      "Analysis and advisory",
      "Custom software development",
      "Data and business intelligence",
      "Systems integration and process automation",
      "Infrastructure and reliability",
      "Training and applied research",
      "Other"
    ],
    budget: "Estimated budget",
    budgetPlaceholder: "Select if known",
    budgetOptions: [
      "I need an estimate",
      "Under IRR 5 billion",
      "IRR 5–20 billion",
      "Over IRR 20 billion"
    ],
    timeline: "Preferred start",
    timelinePlaceholder: "Select a timeframe",
    timelineOptions: [
      "As soon as possible",
      "Within one to three months",
      "Within three to six months",
      "Still exploring"
    ],
    resume: "Résumé",
    resumeAction: "Choose and upload your résumé",
    resumeHint: "PDF, DOC, or DOCX — up to 5 MB",
    resumeRequired: "Please select your résumé file.",
    resumeInvalid: "The résumé must be a PDF, DOC, or DOCX file.",
    resumeTooLarge: "The résumé must be no larger than 5 MB.",
    message: "Tell us briefly about the need or opportunity",
    messagePlaceholder:
      "Describe the goal, current situation, key constraint, and the outcome you want to achieve.",
    consent:
      "By submitting, I agree to be contacted about this collaboration request.",
    submit: "Submit collaboration request",
    sending: "Sending…",
    success: "Your request and résumé were sent successfully.",
    error: "We could not send your request. Please try again or call us directly.",
    note:
      "The information and résumé you provide are used only to review this collaboration request.",
    call: "Call directly"
  },
  aside: {
    label: "What happens next",
    title: "A clear path from conversation to action",
    description:
      "The first conversation is designed to establish a shared view of the problem and the most useful next step.",
    steps: [
      {
        number: "01",
        title: "Initial review",
        description: "We review your request for fit, goals, and urgency."
      },
      {
        number: "02",
        title: "Discovery call",
        description: "A short session clarifies the problem, stakeholders, and measures of success."
      },
      {
        number: "03",
        title: "Recommended next step",
        description: "We propose a workshop, assessment, prototype, or delivery engagement."
      }
    ],
    suitableLabel: "This form is a good fit if you are looking to:",
    suitableItems: [
      "Build or modernize a software product",
      "Connect fragmented systems and data",
      "Digitize and improve an operational process",
      "Assess architecture, feasibility, or a delivery roadmap"
    ]
  },
  footer: {
    summary: "Software, data and process solutions for forward-looking organizations.",
    rights: "All rights reserved by Takapoo Garan Sepehr Mana."
  }
};

export const collaborationContent: Record<Locale, CollaborationContent> = {fa, en};
