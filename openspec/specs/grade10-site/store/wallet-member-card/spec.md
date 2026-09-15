# grade10-site/store/wallet-member-card Specification

## Purpose

A phone-wallet rendering of the loyalty member card `grade10-site/store/membership`
carries on the site: Google Wallet and Apple Wallet each hold a pass that
identifies the member at the counter, stays current one sweep behind the
programme, and is discharged rather than deleted when a member ends it or
asks to be erased.

## Feature set

- The wallet pass
  - Added from the membership surface: carries name, tier, balance and a code
  - Google's code: made on the device, current with no signal, used once
  - Apple's code: made by the programme, durable, and identifies only —
    it spends nothing and collects nothing
  - Ending one: immediate, by the member
  - In the phone's language: the surface's own words, in every language it
    speaks
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
- Shared tables, one writer each
  - The store's schema holds them; each names exactly one owner, plus the
    writers the registry exempts by name with a reason
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
**Serves:** grade10-site-store-wallet-member-card-US-01 - Member adds their card to a phone wallet

- **GIVEN** a member whose tier changed since their pass last refreshed
- **WHEN** the pass next refreshes
- **THEN** it renders the current tier, read from the programme

### Requirement: A member holds at most one live pass per wallet, and the wallets are independent

`wallet_passes` SHALL be unique on the live member-and-platform pair. Ending
passes SHALL require the platform named explicitly, and `"all"` SHALL be
spelled out rather than defaulted, so ending one platform's pass never ends
the other's by accident. Adding a pass in one wallet SHALL leave what the
member holds in the other untouched, and the membership surface SHALL say
which passes they are carrying.

#### Scenario: grade10-site-store-wallet-member-card-SC-02 - A second pass on the same wallet is refused while one is live
**Serves:** grade10-site-store-wallet-member-card-US-01 - Member adds their card to a phone wallet

- **GIVEN** a member holding a live Google Wallet pass
- **WHEN** they try to add a second Google Wallet pass
- **THEN** the pass they held is ended first and exactly one live pass for that wallet remains
- **AND** the partial unique index `uq_wallet_passes_live_member` is the backstop that refuses a second live row on any path that forgets

#### Scenario: grade10-site-store-wallet-member-card-SC-03 - Ending one wallet's pass leaves the other's untouched
**Serves:** Independent wallets - ending one wallet's pass leaves the other's untouched

- **GIVEN** a member holding a live pass on both wallets
- **WHEN** they end the Google Wallet pass alone
- **THEN** the Apple Wallet pass stays live

#### Scenario: grade10-site-store-wallet-member-card-SC-21 - Adding one wallet's pass leaves the other alive
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member carrying a pass in one wallet
- **WHEN** they add a pass in the other
- **THEN** both identify them

### Requirement: A pass has three states and only `live` identifies anybody

A pass SHALL hold exactly one of `live`, `ended`, `erased`, held by a CHECK
constraint, with `ended_at` present if and only if the pass is not live.

#### Scenario: grade10-site-store-wallet-member-card-SC-04 - A non-live pass carries its ended timestamp
**Serves:** grade10-site-store-wallet-member-card-US-03 - Member ends one pass and keeps the other

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

By the end of the first sweep beginning after a member's standing moves, the
wallet SHALL hold what they then are — whether the change was recorded, as a
spend, a redemption or an operator's correction is, or happened on its own,
as points reaching their expiry, a tier term running out and an invitation
lapsing do. A change nobody records SHALL name the instant it happens at, and
the pass SHALL be due at that instant rather than on the daily floor.

Only a difference SHALL cost an update: a pass re-read and found unchanged
SHALL cost nothing, so several changes between two reads cost one update
carrying what stands after the last of them. The pass SHALL say when what it
shows was current, and a sweep with more due than it reads SHALL report how
far behind its oldest due pass is.

