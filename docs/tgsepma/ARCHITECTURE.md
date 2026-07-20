# Architecture and Technical Decisions

## Stack

- **Next.js 14 App Router:** server rendering, static generation, metadata APIs, sitemap/robots conventions, image optimization, and route-level SEO. Requires Node.js 18.17 or newer.
- **React 18:** stable component model used by the selected Next.js version.
- **TypeScript:** strict typing for locale content, navigation, and structured data.
- **Custom CSS:** token-driven styling without an additional build-time styling dependency.
- **next-intl:** locale-aware routing and message loading with RTL/LTR support.
- **Motion:** small client-side reveal and interaction effects with reduced-motion support.
- **Lucide React:** consistent accessible interface icons.
- **Vazirmatn:** local package-based Persian typography with no runtime font request.

## Routing

```text
/
  redirects to /fa
/fa
/en
/robots.txt
/sitemap.xml
```

All visible content is locale-prefixed. The middleware/request configuration validates locales and defaults to Persian.

## Rendering strategy

- Pages and content sections remain server components by default.
- Client boundaries are limited to the mobile navigation and motion wrappers.
- Locale pages are statically generated through `generateStaticParams`.
- No database or runtime API is required for the initial corporate site.

## Content strategy

- Translation strings live in `messages/fa.json` and `messages/en.json`.
- Repeated structured content uses arrays in the locale messages.
- Company configuration such as site URL, phone, and locality lives in `lib/site.ts`.
- Source PDFs remain under `docs` and are never copied into `public`.

## Visual strategy

The site uses a custom “signal network” system:

- layered radial light fields;
- SVG paths and nodes;
- geometric cards derived from the idea of integration;
- subtle grid/noise texture;
- blue/cyan brand spectrum with a warm signal accent;
- motion applied to entrances, active signals, and hover depth.

This produces a differentiated result without the bundle and accessibility costs of a full WebGL scene. Decorative graphics use CSS and SVG and do not compete with semantic content.

## SEO

- Locale-specific metadata is generated on the server.
- Canonical and alternate language URLs use the configured production origin.
- JSON-LD describes the company without unverified claims.
- Sitemap includes both locale variants.
- Robots allows crawling and points to the sitemap.
- Copy uses descriptive Persian and English terms around software development, enterprise systems, data, process automation, and IT consulting.

The production domain is intentionally environment-configurable through `NEXT_PUBLIC_SITE_URL`. Until the actual `.com` and `.ir` domains are confirmed, localhost is used in development.

## Accessibility

- Semantic landmarks and a skip link.
- Keyboard-operable navigation.
- Visible focus treatment.
- WCAG AA contrast targets.
- Decorative SVG marked appropriately.
- Motion disabled or minimized through `prefers-reduced-motion`.
- Correct `lang` and `dir` per locale.

## Contact form

The initial form is presentational because no email destination, CRM, SMTP configuration, or privacy policy was supplied. It must not pretend that a message was delivered. Production integration should use a server action, validation, spam protection, rate limiting, and a transactional email or CRM provider.

## Deployment

- Node.js deployment: `npm run build` then `npm run start`.
- Resource-sensitive local validation can use `taskset -c 0,1` plus low worker environment variables to keep CPU usage bounded.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
- Configure both `.com` and `.ir` at the DNS/CDN layer, choose one canonical origin, and redirect the other permanently.
- Submit the generated sitemap to Google Search Console after domain verification.
