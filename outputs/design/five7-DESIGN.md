# DESIGN.md — five7.com.au

> Source: five7.com.au/services — HTML source + screenshots, 2026-05-23.
> All values pulled directly from computed/declared CSS; nothing invented.

---

## 1. Visual Theme & Atmosphere

Pure-black dark canvas. Ultra-light body weight creates air without reducing information density. All type is white or near-white — hierarchy is expressed through weight contrast (200 vs 600) rather than colour. Brand identity lowercase with trailing period ("five7.", "conceptual design."). Monochrome throughout — no accent colour used decoratively; the only contrast moment is a hard white-fill hover inversion on interactive elements. The feel is: minimal, editorial, premium services practice.

---

## 2. Colour Palette & Roles

| Token | Hex | Role |
|-------|-----|------|
| `bg` | `#000000` | page canvas, all surface fills |
| `bg-nav` | `#151515` | fullscreen nav overlay (slightly off-black) |
| `text-primary` | `#FFFFFF` | headings, labels, active nav items |
| `text-body` | `#FFFFFFCF` | body copy (~81% white) |
| `text-muted` | `#FFFFFFA6` | inactive nav links (~65% white) |
| `gray-light` | `#EBEBEB` | subtle text, footer elements |
| `gray-mid` | `#CDCDCD` | secondary labels |
| `gray-2` | `#CACACA` | light-mode service numbers (unused in dark) |
| `gray-dim` | `#9E9E9E` | de-emphasised UI chrome |
| `gray-dark` | `#999999` | deepest muted text |
| `border` | `#FFFFFF30` | subtle hairline borders (~19% white) |
| `divider` | `#FFFFFF` | full-opacity section dividers (1px) |
| `hover-bg` | `#FFFFFF` | button/card hover fill |
| `hover-text` | `#000000` | text colour on hover fill (inversion) |

---

## 3. Typography Rules

- **Primary family:** `"Roboto"`, sans-serif — headings, nav, labels, numbers
- **Body family:** `"Roboto Condensed"`, sans-serif — paragraph/description text
- **Accent family:** `"Be Vietnam Pro"`, sans-serif — h5 subheadings only

| Level | Tag | Size | Weight | Line-height | Notes |
|-------|-----|------|--------|-------------|-------|
| Display / Hero | h1 | 50px | 600 | 1.2 | Page titles |
| Section heading | h2 | 30px | 300 | 1.3 | Light weight — editorial feel |
| Service title | h3 | 33px | 600 | 1.2 | Bold service names, lowercase |
| Sub-section | h4 | 22px | 600 | 1.3 | Panel headings |
| Accent sub | h5 | 19px | 600 | 1.3 | "Be Vietnam Pro" only |
| Label / Number tag | h6 | 12px | 200 | 1.4 | UPPERCASE, +1px letter-spacing |
| Service numbers | span | 30px | 400 | 1.0 | "01", "02" — Roboto, right-aligned |
| Body / description | p | 16px | 100–200 | 1.5em | Ultra-light, Roboto Condensed |
| Navigation | a | 14–16px | 400 | — | Inactive: `text-muted`; Active: `text-primary` |

---

## 4. Component Stylings

**Dividers**
- `1px solid #FFFFFF` (full white), `padding: 15px 0` above and below.
- Used to separate service list items and content sections — not decorative, structural.

**Service cards / list items**
- No background fill — pure `#000000` surface.
- Service number (h6/span, 30px/400) right-aligned; service name (h3, 33px/600) left — visually balanced pair.
- Bottom border: `1px solid #FFFFFF30` (subtle).
- `border-radius: 4px` where card shell is present.
- Hover: entire card or CTA inverts — `background: #FFFFFF`, `color: #000000`.

**Buttons / CTAs**
- Default: naked — no background, no border. White text label only.
- Hover: `background: #FFFFFF`, `color: #000000`. Hard inversion, no fade.
- No border-radius on text-only CTAs; `4px` on contained buttons.
- No box-shadow.

