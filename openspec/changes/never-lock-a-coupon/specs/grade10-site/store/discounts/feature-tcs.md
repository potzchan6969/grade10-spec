# grade10-site/store/discounts Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-discounts-US3: Collector keeps the coupon when a checkout cannot take it

**As a** collector,
**I want** a coupon back in my wallet whenever the checkout it was meant for does not complete,
**so that** a refusal or an abandoned order never costs me what I redeemed.

<!-- trace:case id=g10.store-discounts.TC-qeb rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-w39,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
### grade10-site-store-discounts-US3-TC6-1: A counter sale nobody paid loses its code at the hour

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding <coupon>), with <coupon> on it, and nobody tendered it.
* The clock stands at the row's <check time>.

**Test data:**

| <check time> | The code on <counter sale A> |
| --- | --- |
| 59 minutes after the sale's only plan | Live |
| 61 minutes after the sale's only plan | No longer live |
| 61 minutes after the first plan, 55 minutes after a second plan in the same till session | Live |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Read the code minted for <coupon> on <counter sale A> at the shop.
2. Read <counter sale A> at <shop A>.
3. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* Step 1 reads the code as the row's second column says.
* <counter sale A> is not cancelled and still holds <line_1>.
* <coupon> reads unused.

<!-- trace:case id=g10.store-discounts.TC-dsi rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-w39,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
### grade10-site-store-discounts-US3-TC8-1: An expired online order keeps its code while its checkout can collect

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* customer(member holding <coupon>) has <expired order>, which expired with its checkout still able to collect.

**Test data:**

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity |
| <expired order> | An online order the member submitted with <coupon> and never paid, which the store could not close |

**Steps:**

1. Read the code minted for <coupon> on <expired order> at the shop.
2. Read <expired order> in the member's orders.
3. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* The code is still live.
* <expired order> is not cancelled.
* <coupon> reads unused.

<!-- trace:case id=g10.store-discounts.TC-93a rev=1 covers=g10.store-discounts.SC-2qg,g10.store-discounts.SC-5v2,g10.store-discounts.SC-v2s,g10.store-discounts.SC-vsw,g10.store-discounts.SC-na4,g10.store-discounts.SC-w39,g10.store-discounts.SC-cvt,g10.store-discounts.SC-82q -->
### grade10-site-store-discounts-US3-TC9-1: A gift on a counter sale nobody paid goes back to the wallet

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-03

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding <gift>), with <gift> on it, and nobody tendered it.
* <counter sale A> lost <gift> the row's way.

**Test data:**

| How <counter sale A> lost <gift> |
| --- |
| Its last plan was 61 minutes ago |
| The member submitted <later checkout> with <gift> on <grade10 store url> |

| Field | Value |
| --- | --- |
| <gift> | A gift reward the member holds, unused, inside its validity, whose threshold <line_1> passes |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <gift> |
| <later checkout> | An online checkout holding <line_1> |

**Steps:**

1. Read <counter sale A> at <shop A>.
2. Navigate to <grade10 loyalty url>.
3. Read <gift> in the member's coupons.

**Expected Results:**

* <counter sale A> is not cancelled and still holds <line_1> and <gift>'s line.
* Step 3 shows <gift> as spendable.

---

## grade10-site-store-discounts-US4: Shop staff spends a member's product coupon at the till

**As a** member of shop staff,
**I want** a member's product coupon to settle the same way at the till as it does online,
**so that** I can ring it up with the same confidence either channel gives me.

<!-- trace:case id=g10.store-discounts.TC-rf9 rev=2 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC3-2: A sale a reward was cleared off takes points, and no reward

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) has a till session open for customer(member holding <product coupon_1>, <product coupon_2> and at least <points> points), on a sale holding <line_1>.
* <product coupon_1> was applied to the sale, then cleared with 移除所有折扣.

**Test data:**

| Chosen on the sale | Answer |
| --- | --- |
| <product coupon_1> | Refused: a reward has come off this sale, ring it up on a new one |
| <product coupon_2> | Refused: a reward has come off this sale, ring it up on a new one |
| <points> points, and no reward | Taken, and the sale carries the points |

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1> |
| <product coupon_2> | A second reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1> |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Choose the row's benefit in the member's panel.
2. Apply the sale.
3. Read <product coupon_1> and <product coupon_2> in the member's coupon wallet.

**Expected Results:**

* Step 2 answers as the row's second column says.
* <product coupon_1> and <product coupon_2> stand live in the wallet.

