# grade10-auction/admin-sale Specification

## Purpose
Lets an authorized Grade10 operator open, create, edit, publish, and cancel
an Auction sale event — the catalogue cover / campaign that **multiple
listings** may belong to — from the Grade10 auction admin section, without
clocks or money on the sale itself.

## ADDED Requirements

### Requirement: Operator opens a sale as a draft

An authorized operator SHALL open a new Auction sale from the Grade10 auction
admin Sales section. A successful open SHALL persist the sale in `draft`. A
draft sale SHALL NOT appear as a public catalogue cover.

Opening a sale SHALL require a **Title** — trimmed, 1 to 200 characters.
**Copy** is optional, at most 4000 characters, and MAY be empty.

Opening from an operator who is not authorized to catalogue a sale SHALL be
refused.

#### Scenario: Operator opens a draft sale

- **GIVEN** an authorized operator on the Grade10 auction Sales section
- **WHEN** they open a sale titled "September Slabs" with empty copy
- **THEN** Grade10 persists a draft sale with that title
- **AND** the sale is absent from the public catalogue covers

#### Scenario: Open without a title is refused

- **GIVEN** an authorized operator
- **WHEN** they open a sale with an empty title
- **THEN** Grade10 refuses the open
- **AND** it persists no sale

#### Scenario: Unauthorized open is refused

- **GIVEN** a signed-in operator who may not catalogue a sale
- **WHEN** they open a new sale
- **THEN** Grade10 refuses the open
- **AND** it persists no sale

### Requirement: Operator creates a draft sale

An authorized operator SHALL create a sale that is `draft`. A successful
create SHALL move the sale to `created`. A created sale SHALL NOT appear as
a public catalogue cover until published. Create SHALL require the sale to
still have a valid title.

Create of a sale that is not `draft` SHALL be refused. Create from an
operator who is not authorized to catalogue a sale SHALL be refused.

#### Scenario: Operator creates a draft sale

- **GIVEN** a draft sale titled "September Slabs"
- **WHEN** an authorized operator creates it
- **THEN** Grade10 moves it to `created`
- **AND** the sale remains absent from the public catalogue covers

#### Scenario: Create of a created sale is refused

- **GIVEN** a created sale
- **WHEN** an operator creates it again
- **THEN** Grade10 refuses the create
- **AND** the sale remains created

### Requirement: Operator edits a draft, created, or published sale

While a sale is `draft`, `created`, or `published`, an authorized operator
SHALL edit its **Title** and **Copy** from the sale editor. Each write SHALL
replace the stored value for the fields sent; an omitted field SHALL leave
the stored value unchanged.

Title when set SHALL be trimmed, 1 to 200 characters. Copy when set SHALL be
at most 4000 characters and MAY be empty. A write that clears the title
SHALL be refused.

A `canceled` sale SHALL reject every title and copy write. Edit from an
operator who is not authorized to catalogue a sale SHALL be refused.

#### Scenario: Operator updates copy on a published sale

- **GIVEN** a published sale titled "September Slabs"
- **WHEN** an authorized operator changes its copy to a new description
- **THEN** Grade10 stores the new copy
- **AND** the title and status are unchanged

#### Scenario: Clearing the title is refused

- **GIVEN** a draft sale with a title
- **WHEN** an operator clears the title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

#### Scenario: Canceled sale rejects a title edit

- **GIVEN** a canceled sale
- **WHEN** an operator changes its title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

### Requirement: Operator publishes a created sale

An authorized operator SHALL publish a sale that is `created`. A successful
publish SHALL move the sale to `published` and SHALL make its catalogue cover
visible. Publishing a sale SHALL NOT publish the listings under it — each
listing publishes on its own.

Publish of a sale that is not `created` SHALL be refused. Publish from an
operator who is not authorized to catalogue a sale SHALL be refused.

#### Scenario: Operator publishes a created sale

- **GIVEN** a created sale titled "September Slabs"
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** the sale appears as a public catalogue cover
- **AND** listings under it that are not published stay off the catalogue

#### Scenario: Publish of a draft sale is refused

- **GIVEN** a draft sale
- **WHEN** an operator publishes it
- **THEN** Grade10 refuses the publish
- **AND** the sale remains a draft

#### Scenario: Publish of a published sale is refused

- **GIVEN** a published sale
- **WHEN** an operator publishes it
- **THEN** Grade10 refuses the publish
- **AND** the sale remains published

### Requirement: Operator cancels a draft, created, or published sale

An operator authorized to call a sale off SHALL cancel a sale that is
`draft`, `created`, or `published`. A successful cancel SHALL move the sale
to `canceled`. Grade10 SHALL then cancel each listing that still belongs under
that sale under the listing cancel rules in `grade10-auction/admin-listing`.

A sale that is already `canceled` SHALL reject a second cancel. Cancel from
an operator who is not authorized to call a sale off SHALL be refused.

#### Scenario: Operator cancels a published sale

- **GIVEN** a published sale with two published listings under it
- **WHEN** an authorized operator cancels the sale
- **THEN** Grade10 moves the sale to `canceled`
- **AND** those listings move to `canceled` under the listing cancel rules

#### Scenario: Operator cancels a draft sale

- **GIVEN** a draft sale with no listings
- **WHEN** an authorized operator cancels it
- **THEN** Grade10 moves it to `canceled`

#### Scenario: Operator cancels a created sale

- **GIVEN** a created sale with no listings
- **WHEN** an authorized operator cancels it
- **THEN** Grade10 moves it to `canceled`

#### Scenario: Already canceled sale cannot be canceled again

- **GIVEN** a canceled sale
- **WHEN** an operator cancels it
- **THEN** Grade10 refuses the cancel
- **AND** the sale remains canceled

#### Scenario: Unauthorized cancel is refused

- **GIVEN** a signed-in operator who may not call a sale off
- **WHEN** they cancel a draft sale
- **THEN** Grade10 refuses the cancel
- **AND** the sale remains a draft

### Requirement: Sale editor is the authoring surface

The Grade10 auction admin Sales section SHALL open a dedicated sale editor
for creating a new sale and for editing an existing `draft`, `created`, or
`published` sale. The editor SHALL expose title, copy, create (when the sale
is `draft`), publish (when the sale is `created`), and cancel (when the sale
is `draft`, `created`, or `published` and the operator is authorized).

A `canceled` sale SHALL open read-only: title and copy visible, create,
publish, and edit controls absent, cancel absent.

#### Scenario: Operator opens the editor for a new sale

- **GIVEN** an authorized operator on the Sales section
- **WHEN** they start a new sale
- **THEN** the sale editor is shown with empty title and copy
- **AND** create and publish are not offered until the sale exists as a draft

#### Scenario: Operator opens the editor for a draft sale

- **GIVEN** a draft sale titled "September Slabs"
- **WHEN** an authorized operator opens it from the Sales section
- **THEN** the sale editor shows that title and copy
- **AND** create and cancel are offered when the operator is authorized
- **AND** publish is not offered

#### Scenario: Operator opens the editor for a created sale

- **GIVEN** a created sale titled "September Slabs"
- **WHEN** an authorized operator opens it from the Sales section
- **THEN** the sale editor shows that title and copy
- **AND** publish and cancel are offered when the operator is authorized
- **AND** create is not offered

#### Scenario: Canceled sale opens read-only

- **GIVEN** a canceled sale
- **WHEN** an authorized operator opens it from the Sales section
- **THEN** the editor shows its title and copy
- **AND** create, publish, edit save, and cancel are not offered
