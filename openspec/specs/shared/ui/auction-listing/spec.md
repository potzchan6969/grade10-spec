# shared/ui/auction-listing Specification

## Purpose
Shared auction listing blocks disclose the buyer's premium on the bid panel
before a collector commits a maximum. They are the shared listing product-page
blocks every auction storefront composes: the media gallery, the bid panel,
the bid history, and the details section. The bid history carries accepted
instants so collector activity can be localized without changing the listing's
authoritative event data.

## Feature set

- Surface exports
  - Named components: gallery, bid panel, and details from the package entry
  - Reusable parts: the gallery renders without the bid panel
- Gallery sources
  - Distinct addresses: thumbnail, main frame, and zoom each have their own source
  - Fallback to src: an omitted thumb or zoom uses the main source
- Gallery strip
  - Several items: more than one image shows a strip; one item does not
- Consumer labels
  - Supplied copy: accessible names come from the application
- Bid history
  - Accepted instants: bid rows retain the accepted time needed for formatting
  - Localized activity: recent and historical rows use the collector's locale and stated time zone
- Personal bid history
  - Named export: ListingUserBidHistory and its copy, props, and row types
  - Empty rows: the block renders nothing
  - Dialog: two peer tabs for bid-sequence and maximum rows, amount and time only, no bid-type column
  - Consumer composition: the bid card keeps the personal-bidding accessory beside recent bids
  - Supplied copy: the personal-bidding link, title, tabs, columns, and empty state come from the consumer
- Personal bidding dialog
  - Maximums tab: accepted configure and raise rows with amount and time
  - Bids tab: auto-bid sequence rows with amount and time
  - Consumer composition: the bid card keeps the personal-bidding accessory beside recent bids
  - Supplied copy: every user-visible string arrives through props
- Bid enrollment
  - Named exports: the enrollment setup blocks and the signal the bid card reads
  - Setup gates: continuing waits on a card and an attestation, and says which is missing
  - Enrollment signal: the bid card shows standing, or disables what a collector cannot yet do
- Bid card accessory
  - Optional recentBidsAccessory: trailing edge of the recent-bids header
- Buyer-fee disclosure
  - Inline rate: the bid panel names the 20% buyer fee under the bid action
  - No tooltip: the fee copy does not carry a buyer-fee tooltip slot
- Quick bids
  - Increment steps: three chips at 1×, 2×, and 4× the listing increment
  - Leader base: chips add those steps to the committed maximum
  - Field base: chips add those steps to the current public bid
- Raise floor
  - Leader minimum: a typed raise starts at the maximum plus 100 minor units
  - Separate from chips: the first chip is not that typed minimum
- Lost standing
  - Badge only: Did not win remains; no authorization-release banner

## Requirements

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
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves

#### Scenario: shared-ui-auction-listing-SC-02 - A part is reused alone
**Serves:** Surface exports - a part is reused alone

- **WHEN** an application renders `ListingGallery` without `ListingAuctionBidCard`
  or `ListingDetails`
- **THEN** it renders and behaves as specified, with no missing-context error

### Requirement: A gallery image has distinct thumbnail, main, and zoom sources

`ListingGalleryImage` SHALL accept `src` for the main frame, `thumbSrc` for
the thumbnail strip, `zoomSrc` for the zoom dialog, `alt` as the accessible
name, and optional `thumbLabel` as the thumbnail's accessible name (falling
back to `alt`). When `thumbSrc` or `zoomSrc` is omitted, that slot SHALL use
`src`. The gallery SHALL NOT fetch, derive, or rewrite those addresses.

#### Scenario: shared-ui-auction-listing-SC-03 - Distinct sources are used in each slot
**Serves:** Gallery sources - distinct sources are used in each slot

- **GIVEN** a gallery image whose `thumbSrc`, `src`, and `zoomSrc` are three
  different addresses
- **WHEN** it is rendered with at least one other image (so the strip is
  shown) and the collector opens zoom
- **THEN** the thumbnail requests `thumbSrc`
- **AND** the main frame requests `src`
- **AND** the zoom dialog requests `zoomSrc`

#### Scenario: shared-ui-auction-listing-SC-04 - Omitted sources fall back to src
**Serves:** Gallery sources - omitted sources fall back to src