<!-- trace:case id=g10.store-discounts.TC-pic rev=1 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC4-1: Code the paid sale does not name stops standing

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
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) rang up a till sale for customer(member) whose record carries <product coupon_1>'s minted code.
* The sale is paid, and its paid order does not name that code.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |

**Steps:**

1. Wait for the sale to settle.
2. Read <product coupon_1>'s code at the shop.
3. Read the member's order history and notifications.

**Expected Results:**

* The code no longer stands at the shop.
* Nothing shows the member the code as money saved on the sale.

<!-- trace:case id=g10.store-discounts.TC-w7h rev=1 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC5-1: A sale that collects a code another sale claims is reported and spends nothing

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
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* customer(member holding <coupon>) claimed <coupon> on <later checkout>, which took it off <counter sale A>.
* admin(shop staff) tendered <counter sale A> without planning it again, and its paid order carries the deactivated code and its cut.
* <later checkout> is paid with <coupon>'s cut.
* Neither sale has settled.

**Test data:**

| Settled first |
| --- |
| <later checkout> |
| <counter sale A> |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> before <later checkout> claimed it |
| <later checkout> | An online checkout the member submitted with <coupon> on <line_1> |

**Steps:**

1. Settle the row's sale.
2. Settle the other sale.
3. Read the member's coupons on <grade10 loyalty url>.
4. Read the commerce monitors' alerts for a sale that collected a deactivated code.

**Expected Results:**

* <coupon> reads used once, by <later checkout>.
* <counter sale A> spends no coupon.
* Step 4 shows an alert whose log line names <counter sale A>'s order.

<!-- trace:case id=g10.store-discounts.TC-99b rev=1 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC6-1: A sale paid with what it gave up spends the coupon nobody else claims

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding the row's reward), with that reward on it.
* <counter sale A> ran out its hour, and its cart still carries what the row names.
* No other sale claims the row's reward.
* admin(shop staff) tendered <counter sale A> without planning it again.

**Test data:**

| Reward | What the paid sale carries |
| --- | --- |
| <coupon> | <coupon>'s deactivated code and its cut |
| <gift> | <gift>'s line, discounted to nothing |

| Field | Value |
| --- | --- |
| <coupon> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1> |
| <gift> | A gift reward the member holds, unused, inside its validity |
| <line_1> | One HK$780.00 product |
| <counter sale A> | A till sale at <shop A> holding <line_1> |

**Steps:**

1. Settle <counter sale A>.
2. Read the member's coupons on <grade10 loyalty url>.
3. Read the commerce monitors' alerts for a sale that collected a deactivated code.

**Expected Results:**

* The row's reward reads used once, by <counter sale A>.
* Step 3 shows an alert whose log line names <counter sale A>'s order.

<!-- trace:case id=g10.store-discounts.TC-ofg rev=1 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC7-1: A counter sale a newer promise retired takes no new plan

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* customer(member holding <coupon>, <other coupon> and at least <points> points) claimed <coupon> on <later checkout>, which took it off <counter sale A>.
* admin(shop staff) has the till session holding <counter sale A> open at <shop A>, under an hour since its last plan.

**Test data:**

| Chosen on <counter sale A> |
| --- |
| <coupon> |
| <other coupon> |
| <points> points |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <other coupon> | A second reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <points> | 100, worth HK$100.00 |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> before <later checkout> claimed it |
| <later checkout> | An online checkout the member submitted with <coupon> |

**Steps:**

1. Choose the row's benefit in the member's panel.
2. Apply the sale.
3. Read <later checkout> in the member's orders.
4. Read the member's coupons on <grade10 loyalty url>.

**Expected Results:**

* Step 2 is refused, telling staff the sale has closed and to ring the goods on a new one.
* <later checkout> still carries <coupon>'s cut.
* <coupon> and <other coupon> read unused in the wallet.

<!-- trace:case id=g10.store-discounts.TC-uwj rev=1 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC8-1: A counter sale that closed takes no new plan, from its own session or a fresh scan

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) planned <counter sale A> at <shop A> for customer(member holding <coupon> and at least <points> points), with <coupon> on it.
* <counter sale A> closed the row's way.
* admin(shop staff) has a till session for that member open on the cart the row names.

**Test data:**

| How <counter sale A> closed | The till session and cart |
| --- | --- |
| It was tendered, and its paid order has reached the store | <counter sale A>'s own session, still open, on the next cart, with <line_1> rung up and the member on it |
| Its last plan was 61 minutes ago, never tendered | A new session from scanning the member's card again, on <counter sale A>'s cart |

