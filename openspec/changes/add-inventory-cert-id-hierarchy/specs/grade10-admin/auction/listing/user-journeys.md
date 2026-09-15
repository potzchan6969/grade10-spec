## User journeys

### grade10-admin-auction-listing-US-70: Operator attaches one inventory unit to a listing

**As an** auction operator,
**I want** to choose a specific Cert ID or `No Cert ID` for the product I am
listing,
**so that** the listing identifies the physical unit it will sell without
blocking unnumbered stock.

**Accepted by:**

- `grade10-admin-auction-listing-SC-70` — Product with Cert IDs offers an explicit choice
- `grade10-admin-auction-listing-SC-71` — Product without Cert IDs offers No Cert ID
- `grade10-admin-auction-listing-SC-72` — Changing products clears the prior unit choice
- `grade10-admin-auction-listing-SC-73` — Wrong-product Cert ID is refused
- `grade10-admin-auction-listing-SC-74` — A Cert ID cannot be held twice
- `grade10-admin-auction-listing-SC-75` — No Cert ID uses aggregate reservation

### grade10-admin-auction-listing-US-71: Operator creates and presents the selected unit

**As an** auction operator,
**I want** create to verify the inventory unit I saved and the listing to show
its configured identity,
**so that** a created lot cannot drift from the unit I intended to sell.

**Accepted by:**

- `grade10-admin-auction-listing-SC-76` — Create succeeds with a saved Cert ID hold
- `grade10-admin-auction-listing-SC-77` — Create succeeds with No Cert ID
- `grade10-admin-auction-listing-SC-78` — Create without an explicit unit choice is refused
- `grade10-admin-auction-listing-SC-79` — Public listing displays selected Cert ID
- `grade10-admin-auction-listing-SC-80` — Public listing hides No Cert ID
