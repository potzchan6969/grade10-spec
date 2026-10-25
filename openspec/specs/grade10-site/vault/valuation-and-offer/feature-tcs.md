# grade10-site/vault/valuation-and-offer Test Cases

**Status:** pending-review · 0/22
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Grade10 lends in HKD under its policy: loan to value 40%, a rate of 150 to 250 basis points per 30 days, terms of 30, 60, 90 or 120 days, an offer open 7 days, its lender's registered name, licence number and FPS id on file, unless a case says otherwise.
* `<valuation_1>` is a recorded valuation of HKD25,000.00; `<offer_1>` a live offer against it of HKD10,000.00 at 200 basis points per 30 days over 30 days, open 7 days.
* Offers are made on the console case page by admin(holds `vault:approve`); the collector answers on their own vault case page on `<g10url>`.

## Walk 1: Value, offer, and the collector accepts

Starting state:

- admin(holds `vault:approve`) on a financed case under valuation; customer(collector) owns it.

Shared test data:

| Field | Value |
| --- | --- |
| valuation_1 | as in the Background |

### Route

1. Record `<valuation_1>`, then make `<offer_1>`.
   - The dialog reads the interest, the total and the late-day figure; the case reads offer made. `g10.vault-valuation-and-offer.US1-TC1`
2. As the collector, open the case.
   - The offer's terms beside the valuation, and the day to answer by. `g10.vault-valuation-and-offer.US2-TC1`
3. Select Accept this offer, then Yes, accept.
   - The case reads accepted, the collector its actor. `g10.vault-valuation-and-offer.US2-TC2`

## g10.vault-valuation-and-offer.US1: Operator prices a loan against an item they have valued

**As a** member of shop staff,
**I want** to record what the item is worth and write terms the brand's own
bounds allow,
**so that** no loan leaves the counter above what the item is worth or outside
what the business lends.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-fwb rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC1: An offer inside every bound is made, its dialog reading what it will cost

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(holds `vault:approve`) is on a financed case under valuation carrying `<valuation_1>`.

**Steps:**

1. Open Make an offer, and enter HKD10,000.00, 200 basis points per 30 days, 30 days, expiring in 7 days.
2. Send it.

**Expected Results:**

* Step 1 reads the interest for the term, the total to repay and the late-day figure.
* Step 2 moves the case to offer made, carrying that one offer.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-cxv rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC5: An offer at each bound is made, the rate judged per 30 days whatever the term

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(holds `vault:approve`) is on a case under valuation carrying `<valuation_1>`.

**Test data:**

| `<at the bound>` |
| --- |
| HKD10,000.00, 40% of the valuation |
| 150 basis points per 30 days |
| 250 basis points per 30 days |
| 500 basis points over 60 days, which is 250 per 30 |
| expiring in exactly 7 days |

**Steps:**

1. Make an offer at `<at the bound>`, every other term inside its bound.

**Expected Results:**

* The offer is made.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-0p9 rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC7: An offer one step past a bound, or above the valuation, is refused naming it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(holds `vault:approve`) is on a case under valuation carrying `<valuation>`.

**Test data:**

| `<valuation>` | `<past the bound>` | `<refusal names>` |
| --- | --- | --- |
| `<valuation_1>` | HKD10,000.01 | the loan-to-value cap |
| `<valuation_1>` | 149 basis points per 30 days | the rate band |
| `<valuation_1>` | 251 basis points per 30 days | the rate band |
| `<valuation_1>` | 600 basis points over 60 days, 300 per 30 | the rate band |
| `<valuation_1>` | expiring in 8 days | the offer's validity window |
| `<valuation_1>` | expiring now | that the expiry must be after now |
| `<valuation_1>` | a term of 45 days | the brand's term presets |
| HKD100,000.00, with no loan-to-value cap outside production | HKD110,000.00 | the valuation |

**Steps:**

1. Make an offer at `<past the bound>`, every other term inside its bound.

**Expected Results:**

* It is refused, naming `<refusal names>`; the case carries no new offer.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-1n7 rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC4: Outside production, unset bounds leave only the valuation as a limit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* Outside production, every lending bound is unset; admin(holds `vault:approve`) is on a case under valuation carrying `<valuation_1>`.

**Steps:**

1. Open Make an offer, and read it.
2. Send HKD25,000.00 at 500 basis points per 30 days, over 45 days, expiring in 30 days.

