# shared/ui/auction-order Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** shared-ui-auction-order-SC-15, shared-ui-auction-order-SC-16, shared-ui-auction-order-SC-17, shared-ui-auction-order-SC-19, shared-ui-auction-order-SC-20

## g10.shared-auction-order.US1: Address form component contract

**Walked by:** nobody on their own - a component contract; the order detail and the address form are walked through `grade10-site/auction/winner-order`, which composes the blocks

**As a** customer,
**I want** the shared blocks to render what the application supplies,
**so that** Winner Order composes one contract instead of drawing its own.

<!-- trace:case id=g10.shared-auction-order.TC-2fz rev=1 covers=g10.shared-auction-order.SC-cdc -->
### g10.shared-auction-order.US1-TC23: The setup form offers USD and HKD with nothing preselected

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form and no settlement currency chosen.

**Steps:**

1. Read the settlement currency choices and which one is selected.

**Expected Results:**

* The form offers USD and HKD, and no other currency.
* Neither choice is selected.

<!-- trace:case id=g10.shared-auction-order.TC-3cr rev=1 covers=g10.shared-auction-order.SC-8j6 -->
### g10.shared-auction-order.US1-TC24: The winner's currency pick is reported

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form, no settlement currency chosen, and a spy on its currency callback.

**Test data:**

| Settlement currency |
| --- |
| USD |
| HKD |

**Steps:**

1. Choose the settlement currency the row names.
2. Read the spy.

**Expected Results:**

* The choice reads selected.
* The currency callback is called once with the row's settlement currency.
* No other callback is called and the block makes no request of its own.

<!-- trace:case id=g10.shared-auction-order.TC-giz rev=1 covers=g10.shared-auction-order.SC-7if -->
### g10.shared-auction-order.US1-TC25: Payment methods follow the currency they are supplied for

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form, a set of payment methods supplied for USD, and a different set supplied for HKD.

**Test data:**

| Settlement currency | Payment methods read |
| --- | --- |
| USD | Exactly the methods supplied for USD |
| HKD | Exactly the methods supplied for HKD |

**Steps:**

1. Choose the settlement currency the row names.
2. Read the payment method choices.

**Expected Results:**

* The payment method choices are exactly the row's methods.
* No method supplied only for the other currency appears.

<!-- trace:case id=g10.shared-auction-order.TC-kiy rev=1 covers=g10.shared-auction-order.SC-7if -->
### g10.shared-auction-order.US1-TC26: Each bank rail is its own payment method choice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form, HKD chosen, and two bank rails `<bank rail A>` and `<bank rail B>` supplied for HKD, with a spy on its payment method callback.

**Test data:**

| Field | Value |
| --- | --- |
| `<bank rail A>` | A bank rail supplied for HKD |
| `<bank rail B>` | A second bank rail supplied for HKD |

**Steps:**

1. Read the payment method choices.
2. Choose `<bank rail B>`.
3. Read the spy.

**Expected Results:**

* Step 1: `<bank rail A>` and `<bank rail B>` read as two separate choices.
* The callback is called once with `<bank rail B>`.

<!-- trace:case id=g10.shared-auction-order.TC-bu1 rev=1 covers=g10.shared-auction-order.SC-z03 -->
### g10.shared-auction-order.US1-TC27: The summary reads a USD total then a converted HKD total

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its summary and both a USD total and a converted HKD total supplied.

**Test data:**

| Field | Value |
| --- | --- |
| `<usd total>` | USD2,400 (range: >0 minor units) |
| `<hkd total>` | The converted HKD total the application supplies for `<usd total>` |

**Steps:**

1. Read the summary's total lines from top to bottom.

**Expected Results:**

* The USD total line reads `<usd total>`.
* The HKD total line follows it and reads `<hkd total>`.

<!-- trace:case id=g10.shared-auction-order.TC-p6m rev=1 covers=g10.shared-auction-order.SC-hc5 -->
### g10.shared-auction-order.US1-TC28: View Bank Details shows only the rail supplied

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with the rail the row names supplied for its bank details.

**Test data:**

| Rail supplied |
| --- |
| `<bank rail A>`, a bank rail with its own details |
| `<bank rail B>`, a second bank rail with its own details |

**Steps:**

1. Choose View Bank Details.
2. Read the dialog.

**Expected Results:**

* One dialog opens.
* It shows the row's rail details only.
* It shows no details of the other rail.
* It shows no rail tabs.

<!-- trace:case id=g10.shared-auction-order.TC-62a rev=1 covers=g10.shared-auction-order.SC-pd1 -->
### g10.shared-auction-order.US1-TC29: No payment method is listed before a currency is chosen
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form, a set of payment methods supplied for USD and for HKD, and no settlement currency chosen.

**Steps:**

1. Read the payment method choices.

**Expected Results:**

* No payment method is listed, and none is selected.
* No method supplied for either currency appears.

<!-- trace:case id=g10.shared-auction-order.TC-pm2 rev=1 covers=g10.shared-auction-order.SC-nxj -->
### g10.shared-auction-order.US1-TC30: A payment method supplied as unavailable shows its text and cannot be chosen
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form and USD chosen.
* The USD card choice is supplied with an unavailable text, with a spy on the payment method callback.

**Steps:**

1. Read the card choice.
2. Try to choose the card choice.
3. Read the spy.

**Expected Results:**

