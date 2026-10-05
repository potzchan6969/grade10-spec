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
  - Setup gates: continuing waits on a card and an attestation
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
  - Opening base: before any bid, chip 1x is the opening price, the next eligible bid
- Raise floor
  - Leader minimum: a typed raise starts at the maximum plus 100 minor units
  - Separate from chips: the first chip is not that typed minimum
- Lost standing
  - Badge only: Did not win remains, with no banner
- Custom maximum ceiling
  - Major-unit cap: draft cannot exceed 9,999,999,999 whole major units
  - Restore on overshoot: paste or keystroke that would exceed leaves the previous valid draft
  - No ceiling error copy: refuse is silent, same feel as refusing a decimal mark
- Public bid history outcome
  - Winner crown: closed sold winning row shows a primary crown after the amount
  - Equal-max tip: a row tied on amount with a row above it shows an Info tip in the amount tone
  - Live lots: no winner crown

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

<!-- trace:scenario id=g10.shared-auction-listing.SC-emk rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-01 - An application imports the surface
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports each name above from the shared UI package's
  public entry
- **THEN** every import resolves

<!-- trace:scenario id=g10.shared-auction-listing.SC-i3i rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-v9a rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-03 - Distinct sources are used in each slot
**Serves:** Gallery sources - distinct sources are used in each slot

- **GIVEN** a gallery image whose `thumbSrc`, `src`, and `zoomSrc` are three
  different addresses
- **WHEN** it is rendered with at least one other image (so the strip is
  shown) and the collector opens zoom
- **THEN** the thumbnail requests `thumbSrc`
- **AND** the main frame requests `src`
- **AND** the zoom dialog requests `zoomSrc`

<!-- trace:scenario id=g10.shared-auction-listing.SC-4sr rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-e6o rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-05 - Several gallery items show a strip
**Serves:** Gallery strip - several gallery items show a strip

- **GIVEN** two or more gallery items
- **WHEN** the gallery renders
- **THEN** a thumbnail exists for each item
- **AND** previous and next are enabled

<!-- trace:scenario id=g10.shared-auction-listing.SC-96b rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-06 - One gallery item has no strip
**Serves:** Gallery strip - one gallery item has no strip

- **GIVEN** exactly one gallery item
- **WHEN** the gallery renders
- **THEN** that item is shown
- **AND** no thumbnail strip is shown
- **AND** previous and next are disabled

<!-- trace:scenario id=g10.shared-auction-listing.SC-1a8 rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-ogg rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-0gu rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-14 - Extension copy comes from the consumer
**Serves:** Consumer labels - extension copy comes from the consumer

- **GIVEN** a live listing whose extension duration is 1800 seconds
- **WHEN** an application renders the bid card with copy naming a 30-minute
  post-close timer restart and no extension window
- **THEN** the Time left explanation shows that duration-only wording
- **AND** no hardcoded "30 minutes" window, and no extension-window minutes,
  appear in that slot

<!-- trace:scenario id=g10.shared-auction-listing.SC-ptk rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-as2 rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-9gi rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-z9r rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-20 - Signed-out enrollment hides standing badges
**Serves:** Bid enrollment - signed-out enrollment hides standing badges

- **GIVEN** a bid card with `bidEnrollment` `signed-out` and standing
  content that would show highest bid or outbid
- **WHEN** the card renders
- **THEN** standing badges are not shown

<!-- trace:scenario id=g10.shared-auction-listing.SC-92g rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-21 - Ready enrollment shows standing when supplied
**Serves:** Bid enrollment - ready enrollment shows standing when supplied

- **GIVEN** a bid card with `bidEnrollment` `ready` and outbid standing
  content
- **WHEN** the card renders
- **THEN** the outbid standing badge is shown

<!-- trace:scenario id=g10.shared-auction-listing.SC-b9p rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-26 - Needs-card disables amount controls
**Serves:** Bid enrollment - needs-card disables amount controls

