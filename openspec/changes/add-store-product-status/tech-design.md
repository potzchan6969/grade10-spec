## Context

The Store product read already returns each variant's price, `availableForSale`
and optional `quantityAvailable`. Cart review performs its own current read.
The application currently maps a listing tile and the product page to stock
counts, and the product page buys only `pricedVariant(product)`. See the
[proposal](proposal.md) for scope and the product page's implementation map
for the code locations. The standalone Store product-detail Storybook preview
has the same stock cue and single-variant limitation, so it is part of the
design reference work for this change. The cart feature model already retains
unreviewed lines, but the drawer removes withdrawn products with a toast and
the cart host currently gives only a generic review-failure toast.

## Goals / Non-Goals

**Goals:**

- Render availability from each variant's `availableForSale` value.
- Let a collector choose the variant to add from the product page.
- Keep browse quantity requests independent of the catalog's stock count.
- Reuse the existing purchase panel and design-system selection primitives.
- Keep the standalone product-detail Storybook reference aligned with the
  product-page requirements.
- Keep a failed cart read visibly unchecked without presenting its recorded
  price as current.

**Non-Goals:**

- Changing the Store API, backend, database, or shared UI component contracts.
- Changing the cart review or checkout read and correction lifecycle.

## Decisions

The product-status and cart-validation specs own the availability and review
outcomes. This design maps those existing answers into the Grade10 storefront.

| Choice | Implementation | Rejected alternative |
| --- | --- | --- |
| Listing availability | Keep the current `sellableVariant` rollup for `soldOut`; omit `maxCartQuantity` and `remainingLabel` when mapping to `ProductSummary`. | Derive availability from a quantity or leave stock copy in the tile. |
| Product-page selection | Keep a selected variant in `ProductView`, default it with `pricedVariant(product)`, and pass that variant to the price, status, SKU and purchase composition. Use `RadioList` and `RadioCard` from `@grade10/design-system`. | Continue buying the opening variant while showing status for every variant, or add a new `@grade10/ui` component. |
| Unavailable variants | Show each variant's price and availability; selecting an unavailable variant keeps its price visible and disables Add to cart through the existing purchase panel. | Hide unavailable variants or make them appear available because their count is positive. |
| Requested quantity | Do not pass `quantityAvailable` to the listing or product purchase controls. The request remains in the client cart, whose existing review re-reads each line and explains a short fill. | Use the browse response as a quantity ceiling or add another availability endpoint. |
| Copy | Add `variantLabel` to the shared `product` message catalog in English, Traditional Chinese, Simplified Chinese and Korean. Reuse existing availability and sold-out messages. | Hard-code an English group label or introduce a new shared UI copy contract. |
| Storybook reference | Update the standalone product-detail composition and its page/component stories to select variants, show per-variant price and availability, and omit stock-derived cues and quantity limits. | Leave the visual reference asserting behavior the application is removing. |
| Failed cart review | In the cart host, replace each affected line's last availability and price and the total with localized unchecked copy, and name the lines in a persistent retryable toast. On the pre-checkout page, use the existing inline review notice and Retry action, mark affected lines unchecked, and keep Pay unavailable. | Present any recorded availability, price or total as current, or add an `unreviewed` status to the shared `CartDrawer` contract. |
| Withdrawn product notice | Keep the existing auto-removal behavior; include removed line names in the localized unavailable-items toast. Out-of-stock lines remain visible for manual removal. | Conflate a withdrawn product with a variant the shop still lists but cannot fill. |
| Shop refusal | Preserve the named lines in `CheckoutOutcome.contradicted` through `CheckoutResolution` and show their status and any short-fill amount on the pre-checkout page. | Depend on a later review alone to reconstruct which line the shop refused. |
| Data and API | Reuse the existing `ProductVariant` fields and cart-review path; add no endpoint or persistence. | Duplicate availability state in the storefront or persist a browse-time count. |

## Risks / Trade-offs

- [Stale catalog read] → the existing
  cart review remains the current source for corrections; browse availability
  does not promise a quantity.
- [Selection mismatch] → derive
  all purchase fields from the same selected `ProductVariant` object.
- [Other callers retain optional stock props] → the
  Grade10 listing and product-page compositions omit them, without changing the
  shared export contract.
- [A failed read may retain its prior query data] → gate displayed line
  availability, prices and totals on the current `CartReviewState`, not on
  cached presence alone.

## Open Questions

None.
