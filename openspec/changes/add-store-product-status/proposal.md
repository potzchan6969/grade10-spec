**Author:** @jeffffej0909 - 2026-08-28

## Why

Grade10 runs its own storefront, so the cart is ours. A line sits in the
collector's browser holding the availability and price it recorded when it was
added, and nothing in `openspec/specs/` says when the store must look again or
what it owes the collector when the answer has moved. Three surfaces answer
availability today and none from a stated rule: the listing draws a tile from a
supplied sold-out boolean, a card's page says for sale or not, and the cart
drawer keeps its own `CartItemStatus` vocabulary.

The store already refuses a stale line at the last step.
`grade10-store/shopify-commerce` prices every line live when a checkout is
requested and refuses a variant the shop no longer sells or a quantity above
what it counts. That refusal reaches the collector as one sentence on the
checkout page, with no line named and nothing to press, for a problem the store
could have shown when they opened the cart.

**Metric:** share of checkout requests refused for a line the cart had shown as
fine. A stated derivation and stated re-read moments move it toward zero; it is
unmeasured today, so the first delivery sets the baseline. *(Assumption — the
source PRD names no metric.)*

**Acceptance signal:** a collector who opens the cart is told about every line
that moved before they press checkout, not after.

## What Changes

Two capabilities, split by what they answer. `product-status` defines what
availability *means*; `cart-validation` governs when the store *acts* on it.

**The definition —**

- **Availability is the shop's answer, not a count the store reads.** A variant
  is available when the shop offers it for sale on the store's channel and out
  of stock when it does not. The store never derives availability from a
  quantity and never reads the shop's inventory policy: a variant the shop
  keeps selling past zero is available, and one the shop stops selling at zero
  is out of stock. Selling past zero is decided on the shop, by the people who
  run it.
- **A count bounds a quantity, when the shop exposes one.** Availability is
  also answered for a requested quantity: fillable, fillable in part naming
  what can be filled, or not fillable. Only a count above zero bounds a
  request. A shop that exposes no count, or a count of zero while still
  offering the variant, bounds nothing.
- **A card's tile reflects its most available variant.** Out of stock only when
  every variant on it is; per-variant availability stays on the card's page.
- **Browse surfaces communicate no quantity.** No remaining count, no scarcity
  treatment, no label separating one available variant from another. Scoped to
  browsing, so the cart can still explain a quantity it changed.
- **Unavailable is not a browse condition.** An unpublished product is absent
  from the listing and its address already answers 404.

**The validation —**

- **The store re-reads availability and price at two moments:** when the cart
  opens, and when the cart is offered for checkout. Each read is answered by
  the shop at that moment, never by a browse cache and never by what a line
  recorded when it was added.
- **The checkout read is the read the order is priced from.** One read answers
  both whether the cart goes and what it costs; the store never creates an
  order from an earlier read, however recent.
- **A line that cannot be filled in full is reduced to what remains** and
  reported as adjusted; one that cannot be filled at all is reported out of
  stock and left for the collector to remove. A line is never grown.
- **A withdrawn product is reported as unavailable,** distinctly from out of
  stock.
- **A repriced line is shown at the current price,** the change disclosed as
  plainly rising as falling, and the disclosed price becomes the line's price
  from then on. No browser-supplied or recorded price ever reaches a checkout
  order.
- **A cart the read contradicts is not handed off.** Every contradicted line is
  named at once and the collector returns to the cart to resolve it.
- **The store's read is advisory; the shop remains the authority.** A refusal
  after a passing read is reported with the line named, a cart the shop would
  fill short is refused rather than sold short, and a read that cannot complete
  blocks checkout rather than guessing.

No component contract changes. `shared-ui/store-product-listing` takes
availability as a supplied condition and forbids deriving one;
`shared-ui/store-cart` carries `default`, `adjusted`, `soldOut` and
`unavailable` and reads status and price when the drawer opens. This change
states what the store puts into them.

## Non-Goals

- **Overriding the shop's inventory policy.** Whether a variant sells past zero
  is set on the shop, and the store neither adds a pre-order treatment for it
  nor refuses what the shop sells. A catalogue that must never sell past zero
  says so on the shop. *(Assumption — no variant on the Grade10 shop is set to
  sell past zero; if one is, the store sells it as available.)*
- **Low stock as a cue to buy.** Browse surfaces state availability and nothing
  about quantity. The cart's `adjusted` warning explains a quantity the store
  already changed; it is not a scarcity badge.
- **Checkout order creation, draft orders, and the fifteen-minute reservation.**
  Already `grade10-store/shopify-commerce`. This change stops at the handoff.
- **Multi-location inventory.** Available quantity is read as one number.
- **How money is formatted.** Already `money-amounts`; this change only requires
  that a price read be minor units plus an ISO 4217 code.
- **Refresh cadence for browse surfaces.** Whether the listing reads live or
  from cache is engineering's, bounded by the invalidation
  `grade10-store/shopify-commerce` requires. The two cart reads are not
  cadence — they are stated moments, and they are live.
- **Visual treatment.** Whether out of stock and unavailable are drawn alike is
  design's.

## Capabilities

### New Capabilities

- `grade10-store/product-status`: what availability means — the shop's answer
  for a variant, the answer for a requested quantity, the variant-to-card
  rollup, and what a browse surface communicates.
- `grade10-store/cart-validation`: when the store re-reads availability and
  price for the lines a collector holds, what it does to a line the read
  contradicts, and what the collector is told before and after the cart is
  offered for checkout.

### Modified Capabilities

None. `shared-ui/store-product-listing` already takes a supplied condition and
forbids deriving one, `shared-ui/store-cart` already carries the statuses and
the open-time read these requirements feed, and `grade10-store/product-page`'s
per-variant for-sale requirement is unchanged by stating where that condition
comes from.

## Impact

No change to `packages/ui` or `packages/i18n`. The work is in the storefront
application and its store backend: one availability rule that the checkout's
own pricing and the cart's open-time read both answer from, reported per line
rather than stopping at the first refusal, and the storefront mapping those
answers onto the statuses the drawer and the checkout page already render.

Depends on `add-grade10-shopify-store` for `grade10-store/shopify-commerce`,
which establishes the shop as authoritative for inventory and owns everything
from the handoff onward. The cart drawer's statuses and the low-stock warning's
lifecycle are durable in `shared-ui/store-cart`; this change owns what the
store puts into them. No Figma change.

The change directory is named `add-store-product-status` and carries two
capabilities; the name is left alone so the open pull request keeps its
history.
