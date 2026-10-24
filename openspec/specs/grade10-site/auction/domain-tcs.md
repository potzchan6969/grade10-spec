# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** reopened · 1/25
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<auction url>` is the Grade10 auction catalogue, `<bids url>` the signed-in account's Bids page and `<my auctions url>` its My Auctions page, on the Grade10 site of the environment under test. `<admin listings url>` is the Auction listings page of the Grade10 admin console.
* Every listing is priced in USD. The increment is chosen by the amount being beaten: +USD50 from USD500, +USD100 from USD1,000, +USD250 from USD2,500 and +USD500 from USD5,000.
* A collector's card is read at the card provider's test dashboard, where a hold or a charge shows against the card.

## Walk 1: Two collectors trade maxima on one listing

Starting state:

- customer A and customer B are signed in on separate sessions, each with `<card>` linked, both on `<listing_21>`.
- `<listing_21>` is live, holds no bids and starts at `<starting price>`.

Shared test data:

| Field | Value |
| --- | --- |
| card | Visa ending 4242 |
| listing_21 | A live USD listing with no bids |
| starting price | USD1,280 (range: 100000–499999 minor units) |
| user A maximum | USD8,400 (range: 500000–999999 minor units) |
| user B maximum | USD5,700 (range: 500000–839999 minor units), below `<user A maximum>` |
| lower maximum | USD3,400 (range: 100000–839999 minor units), below `<user A maximum>` |
| user B raise | USD9,600 (range: 840001–999999 minor units), above `<user A maximum>` |
| price after B | USD6,200 (fixed derived): `<user B maximum>` plus USD500 |
| price after raise | USD8,900 (fixed derived): `<user A maximum>` plus USD500 |

### Route

1. As customer A, select Set maximum, enter `<user A maximum>` and confirm.
   - customer A leads at `<starting price>`. `g10.auction-dmn.US4-TC1`
2. As customer B, set a maximum of `<user B maximum>` and confirm.
3. As customer A, reload `<listing_21>` and read the bid panel and Recent Bids.
   - customer A still leads, and Highest bid reads `<price after B>`. `g10.auction-dmn.US4-TC1`
   - Your maximum, Highest bid and the standing read as three separate facts. `g10.auction-dmn.US4-TC1`
   - The raise to `<price after B>` is shown as placed on customer A's behalf, not as a manual bid. `g10.auction-dmn.US4-TC2`
4. Read `<card>`'s activity for customer A at the card provider.
   - Nothing is held or charged on `<card>`. `g10.auction-dmn.US4-TC2`
5. As customer A, select Raise and enter `<lower maximum>`.
   - The bid form reads Min, naming the smallest maximum above `<user A maximum>`, and Place Bid is disabled. `g10.auction-dmn.US4-TC3`
   - Your maximum stays `<user A maximum>`, Highest bid `<price after B>`, and customer A Leading. `g10.auction-dmn.US4-TC3`
6. As customer B, select Raise, enter `<user B raise>` and confirm.
   - customer B leads at `<price after raise>`, with no bid recorded at an amount in between. `g10.auction-dmn.US4-TC1`
7. As customer A, read the bid panel on `<listing_21>`, then open `<bids url>`.
   - customer A reads Outbid, with Your maximum `<user A maximum>` and Highest bid `<price after raise>`. `g10.auction-dmn.US5-TC1`
   - `<listing_21>` is listed once under Active, Outbid, with its price, currency code and latest activity time. `g10.auction-dmn.US5-TC1`
   - Its history holds no line for the refused lower maximum. `g10.auction-dmn.US4-TC3`

## Walk 2: Bidders and a browser watch one listing close

Starting state:

- customer A leads `<listing_57>` at `<final price>` with maximum `<user A maximum>`; customer B committed `<user B maximum>` and was outbid.
- customer A and customer B are on `<listing_57>`'s page on separate sessions; customer C is on `<auction url>` with `<listing_57>`'s card in All auctions.
- `<listing_57>`'s recorded close is under a minute away, and nobody bids again.

Shared test data:

| Field | Value |
| --- | --- |
| listing_57 | A USD listing in extended bidding, led by customer A |
| user A maximum | USD8,400 (range: 620001–999999 minor units), above `<final price>` |
| user B maximum | USD5,700 (range: 500000–619999 minor units) |
| final price | USD6,200 (fixed derived): `<user B maximum>` plus USD500 |

### Route

1. Wait through the recorded close on all three pages, without reloading.
   - Once the close passes, the listing pages read Closed with no result until the close is recorded. `g10.auction-dmn.US12-TC1`
   - Until then, customer C's card keeps its closed state with `<final price>` and no result. `g10.auction-dmn.US12-TC2`
2. Read each page once the result shows.
   a. As customer A, read the listing.
      - It reads Won, with Highest bid `<final price>`. `g10.auction-dmn.US12-TC1`
   b. As customer B, read the listing.
      - It reads Did not win, with Highest bid `<final price>`. `g10.auction-dmn.US12-TC1`
   c. As customer C, read `<listing_57>`'s card.
      - It reads Ended and names when it ended, with no watch control, and the page never reloaded. `g10.auction-dmn.US12-TC2`
3. As customer A, open `<my auctions url>`, select Ended and find `<listing_57>`.
   - The row reads Won, Current bid `<final price>`. `g10.auction-dmn.US12-TC1`
4. As customer B, open `<my auctions url>`, select Ended and find `<listing_57>`.
   - The row reads Didn't win, Current bid `<final price>`, not `<user B maximum>`, and "Your card was not charged." `g10.auction-dmn.US12-TC1`

## g10.auction-dmn.US4: Collector commits a maximum and is bid to the lead

**As a** collector,
**I want** to commit one maximum and Grade10 to bid for me,
**so that** I keep the lead without sitting on the page, and nothing is taken
from my card until I win.

<!-- trace:case id=g10.auction-dmn.TC-r2v rev=3 -->
### g10.auction-dmn.US4-TC1: Two maxima settle at the lower maximum plus one increment

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer A and customer B are signed in on separate sessions, each with a linked card, both on `<listing_21>`.
* `<listing_21>` is live, holds no bids and starts at `<starting price>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_21>` | A live USD listing with no bids |
| `<starting price>` | USD1,280 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–839999 minor units), below `<user A maximum>` |
| `<user B raise>` | USD9,600 (range: 840001–999999 minor units), above `<user A maximum>` |
| `<price after B>` | USD6,200 (fixed derived): `<user B maximum>` plus USD500 |
| `<price after raise>` | USD8,900 (fixed derived): `<user A maximum>` plus USD500 |

**Steps:**

1. As customer A, select Set maximum, enter `<user A maximum>` and confirm.
2. As customer B, set a maximum of `<user B maximum>` and confirm.
3. As customer A, reload `<listing_21>` and read Your maximum, Highest bid and the standing.
4. As customer B, select Raise, enter `<user B raise>` and confirm.

**Expected Results:**

* After step 1 customer A leads at `<starting price>`.
* Step 3: customer A still leads, Highest bid reads `<price after B>`, and Your maximum, Highest bid and the standing read as three separate facts.
* After step 4 customer B leads at `<price after raise>`, with no bid recorded at an amount in between.

<!-- trace:case id=g10.auction-dmn.TC-cru rev=4 -->
### g10.auction-dmn.US4-TC2: An auto-bid raises the leader on their behalf, with nothing taken from the card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* customer A leads `<listing_75>` at `<leader price>` with a committed maximum of `<user A maximum>`, placed on `<card>`.
* customer B is signed in with a linked card and is on `<listing_75>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_75>` | A live USD listing led by customer A |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–839999 minor units), below `<user A maximum>` |
| `<resolved price>` | USD6,200 (fixed derived): `<user B maximum>` plus USD500 |

**Steps:**

1. As customer B, set a maximum of `<user B maximum>` and confirm.
2. As customer A, open `<listing_75>` and read Highest bid, Your maximum and Recent Bids.
3. As customer A, open `<bids url>` and expand `<listing_75>`.
4. Read `<card>`'s activity at the card provider.

**Expected Results:**

* Step 2: Highest bid reads `<resolved price>`, customer A still leads, and Your maximum reads `<user A maximum>`.
* Step 3: the bid count includes the raise, and the history shows it as placed on customer A's behalf, not as a manual bid.
* Step 4 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-dmn.TC-b5t rev=4 -->
### g10.auction-dmn.US4-TC3: Lowering a maximum is refused on the bid form and the lead holds

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* customer A leads `<listing_78>` at `<leader price>` with a committed maximum of `<user A maximum>` and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_78>` | A live USD listing led by customer A |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<lower maximum>` | USD3,400 (range: 100000–839999 minor units), below `<user A maximum>` |

**Steps:**

1. Open `<bids url>`, expand `<listing_78>` and count its history lines.
2. Return to `<listing_78>`, select Raise and enter `<lower maximum>`.
3. Read the bid form, Your maximum, Highest bid and the standing.
4. Open `<bids url>` and expand `<listing_78>`.
5. Open `<my auctions url>` and read `<listing_78>`'s row.

**Expected Results:**

* Step 3: the bid form reads Min, naming the smallest maximum above `<user A maximum>`, and Place Bid is disabled, so nothing is sent.
* Step 3: Your maximum reads `<user A maximum>`, Highest bid `<leader price>`, and customer A Leading.
* Step 4 shows the same history lines as step 1, with no line for the refused attempt.
* Step 5's row reads Leading, with Current bid `<leader price>`.

---

## g10.auction-dmn.US5: Collector learns they were outbid and finds it in their bids

**As a** collector,
**I want** losing the lead to show on the listing and in my bids index,
**so that** I can see I was outbid and what the next bid must clear.

<!-- trace:case id=g10.auction-dmn.TC-0cq rev=4 -->
### g10.auction-dmn.US5-TC1: Outbid standing reaches the listing page and the Bids page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* customer A leads `<listing_24>` at `<leader price>` with a committed maximum of `<user A maximum>`.
* customer B is signed in with a linked card and is on `<listing_24>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A live USD listing led by customer A |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD9,600 (range: 840001–999999 minor units), above `<user A maximum>` |
| `<resolved price>` | USD8,900 (fixed derived): `<user A maximum>` plus USD500 |

