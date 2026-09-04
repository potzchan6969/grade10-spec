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
