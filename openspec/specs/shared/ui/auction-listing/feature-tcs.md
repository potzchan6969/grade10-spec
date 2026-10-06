# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## shared-ui-auction-listing-US1: The listing page blocks' rendering contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As a** customer,
**I want** the lot page's blocks to show the gallery, my bidding and its disclosures as the contract states,
**so that** every storefront composing them shows me the same thing.

<!-- trace:case id=g10.shared-auction-listing.TC-qgl rev=1 covers=g10.shared-auction-listing.SC-w7x,g10.shared-auction-listing.SC-tzp -->
### shared-ui-auction-listing-US1-TC1-1: Buyer fee shows inline at 20%

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Buyer-fee disclosure

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `bidEnrollment` `ready` on an open listing.

**Steps:**

1. Scroll to the bid action on the panel.
2. Read the secondary copy under the bid action.
3. Hover the fee copy.

**Expected Results:**

* Step 2: the copy states a 20% buyer fee on top of the winning bid.
* Step 3: no buyer-fee tooltip opens.

<!-- trace:case id=g10.shared-auction-listing.TC-5tu rev=1 covers=g10.shared-auction-listing.SC-w7x,g10.shared-auction-listing.SC-tzp -->
### shared-ui-auction-listing-US1-TC2-1: Signed-out panel omits the fee line

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Buyer-fee disclosure

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `bidEnrollment` `signed-out` on an open listing.

**Steps:**

1. Scroll to the bid action on the panel.
2. Look under the bid action for the buyer-fee line.

**Expected Results:**

* The buyer-fee line is absent.

### shared-ui-auction-listing-US1-TC3-1: Chips step from the current bid for a non-leader

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `bidEnrollment` `ready` on an open listing.
* The viewer has no maximum on the listing.
* The listing has an accepted bid at <current bid>.

**Test data:**

| Currency | Current bid | Increment | Chip 1× | Chip 2× | Chip 4× |
| --- | --- | --- | --- | --- | --- |
| HKD | 20000 (HK$200) | 1000 (HK$10) | 21000 | 22000 | 24000 |
| JPY | 20000 (¥20,000) | 500 (¥500) | 20500 | 21000 | 22000 |
| USD | 100 ($1), a first bid at a 0 start's opening price | 100 ($1) | 200 | 300 | 500 |

**Steps:**

1. Scroll to the quick bids on the panel.
2. Read each chip's amount.
3. Click the 2× chip.

**Expected Results:**

* Step 2: three chips read <current bid> plus 1×, 2× and 4× <increment>.
* Step 3: the amount entered is the 2× chip's amount.

### shared-ui-auction-listing-US1-TC4-1: Chips step from a leader's committed maximum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `bidEnrollment` `ready` on an open listing.
* The viewer leads with a committed maximum of <leader maximum> over a current bid of <current bid>.

**Test data:**

| Currency | Current bid | Leader maximum | Increment | Chip 1× | Chip 2× | Chip 4× |
| --- | --- | --- | --- | --- | --- | --- |
| HKD | 20000 (HK$200) | 30000 (HK$300) | 1000 (HK$10) | 31000 | 32000 | 34000 |

**Steps:**

1. Scroll to the quick bids on the panel.
2. Read each chip's amount.

**Expected Results:**

* Three chips read <leader maximum> plus 1×, 2× and 4× <increment>.
* No chip reads <current bid> plus an increment.

### shared-ui-auction-listing-US1-TC5-2: Before any bid, chip 1× is the opening price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `bidEnrollment` `ready` on an open listing.
* The listing has no accepted bid and a starting price of <starting price>.

**Test data:**

| Currency | Starting price | Opening price | Increment | Chip 1× | Chip 2× | Chip 4× |
| --- | --- | --- | --- | --- | --- | --- |
| HKD | 20000 (HK$200) | 20000, the starting price | 1000 (HK$10) | 20000 | 22000 | 24000 |
| USD | 0 | 100 ($1), the lowest increment | 100 ($1) | 100 | 300 | 500 |
| HKD | 0 | 1000 (HK$10), the lowest increment | 1000 (HK$10) | 1000 | 3000 | 5000 |

**Steps:**

1. Scroll to the quick bids on the panel.
2. Read each chip's amount.
3. Click the 1× chip.

**Expected Results:**

* Step 2: chip 1× reads <opening price> itself, not <opening price> plus an increment.
* Step 2: chip 1× is captioned as the next eligible bid.
* Step 2: chips 2× and 4× read <chip 2×> and <chip 4×>, <opening price> plus two and four increments.
* Step 2: on a 0 start, no chip reads 0.
* Step 3: the amount entered is <opening price>.

### shared-ui-auction-listing-US1-TC6-1: A leader's typed raise starts above their maximum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Raise floor

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `bidEnrollment` `ready` on an open listing.
* The viewer leads with a committed maximum of <leader maximum> over a current bid of <current bid>.

**Test data:**

| Currency | Current bid | Leader maximum | Next minimum | Raise floor | Chip 1× |
| --- | --- | --- | --- | --- | --- |
| HKD | 20000 (HK$200) | 30000 (HK$300) | 21000 | 30100, the maximum plus 100 | 31000 |
| HKD | 20000 (HK$200) | 20000 (HK$200) | 21000 | 21000, the next minimum | 21000 |

**Steps:**

1. Click the custom maximum field on the panel.
2. Read the minimum the field states.
3. Read the 1× chip's amount.

**Expected Results:**

* Step 2: the minimum is the greater of <next minimum> and <leader maximum> plus 100.
* Step 3: the 1× chip reads <leader maximum> plus one increment, not the floor, where the two differ.

### shared-ui-auction-listing-US1-TC7-1: Blocks import by name and the gallery stands alone

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Surface exports

**Pre-conditions:**

* A consumer imports from the `packages/ui` package entry.

**Steps:**

1. Import `ListingGallery`, `ListingAuctionBidCard` and `ListingDetails` by name.
2. Render `ListingGallery` with two images and no bid card.

**Expected Results:**

* Step 1: each named import resolves.
* Step 2: the gallery renders both images with no bid panel.

### shared-ui-auction-listing-US1-TC8-1: Each gallery view reads its own source, else the main one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Gallery sources

**Pre-conditions:**

* Storybook renders `ListingGallery` with two images, the first given the sources in **Test data**.