- **GIVEN** a bid card with `bidEnrollment` `needs-card`
- **WHEN** it renders
- **THEN** quick-bid presets and the custom maximum field are visible and not interactive
- **AND** the primary bid action uses the consumer's link-card label

<!-- trace:scenario id=g10.shared-auction-listing.SC-7da rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-ast rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-09 - A signed-in user opens personal bid history
**Serves:** Personal bid history - a signed-in user opens personal bid history

- **GIVEN** `ListingUserBidHistory` rendered with at least one row
- **WHEN** the collector activates the link
- **THEN** a dialog opens showing the same-price priority description and a
  table with amount and time for each supplied row
- **AND** no bid-type column or type badge is shown
- **AND** the dialog closes via the close control or Escape

<!-- trace:scenario id=g10.shared-auction-listing.SC-h3u rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-10 - No rows means no link
**Serves:** Personal bid history - no rows means no link

- **GIVEN** `ListingUserBidHistory` rendered with an empty `rows` array
- **WHEN** it renders
- **THEN** no link or dialog is shown

<!-- trace:scenario id=g10.shared-auction-listing.SC-mm6 rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-8xx rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-12 - An accessory composes beside recent bids
**Serves:** Bid card accessory - an accessory composes beside recent bids

- **GIVEN** a bid card with a recent-bids section and a non-empty
  `recentBidsAccessory`
- **WHEN** the card renders
- **THEN** the accessory appears beside the recent-bids label
- **AND** the public recent-bids list below is unchanged

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

<!-- trace:scenario id=g10.shared-auction-listing.SC-yr9 rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-c86 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-32 - Bid placed stays the default when no bids were placed
**Serves:** Personal bidding dialog - bid placed stays the default when no bids were placed

- **GIVEN** `ListingUserBidHistory` rendered with at least one maximum row and
  an empty `bidRows` array
- **WHEN** the collector opens the dialog
- **THEN** the initial tab is the bids tab and shows a frameless `EmptyState`
  with `copy.emptyBidsTitle` and `copy.emptyBidsDescription`
- **AND** activating the maximums tab shows the supplied maximum rows

<!-- trace:scenario id=g10.shared-auction-listing.SC-53a rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-33 - No personal rows means no link
**Serves:** Personal bidding dialog - no personal rows means no link

- **GIVEN** `ListingUserBidHistory` rendered with empty `maximumRows` and empty
  `bidRows`
- **WHEN** it renders
- **THEN** no link or dialog is shown

<!-- trace:scenario id=g10.shared-auction-listing.SC-6dn rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-ujz rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-24 - A typed decimal mark is refused
**Serves:** Bid enrollment - a typed decimal mark is refused

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `100`
- **WHEN** a collector types `.` into the custom maximum field
- **THEN** the draft remains `100`
- **AND** the decimal mark does not appear in the field

<!-- trace:scenario id=g10.shared-auction-listing.SC-egd rev=1 -->
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
the current bid plus those multiples, except that before any bid the 1×
amount SHALL be the view's minimum bid, the opening price itself; the 2× and
4× amounts still add their multiples to the current bid on the view.

The first chip SHALL NOT be replaced by the typed raise floor.

<!-- trace:scenario id=g10.shared-auction-listing.SC-7o5 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-35 - A leader's chips step from the committed max
**Serves:** Quick bids - a leader's chips step from the committed max

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer leads with a maximum of
  200000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 204000, 208000, and 216000 HKD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-t9f rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-36 - A collector who does not lead steps from the current bid
**Serves:** Quick bids - a collector who does not lead steps from the current bid

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer has a maximum of 116000
  minor units and does not lead
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 124000, 128000, and 136000 HKD minor units

#### Scenario: shared-ui-auction-listing-SC-52 - Before any bid chip 1x is the opening price
**Serves:** Quick bids - a collector meets the chips on a lot nobody has bid on

