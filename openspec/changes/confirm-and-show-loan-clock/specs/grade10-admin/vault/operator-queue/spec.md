# grade10-admin/vault/operator-queue Specification

## Feature set

- One case
  - A loan's clock: past its due date the header counts the days past due,
    and once a forfeiture notice stands it names the date to pay by instead,
    both on the brand's calendar
  - Asked before the collector is emailed: cancelling the visit and sending
    the forfeiture notice each ask first, naming the slot on the booked shop's
    clock, or the address and the date to pay by

## ADDED Requirements

### Requirement: A late loan's clock reads beside the case's status

The case header SHALL read a live loan's clock beside the status, from the
case's own read, on the brand's own zone as `shared/dates-and-times` states
it, never on the zone of the shop the case is kept at.

| The case | The header reads |
| --- | --- |
| A live loan, `active` with an advance recorded, on or before its due date | no clock |
| A live loan past its due date, with no forfeiture notice standing | `N days past due`, or `1 day past due` |
| A live loan with a forfeiture notice standing | `pay by <date>`, and no count |
| A storage case, a repaid loan, or a case that has ended | no clock |

- **The count** - N SHALL be the calendar days on the brand's calendar from
  the due date to the day of the read: 1 on the day after the due date. It
  SHALL be the count the collector's Past due stage reads in
  `grade10-site/vault/case-lifecycle`, and SHALL NOT be reduced by the brand's
  grace days.
- **The date** - the date to pay by SHALL be the one the newest notice named,
  never one recomputed from the brand's notice period, and SHALL stay after
  that date has passed.
- **A clock, not a wait** - the clock SHALL NOT be one of the reasons a case
  is waiting on staff, and SHALL NOT change the status the case holds.
- **Who reads it** - an operator holding the vault read grant SHALL read it;
  it SHALL need no money grant.

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-syo rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-97 - A loan past its due date reads its days past due
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator opens a late loan and reads how late it is

- **GIVEN** a live loan due on 30 November with no forfeiture notice, read on 3 December on the brand's calendar
- **WHEN** an operator opens the case
- **THEN** the header reads `3 days past due` beside the status
- **AND** no badge says the case is waiting on staff for being late

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-9xn rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-98 - The first day after the due date reads one day on the brand's calendar
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator reads the brand's day, not the server's

- **GIVEN** a live loan due on 30 November, read at 00:30 on 1 December Hong Kong time, the brand's zone, while it is still 30 November in Coordinated Universal Time
- **WHEN** an operator opens the case
- **THEN** the header reads `1 day past due`

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-jhz rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-99 - A loan inside its term reads no clock
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator is shown no clock on a loan that is not late

- **GIVEN** a live loan due on 30 November, read at 23:00 on 30 November on the brand's calendar
- **WHEN** an operator opens the case
- **THEN** the header reads no clock beside the status

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-j1h rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-100 - A standing notice names the date to pay by instead of the count
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator reads the date to pay by once a notice stands

- **GIVEN** a live loan due on 30 November, sent a forfeiture notice on 1 December naming 15 December as the date to pay by, read on 5 December
- **WHEN** an operator opens the case
- **THEN** the header reads `pay by 15 Dec 2026` beside the status, and no count of days

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-b6w rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-101 - The date to pay by stays once it has passed
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator reads the same date the borrower was given after it passes

- **GIVEN** a live loan whose forfeiture notice named 15 December, read on 16 December
- **WHEN** an operator opens the case
- **THEN** the header reads `pay by 15 Dec 2026`

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-6jj rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-102 - A case that owes no running loan reads no clock
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator is shown a clock only on a loan that runs

- **GIVEN** a storage case in the vault, a repaid loan whose due date has passed, and a forfeited case
- **WHEN** an operator opens each case
- **THEN** none of the three headers reads a clock

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-g7w rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-103 - The count does not take off the brand's grace
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator reads how late the loan is, not when late interest starts

- **GIVEN** a brand with 3 grace days and a live loan due on 30 November, read on 2 December
- **WHEN** an operator opens the case
- **THEN** the header reads `2 days past due`

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-fgo rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-104 - Staff without the money grant read the clock
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator reads the clock without the money grant

