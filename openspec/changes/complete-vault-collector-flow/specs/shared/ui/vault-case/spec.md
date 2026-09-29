# shared/ui/vault-case Specification

## Purpose

The vault collector's blocks, drawn once and imported rather than rebuilt:
the fact card and its loading cards, the note list, the stage rail, the
confirmation that accepts an offer, and the empty vault home.

Every word, figure and callback reaches them through props, so the vault's
pages compose store blocks instead of drawing cards, lists, tables, steppers
and dialogs of their own. A booked visit's cards are
`shared/ui/appointment-booking`, reused unchanged.

## Feature set

- The export contract
  - Named components: the six vault blocks and their prop and copy types
    from the package entry
  - The booking set is not redrawn: a booked visit composes the booking
    confirmation and the manage card
  - Words through props: no block reads a catalogue, fetches, routes or
    stores
- Reading a case's facts
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
- Where a case stands
  - The stages in order: every earlier stage done, the current one in
    progress, every later one still to come
  - An ended case stays at its stage, with the word that says so under it
  - A stage the list does not hold is refused by name
  - A narrow screen scrolls the rail, never the page
- Accepting an offer
  - The terms before the answer: the lead, the total, what a late day costs
    and what will be signed
  - Accept and Go back, each reported to the consumer
  - While the answer is in flight: Accept busy, Go back unavailable, the
    dialog held open
  - A refusal read beside the terms, the dialog still open
  - The caller holds it open, and the block forwards that
- An empty vault home
  - The intro and the start action, the How it works steps, the empty panel
    and the draft cap, in that order

## ADDED Requirements

### Requirement: The vault case exports

The blocks the vault's collector pages compose, named once so no page draws
its own.

**Components** - the shared UI package SHALL export from its public entry
exactly these components for the vault collector's pages: `VaultFactCard`,
`VaultFactCardSkeleton`, `VaultNoteList`, `VaultStageRail`,
`VaultAcceptOfferDialog` and `VaultCasesEmpty`.

**Types** - each component SHALL carry a `<Name>Props` and a `<Name>Copy`
type exported beside it; `VaultFactCard` SHALL also carry `VaultFactRow`,
`VaultNoteList` `VaultNote`, and `VaultStageRail` `VaultStage`.

**The booking set is not redrawn** - the package SHALL NOT export a vault
confirmation or a vault visit card; a booked visit composes
`BookingConfirmation` and `BookingManageCard` unchanged.

**Words through props** - every word, figure and callback SHALL reach a block
through its props. No block SHALL import a message catalogue, fetch, store,
route or subscribe to data.

#### Scenario: shared-ui-vault-case-SC-01 - An application imports the vault blocks
**Serves:** The export contract - the vault's pages build from one set rather than drawing their own

- **WHEN** an application imports any component or type named above from the
  shared UI package's public entry
- **THEN** the import resolves
- **AND** no other component is exported for this surface

#### Scenario: shared-ui-vault-case-SC-02 - A booked visit composes the booking cards
**Serves:** The export contract - the vault's booked visit is the diary's own cards

- **WHEN** an application builds the vault's booked visit
- **THEN** `BookingConfirmation` and `BookingManageCard` resolve from the
  package's public entry
- **AND** no vault-named confirmation or visit card is exported

#### Scenario: shared-ui-vault-case-SC-03 - No block reaches past its props
**Serves:** The export contract - every state of a vault block is reached from props alone

- **WHEN** a vault block's source is read
- **THEN** it imports no message catalogue
- **AND** it fetches, stores, routes and subscribes to nothing

### Requirement: The fact card draws its parts in one order

`VaultFactCard` is one titled card of facts. It SHALL be a region named by
its title, and SHALL draw its parts in this order, each only when given:

| Part | Drawn when | Reads |
| --- | --- | --- |
| Title | always | the card's title |
| Line under the title | a line is given | the line |
| Lead | a lead is given | the consumer's content |
| Rows | at least one row is given | a table, one row per label and value, named by the rows label, or by the title when none is given |
| Body | a body is given | the consumer's content |
| Actions | actions are given | the consumer's controls, after everything else |

An empty list of rows SHALL draw no table, the same as no rows.

#### Scenario: shared-ui-vault-case-SC-04 - A card with every part reads them in order
**Serves:** Reading a case's facts - a vault page lays out a fact the case meets

- **WHEN** `VaultFactCard` is given a title, a line, a lead, two rows with a
  rows label, a body and an action
- **THEN** it reads the title, the line, the lead, the rows, the body, then
  the action