- **GIVEN** a gallery image that supplies only `src` and `alt`
- **WHEN** it is rendered
- **THEN** the main frame, and zoom, request `src`

### Requirement: The gallery matches how many items it was given

`ListingGallery` SHALL render the gallery items in the order supplied. With
two or more items it SHALL show a thumbnail strip and enable previous/next.
With exactly one item it SHALL hide the strip and disable previous/next. With
none it SHALL render no item and SHALL NOT present previous/next as available.

#### Scenario: shared-ui-auction-listing-SC-05 - Several gallery items show a strip
**Serves:** Gallery strip - several gallery items show a strip

- **GIVEN** two or more gallery items
- **WHEN** the gallery renders
- **THEN** a thumbnail exists for each item
- **AND** previous and next are enabled

#### Scenario: shared-ui-auction-listing-SC-06 - One gallery item has no strip
**Serves:** Gallery strip - one gallery item has no strip

- **GIVEN** exactly one gallery item
- **WHEN** the gallery renders
- **THEN** that item is shown
- **AND** no thumbnail strip is shown
- **AND** previous and next are disabled

#### Scenario: shared-ui-auction-listing-SC-07 - No gallery items
**Serves:** Gallery strip - no gallery items

- **GIVEN** an empty gallery list
- **WHEN** the gallery renders
- **THEN** no item is shown
- **AND** previous and next are not available

### Requirement: A control has no copy of its own

`ListingGallery` SHALL receive a required `copy` object
(`ListingGalleryCopy`) with `zoom`, `previous`, and `next` from the consumer.
It SHALL NOT supply default user-visible copy for those slots.

#### Scenario: shared-ui-auction-listing-SC-08 - Labels come from the consumer
**Serves:** Consumer labels - labels come from the consumer

- **GIVEN** a gallery rendered with
  `copy={{ zoom: "Click to zoom", previous: "Previous image", next: "Next image" }}`
- **WHEN** it renders
- **THEN** those strings are the accessible names and visible zoom hint
- **AND** no other language appears in those slots

### Requirement: Extension explanation copy reflects the listing policy

`ListingAuctionBidCard` and `ListingAuctionCardSidebar` SHALL receive extension
explanation copy from the consumer. They SHALL NOT hardcode extension duration
minutes.

When extension is armed on a listing, the consumer SHALL supply copy for the
Time left explanation and any extended-bidding row that names that listing's
**extension duration** (and optional extension cap). The copy SHALL NOT name an
extension window. The shared components SHALL render the supplied strings as
given.

When the listing is in extended bidding, consumer copy for the Time left label
SHALL be **Time left (extended)** (or the locale equivalent).

#### Scenario: shared-ui-auction-listing-SC-14 - Extension copy comes from the consumer
**Serves:** Consumer labels - extension copy comes from the consumer

- **GIVEN** a live listing whose extension duration is 1800 seconds
- **WHEN** an application renders the bid card with copy naming a 30-minute
  post-close timer restart and no extension window
- **THEN** the Time left explanation shows that duration-only wording
- **AND** no hardcoded "30 minutes" window, and no extension-window minutes,
  appear in that slot

#### Scenario: shared-ui-auction-listing-SC-14a - Extended label while in extended bidding
**Serves:** Consumer labels - extended label while in extended bidding

- **GIVEN** a live listing in extended bidding
- **WHEN** an application renders the bid card with `extended` on and the
  Time left label copy **Time left (extended)**
- **THEN** that label is visible beside the countdown

### Requirement: Bid history rows carry accepted instants

`ListingBidHistoryRow` SHALL carry `acceptedAtMs: number` and MAY carry
`timeOverride?: string` for states that are not a timestamp.

`ListingUserBidHistoryRow` SHALL carry `acceptedAtMs: number` and MAY carry
`timeOverride?: string`.

#### Scenario: auction-listing-SC-22 - A bid row preserves its accepted instant
**Serves:** Bid history - a bid row preserves its accepted instant

- **GIVEN** a bid history row with an accepted instant and a row representing a non-timestamp state
- **WHEN** the rows are passed to the bid history surface
- **THEN** the accepted row provides its `acceptedAtMs` for activity-time formatting
- **AND** the non-timestamp row may provide `timeOverride` for its displayed state

### Requirement: Bid history components format activity time

