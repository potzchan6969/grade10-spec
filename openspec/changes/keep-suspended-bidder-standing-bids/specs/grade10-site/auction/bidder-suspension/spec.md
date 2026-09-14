## Feature set

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
