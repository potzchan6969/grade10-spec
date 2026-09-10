## User journeys

### grade10-admin-inventory-catalog-US-05: Inventory admin configures a localized product content type

**As an** inventory admin,
**I want** to define reusable fields and assign them to an exact IP, Item, and Category,
**so that** each product type has clear labels, structured values, and rules.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-69` — Operator defines a localized reusable field
- `grade10-admin-inventory-catalog-SC-70` — Invalid field definition is refused
- `grade10-admin-inventory-catalog-SC-72` — Operator configures a Pokémon TCG content type
- `grade10-admin-inventory-catalog-SC-73` — Duplicate published content type for exact tuple is refused

### grade10-admin-inventory-catalog-US-06: Inventory admin enters a validated product

**As an** inventory admin,
**I want** to save localized structured values and complete a product only when they are valid,
**so that** Auction receives products with trustworthy facts.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-52` — Operator marks a valid draft product created
- `grade10-admin-inventory-catalog-SC-74` — Product without a matching content type remains a draft
- `grade10-admin-inventory-catalog-SC-75` — Operator saves localized Pokémon TCG values
- `grade10-admin-inventory-catalog-SC-76` — Invalid structured value is refused
- `grade10-admin-inventory-catalog-SC-77` — Missing required value blocks creation
- `grade10-admin-inventory-catalog-SC-78` — Missing optional value remains valid
- `grade10-admin-inventory-catalog-SC-79` — A missing locale falls back to English

### grade10-admin-inventory-catalog-US-07: Collector finds and reads a card through Auction fields

**As a** collector,
**I want** to search, filter, and read card facts in my active locale,
**so that** I can find the right product and understand its identifying details.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-80` — Auction filters by universal and structured fields
- `grade10-admin-inventory-catalog-SC-81` — Missing optional value is excluded from its filter
- `grade10-admin-inventory-catalog-SC-82` — Auction-only label cannot be filtered
- `grade10-admin-inventory-catalog-SC-83` — Operator configures different Auction fields per content type
- `grade10-admin-inventory-catalog-SC-84` — Auction shows localized labels and values in configured order

### grade10-admin-inventory-catalog-US-08: Inventory admin publishes a safe content-type configuration

**As an** inventory admin,
**I want** to review the impact of a content-type change before publishing it,
**so that** the active Auction catalogue never knowingly uses invalid product data.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-71` — Missing non-English translations are reported without blocking publish
- `grade10-admin-inventory-catalog-SC-85` — Invalid existing product blocks content type publish
- `grade10-admin-inventory-catalog-SC-86` — Valid content type publishes atomically
- `grade10-admin-inventory-catalog-SC-87` — Legacy product without a matching content type stays visible but unavailable to Auction
