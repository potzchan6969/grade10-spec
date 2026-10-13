# grade10-site/auction/auto-bidding Specification

## Purpose
Lets a collector bid without staying on the page: they commit the most they
will pay, and Grade10 bids for them only as far as needed to lead. The
current bid is the second-highest maximum plus the listing increment.

## Feature set

- Commit a maximum
  - First maximum opens bidding: an accepted cap takes the lead at the opening
    price - the starting price, or the currency's lowest increment on a 0 start -
    while the cap itself stays hidden
  - Raise only: a leader may raise their maximum; lowering or withdrawing it is
    refused
  - Validity: a maximum below the listing's minimum next bid is refused
  - No card hold: committing or raising a maximum takes nothing from the card,
    and a raise is accepted or refused on the auction's rules alone
- Own standing
  - Own row: a bidder sees their maximum, the current bid, and whether they lead
    as three distinct facts
  - Maximum stays private: another bidder cannot read or derive the leader's
    cap from public listing facts
- Two-maximum price
  - Current bid from two maxima: the price is the lesser of the leader's
    maximum and the second-highest plus one increment
  - Earlier commitment wins a tie: an equal later maximum is accepted, creates
    the challenger's record followed by the earlier leader's automatic response
    at the same resolved amount, and does not displace the leader
  - One resolution per commitment: Grade10 does not step through intermediate
    increments
- Auto-bid as a bid
  - Counted and recorded: a bid Grade10 places counts in the bid count and
    history as placed on that bidder's behalf
  - Extended bidding: a maximum committed before the close counts toward entry,
    an auto bid during extended bidding restarts the timer as a manual bid
    would, and standing maxima do not keep bidding
- House maximum
  - Same rules: the house maximum takes part in the two-maximum rule, ties and extended bidding as any maximum does, under a listing pseudonym
  - Committed on a clock: the house maximum is committed at its set time, not by a bidder's action
  - The one lowerable maximum: a lower house maximum is accepted only when the leader and the current bid stay the same; a collector's stays raise only

## Requirements

### Requirement: A bidder commits a maximum

A bidder SHALL:

1. Open an open listing.
2. Enter a **maximum**: the most they authorize Grade10 to bid for them.
3. Confirm with the primary bid action. Grade10 accepts or refuses the
   maximum in the same answer, and takes nothing from the card. The panel
   discloses the mechanism in always-on copy.
4. See their own maximum, distinct from the current bid, and whether they
   lead.
5. Raise that maximum later, or leave it standing.

A maximum SHALL be valid only when it is at least the minimum next bid
the listing already requires. Grade10 SHALL apply every window,
card, and validity rule that `grade10-site/auction/auction` already governs a
bid with to the committing of a collector's maximum. The house maximum is
held to the rules "The house maximum bids as any maximum does" names.

Grade10 SHALL bid on a committed bidder's behalf only up to their
maximum. A bidder SHALL be able to raise their maximum on an open listing
at any time that listing accepts a bid. Grade10 SHALL refuse to lower or
withdraw a collector's committed maximum. The house maximum is the only
maximum that may be lowered, under "A committed house maximum is raised or
lowered", and it is never withdrawn.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-71q rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-01 - A first maximum opens the bidding
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open listing with a starting price of 20000 minor units and no bids
- **WHEN** a bidder commits a maximum of 50000 minor units
- **THEN** Grade10 accepts the commitment
- **AND** the current bid is 20000 minor units
- **AND** that bidder leads