`ListingBidHistoryList` and `ListingUserBidHistory` SHALL require `locale`,
`timeZone`, and `activityTimeCopy` and SHALL format each row with the platform
activity-time rules unless `timeOverride` is set.

`ListingAuctionBidCard` and `ListingAuctionCardSidebar` SHALL require `locale`
and `timeZone` and SHALL thread them to bid history and the collector deadline
line.

#### Scenario: auction-listing-SC-13 - Recent bids show localized activity time
**Serves:** Bid history - recent bids show localized activity time

- **GIVEN** a bid card with history rows carrying `acceptedAtMs`
- **WHEN** it renders with a shipped locale and time zone
- **THEN** each row shows a formatted activity time
- **AND** no row shows a raw millisecond value

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
**Serves:** Bid enrollment - enrollment setup exports resolve

- **WHEN** an application imports `EnrollmentSetupSheet`,
  `PaymentMethodRow`, and `PaymentMethodEmptyState` from the shared UI
  package's public entry
- **THEN** every import resolves

#### Scenario: shared-ui-auction-listing-SC-16 - Setup continue respects card and attestation
**Serves:** Bid enrollment - setup continue respects card and attestation

- **GIVEN** `EnrollmentSetupSheet` open with `requiresIframeLink` true and
  no `iframeLinkedPayment`
- **WHEN** card entry is incomplete or age attestation is unchecked
- **THEN** continue is disabled

#### Scenario: shared-ui-auction-listing-SC-17 - Change-card setup enables continue when pre-checked
**Serves:** Bid enrollment - change-card setup enables continue when pre-checked

- **GIVEN** `EnrollmentSetupSheet` open with `iframeLinkedPayment` supplied
  and `defaultAgeAttested` true
- **WHEN** it renders
- **THEN** continue is enabled without further attestation action
- **AND** the provider field area uses the linked-card placeholder copy

#### Scenario: shared-ui-auction-listing-SC-28 - Setup shows a link error under the card field
**Serves:** Bid enrollment - setup shows a link error under the card field

- **GIVEN** `EnrollmentSetupSheet` open with `errorMessage` supplied
- **WHEN** it renders
- **THEN** that message appears under the provider card field
- **AND** continue remains available when card entry and attestation are satisfied

#### Scenario: shared-ui-auction-listing-SC-29 - Setup linking locks the sheet
**Serves:** Bid enrollment - setup linking locks the sheet

- **GIVEN** `EnrollmentSetupSheet` open with `linking` true
- **WHEN** it renders
- **THEN** the primary action uses the consumer's linking label and is busy
- **AND** the provider field and age attestation are not interactive
- **AND** dismiss is unavailable

#### Scenario: shared-ui-auction-listing-SC-18 - Payment row hides change when not editable
**Serves:** Bid enrollment - payment row hides change when not editable

- **GIVEN** `PaymentMethodRow` rendered without `onChange`
- **WHEN** it renders
- **THEN** the masked number and brand are shown
- **AND** no change control is shown
- **AND** the row keeps the same height as with Change shown

#### Scenario: shared-ui-auction-listing-SC-30 - Linked-card label exposes hold tooltip
**Serves:** Bid enrollment - linked-card label exposes hold tooltip

- **GIVEN** `PaymentMethodRow` rendered with `paymentMethodTooltip` copy
- **WHEN** it renders
- **THEN** an info control beside the linked-card label exposes that tooltip copy

#### Scenario: shared-ui-auction-listing-SC-19 - Empty linked-card slot activates link
**Serves:** Bid enrollment - empty linked-card slot activates link

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
**Serves:** Bid enrollment - signed-out enrollment hides standing badges

- **GIVEN** a bid card with `bidEnrollment` `signed-out` and standing
  content that would show highest bid or outbid
- **WHEN** the card renders
- **THEN** standing badges are not shown

#### Scenario: shared-ui-auction-listing-SC-21 - Ready enrollment shows standing when supplied
**Serves:** Bid enrollment - ready enrollment shows standing when supplied

- **GIVEN** a bid card with `bidEnrollment` `ready` and outbid standing
  content
- **WHEN** the card renders
- **THEN** the outbid standing badge is shown

#### Scenario: shared-ui-auction-listing-SC-26 - Needs-card disables amount controls
**Serves:** Bid enrollment - needs-card disables amount controls

