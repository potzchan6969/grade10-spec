# grade10-site/vault/valuation-and-offer Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## Background

* The brand is Grade10, whose currency is HKD; its lending policy: loan to
  value 40%, rate 150 to 250 basis points per 30 days, term presets 30, 60,
  90 and 120 days, offer validity 7 days, grace none, accrual ceiling 100%
  of the principal, forfeiture notice 14 days; its registered name is on
  file.
* `<valuation_1>` — a recorded valuation of 2,500,000 minor units (HKD
  25,000.00).
* `<offer_1>` — a live offer against `<valuation_1>` of 1,000,000 minor
  units (HKD 10,000.00) principal, 200 basis points per 30 days, a term of
  30 days, open for 7 days from when it was made.

## grade10-site-vault-valuation-and-offer-US1: Operator prices a loan against an item they have valued

**As a** member of shop staff,
**I want** to record what the item is worth and write terms the brand's own
bounds allow,
**so that** no loan leaves the counter above what the item is worth or outside
what the business lends.

### grade10-site-vault-valuation-and-offer-US1-TC1-1: Offer is made when every lending bound is met

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a financed-lane case in `under_valuation` carrying `<valuation_1>`.

**Steps:**

1. Open the make-offer dialog and enter a principal of 1,000,000 minor units
   (HKD 10,000.00), a rate of 200 basis points per 30 days, a term of 30
   days and an expiry 7 days out.
2. Send the offer.

**Expected Results:**

* The dialog reads the interest for the term, the total to repay and the
  late-day figure it derives from what was entered.
* The case moves to `offer_made` carrying the one offer just sent.

### grade10-site-vault-valuation-and-offer-US1-TC2-1: A counter-offer supersedes the case's live offer

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `offer_made` carrying `<offer_1>`.

**Steps:**

1. Enter a counter-offer of 900,000 minor units (HKD 9,000.00), a term of
   30 days and an expiry 7 days out.
2. Send the counter-offer.
3. Read the case's offers.

**Expected Results:**

* `<offer_1>` reads closed, superseded by the counter-offer.
* The counter-offer is the case's one live offer.

### grade10-site-vault-valuation-and-offer-US1-TC3-1: Storage-lane terms are agreed with no offer written

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a storage-lane case in `under_valuation` carrying a recorded
  valuation of 500,000 minor units (HKD 5,000.00).

**Steps:**

1. Agree the custody terms.

**Expected Results:**

* The case moves to `accepted` with no offer written.
* The custody terms are recorded against the valuation alone.

### grade10-site-vault-valuation-and-offer-US1-TC4-1: Every lending bound unset outside production allows the offer

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* The environment is not production.
* Every one of the brand's lending bounds is unset.
* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Steps:**

1. Enter a principal of 2,500,000 minor units (HKD 25,000.00), a rate of
   500 basis points per 30 days, a term of 45 days and an expiry 30 days
   out.
2. Send the offer.

**Expected Results:**

* The dialog reads every gate as not set before the act.
* The offer is made despite values no brand bound would otherwise allow.

### grade10-site-vault-valuation-and-offer-US1-TC5-1: Offer principal is judged against the loan-to-value cap

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Test data:**

| Principal | Result |
| --- | --- |
| 1,000,000 minor units (HKD 10,000.00) | Made |
| 1,000,001 minor units (HKD 10,000.01) | Refused |

**Steps:**

1. Enter the row's principal, with a rate, term and expiry each inside
   every other bound.
2. Send the offer.

**Expected Results:**

* Step 2 returns the row's result.
* The refused row names the loan-to-value cap as the reason.

### grade10-site-vault-valuation-and-offer-US1-TC6-1: Offer principal is judged against the valuation alone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* The environment is not production.
* Every lending bound but the valuation itself is unset for the brand.
* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Test data:**

| Principal | Result |
| --- | --- |
| 2,500,000 minor units (HKD 25,000.00) | Made |
| 2,500,001 minor units (HKD 25,000.01) | Refused |

**Steps:**

1. Enter the row's principal, with any rate, term and expiry.
2. Send the offer.

**Expected Results:**

* Step 2 returns the row's result.
* The refused row names the valuation as the reason.

### grade10-site-vault-valuation-and-offer-US1-TC7-1: Offer rate is judged against the brand's rate band

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Test data:**