- **AND** it is one region named by the title
- **AND** the rows are one table named by the rows label, one row per label
  and value

#### Scenario: shared-ui-vault-case-SC-05 - Rows alone name their table by the title
**Serves:** Reading a case's facts - a vault page shows figures and nothing else

- **WHEN** `VaultFactCard` is given a title and rows, and no rows label,
  line, lead, body or action
- **THEN** the table is named by the title
- **AND** nothing but the table is drawn under the title

#### Scenario: shared-ui-vault-case-SC-06 - No rows draws no table
**Serves:** Reading a case's facts - a vault page shows words with no figures

- **WHEN** `VaultFactCard` is given a title, a body and either no rows or an
  empty list of rows
- **THEN** it draws the title and the body
- **AND** no table is drawn

### Requirement: The loading cards are one busy status

`VaultFactCardSkeleton` SHALL draw the given number of placeholder cards
inside one busy status named by its label, each placeholder hidden from a
screen reader, so a reader hears one line rather than one per placeholder. A
count below one SHALL be refused with an error naming the count.

#### Scenario: shared-ui-vault-case-SC-07 - Two loading cards are one status
**Serves:** Reading a case's facts - a vault page waits for its cases

- **WHEN** `VaultFactCardSkeleton` is given a count of 2 and a label
- **THEN** two placeholder cards are drawn
- **AND** one busy status is announced, named by the label
- **AND** no placeholder is announced on its own

#### Scenario: shared-ui-vault-case-SC-08 - A count below one is refused
**Serves:** Reading a case's facts - a page never waits on nothing

- **WHEN** `VaultFactCardSkeleton` is given a count of 0
- **THEN** it throws an error naming the count
- **AND** nothing is drawn

### Requirement: The note list draws a divider between two lines

`VaultNoteList` SHALL draw its lines in the order given, each line the
consumer's content, a link included. A divider SHALL sit under every line but
the last, whatever the count and whichever lines the consumer includes, so
Before you come ends without one on the storage lane and keeps one between
its third and fourth lines on the financed lane. An empty list SHALL draw
nothing.

#### Scenario: shared-ui-vault-case-SC-09 - Dividers fall between two lines on both lanes
**Serves:** Listing notes - a vault page lists what to do before a visit

- **WHEN** `VaultNoteList` is given Before you come's three lines for the
  storage lane, its four for the financed lane, or a single line
- **THEN** the lines read in the order given
- **AND** a divider sits under each line but the last, none under the last
- **AND** the storage lane's third line carries no divider, and the financed
  lane's third carries one

#### Scenario: shared-ui-vault-case-SC-10 - A line keeps its link
**Serves:** Listing notes - a collector not yet verified reads where to verify

- **WHEN** `VaultNoteList` is given a line holding a link, then more words
- **THEN** the line holds the link to its address, then the words

#### Scenario: shared-ui-vault-case-SC-11 - An empty list draws nothing
**Serves:** Listing notes - a vault page with nothing to list

- **WHEN** `VaultNoteList` is given no lines
- **THEN** no list and no divider is drawn

### Requirement: The stage rail marks the stage reached

`VaultStageRail` SHALL draw the stages it is given, in order, and mark each
against the current one:

| Stage | State |
| --- | --- |
| Before the current one | done |
| The current one | in progress, the one current step |
| After the current one | still to come |

An ending's word, when given, SHALL read under the current stage; no later
stage reads as reached. A current stage the list does not hold SHALL be
refused with an error naming it. On a screen narrower than its stages, the
rail SHALL scroll sideways inside itself, never the page.

#### Scenario: shared-ui-vault-case-SC-12 - The financed lane at Signed
**Serves:** Where a case stands - a borrower reads how far the case has come

- **WHEN** `VaultStageRail` is given Request, Valued, Offer, Agreed, Signed,
  Vault, Loan and Home, with Signed current
- **THEN** Request, Valued, Offer and Agreed read done
- **AND** Signed is in progress and the one current step
- **AND** Vault, Loan and Home read still to come

#### Scenario: shared-ui-vault-case-SC-13 - The storage lane holds six stages
**Serves:** Where a case stands - a storage case reads its own lane

- **WHEN** `VaultStageRail` is given Request, Valued, Agreed, Signed, Vault
  and Home, with Vault current
- **THEN** six stages are drawn, Vault in progress
- **AND** Request, Valued, Agreed and Signed read done, Home still to come

