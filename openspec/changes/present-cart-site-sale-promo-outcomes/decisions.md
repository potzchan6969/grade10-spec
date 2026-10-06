## Goals

- The shared cart drawer shows each site sale and promo code outcome one way:
  the sale on the lines with the list price struck through and no Store sale
  row; a stacked code; a refused code; a replacing code; the code removed; a
  held code that cannot apply.
- Storybook under Store Cart / CartDrawer / Auto Discount is the layout source
  of truth for those composed canvases.

## Non-Goals

- Which combine rule refuses, stacks or replaces a code, including a product
  sale that refuses every code: the shop's pricing,
  `grade10-site/store/site-discounts` and
  [Discounts · One discount at a time](../../../docs/prds/products/grade10-site/store/discounts.md#one-discount-at-a-time).
- A summary row naming a Store sale or any other automatic cut.
- An order-level automatic cut, such as a spend threshold off the whole order:
  the drawer shows line-level site sales only, and the invoice prices the rest.
- Points tender, free shipping, or a second order-level promo beside the one
  code slot.
- Admin authoring of site discounts.
- A code shown on a line, as `couponCode` with its own struck price: in every
  outcome here a code reaches the drawer only as `PromoState`, and the summary
  shows its discount.
- Pricing the shop's sale in the Grade10 drawer: its estimated total leaves the
  shop's sale to the invoice,
  [Cart Drawer · Rules](../../../docs/prds/products/grade10-site/store/cart.md#rules).

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What money basis does the drawer use when a code stacks? | The quote owns the amounts: the consumer supplies line prices, list prices and the Subtotal, and the drawer computes none. Carried by the requirement "A site sale reaches the drawer only on its lines" - decided by the round | Computing the stacked cut against sale or list prices inside the drawer |
| Q2 | Does a product sale that refuses codes forbid stack or replace in this change? | No. The drawer presents whatever outcome the quote returns; the combine rules stay with `grade10-site/store/site-discounts`. Carried by Cart Drawer · Product decisions, row Combine rules - decided by the round | Encoding exclusivity in the drawer |
| Q3 | Can a replacing code take the sale off some lines and leave it on others? | Yes, line by line. The drawer prices each line as the quote supplies it, so a cart with sale lines and replaced lines under one code needs no rule of its own; which lines a code takes is the shop's pricing, as Q2. Carried by Cart Drawer · Replaced - decided by QA2 | A drawer rule that a code replaces the sale on every line or none |
| Q4 | Does a sold-out line count toward the Subtotal? | No. The Subtotal leaves out a sold-out line, as the count badge does, because the shop will not sell it. Grade10 already sums only the lines the shop still sells: `reviewedSubtotalMinor` in `packages/grade10-store/frontend/src/features/orders/cart/domain/models/Cart.ts:162`, passed to the drawer from `presentation/hooks/useCartReview.ts:138`. Carried by Cart Drawer · Subtotal and the requirement "A site sale reaches the drawer only on its lines" - decided by QA2 from the implementation | Summing every line the drawer shows |
| Q5 | What does a line show when the list price it is given equals its price? | The drawer strikes any list price it is given and compares no amounts, as Q1. Which price a consumer passes as the list price on a line both repriced and on sale is R1's. Carried by the requirement "A site sale reaches the drawer only on its lines", Drawer renders - decided by QA2 | Comparing the two prices in the drawer |
| Q6 | Does this change wait on R1, the struck price on a line both repriced and on sale? | No. Grade10 supplies no site sale on its lines in this change, and sets `originalPrice` only from a reprice (`packages/grade10-store/frontend/src/features/orders/cart/presentation/cartItem.ts:16` in the application repository), so no Grade10 line is both; the drawer strikes the list price it is given, as Q5. Which price Grade10 strikes stays open on the Grade10 Cart Drawer page, row Struck price on a line, for the Grade10 product owner and the change that prices the shop's sale in that drawer - decided by QA2 | Holding this change until the Grade10 product owner chooses |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/ui/store-cart` | R1 - On a cart line both repriced and on sale, which price is struck through? Grade10 sets `originalPrice` only from a reprice, and this change makes it the list price on a sale line; the Discounts page already says the cart strikes the price a product's sale replaced. Options: (a) the list price, with the reprice given a signal of its own; (b) the price seen before, with the sale shown only by the lower price; (c) defer to the Grade10 change that prices the shop's sale in its drawer. Recommended: (c). Owner: Grade10 product owner | Q6 |
| `shared/ui/store-cart` | R2 - Can a replacing code take the sale off some lines and leave it on others? Removed says the sale returns to the lines the code had taken it from, so a code may take only some; Replaced says the code puts the lines at the list price, and no outcome names a cart with sale lines and replaced lines under one code. Owner: Product | Q3 |
| `shared/ui/store-cart` | R3 - Does a sold-out line count toward the Subtotal? The Subtotal is now the sum of the lines as shown, and a sold-out line is shown with its price while the count badge leaves it out. Owner: Product | Q4 |
| `shared/ui/store-cart` | R4 - What does a line show when the list price it is given equals its price? On sale says the list price is struck through; nothing says whether an equal price is struck, shown once, or never supplied. Owner: Product | Q5 |