| Rate per 30 days | Result |
| --- | --- |
| 150 basis points | Made |
| 149 basis points | Refused |
| 250 basis points | Made |
| 251 basis points | Refused |

**Steps:**

1. Enter the row's rate, with a principal, term and expiry each inside
   every other bound.
2. Send the offer.

**Expected Results:**

* Step 2 returns the row's result.
* A refused row names the rate band as the reason.

### grade10-site-vault-valuation-and-offer-US1-TC8-1: Offer expiry is judged against the validity window and the present

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Test data:**

| Expiry | Result |
| --- | --- |
| 7 days from now | Made |
| 8 days from now | Refused |
| now | Refused |

**Steps:**

1. Enter the row's expiry, with a principal, rate and term each inside
   every other bound.
2. Send the offer.

**Expected Results:**

* Step 2 returns the row's result.
* The 8-days-from-now row names the offer-validity window as the reason.
* The now row names that the expiry must be after now.

### grade10-site-vault-valuation-and-offer-US1-TC9-1: Offer term outside every brand preset is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Steps:**

1. Enter a principal, rate and expiry each inside every other bound, and a
   term of 45 days.
2. Send the offer.

**Expected Results:**

* The offer is refused.
* The dialog names the brand's term presets as the reason.

### grade10-site-vault-valuation-and-offer-US1-TC10-1: A lending bound unset in production refuses the offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* The environment is production.
* The brand's loan-to-value cap is unset; every other lending bound is set
  and the lender's registered name is on file.
* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Steps:**

1. Open the make-offer dialog.
2. Send an offer inside every other bound.

**Expected Results:**

* The dialog names the unset loan-to-value cap before step 2.
* Step 2 is refused, naming the same unset cap.

### grade10-site-vault-valuation-and-offer-US1-TC11-1: The lender's unset registered name refuses the offer in production

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* The environment is production.
* Every lending bound is set; the lender's registered name is unset.
* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Steps:**

1. Open the make-offer dialog.
2. Send an offer inside every lending bound.

**Expected Results:**

* The dialog names the unset registered name before step 2.
* Step 2 is refused, naming the same reason.

### grade10-site-vault-valuation-and-offer-US1-TC12-1: A valuation below a standing offer is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `offer_made` carrying `<offer_1>`.

**Steps:**

1. Record a new valuation of 900,000 minor units (HKD 9,000.00).

**Expected Results:**

* The valuation is refused.
* The refusal names `<offer_1>` as the standing offer it would fall below.

### grade10-site-vault-valuation-and-offer-US1-TC13-1: Staff without the approve grant cannot make an offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(holds `vault:operate`, not `vault:approve`) is on <grade10 admin
  vault case page url> for a case in `under_valuation` carrying
  `<valuation_1>`.

**Steps:**

1. Attempt to make an offer inside every lending bound.

**Expected Results:**

* The attempt is refused for want of `vault:approve`.
* The case carries no offer.

### grade10-site-vault-valuation-and-offer-US1-TC14-1: An unset loan particular refuses the offer in production

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* The environment is production.
* Every lending bound and the lender's registered name are set.
* admin(holds `vault:approve`) is on <grade10 admin vault case page url>
  for a case in `under_valuation` carrying `<valuation_1>`.

**Test data:**

| Unset value | Named in the refusal |
| --- | --- |
| licence number | the licence number |
| FPS id | the FPS id |

**Steps:**

1. Leave the row's value unset, then send an offer inside every lending bound.

**Expected Results:**

* Every row is refused by name, naming the row's value, and no offer is written.

### grade10-site-vault-valuation-and-offer-US1-TC15-1: Recording a valuation never changes the register's slab

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(staff) holds `vault:approve`.
* `<case_1>` is under valuation; its item `<item_1>` carries PSA, grade 10 and `AB12345`.

**Steps:**

1. Send a valuation of HKD 25,000.00 for `<case_1>` straight to the vault worker, carrying grade 9 and cert `AB99999`.
2. Read `<item_1>` from the register.

**Expected Results:**

* `<item_1>` still carries PSA, grade 10 and `AB12345`.

---

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

---

## grade10-site-vault-valuation-and-offer-US6: Operator values a slab by its grader, grade and cert

**As a** member of shop staff valuing a graded item,
**I want** the item's grader, grade and cert beside the valuation, read from
the item register and corrected there when the slab in my hand says otherwise,
**so that** the figure I record is for the slab in front of me, not one typed
from memory.

