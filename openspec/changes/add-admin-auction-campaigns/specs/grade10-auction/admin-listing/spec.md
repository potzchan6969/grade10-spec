# grade10-auction/admin-listing Delta

## ADDED Requirements

### Requirement: Listing editor exposes optional campaign selection

The Grade10 auction listing editor SHALL let an authorized operator pick at
most one **Campaign** for the listing, or clear the campaign so the listing
stands alone. The picker SHALL list only campaigns that are `draft` or
`created`. A `published` or `canceled` campaign SHALL NOT appear as a
selectable option. Operator-visible labels for this control SHALL say
**Campaign**, not **Sale**.

Selecting a campaign SHALL persist through the same draft-save and create
paths that write other catalogue fields, and on an editable listing that
already exists SHALL update the listing’s campaign. Clearing the campaign
SHALL store no campaign. Attaching a `published` or `canceled` campaign
through the API SHALL be refused.

An operator who may catalogue a listing SHALL be able to set or clear the
campaign. The picker SHALL NOT block create or publish when no campaign is
chosen.

#### Scenario: Operator attaches a draft listing to a draft campaign

- **GIVEN** a draft listing and a draft campaign titled "September Slabs"
- **WHEN** an authorized operator selects that campaign in the listing
  editor and saves
- **THEN** Grade10 stores the listing under that campaign
- **AND** the listing remains a draft

#### Scenario: Operator attaches a listing to a created campaign

- **GIVEN** a created listing and a created campaign
- **WHEN** an authorized operator selects that campaign in the listing
  editor and saves
- **THEN** Grade10 stores the listing under that campaign

#### Scenario: Operator clears the campaign on a listing

- **GIVEN** a draft listing attached to a draft campaign
- **WHEN** an authorized operator clears the campaign in the listing editor
  and saves
- **THEN** Grade10 stores the listing with no campaign
- **AND** the listing remains a draft

#### Scenario: Published and canceled campaigns are not offered in the picker

- **GIVEN** a published campaign, a canceled campaign, and a draft campaign
- **WHEN** an authorized operator opens the campaign picker on the listing
  editor
- **THEN** the draft campaign is offered
- **AND** the published campaign is not offered
- **AND** the canceled campaign is not offered

#### Scenario: Published campaign cannot receive a listing

- **GIVEN** a draft listing and a published campaign
- **WHEN** an authorized operator attempts to attach that campaign
- **THEN** Grade10 refuses the attach
- **AND** the listing’s campaign is unchanged

#### Scenario: Listing without a campaign still creates

- **GIVEN** a draft listing with every required create field set and no
  campaign
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no campaign

#### Scenario: Listing editor campaign field is labeled Campaign

- **GIVEN** an authorized operator on the listing editor
- **WHEN** they view the optional campaign control
- **THEN** the control is labeled Campaign
- **AND** it is not labeled Sale

### Requirement: Listing editor product selection uses inventory eligibility

The Grade10 auction listing editor SHALL let an authorized operator select
the catalogue **product** the listing reserves against from Grade10
inventory ([`add-grade10-inventory`](../../../add-grade10-inventory/proposal.md)).
The product picker SHALL list only inventory products that are **`created`**
(not `draft`) and that have **ready available** greater than zero
(holder-facing ready available across that product’s ready inventory rows).

A `draft` inventory product SHALL NOT appear in the picker. A `created`
product with zero ready available (out of stock for reservation) SHALL NOT
appear in the picker. Product ids that are not eligible SHALL be refused on
draft-save and create: draft product, unknown product, or ready available
less than the listing’s reserved quantity (when quantity is set).

When the listing quantity is set, the picker MAY further narrow to products
whose ready available is at least that quantity; create and reserve paths
SHALL refuse if ready available is insufficient for the quantity.

Campaign covers do **not** select a product — only listings do.

#### Scenario: Product picker omits draft inventory products

- **GIVEN** a draft inventory product with ready available stock and a
  created inventory product with ready available stock
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the created product is offered
- **AND** the draft product is not offered

#### Scenario: Product picker omits out-of-stock inventory products

- **GIVEN** a created inventory product with ready available zero and another
  created inventory product with ready available at least one
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the in-stock created product is offered
- **AND** the out-of-stock product is not offered

#### Scenario: Draft product id is refused on listing save

- **GIVEN** a draft listing and a draft inventory product id
- **WHEN** an authorized operator attempts to save that product id on the
  listing
- **THEN** Grade10 refuses the write
- **AND** the listing’s product id is unchanged

#### Scenario: Out-of-stock product id is refused on listing create

- **GIVEN** a draft listing with quantity one and a created inventory
  product whose ready available is zero
- **WHEN** an authorized operator attempts to create the listing with that
  product id
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft
