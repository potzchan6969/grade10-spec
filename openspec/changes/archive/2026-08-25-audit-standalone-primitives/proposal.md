**Author:** @seankcw - 2026-08-25

## Why

`Nav` and `Footer` were not special. They went unchecked because they are
*standalone* Figma components — components with no variant axes — and
`checkValues` skips those by construction:

```js
// A standalone component has no variants; checkValues skips it, which
// is correct — there is no second rung to diff its geometry against.
variants: isSet ? (node.children ?? []).map(…) : [],
```

The reasoning is sound and the consequence was not noticed: a standalone
component's fill, height, radius, and padding are compared by nothing at all.
Classifying every `.figma.ts` in the design system against the Figma file:

| Kind | Count | Value check today |
| --- | --- | --- |
| `COMPONENT_SET` | 25 | `checkValues` compares per variant |
| standalone `COMPONENT` | 15 | none |

`tighten-figma-audit-coverage` covered 2 of those 15. The remaining 13 are
`Breadcrumbs`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`, `Checkbox List`,
`Dialog`, `Dialog Header`, `Dropdown Menu`, `List`, `List Item`,
`Navigation List`, `Pagination`, `PaginationEllipsis`, and `Radio List` — a
dialog, a dropdown, and a pagination control among them, on every surface that
opens one.

The other half of the problem is that the rail covering the 25 cannot fail.
Every value finding in `check-components.mjs` is `report.warns`, so today's run
ends `✓ no errors (27 warning(s))` no matter what it found. Its own header
records the near-miss this was built for — `Button`'s `default` variant
painting a 10% tint where the design specifies a solid fill, unnoticed for
months. It catches that now, and reports it as a warning nobody has to read.

And it shares the blind spot `tighten-figma-audit-coverage` just closed
elsewhere: it imports the same `expectations()` from `values.mjs`, so its
expectations are raised *by* the classes a `cva` config names. A variant whose
Figma fill the class string never mentions raises nothing — the identical
failure that let a header ship with no background.

**Metric:** design-system components whose rendered values are compared against
Figma by a rail that can fail the run. There are 40 components with a Figma
counterpart — 25 sets and 15 standalone. Today that number is **0**: the 25
sets are compared but only warn, and the 15 standalone are not compared at
all. Once `tighten-figma-audit-coverage` lands, 2 of the standalone are
compared and do fail. Target: **40 of 40**.

## What Changes

- **The 13 remaining standalone components gain audit tables**, one per
  component directory — `display/`, `forms/`, `overlays/` — listing the
  elements their conversion styled.
- **Value drift in `check-components.mjs` becomes an error**, not a warning.
  Descriptions, naming, and axis-mapping findings stay warnings: they are
  hygiene, not a claim that the code draws the wrong thing.
- **Omission detection is ported into `check-components.mjs`**, so a variant
  fill or stroke that no class in the `cva` config names is a finding there
  too, as it now is for audit tables.
- **The uncovered accounting counts standalone components, not directories.**
  `tighten-figma-audit-coverage` left the sweep reporting `display, forms,
  overlays` as flat gaps, which reads as three whole directories needing
  tables when most of their contents are covered by the other rail.

## Non-Goals

- **Audit tables for the 25 component sets.** They are covered by
  `check-components.mjs`, which compares every variant rather than one
  resting state. Two rails on one component means two sources of truth that
  drift apart.
- **Building the 20 Figma components that have no code counterpart** —
  `Switch`, `Toast`, `Tab`, `Segmented Control` and the rest. They are
  warnings today and stay warnings; each is a component decision, not a rail
  one.
- **Carrying the 5 missing JSDoc descriptions across.** Also hygiene, also
  unrelated, and folding them in would hide the rail change inside a diff of
  comment edits.
- **Comparing typography.** No rail compares type today, which is why the
  footer logo's `text-sm font-medium` against Figma's `text-base/bold` is
  still invisible. Worth its own change; the gap is named here so it is not
  mistaken for coverage.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `design-sync/audit-coverage`: adds requirements for standalone components
  and for a rail that fails. Carried as `## ADDED Requirements`, not
  `MODIFIED` — nothing already required changes meaning.

**Sequencing.** This capability does not yet exist under `openspec/specs/`; it
arrives when `tighten-figma-audit-coverage` is archived. Archive that change
first, then this one. No active change currently shares a capability with
another, so this is the first time two deltas queue on one path here — worth
watching at archive rather than assuming.

## Impact

- `scripts/design-sync/check-components.mjs` — value findings become errors;
  omission detection ported in.
- `scripts/design-sync/audit-node.mjs` — uncovered accounting.
- `packages/design-system/src/components/{display,forms,overlays}/audit.json`
  — new, 13 components across three files.
- Consuming applications: none, unless a backfilled table turns up drift in a
  primitive. If one does, the correction ships as a normal design-system
  change and reaches both stores on their next submodule bump.

**On landing green.** The 27 warnings were triaged before this was written:
20 are "no code component", 5 are missing JSDoc descriptions, 1 is an axis
mapping. **None is a value mismatch**, so promoting value drift to an error
fails nothing that passes today. The omission port and the 13 new tables are
the unknown — `tighten-figma-audit-coverage` surfaced two genuine findings the
moment its rail ran, and this touches thirteen components rather than two.
Expect findings; each is a correction to make, not a reason to loosen the rail.
