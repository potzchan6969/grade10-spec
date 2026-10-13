# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.auction-notifications-order.US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

<!-- trace:case id=g10.auction-notifications-order.TC-8bw rev=2 covers=g10.auction-notifications-order.SC-pyd -->
### g10.auction-notifications-order.US1-TC1: Winning a lot sends auction-won naming the US$ winning bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email.
* The winner has not picked a settlement currency for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A USD lot that just closed with this winner |
| `<winning bid>` | USD2,400 (range: >0 minor units), the winning bid on `<lot_1>` |

**Steps:**

1. Close `<lot_1>` with this winner.
2. Open the winner's inbox.

**Expected Results:**

* One auction-won letter names `<lot_1>` and the setup deadline.
* It names `<winning bid>` in US$.
* It names no HKD amount and no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-5o0 rev=2 covers=g10.auction-notifications-order.SC-tfm,g10.auction-notifications-order.SC-3mo -->
### g10.auction-notifications-order.US1-TC2: Invoice send is the first payment reminder in the settlement currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has confirmed setup and picked the settlement currency the row names.
* admin(operator) can send the invoice for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order in Preparing Invoice for a USD lot won at `<winning bid>` |
| `<winning bid>` | USD2,400 (range: >0 minor units) |

| Settlement currency | `<total>` |
| --- | --- |
| HKD | HKD18,840 or more (range: at least `<winning bid>` converted at 7.85 and rounded up to the whole HK$) |
| USD | USD2,400 or more (range: at least `<winning bid>`) |

**Steps:**

1. admin(operator) sends the invoice for `<lot_1>` with `<total>`.
2. Open the winner's inbox.

**Expected Results:**

* One payment-reminder letter names `<total>` in the row's settlement currency and the payment deadline.
* The letter names no USD winning bid and no conversion rate.
* The deadline uses `Asia/Hong_Kong` and is labelled `GMT+8`.
* No separate invoice-sent letter exists.

<!-- trace:case id=g10.auction-notifications-order.TC-ew9 rev=1 -->
### g10.auction-notifications-order.US1-TC56: Later payment reminders carry the settlement currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a pending unpaid invoice in HKD, for a USD lot won at `<winning bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order with a pending HKD invoice and a known payment deadline |
| `<winning bid>` | USD2,400 (range: >0 minor units) |

| Reminder | When |
| --- | --- |
| Day-3 reminder | Day 3 after invoice issue |
| Day-6 reminder | Day 6 after invoice issue |
| Final notice | 24 hours before the payment deadline |

**Steps:**

1. Wait until the time the row names.
2. Open the winner's inbox and read the letter.

**Expected Results:**

* One letter of the row's reminder kind exists for `<lot_1>`.
* Every amount in it reads in HKD.
* The letter names no USD winning bid and no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-vxo rev=1 covers=g10.auction-notifications-order.SC-16k -->
### g10.auction-notifications-order.US1-TC57: Payment received and partial payment received letters carry the settlement currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email and an unpaid invoice in HKD, for a USD lot won at `<winning bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order with a pending HKD invoice |
| `<winning bid>` | USD2,400 (range: >0 minor units) |

| Letter | Payment recorded |
| --- | --- |
| Payment received | The invoice paid in full |
| Partial payment received | A payment below the invoice total |

**Steps:**

1. Record the payment the row names for `<lot_1>`.
2. Open the winner's inbox and read the letter the row names, and its attached receipt PDF.

**Expected Results:**

* One letter of the row's kind exists for `<lot_1>`.
* Every amount in it reads in HKD.
* The letter names no USD winning bid and no conversion rate.
* The attached receipt PDF reads the same HKD amounts and prints no USD winning bid and no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-l6s rev=1 covers=g10.auction-notifications-order.SC-0e7 -->
### g10.auction-notifications-order.US1-TC58: A reissue after a currency change sends the reminder in the new currency

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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a pending invoice in HKD.
* admin(operator) can reissue the invoice for `<lot_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order with a pending HKD invoice, for a USD lot won at `<winning bid>` |
| `<winning bid>` | USD2,400 (range: >0 minor units) |

**Steps:**

1. admin(operator) changes the settlement currency of `<lot_1>` to USD and reissues the invoice.
2. Open the winner's inbox and the send log.

**Expected Results:**

* One payment-reminder letter exists for the new invoice, and every amount in it reads in USD.
* No amount in it reads in HKD.
* The HKD invoice's earlier payment-reminder letter still reads its HKD amounts.
* No invoice-reissued letter exists.

<!-- trace:case id=g10.auction-notifications-order.TC-xsq rev=1 covers=g10.auction-notifications-order.SC-7qg -->
### g10.auction-notifications-order.US1-TC59: The payment overdue letter names the outstanding amount in the settlement currency
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
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner of `<lot_1>`) has a registered email and a pending unpaid invoice in HKD, for a USD lot won at `<winning bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | An order with a pending HKD invoice and a known payment deadline |
| `<winning bid>` | USD2,400 (range: >0 minor units) |

