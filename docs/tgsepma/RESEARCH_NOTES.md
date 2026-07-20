# Research Notes

## Reference project findings

The sibling `airport` project uses Next.js App Router, TypeScript, Tailwind CSS, Vazirmatn, Lucide, and small UI helpers. Those foundation choices are suitable, but its application-specific state, forms, query, QR, and component dependencies are unnecessary for a static corporate website.

## Selected approach

- Keep the proven Next.js/TypeScript foundation.
- Prefer compatibility with the available Node runtime and the proven reference baseline.
- Add `next-intl` for scalable locale routing and translations.
- Add Motion only where animation materially improves hierarchy and polish.
- Use CSS/SVG for the main visual identity instead of adding a large 3D dependency.

## Search guidance applied

- Localized pages use distinct URLs and language annotations.
- Important content remains server-rendered HTML.
- Metadata, canonicals, Open Graph information, sitemap, robots, and structured data are part of the application rather than post-launch patches.
- Organization markup contains only supplied, verifiable information.
- Visual animation honors reduced-motion preferences.

## Package snapshot

Versions initially researched on July 20, 2026:

- Next.js: 16.2.10
- React: 19.2.7
- next-intl: 4.13.2
- Motion: 12.42.2
- Lucide React: 1.25.0
- Tailwind CSS: 4.3.3

Exact resolved versions are recorded in `package-lock.json` after installation.

The implementation was intentionally aligned to Next.js 14.2.35 and React 18.3.1 after the host's Node 18 runtime and mounted-drive package resolution made the newer toolchain unnecessarily costly. The selected next-intl, Motion, and Lucide versions support this baseline. Custom CSS replaced Tailwind because the finished visual system does not use utility classes.