- **GIVEN** an operator holding the staff grants and not the vault payout grant, and a live loan 3 days past its due date
- **WHEN** they open the case
- **THEN** the header reads `3 days past due`, and no Payouts tab is offered

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-4es rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-123 - The count turns at the brand's midnight, not the shop's
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator reads the brand's day at a shop on another zone

- **GIVEN** a brand on `Asia/Hong_Kong`, and a live loan due on 30 November kept at a shop on `Asia/Tokyo`, read at 00:30 on 1 December Tokyo time, 23:30 on 30 November Hong Kong time
- **WHEN** an operator opens the case
- **THEN** the header reads no clock beside the status

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-sn7 rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-124 - The date to pay by reads the brand's day at a shop on another zone
**Serves:** grade10-admin-vault-operator-queue-US-24 - the operator reads the date the borrower was given

- **GIVEN** a brand on `Asia/Hong_Kong`, and a live loan kept at a shop on `Asia/Tokyo` whose forfeiture notice named 15 December 2026, a day that ends at 00:59 on 16 December Tokyo time
- **WHEN** an operator opens the case on 5 December
- **THEN** the header reads `pay by 15 Dec 2026`, and does not read 16 Dec

### Requirement: Cancelling a visit asks first, naming the slot

Cancelling a case's visit from the console SHALL run in these steps:

1. The operator presses Cancel visit.
2. The console asks, from the case as the press reads it, in the default
   tone, naming the visit's day and time on the clock of the shop
   it is booked at, that shop's zone as the visit booker names it
   (`On the shop's clock (<zone>)`), the case's email address the collector
   is emailed at, and that the case keeps its status. It SHALL NOT read the
   slot on the brand's zone. A case with no email address SHALL say that
   nobody is emailed.
3. Dismissing reads `Keep visit`. It SHALL send nothing, and the visit SHALL
   stay as it was.
4. Confirming reads `Cancel visit`. The visit SHALL be cancelled, and the
   collector told, as `grade10-site/vault/visit-booking` states.
5. A refusal SHALL be shown in the open confirm, which stays open.

- **A fresh read** - the press SHALL read the case afresh before it asks, and
  the confirm SHALL name the visit as that read holds it, so a visit moved
  since the case was opened is named at its new slot.
- **A visit already gone** - where the fresh read holds no visit, no confirm
  SHALL open, nothing SHALL be sent, and the case SHALL redraw without the
  visit.
- **No confirm on a failure** - where the fresh read fails, or the shop the
  visit is booked at cannot be found, the failure SHALL be shown beside the
  button, and no confirm SHALL open. The slot SHALL NOT be named on the
  brand's zone instead.

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-af3 rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-105 - The confirm names the slot, the address and the status kept
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator checks the slot before the collector is told

- **GIVEN** a case at `vaulted` holding a visit at a shop on `Asia/Hong_Kong`, on 15 June 2026 at 10:00 there, 02:00 Coordinated Universal Time, and the address `collector@example.com`
- **WHEN** an operator presses Cancel visit
- **THEN** a confirm in the default tone names 15 June 2026 at 10:00 on the shop's clock, `Asia/Hong_Kong`, says the collector is emailed at `collector@example.com`, and says the case keeps its status
- **AND** its two choices read `Keep visit` and `Cancel visit`
- **AND** nothing has been sent

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-4jw rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-122 - The slot reads on the booked shop's clock, not the brand's
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator checks the hour the collector booked

- **GIVEN** a brand on `Asia/Hong_Kong`, and a case holding a visit at a shop on `Asia/Tokyo`, on 15 June 2026 at 10:00 there, 09:00 Hong Kong time
- **WHEN** an operator presses Cancel visit
- **THEN** the confirm names 15 June 2026 at 10:00 on the shop's clock, `Asia/Tokyo`, and does not name 09:00

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-x20 rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-106 - Keeping the visit sends nothing
**Serves:** grade10-admin-vault-operator-queue-US-22 - a misplaced press tells the customer nothing

- **GIVEN** the Cancel visit confirm open on a case holding a visit
- **WHEN** the operator presses `Keep visit`
- **THEN** the confirm closes, the case still holds the visit, and no message is sent to the collector

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-ilj rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-107 - Confirming cancels the visit and the collector is told
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator cancels the visit knowing the collector hears

