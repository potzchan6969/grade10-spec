# grade10-site/vault/valuation-and-offer Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-valuation-and-offer-US2: Collector answers an offer from their own phone

**As a** collector,
**I want** to accept or decline the offer on my case wherever I am reading it,
**so that** I can say yes before I come in, or say no and still be offered
something else.

### grade10-site-vault-valuation-and-offer-US2-TC3-1: The offer is accepted at the limit of the day it runs out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

---

### grade10-site-vault-valuation-and-offer-US2-TC7-1: The offer reads with its terms, its valuation and the day to answer by

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

---

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

---

### grade10-site-vault-valuation-and-offer-US2-TC9-1: A confirmed answer is sent once and the case is read again

**Classification:**

* **Severity:** critical
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

**Steps:**

1. Click Accept this offer.
2. Confirm Yes, accept.
3. Press Yes, accept again before the answer lands.

**Expected Results:**

* One acceptance is recorded against `<offer_1>`.
* The confirmation stays until the answer lands.
* The case is read again afterwards and the page reads the case as
  `accepted`.

---

### grade10-site-vault-valuation-and-offer-US2-TC10-1: The day to answer by leaves the case list with the offer

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

---

### grade10-site-vault-valuation-and-offer-US2-TC11-1: An offer that ran out under the reader is refused in the confirmation

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

### grade10-site-vault-valuation-and-offer-US2-TC12-1: The collector accepts the live offer as an act on their own case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's financed case, holding `<offer_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_1>` | A live offer of 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term, open 7 days from when it was made |

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Accept `<offer_1>` as an act on the collector's own case.
3. Ask for the collector's own read of `<case_1>` again.

**Expected Results:**

* Step 1 reads the principal, the interest for the whole term, the term in days, the total to repay, what a late day costs and the expiry, and no due date.
* Step 2 is accepted.
* Step 3 reads `<offer_1>` accepted, the papers still to sign, and nothing owed.

---

### grade10-site-vault-valuation-and-offer-US2-TC13-1: The collector declines the live offer and the request stays open

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
* `<case_1>` is the collector's financed case, holding `<offer_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<offer_1>` | A live offer of 1,000,000 HKD minor units principal, 200 basis points per 30 days, a 30-day term, open 7 days from when it was made |

**Steps:**

1. Decline `<offer_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads `<offer_1>` closed as declined.
* Step 2 reads `<case_1>` open, at the status it held before step 1.

---

### grade10-site-vault-valuation-and-offer-US2-TC14-1: An answer at the limit of the offer's own expiry

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
* `<case_1>` is the collector's financed case, holding `<offer_1>`, whose expiry is `<expiry>`.
* The clock reads the row's answer time.

**Test data:**

| Answer | Answer time | Step 1 |
| --- | --- | --- |
| Accept | 1 minute before `<expiry>` | Accepted |
| Accept | 1 minute after `<expiry>` | Refused by name: the offer ran out |
| Decline | 1 minute after `<expiry>` | Refused by name: the offer ran out |

**Steps:**

1. Give the row's answer to `<offer_1>` as an act on the collector's own case.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is answered as the row says.
* Where step 1 is refused, step 2 reads `<case_1>` at the status it held before step 1.

---

### grade10-site-vault-valuation-and-offer-US2-TC15-1: An answer on a case that moved under it is refused by name

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

---

### grade10-site-vault-valuation-and-offer-US2-TC16-1: A collector cannot answer another collector's offer

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
* **Status:** deprecated
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

---

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

### grade10-site-vault-valuation-and-offer-US5-TC5-1: The collector's own read names the replaced offer closed and the live one's terms

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

---

### grade10-site-vault-valuation-and-offer-US5-TC6-1: An answer to the replaced offer is refused, and the live one takes it

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
* `<case_1>` is the collector's financed case; staff replaced `<offer_1>` with `<offer_2>`.

**Steps:**

1. Accept `<offer_1>` as an act on the collector's own case.
2. Accept `<offer_2>` as an act on the collector's own case.
3. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 is accepted.
* Step 3 reads `<offer_2>` accepted and `<offer_1>` still closed.
