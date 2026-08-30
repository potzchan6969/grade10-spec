# grade10-auction/admin-campaign Specification

## Purpose

Lets an authorized Grade10 operator open, create, edit, publish, and cancel
an Auction **campaign** — the catalogue cover / event that **multiple
listings** may belong to — from the Grade10 auction admin section, without
clocks or money on the campaign itself. Operator language is **Campaign** /
**Campaigns**, not Sale / Sales (those labels confuse this cover with store
checkout and with inventory “sold” stock).

## Feature set

- Rename Sales to Campaigns
  - Admin tab and page: existing Sales tab, section heading, and empty states become Campaigns
  - Editor and field labels: campaign editor chrome and listing Campaign field never say Sale
  - Code identifiers: admin contracts, feature modules, app panels, and auction-service catalogue-cover helpers use campaign names, not sale
- Campaigns section
  - Campaign list: operators browse and open campaigns from that section
- Campaign editor
  - Open draft: start a campaign with title and optional copy
  - Create: move draft to created before it can publish
  - Edit cover: change title and copy while the campaign is open
  - Publish: make the catalogue cover public without publishing listings under it
  - Cancel: call a campaign off and cancel listings that still belong under it
  - Read-only canceled: canceled campaigns show title and copy with no writes

## ADDED Requirements

### Requirement: Admin chrome uses Campaigns, not Sales

The Grade10 auction admin SHALL rename the existing catalogue-cover **Sales**
tab and page to **Campaigns** (singular **Campaign** where one item is named).
Tab title, section heading, empty states, list actions, and the campaign
editor chrome SHALL NOT use the words **Sale** or **Sales** for this entity.

#### Scenario: Auction admin section is labeled Campaigns

- **GIVEN** an authorized operator on the Grade10 auction admin
- **WHEN** they open the catalogue-cover section that was previously Sales
- **THEN** the tab and page are labeled Campaigns
- **AND** they are not labeled Sales

#### Scenario: Campaign editor chrome says Campaign

- **GIVEN** an authorized operator opening a new or existing campaign
- **WHEN** the campaign editor is shown
- **THEN** the editor chrome names it a Campaign
- **AND** it does not name it a Sale

### Requirement: Admin catalogue-cover code uses campaign identifiers

Auction admin packages and the auction worker's catalogue-cover code SHALL name
the cover entity **campaign**, not **sale**, in exports, modules, panels, and
internal helpers. Examples: `adminCampaign*` contracts, `campaigns` feature
modules, `CampaignsPanel`, `publishedCampaignJoin`,
`publicListingsOfCampaign`.

The `auctions` table, `auctions.*` tRPC router paths, and listing `auctionId`
wire field SHALL stay unchanged. Post-sale (`postSale`, `PostSalePanel`) and
inventory sell/sold vocabulary SHALL stay unchanged — they name different
domains.

#### Scenario: Admin catalogue-cover code uses campaign identifiers

- **GIVEN** the Grade10 auction admin contracts and catalogue-cover backend
- **WHEN** an engineer imports or reads catalogue-cover identifiers
- **THEN** exported schemas and types use `adminCampaign` / `AuctionAdminCampaign`
- **AND** they do not export `adminSale` / `AuctionAdminSale` aliases
- **AND** the admin SPA exposes `CampaignsPanel` and `campaigns` modules, not
  `SalesPanel` or `sales` modules for this entity

### Requirement: Operator opens a campaign as a draft

An authorized operator SHALL open a new Auction campaign from the Grade10
auction admin Campaigns section. A successful open SHALL persist the campaign
in `draft`. A draft campaign SHALL NOT appear as a public catalogue cover.

Opening a campaign SHALL require a **Title** — trimmed, 1 to 200 characters.
**Copy** is optional, at most 4000 characters, and MAY be empty.

Opening from an operator who is not authorized to catalogue a campaign SHALL
be refused.

#### Scenario: Operator opens a draft campaign

- **GIVEN** an authorized operator on the Grade10 auction Campaigns section
- **WHEN** they open a campaign titled "September Slabs" with empty copy
- **THEN** Grade10 persists a draft campaign with that title
- **AND** the campaign is absent from the public catalogue covers

#### Scenario: Open without a title is refused

- **GIVEN** an authorized operator
- **WHEN** they open a campaign with an empty title
- **THEN** Grade10 refuses the open
- **AND** it persists no campaign

#### Scenario: Unauthorized open is refused

- **GIVEN** a signed-in operator who may not catalogue a campaign
- **WHEN** they open a new campaign
- **THEN** Grade10 refuses the open
- **AND** it persists no campaign

### Requirement: Operator creates a draft campaign

An authorized operator SHALL create a campaign that is `draft`. A successful
create SHALL move the campaign to `created`. A created campaign SHALL NOT
appear as a public catalogue cover until published. Create SHALL require the
campaign to still have a valid title.

Create of a campaign that is not `draft` SHALL be refused. Create from an
operator who is not authorized to catalogue a campaign SHALL be refused.

#### Scenario: Operator creates a draft campaign

- **GIVEN** a draft campaign titled "September Slabs"
- **WHEN** an authorized operator creates it
- **THEN** Grade10 moves it to `created`
- **AND** the campaign remains absent from the public catalogue covers

#### Scenario: Create of a created campaign is refused

- **GIVEN** a created campaign
- **WHEN** an operator creates it again
- **THEN** Grade10 refuses the create
- **AND** the campaign remains created