**Steps:**

1. As customer B, set a maximum of `<user B maximum>` and confirm.
2. As customer A, open `<listing_24>` and read the bid panel.
3. As customer A, open `<bids url>` and read the Active list.

**Expected Results:**

* Step 2 reads Outbid, with Your maximum still `<user A maximum>` and Highest bid `<resolved price>`.
* Step 3 lists `<listing_24>` once under Active, Outbid, with its price, currency code and latest activity time.

---

## g10.auction-dmn.US12: Bidders follow a listing through its close to their record

**As a** bidder,
**I want** the listing page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

<!-- trace:case id=g10.auction-dmn.TC-3iz rev=3 -->
### g10.auction-dmn.US12-TC1: Winner and losing bidder read one result on the listing and My Auctions

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14, grade10-site-auction-account-record-US-10, grade10-site-auction-account-record-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_57>` at `<final price>` with maximum `<user A maximum>`; customer B committed `<user B maximum>` and was outbid.
* customer A and customer B are on `<listing_57>`'s page on separate sessions.
* `<listing_57>`'s recorded close is under a minute away, and nobody bids again.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_57>` | A USD listing in extended bidding, led by customer A |
| `<user A maximum>` | USD8,400 (range: 620001–999999 minor units), above `<final price>` |
| `<user B maximum>` | USD5,700 (range: 500000–619999 minor units) |
| `<final price>` | USD6,200 (fixed derived): `<user B maximum>` plus USD500 |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the listing's state.
3. As customer B, read the listing's state.
4. As customer A, open `<my auctions url>`, select Ended and find `<listing_57>`.
5. As customer B, open `<my auctions url>`, select Ended and find `<listing_57>`.

