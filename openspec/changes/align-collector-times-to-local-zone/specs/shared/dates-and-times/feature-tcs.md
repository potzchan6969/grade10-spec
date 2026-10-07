# shared/dates-and-times Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-dates-and-times-US1: The zone a date is stated in

**Walked by:** nobody on their own - a format every surface that shows a date inherits; the journeys live in the capabilities that render one

**As a** customer,
**I want** every date I read to be stated in the zone its surface promises,
**so that** I read the same instant the same way wherever it is shown.

<!-- trace:case id=g10.shared-dates-and-times.TC-obo rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC1-1: A collector moment reads in the viewer's own zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders `ListingBidHistoryList` with locale en and time zone <viewer zone>.
* One older row was accepted at 2026-09-01T23:30:00Z.

**Test data:**

| Viewer zone | Offset from UTC | Moment reads |
| --- | --- | --- |
| UTC | +0:00 | 1 Sep 2026, 23:30 |
| Asia/Hong_Kong | +8:00 | 2 Sep 2026, 07:30 |
| America/New_York | -4:00 | 1 Sep 2026, 19:30 |
| Asia/Kolkata | +5:30 | 2 Sep 2026, 05:00 |
| Asia/Kathmandu | +5:45 | 2 Sep 2026, 05:15 |
| Pacific/Kiritimati | +14:00 | 2 Sep 2026, 13:30 |
| Pacific/Pago_Pago | -11:00 | 1 Sep 2026, 12:30 |

**Steps:**

1. Read the older row's moment.

**Expected Results:**

* The moment reads <moment reads>.
* No zone name follows the moment.

<!-- trace:case id=g10.shared-dates-and-times.TC-d4g rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC2-1: A recent activity time reads the same in every zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders `ListingBidHistoryList` with locale en and time zone <viewer zone>.
* One row was accepted 5 minutes ago.

**Test data:**

| Viewer zone |
| --- |
| Asia/Hong_Kong |
| Pacific/Kiritimati |
| Pacific/Pago_Pago |

**Steps:**

1. Read the recent row's time.

**Expected Results:**

* The row reads 5 minutes ago, in relative form.
* The row does not read hours elapsed, or a time in the future.
* No zone name follows the time.

<!-- trace:case id=g10.shared-dates-and-times.TC-fqv rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC3-1: A deadline names the viewer's zone as it stands at its instant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders `AuctionCard` with locale en and time zone America/New_York, closing at <close instant>.

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

1. Read the close line on the card.

**Expected Results:**

* The clock reads <local time>.
* The line names <zone name>.

<!-- trace:case id=g10.shared-dates-and-times.TC-v92 rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC4-1: A deadline outside the HKT and EDT examples names the viewer's zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders `AuctionCard` with locale <locale> and time zone <viewer zone>, closing at <close instant>.

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

1. Read the close line on the card.

**Expected Results:**

* The clock reads <local time>.
* The line names <zone name>, the zone's short name in US English at that instant or, where US English has none, its offset in English, whatever the locale.
* The line names neither HKT nor UTC.

<!-- trace:case id=g10.shared-dates-and-times.TC-e5n rev=1 covers=g10.shared-dates-and-times.SC-v5n,g10.shared-dates-and-times.SC-ufn,g10.shared-dates-and-times.SC-6rx,g10.shared-dates-and-times.SC-7pr -->
### shared-dates-and-times-US1-TC8-1: A message date names GMT+8 and reads the same for every recipient

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Sent messages

**Pre-conditions:**

* An auction email carrying a close time of 2026-09-01T16:30:00Z is sent to a test recipient whose language is <recipient language>.

**Test data:**

| Reader zone | Recipient language |
| --- | --- |
| America/New_York | en |
| Asia/Hong_Kong | en |
| Pacific/Kiritimati | en |
| Asia/Hong_Kong | zh-Hant |

**Steps:**

1. Open the email on a device set to <reader zone>.
2. Read the close time in the email.

**Expected Results:**

* The close time reads 2 Sep 2026, 00:30.
* The close time ends in `GMT+8`.
* The close time does not contain `HKT`.

<!-- trace:case id=g10.shared-dates-and-times.TC-07a rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC9-1: A collector clock reads the same text on any machine zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* The machine's time zone is <machine zone>.
* Storybook renders `ListingBidHistoryList` and `AuctionCard` with locale en and time zone America/New_York.
* One older row was accepted at 2026-09-01T12:00:00Z, and the card closes at the same instant.

**Test data:**

| Machine zone | Moment reads | Deadline reads |
| --- | --- | --- |
| Asia/Tokyo, east of UTC | 1 Sep 2026, 08:00 | 1 Sep 2026, 08:00 EDT |
| America/Los_Angeles, west of UTC | 1 Sep 2026, 08:00 | 1 Sep 2026, 08:00 EDT |

**Steps:**

1. Read the older row's moment.
2. Read the close line on the card.

**Expected Results:**

* Step 1: the moment reads <moment reads>.
* Step 2: the close line reads <deadline reads>.

