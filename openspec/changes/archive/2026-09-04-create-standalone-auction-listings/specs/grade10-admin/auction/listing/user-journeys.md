## User journeys

### grade10-admin-auction-listing-US-06: Operator creates and publishes a listing with no campaign

**As an** auction operator,
**I want** to start a listing from the Listings section without picking a
campaign,
**so that** a one-off lot can go live without inventing a cover I do not need.

**Accepted by:**

- `grade10-admin-auction-listing-SC-68` — Create listing is offered on the Listings section
- `grade10-admin-auction-listing-SC-69` — Listing editor opens with no campaign selected
- `grade10-admin-auction-listing-SC-58` — Draft saves with the campaign left empty
- `grade10-admin-auction-listing-SC-59` — Listing creates with no campaign
- `grade10-admin-auction-listing-SC-60` — Listing publishes with no campaign
- `grade10-admin-auction-listing-SC-61` — Collector opens the published listing by slug
- `grade10-admin-auction-listing-SC-62` — Listings table shows an unattached listing
- `grade10-admin-auction-listing-SC-63` — Create listing is not offered to an unauthorized operator

### grade10-admin-auction-listing-US-07: Developer seeds and drops standalone fixture listings

**As a** developer running the auction service locally,
**I want** to seed fixture listings with no campaign from the Test panel,
**so that** I can test the standalone listing lifecycle without a campaign
cover.

**Accepted by:**

- `grade10-admin-auction-listing-SC-64` — Listings tab is present in the Test panel
- `grade10-admin-auction-listing-SC-65` — Developer seeds fixture listings with no campaign
- `grade10-admin-auction-listing-SC-66` — Seeded standalone listings appear in the Listings section with no campaign
- `grade10-admin-auction-listing-SC-67` — Developer drops standalone fixture listings
