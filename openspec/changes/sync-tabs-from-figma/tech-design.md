## Context

Figma Tab (`2121:1139`) and Tab List (`6586:6340`) are the contract. Code had
`default` | `line`, per-trigger underlines, and vertical orientation. Sync
aligns names, motion, and layout to those sets.

## Goals / Non-Goals

**Goals:**

- `TabsList` `variant`: `pill` | `list`
- Sliding indicators for both variants
- `fullWidth` boolean for even flush triggers
- Horizontal-only root; migrate call sites

**Non-Goals:**

- Durable `openspec/specs/` delta (`skip_specs: true`)
- Publishing Code Connect from CI

## Decisions

- **`fullWidth` stays off the cva VARIANT axis** — Figma does not draw it; a
  boolean keeps design-sync from inventing a Figma option
- **One indicator element** — shared motion path for pill fill and list
  underline
- **Icon padding unchanged with icons** — Figma keeps `Gap/gap-4` on both
  sides; drop the old `data-icon` pl/pr pinch

## Risks / Trade-offs

- Renaming `line` → `list` is a type break for any consumer still on
  `variant="line"` — in-repo call sites migrate in this change