- **GIVEN** the Cancel visit confirm open on a case holding a visit and an address
- **WHEN** the operator presses `Cancel visit`
- **THEN** the confirm closes, the case holds no visit and keeps its status, and the collector is told the visit was cancelled

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-u9b rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-108 - A case with no address says nobody is emailed
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator learns nobody will hear before cancelling

- **GIVEN** a case holding a visit and no email address
- **WHEN** an operator presses Cancel visit
- **THEN** the confirm says that nobody is emailed, and names no address

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-jyk rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-109 - A refused cancel stays in the confirm
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator reads why the cancel did not go where they pressed it

- **GIVEN** the Cancel visit confirm open on a case that has ended since it opened
- **WHEN** the operator presses `Cancel visit`
- **THEN** the worker's refusal is shown in the confirm, which stays open

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-91a rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-116 - A visit cancelled in another tab opens no confirm
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator is not asked to cancel a visit that is already gone

- **GIVEN** a case opened while it held a visit, whose visit has since been cancelled in another tab
- **WHEN** the operator presses Cancel visit
- **THEN** no confirm opens, the case redraws holding no visit, and no message is sent to the collector

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-cqt rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-117 - A visit moved in another tab is named at its new slot
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator checks the slot the visit holds now

- **GIVEN** a case opened while it held a visit at a shop on `Asia/Hong_Kong` on 15 June 2026 at 10:00 there, since moved in another tab to 16 June 2026 at 14:00
- **WHEN** the operator presses Cancel visit
- **THEN** the confirm names 16 June 2026 at 14:00 on the shop's clock, `Asia/Hong_Kong`, and does not name 15 June

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-aaa rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-118 - A failed read opens no cancel confirm
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator is never asked from a read that may no longer hold

- **GIVEN** a case holding a visit, and the console unable to read the case afresh
- **WHEN** the operator presses Cancel visit
- **THEN** the failure is shown beside Cancel visit, no confirm opens, the case still holds the visit, and no message is sent to the collector

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-ydx rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-119 - A visit at a shop that cannot be found opens no confirm
**Serves:** grade10-admin-vault-operator-queue-US-22 - the operator is never shown the slot at another hour

- **GIVEN** a case holding a visit at a shop the console's list of shops does not hold
- **WHEN** the operator presses Cancel visit
- **THEN** the failure is shown beside Cancel visit, no confirm opens, the slot is not named on the brand's zone, and no message is sent to the collector

### Requirement: Sending the forfeiture notice asks first, naming the address and the date to pay by

Sending the forfeiture notice from the custody tab SHALL run in these steps:

1. The operator presses Send forfeiture notice.
2. The console asks, from the case and the brand's notice period as the press
   reads them, in the destructive tone, naming the case's
   email address the notice goes to and the date to pay by the notice would
   name if sent as the confirm opens.
3. Dismissing SHALL send nothing and record nothing.
4. Confirming SHALL send the notice as `grade10-site/vault/loan-and-settlement`
   states.
5. A refusal SHALL be shown in the open confirm, which stays open.

| What the confirm reads | When |
| --- | --- |
| The address and the date to pay by | the case holds an email address and the brand has set a notice period |
| That nobody is emailed, and the date to pay by | the case holds no email address |
| That no date to pay by can be named without a notice period | the brand has set no notice period |

- **The date** - the date to pay by SHALL be the brand's notice period counted
  from the instant the confirm opens, named as a day on the brand's calendar,
  never on the zone of the shop the case is kept at. Where the
  brand's day turns between the confirm opening and the send, the notice SHALL
  name the date the worker reaches at the send, one day later, and nothing
  SHALL ask again.
- **A fresh read** - the press SHALL read the case and the brand's notice
  period afresh before it asks.
- **A notice already standing** - where the fresh read holds a forfeiture
  notice, no confirm SHALL open, no notice SHALL be sent, and the custody tab
  SHALL redraw with the notice sent and the date to pay by it named.
- **No confirm on a failure** - where either read fails, the failure SHALL be
  shown beside the button, and no confirm SHALL open.

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-5hv rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-110 - The confirm names the address and the date to pay by
**Serves:** grade10-admin-vault-operator-queue-US-23 - the operator checks who will read the notice and the deadline it starts

