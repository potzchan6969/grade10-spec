# grade10-site/vault/case-lifecycle Specification

## Feature set

- The statuses
  - One status column: a case holds exactly one status, and it is the only
    thing a move writes
  - Two lanes, one machine: the financed lane adds the offer and the loan, and
    nothing else forks
  - What is not a status: a booking and an overdue loan are answers to
    questions, not states
- Moving a case
  - Guarded moves: a move runs only from the statuses it names, and a case
    that moved under the caller is refused by name
  - One history: every move and every plain record appends to the case's own
    history, in the move's own transaction
  - Actor on the record: each entry names who acted — the collector, a member
    of staff, or a sweep
  - Taken from the collector's own page: the moves that are theirs — calling
    the request off, and asking for the item back — run from the case, each
    behind a confirmation naming what it closes
- Clocks
  - Abandonment clocks: a case nobody came back to ends on its own clock and
    never on a missed visit
  - No clock on a settled loan: a repaid case waits for its owner, because
    storage is free
  - A draft staff opened: ends on the unsent draft's own clock, with no
    email
- The exits
  - Ends that are not a release: declined, cancelled, expired, forfeited
  - Cancel before custody: the case's owner may call it off until the item is
    in the vault
  - A walk-in typed wrong: staff cancel the unsent draft they opened, and the
    account at the wrong address keeps nothing of it
  - Nothing unwinds past a live advance: once money stands, the ways out are
    repayment and forfeiture
  - Two moves back: a corrected advance and a corrected repayment each put the
    case where the money leaves it
  - Read in the collector's words: an ended case says the reason staff gave,
    who called it off, which clock ran out, or the figure the item settled
    and the dates of the notice behind it
- Derived at the read
  - The fact the case meets: a lapsed, declined or superseded offer, a visit
    closed as missed and an ask for the item back, each with the one thing to
    do next
  - A lapsed offer reads as lapsed: the offer's own expiry decides it at the
    read, and the case stays where it was, open for another offer
  - Where the case stands: the stage on the lane the case walks, read from the
    status and never stored
  - Whose the item is: one word from the fact the case reads, its status and
    the due date
  - No status for any of it: nothing derived is written down, so a fact can
    never disagree with the case it was read from

## ADDED Requirements

### Requirement: A draft staff opened ends silently and leaves nothing on the account

A draft staff opened at the counter ends the way any unsent request does, and
its address was typed rather than proven, so its endings tell nobody and the
account keeps nothing of it.

- **The clock** — it SHALL end as `expired` on the unsent request's own clock,
  7 days from its last touch, an edit by the collector being a touch.
- **The cancel** — staff SHALL be able to cancel it while it is unsent, and so
  SHALL the collector.
- **Silent** — neither ending SHALL tell anybody, as
  `grade10-site/vault/collector-notifications` states.
- **Removed** — when staff cancel it, or its clock ends it, whoever has signed
  in to the account since, the draft and every photograph on it SHALL be
  removed from the account in the same step: the
  account's list SHALL NOT show it, its address SHALL read as not found to the
  account, the account's own data SHALL NOT hold it, and no photograph of it
  SHALL be served. The account SHALL stay as it was, and the case's reference
  SHALL stay spent. The case SHALL stay in staff's Closed view under its
  reference, its item reading as erased and naming no collector.
- **The collector's own cancel** — a draft staff opened that the collector
  cancels SHALL end as any cancelled draft and stay on their list.
- **Opened again** — staff SHALL be able to open another walk-in for the right address once
  the draft typed wrong is cancelled.
- **Once sent** — a draft staff opened that the collector has sent SHALL be
  cancelled, told and kept as any case, and a cancel sent from a page read
  while it was unsent SHALL be refused by name as a case that moved.

#### Scenario: grade10-site-vault-case-lifecycle-SC-41 - A walk-in typed wrong is cancelled and leaves nothing
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator undoes a draft opened under the wrong address

- **GIVEN** a draft staff opened under a mistyped address, carrying two photographs
- **WHEN** staff cancel it
- **THEN** the case is `cancelled`
- **AND** the account at that address lists nothing of it, its address reads as not found to that account, and neither photograph is served
- **AND** staff's Closed view lists it under its reference, its item reading as erased and no collector named
- **AND** nobody is emailed

#### Scenario: grade10-site-vault-case-lifecycle-SC-42 - The walk-in opens again under the right address
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator serves the customer under the address they meant

