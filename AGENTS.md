# Takapoo Garan Sepehr Mana — Agent Guide

## Project intent

Build and maintain the public company website for **تکاپوگران سپهر مانا**. The website is a bilingual, SEO-focused corporate presentation for software, data, process, infrastructure, and technology consulting services.

## Non-negotiable content rules

- Never publish the names of organizations, banks, insurers, or other clients mentioned in `docs/tgsepma/Mavand May 2026.pdf`.
- Describe experience only in aggregate terms such as “large-scale financial systems” or “enterprise platforms.”
- Treat contact information and biographies as editable content, not hard-coded component copy.
- Keep portrait areas as placeholders until approved photos are supplied.
- Do not expose national IDs, registration tracking numbers, capital, signatures, or other sensitive registry details from the legal PDFs.

## Architecture

- Next.js App Router with TypeScript and custom CSS.
- Locale routes live under `app/[locale]`.
- Supported locales are Persian (`fa`, default, RTL) and English (`en`, LTR).
- All public copy lives in `messages/*.json` or typed content modules.
- Shared presentational components live in `components`.
- Prefer server components. Use client components only for navigation state, interactions, or animation.
- Keep dependencies small and justified. Prefer CSS/SVG over heavyweight canvas or 3D libraries.

## Design system

- The brand direction is “connected systems”: precise geometry, network lines, deep navy, electric blue, cyan, and a restrained warm accent.
- Visuals must feel premium and technical, not like the source proposal slides.
- Respect `prefers-reduced-motion`.
- Keep text contrast at WCAG AA or better.
- Persian typography uses Vazirmatn; Latin typography uses a system sans stack.

## SEO and quality

- Each locale needs localized metadata, canonical URLs, and language alternates.
- Maintain `robots.ts`, `sitemap.ts`, Open Graph metadata, and Organization/ProfessionalService JSON-LD.
- Use semantic headings, descriptive links, and indexable server-rendered content.
- Preserve strong Core Web Vitals: avoid layout shift, excessive JavaScript, unoptimized images, and autoplay media.

## Validation

Before handing off changes:

1. Run `npm run check`.
2. Run `npm run build`.
3. Check both `/fa` and `/en`.
4. Check mobile navigation and RTL/LTR layout.
5. Search for forbidden client/company names from the source proposal.

## Source material

- `docs/tgsepma/PROJECT_BRIEF.md` is the normalized public-content source.
- `docs/tgsepma/ROADMAP.md` tracks delivery phases.
- `docs/tgsepma/ARCHITECTURE.md` documents technical decisions.
- Original PDFs and audio are evidence only; do not serve them publicly.
