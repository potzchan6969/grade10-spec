## Screens

### Grade10 Store Product Detail — unknown product address

- [Product Detail Figma frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423&m=dev)
- [Storybook: Product Detail — Unknown Product Address](https://storybook.grade10-stg.com/?path=/story/store-product-page-screens-product-detail--unknown-product-address)

## Components

- `SiteHeader` from `@grade10/ui` and `Footer` from `@grade10/design-system` remain owned by the existing Store shell; the state does not duplicate or replace them.
- `Button` from `@grade10/design-system` supplies the `Browse the store` action used by the Storybook state.
- `@grade10/i18n` supplies the localized title, description and action words; no new shared UI export, primitive variant or token is required.

## States

### Grade10 Store Product Detail — unknown product address

| State | Shows | Anchor |
| --- | --- | --- |
| Unknown product address | The existing Store shell with the product-specific title, explanatory description and `Browse the store` action to the product listing; no product details, Add to cart control or related-product rail | `grade10-site-store-product-page-US-01` |
