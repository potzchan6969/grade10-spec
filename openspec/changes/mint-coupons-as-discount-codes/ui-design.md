## Screens

Storybook is the layout source of truth for the ticket and its states. The
web checkout and the till panel both draw the same four states from it.

| Surface | Storybook (SoT) |
| --- | --- |
| A code that fits, with its action | [`Store Cart/PromoTicket` → Default](?path=/story/store-cart-promoticket--default) |
| The one taking the slot | [`Store Cart/PromoTicket` → Selected](?path=/story/store-cart-promoticket--selected) |
| A code that does not fit, with its reason | [`Store Cart/PromoTicket` → Not Applicable](?path=/story/store-cart-promoticket--not-applicable) |
| The wallet as a stack | [`Store Cart/PromoTicket` → List](?path=/story/store-cart-promoticket--list) |
| The same stack inside the cart drawer's nested sheet | [`Store Cart/CartDrawer` → Nested Promo Dismiss](?path=/story/store-cart-cartdrawer--nested-promo-dismiss) |

## Components

- `PromoTicket` from `@grade10/ui` — one code. `selected` marks the one in the
  slot, `muted` softens one that cannot ride, `action` slots the control, and
  `inapplicableReason` carries the backend's own sentence.
- `Button` from `@grade10/design-system` — the action, reading *Use* on a code
  that fits and *Don't use it* on the one in the slot.
- `CartDrawerFooterCopy` — `yourPromoCodes` and `notValidPromoCodes` head the
  two halves; `applyHeldPromo` is the action inside the drawer's sheet.

No new primitive, variant, or token.

## The choice

One code rides an order, so every surface that offers codes is a picker, not
a list to stack:

- **Every code the member holds is shown, whether or not it fits.** One that
  cannot ride keeps its place and carries the reason. A code that vanished
  from the wallet is one its holder goes looking for; "spend more" is
  something they can act on.
- **The ones that fit lead, biggest cut first.** Order is the surface's only
  way of saying which are worth reading, and a collector picking one coupon
  wants the one that takes the most.
- **The newest tap takes the slot.** Tapping the code already in it puts it
  back. Nothing is applied on the member's behalf.
- **The choice is re-read against the basket in front of them.** A basket
  edited under a code already picked drops it rather than carrying it to the
  shop, where it would be a refusal the collector never asked for.

What each code takes off is the backend's number, answered for every code at
once against the same untouched basket. No surface works out its own.

Shopper-facing copy says *promo code*, never *coupon*.

## The counter

The till panel is built when the member is identified, before there is a sale
to read it against, so it carries the coupon's terms and the extension
re-reads them against the live cart on every tap. Everything the gateway
would refuse a coupon for at a counter is said before the tap: the sale is
too small, it holds none of the goods the coupon cuts, the gift is already on
it, or the coupon picks its goods by something a claim carries nothing of.

## States

| State | Spec scenarios |
| --- | --- |
| Two codes fit — the collector chooses one | `grade10-site-store-discounts-SC-03` |
| A second code is refused rather than stacked | `grade10-site-store-discounts-SC-04` |
| A code that cannot ride, with its reason | `grade10-site-store-discounts-SC-03` |
| The counter offers the same choice from the panel | `grade10-site-store-discounts-SC-07` |
