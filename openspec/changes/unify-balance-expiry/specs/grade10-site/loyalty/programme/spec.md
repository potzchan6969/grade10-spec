# Loyalty — delta

## Feature set

- Earning and expiry
  - Inactivity expiry: the whole balance lapses on one date after the
    inactivity window with no earn and no redemption; either pushes that date
    out, never in
  - Operator credits: a grant, a correction, a reversal or a reward given
    outright takes the date the balance already names and pushes it no
    further; where nothing is live, it starts the window from its own day
- Rewards and redemption
  - Reversal: an operator's reversal of an unused redemption returns what it
    took under the balance's one date, and nothing into a window that has
    passed; a spent artifact stays spent
- Operator console
  - Expiry restart: an operator runs the inactivity window again from today,
    giving a balance more time without the member earning or redeeming
- Member surface
  - Membership home: tier, balance, tier progress, the tier period and the one
    date the balance expires on, in one place

## ADDED Requirements

### Requirement: An operator restarts a member's expiry window

An operator SHALL be able to run a member's inactivity window again from the
day they do it, so that a balance can be given more time without the member
earning or redeeming. The restart SHALL NOT name a day the operator chooses: it
lands an inactivity window from that day, on the programme's clock.

The restart SHALL carry a reason, SHALL be recorded in the operator log, and
SHALL NOT move points, so nothing about it reaches the member's activity. It
SHALL settle whatever has already lapsed before it moves the date, and SHALL
leave a window already further out where it stands. It SHALL require the same
permission as moving points.

#### Scenario: grade10-site-loyalty-programme-SC-176 - An operator restarts the window

- **WHEN** an operator restarts a member's expiry window
- **THEN** the whole balance expires an inactivity window after that day
- **AND** the operator's reason is in the operator log

#### Scenario: grade10-site-loyalty-programme-SC-177 - A restart revives nothing

- **WHEN** an operator restarts the window of a member whose balance has lapsed
- **THEN** what lapsed is written off first and does not return
- **AND** only points recorded after the lapse expire on the new date

#### Scenario: grade10-site-loyalty-programme-SC-178 - A restart never shortens a window

- **WHEN** an operator restarts the window of a member whose date is already further out
- **THEN** that date is left where it stands

#### Scenario: grade10-site-loyalty-programme-SC-179 - A restart moves no points

- **WHEN** an operator restarts a member's expiry window
- **THEN** the balance is unchanged
- **AND** nothing appears in the member's activity

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
all of them expire. A credit an operator records SHALL take the date the
member's window already names, whatever date its own event carries. Where the
member holds no point that is still live, such a credit SHALL start the window
from its own date instead, which starts no life for anything that has already
lapsed.

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

#### Scenario: grade10-site-loyalty-programme-SC-94 - Buying keeps the whole balance alive

- **WHEN** a member earns points eleven months after their previous activity
- **THEN** the whole balance, oldest points included, expires an inactivity window after this earning
- **AND** not an inactivity window after the earning that produced those older points

#### Scenario: grade10-site-loyalty-programme-SC-95 - Redeeming also resets the window

- **WHEN** a member redeems and records no other activity
- **THEN** the remaining balance expires an inactivity window after that redemption

#### Scenario: grade10-site-loyalty-programme-SC-96 - Expiry needs no sweep

- **WHEN** a member's inactivity window passes
- **THEN** their balance stops counting toward what they can spend immediately

#### Scenario: grade10-site-loyalty-programme-SC-97 - Expired points do not come back

- **WHEN** a member whose balance has expired makes a purchase
- **THEN** the new earning starts a fresh balance and a fresh inactivity window
- **AND** nothing that expired returns

#### Scenario: grade10-site-loyalty-programme-SC-98 - A correction does not extend the balance's life

- **WHEN** an operator corrects a balance, or a refund claws points back
- **THEN** the member's inactivity window is unchanged
- **AND** points the correction adds expire with the rest of the balance

#### Scenario: grade10-site-loyalty-programme-SC-99 - A campaign grant does not keep the balance alive

- **WHEN** an operator grants campaign points as a reward
- **THEN** the member's inactivity window is unchanged
- **AND** the granted points expire with the rest of the balance, on the date that window already names

#### Scenario: grade10-site-loyalty-programme-SC-100 - A spend too small to earn still counts as activity

- **WHEN** a member's qualifying spend is below the price of one point
- **THEN** no points are credited
- **AND** the member's inactivity window is reset from that spend

