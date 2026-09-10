## User journeys

### grade10-admin-auction-listing-US-03: Operator creates a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

**Accepted by:**

- `grade10-admin-auction-listing-SC-06` — Operator creates a filled draft
- `grade10-admin-auction-listing-SC-07` — Create without a title is refused on the form and the API
- `grade10-admin-auction-listing-SC-08` — Create without a slug is refused
- `grade10-admin-auction-listing-SC-09` — Create without a starting price is refused
- `grade10-admin-auction-listing-SC-10` — Create without media is refused
- `grade10-admin-auction-listing-SC-11` — Created listing cannot clear a required field
- `grade10-admin-auction-listing-SC-12` — Create of a published listing is refused
- `grade10-admin-auction-listing-SC-14` — Two categories from one taxonomy are refused
- `grade10-admin-auction-listing-SC-15` — Canceled sale cannot receive a listing
- `grade10-admin-auction-listing-SC-18` — Duplicate slug is refused
- `grade10-admin-auction-listing-SC-19` — Two drafts cannot share a slug
- `grade10-admin-auction-listing-SC-20` — Empty slugs on drafts are not a collision
- `grade10-admin-auction-listing-SC-21` — Create can reuse a canceled listing's original slug
- `grade10-admin-auction-listing-SC-22` — Create cannot reuse a closed listing's slug
- `grade10-admin-auction-listing-SC-24` — Operator corrects a created listing's starting price
- `grade10-admin-auction-listing-SC-26` — Scheduled close at in the past is refused at create
- `grade10-admin-auction-listing-SC-27` — Extension window without a duration is refused
- `grade10-admin-auction-listing-SC-27a` — Omitted extension fields default to 30 minutes
- `grade10-admin-auction-listing-SC-28` — Sandbox cannot change after create
- `grade10-admin-auction-listing-SC-70` — A negative extension duration is refused