<!-- trace:scenario id=g10.auction-auto-bidding.SC-ec3 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-02 - A maximum below the minimum next bid is refused
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open listing whose current bid is 22500 minor units and whose minimum increment is 2500 minor units
- **WHEN** a bidder commits a maximum of 24000 minor units
- **THEN** Grade10 refuses the commitment
- **AND** the current bid and the leader are unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-2eu rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-03 - A leader raises their own maximum
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units
- **WHEN** bidder A raises their maximum to 80000 minor units
- **THEN** Grade10 accepts the raise
- **AND** bidder A still leads
- **AND** the current bid is unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-6h6 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-04 - Lowering a maximum is refused
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** a bidder with a committed maximum of 50000 minor units on an open listing
- **WHEN** they commit a maximum of 30000 minor units on that listing
- **THEN** Grade10 refuses it
- **AND** their committed maximum remains 50000 minor units

### Requirement: Maximum fields

Each accepted commitment SHALL carry these fields. Grade10 SHALL show a
bidder their own row, distinct from the listing's current bid. Grade10
SHALL NOT disclose a leading bidder's maximum to another bidder, to an
unauthenticated reader, or in any public listing fact. The current bid
is the second-highest maximum plus one increment, so that second-highest
amount is implied by the price. A leading maximum is revealed only once
it has been beaten: the new current bid is that maximum plus one
increment, unless the increment would pass the new leader's maximum. An
operator SHALL see every committed maximum and its Accepted At, except the
house maximum: only an operator holding `auction:reserve` SHALL see it, and
every commitment, raise and lower of it with its Accepted At, and the
internal bidder it was committed as. Every operator reads the house's bids as
House, per `grade10-admin/auction/internal-bid`.

| Field | Meaning |
| --- | --- |
| Maximum | Integer minor units in the listing's currency, with that listing's ISO 4217 code |
| Accepted At | When Grade10 accepted this commitment |
| Standing | Leading or not leading, as a fact apart from the current bid |

| Standing | Meaning |
| --- | --- |
| Leading | This commitment is the highest, or it ties the highest and Grade10 accepted it first |
| Not leading | A higher commitment exists, or an equal earlier one does |

<!-- trace:scenario id=g10.auction-auto-bidding.SC-nqo rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-05 - A bidder reads their own commitment
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** bidder A has committed a maximum of 50000 minor units while the current bid is 25000 minor units
- **WHEN** bidder A opens the listing
- **THEN** they see their own maximum of 50000 minor units
- **AND** they see the current bid of 25000 minor units as a separate fact
- **AND** they see that they lead

<!-- trace:scenario id=g10.auction-auto-bidding.SC-dmo rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-06 - An overtaken bidder sees that they no longer lead
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** bidder A has been overtaken on a listing
- **WHEN** bidder A opens it
- **THEN** they see that they do not lead
- **AND** they see their own committed maximum unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-x57 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-07 - A leader's maximum is not public
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** bidder A leads with a committed maximum of 50000 minor units while the current bid is 25000
- **WHEN** any other bidder reads the listing's public facts
- **THEN** those facts carry the current bid of 25000 minor units
- **AND** they do not carry, and do not allow deriving, A's maximum of 50000

<!-- trace:scenario id=g10.auction-auto-bidding.SC-aqd rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-08 - An operator can answer a dispute
**Serves:** grade10-site-auction-auto-bidding-US-04 - Operator traces every committed maximum

- **GIVEN** a listing with several committed maximums
- **WHEN** an authorized operator reads its bid history
- **THEN** each commitment shows its bidder, its maximum, and its Accepted At

<!-- trace:scenario id=g10.auction-auto-bidding.SC-j3t rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-45 - A secret-floor operator traces every house commitment
**Serves:** grade10-site-auction-auto-bidding-US-04 - Operator traces every committed maximum

- **GIVEN** an `HKD` listing starting at 20000 HKD minor units, where the
  house maximum of 25000 was committed at 18:00:00 UTC and raised to 30000
  at 18:10:00 UTC while it led, collector A committed 40000 at 18:20:00 UTC
  and collector C 60000 at 18:30:00 UTC, and the house maximum was lowered to
  21000 at 19:00:00 UTC, all in HKD minor units
