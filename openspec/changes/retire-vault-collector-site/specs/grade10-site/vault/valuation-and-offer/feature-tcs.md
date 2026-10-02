# grade10-site/vault/valuation-and-offer Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-valuation-and-offer-US2: Collector answers an offer from their own phone

**As a** collector,
**I want** to accept or decline the offer on my case wherever I am reading it,
**so that** I can say yes before I come in, or say no and still be offered
something else.

### grade10-site-vault-valuation-and-offer-US2-TC1-2: The collector accepts the live offer as an act on their own case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case holding `<offer_1>`, with `<visit_1>` booked on it, read at `<read instant>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_1>` | A live offer of 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term, open 7 days from when it was made |

**Steps:**

1. Accept `<offer_1>` as an act on the collector's own case, naming it and `<read instant>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted, and its answer carries `<case_1>` as `accepted`.
* Step 2 reads `<case_1>` `accepted`, `<offer_1>` accepted, `<visit_1>` as it was, no other visit booked, and nothing owed.

### grade10-site-vault-valuation-and-offer-US2-TC2-2: The collector declines the live offer and the request stays open

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case, holding `<offer_1>`, with `<visit_1>` booked on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_1>` | A live offer of 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term, open 7 days from when it was made |

**Steps:**

1. Decline `<offer_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<offer_1>` closed as declined by the collector.
* Step 2 reads `<case_1>` `under_valuation`, with `<visit_1>` still booked.

### grade10-site-vault-valuation-and-offer-US2-TC3-2: An accept a minute before the offer runs out is taken

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case holding `<offer_1>`, whose expiry is `<expiry>`.
* The clock reads 1 minute before `<expiry>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_1>` | A live offer of 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term, open 7 days from when it was made |

**Steps:**

1. Accept `<offer_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<case_1>` `accepted`.

### grade10-site-vault-valuation-and-offer-US2-TC4-2: An answer after the offer ran out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case, holding `<offer_1>` with a visit booked, whose expiry is `<expiry>`.
* The clock reads 1 minute after `<expiry>`, and the expiry sweep has run as the row says.

**Test data:**

| Answer | Expiry sweep | Step 1 | Step 2 reads |
| --- | --- | --- | --- |
| Accept | not yet run | Refused by name: the offer ran out | `<case_1>` at `offer_made`, `<offer_1>` run out |
| Decline | not yet run | Accepted: the decline has no expiry check | `<offer_1>` closed as `declined_by_customer`, `<case_1>` back at `under_valuation` |
| Decline | run | Refused by name, `NO_OPEN_OFFER` | `<case_1>` as the sweep left it |

**Steps:**

1. Give the row's answer to `<offer_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is answered as the row says.
* Step 2 reads what the row's last column says.

### grade10-site-vault-valuation-and-offer-US2-TC5-2: An answer on a case that moved under it is refused by name

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case, holding `<offer_1>`; after the collector's last read, staff moved it as the row says.

**Test data:**

| Staff's move |
| --- |
| Accepted `<offer_1>` at the counter |
| Called the request off |

**Steps:**

1. Accept `<offer_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name, naming that the case moved.
* Step 2 reads `<case_1>` as the row's move left it.

### grade10-site-vault-valuation-and-offer-US2-TC6-2: A collector cannot answer another collector's offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer A holds `<case_1>`, a financed case holding `<offer_1>`.
* customer B holds a session on <grade10 site url> and acts through the vault's API, with no site page.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_1>` | A live offer of 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term, open 7 days from when it was made |

**Steps:**

1. As customer B, accept `<offer_1>`.
2. As customer A, ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused, and the response carries none of `<case_1>`'s facts.
* Step 2 still reads `<offer_1>` live.

### grade10-site-vault-valuation-and-offer-US2-TC7-2: The collector's read of the offer carries its terms, its valuation and the day to answer by

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case, valued at `<valuation>`, holding `<offer_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<valuation>` | 2,500,000 HKD minor units |
| `<offer_1>` | A live offer of 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term, open 7 days from when it was made |

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Read the API response.

**Expected Results:**

* Step 2 carries the principal, the interest for the whole term, the term in days, the total to repay, what a late day costs and the day to answer by.
* Step 2 carries `<valuation>` as what the offer was judged against.
* Step 2 carries no due date.

### grade10-site-vault-valuation-and-offer-US2-TC8-1: Going back from a confirmation leaves the offer live

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case carrying `<offer_1>`.

**Test data:**

| Pressed | Confirmation |
| --- | --- |
| Accept this offer | Yes, accept |
| Decline this offer | Yes, decline |

