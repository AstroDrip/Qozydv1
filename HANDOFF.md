# Production-hardening update — 7 September 2026

The repository state below was the original work-in-progress handoff. A production-hardening pass has since been applied without changing the intended QOZYD page content or visual direction.

Current hardening changes:

- `AccordionGallery` is now explicitly typed in TypeScript; the previous `link` and `onActiveChange` compiler errors are resolved.
- `app/page.tsx` remains server-rendered while interactive effects stay isolated in client components.
- Service Web Threads render in a sticky viewport-sized layer instead of a multi-thousand-pixel canvas; DPR is capped at 1.5 and the shader loop is paced to about 45 FPS.
- The blood moon now uses `public/art/blood-moon-256.png`, a preprocessed transparent 256×256 asset. Runtime chroma-key pixel scanning was removed.
- GSAP lifecycle cleanup and `sessionStorage` access are hardened.
- Hover effects are gated to hover-capable fine pointers, use transform-focused transitions, respect reduced motion, and the Accordion Gallery no longer double-starts animations during hover changes.
- Unused starter UI components, Tailwind/shadcn dependencies, and the leftover `.scaffold` directory were removed.
- Repeatable checks are available through `npm test` and `npm run typecheck`.

Verification in the patch workspace: repository hardening tests pass, TypeScript passes, and `git diff --check` passes. A full Vinext production build and Oxlint run still require a fresh platform-native `npm ci`; the transferred `node_modules` contains Windows-native optional bindings and network access was unavailable in the verification container.

See `THIRD_PARTY_NOTICES.md` for attribution/provenance of adapted React Bits components.

---

# QOZYD website — work-in-progress handoff

Recorded: 7 September 2026 (Asia/Calcutta).

The owner asked to stop development and provide a portable record. Development has stopped. This document distinguishes the owner's requirements from implementation choices and unfinished work.

## 1. Owner's brief and confirmed answers

Build an **immersive, scrollable React website** showcasing a startup offering **marketing, automation, website building, trademarking, and related services**.

Confirmed by the owner:

- Startup name: **QOZYD**.
- Audience: many types of customers, including **business owners, other startups, and entrepreneurs**.
- **Leave the contact button/action for later.** Do not invent contact details, WhatsApp links, booking URLs, or form destinations.
- Moon specification clarified as **256 × 256 pixel art**, with **the moon itself hanging as the pendant** on the lanyard. It should not merely be printed on a rectangular card.
- The owner **has no existing brand assets**.

Original requirements:

- Research the references online to understand how they work; **do not guess**.
- Study four categories: **Visual & Motion Language**, **Technical Stack & Structure**, **Content Architecture**, and **Interaction Patterns**.
- Use **Three.js or Anime.js if necessary**. Neither was mandated as the only motion library.
- Palette should be in the **red and black** family: **dark red, wine red, candy red**.
- Include React Bits **Web Threads** in backgrounds, but **not as a default repeated on every card or tab**.
- Build immersive cards overlaying the Web Threads background, guided by the other references.
- **Blur Web Threads behind some cards if appropriate**.
- Use React Bits **Accordion Gallery** for selected tabs/sections where appropriate.
- Use React Bits **Lanyard** with a distinctive, detailed, creative pixel-art blood moon.
- Ask about doubts before proceeding. The initial identity, audience, contact, artwork, and pendant questions were answered as above.

## 2. All owner-supplied references

| Reference | Owner's intended use |
| --- | --- |
| https://pasqua.it/ | Overall immersive look and experience, **excluding the 3D effect at the beginning**. |
| https://www.runrobrun.com/ | Overall visual, motion, structure, content architecture, and interaction inspiration. |
| https://www.companypicnic.com/ | Overall immersive storytelling, composition, content, and interaction inspiration. |
| https://www.333southwabash.com/ | Specifically **the loading page**. |
| https://www.dsgn-dept.com/ | Specifically **how text appears for each card**. |
| https://bymonolog.com/ | Specifically **the hover-effect UI**. |
| https://reactbits.dev/backgrounds/web-threads | Selective animated backgrounds with overlay cards; optionally blurred. |
| https://reactbits.dev/components/accordion-gallery | Gallery/accordion interaction in suitable sections. |
| https://reactbits.dev/components/lanyard | Draggable hanging physics interaction, adapted to a pixel-moon pendant. |

The original Web Threads hyperlink was malformed as `https://reactbits.dev/backgrounds/web-threads,however`; its intended component URL is the corrected URL above. The owner's initial phrase “256-bit pixel generated blood moon” was explicitly clarified to **256 × 256 pixels**.

## 3. Research performed and its limits