#### Scenario: shared-ui-vault-case-SC-14 - The wizard's first step
**Serves:** Where a case stands - a collector reads where the request wizard is

- **WHEN** `VaultStageRail` is given Describe, Photograph and Review, with
  Describe current
- **THEN** Describe is in progress
- **AND** Photograph and Review read still to come

#### Scenario: shared-ui-vault-case-SC-15 - An ended case stays at its stage
**Serves:** Where a case stands - a collector reads where a closed case stopped

- **WHEN** `VaultStageRail` is given the financed lane with Offer current and
  the ending's word Declined
- **THEN** Offer is in progress with Declined under it
- **AND** every stage after Offer reads still to come

#### Scenario: shared-ui-vault-case-SC-16 - A stage the rail does not hold is refused
**Serves:** Where a case stands - a rail never draws a case at a stage its lane skips

- **WHEN** `VaultStageRail` is given the storage lane's six stages with Loan
  current
- **THEN** it throws an error naming the stage it was given
- **AND** no rail is drawn

#### Scenario: shared-ui-vault-case-SC-17 - A narrow screen scrolls the rail
**Serves:** Where a case stands - a borrower on a phone reads every stage

- **WHEN** the financed lane's eight stages are drawn 320 pixels wide
- **THEN** the rail scrolls sideways to Home
- **AND** the page does not scroll sideways

### Requirement: The accept confirmation reads the terms before the answer

`VaultAcceptOfferDialog` SHALL draw its title, the lead, the total to repay,
what a late day costs and what will be signed, then Go back and Accept. The
caller SHALL hold it open: the block forwards the `open` it is given and never
opens itself. It SHALL report Accept as `onConfirm` and going back - Go back,
Escape or the overlay - as `onGoBack`, answering nothing.

| State | Accept | Go back | Escape and the overlay | Refusal |
| --- | --- | --- | --- | --- |
| Idle | available | available | report going back | none |
| In flight | busy | unavailable | leave it open | none |
| Refused | available | available | report going back | an alert beside the terms |

#### Scenario: shared-ui-vault-case-SC-18 - The terms read before Accept
**Serves:** Accepting an offer - a collector reads what accepting commits them to

- **WHEN** `VaultAcceptOfferDialog` is open with the offer's words and
  nothing in flight
- **AND** the collector clicks Accept
- **THEN** the dialog reads its title, the lead, the total, the late-day cost
  and what will be signed, with Go back and Accept
- **AND** `onConfirm` is reported once

#### Scenario: shared-ui-vault-case-SC-19 - Going back answers nothing
**Serves:** Accepting an offer - a collector changes their mind before answering

- **WHEN** the dialog is open with nothing in flight
- **AND** the collector clicks Go back or presses Escape
- **THEN** `onGoBack` is reported once
- **AND** `onConfirm` is not reported

#### Scenario: shared-ui-vault-case-SC-20 - An answer in flight holds the dialog
**Serves:** Accepting an offer - an answer on its way is never abandoned

- **WHEN** the dialog is open with an answer in flight
- **AND** the collector presses Escape
- **THEN** Accept shows it is busy and Go back cannot be clicked
- **AND** the dialog stays open and nothing is reported

#### Scenario: shared-ui-vault-case-SC-21 - A refusal reads beside the terms
**Serves:** Accepting an offer - a collector reads why the answer did not go

- **WHEN** the dialog is open with a refusal and nothing in flight
- **THEN** the refusal is announced as an alert, the terms still in the
  dialog
- **AND** Go back and Accept can both be clicked

#### Scenario: shared-ui-vault-case-SC-22 - The dialog never opens itself
**Serves:** Accepting an offer - only the case page decides the confirmation is open

- **WHEN** `VaultAcceptOfferDialog` is given the offer's words and is not
  open
- **THEN** no dialog is drawn

### Requirement: The empty vault home reads the way in

`VaultCasesEmpty` SHALL draw, in this order: the intro, the start action, How
it works with each step's title and line, the empty panel's title and line,
and the draft cap. It SHALL report the start action as `onStartRequest`.

#### Scenario: shared-ui-vault-case-SC-23 - The empty home reads in order and reports the start
**Serves:** An empty vault home - a collector with no case yet starts their first request

- **WHEN** `VaultCasesEmpty` is given the intro, the start label, four How it
  works steps, the empty panel's words and the draft cap
- **AND** the collector clicks the start action
- **THEN** the intro, the start action, How it works and its four steps, the
  empty panel, then the draft cap read in that order
- **AND** `onStartRequest` is reported once
