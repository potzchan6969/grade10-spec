# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-14, tcs-rules r5

## post-sale-US5: Operator quotes and sends a winner's invoice

**As an** operator,
**I want** to price Shipping & Handling, and Insurance and Tax when the lot needs them, for the address the winner confirmed, then send the invoice,
**so that** the winner pays an amount fixed for where the card is actually going.

<!-- trace:case id=g10adm.auction-post-sale.TC-u4w rev=3 covers=g10adm.auction-post-sale.SC-qv1-->
### post-sale-US5-TC9-3: Operator sends an invoice with tax typed in USD

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
| `<tax>` | USD60 (range: 1–9999 minor units), typed in USD |
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
<!-- trace:case id=g10adm.auction-post-sale.TC-70n rev=2 covers=g10adm.auction-post-sale.SC-lc8 -->
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
| `<shipping and handling>` | USD80 (range: 1–9999 minor units), typed in USD |
| `<insurance>` | USD40 (range: 1–9999 minor units), typed in USD |
| `<bank transfer fee>` | USD15 (range: 1–9999 minor units), typed in USD |

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
<!-- trace:case id=g10adm.auction-post-sale.TC-w5z rev=2 covers=g10adm.auction-post-sale.SC-pp0-->
### post-sale-US5-TC21-2: The settlement currency is changed before send

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
| `<shipping and handling>` | USD80 (range: 1–9999 minor units), typed in USD |
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
<!-- trace:case id=g10adm.auction-post-sale.TC-r3c rev=2 covers=g10adm.auction-post-sale.SC-2g5-->
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
* **Trace:** post-sale-US-07

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
<!-- trace:case id=g10adm.auction-post-sale.TC-d4e rev=2 covers=g10adm.auction-post-sale.SC-75y,g10adm.auction-post-sale.SC-b44-->
### post-sale-US5-TC23-2: The quote names the payment method and rail the winner chose

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
<!-- trace:case id=g10adm.auction-post-sale.TC-9yj rev=2 covers=g10adm.auction-post-sale.SC-c0y-->
### post-sale-US5-TC24-2: A typed amount that does not convert to a whole HK$ is rounded up
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
<!-- trace:case id=g10adm.auction-post-sale.TC-jru rev=2 covers=g10adm.auction-post-sale.SC-7jg,g10adm.auction-post-sale.SC-guq,g10adm.auction-post-sale.SC-0op-->
### post-sale-US5-TC25-2: Sending prices the invoice in the settlement currency and locks the order
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
| `<winning bid>` | USD100 (fixed derived value), 10000 minor units |
| `<premium>` | USD20 (fixed derived value), 2000 minor units |

| Shipping & Handling | Insurance | Order total |
| --- | --- | --- |
| USD10 | USD4 | HKD1,053 (fixed derived value) |
| USD0 | none added | HKD942 (fixed derived value) |
| Internal order: USD101 winning bid; USD20.20 premium; USD10.01 shipping; no insurance; USD0 bank transfer fee | none added | HKD1,031 (fixed derived value) |

**Steps:**

1. Open Send invoice and enter the row's lines, with a bank transfer fee of USD0.
2. Send the invoice at 2026-09-12T09:00:00Z.
3. Read the order and the invoice.

**Expected Results:**

* The invoice is `pending` with the row's order total in HKD.
* For the internal row, the quote starts from an order automatically assigned HKD and FPS at close; no invoice exists until the operator quotes and sends it.
* The internal row converts and rounds each component: USD101 to HKD793, USD20.20 to HKD159, and USD10.01 to HKD79, for a total of HKD1,031.
* The payment deadline reads 2026-09-19T09:00:00Z.
* The delivery address, the settlement currency and the payment method are locked.
* The order reads Pending Payment.
<!-- trace:case id=g10adm.auction-post-sale.TC-qz7 rev=2 covers=g10adm.auction-post-sale.SC-miq-->
### post-sale-US5-TC26-2: A large bank transfer fee is accepted and converts with the other lines
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
<!-- trace:case id=g10adm.auction-post-sale.TC-9i1 rev=2 covers=g10adm.auction-post-sale.SC-xsv-->
### post-sale-US5-TC27-2: A currency change that leaves the held rail unoffered is refused
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
* **Trace:** post-sale-US-05

**Pre-conditions:**

* admin(operator with payment-processing) is on the order the row names.

**Test data:**

| Route | The order before | The change |
| --- | --- | --- |
| Edit before send | USD, Preparing Invoice, bank transfer on International via SWIFT | Settlement currency to HKD, with no other method named |

**Steps:**

1. Make the row's change with a reason.
2. Read the order and its invoice log.

**Expected Results:**