- **GIVEN** an HKD listing with no accepted bid, whose view carries an
  opening price of 48000 minor units as both its minimum bid and its current
  bid, and an increment of 2000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 48000, 52000, and 56000 HKD minor units
- **AND** the 48000 chip is captioned as the next eligible bid

### Requirement: A leader's typed raise floor is max plus 100 minor units

When the viewer leads with a committed maximum and the current bid is below
that maximum, `ListingAuctionBidCard` SHALL set the custom-maximum minimum to
the greater of the listing's minimum next bid and that maximum plus 100
minor units. That floor SHALL NOT be used as the first quick-bid amount.

<!-- trace:scenario id=g10.shared-auction-listing.SC-dv0 rev=1 -->
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

<!-- trace:scenario id=g10.shared-auction-listing.SC-w7x rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-44 - Buyer fee shows inline at 20%
**Serves:** Buyer-fee disclosure - the buyer fee shows inline at 20%

- **GIVEN** a signed-in collector on an open listing bid card
- **WHEN** the bid panel footer renders
- **THEN** secondary copy under the bid action states that a 20% buyer fee is
  added on top of the winning bid
- **AND** no buyer-fee info tooltip is present

<!-- trace:scenario id=g10.shared-auction-listing.SC-tzp rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-45 - Signed-out panel omits the fee line
**Serves:** Buyer-fee disclosure - a signed-out panel omits the fee line

- **GIVEN** a bid card with `bidEnrollment` `signed-out`
- **WHEN** it renders
- **THEN** the buyer-fee line is absent

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

### Requirement: Custom maximum entry respects a major-unit ceiling

A custom maximum has a ceiling, and an edit past it is refused without a
message.

**Major-unit cap** - `ListingAuctionBidCard` SHALL accept a custom
private-maximum draft only when the whole major-unit integer is at most
9,999,999,999, regardless of listing currency.

**After cleaning** - The ceiling applies after whole-major cleaning (non-digits
stripped; a decimal mark and its fraction discarded).

**Restore on overshoot** - An edit — typed or pasted — whose cleaned major-unit
value would exceed that ceiling SHALL leave the previous valid draft unchanged,
including when that draft is empty.

**No clamp** - The field SHALL NOT clamp the draft to the ceiling.

**At the ceiling** - Exactly 9,999,999,999 SHALL be accepted.

**No ceiling error copy** - The refuse alone SHALL NOT show an invalid-amount
or below-floor message.

**Set and raise** - Set and raise private maximum share this field and this
rule.

**Committed amounts** - Committed amounts remain an integer count of minor
units at or above the existing floor rules.

#### Scenario: shared-ui-auction-listing-SC-38 - A draft at the ceiling is accepted
**Serves:** Custom maximum ceiling - a draft at the ceiling is accepted

- **GIVEN** an HKD listing bid panel whose custom maximum field is empty
- **WHEN** a collector enters `9999999999` into the custom maximum field
- **THEN** the draft shown is `9999999999`

#### Scenario: shared-ui-auction-listing-SC-39 - A typed digit beyond the ceiling restores the previous draft
**Serves:** Custom maximum ceiling - a typed digit beyond the ceiling restores the previous draft

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `9999999999`
- **WHEN** a collector types `0` into the custom maximum field
- **THEN** the draft remains `9999999999`

#### Scenario: shared-ui-auction-listing-SC-40 - A paste beyond the ceiling from an empty field stays empty
**Serves:** Custom maximum ceiling - a paste beyond the ceiling from an empty field stays empty

- **GIVEN** an HKD listing bid panel with the custom maximum field empty
- **WHEN** a collector pastes `10000000000` into the custom maximum field
- **THEN** the draft remains empty
- **AND** no invalid-amount message appears solely because of the rejected
  paste

#### Scenario: shared-ui-auction-listing-SC-41 - A paste beyond the ceiling restores the prior draft
**Serves:** Custom maximum ceiling - a paste beyond the ceiling restores the prior draft

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `99999999999` into the custom maximum field
- **THEN** the draft remains `500`

