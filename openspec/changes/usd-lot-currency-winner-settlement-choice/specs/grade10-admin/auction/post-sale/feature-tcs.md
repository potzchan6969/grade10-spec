# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-admin-auction-post-sale-SC-37, grade10-admin-auction-post-sale-SC-38, grade10-admin-auction-post-sale-SC-49, grade10-admin-auction-post-sale-SC-50, grade10-admin-auction-post-sale-SC-68, grade10-admin-auction-post-sale-SC-69, grade10-admin-auction-post-sale-SC-70, grade10-admin-auction-post-sale-SC-75, grade10-admin-auction-post-sale-SC-76, grade10-admin-auction-post-sale-SC-77, grade10-admin-auction-post-sale-SC-78, grade10-admin-auction-post-sale-SC-79, grade10-admin-auction-post-sale-SC-80, grade10-admin-auction-post-sale-SC-81, grade10-admin-auction-post-sale-SC-82, grade10-admin-auction-post-sale-SC-83, grade10-admin-auction-post-sale-SC-90, grade10-admin-auction-post-sale-SC-91, grade10-admin-auction-post-sale-SC-107, grade10-admin-auction-post-sale-SC-108, grade10-admin-auction-post-sale-SC-109, grade10-admin-auction-post-sale-SC-110, grade10-admin-auction-post-sale-SC-111, grade10-admin-auction-post-sale-SC-112, grade10-admin-auction-post-sale-SC-113, grade10-admin-auction-post-sale-SC-114, grade10-admin-auction-post-sale-SC-115, grade10-admin-auction-post-sale-SC-118, grade10-admin-auction-post-sale-SC-125, grade10-admin-auction-post-sale-SC-126, grade10-admin-auction-post-sale-SC-133, grade10-admin-auction-post-sale-SC-134, grade10-admin-auction-post-sale-SC-136, grade10-admin-auction-post-sale-SC-137, grade10-admin-auction-post-sale-SC-139, post-sale-SC-156, post-sale-SC-157, post-sale-SC-158, grade10-admin-auction-post-sale-SC-162, grade10-admin-auction-post-sale-SC-163, grade10-admin-auction-post-sale-SC-164, grade10-admin-auction-post-sale-SC-167, grade10-admin-auction-post-sale-SC-168, grade10-admin-auction-post-sale-SC-169, grade10-admin-auction-post-sale-SC-170, grade10-admin-auction-post-sale-SC-171, grade10-admin-auction-post-sale-SC-172, grade10-admin-auction-post-sale-SC-184, grade10-admin-auction-post-sale-SC-185, grade10-admin-auction-post-sale-SC-193, grade10-admin-auction-post-sale-SC-194, post-sale-SC-210, grade10-admin-auction-post-sale-SC-211, grade10-admin-auction-post-sale-SC-212, grade10-admin-auction-post-sale-SC-213, grade10-admin-auction-post-sale-SC-214, grade10-admin-auction-post-sale-SC-215, grade10-admin-auction-post-sale-SC-216

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=2 -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-70n rev=2 covers=g10adm.auction-post-sale.SC-8ko,g10adm.auction-post-sale.SC-c0y -->
### post-sale-US5-TC20-2: Every quote amount is typed in USD and sent in the settlement currency

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
| Exact HKD quote row | Order has a 10100-minor-unit USD winning bid and 2020-minor-unit USD premium; enter USD1001 shipping and handling and USD0 bank transfer fee |

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
* For the exact HKD quote row, the quote's order total is 103100 minor units in HKD, with no conversion rate shown.
* For the exact HKD quote row, Grade10 stores the shipping and handling line as 1001 minor units in USD and the sent invoice carries it as 7900 minor units in HKD.

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

<!-- trace:case id=g10adm.auction-post-sale.TC-r3c rev=2 covers=g10adm.auction-post-sale.SC-2g5 -->
### post-sale-US5-TC22-2: The settlement currency is changed on a reissue after send

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