* Grade10 refuses the change.
* The order, or the current invoice, still holds the currency and rail it held before.
* The invoice log gains no entry.
<!-- trace:case id=g10adm.auction-post-sale.TC-pjh rev=2 covers=g10adm.auction-post-sale.SC-ys6,g10adm.auction-post-sale.SC-j60,g10adm.auction-post-sale.SC-0ew-->
### post-sale-US5-TC28-2: An operator edits the method and rail before send, and a rail the currency does not offer is refused
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
<!-- trace:case id=g10adm.auction-post-sale.TC-ddn rev=2 covers=g10adm.auction-post-sale.SC-2g4,g10adm.auction-post-sale.SC-ppk-->
### post-sale-US5-TC30-2: Recording setup by telephone carries a settlement currency
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
* **Trace:** post-sale-US-20

**Pre-conditions:**

* admin(operator with payment-processing) is on an order in Setup Overdue whose address deadline has passed, with invoice status `not_issued` and no confirmed address.

**Test data:**

| Setup recorded | Outcome |
| --- | --- |
| Delivery address, billing address, settlement currency HKD, and bank transfer on HK Local | Accepted |
| Delivery address, billing address and bank transfer on HK Local, no settlement currency | Refused |
| Delivery address, billing address and HKD settlement, no payment choice | Refused |
| Delivery address, HKD settlement and bank transfer on HK Local, no billing address | Refused |

**Steps:**

1. Record the row's setup with the reason `Winner gave it by telephone`.
2. Read the order.

**Expected Results:**

* The outcome the row names holds.
* An accepted record derives Preparing Invoice, and the winner cannot change the address because the address deadline has passed.
* A refused record leaves the order in Setup Overdue with the prior setup unchanged.
<!-- trace:case id=g10adm.auction-post-sale.TC-rail rev=2 covers=g10adm.auction-post-sale.SC-r31,g10adm.auction-post-sale.SC-r32-->
### post-sale-US5-TC31-2: A rail-only change is accepted on reissue

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
* **Trace:** post-sale-US-07

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

## post-sale-US7: Operator resolves an unpaid order

**As an** operator,
**I want** to see how long an unpaid order has waited, and settle, reissue, or cancel it from the order itself,
**so that** a lot whose winner has not paid stops being an open-ended obligation.

<!-- trace:case id=g10adm.auction-post-sale.TC-5vj rev=2 covers=g10adm.auction-post-sale.SC-4va -->
### post-sale-US7-TC49-2: An unoffered rail blocks a currency change on reissue

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
* **Trace:** post-sale-US-07

**Pre-conditions:**

* admin(operator with payment-processing) has a pending HKD invoice for bank transfer on FPS.

**Steps:**

1. Reissue the invoice in USD and keep FPS, with a reason.
2. Read the order and invoice log.

**Expected Results:**

* Grade10 refuses the change because USD does not offer FPS.
* The order and current invoice keep HKD and FPS.
* The invoice log gains no entry.


## Settled

- None this run. The blind reading's question whether this capability takes a delta in this change was answered as Q24; the questions raised below are open.

## Reconciliation

**Out of suite:** `grade10-admin-auction-post-sale-SC-243`, `grade10-admin-auction-post-sale-SC-251`, `grade10-admin-auction-post-sale-SC-107` - planned exact-amount quote and reissue regression in `tasks.md` 9.10; `grade10-admin-auction-post-sale-SC-50` - send authorization regression in `tasks.md` 9.9; `grade10-admin-auction-post-sale-SC-68`, `grade10-admin-auction-post-sale-SC-78`, `grade10-admin-auction-post-sale-SC-80` - focused regression tests in `tasks.md` 9.11.

- **Covered** - The case markers name the scenarios whose route, starting state and complete observable result match: quote and send (`SC-48`, `SC-63`, `SC-117`, `SC-119`, `SC-155`, `SC-165`, `SC-252`, `SC-253`, `SC-244`); currency and payment choice edits (`SC-135`, `SC-138`, `SC-247`, `SC-248`, `SC-249`); reissue currency and rail (`SC-245`, `SC-246`, `SC-254`, `SC-255`); and telephone setup (`SC-84`, `SC-250`).
- **Covered by durable cases** - Unchanged behavior stays in the durable post-sale suite. Exact IDs and match reasons are recorded in `/private/tmp/qa2-1155-post-sale-r5-report.md`; broad legacy `covers=` lists were not treated as proof.
- **Planned, not proven** - The seven Out of suite scenarios above have exact test-first tasks. Their behavior still needs implementation and execution; the tasks do not establish a test result.
- **Case-count repair** - The blind suite contains 13 case markers. The status now reads `pending-review · 0/13`.