| Field | Value |
| --- | --- |
| <coupon> | A reward coupon the member holds, unused, inside its validity, that applies to <line_1> |
| <points> | 100, worth HK$100.00 |
| <line_1> | One HK$780.00 product, on <counter sale A> |
| <counter sale A> | A till sale at <shop A> holding <line_1>, planned with <coupon> |

**Steps:**

1. Choose <points> points in the member's panel.
2. Apply the sale.
3. Read the cart's discount codes in Shopify POS.
4. Read <counter sale A>'s order.

**Expected Results:**

* Step 2 is refused, telling staff the sale has closed and to ring the goods on a new one.
* Step 3 shows no code minted by step 2.
* <counter sale A>'s order still holds <line_1> and is not rewritten.

<!-- trace:case id=g10.store-discounts.TC-6h1 rev=1 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC9-1: A gift at the till goes on as its own line and carries no code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* No automatic discount is active at the shop.
* admin(shop staff) has a till session open for customer(member holding <gift>) at <shop A>, on a sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <gift> | A gift reward the member holds, unused, inside its validity, whose threshold <line_1> passes |
| <line_1> | One HK$780.00 product |

**Steps:**

1. Choose <gift> in the member's panel.
2. Apply the sale.
3. Read the sale's lines and discount codes in Shopify POS.
4. Tender the sale.
5. Navigate to <grade10 loyalty url>.
6. Read <gift> in the member's coupons.

**Expected Results:**

* Step 3 shows <gift>'s product as its own line, discounted to nothing.
* Step 3 shows no discount code for <gift>.
* Step 6 shows <gift> used once.

<!-- trace:case id=g10.store-discounts.TC-8y2 rev=1 covers=g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-it9,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-6co -->
### grade10-site-store-discounts-US4-TC10-1: A reward POS's own remove-all took off does not go back on the sale

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-discounts-US-04

**Pre-conditions:**

* admin(shop staff) has a till session open for customer(member holding <product coupon_1>, <product coupon_2> and at least <points> points), on a sale holding <line_1>.
* <product coupon_1> was applied to the sale, then taken off with POS's own 管理折扣 → 全部移除.

**Test data:**

| Chosen on the sale | Answer |
| --- | --- |
| <product coupon_1> | Refused: a reward has come off this sale, ring it up on a new one |
| <product coupon_2> | Refused: a reward has come off this sale, ring it up on a new one |
| <points> points, and no reward | Taken, and the sale carries the points |

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1> |
| <product coupon_2> | A second reward product coupon the member holds, unused, inside its validity, that takes HK$50.00 off <line_1> |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Choose the row's benefit in the member's panel.
2. Apply the sale.
3. Read <product coupon_1> and <product coupon_2> in the member's coupon wallet.

**Expected Results:**

* Step 2 answers as the row's second column says.
* <product coupon_1> and <product coupon_2> stand live in the wallet.

## Settled

- A counter sale tendered after its coupon left, with no new plan, collects with the cut, because the shop honours a code a cart already carries; it spends the coupon where no other sale claims it, and is reported either way
- A gift on a counter sale carries no code; when its claim leaves — at the hour, or claimed elsewhere — its line stays on the cart, and a sale paid showing that line is settled by it as by a code
- A sale that collects a deactivated code is reported to an operator by the commerce monitors' alert, whose log line names the order
- A counter sale a newer promise retired, one whose coupon was claimed elsewhere among them, takes no new plan, points included, and the till asks staff to ring the goods on a new sale; a sale a reward was cleared off still takes points, and no reward
- A till session lives ten minutes and a sale's hour outlasts it, so a sale that ran out its hour is reached again only by a fresh scan; a fresh scan on a cart still carrying another sale's reward code is refused as a closed sale
- A reward taken off by POS's own 管理折扣 → 全部移除 is cleared off the sale the same as by 移除所有折扣

## Reconciliation

**Run:** 2026-10-06, QA2 reconciliation of the blind feature pass styled the same day, tcs-rules r4, run again in a fresh context after the accept review. The blind pass recorded no bundle of its own; it was run under `planning-dev`'s contract, which gives it the outline's `## Purpose` and `## Feature set`, the journeys, the proposal, `decisions.md` with its `## Raised` table, the linked PRD pages, the durable suite for id continuity and the store's domain suite, and denies it every `## Requirements` section. QA2 read both readings, the delta, `tech-design.md`, `tasks.md`, the Discounts and Coupons pages, and the application repository where a decision cites it.

