import {ArrowUp, Mail, Phone} from "lucide-react";
import {BrandMark} from "@/components/brand-mark";
import {site, type Locale} from "@/lib/site";

type FooterLink = {
  label: string;
  href: string;
};

type SiteFooterProps = {
  locale: Locale;
  year: string;
  summary: string;
  rights: string;
  backToTop: string;
  navigation: FooterLink[];
};

const footerCopy = {
  fa: {
    contactTitle: "ارتباط با ما",
    contactDescription: "برای شروع گفتگو، بررسی نیاز یا هماهنگی جلسه، از مسیرهای زیر با ما در تماس باشید.",
    quickTitle: "دسترسی سریع",
    usefulTitle: "لینک‌های مفید",
    socialTitle: "شبکه‌های اجتماعی",
    phone: "تلفن",
    email: "ایمیل",
    // address: "موقعیت / آدرس",
    registration: "شماره ثبت شرکت",
    home: "صفحه اصلی",
    collaboration: "درخواست همکاری",
    contact: "تماس با ما"
  },
  en: {
    contactTitle: "Contact",
    contactDescription: "Start a conversation, share a need, or arrange a focused discovery call through the channels below.",
    quickTitle: "Quick navigation",
    usefulTitle: "Useful links",
    socialTitle: "Social channels",
    phone: "Phone",
    email: "Email",
    // address: "Location / address",
    registration: "Company registration no.",
    home: "Home",
    collaboration: "Collaboration request",
    contact: "Contact us"
  }
} as const;

export function SiteFooter({
  locale,
  year,
  summary,
  rights,
  backToTop,
  navigation
}: SiteFooterProps) {
  const copy = footerCopy[locale];
  const phone = locale === "fa" ? site.phoneDisplayFa : site.phoneDisplayEn;
  const basePath = `/${locale}`;

  const usefulLinks = [
    {label: copy.home, href: basePath},
    {label: copy.collaboration, href: `${basePath}/collaboration`},
    {label: copy.contact, href: `${basePath}#contact`}
    // NOTE: privacy policy / terms / status links intentionally omitted here.
    // TODO (code): Add privacy policy page link when available
    // TODO (code): Add terms of service page link when available
    // TODO (code): Add service status page link when available
  ];

  const socialLinks = [
    {label: "LinkedIn: tgsepma", href: "https://www.linkedin.com/in/tgsepma", icon: null},
    {label: "Instagram: @tgsepma", href: "https://instagram.com/tgsepma", icon: null},
    {label: "Telegram: @tgsepma", href: "https://t.me/tgsepma", icon: null}
  ];

  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="shell footer__main">
        <section className="footer__intro" aria-labelledby="footer-brand-title">
          <a className="footer__brand-link" href={basePath} aria-label={locale === "fa" ? site.nameFa : site.nameEn}>
            <BrandMark />
          </a>
          <h2 id="footer-brand-title">{locale === "fa" ? site.nameFa : site.nameEn}</h2>
          <p>{summary}</p>
          <div className="footer__social" aria-label={copy.socialTitle}>
            {socialLinks.map(({label, href}, i) => (
              <a href={href} key={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer">
                {i === 0 ? (
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-2-2h-1v8h-4v-8H9v-3a3 3 0 0 1 3-3h4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : i === 1 ? (
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M16 11.37a4 4 0 1 1-4.63-4.63" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2v20L11 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </section>

        <section className="footer__contact" aria-labelledby="footer-contact-title">
          <span className="footer__section-label">{copy.contactTitle}</span>
          <h2 id="footer-contact-title">{copy.contactDescription}</h2>
          <div className="footer__contact-grid">
            <a className="footer__contact-item" href={site.phoneHref}>
              <span><Phone aria-hidden="true" /></span>
              <div>
                <small>{copy.phone}</small>
                <b dir="ltr">{phone}</b>
              </div>
            </a>
            <a className="footer__contact-item" href={`mailto:${site.contactEmail}`}>
              <span><Mail aria-hidden="true" /></span>
              <div>
                <small>{copy.email}</small>
                <b dir="ltr">{site.contactEmail}</b>
              </div>
            </a>
            {/* Address temporarily hidden from the site
            <div className="footer__contact-item">
              <span><MapPin aria-hidden="true" /></span>
              <div>
                <small>{copy.address}</small>
                <b>ایران، تهران، تهران، استان تهران، شهرستان تهران، بخش مرکزی، شهر تهران، زنجان جنوبی، کوچه شهید جهانگیر ابراهیم، خیابان شهید نادر ایرانخواه، پلاک 33، طبقه 3، واحد 10</b>
              </div>
            </div>
            */}
          </div>
        </section>

        <nav className="footer__links" aria-label={copy.quickTitle}>
          <h2>{copy.quickTitle}</h2>
          {navigation.map((link) => (
            <a href={link.href} key={`${link.href}-${link.label}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <nav className="footer__links" aria-label={copy.usefulTitle}>
          <h2>{copy.usefulTitle}</h2>
          {usefulLinks.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="shell footer__bottom">
        <span>© {year}</span>
        <span>{rights}</span>
        <span className="footer__registration" dir="ltr">
          {copy.registration}: 676183
        </span>
        <a className="footer__top" href="#top" aria-label={backToTop}>
          <ArrowUp aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