#### Scenario: grade10-site-store-wallet-member-card-SC-05 - A member whose balance moved is current by the end of the next lap
**Serves:** grade10-site-store-wallet-member-card-US-02 - Member scans at the counter after their balance moved

- **GIVEN** a member whose balance changed and whose pass is due
- **WHEN** the next sweep lap runs
- **THEN** the pass renders the new balance

#### Scenario: grade10-site-store-wallet-member-card-SC-06 - A dormant member's pass is read once a day and sends nothing
**Serves:** grade10-site-store-wallet-member-card-US-05 - Operator reads what the sweep costs

- **GIVEN** a member with no activity and a pass with nothing due sooner
- **WHEN** a day passes
- **THEN** the pass is read once by the daily floor and no push is sent if nothing changed

#### Scenario: grade10-site-store-wallet-member-card-SC-25 - A recorded change reaches the wallet on the next sweep
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** staff spend a member's points
- **THEN** the first sweep beginning after that spend sends the wallet the
  points left after it
- **AND** it does so whether or not the spend itself marked the pass due

#### Scenario: grade10-site-store-wallet-member-card-SC-26 - A change nobody recorded is due at the instant it happens
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member's points reach their expiry, their earned tier term runs
  out, or an invitation holding their tier lapses, with nothing written
- **THEN** the pass is due at that instant rather than on the daily floor
- **AND** the first sweep after it sends the wallet the tier and points the
  member's own surfaces then read

#### Scenario: grade10-site-store-wallet-member-card-SC-27 - A sweep that has fallen behind says so
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** more passes due than one sweep reads
- **WHEN** the sweep runs
- **THEN** it reports the age of its oldest due pass

#### Scenario: grade10-site-store-wallet-member-card-SC-28 - A burst costs one update

- **WHEN** a member's points change several times inside one interval
- **THEN** the pass is updated once
- **AND** it carries what stands after the last of those changes

#### Scenario: grade10-site-store-wallet-member-card-SC-29 - A pass says how current it is
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member opens their pass
- **THEN** it says when what it shows was current

### Requirement: The lap order is the contract

Each sweep lap SHALL run the kick first and before any per-wallet laps; then,
per wallet, the refresh arm; and only then what the vendor is owed for a
non-live pass. The two arms SHALL never share one lap's budget.

#### Scenario: grade10-site-store-wallet-member-card-SC-07 - A live member's refresh is not starved by the vendor-debt arm
**Serves:** grade10-site-store-wallet-member-card-US-02 - Member scans at the counter after their balance moved

- **GIVEN** a lap with both refreshes and vendor debt due
- **WHEN** the lap runs
- **THEN** the refresh arm is not blocked behind the vendor-debt arm's own budget

### Requirement: Ending a pass leaves a debt, and the sweep discharges it

A pass that stops being live SHALL still leave a copy at the vendor holding
the member's name; `next_attempt_at` on a non-live row SHALL record that the
copy is owed a call. There SHALL be no separate dueness column and no
mark-due script. The sweep's expiry arm SHALL drain this debt.

#### Scenario: grade10-site-store-wallet-member-card-SC-08 - An ended pass's vendor copy is discharged by the sweep
**Serves:** grade10-site-store-wallet-member-card-US-03 - Member ends one pass and keeps the other

- **GIVEN** a pass just moved to `ended`
- **WHEN** the sweep's expiry arm next runs
- **THEN** the vendor-side copy is called to remove the member's identifying facts

### Requirement: Erasure is that debt plus a scrub

Erasing a member's passes SHALL keep the row and keep it armed for the
vendor debt, SHALL clear every member fact from it (name, tier, points, the
rendered digest), and SHALL empty the secret, so an erased pass makes no
further code even where the sealing key later leaked. A device that fetches
an erased pass afterward SHALL be answered with a pass that says nothing
about anybody. A pass already on a member's phone SHALL identify nobody from
the moment the erasure begins, whatever the phone still shows.

