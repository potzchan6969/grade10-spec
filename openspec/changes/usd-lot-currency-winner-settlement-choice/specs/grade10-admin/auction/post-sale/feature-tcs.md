# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-admin-auction-post-sale-SC-37, grade10-admin-auction-post-sale-SC-38, grade10-admin-auction-post-sale-SC-49, grade10-admin-auction-post-sale-SC-50, grade10-admin-auction-post-sale-SC-68, grade10-admin-auction-post-sale-SC-69, grade10-admin-auction-post-sale-SC-70, grade10-admin-auction-post-sale-SC-75, grade10-admin-auction-post-sale-SC-76, grade10-admin-auction-post-sale-SC-77, grade10-admin-auction-post-sale-SC-78, grade10-admin-auction-post-sale-SC-79, grade10-admin-auction-post-sale-SC-80, grade10-admin-auction-post-sale-SC-81, grade10-admin-auction-post-sale-SC-82, grade10-admin-auction-post-sale-SC-83, grade10-admin-auction-post-sale-SC-90, grade10-admin-auction-post-sale-SC-91, grade10-admin-auction-post-sale-SC-107, grade10-admin-auction-post-sale-SC-108, grade10-admin-auction-post-sale-SC-109, grade10-admin-auction-post-sale-SC-110, grade10-admin-auction-post-sale-SC-111, grade10-admin-auction-post-sale-SC-112, grade10-admin-auction-post-sale-SC-113, grade10-admin-auction-post-sale-SC-114, grade10-admin-auction-post-sale-SC-115, grade10-admin-auction-post-sale-SC-118, grade10-admin-auction-post-sale-SC-125, grade10-admin-auction-post-sale-SC-126, grade10-admin-auction-post-sale-SC-133, grade10-admin-auction-post-sale-SC-134, grade10-admin-auction-post-sale-SC-136, grade10-admin-auction-post-sale-SC-137, grade10-admin-auction-post-sale-SC-139, post-sale-SC-156, post-sale-SC-157, post-sale-SC-158, grade10-admin-auction-post-sale-SC-162, grade10-admin-auction-post-sale-SC-163, grade10-admin-auction-post-sale-SC-164, grade10-admin-auction-post-sale-SC-167, grade10-admin-auction-post-sale-SC-168, grade10-admin-auction-post-sale-SC-169, grade10-admin-auction-post-sale-SC-170, grade10-admin-auction-post-sale-SC-171, grade10-admin-auction-post-sale-SC-172, grade10-admin-auction-post-sale-SC-184, grade10-admin-auction-post-sale-SC-185, grade10-admin-auction-post-sale-SC-193, grade10-admin-auction-post-sale-SC-194, post-sale-SC-210, grade10-admin-auction-post-sale-SC-211, grade10-admin-auction-post-sale-SC-212, grade10-admin-auction-post-sale-SC-213, grade10-admin-auction-post-sale-SC-214, grade10-admin-auction-post-sale-SC-215, grade10-admin-auction-post-sale-SC-216

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=2 covers=g10adm.auction-post-sale.SC-qvj,g10adm.auction-post-sale.SC-omk,g10adm.auction-post-sale.SC-t9u,g10adm.auction-post-sale.SC-tj1,g10adm.auction-post-sale.SC-hgh,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-qv1,g10adm.auction-post-sale.SC-36t,g10adm.auction-post-sale.SC-g1u,g10adm.auction-post-sale.SC-qtj -->
### post-sale-US5-TC9-2: Operator sends an invoice with tax typed in USD

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer with a bank transfer fee of 0, whose settlement currency is HKD and whose lines before Tax total `<lines>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lines>` | HKD3,120 (fixed derived value), 312000 minor units in HKD |
| `<tax>` | USD60 (range: >0 minor units), typed in USD |
| `<tax in HKD>` | `<tax>` converted by Grade10 to HKD |

**Steps:**

1. Enter `<tax>` as Tax.
2. Read the quote.
3. Send the invoice.

**Expected Results:**

* The Tax field takes USD.
* The invoice is sent with Tax of `<tax in HKD>` in HKD.
* Its Subtotal includes Tax and reads `<lines>` plus `<tax in HKD>` in HKD.
* The invoice is `pending` and its order total equals that Subtotal.

<!-- trace:case id=g10adm.auction-post-sale.TC-70n rev=1 covers=g10adm.auction-post-sale.SC-8ko,g10adm.auction-post-sale.SC-lxd,g10adm.auction-post-sale.SC-lc8 -->
### post-sale-US5-TC20-1: Every quote amount is typed in USD and sent in the settlement currency