**Expected Results:**

* Step 1 reads every bound as not set.
* Step 2 is made.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-uy5 rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC10: In production an offer is refused while a bound, the lender's name, licence or FPS id is unset

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What the brand lends under

**Pre-conditions:**

* In production, every lending bound and lender detail is set except `<unset>`; admin(holds `vault:approve`) is on a case under valuation carrying `<valuation_1>`.

**Test data:**

| `<unset>` |
| --- |
| the loan-to-value cap |
| the lender's registered name |
| the licence number |
| the FPS id |

**Steps:**

1. Open Make an offer, and read it.
2. Send an offer inside every set bound.

**Expected Results:**

* Step 1 names `<unset>` before the act; step 2 is refused, naming it.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-6mn rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC12: A valuation below a standing offer is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** The valuation

**Pre-conditions:**

* admin(holds `vault:approve`) is on a case at offer made, carrying `<offer_1>`.

**Steps:**

1. Record a valuation of HKD9,000.00.

**Expected Results:**

* It is refused, naming `<offer_1>` as the offer it would fall below; no valuation is written.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-6u4 rev=1 -->
### g10.vault-valuation-and-offer.US1-TC14: A re-valuation is added beside the first, and offers are judged against the latest

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(holds `vault:approve`) is on a case under valuation, valued at HKD100,000.00, with no offer.

**Steps:**

1. Record a valuation of HKD80,000.00, and read the case.
2. Make an offer of HKD32,000.01.

**Expected Results:**

* Step 1 shows both figures, the later one current.
* Step 2 is refused, naming the loan-to-value cap of the latest valuation.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-w1x rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC2: A counter-offer replaces the case's live offer

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(holds `vault:approve`) is on a case at offer made, carrying `<offer_1>`.

**Steps:**

1. Send a counter-offer of HKD9,000.00 over 30 days, expiring in 7 days.
2. Read the case's offers.

**Expected Results:**

* `<offer_1>` reads closed, superseded by the counter-offer, which is the case's one live offer.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-p9q rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US1-TC13: Staff without the approve grant cannot make an offer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-01

**Pre-conditions:**

* admin(holds `vault:operate`, not `vault:approve`) is on a case under valuation carrying `<valuation_1>`.

**Steps:**

1. Try to make an offer inside every bound.

**Expected Results:**

* It is refused for want of `vault:approve`; the case carries no offer.

---

## g10.vault-valuation-and-offer.US2: Collector answers an offer from their own phone

**As a** collector,
**I want** to accept or decline the offer on my case wherever I am reading it,
**so that** I can say yes before I come in, or say no and still be offered
something else.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-krd rev=1 -->
### g10.vault-valuation-and-offer.US2-TC1: The offer reads with its terms, its valuation and the day to answer by, and says when it ran out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) owns a case valued at HKD100,000.00 holding a live offer of HKD40,000.00 over 60 days, HKD1,600.00 interest, expiring on a stated day.

**Steps:**

1. Open the case, and their cases list.
2. After the offer lapses, open both again.

**Expected Results:**

* Step 1 reads the principal, rate, term, interest, total to repay and the valuation, with the day to answer by on both.
* Step 2 reads an offer that ran out, and no day to answer by.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-j5c rev=1 -->
### g10.vault-valuation-and-offer.US2-TC2: Accepting is confirmed first, lands once, keeps the visit, and costs nothing until the money is advanced

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) is on their case, holding `<offer_1>` and a booked visit; a second tab shows the same case.

**Steps:**

1. Select Accept this offer, then Yes, accept.
2. In the second tab, without reloading, accept again.
3. A week later, as treasurer, record the advance; read the loan.

**Expected Results:**

* Step 1: the case reads accepted, the collector its actor; the visit stands.
* Step 2 is refused, naming that the offer was already answered; nothing changes.
* Step 3: the 30-day term runs from the advance; the week before costs nothing.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-3c3 rev=1 -->
### g10.vault-valuation-and-offer.US2-TC3: Declining is confirmed first, puts the case back under valuation, and keeps the visit

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) is on their case, holding `<offer_1>` and a booked visit.

**Steps:**

1. Select Decline this offer, then Yes, decline.
2. As admin(holds `vault:approve`), make a new offer.

**Expected Results:**

