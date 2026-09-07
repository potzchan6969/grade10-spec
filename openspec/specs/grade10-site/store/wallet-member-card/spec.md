# grade10-site/store/wallet-member-card Specification

## Purpose

A phone-wallet rendering of the loyalty member card `grade10-site/store/membership`
carries on the site: Google Wallet and Apple Wallet each hold a pass that
identifies the member at the counter, stays current one sweep behind the
programme, and is discharged rather than deleted when a member ends it or
asks to be erased.

## Feature set

- One rendering, not a second source
  - The row holds a rendering secret, whether the pass stands, and the
    sweep's bookkeeping — balance and tier are read from the programme at
    each refresh
- Independent wallets
  - At most one live pass per member per wallet; ending or erasing one
    leaves the other untouched
- Three states
  - `live`, `ended`, `erased` — only `live` identifies anybody
- One sweep behind
  - A lap claims due passes, refreshes what changed, and only then pays
    what the vendor is owed
- Debt on ending
  - Ending a pass leaves a vendor-side copy owed a call; the sweep
    discharges it
- Erasure
  - A scrub plus the same debt: the row stays armed and empty
- Shared tables, one writer
  - The store's schema holds them; only the wallet service writes them
- Configuration
  - A half-configured wallet names the missing secret rather than issuing a
    pass nobody can read

## Requirements

### Requirement: A pass is a rendering of the member card, never a second source of it

A wallet pass row SHALL hold only what a rendering needs: the secret its
codes are made from, whether it still stands, and the sweep's own
bookkeeping. Balance and tier SHALL be read from the loyalty programme at
each refresh, never stored as the pass's own truth beyond what it last
rendered.

#### Scenario: grade10-site-store-wallet-member-card-SC-01 - A pass renders the programme's current standing

- **GIVEN** a member whose tier changed since their pass last refreshed
- **WHEN** the pass next refreshes
- **THEN** it renders the current tier, read from the programme

### Requirement: A member holds at most one live pass per wallet, and the wallets are independent

`wallet_passes` SHALL be unique on the live member-and-platform pair. Ending
passes SHALL require the platform named explicitly, and `"all"` SHALL be
spelled out rather than defaulted, so ending one platform's pass never ends
the other's by accident.

#### Scenario: grade10-site-store-wallet-member-card-SC-02 - A second pass on the same wallet is refused while one is live

- **GIVEN** a member holding a live Google Wallet pass
- **WHEN** they try to add a second Google Wallet pass
- **THEN** the pass they held is ended first and exactly one live pass for that wallet remains
- **AND** the partial unique index `uq_wallet_passes_live_member` is the backstop that refuses a second live row on any path that forgets

#### Scenario: grade10-site-store-wallet-member-card-SC-03 - Ending one wallet's pass leaves the other's untouched

- **GIVEN** a member holding a live pass on both wallets
- **WHEN** they end the Google Wallet pass alone
- **THEN** the Apple Wallet pass stays live

### Requirement: A pass has three states and only `live` identifies anybody

A pass SHALL hold exactly one of `live`, `ended`, `erased`, held by a CHECK
constraint, with `ended_at` present if and only if the pass is not live.

#### Scenario: grade10-site-store-wallet-member-card-SC-04 - A non-live pass carries its ended timestamp

- **GIVEN** a pass moved to `ended` or `erased`
- **WHEN** its row is read
- **THEN** `ended_at` is present, and it is null only while the pass is `live`

### Requirement: The pass follows the member's standing, one sweep behind

Points and tier SHALL move with no row written to the pass anywhere; a sweep
SHALL be the only mechanism that catches a pass up. Three arms SHALL mark a
row due: its own next-change instant, a daily floor, and a kick from the
programme's ledger and tier logs read once a lap. A lap SHALL claim at most
a fixed limit of due passes, ordered by due instant, and SHALL back a
failure off on its own curve.

