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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/quote.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-20

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/quote.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

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
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** post-sale-US-07

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/post-sale/usd-quote.spec.ts`

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

**R5 case dispositions**

| Draft case | Disposition and exact matching scenarios |
| --- | --- |
| `g10adm.auction-post-sale.TC-u4w` - tax typed in USD | Retain, rev 3. Exact route and expected tax conversion align with `post-sale-SC-155`. |
| `g10adm.auction-post-sale.TC-70n` - quote amounts typed in USD | Retain. The USD row and major-unit entry outcome align with `SC-165`. It does not assert the scenario's exact order total in `SC-243`. |
| `g10adm.auction-post-sale.TC-w5z` - edit settlement currency before send | Retain, rev 2. Matches `SC-247`: HKD to USD, same HK Local method, Preparing Invoice remains, log names the change. |
| `g10adm.auction-post-sale.TC-r3c` - reissue in another currency | Retain, rev 2. Matches `SC-245`: USD replacement, old HKD invoice retained, currency change named. |
| `g10adm.auction-post-sale.TC-d4e` - quote names method and rail | Retain, rev 2. Its rows fully assert `SC-117` (FPS named, USD bank fee requested) and `SC-244` (SWIFT named, no other rail, USD fee). |
| `g10adm.auction-post-sale.TC-9yj` - round converted line up to a whole HKD | Retain, rev 2. Exact input and line result match `SC-252` (USD10.01 stored, HKD79.00 sent, USD fact retained). |
| `g10adm.auction-post-sale.TC-jru` - settlement-currency invoice total and locked order | Retain. The first row matches `SC-48`'s HKD1,053 total, send time, seven-day deadline and locked data. The no-insurance row matches `SC-63`. The internal row matches `SC-253` exactly: USD101 bid, USD20.20 premium, USD10.01 shipping, USD0 transfer fee, HKD1,031 total, FPS at close and no earlier invoice/setup step. |
| `g10adm.auction-post-sale.TC-qz7` - large bank transfer fee | Retain. Its USD500 -> HKD3,925 conversion and HKD4,978 total match `SC-119`. |
| `g10adm.auction-post-sale.TC-9i1` - refuse a currency edit that leaves an unoffered rail | Retain, rev 2. Exact USD/SWIFT to HKD with no other method, atomic refusal and no log entry match `SC-248`. |
| `g10adm.auction-post-sale.TC-5vj` - refuse an unoffered rail on reissue | Retain, rev 2. Exact HKD/FPS to USD while keeping FPS, unchanged invoice and no log entry match `SC-246`. |
| `g10adm.auction-post-sale.TC-pjh` - method and rail edit before send | Retain, rev 2. Its accepted address/method edit matches `SC-135`; USD card to FPS refusal matches `SC-138`; USD card to SWIFT acceptance matches `SC-249`. |
| `g10adm.auction-post-sale.TC-ddn` - telephone setup with currency and choice | Retain, rev 2, traced to restored `post-sale-US-20`. Its successful row matches `SC-84`; its missing-currency row matches `SC-250`. The missing choice and billing address rows make valid negative partitions without generating new cases from scenarios. |
| `g10adm.auction-post-sale.TC-rail` - rail-only reissue | Retain, rev 2. The HKD FPS-to-HK Local row matches `SC-254`; USD HK Local-to-SWIFT matches `SC-255`, including new and replaced rail snapshots. |

The case markers now carry the exact post-hoc `covers=` links above. I did not assign `SC-251` to the internal-bid row: its rail and order origin differ, and the totals are not the same scenario. I did not claim that a domain case with different input values verifies `SC-253`.

**Out-of-suite and durable verifiers**

These scenarios have no full match in the 13 R5 cases. The named durable cases assert the same complete route and result; the remaining exact behavior has an explicit test-first task. Planned tasks are not test results.

| Scenario | Exact verifier | Reason |
| --- | --- | --- |
| `grade10-admin-auction-post-sale-SC-37` | `g10adm.auction-post-sale.TC-rp1` (`post-sale-US2-TC8-1`) | Single Payment Overdue detail explains the status and offers Reissue. |
| `grade10-admin-auction-post-sale-SC-38` | `g10adm.auction-post-sale.TC-fph` (`post-sale-US8-TC4-1`) | Buyer reissue history spans three orders, and the current order count is shown. |
| `grade10-admin-auction-post-sale-SC-162` | `g10adm.auction-post-sale.TC-pce` (`post-sale-US2-TC5-1`) | Order detail opens from its own location and reload/shared navigation resolves to the same order. |
| `grade10-admin-auction-post-sale-SC-163` | `g10adm.auction-post-sale.TC-xbe` (`post-sale-US2-TC6-1`) | Comment, sent/paid entries and actor/time are on one ordered timeline; empty comment is refused. |
| `grade10-admin-auction-post-sale-SC-164` | `g10adm.auction-post-sale.TC-jip` (`post-sale-US2-TC7-1`) | Failed send keeps the dialog and typed value; corrected retry sends. |
| `grade10-admin-auction-post-sale-SC-49` | `g10adm.auction-post-sale.TC-84x` (`post-sale-US18-TC12-1`) | Missing confirmed address blocks sending. |
| `grade10-admin-auction-post-sale-SC-50` | `tasks.md` 9.9 | No exact durable send-permission case; task names visible-disabled control and server refusal. |
| `grade10-admin-auction-post-sale-SC-69` | `g10adm.auction-post-sale.TC-j3w` (`post-sale-US5-TC18-1`) | Card fee is read from the currency's card rule before send. |
| `grade10-admin-auction-post-sale-SC-70` | `g10adm.auction-post-sale.TC-j3x` (`post-sale-US5-TC19-1`) | HKD card send without the HKD card rule is refused. |
| `grade10-admin-auction-post-sale-SC-68` | `tasks.md` 9.11 | No durable Insurance=0 case; the durable Tax=0 case verifies another field. |
| `grade10-admin-auction-post-sale-SC-118` | `g10adm.auction-post-sale.TC-jn5` (`post-sale-US7-TC25-2`) | The negative bank-transfer fee row refuses send with no invoice; blank, zero and over-subtotal are also distinguished. |
| `post-sale-SC-156` | `g10adm.auction-post-sale.TC-dre` (`post-sale-US5-TC10-1`) | Tax left empty sends an invoice without Tax. |
| `post-sale-SC-157` | `g10adm.auction-post-sale.TC-tuk` (`post-sale-US5-TC11-1`) | Tax entered as zero is refused. |
| `grade10-admin-auction-post-sale-SC-243` | `tasks.md` 9.10 | No R5 case asserts the exact USD order total 312000 with those three lines and USD0 fee. The generic USD row does not establish this total. |
| `grade10-admin-auction-post-sale-SC-107` | `tasks.md` 9.10 | The task now requires the USD bank-transfer reissue to show 312000 before and 316000 after address, Shipping & Handling and Insurance changes, send the replacement for 316000, and retain the 2026-09-19 deadline. This is planned regression work, not proof. |
| `grade10-admin-auction-post-sale-SC-251` | `tasks.md` 9.10 | No R5 case asserts exact HKD103100 for the ordinary HKD/HK Local order with USD101 bid, USD20.20 premium, USD10.01 shipping and zero fee. The numerically similar internal row is a different starting route. |
| `grade10-admin-auction-post-sale-SC-167` | `g10adm.auction-post-sale.TC-ir2` (`post-sale-US5-TC14-1`) | USD card send without a USD rule is refused. |
| `grade10-admin-auction-post-sale-SC-168`, `SC-169` | `g10adm.auction-post-sale.TC-rh9` (`post-sale-US5-TC13-1`) | Fee is computed from the HKD rule and tracks subtotal changes until send. |
| `grade10-admin-auction-post-sale-SC-170` | `g10adm.auction-post-sale.TC-42i` (`post-sale-US5-TC15-1`) | Stale total blocks send and shows read versus current total. |
| `grade10-admin-auction-post-sale-SC-171`, `SC-172` | `g10adm.auction-post-sale.TC-w3j` (`post-sale-US7-TC32-1`) | Method switch empties the bank fee; when bank transfer stays selected, typed fee remains editable and the prior fee is not carried to card. |
| `grade10-admin-auction-post-sale-SC-193`, `SC-194` | `g10adm.auction-post-sale.TC-dxc` (`post-sale-US5-TC16-1`) | Sent card fee stays fixed after rule changes; send dialog shows the deadline it will set. |
| `post-sale-SC-210` | `g10adm.auction-post-sale.TC-yjb` (`post-sale-US7-TC46-1`) | Reissue removes Tax and changes the subtotal. |
| `grade10-admin-auction-post-sale-SC-245` | `g10adm.auction-post-sale.TC-r3c` | The R5 case covers the changed currency and replaced invoice. |
| `grade10-admin-auction-post-sale-SC-246` | `g10adm.auction-post-sale.TC-5vj` | The R5 case refuses an unoffered held rail on reissue. |
| `grade10-admin-auction-post-sale-SC-247` | `g10adm.auction-post-sale.TC-w5z` | The R5 case edits settlement currency before send and records the old/new values. |
| `grade10-admin-auction-post-sale-SC-248` | `g10adm.auction-post-sale.TC-9i1` | The R5 case refuses a currency change with an unoffered existing rail. |
| `grade10-admin-auction-post-sale-SC-249` | `g10adm.auction-post-sale.TC-pjh` | The R5 case accepts USD card to SWIFT and records the edit. |
| `grade10-admin-auction-post-sale-SC-75` | `g10adm.auction-post-sale.TC-unr` (`post-sale-US18-TC1-1`) | Reopen from Setup Overdue gives 48 hours from the reopen time. |
| `grade10-admin-auction-post-sale-SC-76` | `g10adm.auction-post-sale.TC-6p3` (`post-sale-US18-TC2-1`) | Empty reason blocks reopen and leaves deadline passed. |
| `grade10-admin-auction-post-sale-SC-77` | `g10adm.auction-post-sale.TC-l8m` (`post-sale-US18-TC3-1`) | Missing payment-processing blocks reopen. |
| `grade10-admin-auction-post-sale-SC-78` | `tasks.md` 9.11 | Durable `TC-htq` tests a second reopen; no full case tests the third reopen. |
| `grade10-admin-auction-post-sale-SC-79` | `g10adm.auction-post-sale.TC-5rs` (`post-sale-US18-TC7-1`) | Reopen audit entry records reason and new deadline. |
| `grade10-admin-auction-post-sale-SC-80` | `tasks.md` 9.11 | No full durable case attempts reopen before the deadline and confirms the original deadline remains. |
| `grade10-admin-auction-post-sale-SC-81` | `g10adm.auction-post-sale.TC-t9r` (`post-sale-US18-TC6-1`) | Sent invoice prevents reopen. |
| `grade10-admin-auction-post-sale-SC-82` | `g10adm.auction-post-sale.TC-itu` (`post-sale-US18-TC27-1`) | Confirmed address prevents reopen. |
| `grade10-admin-auction-post-sale-SC-83` | `g10adm.auction-post-sale.TC-6yz` (`post-sale-US2-TC9-1`) | Cancelled order refuses reopen and lot remains available. |
| `grade10-admin-auction-post-sale-SC-84` | `g10adm.auction-post-sale.TC-ddn` | R5 telephone setup case accepts full addresses/currency/payment choice after deadline. |
| `grade10-admin-auction-post-sale-SC-90` | `g10adm.auction-post-sale.TC-kp5` (`post-sale-US18-TC25-1`) | Concurrent address write, reopen, phone record and send serialize. |
| `grade10-admin-auction-post-sale-SC-91` | `g10adm.auction-post-sale.TC-20s` (`post-sale-US18-TC26-1`) | Phone-recorded address audit entry names actor and reason. |
| `grade10-admin-auction-post-sale-SC-211` to `SC-214` | `g10adm.auction-post-sale.TC-62p` (`post-sale-US2-TC10-1`) | The four refusal partitions match missing reason, already confirmed, invoice sent and cancelled. |
| `grade10-admin-auction-post-sale-SC-215`, `SC-216` | `g10adm.auction-post-sale.TC-0jl` (`post-sale-US2-TC11-1`) | Unoffered setup methods refuse; reopen remains allowed with no offered method. |
| `grade10-admin-auction-post-sale-SC-250` | `g10adm.auction-post-sale.TC-ddn` | R5 telephone setup case refuses a missing settlement currency. |

`SC-78` does not inherit the durable second-reopen case's result. `SC-68` does not inherit the Tax-zero case. `SC-251` does not inherit the internal route's similar-number row. `SC-107` is covered by planned task 9.10 only; it has no implemented test proof yet. These distinctions prevent false coverage claims.

**Scope** - The R5 review covers 13 draft cases. The exact durable cases above match the full route and result; broad legacy `covers=` lists do not establish coverage. Planned tasks 9.9, 9.10 and 9.11 remain planned work, not test results. No implementation execution or human approval is claimed.