Runs once per row of **Test data**.

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer, whose settlement currency is the one the row names.

**Test data:**

| Field | Value |
| --- | --- |
| `<shipping and handling>` | USD80 (range: >0 minor units), typed in USD |
| `<insurance>` | USD40 (range: >0 minor units), typed in USD |
| `<bank transfer fee>` | USD15 (range: >0 minor units), typed in USD |

| Settlement currency | Invoice amounts |
| --- | --- |
| HKD | Each amount converted by Grade10 to HKD |
| USD | Each amount as typed, no conversion |

**Steps:**

1. Open Send invoice.
2. Read the currency each amount field takes.
3. Enter `<shipping and handling>`, `<insurance>` and `<bank transfer fee>`.
4. Read the order total.
5. Send the invoice.

**Expected Results:**

* Step 2: Shipping & Handling, Insurance and the bank transfer fee each take USD.
* Step 4: the subtotal, the payment processing fee and the order total read in the row's settlement currency, and no conversion rate shows on the quote.
* The sent invoice is `pending` and carries the amounts the row names, in the row's settlement currency, at the order total read in step 4.

<!-- trace:case id=g10adm.auction-post-sale.TC-w5z rev=1 covers=g10adm.auction-post-sale.SC-pp0 -->
### post-sale-US5-TC21-1: The settlement currency is changed before send

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice whose settlement currency is HKD and whose winner confirmed bank transfer on HK Local.

**Test data:**

| Field | Value |
| --- | --- |
| `<shipping and handling>` | USD80 (range: >0 minor units), typed in USD |
| `<reason>` | Winner picked the wrong currency |

**Steps:**

1. Change the order's settlement currency to USD, with `<reason>`.
2. Open Send invoice and enter `<shipping and handling>`.
3. Send the invoice.

**Expected Results:**

* After step 1 the order reads USD, still holds bank transfer on HK Local and still reads Preparing Invoice.
* The invoice log shows an order edited before send entry naming the settlement currency as a changed part, HKD before and USD after.
* Step 2: the quote reads in USD.
* The sent invoice is in USD and carries `<shipping and handling>` as typed.

<!-- trace:case id=g10adm.auction-post-sale.TC-r3c rev=1 covers=g10adm.auction-post-sale.SC-2g5 -->
### post-sale-US5-TC22-1: The settlement currency is changed on a reissue after send

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order with a pending invoice sent in HKD for bank transfer on HK Local.

**Steps:**

1. Reissue the invoice, set its settlement currency to USD, keep HK Local, change nothing else and give a reason.
2. Read the order, the reissued invoice, the replaced invoice and the invoice log.

**Expected Results:**

* The order's settlement currency reads USD.
* The reissued invoice is pending and is in USD, with its lines priced from the order's USD amounts and none converted.
* The replaced invoice still reads its HKD amounts.
* The reissued entry on the invoice log names the settlement currency as a changed part.

<!-- trace:case id=g10adm.auction-post-sale.TC-d4e rev=1 covers=g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-b44 -->
### post-sale-US5-TC23-1: The quote names the payment method and rail the winner chose

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
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice whose settlement currency and payment method the row names, and where Payment Settings holds the card rule the row needs.

**Test data:**

| Settlement currency | Method and rail the winner chose | The quote names |
| --- | --- | --- |
| HKD | Card | Card |
| HKD | Bank transfer on FPS | Bank transfer, FPS |
| HKD | Bank transfer on HK Local | Bank transfer, HK Local |
| USD | Bank transfer on HK Local | Bank transfer, HK Local |
| USD | Bank transfer on International via SWIFT | Bank transfer, International via SWIFT |

**Steps:**

1. Open Send invoice.
2. Read the payment method and rail the quote names.
3. Read the fee the quote asks for.

**Expected Results:**

* The quote names the method and rail the row names, and no other rail.
* The quote does not read as one generic bank transfer.
* A bank transfer row asks for a bank transfer fee in USD and shows no fee computed from the card rule.
* The card row shows the fee computed from the card rule of the settlement currency, and no bank transfer fee field.

<!-- trace:case id=g10adm.auction-post-sale.TC-9yj rev=1 covers=g10adm.auction-post-sale.SC-c0y -->
### post-sale-US5-TC24-1: A typed amount that does not convert to a whole HK$ is rounded up
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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer on HK Local, whose settlement currency is HKD.