<!-- trace:case id=g10.shared-dates-and-times.TC-1pn rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC10-1: The lot page's deadline names the viewer's own zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` for one open lot closing at 2027-09-01T12:00:00Z, with locale en and time zone <viewer zone>.

**Test data:**

| Viewer zone | Local time | Zone name |
| --- | --- | --- |
| Asia/Hong_Kong | 20:00 | HKT |
| America/New_York | 08:00 | EDT |

**Steps:**

1. Read the deadline line on the bid card.

**Expected Results:**

* The deadline reads <local time> and names <zone name>.
* The deadline does not name UTC.
* The New York deadline does not contain HKT.

<!-- trace:case id=g10.shared-dates-and-times.TC-0fp rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC11-1: A closed lot reads its close in the viewer's own zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders <surface> for one closed lot that closed at 2027-09-01T12:00:00Z and whose opening time is <opening time>, with locale en and time zone <viewer zone>, so the close shows a clock.

**Test data:**

| Surface | Opening time | Viewer zone | Local time | Zone name |
| --- | --- | --- | --- | --- |
| The catalogue tile's closed line | 2027-08-29T12:00:00Z | Asia/Hong_Kong | 20:00 | HKT |
| The catalogue tile's closed line | 2027-08-29T12:00:00Z | America/New_York | 08:00 | EDT |
| The lot bid card's closed block, at `sm` or wider | 2027-08-29T12:00:00Z | Asia/Hong_Kong | 20:00 | HKT |
| The lot bid card's closed block, at `sm` or wider | 2027-08-29T12:00:00Z | America/New_York | 08:00 | EDT |
| The lot bid card's closed summary line, below `sm` | 2027-08-29T12:00:00Z | Asia/Hong_Kong | 20:00 | HKT |
| The lot bid card's closed summary line, below `sm` | 2027-08-29T12:00:00Z | America/New_York | 08:00 | EDT |
| The lot bid card's closed summary line, below `sm` | not known | Asia/Hong_Kong | 20:00 | HKT |
| The lot bid card's closed summary line, below `sm` | not known | America/New_York | 08:00 | EDT |

**Steps:**

1. Read the close time on <surface>.

**Expected Results:**

* The close time reads <local time>.
* The close time names <zone name>, not UTC.

<!-- trace:case id=g10.shared-dates-and-times.TC-bnl rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC12-1: The page and the email state one close in two zones

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Stated zones

**Pre-conditions:**

* One listing is open for bids and closes at 2027-09-01T12:00:00Z.
* An auction email carrying that close time has been sent to the customer.

**Test data:**

| Viewer zone | Page reads | Email reads |
| --- | --- | --- |
| Asia/Hong_Kong | 20:00 HKT | 1 Sep 2027, 20:00 GMT+8 |
| America/New_York | 08:00 EDT | 1 Sep 2027, 20:00 GMT+8 |

**Steps:**

1. Open the listing's page in a browser set to <viewer zone>.
2. Read the deadline line.
3. Open the auction email in a client set to <viewer zone>.
4. Read the close time in the email.

**Expected Results:**

* Step 2: the deadline reads <page reads>.
* Step 4: the close time reads <email reads>.
* The email's close time is the same text for both viewer zones.

<!-- trace:case id=g10.shared-dates-and-times.TC-g85 rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC13-1: A relative remaining time names no zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with locale en and time zone America/New_York, for <lot state>.

**Test data:**

| Lot state | Remaining time counts down to |
| --- | --- |
| An open lot closing 5 hours from now | the close |
| A scheduled lot opening 5 hours from now | the opening |

**Steps:**

1. Read the remaining time and its label (Time left, or Opens in).

**Expected Results:**

* The remaining time reads the time left until <counts down to>, not a clock time.
* No zone name sits in the remaining time or in its label.

<!-- trace:case id=g10.shared-dates-and-times.TC-of9 rev=1 covers=g10.shared-dates-and-times.SC-dfo,g10.shared-dates-and-times.SC-d40,g10.shared-dates-and-times.SC-fe1 -->
### shared-dates-and-times-US1-TC14-1: A zone the platform does not recognise stops the render

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Refusals

**Pre-conditions:**

* A collector clock renders 2027-09-01T12:00:00Z in English with the time zone <zone>.

**Test data:**

| Zone | What is wrong with it |
| --- | --- |
| Mars/Olympus | A region and a city the platform does not know |
| Hong_Kong | A city with no region |
| America/New York | A space where the underscore belongs |

**Steps:**

1. Render the instant as a local moment.
2. Render the instant as a collector deadline.

**Expected Results:**

* Each step fails with an error that names <zone>.
* No time shows in UTC, or in the machine's zone, in its place.

<!-- trace:case id=g10.shared-dates-and-times.TC-qrd rev=1 covers=g10.shared-dates-and-times.SC-v5n,g10.shared-dates-and-times.SC-ufn,g10.shared-dates-and-times.SC-6rx,g10.shared-dates-and-times.SC-7pr -->
### shared-dates-and-times-US1-TC15-1: A letter's footer names GMT+8

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Sent messages

**Pre-conditions:**

* The <letter> is rendered for a visit at 2026-10-27T07:00:00Z.

**Test data:**

| Letter | Footer line |
| --- | --- |
| Grading drop-off booked letter | `Dates and times are Hong Kong time (GMT+8).` |
| Vault visit booked letter | `Dates and times are in Hong Kong time (GMT+8).` |

**Steps:**

1. Read the time of the visit in the letter.
2. Read the footer's line about dates and times.

**Expected Results:**

* Step 1: the visit reads 15:00 on 27 Oct 2026, Hong Kong time.
* Step 2: the line reads <footer line>.
* The letter is worded in English.

<!-- trace:case id=g10.shared-dates-and-times.TC-1hq rev=1 covers=g10.shared-dates-and-times.SC-v5n,g10.shared-dates-and-times.SC-ufn,g10.shared-dates-and-times.SC-6rx,g10.shared-dates-and-times.SC-7pr -->
### shared-dates-and-times-US1-TC16-1: A day with no clock names no zone

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Sent messages

**Pre-conditions:**

* A saved-plan letter, which states a calendar day and no time, is rendered for a plan whose kept-until instant is 2026-11-19T16:00:00Z, the plan's expiry less 1 ms, so the plan expires at 2026-11-19T16:00:00.001Z.

**Steps:**

1. Read the day the plan is kept until.
2. Read the footer's line about dates and times.

**Expected Results:**

* Step 1: the day reads 20 Nov 2026, the Hong Kong day of that instant.
* Step 1: no zone name follows the day.
* Step 2: the line reads `Dates and times are Hong Kong time (GMT+8).`

<!-- trace:case id=g10.shared-dates-and-times.TC-x7m rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC17-1: The invoice page states GMT+8 for every viewer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Stated zones

**Pre-conditions:**

* An auction order has a sent invoice whose payment deadline is 2026-09-19T09:00:00Z.
* The application's invoice page, `/auction/invoice`, is open for that order and invoice in a browser set to <viewer zone>.

**Test data:**

| Viewer zone |
| --- |
| Asia/Hong_Kong |
| America/New_York |

**Steps:**

1. Read the payment deadline on the invoice page.

**Expected Results:**

* The payment deadline reads 17:00, the Hong Kong clock.
* The payment deadline ends in `GMT+8`.
* The payment deadline contains neither HKT nor EDT.
* The payment deadline is the same text for both viewer zones.

<!-- trace:case id=g10.shared-dates-and-times.TC-xqa rev=1 covers=g10.shared-dates-and-times.SC-q9s,g10.shared-dates-and-times.SC-4uc,g10.shared-dates-and-times.SC-4pe,g10.shared-dates-and-times.SC-egt,g10.shared-dates-and-times.SC-34o,g10.shared-dates-and-times.SC-xyg,g10.shared-dates-and-times.SC-hy6,g10.shared-dates-and-times.SC-jjl,g10.shared-dates-and-times.SC-k76,g10.shared-dates-and-times.SC-upi,g10.shared-dates-and-times.SC-apa,g10.shared-dates-and-times.SC-pi9,g10.shared-dates-and-times.SC-uu7,g10.shared-dates-and-times.SC-loc,g10.shared-dates-and-times.SC-n43,g10.shared-dates-and-times.SC-hl5,g10.shared-dates-and-times.SC-r3c -->
### shared-dates-and-times-US1-TC18-1: A close shown as a day alone names no zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` for one closed lot that closed at 2027-09-01T23:30:00Z and has no opening time, so its closed block shows the close as a day alone, with locale en and time zone <viewer zone>.
* The viewport is `sm` or wider, so the closed block shows its full time column.

