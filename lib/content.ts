import type {Locale} from "@/lib/site";

export type IconName =
  | "brain"
  | "code"
  | "database"
  | "workflow"
  | "network"
  | "graduation"
  | "layers"
  | "chart"
  | "shield"
  | "pulse"
  | "blocks"
  | "refresh";

export type Service = {
  icon: IconName;
  title: string;
  description: string;
  items: string[];
};

export type Solution = {
  icon: IconName;
  number: string;
  title: string;
  description: string;
  tags: string[];
};

export type SiteContent = {
  meta: {title: string; description: string; keywords: string[]};
  nav: Record<
    "services" | "solutions" | "approach" | "about" | "team" | "contact" | "cta" | "language" | "menu",
    string
  >;
  hero: {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    description: string;
    primary: string;
    secondary: string;
    signalLabel: string;
    signals: string[];
  };
  intro: {
    label: string;
    title: string;
    description: string;
    metrics: {value: string; label: string}[];
  };
  services: {label: string; title: string; description: string; items: Service[]};
  solutions: {label: string; title: string; description: string; items: Solution[]};
  approach: {
    label: string;
    title: string;
    description: string;
    steps: {number: string; title: string; description: string}[];
  };
  about: {
    label: string;
    title: string;
    description: string;
    values: {title: string; description: string}[];
    technologyLabel: string;
    technologyTitle: string;
    technologies: string[];
  };
  team: {
    label: string;
    title: string;
    description: string;
    photoPending: string;
    people: {
      name: string;
      role: string;
      introduction: string;
      education: string[];
      initials: string;
      photoUrl?: string;
    }[];
  };
  contact: {
    label: string;
    title: string;
    description: string;
    phoneLabel: string;
    formTitle: string;
    name: string;
    organization: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
    note: string;
    call: string;
  };
  footer: {
    summary: string;
    navigation: string;
    contact: string;
    rights: string;
    backToTop: string;
  };
};

