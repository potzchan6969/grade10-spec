## Feature set

- Create and catalogue
  - Listing code: Grade10 allocates a stable, opaque 5-character code for a
    listing when it is created, and shows that code on the listing's admin
    screen for operators to match against a quoted support, finance or
    reconciliation reference

## ADDED Requirements

### Requirement: Listing code is allocated at create and shown on the admin screen

Every listing carries one stable, opaque **listing code**, system-allocated
and shown to operators with existing listing-admin read access on both the
Listings table and the listing detail screen. Knowing a code SHALL NOT grant
admin access or expose private listing data.

- **Allocation** - Grade10 SHALL allocate the code when the listing is
  created. A keyed one-way derivation over an internal system UUID or listing
  ID is permitted, but the public value SHALL not expose or reversibly encode
  that internal identifier. A draft not yet created SHALL NOT carry a code.
- **Uniqueness** - No two listings SHALL show the same code at once.
- **Shape** - The code SHALL be exactly 5 characters: the first 2 drawn only
  from the alphabetic Crockford Base32 subset `ABCDEFGHJKMNPQRSTVWXYZ`, and
  the remaining 3 drawn from the full Crockford Base32 charset
  `0123456789ABCDEFGHJKMNPQRSTVWXYZ`.
- **Stability** - The code SHALL be stored in a unique-constrained column and
  SHALL NOT change for the life of the listing record, including through
  publish, close, settle, or call off. Deleting a listing SHALL NOT release
  its code. A 5-character projection can collide; allocation SHALL retry
  against active codes and retained reservations, never by reusing another
  listing's code.
- **Display** - The Listings table and listing detail screen SHALL show the
  code to an operator authorized to view listings. It SHALL render as
  read-only: no control on the form or the API SHALL accept an
  operator-supplied value for it, and a write attempting to set or change it
  SHALL be refused. An operator without existing listing-admin access SHALL
  receive no listing or private data merely by presenting the code.
- **Not the public listing page** - This requirement governs only
  grade10-admin's listing screens; the code's absence from grade10-site's
  public listing pages is specified by `grade10-site/auction/listing-page`.

#### Scenario: grade10-admin-auction-listing-SC-87 - Operator reads a newly created listing's code
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a draft with every required create field set
- **WHEN** an operator creates the listing
- **THEN** the Listings table and listing detail screen show the same
  5-character listing code
- **AND** the code's first 2 characters are letters drawn from
  `ABCDEFGHJKMNPQRSTVWXYZ`

#### Scenario: grade10-admin-auction-listing-SC-88 - A draft not yet created shows no listing code
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a draft listing that has not been created
- **WHEN** an operator opens its admin screen
- **THEN** no listing code is shown

#### Scenario: grade10-admin-auction-listing-SC-89 - The listing code has no editable control
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a created listing with an allocated listing code
- **WHEN** an operator opens its admin screen
- **THEN** the code renders as read-only text, with no form control to change
  it
- **AND** an API write attempting to set the listing code is refused

#### Scenario: grade10-admin-auction-listing-SC-90 - A closed or called-off listing keeps its listing code
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a listing whose code was allocated at create
- **WHEN** the listing is closed, or called off before close
- **THEN** its admin screen still shows the same listing code

#### Scenario: grade10-admin-auction-listing-SC-91 - Two listings never show the same code
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** two listings created one after the other
- **WHEN** an operator reads each listing's code on its admin screen
- **THEN** the two codes are different

#### Scenario: grade10-admin-auction-listing-SC-92 - A projected collision retries
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a new listing's 5-character candidate collides with an active code
  or retained reservation
- **WHEN** the listing is created
- **THEN** allocation retries atomically
- **AND** the stored code has the required shape and differs from the reserved code

#### Scenario: grade10-admin-auction-listing-SC-93 - Deletion does not release a code
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a deleted listing previously held `LK423`
- **WHEN** a later listing is created
- **THEN** `LK423` remains unavailable
- **AND** the later listing receives a different code

#### Scenario: grade10-admin-auction-listing-SC-94 - A known code does not grant admin access
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a listing has code `LK423` and an operator lacks existing
  listing-admin read access
- **WHEN** the operator presents `LK423` to the Listings table or detail route
- **THEN** Grade10 refuses access without exposing the listing or its private
  data

## MODIFIED Requirements

### Requirement: Operator may call off a listing that has not closed

An operator authorized to call a listing off SHALL cancel a listing that is
`draft`, `created`, or `published`. Cancel SHALL move the listing to
`canceled` and SHALL release every live authorization standing against it.

Cancel SHALL be refused when the listing is `closed`, `settled`, or already
`canceled`. A closed or settled listing's outcome is absolute and SHALL NOT
be reopened by cancel. Cancel of a listing that does not exist SHALL be
refused.

Cancel of a `published` listing SHALL be allowed whether or not bidding has
opened and whether or not it has accepted bids. Cancel of a `created`
listing SHALL be allowed even when a publish at is still in the future;
Grade10 SHALL NOT later publish a listing that was canceled.

When the listing has a canonical slug, cancel SHALL preserve it unchanged.
The slug SHALL remain permanently reserved and the canceled listing SHALL
continue to answer at `/auction/listings/<canonical slug>` with its public
listing page. Call off removes the listing from browse and search; it does not
make the canonical address inaccessible or release it for reuse. A listing
with no slug SHALL stay without one.
The same URL-preservation rule SHALL apply when Grade10 cancels the listing
because its sale was canceled.

Cancel from an operator who is not authorized to call a listing off SHALL
be refused, and the listing and slug SHALL be unchanged.

#### Scenario: grade10-admin-auction-listing-SC-36 - Operator calls off a draft
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a draft listing
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** it stays absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-37 - Operator calls off a created listing before publish at
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a created listing with a publish at still in the future
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** when that publish at arrives, Grade10 does not publish it
- **AND** it stays absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-38 - Operator calls off a published listing that has bids
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing with accepted bids and live authorizations
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** it releases every live authorization standing against it
- **AND** it is absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-39 - Closed listing cannot be called off
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains closed

#### Scenario: grade10-admin-auction-listing-SC-40 - Settled listing cannot be called off
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a settled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains settled

#### Scenario: grade10-admin-auction-listing-SC-41 - Already canceled listing cannot be called off again
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a canceled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains canceled

#### Scenario: grade10-admin-auction-listing-SC-42 - Cancel rewrites the slug and frees the original
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing whose id is
  `auc_550e8400-e29b-41d4-a716-446655440000` and whose slug is
  `charizard-psa-9`
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 keeps slug `charizard-psa-9`
- **AND** `/auction/listings/charizard-psa-9` continues to return that listing
- **AND** the slug remains unavailable to every later listing
- **AND** the listing is absent from browse and search

#### Scenario: grade10-admin-auction-listing-SC-43 - Cancel of a draft with no slug does not invent one
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a draft listing with no slug
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** the listing still has no slug

#### Scenario: grade10-admin-auction-listing-SC-44 - Unauthorized cancel is refused
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing
- **AND** a signed-in operator who may not call a listing off
- **WHEN** they call it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains published
- **AND** its slug is unchanged
