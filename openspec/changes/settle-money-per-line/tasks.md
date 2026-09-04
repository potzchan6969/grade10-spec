## 1. Carry the provider's facts (grade10)

- [x] 1.1 `PaymentOrderLine` gains the provider's line handle and its named allocations
- [x] 1.2 `PaymentRefundFact` gains the lines a refund gave back
- [x] 1.3 The Shopify webhook decodes `line_items[].id`, `refund_line_items[].line_item_id`, and resolves `discount_application_index` against the order's applications
- [x] 1.4 The Admin query asks for `refundLineItems` and each allocation's own code or title

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

## 4. Prove it (grade10)

- [x] 4.1 Returning goods that never earned reverses nothing; returning every qualifying good returns the whole tender
- [x] 4.2 A split return reaches the same basis as a single refund
- [x] 4.3 A coupon whose cut the sale no longer shows returns to the member
- [x] 4.4 A shopkeeper's manual cut is not captured as points
- [x] 4.5 The record is written once across a redelivered settlement

## 5. Confirm against a live shop (grade10)

Everything above is proven against the fake shop, which this change also
wrote. What a fake cannot settle is whether Shopify states these fields the
way the decoders read them. Ring one staging sale carrying a points tender, a
welded product coupon and a manual staff discount, then refund one line of it.

- [ ] 5.1 A settled order records one `order_lines` row per line the shop sold, each with a distinct `line_ref` — an empty table means the webhook stated no `line_items[].id`, and the pro-rated share is silently answering everything
- [ ] 5.2 `order_discounts` holds a row titled `Points` whose `amount_minor` is what the shop took off for the tender, not what was promised
- [ ] 5.3 The welded coupon's row carries the title the till applied it under — the same string as `coupons.title`. A different one is the risk `design.md` names, and it costs corroboration rather than spending the coupon wrongly
- [ ] 5.4 The staff discount appears under its own title and is neither captured as points nor counted in `store.points_tender.unexplained`
- [ ] 5.5 Refunding one line reverses what that line earned, and `commerce.order.refund_estimated` does not fire — if it does, the refund body named no `line_item_id`
- [ ] 5.6 The sweep arm agrees with the webhook arm on the same order: same lines, same allocations, same claw-back

Where a title does not match, the fix is the mapping in the decoders, not the
rules that read it — every rule already falls back to what it did before this
change, so a mismatch is a lost improvement rather than a regression.