const fa: SiteContent = {
  meta: {
    title: "تکاپوگران سپهر مانا | راهکارهای نرم‌افزاری و سازمانی",
    description:
      "طراحی و توسعه نرم‌افزار سفارشی، راهکارهای داده، یکپارچه‌سازی، بهبود فرایند و زیرساخت فناوری برای سازمان‌های آینده‌نگر.",
    keywords: [
      "توسعه نرم افزار سازمانی",
      "نرم افزار سفارشی",
      "مشاوره فناوری اطلاعات",
      "یکپارچه سازی سیستم ها",
      "هوش تجاری",
      "طراحی داشبورد مدیریتی",
      "اتوماسیون فرایند"
    ]
  },
  nav: {
    services: "خدمات",
    solutions: "راهکارها",
    approach: "روش همکاری",
    about: "درباره ما",
    team: "تیم",
    contact: "تماس",
    cta: "شروع گفتگو",
    language: "English",
    menu: "فهرست"
  },
  hero: {
    eyebrow: "راهکارهای یکپارچه برای سازمان‌های رو به آینده",
    titleStart: "پیچیدگی به",
    titleAccent: "مزیت دیجیتال",
    description:
      "از کشف مسئله تا طراحی، توسعه، استقرار و پشتیبانی؛ سیستم‌هایی می‌سازیم که فرایند، داده و فناوری را در یک مسیر روشن به هم متصل می‌کنند.",
    primary: "مشاهده راهکارها",
    secondary: "آشنایی با ما",
    signalLabel: "حوزه‌های تخصص",
    signals: ["نرم‌افزار", "داده", "فرایند", "زیرساخت"]
  },
  intro: {
    label: "یک زنجیره کامل تحویل",
    title: "فناوری وقتی ارزشمند است که مسئله واقعی کسب‌وکار را حل کند.",
    description:
      "تکاپوگران سپهر مانا یک تیم چندتخصصی در تحلیل کسب‌وکار، طراحی محصول، مهندسی نرم‌افزار، داده و زیرساخت است. با نگاه سیستمی، نیازهای پیچیده را به راهکارهای قابل اتکا، توسعه‌پذیر و قابل اندازه‌گیری تبدیل می‌کنیم.",
    metrics: [
      {value: "۰۱", label: "مسئله‌محور"},
      {value: "۳۶۰°", label: "از تحلیل تا پشتیبانی"},
      {value: "∞", label: "آماده رشد"}
    ]
  },
  services: {
    label: "خدمات",
    title: "توانمندی‌هایی که کنار هم، نتیجه می‌سازند",
    description:
      "خدمات ما مستقل از فناوری خاص طراحی می‌شوند و از اهداف کسب‌وکار، کیفیت تجربه و پایداری عملیاتی شروع می‌کنند.",
    items: [
      {
        icon: "brain",
        title: "تحلیل و مشاوره",
        description: "شفاف‌کردن مسئله، اولویت‌ها و نقشه راه پیش از شروع ساخت.",
        items: ["کشف نیازمندی", "تحلیل کسب‌وکار", "معماری راهکار"]
      },
      {
        icon: "code",
        title: "مهندسی نرم‌افزار",
        description: "توسعه محصولات وب، موبایل و سامانه‌های داخلی متناسب با سازمان.",
        items: ["نرم‌افزار سفارشی", "ERP و CRM", "نوسازی سامانه"]
      },
      {
        icon: "database",
        title: "داده و هوشمندی",
        description: "تبدیل داده‌های پراکنده به دید مدیریتی و تصمیم‌های دقیق‌تر.",
        items: ["داشبورد مدیریتی", "هوش تجاری", "مهاجرت داده"]
      },
      {
        icon: "workflow",
        title: "فرایند و یکپارچگی",
        description: "اتصال سامانه‌ها و بازطراحی گردش‌کار برای حذف اصطکاک عملیاتی.",
        items: ["BPM و BRMS", "API و Middleware", "اتوماسیون"]
      },
      {
        icon: "network",
        title: "زیرساخت و پایایی",
        description: "زیرساختی که برای امنیت، مشاهده‌پذیری و رشد طراحی شده است.",
        items: ["استقرار", "مانیتورینگ", "بهینه‌سازی عملکرد"]
      },
      {
        icon: "graduation",
        title: "آموزش و پژوهش",
        description: "انتقال دانش و پژوهش کاربردی برای توانمندسازی تیم‌های فناوری.",
        items: ["آموزش تخصصی", "پژوهش کاربردی", "انتقال دانش"]
      }
    ]
  },
  solutions: {
    label: "راهکارها و محصولات",
    title: "بلوک‌های آماده برای ساخت آینده سازمان",
    description:
      "این راهکارها بر اساس نیازهای پرتکرار سازمانی تعریف شده‌اند و برای هر کسب‌وکار به‌صورت اختصاصی ترکیب و پیاده‌سازی می‌شوند.",
    items: [
      {
        icon: "layers",
        number: "01",
        title: "پلتفرم‌های سازمانی",
        description:
          "سامانه‌های یکپارچه داخلی برای مدیریت عملیات، ارتباط با مشتری و جریان اطلاعات.",
        tags: ["ERP", "CRM", "پرتال سازمانی"]
      },
      {
        icon: "chart",
        number: "02",
        title: "مرکز هوشمندی داده",
        description:
          "داشبوردها، گزارش‌های تعاملی و لایه‌های تحلیلی برای یک تصویر واحد از عملکرد.",
        tags: ["BI", "Data Platform", "Visualization"]
      },
      {
        icon: "shield",
        number: "03",
        title: "سامانه‌های مالی و تراکنشی",
        description:
          "راهکارهای مقیاس‌پذیر برای گردش حساب، کیف پول، اعتبار و عملیات حساس.",
        tags: ["Transaction", "Wallet", "Financial Core"]
      },
      {
        icon: "blocks",
        number: "04",
        title: "لایه یکپارچه‌سازی",
        description:
          "اتصال امن سرویس‌ها، داده‌ها و سامانه‌های قدیمی با معماری API و پیام.",
        tags: ["API", "Middleware", "Event Driven"]
      },
      {
        icon: "refresh",
        number: "05",
        title: "اتوماسیون فرایند",
        description:
          "مدل‌سازی، اجرای دیجیتال و پایش فرایندهای کسب‌وکار با قواعد قابل مدیریت.",
        tags: ["BPM", "BRMS", "Workflow"]
      },
      {
        icon: "pulse",
        number: "06",
        title: "پایش و عملیات",
        description:
          "دید لحظه‌ای به سلامت سرویس‌ها برای کاهش ریسک، خطا و زمان اختلال.",
        tags: ["Observability", "Monitoring", "Reliability"]
      }
    ]
  },
  approach: {
    label: "روش همکاری",
    title: "از ابهام تا یک سیستم زنده و قابل رشد",
    description:
      "هر پروژه با شناخت دقیق زمینه شروع می‌شود و با تحویل کد پایان نمی‌یابد. ما نتیجه را در چرخه کامل محصول دنبال می‌کنیم.",
    steps: [
      {
        number: "۰۱",
        title: "کشف و هم‌راستایی",
        description: "شناخت هدف، ذی‌نفعان، محدودیت‌ها و معیارهای موفقیت."
      },
      {
        number: "۰۲",
        title: "طراحی راهکار",
        description: "تعریف تجربه، معماری، داده و برنامه اجرایی قابل سنجش."
      },
      {
        number: "۰۳",
        title: "ساخت تکرارشونده",
        description: "تحویل مرحله‌ای، بازخورد سریع و کنترل مداوم کیفیت."
      },
      {
        number: "۰۴",
        title: "استقرار و تکامل",
        description: "راه‌اندازی مطمئن، پایش، پشتیبانی و بهبود مستمر."
      }
    ]
  },
  about: {
    label: "درباره ما",
    title: "تجربه و انرژی تازه، در یک تیم یکپارچه",
    description:
      "ما میان نگاه مدیریتی و عمق فنی پل می‌زنیم. تجربه کار با سامانه‌های پیچیده و محیط‌های حساس به ما کمک می‌کند سریع‌تر به اصل مسئله برسیم؛ تیم چابک و چندتخصصی ما نیز راهکار را از ایده تا بهره‌برداری همراهی می‌کند.",
    values: [
      {
        title: "مسئولیت‌پذیری",
        description: "نتیجه را مالک می‌شویم و تصمیم‌ها را شفاف پیش می‌بریم."
      },
      {
        title: "مهندسی پایدار",
        description: "راهکار را برای امروز نمی‌سازیم؛ برای تغییر فردا آماده‌اش می‌کنیم."
      },
      {
        title: "همکاری واقعی",
        description: "دانش را محصور نمی‌کنیم و کنار تیم مشتری ظرفیت می‌سازیم."
      }
    ],
    technologyLabel: "چشم‌انداز فناوری",
    technologyTitle: "ابزار مناسب، نه ابزار محبوب",
    technologies: [
      "Java",
      "Python",
      "PHP",
      "React",
      "Vue",
      "Angular",
      "PostgreSQL",
      "Oracle",
      "Kafka",
      "Pulsar",
      "Camunda",
      "Grafana",
      "Power BI",
      "Tableau"
    ]
  },
  team: {
    label: "تیم راهبری",
    title: "ترکیب مدیریت و مهندسی نرم‌افزار",
    description:
      "راهبری شرکت با درک هم‌زمان از مدیریت سازمان و ساخت محصولات نرم‌افزاری انجام می‌شود.",
    photoPending: "تصویر به‌زودی",
    people: [
      {
        name: "امیر محمد یوسفی",
        role: "مدیرعامل و عضو هیئت‌مدیره",
        introduction:
          "امیر محمد یوسفی با پیش‌زمینه‌ای در مدیریت و مهندسی نرم‌افزار، راهبری شرکت و جهت‌دهی به توسعه راهکارهای سازمانی را بر عهده دارد.",
        education: [
          "کارشناسی ارشد مدیریت، دانشگاه صنعتی مالک اشتر",
          "کارشناسی مهندسی نرم‌افزار"
        ],
        initials: "ای"
      },
      {
        name: "لیلا شریعتی",
        role: "رئیس هیئت‌مدیره",
        introduction:
          "لیلا شریعتی با ترکیب دانش مدیریت و مهندسی نرم‌افزار، در راهبری هیئت‌مدیره و هم‌راستایی تصمیم‌های سازمانی نقش دارد.",
        education: [
          "کارشناسی ارشد مدیریت، دانشگاه صنعتی مالک اشتر",
          "کارشناسی مهندسی نرم‌افزار"
        ],
        initials: "لش"
      },
      {
        name: "حمید فدایی",
        role: "عضو تیم",
        introduction:
          "حمید فدایی از اعضای تیم تکاپوگران سپهر مانا است و در مسیر همکاری‌های تیمی و تحقق اهداف شرکت مشارکت می‌کند.",
        education: [],
        initials: "حف"
      }
    ]
  },
  contact: {
    label: "شروع یک همکاری",
    title: "برای مسئله بعدی سازمان شما آماده‌ایم.",
    description:
      "اگر درباره ساخت محصول، یکپارچه‌سازی، داده یا بهبود فرایند فکر می‌کنید، یک گفت‌وگوی کوتاه می‌تواند نقطه شروع مسیر باشد.",
    phoneLabel: "شماره تماس",
    formTitle: "چند خط درباره نیازتان بنویسید",
    name: "نام و نام خانوادگی",
    organization: "نام سازمان",
    email: "ایمیل",
    phone: "شماره تماس",
    message: "شرح کوتاه نیاز",
    submit: "ارسال درخواست",
    sending: "در حال ارسال…",
    success: "درخواست شما با موفقیت ارسال شد.",
    error: "ارسال انجام نشد. لطفاً دوباره تلاش کنید یا مستقیماً تماس بگیرید.",
    note: "اطلاعات این فرم فقط برای بررسی درخواست شما استفاده می‌شود.",
    call: "تماس مستقیم"
  },
  footer: {
    summary:
      "طراحی و توسعه راهکارهای نرم‌افزاری، داده و فرایند برای سازمان‌های رو به آینده.",
    navigation: "دسترسی سریع",
    contact: "ارتباط",
    rights: "تمامی حقوق برای تکاپوگران سپهر مانا محفوظ است.",
    backToTop: "بازگشت به بالا"
  }
};

