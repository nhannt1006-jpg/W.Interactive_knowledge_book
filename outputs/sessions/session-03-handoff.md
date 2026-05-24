# Handoff — 2026-05-23

## Session summary
Project: **W.Interactive_knowledge_book** (Work mode). This session was housekeeping only — the `outputs/` folder was reorganised into named subfolders, HTML script paths were updated to match, and `memory.md` was updated with the new layout. No feature work was done; the five7.com.au task from session 02 remains untouched.

## Focus for next session
Pick up the five7.com.au DESIGN.md task that has been carried forward since session 02. Session 02's findings were lost in compaction — re-inspect the site from scratch. See session-02-handoff.md for full context.

## Decisions made
- `outputs/` split into subfolders: `src/`, `data/`, `backups/`, `sessions/`, `design/`, `topics/` — root holds only `knowledge-map.html` for grab-and-deploy.
- `knowledge-map.html` script refs updated from `kb-data.js` / `app.js` → `src/kb-data.js` / `src/app.js` to match the move.
- Handoffs saved to `outputs/sessions/` (project convention, not OS temp — established in session 02).

## Files and artifacts
All under `C:\Users\Admin\Documents\Claude\Projects\W.Interactive_knowledge_book (1)\`:
- `outputs\knowledge-map.html` — script src paths updated (only change this session)
- `memory.md` — Conventions section rewritten with full subfolder layout and routing rules
- `outputs\sessions\session-02-handoff.md` — prior handoff (reference only)

## Next steps
1. **Re-inspect five7.com.au** for live style values — use Claude-in-Chrome MCP (JS-rendered site; WebFetch returns a shell).
2. **Write five7 DESIGN.md** via the `design-md` skill using only values pulled from the site.
3. **Build `preview.html`** — swatches, type scale, buttons, cards.
4. **Present** both files to Tom with `computer://` links.
5. **Update memory.md** — record design-md skill and five7 sub-project (confirm with Tom first).

## Suggested skills
- `design-md` — the skill being applied; read SKILL.md in full before writing five7's DESIGN.md.

## Open questions
- Is five7.com.au Tom's firm's site, and is the DESIGN.md a standalone deliverable or meant to restyle the knowledge-map app?
- Should five7 files live in `outputs\five7\` or alongside the existing outputs?
- Light only, or light + dark preview?