- **GIVEN** a bid card with `bidEnrollment` `needs-card`
- **WHEN** it renders
- **THEN** quick-bid presets and the custom maximum field are visible and not interactive
- **AND** the primary bid action uses the consumer's link-card label

#### Scenario: shared-ui-auction-listing-SC-27 - Needs-card primary action opens setup
**Serves:** Bid enrollment - needs-card primary action opens setup

- **GIVEN** a bid card with `bidEnrollment` `needs-card` and an open-setup callback
- **WHEN** the collector activates the primary bid action
- **THEN** the open-setup callback is invoked once
- **AND** `onCommitMaximum` is not invoked

### Requirement: The listing surface exports user bid history

The shared UI package SHALL export, from its public entry,
`ListingUserBidHistory` and these types: `ListingUserBidHistoryProps`,
`ListingUserBidHistoryCopy`, and `ListingUserBidHistoryRow`.

`ListingUserBidHistory` SHALL receive a required `copy` object and a `rows`
array. It SHALL supply no default user-visible copy. When `rows` is empty it
SHALL render nothing.

When `rows` is non-empty it SHALL render a link trigger using `copy.link`.
Activating the link SHALL open a dialog titled with `copy.title`, showing
`copy.samePricePriority` as dialog description (equal maxima are ranked by
submission time — earlier wins), and a table with column headers
`copy.amount` and `copy.time`. Each row SHALL show the consumer-supplied
`amountLabel` and formatted time from `acceptedAtMs` (or `timeOverride`).
The table SHALL NOT include a bid-type column. Long histories SHALL scroll
inside the dialog body while the dialog title, description, and close control
remain fixed.

#### Scenario: shared-ui-auction-listing-SC-09 - A signed-in user opens personal bid history
**Serves:** Personal bid history - a signed-in user opens personal bid history

- **GIVEN** `ListingUserBidHistory` rendered with at least one row
- **WHEN** the collector activates the link
- **THEN** a dialog opens showing the same-price priority description and a
  table with amount and time for each supplied row
- **AND** no bid-type column or type badge is shown
- **AND** the dialog closes via the close control or Escape

#### Scenario: shared-ui-auction-listing-SC-10 - No rows means no link
**Serves:** Personal bid history - no rows means no link

- **GIVEN** `ListingUserBidHistory` rendered with an empty `rows` array
- **WHEN** it renders
- **THEN** no link or dialog is shown

#### Scenario: shared-ui-auction-listing-SC-11 - Long history scrolls inside the dialog
**Serves:** Personal bid history - long history scrolls inside the dialog

- **GIVEN** `ListingUserBidHistory` rendered with more rows than fit the dialog
  viewport and the dialog open
- **WHEN** the collector scrolls
- **THEN** the table scrolls inside the dialog body
- **AND** the dialog title and same-price priority description remain visible

### Requirement: The auction bid card accepts a recent-bids accessory

`ListingAuctionBidCard` SHALL accept an optional `recentBidsAccessory` node.
When supplied, it SHALL render that node on the trailing edge of the recent-bids
section header. It SHALL NOT require `recentBidsAccessory` to render.

#### Scenario: shared-ui-auction-listing-SC-12 - An accessory composes beside recent bids
**Serves:** Bid card accessory - an accessory composes beside recent bids

- **GIVEN** a bid card with a recent-bids section and a non-empty
  `recentBidsAccessory`
- **WHEN** the card renders
- **THEN** the accessory appears beside the recent-bids label
- **AND** the public recent-bids list below is unchanged

### Requirement: Lost standing does not show card-release banner copy

`ListingAuctionBidCard` SHALL NOT require a `cardRelease` copy field. When
viewer standing is lost, the card SHALL show the Did not win status treatment
and SHALL NOT render authorization-release banner copy under that standing.

#### Scenario: shared-ui-auction-listing-SC-46 - Lost standing omits release banner
**Serves:** Lost standing - lost standing omits the release banner

- **GIVEN** a closed listing where the viewer lost
- **WHEN** the bid card renders
- **THEN** Did not win status is shown
- **AND** no card-authorization-release banner copy is shown

### Requirement: The listing surface exports personal bidding history

The shared UI package SHALL export, from its public entry,
`ListingUserBidHistory` and these types: `ListingUserBidHistoryProps`,
`ListingUserBidHistoryCopy`, `ListingUserBidHistoryRow`, and
`ListingUserMaximumHistoryRow`.