- Opened all nine reference URLs using web research tools.
- Read the accessible content of Pasqua, Run Rob Run, Company Picnic, DSGN Dept., and MONOLOG.
- Opened 333 South Wabash, DSGN Dept., and MONOLOG in a real browser. Captured the loaded 333 building scene and DSGN landing composition. MONOLOG's captured viewport was still dark during its intro.
- **The exact loading animation, DSGN card-text timing, and MONOLOG hover behavior were not fully observed or verified.** Do not claim the current implementation exactly matches them.
- No complete technology audit of all six reference websites was performed. Accessible page text alone does not establish their stack.
- React Bits documentation pages were largely client-rendered, so the canonical GitHub component source was examined directly instead.
- Verified from official source:
  - Web Threads uses **OGL and a WebGL2 fragment shader**, with customizable red colors, thread count, speed, opacity, glow, and mouse behavior. It already pauses its animation when offscreen or the document is hidden.
  - Accordion Gallery uses **GSAP**, animating panel proportions, parallax, tilt, and labels; supports hover/focus/click and arrow navigation.
  - Lanyard uses **Three.js, React Three Fiber, Drei, Rapier physics, and Meshline**, with rope joints and drag projection.

Canonical source URLs:

- https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Backgrounds/WebThreads/WebThreads.jsx
- https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Backgrounds/WebThreads/WebThreads.css
- https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Components/AccordionGallery/AccordionGallery.jsx
- https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Components/AccordionGallery/AccordionGallery.css
- https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/content/Components/Lanyard/Lanyard.jsx

Downloaded original source copies are retained in `.research/`. Review the upstream license and preserve required attribution before distributing the adapted components; a finished license/attribution file has not yet been added.

## 4. Design choices made during implementation

These are assistant-created design choices, not additional owner requirements:

- Editorial headline: **“GOOD IS NOT ENOUGH.”**
- Supporting line: **“We turn ambitious businesses into brands you can’t scroll past.”**
- Near-black `#100b0d`, wine `#410e1b`, candy red `#ef233c`, pale text `#f5f0ed`.
- One light process section for visual contrast; most of the page remains dark/red.
- Fonts: **Barlow Condensed** for oversized headings, **Manrope** for body and wordmark, **Space Mono** for metadata. Fonts are installed locally through Fontsource.
- Text-based QOZYD wordmark and simple Q favicon. This is a working identity, not a separately delivered brand kit.
- Native document scrolling with sticky service cards and GSAP scroll reveals.
- Three original artwork assets; gallery entries explicitly described as **concept work, not client commissions**. No invented client metrics, testimonials, or contact details.

Current page sequence:

1. Short QOZYD typographic entry animation, once per browser session.
2. Header navigation: Our universe, Selected visions, The collective.
3. Oversized hero with a 2D pixel moon, selective Web Threads, and a services anchor.
4. Animated red discipline strip.
5. Intro: “Different disciplines. One unfair advantage.”
6. Four service cards:
   - Marketing — **MAKE SOME NOISE.**
   - Automation — **LESS BUSY. MORE BUSINESS.**
   - Web experiences — **BUILT TO BE FELT.**
   - Trademarks — **MAKE IT YOURS.**
7. Selected Visions — two concept projects in Accordion Gallery, with changing descriptive copy.
8. Collective/About — “A different kind of pull.” and the draggable blood-moon pendant.
9. Three-step process: Find the signal; Connect the dots; Make the move.
10. Oversized red QOZYD footer with section navigation and back-to-top.

Contact functionality remains intentionally omitted.

## 5. Implementation and file map

Workspace: `C:\Users\HP\Desktop\qozyd2`.

| File or directory | Purpose/status |
| --- | --- |
| `app/page.tsx` | Full one-page React composition, all sections and copy. |
| `app/layout.tsx` | Document layout, title, description, favicon, skip link. |
| `app/globals.css` | Palette, local-font imports, responsive styles, service-card stacking, hover text rolls, loader, gallery and pendant styling. Contains initial base rules plus later overrides; can be consolidated. |
| `components/Showcase.tsx` | Two concept projects, active selection and descriptive copy. Currently affected by TypeScript errors below. |
| `components/effects/WebThreads.jsx` and `.css` | Official downloaded React Bits implementation, currently essentially unchanged. |
| `components/effects/AccordionGallery.jsx` and `.css` | Official React Bits implementation with local interaction/accessibility changes. |
| `components/effects/PixelMoon.tsx` | Renders generated artwork onto a **256 × 256 canvas**, including a chroma mask for the generator's unwanted neutral background. |
| `components/effects/MoonLanyard.jsx` | Custom pendant adapted from React Bits rope/drag logic. Uses Rapier rope/spherical joints, a Meshline strap and a textured moon plane instead of the original card model. |
| `components/effects/Effects.tsx` | Lazy loading, intersection visibility, reduced-motion preference, error boundary, static pendant fallback and Reset moon control. |
| `components/effects/Motion.tsx` | GSAP entry, text reveals, moon parallax, scroll progress and one-session loader. |
| `public/art/` | Three generated PNGs, all copied into the project. |
| `public/favicon.svg` | Working Q favicon. |
| `.research/` | Original React Bits downloaded source, including original `Lanyard.jsx`. |
| `docs/implementation.md` | Small implementation outline. |
| `components/ui/`, `hooks/`, `lib/` | Bundled starter components/utilities. Most are unused. |
| `package.json`, `package-lock.json` | Installed dependencies and lockfile. |
| `vite.config.ts`, `next.config.ts`, `tsconfig.json` | Vinext/Vite/Cloudflare and TypeScript configuration. |
| `.openai/hosting.json` | Registered private Sites project ID; no runtime bindings. |

