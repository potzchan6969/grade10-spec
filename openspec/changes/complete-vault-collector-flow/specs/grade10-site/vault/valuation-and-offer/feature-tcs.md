# grade10-site/vault/valuation-and-offer Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

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

---

## grade10-site-vault-valuation-and-offer-US2: Collector answers an offer from their own phone

**As a** collector,
**I want** to accept or decline the offer on my case wherever I am reading it,
**so that** I can say yes before I come in, or say no and still be offered
something else.

### grade10-site-vault-valuation-and-offer-US2-TC1-1: Accepting the offer confirms the total, the late-day cost and what is signed

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case carrying `<offer_1>`.

**Steps:**

1. Click Accept this offer.
2. Read the confirmation.
3. Confirm Yes, accept.

**Expected Results:**

* The confirmation names the total to repay, what a late day costs and
  what will be signed.
* The case moves to `accepted`.

### grade10-site-vault-valuation-and-offer-US2-TC2-1: Declining the offer keeps the request open

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case carrying `<offer_1>`.

**Steps:**

1. Click Decline this offer.
2. Read the confirmation.
3. Confirm Yes, decline.

**Expected Results:**

* The confirmation names that the request stays open and the visit stands.
* The case returns to `under_valuation` with `<offer_1>` closed.

### grade10-site-vault-valuation-and-offer-US2-TC3-1: The offer is accepted at the limit of the day it runs out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case, whose live offer's open-until date is today on the
  shop's own clock.

**Steps:**

1. Click Accept this offer before midnight on the shop's clock.
2. Confirm Yes, accept.

**Expected Results:**

* The offer is accepted.
* The case moves to `accepted`.

### grade10-site-vault-valuation-and-offer-US2-TC4-1: An offer past its own expiry cannot be accepted

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case, whose live offer's open-until date has passed.

**Steps:**

1. Read the case page.
2. Attempt to accept the offer.

**Expected Results:**

* The page names the offer as ran out where the answer would have been
  given.
* Step 2 is refused and the case stays `offer_made`.

### grade10-site-vault-valuation-and-offer-US2-TC5-1: A case accepted at the counter refuses the collector's own answer

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case; staff have just accepted its offer at the counter,
  moving the case to `accepted`.

**Steps:**

1. Attempt to accept the offer from the case page.

**Expected Results:**

* The attempt is refused, naming that the case has moved since the offer
  was read.
* The case stays `accepted` from the counter's own act.

### grade10-site-vault-valuation-and-offer-US2-TC6-1: A collector cannot answer another collector's offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* `<collector B>` is signed in.
* `<case_1>` belongs to a different collector and carries a live offer.

**Steps:**

1. Attempt to open `<case_1>`'s case page as `<collector B>`.

**Expected Results:**

* `<collector B>` cannot read or answer `<case_1>`'s offer.

### grade10-site-vault-valuation-and-offer-US2-TC7-1: The offer reads with its terms, its valuation and the day to answer by

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case carrying `<offer_1>` against `<valuation_1>`.

**Steps:**

1. Read the offer on the case page.

**Expected Results:**

* The page names the principal of 1,000,000 minor units (HKD 10,000.00),
  the 30-day term, the interest for the whole term, the total to repay,
  what a late day costs and the day to answer by.
* The page names `<valuation_1>` as what the offer was judged against.
* Accept this offer and Decline this offer sit on `<offer_1>`, which says
  that accepting it books no visit.

### grade10-site-vault-valuation-and-offer-US2-TC8-1: Going back from a confirmation leaves the offer live

Runs once per row of **Test data**.

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

### grade10-site-vault-valuation-and-offer-US2-TC9-1: A confirmed answer is sent once and the case is read again

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case carrying `<offer_1>`.

**Steps:**

1. Click Accept this offer.
2. Confirm Yes, accept.
3. Press Yes, accept again before the answer lands.

**Expected Results:**

* One acceptance is recorded against `<offer_1>`.
* The confirmation stays until the answer lands.
* The case is read again afterwards and the page reads the case as
  `accepted`.

### grade10-site-vault-valuation-and-offer-US2-TC10-1: The day to answer by leaves the case list with the offer

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in on <grade10 vault case list url>.
* Their case carries `<offer_1>`, whose open-until date is stated.

**Steps:**

1. Read the case list before that date.
2. Read the case list again after `<offer_1>` has lapsed.

**Expected Results:**

* Step 1 names the day to answer by on the case's card.
* Step 2 names no day to answer by on that card.

### grade10-site-vault-valuation-and-offer-US2-TC11-1: An offer that ran out under the reader is refused in the confirmation

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case carrying `<offer_1>`, whose open-until date is minutes
  away.

**Steps:**

1. Click Accept this offer.
2. Let `<offer_1>`'s expiry pass with the confirmation open.
3. Confirm Yes, accept.

**Expected Results:**

* The confirmation stays open, naming that the offer ran out.
* The case is read again and the page reads `<offer_1>` as ran out, with no
  Accept and no Decline.
* The case stays `offer_made`.

---

## grade10-site-vault-valuation-and-offer-US5: Collector reads and answers an offer that replaced the last

**As a** collector whose offer was replaced by a new one,
**I want** the page to say the old offer is gone and show the new one's terms
with Accept and Decline on it,
**so that** I answer the offer that stands and never the one that was
withdrawn.

### grade10-site-vault-valuation-and-offer-US5-TC1-1: The page names the closed offer and shows only the new one's terms

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case; `<offer_1>` was superseded by `<offer_2>`, a counter-offer
  of 900,000 minor units (HKD 9,000.00).

**Steps:**

1. Open the case page.

**Expected Results:**

* The page names `<offer_1>` as closed and the date it closed.
* The page shows `<offer_2>`'s terms, with Accept and Decline on `<offer_2>`
  only.

### grade10-site-vault-valuation-and-offer-US5-TC2-1: The offer that replaced the last is accepted like any live offer

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector is signed in and viewing <grade10 vault case page url> for
  their own case; `<offer_1>` was superseded by `<offer_2>`, a counter-offer
  of 900,000 minor units (HKD 9,000.00).

**Steps:**

1. Click Accept this offer.
2. Read the confirmation.
3. Confirm Yes, accept.

**Expected Results:**

* The confirmation names `<offer_2>`'s total, what a late day costs and
  what will be signed.
* The case moves to `accepted` on `<offer_2>`'s terms.

### grade10-site-vault-valuation-and-offer-US5-TC3-1: A superseded offer takes no answer

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
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/offer.spec.ts`

**Pre-conditions:**

* The collector's case carries `<offer_1>`, closed and superseded, and
  `<offer_2>` of 900,000 minor units (HKD 9,000.00) as the one live offer.

**Steps:**

1. Attempt to answer `<offer_1>` directly.

**Expected Results:**

* The attempt is refused; `<offer_1>` takes no answer.
* The case page still reads `<offer_2>` as the only offer standing.

### grade10-site-vault-valuation-and-offer-US5-TC4-1: A twice-superseded case reads only the most recent close

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

- An offer cannot be made before a valuation is recorded: a case nobody has valued refuses the offer by name, as it refuses custody terms, and the durable capability already states it.
- An acceptance is final whichever side gave it. An answer sent on a case the counter has accepted is refused, naming that the case moved; what is left before signing is the case's own call-off, which `grade10-site/vault/case-lifecycle` holds.

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

### Manual

| Manual | Why |
| --- | --- |
| US1-TC10-1 | The refusal outside production is proved by US1-TC4-1. What a person walks is the brand's production configuration before the shop lends: no run is made against production |
| US1-TC11-1 | Same reading, for the lender's registered name |