**Test data:**

| Field | Value |
| --- | --- |
| `<shipping and handling>` | USD10.01 (fixed boundary or equality), 1001 minor units, which converts to a fraction of a HK$ |

**Steps:**

1. Open Send invoice and enter `<shipping and handling>`.
2. Read the Shipping & Handling line the quote shows.
3. Send the invoice and read its Shipping & Handling line.

**Expected Results:**

* The quote reads Shipping & Handling of HKD79.00, the typed amount converted and rounded up to the whole HK$.
* The invoice carries Shipping & Handling of HKD79.00.
* The invoice line keeps USD10.01 as the amount the operator typed.

<!-- trace:case id=g10adm.auction-post-sale.TC-jru rev=1 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-guq -->
### post-sale-US5-TC25-1: Sending prices the invoice in the settlement currency and locks the order
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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice whose settlement currency is HKD and whose winner confirmed bank transfer on FPS.
* The order's winning bid is `<winning bid>` and its buyer's premium is `<premium>`, both in USD.

**Test data:**

| Field | Value |
| --- | --- |
| `<winning bid>` | USD100.00 (fixed derived value), 10000 minor units |
| `<premium>` | USD20.00 (fixed derived value), 2000 minor units |

| Shipping & Handling | Insurance | Order total |
| --- | --- | --- |
| USD10.00 | USD4.00 | HKD1,053.00 (fixed derived value) |
| USD0.00 | none added | HKD942.00 (fixed derived value) |

**Steps:**

1. Open Send invoice and enter the row's lines, with a bank transfer fee of USD0.
2. Send the invoice at 2026-09-12T09:00:00Z.
3. Read the order and the invoice.

**Expected Results:**

* The invoice is `pending` with the row's order total in HKD.
* The payment deadline reads 2026-09-19T09:00:00Z.
* The delivery address, the settlement currency and the payment method are locked.
* The order reads Pending Payment.

<!-- trace:case id=g10adm.auction-post-sale.TC-qz7 rev=1 covers=g10adm.auction-post-sale.SC-miq -->
### post-sale-US5-TC26-1: A large bank transfer fee is accepted and converts with the other lines
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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order in Preparing Invoice for bank transfer, whose settlement currency is HKD and whose lines read a subtotal of HKD1,053.00 before the bank transfer fee.

**Test data:**

| Field | Value |
| --- | --- |
| `<bank transfer fee>` | USD500.00 (fixed derived value), 50000 minor units |

**Steps:**

1. Open Send invoice and enter `<bank transfer fee>`.
2. Read the order total.
3. Send the invoice and read it.

**Expected Results:**

* The quote shows no cap or refusal for the fee.
* The invoice carries a bank transfer fee of HKD3,925.00, the typed amount converted.
* The invoice is `pending` with an order total of HKD4,978.00.

<!-- trace:case id=g10adm.auction-post-sale.TC-9i1 rev=1 covers=g10adm.auction-post-sale.SC-4va,g10adm.auction-post-sale.SC-xsv -->
### post-sale-US5-TC27-1: A currency change that leaves the held rail unoffered is refused
Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quote and send

**Pre-conditions:**

* admin(operator with payment-processing) is on the order the row names.

**Test data:**

| Route | The order before | The change |
| --- | --- | --- |
| Edit before send | USD, Preparing Invoice, bank transfer on International via SWIFT | Settlement currency to HKD, with no other method named |
| Reissue | HKD, pending invoice, bank transfer on FPS | Settlement currency to USD, keeping FPS |

**Steps:**

1. Make the row's change with a reason.
2. Read the order and its invoice log.

**Expected Results:**

* Grade10 refuses the change.
* The order, or the current invoice, still holds the currency and rail it held before.
* The invoice log gains no entry.

<!-- trace:case id=g10adm.auction-post-sale.TC-pjh rev=1 covers=g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-0ew,g10adm.auction-post-sale.SC-j60 -->
### post-sale-US5-TC28-1: An operator edits the method and rail before send, and a rail the currency does not offer is refused
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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(operator with payment-processing) has the order the row names, in Preparing Invoice.
* Grade10 holds bank details for the rail the row names.

**Test data:**

| The order before | The change | Outcome |
| --- | --- | --- |
| HKD, card, home address | Work address and bank transfer on FPS | Accepted; the order holds the work address and bank transfer on FPS |
| USD, card | Bank transfer on International via SWIFT | Accepted; the order holds bank transfer on International via SWIFT |
| USD, card | Bank transfer on FPS | Refused; the order still holds card |

