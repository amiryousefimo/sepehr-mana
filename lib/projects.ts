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
        "پلتفرم یکپارچه مدیریت عملیات، مسافران و دارایی‌های فرودگاه با مقیاس‌پذیری بالا.",
      description:
        "این پروژه یک نمونه اولیه از یک سامانه یکپارچه مدیریت فرآیندهای فرودگاهی است که حوزه‌هایی مانند Landing و Takeoff، تخصیص گیت، مدیریت بار، اطلاعات مسافران و بلیتینگ، و مدیریت دارایی‌های زمینی و هوایی را در بر می‌گیرد. معماری پروژه به‌صورت ماژولار و رویدادمحور طراحی شده تا سناریوهای مختلف عملیاتی، پردازش رویدادها و تعامل میان اجزای سیستم را شبیه‌سازی و ارزیابی کند و بستری برای بررسی الگوهای یکپارچه‌سازی با سامانه‌های بیرونی فراهم آورد.",
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
      year: "1405",
      category: "سوپر اپلیکیشن",
      client: "فرودگاه بین المللی امام خمینی",
      technologies: ["Spring Boot", "Java", "Oracle", 
        "Kafka", "Kubernetes", "Redis", "Docker", "React", "Elastic", "MicroSerive"],
      outcomes: [
        "طراحی و پیاده‌سازی جریان پردازش پرواز به‌صورت end-to-end",
        "شبیه‌سازی پشتیبانی از بار پردازشی بالا در شرایط اوج",
        "پیاده‌سازی یکپارچه‌سازی با سامانه‌های بیرونی",
        "ایجاد زیرساخت مشاهده‌پذیری برای پایش لحظه‌ای سیستم",
      ]
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
      title: "Imam Khomeini International Airport Super Application",
      slug: "airport",
      shortDescription:
        "Integrated platform for airport operations, passenger flow, and asset management at scale.",
      description:
        "This project is a prototype of an integrated airport operations management system covering areas such as Landing and Takeoff, gate allocation, baggage management, passenger information and ticketing, and the management of ground and air assets. The system was designed with a modular, event-driven architecture to simulate and evaluate different operational scenarios, event processing, and interactions between system components, while providing a foundation for exploring integrations with external systems.",
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
      category: "Enterprise Platform",
      client: "Imam Khomeni International Airport",
      technologies: ["Spring Boot", "Java", "Oracle", 
        "Kafka", "Kubernetes", "Redis", "Docker", "React", "Elastic", "MicroService"],
      outcomes: [
        "End-to-end implementation of flight processing workflows",
        "Simulation of high-load processing under peak conditions",
        "Implementation of integrations with external systems",
        "Real-time observability infrastructure for system monitoring",
      ]
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
    },
  ],
};

export const projectsContent: Record<Locale, ProjectsContent> = {fa, en};