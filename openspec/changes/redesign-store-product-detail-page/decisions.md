## Goals

- Give collectors a media-led product detail page with the catalogue facts they need to consider a purchase.
- Let collectors add the product's one sellable item from its page, with a quantity control and an accessible description disclosure.

## Non-Goals

- New product routes, checkout flows, wishlist behavior, image zoom, or a lightbox.
- A product or inventory mirror in Postgres.
- Inventing product type, world, language, or dynamic shipping and pickup facts when the catalogue does not provide them; version 1 uses the approved static fulfilment copy for every product.
- New design-system components, variants, or tokens.
- Changes to the archived product-page routing, sitemap, or not-found behavior.
- Analytics instrumentation, including device-width segmentation. The current Product Viewed and Product Added event contract does not carry device width.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Does this change add device-width conversion tracking? | [Proposal's measure](proposal.md#why); 2026-11-02 closeout review | No; current events carry no device width ([Analytics contract](../../specs/grade10-site/analytics/analytics/spec.md), client event table, lines 504–509), so this change adds no tracking. The product-level add-rate outcome is recorded in [Product decisions](../../../docs/prds/products/grade10-site/store/product-page.md) at line 69. | Add a width property and tracking work to this change |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
