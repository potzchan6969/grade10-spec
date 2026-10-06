## Goals

- A member and a shopkeeper read the points discount on the till's cart, the
  receipt and the paid order as money taken off.
- Every order carrying a "Points" discount still settles as the member's
  points.

## Non-Goals

- Relabelling the site's checkout summary row or the cart drawer footer.
- Relabelling the till panel's row for the points spent.
- Retitling orders already paid.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What is the points discount titled? | "Deduction from Points" - decided by the owner. Carried by `paying-with-points.md` Rules Discount, `shopify-integration.md` Two Channels What carries the discount, the requirement's first sentence and `grade10-site-store-membership-SC-81` | "Points", which reads as a count of points |
| Q2 | Is the title translated for a member who reads Traditional Chinese? | No. One English value written into Shopify, like "Coupon", as the owner chose it - decided by the round. Carried by `shopify-integration.md` Product decisions Title and `grade10-site-store-membership-SC-81`'s language line | A bilingual title, which no other discount title carries |
| Q3 | How long does "Points" count as the same discount? | For as long as orders exist, because a paid order keeps the title it was paid with - decided by the owner. Carried by `paying-with-points.md` Rules Discount ("Points", the title older orders carry), the requirement's "Wherever a discount is read" sentence and `grade10-site-store-membership-SC-83` | Until every till writes the new title, which leaves older paid orders unread |
| Q4 | Do the site's labels and the till panel's row change with it? | No. Only the discount title changes - decided by the owner. Carried by Non-Goals above and `shopify-integration.md` Product decisions Not in scope | Relabelling every place the money shows |
| Q5 | Does Order Details' points row change with it? | No. It keeps its label and shows for an order paid under either title, because it finds the order's points discount through the same title check settlement uses (grade10 `packages/grade10-store/backend/src/services/orders/readOrder.ts:171`) - decided by the round, from Q4. Carried by `order-detail.md` Order Summary (`add-grade10-customer-order-pages`) and `tech-design.md` decision 6 | A row that matches only the new title and misses older orders |
| Q6 | A parked till sale carrying "Points" is resumed and staff tap Apply again. Which title goes back on? | The title the till writes now: Apply takes the sale's own points discount off under either title before it writes - decided by the round, from grade10 `integrations/shopify-pos/grade10/src/acts/flow.ts`. Carried by the requirement's "Applying points again" sentence and `grade10-site-store-membership-SC-86` | Keeping the title the sale started with, which leaves "Points" on new paid orders |
| Q7 | Staff keyed a discount under a points title on a sale the till never marked. Is a coupon-only Apply refused too, or only a points spend? | Both are refused: the order id Apply writes would make the keyed discount read as the member's points, held and stripped as theirs - decided by the round, from grade10 `integrations/shopify-pos/grade10/src/acts/spend.ts:343` and its test at `spend.test.ts:562`. Carried by Store Discounts' Apply refusals, the requirement's "At the till" sentence and `grade10-site-store-membership-SC-85` | A coupon-only Apply beside it, which the page said and the till never did |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/membership | The non-goals keep the checkout summary row and the cart drawer footer as they are, and say nothing of the Order Details page's points row on a settled order. Does that row keep its label, and does it show for an order paid under "Deduction from Points" as it does under "Points"? | Q5 |
| grade10-site/store/membership | A till sale parked with a "Points" discount from before the switch is resumed, and staff tap Apply again. Does the discount go back on as "Deduction from Points", or keep the title the sale started with? | Q6 |
| grade10-site/store/membership | Store Discounts said a coupon alone is never refused over somebody else's discount, and the requirement refused only a points spend; the till refuses a coupon-only Apply over a discount keyed under a points title. Which does the product do? | Q7 |