**Expected Results:**

* Once the close passes, both pages read Closed with no result until the close is recorded.
* Step 2 reads Won and step 3 reads Did not win, with Highest bid `<final price>` on both.
* Step 4's row reads Won, Current bid `<final price>`.
* Step 5's row reads Didn't win, Current bid `<final price>`, not `<user B maximum>`, and "Your card was not charged."

<!-- trace:case id=g10.auction-dmn.TC-8w7 rev=3 -->
### g10.auction-dmn.US12-TC2: The catalogue card and the listing page turn at the close without a reload

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* customer A leads `<listing_60>` at `<final price>` and is on its page.
* customer C is on `<auction url>` with `<listing_60>`'s card in All auctions.
* `<listing_60>`'s recorded close is under a minute away, and nobody bids again.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_60>` | A USD listing in extended bidding, led by customer A |
| `<final price>` | USD6,200 (range: 500000–999999 minor units) |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the listing's state once the result shows.
3. As customer C, read `<listing_60>`'s card.

**Expected Results:**

* Once the close passes, customer A's page reads Closed with no result until the close is recorded, and customer C's card keeps its closed state with `<final price>` and no result.
* Step 2 reads Won, with Highest bid `<final price>`.
* Step 3's card reads Ended and names when it ended, with no watch control.
* Neither page reloaded.

## Ungrouped

### g10.auction-dmn.US1: Operator publishes a gallery a collector can shop

**As an** operator with catalogue grant,
**I want** the images and alt text I confirm on a draft listing to be what the
catalogue and the listing page show,
**so that** a collector shops the card I photographed rather than a placeholder.

<!-- trace:case id=g10.auction-dmn.TC-5l7 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j,g10.auction-listing-media.SC-41j,g10.auction-listing-media.SC-j5f,g10.auction-listing-media.SC-1mk,g10.auction-listing-media.SC-su1,g10.auction-listing-media.SC-y9i,g10.auction-listing-media.SC-dva,g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1,g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3 -->
#### g10.auction-dmn.US1-TC1: A confirmed gallery image reaches the catalogue card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01, grade10-site-auction-listing-media-US-04, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* admin(holds the catalogue grant) is on `<admin listings url>`.
* `<listing_3>` is a draft with an empty gallery.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A draft auction listing with an empty gallery |
| `<image file>` | charizard-front.jpg, a 3.6 MB JPEG |
| `<alt text>` | 1999 Charizard PSA 10, front, shadowless 1st edition |

**Steps:**

1. Open the media manager for `<listing_3>`.
2. Select `<image file>` for a gallery slot.
3. Confirm the upload and enter `<alt text>`.
4. Publish `<listing_3>`.
5. Open `<auction url>` and find `<listing_3>`.

**Expected Results:**

* Step 2 shows a preview of `<image file>` and stores nothing until step 3.
* After step 3 `<image file>` is the gallery's first item, shown at card size in the media manager.
* Step 5: `<listing_3>`'s catalogue card shows `<image file>` at card size, with `<alt text>` as its accessible name.

<!-- trace:case id=g10.auction-dmn.TC-acb rev=1 -->
#### g10.auction-dmn.US1-TC2: An unsupported file never reaches the gallery or the catalogue

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* admin(holds the catalogue grant) is on `<admin listings url>`.
* `<listing_72>` is published with three gallery images.

**Test data:**

| `<image file>` | `<refusal>` |
| --- | --- |
| grading-report.pdf, a 1.3 MB PDF | its type is not JPEG, PNG, WebP or AVIF |
| charizard-back.jpg, a 113 MB JPEG | it is above the 104857600-byte bound (fixed boundary) |

**Steps:**

1. Open the media manager for `<listing_72>`.
2. Select `<image file>` for a gallery slot.
3. Open `<auction url>` and find `<listing_72>`.

**Expected Results:**

* Step 2 refuses `<image file>` because `<refusal>`.
* `<listing_72>` still holds its three gallery images in their order.
* Step 3: `<listing_72>`'s catalogue card is unchanged.

### g10.auction-dmn.US2: Collector picks a listing out of the catalogue and opens it

