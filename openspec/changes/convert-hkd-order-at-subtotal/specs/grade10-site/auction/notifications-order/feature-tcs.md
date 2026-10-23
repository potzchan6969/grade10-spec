# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.auction-notifications-order.US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

<!-- trace:case id=g10.auction-notifications-order.TC-5o0 rev=4 covers=g10.auction-notifications-order.SC-tfm,g10.auction-notifications-order.SC-3mo -->
### g10.auction-notifications-order.US1-TC2: Payment reminder uses the chosen settlement currency

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications-order.spec.ts`

**Pre-conditions:**

* A winner has chosen `<settlement_currency>` for an order won at `<winning_bid>`, and an operator is ready to send its invoice.

**Test data:**

| `<settlement_currency>` | `<winning_bid>` | `<payment_reminder_total>` | Fixture notes |
| --- | --- | --- | --- |
| USD | USD2,600 | USD3,120 | USD winning bid is representative; any positive USD winning bid with this invoice fixture remains in the same partition; `<payment_reminder_total>`: 312000 minor units in USD |
| HKD | USD101 | HKD1,030.00 | Fixed source fixture; `<winning_bid>`: 10100 minor units in USD; `<payment_reminder_total>`: 103000 minor units in HKD |

**Steps:**

1. Send the invoice and read the payment-reminder letter.

**Expected Results:**

* The reminder amount is `<payment_reminder_total>` and uses `<settlement_currency>`.
* The letter does not repeat the USD winning bid.
* Under HKD settlement, the letter names no conversion rate.

<!-- trace:case id=g10.auction-notifications-order.TC-ew9 rev=2 -->
### g10.auction-notifications-order.US1-TC56: Later payment reminder uses the settlement currency

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications-order.spec.ts`

**Pre-conditions:**

* A sent invoice remains unpaid; its order uses `<settlement_currency>` and has invoice total `<reminder_amount>`.

**Test data:**

| `<settlement_currency>` | `<reminder_amount>` | Fixture notes |
| --- | --- | --- |
| USD | USD3,120 | Representative USD amount; any positive USD amount remains in the same partition; `<reminder_amount>`: 312000 minor units in USD |
| HKD | HKD1,030.00 | Fixed source fixture; `<reminder_amount>`: 103000 minor units in HKD |

**Steps:**

1. Read a later payment reminder.

**Expected Results:**

* Any amount in the reminder uses `<settlement_currency>`.
* The reminder includes no USD winning bid under HKD settlement.

<!-- trace:case id=g10.auction-notifications-order.TC-vxo rev=3 covers=g10.auction-notifications-order.SC-16k,g10.auction-notifications-order.SC-3g9 -->
### g10.auction-notifications-order.US1-TC57: Payment received letter lists the order's lines and totals in the settlement currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** manual
* **Trace:** Post-close letters

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications-order.spec.ts`

**Pre-conditions:**

* customer(winner settled in `<settlement_currency>`, account language `<letter_language>`) has just paid `<order_n>` in full by `<method>`.
* The winner can open the Payment received letter in `<winner_mailbox>`.

**Test data:**

| Field | Value |
| --- | --- |
| order_n | The order of the row, paid with the method and rule of the row; bind its identity only |
| winner_mailbox | The inbox of the winner's registered email address |

| Row | `<settlement_currency>` | `<letter_language>` | `<method>` | `<usd_lines>` | `<subtotal>` | `<fee>` | `<order_total>` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| USD order | USD | English | Bank transfer, confirmed by an operator, bank transfer fee USD5.00 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | USD131.21 | USD5.00 | USD136.21 |
| HKD order | HKD | English | Card, HKD rule 3.4% plus HKD2.35 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | HKD1,030.00 | HKD38.69 | HKD1,068.69 |
| HKD order in Chinese | HKD | Traditional Chinese | Card, HKD rule 3.4% plus HKD2.35 | Winning Bid USD101.00, Buyer's Premium USD20.20, Shipping & Handling USD10.01 | HKD1,030.00 | HKD38.69 | HKD1,068.69 |

**Steps:**

1. Open the Payment received letter in `<winner_mailbox>`.
2. Read the letter's lines, Subtotal, Payment Processing Fee and Order Total.
3. Open the attached receipt PDF.

**Expected Results:**

* The letter lists `<usd_lines>` in USD, in `<letter_language>`.
* It then shows Subtotal `<subtotal>`, Payment Processing Fee `<fee>` and Order Total `<order_total>`, in HKD with two decimals for an HKD order and in USD for a USD order, which shows no HKD amount.
* The letter names `<order_total>` as the amount paid.
* The letter names no rate and shows no conversion note.
* Amounts use English grouping and punctuation whatever the language.
* The receipt PDF is the only attachment and prints the same lines and Order Total.

<!-- trace:case id=g10.auction-notifications-order.TC-xsq rev=3 covers=g10.auction-notifications-order.SC-7qg -->
### g10.auction-notifications-order.US1-TC59: The payment overdue letter names the outstanding amount in the settlement currency

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Post-close letters

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/notifications-order.spec.ts`

**Pre-conditions:**

