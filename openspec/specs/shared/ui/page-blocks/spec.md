# shared/ui/page-blocks Specification

## Purpose

The page parts every site page composes rather than drawing its own: a
titled card of facts and its loading cards, a list of short lines, a rail of
stages, and an empty panel. The vault's collector pages and grading's
collector pages both compose them, so neither draws cards, lists, tables,
steppers or empty states of its own.

Every word, figure and callback reaches them through props.

## Feature set

- The export contract
  - Named components: the five page blocks and their prop and copy types
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
- Nothing here yet
  - A title, the line under it and the way out, each drawn only when given

## Requirements

### Requirement: The page blocks export

The parts a site page composes, named once so no page draws its own.

**Components** - the shared UI package SHALL export from its public entry
exactly these components for site pages: `FactCard`, `FactCardSkeleton`,
`NoteList`, `StageRail` and `EmptyPanel`.

**Types** - each component SHALL carry a `<Name>Props` and a `<Name>Copy`
type exported beside it; `FactCard` SHALL also carry `FactRow`, `NoteList`
`NoteListItem`, and `StageRail` `StageRailStage`.

**Words through props** - every word, figure and callback SHALL reach a block
through its props. No block SHALL import a message catalogue, fetch, store,
route or subscribe to data.

**Found by slot** - each block SHALL take an optional slot and draw it as its
`data-slot`; given none, it SHALL keep the slot the design system's part
carries: `card` on `FactCard`, `stack` on `FactCardSkeleton`, `list` on
`NoteList` and `empty-state` on `EmptyPanel`. `StageRail`'s root SHALL carry
none, and the design system's stepper inside it keeps `stepper`.

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

### Requirement: The fact card draws its parts in one order

`FactCard` is one titled card of facts. It SHALL be a region named by
its title, found by the consumer's slot or by the design system's own `card`
slot when none is given, and SHALL draw its parts in this order, each only when given:

| Part | Drawn when | Reads |
| --- | --- | --- |
| Title | always | the card's title |
| Line under the title | a line is given | the line |
| Lead | a lead is given | the consumer's content |
| Rows | at least one row is given | a table, one row per label and value, named by the rows label, or by the title when none is given |
| Body | a body is given | the consumer's content |
| Actions | actions are given | the consumer's controls, after everything else |

An empty list of rows SHALL draw no table, the same as no rows. The space
between the lead, the rows and the body SHALL be the consumer's `gap`: `sm`,
the default, or `md`.

<!-- trace:scenario id=g10.shared-page-blocks.SC-8a9 rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-03 - A card with every part reads them in order
**Serves:** Reading facts - a vault page lays out a fact the case meets

- **WHEN** `FactCard` is given a title, a line, a lead, two rows with a
  rows label, a body and an action
- **THEN** it reads the title, the line, the lead, the rows, the body, then
  the action
- **AND** it is one region named by the title
- **AND** the rows are one table named by the rows label, one row per label
  and value

<!-- trace:scenario id=g10.shared-page-blocks.SC-k2o rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-04 - Rows alone name their table by the title
**Serves:** Reading facts - a vault page shows figures and nothing else

- **WHEN** `FactCard` is given a title and rows, and no rows label,
  line, lead, body or action
- **THEN** the table is named by the title
- **AND** nothing but the table is drawn under the title

<!-- trace:scenario id=g10.shared-page-blocks.SC-dan rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-05 - No rows draws no table
**Serves:** Reading facts - a vault page shows words with no figures

- **WHEN** `FactCard` is given a title, a body and either no rows or an
  empty list of rows
- **THEN** it draws the title and the body
- **AND** no table is drawn

### Requirement: The loading cards are one busy status

`FactCardSkeleton` SHALL draw the given number of placeholder cards
inside one busy status named by its label, each placeholder hidden from a
screen reader, so a reader hears one line rather than one per placeholder. A
count below one SHALL be refused with an error naming the count.

<!-- trace:scenario id=g10.shared-page-blocks.SC-ynk rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-06 - Two loading cards are one status
**Serves:** Reading facts - a vault page waits for its cases

- **WHEN** `FactCardSkeleton` is given a count of 2 and a label
- **THEN** two placeholder cards are drawn
- **AND** one busy status is announced, named by the label
- **AND** no placeholder is announced on its own

<!-- trace:scenario id=g10.shared-page-blocks.SC-v4l rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-07 - A count below one is refused
**Serves:** Reading facts - a page never waits on nothing

- **WHEN** `FactCardSkeleton` is given a count of 0
- **THEN** it throws an error naming the count
- **AND** nothing is drawn

### Requirement: The note list draws a divider between two lines

`NoteList` SHALL draw its lines in the order given, each line the
consumer's content, a link included. A divider SHALL sit under every line but
the last, whatever the count and whichever lines the consumer includes, so
Before you come ends without one on the storage lane and keeps one between
its third and fourth lines on the financed lane. An empty list SHALL draw
nothing.