- **WHEN** an operator holding `auction:reserve` reads its bid history
- **THEN** it shows the house's maximum at 25000, 30000 and 21000 HKD minor
  units, with Accepted At 18:00:00, 18:10:00 and 19:00:00 UTC
- **AND** it shows A's and C's commitments, each with its maximum and
  Accepted At

### Requirement: Two-maximum rule

Only the highest and second-highest maxima decide the listing price. The
highest maximum leads; equal maxima retain the earlier accepted leader. With
one maximum, the current bid is the starting price; on a listing that starts
at 0 it SHALL be the increment `grade10-site/auction/bid-increments` selects
for 0, never 0. With two or more, the
current bid SHALL be the lesser of the leader's maximum and the second-highest
maximum plus the increment that `grade10-site/auction/bid-increments` selects
for that second-highest maximum.

The current bid SHALL never exceed the leader's maximum. Grade10 SHALL resolve
once per accepted maximum and SHALL NOT step through intermediate bids. When a
newly accepted maximum equals the existing leader's maximum, Grade10 SHALL
retain the earlier leader and SHALL record two ordered public bid records at
the resolved amount: the challenger's accepted action first and the earlier
leader's automatic response second.

For an open `USD` listing with a current bid of **400** minor units, an
applicable increment of **100** minor units, and A leading with a maximum of
**1000** minor units, B's submitted maximum resolves as follows:

| B's submitted maximum | Accepted | Resolved current bid | Resolved status | Public bid records |
| ---: | --- | ---: | --- | --- |
| 450 | No | 400 | A leads | None; B's maximum is refused |
| 500 | Yes | 600 | A leads | B at 500, then A's automatic response at 600 |
| 700 | Yes | 800 | A leads | B at 700, then A's automatic response at 800 |
| 950 | Yes | 1000 | A leads | B at 950, then A's automatic response at 1000 |
| 1000 | Yes | 1000 | A leads | B at 1000, then A's automatic response at 1000 |
| 1001 | Yes | 1001 | B leads | B at 1001 |
| 1100 | Yes | 1100 | B leads | B at 1100 |
| 1120 | Yes | 1100 | B leads | B at 1100 |

Grade10 SHALL retain an accepted challenger's maximum in that bidder's private
history even when the challenger does not lead. The two records in the equal-
maximum row SHALL share the resolution's timestamp group and SHALL NOT represent
intermediate increments.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-arz rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-09 - A challenger below the leader's maximum raises the price only
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 50000 minor units
- **WHEN** B commits a maximum of 22500 minor units
- **THEN** A still leads
- **AND** the current bid is 23500 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-5mw rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-11 - A challenger above the leader's maximum takes the lead
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 900000 minor units
- **THEN** B leads
- **AND** the current bid is 820000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-hvc rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-15 - The step to lead cannot exceed the new leader's maximum
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing where A leads with a maximum of 800000 minor units
- **WHEN** B commits a maximum of 810000 minor units
- **THEN** B leads
- **AND** the current bid is 810000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-wgx rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-16 - A challenge lands at the two-maximum price, not a ladder
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing with a starting price of 20000 minor units and A's maximum of 50000 minor units
- **WHEN** B commits a maximum of 80000 minor units
- **THEN** B leads at 51000 minor units
- **AND** Grade10 has not accepted intermediate bids between 20000 and 51000

<!-- trace:scenario id=g10.auction-auto-bidding.SC-edj rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-10 - A challenger raises again, still below
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** A leads an HKD listing at a current bid of 23500 minor units
- **WHEN** B raises their maximum from 22500 to 30000 minor units
- **THEN** A still leads at 31000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-bqs rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-12 - The first bidder is overtaken by a higher maximum
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** an HKD listing with starting price 20000 minor units and A's maximum of 22500 minor units
- **WHEN** B commits a maximum of 50000 minor units
- **THEN** B leads at 23500 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-xwb rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-13 - The overtaken bidder raises but stays below
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 30000 minor units
- **THEN** B still leads at 31000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-n5u rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-14 - The overtaken bidder raises past the leader
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads an HKD listing with a maximum of 50000 minor units
- **WHEN** A raises their maximum to 60000 minor units
- **THEN** A leads at 51000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-52s rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-17 - A tie goes to the earlier commitment
**Serves:** grade10-site-auction-auto-bidding-US-03 - Collector competes through two maxima