**As a** collector,
**I want** to pick a listing off the auction catalogue and land on that listing's own
page,
**so that** the card I chose, its images, and where its bidding stands are what
I read.

<!-- trace:case id=g10.auction-dmn.TC-23e rev=1 -->
#### g10.auction-dmn.US2-TC1: A catalogue card opens its own listing page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-05, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* customer is on `<auction url>`.
* `<listing_6>` and `<listing_7>` are published in different categories, each with an image as its first gallery item.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A published listing in Pokémon with three gallery images |
| `<listing_7>` | A published listing in another category, its first gallery item an image |

**Steps:**

1. Read the cards for `<listing_6>` and `<listing_7>`.
2. Open the card for `<listing_6>`.

**Expected Results:**

* Each card carries a card-size image, its title and its current standing, with money in USD and its currency code.
* No card offers Buy Now or a stock count.
* Step 2 opens `<listing_6>`'s own address without a full page load, showing that listing.

<!-- trace:case id=g10.auction-dmn.TC-yqv rev=3 -->
#### g10.auction-dmn.US2-TC2: A listing page reads whole with scripts turned off

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01, grade10-site-auction-auction-US-01

**Pre-conditions:**

* customer's browser has JavaScript turned off.
* `<listing_9>` is live with current bid `<current bid>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A live USD listing with bids |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |

**Steps:**

1. Open `<listing_9>`'s page.

**Expected Results:**

* The page shows `<listing_9>`'s name, description, sale and current standing, with Highest bid `<current bid>`.
* Money reads in USD with its currency code, and no reserve or Buy Now price appears.

### g10.auction-dmn.US3: Collector links a card and places a first bid

**As a** collector,
**I want** to study the gallery, link my card once, and bid inside the window,
**so that** the card I looked at is the card my bid stands on, with nothing taken from it until I win.

<!-- trace:case id=g10.auction-dmn.TC-rl3 rev=4 -->
#### g10.auction-dmn.US3-TC1: Studying the gallery leads to an accepted first bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05, grade10-site-auction-auction-US-02, grade10-site-auction-bid-payment-method-US-01

**Pre-conditions:**

* customer(card linked) is signed in with `<card>` and is on `<listing_15>`.
* `<listing_15>` is live, holds no bids, starts at `<starting price>` and has more than one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_15>` | A live USD listing with no bids and several gallery images |
| `<starting price>` | USD1,200 (range: 100000–499999 minor units) |
| `<bid amount>` | `<starting price>` (fixed equality: a first bid may stand on the starting price) |

**Steps:**

1. Step through the gallery thumbnails and open one image at zoom size.
2. Enter `<bid amount>` in the bid field and select Place Bid.
3. Read Time left, Highest bid and Recent Bids.
4. Read `<card>`'s activity at the card provider.

**Expected Results:**

* Step 1 walks the gallery in order at thumb, detail and zoom sizes.
* Step 2 accepts the bid in the one answer, with no Authorizing state before it.
* Step 3: Highest bid reads `<bid amount>`, the bid count reads 1, and Recent Bids shows the bid as You.
* Step 4 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-dmn.TC-5pk rev=4 -->
#### g10.auction-dmn.US3-TC2: A bid below the next minimum is refused on the bid form and recorded nowhere

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-01, grade10-site-auction-account-record-US-02

**Pre-conditions:**

* customer(card linked) is signed in, holds no bid on `<listing_18>`, does not watch it, and is on it.
* `<listing_18>` is live with current bid `<current bid>` and `<bid count>` bids from other customers.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_18>` | A live USD listing with bids from other customers |
| `<current bid>` | USD4,960 (range: 250000–499999 minor units, the USD2,500 tier) |
| `<bid count>` | 2 |
| `<minimum next bid>` | USD5,210 (fixed derived): `<current bid>` plus USD250 |
| `<bid amount>` | USD5,209 (fixed boundary): one dollar below `<minimum next bid>` |

**Steps:**

1. Enter `<bid amount>` in the bid field and read the bid form.
2. Reload `<listing_18>` and read Highest bid, the bid count and Recent Bids.
3. Open `<bids url>` and look for `<listing_18>`.
4. Open `<my auctions url>` and look for `<listing_18>`.

**Expected Results:**

* Step 1: the bid form reads Min `<minimum next bid>` and Place Bid is disabled, so nothing is sent.
* Step 2 reads Highest bid `<current bid>`, bid count `<bid count>`, and no row of the customer's in Recent Bids.
* Step 3 shows no entry for `<listing_18>`.
* Step 4 shows no row for `<listing_18>`.

### g10.auction-dmn.US5: Collector learns they were outbid and finds it in their bids

<!-- trace:case id=g10.auction-dmn.TC-57p rev=1 -->
#### g10.auction-dmn.US5-TC2: An outbid summary opens its explanation and its listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05, grade10-site-auction-bidding-history-US-03, grade10-site-auction-listing-page-US-05

**Pre-conditions:**

* customer is signed in and is on `<bids url>`.
* customer placed one accepted manual bid and one auto-bid on `<listing_27>`, and customer B now leads it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_27>` | A live listing the customer bid on manually and automatically, now led by customer B |

**Steps:**

1. Expand `<listing_27>`'s history.
2. Open `<listing_27>` from its summary.

**Expected Results:**