What discharges the erasure SHALL follow the wallet. A wallet that keeps its
own copy SHALL be retried until it confirms, and SHALL be reported as still
owed until it does. A wallet that keeps none SHALL be discharged by the pass
identifying nobody and the devices it was sent to being forgotten, with no
acknowledgement to wait for.

#### Scenario: grade10-site-store-wallet-member-card-SC-09 - An erased pass's secret is emptied
**Serves:** grade10-site-store-wallet-member-card-US-04 - Member asks to be erased

- **GIVEN** a member who asks to be erased
- **WHEN** their passes are erased
- **THEN** the secret column on each is empty and no further code can be made from it

#### Scenario: grade10-site-store-wallet-member-card-SC-10 - A device fetching an erased pass sees nobody
**Serves:** grade10-site-store-wallet-member-card-US-04 - Member asks to be erased

- **GIVEN** an erased pass whose device still pulls updates
- **WHEN** the device fetches it
- **THEN** the answer names no member, tier or balance

#### Scenario: grade10-site-store-wallet-member-card-SC-30 - An erased member's pass identifies nobody
**Serves:** Erasure - an erased member's pass identifies nobody

- **WHEN** a member is erased and a code from their pass is presented
- **THEN** it identifies nobody

#### Scenario: grade10-site-store-wallet-member-card-SC-31 - An erasure the wallet has not confirmed is still owed
**Serves:** Erasure - an erasure the wallet has not confirmed is still owed

- **GIVEN** a wallet that keeps its own copy of the pass
- **WHEN** it cannot be reached while a member is being erased
- **THEN** the erasure is retried until the wallet confirms it
- **AND** it is reported as still owed until then

#### Scenario: grade10-site-store-wallet-member-card-SC-32 - An erasure with no wallet to confirm it is still discharged
**Serves:** Erasure - an erasure with no wallet to confirm it is still discharged

- **GIVEN** a wallet that keeps no copy, holding only what a member's own
  device was sent
- **WHEN** a member is erased
- **THEN** the pass identifies nobody and the devices it was sent to are forgotten
- **AND** nothing is reported as owed, because there is nothing left to ask

### Requirement: The tables are the store's, and each names one writer

`wallet_passes`, `wallet_change_cursor`, and the three Apple pull tables
`@grade10/wallet-pass/schema` instantiates (`wallet_pass_devices`,
`wallet_pass_registrations`, `wallet_pass_push_tokens`) SHALL be owned by the
store, created by both brands' migrations even where only a brand with an
issuer fills one, and each SHALL be pinned to exactly one owner: the pass
table and the push credential to the store's wallet service (a directory,
`src/services/wallet`), the two Apple pull tables to `@grade10/wallet-pass`'s
Apple adapter, and the cursor to the store's sweeps — plus the writers the
registry exempts by name, each with a reason.

#### Scenario: grade10-site-store-wallet-member-card-SC-11 - A write-surface check pins every wallet table's writer
**Serves:** grade10-site-store-wallet-member-card-US-05 - Operator reads what the sweep costs

- **WHEN** the write-surfaces check runs
- **THEN** every wallet table names exactly one writer

### Requirement: A half-configured wallet says which secret is missing

Issuing a pass on a wallet whose credentials are not fully configured SHALL
refuse loudly, naming the missing secret, rather than issuing a pass nobody
can read.

#### Scenario: grade10-site-store-wallet-member-card-SC-12 - A missing credential names itself
**Serves:** grade10-site-store-wallet-member-card-US-01 - Member adds their card to a phone wallet

- **GIVEN** a deployment missing one wallet credential
- **WHEN** a member tries to add that wallet's pass
- **THEN** the refusal names the missing credential

### Requirement: A member carries their card in Google Wallet

The membership surface SHALL offer to add the member card to Google Wallet.
The pass SHALL carry the member's display name, the tier they hold, the
points they can spend, and a scannable code. A deployment with no Google
issuer configured SHALL NOT offer the pass.

