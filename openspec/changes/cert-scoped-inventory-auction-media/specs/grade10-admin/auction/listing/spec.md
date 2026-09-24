# grade10-admin/auction/listing Specification

## Purpose

Lets an authorized Grade10 operator choose source media for the physical unit
selected for a listing, make cross-Cert additions deliberately, and edit a
listing-owned gallery snapshot.

## Feature set

- Unit-aware source selection
  - For a selected Cert record with a printed Cert ID, the main selector offers the product's untagged source media and media tagged to that record; a record without a printed Cert ID brings forward untagged product media only.
  - Other media tagged to a printed-Cert record stays outside the main selector; the separately labelled drawer contains only that media, grouped and named by the printed Cert ID, which an explicit Add to listing action names.
  - For `No Cert ID`, the main selector offers only untagged product media.
- Listing-owned gallery snapshot
  - Adding a source item copies its bytes and current alt text into the listing gallery.
  - Listing alt text and order remain editable; later source changes do not change the listing copy.
  - Direct listing uploads and the existing one-to-eight gallery rules remain available.

## ADDED Requirements

### Requirement: Cert-scoped source-media selection

For a selected Cert record with a printed Cert ID, the main source selector
SHALL offer the product's untagged source media and media tagged to that
record. Media tagged to another Cert record SHALL be absent from the main
selector. If the selected Cert record has no printed Cert ID, the main
selector SHALL offer only untagged product media. When the listing selects
`No Cert ID`, the main selector SHALL offer only untagged product media.

The separately labelled Other Cert media drawer SHALL contain only source
media tagged to Cert records with a printed Cert ID that are outside the main
selector. For a selected Cert record with a printed Cert ID, it SHALL contain
media tagged to other Cert records of that product. When the selected record
has no printed Cert ID or the listing selects `No Cert ID`, it SHALL contain
the product's printed-Cert-tagged media. The drawer SHALL group and name each
group by its printed Cert ID. An operator SHALL add an item from this drawer
only through an explicit Add to listing action that names the source Cert ID.

Existing Auction listing-edit authority SHALL govern reads of the main source
selector and Other Cert media drawer and additions from either surface. This
change SHALL NOT introduce a permission or grant. Grade10 SHALL refuse an
unauthorized source read or addition under existing Auction authorization
and SHALL leave the listing gallery unchanged.

A successful save of source media SHALL keep the existing listing-owned
snapshot independent of later source byte or alt-text edits, source
reordering, tag changes, and Cert-record deletion.

#### Scenario: grade10-admin-auction-listing-SC-101 - Cert listing defaults to matching product media
**Serves:** grade10-admin-auction-listing-US-11 - Operator starts a Cert-specific listing with its usual media

- **GIVEN** a selected Cert record with a printed Cert ID and source media that is untagged, tagged to that record, and tagged to another record
- **WHEN** an authorized operator opens the main source selector
- **THEN** it offers untagged product media and media tagged to the selected record
- **AND** media tagged to the other record is absent

#### Scenario: grade10-admin-auction-listing-SC-102 - A selected Cert record without a printed ID defaults to untagged media
**Serves:** grade10-admin-auction-listing-US-11 - Operator starts a Cert-specific listing with its usual media

- **GIVEN** a selected same-product Cert record without a printed Cert ID and product media tagged to another printed-ID Cert
- **WHEN** an authorized operator opens the main source selector
- **THEN** it offers untagged product media only
- **AND** other Cert-tagged media is absent

#### Scenario: grade10-admin-auction-listing-SC-103 - Other Cert media is grouped by printed Cert ID
**Serves:** grade10-admin-auction-listing-US-12 - Operator deliberately uses another Cert's media

- **GIVEN** a selected Cert record and source media tagged to two other same-product Cert records with printed Cert IDs
- **WHEN** an authorized operator opens the separately labelled Other Cert media drawer
- **THEN** the drawer contains the hidden media grouped and named by each printed Cert ID
- **AND** untagged product media is not in the drawer

#### Scenario: grade10-admin-auction-listing-SC-104 - Adding other-Cert media names its source Cert
**Serves:** grade10-admin-auction-listing-US-12 - Operator deliberately uses another Cert's media

- **GIVEN** source media in the Other Cert media drawer tagged to a same-product Cert record with printed Cert ID `PSA-123`
- **WHEN** an authorized operator explicitly selects Add to listing for `PSA-123`
- **THEN** the source media is added to the listing gallery
- **AND** the addition names `PSA-123` as the source Cert ID

