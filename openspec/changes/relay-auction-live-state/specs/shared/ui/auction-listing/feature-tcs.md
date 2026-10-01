# shared/ui/auction-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

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

**Blocked:** The product owner - whether setup names the missing card or attestation, or only keeps continue disabled as built (Q36).

**Pre-conditions:**

* Storybook renders `EnrollmentSetupSheet` open.

**Test data:**

| Card entered | Attestation checked | Continue | Says missing |
| --- | --- | --- | --- |
| No | No | Disabled | Card and attestation |
| Yes | No | Disabled | Attestation |
| No | Yes | Disabled | Card |
| Yes | Yes | Enabled | Nothing |

**Steps:**

1. Set the card field to <card entered>.
2. Set the attestation to <attestation checked>.
3. Read the continue control and the setup's message.

**Expected Results:**

* Continue is <continue>.
* The setup names <says missing> as missing.

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

### shared-ui-auction-listing-US1-TC18-1: A lost standing shows the badge and no release banner

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
2. Scan the card for a hold-release banner.

**Expected Results:**

* Step 1: the standing reads Did not win.
* Step 2: no card-authorization-release banner shows.

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
| TC16-1: setup keeps continue disabled until a card and an attestation, and says which is missing | **Raised:** Q36 - the Feature-set leaf and the page say setup names what is missing; no requirement states it and the built sheet only disables continue. Disabled continue is durable `shared-ui-auction-listing-SC-16`; the case is **Blocked** until Q36 lands |

**Uncovered anchors:** none for this change. Its three scenarios each have a case. The durable scenarios no case here asserts - `-SC-11`, `-SC-14`, `-SC-14a`, `-SC-15`, `-SC-17`, `-SC-18`, `-SC-19`, `-SC-24`, `-SC-25`, `-SC-28`, `-SC-29`, `-SC-30`, `-SC-32`, `-SC-34` - are untouched by this change and owed by the durable suite.
