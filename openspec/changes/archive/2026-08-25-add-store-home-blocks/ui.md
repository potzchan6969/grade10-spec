# UI: store home blocks

## Figma

- [Store page `4171:9023`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9023)
- [Hero Section `4171:9051`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9051)
- [Collections Header `4195:1048`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1048)
- [Collection Cards `4195:1050`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4195-1050)

## Exports

| Component | Package | Notes |
| --- | --- | --- |
| `StoreHomeHero` | `@grade10/ui` | Marketing hero with two gated CTAs |
| `StoreSectionHeader` | `@grade10/ui` | Title + optional browse-all link |
| `StoreCollectionTile` | `@grade10/ui` | Single bento collection cell |
| `StoreCollectionGrid` | `@grade10/ui` | Five-column bento of tiles |

## Page assembly (preview only)

| Surface | Location |
| --- | --- |
| Store Home page story | `apps/preview/src/pages/store-home-page.stories.tsx` |

Reuses `ProductCard` from `shared/ui/store-product-listing` for the product
row — not a new export.

## Contract checks

| Check | How |
| --- | --- |
| Exports resolve | Import each name from `@grade10/ui` in preview |
| Hero gates controls | Story with one callback omits the other button |
| Section header omits link | Story without `browseAllHref` |
| Featured bento span | Grid story with one featured tile |
| No default copy | TypeScript required props on all copy fields |
