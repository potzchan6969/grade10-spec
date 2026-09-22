## Feature set

- Create and catalogue
  - Listing code: Grade10 allocates a stable, opaque 5-character code for a
    listing when it is created, and shows that code on the listing's admin
    screen for operators to match against a quoted support, finance or
    reconciliation reference

## ADDED Requirements

### Requirement: Listing code is allocated at create and shown on the admin screen

Every listing carries one stable, opaque **listing code**, system-allocated
and shown to operators on the listing's admin screen.

- **Allocation** - Grade10 SHALL allocate the code when the listing is
  created, deriving it from the listing's internal ID through a keyed
  one-way function rather than exposing that ID or a sequential value. A
  draft not yet created SHALL NOT carry a code.
- **Uniqueness** - No two listings SHALL show the same code at once.
- **Shape** - The code SHALL be exactly 5 characters: the first 2 drawn only
  from the alphabetic Crockford Base32 subset `ABCDEFGHJKMNPQRSTVWXYZ`, and
  the remaining 3 drawn from the full Crockford Base32 charset
  `0123456789ABCDEFGHJKMNPQRSTVWXYZ`.
- **Stability** - The code SHALL be stored in a unique-constrained column and
  SHALL NOT change for the life of the listing record, including through
  publish, close, settle, or call off. A collision against the unique
  constraint SHALL be resolved by a salted recompute, never by reusing
  another listing's code.
- **Display** - The listing's admin screen SHALL show the code to an operator
  authorized to view that listing. It SHALL render as read-only: no control
  on the form or the API SHALL accept an operator-supplied value for it, and
  a write attempting to set or change it SHALL be refused.
- **Not the public listing page** - This requirement governs only
  grade10-admin's listing screens; the code's absence from grade10-site's
  public listing pages is specified by `grade10-site/auction/listing-page`.

#### Scenario: grade10-admin-auction-listing-SC-87 - Operator reads a newly created listing's code
**Serves:** grade10-admin-auction-listing-US-72 - Operator reads a listing's code to act on a quoted reference

- **GIVEN** a draft with every required create field set
- **WHEN** an operator creates the listing
- **THEN** the listing's admin screen shows a 5-character listing code
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