Accordion Gallery adaptations:

- Added `onActiveChange` to update adjacent project information.
- Non-link panels render as native buttons with `aria-pressed`.
- Arrow keys change active panel and move focus.
- React ref callbacks changed to avoid returning assigned elements.
- Images use lazy loading.
- Mobile CSS retains two expandable side-by-side panels.

The moon pendant is a flat textured disc/plane in a 3D physics scene, not a volumetric modeled sphere. Its motion is constrained to rotate around the facing axis, keeping the artwork readable. It includes pointer release/cancel handling and a reset control. This interaction **has not been browser-tested**.

## 6. Generated artwork

Generated with the built-in image-generation tool; source assets are original, not taken from the reference websites.

### `public/art/blood-moon.png`

Prompt intent: standalone circular blood-moon sprite; logical 256 × 256 pixel grid; detailed craters and a unique glowing canyon; limited crimson/wine/black/candy-red palette; stepped pixel edges; no text, stars, or lanyard; transparent background.

**Important limitation:** the generator produced a **1254 × 1254 RGB file with a baked checkerboard**, not a transparent 256 × 256 PNG. This was visually and programmatically identified. `PixelMoon.tsx` currently crops/samples this source into a 256 × 256 canvas and discards neutral matte pixels at render time. The same canvas becomes the Three.js texture, with nearest-neighbor filtering. This mask/crop has not yet been visually validated in the finished website. There is **no finished standalone transparent 256 × 256 moon PNG** in the current handoff.

### `public/art/after-hours.png`

Prompt intent: premium studio photograph of a matte candy-red energy drink can with fictional **AFTER HOURS** typography, black background, hard flash lighting, square composition, no website UI.

### `public/art/glass-loop.png`

Prompt intent: sculptural translucent red glass ribbon forming an elegant infinity loop above a near-black reflective plinth, dramatic gallery lighting, automation campaign concept, square composition, no text.

All three were also saved in the original generation location under `C:\Users\HP\.codex\visualizations\2026\09\06\01a07841-7ce3-72f2-b203-8b5dc106babc`, but the site uses the copies in `public/art/` and does not depend on that external directory.

## 7. Stack and setup

The owner required React. The scaffold choice below was made for the current environment and is **not an owner requirement**:

- Official `@openai/create-sites@0.3.0` starter with the shadcn add-on.
- React / React DOM **19.2.6**.
- **Vinext 1.0.0-beta.5**, **Vite 8.0.13**, TypeScript **5.9.3**.
- GSAP **^3.15.0**.
- Three.js **^0.185.1**; React Three Fiber **^9.7.0**; Drei **^10.7.8**; React Three Rapier **^2.2.0**; Meshline **^3.3.1**.
- OGL **^1.0.11** for Web Threads.
- Fontsource font packages, Tailwind/shadcn starter packages, Lucide icons.
- Cloudflare/Sites Vite plugins already configured by the scaffold.
- Node requirement in package manifest: **>=22.13.0**. Use a compatible modern Node version and the included npm lockfile.

The starter was initially created in `.scaffold/`, then moved into the workspace root. `.scaffold/.openai/` is a leftover from setup, not the active project. `.research/` is intentional source reference material.

Usual commands at the project root:

```sh
npm ci
npm run dev
npx tsc --noEmit
npm run build
```

`npm run start` currently starts Wrangler using `dist/server/wrangler.json`; it is not a generic static-file server.

