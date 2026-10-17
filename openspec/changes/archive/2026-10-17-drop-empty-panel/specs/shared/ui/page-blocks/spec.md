# shared/ui/page-blocks Specification

## Purpose

The page parts every site page composes rather than drawing its own: a
titled card of facts and its loading cards, a list of short lines, and a
rail of stages. The vault's collector pages and grading's collector pages
both compose them, so neither draws cards, lists, tables or steppers of its
own. A page with nothing to show composes the design system's empty state
directly.

Every word, figure and callback reaches them through props.

## Feature set

- The export contract
  - Named components: the four page blocks and their prop and copy types
    from the package entry
  - Words through props: no block reads a catalogue, fetches, routes or
    stores
  - Found by slot: each block takes the `data-slot` a consumer finds it by,
    and keeps the design system's own slot when given none
- Reading facts
  - One titled card: a region named by its title, with an optional line
    under the title
  - Label and value rows: a table named by its own label, or by the title
  - The parts in order: the lead, the rows, the body, then the actions; a
    part left out draws nothing
  - Loading cards: one busy status named by its label, the placeholders
    hidden from a screen reader
- Listing notes
  - The items in the order given, a line between two items and none after
    the last, whatever the count
  - An item may carry a link
  - An empty list draws nothing
- How far along
  - The stages in order: every earlier stage done, the current one in
    progress, every later one still to come
  - An ending's word under the stage reached
  - A stage the list does not hold is refused by name
  - A narrow screen scrolls the rail, never the page

## MODIFIED Requirements

### Requirement: The page blocks export

The parts a site page composes, named once so no page draws its own.

**Components** - the shared UI package SHALL export from its public entry
exactly these components for site pages: `FactCard`, `FactCardSkeleton`,
`NoteList` and `StageRail`.

**Types** - each component SHALL carry a `<Name>Props` and a `<Name>Copy`
type exported beside it; `FactCard` SHALL also carry `FactRow`, `NoteList`
`NoteListItem`, and `StageRail` `StageRailStage`.

**Words through props** - every word, figure and callback SHALL reach a block
through its props. No block SHALL import a message catalogue, fetch, store,
route or subscribe to data.

**Found by slot** - each block SHALL take an optional slot and draw it as its
`data-slot`; given none, it SHALL keep the slot the design system's part
carries: `card` on `FactCard`, `stack` on `FactCardSkeleton` and `list` on
`NoteList`. `StageRail`'s root SHALL carry none, and the design system's
stepper inside it keeps `stepper`.

<!-- trace:scenario id=g10.shared-page-blocks.SC-zu0 rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-01 - An application imports the page blocks
**Serves:** The export contract - site pages build from one set rather than drawing their own

- **WHEN** an application imports any component or type named above from the
  shared UI package's public entry
- **THEN** the import resolves
- **AND** no other component is exported for this capability

<!-- trace:scenario id=g10.shared-page-blocks.SC-pmq rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-02 - No block reaches past its props
**Serves:** The export contract - every state of a page block is reached from props alone

- **WHEN** a page block's source is read
- **THEN** it imports no message catalogue
- **AND** it fetches, stores, routes and subscribes to nothing

<!-- trace:scenario id=g10.shared-page-blocks.SC-33c rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-18 - A consumer finds a block by its slot
**Serves:** The export contract - a page's tests and walks find its parts by name

- **WHEN** `FactCard`, `FactCardSkeleton`, `NoteList` or `StageRail` is given
  a slot
- **THEN** the block carries it as its `data-slot`
- **AND** given none, `FactCard` carries `card`, `FactCardSkeleton` `stack`
  and `NoteList` `list`
- **AND** given none, `StageRail`'s root carries no slot and its stepper
  carries `stepper`

## REMOVED Requirements

### Requirement: The empty panel says nothing is here yet

**Reason:** `EmptyPanel` forwarded `title`, `description` and `actions` to
the design system's `EmptyState` and renamed its root `data-slot` - both of
which the primitive accepts as props. The block was a second contract over
one drawing, so pages compose `EmptyState` directly.

**Migration:** consumers render `EmptyState` from
`@grade10/design-system/components/display/empty-state` with `title`,
`description` and `actions`, and pass the slot they were found by as
`data-slot`. The appointment walk-in and ticket pages in `apps/preview`
already do.

<!-- trace:scenario id=g10.shared-page-blocks.SC-kyu rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-17 - An empty panel with a way out
**Serves:** Nothing here yet - a collector with no submissions reads how to start one

- **WHEN** `EmptyPanel` is given a title and a Start action, and no line
- **THEN** the title reads, with no line under it
- **AND** pressing Start reports it to the consumer