The pass's code SHALL be made on the member's own device, so a pass identifies
with no network of its own, and SHALL change on a fixed period. A code SHALL be
accepted only inside its own period and one period either side of it, and SHALL
identify at most once — a second presentation of the same code SHALL be refused
whoever presents it.

Identifying from a pass SHALL open the same session on the same terms as the
card on the site, and removing a pass SHALL change nothing about the
membership.

#### Scenario: grade10-site-store-wallet-member-card-SC-13 - A member adds their card to their wallet
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member opens their card on the membership surface
- **THEN** they are offered the pass, and adding it carries their name, tier,
  points to spend and a scannable code

#### Scenario: grade10-site-store-wallet-member-card-SC-14 - A pass identifies as the card does
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** staff scan a member's pass
- **THEN** a session opens for that member on the same terms a scanned card opens

#### Scenario: grade10-site-store-wallet-member-card-SC-15 - A photographed code is worth nothing
**Serves:** grade10-site-store-wallet-member-card-US-07 - Member ends a pass they no longer want

- **WHEN** a code copied from a member's pass is presented after its period
- **THEN** it identifies nobody
- **AND** a code presented twice inside its own period is refused the second time

#### Scenario: grade10-site-store-wallet-member-card-SC-16 - A pass identifies with no signal
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member with no network on their phone presents their pass
- **THEN** the code it shows is current and opens a session

#### Scenario: grade10-site-store-wallet-member-card-SC-17 - Removing a pass leaves the membership intact
**Serves:** grade10-site-store-wallet-member-card-US-07 - Member ends a pass they no longer want

- **WHEN** a member deletes the pass from their wallet
- **THEN** their membership, balance, tier and member card are unchanged

### Requirement: A member carries their card in Apple Wallet

The membership surface SHALL offer to add the member card to Apple Wallet. The
pass SHALL carry the member's display name, the tier they hold, the points
they can spend, and a scannable code. A deployment with no Apple pass type
identifier and certificate configured SHALL NOT offer the pass.

The pass's code SHALL be made by the programme and carried on the pass, so a
pass identifies with no network of its own and needs nothing of the phone at
the counter. The code SHALL be durable: it does not change, a second
presentation is not refused, and a member's tenth visit scans as their first.

Because the code is durable, it SHALL identify and nothing more. A session
opened from an Apple pass SHALL read the member's panel and SHALL NOT spend
points or collect a reward, whoever presents it. A member who wants either
SHALL be served by the card on the site, as they are today.

Removing a pass SHALL change nothing about the membership.

#### Scenario: grade10-site-store-wallet-member-card-SC-18 - A member adds their card to Apple Wallet
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member opens their card on the membership surface
- **THEN** they are offered the pass, and adding it carries their name, tier,
  points to spend and a scannable code

#### Scenario: grade10-site-store-wallet-member-card-SC-19 - An Apple pass identifies every time
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member whose phone has no network
- **WHEN** they present the same pass on two visits
- **THEN** a session opens both times

#### Scenario: grade10-site-store-wallet-member-card-SC-20 - An Apple pass cannot move value
**Serves:** grade10-site-store-wallet-member-card-US-08 - Member spends points when the pass they carry cannot

- **WHEN** a session is opened from an Apple pass
- **THEN** the member's panel is read
- **AND** spending points and collecting a reward are refused, not hidden

### Requirement: A pass speaks the languages the membership surface does

The words a pass carries beside the member's facts SHALL be the membership
surface's own, offered in every language the surface speaks. A phone set to one
of those languages SHALL be shown it; a phone set to any other SHALL read the
surface's default.

#### Scenario: grade10-site-store-wallet-member-card-SC-22 - A pass speaks the phone's language
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member whose phone is set to a language the membership surface
  speaks
- **WHEN** they add a pass
- **THEN** the words beside their name, tier and points are in that language
- **AND** a phone set to a language the surface does not speak reads them in
  the surface's default

### Requirement: A pass identification is recorded as its own kind