**Steps:**

1. Press the row's button.
2. Press Go back.

**Expected Results:**

* The confirmation closes and the row's answer is not sent.
* `<offer_1>` is still live, with Accept this offer and Decline this offer
  on it.

### grade10-site-vault-valuation-and-offer-US2-TC9-2: The same accept sent twice lands once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case, holding `<offer_1>`, read at `<read instant>`.

**Steps:**

1. Accept `<offer_1>`, naming `<read instant>`.
2. Send the same accept again.
3. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted, and its answer carries `<case_1>` as `accepted`.
* Step 2 is refused by name.
* Step 3 reads `<case_1>` `accepted` once, with one accepted `<offer_1>` and nothing else changed by step 2.

### grade10-site-vault-valuation-and-offer-US2-TC10-2: The day to answer by reads on own cases only while the offer is open

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case, holding `<offer_1>`, which expires at `<expiry>`.

**Steps:**

1. With the clock 1 day before `<expiry>`, ask for the collector's own cases.
2. With the clock 1 minute after `<expiry>`, ask for the collector's own cases again.

**Expected Results:**

* Step 1 carries `<case_1>` with `<expiry>` as its day to answer by.
* Step 2 carries `<case_1>` with no day to answer by.

### grade10-site-vault-valuation-and-offer-US2-TC11-2: An accept after the offer ran out under the reader is refused as run out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector read `<case_1>` at `<read instant>`, holding `<offer_1>` live, whose expiry is minutes after `<read instant>`.
* `<offer_1>`'s expiry has since passed.

**Steps:**

1. Accept `<offer_1>`, naming `<read instant>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name, as an offer that ran out.
* Step 2 reads `<case_1>` at `offer_made`, `<offer_1>` run out.

---

## grade10-site-vault-valuation-and-offer-US5: Collector reads and answers an offer that replaced the last

**As a** collector whose offer was replaced by a new one,
**I want** the page to say the old offer is gone and show the new one's terms
with Accept and Decline on it,
**so that** I answer the offer that stands and never the one that was
withdrawn.

### grade10-site-vault-valuation-and-offer-US5-TC1-2: The collector's own read names the replaced offer closed and the live one's terms

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case; staff replaced `<offer_1>` with `<offer_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_1>` | 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term |
| `<offer_2>` | 900,000 HKD minor units principal, 180 basis points per 30 days, a 60-day term |

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Read the API response.

**Expected Results:**

* Step 2 reads `<offer_1>` closed, replaced by a new offer.
* Step 2 reads `<offer_2>`'s terms as the live offer.
* Step 2 reads the case's history carrying the day `<offer_1>` closed.

### grade10-site-vault-valuation-and-offer-US5-TC2-2: The offer that replaced the last is accepted like any live offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case; staff replaced `<offer_1>` with `<offer_2>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_2>` | 900,000 HKD minor units principal, 180 basis points per 30 days, a 60-day term |

**Steps:**

1. Accept `<offer_2>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<case_1>` `accepted` on `<offer_2>`'s terms, `<offer_1>` still closed.

### grade10-site-vault-valuation-and-offer-US5-TC3-2: An answer naming the replaced offer is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case; staff replaced `<offer_1>` with `<offer_2>`, now the one live offer.

**Test data:**

| Answer |
| --- |
| Accept |
| Decline |

**Steps:**

1. Give the row's answer to `<offer_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 reads `<offer_1>` closed and `<offer_2>` open and unanswered.

### grade10-site-vault-valuation-and-offer-US5-TC4-1: A twice-superseded case reads only the most recent close

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector's case has had two counter-offers: `<offer_1>` and a second
  offer are both closed, superseded in turn, and a third offer is the one
  live offer.

**Steps:**

1. Open the case page.

**Expected Results:**

* The page names only the second offer as the one `<offer_1>` was
  superseded by, and that second offer as closed in turn.
* Accept and Decline sit on the third offer, the only one that stands.

## Settled

