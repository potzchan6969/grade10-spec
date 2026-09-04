## Screens

**No Figma frame exists for the inventory admin.** The existing Inventory
product editor is the layout source until a designer supplies one; this change
extends that route and adds no public or collector-facing surface. Behavior:
[card-price-reference spec](specs/grade10-admin/inventory/card-price-reference/spec.md).

### Product create and edit

Route: Grade10 admin Inventory product detail / create. Adds collectible type,
the three required controlled-tag inputs, PriceCharting link entry, provider-result
confirmation, and the current price-reference section.

### Current price reference

Lives on the same product detail surface. It shows source, successful update
time, fresh/stale/unavailable state, ungraded baseline, and supplied
PSA-oriented grades. It does not show PSA population, certificate facts,
other graders, or a history chart.

### Bulk card import

Route: Inventory product list. The operator uploads the prescribed CSV, reads
the row preview and validation results, confirms every candidate, then commits
the complete batch from the same import surface.

## Components

Existing `@grade10/frontend-console` exports:

- Product fields and link entry: `TextField` and `Button`.
- Confirmation: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`,
  `DialogTitle`, `DialogBody`, `DialogFooter`, and `DialogClose`.
- Current prices: `Table`, `Row`, `Cell`, `Text`, `Badge`, `StatusBadge`,
  `Inline`, and `Stack`.

App-local composition in `@grade10/inventory-admin-frontend`:

- Classification field: searches/reuses an inline-created tag and displays the
  selected IP, Item, and Category labels.
- PriceCharting match dialog: separates pasted-link search from the explicit
  candidate selection.
- Price reference panel: formats USD minor units and freshness without owning
  provider or cache state.
- Bulk import dialog: selects the CSV, renders per-row validation/candidate
  state, and gates the single commit action on complete confirmation.

No new `@grade10/ui` or design-system export is required.

## States

### Product classification and matching

- **Required taxonomy** — grade10-admin-inventory-card-price-reference-SC-01 and grade10-admin-inventory-card-price-reference-SC-02.
- **Reusable inline tag** — grade10-admin-inventory-card-price-reference-SC-09.
- **Match candidate selection** — grade10-admin-inventory-card-price-reference-SC-03.
- **Unsupported product type** — grade10-admin-inventory-card-price-reference-SC-04.

### Current price reference

- **Fresh result** — grade10-admin-inventory-card-price-reference-SC-05.
- **Refresh in progress** — grade10-admin-inventory-card-price-reference-SC-06.
- **Stale fallback** — grade10-admin-inventory-card-price-reference-SC-07.
- **Unavailable** — grade10-admin-inventory-card-price-reference-SC-07 when no successful cached result exists.
- **Auction refresh request** — grade10-admin-inventory-card-price-reference-SC-08; this is background state,
  not a separate operator control.

### Bulk card import

- **Valid preview** — grade10-admin-inventory-card-price-reference-SC-10.
- **Row validation failure** — grade10-admin-inventory-card-price-reference-SC-11.
- **Candidate confirmation** — grade10-admin-inventory-card-price-reference-SC-12.
- **Atomic completion or refusal** — grade10-admin-inventory-card-price-reference-SC-13.
