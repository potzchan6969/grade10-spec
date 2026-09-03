## User journeys

### card-price-US-01: Inventory admin classifies a card product

**As an** inventory admin,
**I want** to create or edit a collectible-card product with its required tags
and a confirmed PriceCharting match,
**so that** the catalogue identifies the card consistently and can retrieve the
right price reference.

**Accepted by:**

- `card-price-SC-01` — Operator creates a tagged Collectible Card
- `card-price-SC-02` — Product missing a required tag role is refused
- `card-price-SC-03` — Operator confirms a PriceCharting search match
- `card-price-SC-04` — Non-card product cannot attach PriceCharting

### card-price-US-02: Inventory admin reads a current card reference

**As an** inventory admin,
**I want** to see the current PSA-focused PriceCharting reference and its
freshness,
**so that** I can use an attributable market signal without mistaking it for
permanent product value or PSA certification data.

**Accepted by:**

- `card-price-SC-05` — Operator reads a fresh PSA-focused price reference
- `card-price-SC-06` — Expired regular cache refreshes before display
- `card-price-SC-07` — Failed refresh preserves and labels stale data
- `card-price-SC-08` — Active auction requests shorter refresh eligibility

### card-price-US-03: Inventory admin imports card products

**As an** inventory admin,
**I want** to preview and confirm a CSV of classified card products,
**so that** I can add a large collection without creating partial or
misidentified catalogue data.

**Accepted by:**

- `card-price-SC-10` — Operator previews a valid card CSV
- `card-price-SC-11` — Invalid CSV row blocks confirmation
- `card-price-SC-12` — Operator confirms every PriceCharting match
- `card-price-SC-13` — Import commits every reviewed row atomically