- **GIVEN** B leads with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** B remains the leader and the current bid is 60000 minor units
- **AND** the public history records C's accepted action at 60000 minor units
- **AND** the public history then records B's automatic response at 60000 minor units
- **AND** both records belong to the same resolution timestamp group

<!-- trace:scenario id=g10.auction-auto-bidding.SC-eiw rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-18 - A tie is not a refusal
**Serves:** grade10-site-auction-auto-bidding-US-02 - Collector reads their own maximum and standing

- **GIVEN** B leads an HKD listing with a maximum of 60000 minor units
- **WHEN** C commits the same maximum
- **THEN** Grade10 accepts C's commitment and reports that C does not lead
- **AND** the public history records C's accepted action followed by B's automatic response
- **AND** both records show the resolved amount of 60000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-arw rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-30 - A lone maximum on a 0 start stands at the lowest increment
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector opens bidding on a lot that starts at nothing

- **GIVEN** an open `HKD` listing with a starting price of 0 and no bids
- **WHEN** a collector commits a maximum of 50000 minor units
- **THEN** Grade10 accepts the commitment and that collector leads
- **AND** the current bid is 1000 minor units, not 0
- **AND** the public history records one bid, that collector's, at 1000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-qbr rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-30a - A second maximum on a 0 start clears one increment above the opening price
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector commits a maximum on an open listing

- **GIVEN** an open `HKD` listing with a starting price of 0, where A's
  maximum of 50000 minor units stands alone at 1000 minor units
- **WHEN** B commits a maximum of 1000 minor units
- **THEN** Grade10 refuses it and names 2000 minor units as the minimum
- **AND** A still leads at 1000 minor units

<!-- trace:scenario id=g10.auction-auto-bidding.SC-9mj rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-31 - A lone bidder on a 0 start never wins at 0
**Serves:** grade10-site-auction-auto-bidding-US-01 - Collector opens bidding on a lot that starts at nothing

- **GIVEN** a `USD` listing with a starting price of 0 and one committed maximum of 100 minor units
- **WHEN** the listing closes with no other commitment
- **THEN** that collector wins at 100 minor units

### Requirement: A bid Grade10 places counts as a bid

Each accepted commitment SHALL cause one resolution. A resolution computes the
two-maximum result and records the accepted action and any automatic response
required by that result. A result that leaves the current bid unchanged still
records both ordered actions in the equal-maximum case. Grade10 SHALL NOT then
place further bids until another commitment is accepted. It SHALL NOT step
through intermediate increments. Standing maxima SHALL NOT generate bids on a
timer or a schedule. The one exception is the house maximum: Grade10 commits
it once, at its set time, under "The house maximum is committed at its set
time", and that commitment causes one resolution like any other. After it,
the house maximum bids only when another commitment is accepted.

Worked example. Starting price 20000, increment 2500.

1. You commit a maximum of 50000. Grade10 resolves once: you lead at
   20000. It does not then raise 22500, 25000, 27500 toward 50000.
2. They commit a maximum of 80000. Grade10 resolves once: they lead at
   52500 (your 50000 plus one increment). It does not then raise 55000,
   57500 toward 80000.
3. Neither commits again. The price stays 52500. Grade10 places no bid
   on a timer.
4. You raise your maximum to 90000. That is a new commitment. Grade10
   resolves once: you lead at 82500 (their 80000 plus one increment).
   Done until the next commitment.