`ListingUserBidHistory` SHALL receive a required `copy` object,
`maximumRows`, and `bidRows`. It SHALL supply no default user-visible copy.
When both `maximumRows` and `bidRows` are empty it SHALL render nothing.

When either list is non-empty it SHALL render a link trigger using
`copy.link`. Activating the link SHALL open a dialog titled with `copy.title`,
showing `copy.description` as dialog description and two peer tabs in order
labeled `copy.bidsTab` then `copy.maximumsTab`. The dialog SHALL NOT render a
sticky current-maximum summary; the live private maximum remains on the bid
panel outside this block.

The **Bid placed** tab SHALL render a table with column headers
`copy.bidAmount` and `copy.time`. Each `ListingUserBidHistoryRow` SHALL show
`amountLabel` and formatted time from `acceptedAtMs` (or `timeOverride`). The
**Your maximums** tab SHALL render a table with column headers
`copy.maximumAmount` and `copy.time`. Each `ListingUserMaximumHistoryRow`
SHALL show the consumer-supplied `amountLabel` and formatted time from
`acceptedAtMs` (or `timeOverride`) only. It SHALL NOT show a Set, Raised, or
other status word on the row. Neither tab table SHALL include a bid-type
column.

The dialog SHALL select `copy.bidsTab` as the initial active tab whenever it
opens, including when `bidRows` is empty. When `bidRows` is empty and that tab
is active, it SHALL show a frameless design-system `EmptyState` using
`copy.emptyBidsTitle` and `copy.emptyBidsDescription`. Title, description, and tab list
SHALL stay fixed while only the active table scrolls inside the dialog body.

`ListingUserBidHistoryRow` and `ListingUserMaximumHistoryRow` SHALL each carry
`acceptedAtMs: number` and MAY carry `timeOverride?: string`.
`ListingUserBidHistory` SHALL continue to require `locale`, `timeZone`, and
`activityTimeCopy` and SHALL format each row with the platform activity-time
rules unless `timeOverride` is set.

This requirement supersedes the single-table personal bid-history dialog shape
previously proposed under `add-lot-user-bid-history`.

#### Scenario: shared-ui-auction-listing-SC-31 - Collector opens Your bidding with both lists
**Serves:** Personal bidding dialog - collector opens Your bidding with both lists

- **GIVEN** `ListingUserBidHistory` rendered with at least one maximum row and
  at least one bid-sequence row
- **WHEN** the collector activates the link
- **THEN** a dialog opens titled from `copy.title`
- **AND** the dialog shows no sticky current-maximum summary
- **AND** the initial tab is the bids tab
- **AND** the tab order is bids tab, then maximums tab
- **AND** each tab shows only its own amount and time columns with no bid-type
  column
- **AND** the dialog closes via the close control or Escape

#### Scenario: shared-ui-auction-listing-SC-32 - Bid placed stays the default when no bids were placed
**Serves:** Personal bidding dialog - bid placed stays the default when no bids were placed

- **GIVEN** `ListingUserBidHistory` rendered with at least one maximum row and
  an empty `bidRows` array
- **WHEN** the collector opens the dialog
- **THEN** the initial tab is the bids tab and shows a frameless `EmptyState`
  with `copy.emptyBidsTitle` and `copy.emptyBidsDescription`
- **AND** activating the maximums tab shows the supplied maximum rows

#### Scenario: shared-ui-auction-listing-SC-33 - No personal rows means no link
**Serves:** Personal bidding dialog - no personal rows means no link

- **GIVEN** `ListingUserBidHistory` rendered with empty `maximumRows` and empty
  `bidRows`
- **WHEN** it renders
- **THEN** no link or dialog is shown

#### Scenario: shared-ui-auction-listing-SC-34 - Active tab scrolls under a fixed chrome
**Serves:** Personal bidding dialog - active tab scrolls under a fixed chrome

- **GIVEN** `ListingUserBidHistory` rendered with more rows on the active tab
  than fit the dialog viewport and the dialog open
- **WHEN** the collector scrolls
- **THEN** only the active table scrolls inside the dialog body
- **AND** the dialog title, description, and tab list remain visible

### Requirement: Custom maximum entry is whole major units only