**Test data:**

| Thumb source | Main source | Zoom source | Strip shows | Main frame shows | Zoom shows |
| --- | --- | --- | --- | --- | --- |
| `<thumb url>` | `<main url>` | `<zoom url>` | `<thumb url>` | `<main url>` | `<zoom url>` |
| none | `<main url>` | none | `<main url>` | `<main url>` | `<main url>` |

**Steps:**

1. Read the first image's source in the strip.
2. Read the main frame's source.
3. Hover the main frame to zoom.
4. Read the zoomed image's source.

**Expected Results:**

* Step 1: the strip shows <strip shows>.
* Step 2: the main frame shows <main frame shows>.
* Step 4: the zoom shows <zoom shows>.

### shared-ui-auction-listing-US1-TC9-1: The strip shows only for several images

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Gallery strip

**Pre-conditions:**

* Storybook renders `ListingGallery` with <image count> images.

**Test data:**

| Image count | Outcome |
| --- | --- |
| 0 | Nothing renders; no previous or next control |
| 1 | The image renders with no thumbnail strip |
| 3 | A thumbnail strip shows all three |

**Steps:**

1. Look at the gallery.

**Expected Results:**

* The gallery reads as <outcome>.

### shared-ui-auction-listing-US1-TC10-1: Accessible names are the copy the application supplies

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Consumer labels

**Pre-conditions:**

* Storybook renders `ListingGallery` and `ListingAuctionBidCard` with every label prop set to a distinct marker string.

**Steps:**

1. Read the accessible name of every control in both blocks.

**Expected Results:**

* Each accessible name is the marker string supplied for it.
* No accessible name is text the blocks supply themselves.

### shared-ui-auction-listing-US1-TC11-1: Bid rows read in the supplied locale and time zone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Bid history

**Pre-conditions:**

* Storybook renders `ListingBidHistoryList` with locale <locale> and time zone <time zone>.
* One row was accepted 5 minutes ago, and one at 2026-09-01T12:00:00Z.

**Test data:**

| Locale | Time zone | Older row reads |
| --- | --- | --- |
| en | Asia/Hong_Kong | 1 September 2026, 20:00, in en |
| zh-Hant | Asia/Tokyo | 1 September 2026, 21:00, in zh-Hant |

**Steps:**

1. Read the recent row's time.
2. Read the older row's time.

**Expected Results:**

* Step 1: the recent row reads in relative form, in <locale>.
* Step 2: the older row reads <older row reads>.
* Each row keeps its accepted instant as data.

### shared-ui-auction-listing-US1-TC12-1: The owner opens their bidding from the recent-bids header

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Personal bid history

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `ListingUserBidHistory` as its personal-bidding accessory.
* The accessory has two maximum rows, two bid-sequence rows, and marker strings for every copy prop.

**Steps:**

1. Scroll to the recent-bids header on the bid card.
2. Click the personal-bidding link beside it.
3. Read the dialog's title, tabs and column headers.

**Expected Results:**

* Step 1: the link sits beside the recent-bids label.
* Step 2: a dialog opens with two peer tabs.
* Step 3: the title, tabs and columns are the supplied marker strings.
* Step 3: columns are amount and time only, no bid-type column.

### shared-ui-auction-listing-US1-TC13-1: Personal bid history with no rows renders nothing

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Personal bid history

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `ListingUserBidHistory` as its accessory, given no maximum rows and no bid-sequence rows.

**Steps:**

1. Scroll to the recent-bids header on the bid card.

**Expected Results:**

* No personal-bidding link shows.
* The recent-bids header still renders.

### shared-ui-auction-listing-US1-TC14-1: Each dialog tab lists its own rows

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Personal bidding dialog

**Pre-conditions:**

* Storybook renders `ListingUserBidHistory` open, with a configure and a raise maximum row and two auto-bid sequence rows.

**Steps:**

1. Read the tab selected on open.
2. Read the rows of the bids tab.
3. Click the maximums tab.
4. Read its rows.

**Expected Results:**

* Step 1: the bids tab is selected.
* Step 2: two auto-bid rows, each amount and time.
* Step 4: the configure and raise rows, each amount and time.
* Step 4: no row carries a set or raised status.
* No maximum summary shows in the dialog.

### shared-ui-auction-listing-US1-TC15-1: The bid card follows the enrollment signal

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Bid enrollment

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` with `bidEnrollment` <signal> on an open listing.

**Test data:**

| Signal | Bid action | Quick bids and custom field | Standing and fee line |
| --- | --- | --- | --- |
| `signed-out` | Offers sign-in | Not offered for bidding | Absent |
| `needs-card` | Opens setup | Visible, disabled | Fee line shown |
| `ready` | Commits a maximum | Enabled | Fee line shown |

**Steps:**

1. Read the bid action.
2. Click a quick bid chip.
3. Click the bid action.

**Expected Results:**

* Step 1: the bid action reads as <bid action>.
* Step 2: chips and custom field behave as <quick bids and custom field>.
* Step 3: the bid action does <bid action>.
* Standing and the fee line are <standing and fee line>.

### shared-ui-auction-listing-US1-TC16-1: Setup waits on a card and an attestation

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Bid enrollment

**Pre-conditions:**

* Storybook renders `EnrollmentSetupSheet` open.

**Test data:**

| Card entered | Attestation checked | Continue |
| --- | --- | --- |
| No | No | Disabled |
| Yes | No | Disabled |
| No | Yes | Disabled |
| Yes | Yes | Enabled |

**Steps:**

1. Set the card field to <card entered>.
2. Set the attestation to <attestation checked>.
3. Read the continue control.

**Expected Results:**

* Continue is <continue>.

### shared-ui-auction-listing-US1-TC17-1: A supplied accessory sits at the recent-bids header's end

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Bid card accessory

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` twice: once with a marker `recentBidsAccessory`, once without.

**Steps:**

1. Read the recent-bids header on the card with the accessory.
2. Read the recent-bids header on the card without it.

**Expected Results:**

* Step 1: the marker shows at the header's trailing edge.
* Step 2: the header renders with nothing in that place.