- **GIVEN** a draft staff opened under a mistyped address and then cancelled
- **WHEN** staff open a walk-in for the right address
- **THEN** a new draft opens under that address's account, with a reference of its own and not the cancelled draft's

#### Scenario: grade10-site-vault-case-lifecycle-SC-43 - An unsent walk-in runs out and leaves nothing
**Serves:** Clocks - the sweep that ends a draft staff opened and nobody sent

- **GIVEN** a draft staff opened and untouched for 8 days
- **WHEN** the clocks are read
- **THEN** the case is `expired`, the account lists nothing of it, and nobody is told

#### Scenario: grade10-site-vault-case-lifecycle-SC-44 - The collector's own cancel keeps the draft on their list
**Serves:** grade10-site-vault-case-lifecycle-US-01 - the collector calls off a request staff opened for them

- **GIVEN** a draft staff opened under the collector's account
- **WHEN** the collector cancels it
- **THEN** the case is `cancelled` and stays on their list as a cancelled request
- **AND** nobody is emailed

#### Scenario: grade10-site-vault-case-lifecycle-SC-45 - A walk-in the collector sent is cancelled as any case
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the operator cancels a walk-in that is no longer a draft

- **GIVEN** a draft staff opened that the collector has sent
- **WHEN** staff cancel it
- **THEN** the case is `cancelled` and stays on the collector's list with its photographs
- **AND** the collector is told, as on any case

#### Scenario: grade10-site-vault-case-lifecycle-SC-46 - A cancel read before the collector sent is refused
**Serves:** grade10-site-vault-case-lifecycle-US-06 - the counter and the collector act on one walk-in at once

- **GIVEN** a draft staff opened, read by an operator while it was unsent
- **WHEN** the collector sends it, and the operator then cancels it from the page they read
- **THEN** the cancel is refused by name as a case that moved
- **AND** the case stays submitted, on the collector's list, with its photographs

#### Scenario: grade10-site-vault-case-lifecycle-SC-47 - The collector's edit restarts the draft's clock
**Serves:** Clocks - a walk-in the collector is still working on

- **GIVEN** a draft staff opened on day 0, whose title the collector changed on day 5
- **WHEN** the clocks are read on day 8, and again on day 13
- **THEN** on day 8 the draft stands, and by day 13 it has run out, been removed from the account, and nobody was told

#### Scenario: grade10-site-vault-case-lifecycle-SC-48 - Staff's cancel removes the draft after someone signed in
**Serves:** grade10-site-vault-case-lifecycle-US-06 - a sign-in at a mistyped address does not keep someone else's draft

- **GIVEN** a draft staff opened, and someone who has since signed in to that account without sending it
- **WHEN** staff cancel it
- **THEN** it is removed from the account, as an unsent walk-in is, and nobody is emailed

## MODIFIED Requirements

### Requirement: The case's owner may call it off before custody

The collector SHALL be able to cancel their own case from any status before
the item is in the vault — `draft`, `submitted`, `under_valuation`,
`offer_made`, `accepted` or `signing` — and staff SHALL be able to cancel it
from the same statuses. Whatever offer is live SHALL close in the same
transaction, any visit SHALL be cancelled with the case, and the collector
SHALL be told — except on a draft staff opened, whose cancel tells nobody, as
"A draft staff opened ends silently and leaves nothing on the account" states.

Staff SHALL be able to decline an item while it is being valued, with a reason
the collector reads verbatim.

Once the item is in the vault, the case SHALL be callable off only by staff,
and only while no advance stands against it; that unwind SHALL run the release
machinery and sign no release document.

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-0gz rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-09 - A collector cancels an offer they were made
**Serves:** grade10-site-vault-case-lifecycle-US-01 - Collector calls off a request before the item is in the vault

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner cancels the case
- **THEN** the case is `cancelled`, the offer is closed, the visit is cancelled and the collector is told

<!-- trace:scenario id=g10.vault-case-lifecycle.SC-vch rev=1 -->
#### Scenario: grade10-site-vault-case-lifecycle-SC-10 - A case in the vault is not the collector's to cancel
**Serves:** grade10-site-vault-case-lifecycle-US-01 - Collector calls off a request before the item is in the vault

- **GIVEN** a case whose item is in the vault
- **WHEN** its owner asks to cancel it
- **THEN** it is refused by name
