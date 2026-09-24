**Author:** @jeffffej0909 - 2026-08-28

## Why

Grade10 runs its own storefront, so the cart is ours. A line sits in a
signed-in collector's member cart holding the availability and price recorded
when it was added, and nothing in `openspec/specs/` says when the Store must
look again or what it owes the collector when the answer has moved.
Three surfaces answer availability today and none from a stated rule: the
listing draws a tile from a supplied sold-out boolean, a card's page says for
sale or not, and the cart drawer keeps its own `CartItemStatus` vocabulary.

The Store already reviews every line live when checkout is requested and
refuses a variant it no longer sells or a quantity above what it can fill. That
refusal reaches the collector at the last step, for a problem the Store could
have shown when they opened the cart.

**Metric:** share of checkout requests refused for a line the cart had shown as
fine. A stated derivation and stated re-read moments move it toward zero; it is
unmeasured today, so the first delivery sets the baseline. *(Assumption — the
source PRD names no metric.)*

**Acceptance signal:** a signed-in collector who opens the cart is told about
every line that moved before they press checkout, not after.

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
  every variant on it is. Its page presents one sellable item and reads
  availability from that item's internal Shopify sale identity.
- **Browse surfaces communicate no quantity.** No remaining count, no scarcity
  treatment, no label separating one available variant from another. A
  collector may still request a quantity while adding from a browse surface,
  but the control does not expose or cap to the shop's count; the cart review
  explains a short fill.
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
- **Checkout stays in the drawer.** The drawer sends the accepted cart and
  tender choice, keeps changed lines and refusals available to resolve, and
  leaves Grade10 only when Shopify can take the confirmed order.

No component contract changes. `shared/ui/store-product-listing` takes
availability as a supplied condition and forbids deriving one;
`shared/ui/store-cart` carries `default`, `adjusted`, `soldOut` and
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
- **Backend order creation and the hosted checkout lifecycle.** The existing
  checkout request and Shopify handoff remain; this change does not define a
  reservation window.
- **Multi-location inventory.** Available quantity is read as one number.
- **How money is formatted.** Already `money-amounts`; this change only requires
  that a price read be minor units plus an ISO 4217 code.
- **Refresh cadence for browse surfaces.** Whether the listing reads live or
  from cache is engineering's. The two cart reads are not cadence — they are
  stated moments, and they are live.
- **Visual treatment.** Whether out of stock and unavailable are drawn alike is
  design's.

## Capabilities

### New Capabilities

- `grade10-site/commerce/product-status`: what availability means — the shop's answer
  for a variant, the answer for a requested quantity, the variant-to-card
  rollup, and what a browse surface communicates.
- `grade10-site/store/cart-validation`: when the store re-reads availability and
  price for the lines a collector holds, what it does to a line the read
  contradicts, and what the collector is told before and after the cart is
  offered for checkout.

### Modified Capabilities

- `grade10-site/store/product-listing`: remove stock-derived quantity limits
  and low-stock counts from listing tiles.
- `grade10-site/store/product-page`: remove stock-derived quantity limits and
  low-stock counts from the product page while keeping its one sellable item
  and internal Shopify sale identity; the page offers no variant choice.

## Impact

No backend, database, or shared UI contract change is required. The typed
Store product read already supplies each variant's availability, price and
optional quantity, and the live cart review already returns the current
answers used by the drawer. The frontend maps the product page's
one sellable item's internal variant availability to the existing purchase
states and stops exposing browse-time quantity information. The Shopify sale
identifier remains internal to the cart add. On a failed cart review it
marks known affected lines unchecked, replaces their last availability and
prices and the cart total with unchecked states, names them in a retryable
notice, and withholds checkout. A failed initial cart load shows a drawer-level
unchecked state instead. The drawer starts checkout with the accepted quote,
handles checkout-time changes and refusals, and redirects only a confirmed
order to Shopify. The Grade10 checkout page and its internal links retire;
an old `/checkout` address opens the Store with the drawer instead.

The active `add-store-cart-drawer-ui` delta still states that the drawer opens
`/checkout`. Its handoff contract must be superseded before that change is
archived; this change does not duplicate its active requirement.

The change directory is named `add-store-product-status` and carries four
capabilities; the name is left alone so the open pull request keeps its
history. Its standalone Storybook product-detail preview is updated to match
the variant and availability behavior specified here.

`product-status` walks the listing, product page and cart as one Store path;
the Store domain test suite is updated with that path. The product-detail
preview uses the same one-item presentation and keeps its Shopify sale
identifier out of shopper-facing copy.