### grade10-site-vault-valuation-and-offer-US6-TC1-1: The valuation dialog reads the slab from the register

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_1>`, under valuation.
* `<case_1>`'s item `<item_1>` carries PSA, grade 10 and `AB12345` in the register.

**Steps:**

1. Open the record-valuation dialog on the Case tab.
2. Read the line above the valued-at field.
3. Record a valuation of HKD 25,000.00.

**Expected Results:**

* Step 2 reads PSA, grade 10 and `AB12345`, as text no field edits.
* The valuation is recorded at HKD 25,000.00.
* `<item_1>` still carries PSA, grade 10 and `AB12345`.

### grade10-site-vault-valuation-and-offer-US6-TC2-1: A correction on the Case tab reaches the valuation dialog

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_1>`, under valuation.
* `<case_1>`'s item `<item_1>` carries PSA, grade 9 and `AB12345`; the slab in hand reads grade 10.

**Steps:**

1. Click Edit in the item's facts on the Case tab.
2. Change the grade to 10 and save.
3. Open the record-valuation dialog.

**Expected Results:**

* Step 3's line reads PSA, grade 10 and `AB12345`.

### grade10-site-vault-valuation-and-offer-US6-TC3-1: An item with no grader shows no slab line

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin vault case page url> for `<case_2>`, under valuation.
* `<case_2>`'s item carries no grader.

**Steps:**

1. Open the record-valuation dialog on the Case tab.

**Expected Results:**

* The dialog shows no grader, grade or cert line; valued-at is offered as usual.

## Settled

- An offer cannot be made before a valuation is recorded: a case nobody has valued refuses the offer by name, as it refuses custody terms, and the durable capability already states it.
- An acceptance is final whichever side gave it. An answer sent on a case the counter has accepted is refused, naming that the case moved; what is left before signing is the case's own call-off, which `grade10-site/vault/case-lifecycle` holds.
- **A decline after the offer ran out** - the decline carries no expiry check: before the expiry sweep runs it is taken, the offer closing as `declined_by_customer` and the case going back to valuation; once the sweep has run it is refused `NO_OPEN_OFFER` (Q22)

## Reconciliation

