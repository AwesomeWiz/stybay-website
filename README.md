# StyBay

An editorial, one-page launch site: fashion abundance becomes a personal discovery feed. Warm off-white, restrained teal, oversized type, and a single dark style chapter carry the story from chaos to discovery, organization, and personal taste.

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

Copy .env.example to .env.local and set:

- **NEXT_PUBLIC_SITE_URL** — your full HTTPS site origin, without a trailing slash. Enables canonical, absolute OpenGraph URLs, and WebSite structured data. A private Sites preview origin is configured locally for this delivery.
- **NEXT_PUBLIC_WAITLIST_ENDPOINT** — an HTTPS endpoint accepting a POST with JSON { email, source: 'stybay-website' }. It must allow CORS for the site origin, validate and store submissions server-side, and return 2xx only after accepting the signup. These are public build-time variables. Never put credentials in them.

Rebuild after changing variables. Without an endpoint, the page explicitly says sign-ups will open soon and collects nothing. With an endpoint, it validates email, prevents duplicate submits while pending, handles timeout/non-2xx/network failure, and only confirms after a successful response. No endpoint, retailer integration, mailing service, or backend has been invented.

Only set up a collection endpoint after your own consent and privacy requirements are ready. Add real privacy, terms, contact, and social URLs when available; dead links and invented legal copy were deliberately omitted.

## Structure

- app/page.tsx — ordered narrative composition.
- app/layout.tsx — metadata, favicon, viewport, skip link, structured data.
- app/globals.css — tokens, typography, section layouts, responsive art direction, reduced-motion presentation.
- components/IntroSequence.tsx — 2.45-second discovery burst, session skip, reduced-motion skip.
- components/HeroDiscovery.tsx — GSAP scatter-to-feed transformation and Home-screen reveal.
- components/ProblemSection.tsx — separate browsing windows resolve toward one discovery surface.
- components/PhoneShowcase.tsx — Discover, Search, Explore, Save; sticky desktop and stacked mobile.
- components/PersonalizationSection.tsx — three selectable moods and related imagery.
- components/IntentSearch.tsx — pausable typing and selectable intent examples using relevant supplied dresses.
- components/CollectionsSection.tsx — collection imagery and real Profile screen.
- components/FinalCTA.tsx — ordered hero callback, waitlist, and footer.
- components/Header.tsx, Primitives.tsx, MotionProvider.tsx — navigation, shared images/device shell, Lenis and reveal lifecycle.
- lib/assets.ts — central brand, screen, and 20-product manifest.
- scripts/ — asset optimization, static preview server, and browser verification.

## Assets and fonts

All 20 supplied product photographs and all seven supplied UI screenshots were visually inspected. Products are dresses, so the search examples deliberately avoid pretending these assets are sneakers or T-shirts. The actual Home screen still shows the broader fashion feed supplied in the design.

Original files under public/assets remain unchanged. WebP derivatives under public/assets/optimized total approximately 0.88 MB versus 12.77 MB of original product/UI imagery. Run npm run assets:optimize after source asset changes.

UI mapping: home → Discover and hero; search → Search; product → Explore; collections → Save; profile → collections chapter. product_catalog and sign_in are indexed for future use. Screens are 413 × 864 except product, which is 413 × 1687 and scrolls within the device on desktop or in a keyboard-focusable region on mobile. Existing retailer marks appear only inside supplied product screenshots; there are no invented partnership claims.

No licensed font files were supplied. Font declarations use locally installed Satoshi/Eudoxus Sans, with Arial fallbacks and Georgia for italic accents. See public/fonts/README.md for the exact self-hosted font slots. Recheck line wrapping once licensed files are added.

## Motion and accessibility

GSAP and ScrollTrigger drive choreography; CSS handles small hover states; Lenis adds restrained desktop wheel smoothing. All GSAP contexts, observers, timers, and listeners clean up. Reduced motion skips the intro, smoothing, and pinned hero, and shows every phone chapter in a stacked layout. The search demo has a pause control and keyboard-selectable presets. No fake loader percentage, cursor follower, WebGL, or perpetual animation is used.

## Checks

With npm run dev running on port 3000:

```sh
npm run test:visual
npm run test:interactions
npm run test:a11y
npm run test:waitlist
```

Browser checks use Playwright Chromium (install once with npx playwright install chromium). Screenshots and reports go to ignored .qa/. Responsive widths: 1440, 1280, 1024, 768, 430, 390, 360. Checks cover runtime errors, overflow, intro/repeat behavior, all sticky chapters, navigation, mood/query selection, pause, and reduced motion. Waitlist testing uses an isolated dev build on port 3001 and intercepted responses; it never sends a real signup. Accessibility checks use axe WCAG A/AA rules at desktop and mobile sizes; automated checks do not replace a full manual accessibility audit.

## Dependencies

Runtime: Next.js App Router, React, GSAP/ScrollTrigger, Lenis. Styling: Tailwind CSS 4 plus section-specific CSS. Development: TypeScript, ESLint/Next config, sharp, Prettier, Playwright, axe.

The installed image-processing library was updated to the patched 0.35.5 release. npm audit still reports five development-only findings along the ESLint → fast-glob → micromatch → braces chain, with no compatible upstream fix reported. The suggested automated fix downgrades Next's lint configuration by two major versions; it was not applied. These tools are not part of the exported site's browser runtime.

## Remaining launch inputs

Provide licensed fonts, the final domain, a real waitlist endpoint, and actual legal/contact/social URLs. The app itself is unreleased; the marketing page does not assert a launch date, users, endorsements, or live catalog capabilities.

## Delivery status

The site is complete locally and the static production export is in out/. Private Sites registration exists in .openai/hosting.json, but publication was blocked by automatic approval review before any source push or deployment. Publishing requires explicit permission to upload the project source and supplied assets to that remote repository. No public or private deployment URL is live from this task.
