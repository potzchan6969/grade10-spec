## Goals

- One empty state, not two: a page with nothing to show composes the design
  system's `EmptyState` directly
- The `page-blocks` contract names only the blocks a page cannot get from
  the design system as it stands

## Non-Goals

- No change to `EmptyState` itself - its variants, slots and action row
  already cover what `EmptyPanel` forwarded
- No change to `FactCard`, `FactCardSkeleton`, `NoteList` or `StageRail`
- No new block to replace it - a page that needs an icon, a compact rung or
  a frameless rung passes those props itself

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Is `EmptyPanel` redundant? | Yes - it forwards `title`, `description` and `actions` to `EmptyState` and renames `data-slot`, which the primitive accepts as a prop; nothing else | Keep it as the named empty state for pages - two contracts for one drawing |
| Q2 | How do consumers find the panel by slot once the block is gone? | The page passes `data-slot` to `EmptyState`, which spreads it onto its root and overrides the default `empty-state` | A `slot` prop on every consumer - the mechanism the block existed to rename, now one line at the page |
| Q3 | What happens to the two known consumers? | Walk-in's wait error and the ticket's dead link compose `EmptyState` with the Figma canonical actions (secondary then primary `Button`, the way out rendered as an anchor) | Keep the outline `Button` and `Link` pair - the rung the Figma set draws is secondary then primary |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
