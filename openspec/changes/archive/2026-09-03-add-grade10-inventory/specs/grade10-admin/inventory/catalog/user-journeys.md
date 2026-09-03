## User journeys

### grade10-admin-inventory-catalog-US-01: Record received stock

As an inventory admin, I want to create a product and intake quantity into its
inventory, so that the snapshot and derived lifetime ledger reflect what
Grade10 accepted.

Accepted by: grade10-admin-inventory-catalog-SC-01, grade10-admin-inventory-catalog-SC-05, grade10-admin-inventory-catalog-SC-06, grade10-admin-inventory-catalog-SC-07,
grade10-admin-inventory-catalog-SC-52, grade10-admin-inventory-catalog-SC-54.

### grade10-admin-inventory-catalog-US-02: Oversee holds and settle them from holder apps

As an inventory admin, I want to see Auction and Vault holds with remaining
quantity on the product page, reserve house stock under `admin` holds, release
those admin holds when done, while adjust, release for Auction/Vault,
sell-from-reservation, change-product, and vault-from-reservation run from the
owning listing or Vault console, so that house stock is not over-promised and
settlement stays with the application that owns the hold.

Accepted by: grade10-admin-inventory-catalog-SC-14, grade10-admin-inventory-catalog-SC-17, grade10-admin-inventory-catalog-SC-18, grade10-admin-inventory-catalog-SC-22,
grade10-admin-inventory-catalog-SC-35, grade10-admin-inventory-catalog-SC-36, grade10-admin-inventory-catalog-SC-37, grade10-admin-inventory-catalog-SC-38, grade10-admin-inventory-catalog-SC-47,
grade10-admin-inventory-catalog-SC-48, grade10-admin-inventory-catalog-SC-49, grade10-admin-inventory-catalog-SC-50, grade10-admin-inventory-catalog-SC-51, grade10-admin-inventory-catalog-SC-53,
grade10-admin-inventory-catalog-SC-59, grade10-admin-inventory-catalog-SC-60, grade10-admin-inventory-catalog-SC-63, grade10-admin-inventory-catalog-SC-64, grade10-admin-inventory-catalog-SC-65,
grade10-admin-inventory-catalog-SC-67, grade10-admin-inventory-catalog-SC-68.

### grade10-admin-inventory-catalog-US-03: Use inventory through a holder-kind boundary

As a consuming application, I want to reserve, adjust, partially settle, and
release my quantity without seeing another kind's holds, so that I can safely
use my hold. Auction sells; Vault vaults.

Accepted by: grade10-admin-inventory-catalog-SC-15, grade10-admin-inventory-catalog-SC-16, grade10-admin-inventory-catalog-SC-19, grade10-admin-inventory-catalog-SC-20,
grade10-admin-inventory-catalog-SC-21, grade10-admin-inventory-catalog-SC-39, grade10-admin-inventory-catalog-SC-40, grade10-admin-inventory-catalog-SC-61, grade10-admin-inventory-catalog-SC-62,
grade10-admin-inventory-catalog-SC-66.

### grade10-admin-inventory-catalog-US-04: Reconstruct stock changes

As an inventory admin, I want every stock and reservation transition recorded,
so that I can explain how the latest snapshot was reached.

Accepted by: grade10-admin-inventory-catalog-SC-23, grade10-admin-inventory-catalog-SC-24, grade10-admin-inventory-catalog-SC-25, grade10-admin-inventory-catalog-SC-26,
grade10-admin-inventory-catalog-SC-27, grade10-admin-inventory-catalog-SC-28, grade10-admin-inventory-catalog-SC-41, grade10-admin-inventory-catalog-SC-42, grade10-admin-inventory-catalog-SC-43,
grade10-admin-inventory-catalog-SC-44, grade10-admin-inventory-catalog-SC-45.
