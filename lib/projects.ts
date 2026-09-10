import type {Locale} from "@/lib/site";

export type Project = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  images: string[];
  published: boolean;
  year?: string;
  category?: string;
  client?: string;
  technologies?: string[];
  outcomes?: string[];
  slogan?: string;
  features?: {
    title: string;
    items: string[];
  }[];
};

export type ProjectsContent = {
  label: string;
  title: string;
  description: string;
  cta: string;
  viewAll: string;
  viewAllProjects: string;
  backToHome: string;
  projects: Project[];
};

const fa: ProjectsContent = {
  label: "پروژه‌ها",
  title: "نمونه کارهای منتخب",
  description:
    "پروژه‌هایی که در کنار تیم‌های سازمانی طراحی، توسعه و پیاده‌سازی کرده‌ایم. هر کدام تلاش برای حل یک مسئله واقعی، با فناوری مناسب و نگاه بلندمدت بوده‌اند.",
  cta: "مشاهده پروژه",
  viewAll: "نمایش همه پروژه‌ها",
  viewAllProjects: "مشاهده تمام پروژه‌ها",
  backToHome: "بازگشت به صفحه اصلی",
  projects: [
    {
      title: "سوپر اپلیکیشن فرودگاه امام خمینی",
      slug: "airport",
      shortDescription:
        "طراحی و توسعه سوپر اپلیکیشن یکپارچه فرودگاهی برای ارتقای تجربه مسافر، دیجیتالی‌سازی فرآیندها و ایجاد اکوسیستم خدمات هوشمند فرودگاهی.",
      description:
        "این پروژه نمونه‌ای از طراحی و توسعه سوپر اپلیکیشن فرودگاهی برای شرکت شهر فرودگاهی امام خمینی (ره) است. سامانه به عنوان بستر اصلی ارائه خدمات دیجیتال فرودگاه، با هدف ایجاد تجربه سفر یکپارچه (Seamless Passenger Journey)، افزایش درآمدهای غیرهوانوردی، کاهش مراجعات حضوری و ایجاد زیرساخت فرودگاه هوشمند طراحی شده است. سامانه شامل اپلیکیشن مسافر (Android / iOS / Web / PWA)، پنل مدیریتی جامع و لایه یکپارچه‌سازی با سامانه‌های حیاتی فرودگاه می‌باشد و قابلیت توسعه برای خدمات آتی را دارد.",
      slogan: "سوپر اپلیکیشن فرودگاهی — تجربه سفر یکپارچه و هوشمند",
      thumbnail: "/projects/airport/thumbnail.jpg.svg",
      images: [
        "/projects/airport/main_page.png",
        "/projects/airport/profile.png",
        "/projects/airport/elan.png",
        "/projects/airport/dastresi.png",
        "/projects/airport/khadamat.png",
        "/projects/airport/hame_khadamat.png",
        "/projects/airport/hame_khadamat2.png",
      ],
      published: true,
      year: "۱۴۰۵",
      category: "سوپر اپلیکیشن",
      client: "شرکت شهر فرودگاهی امام خمینی",
      technologies: [
        "Spring Boot",
        "Java",
        "Oracle",
        "PostgreSQL",
        "Kafka",
        "Kubernetes",
        "Redis",
        "Docker",
        "React",
        "Elasticsearch",
        "Microservices",
        "Event-Driven Architecture",
      ],
      outcomes: [
        "طراحی معماری ماژولار و رویدادمحور با قابلیت مقیاس‌پذیری بالا",
        "پیاده‌سازی جریان end-to-end مدیریت پرواز، مسافر و بار",
        "شبیه‌سازی یکپارچه‌سازی با سامانه‌های AODB، FIDS، BHS، RMS، ERP و CRM",
        "ایجاد زیرساخت مشاهده‌پذیری و پایش لحظه‌ای سیستم",
        "طراحی پنل مدیریتی جامع برای مدیریت خدمات، فروشندگان و درآمدها",
      ],
      features: [
        {
          title: "اپلیکیشن مسافر",
          items: [
            "Android / iOS / Web Application / PWA",
            "Apple Watch و Wear OS Integration",
            "ثبت‌نام از طریق درگاه ملی خدمات دولت هوشمند",
            "احراز هویت الکترونیکی و دومرحله‌ای",
            "Single Sign-On (SSO) و مدیریت پروفایل",
            "مدیریت اعضای خانواده و مدارک سفر",
          ],
        },
        {
          title: "مدیریت سفر و اطلاعات پرواز",
          items: [
            "جستجوی پرواز بر اساس شماره، شرکت هواپیمایی، مبدا و مقصد",
            "اطلاعات لحظه‌ای Arrival / Departure",
            "نمایش Boarding Time، Check-in Counter، Gate و Baggage Belt",
            "اعلان‌های هوشمند تأخیر، تعجیل، تغییر گیت، آغاز Boarding و کنسلی",
            "Check-in آنلاین و دریافت کارت پرواز دیجیتال",
            "افزودن کارت پرواز به Wallet",
          ],
        },
        {
          title: "رهگیری بار هوشمند (Smart Baggage)",
          items: [
            "رهگیری لحظه‌ای چمدان با اتصال به RFID",
            "نمایش وضعیت بار و اعلام ورود به نوار نقاله",
            "ثبت و پیگیری بار مفقودی",
            "ثبت خسارت بار",
            "اعلان تغییر وضعیت بار",
          ],
        },
        {
          title: "پارکینگ هوشمند",
          items: [
            "نمایش ظرفیت لحظه‌ای و نقشه پارکینگ",
            "پارکینگ کوتاه‌مدت، بلندمدت، Valet و افراد کم‌توان",
            "رزرو آنلاین، تمدید و Dynamic Pricing",
            "ورود و خروج با QR Code و پلاک‌خوان",
            "پرداخت بدون تماس",
          ],
        },
        {
          title: "بازارچه و غذا و نوشیدنی",
          items: [
            "مشاهده فروشگاه‌ها و محصولات + Duty Free",
            "خرید آنلاین، Click & Collect و تحویل در گیت",
            "مشاهده رستوران‌ها و منو",
            "رزرو میز، سفارش غذا و رهگیری سفارش",
            "پرداخت آنلاین و نظرات کاربران",
          ],
        },
        {
          title: "خدمات ویژه فرودگاهی",
          items: [
            "رزرو CIP و Fast Track",
            "Meet & Greet و همراه اختصاصی",
            "رزرو لانژ و صندلی استراحت",
            "رزرو هتل کپسولی و اتاق جلسات",
          ],
        },
        {
          title: "حمل‌ونقل",
          items: [
            "رزرو و رهگیری تاکسی",
            "اتصال به تاکسی اینترنتی",
            "رزرو موتور، اتوبوس، مترو و شاتل فرودگاهی",
          ],
        },
        {
          title: "خدمات مسافران خاص",
          items: [
            "رزرو ویلچر و درخواست همراه برای افراد کم‌توان",
            "خدمات همراهی سالمندان",
            "کالسکه کودک و اتاق مادر و کودک",
            "خدمات کودک بدون همراه (UMNR)",
          ],
        },
        {
          title: "خدمات مالی و باشگاه مشتریان",
          items: [
            "پرداخت عوارض خروج و عوارض هواپیماهای شخصی",
            "کیف پول دیجیتال، Cashback، Gift Card و Voucher",
            "برنامه وفاداری چندسطحی (Silver تا Diamond)",
            "امتیازدهی، تخفیف و کوپن",
          ],
        },
        {
          title: "دستیار هوشمند و مسیریابی",
          items: [
            "AI Airport Assistant با پاسخگویی چندزبانه",
            "نقشه سه‌بعدی فرودگاه و Indoor Navigation",
            "مسیریابی مبتنی بر واقعیت افزوده (AR)",
            "نمایش خدمات نزدیک، ازدحام و زمان انتظار",
            "مدیریت صف هوشمند برای Check-in، Security و Immigration",
          ],
        },
        {
          title: "سایر خدمات کلیدی",
          items: [
            "اشیاء گمشده و پیدا شده با تطبیق هوشمند تصویر",
            "رزرو هتل، اقامتگاه و تور",
            "خدمات سرگرمی (فیلم، موسیقی، بازی و استریم)",
            "پشتیبانی با چت‌بات هوش مصنوعی و Voice Assistant",
            "سامانه نظرسنجی استاندارد ASQ",
            "تبلیغات هدفمند و مبتنی بر موقعیت",
          ],
        },
        {
          title: "پنل مدیریتی و یکپارچه‌سازی",
          items: [
            "مدیریت کاربران، خدمات، محتوا، تبلیغات و فروشندگان",
            "مدیریت قراردادها، درآمدها و نظرسنجی‌ها",
            "داشبوردهای مدیریتی و BI لحظه‌ای",
            "اتصال به AODB، FIDS، BHS، RMS، ERP، CRM",
            "اتصال به سیستم‌های پارکینگ، هواپیمایی، Immigration و پرداخت",
          ],
        },
      ],
    },
    {
      title: "سامانه ذهن هوشمند صدرا",
      slug: "zehnesalem",
      shortDescription:
        "پلتفرم جامع مدیریت کلینیک روانپزشکی با رویکرد هوش مصنوعی در یک محیط یکپارچه.",
      description:
        "سامانه ذهن هوشمند صدرا یک پلتفرم جامع مدیریت کلینیک روانپزشکی است که تمام فرآیندهای اداری و بالینی کلینیک را در یک محیط یکپارچه ارائه می‌دهد. این سامانه با استفاده از هوش مصنوعی، فرآیندهای پذیرش، پرونده‌الکترونیک، نوبت‌دهی، گزارش‌گیری و تحلیل داده‌های بالینی را هوشمند و یکپارچه می‌کند.",
      slogan: "ذهن هوشمند صدرا — هوش مصنوعی در خدمت سلامت روان",
      thumbnail: "/projects/zehnesalem/thumbnail.jpg.svg",
      images: [
        "/projects/zehnesalem/banner1.png",
        "/projects/zehnesalem/banner2.png",
        "/projects/zehnesalem/banner3.png",
        "/projects/zehnesalem/banner4.png",
      ],
      published: true,
      year: "۱۴۰۵",
      category: "سلامت دیجیتال",
      client: "ذهن هوشمند صدرا",
      technologies: ["AI / ML", "Django", "PostgreSQL", "React", "Docker"],
      features: [
        {
          title: "مدیریت کلینیک",
          items: ["ثبت اطلاعات", "نقشه GPS", "اسنپ‌لینک", "چندکلینیکی"],
        },
        {
          title: "نوبت‌دهی",
          items: ["تقویم شمسی", "رزرو سریع", "تداخل‌یابی خودکار"],
        },
        {
          title: "پرونده بیمار",
          items: ["اطلاعات کامل", "پرسشنامه", "یادداشت", "روند بهبود"],
        },
        {
          title: "آزمون‌های روانشناسی",
          items: ["BDI-II", "BAI", "RSE", "GHQ-28", "PSS"],
        },
        {
          title: "ارجاع و انتقال",
          items: ["ارجاع دوطرفه", "انتقال با کنترل دسترسی"],
        },
        {
          title: "مدیریت مدارک",
          items: ["آپلود", "فشرده‌سازی", "تصویر پروفایل"],
        },
        {
          title: "داشبوردهای تحلیلی",
          items: ["کلینیک", "پزشک", "بیمار"],
        },
        {
          title: "مدیریت کاربران",
          items: ["نقش‌های داینامیک", "دسترسی سطح‌بندی‌شده"],
        },
      ],
    },
    {
      title: "سامانه گردش کار",
      slug: "workflow",
      shortDescription:
        "ابزار سازمانی برای مدیریت دیجیتال فرآیندهای کاری مانند درخواست مرخصی، خرید، تأیید اسناد و سایر گردش‌کارهای سازمانی.",
      description:
        "سامانه گردش کار یک پلتفرم سازمانی است که امکان تعریف، اجرا و پیگیری فرآیندهای کاری را به صورت کاملاً دیجیتال فراهم می‌کند. کاربران می‌توانند فرآیندهایی مانند درخواست مرخصی، درخواست خرید و تأیید اسناد را شروع کنند، در کارتابل خود اقدام کنند و وضعیت درخواست‌ها را به صورت لحظه‌ای پیگیری نمایند. سامانه دارای پنل مدیریت قدرتمند برای طراحی فرآیند، مدیریت نقش‌ها، وضعیت‌ها، اکشن‌ها و فرم‌ساز پویا است.",
      slogan: "سامانه گردش کار — فرآیندهای سازمانی به صورت دیجیتال و یکپارچه",
      thumbnail: "/projects/workflow/thumbnail.jpg.svg",
      images: [
      ],
      published: true,
      year: "۱۴۰۴",
      category: "سامانه سازمانی",
      client: "",
      technologies: ["Django", "PostgreSQL", "Angular", "Docker"],
      features: [
        {
          title: "کاربر عمومی",
          items: [
            "ورود و ثبت‌نام",
            "داشبورد با آمار سریع",
            "شروع فرآیند جدید از کاتالوگ",
            "کارتابل وظایف (Inbox)",
            "اجرای اکشن (تأیید، رد، برگشت، تعلیق)",
            "مشاهده و پیگیری فرآیندهای من",
            "اعلان‌ها و تنظیمات شخصی",
          ],
        },
        {
          title: "مدیریت فرآیند",
          items: [
            "کاتالوگ فرآیندها",
            "شماره پیگیری یکتا",
            "وضعیت‌های مختلف (در حال اجرا، تکمیل‌شده، لغو شده، تعلیق)",
            "فیلتر و جستجو پیشرفته",
            "نشانگر موعد (Deadline)",
          ],
        },
        {
          title: "پنل مدیریت (ادمین)",
          items: [
            "مدیریت کاربران و نقش‌ها",
            "مدیریت وضعیت‌ها و اکشن‌ها",
            "طراحی فرآیند (Process Designer)",
            "فرم‌ساز پویا (Form Builder)",
            "ساخت فرآیند نمونه کامل",
          ],
        },
        {
          title: "قابلیت‌های کلیدی",
          items: [
            "تقویم شمسی",
            "اعتبارسنجی فیلدها",
            "کامنت‌گذاری روی اکشن‌ها",
            "لغو فرآیند توسط شروع‌کننده یا ادمین",
            "اعلان خودکار رویدادها",
          ],
        },
      ],
    },
  ],
};

