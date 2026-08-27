# shared-ui

Cross-product contracts for the shared UI component package (`packages/ui`),
which every store application consumes.

| Capability | What it governs |
| --- | --- |
| [`component-package`](component-package/spec.md) | What the package is: shipped once from here, consumed from source, app-neutral, built one way on the design system, and carrying no store's content as a default. |
| [`store-home`](store-home/spec.md) | The store landing surface between site chrome and a product row — marketing hero, titled section header with a browse-all link, and a bento grid of collection tiles — and its export contract. |
| [`store-cart`](store-cart/spec.md) | The shopping cart drawer surface between slide-out overlay and checkout CTA — item list, minimum 5-row baseline, promo code redemption, and order summary — and its export contract. |
| [`auth-user-directory`](auth-user-directory/spec.md) | The operator's view of the identity directory — the account table, and the roles, moderation and sessions confirmations — and its export contract. |
| [`store-product-listing`](store-product-listing/spec.md) | The product-browsing surface — sidebar search and world/type filters, result header with applied filters and sort, product grid, pagination — and its export contract. |

A capability's OpenSpec ID is `shared-ui/<capability>`. Add one when a shared
component set has a contract not already covered here, and add it as a change
under `openspec/changes/` rather than directly.