**Steps:**

1. Let the invoice's payment deadline pass so Grade10 sets it to `expired`.
2. Open the winner's inbox and read the letter.

**Expected Results:**

* One payment overdue letter exists for `<lot_1>`.
* It names the invoice total as the outstanding amount in HKD.
* It names no USD amount and no conversion rate.


## Settled

- None this run. The blind reading's question, which letters keep a USD amount, was answered by the PM as Q18 and the capability's delta as Q24; it needs no entry here.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-14 for change `usd-lot-currency-winner-settlement-choice`, joining QA1's blind cases with Dev's delta scenarios on the `Post-close letters` anchor of `grade10-site-auction-notifications-order`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q27 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| The auction-won letter names the winning bid in US$ and nothing else | **Folded in:** `order-mail-SC-63`, asserted by `g10.auction-notifications-order.US1-TC1`. QA1 read the US$ bid; QA2 added the no-HKD and no-rate results |
| The invoice send is the first payment reminder, in the settlement currency, with no USD winning bid and no rate | **Folded in:** `order-mail-SC-64` and `order-mail-SC-65`, asserted by the HKD and USD rows of `g10.auction-notifications-order.US1-TC2`. The case's `<total>` values were not the conversion of its winning bid (a total of USD420 and HKD3,280 for a winning bid of USD2,400), so QA2 replaced them with ranges |
| The payment received letter and its receipt PDF read the settlement currency, with no USD winning bid and no rate | **Folded in:** `order-mail-SC-66`, asserted by `g10.auction-notifications-order.US1-TC57`. QA1's "Receipt" row read the receipt as a letter of its own; the receipt is the PDF attached to the payment-received letter, so the row became the partial payment received letter and the PDF is read in the case's results |
| The payment overdue letter names the outstanding amount in the settlement currency and no USD amount | **Added:** `g10.auction-notifications-order.US1-TC59` asserts `order-mail-SC-67`; QA1 read the reminders and the payment-received letters and not this one |
| A reissue in another currency sends the new invoice's payment reminder in that currency, and the earlier letter is unchanged | **Folded in:** `order-mail-SC-68`, asserted by `g10.auction-notifications-order.US1-TC58`, which QA2 widened with the earlier letter |
| The day 3 and day 6 reminders and the final notice read the settlement currency, with no USD winning bid and no rate | **Fold candidate:** `g10.auction-notifications-order.US1-TC56` reads the three letters and no scenario states them; the requirement does. Left unlinked. The partial payment received letter has a row in `US1-TC57` and no scenario either |
| Which letter is the invoice letter | **Checked:** the requirement and the scenarios send the payment-reminder letter on an invoice send or a reissue, as the durable capability does, and `g10.auction-notifications-order.US1-TC2` reads that no separate invoice-sent letter exists. Two other places still name an invoice-sent letter and an invoice-reissued letter, and the delta's own `## Feature set` lists "invoice" and "receipt" as letters; see Contradictions |

**Uncovered anchors:** none for `Post-close letters`.

**Over-claimed cases:** none after the rework. The `<total>` figures of `g10.auction-notifications-order.US1-TC2` were inconsistent with its winning bid and are now ranges.

**Contradictions:** `grade10-admin/auction/post-sale` delta `spec.md:223` says an operator send sends "the invoice-sent letter" and `spec.md:456` says a reissue sends "the invoice-reissued letter", while `grade10-site/auction/notifications-order` delta `spec.md` and the durable capability send the payment-reminder letter for both and have no separate reissued letter. The notifications-order delta `spec.md:7` lists "invoice" and "receipt" among the letters, which are the payment reminder and the PDF in the payment-received letter. Both are wording carried from the durable text and not a product question; Dev should name the payment reminder in all three places.
