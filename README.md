# StyBay

An editorial launch website with About, Technology, Contact, and approved legal pages: fashion abundance becomes a personal discovery feed. Warm off-white, restrained teal, oversized type, and a single dark style chapter carry the story from chaos to discovery, organization, and personal taste.

## Run

Requires Node.js 20.9+ and npm (tested with Node 24).

```sh
npm install
npm run dev
```

Open http://localhost:3000. On Windows PowerShell with script execution disabled, use npm.cmd instead of npm.

Production static export:

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

The build generates **out/**. Upload that directory to any static host. The included start script serves the export locally; it is a preview server, not an internet-facing hosting service. The site requires no Next.js runtime server.

## Configuration

Canonical URLs use https://stybay.com. The existing Tally waitlist remains https://tally.so/r/0Qpg8P. Both are centralized in lib/site.ts. The website requires no signup backend.

Copy .env.example to .env.local to set the optional NEXT_PUBLIC_CONTACT_EMAIL to an approved public address, then rebuild. When blank, Contact explains that the public email will be shared later. No address is invented.

Approved legal wording lives in content/legal/privacy-policy.md and content/legal/terms.md. The legal pages render those files at build time. Preserve the wording; the multipage check compares the rendered text with these sources.

## Structure

- app/page.tsx — ordered narrative composition.
- app/layout.tsx — metadata, favicon, viewport, skip link, structured data.
- app/globals.css — tokens, typography, section layouts, responsive art direction, reduced-motion presentation.
- components/IntroSequence.tsx — existing discovery burst, session skip, reduced-motion skip.
- components/HeroDiscovery.tsx — GSAP scatter-to-feed transformation and Home-screen reveal.
- components/ProblemSection.tsx — separate browsing windows resolve toward one discovery surface.
- components/PhoneShowcase.tsx — Discover, Search, Explore, Save; sticky desktop and stacked mobile.
- components/PersonalizationSection.tsx — three selectable moods and related imagery.
- components/IntentSearch.tsx — pausable typing and selectable intent examples using relevant supplied dresses.
- components/CollectionsSection.tsx — collection imagery and real Profile screen.
- components/FinalCTA.tsx — ordered hero callback and existing Tally waitlist. Footer.tsx is shared by all routes.
- components/Header.tsx, Primitives.tsx, MotionProvider.tsx — navigation, shared images/device shell, Lenis and reveal lifecycle.
- lib/assets.ts — central brand, screen, and 60-product manifest.
- lib/productCatalog.ts — visually reviewed categories, palettes, patterns, concepts, editorial preferences, and named section pools. Static illustrations, not production recommendations.
- components/technology/ — editorial query, Taste Lab, Visual DNA, and Style Constellation.
- app/technology-lab.css — responsive Technology studies.
- scripts/ — asset optimization, static preview server, and browser verification.

## Assets and fonts

All 60 supplied product photographs were visually reviewed. The library contains dresses and two jumpsuits; metadata records visible design impressions without claiming unverified materials. Named pools reduce repetition across major sections. Intro and final callbacks, and related visual studies, deliberately repeat selected products.

Originals in public/assets/products remain unchanged. All 60 display WebPs use a 480 × 720 warm neutral canvas (#f0efeb), consistent garment framing, and contain sizing. Together they total approximately 0.92 MB. Below-fold images remain lazy-loaded.

`npm run assets:normalize` regenerates product presentation assets. The same step runs automatically before production builds. It replaces only border-connected neutral backdrop pixels, preserves garment colours, crops excess source whitespace, and fits each isolated garment into a common padded canvas. A reviewed interior guard protects the low-contrast white garment in product27. The process is intended for this isolated product library; visually review new sources and re-check catalogue descriptions when the photographed garment changes.

The generated lib/productDisplay.json records source/output revisions. Unchanged derivatives are reused; changed originals or processing code trigger regeneration. Image URLs carry the output revision to refresh cached display assets. `npm run assets:optimize` runs product normalization and optimizes supplied UI screenshots. Contact sheets can be regenerated with `node scripts/product-contact-sheets.mjs`; add `--normalized` to review the display outputs.

ProductImage in components/Primitives.tsx owns the shared clipped frame. app/product-frames.css handles the deliberately different browser-window, strip, and editorial placements. UI screenshots retain their own presentation.

UI mapping: home → Discover and hero; search → Search; product → Explore; collections → Save; profile → collections chapter. product_catalog and sign_in are indexed for future use. Screens are 413 × 864 except product, which is 413 × 1687 and scrolls within the device on desktop or in a keyboard-focusable region on mobile. Existing retailer marks appear only inside supplied product screenshots; there are no invented partnership claims.

No licensed font files were supplied. Font declarations use locally installed Satoshi/Eudoxus Sans, with Arial fallbacks and Georgia for italic accents. See public/fonts/README.md for the exact self-hosted font slots. Recheck line wrapping once licensed files are added.

## Motion and accessibility

GSAP and ScrollTrigger drive choreography; CSS handles small hover states; Lenis adds restrained desktop wheel smoothing. All GSAP contexts, observers, timers, and listeners clean up. Reduced motion skips the intro, smoothing, and pinned hero, and shows every phone chapter in a stacked layout. The search demo has a pause control and keyboard-selectable presets. No fake loader percentage, cursor follower, WebGL, or perpetual animation is used.

## Checks

Build and serve the production export on port 3000, then run:

```sh
npm run test:multipage
npm run test:technology
npm run test:imagery
```

These use installed Chrome by default; set PLAYWRIGHT_CHANNEL to another installed Playwright channel if needed. Screenshots/reports go to ignored .qa/. Multipage checks cover all six routes at 1440, 1024, 430, and 390, legal text equality, keyboard navigation, direct refreshes, and animation cleanup. Technology checks add 360, preference controls, stable image nodes, concept selection, visual notes, internal links, unchanged Tally destinations, and console errors. Both include automated axe WCAG A/AA checks. No waitlist submission is sent.

Imagery checks cover all 60 canvases/revisions, updated product48/product56 sources, four pages at 1440/1024/430/390, frame clipping/radii, fit, strip heights, runtime errors, and Technology motion cleanup/reduced-motion presentation. TechnologyMotion adds selected heading, product-entry, and proof-row reveals plus a small hero study parallax; it creates no pins or continuous animations.

On Windows the build's finalize-export step adds dotted aliases for nested navigation payloads emitted by this installed Next version. Original payloads are retained. This prevents client-prefetch 404s on static hosts without editing node_modules. It does nothing when filenames are already portable.

## Dependencies

Runtime: Next.js App Router, React, GSAP/ScrollTrigger, Lenis. Styling: Tailwind CSS 4 plus section-specific CSS. Development: TypeScript, ESLint/Next config, sharp, Prettier, Playwright, axe.

The installed image-processing library was updated to the patched 0.35.5 release. npm audit still reports five development-only findings along the ESLint → fast-glob → micromatch → braces chain, with no compatible upstream fix reported. The suggested automated fix downgrades Next's lint configuration by two major versions; it was not applied. These tools are not part of the exported site's browser runtime.

## Remaining launch inputs

An approved public contact email and licensed font files remain optional inputs. Current fonts retain the existing local Satoshi/Eudoxus Sans declarations and fallbacks. This work updates the local repository and production export; the existing GitHub deployment setup is retained.
