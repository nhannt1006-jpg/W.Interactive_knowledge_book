---
name: design-md
description: Create, extract, or apply a DESIGN.md — a plain-markdown design-system document (Google Stitch format) that AI agents read to produce visually consistent, on-brand UI. Use when the user wants a design system written down, mentions DESIGN.md / design.md / awesome-design-md / Stitch, asks to capture a website or app's look-and-feel (colours, type, components, spacing) as a reusable spec, or wants new UI built to match an existing design language.
---

# DESIGN.md

A `DESIGN.md` is a single plain-markdown file that describes a project's visual
design system — colours, type, components, spacing, do's and don'ts — in the
format AI agents read best. Drop it in a project root and any coding/design
agent can generate UI that actually matches the intended look. It is the
*look-and-feel* counterpart to `AGENTS.md` (how to build) and `CLAUDE.md`
(how to behave).

## When to use
- The user wants their design system written down so future UI stays consistent.
- New UI must match an existing site/app/brand ("build a page that looks like X").
- The user mentions DESIGN.md, awesome-design-md, or Google Stitch.
- A project's UI has drifted and needs a single source of truth.

Do **not** use this for general copywriting, backend logic, or when no visual
consistency is at stake.

## Workflow A — Create a DESIGN.md
1. **Gather the source of truth.** Use whatever exists: the live site/app,
   screenshots the user provides, an existing stylesheet, brand guidelines, or
   the user's description. Pull *real* values — exact hex codes, font families,
   spacing — never invent them.
2. **Fill every section** of the format in `reference/format.md` (9 sections).
   Each colour gets a semantic name + hex + functional role; type gets a full
   hierarchy; components list their states.
3. **Write the Do's and Don'ts** as concrete guardrails ("red is reserved for
   the active state only", not "use colour thoughtfully").
4. **Save as `DESIGN.md` in the project root.** One per project. It is the
   single source of truth — keep it short enough to read in full.
5. **Optional:** generate `preview.html` (and a dark variant) — a one-page
   catalog showing the colour swatches, type scale, buttons, and cards so a
   human can eyeball the system.

## Workflow B — Apply a DESIGN.md
1. **Read the project's `DESIGN.md` in full** before writing any UI.
2. **Use only the tokens it defines** — exact hex, named fonts, the spacing
   scale. Do not introduce colours, fonts, or radii that aren't in the doc.
3. **Honour the Do's and Don'ts and the responsive rules** literally.
4. If the design needs something the doc doesn't cover, **add it to
   `DESIGN.md` first**, then build — keep the doc and the UI in sync.

## Conventions
- One `DESIGN.md` per project, at the root. Single source of truth.
- Markdown only — no JSON, no Figma export, no tooling required.
- Cite exact values (hex, font names, px). Vague guidance is not actionable.
- Keep it lean and well-sectioned; if it sprawls, it stops being read.

See `reference/format.md` for the full section-by-section template and a
worked example.
