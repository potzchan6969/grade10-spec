# grade10-site/loyalty/programme Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-27, tcs-rules r7

## Background

* The member's surface is `<loyalty>` on the Grade10 site; its first section, "Membership", holds the tier card, a tier-skinned card in silver, gold or black.
* Tiers: Silver, the entry tier; Gold at 500 qualifying points over the rolling twelve months; Black by invitation alone, with no qualifying threshold.
* A point is worth HKD1 at checkout.

## Walk 1: Read the Gold tier card and open Tiers & Benefits from it

Starting state:

* customer(Gold member) is signed in and is on `<loyalty>`.
* The member holds `<balance>` and has `<qualifying points>` qualifying points over the rolling twelve months.

Shared test data:

| Field | Value |
| --- | --- |
| loyalty | The member's Membership page |
| balance | 1380 points (range: 1-79999 points) |
| qualifying points | 640 points (range: 500-79999 points) |

### Route

1. Scroll to the Membership section.
   * The card shows the gold skin with the balance, its checkout worth, the retention run, the earn line and the Benefits control, and no expiry line. `g10.loyalty-programme.US4-TC21`
2. Select the balance figure on the card.
   * The Tiers & Benefits page opens. `g10.loyalty-programme.US4-TC24`

## g10.loyalty-programme.US4: Member reads two counts and redeems from one surface

**As a** member,
**I want** my tier, balance, and activity on one surface, in the programme's dates,
**so that** I can join, redeem, and never see the operator's reasons behind an entry.

<!-- trace:case id=g10.loyalty-programme.TC-t1c rev=1 -->
### g10.loyalty-programme.US4-TC21: The tier card shows the skin, balance, worth, retention run and earn rate

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(`<tier>` member) is signed in and is on `<loyalty>`, holding `<balance>` and `<qualifying points>` qualifying points over the rolling twelve months.

**Test data:**

| `<tier>` | `<skin>` | `<balance>` | `<worth>` | `<qualifying points>` | `<earn rate>` |
| --- | --- | --- | --- | --- | --- |
| Silver | silver | 740 points (range: 1-79999 points) | HKD740 (`<balance>` at HKD1 a point) | 180 points (range: 0-499 points) | 1× earn rate |
| Gold (500 qualifying points, fixed threshold) | gold | 1380 points (range: 1-79999 points) | HKD1380 (`<balance>` at HKD1 a point) | 640 points (range: 500-79999 points) | 1.2× earn rate |

**Steps:**

1. Scroll to the Membership section.

**Expected Results:**

* The card shows in the `<skin>` skin, naming `<tier>`.
* The balance reads `<balance>`, with `<worth>` beside it as what it pays at checkout.
* The retention run reads `<qualifying points>` against the 500-point qualifying threshold.
* The earn line reads `<earn rate>`.
* The card shows a Benefits control.
* The card shows no expiry date and no line about points expiring. UI matching loyalty-membership-blocks-tiercard--gold

---

<!-- trace:case id=g10.loyalty-programme.TC-b7k rev=1 -->
### g10.loyalty-programme.US4-TC22: A Black member's card shows no retention run

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Black member, granted by invitation) is signed in and is on `<loyalty>`, holding `<balance>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<balance>` | 5200 points (range: 1-79999 points) |
| `<worth>` | HKD5200 (`<balance>` at HKD1 a point) |

**Steps:**

1. Scroll to the Membership section.

**Expected Results:**

* The card shows in the black skin.
* The balance reads `<balance>`, with `<worth>` beside it as what it pays at checkout.
* The card shows the tier's earn line and a Benefits control.
* The card shows no retention run and no qualifying threshold.

---

<!-- trace:case id=g10.loyalty-programme.TC-n0z rev=1 -->
### g10.loyalty-programme.US4-TC23: A member with no points sees a zero balance and a zero worth

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Silver member) is signed in and is on `<loyalty>`, holding no points and no qualifying points.

**Steps:**

1. Scroll to the Membership section.

**Expected Results:**

* The card shows in the silver skin.
* The balance reads 0 points, with a worth of HKD0 beside it.
* The card still shows its retention run, its earn line and the Benefits control.

---

<!-- trace:case id=g10.loyalty-programme.TC-w5h rev=1 -->
### g10.loyalty-programme.US4-TC24: Selecting anywhere on the tier card opens Tiers & Benefits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Gold member) is signed in and is on `<loyalty>`, scrolled to the Membership section.

**Test data:**

| `<where>` |
| --- |
| The balance figure on the card |
| The Benefits control on the card |
| The earn line on the card |

**Steps:**

1. Select `<where>`.

**Expected Results:**

* The Tiers & Benefits page opens.

---

<!-- trace:case id=g10.loyalty-programme.TC-q8d rev=1 -->
### g10.loyalty-programme.US4-TC25: The tier card reads in the member's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(Gold member) is signed in with the site language set to `<language>`, holding 1380 points (range: 1-79999 points).

**Test data:**

| `<language>` |
| --- |
| English |
| Traditional Chinese |
| Simplified Chinese |
| Korean |

**Steps:**

1. Open `<loyalty>`.
2. Scroll to the Membership section.

**Expected Results:**

* The card's balance, points, qualifying and Benefits words read in `<language>`, and none shows a missing-text key or another language.
* The balance figure and its worth are the same as in English.

---

## Reconciliation

**Run:** 2026-10-27, QA1 blind pass; read the change's proposal, decisions and user-journeys, the Membership PRD page, and the governance documents the skill names; denied every requirement and scenario, tasks, the accept review, the durable programme suite and the durable specs.

QA2 disposition: the author's questions on earn rates (stated in `tiers.md`), the retention-run and zero-balance wording (consumer copy, shown by the stories) and the wide-viewport host (`add-tiers-benefits-surface`'s) hold no case; TC24 asserts only that Tiers & Benefits opens.
