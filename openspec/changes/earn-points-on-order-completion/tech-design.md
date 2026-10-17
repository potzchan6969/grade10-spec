# Tech Design

## Context

The trigger is already in the store. `recordCompletion`
(`packages/grade10-store/backend/src/services/orders/completion.ts`) runs in
the transaction of every fulfilment write; the first write that stamps an
order complete queues one `completed` order event carrying the earn. The
paid event of a web order carries no earn.

## Decisions

- **One earn per order** - `hasLiveEarn` is asked under the order's lock
  before the completion writes its event. A paid event priced under the old
  rule, or a claim's earn, stands, so an order in flight at launch never
  earns twice. No backfill.
- **Basis at completion** - the completion earns on `eligible_goods_minor`
  less `refunded_goods_minor`; a refund before completion records a refund
  event with no earn to claw back.
- **Guests** - a site guest order's completion is counted and earns nothing.
- **Order Details** - the projection carries no `loyaltyPoints` today; an
  order that will never earn names none. The Points to Earn section is
  `add-grade10-customer-order-pages`'s.
