## Feature set

- Till spending
  - One path, no queue: staff apply points or a coupon with no separate
    collection step
  - Notified on settlement: the member hears about any staff-assisted
    spend once the sale lands, not while it is still a re-plannable claim

## ADDED Requirements

### Requirement: A till session spends for the member and notifies them once it lands

Inside a till session, staff SHALL see the member's display name, tier,
redeemable balance, qualifying-window progress, tier renewal and
balance-lapse dates, recent activity, and open coupons — the store's own
and the member's reward coupons alike — and SHALL be able to redeem points
against the current sale and apply a coupon from that list. Undoing a
spend before tender SHALL simply drop the discounts from the sale, since
nothing is debited until the order pays; reversing a completed spend SHALL
stay an operator's action from the console, never the till. Spending SHALL
present a read-back facing the member — points spent, money still due,
balance after, points this sale will earn, computed by the platform —
before it commits.

Submitting the same spend twice SHALL cost once and answer the same both
times. Every staff-assisted spend SHALL notify the member once the sale
reaches settlement — the paid order, or the till's trim-to-what-landed
pass — never while it is still Apply's re-plannable claim, since a claim
can still be trimmed or the whole sale walked away from before anything is
held. A spend the trim-to-landed pass reported that the sale then abandons
unpaid SHALL send a correction notice, since the member was already told it
landed; a sale that never reaches that pass SHALL send nothing. The
notification SHALL never carry the code.

#### Scenario: grade10-site-store-membership-SC-77 - A double tap spends once

- **WHEN** staff submit the same spend twice in quick succession
- **THEN** exactly one redemption is recorded
- **AND** both submissions answer the same

#### Scenario: grade10-site-store-membership-SC-75 - The member's phone is the monitor

- **WHEN** points are spent or a coupon is applied through a till session
  and the sale reaches settlement (paid, or the till's trim-to-landed pass)
- **THEN** the member is notified with points, amount, and location
- **AND** the notification never contains the code

#### Scenario: grade10-site-store-membership-SC-76 - A landed notice is corrected if the sale never pays

- **GIVEN** the till's trim-to-landed pass already notified the member a
  spend landed
- **WHEN** the sale is later abandoned rather than paid
- **THEN** the member receives a correction notice

## REMOVED Requirements

### Requirement: A till session reads the member and spends on their behalf

**Reason**: Collection retires with the coupon path, so a till session no
longer confirms one, and the notice that told a member about a collection
broadens to cover any staff-assisted spend.

**Migration**: Replaced by "A till session spends for the member and
notifies them once it lands" above. SC-12 retires with this requirement; a
double tap costing once continues unchanged as SC-77 under the new one,
since an id is issued once and a new requirement issues its own. SC-13
retires, its behaviour broadened from a collection alone to any
staff-assisted spend under SC-75.