* Step 1: customer B's accepted bid and the customer's own standing change sit in one order.
* Step 1: the customer's own rows read You, and customer B stays a listing pseudonym with no maximum shown.
* Step 2 lands on `<listing_27>`'s own page.

### g10.auction-dmn.US6: Collector shares a listing link

**As a** collector,
**I want** a listing link I pass on to unfurl as that listing and open live,
**so that** whoever I send it to reads the card I meant, not the catalogue.

<!-- trace:case id=g10.auction-dmn.TC-wrl rev=3 -->
#### g10.auction-dmn.US6-TC1: A shared listing page keeps its served standing as it comes alive

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-02, grade10-site-auction-listing-page-US-04, grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_30>` is live with current bid `<current bid>`, and `<time left>` remains until its close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_30>` | A live USD listing with bids and a close approaching |
| `<current bid>` | USD4,960 (range: 100000–499999 minor units) |
| `<time left>` | 7 minutes (range: 2–15 minutes) |

**Steps:**

1. With JavaScript turned off, open `<listing_30>`'s page.
2. With JavaScript on, open the same address and watch Time left and Highest bid as the page finishes loading.

**Expected Results:**

* Step 1 shows the gallery, description and standing with no loading placeholder over them.
* Step 2: Time left counts on from the served value rather than jumping or blanking.
* Step 2: Highest bid still reads `<current bid>` once the page has finished loading.

### g10.auction-dmn.US7: Collector watches a late bid push the close out

**As a** collector,
**I want** a bid accepted during extended bidding to move the close on the page,
**so that** the time I read and the time I am judged by are the same.

<!-- trace:case id=g10.auction-dmn.TC-wh3 rev=3 -->
#### g10.auction-dmn.US7-TC3: A price-moving auto-bid in extended bidding restarts the timer on the open page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auction-US-12, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-listing-page-US-12

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-page/live-room.spec.ts`

**Pre-conditions:**

* customer A leads `<listing_36>` at `<leader price>` with maximum `<user A maximum>` and is on its page.
* customer B(card linked) is signed in on a separate session, on the same page.
* `<listing_36>` is in extended bidding, its recorded close `<time left before bid>` away.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_36>` | A USD listing in extended bidding, led by customer A |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |
| `<time left before bid>` | 4 minutes (range: 1–10 minutes) |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD5,700 (range: 500000–839999 minor units), below `<user A maximum>` |
| `<resolved price>` | USD6,200 (fixed derived): `<user B maximum>` plus USD500 |

**Steps:**

1. As customer A, read Time left.
2. As customer B, enter `<user B maximum>` in the custom maximum and confirm the bid.
3. As customer A, without reloading, read Highest bid and Time left.
4. Wait `<extension duration>` with no further bid.

**Expected Results:**

* Step 3 reads Highest bid `<resolved price>`, and customer A still leads.
* Step 3 reads Time left `<extension duration>`, labelled Extended bidding, with no reload.
* After step 4 the listing closes, with no further bid placed.

<!-- trace:case id=g10.auction-dmn.TC-n2z rev=2 -->
#### g10.auction-dmn.US7-TC4: The catalogue card, the Featured slide and the open listing page agree after an extension

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-12, grade10-site-auction-listing-page-US-13

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* `<listing_39>` is in extended bidding, led by customer A at `<leader price>` with maximum `<user A maximum>`, its recorded close `<time left before bid>` away, and set as a Featured slide.
* customer A is on `<listing_39>`'s page.
* customer B(card linked) is signed in on a separate session, on the same page.
* customer C is on `<auction url>` with `<listing_39>`'s Featured slide and All auctions card in view, on a device whose clock is `<device skew>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_39>` | A USD listing in extended bidding, led by customer A |
| `<time left before bid>` | 4 minutes (range: 1–10 minutes) |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |
| `<user B maximum>` | USD9,600 (range: 840001–999999 minor units), above `<user A maximum>` |
| `<resolved price>` | USD8,900 (fixed derived): `<user A maximum>` plus USD500 |
| `<device skew>` | 4 minutes behind (range: 1–10 minutes behind) |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum and confirm the bid.
2. As customer C, without reloading, read `<listing_39>`'s All auctions card and Featured slide.
3. As customer A, without reloading, read Highest bid and Time left at the same moment.

**Expected Results:**

* The card, the slide and the listing page all read `<resolved price>`.
* The card's and the slide's Ends in and the page's Time left agree to the second, and neither is `<device skew>` off.
* The slide still reads LIVE BIDDING, with no Extended label.
* Neither page reloaded.