* Step 1: the offer reads declined by the collector; the case is under valuation again; the visit stands.
* Step 2 is made.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-tnl rev=1 covers=g10.vault-valuation-and-offer.SC-pc4,g10.vault-valuation-and-offer.SC-08z,g10.vault-valuation-and-offer.SC-sin,g10.vault-valuation-and-offer.SC-w4b,g10.vault-valuation-and-offer.SC-0ka,g10.vault-valuation-and-offer.SC-22e,g10.vault-valuation-and-offer.SC-gvt,g10.vault-valuation-and-offer.SC-cxs,g10.vault-valuation-and-offer.SC-df1,g10.vault-valuation-and-offer.SC-k5k,g10.vault-valuation-and-offer.SC-rua -->
### g10.vault-valuation-and-offer.US2-TC8: Going back from a confirmation leaves the offer live

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) is on their case, holding `<offer_1>`.

**Test data:**

| `<pressed>` | `<confirmation>` |
| --- | --- |
| Accept this offer | Yes, accept |
| Decline this offer | Yes, decline |

**Steps:**

1. Select `<pressed>`, then Go back on `<confirmation>`.

**Expected Results:**

* Nothing is sent; `<offer_1>` is still live, offering Accept this offer and Decline this offer.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-lgj rev=1 -->
### g10.vault-valuation-and-offer.US2-TC4: An acceptance is refused for an offer that ran out or a case that moved meanwhile

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-02

**Pre-conditions:**

* customer(collector) has their case open, holding `<offer_1>`; then `<meanwhile>`.

**Test data:**

| `<meanwhile>` | `<refusal names>` |
| --- | --- |
| the offer expired an hour ago | an offer that ran out |
| the offer expired while the page was open | an offer that ran out |
| the counter accepted the offer a moment later | a case that moved under the answer |

**Steps:**

1. Accept the offer, and confirm.
2. Reload.

**Expected Results:**

* Step 1 is refused, naming `<refusal names>`; step 2 reads the case as it now stands.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-knq rev=1 -->
### g10.vault-valuation-and-offer.US2-TC9: A lapsed offer is closed, the collector told, and the case still awaits terms

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Answering the offer

**Pre-conditions:**

* The collector's case holds an offer whose expiry has just passed.

**Steps:**

1. Let the lapsed offers be swept.
2. Read the case, as the collector and on the console, and the collector's inbox.

**Expected Results:**

* The offer reads closed; a letter tells the collector it lapsed; the case awaits terms and a new offer may be made.

---

## g10.vault-valuation-and-offer.US3: Collector who only wants storage agrees terms

**As a** collector who asked for no loan,
**I want** custody terms agreed against the recorded valuation,
**so that** the item can be taken in without anybody writing a loan I did not
ask for.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-kwy rev=1 covers=g10.vault-valuation-and-offer.SC-x56,g10.vault-valuation-and-offer.SC-jsc,g10.vault-valuation-and-offer.SC-sgl,g10.vault-valuation-and-offer.SC-lyt,g10.vault-valuation-and-offer.SC-4yo,g10.vault-valuation-and-offer.SC-p9g,g10.vault-valuation-and-offer.SC-fyi,g10.vault-valuation-and-offer.SC-r51 -->
### g10.vault-valuation-and-offer.US3-TC1: Storage terms are agreed against the valuation alone, even with no lending bound set

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-03

**Pre-conditions:**

* admin(holds `vault:approve`) is on a storage case under valuation, valued at HKD5,000.00, `<environment>`.

**Test data:**

| `<environment>` |
| --- |
| outside production, every bound set |
| in production, no loan-to-value cap and no lender name set |

**Steps:**

1. Agree the custody terms, and take the item through to the vault.

**Expected Results:**

* The case reads accepted with no offer written, then reaches the vault; nothing refuses it.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-mac rev=1 -->
### g10.vault-valuation-and-offer.US3-TC2: Terms are refused on a case nobody has valued

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-03

**Pre-conditions:**

* admin(holds `vault:approve`) is on `<case>`, under valuation, with no valuation.

**Test data:**

| `<case>` | `<try>` |
| --- | --- |
| a storage case | agree the custody terms |
| a financed case | make an offer |

**Steps:**

1. `<try>`.

**Expected Results:**

* It is refused, naming the missing valuation.

---

## g10.vault-valuation-and-offer.US4: Collector whose loan request the shop cannot yet price still gets the item stored

