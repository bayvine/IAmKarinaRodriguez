# AGENTS.md

## Project Purpose

This is a Prismic-driven Next.js site for Karina Rodriguez.

The site is built as a reusable editorial marketing system:
- App Router Next.js app
- Prismic singleton globals plus slice-based page building
- strong visual consistency across slices
- reusable motion, buttons, section headers, and media handling

When updating this project later, prefer extending the existing system instead of creating new one-off patterns.

## Core Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Prismic
- Framer Motion
- Radix UI dropdown primitives
- `clsx` + `tailwind-merge`
- `react-icons`
- `split-type` for masked line reveals

Useful commands:
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npx next build --webpack`
- `npm run slicemachine`

Use `npx next build --webpack` for reliable production validation in this repo. Plain `next build` has been noisier in this environment.

## High-Level Architecture

### App shell

- Root layout: `src/app/layout.tsx`
- Global header: `src/components/layout/site-header.tsx`
- Global header client shell: `src/components/layout/site-header-shell.tsx`
- Global footer: `src/components/layout/site-footer.tsx`
- Shared section width wrapper: `src/components/layout/section.tsx`

### Prismic integration

- Prismic client: `prismicio.ts`
- Slice registry: `slices/index.ts`
- Home page: `src/app/page.tsx`
- Preview route: `src/app/api/preview/route.ts`
- Exit preview route: `src/app/api/exit-preview/route.ts`
- Slice simulator route: `src/app/slice-simulator/page.tsx`

### Global content types

- Header/global nav singleton: `customtypes/global_nav/index.json`
- Footer singleton: `customtypes/global_footer/index.json`
- Home singleton: `customtypes/home/index.json`

### Shared rendering helpers

- Shared class merge + anchor helper: `src/lib/utils.ts`
- Shared typography scale: `src/lib/typography.ts`
- Shared section rich text renderers: `src/lib/prismic-rich-text.tsx`
- Shared global nav fetch: `src/lib/global-nav.ts`
- Shared global footer fetch: `src/lib/global-footer.ts`
- Shared media kind helper: `src/lib/prismic-media.ts`

## Existing Slice System

Current slices:
- `Hero`
- `MediaHighlight`
- `ServicesShowcase`
- `ChecklistFeature`
- `ChecklistSpotlight`
- `ProfileFeature`
- `TestimonialsShowcase`
- `CenteredStatement`
- `EventHighlight`

All of them are registered in `slices/index.ts` and available in `customtypes/home/index.json`.

## Non-Negotiable Design Rules

### Typography

- Gambarino is for headings and display text only.
- Inter is for body, subtitle, labels, tabs, annotations, and utility copy.
- Avoid random one-off type sizes. Use the shared typography system when possible.
- Prefer Tailwind utility sizes over arbitrary `text-[...]` sizes unless there is a very strong reason.
- Avoid `tracking-*` and `leading-*` Tailwind classes for the main visual typography. This project has repeatedly moved away from them.
- Some headings still use inline `lineHeight` styles intentionally. Do not remove those casually.

### Color system

Defined palette:
- `pure-white`
- `rose-white`
- `night`
- `disabled-rose-white`
- `accent-bordeaux`
- `accent-blue-linen`

Use Tailwind color tokens instead of hardcoded hex values in component classes.

Important existing project rule:
- Do not add opacity / transparency to text colors.

Even though some current files still contain text opacity classes from earlier iterations, future edits should avoid introducing more of them and should trend toward solid text colors.

### Shape and spacing

- Only buttons should feel obviously rounded.
- Section blocks, cards, and media containers generally use sharp corners unless the design explicitly calls for otherwise.
- Keep section spacing cohesive across the site. Shared outer width/padding should go through `Section`.

### Visual tone

- Editorial, polished, slightly luxury
- Motion should be soft, clean, and intentional
- Avoid generic “startup UI” patterns

## Shared Components and Patterns

### Section width system

Use `src/components/layout/section.tsx`.

Current shared width:
- normal: `max-w-7xl`
- ultra-wide: `min-[1980px]:max-w-[110rem]`

If the whole site needs to become wider or narrower later, change `Section`, not every slice.

### Shared buttons

Primary/secondary button styles and hover motion live in:
- `src/components/slices/hero/hero-action-link.tsx`

Exports:
- `HeroCtaButton`
- `HeroSecondaryButton`
- `HeroDarkButton`
- `HeroOutlineDarkButton`

Reuse these instead of inventing new CTA/button behavior.

### Shared section intro pattern

Reusable title/label/body block:
- `src/components/common/section-intro.tsx`

Used by multiple slices. Keep extending this pattern rather than rebuilding title rows from scratch.

### Shared title and subtext renderers

Use:
- `renderSectionTitle()`
- `renderSectionSubtext()`

From:
- `src/lib/prismic-rich-text.tsx`

This keeps type scale, link styling, and reveal behavior consistent.

### Shared title reveal

Masked line/window reveal:
- `src/components/motion/staggered-text-reveal.tsx`

Important:
- this is already the stabilized implementation
- do not replace it casually with a hand-rolled text-splitting approach
- it uses `split-type` because earlier custom line grouping caused hydration issues and broken wraps

### Shared media background fill

Use:
- `src/components/common/media-fill.tsx`

This component already handles:
- image vs video media
- hydration-safe background video mount
- mobile cleanup for Safari video UI

## Navigation and Anchors

### Global header content

Header data comes from `global_nav`.

The desktop nav is intentionally centered using absolute positioning, not flex centering. This keeps the middle nav actually centered on the screen regardless of logo or CTA width.

Do not “simplify” this back to a normal flex row unless you intentionally want to lose exact centering.

### Fixed header behavior

Header behavior in `site-header-shell.tsx`:
- fixed at top
- visible while scrolling down
- hides while scrolling up
- mobile scrolled state spans full width
- desktop scrolled state becomes a contained pill

If adjusting this later, preserve the mobile vs desktop distinction.

### Slice anchor IDs

Major section slices support optional `section_id` fields.

Implementation:
- anchor sanitizing: `getSectionAnchorId()` in `src/lib/utils.ts`
- slices render `id={sectionId}` on the outer section
- slices also include `scroll-mt-*` so fixed-header jumps land correctly

Use this instead of hardcoding nav-to-slice mappings in code.

Example:
- set slice `section_id` to `services`
- set nav link in Prismic to `#services`

