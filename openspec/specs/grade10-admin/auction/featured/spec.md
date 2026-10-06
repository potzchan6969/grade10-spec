# grade10-admin/auction/featured Specification

## Purpose

Lets an authorized Grade10 auction operator curate the Featured slides that
lead the collector `/auction` catalogue: at most three ordered slots, each
binding one published Active or Upcoming lot and one front page image uploaded for
that slot.

## Feature set

- Featured slots
  - Cap of three: at most three ordered slots; no fourth is offered
  - Complete slide: a slot shows on `/auction` only when it holds both an eligible lot and its front page image
  - Eligible lots: published Active or Upcoming only; Ended cannot fill a slot
- Curation
  - Manage Featured: opened from the Listings tab beside Create listing; shows the ordered slots
  - Fill and replace: bind a published listing and upload one front page image into a slot — not a gallery pick
  - Order: reorder filled slots; site Featured follows that order
  - Clear: empty a slot so that slide leaves `/auction` Featured
- Access
  - Catalogue operators: the same grants that may publish auction listings may curate Featured

## Requirements

### Requirement: Featured holds at most three ordered slots

Featured curation SHALL offer at most three ordered slots. It SHALL NOT offer a
fourth.

| Rule | Value |
| --- | --- |
| Cap | 3 ordered slots |
| Slot contents when complete | One published Active or Upcoming lot, and one front page image uploaded for that slot |

<!-- trace:scenario id=g10adm.auction-featured.SC-fkl rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-01 - A fourth Featured slot is not offered
**Serves:** grade10-admin-auction-featured-US-01 - Operator fills a Featured slot

- **GIVEN** three Featured slots already available to the operator
- **WHEN** the operator curates Featured
- **THEN** no fourth slot is offered

### Requirement: A Featured slot is shown on the catalogue only when complete and eligible

A slot SHALL appear on `/auction` Featured only when it holds both an eligible
lot and its front page image, and the lot is published Active or Upcoming at read
time. An incomplete slot SHALL NOT appear. An Ended lot SHALL NOT fill a slot.

| Lot eligibility | May fill a slot |
| --- | --- |
| Published Active | Yes |
| Published Upcoming | Yes |
| Ended | No |
| Unpublished | No |

#### Scenario: grade10-admin-auction-featured-SC-02 - An incomplete slot is not shown on Featured
**Serves:** Featured slots - an incomplete slot never appears on the catalogue

- **GIVEN** a Featured slot that is missing its lot or its front page image
- **WHEN** `/auction` Featured is served
- **THEN** that slot does not appear as a slide

<!-- trace:scenario id=g10adm.auction-featured.SC-8hv rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-03 - An Ended lot cannot fill a Featured slot
**Serves:** grade10-admin-auction-featured-US-01 - Operator fills a Featured slot

- **GIVEN** an Ended lot
- **WHEN** an authorized operator tries to bind it into a Featured slot
- **THEN** the bind is refused
- **AND** the slot is unchanged

### Requirement: An authorized operator fills a Featured slot

An operator with Featured access SHALL bind one eligible listing and upload
one front page image into an ordered slot from Manage Featured. The front page
image SHALL be the banner background and slab for that slide. It SHALL be a
new upload for that slot. Grade10 SHALL NOT use a listing gallery image or a
campaign cover as the front page image. Replacing a slot SHALL replace its
listing and front page image.

<!-- trace:scenario id=g10adm.auction-featured.SC-xez rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-04 - An operator fills a slot with an Active lot and a front page image
**Serves:** grade10-admin-auction-featured-US-01 - Operator fills a Featured slot

- **GIVEN** an authorized auction operator and a published Active lot
- **WHEN** they bind that lot and upload one front page image into an ordered
  Featured slot
- **THEN** the slot holds that lot and that front page image
- **AND** that slide may lead `/auction` Featured

<!-- trace:scenario id=g10adm.auction-featured.SC-mag rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-05 - An operator fills a slot with an Upcoming lot and a front page image
**Serves:** grade10-admin-auction-featured-US-01 - Operator fills a Featured slot

- **GIVEN** an authorized auction operator and a published Upcoming lot
- **WHEN** they bind that lot and upload one front page image into an ordered
  Featured slot
- **THEN** the slot holds that lot and that front page image

<!-- trace:scenario id=g10adm.auction-featured.SC-l3u rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-06 - One lot cannot occupy two Featured slots
**Serves:** grade10-admin-auction-featured-US-01 - Operator fills a Featured slot

- **GIVEN** a lot already bound in one Featured slot
- **WHEN** an authorized operator tries to bind the same lot into another slot
- **THEN** the bind is refused
- **AND** the other slot is unchanged

### Requirement: An authorized operator reorders and clears Featured slots

An operator with Featured access SHALL reorder filled slots; `/auction`
Featured SHALL follow that order. Clearing a slot SHALL empty its lot and front page image
so that slide leaves `/auction` Featured.

<!-- trace:scenario id=g10adm.auction-featured.SC-u2e rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-07 - Reordering slots changes Featured order
**Serves:** grade10-admin-auction-featured-US-02 - Operator orders and clears Featured slots

- **GIVEN** two or three filled Featured slots
- **WHEN** an authorized operator reorders them
- **THEN** `/auction` Featured shows the slides in the new order

<!-- trace:scenario id=g10adm.auction-featured.SC-u1c rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-08 - Clearing a slot removes that slide from Featured
**Serves:** grade10-admin-auction-featured-US-02 - Operator orders and clears Featured slots

- **GIVEN** a filled Featured slot whose slide appears on `/auction`
- **WHEN** an authorized operator clears that slot
- **THEN** the slot holds no lot and no front page image
- **AND** that slide no longer appears in Featured

### Requirement: Manage Featured opens from the Listings tab

An authorized operator on the Listings tab SHALL open Manage Featured from a
control beside Create listing. Manage Featured SHALL list the ordered Featured
slots for fill, replace, reorder and clear.

<!-- trace:scenario id=g10adm.auction-featured.SC-ad7 rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-11 - Manage Featured opens from Listings
**Serves:** grade10-admin-auction-featured-US-01 - Operator fills a Featured slot

- **GIVEN** an authorized auction operator on the Listings tab
- **WHEN** they activate Manage Featured
- **THEN** the Manage Featured sub-page shows the ordered Featured slots

<!-- trace:scenario id=g10adm.auction-featured.SC-t75 rev=1 -->
#### Scenario: grade10-admin-auction-featured-SC-12 - Front page image is not a gallery pick
**Serves:** grade10-admin-auction-featured-US-01 - Operator fills a Featured slot

- **GIVEN** an authorized operator filling a Featured slot on Manage Featured
- **WHEN** they set the front page image
- **THEN** they upload an image for that slot
- **AND** they are not offered the listing gallery as the front page image

### Requirement: Featured curation uses auction catalogue write grants

Featured admin actions SHALL be available to callers that hold `auction:write`.
They SHALL NOT require a separate Featured-only grant for this change.

#### Scenario: grade10-admin-auction-featured-SC-09 - Auction write may curate Featured
**Serves:** Access - an auction write grant may curate Featured

- **GIVEN** an operator who holds `auction:write`
- **WHEN** they fill, reorder, or clear a Featured slot
- **THEN** those actions are allowed under that grant family

#### Scenario: grade10-admin-auction-featured-SC-10 - Without auction write Featured curation is refused
**Serves:** Access - an auction write grant may curate Featured

- **GIVEN** a caller who does not hold `auction:write`
- **WHEN** they attempt to fill, reorder, or clear a Featured slot
- **THEN** the action is refused
