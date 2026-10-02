# shared/ui/vault-case Specification

## Purpose

The vault collector's own blocks, drawn once and imported rather than
rebuilt: the confirmation that accepts an offer, the vault home with its
cases, and the empty vault home. The loading cards and the case page's cards
the vault shares with other site pages are `shared/ui/page-blocks`.

Every word, figure and callback reaches them through props, so the vault's
pages compose store blocks instead of drawing dialogs, cards and empty states
of their own. A booked visit's cards are `shared/ui/appointment-booking`,
reused unchanged.

## Feature set

- The export contract
  - Named components: the three vault blocks and their prop and copy types
    from the package entry
  - The booking set is not redrawn: a booked visit composes the booking
    confirmation and the manage card
  - Words through props: no block reads a catalogue, fetches, routes or
    stores
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
- The vault home's cases
  - The way in and the count: Start a request, Your cases and how many, and
    the several-items note
  - A card per case: in the order given, each opening its own case
  - A case at a glance: the item's name, the status, whose move it is, the
    facts with the reference, the next step, the booked visit or the day the
    item went in, and on an ended case the reason staff gave
  - Only what the case has: a part the consumer gives no words for is not
    drawn

## Requirements

### Requirement: The vault case exports

The blocks the vault's collector pages compose, named once so no page draws
its own.

**Components** - the shared UI package SHALL export from its public entry
exactly these components for the vault collector's own surfaces:
`VaultAcceptOfferDialog`, `VaultCases` and `VaultCasesEmpty`. The vault's
case page composes `shared/ui/page-blocks` for its cards, lists and rails.

**Types** - each component SHALL carry a `<Name>Props` and a `<Name>Copy`
type exported beside it; `VaultCases` SHALL also carry `VaultCasesCard`, one
case as its card draws it, with `VaultCasesChip`, `VaultCasesTone` and
`VaultCasesIcon`, and `VaultCasesEmpty` SHALL also carry
`VaultCasesEmptyStep`.

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
- **AND** the collector clicks Go back, presses Escape or clicks the overlay
- **THEN** `onGoBack` is reported once
- **AND** `onConfirm` is not reported

#### Scenario: shared-ui-vault-case-SC-20 - An answer in flight holds the dialog
**Serves:** Accepting an offer - an answer on its way is never abandoned

- **WHEN** the dialog is open with an answer in flight
- **AND** the collector presses Escape or clicks the overlay
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

### Requirement: The vault home reads its cases

`VaultCases` SHALL draw, in this order: the start action across the column,
the Your cases heading with the number of cases beside it, one card per case
in the order given, and the several-items note. It
SHALL report the start action as `onStartRequest`, and a card's opening as
`onOpen` with that case's id.

#### Scenario: shared-ui-vault-case-SC-24 - The home reads in order and counts its cases
**Serves:** `grade10-site/vault/case-intake#grade10-site-vault-case-intake-US-05`, `The vault home's cases` - a collector with cases scans them from the home

- **WHEN** `VaultCases` is given three cases and its words
- **AND** the collector clicks the start action
- **THEN** the start action, Your cases with 3 beside it, the three cards in
  the order given and the several-items note read in that order
- **AND** `onStartRequest` is reported once

#### Scenario: shared-ui-vault-case-SC-25 - Opening a card reports its case
**Serves:** `grade10-site/vault/case-intake#grade10-site-vault-case-intake-US-05`, `The vault home's cases` - a collector picks their own case out of the list

- **WHEN** the collector clicks the second card on the home
- **THEN** `onOpen` is reported once with the second case's id

### Requirement: A case card reads the case at a glance

Each card `VaultCases` draws SHALL draw these parts, in this order, each from
the words and tones it is given:

| Part | Drawn | Shows |
| --- | --- | --- |
| Title | always | the item's name with a caret; the one control on the card, named by the name, described by the reference, covering the card |
| Chips | always | the status chip, then whose move it is, each in its tone and with its icon when given |
| Facts | always | the facts in order, then the reference in a fixed-width face |
| Next step | when given | the step after an arrow, on a tint of its tone |
| Visit | when given | the visit or the day the item went in, after a calendar |
| Note | when given | the note in the error tone |

A card SHALL derive no part from a case status.

#### Scenario: shared-ui-vault-case-SC-26 - A card reads every part it is given, in order
**Serves:** `grade10-site/vault/valuation-and-offer#grade10-site-vault-valuation-and-offer-US-02`, `The vault home's cases` - a collector sees an offer waiting from the list

- **WHEN** `VaultCases` is given a case with a title, two chips, three
  facts, a reference, a primary next step, a visit and a note
- **THEN** its card reads the title, the two chips, the facts with the
  reference, the next step, the visit and the note in that order
- **AND** the card's one control is named by the title and described by the
  reference

#### Scenario: shared-ui-vault-case-SC-27 - A card draws only the parts it is given
**Serves:** The vault home's cases - a case with nothing to do and no visit reads no empty row

- **WHEN** `VaultCases` is given a case with no next step, no visit and no
  note
- **THEN** its card reads the title, the chips and the facts with the
  reference
- **AND** no next step, calendar line or note is drawn

#### Scenario: shared-ui-vault-case-SC-28 - A card opens from anywhere on it
**Serves:** `grade10-site/vault/case-intake#grade10-site-vault-case-intake-US-05`, `The vault home's cases` - a collector opens their case from anywhere on its card

- **WHEN** the collector clicks a card on its facts line, away from its title,
  or moves the keyboard to its control and presses Enter
- **THEN** `onOpen` is reported once with that case's id, each time
