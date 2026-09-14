## User journeys

### grade10-admin-inventory-catalog-US-69: Operator records a received graded unit

**As an** inventory admin,
**I want** to record optional Cert IDs when I intake stock,
**so that** each numbered graded unit can be traced without preventing
unnumbered stock from entering inventory.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-71` — Inventory has no Cert ID records by default
- `grade10-admin-inventory-catalog-SC-72` — Intake records a Cert ID under its product
- `grade10-admin-inventory-catalog-SC-73` — Duplicate Cert ID is refused
- `grade10-admin-inventory-catalog-SC-74` — Unnumbered intake increases stock
- `grade10-admin-inventory-catalog-SC-75` — Multiple Cert IDs match intake quantity
- `grade10-admin-inventory-catalog-SC-76` — Too many Cert IDs refuse the intake

### grade10-admin-inventory-catalog-US-70: Operator configures the product identity and display

**As an** inventory admin,
**I want** products to use IP, Category, and Item while choosing whether Cert
ID appears in displayed attributes,
**so that** product facts stay structured and each Auction presentation shows
only the fields I choose.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-69` — Product form shows the complete hierarchy
- `grade10-admin-inventory-catalog-SC-70` — Product contract has no legacy identity fields
- `grade10-admin-inventory-catalog-SC-77` — Admin adds Cert ID to displayed attributes
- `grade10-admin-inventory-catalog-SC-78` — Admin hides Cert ID without changing attributes
- `grade10-admin-inventory-catalog-SC-79` — Displayed Cert ID resolves the selected unit
- `grade10-admin-inventory-catalog-SC-80` — No Cert ID contributes no displayed value

### grade10-admin-inventory-catalog-US-71: Holder reserves a specific inventory unit

**As an** inventory admin,
**I want** to choose a specific Cert ID or explicitly choose `No Cert ID` when
I reserve stock,
**so that** every reservation identifies whether it owns a physical numbered
unit or only aggregate stock.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-81` — Reservation selects a Cert ID
- `grade10-admin-inventory-catalog-SC-82` — Reservation selects No Cert ID
- `grade10-admin-inventory-catalog-SC-83` — Reservation without a unit choice is refused
