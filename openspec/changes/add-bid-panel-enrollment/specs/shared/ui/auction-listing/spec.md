## ADDED Requirements

### Requirement: The listing surface exports bid enrollment blocks

The shared UI package SHALL export, from its public entry,
`EnrollmentSetupSheet`, `PaymentMethodRow`, and `PaymentMethodEmptyState`.

`EnrollmentSetupSheet` SHALL receive `open`, optional `onOpenChange`, optional
`onContinue`, optional `requiresIframeLink`, optional
`iframeLinkedPayment` (brand and masked number for the change-card
placeholder), optional `defaultAgeAttested`, optional `authorizing`, and
optional `authorizationRefused`. When `authorizing` is true, it SHALL keep
the same title and description copy, disable the provider field and age
attestation, show the authorizing continue label in a loading state, and
show the authorizing status as an inline alert. When
`authorizationRefused` is true, it SHALL keep the same title and description
copy, show the refused authorization alert inline, keep the provider field
and age attestation interactive, and keep continue available. It SHALL
receive all user-visible copy through props or a dedicated copy object the
export names; it SHALL supply no default user-visible copy.

`PaymentMethodRow` SHALL receive a payment brand, masked number, and optional
`onChange`. When `onChange` is omitted, it SHALL render the linked card
without a change control.

`PaymentMethodEmptyState` SHALL receive optional `onLink` and SHALL render an
empty linked-card prompt that activates `onLink` when supplied.

None of these blocks SHALL fetch, persist, or subscribe to product state.

#### Scenario: shared-ui-auction-listing-SC-15 - Enrollment setup exports resolve

- **WHEN** an application imports `EnrollmentSetupSheet`,
  `PaymentMethodRow`, and `PaymentMethodEmptyState` from the shared UI
  package's public entry
- **THEN** every import resolves

#### Scenario: shared-ui-auction-listing-SC-16 - Setup continue respects card and attestation

- **GIVEN** `EnrollmentSetupSheet` open with `requiresIframeLink` true and
  no `iframeLinkedPayment`
- **WHEN** card entry is incomplete or age attestation is unchecked
- **THEN** continue is disabled

#### Scenario: shared-ui-auction-listing-SC-17 - Change-card setup enables continue when pre-checked

- **GIVEN** `EnrollmentSetupSheet` open with `iframeLinkedPayment` supplied
  and `defaultAgeAttested` true
- **WHEN** it renders
- **THEN** continue is enabled without further attestation action
- **AND** the provider field area uses the linked-card placeholder copy

#### Scenario: shared-ui-auction-listing-SC-22 - Authorizing locks setup controls

- **GIVEN** `EnrollmentSetupSheet` open with `authorizing` true
- **WHEN** it renders
- **THEN** continue shows the authorizing label in a loading state
- **AND** the provider field and age attestation are not interactive
- **AND** the authorizing status alert is shown inline

#### Scenario: shared-ui-auction-listing-SC-23 - Refused authorization keeps setup interactive

- **GIVEN** `EnrollmentSetupSheet` open with `authorizationRefused` true
- **WHEN** it renders
- **THEN** the refused authorization alert is shown
- **AND** continue remains available as Authorize
- **AND** the provider field and age attestation stay interactive

#### Scenario: shared-ui-auction-listing-SC-18 - Payment row hides change when not editable

- **GIVEN** `PaymentMethodRow` rendered without `onChange`
- **WHEN** it renders
- **THEN** the masked number and brand are shown
- **AND** no change control is shown

#### Scenario: shared-ui-auction-listing-SC-19 - Empty linked-card slot activates link

- **GIVEN** `PaymentMethodEmptyState` with `onLink` supplied
- **WHEN** the collector activates the empty-state control
- **THEN** `onLink` is called once

### Requirement: The auction bid card accepts an enrollment signal

`ListingAuctionBidCard` and its field primitives SHALL accept an optional
`bidEnrollment` value of `signed-out` or `ready`. When `signed-out`, the
primary bid action SHALL use the consumer's sign-in label and SHALL NOT offer
place bid. When `ready` or omitted, the card SHALL use the consumer's place-bid
or commit-maximum labels. Standing banners SHALL render only when
`bidEnrollment` is not `signed-out` and the consumer supplies standing
content.

#### Scenario: shared-ui-auction-listing-SC-20 - Signed-out enrollment hides standing badges

- **GIVEN** a bid card with `bidEnrollment` `signed-out` and standing
  content that would show highest bid or outbid
- **WHEN** the card renders
- **THEN** standing badges are not shown

#### Scenario: shared-ui-auction-listing-SC-21 - Ready enrollment shows standing when supplied

- **GIVEN** a bid card with `bidEnrollment` `ready` and outbid standing
  content
- **WHEN** the card renders
- **THEN** the outbid standing badge is shown

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, these components
for the listing product page — `ListingGallery`, `ListingAuctionBidCard`, and
`ListingDetails` — and these types: `ListingGalleryImage`,
`ListingGalleryProps`, `ListingGalleryCopy`, `ListingAuctionBidCardProps`,
`ListingAuctionBidCardCopy`, `ListingDetailsFact`, `ListingDetailsSection`,
`ListingDetailsProps`, and `ListingDetailsCopy`.

Each of those components SHALL be renderable on its own, so a later surface can
reuse the gallery without the bid card.

#### Scenario: shared-ui-auction-listing-SC-01 - An application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves

#### Scenario: shared-ui-auction-listing-SC-02 - A part is reused alone

- **WHEN** an application renders `ListingGallery` without `ListingAuctionBidCard`
  or `ListingDetails`
- **THEN** it renders and behaves as specified, with no missing-context error

### Requirement: Extension explanation copy reflects the listing policy

`ListingAuctionBidCard` and `ListingAuctionCardSidebar` SHALL receive extension
explanation copy from the consumer. They SHALL NOT hardcode extension window
or duration minutes.

When extension is armed on a listing, the consumer SHALL supply copy for the
Time left explanation and any extended-bidding row that names that listing's
extension window and extension duration. The shared components SHALL render
the supplied strings as given.

#### Scenario: shared-ui-auction-listing-SC-14 - Extension copy comes from the consumer

- **GIVEN** a live listing whose extension window is 300 seconds and extension
  duration is 900 seconds
- **WHEN** an application renders the bid card with copy naming a 5-minute
  window and a 15-minute extension
- **THEN** the Time left explanation shows those values
- **AND** no hardcoded "30 minutes" appears in that slot
