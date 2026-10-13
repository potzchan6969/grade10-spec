# Decisions

## Goals

- **Pay for goods the collector has** - the earn lands when the order is
  Completed: every item fulfilled and paid in full.
- **Fewer claw-backs** - an earn that never lands never needs reversing, so
  canceled and fully refunded orders stop costing a grant and a claw-back.

## Non-Goals

- **Spend timing** - points spent and coupons used are still debited when
  the paid order lands; `paying-with-points` and `coupons` are untouched.
- **A pending-points display** - no surface shows points pending on an
  uncompleted order in this change.
- **Carrier delivery tracking** - the store holds no delivery confirmation;
  the Completed badge is the trigger, not delivery.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What triggers the earn? | The Completed order-status badge — every item fulfilled and paid in full. The owner described it as "shipped, user receives the item"; the store has no carrier delivery confirmation, so the round chose the badge as the trigger, not delivery. Decided by the owner 2026-10-13; supersedes earn-when-paid | Earning at payment (the running rule), or carrier delivery confirmation, which the store does not hold |
| Q2 | What about an order that never completes? | An order canceled or refunded in full before it completes never earns - decided by the round | Granting at payment and clawing back |
| Q3 | What does a refund before completion do? | It lowers the basis: the earn is priced on the net paid at completion - decided by the round | Earning on the gross and clawing the refund back |
| Q4 | Which tier rate applies? | The member's tier at completion - decided by the round | The tier at payment |
| Q5 | Which day does the inactivity clock count? | The earn's completion date - decided by the round | The payment date |
| Q6 | Does a till guest sale linked later earn at the member's tier on the day it is linked? | No - the till rule stands: a till sale completes at the counter and, once linked, earns as it was priced when the money landed, with refunds since replayed. "Already Completed when linked earns nothing" is the site's guest checkout rule alone. Decided by the owner 2026-10-13 | Pricing a linked till sale at the member's tier on the day it is linked |
| Q7 | Where do pending points show? | Order Details' existing points section: it reads Points to Earn before completion and Points Earned after, and the section is absent when the order won't earn — canceled or refunded in full, a guest order linked after it completed, or a guest order with no owner. There is no Your Profile page today, so no pending line there. Decided by the owner 2026-10-13 | A pending entry in the member's histories |
| Q8 | What do orders in flight at launch earn? | Orders paid but not yet completed when this ships earn when they complete, guarded so no order earns twice — one that already earned at payment under the old rule earns nothing again. Confirmed by the owner 2026-10-13 | A backfill, or leaving them to the old timing |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/loyalty/programme` | Does Your Profile or Histories show points pending on an order not yet completed? | Landed as Q7: Order Details' Points to Earn section; no pending line elsewhere. Owner 2026-10-13 |
| `grade10-site/loyalty/programme` | Orders paid but not yet completed when this ships - do they earn? | Landed as Q8: they earn on completion, guarded never to earn twice. Owner 2026-10-13 |