#### Scenario: grade10-site-loyalty-programme-SC-101 - A late record cannot shorten the balance's life

- **WHEN** a purchase dated before the member's most recent activity is recorded
- **THEN** the balance's expiry is left where the later activity put it
- **AND** it is never pulled back toward the older date

#### Scenario: grade10-site-loyalty-programme-SC-150 - The window is calendar months, not a day count

- **WHEN** a member's last activity is 3 January at 10:00 in the programme's zone
- **THEN** the balance lapses on 3 January the next year at 10:00, whether that is 365 or 366 days on
- **AND** an activity on 29 February lapses on 28 February the next year

#### Scenario: grade10-site-loyalty-programme-SC-151 - A record older than the window is written already lapsed

- **WHEN** an earning dated more than an inactivity window ago is recorded
- **THEN** its points are recorded with their own date already past, and count nothing
- **AND** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-102 - A partial sweep converges

- **WHEN** a scheduled expiry pass stops before reaching every member
- **THEN** it reports how many members it did not reach
- **AND** the next pass covers them, with no state carried between passes

#### Scenario: grade10-site-loyalty-programme-SC-180 - Operator points to an empty balance start the window

- **WHEN** an operator adds points to a member who holds no live points
- **THEN** those points expire an inactivity window after their own date
- **AND** a credit whose own date is already an inactivity window past is written already lapsed, and nothing that had lapsed counts again

#### Scenario: grade10-site-loyalty-programme-SC-181 - A backdated grant joins the window already running

- **WHEN** an operator adds points dated before today to a member whose balance is live
- **THEN** those points expire with the rest of the balance
- **AND** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-182 - Handing over a reward is not the member's activity

- **WHEN** an operator gives a member a reward outright, without the member spending points for it
- **THEN** the member's inactivity window is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-183 - A reversal into a lapsed balance returns nothing spendable

- **WHEN** a payment in points is reversed after the member's window has passed
- **THEN** no points are written back and the balance stays empty
- **AND** the answer names the points it could not return, rather than refusing the reversal

### Requirement: Operator point grants distinguish correction from reward

An operator SHALL be able both to correct a balance without affecting tier
progress, and to grant points that count toward tier progress. Each SHALL carry
a reason and SHALL be recorded in the operator log.

Before either is written, the console SHALL name the date the points will
expire on, so an operator adding points to a balance about to lapse sees it.

#### Scenario: grade10-site-loyalty-programme-SC-48 - A correction does not move a member up

- **WHEN** an operator corrects a balance
- **THEN** the points are spendable
- **AND** the member's progress toward the next tier is unchanged

#### Scenario: grade10-site-loyalty-programme-SC-49 - A campaign grant moves a member up

- **WHEN** an operator grants campaign or sign-up points
- **THEN** those points count toward the next tier

#### Scenario: grade10-site-loyalty-programme-SC-184 - The form names the date before the points are written

- **WHEN** an operator opens the form that adds points to a member
- **THEN** it names the day those points will expire
- **AND** it says when they would start the member's window rather than join one

### Requirement: An operator runs the programme from one console

An operator SHALL be able, subject to their own permissions, to: find a member
and read their loyalty state and activity; correct a balance and grant campaign
points; restart a member's expiry window; grant and revoke an invitation-only
tier and list live grants; remove a tier a member holds; create, edit and
archive rewards and see archived and scheduled ones; find a redemption and
reverse or cancel it; read what members have forfeited to expiry; and read the
operator log and verify it has not been tampered with.

The console SHALL show an operator only the sections their permissions allow,
using the same permission the action itself requires, so that what is shown and
what is allowed cannot disagree.

Where a second factor is required and missing, the console SHALL take the
operator to enrol or verify rather than reporting a refusal.

#### Scenario: grade10-site-loyalty-programme-SC-50 - Sections match permissions

- **WHEN** an operator holding only the loyalty read permission opens the console
- **THEN** they can find and read members
- **AND** no section offering point movement, expiry restart, invitations, rewards, tier removal, redemption cancellation or the operator log is shown

#### Scenario: grade10-site-loyalty-programme-SC-51 - A missing second factor opens the gate

- **WHEN** an operator attempts an action their role allows but their session has no verified second factor
- **THEN** the console takes them to verify, and the action completes afterwards

#### Scenario: grade10-site-loyalty-programme-SC-52 - A stale console reports what broke

