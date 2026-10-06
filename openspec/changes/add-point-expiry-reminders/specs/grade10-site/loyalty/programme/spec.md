# Loyalty programme - delta

## Feature set

- Earning and expiry
  - Operator credits: a grant, a correction or a reward given outright takes
    the date the balance already names and pushes it no further; where nothing
    is live, a grant or a correction starts the window from its own day
  - Returned points: points a reversal gives back, or points paid at checkout
    that a refund or an operator returns, rejoin the window already running,
    even onto a balance brought to nothing, and start no window of their own

## MODIFIED Requirements

### Requirement: The redeemable balance expires after a period of inactivity

A member's whole redeemable balance SHALL expire once the programme's inactivity
window has passed with no earning and no redemption. Any qualifying spend and
any redemption SHALL reset that window for the whole balance, whatever the age
of the points in it — including a spend too small to earn a whole point, which
is activity even when it credits nothing.

The window SHALL be counted in calendar months on the programme's clock — the
same day of the month and time of day, the programme's months on — and a day
the target month does not have SHALL land on that month's last day. It is never
a count of days.

Resetting SHALL only ever push the window out. An activity dated in the past
SHALL NOT pull a member's expiry earlier than an activity already recorded, so a
late-arriving record can shorten no balance.

The balance SHALL stop counting at the instant the window passes, without
waiting for any scheduled process. A refund, a claw-back, an operator
correction, a campaign grant, or a reward an operator hands over outright SHALL
NOT reset the window. Points already expired SHALL NOT be revived by later
activity.

A member who holds any redeemable points SHALL have exactly one date on which
all of them expire. A grant or a correction an operator records SHALL take the
date the member's window already names, whatever date its own event carries.
Where the member holds no point that is still live, such a credit SHALL start
the window from its own date instead, which starts no life for anything that
has already lapsed. Points a reversal gives back, and points paid at checkout
that a refund or an operator returns, SHALL rejoin the window already running,
even where the member holds no point that is still live, and SHALL NOT start a
window of their own.

A reversal SHALL give back only points that still have life. Where the
member's window has passed, what the debit took SHALL NOT be written back: no
credit is recorded that the next sweep would only remove, and the reversal
SHALL name the points it could not return rather than reporting a balance it
did not restore.

Each credit SHALL also carry its own expiry date, set when it is recorded, and a
credit SHALL count while the later of that date and the member's inactivity
window is still ahead. Once the dates already recorded have been brought up to
the window, no credit SHALL be recorded beyond it, and the two can disagree
only where the window has already passed.

Expiry SHALL be recorded as a dated entry like any other movement, naming the
whole amount it removed.

<!-- trace:scenario id=g10.loyalty-programme.SC-4ri rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-94 - Buying keeps the whole balance alive
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member earns points eleven months after their previous activity
- **THEN** the whole balance, oldest points included, expires an inactivity window after this earning
- **AND** not an inactivity window after the earning that produced those older points

<!-- trace:scenario id=g10.loyalty-programme.SC-s8t rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-95 - Redeeming also resets the window
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member redeems and records no other activity
- **THEN** the remaining balance expires an inactivity window after that redemption

<!-- trace:scenario id=g10.loyalty-programme.SC-jff rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-96 - Expiry needs no sweep
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member's inactivity window passes
- **THEN** their balance stops counting toward what they can spend immediately

<!-- trace:scenario id=g10.loyalty-programme.SC-ehg rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-97 - Expired points do not come back
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member whose balance has expired makes a purchase
- **THEN** the new earning starts a fresh balance and a fresh inactivity window
- **AND** nothing that expired returns

<!-- trace:scenario id=g10.loyalty-programme.SC-v4d rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-98 - A correction does not extend the balance's life
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** an operator corrects a balance, or a refund claws points back
- **THEN** the member's inactivity window is unchanged
- **AND** points the correction adds expire with the rest of the balance

<!-- trace:scenario id=g10.loyalty-programme.SC-0nq rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-99 - A campaign grant does not keep the balance alive
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** an operator grants campaign points as a reward
- **THEN** the member's inactivity window is unchanged
- **AND** the granted points expire with the rest of the balance, on the date that window already names

