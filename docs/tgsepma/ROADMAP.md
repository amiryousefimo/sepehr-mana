# Delivery Roadmap

## Phase 0 — Discovery and normalization

- Inventory PDFs, extracted images, and audio.
- Extract legal activity scope, proposal capabilities, team roles, and contact requirements.
- Remove client-specific references and sensitive registry fields.
- Review the reference `airport` project for reusable stack decisions only.

**Exit condition:** approved public content brief with no named proposal clients.

## Phase 1 — Foundation

- Scaffold Next.js, TypeScript, Tailwind CSS, and linting.
- Add `next-intl` locale routing for Persian and English.
- Establish font loading, color tokens, spacing, container sizes, RTL/LTR behavior, and reduced-motion defaults.
- Create reusable logo, button, section heading, and surface primitives.

**Exit condition:** both locale routes render a shared shell correctly.

## Phase 2 — Brand experience

- Build the geometric network hero.
- Add responsive header, navigation, mobile menu, and language switcher.
- Create service constellation, solution cards, delivery-process timeline, values, and technology landscape.
- Add purposeful reveal and hover motion without compromising accessibility.

**Exit condition:** complete responsive visual experience across mobile and desktop.

## Phase 3 — Company content

- Add team biographies and portrait placeholders.
- Add public address and phone actions.
- Add a contact form interface with clear non-production submission behavior until a backend destination is configured.
- Verify all public claims against `PROJECT_BRIEF.md`.

**Exit condition:** every supplied business requirement is represented.

## Phase 4 — Search and sharing

- Add localized page titles and descriptions.
- Add canonical URLs and `hreflang` alternates.
- Add sitemap and robots endpoints.
- Add Organization and ProfessionalService structured data.
- Add Open Graph and social preview assets.
- Ensure semantic headings, internal links, crawlable content, and accessible names.

**Exit condition:** metadata and structured data are complete for both locales.

## Phase 5 — Validation and launch preparation

- Run lint and production build.
- Test RTL/LTR, keyboard navigation, reduced motion, and mobile menu.
- Audit for forbidden named clients and sensitive legal data.
- Review Lighthouse performance, accessibility, best practices, and SEO when a browser environment is available.
- Replace temporary domain, phone, address, portraits, and contact submission endpoint before production launch.

**Exit condition:** clean build and documented launch checklist.

## Future enhancements

- Dedicated service and solution detail pages for long-tail SEO.
- Persian knowledge center with case-study patterns that remain anonymized.
- CMS integration for articles and portfolio entries.
- Production contact delivery via a server action and transactional email provider.
- Analytics and Search Console after consent/privacy review.
- Additional locales through the existing message/content architecture.
- Approved team photography and custom social share images.