**Test data:**

| Field | Value |
| --- | --- |
| Winning bid on the order | 78500 minor units in HKD |
| USD winning bid on reissue | 10000 minor units in USD |

**Steps:**

1. Reissue the invoice, set its settlement currency to USD, keep HK Local, change nothing else and give a reason.
2. Read the order, the reissued invoice, the replaced invoice and the invoice log.

**Expected Results:**

* The order's settlement currency reads USD.
* The reissued invoice is pending and is in USD, with its lines priced from the order's USD amounts and none converted.
* The replaced invoice still reads its HKD amounts.
* The reissued entry on the invoice log names the settlement currency as a changed part.
* The reissued invoice's Winning Bid is 10000 minor units in USD; the replaced invoice's Winning Bid remains 78500 minor units in HKD.

<!-- trace:case id=g10adm.auction-post-sale.TC-d4e rev=1 -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-9yj rev=1 -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-jru rev=1 -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-qz7 rev=1 -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-9i1 rev=1 covers=g10adm.auction-post-sale.SC-xsv,g10adm.auction-post-sale.SC-4va -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-pjh rev=1 covers=g10adm.auction-post-sale.SC-0ew -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-ddn rev=1 -->
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

<!-- trace:case id=g10adm.auction-post-sale.TC-rail rev=1 covers=g10adm.auction-post-sale.SC-r31,g10adm.auction-post-sale.SC-r32 -->
### post-sale-US5-TC31-1: A rail-only change is accepted on reissue

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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) has an order with a pending bank transfer invoice using the row's current rail.
* Grade10 holds bank details for the row's new rail.

**Test data:**

| Settlement currency | Current rail | New rail |
| --- | --- | --- |
| HKD | FPS | HK Local |
| USD | HK Local | International via SWIFT |

**Steps:**

1. Reissue the invoice with only the bank rail changed to the row's new rail, give the reason `Winner requested another rail`, and confirm.
2. Read the order, the new invoice, the replaced invoice and the invoice log.

**Expected Results:**

* The reissue is accepted although the settlement currency and bank transfer method stay the same.
* The order keeps the row's settlement currency and uses the row's new rail.
* The new invoice is pending with the selected rail's bank details; the replaced invoice keeps its original rail.
* The reissued entry records the rail as a changed part.

## Settled

- None this run. The blind reading's question whether this capability takes a delta in this change was answered as Q24; the questions raised below are open.



## Reconciliation

**Run:** Independent QA2, 2026-10-14. Reconciled the QA1 blind cases with the current delta scenarios against the frozen anchors. Read the current PRD, decisions, journeys, delta requirements, technical design and durable baseline. Full case ledger and source paths: `openspec/changes/usd-lot-currency-winner-settlement-choice/qa2-admin.md`.

- **Retained:** All 12 active case IDs, revisions, routes and classifications remain draft.
- **Covered:** `US5-TC20` rev2 asserts `SC-251`'s 103100-minor-unit HKD quote total with no displayed rate and `SC-252`'s USD 1001 line stored as USD and sent as HKD 7900. `US5-TC21` asserts `SC-247`; `US5-TC22` rev2 asserts `SC-245`'s exact HKD 78500 to USD 10000 reissue while preserving the replaced invoice. `US5-TC27` asserts `SC-246` and `SC-248` refusals without changing the invoice/order or logging an edit. `US5-TC28` asserts `SC-249`'s accepted USD SWIFT change. `US5-TC31` asserts `SC-254` and `SC-255` rail-only reissues.
- **Scope:** A bank rail is part of the payment choice under Q31. The operator still enters quote lines in USD and the order/invoice amounts read in the selected settlement currency.
- **Out of suite:** Retain only scenarios whose complete THEN is not asserted by a route in this feature suite; see the enumerated list in the header. No unresolved product question remains.
