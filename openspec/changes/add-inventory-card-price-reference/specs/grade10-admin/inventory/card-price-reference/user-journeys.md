## User journeys

### grade10-admin-inventory-card-price-reference-US-01: Inventory admin classifies a card product

**As an** inventory admin,
**I want** to create or edit a collectible-card product with its required tags
and a confirmed PriceCharting match,
**so that** the catalogue identifies the card consistently and can retrieve the
right price reference.

**Accepted by:**

- `grade10-admin-inventory-card-price-reference-SC-01` — Operator creates a tagged Collectible Card
- `grade10-admin-inventory-card-price-reference-SC-02` — Product missing a required tag role is refused
- `grade10-admin-inventory-card-price-reference-SC-03` — Operator confirms a PriceCharting search match
- `grade10-admin-inventory-card-price-reference-SC-04` — Non-card product cannot attach PriceCharting

### grade10-admin-inventory-card-price-reference-US-02: Inventory admin reads a current card reference

**As an** inventory admin,
**I want** to see the current PSA-focused PriceCharting reference and its
freshness,
**so that** I can use an attributable market signal without mistaking it for
permanent product value or PSA certification data.

**Accepted by:**

- `grade10-admin-inventory-card-price-reference-SC-05` — Operator reads a fresh PSA-focused price reference
- `grade10-admin-inventory-card-price-reference-SC-06` — Expired regular cache refreshes before display
- `grade10-admin-inventory-card-price-reference-SC-07` — Failed refresh preserves and labels stale data
- `grade10-admin-inventory-card-price-reference-SC-08` — Active auction requests shorter refresh eligibility

### grade10-admin-inventory-card-price-reference-US-03: Inventory admin imports card products

**As an** inventory admin,
**I want** to preview and confirm a CSV of classified card products,
**so that** I can add a large collection without creating partial or
misidentified catalogue data.

**Accepted by:**

- `grade10-admin-inventory-card-price-reference-SC-10` — Operator previews a valid card CSV
- `grade10-admin-inventory-card-price-reference-SC-11` — Invalid CSV row blocks confirmation
- `grade10-admin-inventory-card-price-reference-SC-12` — Operator confirms every PriceCharting match
- `grade10-admin-inventory-card-price-reference-SC-13` — Import commits every reviewed row atomically