#### Scenario: shared-ui-auction-listing-SC-42 - A fractional paste that exceeds after whole-major cleaning restores the prior draft
**Serves:** Custom maximum ceiling - a fractional paste that exceeds after whole-major cleaning restores the prior draft

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `10000000000.99` into the custom maximum field
- **THEN** the draft remains `500`

#### Scenario: shared-ui-auction-listing-SC-43 - Raise path restores on overshoot
**Serves:** Custom maximum ceiling - raise path restores on overshoot

- **GIVEN** an HKD listing bid panel showing Raise your private maximum whose
  custom maximum draft is `9999999999`
- **WHEN** a collector types `1` into the custom maximum field
- **THEN** the draft remains `9999999999`

#### Scenario: shared-ui-auction-listing-SC-53 - A fractional paste at the ceiling after cleaning is accepted
**Serves:** Custom maximum ceiling - a fractional paste at the ceiling after cleaning is accepted

- **GIVEN** an HKD listing bid panel whose custom maximum draft is `500`
- **WHEN** a collector pastes `9999999999.99` into the custom maximum field
- **THEN** the draft shown is `9999999999`

### Requirement: Public bid history marks the closed winner and equal-max priority

Public Recent bids on the listing surface SHALL make the closed outcome and
equal-max priority readable without opening personal bidding.

**Winner flag** - `ListingBidHistoryRow` MAY carry `isWinner?: boolean`. The
consumer sets it on the winning public row when the lot is closed and sold.
Live lots SHALL NOT set `isWinner`.

**Equal-max flag** - `ListingBidHistoryRow` MAY carry
`samePricePriority?: boolean`. The consumer sets it on a public row whose
amount matches a row ranked above it, at the current price or at any older
tie lower down, because the earlier maximum stands above it. The list
decides nothing about priority.

**Winner crown** - When `row.isWinner` is true and `copy.winner` is supplied,
`ListingBidHistoryList` SHALL render a small filled crown icon in the primary
color after the amount (and after any equal-max Info control), before the
**You** badge when present. The crown SHALL use `copy.winner` as its
accessible name; the list supplies no name of its own.

**Equal-max tip** - When `row.samePricePriority` is true and
`copy.samePricePriorityTip` is supplied, the list SHALL show an Info control
whose tooltip content is that tip, with the icon inheriting the amount text
tone. The tip SHALL state that when maximums match, the earlier one
leads.

**Bid card copy** - `ListingAuctionBidCard` `bidHistory` copy MAY include
`winner` and `samePricePriorityTip` and SHALL thread them to
`ListingBidHistoryList`.

#### Scenario: shared-ui-auction-listing-SC-50 - Closed sold Recent bids show a winner crown
**Serves:** Public bid history outcome - closed sold Recent bids show a winner crown

- **GIVEN** a closed sold bid card whose winning public history row has
  `isWinner` true, and winner copy `Winner` supplied
- **WHEN** the Recent bids list renders
- **THEN** that row shows a primary crown after the amount with accessible
  name Winner
- **AND** no live bid card history row shows a winner crown without
  `isWinner`

#### Scenario: shared-ui-auction-listing-SC-51 - Equal-max non-leader shows earlier-leads tip
**Serves:** Public bid history outcome - equal-max non-leader shows earlier-leads tip

- **GIVEN** a bid card history row with `samePricePriority` true and
  equal-max tip copy supplied
- **WHEN** the collector activates the Info control on that row
- **THEN** the tooltip states that when maximums match, the earlier one
  leads

#### Scenario: shared-ui-auction-listing-SC-54 - No crown without its name
**Serves:** Public bid history outcome - no crown without its name

- **GIVEN** a closed sold bid card whose winning public row has `isWinner` true, and bid history copy with no `winner`
- **WHEN** the Recent bids list renders
- **THEN** no row shows a crown
- **AND** no row carries an accessible name the consumer did not supply