#### Scenario: grade10-admin-auction-listing-SC-105 - No Cert ID defaults to untagged product media
**Serves:** grade10-admin-auction-listing-US-13 - Operator lists an unnumbered unit

- **GIVEN** a listing whose selected unit is `No Cert ID` and a product with untagged and Cert-tagged source media
- **WHEN** an authorized operator opens the main source selector
- **THEN** it offers untagged product media only
- **AND** Cert-tagged media is absent

#### Scenario: grade10-admin-auction-listing-SC-106 - Save copies selected source bytes and current alt text
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a draft listing with a selected product and source media with current bytes and alt text
- **WHEN** an authorized operator adds the source and saves the listing
- **THEN** the listing gallery owns a copy of the source bytes and current alt text

#### Scenario: grade10-admin-auction-listing-SC-107 - Listing copy alt text and order remain editable
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a saved listing with a copied source item and another gallery item
- **WHEN** an authorized operator edits the copied alt text and reorders the gallery
- **THEN** the saved listing gallery retains the edited alt text and chosen order

#### Scenario: grade10-admin-auction-listing-SC-108 - Later source edits do not alter a listing copy
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a listing gallery with a saved source copy
- **WHEN** Inventory changes the source bytes, alt text, or source order
- **THEN** the listing copy's bytes, alt text, and listing order remain unchanged

#### Scenario: grade10-admin-auction-listing-SC-109 - Retagging source media does not alter a listing copy
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a listing gallery with a copy of source media tagged to one Cert record
- **WHEN** Inventory retags the source media to another same-product Cert record
- **THEN** the listing copy's bytes and alt text remain unchanged

#### Scenario: grade10-admin-auction-listing-SC-110 - Untagging source media does not alter a listing copy
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a listing gallery with a copy of Cert-tagged source media
- **WHEN** Inventory clears the source media tag
- **THEN** the listing copy's bytes and alt text remain unchanged

#### Scenario: grade10-admin-auction-listing-SC-111 - Removing a source Cert unit deletes its media but not a listing copy
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a listing gallery with a copy of source media tagged to a Cert record
- **WHEN** Inventory removes that physical unit and Cert record, deleting its tagged source media
- **THEN** the listing copy's bytes and alt text remain unchanged

#### Scenario: grade10-admin-auction-listing-SC-112 - A source item can fill the eighth gallery place
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a draft listing with seven direct-upload or source-media items and one eligible source item
- **WHEN** an authorized operator adds and saves the source item
- **THEN** the listing gallery contains eight items in the selected order

#### Scenario: grade10-admin-auction-listing-SC-113 - A ninth source item is refused
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a draft listing with eight gallery items and another eligible source item
- **WHEN** an authorized operator attempts to add and save the source item
- **THEN** Grade10 refuses the operation
- **AND** the gallery still has eight items

#### Scenario: grade10-admin-auction-listing-SC-114 - A source item from another product is refused
**Serves:** grade10-admin-auction-listing-US-11 - Operator starts a Cert-specific listing with its usual media

- **GIVEN** a listing for one product and source media owned by another product
- **WHEN** an authorized operator attempts to add that media
- **THEN** Grade10 refuses the selection
- **AND** the listing gallery is unchanged

#### Scenario: grade10-admin-auction-listing-SC-115 - Unauthorized source reads and additions are refused
**Serves:** grade10-admin-auction-listing-US-12 - Operator deliberately uses another Cert's media

- **GIVEN** an operator without existing Auction listing-edit authority
- **WHEN** they request the Other Cert media drawer and attempt to add source media
- **THEN** Grade10 refuses the read and addition under existing authorization
- **AND** the listing gallery is unchanged

#### Scenario: grade10-admin-auction-listing-SC-116 - Direct uploads and source media share one gallery order
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a draft listing and a supported direct upload and eligible source media from its selected product
- **WHEN** an authorized operator adds both in a chosen order and saves the listing
- **THEN** the listing gallery contains both items in that order

#### Scenario: grade10-admin-auction-listing-SC-117 - A source missing at Save time refuses the save
**Serves:** grade10-admin-auction-listing-US-14 - Operator keeps a listing gallery independent of its source

- **GIVEN** a draft listing with a selected source media item that is removed before Save
- **WHEN** an authorized operator saves the listing
- **THEN** Grade10 refuses Save
- **AND** the listing gallery is unchanged