#### Scenario: grade10-site-store-wallet-member-card-SC-05 - A member whose balance moved is current by the end of the next lap

- **GIVEN** a member whose balance changed and whose pass is due
- **WHEN** the next sweep lap runs
- **THEN** the pass renders the new balance

#### Scenario: grade10-site-store-wallet-member-card-SC-06 - A dormant member's pass is read once a day and sends nothing

- **GIVEN** a member with no activity and a pass with nothing due sooner
- **WHEN** a day passes
- **THEN** the pass is read once by the daily floor and no push is sent if nothing changed

### Requirement: The lap order is the contract

Each sweep lap SHALL run the kick first and before any per-wallet laps; then,
per wallet, the refresh arm; and only then what the vendor is owed for a
non-live pass. The two arms SHALL never share one lap's budget.

#### Scenario: grade10-site-store-wallet-member-card-SC-07 - A live member's refresh is not starved by the vendor-debt arm

- **GIVEN** a lap with both refreshes and vendor debt due
- **WHEN** the lap runs
- **THEN** the refresh arm is not blocked behind the vendor-debt arm's own budget

### Requirement: Ending a pass leaves a debt, and the sweep discharges it

A pass that stops being live SHALL still leave a copy at the vendor holding
the member's name; `next_attempt_at` on a non-live row SHALL record that the
copy is owed a call. There SHALL be no separate dueness column and no
mark-due script. The sweep's expiry arm SHALL drain this debt.

#### Scenario: grade10-site-store-wallet-member-card-SC-08 - An ended pass's vendor copy is discharged by the sweep

- **GIVEN** a pass just moved to `ended`
- **WHEN** the sweep's expiry arm next runs
- **THEN** the vendor-side copy is called to remove the member's identifying facts

### Requirement: Erasure is that debt plus a scrub

Erasing a member's passes SHALL keep the row and keep it armed for the
vendor debt, SHALL clear every member fact from it (name, tier, points, the
rendered digest), and SHALL empty the secret, so an erased pass makes no
further code even where the sealing key later leaked. A device that fetches
an erased pass afterward SHALL be answered with a pass that says nothing
about anybody.

#### Scenario: grade10-site-store-wallet-member-card-SC-09 - An erased pass's secret is emptied

- **GIVEN** a member who asks to be erased
- **WHEN** their passes are erased
- **THEN** the secret column on each is empty and no further code can be made from it

#### Scenario: grade10-site-store-wallet-member-card-SC-10 - A device fetching an erased pass sees nobody

- **GIVEN** an erased pass whose device still pulls updates
- **WHEN** the device fetches it
- **THEN** the answer names no member, tier or balance

### Requirement: The tables are the store's, and each names one writer

`wallet_passes`, `wallet_change_cursor`, and the three Apple pull tables
`@grade10/wallet-pass/schema` instantiates (`wallet_pass_devices`,
`wallet_pass_registrations`, `wallet_pass_push_tokens`) SHALL be owned by the
store, created by both brands' migrations even where only a brand with an
issuer fills one, and each SHALL be pinned to exactly one writer: the pass
table and the push credential to the store's wallet service, the two Apple
pull tables to `@grade10/wallet-pass`'s Apple adapter, and the cursor to the
store's sweeps.

#### Scenario: grade10-site-store-wallet-member-card-SC-11 - A write-surface check pins every wallet table's writer

- **WHEN** the write-surfaces check runs
- **THEN** every wallet table names exactly one writer

### Requirement: A half-configured wallet says which secret is missing

Issuing a pass on a wallet whose credentials are not fully configured SHALL
refuse loudly, naming the missing secret, rather than issuing a pass nobody
can read.

#### Scenario: grade10-site-store-wallet-member-card-SC-12 - A missing credential names itself

- **GIVEN** a deployment missing one wallet credential
- **WHEN** a member tries to add that wallet's pass
- **THEN** the refusal names the missing credential
