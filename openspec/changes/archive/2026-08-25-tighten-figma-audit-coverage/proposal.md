**Author:** @seankcw - 2026-08-25

## Why

A collector opening the store sees a header whose background is whatever page
sits behind it. `Nav` draws no fill at all: `nav.tsx` styled its root
`<header>` with layout classes only, while the Figma source (`4171:9937`)
fills that frame with `Base/background`. It looked correct for weeks because
every preview story happens to sit on a `gray-50` page — the same value the
missing fill would have painted.

The nightly design-sync run did not catch it, and could not have. Audited with
the classes it shipped with, `figma:audit` reports the broken header as
passing:

```
$ pnpm run figma:audit --node …node-id=4171-9937 --classes "flex w-full flex-col"
  – flex / w-full / flex-col   unchecked
✓ every checked value matches Figma
```

The rail generates one expectation per class the code supplies, so a property
the code never styled produces no expectation and no finding. It catches a
class that resolves to the wrong value; it is structurally blind to a value
the design draws and the code omitted.

The same sweep also never reaches the two components in question. `Nav` and
`Footer` live in `packages/design-system/src/components/layout/`, and
`--all-blocks` walks `packages/ui/src/blocks` only. Their Figma sets declare no
variant axes, so `check:design-system` — which diffs variant sets — has nothing
to compare either. The site chrome falls between both rails and is checked by
nobody.

What that cost: `Footer` has been shipping the inverse of its design. Figma
fills `4171:9653` with `Base/primary` (#1A1A1A) and sets every string in
`Base/primary-foreground` — a dark footer. The code renders `bg-background`
(#FAFAFA) with foreground text. Pointed at the node by hand, the existing rail
catches it immediately:

```
✗ bg-background            #FAFAFAFF in code, #1A1A1AFF in Figma
```

Nothing was ever pointed at it. Both storefronts have been rendering a footer
the design does not describe.

**Metric:** design-drift findings that reach a shipped storefront rather than a
failed nightly. Today that number is 2 of 2 — both defects were found by a
person reading Figma, not by the rail built to find them. It should be 0.

## What Changes

- **A node's fill and stroke stop being optional.** Where a Figma node states a
  visible solid fill and the audited classes name no background, that is a
  finding rather than silence — the argument the script already makes for
  `clipsContent`, which is checked precisely because every frame states it. The
  same applies to a visible stroke and `border-*`, in both directions.
- **The audit sweep reaches the site chrome.** A design-system component
  directory may carry an `audit.json` and be swept by the same run that sweeps
  the blocks, so `Nav` and `Footer` become covered without moving.
- **`Nav` and `Footer` gain an `audit.json`**, making the chrome the first
  design-system components under the rail.
- **`Footer` is repainted to match its design source** — the dark palette
  `4171:9653` specifies — so the tightened rail lands green rather than red.
- **A new `design-sync` product** records what the rail owes, which no existing
  product covers.

## Non-Goals

- **Moving `Nav` and `Footer` into `packages/ui`.** Their placement in the
  design system is a decision recorded in `docs/governance/ui-component-contracts.md`
  and in the `shared/ui/site-chrome` export contract. Reopening it is a real
  question and a separate one; deciding it as a side effect of a tooling change
  is how it would get decided by accident.
- **Checking variable *names* rather than resolved values.** The REST API
  resolves bindings before serializing, and reading the names needs
  `file_variables:read`, which Figma gates to Enterprise. A wrong token that
  resolves to the right value still passes. The in-session `get_variable_defs`
  check remains the stronger one.
- **Backfilling `audit.json` for the four uncovered blocks** — `auction-listing`,
  `auth-sign-in`, `auth-two-factor`, `store-profile`. They stay listed as
  uncovered, which is what the run already reports.
- **Making corner radius non-optional.** `cornerRadius` is genuinely absent on
  many nodes, so silence there is not an answer.

## Capabilities

### New Capabilities

- `shared/design-sync/coverage`: what the design-to-code audit rail must detect
  and which components it must reach — omission as well as drift, and the site
  chrome as well as the blocks.

### Modified Capabilities

None. `shared/ui/site-chrome` governs the chrome's exports, controls, and
content ownership; it states nothing about the palette, and the `Footer`
repaint brings the implementation to its already-recorded Figma source rather
than changing a requirement.

## Impact

- `scripts/design-sync/audit-node.mjs` — fill and stroke expectations; the
  sweep's roots.
- `packages/design-system/src/components/layout/footer.tsx` — palette corrected
  to the Figma source; the divergence note in its JSDoc comes out.
- `packages/design-system/src/components/layout/footer.stories.tsx` — stories
  re-checked against the dark palette.
- `packages/design-system/src/components/layout/audit.json` — new.
- `openspec/specs/README.md` — the `design-sync` product bullet.
- `.github/workflows/design-sync.yml` — the audit step's description, if the
  sweep's name changes.
- Consuming applications: none. No export, prop, or type changes. Both stores
  see the `Footer` repaint on their next submodule bump, which is the point.