`ListingAuctionBidCard` SHALL accept a custom private-maximum draft only as a
whole count of major units in the listing currency. The field SHALL refuse a
typed decimal mark so it never appears in the draft. A pasted string that
holds a decimal mark and fraction SHALL become the integer major-unit digits
before that mark (no rounding). The presence of a discarded fraction alone
SHALL NOT be treated as an invalid amount.

Committed amounts remain an integer count of minor units: each whole major
unit maps by the currency's ISO 4217 exponent.

#### Scenario: shared-ui-auction-listing-SC-24 - A typed decimal mark is refused
**Serves:** Bid enrollment - a typed decimal mark is refused

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `100`
- **WHEN** a collector types `.` into the custom maximum field
- **THEN** the draft remains `100`
- **AND** the decimal mark does not appear in the field

#### Scenario: shared-ui-auction-listing-SC-25 - A pasted fractional amount falls back to the integer major units
**Serves:** Bid enrollment - a pasted fractional amount falls back to the integer major units

- **GIVEN** an HKD listing bid panel with the custom maximum field empty
- **WHEN** a collector pastes `208000.99` into the custom maximum field
- **THEN** the draft shown is `208000`
- **AND** no invalid-amount message appears solely because the paste held a
  fraction

### Requirement: Quick-bid chips step the listing increment

`ListingAuctionBidCard` SHALL offer three quick-bid amounts: 1×, 2×, and 4×
the listing increment supplied on the view.

When the viewer leads with a committed maximum, those amounts SHALL be that
maximum plus those multiples. When the viewer does not lead, they SHALL be
the current bid plus those multiples.

The first chip SHALL NOT be replaced by the typed raise floor.

#### Scenario: shared-ui-auction-listing-SC-35 - A leader's chips step from the committed max
**Serves:** Quick bids - a leader's chips step from the committed max

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer leads with a maximum of
  200000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 204000, 208000, and 216000 HKD minor units

#### Scenario: shared-ui-auction-listing-SC-36 - A collector who does not lead steps from the current bid
**Serves:** Quick bids - a collector who does not lead steps from the current bid

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer has a maximum of 116000
  minor units and does not lead
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 124000, 128000, and 136000 HKD minor units

### Requirement: A leader's typed raise floor is max plus 100 minor units

When the viewer leads with a committed maximum and the current bid is below
that maximum, `ListingAuctionBidCard` SHALL set the custom-maximum minimum to
the greater of the listing's minimum next bid and that maximum plus 100
minor units. That floor SHALL NOT be used as the first quick-bid amount.

#### Scenario: shared-ui-auction-listing-SC-37 - A leader's typed minimum stays max plus $1
**Serves:** Raise floor - a leader's typed minimum stays max plus $1

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, whose minimum next bid is 124000 minor
  units, and whose viewer leads with a maximum of 200000 minor units
- **WHEN** the bid card renders the custom maximum field
- **THEN** the field's minimum is 200100 HKD minor units
- **AND** the first quick-bid amount remains 204000 HKD minor units

### Requirement: Bid card discloses the buyer fee inline

The bid card names the buyer fee under the bid action, in plain sight, to a
signed-in collector.

**Inline rate** - `ListingAuctionBidCard` SHALL render always-on secondary copy
under the primary bid action that states a 20% buyer fee is added on top of
the winning bid.

**Consumer copy** - The string SHALL come from consumer copy (`buyerFeeHint`).

**No tooltip** - The copy type SHALL NOT include a `buyerFeeTooltip` field, and
the card SHALL NOT gate that rate behind an info tooltip.

**Signed out** - When `bidEnrollment` is `signed-out`, the fee line SHALL be
omitted with the bid action.

#### Scenario: shared-ui-auction-listing-SC-44 - Buyer fee shows inline at 20%
**Serves:** Buyer-fee disclosure - the buyer fee shows inline at 20%

- **GIVEN** a signed-in collector on an open listing bid card
- **WHEN** the bid panel footer renders
- **THEN** secondary copy under the bid action states that a 20% buyer fee is
  added on top of the winning bid
- **AND** no buyer-fee info tooltip is present

#### Scenario: shared-ui-auction-listing-SC-45 - Signed-out panel omits the fee line
**Serves:** Buyer-fee disclosure - a signed-out panel omits the fee line

- **GIVEN** a bid card with `bidEnrollment` `signed-out`
- **WHEN** it renders
- **THEN** the buyer-fee line is absent