* customer(winner, holds `<winner_order_12>`) has a registered email and a pending unpaid invoice in HKD, for a USD listing won at `<winning bid>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| winner_order_12 | An auction order with a pending HKD invoice and a known payment deadline | · |
| winning bid | USD2,400 | (range: >0 minor units) |
| invoice total | HKD1,030.00 | (103000 minor units) |

**Steps:**

1. Let the invoice's payment deadline pass so Grade10 sets it to `expired`.
2. Open the winner's inbox and read the letter.

**Expected Results:**

* One payment overdue letter exists for `<winner_order_12>`.
* It names `<invoice total>` as the outstanding amount in HKD.
* It names no USD amount and no conversion rate.

---

## Settled

- The auction-won letter names the winning bid in US$ and no other amount; it is the one letter that keeps a USD amount before the winner picks (decisions Q25).
- The Partial payment received letter lists no lines; it keeps the invoice ID, Receipt ID and receipt PDF (decisions Q24).
- A letter that names only a total names the HKD Order Total and prints no USD winning bid or rate; the payment received letter lists the order's lines, in USD for a USD order and, for an HKD order, the USD lines, then the HKD Subtotal, fee and Order Total (decisions Q9).

## Reconciliation

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, 2026-10-22. The first blind pass read a bundle whose existing suites were empty and whose PRD pages lacked the product manager's edits, both packaging defects of the coordinator. It was resumed against a corrected bundle, with the real suites and the current PRD, and revised. It read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It extended its cases for the operator's order page and the house order and left this capability's case as it was. Its files started from the blind state, without the dispositions below. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read the repaired deltas of the five capabilities, `tasks.md`, `tech-design.md`, `proposal.md`, the journeys and `decisions.md` through Q31, the PRD sections they cite, and both QA1 passes. It recomputed every minor-unit figure and wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition. It is a statement, not proof.

**Blind case**

| Case | Disposition |
| --- | --- |
| `US1-TC61` (`TC-cm0`) | Regrouped into `US1-TC57` (`TC-vxo`): the Payment received letter and its receipt PDF are one surface, one starting state and one route. Its English and Traditional Chinese rows, the English grouping result and the attachment result are now rows and results of `TC57`. Dropped; it was never published |

**Existing durable cases**

| Durable case | Verdict | Action |
| --- | --- | --- |
| `US1-TC1` (`TC-8bw`) | Not moved: the won-lot letter keeps the US$ winning bid (decisions Q25) | Left `draft` |
| `US1-TC2` (`TC-5o0@3`) | Contradicted in its HKD row: 103,100 | Rewritten at `@4`; the HKD row reads 103,000 and keeps its links |
| `US1-TC56` (`TC-ew9@1`) | Contradicted in its HKD row: 103,100 | Rewritten at `@2` |
| `US1-TC57` (`TC-vxo@2`) | Contradicted: "neither prints the USD winning bid" fails for a letter that lists the USD lines | Rewritten at `@3` with `TC61` folded in; its USD row now follows SC2 (a bank transfer, a Subtotal, a fee of US$5.00, a total of US$136.21); links SC-66 and SC2 |
| `US1-TC58` (`TC-l6s`) | Not moved: the reissue letter in USD and the earlier HKD letter | Left `draft` |
| `US1-TC59` (`TC-xsq@2`) | Contradicted: outstanding amount 103,100 | Rewritten at `@3` |

`TC-5o0` is also the marker id of `US1-TC3` in the durable suite, a collision that predates this change. A change copy may not re-key a marker, since a marker id never changes, so the owner of the durable suite re-keys `US1-TC3`; `accept:preflight` folds without it.

Walk text that repeats these results stays stale until `/tcs-review` refreshes the walks: Walk 1 steps 3 to 4 (durable lines 79 to 81) and Walk 3 steps 3, 4, 7 and 8 (durable lines 272 to 287 and their data blocks).

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| `order-mail-SC-63` | `US1-TC1`, unchanged |
| `order-mail-SC-64`, `order-mail-SC-65` | `US1-TC2`, one row each |
| `order-mail-SC-66` | `US1-TC57`, HKD row; its fixture is the scenario's |
| `g10.auction-notifications-order.SC2` | `US1-TC57`, USD row |
| `order-mail-SC-67` | `US1-TC59` |
| `order-mail-SC-68` | `US1-TC58`, unchanged |

**Out of suite:** g10.auction-notifications-order.SC1

SC1 is a free charge in the Payment received letter: Shipping & Handling Free, no Insurance or Tax line and a Free fee. The letter preview test of task 4.2 in this store (`apps/emails/emails/auction/order/payment-received.test.mjs`) and the letter test of task 7.1 in the application repository (`emailPort.test.ts`) verify it.

**Uncovered**

- None

**Over-claimed**

- `US1-TC57` step 3 and its last result open the receipt PDF attached to the letter. The attachment is a gap that predates this change; task 7.3 leaves it to a bug fix, and the spec states only that an attached receipt reads the same currency. The step cannot pass until the fix lands

**Contradictions between the readings**

- None

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| Root group Post-close letters | `US1-TC2`, `TC56`, `TC57`, `TC59`, and the unchanged `TC1`, `TC58` | SC-63 to SC-68 and SC2 covered; SC1 out of suite |

**Raised**

Q24 and Q25 close the two notifications-order rows; the answers sit in `## Settled`.
