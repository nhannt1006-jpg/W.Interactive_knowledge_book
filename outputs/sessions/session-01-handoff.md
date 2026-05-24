# Session 01 Handoff — W.Interactive_knowledge_book
Date: 2026-05-21

## What we did this session

1. **Project set up** — created folder structure, `W.Interactive_knowledge_book.md`, `memory.md`, `outputs/`, `reference/`
2. **Grill-me session** — ran full design Q&A, locked all decisions on the bubble map
3. **Document library** — Tom uploaded 4 documents + NCC folder. All scanned for structure.
4. **grill-me skill** — packaged and ready to install from outputs/grill-me.skill

---

## All decisions locked — do not re-ask

| Decision | Answer |
|---|---|
| Node type | Architectural element (not legislation) |
| Layer 1 | Tom's product spec folders (00–08) — see memory.md |
| Navigation | Drill-down, replaces view per layer, breadcrumb trail |
| Constraints display | Side panel on click, not as bubbles |
| TP/WD filter | Toggle: planning constraints vs building permit constraints |
| Search | Yes — by element or constraint keyword |
| Data source | JSON file — Tom tells Gengar findings, Gengar updates |
| Hosting | Single HTML in shared drive, replace file on update |
| Devices | Desktop primary, tablet-friendly (iPad for boss) |
| Contributions | "Suggest" button → clipboard copy → paste to Tom |

---

## Next session — build the prototype

### Step 1: Create `outputs/knowledge-map-data.json`
Layer 1 nodes with placeholder Layer 2 and one worked example of constraints.

Layer 1 structure:
```json
[
  { "id": "00", "label": "Site & Planning", "mode": ["TP"], "children": [...] },
  { "id": "01", "label": "Substructure", "mode": ["WD"], "children": [...] },
  { "id": "02", "label": "Superstructure", "mode": ["WD"], "children": [...] },
  { "id": "03", "label": "Building Envelope", "mode": ["TP","WD"], "children": [...] },
  { "id": "04", "label": "Interiors", "mode": ["TP","WD"], "children": [...] },
  { "id": "05", "label": "Fittings & Fixtures", "mode": ["WD"], "children": [...] },
  { "id": "06", "label": "Building Services", "mode": ["WD"], "children": [...] },
  { "id": "07", "label": "External Works", "mode": ["TP","WD"], "children": [...] },
  { "id": "08", "label": "ESD & Sustainability", "mode": ["TP","WD"], "children": [...] }
]
```

### Step 2: Build `outputs/knowledge-map.html`
Single self-contained HTML file using D3.js force graph (from CDN).

Must include:
- [ ] Layer 1 bubble map on load (force-directed, sized by importance)
- [ ] Click bubble → drill into Layer 2 (replace view, show breadcrumb)
- [ ] Click Layer 2 → drill into Layer 3 (or show side panel if leaf node)
- [ ] Side panel: element name, description, list of constraints with source citation
- [ ] TP / WD toggle filter (highlights relevant nodes, greys out irrelevant)
- [ ] Search bar — filters/highlights matching nodes
- [ ] "Suggest an addition" button in side panel → copies clipboard message
- [ ] Back button / breadcrumb navigation
- [ ] Works on desktop + tablet (touch events, responsive layout)
- [ ] "Coming soon" placeholder for empty layers

### Step 3: Test and share
- Save `knowledge-map.html` to shared drive location (ask Tom where)
- Tom opens and gives feedback on feel/nav

---

## Outstanding gaps to fill (not blockers for prototype)

- Full AS 1428.1-2021 (current copy is 9-page extract only)
- Council-specific planning scheme + overlays (from planning.vic.gov.au)
- NCC Amendment 1 (base files pre-date it; Amdt 2 patch is in reference/)
- Confirm team's shared drive platform (OneDrive / Teams / Google Drive)
- Confirm building classes the team works on (Class 1 only? Class 2+? Both?)
