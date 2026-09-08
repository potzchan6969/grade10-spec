## 1. Carry the provider's facts (grade10)

- [x] 1.1 `PaymentOrderLine` gains the provider's line handle and its named allocations
- [x] 1.2 `PaymentRefundFact` gains the lines a refund gave back
- [x] 1.3 The Shopify webhook decodes `line_items[].id`, `refund_line_items[].line_item_id`, and resolves `discount_application_index` against the order's applications
- [x] 1.4 The Admin query asks for `refundLineItems` and each allocation's own code or title
- [x] 1.5 The goods basis is read pre-return on both arms — an order first read after a refund states the goods it sold, not the goods still standing

## 2. Record what the shop settled (grade10)

- [x] 2.1 `order_lines` — handle, goods, whether the rule let it earn, and what it earned
- [x] 2.2 `order_discounts` — what the shop allocated to each named discount
- [x] 2.3 `eligibleGoods` reports its per-line verdict beside the total
- [x] 2.4 Both settling paths record them in the transaction that makes the payment true, once

## 3. Read the money from it (grade10)

- [x] 3.1 A claw-back is what the returned lines earned, accumulated per line
- [x] 3.2 A welded coupon is corroborated by its own cut as well as its variant
- [x] 3.3 The points capture reads the points discount's own allocation
- [x] 3.4 A discount no instrument accounts for is counted and never read as points
- [x] 3.5 A points tender returns only once everything it was spread over comes back, and a member left short is reported

## 4. Prove it (grade10)

- [x] 4.1 Returning goods that never earned reverses nothing; a tender returns only once the whole sale comes back, and the member left short is reported
- [x] 4.2 A split return reaches the same basis as a single refund
- [x] 4.3 A coupon whose cut the sale no longer shows returns to the member
- [x] 4.4 A shopkeeper's manual cut is not captured as points
- [x] 4.5 The record is written once across a redelivered settlement

## 5. Confirm against a live shop (grade10)

Everything above is proven against the fake shop, which this change also
wrote. What a fake cannot settle is whether Shopify states these fields the
way the decoders read them. Ring one staging sale carrying a points tender, a
welded product coupon and a manual staff discount, then refund one line of it.

- [x] 5.1 A settled order records one `order_lines` row per line the shop sold, each with a distinct `line_ref` — an empty table means the webhook stated no `line_items[].id`, and the pro-rated share is silently answering everything
- [x] 5.2 `order_discounts` holds a row titled `Points` whose `amount_minor` is what the shop took off for the tender, not what was promised
- [ ] 5.3 The welded coupon's row carries the title the till applied it under — the same string as `coupons.title`. A different one is the risk `design.md` names, and it costs corroboration rather than spending the coupon wrongly
- [x] 5.4 The staff discount appears under its own title and is neither captured as points nor counted in `store.points_tender.unexplained`
- [x] 5.5 Refunding one line reverses what that line earned, and `commerce.order.refund_estimated` does not fire — if it does, the refund body named no `line_item_id`
- [ ] 5.6 The sweep arm agrees with the webhook arm on the same order: same lines, same allocations, same claw-back
- [x] 5.7 Shopify never omits `refund_line_items` — an amount an operator typed sends `[]`, and so does a refund of the delivery alone, so an empty list on its own cannot mean no goods came back
- [x] 5.8 What a refund names besides goods tells those two apart — `refund_shipping_lines` on the webhook, `refundShippingLines` on the Admin API

Rung on the staging shop as store order `d5842039` / Shopify `#1014`: two
lines, a welded product coupon on one, a manual staff discount on the other, a
100-point tender, then one line refunded.

- **5.3 and 5.6 need a till.** Both turn on the arm a web sale never takes. A
  welded cut is corroborated only for `origin = pos`, and the till is what
  sends the coupon's own title — a web sale titles every welded cut `Coupon`
  and reads no title back. Likewise only a till sale is settled by both arms:
  a draft sale's `orders/paid` is an unbound claim the webhook hands to the
  sweep, so one arm settles it and there is nothing to compare.
- **What the two arms did agree on.** The sweep settled this sale and the
  webhook priced its refund, against the same line handles and to the exact
  per-line claw-back — the cross-arm half `refund_estimated` used to stand in
  for.

Where a title does not match, the fix is the mapping in the decoders, not the
rules that read it — every rule already falls back to what it did before this
change, so a mismatch is a lost improvement rather than a regression.

**What a refund states, measured at 2026-07** against one staging order:

| Refund | `refund_line_items` | `refund_shipping_lines` | `order_adjustments` |
| --- | --- | --- | --- |
| Delivery ticked, HK$60 | `[]` | the line, subtotal 60.00 | `shipping_refund −60.00` |
| Amount typed, HK$10 | `[]` | `[]` | `refund_discrepancy −10.00` |
| One line itemised | the line | `[]` | `refund_discrepancy ±5.00` |

- **The delivery is the signal on both arms** because it is the only one that
  is. The Admin API stopped carrying a refunded delivery as an order
  adjustment in 2024-10 while the webhook still does, so an adjustment read
  would have the two arms answer differently about one refund.
- **The adjustment net says nothing** either way: an itemised refund nets zero
  here while moving goods.
- **A delivery an operator types the amount for is unreachable.** It states
  the same body as any other typed amount, so it is priced as a share and
  claws back goods that never came back — counted as
  `commerce.order.refund_by_share`, which is the population the estimate rate
  is read against.