### shared-ui-auction-listing-US1-TC18-2: A lost standing shows the badge and no banner

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Lost standing

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` on a closed listing the viewer bid on and lost.

**Steps:**

1. Read the standing on the bid card.
2. Scan the card for a banner.

**Expected Results:**

* Step 1: the standing reads Did not win.
* Step 2: no banner shows on the card.

### shared-ui-auction-listing-US1-TC19-1: Draft at the ceiling is accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with the
  custom maximum field empty.

**Steps:**

1. Enter `9999999999` into the custom maximum field.

**Expected Results:**

* The draft shown is `9999999999`.

### shared-ui-auction-listing-US1-TC20-1: Typed digit past the ceiling restores the prior draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with
  custom maximum draft `9999999999`.

**Steps:**

1. Type one more digit into the custom maximum field.

**Expected Results:**

* The draft remains `9999999999`.

### shared-ui-auction-listing-US1-TC21-1: Paste past the ceiling from empty stays empty

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with the
  custom maximum field empty.

**Steps:**

1. Paste `10000000000` into the custom maximum field.

**Expected Results:**

* The draft remains empty.

### shared-ui-auction-listing-US1-TC22-1: Paste past the ceiling restores the prior draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with
  custom maximum draft `500`.

**Steps:**

1. Paste `99999999999` into the custom maximum field.

**Expected Results:**

* The draft remains `500`.

### shared-ui-auction-listing-US1-TC23-1: Fractional paste that exceeds after whole-major cleaning restores the prior draft

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `packages/ui/src/blocks/auction-listing/listing-bid-money.test.ts`

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with
  custom maximum draft `500`.

**Steps:**

1. Paste `10000000000.99` into the custom maximum field.

**Expected Results:**

* The draft remains `500`.

### shared-ui-auction-listing-US1-TC24-1: Raise path restores on overshoot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → Leading (raise private
  maximum) with custom maximum draft `9999999999`.

**Steps:**

1. Type `1` into the custom maximum field.

**Expected Results:**

* The draft remains `9999999999`.

### shared-ui-auction-listing-US1-TC25-1: Over-ceiling refuse shows no dedicated error

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling; the
  seeded `500` is cleared and `60500`, the listing's floor of HKD 60,500, is
  entered, so no message shows under the custom maximum field.

**Steps:**

1. Paste `99999999999` into the custom maximum field.
2. Observe the panel around the custom maximum field.

**Expected Results:**

* The draft remains `60500`.
* No invalid-amount, below-floor or too-large message appears.

### shared-ui-auction-listing-US1-TC26-1: Fractional paste at the ceiling after cleaning is accepted

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → CustomMaximumCeiling with the
  custom maximum draft `500`.

**Steps:**

1. Paste `9999999999.99` into the custom maximum field.

**Expected Results:**

* The draft shown is `9999999999`.

### shared-ui-auction-listing-US1-TC27-1: Closed sold Recent bids show a winner crown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → ClosedSoldEqualMax: a closed sold lot whose first Recent bids row is the viewer's and has `isWinner` true, with bid history copy `winner` set to `Winner`.
* Storybook renders `ListingAuctionBidCard` → Default: a live lot whose Recent bids rows carry no `isWinner`, with the same copy.

**Steps:**

1. On ClosedSoldEqualMax, read the first Recent bids row.
2. On Default, read every Recent bids row.

**Expected Results:**

* Step 1: the row shows a crown in the primary colour after the amount and before the You badge, with accessible name Winner.
* Step 2: no row shows a crown.

### shared-ui-auction-listing-US1-TC28-1: Equal-max non-leader shows earlier-leads tip

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Pre-conditions:**

* Storybook renders `ListingAuctionBidCard` → ClosedSoldEqualMax: its second Recent bids row has the first row's amount and `samePricePriority` true, with bid history copy `samePricePriorityTip` set to `When maximums match, the earlier one leads.`

**Steps:**

1. On the second Recent bids row, hover the Info control after the amount.
2. Read the tooltip.

**Expected Results:**

* Step 1: the Info icon shows in the same tone as the row's amount.
* Step 2: the tooltip reads When maximums match, the earlier one leads.

### shared-ui-auction-listing-US1-TC29-1: No crown without its name

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Public bid history outcome

**Pre-conditions:**

* `ListingAuctionBidCard` renders ClosedSoldEqualMax's args - a closed sold lot whose first Recent bids row has `isWinner` true - with bid history copy that leaves `winner` unset.

**Steps:**

1. Read every Recent bids row.

**Expected Results:**

* No row shows a crown.
* No row carries an accessible name the copy does not supply, Winner included.

## Raised

- None; this change introduces no unresolved product question.

## Settled

- A lost standing on the bid card is the Did not win badge alone; that the card was not charged is said on My Auctions, never on the lot card (decisions Q2).
- The linked-card tooltip scenario keeps its title, since retitling needs a new id (decisions Q18).
- Ceiling is 9,999,999,999 whole major units for any listing currency (`cap-custom-maximum-entry` Q1).
- Overshoot restores the previous valid draft, including empty; never clamps (`cap-custom-maximum-entry` Q2).
- Refuse is silent; no dedicated too-large copy (`cap-custom-maximum-entry` Q3).
- Auction-service keeps its own refusal above the currency's bid ceiling; with the JPY ceiling at 5,000,000,000, every currency's ceiling sits below the field (`cap-custom-maximum-entry` Q4, Q6).
- Winner is a primary crown after the amount when the consumer sets
  `isWinner` (closed sold), not a Winner badge (`bid-history-winner-priority` Q1, Q3).
- Equal-max non-leaders use the Info tip in the amount tone with
  earlier-leads copy (`bid-history-winner-priority` Q2).
- No new Badge size or footnote under Recent bids (`bid-history-winner-priority` non-goals).
- The tip icon's tone and the crown's place before You are requirement
  clauses the cases walk, with no scenario of their own (`bid-history-winner-priority` Q5).

## Reconciliation

**Run:** QA2, 2026-10-01, for change `relay-auction-live-state`. Joined QA1's blind cases, written from the frozen Feature set and `user-journeys.md`, the change's `proposal.md` and `decisions.md` with `## Raised`, the linked pages under `docs/prds/` and the durable suite, with this delta's scenarios, the durable requirements beside them, `tech-design.md`, `tasks.md` and the built block in `packages/ui`. QA1 was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive.