The programme SHALL record that a member was identified from a wallet pass,
apart from every other way a member reaches the counter, so how members arrive
is countable rather than inferred, and SHALL record which wallet it came from.

A pass whose code the member's own device made SHALL carry the same rights as
the card on the site, and SHALL be one of the ways that prove the member's own
device was present. A pass whose code the programme made SHALL prove only that
the pass reached a device once, and SHALL be neither.

#### Scenario: grade10-site-store-wallet-member-card-SC-23 - Arriving by pass is countable

- **WHEN** members are identified, some from a pass and some from the site's card
- **THEN** the two are counted apart
- **AND** a pass identification says which wallet it came from

### Requirement: A member ends a pass, and ending it ends what it can do

A member SHALL be able to end a pass in one action. Ending SHALL take effect
at once: every code the ended pass can make identifies nobody, whether or not
the pass is still on the member's phone. A member SHALL be able to add a new
pass afterwards.

#### Scenario: grade10-site-store-wallet-member-card-SC-24 - An ended pass identifies nobody
**Serves:** grade10-site-store-wallet-member-card-US-07 - Member ends a pass they no longer want

- **WHEN** a member ends their pass and a code it makes is then presented
- **THEN** it identifies nobody
- **AND** the member can add a new pass that does

### Requirement: The wallet pass's exports

The shared UI package SHALL export, from its public entry, exactly these
components for adding a pass — `WalletPassLinks` — with its props, copy, wallet
and state types. It SHALL receive every word it shows and every address it
points at from its consumer, and SHALL hold no wallet, no member and no product
state of its own. Each wallet SHALL carry its own whole labels rather than words
the component joins to a wallet's name, so a language that orders its verb
differently is not assembled out of order. Each SHALL be named to the component
by an identifier the consumer owns and the component never shows, so an action
is answered by identity rather than by a display name a translation moves.

A wallet the member holds SHALL NOT hide what is offered in another, and an
address already answered SHALL stand until the member has used it — a pass
recorded is not a pass installed.

An offer SHALL carry its label and its address together, so an address with no
words to name it cannot be expressed. Whether an act is in flight, and whether
one did not complete, SHALL both be stated per wallet: one status for the whole
component cannot say that a member is adding in one wallet while ending in
another, and a failure it cannot attribute is one an unrelated success erases.
A standing the component could not read SHALL be said out loud rather than
drawn as an empty offer, which a member reads as carrying nothing.

The consuming application is the Grade10 site.

#### Scenario: grade10-site-store-wallet-member-card-SC-33 - The save action is offered beside the card
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member opens their card on the membership surface
- **THEN** the action that adds the pass is offered beside it
- **AND** every word it shows came from the application

#### Scenario: grade10-site-store-wallet-member-card-SC-34 - A failure names the wallet it belongs to

- **GIVEN** a member carrying a pass in each of two wallets
- **WHEN** ending one fails and an act on the other then succeeds
- **THEN** the failure is still shown, and it names the wallet it belongs to

#### Scenario: grade10-site-store-wallet-member-card-SC-35 - A standing that could not be read says so

- **GIVEN** a member who carries a pass
- **WHEN** the surface cannot read what they hold
- **THEN** it says so, and the control that ends the pass is not taken away

#### Scenario: grade10-site-store-wallet-member-card-SC-36 - A deployment offers only the wallets it carries

- **WHEN** a member opens their card on a deployment configured for one wallet
  and not the other
- **THEN** only the configured wallet is offered
- **AND** nothing is asked of either wallet to find that out

#### Scenario: grade10-site-store-wallet-member-card-SC-37 - A member who returns still finds the passes they hold
**Serves:** grade10-site-store-wallet-member-card-US-07 - Member ends a pass they no longer want

- **GIVEN** a member added a pass on an earlier visit
- **WHEN** they open their card again
- **THEN** the surface says which wallets they are carrying a pass in
- **AND** the action that ends each is offered