**Test data:**

| Viewer zone | Close day reads |
| --- | --- |
| Asia/Hong_Kong | 2 Sep 2027 |
| America/New_York | 1 Sep 2027 |

**Steps:**

1. Read the close under the Closed label in the closed block.

**Expected Results:**

* The close reads <close day>, the viewer's calendar day of the close.
* No zone name follows the day: not HKT, EDT or GMT.

<!-- trace:case id=g10.shared-dates-and-times.TC-hi5 rev=1 covers=g10.shared-dates-and-times.SC-gkv -->
### shared-dates-and-times-US1-TC19-1: An admin surface with no shop's clock of its own states UTC

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Stated zones

**Pre-conditions:**

* An audit trail entry was recorded at 2026-10-07T01:30:00Z: 01:30 on 7 Oct in UTC, 09:30 on 7 Oct in Hong Kong, 21:30 on 6 Oct in New York.
* admin(holds the audit trail's read grant) is on <grade10 admin audit trail url>, on a machine set to America/New_York.

**Steps:**

1. Find the entry recorded at 2026-10-07T01:30:00Z.
2. Read its time.

**Expected Results:**

* Step 2: the entry reads 01:30 on 7 Oct.
* Step 2: the entry does not read 09:30 (Hong Kong) or 21:30 (the machine's zone).

<!-- trace:case id=g10.shared-dates-and-times.TC-6n0 rev=1 covers=g10.shared-dates-and-times.SC-msf -->
### shared-dates-and-times-US1-TC20-1: A collector's vault timeline stamp stays UTC

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Stated zones

**Pre-conditions:**

* <case_1> is a vault case kept at a Hong Kong shop, with a timeline entry recorded at 2026-10-07T01:30:00Z: 01:30 on 7 Oct in UTC, 09:30 on 7 Oct in Hong Kong, 21:30 on 6 Oct in New York.
* customer(owns <case_1>) is on <grade10 vault case url> for <case_1>, on a machine set to America/New_York.

**Steps:**

1. Read the timeline entry recorded at 2026-10-07T01:30:00Z.

**Expected Results:**

* The stamp reads 01:30 on 7 Oct, in UTC.
* The stamp does not read 09:30 (the shop's clock) or 21:30 (the viewer's zone).

## Settled

- Named deadlines is a leaf of the durable Feature set; a delta's Feature set lists only the leaves it adds or changes.
- A collector deadline is a date, a time to the minute and the zone's name on a 24-hour clock, and a local moment reads `DD Mon YYYY, HH:MM` with the month abbreviated; cases assert the clock and the name, never an arrangement of their own.
- Activity time reads relative below seven days and as a local moment from seven days.
- A zone's name is its short name in US English at that instant, in English whatever the language, with HKT for Hong Kong; where US English has no short name it reads as its offset (`GMT+9`, `GMT+5:30`, `GMT-2:30`, London in summer `GMT+1`), and a zone at zero offset reads GMT.
- A collector deadline that shows a clock names the viewer's zone, a closed lot's close time included, and a deadline that shows only a day reads that day in the viewer's zone and names none; a local moment and an older activity row name none.
- A day a collector deadline shows is the viewer's day, as Winner Order's step subtext reads it; the brand's zone is for a day the business judges (a due date, an expiry, a queue, an age, a document's expiry, a report's month), not for a collector deadline. A surface whose own spec fixes its zone keeps it, the loyalty programme's expiry days among them; this change moves none of them and no case here reads them.
- A page that books or confirms a visit, or a vault or signing page, keeps the shop's clock whatever zone the viewer is in; how those pages name the zone is left out of this change, as a follow-up, and a collector's vault timeline stamps stay UTC. This change moves none of those pages, and the only case here that reads one is `shared-dates-and-times-US1-TC20-1`, for that UTC stamp.
- Operator tables, admin surfaces and the records a machine reads, an export or the audit trail, state UTC, except an admin surface whose own spec keeps a shop's clock, as the vault console and the appointments diary do. The audit trail prints its time with no zone after it, so a case asserts the clock, not a label. The vault console's own cases are in `read-vault-console-on-shop-clock`'s operator-queue suite.
- A collector clock given a zone the platform does not recognise stops the render with an error naming it, and a missing zone is a compile error.
- The first paint may read UTC, named GMT, until the browser's zone is known, then it switches; cases read the page once the zone is known.
- Every sent message names GMT+8, the footers of grading and vault letters included. A grading footer reads "Dates and times are Hong Kong time (GMT+8)." and a vault footer, which keeps its own wording, reads "Dates and times are in Hong Kong time (GMT+8)."
- A message for a shop outside Hong Kong still states GMT+8: naming that shop's own zone is for the change that adds such a shop, with its own delta on the message requirement.
- A calendar day a message states with no clock names no zone, because a zone belongs to a clock and the day is the brand's; the footer of a letter that states only a day still names GMT+8 once, and no zone follows the day itself.
- No terms page shows a date with a clock today; the rule binds any that gains one.
- The application's invoice page is the invoice document: it states Asia/Hong_Kong as GMT+8 for every viewer, as the PDF does.
- The appointment-booking blocks keep the shop's clock and their default label, `HKT` for Hong Kong, which a page may replace with its own; how they name the zone is left out of this change, and no case here reads those blocks.
- A grading letter's weekly shop-hours line is not a date or a time of an event and keeps its own wording, the shop's long zone name; the footer's line is the one that names GMT+8.

## Reconciliation

**Run:** QA2 re-run, 2026-10-06, for change `align-collector-times-to-local-zone`, in a fresh context, after the final accept-review's blocker was fixed (`shared-dates-and-times-SC-11` narrowed to a day the business judges and taken to revision 2, because a day-only collector deadline reads the viewer's day; decisions Q20 and Q21, the delta requirement, the tech design, tasks 4.1 and 4.4 and the Settled and Reconciliation rows aligned with it; the booking PRD reworded to match decisions Q27; the kept-until instant of `shared-dates-and-times-US1-TC16-1` clarified) and after decisions Q28, which the planning owner settled by default and the human has not yet answered (a grading letter's shop-hours line keeps its own wording, a recorded non-goal). No new blind reading ran, and QA1 and Dev were not run again: no anchor changed after they read them, so both readings stand. It joined three readings on the anchors: QA1's blind cases from the first run, Dev's delta `spec.md`, `tech-design.md` and `tasks.md` as the editor revised them, and the human's answers (decisions Q5 to Q27, with the Q28 default) as the editor applied them to the proposal, the specs, the design, the tasks, the suites and the PRD pages. QA1, as its run recorded, read the rulebook, the `spec-to-tcs` skill, `writing.md`, `test-traceability.md` and `tcs-conventions.md`, and a bundle of the change's `proposal.md`, `decisions.md` with `## Raised`, `openspec/config.yaml`'s `context`, each capability's `## Purpose` and `## Feature set`, its `user-journeys.md` and its PRD page; it was denied every `## Requirements` section and scenario, `tech-design.md`, `tasks.md`, every other suite, application code and every validator. Dev, as its run recorded, was denied every `feature-tcs.md`, every domain suite, every reconciliation and QA1's output. This pass was not blind and wrote no case. It read the planning skill and the rulebooks whole (`specs-to-test-cases.md`, `tcs-conventions.md`, `test-traceability.md`, `writing.md`, `task-ownership.md`), the change's artifacts, the durable `shared/dates-and-times` spec (the capability holds no suite yet), the durable winner-order clauses on step subtext and the payment deadline, the loyalty programme's clause on dates it computes, the touched PRD pages as a diff against `HEAD`, the store's `packages/ui` formatter, closed block, PDF label and stories and `apps/emails` and, read-only, the application's date utilities and their test, auction email port and render, grading and vault catalogues and letter formats, Winner Order view, invoice page, My Auctions page and the saved-plan letter's kept-until derivation. It opened the verifier named for `shared-dates-and-times-SC-10` and `shared-dates-and-times-SC-11`, `grade10:packages/utils/test/dates.test.ts` at the application's main (`4a3cda058`), and found `one zone, for every reader` and `a day belongs to a clock, and the caller names it` there, the second reading right for `shared-dates-and-times-SC-11` as narrowed to a day the business judges. It re-derived the values the cases state (the clocks, the zone names, the clock-change instants, the Hong Kong day of the kept-until instant and its one-millisecond edge, and the Hong Kong and New York day of 2027-09-01T23:30:00Z) from Node's `Intl` and found them as written. It ran `pnpm run tcs:validate` on this scope, plain and with `--strict`, with no findings; `pnpm run trace validate` on the working tree and on a clean `git archive HEAD` export, where the only new issues are the delta-against-durable duplicate-id pairs (seven scenario ids of this spec and the `shared-ui-auction-listing-US1-TC11-1` case); `openspec validate --strict`; `pnpm check:manual`, with no failures and no warning naming this change; `accept-preflight`; a fold of all three deltas in a scratch copy of the store, read against the durable files (every kept marker byte-identical but for revision 2 on `shared-dates-and-times-SC-11` to `shared-dates-and-times-SC-14`, every durable heading verbatim, `tcs:validate --require-suites` clean on the folded copy); and the store's node-lane tests for the formatter, PDF and `AuctionCard` files (39 pass) and the `@grade10/ui` type check. It ran none of the application's tests and did not run the story lane. It changed this line and one row of this Reconciliation (the delta's Purpose, which said the brand's-day sentence was kept word for word, while the narrowing reworded it) and no other line in this file. No domain, product or platform suite sits above this capability (the proposal records no domain and no platform impact), so no scenario is covered at domain. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| TC1: a collector moment reads in the viewer's zone, in seven offset classes, no zone name after it | **Agreed:** `shared-dates-and-times-SC-23` and the older half of `shared-dates-and-times-SC-24`. QA2 restyled the values from `1 September 2026` to `1 Sep 2026`: the requirement and `shared-dates-and-times-SC-24` state the shape `DD Mon YYYY, HH:MM` and the formatter abbreviates the month. QA1 flagged the overlap with durable `shared-ui-auction-listing-US1-TC11-1`; kept, because its rows are the offset partitions (zero, whole, half-hour, quarter-hour, date-line crossing) the listing case never reads, and its Hong Kong row reads a different instant |
| TC2: a recent row reads relative in every zone | **Agreed:** the recent half of `shared-dates-and-times-SC-24`. **Trimmed:** the New York row, the same partition as Hong Kong; the far-east and far-west rows stay, the offsets most likely to read a recent row as hours elapsed or as a future time. Durable `shared-ui-auction-listing-US1-TC11-1` reads the recent row in two zones and owns the locale |
| TC3: a deadline names the zone in force at its instant, across both clock changes | **Agreed:** `shared-dates-and-times-SC-30`, whose September and January closes joined as rows. **Trimmed:** the Hong Kong row, which repeats the Hong Kong line durable `shared-ui-auction-listing-US1-TC55-1` already walks. QA1 flagged the `AuctionCard` vehicle against TC55; kept, because TC55 reads one instant, in summer, and none of the clock changes |
| TC4: Seoul, Kolkata and Kathmandu deadlines name the viewer's zone | **Unblocked:** the human answered (decisions Q5, see Settled). **Rows added:** `shared-dates-and-times-SC-33` states the rule; the rows read `GMT+9` for Seoul in English and in Korean, `GMT+5:30`, `GMT+5:45`, `GMT+1` for London in summer, and `PDT` for Los Angeles, which is a regional short name and not an offset. The Korean row proves the name stays English. **Restated after the second re-run:** decisions Q18 makes the name decidable by reference to US English (its short name, `HKT` for Hong Kong, an English offset where it has none, `GMT` at zero offset); **rows added:** America/St_Johns (`GMT-2:30`) and UTC (`GMT`), which the rule implies; `shared-dates-and-times-SC-33` keeps Seoul. **Row added after accept-review:** Europe/London in winter (`GMT`), so the zero-offset claim has a row for a zone that is not UTC; the instant became a column, since one instant cannot be both summer and winter, and the values were read with `Intl` |
| TC5: the viewer's language does not choose the zone of the clock | **Dropped:** the same steps on the same block as durable `shared-ui-auction-listing-US1-TC11-1`, which already supplies a locale and a zone together; its rows (Traditional Chinese with New York, with Kiritimati, English with Tokyo) joined that case. No scenario states the claim beyond the requirement's "month names from `locale`" and the viewer's `timeZone` |
| TC6: an invoice's sent-at row reads Hong Kong time and `GMT+8` for every machine zone, winter and summer | **Dropped:** `shared-ui-invoice-and-receipt-pdf-SC-43` is the PDF capability's and durable `shared-ui-invoice-and-receipt-pdf-US1-TC41-1` walks it; the machine zone is one partition, "not set to Hong Kong time". Its acceptance duty and its day-rollover rows pass to `shared-ui-invoice-and-receipt-pdf-US1-TC49-1`. Its `1 September 2026` and `2 September 2026, 00:30` values assumed an arrangement the PDF does not draw (it draws `September 2, 2026, 00:30 GMT+8`) |
| TC7: one instant reads HKT on a tile and `GMT+8` on an invoice | **Dropped:** every assertion repeats a case here or in the PDF suite, and no scenario states a tile against a PDF. `shared-dates-and-times-SC-13` states the page against the email, now `shared-dates-and-times-US1-TC12-1` |
| TC8: an auction email's close names `GMT+8` and reads alike for every recipient | **Agreed:** `shared-dates-and-times-SC-15`, `shared-dates-and-times-SC-16`. QA2 named the message (an auction email carrying a close) and restyled the date to `2 Sep 2026, 00:30`, the platform's deadline shape |
| Raised: must every sent message name GMT+8, and does a grading letter, which names its zone once in the footer, count | **Landed:** decisions Q8. **Folded in:** `shared-dates-and-times-SC-35`, since a letter's dates carry no suffix and the requirement was silent on a footer that names the zone once. **Case added:** `shared-dates-and-times-US1-TC15-1`, a drop-off booked letter, whose footer line reads `Dates and times are Hong Kong time (GMT+8).` The grading notifications spec already says the footer "says so" and is not edited; its PRD page gains a work-in-progress line |
| Raised: do vault letters, whose footer names the zone once, move to GMT+8 with the other sent messages | **Landed:** decisions Q17. **Folded in:** `shared-dates-and-times-SC-35`, which now reads a grading letter or a vault letter. **Case extended:** `shared-dates-and-times-US1-TC15-1` runs once per letter and gains a vault visit booked letter, whose footer line reads `Dates and times are in Hong Kong time (GMT+8).` The vault collector notifications spec says what a footer names, the party and the complaints contact, and nothing of a zone, so it is not edited |
| Raised: does a calendar day with no clock, in a message or a document, name GMT+8 | **Landed:** decisions Q12. **Folded in:** `shared-dates-and-times-SC-36` and a clause on the message requirement. **Case added:** `shared-dates-and-times-US1-TC16-1`, a saved-plan letter whose kept-until day crosses the Hong Kong midnight. The documents' date rows all carry a clock, so the PDF capability moves nothing |
| `shared-dates-and-times-SC-31`: no case varies the machine's zone for a collector clock | **Case added:** `shared-dates-and-times-US1-TC9-1`, both renderings the scenario names (a local moment and a deadline) on one machine east and one west of UTC |
| `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-29`: two viewers read one close on the lot page; no case here reads the bid card | **Case added:** `shared-dates-and-times-US1-TC10-1`, moved from QA1's listing TC56 with its tile step dropped (durable TC55 walks the tile). The spec that states the behaviour owns the case |
| `shared-dates-and-times-SC-14`: a closed listing names the viewer's zone | **Unblocked:** the human answered (decisions Q6, see Settled). `shared-dates-and-times-US1-TC11-1` walks the tile's closed line and the bid card's closed block, which names no zone today; the group that builds it cites the scenario and the case. **Clarified after the second re-run:** decisions Q20. The case reads the clock form, with the open time known; `shared-dates-and-times-SC-14` now reads "with a clock". **Revised after accept-review:** `shared-dates-and-times-SC-14` takes revision 2, since its meaning narrowed to a close that shows a clock and to the page once the viewer's zone is known; the day-alone form is `shared-dates-and-times-SC-38`'s, read by `shared-dates-and-times-US1-TC18-1` |
| `shared-dates-and-times-SC-13`: the page and the email for one close | **Case added:** `shared-dates-and-times-US1-TC12-1`. **Revised after accept-review:** the scenario said the page states the viewer's local moment, which names no zone, while the case reads `20:00 HKT`; it now says the page states the close as the viewer's deadline, in the viewer's zone and naming it, and takes revision 2. The case already read that, so it keeps its revision and its rows |
| Requirement clause with no scenario and no case: relative remaining time (Ends in, Opens in) carries no zone | **Folded in:** `shared-dates-and-times-SC-32`, for the sentence the durable requirement already states and the PRD repeats. **Case added:** `shared-dates-and-times-US1-TC13-1`, an open and a scheduled lot |
| `shared-dates-and-times-SC-10`, `shared-dates-and-times-SC-11`: operator tables read UTC, a day the business judges near midnight reads the brand's | **Out of suite:** `grade10:packages/utils/test/dates.test.ts` in the application repository (`one zone, for every reader` and `a day belongs to a clock, and the caller names it`). This change moves `shared-dates-and-times-SC-10` not at all, and narrows `shared-dates-and-times-SC-11` to a day the business judges, as the row on its narrowing says: the operator tables and the brand's judged day are its non-goals |
| Raised: which name a zone with no regional abbreviation carries, and whether the name follows the reader's language | **Landed:** decisions Q5. **Folded in:** a sentence on the deadline requirement and `shared-dates-and-times-SC-33`; the built formatter already reads `GMT+9` for Seoul, always in English, and the offsets of Kolkata, Kathmandu and London in summer follow |
| Raised: the frozen anchors hold no leaf for naming the viewer's zone on a deadline | **Rejected:** Named deadlines is in the durable Feature set; the delta's Feature set lists the leaves it changes. Whether naming is mandatory was put to the human and landed as decisions Q6 |
| Raised: what shape a collector deadline takes (hours, month words, seconds) | **Rejected:** the platform shape fixes a deadline as a date, a time to the minute and the zone's name, and a local moment as `DD Mon YYYY, HH:MM`; the cases assert the clock and the name |
| Raised: at what age a recent row becomes a local moment | **Rejected:** `shared-dates-and-times-SC-24` and its requirement say seven days; the store's `format-datetime.test.ts` holds the cap (`is false inside the cap and true at the boundary`) |
| Raised: what a collector surface does with no viewer zone, or an unreal one | **Landed:** decisions Q10. **Folded in:** a sentence on the zone requirement and `shared-dates-and-times-SC-34`. **Case added:** `shared-dates-and-times-US1-TC14-1`, three unreal zones. The built formatter fails with the platform's own `Invalid time zone specified: <zone>`; a missing zone is refused by the required `timeZone` input, held by the store's type check |
| Raised: which terms-page date carries a clock | **Landed:** decisions Q13, none today. No case and no scenario are written; the rule binds any terms page that gains a clock |
| Raised: are the appointment-booking blocks' zone labels meant to change | **Landed:** decisions Q16: the blocks keep the shop's clock and their default label, `HKT` for Hong Kong, and how they name the zone is left out (decisions Q27); no scenario or case here. The booking PRD page records it |
| Raised: do the catalogue tile, My Auctions, Winner Order and the invoice page move onto the viewer's zone in this change | **Landed:** decisions Q7. No scenario or case is added: the application group cites `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-14` and `shared-dates-and-times-SC-29`, and the surfaces' own durable specs already say the viewer's zone |
| Dev questions: viewer zone name, scope of application surfaces, grading letter footer, mandatory naming, appointment-booking label, the home of `shared-dates-and-times-SC-29` | **Merged** with the rows above; every one landed in `decisions.md` as Q5 to Q8 and Q16. `shared-dates-and-times-SC-29` stays under its durable requirement: an id is permanent and no reader depends on the home |
| Raised: machine zone versus stated zone (first run) | **Landed:** decisions Q1. The viewer's zone is supplied as `timeZone` and never read from the machine. **Folded in:** the zone requirement's `timeZone` clause and `shared-dates-and-times-SC-31`. **Case added:** `shared-dates-and-times-US1-TC9-1` |
| Raised: HKT versus GMT+8 on documents (first run) | **Landed:** decisions Q3, with Q4 for mail and paper sharing one label. The deadline requirement names GMT+8 on an invoice, a receipt, a terms page and an email. **Cases:** `shared-dates-and-times-US1-TC8-1` for messages; the documents' own rows are in the `shared/ui/invoice-and-receipt-pdf` suite |
| Raised: what rule decides the name a collector deadline carries, and what a zone at zero offset reads | **Landed:** decisions Q18. **Folded in:** the deadline requirement's naming paragraph, the `Offset names` leaf and the tech design's first decision. `shared-dates-and-times-SC-33` stays as written; `shared-dates-and-times-US1-TC4-1` gained rows |
| Raised: does the application's invoice page read the viewer's zone, or Hong Kong's as the invoice PDF does | **Landed:** decisions Q19. **Folded in:** `shared-dates-and-times-SC-37`, a clause on the zone requirement and on the deadline requirement, and the `Documents as GMT+8` leaf. **Case added:** `shared-dates-and-times-US1-TC17-1`. The durable winner-order spec and its PRD name Winner Order and the invoice PDF only, so nothing in them says otherwise and neither is edited |
| Raised: does a collector deadline that shows only a day name a zone | **Landed:** decisions Q20, narrowed by Q21. **Folded in:** a sentence on the deadline requirement and on the listing requirement's closed block; `shared-dates-and-times-SC-14` reads "with a clock". **Added after accept-review:** the rule had a requirement and no scenario, so `shared-dates-and-times-SC-38` states it for the lot page's closed block and `shared-dates-and-times-US1-TC18-1` reads it, for a Hong Kong and a New York viewer across the date line. The case traces Stated zones, so the ten cases that trace it gained the scenario in `covers` |
| Raised: which collector clocks name a zone, every clock or only a deadline | **Landed:** decisions Q21: deadlines only. **Folded in:** the deadline requirement (a local moment and an older activity row are not deadlines and name none), the `Named deadlines` leaf and Settled. No scenario or case moves: `shared-dates-and-times-US1-TC1-1`, `shared-dates-and-times-US1-TC2-1` and durable `shared-ui-auction-listing-US1-TC11-1` already read no zone name after a local moment or an older row |
| Raised: does a page that books or confirms a visit, or a vault or signing page, read in the viewer's zone or in the shop's | **Landed:** decisions Q22: the shop's clock; how those pages name the zone is left out, decisions Q27. **Folded in:** the exception sentence on the zone requirement and the deadline requirement, and the `Shop's clock` leaf. No scenario or case is added: this change moves none of those pages, and durable `grade10-site-grading-dropoff-booking-SC-04` reads the drop-off's times in the shop's own zone. Those pages name the zone no one way today (an unnamed Hong Kong clock on the drop-off cut-off lines, the joined-visit time and the vault visit time, and the booking blocks' default label, `HKT` for Hong Kong); one name for it is a follow-up the tech design records |
| Accept-review: a message that states only a day, against the rule that a day names no zone, and the rule that every message names `GMT+8` | **Clarified:** decisions Q12 now says the footer of a day-only letter still names `GMT+8` once and no zone follows the day itself; `shared-dates-and-times-SC-36` is unchanged |
| Accept-review: `shared-dates-and-times-SC-35` named the footers by meaning, while `shared-dates-and-times-US1-TC15-1` and the tasks hold the literal lines | **Restated:** the scenario now holds both literal footers, `Dates and times are Hong Kong time (GMT+8).` for a grading letter and `Dates and times are in Hong Kong time (GMT+8).` for a vault letter. Id, marker and revision kept: the scenario is new in this change |
| Accept-review: revisions of the scenarios and cases whose meaning changed | **Revised:** `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-13` and `shared-dates-and-times-SC-14` take revision 2 in their markers; no case or scenario carries an acceptance link yet, and the fold keeps a marker by its id. Durable `shared-ui-auction-listing-US1-TC11-1` keeps revision 1: it is a draft, a result joined it, and a draft keeps its revision. The cases of this suite are new, so they start at revision 1 |
| Second re-run: a first paint in UTC before the browser's zone is known | **Folded in:** a sentence on the deadline requirement (a deadline MAY read UTC named `GMT` and SHALL switch once the zone is known), as decisions Q11 settled. No scenario of its own: the cases read the page once the zone is known, and the WHEN of `shared-dates-and-times-SC-12`, `shared-dates-and-times-SC-13` and `shared-dates-and-times-SC-14` says so |
| Second re-run: the delta restated two requirements and a Feature set leaf the durable spec already holds word for word | **Removed:** the local-moment requirement, the activity-time requirement and the `Reader zone for collectors` leaf. Their scenarios stay in the durable spec and the cases here keep tracing them |
| Contradictions between QA1's cases and Dev's scenarios | **Contradicted:** none. QA1 wrote `1 September 2026` while the requirement states `DD Mon YYYY, HH:MM`, but QA1 had raised the shape as open and asserted the clock; restyled, not overruled. Dev's own text disagreed with itself in two places, which Q6 settled: the deadline requirement now says a collector deadline names the zone, as three scenarios and the Feature set already did |
| tech-design.md against the scenarios and the PRD | **Joined:** Decision 10 accepts a UTC first paint (`GMT`) before the browser's zone is known (decisions Q11). `shared-dates-and-times-SC-12` and `shared-dates-and-times-SC-14` now read once the viewer's zone is known, so no scenario contradicts it |
| Raised: does a deadline that shows only a day, on a page that keeps the shop's clock, name a zone, and which pages are shop-clock pages | **Landed:** decisions Q23, with Q25 for the pages: wherever a zone is named it follows a clock and never a day alone, because a zone belongs to a clock. **Folded in:** a sentence on the deadline requirement, for a deadline in the viewer's zone, the `Named deadlines` leaf and Settled; the vault PRD's Clocks line narrows to a deadline that shows a clock. The naming paragraph that follows the viewer's name now opens "A viewer's zone name" instead of "That name", so the shop's zone is not bound to the viewer's naming rule; after decisions Q27 no sentence of the requirement says what a shop's page names. No scenario or case is added: this change moves none of the shop-clock pages and no case here reads them, as for decisions Q22 |
| Raised: does mail for a shop outside Hong Kong name that shop's zone, or GMT+8 | **Landed:** decisions Q24, a non-goal. Every message states `Asia/Hong_Kong` as `GMT+8`; the change that adds a shop outside Hong Kong owes its own rule, as its own delta on the message requirement. Nothing here moves and the other change is not edited. Recorded in Settled |
| Raised: are the shop-clock pages a list of pages, or decided by who sets a deadline | **Landed:** decisions Q25, a list: a page that books or confirms a visit, or a vault or signing page. **Folded in:** the exception sentence on the zone requirement and on the deadline requirement (the closed lot's close needs no carve-out any more), the Purpose, the `Shop's clock` leaf, Settled and the PRD's `Shop's clock` line. Winner Order's payment and address-confirmation deadlines stay collector deadlines in the viewer's zone (decisions Q7). No scenario or case is added: this change moves none of the shop-clock pages and no case here reads them |
| Raised: does this change promise how a page that books or confirms a visit, or a vault or signing page, names the shop's zone, or only that it keeps the shop's clock | **Landed:** decisions Q27, a non-goal: those pages keep the shop's clock, and how they name the zone is left out, as a follow-up. **Folded in:** the Purpose, the zone requirement, the deadline requirement and the `Shop's clock` and `Named deadlines` leaves no longer say a shop's page names its zone, and a vault timeline stamp stays UTC; the dates PRD's `Shop's clock` line and Product decisions say the same. The drop-off cut-off lines, the joined-visit time and the vault visit time print an unnamed Hong Kong clock today, and the booking blocks' default label is `HKT` for Hong Kong; none of it moves here. No scenario or case is added or changed: no case here reads those pages. Recorded in Settled |
| Third re-run: the delta's Purpose | **Written:** the Purpose the fold composes differs from the durable one, so the delta carries a `## Purpose` that replaces it whole. It keeps the durable first two paragraphs word for word and rewrites the paragraph after them: the zone is the one the page is given and never read from the machine, a deadline that shows a clock names it, a shop's page keeps the shop's clock, the invoice page is a document, the brand's-day sentence reads "a calendar day the business judges" (after the narrowing of `shared-dates-and-times-SC-11`), and the day a collector deadline shows is the viewer's |
| Third re-run: the calendar-day sentence of the zone requirement | **Reworded:** the durable sentence says a surface that states a calendar day SHALL name the brand's zone; decisions Q12 says a date with no clock names no zone, so the sentence now says a surface that judges a calendar day SHALL keep using the brand's zone. The brand's judged day is unchanged; the verb "name" left the sentence, and the next row says how the sentence and `shared-dates-and-times-SC-11` narrowed after accept-review. This row is the source for the acknowledgement of the changed sentence at archive |
| Third re-run: decisions Q12 says the footer of a letter that states only a day still names `GMT+8`, while `shared-dates-and-times-SC-35` read only a letter with a date and a time | **Widened:** the scenario's GIVEN reads a letter that states a date and a time, or only a calendar day; the time is stated in Asia/Hong_Kong where the letter states one, and the footer lines are unchanged. `shared-dates-and-times-US1-TC16-1`, the day-only saved-plan letter, gains the footer line as a result. Id, marker and revision kept: the scenario and the case are new in this change, no test accepts either, and a draft keeps its revision when a result joins it |
| Third re-run: `shared-dates-and-times-SC-38` named the day-alone form without the condition that produces it, and the compact summary line shows a clock without an opening time | **Stated:** the GIVEN reads a lot page at full width with no opening time known, the one case where the closed block shows the day alone. `shared-dates-and-times-US1-TC18-1` already reads it at `sm` or wider. Below `sm` the summary line always shows a clock and so always names the zone: `shared-dates-and-times-US1-TC11-1` gained a Viewport in its Surface column and an Opening time column, and reads the summary line with the opening time known and not known. Id, marker and revision kept for both, for the reason on the row above |
| Third re-run: the application's invoice page has no spec and no page of its own, and the case did not name it | **Named:** the page is the application's `auctionInvoice` surface at `/auction/invoice`, read in the application's surface list. No capability spec or PRD page describes it (the winner-order spec names the invoice PDF control, not this page), so `shared-dates-and-times-SC-37` and `shared-dates-and-times-US1-TC17-1` are its whole contract. Its Manual row stays |
| Third re-run: tech-design decision 11 had the invoice page take `GMT+8` from the store's collector deadline formatter, which names Hong Kong `HKT` | **Joined:** the page passes the brand zone to the application's own `formatDeadline` and `formatDay`, which the date-fns token prints as `GMT+8`, as the auction emails do. The rendered text is unchanged, so no scenario or case moves; `shared-dates-and-times-SC-37` and `shared-dates-and-times-US1-TC17-1` hold it |
| Accept-review: `shared-dates-and-times-SC-11` read a day on a brand's surface and so contradicted `shared-dates-and-times-SC-38`, tasks 4.1 and 4.4 and the durable winner-order step subtext, which read a collector deadline's day in the viewer's zone | **Narrowed:** the scenario's WHEN reads a day the business judges (a due date, an expiry, a queue, an age, a document's expiry, a report's month) and the scenario takes revision 2; its heading, its `Serves` line and its marker id are kept. The zone requirement's calendar-day paragraph names the same list and says the day a collector deadline shows is the viewer's, and the deadline requirement says a deadline that shows only a day states that day in the viewer's zone and names none. Decisions Q20 and Q21 carry it, with no new row. No case moves: the cases list the scenario in `covers` only through their Stated zones trace and none reads it, so they keep revision 1, as they did when `shared-dates-and-times-SC-12` to `shared-dates-and-times-SC-14` took revision 2. The meaning changes for no surface but a collector deadline's day: a message's day (`shared-dates-and-times-SC-36`), a document's date (the PDF suite), an operator table (`shared-dates-and-times-SC-10`) and the judged days of `shared-dates-and-times-SC-25` to `shared-dates-and-times-SC-28` keep their own scenarios. This row is the source for the acknowledgement of the changed scenario at archive |
| Accept-review: a grading letter's footer reads `GMT+8` while the shop-hours line the application builds still ends in `Hong Kong Standard Time` | **Landed:** decisions Q28, a non-goal: a weekly shop-hours schedule is not a date or a time of an event, so the line keeps its own wording and the footer's line is the one that names GMT+8. Nothing here moves and no scenario or case reads the hours line; the tech design's Decision 8 holds the reason. Recorded in Settled |
| Accept-review: `shared-dates-and-times-US1-TC16-1` seeded a plan "kept until 2026-11-19T16:00:00Z" and expected `20 Nov 2026`, while the application derives the kept-until day from the plan's expiry less 1 ms | **Restated:** the pre-condition names 2026-11-19T16:00:00Z as the kept-until instant, the expiry less 1 ms, so the plan expires at 2026-11-19T16:00:00.001Z and the day still reads 20 Nov 2026, the Hong Kong day. Expected results, scenario, id and revision kept; task 3.1 carries the seed |
| Raised: does a surface whose own spec already fixes its zone, such as the loyalty programme's expiry days, read a day-only collector deadline in the viewer's zone, or keep its own | **Landed:** decisions Q29: it keeps its own, and the viewer's day for a day-only collector deadline applies where no spec says otherwise. **Folded in:** a clause on the deadline requirement and on the zone requirement's sentence on a collector deadline's day, the dates PRD's `Viewer local` and `Other Surfaces` lines, the tech design's Decisions 4 and 11, the proposal's Impact and this suite's Settled. The loyalty programme keeps its expiry days on the programme's zone, as its durable spec and its profile page say; this change reads, edits and tests none of it. No scenario or case is added or changed: no case here reads a loyalty page. The human also confirmed decisions Q28, which the run line above records as settled by default; the Q28 row above stands. This row is the source for the acknowledgement of the changed sentences at archive |
| Extension: the admin surface carve-out moved here from `read-vault-console-on-shop-clock` (decisions Q30) | **Folded:** `shared-dates-and-times-US1-TC19-1` traces `shared-dates-and-times-SC-39`'s operator-table half and `shared-dates-and-times-US1-TC20-1` traces `shared-dates-and-times-SC-40`'s collector half, with the trace ids that change's reconciliation gave them; the console halves are `grade10-admin-vault-operator-queue-US25-TC1-1` in that change. **Trimmed:** TC19's result that the entry names Coordinated Universal Time, because the audit trail prints its time with no zone after it |
| Extension: that change's blind case `shared-dates-and-times-US1-TC21-1`, a collector's vault page keeping the shop's clock in any viewer zone | **Rejected:** the console carve-out does not move a collector's page, which is a non-goal there, and Settled says this change moves none of those pages |

**Uncovered anchors:** Reading shapes, Format and language and Typed calendar days, and the brand's day leaf of Stated zones. This change does not touch them and this is the capability's first suite, so no case traces them and none is added here. They are left to a suite backfill: no change in the store lists this capability for one yet, and after the fold `pnpm check:manual` warns on `shared-dates-and-times-SC-01` to `shared-dates-and-times-SC-07`, `shared-dates-and-times-SC-17` to `shared-dates-and-times-SC-22` and `shared-dates-and-times-SC-24`. The brand's day scenarios, `shared-dates-and-times-SC-25` to `shared-dates-and-times-SC-28` (a loan term, a queue cut, an age, an expiry), sit in the covers of the Stated zones cases but no case here reads any of them, and this change moves none of them. TC1 and TC2 read the older and the recent halves of `shared-dates-and-times-SC-24` but trace Stated zones, which that scenario does not serve. The Documents as GMT+8 leaf's terms half has no case: no terms page shows a date with a clock today (decisions Q13); its invoice page is walked by `shared-dates-and-times-US1-TC17-1` and its invoice and receipt PDFs by the `shared/ui/invoice-and-receipt-pdf` suite.

### Manual

| Manual | Why |
| --- | --- |
| `shared-dates-and-times-US1-TC8-1` | A person opens the auction email in a mail client set to each reader zone and reads the close time, to be walked in task 5.1's walk; the application's email test (task 3.1) is to decide the rendered string, not what a client shows |
| `shared-dates-and-times-US1-TC12-1` | A person opens the deployed listing page and the auction email for one lot in a browser and a client set to each viewer zone, to be walked in task 5.1's walk |
| `shared-dates-and-times-US1-TC17-1` | A person opens the invoice page (`/auction/invoice`) in a browser set to each viewer zone and reads the payment deadline, to be walked in task 5.1's walk; the application's page test (task 4.1) is to decide the rendered string, not what a browser set to each zone shows |