**As a** collector who asked for a loan the shop is not lending against yet,
**I want** custody terms agreed against the valuation instead,
**so that** the item is taken in on the same paper rather than my request being
turned away.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-9ik rev=1 -->
### g10.vault-valuation-and-offer.US4-TC1: A financed case with no offer is taken into custody on the custody agreement alone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-04

**Pre-conditions:**

* admin(holds `vault:approve`) is on a valued financed case with no offer.

**Steps:**

1. Agree the custody terms, and prepare the signing packet.

**Expected Results:**

* The case reads accepted with no offer; the packet holds the custody agreement alone, and no loan is written.

---

## g10.vault-valuation-and-offer.US5: Collector reads and answers an offer that replaced the last

**As a** collector whose offer was replaced by a new one,
**I want** the page to say the old offer is gone and show the new one's terms
with Accept and Decline on it,
**so that** I answer the offer that stands and never the one that was
withdrawn.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-htu rev=1 covers=g10.vault-valuation-and-offer.SC-44j,g10.vault-valuation-and-offer.SC-l0m -->
### g10.vault-valuation-and-offer.US5-TC4: A replaced offer reads closed beside the one that stands, and only that one takes an answer

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Pre-conditions:**

* The collector's case had two counter-offers: `<offer_1>` and a second are closed, superseded in turn, and a third is live.

**Steps:**

1. Open the case page.

**Expected Results:**

* It names only the second offer as the one `<offer_1>` was superseded by, and that second as closed in turn; Accept and Decline sit on the third alone.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-y05 rev=1 -->
### g10.vault-valuation-and-offer.US5-TC5: An answer sent from a page still showing a replaced offer is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-05

**Pre-conditions:**

* customer(collector) has their case open on `<offer_1>`; staff then replace it with a counter-offer.

**Steps:**

1. Without reloading, accept `<offer_1>` and confirm.
2. Reload.

**Expected Results:**

* Step 1 is refused, naming the replaced offer.
* Step 2 shows the counter-offer live and unanswered.

---

## g10.vault-valuation-and-offer.US6: Operator values a slab by its grader, grade and cert

**As a** member of shop staff valuing a graded item,
**I want** the item's grader, grade and cert beside the valuation, read from
the item register and corrected there when the slab in my hand says otherwise,
**so that** the figure I record is for the slab in front of me, not one typed
from memory.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-qt8 rev=1 covers=g10.vault-valuation-and-offer.SC-1yc,g10.vault-valuation-and-offer.SC-e0k,g10.vault-valuation-and-offer.SC-s2f -->
### g10.vault-valuation-and-offer.US6-TC1: Record a valuation reads the slab's grader, grade and cert from the register, or nothing for an ungraded item

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case under valuation whose item the register holds as `<item>`.

**Test data:**

| `<item>` | `<line reads>` |
| --- | --- |
| PSA, grade 10, cert AB12345 | PSA, 10 and AB12345, as text no field edits |
| an item with no grader | no line |

**Steps:**

1. Open Record a valuation, read above the amount, and record HKD25,000.00.

**Expected Results:**

* It shows `<line reads>`; the valuation is recorded, and the register is unchanged.

<!-- trace:case id=g10.vault-valuation-and-offer.TC-b8l rev=1 covers=g10.vault-valuation-and-offer.SC-1yc,g10.vault-valuation-and-offer.SC-e0k,g10.vault-valuation-and-offer.SC-s2f -->
### g10.vault-valuation-and-offer.US6-TC2: A correction made on the register reaches the valuation dialog

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-valuation-and-offer-US-06

**Pre-conditions:**

* admin(holds `vault:operate`) is on a case under valuation whose item the register holds as PSA, grade 9, AB12345; the slab in hand reads 10.

**Steps:**

1. Select Edit in the item's facts on the Case tab, change the grade to 10, and save.
2. Open Record a valuation.

**Expected Results:**

* Its line reads PSA, 10 and AB12345, and offers no edit of its own.

## Settled

- A case nobody has valued refuses an offer by name, as it refuses custody terms.
- An acceptance is final whichever side gave it; an answer sent on a case the counter has accepted is refused as a case that moved. What is left before signing is the case's own call-off, held by `grade10-site/vault/case-lifecycle`.
- A decline carries no expiry check: before the expiry sweep it is taken and the case goes back to valuation; once the sweep has run it is refused (Q22).
