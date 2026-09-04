## User journeys

### grade10-admin-auction-listing-US-01: Operator saves an unfinished listing and comes back to it

**As an** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

**Accepted by:**

- `grade10-admin-auction-listing-SC-01` — Operator saves an empty draft
- `grade10-admin-auction-listing-SC-02` — Operator saves a partial draft
- `grade10-admin-auction-listing-SC-03` — Draft rejects a malformed price
- `grade10-admin-auction-listing-SC-04` — Draft rejects a malformed slug
- `grade10-admin-auction-listing-SC-05` — Unauthorized draft save is refused

### grade10-admin-auction-listing-US-02: Operator puts a gallery on a listing

**As an** auction operator,
**I want** to attach, order, and replace the photographs and video of a card,
**so that** a collector judges the item from the images without asking me for more.

**Accepted by:**

- `grade10-admin-auction-listing-SC-46` — Operator uploads an eighth file
- `grade10-admin-auction-listing-SC-47` — A ninth file is refused
- `grade10-admin-auction-listing-SC-48` — Mixed images and videos are accepted
- `grade10-admin-auction-listing-SC-49` — Upload is stored without processing
- `grade10-admin-auction-listing-SC-50` — Unsupported type is refused
- `grade10-admin-auction-listing-SC-51` — File over 100 mebibytes is refused
- `grade10-admin-auction-listing-SC-53` — Operator reorders and removes media
- `grade10-admin-auction-listing-SC-54` — Last media item cannot be removed after create

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

### grade10-admin-auction-listing-US-04: Operator puts a listing in front of collectors

**As an** auction operator,
**I want** to publish a listing now or at a time I set in advance,
**so that** a lot opens at the hour the sale was announced for and reads at its own public address from then on.

**Accepted by:**

- `grade10-admin-auction-listing-SC-13` — Operator updates copy on a published listing
- `grade10-admin-auction-listing-SC-16` — Collector opens a listing by slug
- `grade10-admin-auction-listing-SC-17` — Unknown slug is not found
- `grade10-admin-auction-listing-SC-23` — Published slug cannot change
- `grade10-admin-auction-listing-SC-25` — Published listing refuses a price change
- `grade10-admin-auction-listing-SC-29` — Operator publishes a created listing immediately
- `grade10-admin-auction-listing-SC-30` — Created listing publishes at the scheduled time
- `grade10-admin-auction-listing-SC-31` — A publish at in the past is refused
- `grade10-admin-auction-listing-SC-32` — Create with a past publish at is refused
- `grade10-admin-auction-listing-SC-33` — Draft is not published when publish at arrives
- `grade10-admin-auction-listing-SC-34` — Manual publish of a draft is refused
- `grade10-admin-auction-listing-SC-35` — Publish at cannot change after publish
- `grade10-admin-auction-listing-SC-52` — First item is the catalogue card

### grade10-admin-auction-listing-US-05: Operator calls a listing off before it closes

**As an** auction operator,
**I want** to withdraw a lot at any point up to its close,
**so that** a consignor who pulls out or a card that fails authentication leaves the sale cleanly.

**Accepted by:**

- `grade10-admin-auction-listing-SC-36` — Operator calls off a draft
- `grade10-admin-auction-listing-SC-37` — Operator calls off a created listing before publish at
- `grade10-admin-auction-listing-SC-38` — Operator calls off a published listing that has bids
- `grade10-admin-auction-listing-SC-39` — Closed listing cannot be called off
- `grade10-admin-auction-listing-SC-40` — Settled listing cannot be called off
- `grade10-admin-auction-listing-SC-41` — Already canceled listing cannot be called off again
- `grade10-admin-auction-listing-SC-42` — Cancel rewrites the slug and frees the original
- `grade10-admin-auction-listing-SC-43` — Cancel of a draft with no slug does not invent one
- `grade10-admin-auction-listing-SC-44` — Unauthorized cancel is refused
- `grade10-admin-auction-listing-SC-45` — Closed listing rejects a title edit
- `grade10-admin-auction-listing-SC-55` — Closed listing rejects a media upload

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
