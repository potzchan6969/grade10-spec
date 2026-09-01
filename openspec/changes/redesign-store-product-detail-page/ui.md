## Screens

### Grade10 Store Product Detail

[Figma frame: Product Detail — `4098:2423`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-2423&m=dev)

## Components

### Existing design-system exports

- `Nav`, `Footer` — application shell; the page does not duplicate them.
- `Breadcrumbs`, `BreadcrumbItem`, `BreadcrumbSeparator` — product location.
- `Badge` — non-interactive product facets.
- `Stepper` — quantity control.
- `Button` — add, loading, added, and sold-out states.
- `Link` — breadcrumb and shipping/pickup destinations where the application
  has a real target.
- `HStack`, `VStack` — page and detail-rail composition.

No new `@grade10/design-system` or `@grade10/ui` export, variant, or token is
required.

## States

| State | Spec scenario | Source of truth |
| --- | --- | --- |
| Product with two images, compare-at price, and low inventory | `product-page-SC-13` | Product catalogue response |
| Product with no images | `product-page-SC-14` | Product catalogue response |
| Product with optional badges and item facts | `product-page-SC-15` | Product catalogue response and locale catalog |
| Description collapsed / expanded | `product-page-SC-16` | Product page disclosure state |
| Add quantity pending / added | `product-page-SC-17` | Cart mutation and cart query |
| All variants sold out | `product-page-SC-18`, existing `product-page-SC-11` | Product availability |
| Unknown product address | Existing `product-page-SC-03` | Product loader and not-found surface |