| Finding | Disposition |
| --- | --- |
| TC5-2: before any bid chip 1× is the opening price, on a positive start and a 0 start, and no chip reads 0 | **Folded in:** `shared-ui-auction-listing-SC-52` (Q28, Q35) |
| TC5-2: chips 2× and 4× before any bid read one and three increments above chip 1× | **Rejected:** Q28 and `shared-ui-auction-listing-SC-52` - they add two and four increments to the opening price, as built in `quickMaximumPresetAmount`. QA2 rewrote the rows' amounts; the case stays draft |
| `shared-ui-auction-listing-SC-52`'s caption, chip 1× as the next eligible bid; no blind case asserted it | **Patched:** TC5-2 asserts the caption |
| TC3-1: a non-leader's chips step from the current bid, a first bid at a 0 start's opening price included | **Folded in:** `shared-ui-auction-listing-SC-36` |
| TC4-1: a leader's chips step from the committed maximum | **Folded in:** `shared-ui-auction-listing-SC-35` |
| TC6-1: a leader's typed raise starts at the greater of the next minimum and the maximum plus 100, and chip 1× is not that floor | **Folded in:** the modified requirement's last sentence and durable `shared-ui-auction-listing-SC-37` |
| TC1-1, TC2-1: the buyer fee inline at 20%, absent signed out | **Folded in:** durable `shared-ui-auction-listing-SC-44`, `shared-ui-auction-listing-SC-45` |
| TC7-1 to TC15-1, TC17-1, TC18-1: exports, gallery sources and strip, consumer labels, bid-row time, personal bidding, the enrollment signal, the accessory and lost standing | **Folded in:** durable `shared-ui-auction-listing-SC-01`, `-SC-02`, `-SC-03`, `-SC-04`, `-SC-05`, `-SC-06`, `-SC-07`, `-SC-08`, `auction-listing-SC-13`, `auction-listing-SC-22`, `-SC-09`, `-SC-31`, `-SC-10`, `-SC-33`, `-SC-20`, `-SC-21`, `-SC-26`, `-SC-27`, `-SC-12`, `-SC-46`; this change does not alter them |
| TC16-1: setup keeps continue disabled until a card and an attestation, and says which is missing | **Folded in:** durable `shared-ui-auction-listing-SC-16` (Q36) - setup names nothing, so QA2 dropped the Says missing column and its step; the case stays draft |

**Uncovered anchors:** none for this change. Its three scenarios each have a case. The durable scenarios no case here asserts - `-SC-11`, `-SC-14`, `-SC-14a`, `-SC-15`, `-SC-17`, `-SC-18`, `-SC-19`, `-SC-24`, `-SC-25`, `-SC-28`, `-SC-29`, `-SC-30`, `-SC-32`, `-SC-34` - are untouched by this change and owed by the durable suite.

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `shared-ui-auction-listing-SC-46` by `shared-ui-auction-listing-US1-TC18-2`
- **Revised** - QA1 kept `shared-ui-auction-listing-US1-TC18-1`, but it now reads no banner of any kind under a lost standing, so it moves up a revision
- **Out of suite** - the enrollment blocks' props, which no longer take `authorizing` or `authorizationRefused`: the store's type check and the block stories. `shared-ui-auction-listing-SC-30` changed its Serves line only and stands by its story
- **Raised, answered** - Q18: `shared-ui-auction-listing-SC-30` keeps its title, since retitling needs a new id, recommended; answer in `## Settled`
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** QA2 reconciliation 2026-10-05 for change `cap-custom-maximum-entry`, rereading every case in this suite against the delta's scenarios and the `Custom maximum ceiling` anchor after the accept-review fix round. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `ui-design.md`, `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the PRD's Custom Maximum section and the bidding page's Ceiling, Custom maximum and Bid ceiling lines, the durable `spec.md` and suite, the `bid-history-winner-priority` and `lot-gallery-strip-by-width` suites on this capability, `listing-bid-money.test.ts` and the `ListingAuctionBidCard` stories. QA1's blind pass had read the Purpose, the Feature set, the journeys, the proposal, Q1 to Q4, the stripped `ui-design.md`, the PRD lines and the durable suite with its Reconciliation stripped, and was denied every Requirements section and the archive.

| Finding | Disposition |
| --- | --- |
| Draft at ceiling `9999999999` accepted | **Folded in:** `shared-ui-auction-listing-SC-38` / `shared-ui-auction-listing-US1-TC19-1` |
| Typed digit past ceiling restores prior draft | **Folded in:** `shared-ui-auction-listing-SC-39` / `shared-ui-auction-listing-US1-TC20-1` |
| Paste past ceiling from empty stays empty, silent | **Folded in:** `shared-ui-auction-listing-SC-40` / `shared-ui-auction-listing-US1-TC21-1` for the empty draft; the silence is `shared-ui-auction-listing-US1-TC25-1`'s since the rerun after the final accept-review fixes |
| Paste past ceiling restores prior draft | **Folded in:** `shared-ui-auction-listing-SC-41` / `shared-ui-auction-listing-US1-TC22-1` |
| Fractional paste exceeds after whole-major cleaning restores | **Folded in:** `shared-ui-auction-listing-SC-42` / `shared-ui-auction-listing-US1-TC23-1` |
| Raise path restores on overshoot | **Folded in:** `shared-ui-auction-listing-SC-43` / `shared-ui-auction-listing-US1-TC24-1` |
| Over-ceiling refuse has no dedicated error | **Folded in:** `shared-ui-auction-listing-SC-40` and the requirement's no-ceiling-error-copy rule / `shared-ui-auction-listing-US1-TC25-1` |
| Raised questions from the blind pass | None - Q1 to Q4 already settled the ceiling, restore, silence and the service's own refusal |
| Accept-review, 2026-10-05: case ids `TC3` to `TC9` were the durable suite's quick-bid, raise-floor and gallery cases, which the fold would have overwritten | **Renumbered:** `shared-ui-auction-listing-US1-TC19-1` to `shared-ui-auction-listing-US1-TC25-1`, after the durable suite's last, `TC18`. QA2 found no collision with the durable suite or with `TC27`, `TC28` in `bid-history-winner-priority` |
| Accept-review, 2026-10-05: Q5 had no scenario - a fractional paste whose whole part equals the ceiling is accepted | **Folded in:** `shared-ui-auction-listing-SC-53` / `shared-ui-auction-listing-US1-TC26-1`. QA2 reread it: seed `500`, paste `9999999999.99` and the draft `9999999999` match the scenario |
| QA2: `TC25` expected "no dedicated too-large or over-ceiling error copy", but the requirement names the copy that stays away - the invalid-amount and below-floor messages | **Folded in:** `shared-ui-auction-listing-US1-TC25-1` now expects no invalid-amount, below-floor or too-large message |
| QA2: `TC26` expected no invalid-amount message, which `shared-ui-auction-listing-SC-53` does not state | **Folded in:** dropped from `shared-ui-auction-listing-US1-TC26-1`; the case asserts the scenario's THEN alone |
| QA2: `TC20` and `TC24` type "one more digit" where `shared-ui-auction-listing-SC-39` types `0` and `shared-ui-auction-listing-SC-43` types `1` | **Rejected** for `TC20`: any digit past `9999999999` overshoots, so the step covers the scenario's value, and an automated case's wording moves only with its behaviour. `TC24`, manual since the rerun after the 5,000,000,000 JPY ceiling, now types `1` |
| QA2: `TC24` names `listing-bid-money.test.ts`, which never renders the raise title | **Folded in:** the rerun after the 5,000,000,000 JPY ceiling set `shared-ui-auction-listing-US1-TC24-1` to manual - task 2.2 walks the raise path rather than unit-testing it, and no test title names `shared-ui-auction-listing-SC-43` |
| QA2: the cases name Storybook stories, not the scenarios' HKD listing | **Rejected:** `CustomMaximumCeiling` and `Leading` render an HKD listing, so the values match |
| QA2: `TC26` stays manual though `listing-bid-money.test.ts` pastes `9999999999.99` with an empty seed | **Rejected:** not QA's to flip; engineering flips it with `pnpm run tcs:automated` if that test is taken to decide it |
| QA2: facts across the artifacts - field ceiling 9,999,999,999 in any currency, restore not clamp, silent refuse, set and raise on one field, and the JPY bid ceiling | **Rejected:** no artifact states one differently; the JPY bid ceiling is now 5,000,000,000 (Q6), rechecked in the rerun after it |

