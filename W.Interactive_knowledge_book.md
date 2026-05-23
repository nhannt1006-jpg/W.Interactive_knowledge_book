# W.Interactive_knowledge_book

## Project summary
A compiled knowledge reference book covering all legal and regulatory constraints that affect architectural elements in Victoria, Australia — including NCC, town planning schemes, building regulations, and related legislation.

## Mode
Work

## Purpose
Give the team a single, navigable reference for the full landscape of legal constraints affecting design decisions. Replaces scattered lookups across multiple documents and websites.

## Primary output
An **interactive force-graph / bubble map** (HTML-based) where:
- Each bubble = a constraint domain or element
- Clicking a bubble reveals connected bubbles (related constraints, cross-references, linked legislation)
- Navigation is graph-style — no fixed hierarchy, relationships drive the structure

## Scope — constraint domains to cover
- NCC (National Construction Code) — volumes 1 & 2
- Victoria Planning Provisions (VPP) / local planning schemes
- Building Act 1993 (Vic) + Building Regulations 2018
- ResCode / Clause 55 & 56
- Heritage overlays, design & development overlays
- Disability standards (DDA / AS 1428)
- Fire engineering / BCA fire provisions
- Environmental / ESD requirements
- Other overlays and local policy where relevant

## Audience
Internal team and colleagues — assumed to have architectural / planning background.

## Conventions
- Every constraint node must cite its source (legislation + clause number)
- Connections between nodes are explicit and labelled
- Plain English summaries preferred; technical terms defined on hover or sub-node

## Working files
- `outputs/` — drafts, versioned files, deliverables, working artifacts Gengar creates
- `reference/` — source legal documents Tom dumps in (PDFs, legislation, practice notes, etc.)

## Status
See `memory.md`