const en: ProjectsContent = {
  label: "Projects",
  title: "Selected Work",
  description:
    "Projects we have designed, engineered, and delivered alongside organizational teams. Each one tackles a real problem with the right technology and a long-term perspective.",
  cta: "View project",
  viewAll: "View all projects",
  viewAllProjects: "View all projects",
  backToHome: "Back to home",
  projects: [
    {
      title: "Imam Khomeini Airport Super App",
      slug: "airport",
      shortDescription:
        "Design and development of an integrated airport super app to enhance passenger experience, digitize processes, and create a smart airport service ecosystem.",
      description:
        "This project is a prototype of an airport super application designed for Imam Khomeini Airport City Company. The system serves as the main digital services platform of the airport, aiming to deliver a seamless passenger journey, increase non-aeronautical revenue, reduce physical visits, and build the foundation of a smart airport. It includes a passenger application (Android / iOS / Web / PWA), a comprehensive admin panel, and an integration layer with critical airport systems, while remaining extensible for future services.",
      slogan: "Airport Super App — Seamless & Intelligent Travel Experience",
      thumbnail: "/projects/airport/thumbnail.jpg.svg",
      images: [
        "/projects/airport/main_page.png",
        "/projects/airport/profile.png",
        "/projects/airport/elan.png",
        "/projects/airport/dastresi.png",
        "/projects/airport/khadamat.png",
        "/projects/airport/hame_khadamat.png",
        "/projects/airport/hame_khadamat2.png",
      ],
      published: true,
      year: "2026",
      category: "Super App",
      client: "Imam Khomeini Airport City Company",
      technologies: [
        "Spring Boot",
        "Java",
        "Oracle",
        "PostgreSQL",
        "Kafka",
        "Kubernetes",
        "Redis",
        "Docker",
        "React",
        "Elasticsearch",
        "Microservices",
        "Event-Driven Architecture",
      ],
      outcomes: [
        "Designed a modular, event-driven architecture with high scalability",
        "Implemented end-to-end flight, passenger, and baggage management flows",
        "Simulated integration with AODB, FIDS, BHS, RMS, ERP, and CRM systems",
        "Built real-time observability and monitoring infrastructure",
        "Designed a comprehensive admin panel for services, vendors, and revenue management",
      ],
      features: [
        {
          title: "Passenger Application",
          items: [
            "Android / iOS / Web Application / PWA",
            "Apple Watch & Wear OS Integration",
            "Registration via National Smart Government Services Gateway",
            "Electronic & two-factor authentication",
            "Single Sign-On (SSO) and profile management",
            "Family members and travel documents management",
          ],
        },
        {
          title: "Travel & Flight Management",
          items: [
            "Flight search by number, airline, origin and destination",
            "Real-time Arrival / Departure information",
            "Display of Boarding Time, Check-in Counter, Gate and Baggage Belt",
            "Smart notifications for delays, early departures, gate changes, boarding start and cancellations",
            "Online check-in and digital boarding pass",
            "Add boarding pass to Wallet",
          ],
        },
        {
          title: "Smart Baggage Tracking",
          items: [
            "Real-time baggage tracking with RFID connection",
            "Baggage status display and belt arrival notification",
            "Lost baggage registration and tracking",
            "Baggage damage reporting",
            "Status change notifications",
          ],
        },
        {
          title: "Smart Parking",
          items: [
            "Real-time capacity and parking map display",
            "Short-term, long-term, Valet and accessible parking",
            "Online reservation, extension and Dynamic Pricing",
            "Entry/exit via QR Code and license plate recognition",
            "Contactless payment",
          ],
        },
        {
          title: "Marketplace & Food & Beverage",
          items: [
            "Store and product browsing + Duty Free",
            "Online shopping, Click & Collect and gate delivery",
            "Restaurant and menu viewing",
            "Table reservation, food ordering and order tracking",
            "Online payment and user reviews",
          ],
        },
        {
          title: "Premium Airport Services",
          items: [
            "CIP and Fast Track reservation",
            "Meet & Greet and dedicated companion",
            "Lounge and rest seat reservation",
            "Capsule hotel and meeting room booking",
          ],
        },
        {
          title: "Transportation",
          items: [
            "Taxi booking and vehicle tracking",
            "Connection to ride-hailing services",
            "Motorcycle, bus, metro and airport shuttle reservation",
          ],
        },
        {
          title: "Special Passenger Services",
          items: [
            "Wheelchair reservation and companion request for passengers with reduced mobility",
            "Elderly assistance services",
            "Stroller and mother & child room",
            "Unaccompanied Minor (UMNR) services",
          ],
        },
        {
          title: "Financial Services & Loyalty",
          items: [
            "Exit fee and private aircraft fee payment",
            "Digital wallet, Cashback, Gift Card and Voucher",
            "Multi-tier loyalty program (Silver to Diamond)",
            "Points, discounts and coupons",
          ],
        },
        {
          title: "AI Assistant & Navigation",
          items: [
            "AI Airport Assistant with multilingual support",
            "3D airport map and Indoor Navigation",
            "Augmented Reality (AR) wayfinding",
            "Nearby services, crowding and waiting time display",
            "Smart queue management for Check-in, Security and Immigration",
          ],
        },
        {
          title: "Other Key Services",
          items: [
            "Lost & Found with intelligent image matching",
            "Hotel, accommodation and tour booking",
            "Entertainment services (movies, music, games and streaming)",
            "Support via AI chatbot and Voice Assistant",
            "Full ASQ standard survey system",
            "Targeted and location-based advertising",
          ],
        },
        {
          title: "Admin Panel & Integration Layer",
          items: [
            "User, service, content, advertising and vendor management",
            "Contract, revenue and survey management",
            "Managerial and real-time BI dashboards",
            "Integration with AODB, FIDS, BHS, RMS, ERP and CRM",
            "Connection to parking, airline, Immigration and payment systems",
          ],
        },
      ],
    },
    {
      title: "Sadra Smart Mind System",
      slug: "zehnesalem",
      shortDescription:
        "A comprehensive psychiatry clinic management platform powered by artificial intelligence.",
      description:
        "Sadra Smart Mind is a complete clinic management platform that unifies all administrative and clinical processes of a psychiatric clinic in one integrated environment. Leveraging AI, it streamlines patient intake, electronic health records, appointment scheduling, reporting, and clinical data analysis.",
      slogan: "Sadra Smart Mind — Artificial Intelligence for Mental Health",
      thumbnail: "/projects/zehnesalem/thumbnail.jpg.svg",
      images: [
        "/projects/zehnesalem/banner1.png",
        "/projects/zehnesalem/banner2.png",
        "/projects/zehnesalem/banner3.png",
        "/projects/zehnesalem/banner4.png",
      ],
      published: true,
      year: "2026",
      category: "Digital Health",
      client: "Sadra Smart Mind",
      technologies: ["AI / ML", "Django", "PostgreSQL", "React", "Docker"],
      features: [
        {
          title: "Clinic Management",
          items: ["Info registration", "GPS map", "Snap link", "Multi-clinic"],
        },
        {
          title: "Appointment Scheduling",
          items: ["Persian calendar", "Quick booking", "Auto conflict detection"],
        },
        {
          title: "Patient Records",
          items: ["Complete info", "Questionnaires", "Notes", "Progress tracking"],
        },
        {
          title: "Psychological Tests",
          items: ["BDI-II", "BAI", "RSE", "GHQ-28", "PSS"],
        },
        {
          title: "Referral & Transfer",
          items: ["Two-way referral", "Access-controlled transfer"],
        },
        {
          title: "Document Management",
          items: ["Upload", "Compression", "Profile image"],
        },
        {
          title: "Analytics Dashboards",
          items: ["Clinic", "Doctor", "Patient"],
        },
        {
          title: "User Management",
          items: ["Dynamic roles", "Level-based access"],
        },
      ],
    },
    {
      title: "Workflow Management System",
      slug: "workflow",
      shortDescription:
        "An organizational tool for digitally managing work processes such as leave requests, purchase requests, document approvals, and other business workflows.",
      description:
        "The Workflow Management System is an enterprise platform that enables the definition, execution, and tracking of business processes in a fully digital environment. Users can initiate processes such as leave requests, purchase requests, and document approvals, take action in their inbox, and monitor the status of their requests in real time. The system includes a powerful admin panel for process design, role management, status and action configuration, and a dynamic form builder.",
      slogan: "Workflow Management System — Organizational Processes, Fully Digital & Integrated",
      thumbnail: "/projects/workflow/thumbnail.jpg.svg",
      images: [],
      published: true,
      year: "2025",
      category: "Enterprise System",
      client: "",
      technologies: ["Django", "PostgreSQL", "React", "Redis", "Docker"],
      features: [
        {
          title: "General User",
          items: [
            "Login and registration",
            "Dashboard with quick statistics",
            "Start new process from catalog",
            "Task inbox (Kartabl)",
            "Execute actions (Approve, Reject, Return, Suspend)",
            "View and track my processes",
            "Notifications and personal settings",
          ],
        },
        {
          title: "Process Management",
          items: [
            "Process catalog",
            "Unique tracking number",
            "Multiple states (Running, Completed, Cancelled, Suspended)",
            "Advanced filtering and search",
            "Deadline indicators",
          ],
        },
        {
          title: "Admin Panel",
          items: [
            "User and role management",
            "Status and action management",
            "Process Designer",
            "Dynamic Form Builder",
            "Complete sample process creation guide",
          ],
        },
        {
          title: "Key Capabilities",
          items: [
            "Persian (Solar) calendar",
            "Field validation",
            "Commenting on actions",
            "Process cancellation by initiator or admin",
            "Automatic event notifications",
          ],
        },
      ],
    },
  ],
};

export const projectsContent: Record<Locale, ProjectsContent> = {fa, en};