<!-- trace:case id=g10.auction-dmn.TC-5yl rev=2 -->
#### g10.auction-dmn.US7-TC2: The extension cap holds while the bid is still accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* customer(card linked) is signed in and is on `<listing_33>`.
* `<listing_33>` is live with current bid `<current bid>`, has an extension cap, and its recorded close already stands at that cap, `<time left>` away.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_33>` | A live USD listing whose close already stands at its extension cap |
| `<current bid>` | USD4,960 (range: 250000–499999 minor units, the USD2,500 tier) |
| `<bid amount>` | USD5,210 (fixed derived): `<current bid>` plus USD250, the minimum next bid |
| `<time left>` | 3 minutes (range: 1–29 minutes, inside the 30-minute extension window) |

**Steps:**

1. Submit a bid of `<bid amount>`.
2. Read Highest bid and Time left.
3. Open `<bids url>` and expand `<listing_33>`.

**Expected Results:**

* Step 1 accepts the bid, and Highest bid reads `<bid amount>`.
* Step 2: Time left counts down to the capped close, which does not move.
* Step 3 shows the accepted bid beside an unchanged close.

### g10.auction-dmn.US8: Collector's private bidding facts stay private

**As a** collector,
**I want** my maximum kept to my own account,
**so that** a rival, a signed-out visitor, or another storefront reads none of
it.

<!-- trace:case id=g10.auction-dmn.TC-nhf rev=4 -->
#### g10.auction-dmn.US8-TC1: A rival reads the price but never the leader's maximum

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* customer A leads `<listing_42>` at `<leader price>` with a committed maximum of `<user A maximum>`.
* customer B is signed in, holds no bid on `<listing_42>`, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_42>` | A live USD listing led by customer A |
| `<leader price>` | USD1,200 (range: 100000–499999 minor units) |
| `<user A maximum>` | USD8,400 (range: 500000–999999 minor units) |

**Steps:**

1. As customer B, read the bid panel and Recent Bids.
2. Sign out and open the same address.

**Expected Results:**

* Step 1: Highest bid reads `<leader price>`, and `<user A maximum>` shows nowhere.
* Step 1: Recent Bids names other customers by listing pseudonym only, with no card facts.
* Step 2 shows no private history and no maximum.

<!-- trace:case id=g10.auction-dmn.TC-n6x rev=1 -->
#### g10.auction-dmn.US8-TC2: A signed-out visitor keeps their destination

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05, grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* customer is signed out; their account holds an accepted bid on `<listing_45>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_45>` | A live listing the customer's account holds an accepted bid on |

**Steps:**

1. Open `<bids url>`.
2. Sign in as that customer.

**Expected Results:**

* Step 1 shows no private history.
* Step 2 lands back on the Bids page, showing the account's Active list with `<listing_45>` in it.

<!-- trace:case id=g10.auction-dmn.TC-fp8 rev=4 -->
#### g10.auction-dmn.US8-TC3: A linked collector's bid stands at once on the card on file

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer A(card linked) is signed in and is on `<listing_48>`'s page.
* customer B(card linked) is signed in on a separate session and can bid on `<listing_48>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_48>` | An open USD listing with no bids, starting at `<starting price>` |
| `<starting price>` | USD280 (range: 20000–49999 minor units) |
| `<user A maximum>` | USD560 (range: 50000–99999 minor units) |
| `<user B maximum>` | USD920 (range: 61001–99999 minor units), above `<price after B>` |
| `<price after B>` | USD610 (fixed derived): `<user A maximum>` plus USD50 |

**Steps:**

1. As customer A, enter `<user A maximum>` in the custom maximum and confirm the bid.
2. As customer B, enter `<user B maximum>` in the custom maximum on the same listing and confirm the bid.
3. Read the bid panel.
4. Read both customers' card activity at the card provider.

**Expected Results:**

* Step 1 accepts the bid at `<starting price>` in the one answer, and Change is unavailable.
* Step 3: Highest bid reads `<price after B>`, and customer B leads.
* Step 4 shows nothing held or charged on either card.

### g10.auction-dmn.US9: Collector meets a listing that is not there

**As a** collector,
**I want** a dead listing address to say so plainly,
**so that** I am never shown an empty page in place of a listing.

<!-- trace:case id=g10.auction-dmn.TC-0rf rev=1 -->
#### g10.auction-dmn.US9-TC1: An address naming no published listing shows Page not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03, grade10-site-auction-auction-US-01

**Pre-conditions:**

* The catalogue publishes no listing under `<unavailable listing url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unavailable listing url>` | An address under the auction's listings naming no published listing |

**Steps:**

1. Open `<unavailable listing url>`.

**Expected Results:**

* The site's Page not found screen shows.
* Neither an empty listing page nor the catalogue shows in its place.

<!-- trace:case id=g10.auction-dmn.TC-13a rev=1 -->
#### g10.auction-dmn.US9-TC2: Unavailable card capability fails the bid explicitly

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-02, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* `<listing_12>` is live and its current bid is `<current bid>`.
* The card authorization capability a bid needs is unavailable for the payment account `<listing_12>` runs on.
* A user is signed in with `<card>` saved, holds no accepted bid on `<listing_12>`, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A live listing whose payment account has no card authorization capability |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Enter `<bid amount>` and select **Place Bid**.
2. Navigate to `<grade10 bids url>` and expand `<listing_12>`.

**Expected Results:**

* The bid fails naming the unavailable capability, with no credentials, card, or address data shown.
* No bid, hold or fixture-backed outcome is created and Highest bid stays `<current bid>`.
* The attempt appears as a failed event with a safe payment reason, and `<listing_12>` carries failed-only standing.

### g10.auction-dmn.US11: Collector follows an old link to a hidden listing

**As a** collector,
**I want** a called-off listing gone from browse and search,
**so that** its former address answers the current listing or Page not found.

<!-- trace:case id=g10.auction-dmn.TC-dw9 rev=4 -->
#### g10.auction-dmn.US11-TC1: A released address follows its new public holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02, grade10-site-auction-listing-page-US-03, grade10-site-auction-listing-page-US-01, grade10-site-auction-lot-status-US-03

**Pre-conditions:**

