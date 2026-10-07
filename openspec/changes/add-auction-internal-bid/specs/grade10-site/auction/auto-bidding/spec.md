# grade10-site/auction/auto-bidding Specification

## Feature set

- House maximum
  - Same rules: the house maximum takes part in the two-maximum rule, ties and extended bidding as any maximum does, under a listing pseudonym
  - Committed on a clock: the house maximum is committed at its set time, not by a bidder's action
  - The one lowerable maximum: a lower house maximum is accepted only when the leader and the current bid stay the same; a collector's stays raise only

## MODIFIED Requirements

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
every commitment, raise and lower of it with its Accepted At, per
`grade10-admin/auction/internal-bid`.

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

## ADDED Requirements

### Requirement: The house maximum bids as any maximum does

The **house maximum** is the amount of a listing's internal bid, set under
`grade10-admin/auction/internal-bid`. Once committed, Grade10 SHALL treat it
as one bidder's committed maximum in every rule of this capability: the
two-maximum rule, ties to the earlier commitment, one resolution per
commitment, bids placed on its behalf, the bid count, bid history, and
extended bidding.

- **Pseudonym** - the house SHALL bid under a listing pseudonym given as a
  collector's is. No listing fact, bid history row, letter or page a collector
  reads SHALL say or imply that a bid is the house's.
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

### Requirement: The house maximum is committed at its set time

Before its set time the house SHALL NOT be in the bidding: no bid is placed
for it, and collector bids SHALL be judged as if no house maximum existed.

At its set time Grade10 SHALL commit the house maximum once, whether or not
anyone has the listing open, as follows:

1. The commitment is accepted at the set time. Grade10 SHALL resolve it
   before any commitment accepted after the set time, so a collector bid that
   arrives after the set time is judged against a listing the house is
   already in.
2. When a collector's maximum of the same amount would be accepted at that
   moment, Grade10 SHALL accept the house maximum and resolve it once, per
   "Two-maximum rule".
3. Otherwise the house maximum is **not placed**: Grade10 SHALL write no bid,
   and the listing's current bid, leader, bid count and history SHALL stay as
   they were.

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

### Requirement: A committed house maximum is raised or lowered

After its set time the house maximum SHALL change only as follows, until the
listing's effective close:

- **Raise** - Grade10 SHALL accept a higher house maximum at any time the
  listing takes a bid, as a new commitment of the same bidder: it resolves
  once, and a raise that moves the current bid moves the close as a manual bid
  at that moment would, per `grade10-site/auction/auction`. A raise of a house
  maximum that was not placed SHALL be judged as that bidder's first
  commitment.
- **Lower** - Grade10 SHALL resolve the two-maximum rule again with the lower
  house maximum, as a commitment accepted at that moment. It SHALL accept the
  lower amount only when that resolution leaves the same leader and the same
  current bid, and the amount is at least every bid already placed for the
  house on the listing. An accepted lower SHALL write no public bid record,
  SHALL NOT move the close and SHALL NOT change the bid count.

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
**Serves:** House maximum - the house's maximum goes down behind a lead it does not hold

- **GIVEN** the listing of the worked example after step 4
- **WHEN** the house maximum is lowered to 21000 HKD minor units
- **THEN** Grade10 accepts it
- **AND** C leads at 41000 HKD minor units, with no public bid record added
  and the bid count unchanged

<!-- trace:scenario id=g10.auction-auto-bidding.SC-q3t rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-43 - A lower that would move the current bid is refused
**Serves:** House maximum - the house's maximum is what prices the leader

- **GIVEN** the listing of the worked example after step 2
- **WHEN** the house maximum is lowered to 24000 HKD minor units
- **THEN** Grade10 refuses it
- **AND** A leads at 26000 HKD minor units and the house maximum stays 25000

<!-- trace:scenario id=g10.auction-auto-bidding.SC-ldk rev=1 -->
#### Scenario: grade10-site-auction-auto-bidding-SC-44 - A lower below the house's own bid is refused
**Serves:** House maximum - a bid already placed for the house sets the floor

- **GIVEN** the listing of the worked example after step 5
- **WHEN** the house maximum is lowered to 19000 HKD minor units
- **THEN** Grade10 refuses it
- **AND** the house maximum stays 21000 HKD minor units
