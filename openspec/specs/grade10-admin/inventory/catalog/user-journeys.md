## User journeys

### grade10-admin-inventory-catalog-US-01: Record received stock

**As an** inventory admin,
**I want** to create a product and intake quantity into its inventory,
**so that** the snapshot and derived lifetime ledger reflect what Grade10 accepted.

### grade10-admin-inventory-catalog-US-02: Oversee holds and settle them from holder apps

**As an** inventory admin,
**I want** to see Auction and Vault holds with remaining quantity on the product page, reserve house stock under `admin` holds, release those admin holds when done, while adjust, release for Auction/Vault, sell-from-reservation, change-product, and vault-from-reservation run from the owning listing or Vault console,
**so that** house stock is not over-promised and settlement stays with the application that owns the hold.

### grade10-admin-inventory-catalog-US-03: Auction operator holds stock the vault cannot touch

**As an** auction operator reserving house stock against a listing,
**I want** to reserve, adjust, partially sell, and release only Auction's own hold, with the vault's holds on that product invisible to me and mine to it,
**so that** both draw on one product's stock without either spending what the other reserved. Auction sells; Vault vaults.

### grade10-admin-inventory-catalog-US-04: Reconstruct stock changes

**As an** inventory admin,
**I want** every stock and reservation transition recorded,
**so that** I can explain how the latest snapshot was reached.
