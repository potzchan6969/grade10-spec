# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-08, tcs-rules r4

**Out of suite:** none of this change's scenarios; the scenarios it restates unchanged keep their durable cases.

## order-mail-US1: Post-close letters

**As a** customer(winner),
**I want** the letters Grade10 sends about my auction order,
**so that** I know what to do next without guessing.

<!-- trace:case id=g10.auction-notifications-order.TC-i2x rev=1 covers=g10.auction-notifications-order.SC-bgc -->
### order-mail-US1-TC55-1: A shipped letter with no tracker link leads with the order

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

* customer(winner of <lot_1>) has a registered email.
* <lot_1>'s order reads Preparing Shipment.

**Steps:**

1. Dispatch <lot_1>'s order with a carrier and a tracking number, and no tracker link.
2. Open the winner's inbox and read the shipped letter.

**Expected Results:**

* The primary action is View order, and it opens <lot_1>'s Winner Order.
* The tracking number reads as plain text, not a link.
* The letter offers no track-and-trace action.

## Settled

## Reconciliation

**Run:** 2026-10-08, amendment for the shipped letter, not blind: the shipped row and paragraph of "Post-close letters", the durable suite and the case above. With no tracker link the shipped letter leads with View order and reads the tracking number as plain text, as Winner Order does (`decisions.md` Q48).

| Spec scenario | Disposition |
| --- | --- |
| `order-mail-SC-62` | Was uncovered; added `order-mail-US1-TC55-1` |
| `order-mail-SC-11` | Keeps its meaning and its durable coverage: it records a tracker link |

- **Carried unchanged** - every other scenario of "Post-close letters" keeps its meaning and its durable coverage
