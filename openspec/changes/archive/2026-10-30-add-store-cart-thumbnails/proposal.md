**Author:** @kinisworking - 2026-10-13

## Why

Collectors see blank picture boxes in the cart drawer even when the collection shows pictures for those products. The reported Gengar VMAX and booster-box lines need current pictures so a collector can recognise each line before checkout.

**Metric:** share of reviewed cart lines with a catalogue picture whose matching thumbnail loads in the drawer. The seeded browser regression requires every such line to load.

## What Changes

- Show each retained cart line's first current product picture from the existing live review, matching the collection card.
- Keep the existing picture placeholder, item-name alt fallback, cart amounts and readiness when picture data is absent.
- Carry optional picture facts through reviewed-line responses and the existing shared cart item props without storing them in cart intent.
- Add controlled shared picture stories and application regression coverage.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/store/cart-drawer` - current product pictures in the Grade10 drawer's reviewed cart lines.

### Modified Capabilities

- `shared/ui/store-cart` - supplied picture props, alt fallback and placeholder in existing shared cart parts.

## Impact

- Grade10's existing Shopify variant batch, review response contracts, serializers, fixtures and drawer display join.
- Grade10-spec's shared cart stories, controlled assets and product-picture record.
- No database migration, production dependency, shared layout change or new product request per line.

No domain impact: pictures enrich the existing cart review; this change adds no cross-feature Store path.

## References

- [Approved Thumbnail Brief](../../../docs/references/store-cart-thumbnails.md)
- [Cart Drawer](../../../docs/prds/products/grade10-site/store/cart.md#reviewing-the-cart)
- [Shared Cart](../../../docs/prds/products/shared/ui/store-cart.md#product-pictures)
