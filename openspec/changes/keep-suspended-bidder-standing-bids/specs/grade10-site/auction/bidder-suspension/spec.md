## Feature set

- Trigger and notice
  - Operator suspension: an operator holding `auction:moderate` suspends an account with a reason
  - One suspension, two causes: a missed deadline and an operator's action are the same restriction
- Reinstatement
  - Operator review only: an operator reinstates whatever the cause, from the admin Users page
- Scope of the suspension
  - Auction-scoped only: bidding stops and nothing else does
  - Paying stays open: an account barred from bidding must still be able to settle what it owes
- Standing bids
  - No new bids: a suspended account cannot bid or raise a maximum
  - Standing maximums stay: a bid placed before the suspension is binding and keeps competing
  - History untouched: suspension writes nothing into any lot's bid history
  - Won lots stand: a lot already won stays won and its invoice stays payable

## MODIFIED Requirements

### Requirement: Suspension is scoped to auction activity alone

A suspension SHALL stop and leave open exactly these capabilities.

| Capability | Suspended |
| --- | --- |
| Placing a new bid or committing a maximum | Yes |
| Raising a standing maximum | Yes |
| Standing maxima on lots that have not closed | No — they stay in force |
| Paying an outstanding invoice | **No** — this SHALL remain available |
| Grade10 Store purchases | No |
| Grade10 Loyalty earning and redemption | No |
| Viewing the account, order history, and invoices | No |

A suspension SHALL NOT be a platform ban. It SHALL NOT prevent the account
signing in, and it SHALL NOT change anything `shared/auth/users` governs.

#### Scenario: suspension-SC-03 - A suspended account can still pay what it owes

- **GIVEN** a suspended account with an outstanding invoice
- **WHEN** the collector opens that invoice and pays it
- **THEN** Grade10 accepts the payment
- **AND** the invoice status becomes `paid`

#### Scenario: suspension-SC-04 - A suspended account still signs in and shops

- **GIVEN** a suspended account
- **WHEN** the collector signs in
- **THEN** Grade10 signs them in
- **AND** they can browse and buy in the Grade10 Store, earn and redeem
  loyalty, and read their own orders and invoices
- **AND** they cannot place a bid or commit a maximum

### Requirement: Only an operator lifts a suspension

A suspension SHALL NOT lift itself. Grade10 SHALL lift one only on an
explicit operator action following review, taken by an operator holding
`auction:moderate` from the account's panel on the admin Users page
(`grade10-admin/console/user-directory`).

- Paying the outstanding invoice SHALL NOT lift the suspension. Settlement
  resolves the order; reinstatement resolves the account.
- Reissuing an invoice SHALL NOT lift the suspension. An operator may give a
  winner a fresh chance to settle one lot while the account stays barred from
  bidding on anything new.
- Reinstating SHALL lift the suspension whatever caused it, and every cause
  recorded on it.

Grade10 SHALL show the suspension state and its reason on the account record.

#### Scenario: suspension-SC-09 - Paying does not lift the suspension

- **GIVEN** a suspended account with one outstanding invoice
- **WHEN** the collector pays that invoice in full
- **THEN** the invoice status becomes `paid`
- **AND** the account is still suspended
- **AND** the account record still shows the suspension and its reason

#### Scenario: suspension-SC-10 - A reissue does not lift the suspension

- **GIVEN** a suspended account with an expired auction order
- **WHEN** an operator reissues that invoice with a new payment deadline
- **THEN** the account is still suspended
- **AND** the collector can pay the reissued invoice and still cannot bid

#### Scenario: suspension-SC-11 - An operator reinstates the account

- **GIVEN** a suspended account an operator has reviewed
- **WHEN** the operator reinstates it
- **THEN** the account can place bids and commit maxima again
- **AND** the account record retains the suspension and its reason as history

## REMOVED Requirements

### Requirement: Suspension retracts every standing bid on an open lot

**Reason**: A standing maximum is a binding bid that other bidders have
already bid against. Withdrawing it moved prices and leaders on lots the
missed payment had nothing to do with, and added a history line after the
fact. Suspension now looks forward only.

**Migration**: Replaced by "Suspension stops new bids and leaves standing
bids as they are". Scenarios `suspension-SC-05` to `suspension-SC-08` retire; the rule
of `suspension-SC-06` is restated as `suspension-SC-16`.
No `bid_retracted_suspension` event is written from this change on; events
already written stay in history as they are.

## ADDED Requirements

### Requirement: An operator suspends an account from auctions

An operator holding `auction:moderate` SHALL be able to suspend an account
from auction activity, from the account's panel on the admin Users page
(`grade10-admin/console/user-directory`), and SHALL give a reason to do so.

An operator's suspension SHALL be the same suspension a missed payment
deadline causes: the same scope, the same effect on bids, and lifted the same
way. Only its cause differs.