**Navigation**
- Inline nav: `text-muted` (#FFFFFFA6) inactive → `text-primary` (#FFFFFF) active.
- Fullscreen overlay nav: `background: #151515`, full viewport. Links large (30–40px+), Roboto 300.
- No underlines. No background pills.

**Inputs (contact/form)**
- Dark fill matching bg. White border `1px`. White placeholder text at reduced opacity.
- Focus: border brightens to full `#FFFFFF`.

---

## 5. Layout Principles

- **Container max-width:** 1240px, centred, padding `0 20px`.
- **Spacing scale:** 15 / 20 / 40 / 60 / 80 / 120px. (Coarser than 4px base — editorial rhythm over UI density.)
- **Section padding:** `80–120px` vertical.
- **Grid:** single-column content blocks for services list; two-column for number + title pairs. No complex multi-column grids.
- **Alignment:** service numbers right-align into a narrow column; service names left-align; creates strong typographic tension.
- **Whitespace philosophy:** generous vertical space between sections; tightly packed internal typography. Breathing room comes from section gaps, not component padding.

---

## 6. Depth & Elevation

- **Entirely flat.** No box-shadows on any surface.
- **Hierarchy via colour opacity:** `text-muted` (#FFFFFFA6) vs `text-primary` (#FFFFFF) — no elevation needed.
- **Borders only:** `1px solid #FFFFFF30` for subtle surface separation; `1px solid #FFFFFF` for structural dividers.
- Fullscreen nav uses `bg-nav` (#151515) — lighter than true black — as the only elevation gesture. No shadow under it.
- No gradients anywhere.

---

## 7. Do's and Don'ts

**DO**
- Keep the canvas `#000000`. Never use off-white or grey backgrounds.
- Use weight contrast (200 vs 600) to build hierarchy — not colour.
- Reserve the white-fill hover inversion for interactive elements only.
- Lowercase brand/service names with trailing period: "conceptual design.", "townplanning."
- Right-align service numbers against left-aligned titles for typographic tension.
- Use Roboto Condensed at weight 100–200 for all body/description text.

**DON'T**
- Don't add accent colours. The system is intentionally achromatic.
- Don't use border-radius > 4px on any component.
- Don't animate or transition beyond opacity/background on hover (keep it immediate and hard).
- Don't use shadows or elevation — flat surfaces only.
- Don't mix weights randomly; stick to the defined hierarchy. Ultra-light body next to bold headings is intentional.
- Don't add decorative dividers — dividers are structural (`1px #FFFFFF`), not ornamental.

---

## 8. Responsive Behaviour

- **Breakpoints (inferred from Elementor stylesheet):**
  - Desktop: ≥ 1025px — full two-column number+title layout, 1240px container
  - Tablet: 768–1024px — single column, reduced section padding (~60px)
  - Mobile: < 768px — single column, 20px side padding, h1 scales to ~32px
- **Touch targets:** Fullscreen nav links ≥ 44px tap height.
- **Service cards:** stack vertically on mobile; number moves above title (loses right-align tension on small screens — acceptable).
- **Type scale:** h1 50px → ~32px on mobile; h3 33px → ~24px. Body stays 16px.
- **Nav:** desktop inline → fullscreen overlay on mobile (hamburger trigger).

---

## 9. Agent Prompt Guide

**Quick ref:**
`bg #000000 · text #FFFFFF · body #FFFFFFCF · muted #FFFFFFA6 · border #FFFFFF30 · hover invert (#FFF bg + #000 text) · Roboto 600 headings · Roboto Condensed 100–200 body · flat, no shadows, no accent colour`

**Prompt snippet — use verbatim when asking an agent to build UI to this system:**

> "Build to five7-DESIGN.md: pure black canvas (#000000), white text hierarchy (#FFFFFF primary / #FFFFFFCF body / #FFFFFFA6 muted), Roboto 600 for headings, Roboto Condensed 100–200 for body. Flat surfaces only — no shadows, no gradients, no accent colours. Interactive hover = hard inversion (background #FFFFFF, color #000000). 1px white dividers (#FFFFFF full) for structure; 1px #FFFFFF30 for subtle borders. Border-radius 4px maximum. Container 1240px centred. Generous vertical section spacing (80–120px). Ultra-light body weight against bold headings is the primary hierarchy signal."