### Requirement: Operator edits a draft, created, or published campaign

While a campaign is `draft`, `created`, or `published`, an authorized
operator SHALL edit its **Title** and **Copy** from the campaign editor.
Each write SHALL replace the stored value for the fields sent; an omitted
field SHALL leave the stored value unchanged.

Title when set SHALL be trimmed, 1 to 200 characters. Copy when set SHALL be
at most 4000 characters and MAY be empty. A write that clears the title
SHALL be refused.

A `canceled` campaign SHALL reject every title and copy write. Edit from an
operator who is not authorized to catalogue a campaign SHALL be refused.

#### Scenario: Operator updates copy on a published campaign

- **GIVEN** a published campaign titled "September Slabs"
- **WHEN** an authorized operator changes its copy to a new description
- **THEN** Grade10 stores the new copy
- **AND** the title and status are unchanged

#### Scenario: Clearing the title is refused

- **GIVEN** a draft campaign with a title
- **WHEN** an operator clears the title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

#### Scenario: Canceled campaign rejects a title edit

- **GIVEN** a canceled campaign
- **WHEN** an operator changes its title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

### Requirement: Operator publishes a created campaign

An authorized operator SHALL publish a campaign that is `created`. A
successful publish SHALL move the campaign to `published` and SHALL make its
catalogue cover visible. Publishing a campaign SHALL NOT publish the listings
under it — each listing publishes on its own.

Publish of a campaign that is not `created` SHALL be refused. Publish from an
operator who is not authorized to catalogue a campaign SHALL be refused.

#### Scenario: Operator publishes a created campaign

- **GIVEN** a created campaign titled "September Slabs"
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** the campaign appears as a public catalogue cover
- **AND** listings under it that are not published stay off the catalogue

#### Scenario: Publish of a draft campaign is refused

- **GIVEN** a draft campaign
- **WHEN** an operator publishes it
- **THEN** Grade10 refuses the publish
- **AND** the campaign remains a draft

#### Scenario: Publish of a published campaign is refused

- **GIVEN** a published campaign
- **WHEN** an operator publishes it
- **THEN** Grade10 refuses the publish
- **AND** the campaign remains published

### Requirement: Operator cancels a draft, created, or published campaign

An operator authorized to call a campaign off SHALL cancel a campaign that is
`draft`, `created`, or `published`. A successful cancel SHALL move the
campaign to `canceled`. Grade10 SHALL then cancel each listing that still
belongs under that campaign under the listing cancel rules in
`grade10-auction/admin-listing`.

A campaign that is already `canceled` SHALL reject a second cancel. Cancel
from an operator who is not authorized to call a campaign off SHALL be
refused.

#### Scenario: Operator cancels a published campaign

- **GIVEN** a published campaign with two published listings under it
- **WHEN** an authorized operator cancels the campaign
- **THEN** Grade10 moves the campaign to `canceled`
- **AND** those listings move to `canceled` under the listing cancel rules

#### Scenario: Operator cancels a draft campaign

- **GIVEN** a draft campaign with no listings
- **WHEN** an authorized operator cancels it
- **THEN** Grade10 moves it to `canceled`

#### Scenario: Operator cancels a created campaign

- **GIVEN** a created campaign with no listings
- **WHEN** an authorized operator cancels it
- **THEN** Grade10 moves it to `canceled`

#### Scenario: Already canceled campaign cannot be canceled again

- **GIVEN** a canceled campaign
- **WHEN** an operator cancels it
- **THEN** Grade10 refuses the cancel
- **AND** the campaign remains canceled

#### Scenario: Unauthorized cancel is refused

- **GIVEN** a signed-in operator who may not call a campaign off
- **WHEN** they cancel a draft campaign
- **THEN** Grade10 refuses the cancel
- **AND** the campaign remains a draft

### Requirement: Campaign editor is the authoring surface

The Grade10 auction admin Campaigns section SHALL open a dedicated campaign
editor for creating a new campaign and for editing an existing `draft`,
`created`, or `published` campaign. The editor SHALL expose title, copy,
create (when the campaign is `draft`), publish (when the campaign is
`created`), and cancel (when the campaign is `draft`, `created`, or
`published` and the operator is authorized).

A `canceled` campaign SHALL open read-only: title and copy visible, create,
publish, and edit controls absent, cancel absent.

#### Scenario: Operator opens the editor for a new campaign

- **GIVEN** an authorized operator on the Campaigns section
- **WHEN** they start a new campaign
- **THEN** the campaign editor is shown with empty title and copy
- **AND** create and publish are not offered until the campaign exists as a
  draft

#### Scenario: Operator opens the editor for a draft campaign

- **GIVEN** a draft campaign titled "September Slabs"
- **WHEN** an authorized operator opens it from the Campaigns section
- **THEN** the campaign editor shows that title and copy
- **AND** create and cancel are offered when the operator is authorized
- **AND** publish is not offered

#### Scenario: Operator opens the editor for a created campaign

- **GIVEN** a created campaign titled "September Slabs"
- **WHEN** an authorized operator opens it from the Campaigns section
- **THEN** the campaign editor shows that title and copy
- **AND** publish and cancel are offered when the operator is authorized
- **AND** create is not offered

#### Scenario: Canceled campaign opens read-only

- **GIVEN** a canceled campaign
- **WHEN** an authorized operator opens it from the Campaigns section
- **THEN** the editor shows its title and copy
- **AND** create, publish, edit save, and cancel are not offered
