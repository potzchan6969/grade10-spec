## User journeys

### catalog-US-01: Record received stock

As an inventory admin, I want to create a product and intake quantity into its
inventory, so that the snapshot and derived lifetime ledger reflect what
Grade10 accepted.

Accepted by: catalog-SC-01, catalog-SC-05, catalog-SC-06, catalog-SC-07,
catalog-SC-52, catalog-SC-54.

### catalog-US-02: Oversee holds and settle them from holder apps

As an inventory admin, I want to see Auction and Vault holds with remaining
quantity on the product page, reserve house stock under `admin` holds, release
those admin holds when done, while adjust, release for Auction/Vault,
sell-from-reservation, change-product, and vault-from-reservation run from the
owning listing or Vault console, so that house stock is not over-promised and
settlement stays with the application that owns the hold.

Accepted by: catalog-SC-14, catalog-SC-17, catalog-SC-18, catalog-SC-22,
catalog-SC-35, catalog-SC-36, catalog-SC-37, catalog-SC-38, catalog-SC-47,
catalog-SC-48, catalog-SC-49, catalog-SC-50, catalog-SC-51, catalog-SC-53,
catalog-SC-59, catalog-SC-60, catalog-SC-63, catalog-SC-64, catalog-SC-65,
catalog-SC-67, catalog-SC-68.

### catalog-US-03: Use inventory through a holder-kind boundary

As a consuming application, I want to reserve, adjust, partially settle, and
release my quantity without seeing another kind's holds, so that I can safely
use my hold. Auction sells; Vault vaults.

Accepted by: catalog-SC-15, catalog-SC-16, catalog-SC-19, catalog-SC-20,
catalog-SC-21, catalog-SC-39, catalog-SC-40, catalog-SC-61, catalog-SC-62,
catalog-SC-66.

### catalog-US-04: Reconstruct stock changes

As an inventory admin, I want every stock and reservation transition recorded,
so that I can explain how the latest snapshot was reached.

Accepted by: catalog-SC-23, catalog-SC-24, catalog-SC-25, catalog-SC-26,
catalog-SC-27, catalog-SC-28, catalog-SC-41, catalog-SC-42, catalog-SC-43,
catalog-SC-44, catalog-SC-45.
