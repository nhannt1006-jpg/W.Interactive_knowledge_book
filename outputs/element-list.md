# Interactive Knowledge Book — Element List
## Layers 1, 2 & 3

Generated: 2026-05-21  
Status: DRAFT — for Tom's review before building JSON

---

### How to read this list

| Column | Meaning |
|---|---|
| Layer 2 | Sub-category bubble (second level of drill-down) |
| Layer 3 element | Leaf node — has a constraints side panel |
| TP source | Planning permit source (Clause 55, VPP, overlays) |
| WD source | Building permit source (NCC, Building Regs, AS standards) |
| Flag | `TP` = planning only · `WD` = building only · `BOTH` = triggers on both |

---

## 00 — Site & Planning

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Siting** | Street setback | B2-1 (Cl 55.02-1) | Building Regs Pt 5 | BOTH |
| **Siting** | Side setback | B2-3 (Cl 55.02-3) | Building Regs Pt 5 | BOTH |
| **Siting** | Rear setback | B2-3 (Cl 55.02-3) | Building Regs Pt 5 | BOTH |
| **Siting** | Building height | B2-2 (Cl 55.02-2) | NCC H3 / zone schedule | BOTH |
| **Siting** | Site coverage | B2-5 (Cl 55.02-5) | — | TP |
| **Siting** | Walls on boundaries | B2-4 (Cl 55.02-4) | Building Regs | BOTH |
| **Siting** | Front fence | B2-8 (Cl 55.02-8) | Building Regs | BOTH |
| **Siting** | Tree canopy (new) | B2-7 (Cl 55.02-7) | — | TP |
| **Overlays** | Heritage overlay (HO) | Cl 43.01 | — | TP |
| **Overlays** | Design & development overlay (DDO) | Cl 43.02 | — | TP |
| **Overlays** | Neighbourhood character overlay (NCO) | Cl 43.05 | — | TP |
| **Overlays** | Vegetation protection overlay (VPO) | Cl 42.02 | — | TP |
| **Overlays** | Significant landscape overlay (SLO) | Cl 42.03 | — | TP |
| **Overlays** | Environmental significance overlay (ESO) | Cl 42.01 | — | TP |
| **Overlays** | Flood overlay (LSIO/FO) | Cl 44.01 / 44.02 | Building Regs | BOTH |
| **Overlays** | Bushfire overlay (BMO/WMO) | Cl 44.06 / 44.05 | NCC Section C | BOTH |
| **Overlays** | Land subject to inundation (LSIO) | Cl 44.04 | — | TP |
| **Permit triggers** | Permit requirement — zone | Cl 32.xx | — | TP |
| **Permit triggers** | Permit requirement — overlay | Cl 42–44 | — | TP |
| **Permit triggers** | Restrictive covenant | Title search | — | TP |

---

## 01 — Substructure

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Footings & slabs** | Strip footings | — | NCC B1, AS 2870 | WD |
| **Footings & slabs** | Raft slab | — | NCC B1, AS 2870 | WD |
| **Footings & slabs** | Pad footings | — | NCC B1 | WD |
| **Footings & slabs** | Bored piers / screw piles | — | NCC B1, engineer | WD |
| **Footings & slabs** | Reactive soil classification (AS 2870) | — | AS 2870 | WD |
| **Retention & drainage** | Retaining walls (≤1m / >1m) | — | Building Regs r.71 | WD |
| **Retention & drainage** | Subsoil drainage | — | NCC H1.3 | WD |
| **Retention & drainage** | Tanking / basement waterproofing | — | NCC F1 | WD |
| **Retention & drainage** | Fill & cut — site levels | Building Regs | Building Regs | BOTH |

---

