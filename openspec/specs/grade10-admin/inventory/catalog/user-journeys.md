## User journeys

### grade10-admin-inventory-catalog-US-01: Record received stock

**As an** inventory admin,
**I want** to create a product and intake quantity into its inventory,
**so that** the snapshot and derived lifetime ledger reflect what Grade10 accepted.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-01` — Operator creates a draft product with empty inventory
- `grade10-admin-inventory-catalog-SC-05` — Operator intakes three
- `grade10-admin-inventory-catalog-SC-06` — Repeated intakes accumulate in one inventory
- `grade10-admin-inventory-catalog-SC-07` — Intake appends one quantity change
- `grade10-admin-inventory-catalog-SC-52` — Operator marks a draft product created
- `grade10-admin-inventory-catalog-SC-54` — Created to draft is refused

### grade10-admin-inventory-catalog-US-02: Oversee holds and settle them from holder apps

**As an** inventory admin,
**I want** to see Auction and Vault holds with remaining quantity on the product page, reserve house stock under `admin` holds, release those admin holds when done, while adjust, release for Auction/Vault, sell-from-reservation, change-product, and vault-from-reservation run from the owning listing or Vault console,
**so that** house stock is not over-promised and settlement stays with the application that owns the hold.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-14` — Auction reserves a quantity
- `grade10-admin-inventory-catalog-SC-17` — Auction and Vault reserve the same product
- `grade10-admin-inventory-catalog-SC-18` — Concurrent reservations cannot oversubscribe stock
- `grade10-admin-inventory-catalog-SC-22` — Vault releases a full remaining hold
- `grade10-admin-inventory-catalog-SC-35` — Partial release leaves remaining active
- `grade10-admin-inventory-catalog-SC-36` — Auction partially sells from a reservation
- `grade10-admin-inventory-catalog-SC-37` — Partial sell then release closes the reservation
- `grade10-admin-inventory-catalog-SC-38` — Vault partially vaults from a reservation
- `grade10-admin-inventory-catalog-SC-47` — Increase listing reservation 3 to 5 acquires more stock
- `grade10-admin-inventory-catalog-SC-48` — Decrease listing reservation 5 to 2 frees remaining
- `grade10-admin-inventory-catalog-SC-49` — Increase refused when not enough available stock
- `grade10-admin-inventory-catalog-SC-50` — Cannot adjust below sold plus vaulted plus released
- `grade10-admin-inventory-catalog-SC-51` — Listing product change moves hold in one transaction
- `grade10-admin-inventory-catalog-SC-53` — Reserve requires a created product
- `grade10-admin-inventory-catalog-SC-59` — Operator reserves admin hold from product page
- `grade10-admin-inventory-catalog-SC-60` — Operator releases admin hold from product page
- `grade10-admin-inventory-catalog-SC-63` — Product change refused when new product lacks stock
- `grade10-admin-inventory-catalog-SC-64` — Product change refused for draft target product
- `grade10-admin-inventory-catalog-SC-65` — Product change refused below settled floor
- `grade10-admin-inventory-catalog-SC-67` — Elevated admin reserve mints holder reference
- `grade10-admin-inventory-catalog-SC-68` — Product page release is limited to admin holds

### grade10-admin-inventory-catalog-US-03: Auction operator holds stock the vault cannot touch

**As an** auction operator reserving house stock against a listing,
**I want** to reserve, adjust, partially sell, and release only Auction's own hold, with the vault's holds on that product invisible to me and mine to it,
**so that** both draw on one product's stock without either spending what the other reserved. Auction sells; Vault vaults.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-15` — Same active reference retries idempotently
- `grade10-admin-inventory-catalog-SC-16` — Closed reference may reserve again
- `grade10-admin-inventory-catalog-SC-19` — Insufficient stock reserves nothing
- `grade10-admin-inventory-catalog-SC-20` — Vault cannot see Auction reservations
- `grade10-admin-inventory-catalog-SC-21` — Another kind cannot release a reservation
- `grade10-admin-inventory-catalog-SC-39` — Vault cannot sell from reservation
- `grade10-admin-inventory-catalog-SC-40` — Auction cannot vault from reservation
- `grade10-admin-inventory-catalog-SC-61` — Auction eligibility list omits draft and out-of-stock
- `grade10-admin-inventory-catalog-SC-62` — Eligibility available matches inventory available
- `grade10-admin-inventory-catalog-SC-66` — Own reservation counts toward effective available on edit

### grade10-admin-inventory-catalog-US-04: Reconstruct stock changes

**As an** inventory admin,
**I want** every stock and reservation transition recorded,
**so that** I can explain how the latest snapshot was reached.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-23` — Product update records operator and snapshots
- `grade10-admin-inventory-catalog-SC-24` — Intake history carries the added quantity
- `grade10-admin-inventory-catalog-SC-25` — Reserve history records hold and snapshot
- `grade10-admin-inventory-catalog-SC-26` — Release history records hold and snapshot
- `grade10-admin-inventory-catalog-SC-27` — Terminal history records action details
- `grade10-admin-inventory-catalog-SC-28` — Refused write leaves history unchanged
- `grade10-admin-inventory-catalog-SC-41` — Sell-from-reservation history
- `grade10-admin-inventory-catalog-SC-42` — Vault-from-reservation history
- `grade10-admin-inventory-catalog-SC-43` — Adjust history records new quantity
- `grade10-admin-inventory-catalog-SC-44` — Adjust decrease records freed quantity
- `grade10-admin-inventory-catalog-SC-45` — Change-product history records both inventories