**Steps:**

1. Open the edit before send on the order.
2. Make the row's change with the reason `Winner asked by email` and commit.
3. Read the order and the invoice log.

**Expected Results:**

* The outcome the row names holds.
* The order still reads Preparing Invoice.
* An accepted edit adds an order edited before send entry naming the operator, the reason, and each part changed with its value before and after.
* A refused edit adds no entry and the order keeps its card method.


<!-- trace:case id=g10adm.auction-post-sale.TC-ddn rev=1 covers=g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-ppk -->
### post-sale-US5-TC30-1: Recording setup by telephone carries a settlement currency
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
* **Trace:** Quote and send

**Pre-conditions:**

* admin(operator with payment-processing) is on an order in Setup Overdue whose address deadline has passed, with invoice status `not_issued` and no confirmed address.

**Test data:**

| Setup recorded | Outcome |
| --- | --- |
| Delivery address, billing address, settlement currency HKD, and bank transfer on HK Local | Accepted |
| Delivery address, billing address and bank transfer on HK Local, no settlement currency | Refused |

**Steps:**

1. Record the row's setup with the reason `Winner gave it by telephone`.
2. Read the order.

**Expected Results:**

* The outcome the row names holds.
* An accepted record derives Preparing Invoice, and the winner cannot change the address because the address deadline has passed.
* A refused record leaves the order in Setup Overdue holding no recorded address and no currency.


## Settled

