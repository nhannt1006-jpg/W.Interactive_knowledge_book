# DESIGN.md — format reference

Follow the Google Stitch `DESIGN.md` format. Produce all nine sections in this
order. Every section must contain concrete, copy-pasteable values — not vague
advice.

| # | Section | What it captures |
|---|---------|------------------|
| 1 | Visual Theme & Atmosphere | Mood, density, design philosophy in 2–4 lines |
| 2 | Colour Palette & Roles | Semantic name + hex + functional role, as a table |
| 3 | Typography Rules | Font families + full hierarchy (size / weight / use) |
| 4 | Component Stylings | Buttons, cards, inputs, nav — with every state |
| 5 | Layout Principles | Spacing scale, grid, whitespace philosophy |
| 6 | Depth & Elevation | Shadow system, surface/border hierarchy |
| 7 | Do's and Don'ts | Concrete guardrails and anti-patterns |
| 8 | Responsive Behaviour | Breakpoints, touch targets, collapsing strategy |
| 9 | Agent Prompt Guide | Quick colour reference + ready-to-use prompt snippets |

## Section template

```markdown
# DESIGN.md — <Project name>

## 1. Visual Theme & Atmosphere
<Mood, density, philosophy. e.g. "Clean technical HUD; monochrome with a single
accent reserved for the active state; readable for non-designers; not sci-fi.">

## 2. Colour Palette & Roles
| Token | Hex | Role |
|-------|-----|------|
| ink | #1a1a1a | primary text, selected fill |
| bg | #ffffff | canvas |
| mid | #999999 | secondary text, inactive |
| line | #e4e4e2 | borders, dividers |
| accent | #dc2626 | ACTIVE state only (never decorative) |

## 3. Typography Rules
- Family: 'Helvetica Neue', Helvetica, Arial, sans-serif
| Level | Size | Weight | Use |
|-------|------|--------|-----|
| Title | 15px | 700 | panel headings |
| Body | 12px | 400 | descriptions |
| Label | 9px | 700 | uppercase section labels, +.12em tracking |
| Badge | 7px | 700 | TP / WD / BOTH chips |

## 4. Component Stylings
- **Button** — 1px solid `line`, radius 3px, 7px padding; hover fill `off`.
- **Callout box** — white fill, 1px `ink` border, radius 3px; SELECTED = `ink`
  fill + white text; badge inverts to stay legible.
- **Badge** — TP/BOTH = `ink` fill, white text; WD = white fill, `mid` border.

## 5. Layout Principles
- Spacing scale: 4 / 8 / 12 / 16px.
- <Grid / radial / list rules. e.g. "radial hub-and-spoke; L3 fans around L2
  with ≥45px between anchors.">

## 6. Depth & Elevation
- Mostly flat. Dropdowns/floating panels: shadow 0 6px 18px rgba(0,0,0,.10).
- Surfaces separated by 1px `line` borders, not shadows.

## 7. Do's and Don'ts
- DO keep the accent for the active relationship/selection only.
- DO use one consistent component style everywhere.
- DON'T colour more than the active path.
- DON'T fade inactive items below ~0.18 opacity.

## 8. Responsive Behaviour
- Desktop primary; tablet-friendly. Touch targets ≥ 24px.
- <Collapsing strategy for panels at narrow widths.>

## 9. Agent Prompt Guide
- Quick ref: ink #1a1a1a · bg #fff · accent #dc2626 (active only) · Helvetica Neue.
- Prompt snippet: "Build to DESIGN.md: monochrome, 1px borders, radius 3px,
  red only for the active state, Helvetica Neue, 4/8/12/16 spacing."
```

## Notes
- Keep the whole file readable in one sitting — concise beats exhaustive.
- The worked values above mirror a real monochrome-HUD system; replace them
  with the actual tokens of the project you are documenting.
- Optionally ship `preview.html` + `preview-dark.html` alongside `DESIGN.md`
  as a visual catalog of swatches, type scale, buttons, and cards.
