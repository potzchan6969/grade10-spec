# shared/ui/auction-listing Specification

## Feature set

- Lost standing
  - Badge only: Did not win remains, with no banner

## MODIFIED Requirements

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
`authorizationRefused` props. A refused bid's words SHALL show under the bid
card's bid action, through the bid card's `authorizationStatus` and
`authorizationMessage` props, and never in the setup sheet.

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

<!-- trace:scenario id=g10.shared-auction-listing.SC-o4b rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-15 - Enrollment setup exports resolve
**Serves:** Bid enrollment - enrollment setup exports resolve

- **WHEN** an application imports `EnrollmentSetupSheet`,
  `PaymentMethodRow`, and `PaymentMethodEmptyState` from the shared UI
  package's public entry
- **THEN** every import resolves

<!-- trace:scenario id=g10.shared-auction-listing.SC-wri rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-16 - Setup continue respects card and attestation
**Serves:** Bid enrollment - setup continue respects card and attestation

- **GIVEN** `EnrollmentSetupSheet` open with `requiresIframeLink` true and
  no `iframeLinkedPayment`
- **WHEN** card entry is incomplete or age attestation is unchecked
- **THEN** continue is disabled

<!-- trace:scenario id=g10.shared-auction-listing.SC-1qn rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-17 - Change-card setup enables continue when pre-checked
**Serves:** Bid enrollment - change-card setup enables continue when pre-checked

- **GIVEN** `EnrollmentSetupSheet` open with `iframeLinkedPayment` supplied
  and `defaultAgeAttested` true
- **WHEN** it renders
- **THEN** continue is enabled without further attestation action
- **AND** the provider field area uses the linked-card placeholder copy

<!-- trace:scenario id=g10.shared-auction-listing.SC-89v rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-28 - Setup shows a link error under the card field
**Serves:** Bid enrollment - setup shows a link error under the card field

- **GIVEN** `EnrollmentSetupSheet` open with `errorMessage` supplied
- **WHEN** it renders
- **THEN** that message appears under the provider card field
- **AND** continue remains available when card entry and attestation are satisfied

<!-- trace:scenario id=g10.shared-auction-listing.SC-s3o rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-29 - Setup linking locks the sheet
**Serves:** Bid enrollment - setup linking locks the sheet

- **GIVEN** `EnrollmentSetupSheet` open with `linking` true
- **WHEN** it renders
- **THEN** the primary action uses the consumer's linking label and is busy
- **AND** the provider field and age attestation are not interactive
- **AND** dismiss is unavailable

<!-- trace:scenario id=g10.shared-auction-listing.SC-srg rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-18 - Payment row hides change when not editable
**Serves:** Bid enrollment - payment row hides change when not editable

- **GIVEN** `PaymentMethodRow` rendered without `onChange`
- **WHEN** it renders
- **THEN** the masked number and brand are shown
- **AND** no change control is shown
- **AND** the row keeps the same height as with Change shown

<!-- trace:scenario id=g10.shared-auction-listing.SC-ji6 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-30 - Linked-card label exposes hold tooltip
**Serves:** Bid enrollment - the collector reads what the linked card is for beside its label

- **GIVEN** `PaymentMethodRow` rendered with `paymentMethodTooltip` copy
- **WHEN** it renders
- **THEN** an info control beside the linked-card label exposes that tooltip copy

<!-- trace:scenario id=g10.shared-auction-listing.SC-b43 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-19 - Empty linked-card slot activates link
**Serves:** Bid enrollment - empty linked-card slot activates link

- **GIVEN** `PaymentMethodEmptyState` with `onLink` supplied
- **WHEN** the collector activates the empty-state control
- **THEN** `onLink` is called once

## RENAMED Requirements

- FROM: `### Requirement: Lost standing does not show card-release banner copy`
- TO: `### Requirement: Lost standing shows the Did not win badge alone`

### Requirement: Lost standing shows the Did not win badge alone

`ListingAuctionBidCard` SHALL NOT require a `cardRelease` copy field. When
viewer standing is lost, the card SHALL show the Did not win status treatment
and SHALL render no banner under that standing.

<!-- trace:scenario id=g10.shared-auction-listing.SC-ik3 rev=2 -->
#### Scenario: shared-ui-auction-listing-SC-46 - Lost standing shows no banner
**Serves:** Lost standing - a bidder who lost reads the badge and nothing under it

- **GIVEN** a closed listing where the viewer lost
- **WHEN** the bid card renders
- **THEN** Did not win status is shown
- **AND** no banner is shown under that standing