A bid Grade10 places on a bidder's behalf SHALL be treated as an accepted
bid in every respect: it SHALL count toward the listing's bid count,
appear in bid history identified as placed on that bidder's behalf, count
toward whether the listing enters extended bidding at its scheduled close,
and move the listing's close under the same extended-bidding rule and cap
that `grade10-site/auction/auction` already governs a manual bid with.

Auto bidding SHALL remain active during extended bidding. A bid Grade10
places during extended bidding SHALL move the close exactly as a manual bid
placed at the same moment would. A bid Grade10 places before the scheduled
close SHALL NOT move the close, as a manual bid would not. Two standing
maxima SHALL NOT keep extending the close on their own.

Scenario `grade10-site-auction-auto-bidding-SC-22` keeps its title with its id.
The title is historical: its extension window is now extended bidding.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-kr7 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-22 - An auto bid in the extension window extends once
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** a listing in extended bidding, and a leader whose committed maximum has room left
- **WHEN** a challenger's commitment causes Grade10 to raise the leader's bid on their behalf
- **THEN** that bid moves the listing's close exactly as a manual bid at that moment would
- **AND** the listing does not close while that extension stands
- **AND** Grade10 places no further bid until another commitment is accepted

<!-- trace:scenario id=g10.auction-auto-bidding.SC-9i5 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-23 - An auto bid is counted and recorded
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** Grade10 raises a bidder's bid on their behalf
- **WHEN** a collector reads the listing's bid count and history
- **THEN** the bid count includes that bid
- **AND** the history shows it as placed on that bidder's behalf, not as a manual bid

<!-- trace:scenario id=g10.auction-auto-bidding.SC-44a rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-24 - Standing maxima do not keep bidding
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** two bidders have committed maxima and the listing has been resolved to the two-maximum price
- **WHEN** no further commitment is accepted
- **THEN** Grade10 places no further bid on either bidder's behalf
- **AND** the current bid is unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-nwr rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-25a - A maximum committed before the close counts toward extended bidding
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** an open listing whose only bidder committed a maximum before its
  scheduled close and leads at the starting price
- **WHEN** the scheduled close arrives
- **THEN** the listing enters extended bidding

### Requirement: Maximum commitments and automatic bids take nothing from the card

Committing or raising a maximum SHALL take nothing from the card: nothing is
held, authorized or charged, and acceptance SHALL NOT wait on the payment
provider. A raise SHALL be accepted or refused on the auction's rules alone. A
bid Grade10 places on a bidder's behalf SHALL need no card step. Only the
winner pays, under `grade10-site/auction/bid-payment-method`.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-0yu rev=2 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-25 - A maximum resolves with nothing held on the card
**Serves:** grade10-site-auction-auto-bidding-US-05 - Collector's auto-bid counts as a bid

- **GIVEN** a listing with an accepted maximum
- **WHEN** a challenger commits a higher maximum
- **THEN** Grade10 resolves the two maxima and records the resulting bids in
  the same answer
- **AND** nothing is held, authorized or charged on either bidder's card

<!-- trace:scenario id=g10.auction-auto-bidding.SC-zw7 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-32 - A raise is judged on the auction's rules alone
**Serves:** grade10-site-auction-auto-bidding-US-01 - a leader raises their maximum

- **GIVEN** bidder A leads an `HKD` listing with a committed maximum of 50000
  HKD minor units at a current bid of 25000 HKD minor units
- **WHEN** A raises their maximum to 80000 HKD minor units
- **THEN** Grade10 accepts the raise in the same answer, with nothing taken
  from the card
- **AND** when A then submits 80000 HKD minor units again, Grade10 refuses it
  and the bid form says: Your new maximum must be higher than your current
  one.

### Requirement: The house maximum bids as any maximum does

The **house maximum** is the amount of a listing's internal bid, set under
`grade10-admin/auction/internal-bid`. Once committed, Grade10 SHALL treat it
as one bidder's committed maximum in every rule of this capability: the
two-maximum rule, ties to the earlier commitment, one resolution per
commitment, bids placed on its behalf, the bid count, bid history, and
extended bidding.