## 02 — Superstructure

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Wall framing** | Timber frame (Class 1) | — | NCC H1, AS 1684 | WD |
| **Wall framing** | Steel frame (Class 1) | — | NCC H1, AS 4600 | WD |
| **Wall framing** | Masonry — brick veneer | — | NCC H1, AS 3700 | WD |
| **Wall framing** | Masonry — full brick | — | NCC H1, AS 3700 | WD |
| **Wall framing** | Party wall (Class 2+) | — | NCC C2, H4.4 | WD |
| **Roof structure** | Roof trusses | — | NCC H1, AS 4440 | WD |
| **Roof structure** | Rafter / purlin roof | — | NCC H1, AS 1684 | WD |
| **Roof structure** | Structural steel — beams & posts | — | NCC B1, AS 4100 | WD |
| **Fire separation** | Fire-rated wall (FRL) | — | NCC C2 | WD |
| **Fire separation** | Fire door / shutter | — | NCC C3, AS 1905.1 | WD |
| **Fire separation** | Penetrations & seals | — | NCC C3.15 | WD |

---

## 03 — Building Envelope

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **External walls** | Wall cladding material | B2 (character) | NCC F5, BAL rating | BOTH |
| **External walls** | Render / paint finish | B2 (character) | — | TP |
| **External walls** | Cavity / insulation | — | NCC H6 | WD |
| **External walls** | Damp-proof course | — | NCC H1.3, F1.1 | WD |
| **Roof** | Roof cladding | B2 (character) | NCC F5, BAL rating | BOTH |
| **Roof** | Roof drainage / gutters | — | NCC H1.4, AS 3500.3 | WD |
| **Roof** | Box gutter | — | NCC H1.4 | WD |
| **Windows & glazing** | Window size / placement | B3-9 (daylight), B4-4 (overlooking) | NCC H2.2 | BOTH |
| **Windows & glazing** | Safety glazing | — | NCC H2.4, AS 1288 | WD |
| **Windows & glazing** | Fly screens | — | NCC H3.4 | WD |
| **Windows & glazing** | Glazing to existing neighbour windows | B4-1, B4-2 | — | TP |
| **External doors** | External door — size & hardware | — | NCC H2, D3 | WD |
| **External doors** | Garage door | B2-6 (access) | Building Regs | BOTH |
| **Waterproofing** | Wet area waterproofing | — | NCC F1.7, AS 3740 | WD |
| **Waterproofing** | External deck / balcony | — | NCC F1.7 | WD |
| **Thermal & acoustic** | Wall insulation (thermal) | — | NCC H6 | WD |
| **Thermal & acoustic** | Acoustic insulation — party walls | — | NCC F5.5 / H4.4 | WD |
| **Thermal & acoustic** | Acoustic insulation — floors | — | NCC F5.5 | WD |
| **Amenity impact** | Overlooking screens | B4-4 (Cl 55.04-4) | — | TP |
| **Amenity impact** | Overshadowing — open space | B4-3 (Cl 55.04-3) | — | TP |
| **Amenity impact** | Overshadowing — solar panels | B5-2 (Cl 55.05-2) | — | TP |
| **Amenity impact** | Internal views | B4-5 (Cl 55.04-5) | — | TP |

---

## 04 — Interiors

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Room dimensions** | Functional layout | B3-7 (Cl 55.03-7) | NCC H3.2 | BOTH |
| **Room dimensions** | Room depth | B3-8 (Cl 55.03-8) | — | TP |
| **Room dimensions** | Habitable room minimum area | — | NCC H3.2 | WD |
| **Room dimensions** | Ceiling height | — | NCC H3.2 / H3.3 | WD |
| **Daylight & ventilation** | Daylight to new windows | B3-9 (Cl 55.03-9) | NCC H3.4 | BOTH |
| **Daylight & ventilation** | Natural ventilation | B3-10 (Cl 55.03-10) | NCC H3.4 | BOTH |
| **Daylight & ventilation** | Mechanical ventilation (no window) | — | NCC H3.4, F4 | WD |
| **Open space** | Private open space | B3-5 (Cl 55.03-5) | — | TP |
| **Open space** | Solar access to open space | B3-6 (Cl 55.03-6) | — | TP |
| **Open space** | Clothes drying area | B3-5 note | — | TP |
| **Circulation** | Internal stairway | — | NCC H2.1, D2 | WD |
| **Circulation** | Ramp — internal | — | NCC D2, AS 1428.1 | WD |
| **Circulation** | Corridor width | — | NCC D1 / AS 1428.1 | WD |
| **Accessibility** | Accessible path of travel | — | NCC D3, AS 1428.1 | WD |
| **Accessibility** | Adaptable / accessible dwelling (Class 2) | — | NCC D3.5, AS 4299 | WD |
| **Accessibility** | Hearing augmentation | — | NCC E4, AS 1428.5 | WD |
| **Storage** | Storage (per dwelling) | B3-11 (Cl 55.03-11) | — | TP |