**Uncovered anchors:** none for `Custom maximum ceiling`.

**Run:** QA2 reconciliation 2026-10-05, rerun after the accept-review fixes, for change `cap-custom-maximum-entry`. Reread every case in this suite against the delta's seven scenarios and the `Custom maximum ceiling` anchor, after the decisions rows named their carriers, `tech-design.md` and `ui-design.md` put `CUSTOM_MAXIMUM_MAJOR_CEILING` and `sanitizeCustomMaximumDraft` outside the contract, task 3.3 took the `TC26` walk, and the US1 header and journeys line took the durable text. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 with their carriers, and `## Raised`), `ui-design.md`, `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the PRD's Custom Maximum section and the bidding page's Ceiling, Custom maximum and Bid ceiling lines, the durable `spec.md`, suite and journeys, the `bid-history-winner-priority` and `lot-gallery-strip-by-width` suites on this capability, `listing-bid-money.ts` and its test, `listing-quick-maximum-bid-actions.tsx` and the `ListingAuctionBidCard` stories. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Each case against its scenario - `TC19` / `SC-38`, `TC20` / `SC-39`, `TC21` / `SC-40`, `TC22` / `SC-41`, `TC23` / `SC-42`, `TC24` / `SC-43`, `TC26` / `SC-53` | **Joined:** the GIVEN drafts, the typed and pasted values and the drafts each THEN names match; `TC25` carries the requirement's No ceiling error copy clause |
| The decisions rows' carriers - Q1 to `shared-ui-auction-listing-SC-38`, Q2 to `shared-ui-auction-listing-SC-39` to `-SC-43`, Q3 to `shared-ui-auction-listing-SC-40`, Q5 to `shared-ui-auction-listing-SC-53` | **Joined:** each carrier has a case here, and no case asserts what its row did not decide |
| The ceiling helpers are exports for stories and tests outside the listing surface's contract, yet `TC19` to `TC23` name `listing-bid-money.test.ts`, which tests the helper | **Rejected:** a Decided-by line names what decides a case, not a contract export; the set path routes every edit through `sanitizeCustomMaximumDraft` in `listing-quick-maximum-bid-actions.tsx`, so the helper's test decides the draft each case reads. `TC24` is manual since the rerun after the 5,000,000,000 JPY ceiling |
| The US1 header and the journeys line now read as the durable suite's | **Joined:** both match the durable text verbatim, so the fold rewrites neither |
| Task 3.3 walks `shared-ui-auction-listing-US1-TC26-1` on CustomMaximumCeiling with the seed `500`, paste `9999999999.99`, draft `9999999999` | **Joined:** the walk's values are `shared-ui-auction-listing-SC-53`'s and the case's |
| `TC19` and `TC21` start from an empty field, while CustomMaximumCeiling's play seeds `500` | **Rejected:** a pre-condition states the field's state, and clearing the seed reaches it; both cases are automated, so their wording moves only with their behaviour |
| The suite's two manual cases had no `### Manual` row saying what a person drives | **Folded in:** `### Manual` below names the walk for `shared-ui-auction-listing-US1-TC25-1` and `shared-ui-auction-listing-US1-TC26-1` |
| Case ids against the durable suite (last `TC18`) and the other active changes on this capability - `bid-history-winner-priority` now issues `TC27` to `TC29`, `lot-gallery-strip-by-width` `TC10` to `TC12` | **Joined:** `TC19` to `TC26` collide with none; scenario ids `SC-38` to `SC-43` and `SC-53` collide with neither the durable spec nor `SC-47` to `SC-51` and `SC-54` |
| Facts across the artifacts after the fixes - field ceiling 9,999,999,999 in any currency, restore not clamp, silent refuse, set and raise on one field, and the JPY bid ceiling | **Joined:** the proposal, Q1 to Q6, `ui-design.md`, `tech-design.md`, `tasks.md`, both PRD pages and every case agree; the JPY bid ceiling is now 5,000,000,000 (Q6); nothing for `## Raised` |

**Uncovered anchors:** none for `Custom maximum ceiling`; every scenario on the anchor has a case asserting its THEN.