- **Bidder** - on a listing, the house is the internal bidder that listing's
  internal bid names, per `grade10-admin/auction/internal-bid`: one bidder on
  that listing, never one of its collectors. An internal bidder SHALL bid only
  as a house maximum; Grade10 SHALL accept no bid for it from a site bid
  panel.
- **Pseudonym** - the house SHALL bid under a listing pseudonym given as a
  collector's is, on each listing apart. An internal bidder that bids on
  several listings SHALL read under each listing's own pseudonym, and no
  public fact SHALL link its bids on one listing to another. No listing fact, bid history row, letter or page a collector
  reads SHALL say or imply that a bid is the house's. Operator reads name it
  House instead, per `grade10-admin/auction/internal-bid`.
- **Checks** - Grade10 SHALL hold the house maximum to the ceiling and the
  minimum next bid as it holds a collector's. It SHALL NOT apply the card,
  bid-panel enrollment, verified-identity or suspension checks to it.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-99a rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-33 - The house takes the lead under a pseudonym
**Serves:** grade10-site-auction-auto-bidding-US-03 - a collector competes against the house without knowing it

- **GIVEN** an `HKD` listing where collector A, shown as Bidder 1, leads at
  20000 HKD minor units with a maximum of 30000
- **WHEN** the house maximum of 50000 HKD minor units is committed
- **THEN** the current bid is 31000 HKD minor units and Bidder 2 leads
- **AND** the public history records one bid, Bidder 2's, at 31000 HKD minor
  units, and names no house

<!-- trace:scenario id=g10.auction-auto-bidding.SC-gct rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-34 - An earlier collector keeps a tie against the house
**Serves:** grade10-site-auction-auto-bidding-US-03 - the earlier commitment keeps the lead

- **GIVEN** an `HKD` listing where collector A leads at 20000 HKD minor units
  with a maximum of 50000
- **WHEN** the house maximum of 50000 HKD minor units is committed
- **THEN** A still leads at 50000 HKD minor units
- **AND** the public history records the house's bid at 50000 HKD minor units,
  then A's automatic response at 50000

<!-- trace:scenario id=g10.auction-auto-bidding.SC-3dy rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-35 - The house bids with no card
**Serves:** House maximum - the house is committed without the checks a collector passes

- **GIVEN** an open listing, and a house maximum at or above its minimum next
  bid, with no card, bid-panel enrollment or verified identity behind it
- **WHEN** the house maximum is committed
- **THEN** Grade10 accepts it and places the bid the resolution requires

<!-- trace:scenario id=g10.auction-auto-bidding.SC-7m7 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-47 - One internal bidder reads as each listing's own pseudonym
**Serves:** House maximum - one internal bidder's commitments on two lots read apart

- **GIVEN** two open `HKD` listings whose internal bids both name the same
  internal bidder: on the first, collectors A and B have bid as Bidder 1 and
  Bidder 2; on the second, nobody has bid
- **WHEN** both house maximums are committed
- **THEN** the first listing's public history records the house's bid as
  Bidder 3, and the second's as Bidder 1
- **AND** no public fact on either listing names the internal bidder or the
  other listing

### Requirement: The house maximum is committed at its set time

Before its set time the house SHALL NOT be in the bidding: no bid is placed
for it, and collector bids SHALL be judged as if no house maximum existed.

At its set time Grade10 SHALL commit the house maximum once, whether or not
anyone has the listing open, as follows:

1. The commitment is accepted at the set time. Grade10 SHALL resolve it
   before any commitment accepted after the set time, so a collector bid that
   arrives after the set time is judged against a listing the house is
   already in.
2. When the listing takes bids at that moment and a collector's maximum of
   the same amount would be accepted then, Grade10 SHALL accept the house
   maximum and resolve it once, per "Two-maximum rule".
