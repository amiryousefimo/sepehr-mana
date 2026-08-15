# Takapoo Garan Sepehr Mana

Bilingual corporate website for **تکاپوگران سپهر مانا**, built with Next.js, TypeScript, custom CSS, next-intl, Motion, Lucide, and Vazirmatn.

## Requirements

- Node.js 18.17 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

Open `/fa` for Persian or `/en` for English.

## Production

```bash
npm run check
npm run build
npm run start
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS domain before building:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com npm run build
```

The `.com` and `.ir` domains should not serve duplicate independent copies. Select one canonical origin and permanently redirect the other to it.

## Content updates

- Public content: `lib/content.ts`
- Phone, address, and origin: `lib/site.ts`
- Team portraits: replace the placeholders in `app/[locale]/page.tsx` after approved images are placed under `public`
- Project requirements: `docs/tgsepma/PROJECT_BRIEF.md`
- Roadmap: `docs/tgsepma/ROADMAP.md`
- Architecture: `docs/tgsepma/ARCHITECTURE.md`

Do not publish client names or sensitive registry details from the source PDFs. See `AGENTS.md`.

## Contact form

The launch version intentionally displays a disabled form and a direct-call fallback. Connect a validated server action, spam protection, rate limiting, and an approved delivery provider before enabling submission.

## Collaboration form email

The collaboration page accepts a message and a PDF, DOC, or DOCX résumé up to
5 MB. Submissions are sent through the Resend API. Configure these production
environment variables:

```bash
RESEND_API_KEY=re_your_api_key
COLLABORATION_FROM_EMAIL=Takapoo Garan <collaboration@your-verified-domain.com>
COLLABORATION_RECIPIENT_EMAIL=amirousefimo@gmail.com
```

The domain used by `COLLABORATION_FROM_EMAIL` must be verified in Resend. API
credentials are read only by the server route and must not use a
`NEXT_PUBLIC_` prefix.