- **Agreed** — `grade10-site-store-discounts-SC-19` by US3-TC6-1; `grade10-site-store-discounts-SC-21` by US4-TC5-1, in both settling orders; `grade10-site-store-discounts-SC-28` by US4-TC9-1. US3-TC9-1 walks a gift's claim leaving a counter sale at the hour and when claimed elsewhere, which `grade10-site-loyalty-programme-SC-205` and `grade10-site-loyalty-programme-SC-191` state for any coupon, with the line staying as Q15 and Q18 settle
- **Raised, folded into spec** — US3-TC8-1 held that an online order that only expires keeps its code while its checkout can collect, which the requirement states and no scenario did: `grade10-site-store-discounts-SC-26` (Q6). US4-TC10-1 held that a reward POS's own 管理折扣 → 全部移除 took off does not go back on the sale, which the requirement's "cleared off it" states and `grade10-site-store-discounts-SC-17` named only by 移除所有折扣: that scenario's GIVEN names both, inside the second revision this change already makes. US4-TC8-1's paid row held that a sale whose paid order arrived takes no new plan, which the requirement states and no scenario did: `grade10-site-store-discounts-SC-29`
- **Raised by QA2, landed** — US4-TC8-1's hour row and US3-TC6-1's third row planned a till sale an hour after its last plan in its own session. A till session lives ten minutes (`pos/deps.ts:54`), so that plan never comes: staff are told the session expired and to scan the card again, and the fresh scan would mint a second code beside the dead one on the same cart. Q19 refuses a fresh scan on a cart still carrying another sale's reward code; `grade10-site-store-discounts-SC-27` now walks that scan, the requirement and the Discounts page's `A row that closed cannot be rewritten` line carry it, and tasks 10.5 and 10.6 build it. US4-TC8-1 now walks the paid sale from its own session and the hour from a fresh scan; US3-TC6-1's third row plans twice inside one session
- **Rewritten to the spec** — US4-TC7-1, drafted as US3-TC7-1, took points on a counter sale whose coupon was claimed elsewhere. The Discounts page says that sale takes no new plan, and the feature-set line that misled the blind pass named any reward's code leaving; the line, the proposal and Q7 now say a reward cleared off. Every row is refused naming a new sale, for `grade10-site-store-discounts-SC-24`. The durable US4-TC3-1 is rewritten for `grade10-site-store-discounts-SC-17`'s second revision, another reward refused too, and `grade10-site-store-discounts-SC-22`, points still taken, so it is US4-TC3-2 under its marker's second revision. US4-TC5-1 reads the commerce monitors' alert, the reader Q16 names. US3-TC9-1's line staying is asserted on both rows, as Q18 settles for the hour. The durable US4-TC4-1 is carried unchanged. Both carried markers keep their ids and list every scenario serving US-04, as the trace convention sets; `grade10-site-store-discounts-SC-17` and `grade10-site-store-discounts-SC-18` serve feature-set lines, so their cases cover them in this reading, not in a marker
- **Raised by the blind pass, landed** — Q14 in US4-TC5-1 and US4-TC6-1; Q15 in US4-TC6-1's gift row and US3-TC9-1; Q16 in the alert both read
- **Cases added after the reconciliation** — US4-TC6-1 (`grade10-site-store-discounts-SC-23`, `grade10-site-store-discounts-SC-25`): written from the scenarios, so it is not blind. US4-TC3-2 is the durable case, rewritten
- **Contradicted** — none left. The one opposite reading, points on a sale whose coupon was claimed elsewhere, is settled by the Discounts page
- **Restated unchanged** — `grade10-site-store-discounts-SC-01`, `grade10-site-store-discounts-SC-08`, `grade10-site-store-discounts-SC-05`, `grade10-site-store-discounts-SC-06`, `grade10-site-store-discounts-SC-02`, `grade10-site-store-discounts-SC-12`, `grade10-site-store-discounts-SC-11`, `grade10-site-store-discounts-SC-13`, `grade10-site-store-discounts-SC-07`, `grade10-site-store-discounts-SC-14` and `grade10-site-store-discounts-SC-18` keep the durable suite's US1-TC1-1, US1-TC4-1, US1-TC2-1, US1-TC1-1, US1-TC3-1, US3-TC3-1, US3-TC2-1, US3-TC5-1, US4-TC1-1, US4-TC2-1 and US4-TC4-1. Online a gift still rides its own code, so US1-TC3-1 stands
- **Retitled and retraced after the accept review** — US4-TC5-1's title stated that any sale collecting a deactivated code spends nothing, which US4-TC6-1 contradicts; it now names a code another sale claims. US3-TC7-1 walks shop staff at the till, which `grade10-site-store-discounts-SC-24` serves under US-04, so it is retraced there as US4-TC7-1
- **Uncovered anchors** — none. No domain case walks a sale nobody paid, so none is covered at domain
