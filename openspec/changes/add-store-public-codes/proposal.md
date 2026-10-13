**Author:** @devin - 2026-10-13

## Why

A guest has no code they can use: every held code is minted to a member, and
the shop-wide promotions live only on Shopify's page where the cart never
shows them. Listing the codes open to everyone in the drawer's picker gives
guests and members one place to apply them.

**Metric:** share of orders, guest and member, paid with a public code
applied.

## What Changes

- **Public codes** — the picker's held list gains a Public section, codes
  open to everyone and minted to no member, listed to guests and members
  alike
- **Typed** — a public code typed in the field applies for anyone
- **Members** — see the public codes beside their own wallet codes and
  rewards
- **Guests** — see public codes only; a member's codes and rewards are never
  shown
- **Refusal** — unchanged: a member-only code typed by a guest is refused as
  a code nobody minted

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/store/discounts` — public codes as a kind of promo code
  beside the member coupons
- `grade10-site/store/cart-drawer` — the picker shows public codes to
  everyone. No durable spec yet: the capability is being introduced by
  `add-store-cart-drawer-ui`, which this change depends on accepting first
- `shared/ui/store-cart` — a public-code section in the picker's held list,
  additive props on `CartDrawer` (`CartDrawerFooterProps`,
  `CartDrawerFooterCopy`)

## Impact

- **`@grade10/ui`** — additive props on `CartDrawerFooter` for a public-code
  section in the picker
- **grade10 application** — the store backend reads public codes from Shopify
  and the quote prices them
- **Depends on** — `add-store-cart-drawer-ui` landing first

## References

- [Discounts · Public Codes](../../../docs/prds/products/grade10-site/store/discounts.md#public-codes)
- [Cart Drawer · Promo Code](../../../docs/prds/products/grade10-site/store/cart.md#promo-code)