const en: SiteContent = {
  meta: {
    title: "Takapoo Garan Sepehr Mana | Enterprise Technology Solutions",
    description:
      "Custom software, data platforms, systems integration, process improvement and technology infrastructure for forward-looking organizations.",
    keywords: [
      "enterprise software development",
      "custom software",
      "IT consulting Tehran",
      "systems integration",
      "business intelligence",
      "management dashboards",
      "process automation"
    ]
  },
  nav: {
    services: "Services",
    solutions: "Solutions",
    approach: "Approach",
    about: "About",
    team: "Team",
    contact: "Contact",
    cta: "Start a conversation",
    language: "فارسی",
    menu: "Menu"
  },
  hero: {
    eyebrow: "Integrated solutions for forward-looking organizations",
    titleStart: "Turn complexity into",
    titleAccent: "digital advantage",
    description:
      "From discovery to design, engineering, deployment and support, we build systems that connect processes, data and technology through one clear path.",
    primary: "Explore solutions",
    secondary: "Meet the company",
    signalLabel: "Areas of expertise",
    signals: ["Software", "Data", "Process", "Infrastructure"]
  },
  intro: {
    label: "One complete delivery chain",
    title: "Technology matters when it solves a real business problem.",
    description:
      "Takapoo Garan Sepehr Mana brings together business analysis, product design, software engineering, data and infrastructure. We turn complex needs into dependable, scalable and measurable digital solutions.",
    metrics: [
      {value: "01", label: "Problem first"},
      {value: "360°", label: "Discovery to support"},
      {value: "∞", label: "Built to evolve"}
    ]
  },
  services: {
    label: "Services",
    title: "Capabilities that create more value together",
    description:
      "Our work begins with business outcomes, experience quality and operational resilience—not a predetermined technology.",
    items: [
      {
        icon: "brain",
        title: "Analysis & advisory",
        description: "Clarify the problem, priorities and delivery path before building.",
        items: ["Requirements discovery", "Business analysis", "Solution architecture"]
      },
      {
        icon: "code",
        title: "Software engineering",
        description: "Web, mobile and internal systems shaped around the organization.",
        items: ["Custom software", "ERP & CRM", "Legacy modernization"]
      },
      {
        icon: "database",
        title: "Data & intelligence",
        description: "Turn fragmented information into management insight and better decisions.",
        items: ["Executive dashboards", "Business intelligence", "Data migration"]
      },
      {
        icon: "workflow",
        title: "Process & integration",
        description: "Connect systems and redesign workflows to remove operational friction.",
        items: ["BPM & BRMS", "API & middleware", "Automation"]
      },
      {
        icon: "network",
        title: "Infrastructure & reliability",
        description: "Infrastructure designed for security, observability and growth.",
        items: ["Deployment", "Monitoring", "Performance"]
      },
      {
        icon: "graduation",
        title: "Training & research",
        description: "Knowledge transfer and applied research that strengthen technology teams.",
        items: ["Specialist training", "Applied research", "Team enablement"]
      }
    ]
  },
  solutions: {
    label: "Solutions & products",
    title: "Building blocks for your organization’s next stage",
    description:
      "These solution areas address recurring enterprise needs and are configured and engineered around each organization.",
    items: [
      {
        icon: "layers",
        number: "01",
        title: "Enterprise platforms",
        description:
          "Integrated internal systems for operations, customer relationships and information flow.",
        tags: ["ERP", "CRM", "Enterprise portals"]
      },
      {
        icon: "chart",
        number: "02",
        title: "Data intelligence hub",
        description:
          "Dashboards, interactive reporting and analytics for one view of performance.",
        tags: ["BI", "Data platform", "Visualization"]
      },
      {
        icon: "shield",
        number: "03",
        title: "Financial & transaction systems",
        description:
          "Scalable solutions for accounts, wallets, credit and sensitive operations.",
        tags: ["Transaction", "Wallet", "Financial core"]
      },
      {
        icon: "blocks",
        number: "04",
        title: "Integration layer",
        description:
          "Securely connect services, data and legacy systems through API and messaging patterns.",
        tags: ["API", "Middleware", "Event driven"]
      },
      {
        icon: "refresh",
        number: "05",
        title: "Process automation",
        description:
          "Model, digitize and monitor business processes with manageable rules.",
        tags: ["BPM", "BRMS", "Workflow"]
      },
      {
        icon: "pulse",
        number: "06",
        title: "Observability & operations",
        description:
          "Real-time service health insight to reduce risk, error and disruption.",
        tags: ["Observability", "Monitoring", "Reliability"]
      }
    ]
  },
  approach: {
    label: "How we work",
    title: "From ambiguity to a living, evolving system",
    description:
      "Every engagement starts by understanding its context and continues beyond code delivery. We remain focused on outcomes throughout the product lifecycle.",
    steps: [
      {
        number: "01",
        title: "Discover & align",
        description: "Understand goals, stakeholders, constraints and measures of success."
      },
      {
        number: "02",
        title: "Design the solution",
        description: "Define experience, architecture, data and a measurable delivery plan."
      },
      {
        number: "03",
        title: "Build iteratively",
        description: "Deliver in stages, learn quickly and control quality continuously."
      },
      {
        number: "04",
        title: "Launch & evolve",
        description: "Deploy safely, observe, support and improve over time."
      }
    ]
  },
  about: {
    label: "About us",
    title: "Experience and fresh energy in one integrated team",
    description:
      "We bridge management perspective and engineering depth. Experience with complex, high-stakes systems helps us reach the core problem faster, while our agile multidisciplinary team carries the solution from idea to operation.",
    values: [
      {
        title: "Ownership",
        description: "We take responsibility for outcomes and keep decisions transparent."
      },
      {
        title: "Sustainable engineering",
        description: "We build beyond today and prepare every solution for tomorrow’s change."
      },
      {
        title: "True collaboration",
        description: "We share knowledge and build lasting capability with client teams."
      }
    ],
    technologyLabel: "Technology landscape",
    technologyTitle: "The right tool, not the fashionable one",
    technologies: [
      "Java",
      "Python",
      "PHP",
      "React",
      "Vue",
      "Angular",
      "PostgreSQL",
      "Oracle",
      "Kafka",
      "Pulsar",
      "Camunda",
      "Grafana",
      "Power BI",
      "Tableau"
    ]
  },
  team: {
    label: "Leadership",
    title: "Management and software engineering, combined",
    description:
      "The company is guided by leaders who understand both organizational management and software product delivery.",
    photoPending: "Portrait coming soon",
    people: [
      {
        name: "Amir Mohammad Yousefi",
        role: "Chief Executive Officer & Board Member",
        introduction:
          "With a background in management and software engineering, Amir Mohammad Yousefi leads the company and helps guide the development of enterprise solutions.",
        education: [
          "Master’s in Management, Malek Ashtar University of Technology",
          "Bachelor’s in Software Engineering"
        ],
        initials: "AY"
      },
      {
        name: "Leila Shariati",
        role: "Chair of the Board",
        introduction:
          "Combining management and software engineering expertise, Leila Shariati contributes to board leadership and the alignment of organizational decisions.",
        education: [
          "Master’s in Management, Malek Ashtar University of Technology",
          "Bachelor’s in Software Engineering"
        ],
        initials: "LS"
      },
      {
        name: "Hamid Fadaei",
        role: "Team Member",
        introduction:
          "Hamid Fadaei is a member of the Takapoo Garan Sepehr Mana team, contributing to team collaboration and the company’s shared goals.",
        education: [],
        initials: "HF"
      }
    ]
  },
  contact: {
    label: "Start a partnership",
    title: "We are ready for your organization’s next challenge.",
    description:
      "If you are planning a product, integration, data or process initiative, a short conversation can be the first step.",
    phoneLabel: "Phone",
    formTitle: "Tell us briefly what you need",
    name: "Full name",
    organization: "Organization",
    email: "Email",
    phone: "Phone number",
    message: "A short project description",
    submit: "Send inquiry",
    sending: "Sending…",
    success: "Your inquiry was sent successfully.",
    error: "We could not send your inquiry. Please try again or call us directly.",
    note: "The information in this form is used only to review your inquiry.",
    call: "Call directly"
  },
  footer: {
    summary:
      "Software, data and process solutions for forward-looking organizations.",
    navigation: "Navigation",
    contact: "Contact",
    rights: "All rights reserved by Takapoo Garan Sepehr Mana.",
    backToTop: "Back to top"
  }
};

export const content: Record<Locale, SiteContent> = {fa, en};
