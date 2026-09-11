## ADDED Requirements

### Requirement: The listing surface exports bid enrollment blocks

The shared UI package SHALL export, from its public entry,
`EnrollmentSetupSheet`, `PaymentMethodRow`, and `PaymentMethodEmptyState`.

`EnrollmentSetupSheet` SHALL receive `open`, optional `onOpenChange`, optional
`onContinue`, optional `requiresIframeLink`, optional
`iframeLinkedPayment` (brand and masked number for the change-card
placeholder), optional `defaultAgeAttested`, optional `errorMessage`,
optional `linking`, optional `stripePaymentMethodField`, and optional
`paymentMethodReady`. When `errorMessage` is supplied and `linking` is not
true, it SHALL render that string as a tiny destructive message left-aligned
under the provider card field with 8px spacing. When `linking` is true, it
SHALL lock the provider field and age attestation, hide the dismiss control,
refuse close via `onOpenChange`, and show a loading primary action using the
consumer's linking label. When `stripePaymentMethodField` is supplied, it
SHALL render that node in place of the placeholder and SHALL treat card
readiness as `paymentMethodReady`. It SHALL receive all user-visible copy
through props or a dedicated copy object the export names; it SHALL supply no
default user-visible copy. It SHALL NOT accept `authorizing` or
`authorizationRefused` props; authorization pending and refusal belong on the
bid-commit surface under `grade10-site/auction/bid-payment-method`.

`PaymentMethodRow` SHALL receive a payment brand, masked number, optional
`onChange`, and copy that includes `paymentMethod` plus
`paymentMethodTooltip`. It SHALL render an info control beside the linked-card
label whose tooltip content is `paymentMethodTooltip`. When `onChange` is
omitted, it SHALL render the linked card without a change control and SHALL
keep the same row height as when Change is shown.

`PaymentMethodEmptyState` SHALL receive optional `onLink` and the same
linked-card label copy including `paymentMethodTooltip`. It SHALL render an
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

#### Scenario: shared-ui-auction-listing-SC-28 - Setup shows a link error under the card field

- **GIVEN** `EnrollmentSetupSheet` open with `errorMessage` supplied
- **WHEN** it renders
- **THEN** that message appears under the provider card field
- **AND** continue remains available when card entry and attestation are satisfied

#### Scenario: shared-ui-auction-listing-SC-29 - Setup linking locks the sheet

- **GIVEN** `EnrollmentSetupSheet` open with `linking` true
- **WHEN** it renders
- **THEN** the primary action uses the consumer's linking label and is busy
- **AND** the provider field and age attestation are not interactive
- **AND** dismiss is unavailable

#### Scenario: shared-ui-auction-listing-SC-18 - Payment row hides change when not editable

- **GIVEN** `PaymentMethodRow` rendered without `onChange`
- **WHEN** it renders
- **THEN** the masked number and brand are shown
- **AND** no change control is shown
- **AND** the row keeps the same height as with Change shown

#### Scenario: shared-ui-auction-listing-SC-30 - Linked-card label exposes hold tooltip

- **GIVEN** `PaymentMethodRow` rendered with `paymentMethodTooltip` copy
- **WHEN** it renders
- **THEN** an info control beside the linked-card label exposes that tooltip copy

#### Scenario: shared-ui-auction-listing-SC-19 - Empty linked-card slot activates link

- **GIVEN** `PaymentMethodEmptyState` with `onLink` supplied
- **WHEN** the collector activates the empty-state control
- **THEN** `onLink` is called once

### Requirement: The auction bid card accepts an enrollment signal

`ListingAuctionBidCard` and its field primitives SHALL accept an optional
`bidEnrollment` value of `signed-out`, `needs-card`, or `ready`. When
`signed-out`, the primary bid action SHALL use the consumer's sign-in label
and SHALL NOT offer place bid or link a card. When `needs-card`, quick-bid
presets and the custom maximum field SHALL render disabled; the primary bid
action SHALL use the consumer's link-card label and SHALL invoke the
consumer's open-setup callback (for example `onPlaceBid`) rather than
`onCommitMaximum`. When `ready` or omitted, the card SHALL use the
consumer's place-bid or commit-maximum labels with enabled amount controls.
Standing banners SHALL render only when `bidEnrollment` is not `signed-out`
and the consumer supplies standing content.

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

#### Scenario: shared-ui-auction-listing-SC-26 - Needs-card disables amount controls

- **GIVEN** a bid card with `bidEnrollment` `needs-card`
- **WHEN** it renders
- **THEN** quick-bid presets and the custom maximum field are visible and not interactive
- **AND** the primary bid action uses the consumer's link-card label

#### Scenario: shared-ui-auction-listing-SC-27 - Needs-card primary action opens setup

- **GIVEN** a bid card with `bidEnrollment` `needs-card` and an open-setup callback
- **WHEN** the collector activates the primary bid action
- **THEN** the open-setup callback is invoked once
- **AND** `onCommitMaximum` is not invoked

## MODIFIED Requirements

### Requirement: The listing surface exports

The shared UI package SHALL export, from its public entry, these components
for the listing product page — `ListingGallery`, `ListingAuctionBidCard`, and
`ListingDetails` — and these types: `ListingGalleryImage`,
`ListingGalleryProps`, `ListingGalleryCopy`, `ListingAuctionBidCardProps`,
`ListingAuctionBidCardCopy`, `ListingDetailsFact`, `ListingDetailsSection`,
`ListingDetailsProps`, and `ListingDetailsCopy`.

Each of those components SHALL be renderable on its own, so a later surface can
reuse the gallery without the bid panel.

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
