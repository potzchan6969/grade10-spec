## User journeys

### grade10-admin-inventory-catalog-US-69: Operator records a received graded unit

**As an** inventory admin,
**I want** to record optional Cert IDs when I intake stock,
**so that** each numbered graded unit can be traced without preventing
unnumbered stock from entering inventory.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-95` — Inventory has no Cert ID records by default
- `grade10-admin-inventory-catalog-SC-96` — Intake records a Cert ID under its product
- `grade10-admin-inventory-catalog-SC-97` — Duplicate Cert ID is refused
- `grade10-admin-inventory-catalog-SC-98` — Unnumbered intake increases stock
- `grade10-admin-inventory-catalog-SC-99` — Multiple Cert IDs match intake quantity
- `grade10-admin-inventory-catalog-SC-100` — Too many Cert IDs refuse the intake

### grade10-admin-inventory-catalog-US-70: Operator configures the product identity and display

**As an** inventory admin,
**I want** products to use IP, Category, and Item while choosing whether Cert
ID appears in displayed attributes,
**so that** product facts stay structured and each Auction presentation shows
only the fields I choose.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-93` — Product form shows the complete hierarchy
- `grade10-admin-inventory-catalog-SC-94` — Product contract has no legacy identity fields
- `grade10-admin-inventory-catalog-SC-101` — Admin adds Cert ID to displayed attributes
- `grade10-admin-inventory-catalog-SC-102` — Admin hides Cert ID without changing attributes
- `grade10-admin-inventory-catalog-SC-103` — Displayed Cert ID resolves the selected unit
- `grade10-admin-inventory-catalog-SC-104` — No Cert ID contributes no displayed value

### grade10-admin-inventory-catalog-US-71: Holder reserves a specific inventory unit

**As an** inventory admin,
**I want** to choose a specific Cert ID or explicitly choose `No Cert ID` when
I reserve stock,
**so that** every reservation identifies whether it owns a physical numbered
unit or only aggregate stock.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-105` — Reservation selects a Cert ID
- `grade10-admin-inventory-catalog-SC-106` — Reservation selects No Cert ID
- `grade10-admin-inventory-catalog-SC-107` — Reservation without a unit choice is refused

### grade10-admin-inventory-catalog-US-72: Operator configures card schemas and imports products

**As an** inventory admin,
**I want** to define card schemas from one shared template and upload
product rows separately from stock, then mark valid products created,
**so that** every product has a mapped identity and valid structured facts before inventory is added.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-108` — Shared card template defines product facts
- `grade10-admin-inventory-catalog-SC-109` — Source classification maps to existing tags
- `grade10-admin-inventory-catalog-SC-110` — Schema manifest imports as drafts
- `grade10-admin-inventory-catalog-SC-111` — Invalid schema manifest creates no revisions
- `grade10-admin-inventory-catalog-SC-112` — Product upload creates one draft per identity
- `grade10-admin-inventory-catalog-SC-113` — Product upload refuses incomplete rows atomically
- `grade10-admin-inventory-catalog-SC-114` — Same name keeps distinct card identities
- `grade10-admin-inventory-catalog-SC-115` — Mapped values trim and omit blank placeholders

### grade10-admin-inventory-catalog-US-73: Operator bulk imports matched inventory units

**As an** inventory admin,
**I want** to upload physical copy rows against existing products,
**so that** inventory counts and copy-level facts are recorded together after I review the matches.

**Accepted by:**

- `grade10-admin-inventory-catalog-SC-116` — Inventory upload previews matched copy facts
- `grade10-admin-inventory-catalog-SC-117` — Blank status requires per-row choice and RAW has no Cert ID
- `grade10-admin-inventory-catalog-SC-118` — Missing or ambiguous product match blocks import
- `grade10-admin-inventory-catalog-SC-119` — Duplicate Cert ID blocks the whole upload
- `grade10-admin-inventory-catalog-SC-120` — Invalid inventory row leaves every unit unchanged
- `grade10-admin-inventory-catalog-SC-121` — Copy facts trim and omit blank placeholders
- `grade10-admin-inventory-catalog-SC-122` — Graded rows require Cert ID and RAW rows forbid it