---

## 05 — Fittings & Fixtures

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Wet areas** | Bathroom / ensuite | — | NCC H4.3, F1.7, AS 3740 | WD |
| **Wet areas** | Laundry | — | NCC H4.3 | WD |
| **Wet areas** | Floor waste / drainage | — | NCC H4.3, AS 3500 | WD |
| **Kitchen** | Kitchen layout | — | NCC H4.3 | WD |
| **Kitchen** | Rangehood / exhaust | — | NCC H3.4 | WD |
| **Accessible fittings** | Accessible bathroom | — | AS 1428.1 Cl 15 | WD |
| **Accessible fittings** | Accessible toilet | — | AS 1428.1 Cl 12 | WD |
| **Accessible fittings** | Grab rails | — | AS 1428.1 Cl 13 | WD |
| **Accessible fittings** | Tapware | — | AS 1428.1 | WD |
| **Accessible fittings** | Door hardware — lever | — | AS 1428.1 Cl 11 | WD |
| **Waste** | Waste & recycling storage | B5-5 (Cl 55.05-5) | — | TP |
| **Waste** | Waste bin collection access | B5-5 | — | TP |

---

## 06 — Building Services

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Hydraulic** | Hot water system | — | NCC G3 / H5 | WD |
| **Hydraulic** | Cold water supply | — | NCC G1, AS 3500.1 | WD |
| **Hydraulic** | Gas installation | — | NCC G4, AS 5601 | WD |
| **Hydraulic** | Sanitary plumbing | — | NCC F2, AS 3500.2 | WD |
| **Hydraulic** | Stormwater disposal | B5-1 | NCC H1.4, AS 3500.3 | BOTH |
| **Hydraulic** | Rainwater tank | B5-1 | Building Regs | BOTH |
| **Mechanical** | Exhaust fan — wet areas | — | NCC H3.4 | WD |
| **Mechanical** | Mechanical ventilation — carpark | — | NCC F4 | WD |
| **Mechanical** | Noise from services (AC units etc.) | B5-6 (Cl 55.05-6) | — | TP |
| **Electrical** | Switchboard / meter | — | NCC H4.6, AS 3000 | WD |
| **Electrical** | Smoke alarm | — | NCC H4.5, E2.2 | WD |
| **Electrical** | Emergency lighting (Class 2+) | — | NCC E4 | WD |
| **Fire services** | Smoke alarm — Class 1 | — | NCC H4.5 | WD |
| **Fire services** | Sprinkler system (Class 2+) | — | NCC E1.5 | WD |
| **Fire services** | Fire hydrant / hose reel | — | NCC E1 | WD |
| **Fire services** | Exit signs | — | NCC E4 | WD |

---