- **WHEN** the console reads a response whose shape it does not recognise
- **THEN** it reports which call failed to decode, rather than showing missing values

#### Scenario: grade10-site-loyalty-programme-SC-53 - A member can be found again later

- **WHEN** an operator opens a member and shares the address of that view
- **THEN** the same member opens for the recipient

### Requirement: A member sees their own state and never the operating record behind it

What a member reads about themselves SHALL carry their tier, when that
tier's validity period ends, their progress toward retaining it, their
progress to the next earned tier, their redeemable balance, and the one date
that balance expires on. Their own activity list SHALL NOT disclose operator
reasons, retry keys, or the internal pricing of an entry.

Each activity entry SHALL name what it was for, and which channel it came
from, in terms the member can read.

#### Scenario: grade10-site-loyalty-programme-SC-147 - The two counts are shown as two counts

- **WHEN** a member reads their membership
- **THEN** the points that decide their tier and the points they can spend
  are shown as separate named figures

#### Scenario: grade10-site-loyalty-programme-SC-59 - An operator's reason stays out of a member's view

- **WHEN** an operator corrects a member's balance with a written reason
- **THEN** that reason does not appear anywhere in what the member can read

#### Scenario: grade10-site-loyalty-programme-SC-60 - Retry keys and internal pricing stay out of a member's view

- **WHEN** a member reads their activity
- **THEN** no entry carries a retry key, a request record, or the tier and
  money arithmetic the entry was priced from

#### Scenario: grade10-site-loyalty-programme-SC-61 - A retired reward is still readable in history

- **WHEN** a member reads an activity entry for a reward that has since been
  archived
- **THEN** the entry still names that reward

#### Scenario: grade10-site-loyalty-programme-SC-165 - An activity entry names its channel

- **WHEN** a member reads an activity entry
- **THEN** it names the channel that activity came from, in terms the
  member can read

### Requirement: The membership surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the membership surface — `MembershipSummary`, `RewardMenu`,
`CouponList`, and `ActivityList` — and the props and copy type of each.

`MembershipSummary` SHALL render the two counts as two counts, never one
total, alongside the tier held, the date its validity ends, and progress
toward retention. Where it is given an expiry line it SHALL render one line
naming how many points expire and the day they go, in the tone supplied with
it, and where it is given none it SHALL render no such line. It SHALL NOT
derive that line, that day, or that tone from a clock or a balance of its own;
the consumer withholds the line for a member holding no points.
`RewardMenu` SHALL price each reward in points, state a
money-off reward's own validity period, and state what its coupon cannot be
spent without — the basket it has to reach, and the one channel it is good at
where it names only one. `CouponList` SHALL carry each issued
coupon — its code where the shop takes one — what it is for, its own expiry,
and whether it is spent, void or expired.
`ActivityList` SHALL name entries in terms a member reads, name the channel
each came from, and SHALL NOT carry an operator reason, a retry key, or
internal pricing.

Each of those components SHALL take the words it renders in a single `copy`
prop of its own copy type, and SHALL receive every count, date and state
through props — none of them SHALL fetch, subscribe to, or store product
state.

The operator console composes these same exports as brand-owned view code and
SHALL require no export of its own.

#### Scenario: grade10-site-loyalty-programme-SC-123 - The two counts are never summed

- **WHEN** a member holds spendable points and qualifying points that differ
- **THEN** the summary shows both figures separately
- **AND** no single combined total is rendered

#### Scenario: grade10-site-loyalty-programme-SC-124 - A member's activity carries nothing operator-facing

- **WHEN** an entry was written by an operator correction
- **THEN** the member's activity names the entry in member-readable terms
- **AND** it carries no operator reason, retry key or internal pricing

#### Scenario: grade10-site-loyalty-programme-SC-125 - The components take content, not sources

- **WHEN** any of the four components is rendered
- **THEN** every count, date, state and word it shows arrived through props

#### Scenario: grade10-site-loyalty-programme-SC-185 - The summary names one expiry line

- **WHEN** a member holding points reads their membership
- **THEN** one line names how many points expire and the day they go
- **AND** a member holding no points is shown no such line

#### Scenario: grade10-site-loyalty-programme-SC-186 - The expiry line warns inside the last 30 days

- **WHEN** a member's balance expires in 30 days or fewer
- **THEN** the line is rendered in the warning tone, and says what keeps the points
- **AND** a balance expiring later is rendered in the plain tone
