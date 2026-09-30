**Author:** @tangconst - 2026-09-21

Product context: [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup).

## Why

A winner adding a delivery address on Winner Order setup meets a short,
designated country or region list. Collectors shipping outside that sample
cannot name where the lot should go, and a long list without search leaves
the match hard to find in the nested dialog — letter typeahead on Select is
poorly usable on phones.

**Metric:** share of delivery Add Address opens where Country/Region offers a
complete A–Z catalogue and typing filters the list to matching names
(target: 100% of those opens).

## What Changes

- **Delivery Add Address lists every country and region A–Z** on Winner Order
  setup — no short designated set.
- **Searchable Autocomplete** — Country/Region is a filter-as-you-type field;
  typing narrows the list to matching names. **BREAKING** vs letter typeahead
  on Select (prior non-goal reversed after mobile review).
- **Field reads Country/Region** — matching the manual's wording.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — delivery address country or region
  picker is a complete catalogue with searchable Autocomplete.

## Impact

- Winner Order Complete Order Setup preview under `apps/preview` (delivery Add
  Address Autocomplete).
- Design-system `Autocomplete` for filter-as-you-type on long country lists.
- Catalogue acquisition (owned ISO, package, or crawl from grade10-admin) is
  engineering's — recorded in `tech-design.md` when planned, not in the
  requirement text.
- Consuming `grade10-site` wiring follows the submodule bump; no new
  `@grade10/ui` export required for the picker itself.

## Open Questions

- **Billing country or region list** — whether billing Add Address uses the
  same full list and searchable field as delivery; Product (@tangconst).
- **Shippable destinations only** — whether the picker later limits to
  destinations Grade10 ships to; until settled the catalogue stays complete;
  Product (@tangconst).
- **Catalogue display locale** — whether delivery Add Address Country/Region
  names follow browser locale, account language, or fixed English; Product
  (@tangconst). Blind suite escalate 2026-09-21.

No domain impact: Country/Region picker behaviour stays inside Winner Order
delivery Add Address; no cross-capability auction path changes.

**Archive:** @tangconst after deploy.

## References

- [Post-Bidding · Order Setup](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-setup)
