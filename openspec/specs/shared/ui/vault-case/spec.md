# shared/ui/vault-case Specification

## Purpose

The vault collector's own blocks, drawn once and imported rather than
rebuilt: the confirmation that accepts an offer, and the empty vault home.
The cards, lists and rails the vault's pages share with other site pages are
`shared/ui/page-blocks`.

Every word, figure and callback reaches them through props, so the vault's
pages compose store blocks instead of drawing dialogs and empty states of
their own. A booked visit's cards are
`shared/ui/appointment-booking`, reused unchanged.

## Feature set

- The export contract
  - Named components: the two vault blocks and their prop and copy types
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

## Requirements

### Requirement: The vault case exports

The blocks the vault's collector pages compose, named once so no page draws
its own.

**Components** - the shared UI package SHALL export from its public entry
exactly these components for the vault collector's own surfaces:
`VaultAcceptOfferDialog` and `VaultCasesEmpty`. The vault's pages compose
`shared/ui/page-blocks` for their cards, lists and rails.

**Types** - each component SHALL carry a `<Name>Props` and a `<Name>Copy`
type exported beside it; `VaultCasesEmpty` SHALL also carry
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