- **A decline after the offer ran out** - the decline carries no expiry check: before the expiry sweep runs it is taken, the offer closing as `declined_by_customer` and the case going back to valuation; once the sweep has run it is refused `NO_OPEN_OFFER` (Q22)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts` (`accept`, `decline`, `detail`, `mine`) and `valuation/offers.ts`. It is a statement, not proof.

- **Raised, folded into spec** - none
- **Raised, escalated** - a decline after expiry, landed as Q22; `grade10-site-vault-valuation-and-offer-US2-TC4-2`'s decline rows read the worker as it stands
- **Raised, rejected** - none
- **Re-versioned to the API** - every case whose behaviour the worker keeps and whose run walked the case page or the case list: `grade10-site-vault-valuation-and-offer-US2-TC1-2`, `grade10-site-vault-valuation-and-offer-US2-TC2-2`, `grade10-site-vault-valuation-and-offer-US2-TC3-2`, `grade10-site-vault-valuation-and-offer-US2-TC4-2`, `grade10-site-vault-valuation-and-offer-US2-TC5-2`, `grade10-site-vault-valuation-and-offer-US2-TC6-2`, `grade10-site-vault-valuation-and-offer-US2-TC7-2`, `grade10-site-vault-valuation-and-offer-US2-TC9-2`, `grade10-site-vault-valuation-and-offer-US2-TC10-2`, `grade10-site-vault-valuation-and-offer-US2-TC11-2`, `grade10-site-vault-valuation-and-offer-US5-TC1-2`, `grade10-site-vault-valuation-and-offer-US5-TC2-2`, `grade10-site-vault-valuation-and-offer-US5-TC3-2`
- **Deprecated** - the cases whose subject is a removed screen: `grade10-site-vault-valuation-and-offer-US2-TC8-1`, going back from a confirmation; `grade10-site-vault-valuation-and-offer-US5-TC4-1`, the page naming only the latest close where the read carries every offer
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US2-TC12-1` into `grade10-site-vault-valuation-and-offer-US2-TC1-2` and `grade10-site-vault-valuation-and-offer-US2-TC7-2`; `US2-TC13-1` into `grade10-site-vault-valuation-and-offer-US2-TC2-2`; `US2-TC14-1` into `grade10-site-vault-valuation-and-offer-US2-TC3-2` and `grade10-site-vault-valuation-and-offer-US2-TC4-2`; `US2-TC15-1` into `grade10-site-vault-valuation-and-offer-US2-TC5-2`; `US2-TC16-1` into `grade10-site-vault-valuation-and-offer-US2-TC6-2`; `US2-TC17-1` into `grade10-site-vault-valuation-and-offer-US2-TC9-2`; `US2-TC18-1` into `grade10-site-vault-valuation-and-offer-US2-TC10-2`; `US5-TC5-1` into `grade10-site-vault-valuation-and-offer-US5-TC1-2`; `US5-TC6-1` into `grade10-site-vault-valuation-and-offer-US5-TC2-2` and `grade10-site-vault-valuation-and-offer-US5-TC3-2`
- **Joined** - `grade10-site-vault-valuation-and-offer-SC-21` into `grade10-site-vault-valuation-and-offer-US2-TC7-2`; `-SC-22` into `grade10-site-vault-valuation-and-offer-US2-TC1-2`; `-SC-23` into `grade10-site-vault-valuation-and-offer-US2-TC2-2`; `-SC-24` into `grade10-site-vault-valuation-and-offer-US2-TC9-2`; `-SC-25` into `grade10-site-vault-valuation-and-offer-US2-TC10-2`; `-SC-28` into `grade10-site-vault-valuation-and-offer-US2-TC11-2` and `grade10-site-vault-valuation-and-offer-US2-TC4-2`; `-SC-29` into `grade10-site-vault-valuation-and-offer-US2-TC5-2`; `-SC-26` into `grade10-site-vault-valuation-and-offer-US5-TC1-2`; `-SC-27` into `grade10-site-vault-valuation-and-offer-US5-TC3-2`
- **Contradicted** - none
- **Uncovered anchors** - none
- **Automated cases re-versioned** - `grade10-site-vault-valuation-and-offer-US2-TC1-2`, `grade10-site-vault-valuation-and-offer-US2-TC2-2`, `grade10-site-vault-valuation-and-offer-US2-TC4-2`, `grade10-site-vault-valuation-and-offer-US2-TC5-2`, `grade10-site-vault-valuation-and-offer-US2-TC6-2`, `grade10-site-vault-valuation-and-offer-US2-TC7-2`, `grade10-site-vault-valuation-and-offer-US2-TC9-2`, `grade10-site-vault-valuation-and-offer-US2-TC10-2`, `grade10-site-vault-valuation-and-offer-US2-TC11-2`, `grade10-site-vault-valuation-and-offer-US5-TC1-2`, `grade10-site-vault-valuation-and-offer-US5-TC2-2`, `grade10-site-vault-valuation-and-offer-US5-TC3-2` were decided by `offer.spec.ts` at `-1`; each is `manual` until task 4.4 retitles its API walk and flips it