- None this run. The blind reading's question whether this capability takes a delta in this change was answered as Q24; the questions raised below are open.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-14 for change `usd-lot-currency-winner-settlement-choice`, joining QA1's blind cases with Dev's delta scenarios on `post-sale-US-05`, the `Quote and send` anchor, and the restated `post-sale-US-02`, `post-sale-US-07` and `post-sale-US-18` (read through the `Quote and send` anchor, the one the delta defines). Read the change's `proposal.md`, `decisions.md` (Q1 to Q27 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| Every quote amount is typed in USD; an HKD order reads the converted subtotal, fee and total and no rate; a USD order converts nothing and reads a line typed `80.00` as 8000 minor units | **Folded in:** `grade10-admin-auction-post-sale-SC-251`, `grade10-admin-auction-post-sale-SC-243` and `grade10-admin-auction-post-sale-SC-165`, asserted by the HKD and USD rows of `g10adm.auction-post-sale.US5-TC20`. QA2 widened its Expected Results with the subtotal, the fee, the order total and the no-rate clause |
| A typed amount that converts to a fraction of a HK$ is rounded up on the line | **Added:** `g10adm.auction-post-sale.US5-TC24` asserts `grade10-admin-auction-post-sale-SC-252`. QA1's USD80 is a whole HK$ on conversion and reads no rounding |
| Tax typed in USD converts and enters the Subtotal | **Folded in:** `post-sale-SC-155`, asserted by `g10adm.auction-post-sale.US5-TC9`, which QA2 widened with the bank transfer fee of 0, the `pending` status and the order total |
| A send prices the invoice in the settlement currency, starts the deadline, locks the address, currency and method; a send with no insurance prices without it | **Added:** `g10adm.auction-post-sale.US5-TC25` asserts `grade10-admin-auction-post-sale-SC-48` and `grade10-admin-auction-post-sale-SC-63`, one row each; QA1 read the quote and not the send |
| A bank transfer fee has no cap and converts with the other lines | **Added:** `g10adm.auction-post-sale.US5-TC26` asserts `grade10-admin-auction-post-sale-SC-119`. The refusal of a negative fee is `grade10-admin-auction-post-sale-SC-118`, restated unchanged |
| The quote names the method and the rail the winner chose, asks for the bank transfer fee in USD, and names SWIFT on a USD order | **Folded in:** `grade10-admin-auction-post-sale-SC-117` and `grade10-admin-auction-post-sale-SC-244`, asserted by the rows of `g10adm.auction-post-sale.US5-TC23`. QA1's rows named abstract rails, which cannot tell FPS under HKD from SWIFT under USD, so QA2 made each row a currency and a named rail |
| An operator changes the settlement currency before send with a reason, and the log names it | **Folded in:** `grade10-admin-auction-post-sale-SC-247`, asserted by `g10adm.auction-post-sale.US5-TC21`, which QA2 widened with the reason, the kept rail and the log entry. The reason and the entry are required by "An operator edits the address or method before send" |
| A currency change that leaves the held method or rail unoffered is refused, before send and on a reissue | **Added:** `g10adm.auction-post-sale.US5-TC27` asserts `grade10-admin-auction-post-sale-SC-248` and `grade10-admin-auction-post-sale-SC-246`, one row each |
| A reissue in another currency prices from the USD amounts, leaves the replaced invoice untouched and names the currency as changed | **Folded in:** `grade10-admin-auction-post-sale-SC-245`, asserted by `g10adm.auction-post-sale.US5-TC22`, which QA2 widened with the replaced invoice and the log entry |
| An edit before send changes the address and method to a rail on the order's currency and is logged; a USD order is edited to SWIFT; FPS under USD is refused | **Added:** `g10adm.auction-post-sale.US5-TC28` asserts `grade10-admin-auction-post-sale-SC-135`, `grade10-admin-auction-post-sale-SC-249` and `grade10-admin-auction-post-sale-SC-138`, one row each. The title of `grade10-admin-auction-post-sale-SC-138` is historical, as its text says |
| Recording setup by telephone names a settlement currency, and a record with none is refused | **Added:** `g10adm.auction-post-sale.US5-TC30` asserts `grade10-admin-auction-post-sale-SC-84` and `grade10-admin-auction-post-sale-SC-250`, one row each |
| An internal bidder's order carries no settlement currency and no rail, and a send refuses until an operator sets them | **Stop and ask the author:** `grade10-admin-auction-post-sale-SC-253` is not linked and no case was written. `decisions.md` Q20 says the lot reads USD and "nothing else changes", while the scenario and "An operator quotes and sends the invoice" add a refusal and a step before send; the durable `grade10-admin-auction-internal-bid-SC-73`, outside this change by Q25, sends the internal order's invoice with no such step. Raised in `decisions.md` |
| The quote's amounts are read in the settlement currency with no rate | **Checked, no contradiction:** the requirement names the subtotal, the payment processing fee and the order total in HKD for an HKD order, and the card quote reads the fee computed from the HKD rule; `grade10-admin-auction-post-sale-SC-251` and `grade10-admin-auction-post-sale-SC-69` agree. What the winner's Order Summary shows for the card fee is Q17 and is a winner-order question |
| Scenarios the modified blocks restate with a USD fixture and no rule change: `grade10-admin-auction-post-sale-SC-107`, `-SC-110`, `-SC-111`, `post-sale-SC-158`, `post-sale-SC-210`, `grade10-admin-auction-post-sale-SC-170`, `-SC-172` and `-SC-216` | **Out of suite:** the durable suite holds the verifying cases: `g10adm.auction-post-sale.TC-6bv` (`SC-107`), `TC-w3j` (`SC-110` and `SC-172`), `post-sale-US7-TC8-1` (`SC-111`), `TC-6p7` (`post-sale-SC-158`), `TC-yjb` (`post-sale-SC-210`), `TC-42i` (`SC-170`) and `TC-0jl` (`SC-216`). Their fixtures read HKD; the rule is the same per currency |
| The other 50 scenarios the modified blocks restate unchanged | **Out of suite:** the durable `g10adm.auction-post-sale` suite holds them, and this change does not alter them; each id appears in the `covers` of a case there. Those markers bundle a journey's cases, so they say which durable cases hold a scenario and not which one case asserts it |
| Quote and send durable cases still read HKD amounts as typed: `g10adm.auction-post-sale.TC-dre` family, `TC-j3w`, `TC-jn5` | **Not folded:** the durable suite's fixtures; each needs a USD-typed restatement at the walk of task 11.7 or at archive |

**Uncovered anchors:** none for `post-sale-US-05` or `Quote and send`.

**Uncovered scenarios:** `grade10-admin-auction-post-sale-SC-253`, held for the author and the PM; see the row above.

**Over-claimed cases:** none. The five QA1 cases were widened, not relabelled.

**Contradictions:** `grade10-admin-auction-post-sale-SC-253` and the requirement text "an internal bidder's order holds neither until an operator sets them" read against `decisions.md` Q20 ("nothing else changes") and the durable internal-bid send scenario; held. `spec.md:223` and `spec.md:456` name an invoice-sent letter and an invoice-reissued letter that `grade10-site/auction/notifications-order` does not send; the letter is the payment reminder, per the contradictions note of that suite.
