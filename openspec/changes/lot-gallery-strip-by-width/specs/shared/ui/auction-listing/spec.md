## Feature set

- Gallery strip
  - Several items: more than one image shows a strip; one item does not
  - Lot gallery by width: ListingLotGallery shows a left rail when wide enough beside the stage; stacked keeps previous/next and progress only

## ADDED Requirements

### Requirement: ListingLotGallery shows a left rail only when wide enough

`ListingLotGallery` SHALL render several images with a left thumbnail rail
only when the gallery is wide enough to place that rail beside the main
frame. When the gallery is stacked (not wide enough for that rail), it SHALL
hide the thumbnail rail and SHALL keep previous/next and carousel progress
available.

With exactly one image it SHALL hide the rail and previous/next. With none it
SHALL render no item and SHALL NOT present previous/next as available.

`ListingGallery` strip rules are unchanged by this requirement.

#### Scenario: shared-ui-auction-listing-SC-47 - Wide ListingLotGallery shows a left rail
**Serves:** Gallery strip - wide ListingLotGallery shows a left rail

- **GIVEN** `ListingLotGallery` with two or more images in a gallery column
  wide enough for a left rail beside the main frame
- **WHEN** it renders
- **THEN** a thumbnail exists for each image in a rail beside the main frame
- **AND** previous and next remain available

#### Scenario: shared-ui-auction-listing-SC-48 - Stacked ListingLotGallery hides the rail
**Serves:** Gallery strip - stacked ListingLotGallery hides the rail

- **GIVEN** `ListingLotGallery` with two or more images in a stacked gallery
  column that is not wide enough for a left rail beside the main frame
- **WHEN** it renders
- **THEN** no thumbnail rail is shown
- **AND** previous and next remain available
- **AND** carousel progress remains available

#### Scenario: shared-ui-auction-listing-SC-49 - One ListingLotGallery image has no rail
**Serves:** Gallery strip - one ListingLotGallery image has no rail

- **GIVEN** `ListingLotGallery` with exactly one image
- **WHEN** it renders
- **THEN** that image is shown
- **AND** no thumbnail rail is shown
- **AND** previous and next are not available