**Run:** QA2 reconciliation 2026-10-05, rerun after the 5,000,000,000 JPY ceiling, for change `cap-custom-maximum-entry`. Reread every case in this suite against the delta's seven scenarios and the `Custom maximum ceiling` anchor, after Q6 moved the JPY bid ceiling to 5,000,000,000, `tech-design.md` dropped the quick-chip claim, `listing-bid-money.test.ts` named `SC-38` to `SC-42` and `SC-53` in its titles, and task 2.2 left `SC-43` to the walk; and closed the accept-review finding on `TC25`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `ui-design.md`, `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the PRD's Custom Maximum section and the bidding page's Ceiling, Custom maximum and Bid ceiling lines, the durable `spec.md` and suite, the `bid-history-winner-priority` and `lot-gallery-strip-by-width` suites on this capability, `listing-bid-money.ts` and its test, `listing-quick-maximum-bid-actions.tsx` and the `CustomMaximumCeiling` and `Leading` stories. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Each case against its scenario - `TC19` / `SC-38`, `TC20` / `SC-39`, `TC21` / `SC-40`, `TC22` / `SC-41`, `TC23` / `SC-42`, `TC24` / `SC-43`, `TC26` / `SC-53` | **Joined:** the seeds, the typed and pasted values and the drafts each THEN names match; Q6 moves no value on this capability |
| `TC19` to `TC23` name `listing-bid-money.test.ts` as their decider | **Joined:** its titles now name `shared-ui-auction-listing-SC-38` to `-SC-42`, and its assertions are those scenarios' values |
| `TC24` was automated by `listing-bid-money.test.ts`, which renders no raise panel; task 2.2 says the raise path is walked, not unit-tested, and no test title names `shared-ui-auction-listing-SC-43` | **Folded in:** `shared-ui-auction-listing-US1-TC24-1` is manual, its Decided-by line gone, its step types `1` as the scenario does, and `### Manual` names task 3.1's walk on Leading |
| Accept-review: `TC25` expected no below-floor message at all after a refused edit, but the requirement keeps away only a message the refusal alone causes, and on CustomMaximumCeiling the seeded `500` already shows the below-floor helper (floor HKD 60,500) | **Folded in:** `shared-ui-auction-listing-US1-TC25-1` clears the seed and enters `60500`, the floor, so no message shows before the paste; after pasting `99999999999` the draft stays `60500` and any invalid-amount, below-floor or too-large message would be the refusal's |
| `TC26` stays manual though the test's `SC-53` title pastes `9999999999.99` over an empty seed | **Joined:** the case seeds `500` as task 3.3's walk does; engineering flips it with `pnpm run tcs:automated` if that test is taken to decide it |
| Earlier rows that named the JPY bid ceiling 10,000,000,000 as current, or credited `TC24` to the helper's test | **Folded in:** each row now states its outcome - the JPY bid ceiling is 5,000,000,000, `TC24` is walked |
| Case ids against the durable suite (last `TC18`) and the other active changes on this capability - `bid-history-winner-priority` `TC27` to `TC29`, `lot-gallery-strip-by-width` `TC10` to `TC12` | **Joined:** `TC19` to `TC26` collide with none; scenario ids `SC-38` to `SC-43` and `SC-53` collide with no durable or active scenario |
| Questions for the PM | None - Q1 to Q6 settle the ceiling, the restore, the silence, the service's refusal, the fractional paste and the JPY ceiling |

**Uncovered anchors:** none for `Custom maximum ceiling`; every scenario on the anchor has a case asserting its THEN, and every case stays draft.

**Run:** QA2 reconciliation 2026-10-05, rerun after the final accept-review fixes, for change `cap-custom-maximum-entry`. Reread every case in this suite against the delta's seven scenarios, the requirement's clauses and the `Custom maximum ceiling` anchor, after task 2.2 stopped citing `SC-43`, task 4.1's e2e note named `TC19` to `TC23` and `TC25`, and the PRD's Ceiling line said no message explains the refusal; and closed QA's accept-review finding on `TC21`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q6 and `## Raised`), `ui-design.md`, `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the PRD's Custom Maximum section and the bidding page's Ceiling, Custom maximum and Bid ceiling lines, the durable `spec.md` and suite, the `bid-history-winner-priority` and `lot-gallery-strip-by-width` suites and deltas on this capability, `listing-bid-money.ts` and its test, and `listing-quick-maximum-bid-actions.tsx`. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Accept-review (QA): `TC21` is automated by `listing-bid-money.test.ts`, which returns a draft and renders no panel, so it cannot decide "no invalid-amount or too-large message" | **Folded in:** `shared-ui-auction-listing-US1-TC21-1` asserts the empty draft alone and stays automated; `shared-ui-auction-listing-US1-TC25-1`, manual, reads the panel for any invalid-amount, below-floor or too-large message, so `shared-ui-auction-listing-SC-40`'s AND keeps a case |
| `TC20` also expected "the field is not clamped to another value", which `shared-ui-auction-listing-SC-39` does not state, and from a seed of `9999999999` a clamp and a restore give the same draft | **Folded in:** dropped from `shared-ui-auction-listing-US1-TC20-1`, which asserts the scenario's THEN alone; `shared-ui-auction-listing-US1-TC22-1` tells restore from clamp, since its seed `500` stays `500` |
| Each automated case against its Decided-by test - `TC19` with `""` to `9999999999`, `TC20` with `99999999990` over `9999999999`, `TC21` with `10000000000` over `""`, `TC22` with `99999999999` over `500`, `TC23` with `10000000000.99` over `500` | **Joined:** each test call returns the draft the case's one result names, and the change handler sets the field to that draft and resets the input to it on a refusal; the painted field is walked in task 3.1 and driven by task 4.1's e2e |
| `TC25` is cited by task 4.1's e2e but stays manual | **Joined:** the e2e is not landed; engineering flips it with `pnpm run tcs:automated` once the e2e reads the panel |
| Each case against its scenario - `TC19` / `SC-38`, `TC20` / `SC-39`, `TC21` / `SC-40`, `TC22` / `SC-41`, `TC23` / `SC-42`, `TC24` / `SC-43`, `TC26` / `SC-53`, and `TC25` against `SC-40`'s AND and the No ceiling error copy clause | **Joined:** the seeds, the typed and pasted values and the drafts match; the PRD's Ceiling line now agrees with `TC25` that no message says why |
| Case ids against the durable suite (last `TC18`) and the active changes on this capability - `bid-history-winner-priority` `TC27` to `TC29`, `lot-gallery-strip-by-width` `TC10` to `TC12` | **Joined:** `TC19` to `TC26` collide with none; `SC-38` to `SC-43` and `SC-53` collide with neither the durable spec nor `SC-47` to `SC-51` and `SC-54` |
| Questions for the PM | None - Q1 to Q6 settle every value and outcome the cases read |