* `<listing_54>` was published and listed in the catalogue, customer A bid on it, and an operator then called it off.
* customer A saved `<listing_54 url>` while `<listing_54>` was published.
* admin(holds auction:operate) is on `<admin listings url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_54>` | A listing published, bid on by customer A, then called off |
| `<listing_54 url>` | The address `<listing_54>` was published at |
| `<original title>` | `<listing_54>`'s title before call-off |
| `<listing_55>` | A complete draft given `<listing_54>`'s released slug and a different title |

**Steps:**

1. Open `<auction url>` and search for `<original title>`.
2. Open `<listing_54 url>`.
3. As customer A, read `<listing_54>` in `<my auctions url>`.
4. As admin, read `<listing_54>`'s code, then create and publish `<listing_55>`.
5. As customer A, open `<listing_54 url>`.
6. As customer A, open `<my auctions url>`.
7. As admin, reopen `<listing_54>`.
8. As customer A, search `<auction url>` for `<original title>`.

**Expected Results:**

* Step 1 does not find `<listing_54>`, and step 2 shows Page not found.
* Steps 3 and 6 list `<listing_54>` with its original bids, its row saying the card was not charged, and no link to `<listing_55>`.
* Step 4: `<listing_55>` takes a code of its own, and `<listing_54>` keeps its code.
* Step 5 shows `<listing_55>`'s page and title, not `<listing_54>`'s.
* Step 7 reads canceled, with `<listing_54>`'s code unchanged.
* Step 8 does not find `<listing_54>`.

### g10.auction-dmn.US12: Bidders follow a listing through its close to their record

<!-- trace:case id=g10.auction-domain.TC-k4p rev=6 covers=g10.auction-winner-order.SC-ug0,g10.auction-winner-order.SC-fq4 -->
#### g10.auction-dmn.US12-TC3: An HKD winner pays the total shown and keeps matching documents

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, winner-order-US-01, winner-order-US-24, winner-order-US-25, winner-order-US-26, winner-order-US-27

**Pre-conditions:**

* customer A won `<listing_63>` at `<winning bid>` with buyer's premium `<buyer's premium>`, is on its order setup page, and no invoice has been sent.
* HKD and Card are offered; Payment Settings holds an HKD card rule of `<card fee percent>` per cent plus `<fixed card fee>`.
* admin(holds auction:operate) can open the order in the admin console.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_63>` | A closed USD listing won by customer A |
| `<winning bid>` | USD101.00 (10100 minor units) |
| `<buyer's premium>` | USD20.20 (2020 minor units) |
| `<shipping>` | USD10.01 (1001 minor units) |
| `<USD sum>` | USD131.21 (fixed derived): winning bid, premium and shipping added |
| `<HKD subtotal>` | HKD1,030.00 (fixed derived): `<USD sum>` times 7.85, converted once and rounded up to the next cent |
| `<card fee percent>` | 3.4 (fixed configured) |
| `<fixed card fee>` | HKD2.35 (fixed configured) |
| `<HKD card fee>` | HKD38.69 (fixed derived): the gross-up rule on `<HKD subtotal>`, rounded up |
| `<amount payable>` | HKD1,068.69 (fixed derived): `<HKD subtotal>` plus `<HKD card fee>` |
| `<stripe test card>` | 4242 4242 4242 4242, any future expiry and any security code |

**Steps:**

1. Read the setup choices and Order Summary.
2. Select HKD, then Card; confirm the address and setup, and read the Order Summary.
3. As admin, quote the order with Shipping & Handling of `<shipping>`, read the quote preview and send its invoice.
4. As customer A, reopen the order and read its status, Order Summary rows, the note under the Subtotal, the fee and the Order Total.
5. Select the Invoice link beside the Order summary heading and read its lines, Subtotal, fee and total.
6. Select Pay with Card and pay with `<stripe test card>`.
7. Open the Payment received letter in customer A's inbox and its attached receipt PDF.

**Expected Results:**

* Step 1 preselects no settlement currency or payment method and shows no HKD amount.
* Step 2 records HKD and Card, and the summary still shows no HKD amount.
* Step 3 previews the USD lines, then the HKD Subtotal, fee and total with no rate, and sends an invoice including `<shipping>`.
* Step 4 reads Pending Payment and lists the winning bid, premium and shipping in USD, then one HKD Subtotal of `<HKD subtotal>` whose note names `<USD sum>` and 1 USD = 7.85 HKD.
* Step 4 shows a Payment Processing Fee of `<HKD card fee>` with no USD amount beside it, and one Order Total of `<amount payable>`; no USD total shows.
* Step 5 prints the same lines, Subtotal, fee and Order Total, and names no rate.
* Step 6 charges `<amount payable>`, and the order reads Preparing Shipment.
* Step 7: the letter and the receipt PDF list the same lines, Subtotal, fee and Order Total; the letter names no rate, and the receipt PDF carries `Converted from US$131.21 at 1 USD = 7.85 HKD` directly under its Subtotal, drawn muted.

### g10.auction-dmn.US13: Collectors bid against a house maximum through the close

**As a** collector,
**I want** to compete for a listing to its close, with each bid, extension, result and letter decided by the auction rules,
**so that** what I read, and what I am told, is what the auction decided.

<!-- trace:case id=g10.auction-domain.TC-88l rev=3 -->
#### g10.auction-dmn.US13-TC1: The house outbids a collector and the listing closes sold under its pseudonym

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-notifications-US-03, grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-11, grade10-site-auction-notifications-US-06, grade10-site-auction-notifications-US-07

