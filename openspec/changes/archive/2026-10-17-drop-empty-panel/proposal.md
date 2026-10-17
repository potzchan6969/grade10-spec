**Author:** @tangconst - 2026-10-13

## Why

`EmptyPanel` wraps the design system's `EmptyState` and adds nothing a page
cannot say to the primitive directly: it forwards the title, the line under
it and the actions, and renames the root `data-slot`, which `EmptyState`
already accepts as a prop. Two copies of one empty state is two contracts to
hold in step; the primitive is the one with the Figma set behind it.

## What Changes

- **BREAKING** - `EmptyPanel`, `EmptyPanelProps` and `EmptyPanelCopy` leave
  the `@grade10/ui` public entry; `shared/ui/page-blocks` exports four page
  blocks
- Pages that showed nothing compose `EmptyState` directly, passing
  `data-slot` for the name their tests and walks find them by - already
  landed on the walk-in and ticket not-found states in `apps/preview`
- The capability's export contract, its feature set's "Nothing here yet"
  group, and the suite cases that walk the block are removed or revised

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/ui/page-blocks`: the export contract drops `EmptyPanel` and its
  types; the "Nothing here yet" requirement and its scenarios are removed

## Impact

- `packages/ui`: `src/blocks/page-blocks/empty-panel.tsx` and its story
  deleted; `src/index.ts` and `public-exports.test.ts` updated (landed)
- `apps/preview`: walk-in and ticket pages compose `EmptyState` (landed)
- `docs/prds/products/shared/ui/page-blocks.md` and
  `docs/governance/ui-component-contracts.md` lose their `EmptyPanel` lines
- The grade10 application repository: any import of `EmptyPanel` fails to
  resolve on the next package bump; the two known consumers were the
  appointment walk-in and ticket pages, drawn here in the preview app

## References

- [Page Blocks](../../../docs/prds/products/shared/ui/page-blocks.md#the-blocks)