**Uncovered anchors:** none for `Custom maximum ceiling`; every scenario on the anchor has a case asserting its THEN, every automated case's results are decided by its test, and every case stays draft.

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md, proposal.md, decisions.md (goals, non-goals, Q1-Q3),
ui-design.md with state dispositions stripped to the Public bid history
outcome anchor, PRD Bid History / Auction Panel Winner lines, and durable
feature-tcs.md for id continuity with Reconciliation stripped. Denied:
every Requirements section, openspec/specs/ beyond those excerpts,
openspec/changes/archive/.

**Run:** QA2 reconciliation 2026-10-05, for change `bid-history-winner-priority`. Read the blind cases above, this delta `spec.md` after the accept-review fixes, `proposal.md`, `decisions.md` (Q1 to Q3), `ui-design.md`, `tech-design.md`, `tasks.md`, the PRD lines on Bidding · Auction Panel and Listing Page Blocks · Bid History, the durable spec and suite, `cap-custom-maximum-entry`'s and `lot-gallery-strip-by-width`'s suites on this capability, and the build: `listing-bid-history-list.tsx`, `types.ts`, the ClosedSoldEqualMax and Default plays in `listing-auction-bid-card.stories.tsx`, and the `en` catalog. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Closed sold winning row shows a winner crown | **Folded in:** `shared-ui-auction-listing-SC-50` / `shared-ui-auction-listing-US1-TC27-1` |
| Equal-max non-leader shows earlier-leads tip | **Folded in:** `shared-ui-auction-listing-SC-51` / `shared-ui-auction-listing-US1-TC28-1` |
| Live lots must not show a winner crown without `isWinner` | **Folded in:** `shared-ui-auction-listing-SC-50`'s AND; TC27 now walks Default as its own step and pre-condition, where it was an expected result with no setup |
| Raised questions from the blind pass | None - Q1 to Q3 already settled closed-only winner mark, tooltip vs footnote, and Badge reuse |
| Accept-review, 2026-10-05: case ids `TC13` and `TC14` were the durable suite's personal bid history cases, which the fold would have overwritten | **Renumbered:** `shared-ui-auction-listing-US1-TC27-1` and `shared-ui-auction-listing-US1-TC28-1`; `cap-custom-maximum-entry` takes `TC19` to `TC26` and `lot-gallery-strip-by-width` `TC10` to `TC12`, so neither collides with this change |
| `shared-ui-auction-listing-SC-50` now draws the crown only with `copy.winner` supplied; TC27 supplied none | **Folded in:** TC27's pre-conditions supply `winner` as `Winner`, as both stories' copy does |
| TC27 and TC28 were `automated`, decided by the story plays; the plays assert only that a `Winner` name and the tip's name exist, not the crown's place or colour nor the icon's tone | **Reclassified:** `manual`, Decided-by line dropped; the cases are walked under task 3.1. A play that asserts the rest flips them with `pnpm run tcs:automated` |
| TC27 and TC28 were `e2e`, both `smoke` | **Reclassified:** `unit`, as every Storybook case in the durable suite; `regression, release`, since a missing crown or tip leaves the journey usable and a journey holds at most one smoke case |
| TC28 read the accessible name in place of activating the control | **Folded in:** its steps hover the Info control and read the tooltip, `shared-ui-auction-listing-SC-51`'s WHEN |
| TC28 asserts the Info icon in the amount's tone, decided by Q2 and stated by the requirement, which no scenario's THEN carries | **Kept:** reported to Dev for an AND on `shared-ui-auction-listing-SC-51`; Q5 declined it, since the requirement's Equal-max tip clause states the tone and TC28 walks it |
| The requirement draws no crown where `copy.winner` is absent, and places the crown after any Info control and before You; no scenario states either | **Folded in:** the first as `shared-ui-auction-listing-SC-54` / `shared-ui-auction-listing-US1-TC29-1`, below; Q5 declined a scenario for the second, so TC27 now asserts the crown after the amount and before You on ClosedSoldEqualMax's viewer row, as the requirement's Winner crown clause states |
| The section carried its own journey title and an application as actor, where the durable suite's `US1` names the listing page blocks and a customer | **Folded in:** heading, Walked-by line and statement copied from the durable suite |
| Facts across the PRD lines, Q1 to Q3, `ui-design.md`, `tech-design.md`, the delta and the cases | **Agree:** primary filled crown after the amount, named by consumer copy, only on a closed sold lot; Info tip in the amount tone, reading when maximums match, the earlier one leads |
| Accept-review fix round, 2026-10-05, at the owner's word: the crown draws only with `copy.winner`, a rule with no scenario | **Folded in:** `shared-ui-auction-listing-SC-54` / `shared-ui-auction-listing-US1-TC29-1`; task 2.4 builds it |

**Run:** QA2 reconciliation 2026-10-05, rerun after Q4 and Q5, for change `bid-history-winner-priority`. Reread every case against `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54`, the requirement as Q4 left it, `decisions.md` (Q1 to Q5), `ui-design.md`, `tech-design.md`, `tasks.md`, the PRD lines on Bidding · Auction Panel and Listing Page Blocks · Bid History, the durable spec and suite, `cap-custom-maximum-entry`'s and `lot-gallery-strip-by-width`'s suites on this capability, and the build: `listing-bid-history-list.tsx`, the ClosedSoldEqualMax and Default stories and their meta, and the `en` catalog. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q4: the Equal-max flag now covers any older tie lower down | **Agree:** the list draws whatever row the consumer flags, so `shared-ui-auction-listing-SC-51` and TC28 hold unchanged; where the flag is set is the lot page's, walked there |
| TC29, written without a QA2 read, against `shared-ui-auction-listing-SC-54` | **Folded in:** its result asserts no row carries a name the copy does not supply, the scenario's AND, where it read only Winner |
| TC29's pre-condition named a Storybook render, but no story leaves `winner` unset and the bid card's `copy` is not a Storybook control | **Reported:** to Dev; task 2.4 owes a story or a play that renders ClosedSoldEqualMax without `winner`. The case stays `draft`, and fails until task 2.4 removes the built-in `"Winner"` |
| Case ids `US1-TC27-1` to `US1-TC29-1` | **Checked:** the durable suite ends at `TC18`; `cap-custom-maximum-entry` takes `TC19` to `TC26` and `lot-gallery-strip-by-width` `TC10` to `TC12`. No collision |
| Facts across the PRD lines, Q1 to Q5, `ui-design.md`, `tech-design.md`, the delta and the cases | **Agree:** primary filled crown after the amount and any tip, before You, named only by consumer copy, on a closed sold lot; Info tip in the amount tone on every row the consumer flags, reading when maximums match, the earlier one leads |
| Raised questions | None - Q1 to Q5 settle what this capability turns on |