3. Otherwise the house maximum is **not placed**: Grade10 SHALL write no bid,
   and the listing's current bid, leader, bid count and history SHALL stay as
   they were. A listing still `created` at the set time takes no bids, so its
   house maximum is not placed, and publishing the listing later SHALL NOT
   commit it.

A house maximum committed at or before the scheduled close SHALL count toward
extended bidding as any maximum committed before the close does.

<!-- trace:scenario id=g10.auction-auto-bidding.SC-rh7 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-36 - Before its time the house meets no collector
**Serves:** grade10-site-auction-auto-bidding-US-03 - an early bidder competes only with collectors

- **GIVEN** an open `HKD` listing starting at 20000 HKD minor units with no
  bids, and a house maximum of 50000 set for 18:00:00 UTC
- **WHEN** collector A commits a maximum of 30000 HKD minor units at 17:00:00
  UTC
- **THEN** A leads at 20000 HKD minor units
- **AND** the bid count is 1

<!-- trace:scenario id=g10.auction-auto-bidding.SC-jd3 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-37 - A bid after the set time meets the house first
**Serves:** grade10-site-auction-auto-bidding-US-03 - a collector bids just after the house's time

- **GIVEN** the listing of `grade10-site-auction-auto-bidding-SC-36` at
  18:00:02 UTC, with A leading at 20000 HKD minor units and no bid yet placed
  for the house
- **WHEN** collector B commits a maximum of 40000 HKD minor units
- **THEN** the house's bid is recorded at 18:00:00 UTC at 31000 HKD minor
  units, before B's
- **AND** the house leads at 41000 HKD minor units, after B's bid at 40000

<!-- trace:scenario id=g10.auction-auto-bidding.SC-rt4 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-38 - A house maximum short of the next bid is not placed
**Serves:** House maximum - the house's time arrives after the price passed it

- **GIVEN** an `HKD` listing where collector A leads at 52000 HKD minor units
  with a maximum of 60000, so the minimum next bid is 53000
- **WHEN** a house maximum of 50000 HKD minor units reaches its set time
- **THEN** Grade10 places no bid for the house
- **AND** A leads at 52000 HKD minor units, and the bid count and public
  history are unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-szf rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-39 - The house's commitment before the close opens extended bidding
**Serves:** grade10-site-auction-auto-bidding-US-05 - the house's bid counts toward extended bidding

- **GIVEN** an open listing with extended bidding on and no bids, and a house
  maximum set for one minute before its scheduled close
- **WHEN** the scheduled close arrives
- **THEN** the house leads at the opening price
- **AND** the listing enters extended bidding

<!-- trace:scenario id=g10.auction-auto-bidding.SC-dym rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-46 - A house maximum whose time comes before publishing is not placed
**Serves:** House maximum - the house's time arrives while the lot is still unpublished

- **GIVEN** a `created` `HKD` listing starting at 20000 HKD minor units, with
  a house maximum of 50000 set for 18:00:00 UTC
- **WHEN** 18:00:00 UTC passes, the listing is published at 18:30:00 UTC and
  collector A commits a maximum of 30000 HKD minor units at 18:40:00 UTC
- **THEN** A leads at 20000 HKD minor units
- **AND** the bid count is 1, and the public history records no bid before
  A's

### Requirement: A committed house maximum is raised or lowered

After its set time the house maximum SHALL change only as follows, until the
listing's effective close:

- **Raise** - Grade10 SHALL accept a higher house maximum at any time the
  listing takes a bid, as a new commitment of the same bidder: it resolves
  once, and a raise that moves the current bid moves the close as a manual bid
  at that moment would, per `grade10-site/auction/auction`.
- **Lower** - Grade10 SHALL resolve the two-maximum rule again with the lower
  house maximum, as a commitment accepted at that moment. It SHALL accept the
  lower amount only when that resolution leaves the same leader and the same
  current bid, and the amount is at least every bid already placed for the
  house on the listing. An accepted lower SHALL write no public bid record,
  SHALL NOT move the close and SHALL NOT change the bid count.

