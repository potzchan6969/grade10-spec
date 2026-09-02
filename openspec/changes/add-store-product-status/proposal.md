**Author:** @jeffffej0909 - 2026-08-28

## Why

Grade10 runs its own storefront rather than Shopify's, so the cart is ours. A
line sits in it holding whatever availability and price it recorded when the
collector added it, and nothing in `openspec/specs/` says when the store must
go and look again, or what it owes the collector when the answer has moved.
Three surfaces answer availability today and none of them from a stated rule:
the listing draws a tile from a supplied sold-out boolean, a card's page says
for sale or not for sale, and the cart drawer keeps its own `CartItemStatus`
vocabulary.

Owning the cart puts the whole cost of that silence on us. Shopify sees the
order only when we hand it one, and `grade10-store/shopify-commerce` validates
against live Shopify at that moment and refuses an unpublished, unavailable or
insufficient line. Everything before the handoff is the store's to get right,
and today the store may confidently carry a line for a card that sold out an
hour ago, or a quantity larger than anything left, all the way to the last
step — where the collector meets a refusal for a problem the store could have
told them about when they opened the cart.

**Metric:** share of checkout attempts refused by Shopify for an item or
quantity the store had shown as fine. A stated derivation plus a stated re-read
should move that toward zero; today it is unmeasured, so the first delivery
establishes the baseline. *(Assumption — the source PRD names no metric.)*

**Acceptance signal:** a collector who opens the cart is told about every line
that moved, before they press checkout rather than after.

## What Changes

Two capabilities, split by what they answer. `product-status` defines what
availability *means*; `cart-validation` governs when the store *acts* on it.

**The definition —**

- **One derivation from inventory to what a collector sees.** Available
  quantity alone decides it: at or below zero the variant is out of stock,
  above zero it is available. `inventoryPolicy` is not read, so a variant set
  to `continue` with no stock reads out of stock and cannot be bought.
- **Availability is also answerable for a requested quantity.** A request is
  fillable, fillable in part naming what can be filled, or not fillable — so a
  cart line asking for 5 when 2 remain is a stated outcome rather than an
  unhandled case that surfaces at checkout.
- **A card's tile reflects its most available variant.** Out of stock only when
  every variant on it is; per-variant availability stays on the card's page.
- **Browse surfaces communicate no quantity.** No remaining count, no scarcity
  treatment, no label separating one available variant from another. Scoped to
  browsing, so the cart can still explain a quantity it changed.
- **Unavailable is not a browse condition.** An unpublished product is absent
  from the listing and its address already answers 404.

**The validation —**

- **The store re-reads availability and price at two moments:** when the cart
  opens, and again before the cart is offered for checkout. What a line
  recorded when it was added is never enough.
- **A line that cannot be filled in full is reduced to what remains** and
  reported as adjusted; one that cannot be filled at all is reported out of
  stock and left for the collector to remove. A line is never grown.
- **A withdrawn product is reported as unavailable,** distinctly from out of
  stock.
- **A repriced line is shown at the current price** and the change disclosed
  before checkout, rising as plainly as falling. No browser-supplied or
  recorded price ever reaches a checkout order.
- **A cart the re-read contradicts is not handed off.** Every contradicted line
  is named at once and the collector returns to the cart to resolve it.
- **The store's read is advisory; Shopify remains the authority.** A refusal
  after a passing read is reported with the lines named, and a read that cannot
  complete blocks checkout rather than guessing.

No component contract changes. The listing already takes availability as a
supplied condition and forbids deriving one; `CartItemStatus` already carries
`adjusted` and `soldOut`, and `cart-drawer-unavailable-items` is adding
`unavailable`. This change states what the store must put into them.

## Non-Goals

- **Low stock as a cue to buy.** Removed rather than deferred: browse surfaces
  state availability and nothing about quantity. The cart's existing `adjusted`
  warning is untouched — it explains a quantity the store already changed, and
  is not a scarcity badge. `cart-item-hide-adjusted-warning` owns its lifecycle.
- **Pre-order.** `inventoryPolicy: continue` is deliberately not honoured.
  Taking an order for stock the store does not hold carries its own fulfilment,
  payment-timing and cancellation consequences, and needs its own change.
- **Checkout order creation, draft orders, and the fifteen-minute reservation.**
  Already `grade10-store/shopify-commerce`. This change stops at the handoff.
- **Multi-location inventory.** Single-location assumption; available quantity
  is read as one number.
- **How money is formatted.** Already `money-amounts`; this change only requires
  that a price read be minor units plus an ISO 4217 code.
- **Refresh cadence for browse surfaces.** Whether the listing reads live or
  from cache is engineering's, bounded by the invalidation
  `grade10-store/shopify-commerce` already requires. The two cart re-reads are
  not cadence — they are stated moments.
- **Visual treatment.** Whether out-of-stock and unavailable are drawn alike is
  design's.

## Capabilities

### New Capabilities

- `grade10-store/product-status`: what availability means — the derivation from
  quantity, the answer for a requested quantity, the variant-to-product rollup,
  and what a browse surface may communicate.
- `grade10-store/cart-validation`: when the store re-reads inventory and price
  for the lines a collector holds, what it does to a line the read contradicts,
  and what the collector is told before the cart is offered for checkout.

### Modified Capabilities

None. No existing requirement changes: `shared-ui/store-product-listing`
already takes a supplied condition and forbids deriving one,
`shared-ui/store-cart` already carries the statuses these requirements set, and
`grade10-store/product-page`'s per-variant for-sale requirement is unchanged by
stating where that condition comes from.

## Impact

No change to `packages/ui` or `packages/i18n`. The work is in the storefront
application: derive the supplied conditions from the stated rule, and perform
the two re-reads with the outcomes these requirements name.

Depends on `add-grade10-shopify-store` for `grade10-store/shopify-commerce`,
which establishes Shopify as authoritative for inventory and owns everything
from the handoff onward. Adjoins `cart-drawer-unavailable-items` and
`cart-item-hide-adjusted-warning` on the cart line: those changes own the
component contract and the warning's lifecycle, this one owns what the store
puts into them. No Figma change.

The change directory is still named `add-store-product-status`; it now carries
two capabilities, and the name is left alone so the open pull request keeps its
history.