**Run:** QA2 reconciliation 2026-10-05, rerun after Q6, for change `bid-history-winner-priority`. Reread every case against `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54`, the requirement, `decisions.md` (Q1 to Q6), `ui-design.md`, `tech-design.md`, `tasks.md` 2.1 to 2.4, the PRD lines on Bidding · Auction Panel and Listing Page Blocks · Bid History, the durable spec and suite, `cap-custom-maximum-entry`'s and `lot-gallery-strip-by-width`'s suites on this capability, and the build: `types.ts`, the ClosedSoldEqualMax story and its scenario lines. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q6: rows tied on amount list in the order their maximums were set | **Agree:** the order and the flag are the consumer's, walked on the lot page; the list draws whatever row is flagged, so `shared-ui-auction-listing-SC-51` and TC28 hold unchanged |
| The `samePricePriority` doc comment in `types.ts` says the row matches the leading price, which Q4 widened to any older tie | **Agree:** task 2.4 corrects it; no case reads a doc comment |
| TC29 still has no render that leaves `winner` unset | **Kept:** task 2.4 owes the story; the case stays `draft` |
| Case ids `US1-TC27-1` to `US1-TC29-1` | **Checked:** the durable suite ends at `TC18`; `cap-custom-maximum-entry` takes `TC19` to `TC26` and `lot-gallery-strip-by-width` `TC10` to `TC12`. No collision |
| Raised questions | None - Q1 to Q6 settle what this capability turns on |

**Uncovered anchors:** none. Public bid history outcome's three items each have a case - winner crown by TC27 and TC29, equal-max tip by TC28, live lots by TC27's second step - and `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54` are each asserted by one of them.

**Run:** QA2 reconciliation 2026-10-05, rerun after the built tie order, for change `bid-history-winner-priority`. Reread every case against `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54` and the requirement, `decisions.md` (Q1 to Q6, as Q6 now names the one-ms answer stamp), `tech-design.md` Decisions 1 to 5, `tasks.md` 2.1 to 2.4 and 3.1 to 3.2, `ui-design.md`, the PRD lines on Bidding · Auction Panel and Listing Page Blocks · Bid History, the durable spec and suite, `cap-custom-maximum-entry`'s and `lot-gallery-strip-by-width`'s suites on this capability, and the build: `listing-bid-history-list.tsx`, `types.ts` and the ClosedSoldEqualMax and Default stories. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| Q6 now says the build lists the earlier maximum first by stamping the leader's automatic answer one ms after the challenger | **Agree:** the order is the consumer's; the list draws whatever row is flagged, so `shared-ui-auction-listing-SC-51` and TC28 hold unchanged |
| Each case against its scenario - TC27 / `shared-ui-auction-listing-SC-50`, TC28 / `-SC-51`, TC29 / `-SC-54` | **Agree:** pre-conditions, copy and expected results match each GIVEN and THEN, the ANDs included |
| Accept-review: the `## Settled` lines cited `decisions Q4/Q5/Q6` without the change, and fold beside other changes' Settled lines | **Folded in:** each Settled line names `bid-history-winner-priority` and its question |
| Accept-review: no `### Manual` table for TC27 to TC29 | **Folded in:** `### Manual` below names what a person drives for each |
| The built crown still falls back to `"Winner"` and no story leaves `winner` unset | **Kept:** task 2.4 owes both; TC29 stays `draft` and fails until then |
| Case ids `US1-TC27-1` to `US1-TC29-1` | **Checked:** the durable suite ends at `TC18`; `cap-custom-maximum-entry` issues `TC19` to `TC26` and `lot-gallery-strip-by-width` `TC10` to `TC12`. No collision |
| Questions for the PM | None - Q1 to Q6 settle what this capability turns on |

**Uncovered anchors:** none. Public bid history outcome's three items each have a case - winner crown by TC27 and TC29, equal-max tip by TC28, live lots by TC27's second step - and `shared-ui-auction-listing-SC-50`, `-SC-51` and `-SC-54` are each asserted by one of them; every case stays `draft`.

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-auction-listing-US1-TC24-1` | A person enters `9999999999` on Leading, under Raise your private maximum, types `1` and reads the draft, in task 3.1's walk; the helper's test proves the set path's restore and renders no raise panel |
| `shared-ui-auction-listing-US1-TC25-1` | A person enters the floor `60500` on CustomMaximumCeiling, pastes `99999999999` and reads the panel around the field for any invalid-amount, below-floor or too-large message; the helper's test returns a draft and renders no panel |
| `shared-ui-auction-listing-US1-TC26-1` | A person pastes `9999999999.99` over the seeded `500` on CustomMaximumCeiling and reads the draft, in task 3.3's walk; engineering flips it with `pnpm run tcs:automated` if the helper's paste from an empty seed is taken to decide it |
| `shared-ui-auction-listing-US1-TC27-1` | A person opens ClosedSoldEqualMax and Default in Storybook and reads where the crown sits, after the amount and before You, and that it is the primary colour, in task 3.1's walk; the two plays prove only that a Winner name shows on ClosedSoldEqualMax and none on Default |
| `shared-ui-auction-listing-US1-TC28-1` | A person hovers the Info control on ClosedSoldEqualMax's second row and compares its tone with the amount's, in task 3.1's walk; the play proves only that the tip's name exists |
| `shared-ui-auction-listing-US1-TC29-1` | To be walked in task 2.4's story that renders ClosedSoldEqualMax with `winner` copy unset: a person reads every row for a crown or a name the copy does not supply; no render leaves `winner` unset today |
