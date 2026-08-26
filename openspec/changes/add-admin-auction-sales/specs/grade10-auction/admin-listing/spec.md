# grade10-auction/admin-listing Delta

## ADDED Requirements

### Requirement: Listing editor exposes optional sale selection

The Grade10 auction listing editor SHALL let an authorized operator pick at
most one **Sale** for the listing, or clear the sale so the listing stands
alone. The picker SHALL list only sales that are `draft` or `published`. A
`canceled` sale SHALL NOT appear as a selectable option.

Selecting a sale SHALL persist through the same draft-save and create paths
that write other catalogue fields, and on an editable listing that already
exists SHALL update the listing’s sale. Clearing the sale SHALL store no
sale. Attaching a canceled sale through the API SHALL still be refused under
**Catalogue fields an operator may write**.

An operator who may catalogue a listing SHALL be able to set or clear the
sale. The picker SHALL NOT block create or publish when no sale is chosen.

#### Scenario: Operator attaches a draft listing to a draft sale

- **GIVEN** a draft listing and a draft sale titled "September Slabs"
- **WHEN** an authorized operator selects that sale in the listing editor
  and saves
- **THEN** Grade10 stores the listing under that sale
- **AND** the listing remains a draft

#### Scenario: Operator attaches a listing to a published sale

- **GIVEN** a created listing and a published sale
- **WHEN** an authorized operator selects that sale in the listing editor
  and saves
- **THEN** Grade10 stores the listing under that sale

#### Scenario: Operator clears the sale on a listing

- **GIVEN** a draft listing attached to a draft sale
- **WHEN** an authorized operator clears the sale in the listing editor and
  saves
- **THEN** Grade10 stores the listing with no sale
- **AND** the listing remains a draft

#### Scenario: Canceled sales are not offered in the picker

- **GIVEN** a canceled sale and a draft sale
- **WHEN** an authorized operator opens the sale picker on the listing
  editor
- **THEN** the draft sale is offered
- **AND** the canceled sale is not offered

#### Scenario: Listing without a sale still creates

- **GIVEN** a draft listing with every required create field set and no sale
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no sale