<!-- trace:scenario id=g10.loyalty-programme.SC-vif rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-100 - A spend too small to earn still counts as activity
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a member's qualifying spend is below the price of one point
- **THEN** no points are credited
- **AND** the member's inactivity window is reset from that spend

<!-- trace:scenario id=g10.loyalty-programme.SC-uf6 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-101 - A late record cannot shorten the balance's life
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a purchase dated before the member's most recent activity is recorded
- **THEN** the balance's expiry is left where the later activity put it
- **AND** it is never pulled back toward the older date

<!-- trace:scenario id=g10.loyalty-programme.SC-q5t rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-150 - The window is calendar months, not a day count
**Serves:** Earning and expiry - the window is calendar months, not a day count

- **WHEN** a member's last activity is 3 January at 10:00 in the programme's zone
- **THEN** the balance lapses on 3 January the next year at 10:00, whether that is 365 or 366 days on
- **AND** an activity on 29 February lapses on 28 February the next year

<!-- trace:scenario id=g10.loyalty-programme.SC-9w1 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-151 - A record older than the window is written already lapsed
**Serves:** Earning and expiry - a record older than the window is written already lapsed

- **WHEN** an earning dated more than an inactivity window ago is recorded
- **THEN** its points are recorded with their own date already past, and count nothing
- **AND** the member's inactivity window is unchanged

<!-- trace:scenario id=g10.loyalty-programme.SC-gg6 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-102 - A partial sweep converges
**Serves:** grade10-site-loyalty-programme-US-02 - Member earns only on what they actually paid

- **WHEN** a scheduled expiry pass stops before reaching every member
- **THEN** it reports how many members it did not reach
- **AND** the next pass covers them, with no state carried between passes

<!-- trace:scenario id=g10.loyalty-programme.SC-pgz rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-180 - Operator points to an empty balance start the window
**Serves:** grade10-site-loyalty-programme-US-05 - operator points to an empty balance start the window

- **WHEN** an operator adds points to a member who holds no live points
- **THEN** those points expire an inactivity window after their own date
- **AND** a credit whose own date is already an inactivity window past is written already lapsed, and nothing that had lapsed counts again

<!-- trace:scenario id=g10.loyalty-programme.SC-zl6 rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-181 - A backdated grant joins the window already running
**Serves:** grade10-site-loyalty-programme-US-05 - a backdated grant joins the window already running

- **WHEN** an operator adds points dated before today to a member whose balance is live
- **THEN** those points expire with the rest of the balance
- **AND** the member's inactivity window is unchanged

<!-- trace:scenario id=g10.loyalty-programme.SC-pft rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-182 - Handing over a reward is not the member's activity
**Serves:** grade10-site-loyalty-programme-US-05 - a reward handed over is the operator's act, not the member's

- **WHEN** an operator gives a member a reward outright, without the member spending points for it
- **THEN** the member's inactivity window is unchanged

<!-- trace:scenario id=g10.loyalty-programme.SC-pkm rev=1 -->
#### Scenario: grade10-site-loyalty-programme-SC-183 - A reversal into a lapsed balance returns nothing spendable
**Serves:** grade10-site-loyalty-programme-US-06 - a reversal into a lapsed balance says what it could not return

- **WHEN** a payment in points is reversed after the member's window has passed
- **THEN** no points are written back and the balance stays empty
- **AND** the answer names the points it could not return, rather than refusing the reversal

<!-- trace:scenario id=g10.loyalty-programme.SC-guq rev=2 -->
#### Scenario: grade10-site-loyalty-programme-SC-232 - Points given back to a balance brought to nothing keep the running day
**Serves:** `grade10-site-loyalty-programme-US-03`, `grade10-site-loyalty-programme-US-06` - points given back keep the running day

- **GIVEN** a member whose balance a claw-back or a correction brought to nothing while their window still runs
- **WHEN** a redemption of theirs is reversed, or points they paid at checkout come back through a refund or an operator's return
- **THEN** the returned points expire on the date that window already names
- **AND** the member's inactivity window is unchanged