<!-- trace:scenario id=g10.shared-page-blocks.SC-l8d rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-08 - Dividers fall between two lines on both lanes
**Serves:** Listing notes - a vault page lists what to do before a visit

- **WHEN** `NoteList` is given Before you come's three lines for the
  storage lane, its four for the financed lane, or a single line
- **THEN** the lines read in the order given
- **AND** a divider sits under each line but the last, none under the last
- **AND** the storage lane's third line carries no divider, and the financed
  lane's third carries one

<!-- trace:scenario id=g10.shared-page-blocks.SC-df6 rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-09 - A line keeps its link
**Serves:** Listing notes - a collector not yet verified reads where to verify

- **WHEN** `NoteList` is given a line holding a link, then more words
- **THEN** the line holds the link to its address, then the words

<!-- trace:scenario id=g10.shared-page-blocks.SC-44p rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-10 - An empty list draws nothing
**Serves:** Listing notes - a vault page with nothing to list

- **WHEN** `NoteList` is given no lines
- **THEN** no list and no divider is drawn

### Requirement: The stage rail marks the stage reached

`StageRail` SHALL draw the stages it is given, in order, and mark each
against the current one:

| Stage | State |
| --- | --- |
| Before the current one | done |
| The current one | in progress, the one current step |
| After the current one | still to come |

An ending's word, when given, SHALL read under the current stage; no later
stage reads as reached. A current stage the list does not hold SHALL be
refused with an error naming it. On a screen narrower than its stages, the
rail SHALL scroll sideways inside itself, never the page, and SHALL take
focus so a keyboard can scroll it.

<!-- trace:scenario id=g10.shared-page-blocks.SC-t28 rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-11 - The financed lane at Signed
**Serves:** How far along - a borrower reads how far the case has come

- **WHEN** `StageRail` is given Request, Valued, Offer, Agreed, Signed,
  Vault, Loan and Home, with Signed current
- **THEN** Request, Valued, Offer and Agreed read done
- **AND** Signed is in progress and the one current step
- **AND** Vault, Loan and Home read still to come

<!-- trace:scenario id=g10.shared-page-blocks.SC-pim rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-12 - The storage lane holds six stages
**Serves:** How far along - a storage case reads its own lane

- **WHEN** `StageRail` is given Request, Valued, Agreed, Signed, Vault
  and Home, with Vault current
- **THEN** six stages are drawn, Vault in progress
- **AND** Request, Valued, Agreed and Signed read done, Home still to come

<!-- trace:scenario id=g10.shared-page-blocks.SC-zd9 rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-13 - The wizard's first step
**Serves:** How far along - a collector reads where the request wizard is

- **WHEN** `StageRail` is given Describe, Photograph and Review, with
  Describe current
- **THEN** Describe is in progress
- **AND** Photograph and Review read still to come

<!-- trace:scenario id=g10.shared-page-blocks.SC-naf rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-14 - An ended case stays at its stage
**Serves:** How far along - a collector reads where a closed case stopped

- **WHEN** `StageRail` is given the financed lane with Offer current and
  the ending's word Declined
- **THEN** Offer is in progress with Declined under it
- **AND** every stage after Offer reads still to come

<!-- trace:scenario id=g10.shared-page-blocks.SC-vqx rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-15 - A stage the rail does not hold is refused
**Serves:** How far along - a rail never draws a case at a stage its lane skips

- **WHEN** `StageRail` is given the storage lane's six stages with Loan
  current
- **THEN** it throws an error naming the stage it was given
- **AND** no rail is drawn

<!-- trace:scenario id=g10.shared-page-blocks.SC-4c5 rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-16 - A narrow screen scrolls the rail
**Serves:** How far along - a borrower on a phone reads every stage

- **WHEN** the financed lane's eight stages are drawn 320 pixels wide
- **THEN** the rail scrolls sideways to Home
- **AND** the page does not scroll sideways

### Requirement: The empty panel says nothing is here yet

`EmptyPanel` SHALL draw the design system's empty state with the title it is
given, the line under it when given, and the consumer's actions when given.

<!-- trace:scenario id=g10.shared-page-blocks.SC-kyu rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-17 - An empty panel with a way out
**Serves:** Nothing here yet - a collector with no submissions reads how to start one

- **WHEN** `EmptyPanel` is given a title and a Start action, and no line
- **THEN** the title reads, with no line under it
- **AND** pressing Start reports it to the consumer

<!-- trace:scenario id=g10.shared-page-blocks.SC-33c rev=1 -->
#### Scenario: shared-ui-page-blocks-SC-18 - A consumer finds a block by its slot
**Serves:** The export contract - a page's tests and walks find its parts by name

- **WHEN** `FactCard`, `FactCardSkeleton`, `NoteList`, `StageRail` or
  `EmptyPanel` is given a slot
- **THEN** the block carries it as its `data-slot`
- **AND** given none, `FactCard` carries `card`, `FactCardSkeleton` `stack`,
  `NoteList` `list` and `EmptyPanel` `empty-state`
- **AND** given none, `StageRail`'s root carries no slot and its stepper
  carries `stepper`