- **GIVEN** a brand with a 14-day notice period, and a live loan past its due date with no notice, holding the address `collector@example.com`
- **WHEN** an operator presses Send forfeiture notice at 10:00 on 1 December on the brand's clock
- **THEN** a confirm in the destructive tone names `collector@example.com` and 15 December 2026 as the date to pay by
- **AND** nothing has been sent

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-wro rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-111 - Dismissing the notice sends nothing
**Serves:** grade10-admin-vault-operator-queue-US-23 - a misplaced press starts no deadline

- **GIVEN** the Send forfeiture notice confirm open
- **WHEN** the operator dismisses it
- **THEN** no notice is recorded on the case, no message is sent, and the custody tab still offers the notice beside the reason no written notice has been sent

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-1bh rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-112 - Confirming sends the notice naming the date shown
**Serves:** grade10-admin-vault-operator-queue-US-23 - the operator sends the notice they checked

- **GIVEN** the Send forfeiture notice confirm open at 10:00 on 1 December on the brand's clock, naming 15 December 2026
- **WHEN** the operator confirms it
- **THEN** the confirm closes, the case carries a notice naming 15 December 2026 as the date to pay by, and the collector is sent the notice
- **AND** the header reads `pay by 15 Dec 2026`

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-mu0 rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-113 - A day that turns before the send names the later date
**Serves:** grade10-admin-vault-operator-queue-US-23 - the borrower is never given less time than the operator read

- **GIVEN** a brand with a 14-day notice period, and the Send forfeiture notice confirm opened at 23:59 on 1 December on the brand's clock, naming 15 December 2026
- **WHEN** the operator confirms it at 00:01 on 2 December
- **THEN** the notice names 16 December 2026 as the date to pay by, and no second confirm is asked

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-jnl rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-114 - A case with no address says nobody is emailed
**Serves:** grade10-admin-vault-operator-queue-US-23 - the operator learns nobody will read the notice before it goes

- **GIVEN** a live loan past its due date with no notice and no email address
- **WHEN** an operator presses Send forfeiture notice
- **THEN** the confirm says that nobody is emailed, names no address, and names the date to pay by

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-ekb rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-115 - With no notice period the confirm says so, and the refusal shows in it
**Serves:** grade10-admin-vault-operator-queue-US-23 - the operator reads in words why the notice cannot go

- **GIVEN** a brand with no notice period, and a live loan past its due date with no notice
- **WHEN** an operator presses Send forfeiture notice, and confirms
- **THEN** the confirm says that no date to pay by can be named without a notice period
- **AND** on confirming, the worker's refusal is shown in the confirm, which stays open, and no notice is recorded

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-kbm rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-120 - A notice sent in another tab opens no confirm
**Serves:** grade10-admin-vault-operator-queue-US-23 - a borrower is never sent a second notice by a press made on an old page

- **GIVEN** a live loan past its due date, opened while it held no notice, and since sent a forfeiture notice in another tab naming 15 December 2026
- **WHEN** the operator presses Send forfeiture notice
- **THEN** no confirm opens, no second notice is recorded or sent, and the custody tab redraws with the notice sent naming 15 December 2026 and no longer offers the notice

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-rtl rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-121 - A failed read opens no notice confirm
**Serves:** grade10-admin-vault-operator-queue-US-23 - the operator is never asked from a read that may no longer hold

- **GIVEN** a live loan past its due date with no notice, and the console unable to read the case or the brand's notice period afresh
- **WHEN** the operator presses Send forfeiture notice
- **THEN** the failure is shown beside Send forfeiture notice, no confirm opens, and no notice is recorded

<!-- trace:scenario id=g10adm.vault-operator-queue.SC-o3p rev=1 -->
#### Scenario: grade10-admin-vault-operator-queue-SC-125 - The notice confirm names the brand's day at a shop on another zone
**Serves:** grade10-admin-vault-operator-queue-US-23 - the operator checks the date the borrower will be given

- **GIVEN** a brand on `Asia/Hong_Kong` with a 14-day notice period, and a live loan past its due date with no notice, kept at a shop on `Asia/Tokyo`
- **WHEN** an operator presses Send forfeiture notice at 10:00 on 1 December Hong Kong time
- **THEN** the confirm names 15 December 2026 as the date to pay by, and does not name 16 December
