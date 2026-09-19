# QOZYD refinement references — 13 September 2026

Reviewed before implementation. These are references for hierarchy and restraint, not templates to reproduce. The first two also received browser screenshot inspection; the remaining pages were reviewed through web content and navigation structure.

1. [Instrument](https://www.instrument.com/) — oversized identity, direct capability statements, work given priority.
2. [Linear](https://linear.app/) — near-black surface and restrained navigation; concise product positioning.
3. [Pentagram](https://www.pentagram.com/) — straightforward project names and clear discipline labels.
4. [Work & Co](https://www.work.co/) — a single proposition, followed by concrete work.
5. [Build in Amsterdam](https://www.buildinamsterdam.com/) — brief positioning and direct paths to work and contact.
6. [Studio Dumbar](https://studiodumbar.com/) — a compact navigation and project-first homepage structure.
7. [Koto](https://koto.com/) — short studio introduction and prominent project names.
8. [COLLINS](https://wearecollins.com/) — short headline and concise program labels.
9. [AREA 17](https://area17.com/) — capabilities explained in one clear sentence.
10. [Vercel](https://vercel.com/) — explicit navigation labels and structured capability groups.

## Applied direction

Black, off-white, muted grey, and restrained red accents. The black hole and project images supply the expressive color. Removed repeated marquee slogans and direction text. Shortened services, method, about, and project descriptions. Preserved the shared black hole background, service cube and its existing per-face motion, gallery links, pendant controls, capsule tags, rounded edges, paper transitions, and opening timing.

## Font patch merge

Applied the CSS typography changes from `qozyd-brutalist-fonts.patch`, then adjusted sizes for the wider Space Mono glyphs. Manually merged the page changes because several hunks were already present in the working tree. Retained the supplied headline, work label, and studio introduction direction, with additional copy reduction requested in this task.

The patch names KG Inimitable but contains no font asset, and no matching file was found in public/fonts or the Downloads top level. The badge uses Space Mono as a deliberate fallback; no missing font URL is requested. A licensed font file can be added later. No new font service or JavaScript dependency was introduced.