## 07 — External Works

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Access & parking** | Vehicle crossover | B2-6 (Cl 55.02-6) | Building Regs | BOTH |
| **Access & parking** | Driveway geometry | B2-6 | Building Regs | BOTH |
| **Access & parking** | Car parking (number) | Cl 52.06 | — | TP |
| **Access & parking** | Parking location | B3-2 (Cl 55.03-2) | — | TP |
| **Access & parking** | Bicycle parking | Cl 52.34 | — | TP |
| **Access & parking** | Accessible parking space | — | AS 2890.6, AS 1428.1 | WD |
| **Fencing** | Front fence height | B2-8 (Cl 55.02-8) | Building Regs | BOTH |
| **Fencing** | Side / rear fence | — | Building Regs (Fences Act) | WD |
| **Fencing** | Pool / spa barrier | — | Building Regs, AS 1926.1 | WD |
| **Pedestrian** | Street integration | B3-3 (Cl 55.03-3) | — | TP |
| **Pedestrian** | Dwelling entry path | B3-4 (Cl 55.03-4) | AS 1428.1 | BOTH |
| **Pedestrian** | Shared path / communal areas | — | AS 1428.1 | WD |
| **Landscaping** | Tree canopy (new planting) | B2-7 | — | TP |
| **Landscaping** | Significant tree removal | Cl 52.17 / VPO / SLO | — | TP |
| **Landscaping** | Letterboxes | — | Building Regs | WD |
| **Landscaping** | Clothes line / drying | B3-5 note | — | TP |

---

## 08 — ESD & Sustainability

| Layer 2 | Layer 3 element | TP source | WD source | Flag |
|---|---|---|---|---|
| **Water management** | Site permeability | B5-1 (Cl 55.05-1) | — | TP |
| **Water management** | Stormwater treatment (WSUD) | B5-1, Cl 22 (ESD policy) | Building Regs | BOTH |
| **Water management** | Rainwater reuse | B5-1, Cl 22 (ESD policy) | — | TP |
| **Solar** | Rooftop solar generation area | B5-3 (Cl 55.05-3) | — | TP |
| **Solar** | Overshadowing — neighbour solar | B5-2 (Cl 55.05-2) | — | TP |
| **Solar** | Solar protection to N windows | B5-4 (Cl 55.05-4) | — | TP |
| **Energy efficiency** | NatHERS / thermal performance | — | NCC H6.1 (6-star) | WD |
| **Energy efficiency** | Whole-of-home energy budget | — | NCC H6.2 | WD |
| **Energy efficiency** | Roof insulation | — | NCC H6 | WD |
| **Energy efficiency** | Glazing performance | — | NCC H6 | WD |
| **Local ESD policy** | BESS / STORM tool | Cl 22 (council-specific) | — | TP |
| **Local ESD policy** | Environmentally sustainable design local policy | Cl 22 (council-specific) | — | TP |

---

## Layer 2 / Layer 3 suggestions for the two regulatory layers

These are not additional bubbles — they're flags and metadata on each leaf node above.

### Regulatory Layer A — Universal (the book owns this)
Every Layer 3 element gets:
- Standard ResCode / NCC / Building Regs provision
- TP or WD flag
- Plain English summary
- Source citation (clause + document)

### Regulatory Layer B — Scheme pathway (book maps the path, not the content)
Each Layer 3 element where council scheme applies gets a `check-scheme` flag:
- Which layer to check: Zone schedule → Overlay → Particular provisions → Local policy (Cl 22)
- Link out to planning.vic.gov.au for the specific council

### Regulatory Layer C — Council edge cases (grows over time)
Each leaf node has an empty `council-notes` field:
- Format: `{ council: "Boroondara", note: "…", date: "2026-05-21" }`
- Starts blank for all 79 councils
- Tom fills as he encounters edge cases on real permits
- Over time becomes the institutional knowledge layer

---

## Summary counts

| Layer 1 | Layer 2 sub-categories | Layer 3 elements |
|---|---|---|
| 00 Site & Planning | 3 | 19 |
| 01 Substructure | 2 | 9 |
| 02 Superstructure | 3 | 11 |
| 03 Building Envelope | 6 | 21 |
| 04 Interiors | 5 | 17 |
| 05 Fittings & Fixtures | 4 | 12 |
| 06 Building Services | 4 | 16 |
| 07 External Works | 4 | 16 |
| 08 ESD & Sustainability | 4 | 12 |
| **Total** | **35** | **133** |

---

*Notes: Class 1 (townhouses) primary scope. Class 2 (apartments) elements marked — can be toggled off in the TP/WD filter if not needed.*
