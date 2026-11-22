# Phase L1.1 — Landing Banner Review & Fix

## Scope
Follow-up to the existing public Banner integration. It does not change the four placements, CMS CRUD, public API contract, section structure or current marketing CTA routes.

## Public links
- Banner links accept internal absolute paths and explicit HTTP(S) URLs.
- Internal URLs are normalized using a fixed dummy same-origin base, with origin verification.
- Backslashes and control characters are rejected. This avoids browser URL-parser reinterpretation of apparently local paths as external navigations.
- On **home_hero** and **products_hero**, the image remains decorative/non-clickable: foreground marketing CTA links retain control of navigation. Thus, the Banner `link` field has **no user-visible effect** in these two positions.
- **home_gifting** and **about_hero** can use validated media links. They never replace the existing section CTA links.

## Carousel interaction
- The selected banner is tracked by ID. A deleted/changed list falls back to its first valid banner without leaving an empty active slide.
- Inactive slides are `aria-hidden` and `inert`, so links in hidden slides are not keyboard-focusable.
- The home hero control group is offset below the fixed header. Interactive stacking should still be checked visually on phone and desktop.
- Autoplay remains six seconds and pauses on hover/focus and for reduced-motion users.

## Editorial copy
- Original static captions remain untouched in the no-banner fallback.
- Once dynamic media is present, **home_gifting** and **about_hero** use general brand-oriented captions in the same layout, avoiding specific product claims that might contradict CMS-managed imagery.
- Banner titles are accessible names for media; they are not substituted for section headings.

## Caching
This follow-up intentionally preserves the Phase L1 public cache (60-second fetch TTL and shared cache tag invalidation after successful CMS mutations). Because banner start/end times advance without a CMS write, do not claim that all currently open browsers will update instantly. Check the deployed runtime and CDN behavior when accepting scheduled-banner freshness.

## Verification
Run `pnpm test:landing-banners`, `pnpm lint`, `pnpm exec tsc --noEmit` and `pnpm build`. Confirm desktop/mobile carousel controls, links and keyboard navigation in a real browser; source-level tests cannot replace browser testing.
