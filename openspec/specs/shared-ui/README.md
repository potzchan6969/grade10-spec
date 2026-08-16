# shared-ui

Cross-product contracts for the shared UI component package (`packages/ui`),
which every store application consumes.

| Capability | What it governs |
| --- | --- |
| [`component-package`](component-package/spec.md) | What the package is: shipped once from here, consumed from source, app-neutral, built one way on the design system, and carrying no store's content as a default. |
| [`store-product-listing`](store-product-listing/spec.md) | The category-browsing surface — filter panel, result count and sort, product grid, pagination — and its export contract. |

A capability's OpenSpec ID is `shared-ui/<capability>`. Add one when a shared
component set has a contract not already covered here, and add it as a change
under `openspec/changes/` rather than directly.