## Prismic Preview and Live Editing

### Full-page preview

Preview route:
- `/api/preview`

Exit route:
- `/api/exit-preview`

In Prismic preview settings, use:
- local: `http://localhost:3000/api/preview`

### Slice live editing

Slice simulator route:
- `/slice-simulator`

In Prismic live editing settings, use:
- local: `http://localhost:3000/slice-simulator`

### Draft-aware fetching

`prismicio.ts` is intentionally async now.

Why:
- in preview/draft mode, requests use `cache: "no-store"`
- in production published mode, requests use `force-cache` with Prismic tags
- in development, requests lightly revalidate

Do not revert `createClient()` back to a synchronous helper unless you also rework preview behavior.

Any server usage of `createClient()` must `await` it.

## Global Content Model

### `global_nav`

Holds:
- header logo
- brand name fallback
- navigation links
- primary CTA
- social links

Social links are shared across the site. Do not duplicate them into slices.

### `global_footer`

Holds:
- footer CTA title
- footer CTA button label/link
- footer CTA media or image
- footer logo
- footer contact items
- footer quick links
- footer copyright

Footer CTA media can be image or video.

### Footer layout behavior

Desktop footer bottom order:
- logo
- copyright
- social links

Mobile footer bottom order:
- social links
- logo
- copyright

Do not accidentally unify those orders unless intentionally redesigning it.

## Conditional Rendering Rules

This project should be resilient during live preview and partially filled Prismic drafts.

Rule:
- if content is missing, do not render the dependent UI
- do not assume text, links, images, or media exist
- do not render “empty shells” unless the empty state is intentionally designed

