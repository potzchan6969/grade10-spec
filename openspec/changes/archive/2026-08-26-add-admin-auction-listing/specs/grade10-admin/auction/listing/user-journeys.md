## User journeys

### admin-listing-US-01: Save an unfinished listing and come back to it

**As an** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the
rest arrives.

**Accepted by:**

- `admin-listing-SC-01` — Operator saves an empty draft
- `admin-listing-SC-02` — Operator saves a partial draft
- `admin-listing-SC-03` — Draft rejects a malformed price
- `admin-listing-SC-04` — Draft rejects a malformed slug
- `admin-listing-SC-05` — Unauthorized draft save is refused

### admin-listing-US-02: Put a gallery on a listing

**As an** auction operator,
**I want** to attach, order, and replace the photographs and video of a card,
**so that** a collector judges the item from the images without asking me
for more.

**Accepted by:**

- `admin-listing-SC-46` — Operator uploads an eighth file
- `admin-listing-SC-47` — A ninth file is refused
- `admin-listing-SC-48` — Mixed images and videos are accepted
- `admin-listing-SC-49` — Upload is stored without processing
- `admin-listing-SC-50` — Unsupported type is refused
- `admin-listing-SC-51` — File over 100 mebibytes is refused
- `admin-listing-SC-53` — Operator reorders and removes media
- `admin-listing-SC-54` — Last media item cannot be removed after create

### admin-listing-US-03: Create a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs — its
title, its address, its prices, and its window — at the moment I create it,
**so that** nothing incomplete can reach a bidder.

**Accepted by:**

- `admin-listing-SC-06` — Operator creates a filled draft
- `admin-listing-SC-07` — Create without a title is refused on the form and the API
- `admin-listing-SC-08` — Create without a slug is refused
- `admin-listing-SC-09` — Create without a starting price is refused
- `admin-listing-SC-10` — Create without media is refused
- `admin-listing-SC-11` — Created listing cannot clear a required field
- `admin-listing-SC-12` — Create of a published listing is refused
- `admin-listing-SC-14` — Two categories from one taxonomy are refused
- `admin-listing-SC-15` — Canceled sale cannot receive a listing
- `admin-listing-SC-18` — Duplicate slug is refused
- `admin-listing-SC-19` — Two drafts cannot share a slug
- `admin-listing-SC-20` — Empty slugs on drafts are not a collision
- `admin-listing-SC-21` — Create can reuse a canceled listing's original slug
- `admin-listing-SC-22` — Create cannot reuse a closed listing's slug
- `admin-listing-SC-24` — Operator corrects a created listing's starting price
- `admin-listing-SC-26` — Scheduled close at in the past is refused at create
- `admin-listing-SC-27` — Extension window without a duration is refused
- `admin-listing-SC-28` — Sandbox cannot change after create

### admin-listing-US-04: Put a listing in front of collectors

**As an** auction operator,
**I want** to publish a listing now or at a time I set in advance,
**so that** a lot opens at the hour the sale was announced for and reads at
its own public address from then on.

**Accepted by:**

- `admin-listing-SC-13` — Operator updates copy on a published listing
- `admin-listing-SC-16` — Collector opens a listing by slug
- `admin-listing-SC-17` — Unknown slug is not found
- `admin-listing-SC-23` — Published slug cannot change
- `admin-listing-SC-25` — Published listing refuses a price change
- `admin-listing-SC-29` — Operator publishes a created listing immediately
- `admin-listing-SC-30` — Created listing publishes at the scheduled time
- `admin-listing-SC-31` — A publish at in the past is refused
- `admin-listing-SC-32` — Create with a past publish at is refused
- `admin-listing-SC-33` — Draft is not published when publish at arrives
- `admin-listing-SC-34` — Manual publish of a draft is refused
- `admin-listing-SC-35` — Publish at cannot change after publish
- `admin-listing-SC-52` — First item is the catalogue card

### admin-listing-US-05: Call a listing off before it closes

**As an** auction operator,
**I want** to withdraw a lot at any point up to its close,
**so that** a consignor who pulls out or a card that fails authentication
leaves the sale cleanly and no bidder's money stays held against it.

**Accepted by:**

- `admin-listing-SC-36` — Operator calls off a draft
- `admin-listing-SC-37` — Operator calls off a created listing before publish at
- `admin-listing-SC-38` — Operator calls off a published listing that has bids
- `admin-listing-SC-39` — Closed listing cannot be called off
- `admin-listing-SC-40` — Settled listing cannot be called off
- `admin-listing-SC-41` — Already canceled listing cannot be called off again
- `admin-listing-SC-42` — Cancel rewrites the slug and frees the original
- `admin-listing-SC-43` — Cancel of a draft with no slug does not invent one
- `admin-listing-SC-44` — Unauthorized cancel is refused
- `admin-listing-SC-45` — Closed listing rejects a title edit
- `admin-listing-SC-55` — Closed listing rejects a media upload