On the original Windows machine, network sandbox restrictions initially blocked npm and GitHub downloads. npm then encountered a certificate-chain error. Installation succeeded using the system trust store:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
```

This was a process-local setting, not a change disabling TLS verification. A different machine may not need it.

Installation reported **11 dependency vulnerabilities (1 low, 2 moderate, 8 high)** and pending package install-script review notices for `sharp`, `workerd`, and `esbuild`. No blanket audit-fix, forced upgrades, or blanket script approvals were performed. The starter dev server did run successfully despite those notices. Review current advisories and dependency requirements before production delivery.

## 8. Verification and known failures at stop

Completed verification:

- Dependencies installed successfully and lockfile exists.
- The initial typographic hero + intro version compiled and returned **HTTP 200** at `http://localhost:3000/`.
- Requested the Codex local preview handoff; the tool returned **queued**.
- Original generated artwork was inspected before integration.

**Not completed:**

- No production build has been run.
- No final page HTTP/compile verification after all sections/effects were integrated.
- No browser visual QA, mobile testing, hover testing, drag testing, or reduced-motion testing of the implemented site.
- No verified match to the detailed reference interactions.
- No deployment, saved version, source push, or Git commit.
- No finished upstream license/attribution documentation.

The already-started TypeScript check returned these **two known errors** when work was stopped:

```text
components/Showcase.tsx(12,23): TS2322
Type '{ image: string; label: string; alt: string; type: string; description: string; }[]'
is not assignable to type '{ image: string; label: string; link: string; }[]'.
Property 'link' is missing.

components/Showcase.tsx(12,181): TS2322
Type 'Dispatch<SetStateAction<number>>' is not assignable to type '() => void'.
Target signature provides too few arguments. Expected 1 or more, but got 0.
```

Cause to investigate: TypeScript infers overly narrow props from the JavaScript AccordionGallery defaults. Define a proper item type with an optional `link` and a callback signature `(index: number) => void`, using TypeScript or JSDoc, instead of adding fake links solely to satisfy inference.

Other concrete implementation areas to check next:

- `Motion.tsx` uses `sessionStorage` without a try/catch. Make initialization resilient if browser storage is unavailable.
- EffectBoundary provides a render fallback, but the OGL constructor runs in an effect; explicitly handle WebGL context creation failures within that component.
- Pendant pointer/touch behavior, dynamic/kinematic handoff and rope stability are unverified. Touch styling currently uses `pan-y`; test scrolling versus dragging on a real mobile viewport.
- Some metadata labels are very small. Review actual readability and text zoom, especially on mobile.
- Verify the source-art matte removal and crop produce a clean circular moon with no checkerboard remnants.
- The loader has a four-second CSS visibility fail-safe and reduced-motion suppression, but its actual sequencing still needs testing.

The development server was explicitly stopped at the owner's request. Do not assume a localhost preview is still running.

## 9. Hosting state

A private, unpublished Sites project was registered during setup:

- Project ID: `appgprj_6a9dc463251c8191bbc0f6fba80b3c99`.
- Slug: `qozyd-bloodmoon`.
- Expected origin: `https://qozyd-bloodmoon.famous-apple-7116.chatgpt.site`.
- **The expected origin is not a delivered/live website.** No version has been saved or deployed.
- The active project ID is persisted in `.openai/hosting.json`; reuse it if continuing with Sites. Do not register a duplicate for the same site.
- No credentials are included in this handoff or the portable archive. If publishing through Sites later, obtain a fresh short-lived source credential.

For a different hosting provider, preserve the React implementation and assets, then deliberately adapt the Vinext/Cloudflare build configuration to that platform. There is no tested Vercel/Netlify/plain-Vite deployment configuration yet.

## 10. Suggested continuation order

1. Read this document, the owner's references, and the source files. Keep the contact action deferred.
2. Install from the lockfile on the destination machine.
3. Fix the two current AccordionGallery prop-type errors.
4. Run the completed page locally and verify it actually renders.
5. Complete the reference-motion research, particularly the loader, card text, and hover behavior; revise based on observation rather than memory.
6. Validate and, if necessary, finish the actual 256 × 256 moon asset and pendant.
7. Test desktop/mobile layout, gallery buttons and keyboard controls, scrolling, lazy WebGL, touch drag, reset, reduced motion, and unavailable-WebGL fallback.
8. Finish attribution and production dependency review; run type checking and a production build.
9. Publish only when the owner resumes/authorizes that stage in the destination workflow.

## 11. Portable source archive

`QOZYD-source-handoff.zip` contains this record plus application source, generated artwork, package manifests/lockfile, configuration, original React Bits research files, and the non-secret hosting manifest.

Excluded: `node_modules`, `.next`, `.vinext`, `.wrangler`, `.scaffold`, temporary build state, credentials and environment files. Reinstall dependencies at the destination with `npm ci`.

This is a **work-in-progress source handoff**, not a finished or validated production release.
