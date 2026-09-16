## Feature set

- Inventory unit
  - Explicit choice: product selection is paired with a Cert ID or `No Cert ID`
  - Unit hold: a selected Cert ID is held as one physical unit
- Listing lifecycle
  - Draft save: validates and preserves the selected unit
  - Create: requires the saved unit choice and matching inventory hold
- Product display
  - Selected identity: public fields resolve through Inventory
  - Unnumbered stock: `No Cert ID` displays no certificate row

## ADDED Requirements

### Requirement: Listing creation requires an explicit inventory-unit choice

An Auction listing that reserves a product SHALL carry an explicit inventory
unit choice. The choice SHALL be either one available Cert ID owned by the
selected product inventory or the literal choice `No Cert ID`. A product with
no Cert ID records SHALL remain listable through `No Cert ID`. The choice SHALL
be stored with the listing and SHALL be required at create even when the
selected product has no Cert ID.

#### Scenario: grade10-admin-auction-listing-SC-70 - Product with Cert IDs offers an explicit choice
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created inventory product with available units and Cert IDs `PSA-123` and `BGS-456`
- **WHEN** an authorized operator opens the listing product picker
- **THEN** the editor offers `PSA-123`, `BGS-456`, and `No Cert ID` as explicit choices
- **AND** no blank or implicit certificate choice is used

#### Scenario: grade10-admin-auction-listing-SC-71 - Product without Cert IDs offers No Cert ID
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created inventory product with available stock and no Cert ID records
- **WHEN** an authorized operator selects that product
- **THEN** the editor offers `No Cert ID`
- **AND** the operator can create a listing after selecting it

#### Scenario: grade10-admin-auction-listing-SC-72 - Changing products clears the prior unit choice
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a draft listing with product A and Cert ID `PSA-123`
- **WHEN** an authorized operator selects product B
- **THEN** the Cert ID choice is cleared until the operator chooses a unit for product B
- **AND** the listing cannot be created with product B and product A's Cert ID

### Requirement: Inventory validates and holds a selected Cert ID

When a listing selects a Cert ID, Auction SHALL ask Inventory to verify that
the record belongs to the selected product and is not already held by another
active Auction listing. A selected Cert ID SHALL represent exactly one listed
unit, so its listing quantity SHALL be one. Inventory SHALL reserve that unit
and the aggregate product inventory in the same logical save operation. The
`No Cert ID` choice SHALL use the existing product-level quantity and
reservation rules without allocating a certificate record.

#### Scenario: grade10-admin-auction-listing-SC-73 - Wrong-product Cert ID is refused
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created product A and a Cert ID owned by product B
- **WHEN** an authorized operator tries to save product A with product B's Cert ID
- **THEN** Grade10 refuses the save
- **AND** the listing and inventory holds are unchanged

#### Scenario: grade10-admin-auction-listing-SC-74 - A Cert ID cannot be held twice
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** an active Auction listing holds Cert ID `PSA-123`
- **WHEN** another listing tries to save the same Cert ID
- **THEN** Grade10 refuses the save
- **AND** the existing listing's hold remains unchanged

#### Scenario: grade10-admin-auction-listing-SC-75 - No Cert ID uses aggregate reservation
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created product with available stock and no Cert ID records
- **WHEN** an authorized operator chooses `No Cert ID` and quantity three
- **THEN** the listing reserves quantity three through the product inventory
- **AND** no Cert ID record is allocated

### Requirement: Listing create verifies the saved inventory-unit choice

Create SHALL refuse a listing whose saved product and quantity do not have a
matching active inventory hold. When a Cert ID is selected, the hold SHALL
also match that record and quantity one. Create SHALL not mint or infer a
certificate choice. Editing a listing SHALL preserve its selected Cert ID when
the listing's own active hold makes that unit unavailable to other listings.

#### Scenario: grade10-admin-auction-listing-SC-76 - Create succeeds with a saved Cert ID hold
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a draft listing saved with product A, Cert ID `PSA-123`, and quantity one
- **AND** an active hold for that listing matches product A and `PSA-123`
- **WHEN** an authorized operator creates the listing with every other required field set
- **THEN** Grade10 moves the listing to `created`
- **AND** the selected Cert ID remains held by that listing

#### Scenario: grade10-admin-auction-listing-SC-77 - Create succeeds with No Cert ID
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a draft listing saved with a product, `No Cert ID`, and quantity three
- **AND** an active product-level hold of quantity three matches that listing
- **WHEN** an authorized operator creates the listing with every other required field set
- **THEN** Grade10 moves the listing to `created`
- **AND** no Cert ID is stored for the listing

#### Scenario: grade10-admin-auction-listing-SC-78 - Create without an explicit unit choice is refused
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a draft listing with a product and quantity but no Cert ID choice
- **WHEN** an authorized operator attempts to create it
- **THEN** the form and API refuse the create
- **AND** the listing remains `draft`

### Requirement: Listing display resolves the selected inventory identity

When a listing's selected product schema includes Cert ID in Displayed
Attributes, the public listing response SHALL resolve and include the selected
Cert ID through the Inventory display boundary. If the listing selected `No
Cert ID`, the response SHALL omit the Cert ID row. Product metadata SHALL NOT
be returned as an alternative product display source.

#### Scenario: grade10-admin-auction-listing-SC-79 - Public listing displays selected Cert ID
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a published listing with Cert ID `PSA-123` and a schema that displays Cert ID
- **WHEN** a collector opens the listing
- **THEN** the listing displays `PSA-123` in the configured product-field position
- **AND** it displays typed product attributes through the same product display

#### Scenario: grade10-admin-auction-listing-SC-80 - Public listing hides No Cert ID
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a published listing with the explicit `No Cert ID` choice
- **WHEN** a collector opens the listing
- **THEN** no Cert ID row is displayed
- **AND** no product metadata fallback is returned

### Requirement: Distinct certified units can have separate live listings

A created product with multiple available Cert IDs SHALL allow a separate live
listing for each distinct Cert ID. One Cert ID SHALL belong to no more than one
live listing at a time.

#### Scenario: grade10-admin-auction-listing-SC-81 - Distinct copies of one product can be listed separately
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created product has available Cert IDs `PSA-123` and `BGS-456`
- **WHEN** an authorized operator saves one live listing for each Cert ID
- **THEN** both listings hold their selected unit for that same product
- **AND** another listing cannot hold either already selected Cert ID