A house maximum that was not placed SHALL be judged as that bidder's first
commitment when it is saved at or above the minimum next bid, its own amount
included. A lower of it below the minimum next bid SHALL write no bid and
leave it not placed, and a raise still below the minimum next bid SHALL be
refused, per `grade10-admin/auction/internal-bid`.

A collector's committed maximum SHALL stay raise only.

Worked example. An `HKD` listing starting at 20000; every amount in HKD minor
units.

| Step | What happens | Accepted | Leader at | Why |
| --- | --- | --- | --- | --- |
| 1 | The house maximum of 25000 is committed, no other bid | Yes | House at 20000 | The house's bid is placed at 20000 |
| 2 | A commits 40000 | Yes | A at 26000 | The house's 25000 plus one increment |
| 3 | The house is lowered to 24000 | No | A at 26000 | The current bid would become 25000 |
| 4 | C commits 60000 | Yes | C at 41000 | A's 40000 plus one increment |
| 5 | The house is lowered to 21000 | Yes | C at 41000 | Leader and current bid stay the same |
| 6 | The house is lowered to 19000 | No | C at 41000 | Below the house's bid at 20000 |

<!-- trace:scenario id=g10.auction-auto-bidding.SC-pfm rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-40 - A house raise in extended bidding restarts the timer
**Serves:** grade10-site-auction-auto-bidding-US-05 - the house's raise moves the close as a bid would

- **GIVEN** an `HKD` listing in extended bidding, where collector A leads at
  51000 HKD minor units with a maximum of 60000 over a house maximum of 50000
- **WHEN** the house maximum is raised to 80000 HKD minor units
- **THEN** the house leads at 61000 HKD minor units
- **AND** the listing's close moves exactly as a manual bid at that moment
  would move it

<!-- trace:scenario id=g10.auction-auto-bidding.SC-ax3 rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-41 - A leading house raises without moving the price
**Serves:** grade10-site-auction-auto-bidding-US-03 - the house raises while it leads

- **GIVEN** an `HKD` listing where the house leads at 31000 HKD minor units
  with a maximum of 50000 over collector A's 30000
- **WHEN** the house maximum is raised to 70000 HKD minor units
- **THEN** the house still leads at 31000 HKD minor units
- **AND** no public bid record is added

<!-- trace:scenario id=g10.auction-auto-bidding.SC-ajh rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-42 - A lower that leaves the lot as it was is accepted
**Serves:** grade10-admin/auction/internal-bid#grade10-admin-auction-internal-bid-US-04 - the admin lowers the house's maximum behind a lead it does not hold

- **GIVEN** the listing of the worked example after step 4
- **WHEN** the house maximum is lowered to 21000 HKD minor units
- **THEN** Grade10 accepts it
- **AND** C leads at 41000 HKD minor units, with no public bid record added
  and the bid count unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-q3t rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-43 - A lower that would move the current bid is refused
**Serves:** grade10-admin/auction/internal-bid#grade10-admin-auction-internal-bid-US-04 - the admin lowers the house's maximum that prices the leader

- **GIVEN** the listing of the worked example after step 2
- **WHEN** the house maximum is lowered to 24000 HKD minor units
- **THEN** Grade10 refuses it
- **AND** A leads at 26000 HKD minor units and the house maximum stays 25000

<!-- trace:scenario id=g10.auction-auto-bidding.SC-ldk rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-44 - A lower below the house's own bid is refused
**Serves:** grade10-admin/auction/internal-bid#grade10-admin-auction-internal-bid-US-04 - the admin lowers under a bid already placed for the house

- **GIVEN** the listing of the worked example after step 5
- **WHEN** the house maximum is lowered to 19000 HKD minor units
- **THEN** Grade10 refuses it
- **AND** the house maximum stays 21000 HKD minor units