**Run:** 2026-09-22 · the blind pass read this capability's `## Purpose` and
`## Feature set`, its `user-journeys.md`, the change's `proposal.md` and
`decisions.md`, its `ui-design.md` with the state dispositions stripped, the
PRD pages the proposal links, and this suite for id continuity. It was denied
every `## Requirements` section, `openspec/specs/`, `openspec/changes/archive/`
and `tech-design.md`. The scenario pass issued
`grade10-site-vault-valuation-and-offer-SC-21` to
`grade10-site-vault-valuation-and-offer-SC-29`; the two readings were joined on
the anchors after both landed.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| US1-TC1-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-07` makes the offer inside every bound; the dialog's derived figures are `grade10-site-vault-loan-and-settlement-SC-40` |
| US1-TC2-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-13` |
| US1-TC3-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-19` |
| US1-TC4-1 | Covered | `grade10-site-vault-loan-and-settlement-SC-45` — a bound nobody set passes outside production |
| US1-TC5-1 | Folded | `grade10-site-vault-valuation-and-offer-SC-30`. The loan-to-value row of the policy table in `Every offer is judged against the brand's lending policy` had no scenario at its bound; the change now opens that requirement in a MODIFIED block and the scenario lands there, at the case's own figures |
| US1-TC6-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-04` |
| US1-TC7-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-06` above the band, `grade10-site-vault-valuation-and-offer-SC-07` at it |
| US1-TC8-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-09` past the window, `grade10-site-vault-valuation-and-offer-SC-05` an expiry already gone |
| US1-TC9-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-08` |
| US1-TC10-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-10`; the dialog naming the bound before the act is `grade10-site-vault-loan-and-settlement-SC-45` |
| US1-TC11-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-11` |
| US1-TC12-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-02` |
| US1-TC13-1 | Covered elsewhere | `grade10-admin-vault-operator-queue-SC-12` — making an offer sits behind the vault approve grant |
| US1-TC14-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-31` for the licence line, `grade10-site-vault-valuation-and-offer-SC-32` for where to pay; written with the owner's approval of M1 at acceptance |
| US2-TC1-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-22` for the confirmation, `grade10-site-vault-valuation-and-offer-SC-16` for the case accepted |
| US2-TC2-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-23` for the confirmation, `grade10-site-vault-valuation-and-offer-SC-14` for the request staying open |
| US2-TC3-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-16` and `grade10-site-vault-valuation-and-offer-SC-17` — the expiry is judged when the acceptance lands; the shop's clock is how the page reads that instant, not a second rule |
| US2-TC4-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-17`, with the closed offer taking no answer under `Only the offer that stands takes an answer` |
| US2-TC5-1 | Raised, answered | Q47 — acceptance is final whichever side gave it: `grade10-site-vault-valuation-and-offer-SC-16` stands and `grade10-site-vault-valuation-and-offer-SC-29` refuses the collector's answer by name. What is left before signing is the case's own call-off, in `grade10-site/vault/case-lifecycle` |
| US2-TC6-1 | Covered | the owner-only acceptance in `The collector or the counter accepts, and an expired offer cannot be accepted`, walked by `grade10-site-vault-valuation-and-offer-SC-16`; a case that is not the reader's is refused as its photographs are, `grade10-site-vault-case-intake-SC-12` |
| US2-TC7-1 | Case added | `grade10-site-vault-valuation-and-offer-SC-21` was reached by no case: the offer's terms, its valuation and the books-no-visit line |
| US2-TC8-1 | Case added | the Go back branch of `grade10-site-vault-valuation-and-offer-SC-22` and `grade10-site-vault-valuation-and-offer-SC-23` was reached by no case |
| US2-TC9-1 | Case added | `grade10-site-vault-valuation-and-offer-SC-24` was reached by no case |
| US2-TC10-1 | Case added | `grade10-site-vault-valuation-and-offer-SC-25` was reached by no case |
| US2-TC11-1 | Case added | `grade10-site-vault-valuation-and-offer-SC-28` was reached by no case; US2-TC4-1 reads an offer that had already lapsed, not one that ran out under the reader |
| US5-TC1-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-26` |
| US5-TC2-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-26` and `grade10-site-vault-valuation-and-offer-SC-22` |
| US5-TC3-1 | Covered | `grade10-site-vault-valuation-and-offer-SC-27` |
| US5-TC4-1 | Covered | the closed-offer rule in `Only the offer that stands takes an answer`, walked by `grade10-site-vault-valuation-and-offer-SC-26` |
| An offer made before any valuation is recorded | Raised, answered | Q46 — the durable spec already refuses it by name, `grade10-site-vault-valuation-and-offer-SC-03`; no scenario was written |
| An acceptance given at the counter, re-answered before signing | Raised, answered | Q47 — it is not re-answered; see US2-TC5-1 |
| Folded into `spec.md` | none | the blind pass carried no behaviour the scenarios and the durable spec leave unstated |
| Dropped as a misreading | none | — |
| Uncovered anchors | none | every scenario from `grade10-site-vault-valuation-and-offer-SC-21` to `grade10-site-vault-valuation-and-offer-SC-29` is walked by a case |
| Contradicted readings | none | — |

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journeys, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Operator Console and Items PRD pages, and the durable valuation-and-offer suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite, the delta spec, `tech-design.md`, `tasks.md` and the operator-queue delta. It is a statement, not proof.

- **Folded** - `grade10-site-vault-valuation-and-offer-US1-TC15-1` into `grade10-site-vault-valuation-and-offer-SC-35`: a valuation keeps no grader, grade or cert of its own, so one sent with them leaves the register as it was; `grade10-site-vault-valuation-and-offer-US6-TC1-1` into `grade10-site-vault-valuation-and-offer-SC-33`; `grade10-site-vault-valuation-and-offer-US6-TC2-1` into `grade10-site-vault-valuation-and-offer-SC-35`; `grade10-site-vault-valuation-and-offer-US6-TC3-1` into `grade10-site-vault-valuation-and-offer-SC-34`
- **Added by QA2** - none
- **Raised** - none from this suite
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-06 has a case for each scenario, and US-01 gains one

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

### Manual

| Manual | Why |
| --- | --- |
| US1-TC10-1 | The refusal outside production is proved by US1-TC4-1. What a person walks is the brand's production configuration before the shop lends: no run is made against production |
| US1-TC11-1 | Same reading, for the lender's registered name |
| US1-TC14-1 | Same reading, for the licence number and the FPS id |
