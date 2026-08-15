# shared-ui

Cross-product contracts for the shared UI component package (`packages/ui`).

Two capabilities are incoming, each carried by an active change and folded in
here when that change is archived:

- `shared-ui/component-package` — what the package is and what its components
  may do. Carried by
  [`reinstate-shared-ui-package`](../../changes/reinstate-shared-ui-package/proposal.md),
  and extended by
  [`store-product-listing-surface`](../../changes/store-product-listing-surface/proposal.md)
  with the rule against a shared component carrying one store's content.
- `shared-ui/store-product-listing` — the category-browsing surface both stores
  render. Carried by
  [`store-product-listing-surface`](../../changes/store-product-listing-surface/proposal.md).

Fold `reinstate-shared-ui-package` first: `store-product-listing-surface`
extends the capability it creates.
