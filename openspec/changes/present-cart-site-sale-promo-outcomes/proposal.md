**Author:** @tangconst - 2026-09-10

## Why

A storewide automatic sale and a typed promo code can meet on the same basket.
Shopify's combine rules may refuse the code, stack it on the sale, or replace
the sale with the code. Collectors already see sale prices on lines; without a
fixed cart presentation they cannot tell which outcome they got, or whether
removing the code brings the sale back.

**Metric:** share of cart opens during an active site sale where the collector
applies or clears a promo and the next total matches the named outcome
(refuse, stack, or replace) with no support contact about a “missing” or
“double” discount.

**Acceptance signal:** Storybook under Store Cart / CartDrawer / Auto Discount
matches the four outcomes, and a collector on a live site sale sees the same
shapes when the applied quote returns each outcome.

## What Changes

- The shared cart drawer presents each site-sale × promo outcome one way:
  - **Site sale alone** — sale unit price and struck compare-at on each
    eligible line; Subtotal is the sum of those line prices; no footer row
    named Store sale for that cut
  - **Stack** — lines keep sale + compare-at; footer `PromoState` applied
    shows only the code's Discount; Subtotal stays the post-sale line sum
  - **Refuse** — lines and totals stay on the site sale; the promo sheet
    names the refusal; held codes that cannot apply are muted with no Apply
  - **Replace** — lines show list unit price with no compare-at; footer
    shows only the code's Discount
  - **Fallback** — removing a stacked or replacing code restores the site
    sale on the lines when that sale still applies
- Storybook under `Store Cart/CartDrawer/Auto Discount` holds the four
  composed canvases that accept these presentations
- Manual page [Cart Drawer](/p/shared/ui/store-cart) carries the 🚧 outcomes
  and story embeds

## Non-Goals

- Changing which Shopify or grade10 combine rule produces refuse, stack, or
  replace — that is pricing / `add-site-wide-discounts`, not this drawer
- Naming a Store sale (or other auto-cut) as its own footer summary row
- Points tender, free shipping, or a second order-level promo alongside the
  one code slot
- Admin authoring of site discounts
- Wiring the Grade10 application drawer to live quote endpoints (still
  `add-store-cart-drawer-ui` / tender-follows-quote)

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shared/ui/store-cart` — presentation contract for site-sale lines and
  promo combine outcomes on the shared drawer

## Impact

- `@grade10/ui` `packages/ui/src/blocks/store-cart/` — line and footer
  presentation; Auto Discount Storybook folder
- Manual: `docs/prds/products/shared/ui/store-cart.md`
- Consuming apps supply quote outcomes as line `price` /
  `originalPrice` and `PromoState`; they do not invent a second footer row
  for the site sale

## Open Questions

| Item | Owner | Note |
| --- | --- | --- |
| Exact money basis when a code stacks (cut of post-sale vs list) | Engineering | Display holds either; the quote owns the amounts |
| Whether product special-sale exclusivity in `add-site-wide-discounts` still forbids stack/replace at pricing time | Product on that change | This change only presents whatever outcome the quote returns |
| The above is unverified, not just unowned | Product on `add-site-wide-discounts` | `add-site-wide-discounts` has not shipped — `acceptAutomaticDiscounts` is not in the codebase, so no automatic discount has ever reached a draft order and the refuse/stack/replace outcome this change's four presentations assume has never been observed on staging. Re-verify against that change's real staging run (its tasks 2.1–2.3) before this change's follow-on wiring work or a `tasks.md` starts, in case the real combine-rule shape differs from what these designs assume |

## Follow-on changes

- Wire the Grade10 cart drawer to one applied quote that can return these
  outcomes on a live site sale