**Pre-conditions:**

* customer A(card linked, email alerts on) leads `<listing_66>` at `<starting price>` with maximum `<user A maximum>`, and will not bid again.
* `<listing_66>` has an internal bid of `<house maximum>`, its commit time 5 minutes before the scheduled close and still ahead.
* customer D(email alerts on) watches `<listing_66>` and will not bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_66>` | A published USD listing starting at `<starting price>`, extension duration `<extension duration>`, no cap |
| `<starting price>` | USD4,000 (range: 100000–499999 minor units) |
| `<house maximum>` | USD6,000 (range: 550000–999999 minor units), above `<final price>` |
| `<user A maximum>` | USD5,000 (range: 500000–549999 minor units, the USD5,000 tier) |
| `<final price>` | USD5,500 (fixed derived): `<user A maximum>` plus USD500 |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |

**Steps:**

1. Wait until the internal bid's commit time passes.
2. As customer A, read the standing, Highest bid and Recent bids on `<listing_66>`.
3. Read the mail sent to customer A.
4. Wait through the scheduled close and the extended close, with no further bid.
5. As customer A, read the listing's state.
6. As customer A, open `<my auctions url>`, select Ended and find `<listing_66>`.
7. Read the mail sent to customer A and customer D at the close.

**Expected Results:**

* Step 2 reads Outbid, Highest bid `<final price>`, and Recent bids lists customer A at `<starting price>`, then the house at `<final price>` under its listing pseudonym.
* Step 3: one You have been outbid letter, and no New bid letter.
* Step 4: the listing enters extended bidding at the scheduled close and closes `<extension duration>` after it.
* Step 5 reads Did not win, sold at `<final price>`, the crowned row the house's pseudonym.
* Step 6's row reads Didn't win, Current bid `<final price>`, and "Your card was not charged."
* Step 7: customer A gets one You did not win letter with Winning bid `<final price>`; customer D gets one Lot watched, sold letter with Sold for `<final price>`.

<!-- trace:case id=g10.auction-domain.TC-su0 rev=2 -->
#### g10.auction-dmn.US13-TC2: A collector beats the house in extended bidding and wins

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-12, grade10-site-auction-auction-US-11, grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_69>`'s internal bid of `<house maximum>` is committed, and the house leads at `<leader price>` over customer A's maximum `<user A maximum>`.
* `<listing_69>` is in extended bidding, its recorded close `<time left before bid>` away.
* customer B(card linked) is signed in on `<listing_69>`'s page, on a separate session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_69>` | A published USD listing in extended bidding, extension duration `<extension duration>`, no cap |
| `<house maximum>` | USD6,000 (range: 550000–999999 minor units) |
| `<user A maximum>` | USD5,000 (range: 500000–549999 minor units) |
| `<leader price>` | USD5,500 (fixed derived): `<user A maximum>` plus USD500 |
| `<user B maximum>` | USD7,000 (range: 650000–999999 minor units), above `<final price>` |
| `<final price>` | USD6,500 (fixed derived): `<house maximum>` plus USD500 |
| `<extension duration>` | 1800 seconds (30 minutes, fixed configured duration) |
| `<time left before bid>` | 5 minutes (range: 1–29 minutes) |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum and confirm.
2. As customer B, read the standing, Highest bid and Time left.
3. Wait through the recorded close, with no further bid.
4. As customer B, read the listing's state.
5. As customer B, open `<my auctions url>`, select Ended and find `<listing_69>`.

**Expected Results:**

* Step 2 reads Leading, Highest bid `<final price>`, and Time left `<extension duration>` from customer B's bid.
* Step 4 reads Won, with Highest bid `<final price>`.
* Step 5's row reads Won with View order, Current bid `<final price>`.

### g10.auction-dmn.US10: Exploratory passes

<!-- trace:case id=g10.auction-dmn.TC-cnk rev=1 -->
#### g10.auction-dmn.US10-TC1: Roam the catalogue-to-bid path for one hour

**Retirement:** An exploratory charter states no outcome an anchor implies, and every case is a GUI walk with stated results (tcs-rules r7); the paths it roamed are the domain's other cases.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-media-US-05, grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* The catalogue publishes listings in every state across more than one category.

**Steps:**

1. Reach listings by every route and vary the pass.

**Expected Results:**

* No surface blanks, duplicates a listing, or drops a placeholder over content already served.

<!-- trace:case id=g10.auction-dmn.TC-6dl rev=3 -->
#### g10.auction-dmn.US10-TC2: Roam competing maxima and the closing minutes for one hour

**Retirement:** An exploratory charter states no outcome an anchor implies (tcs-rules r7); competing maxima and the close are walked by `g10.auction-dmn.US4-TC1`, `g10.auction-dmn.US7-TC3` and `g10.auction-dmn.US12-TC1`.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* `<listing_84>` is live with no bids.

**Steps:**

1. Trade maxima between two collectors into extended bidding.

**Expected Results:**

* Highest bid is never above the leader's maximum.

## Settled

- No domain case reads a card hold, a card authorization, a payment confirmation or a bid-time hold switch. A case that reads the card reads that nothing is held or charged on it.
- A refused attempt is not a bid: it shows on the bid form that made it and nowhere in the bidder's history, My Auctions or the lot's public record.
- A losing row on My Auctions reads "Your card was not charged."
