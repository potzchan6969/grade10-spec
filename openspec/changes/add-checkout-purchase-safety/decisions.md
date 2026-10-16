# Decisions

## Goals

- **Published contract** - Deliver the durable requirement "A checkout intent is safe to repeat" in the store backend.
- **One payable invoice** - Keep one order and one payable invoice per purchase across repeated Pay, reload, lost answers, concurrent tabs and worker stops.

## Non-Goals

- **Frontend** - The drawer and order surfaces belong to `add-shopify-checkout-integration`; this change adds frontend work only where its backend contract requires it.
- **Operations** - No deployment, migration execution or provider change during planning.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where does this work come from? | The backend guarantees moved out of `add-shopify-checkout-integration` on 2026-10-09 by @kinisworking ([Q24](../add-shopify-checkout-integration/decisions.md)) | Keeping them as unfinished groups in the frontend change |
| Q2 | Which backend design delivers reuse, terminal replay, concurrency and dispatch recovery, and who owns it? | Decided by agent 2026-10-16: the order id is derived from the member's cart, its version and the tender, so the primary key admits one order per purchase; no request field and no browser identity ([tech design](tech-design.md)) | A client purchase key, or an intent column with its own unique index |
| Q3 | Does a purchase whose order failed, was canceled or expired replay that outcome? | Decided by agent 2026-10-16: no - only paid and refunded replay; an unpaid closure lets the next Pay start the purchase's next attempt, as a deliberate Pay after a failure is a new request ([Q27](../add-shopify-checkout-integration/decisions.md)) | Replaying every terminal status, which strands an unchanged cart until the member edits it |
| Q4 | What happens to an order whose request stopped before calling Shopify? | Decided by agent 2026-10-16: past a 60-second dispatch lease the next Pay closes it as failed - nothing was sent for it - and dispatches the next attempt once | Resuming the dead request's dispatch from the order row, which cannot rebuild its coupon rides |
| Q5 | Who declares a dispatch ambiguous, and how is it cleared? | Decided by agent 2026-10-16: the reconcile pass, at its give-up deadline, instead of expiring the order; an operator binds the draft or cancels the order through `admin.orders.settleDispatch`. An operator screen is not built | A deadline of its own on the checkout path |
| Q6 | Do guests and email checkouts get a purchase identity? | Decided by agent 2026-10-16: no - they hold no server cart to name one by; their repeated Pay is guarded by the drawer's one Pay at a time | A browser-held key for guests only |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/checkout` | Which backend design delivers reuse, terminal replay, concurrency and dispatch recovery, and who owns it? | Q2 |

## Planning Status

- **Case handoff** - The owner requests active backend safety drafts with their IDs and traces preserved on 2026-10-10. Frontend acceptance retains the published safety assertions.
- **Backend design** - Decided by agent and built on 2026-10-16 ([tech design](tech-design.md), [tasks](tasks.md)).