Always guard:
- `keyText`
- `richText`
- `link`
- `linkToMedia`
- `image`

Patterns already used throughout the project:
- `prismic.isFilled.keyText(...)`
- `prismic.isFilled.richText(...)`
- `prismic.isFilled.link(...)`
- `prismic.isFilled.linkToMedia(...)`
- `prismic.isFilled.image(...)`

When building new slices, follow that same style.

## Mobile Behavior Rules

### Hero

- mobile title/subtitle/buttons are centered
- proof stack stays centered with the main hero content until larger breakpoints
- hero top padding is intentionally increased so the media/header have breathing room

### ProfileFeature

- mobile image area must be able to grow with text
- do not force a rigid square aspect if overlay copy needs more room

### Testimonials

- mobile testimonials use a horizontal swipe rail
- it should be obvious that the rail is swipeable
- do not let the rail introduce page-wide horizontal scroll
- rail is locked to horizontal pan and clipped to avoid vertical drag jank

### Checklist slices

- on stacked/mobile layouts, text should appear before image
- for `ChecklistSpotlight`, image position flip only applies at the real two-column breakpoint

## Slice-Specific Notes

### Hero

- background media can be image or video
- gradient should read lighter at top and darker at bottom
- proof stack should not render if there is no proof text and no avatars

### MediaHighlight

- supports `image` or `video` variant
- section intro reused heavily elsewhere
- statistics are optional
- stat overlays need readable dark wash over media

### ServicesShowcase

- mobile selector is a horizontal tab rail, not pills
- desktop selector is left-side stacked list
- progress/underline animation exists for active service
- active panel should not assume service media/text/button all exist

### ChecklistFeature

- image should feel fixed and controlled, not huge on medium widths
- checklist item copy uses constrained measure

### ChecklistSpotlight

- theme can be dark or light
- image position can flip on desktop
- mobile should always show text first, image below
- actions already reuse shared hero button system

### ProfileFeature

- social icons come from `global_nav`
- slice has boolean `show_social_links`
- if enabled but no social data exists, do not crash

### TestimonialsShowcase

- testimonial cards can be image or video
- mobile carousel must not allow the page to scroll horizontally
- video controls are custom:
  - mute top right
  - play/pause centered

### CenteredStatement

- supports dark or light solid backgrounds
- optional background image switches it into light-on-dark mode
- now supports optional primary and secondary buttons
- buttons should theme-switch correctly:
  - dark/image: light hero buttons
  - light: dark button variants

### EventHighlight

- media-backed promo/event card
- repeatable details row instead of hardcoded date/location/cost fields
- CTA reuses hero button animation

## Motion Rules

- Use Framer Motion for mount/in-view reveals
- Prefer simple opacity/transform motion
- Avoid heavy layout animation unless it is necessary
- Existing easing language tends toward:
  - `[0.22, 1, 0.36, 1]`
  - soft editorial movement

Do not make interactions overly bouncy or “tech-demo”-like.

## Validation Expectations

After meaningful changes, run:
- `npm run lint`
- `npm run typecheck`

For larger changes, also run:
- `npx next build --webpack`

If build output changes `next-env.d.ts`, do not commit unnecessary churn there unless the user explicitly wants it updated.

## Known Gotchas

- `createClient()` is async because of `draftMode()`
- `tailwind.config.ts` currently emits a Node module type warning during webpack build; it is non-blocking
- `prismic-ts-codegen` has been unreliable in this workspace at times, so some slice typing has been maintained manually
- the project has a lot of visual tuning baked into classes; avoid “cleanup” refactors that flatten the design system

## Default Change Strategy

When making future updates:
1. Reuse shared systems first:
   - `Section`
   - shared buttons
   - `SectionIntro`
   - `renderSectionTitle()`
   - `renderSectionSubtext()`
   - `MediaFill`
2. Keep all content optional unless there is a real requirement for it to be mandatory.
3. Preserve mobile behavior intentionally; do not let desktop assumptions leak downward.
4. Prefer extending existing slice/component patterns over creating parallel variants.
5. Validate with lint and typecheck before closing.