* The card choice shows the unavailable text it was supplied.
* The card choice cannot be chosen.
* The payment method callback is not called.

<!-- trace:case id=g10.shared-auction-order.TC-y6r rev=1 covers=g10.shared-auction-order.SC-bzz -->
### g10.shared-auction-order.US1-TC31: A payment method value the application clears shows no selected choice
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its setup form, USD chosen and a payment method value of one of the USD bank rails.

**Steps:**

1. Read which payment method is selected.
2. Supply HKD as the settlement currency and no payment method value.
3. Read which payment method is selected.

**Expected Results:**

* Step 1: the supplied bank rail reads selected.
* Step 3: HKD methods are listed and none is selected.

<!-- trace:case id=g10.shared-auction-order.TC-mvr rev=1 covers=g10.shared-auction-order.SC-k6i -->
### g10.shared-auction-order.US1-TC32: One total line shows when no converted total is supplied
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its summary, a USD total supplied and no converted total.

**Steps:**

1. Read the summary's total lines from top to bottom.

**Expected Results:**

* One Order Total line shows, and it reads the USD total supplied.
* No second total line shows, and no amount is derived or converted by the block.

<!-- trace:case id=g10.shared-auction-order.TC-9r5 rev=1 covers=g10.shared-auction-order.SC-8eq -->
### g10.shared-auction-order.US1-TC33: The detail omits the invoice link and pay control it was not given
**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Order detail

**Pre-conditions:**

* `AuctionWinnerOrder` is rendered with its order summary lines and no invoice PDF and no pay control supplied.

**Steps:**

1. Read the order summary.
2. Look for an Invoice PDF link and a pay control.

**Expected Results:**

* The order summary shows its lines.
* No Invoice PDF link and no pay control show.


## Settled

- None this run. The blind reading raised nothing that needed an answer here; the one contract question went to `decisions.md` `## Raised` and landed as Q26.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-14 for change `usd-lot-currency-winner-settlement-choice`, joining QA1's blind cases with Dev's delta scenarios on the `Order detail` anchor of `shared-ui-auction-order`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q27 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| The setup form offers USD and HKD and no other currency, with neither selected | **Folded in:** `shared-ui-auction-order-SC-21`, asserted by `g10.shared-auction-order.US1-TC23` |
| A currency pick is reported once, and the block makes no request of its own | **Folded in:** `shared-ui-auction-order-SC-22`, asserted by `g10.shared-auction-order.US1-TC24`. QA1 read the callback and not the no-request clause; QA2 widened the case with one Expected Result |
| The payment choices are the ones supplied for the currency picked, and each bank rail is its own choice | **Folded in, jointly:** `shared-ui-auction-order-SC-23` by `g10.shared-auction-order.US1-TC25` (the partition by currency) and `US1-TC26` (card, FPS and HK Local as separate choices). No one case reads the HKD list whole with no SWIFT; both cases use abstract rails and the partition is read by exact match |
| No currency picked lists no method; an unavailable method cannot be chosen; a cleared value shows nothing selected | **Added:** `g10.shared-auction-order.US1-TC29`, `US1-TC30` and `US1-TC31` assert `shared-ui-auction-order-SC-24`, `shared-ui-auction-order-SC-25` and `shared-ui-auction-order-SC-26`. QA1 read the lists for a chosen currency only |
| The summary reads a USD total line then the converted HKD total line | **Folded in:** `shared-ui-auction-order-SC-27`, asserted by `g10.shared-auction-order.US1-TC27` |
| The summary reads one total line when no converted total is supplied | **Added:** `g10.shared-auction-order.US1-TC32` asserts `shared-ui-auction-order-SC-28`, including that the block derives no amount |
| View Bank Details shows the one rail supplied, with no tabs and no other rail | **Folded in:** `shared-ui-auction-order-SC-29`, asserted by `g10.shared-auction-order.US1-TC28`, which QA2 widened with the no-tabs result. QA1's rows name abstract rails, so the case does not read FPS, HK Local or SWIFT by name; the walk of task 11.2 reads each rail on the page |
| The block takes the bank details by a `bankDetails` prop and the dialog moves from the preview page into the block | **Checked, no contradiction:** the prop, the type `AuctionWinnerOrderBankDetails` and the move are named in `tech-design.md` (Presentation in this store) and in tasks 1.4, and the export list of "The winner-order surface exports" carries the four new types |
| Restated unchanged: the import resolves, the order list blocks are not exported, the form shows supplied errors, the page body derives its steps and reports a press | **Out of suite:** `shared-ui-auction-order-SC-15` and `shared-ui-auction-order-SC-16` - verified by `packages/ui/src/blocks/auction-order/public-exports.test.ts` in this store; `shared-ui-auction-order-SC-17` by the durable `g10.shared-auction-order.TC-g9u` and `TC-l1e`; `shared-ui-auction-order-SC-19` by `g10.shared-auction-order.TC-1f8`; `shared-ui-auction-order-SC-20` by `g10.shared-auction-order.TC-fjf` |
| The detail omits an invoice link and a pay control it was not given | **Added:** `g10.shared-auction-order.US1-TC33` asserts `shared-ui-auction-order-SC-18`; no durable case reads it |

**Uncovered anchors:** none for `Order detail`.

**Over-claimed cases:** none. `g10.shared-auction-order.US1-TC28` reads the supplied rail by a placeholder; the named rails are read in `grade10-site/auction/winner-order`.

**Contradictions:** none.