| Cause | Recorded reason | Collector is told |
| --- | --- | --- |
| Payment deadline passed | The expired auction order | The outstanding amount and how to resolve it |
| Operator action | The operator's reason, who suspended, and when | They can no longer bid, and how to contact Grade10 |

- The operator's reason SHALL be shown to operators on the account record,
  and SHALL NOT be shown or sent to the collector.
- An account that is already suspended SHALL NOT be suspended again. A new
  cause while suspended SHALL be recorded beside the first, and the account
  SHALL stay suspended once.

#### Scenario: suspension-SC-17 - An operator suspends an account with a reason

- **GIVEN** an operator holding `auction:moderate` and an account that is not suspended
- **WHEN** the operator suspends the account with a reason
- **THEN** the account cannot place a bid or commit a maximum
- **AND** the account record shows the operator's reason, who suspended, and when

#### Scenario: suspension-SC-18 - A suspension without a reason is refused

- **GIVEN** an operator holding `auction:moderate`
- **WHEN** the operator tries to suspend an account without a reason
- **THEN** Grade10 refuses the suspension
- **AND** the account is not suspended

#### Scenario: suspension-SC-19 - An operator without the grant cannot suspend

- **GIVEN** an operator who does not hold `auction:moderate`
- **WHEN** they try to suspend an account
- **THEN** Grade10 refuses it on the server
- **AND** the account is not suspended

#### Scenario: suspension-SC-20 - The collector is told without the operator's reason

- **GIVEN** an account an operator has just suspended with a reason
- **WHEN** the collector reads the suspension notice and their account record
- **THEN** both say they can no longer bid and how to contact Grade10
- **AND** neither shows the operator's reason

#### Scenario: suspension-SC-21 - A missed deadline on a suspended account adds a cause

- **GIVEN** an account an operator suspended, with an auction order whose invoice is `pending`
- **WHEN** that order's payment deadline passes
- **THEN** the account is suspended once
- **AND** the account record shows both causes

#### Scenario: suspension-SC-22 - Reinstating lifts an operator's suspension

- **GIVEN** an account an operator suspended
- **WHEN** an operator holding `auction:moderate` reinstates it
- **THEN** the account can place bids and commit maxima again
- **AND** the account record keeps the suspension and its reason as history

### Requirement: Suspension stops new bids and leaves standing bids as they are

While an account is suspended, Grade10 SHALL refuse every new bid and every
raise of a maximum from it, on every lot.

A suspension SHALL NOT change any bid the account placed before it:

- Every maximum the account has on an open lot SHALL stay in force. Auto-bidding
  SHALL resolve the lot with that maximum exactly as it would for an account
  that is not suspended, and it SHALL bid for the account up to its cap.
- A suspended account that holds the highest maximum when a lot closes SHALL
  win that lot. The lot gets its own auction order, invoice and payment
  deadline, as for any winner.
- A lot the account won before the suspension SHALL stay won, and its invoice
  SHALL stay payable.
- Suspension SHALL NOT add, edit or remove any entry in any lot's bid history,
  and SHALL NOT change any lot's current price or leader.

#### Scenario: suspension-SC-16 - A lot already won stays won

- **GIVEN** a suspended account that won a lot before the suspension
- **WHEN** the suspension takes effect
- **THEN** that lot is still won by the account
- **AND** its invoice is still payable

#### Scenario: suspension-SC-12 - A suspended account cannot bid or raise its maximum

- **GIVEN** a suspended account holding a maximum of 50000 HKD minor units on
  an open lot
- **WHEN** the collector tries to raise that maximum, and to place a bid on a
  second open lot
- **THEN** Grade10 refuses both
- **AND** the maximum on the first lot is still 50000 HKD minor units

#### Scenario: suspension-SC-13 - Suspension leaves open lots and their history unchanged

- **GIVEN** an open lot led by an account at a current price of 30000 HKD
  minor units, with a second bidder holding a lower maximum
- **WHEN** the leading account is suspended
- **THEN** the account still leads the lot at 30000 HKD minor units
- **AND** the lot's bid history has the same entries as before the suspension

#### Scenario: suspension-SC-14 - A standing maximum keeps bidding after suspension

- **GIVEN** a suspended account holding a maximum of 50000 HKD minor units on
  an open lot it leads at 30000 HKD minor units
- **WHEN** another bidder commits a maximum of 40000 HKD minor units
- **THEN** auto-bidding resolves the lot with the suspended account's maximum
  as for any bidder
- **AND** the suspended account still leads, at the price auto-bidding
  resolves

#### Scenario: suspension-SC-15 - A suspended account wins through a standing maximum

- **GIVEN** a suspended account holding the highest maximum on an open lot
- **WHEN** the lot closes
- **THEN** the account wins the lot
- **AND** Grade10 creates its auction order with its own invoice and payment
  deadline
