# memory.md — W.Interactive_knowledge_book

## Decisions

### Project purpose
- 2026-05-21: Knowledge reference book covering all legal/regulatory constraints affecting architectural elements in Victoria, Australia
- Audience: internal architecture team (non-technical users)
- Tom's two service streams drive the scope:
  - **TP service** → planning permit → ResCode, planning scheme, overlays
  - **WD service** → working drawings / building permit → NCC, Building Regulations

### Layer 1 taxonomy — LOCKED
- 2026-05-21: Use Tom's existing product spec folder structure as Layer 1 (team already knows it), plus one new category:

| # | Layer 1 bubble | Primary regulatory source |
|---|---|---|
| 00 | Site & Planning | ResCode B2, Planning scheme, Building Regs Part 5 |
| 01 | Substructure | NCC H1/B1, H2, Building Regs |
| 02 | Superstructure | NCC B1/H1, Section C (fire) |
| 03 | Building Envelope | NCC H2, C, J/H6, F5/H4, ResCode B4 |
| 04 | Interiors | NCC F/H4, D, ResCode B3, AS 1428.1 |
| 05 | Fittings & Fixtures | NCC F1, H4, AS 1428.1 |
| 06 | Building Services | NCC E, G, H6/J |
| 07 | External Works | ResCode B2, Building Regs Part 5 |
| 08 | ESD & Sustainability | NCC J/H6, ResCode B5 |

- Layer 2 = Tom's existing sub-folders within each category
- Layer 3 = specific elements (door types, wall types, etc.) — to be built out as documents are read

### Output format — LOCKED
- 2026-05-21: Interactive force-graph bubble map — HTML file
- Navigation: drill-down (click bubble → enters next layer, replaces view)
- Constraints: side panel appears when clicking a leaf node
- Search: yes, searchable by element or constraint keyword
- TP/WD filter: toggle to show planning constraints vs building permit constraints
- Contributions: "Suggest an addition" button per panel → copies pre-filled message to clipboard → team pastes to Tom via Teams/email
- Hosting: single HTML file (`knowledge-map.html`) in shared drive, replaced on update
- Devices: desktop primary, tablet-friendly (boss uses iPad)
- Data: JSON file — Tom dumps findings to Gengar, Gengar updates JSON

### Folder structure — LOCKED
```
W.Interactive_knowledge_book (1)/
├── W.Interactive_knowledge_book.md
├── memory.md
├── outputs/        ← Gengar's working files (HTML prototype, JSON data, etc.)
└── reference/      ← Tom dumps source documents here
    ├── AS/
    │   └── AS 1428.1-2021.pdf (INCOMPLETE — 9 pages only, need full standard)
    ├── ncc2022-complete-series-20230501b/
    │   ├── NCC 2022 Amdt 2_0.pdf
    │   ├── ncc2022-volume-one-20230501b.pdf
    │   ├── ncc2022-volume-two-20230501b.pdf
    │   ├── ncc2022-volume-three-20230501b.pdf
    │   ├── abcb-housing-provisions-2022-20230501b.pdf
    │   ├── ncc2022-combined-vol2-housing-provisions-20230501b.pdf
    │   └── ncc2022-consolidated-performance-requirements-20230501b.pdf
    ├── @ ResCode - 2025 - Townhouse-and-Low-Rise-Code-Guidelines-2025.pdf
    ├── Building_regulations_2018.pdf
    └── Using-Victorias-Planning-System.pdf
```

## Status
- 2026-05-21: Session 1 complete. Project set up, all decisions locked via grill-me session.
- **Next action: build working HTML prototype** with Layer 1 bubbles, drill-down nav, side panel, search, TP/WD filter, suggest button
- Prototype uses placeholder content — real constraint data populated later as Tom reads documents

## Conventions
- All files Gengar creates go in `outputs/`
- Reference documents Tom dumps go in `reference/`
- Tom dumps findings → Gengar updates JSON data file
- Data file lives in `outputs/knowledge-map-data.json`
- HTML file: `outputs/knowledge-map.html` (copy to shared drive to deploy)

## Contacts
_(none yet)_

## Open questions
- Where is the team's shared drive? (OneDrive / Teams / Google Drive / other) — needed for deployment instructions
- Does the team work on Class 1 (houses/townhouses) or Class 2+ (apartments) or both? → determines whether NCC Vol 1 or Vol 2 is primary
- Full AS 1428.1-2021 needed — current copy is 9-page extract only
- Planning scheme documents not yet uploaded (council-specific, lives on planning.vic.gov.au) — needed to populate overlay constraints
- NCC Amendment 1 files not in reference folder — only base 2022 + Amendment 2 patch

## Reference document status

| Document | Status | Notes |
|---|---|---|
| ResCode / Clause 55 (2025) | ✅ Read | 91 pages, fully scanned |
| Building Regulations 2018 | ✅ Scanned | 133 pages, mostly procedural — Part 5 is design-relevant (siting) |
| Using Victoria's Planning System | ✅ Scanned | 247 pages, procedural only — no design constraints, background reading |
| NCC 2022 Vol 1 | ✅ Scanned TOC | 884 pages, Class 2–9 buildings |
| NCC 2022 Vol 2 | ✅ Scanned TOC | 312 pages, Class 1 & 10 (houses) |
| NCC 2022 Vol 3 | Not read | Plumbing & drainage |
| NCC Housing Provisions | Not read | Companion to Vol 2 |
| NCC 2022 Amendment 2 | ✅ Read | 3 pages — only change: AS 1428.1 updated 2009→2021 |
| AS 1428.1-2021 | ⚠️ Incomplete | 9-page extract only, need full ~100 page standard |
| Planning scheme | ❌ Not uploaded | Council-specific, source: planning.vic.gov.au |
| NCC Amendment 1 | ❌ Not uploaded | Superseded by Amdt 2 but base files are pre-Amdt 1 |
