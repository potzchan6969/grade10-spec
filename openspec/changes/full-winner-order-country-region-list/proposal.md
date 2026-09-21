**Author:** @tangconst - 2026-09-21

Product context: [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup).

## Why

A winner adding a delivery address on Winner Order setup meets a short,
designated country or region list. Collectors shipping outside that sample
cannot name where the lot should go, and a long list without letter jump and
scroll leaves the match off-screen in the nested dialog.

**Metric:** share of delivery Add Address opens where Country/Region offers a
complete A–Z catalogue and a typed letter scrolls the highlighted match into
the popup (target: 100% of those opens).

## What Changes

- **Delivery Add Address lists every country and region A–Z** on Winner Order
  setup — no short designated set.
- **Letter typeahead** — any typed letter moves the highlight to the next name
  that starts with it; the popup scrolls that name into view.
- **Field reads Country/Region** — matching the manual's wording.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — delivery address country or region
  picker is a complete catalogue with letter typeahead and scroll-into-view.

## Impact

- Winner Order Complete Order Setup preview under `apps/preview` (delivery Add
  Address select).
- Design-system `Select` scroll-into-view for typeahead on long lists.
- Catalogue acquisition (owned ISO, package, or crawl from grade10-admin) is
  engineering's — recorded in `tech-design.md` when planned, not in the
  requirement text.
- Consuming `grade10-site` wiring follows the submodule bump; no new
  `@grade10/ui` export required for the picker itself.

## Open Questions

- **Billing country or region list** — whether billing Add Address uses the
  same full list and typeahead as delivery; Product (@tangconst).
- **Shippable destinations only** — whether the picker later limits to
  destinations Grade10 ships to; until settled the catalogue stays complete;
  Product (@tangconst).

## References

- [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup)
