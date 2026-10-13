# shared/dates-and-times Test Cases

**Status:** pending-review · 0/3

## g10.shared-dates-and-times.US1: The zone a date is stated in

**Walked by:** nobody on their own - a format every surface that shows a date inherits; the journeys live in the capabilities that render one

**As a** customer,
**I want** every date I read to be stated in the zone its surface promises,
**so that** I read the same instant the same way wherever it is shown.

<!-- trace:case id=g10.shared-dates-and-times.TC-fqv rev=2 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### g10.shared-dates-and-times.US1-TC3-2: A deadline names the viewer's zone as it stands at its instant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Stated zones

**Decided by:** `packages/date/src/local.test.ts`

**Pre-conditions:**

* The preview workbench renders a closed `AuctionLotCard` with locale en and time zone America/New_York, closing at <close instant>.

**Test data:**

| Close instant | Local time | Zone name |
| --- | --- | --- |
| 2026-09-01T12:00:00Z, a September close | 08:00 | EDT |
| 2027-01-15T12:00:00Z, a January close | 07:00 | EST |
| 2027-03-14T06:59:00Z, one minute before the clocks go forward | 01:59 | EST |
| 2027-03-14T07:00:00Z, the moment the clocks go forward | 03:00 | EDT |
| 2027-11-07T05:59:00Z, one minute before the clocks go back | 01:59 | EDT |
| 2027-11-07T06:00:00Z, the moment the clocks go back | 01:00 | EST |

**Steps:**

1. Read the close line on the tile.

**Expected Results:**

* The clock reads <local time>.
* The line names <zone name>.

<!-- trace:case id=g10.shared-dates-and-times.TC-v92 rev=2 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### g10.shared-dates-and-times.US1-TC4-2: A deadline outside the HKT and EDT examples names the viewer's zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Stated zones

**Decided by:** `packages/date/src/local.test.ts`

**Pre-conditions:**

* The preview workbench renders a closed `AuctionLotCard` with locale <locale> and time zone <viewer zone>, closing at <close instant>.

**Test data:**

| Viewer zone | Locale | Close instant | Local time | Zone name |
| --- | --- | --- | --- | --- |
| Asia/Seoul | en | 2027-09-01T12:00:00Z | 21:00 | GMT+9 |
| Asia/Seoul | ko | 2027-09-01T12:00:00Z | 21:00 | GMT+9 |
| Asia/Kolkata | en | 2027-09-01T12:00:00Z | 17:30 | GMT+5:30 |
| Asia/Kathmandu | en | 2027-09-01T12:00:00Z | 17:45 | GMT+5:45 |
| Europe/London | en | 2027-09-01T12:00:00Z, in summer time | 13:00 | GMT+1 |
| Europe/London | en | 2027-01-15T12:00:00Z, in winter time | 12:00 | GMT |
| America/St_Johns | en | 2027-09-01T12:00:00Z | 09:30 | GMT-2:30 |
| UTC | en | 2027-09-01T12:00:00Z | 12:00 | GMT |
| America/Los_Angeles | en | 2027-09-01T12:00:00Z | 05:00 | PDT |

**Steps:**

1. Read the close line on the tile.

**Expected Results:**

* The clock reads <local time>.
* The line names <zone name>, the zone's short name in US English at that instant or, where US English has none, its offset in English, whatever the locale.
* The line names neither HKT nor UTC.

<!-- trace:case id=g10.shared-dates-and-times.TC-07a rev=2 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### g10.shared-dates-and-times.US1-TC9-2: A collector clock reads the same text on any machine zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Stated zones

**Decided by:** `packages/date/src/local.test.ts`

**Pre-conditions:**

* The machine's time zone is <machine zone>.
* The preview workbench renders `ListingBidHistoryList` and a closed `AuctionLotCard` with locale en and time zone America/New_York.
* One older row was accepted at 2026-09-01T12:00:00Z, and the tile closes at the same instant.

**Test data:**

| Machine zone | Moment reads | Deadline reads |
| --- | --- | --- |
| Asia/Tokyo, east of UTC | 1 Sep 2026, 08:00 | 1 Sep 2026, 08:00 EDT |
| America/Los_Angeles, west of UTC | 1 Sep 2026, 08:00 | 1 Sep 2026, 08:00 EDT |

**Steps:**

1. Read the older row's moment.
2. Read the close line on the tile.

**Expected Results:**

* Step 1: the moment reads <moment reads>.
* Step 2: the close line reads `Ended` then <deadline reads>.

## Settled

## Reconciliation

**Run:** no blind pass - a carrier repoint for `drop-auction-card`: `AuctionCard` is removed from `shared/ui/auction-listing`, and the cases that used it as a rendered surface now read the same line on a closed `AuctionLotCard`, the tile the catalogue draws. The deciding test, `packages/date/src/local.test.ts`, is unchanged: the tile's close line is the formatter's own output.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| US1-TC3 | Revised as US1-TC3-2, rev 2 | `AuctionCard` precondition repointed to a closed `AuctionLotCard`; clock, zones and deciding test unchanged |
| US1-TC4 | Revised as US1-TC4-2, rev 2 | Same repoint; the rows keep their locales, zones and offsets |
| US1-TC9 | Revised as US1-TC9-2, rev 2 | The machine-zone case keeps its two renderings; the card is now the closed catalogue tile |
