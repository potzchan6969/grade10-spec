## Context

The Store product read already returns each variant's price, `availableForSale`
and optional `quantityAvailable`. Cart review performs its own current read.
The application currently maps a listing tile and the product page to stock
counts, and the product page buys only `pricedVariant(product)`. See the
[proposal](proposal.md) for scope and the product page's implementation map
for the code locations. The standalone Store product-detail Storybook preview
also exposes variant choices and stock cues, so it is part of the design
reference work for this change. The cart feature model already retains
unreviewed lines, but the drawer removes withdrawn products with a toast and
the cart host currently gives only a generic review-failure toast.

## Goals / Non-Goals

**Goals:**

- Render availability from Shopify's `availableForSale` value.
- Keep the product page's existing one-item purchase identity and use that
  internal Shopify sale identifier for availability and cart adds.
- Keep browse quantity requests independent of the catalog's stock count.
- Reuse the existing purchase panel and quantity stepper.
- Keep the standalone product-detail Storybook reference aligned with the
  product-page requirements.
- Keep a failed cart read visibly unchecked without presenting its recorded
  price as current.
- Initiate checkout and handle its outcome in the Cart Drawer, then redirect
  to Shopify only after the store confirms the order.

**Non-Goals:**

- Changing the Store API, backend, database, or shared UI component contracts.
- Changing backend checkout pricing, order creation or Shopify's hosted
  checkout lifecycle.

## Decisions

The product-status and cart-validation specs own the availability and review
outcomes. This design maps those existing answers into the Grade10 storefront.

| Choice | Implementation | Rejected alternative |
| --- | --- | --- |
| Listing availability | Keep the current `sellableVariant` rollup for `soldOut`; omit `maxCartQuantity` and `remainingLabel` when mapping to `ProductSummary`. | Derive availability from a quantity or leave stock copy in the tile. |
| Product-page sale identity | Keep the existing `pricedVariant(product)` as the page's one sellable item. Derive its price, availability, SKU and cart add from that same internal variant; render no variant chooser or variant title. | Add a chooser that exposes Shopify variants as product options, or show status for variants other than the one the page can add. |
| Unavailable item | Keep the one sellable item's price visible when its internal Shopify variant is unavailable, and disable Add to cart through the existing purchase panel. | Hide the price, expose alternate variants as choices, or make an unavailable item appear available because its count is positive. |
| Requested quantity | Do not pass `quantityAvailable` to the listing or product purchase controls. The request remains in the client cart, whose existing review re-reads each line and explains a short fill. | Use the browse response as a quantity ceiling or add another availability endpoint. |
| Copy | Reuse the existing availability and sold-out messages. Add no variant-choice label. | Expose the internal Shopify sale identity as a shopper-facing label. |
| Storybook reference | Update the standalone product-detail composition and its page/component stories to show the one sellable item's price and availability, preserve its internal cart identity, and omit stock-derived cues and quantity limits. | Leave the visual reference asserting behavior the application is removing. |
| Failed cart review | In the cart host, replace each known affected line's last availability and price and the total with localized unchecked copy, and name the lines in a persistent retryable notice. When the initial cart read fails before lines are known, show a drawer-level unchecked notice and Retry without inventing line names. Keep checkout unavailable. | Present any recorded availability, price or total as current, or add an `unreviewed` status to the shared `CartDrawer` contract. |
| Withdrawn product notice | Keep the existing auto-removal behavior; include removed line names in the localized unavailable-items toast. Out-of-stock lines remain visible for manual removal. | Conflate a withdrawn product with a variant the shop still lists but cannot fill. |
| Checkout action | Use the drawer's accepted quote and existing checkout request when its action is pressed. Preserve member-only session and quote-readiness gates, keep the drawer open while the request is pending, prevent duplicate submission, and redirect to Shopify on success. Remove `CheckoutPage`, replace product and membership entry points with drawer opening, and let an old `/checkout` URL open the Store with its drawer without submitting an order. | Navigate to a Grade10 pre-checkout page or create an order from the open-time review alone. |
| Checkout contradiction or shop refusal | Preserve named lines and short-fill amounts through `CheckoutResolution`, keep the drawer open, and show the outcome there. Refresh the cart review and quote after a contradiction; keep the accepted code and points choice unless the store refuses it. | Depend on a later review alone to reconstruct which line the shop refused. |
| Checkout-time read failure | Keep the drawer open with known lines and total unchecked. Retry issues a new checkout request; the backend's fresh read still decides whether an order is created. | Treat Retry as a page-only preflight read or reuse a stale open-time answer. |
| Remaining checkout outcomes | Move the existing `settling`, `verify`, `retry` and `support` treatments, points-spent confirmation and replaced-coupon notice from `CheckoutPage` into the drawer host. Keep the account-verification link and accepted tender choice behavior. | Delete the route while leaving a checkout result with no visible treatment. |
| Data and API | Reuse the existing `ProductVariant` fields and cart-review path; add no endpoint or persistence. | Duplicate availability state in the storefront or persist a browse-time count. |

## Risks / Trade-offs

- [Stale catalog read] → the existing
  cart review remains the current source for corrections; browse availability
  does not promise a quantity.
- [Sale identity mismatch] → derive
  the page price, availability, SKU and cart id from the same internal
  `ProductVariant` object.
- [Other callers retain optional stock props] → the
  Grade10 listing and product-page compositions omit them, without changing the
  shared export contract.
- [A failed read may retain its prior query data] → gate displayed line
  availability, prices and totals on the current `CartReviewState`, not on
  cached presence alone.
- [An active Cart Drawer change still specifies `/checkout`] → supersede its
  handoff requirement before that change is archived. Do not leave two active
  route contracts as if both can ship.

## Open Questions

None.
