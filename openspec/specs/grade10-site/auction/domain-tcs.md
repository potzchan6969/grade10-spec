# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** reopened
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-auction-e2e-US01: Operator publishes a gallery a collector can shop

**As an** operator with catalogue grant,
**I want** the images and alt text I confirm on a draft listing to be what the
catalogue and the listing page show,
**so that** a collector shops the card I photographed rather than a placeholder.

<!-- trace:case id=g10.auction-domain.TC-5l7 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j,g10.auction-listing-media.SC-41j,g10.auction-listing-media.SC-j5f,g10.auction-listing-media.SC-1mk,g10.auction-listing-media.SC-su1,g10.auction-listing-media.SC-y9i,g10.auction-listing-media.SC-dva,g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1,g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3 -->
### grade10-site-auction-e2e-US01-TC01-1: Confirmed gallery image reaches the catalogue card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01, grade10-site-auction-listing-media-US-04, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin is on <grade10 auction admin listings url>.
* <listing_1> exists with an empty gallery.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A draft auction listing with an empty gallery |
| `<product>` | charizard-front.jpg, JPEG, 4.2 MB |
| `<alt text>` | 1999 Charizard PSA 10, front, shadowless 1st edition |

**Steps:**

1. Open the media manager for <listing_1>.
2. Select <product> for a gallery slot.
3. Confirm the upload and enter <alt text>.
4. Publish <listing_1>.
5. Navigate to <grade10 auction url> and find <listing_1>.

**Expected Results:**

* Step 2 shows a preview of <product> and stores nothing until step 3.
* <product> is stored as the gallery's first item and shows at card size in the media manager.
* The catalogue card for <listing_1> shows <product> at card size, with <alt text> as its accessible name.

<!-- trace:case id=g10.auction-domain.TC-acb rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j,g10.auction-listing-media.SC-41j,g10.auction-listing-media.SC-j5f,g10.auction-listing-media.SC-1mk,g10.auction-listing-media.SC-su1,g10.auction-listing-media.SC-y9i,g10.auction-listing-media.SC-dva,g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3 -->
### grade10-site-auction-e2e-US01-TC02-1: Unsupported file never reaches the gallery or the catalogue

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin is on <grade10 auction admin listings url>.
* <listing_2> is published with three gallery images.

**Test data:**

| `<product>` | `<refusal>` |
| --- | --- |
| grading-report.pdf, PDF, 1.1 MB | its type is not JPEG, PNG, WebP or AVIF |
| charizard-back.jpg, JPEG, 118 MB | it is above the 104857600-byte bound |

**Steps:**

1. Open the media manager for <listing_2>.
2. Select <product> for a gallery slot.
3. Navigate to <grade10 auction url> and find <listing_2>.

**Expected Results:**

* <product> is refused because <refusal>.
* <listing_2> still holds its three gallery images in their order.
* The catalogue card for <listing_2> is unchanged.

---

## grade10-site-auction-e2e-US02: Collector picks a lot out of the catalogue and opens it

**As a** collector,
**I want** to pick a lot off the auction catalogue and land on that lot's own
page,
**so that** the card I chose, its images, and where its bidding stands are what
I read.

<!-- trace:case id=g10.auction-domain.TC-23e rev=1 covers=g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8,g10.auction-listing-page.SC-fl9,g10.auction-listing-page.SC-aga,g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3 -->
### grade10-site-auction-e2e-US02-TC01-1: Catalogue card opens its own lot page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-05, grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* A user is on <grade10 auction url>.
* <listing_2> and <listing_3> are published in different categories.
* Each of them has an image as its first gallery item.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A published listing in Pokémon, gallery of three images |
| `<listing_3>` | A published listing in another category, first gallery item an image |

**Steps:**

1. Check the listing cards for <listing_2> and <listing_3>.
2. Open the card for <listing_2>.

**Expected Results:**

* Each card carries a card-size image, its title and its current standing, with money as minor units and its currency code.
* No card offers Buy Now or a stock count.
* Step 2 opens <listing_2>'s own address without a page load, showing that lot.

<!-- trace:case id=g10.auction-domain.TC-yqv rev=1 covers=g10.auction-listing-page.SC-vnl,g10.auction-listing-page.SC-4q9,g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8 -->
### grade10-site-auction-e2e-US02-TC02-1: Lot page answers whole before scripts run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-01, grade10-site-auction-auction-US-01

**Pre-conditions:**

* <listing_4> is live and its current bid is <current bid>.
* The user's browser runs no client-side scripts.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A live listing with bids, in HKD |
| `<current bid>` | 480000 minor units |

**Steps:**

1. Navigate to <an open listing url> for <listing_4>.
2. Check the served page.

**Expected Results:**

* <listing_4>'s name, description, sale and current standing are in the response HTML.
* Money reads as minor units with its currency code, and no reserve or Buy Now price appears.

<!-- trace:case id=g10.auction-domain.TC-qvl rev=1 covers=g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8,g10.auction-listing-page.SC-mda,g10.auction-listing-page.SC-s88,g10.auction-listing-page.SC-jj1,g10.auction-listing-page.SC-c13 -->
### grade10-site-auction-e2e-US02-TC03-1: Each auction surface names itself and is discoverable

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-02, grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* <listing_2> is published and the catalogue lists it.
* The catalogue publishes no lot under <no lot address>.
* The reader's browser runs no client-side scripts.

**Test data:**

| `<surface>` | `<identity>` | `<status>` |
| --- | --- | --- |
| The auction catalogue at <grade10 auction url> | the catalogue's own title and description | 200 |
| <listing_2>'s own address | <listing_2>'s title, description and canonical address, in `og:title`, `og:description` and `og:url` | 200 |
| <no lot address> | the site's not-found surface | 404 |

**Steps:**

1. Fetch <surface>.
2. Inspect the head for its title, meta description and Open Graph tags.
3. Check the response status.
4. Navigate to <grade10 sitemap url>.

**Expected Results:**

* The head names <identity>, and names no other auction surface in its place.
* The response status is <status>.
* No sitemap entry is a lot address, and none carries an unfilled parameter in place of one.

---

## grade10-site-auction-e2e-US03: Collector links a card and places a first bid

**As a** collector,
**I want** to study the gallery, link my card once, and bid inside the window,
**so that** the card I looked at is the card my bid stands on, with nothing taken from it until I win.

<!-- trace:case id=g10.auction-domain.TC-rl3 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3,g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d,g10.auction-bid-payment-method.SC-s1o,g10.auction-bid-payment-method.SC-c3a,g10.auction-bid-payment-method.SC-mlo,g10.auction-bid-payment-method.SC-l44,g10.auction-bid-payment-method.SC-o6l -->
### grade10-site-auction-e2e-US03-TC01-2: Gallery study leads to an accepted first bid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05, grade10-site-auction-auction-US-02, grade10-site-auction-bid-payment-method-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* A user is signed in with <card> saved and is on <listing_5>.
* <listing_5> is live, holds no bids, and its starting price is <starting price>.
* <listing_5> holds more than one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_5>` | A live listing with no bids, several gallery images, in HKD |
| `<starting price>` | 120000 minor units |
| `<bid amount>` | 120000 minor units, equal to <starting price> |

**Steps:**

1. Step through the gallery thumbnails and open one image at zoom size.
2. Enter <bid amount> in the bid field and select **Place Bid**.
3. Read Time left, Highest bid and Recent Bids.
4. Read <card>'s activity at the card provider.

**Expected Results:**

* The gallery walks in order at thumb, detail and zoom sizes.
* The bid is accepted in the one answer, with no Authorizing state before it.
* Highest bid reads <bid amount>, the bid count reads 1, and Recent Bids shows the user's own bid as You.
* Step 4 shows nothing held or charged on <card>.

<!-- trace:case id=g10.auction-domain.TC-5pk rev=2 covers=g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-n1y,g10.auction-account-record.SC-8te,g10.auction-account-record.SC-dsc -->
### grade10-site-auction-e2e-US03-TC02-2: Bid below the next increment is refused on the bid form and recorded nowhere

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-01, grade10-site-auction-account-record-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* A user is signed in with <card> saved and is on <listing_4>.
* <listing_4> is live, its current bid is <current bid> and its increment is <increment>.
* The user holds no bid on <listing_4> and does not watch it.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_4>` | A live listing with bids from other users, in HKD, bid count <bid count> |
| `<current bid>` | 480000 minor units (HKD 4,800.00) |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier |
| `<bid amount>` | 487900 minor units (HKD 4,879), one major unit below <current bid> plus <increment> |
| `<bid count>` | 2 |

**Steps:**

1. Enter <bid amount> in the bid field.
2. Read the bid form.
3. Reload <listing_4> and read Highest bid, the bid count and Recent Bids.
4. Navigate to <grade10 bids url> and look for <listing_4>.
5. Navigate to <my auctions url> and look for <listing_4>.

**Expected Results:**

* Step 2 reads Min, naming <current bid> plus <increment>, and **Place Bid** is disabled, so nothing is sent.
* Step 3 reads Highest bid <current bid>, bid count <bid count>, and no row of the user's in Recent Bids.
* Step 4 shows no entry for <listing_4>.
* Step 5 shows no row for <listing_4>.

---

## grade10-site-auction-e2e-US04: Collector commits a maximum and is bid to the lead

**As a** collector,
**I want** to commit one maximum and Grade10 to bid for me,
**so that** I keep the lead without sitting on the page, and nothing is taken
from my card until I win.

<!-- trace:case id=g10.auction-domain.TC-r2v rev=1 covers=g10.auction-auto-bidding.SC-71q,g10.auction-auto-bidding.SC-ec3,g10.auction-auto-bidding.SC-2eu,g10.auction-auto-bidding.SC-6h6,g10.auction-auto-bidding.SC-arw,g10.auction-auto-bidding.SC-qbr,g10.auction-auto-bidding.SC-9mj,g10.auction-auto-bidding.SC-zw7,g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s,g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### grade10-site-auction-e2e-US04-TC01-1: Two maxima settle at the second-highest plus one increment

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* User A and user B are signed in on separate sessions with <card> saved, both on <listing_5>.
* <listing_5> is live, holds no bids, its starting price is <starting price> and its increment is <increment>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in HKD |
| `<starting price>` | 120000 minor units |
| `<increment>` | 25000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<user B maximum>` | 505000 minor units, below <user A maximum> |
| `<user B raise>` | 900000 minor units, above <user A maximum> |

**Steps:**

1. As user A, select **Set maximum**, enter <user A maximum> and **Confirm**.
2. As user B, set a maximum of <user B maximum> and **Confirm**.
3. As user A, reload <listing_5> and read Your maximum, Highest bid and standing.
4. As user B, select **Raise**, enter <user B raise> and confirm.

**Expected Results:**

* After step 1 User A leads at <starting price>.
* After step 2 user A still leads and Highest bid reads <user B maximum> plus <increment>.
* User A reads Your maximum, Highest bid and their standing as three separate facts.
* After step 4 user B leads at <user A maximum> plus <increment>, with no bids recorded at the amounts in between.

<!-- trace:case id=g10.auction-domain.TC-cru rev=2 covers=g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu,g10.auction-bidding-history.SC-st1,g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv,g10.auction-bidding-history.SC-vwx -->
### grade10-site-auction-e2e-US04-TC02-2: Auto-bid raises the leader on their behalf, with nothing taken from the card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* <listing_6> is live, its current bid is <leader price> and its increment is <increment>.
* User A leads <listing_6> with a committed maximum of <user A maximum>, placed on <card>.
* User B is signed in with a card saved and is on <listing_6>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units (HKD 5,300.00) |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier at <user B maximum> |
| `<user A maximum>` | 800000 minor units (HKD 8,000.00) |
| `<user B maximum>` | 555000 minor units (HKD 5,550.00), below <user A maximum> |

**Steps:**

1. As user B, set a maximum of <user B maximum> and confirm.
2. As user A, open <listing_6> and read Highest bid, Your maximum and Recent Bids.
3. As user A, navigate to <grade10 bids url> and expand <listing_6>.
4. Read <card>'s activity at the card provider.

**Expected Results:**

* Highest bid reads <user B maximum> plus <increment> and user A still leads, Your maximum <user A maximum>.
* The bid count includes the raise, and the history shows it as placed on user A's behalf rather than as a manual bid.
* Step 4 shows nothing held or charged on <card>.

<!-- trace:case id=g10.auction-domain.TC-b5t rev=2 covers=g10.auction-auto-bidding.SC-71q,g10.auction-auto-bidding.SC-ec3,g10.auction-auto-bidding.SC-2eu,g10.auction-auto-bidding.SC-6h6,g10.auction-auto-bidding.SC-arw,g10.auction-auto-bidding.SC-qbr,g10.auction-auto-bidding.SC-9mj,g10.auction-auto-bidding.SC-zw7,g10.auction-auto-bidding.SC-nqo,g10.auction-auto-bidding.SC-dmo,g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-eiw,g10.auction-auction.SC-rl3,g10.auction-auction.SC-lu0,g10.auction-auction.SC-fnt,g10.auction-auction.SC-nh5,g10.auction-auction.SC-ulv,g10.auction-bidding-history.SC-st1,g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv,g10.auction-bidding-history.SC-vwx -->
### grade10-site-auction-e2e-US04-TC03-2: Lowering a maximum is refused on the bid form and the lead holds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-14, grade10-site-auction-bidding-history-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* <listing_6> is live and its current bid is <leader price>.
* User A leads <listing_6> with a committed maximum of <user A maximum> and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units (HKD 5,300.00) |
| `<user A maximum>` | 800000 minor units (HKD 8,000.00) |
| `<lower maximum>` | 300000 minor units (HKD 3,000.00), below <user A maximum> |

**Steps:**

1. Navigate to <grade10 bids url>, expand <listing_6> and count its history lines.
2. Navigate back to <listing_6>.
3. Select **Raise** and enter <lower maximum>.
4. Read the bid form, Your maximum, Highest bid and the leader.
5. Navigate to <grade10 bids url> and expand <listing_6>.
6. Navigate to <my auctions url> and read <listing_6>'s row.

**Expected Results:**

* Step 4 reads Min, naming the smallest maximum above <user A maximum>, and **Place Bid** is disabled, so nothing is sent.
* Step 4 reads Your maximum <user A maximum>, Highest bid <leader price>, and user A Leading.
* Step 5 shows the same history lines as step 1, with no line for the refused attempt.
* Step 6's row reads Leading, with Current bid <leader price>.

---

## grade10-site-auction-e2e-US05: Collector learns they were outbid and finds it in their bids

**As a** collector,
**I want** losing the lead to show on the lot and in my bids index,
**so that** I can see I was outbid and what the next bid must clear.

<!-- trace:case id=g10.auction-domain.TC-0cq rev=2 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s,g10.auction-auto-bidding.SC-nqo,g10.auction-auto-bidding.SC-dmo,g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-eiw,g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### grade10-site-auction-e2e-US05-TC01-2: Outbid standing reaches the lot page and the bids index

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-bidding-history-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* <listing_6> is live and its current bid is <leader price>.
* User A leads <listing_6> with a committed maximum of <user A maximum>.
* User B is signed in with a card saved and is on <listing_6>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units (HKD 5,300.00) |
| `<increment>` | 20000 minor units (HKD 200.00), the HK$8,000 tier at <user A maximum> |
| `<user A maximum>` | 800000 minor units (HKD 8,000.00) |
| `<user B maximum>` | 900000 minor units (HKD 9,000.00), above <user A maximum> |

**Steps:**

1. As user B, set a maximum of <user B maximum> and confirm.
2. As user A, open <listing_6> and read the bid panel.
3. As user A, navigate to <grade10 bids url> and read the Active list.

**Expected Results:**

* User A reads Outbid, with Your maximum still <user A maximum> and Highest bid at <user A maximum> plus <increment>.
* <listing_6> appears once under Active with outbid standing, its price and currency code, and its latest activity time.

<!-- trace:case id=g10.auction-domain.TC-57p rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj,g10.auction-listing-page.SC-fl9,g10.auction-listing-page.SC-aga -->
### grade10-site-auction-e2e-US05-TC02-1: Outbid summary opens its explanation and its lot

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05, grade10-site-auction-bidding-history-US-03, grade10-site-auction-listing-page-US-05

**Pre-conditions:**

* A user is signed in and is on <grade10 bids url>.
* <listing_10> is live, the user holds one accepted manual bid and one auto-bid on it, and user B now leads it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A live listing the user has bid on manually and automatically, now led by user B |

**Steps:**

1. Expand <listing_10>'s history.
2. Open <listing_10> from its summary.

**Expected Results:**

* User B's accepted bid and the user's own standing change sit in one order.
* The user's own rows read as You and user B stays a listing pseudonym with no maximum shown.
* Step 2 lands on <listing_10>'s own page.

---

## grade10-site-auction-e2e-US06: Collector shares a lot link

**As a** collector,
**I want** a lot link I pass on to unfurl as that lot and open live,
**so that** whoever I send it to reads the card I meant, not the catalogue.

<!-- trace:case id=g10.auction-domain.TC-wrl rev=1 covers=g10.auction-listing-page.SC-mda,g10.auction-listing-page.SC-c09,g10.auction-listing-page.SC-y8j,g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d -->
### grade10-site-auction-e2e-US06-TC01-1: Shared link unfurls as the lot and stays put on hydration

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-02, grade10-site-auction-listing-page-US-04, grade10-site-auction-auction-US-02

**Pre-conditions:**

* <listing_7> is live, its current bid is <current bid>, and <time left> remains until its close.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A live listing with bids and a close approaching |
| `<current bid>` | 480000 minor units |
| `<time left>` | 6 minutes |

**Steps:**

1. Fetch <an open listing url> for <listing_7> with client-side scripts disabled.
2. Open the same address with scripts enabled and watch Time left and Highest bid as scripts finish loading.

**Expected Results:**

* The served gallery, description and standing stay on screen, with no loading placeholder over them.
* Time left counts on from the served value rather than jumping or blanking.
* Highest bid still reads <current bid> once scripts have finished loading.

---

## grade10-site-auction-e2e-US07: Collector watches a late bid push the close out

**As a** collector,
**I want** a bid accepted during extended bidding to move the close on the page,
**so that** the time I read and the time I am judged by are the same.

<!-- trace:case id=g10.auction-domain.TC-5yl rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### grade10-site-auction-e2e-US07-TC02-1: Extension cap holds while the bid is still accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* A user is signed in with <card> saved and is on <listing_9>.
* <listing_9> is live, carries an extension cap, and its recorded close already stands at that cap.
* Its recorded close is <bid time> away.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A live listing with an extension cap, its close already at the cap |
| `<extension window>` / `<extension duration>` | 1800 seconds (30 minutes) each |
| `<bid time>` | 2 minutes before the recorded close, inside <extension window> |
| `<new time left>` | Unchanged — the close stays at the cap |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Submit a bid of <bid amount> at <bid time>.
2. Read Time left and the recorded close.
3. Navigate to <grade10 bids url> and expand <listing_9>.

**Expected Results:**

* The bid is accepted and Highest bid reads <bid amount>.
* Time left reads <new time left> and the recorded close does not move past the cap.
* The history shows the accepted bid beside an unchanged close.

<!-- archive fold: grade10-site-auction-e2e-US07-TC01 (2026-09-17-revise-auction-extended-bidding) replaced by US07-TC03-1 -->

<!-- trace:case id=g10.auction-domain.TC-wh3 rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d,g10.auction-auction.SC-e9w,g10.auction-auction.SC-xd3,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu,g10.auction-listing-page.SC-o37,g10.auction-listing-page.SC-ohm,g10.auction-listing-page.SC-b9n,g10.auction-listing-page.SC-sux,g10.auction-listing-page.SC-2d0,g10.auction-listing-page.SC-7c2,g10.auction-listing-page.SC-c97,g10.auction-listing-page.SC-s2c -->
### grade10-site-auction-e2e-US07-TC03-2: Price-moving auto-bid in extended bidding restarts the timer on the open page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auction-US-12, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* customer A leads <listing_8> with maximum <user A maximum> and is on its lot page.
* customer B is signed in with a linked card, on a separate session, on the same lot page.
* <listing_8> is in extended bidding, and the recorded close is <time left before bid> away.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_8> | A listing in extended bidding, led by customer A, current bid <leader price> |
| <extension duration> | 1800 seconds |
| <time left before bid> | 5 minutes |
| <leader price> | 530000 HKD minor units |
| <increment> | 8000 HKD minor units (HKD 80.00), the HK$4,000 tier at <user B maximum> |
| <user A maximum> | 800000 HKD minor units |
| <user B maximum> | 555000 HKD minor units, below <user A maximum> |

**Steps:**

1. As customer A, read Time left on the lot page.
2. As customer B, enter <user B maximum> in the custom maximum on the bid panel and confirm the bid.
3. As customer A, without reloading, read Highest bid and Time left on the open lot page.
4. Wait <extension duration> with no further bid.

**Expected Results:**

* Step 3 reads Highest bid <user B maximum> plus <increment>, and customer A still leads.
* Step 3 reads Time left <extension duration>, labelled Extended bidding, with no reload.
* The lot closes after step 4, and no further bid is placed.

<!-- trace:case id=g10.auction-domain.TC-n2z rev=1 covers=g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8,g10.auction-listing-page.SC-o37,g10.auction-listing-page.SC-ohm,g10.auction-listing-page.SC-b9n,g10.auction-listing-page.SC-sux,g10.auction-listing-page.SC-2d0,g10.auction-listing-page.SC-7c2,g10.auction-listing-page.SC-c97,g10.auction-listing-page.SC-s2c,g10.auction-listing-page.SC-9c0,g10.auction-listing-page.SC-60y,g10.auction-listing-page.SC-v0i,g10.auction-listing-page.SC-7y3,g10.auction-listing-page.SC-qxe -->
### grade10-site-auction-e2e-US07-TC04-1: Catalogue card and open lot page agree after an extension

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-page-US-12, grade10-site-auction-listing-page-US-13

**Pre-conditions:**

* <listing_8> is in extended bidding, led by customer A, and the recorded close is <time left before bid> away.
* customer A is on the lot page for <listing_8>.
* <listing_8> is set as a Featured slide.
* customer C is on <grade10 auction url> with <listing_8>'s Featured slide and All auctions card in view, on a device whose clock is <device skew>.
* customer B is signed in with a linked card, on a separate session, on the lot page for <listing_8>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_8> | A listing in extended bidding, led by customer A, current bid <leader price> |
| <time left before bid> | 5 minutes |
| <leader price> | 530000 HKD minor units |
| <user A maximum> | 800000 HKD minor units |
| <user B maximum> | 900000 HKD minor units, above <user A maximum> |
| <increment> | 20000 HKD minor units (HKD 200.00), the HK$8,000 tier at <user A maximum> |
| <device skew> | 3 minutes behind |

**Steps:**

1. As customer B, enter <user B maximum> in the custom maximum on the bid panel and confirm the bid.
2. As customer C, without reloading, read <listing_8>'s All auctions card and Featured slide.
3. As customer A, without reloading, read Highest bid and Time left at the same moment.

**Expected Results:**

* The card, the slide and the lot page's Highest bid all read <user A maximum> plus <increment>.
* The card's and the slide's Ends in and the lot page's Time left agree to the second.
* The slide still reads LIVE BIDDING, with no Extended label.
* Neither reads <device skew> off, and neither page reloaded.

---

## grade10-site-auction-e2e-US08: Collector's private bidding facts stay private

**As a** collector,
**I want** my maximum kept to my own account,
**so that** a rival, a signed-out visitor, or another storefront reads none of
it.

<!-- trace:case id=g10.auction-domain.TC-nhf rev=2 covers=g10.auction-auto-bidding.SC-nqo,g10.auction-auto-bidding.SC-dmo,g10.auction-auto-bidding.SC-x57,g10.auction-auto-bidding.SC-eiw,g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d,g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### grade10-site-auction-e2e-US08-TC01-2: Rival reads the price but never the leader's maximum

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/domain.spec.ts`

**Pre-conditions:**

* <listing_6> is live and its current bid is <leader price>.
* User A leads <listing_6> with a committed maximum of <user A maximum>.
* User B is signed in, holds no bid on <listing_6>, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |

**Steps:**

1. Read the bid panel and Recent Bids.
2. Read the public listing contract <listing_6>'s page is served from.
3. Sign out and open the same address.

**Expected Results:**

* Highest bid reads <leader price> and <user A maximum> is neither shown nor derivable from any public fact.
* Recent Bids names other users by listing pseudonym only, with no card facts.
* The signed-out reader gets no private history and no maximum.

<!-- trace:case id=g10.auction-domain.TC-n6x rev=1 covers=g10.auction-bidding-history.SC-jfn,g10.auction-bidding-history.SC-bis,g10.auction-bidding-history.SC-k1b,g10.auction-bidding-history.SC-3qb,g10.auction-bidding-history.SC-pej,g10.auction-bidding-history.SC-kcd,g10.auction-bidding-history.SC-pfa,g10.auction-bidding-history.SC-j51,g10.auction-bidding-history.SC-wrj,g10.auction-bidding-history.SC-7tw,g10.auction-bidding-history.SC-onh,g10.auction-bidding-history.SC-2pg,g10.auction-bidding-history.SC-uu5,g10.auction-bidding-history.SC-izn -->
### grade10-site-auction-e2e-US08-TC02-1: Signed-out visitor keeps their destination

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-05, grade10-site-auction-bidding-history-US-04

**Pre-conditions:**

* No user is signed in.
* A user account holds an accepted bid on <listing_11>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A live listing the user holds an accepted bid on |

**Steps:**

1. Navigate to <grade10 bids url>.
2. Sign in as that user.

**Expected Results:**

* No private history is shown before sign-in.
* Step 2 lands back on the bids index, showing that account's Active list with <listing_11> in it.

<!-- archive fold: grade10-site-auction-e2e-US08-TC1 (2026-09-16-default-auction-bid-holds-off) replaced by US08-TC03-1 -->

<!-- trace:case id=g10.auction-domain.TC-fp8 rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d,g10.auction-auto-bidding.SC-kr7,g10.auction-auto-bidding.SC-9i5,g10.auction-auto-bidding.SC-44a,g10.auction-auto-bidding.SC-nwr,g10.auction-auto-bidding.SC-0yu,g10.auction-bid-panel-enrollment.SC-ju5,g10.auction-bid-panel-enrollment.SC-4ix,g10.auction-bid-panel-enrollment.SC-cic,g10.auction-bid-panel-enrollment.SC-cnv,g10.auction-bid-panel-enrollment.SC-pnc,g10.auction-bid-panel-enrollment.SC-htr,g10.auction-bid-panel-enrollment.SC-fho,g10.auction-bid-panel-enrollment.SC-kcm -->
### grade10-site-auction-e2e-US08-TC03-2: A linked collector's bid stands at once on the card on file

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-bid-panel-enrollment-US-02

**Pre-conditions:**

* customer A is signed in with a linked card and is on the lot page for <listing_14>.
* customer B is signed in with a linked card, on a separate session, and can bid on <listing_14>.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_14> | An open HKD listing with no bids, starting price <starting price> |
| <starting price> | 20000 minor units (HKD 200.00) |
| <increment> | 1000 minor units (HKD 10.00), the HKD step at <user A maximum> |
| <user A maximum> | 50000 minor units (HKD 500.00) |
| <user B maximum> | 80000 minor units (HKD 800.00), above <user A maximum> |
| <price after A> | <starting price> |
| <price after B> | <user A maximum> plus <increment> |

**Steps:**

1. As customer A, enter <user A maximum> in the custom maximum on the bid panel and confirm the bid.
2. As customer B, enter <user B maximum> in the custom maximum on the same lot and confirm the bid.
3. Read the bid panel.
4. Read both customers' card activity at the card provider.

**Expected Results:**

* Step 1 accepts the bid at <price after A> in the one answer, and Change is unavailable.
* Highest bid reads <price after B>, and customer B leads.
* Step 4 shows nothing held or charged on either card.

---

## grade10-site-auction-e2e-US09: Collector meets a lot that is not there

**As a** collector,
**I want** a dead lot address to say so plainly,
**so that** I am never shown an empty page in place of a lot.

<!-- trace:case id=g10.auction-domain.TC-0rf rev=1 covers=g10.auction-listing-page.SC-s88,g10.auction-listing-page.SC-jj1,g10.auction-listing-page.SC-c13,g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8 -->
### grade10-site-auction-e2e-US09-TC01-1: Address naming no published lot answers not found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-03, grade10-site-auction-auction-US-01

**Pre-conditions:**

* The catalogue publishes no lot under <no lot address>.

**Test data:**

| Field | Value |
| --- | --- |
| `<no lot address>` | An address under the auction's lots naming no published lot |

**Steps:**

1. Navigate to <no lot address>.
2. Check the response status.

**Expected Results:**

* The response has status 404 and the site's not-found surface is shown.
* Neither an empty lot page nor the catalogue is shown in its place.

<!-- trace:case id=g10.auction-domain.TC-13a rev=1 covers=g10.auction-bidding-history.SC-st1,g10.auction-bidding-history.SC-vd5,g10.auction-bidding-history.SC-qhu,g10.auction-bidding-history.SC-qvv,g10.auction-bidding-history.SC-vwx,g10.auction-bidding-history.SC-sg5,g10.auction-bidding-history.SC-nt1,g10.auction-bidding-history.SC-70a,g10.auction-bidding-history.SC-cpz,g10.auction-bidding-history.SC-33x,g10.auction-bidding-history.SC-8d3 -->
### grade10-site-auction-e2e-US09-TC02-1: Unavailable card capability fails the bid explicitly

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-02, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* <listing_12> is live and its current bid is <current bid>.
* The card authorization capability a bid needs is unavailable for the payment account <listing_12> runs on.
* A user is signed in with <card> saved, holds no accepted bid on <listing_12>, and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | A live listing whose payment account has no card authorization capability |
| `<current bid>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. Enter <bid amount> and select **Place Bid**.
2. Navigate to <grade10 bids url> and expand <listing_12>.

**Expected Results:**

* The bid fails naming the unavailable capability, with no credentials, card, or address data shown.
* No bid, hold or fixture-backed outcome is created and Highest bid stays <current bid>.
* The attempt appears as a failed event with a safe payment reason, and <listing_12> carries failed-only standing.

<!-- trace:case id=g10.auction-domain.TC-qus rev=1 covers=g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### grade10-site-auction-e2e-US09-TC03-1: A repeated card authorization event changes the lot once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* <listing_13> is live and holds one accepted bid of 505000 minor units.
* That bid has exactly one recorded card authorization event.

**Test data:**

| `<event copy>` | `<outcome>` |
| --- | --- |
| The same event with its original provider event id | the recorded outcome is returned without a second state transition |
| The same event with a tampered body and its original signature | the event is rejected on signature |

**Steps:**

1. Deliver <event copy> to the auction.
2. Read <listing_13> and expand it at <grade10 bids url>.

**Expected Results:**

* <outcome>.
* One accepted bid, one hold, and one history entry stand for that bid.
* No bid, hold, release, capture or order state is duplicated.

---

## grade10-site-auction-e2e-US10: Exploratory passes

**As a** tester,
**I want** a time-boxed roam across the auction surfaces,
**so that** what the written cases do not reach is found before a user
finds it.

<!-- trace:case id=g10.auction-domain.TC-cnk rev=1 covers=g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8,g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a,g10.auction-listing-media.SC-5tk,g10.auction-listing-media.SC-cd3,g10.auction-listing-page.SC-vnl,g10.auction-listing-page.SC-4q9 -->
### grade10-site-auction-e2e-US10-TC01-1: Roam the catalogue-to-bid path for one hour

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-listing-media-US-05, grade10-site-auction-listing-page-US-01

**Pre-conditions:**

* The catalogue publishes lots in every state — scheduled, live, ending soon, closed — across more than one category.
* Among them, one lot has a single gallery image and one has none.
* A user is signed in with `<card>` saved and is on `<grade10 auction url>`.

**Steps:**

1. Reach lots by every route — card, browser Back, typed address, shared link, the bids index.
2. Vary the pass: minutes left, sub-minute, slow network, small viewport, each locale under `/tc` and `/sc`.
3. Bid, raise a maximum, and reload at awkward moments on the lots you opened.
4. Note every surprise with the address, the lot state, and what you did.

**Expected Results:**

* No surface blanks, duplicates a lot, or drops a placeholder over content already served.
* Money reads as minor units with its currency code wherever it appears, in every locale.
* A lot with one image shows no thumbnail strip and a lot with none still renders.
* No lot offers Buy Now, a stock count, or a reserve state.
* Every surprise is written up with enough detail to reproduce cold.

<!-- trace:case id=g10.auction-domain.TC-6dl rev=2 covers=g10.auction-auto-bidding.SC-arz,g10.auction-auto-bidding.SC-5mw,g10.auction-auto-bidding.SC-hvc,g10.auction-auto-bidding.SC-wgx,g10.auction-auto-bidding.SC-edj,g10.auction-auto-bidding.SC-bqs,g10.auction-auto-bidding.SC-xwb,g10.auction-auto-bidding.SC-n5u,g10.auction-auto-bidding.SC-52s,g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-23v,g10.auction-auction.SC-6b9,g10.auction-auction.SC-7kh,g10.auction-auction.SC-dbc,g10.auction-auction.SC-wlg,g10.auction-auction.SC-t3k,g10.auction-auction.SC-uha,g10.auction-auction.SC-xrx,g10.auction-auction.SC-s1d,g10.auction-bidding-history.SC-dtm,g10.auction-bidding-history.SC-uqt,g10.auction-bidding-history.SC-kwx,g10.auction-bidding-history.SC-09w,g10.auction-bidding-history.SC-usg,g10.auction-bidding-history.SC-oyw,g10.auction-bidding-history.SC-4lm,g10.auction-bidding-history.SC-vc4,g10.auction-bidding-history.SC-pbt,g10.auction-bidding-history.SC-9ii,g10.auction-bidding-history.SC-k4s,g10.auction-bidding-history.SC-1rj -->
### grade10-site-auction-e2e-US10-TC02-2: Roam competing maxima and the closing minutes for one hour

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* <listing_5> is live, its increment is <increment>, and its extension duration is <extension duration>.
* User A and user B are signed in on separate sessions with <card> saved, both on <listing_5>.
* Network manipulation is available to delay a bid response.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in HKD |
| `<increment>` | The HKD increment at the amount being beaten |
| `<extension duration>` | 1800 seconds |

**Steps:**

1. Trade maxima - equal, one <increment> apart, far above, far below - including two submitted at the same moment.
2. Delay one user's bid response, then submit the other's before it lands.
3. Push into extended bidding repeatedly, then let one full <extension duration> pass.
4. Read each user's standing and their <grade10 bids url> history after every exchange.

**Expected Results:**

* Highest bid is never above the leader's maximum and is never reached through a ladder of intermediate bids.
* An equal later maximum is accepted, does not take the lead, and is not reported as a refusal.
* A delayed lower bid never becomes the current bid over a higher one.
* Each user reads only their own maximum, and every standing change is explained by an event in their own history.
* A refused attempt shows on the bid form only, never in either user's history.
* Every surprise is written up with the amounts, the order, and the timing that produced it.

---

## grade10-site-auction-e2e-US11: Collector follows an old link to a hidden lot

**As a** collector,
**I want** a called-off lot to be gone everywhere,
**so that** a saved link or an old search never shows me a lot that was
withdrawn.

<!-- trace:case id=g10.auction-domain.TC-dw9 rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-w9d,g10.auction-lot-status.SC-3yw,g10.auction-listing-page.SC-s88,g10.auction-listing-page.SC-jj1,g10.auction-listing-page.SC-c13 -->
### grade10-site-auction-e2e-US11-TC01-1: Called-off lot is removed from the catalogue and its link

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02, grade10-site-auction-listing-page-US-03

**Pre-conditions:**

* `<lot_1>` was published and listed in the catalogue, then an operator called it off.
* customer has `<lot_1 address>` saved from when `<lot_1>` was published.

**Test data:**

| Field | Value |
| --- | --- |
| lot_1 | A lot that was published, listed in the catalogue, then called off by an operator |
| lot_1 address | The address of `<lot_1>` from when it was published |

**Steps:**

1. Navigate to `<grade10 auction url>`.
2. Search the catalogue for the title of `<lot_1>`.
3. Navigate to `<lot_1 address>`.

**Expected Results:**

* Step 2: `<lot_1>` does not appear in the catalogue.
* Step 3: response status is 404 and the Page not found screen is on screen.

<!-- review-note 2026-09-29, listing-page: SC-11 (g10.auction-listing-page.SC-vl7, "the control acts on the addressed lot and no other") has no feature-level case — no user journey walks two-lot isolation. Consider a domain case exercising that watching lot A from lot A's page does not watch lot B when watching cases are added to this suite. -->

---

## grade10-site-auction-e2e-US12: Bidders follow a lot through its close to their record

**As a** bidder,
**I want** the lot page and My Auctions to show one final price and one result once the close is recorded,
**so that** what I read on either is what the auction decided.

<!-- trace:case id=g10.auction-domain.TC-3iz rev=1 covers=g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp,g10.auction-listing-page.SC-rgt,g10.auction-listing-page.SC-76f,g10.auction-listing-page.SC-ygz,g10.auction-listing-page.SC-31a,g10.auction-listing-page.SC-45u,g10.auction-listing-page.SC-kwb,g10.auction-listing-page.SC-xz7,g10.auction-account-record.SC-b5w,g10.auction-account-record.SC-fkr,g10.auction-account-record.SC-fao,g10.auction-account-record.SC-abi,g10.auction-account-record.SC-n9l,g10.auction-account-record.SC-2e8 -->
### grade10-site-auction-e2e-US12-TC01-1: Winner and losing bidder read one result on the lot and My Auctions

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14, grade10-site-auction-account-record-US-10, grade10-site-auction-account-record-US-04

**Pre-conditions:**

* customer A leads <listing_15> at <final price> with maximum <user A maximum>.
* customer B committed <user B maximum> on <listing_15> and was outbid.
* customer A and customer B are signed in on separate sessions, both on the lot page for <listing_15>.
* <listing_15>'s recorded close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_15> | An HKD listing in extended bidding, led by customer A |
| <final price> | 513000 minor units, <user B maximum> plus its 8000 increment |
| <user A maximum> | 800000 minor units, above <final price> |
| <user B maximum> | 505000 minor units, below <final price> |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the lot's state.
3. As customer B, read the lot's state.
4. As customer A, navigate to <my auctions url>, select the Ended tab and find <listing_15>'s row.
5. As customer B, navigate to <my auctions url>, select the Ended tab and find <listing_15>'s row.

**Expected Results:**

* Once the close passes, both pages read Closed with no result until the close is recorded.
* Step 2 reads Won and step 3 reads Did not win, with Highest bid <final price> on both.
* Step 4's row reads Won, with Current bid <final price>.
* Step 5's row reads Didn't win, with Current bid <final price>, not <user B maximum>.
* Step 5's row reads "Your card was not charged."

<!-- trace:case id=g10.auction-domain.TC-8w7 rev=1 covers=g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8,g10.auction-auction.SC-r92,g10.auction-auction.SC-wu6,g10.auction-auction.SC-c6m,g10.auction-auction.SC-ckp,g10.auction-listing-page.SC-rgt,g10.auction-listing-page.SC-76f,g10.auction-listing-page.SC-ygz,g10.auction-listing-page.SC-31a,g10.auction-listing-page.SC-45u,g10.auction-listing-page.SC-kwb,g10.auction-listing-page.SC-xz7 -->
### grade10-site-auction-e2e-US12-TC02-1: Catalogue card and lot page turn at the close without a reload

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-01, grade10-site-auction-auction-US-11, grade10-site-auction-listing-page-US-14

**Pre-conditions:**

* customer A leads <listing_16> at <final price>, and is on its lot page.
* customer C is on <grade10 auction url> with <listing_16>'s card in All auctions.
* <listing_16>'s recorded close is under a minute away, and no further bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| <listing_16> | An HKD listing in extended bidding, led by customer A |
| <final price> | 513000 minor units |

**Steps:**

1. Wait through the recorded close on both pages, without reloading.
2. As customer A, read the lot's state once the result shows.
3. As customer C, read <listing_16>'s card.

**Expected Results:**

* Once the close passes, customer A's page reads Closed with no result until the close is recorded.
* Until then, customer C's card shows its existing closed state with <final price> and no result.
* Step 2 reads Won, with Highest bid <final price>.
* Step 3's card reads Ended and names when it ended, with no watch control.
* Neither page reloaded.

## Settled

- No domain case reads a card hold, a card authorization, a payment confirmation or a bid-time hold switch; the cases that did are rewritten or deprecated (decisions Q1, Q5). A case that reads the card reads that nothing is held or charged on it.
- A refused attempt is not a bid: it shows on the bid form that made it and nowhere in the bidder's history, My Auctions or the lot's public record (decisions Q6).
- A losing row on My Auctions reads "Your card was not charged." (decision Q2).
- HKD increments follow the Bidding page's schedule: HK$80 from HK$4,000 and HK$200 from HK$8,000.

## Reconciliation

**Run:** QA2 rerun, 2026-10-01, for change `relay-auction-live-state`. Joined the domain cases, composed from the journeys of auction, listing-page, account-record and auto-bidding, with the delta scenarios of those capabilities. QA2 added one expected result to US12-TC02: the card's closed state with no result before the close is recorded.

| Finding | Disposition |
| --- | --- |
| US07-TC03: a price-moving auto-bid in extended bidding restarts the open page's countdown | **Folded in:** `grade10-site-auction-auction-SC-06`, `grade10-site-auction-listing-page-SC-30`; the feature suites leave both to this case |
| US07-TC04: the card, the Featured slide and the lot page agree after an extension, on the service clock | **Folded in:** `grade10-site-auction-auction-SC-65`, `grade10-site-auction-auction-SC-66`, `grade10-site-auction-listing-page-SC-33`; the auction suite leaves the first two to this case |
| US12-TC01: winner and losing bidder read one result and one final price on the lot and on My Auctions | **Folded in:** `grade10-site-auction-listing-page-SC-37`, `grade10-site-auction-listing-page-SC-38`, `grade10-site-auction-account-record-SC-66`; account-record leaves `grade10-site-auction-account-record-SC-18` and `grade10-site-auction-account-record-SC-19` to this case |
| US12-TC02: the card and the lot page turn at the close without a reload | **Folded in:** `grade10-site-auction-auction-SC-88`, `grade10-site-auction-listing-page-SC-37` |

**Uncovered anchors:** none. Every case traces two or more capabilities' journeys.

**Run:** QA2, 2026-10-03. Joined the domain cases, composed from the journeys of auction, auto-bidding, bid-payment-method, bidding-history, account-record and listing-page, with this change's delta scenarios. It is a statement, not proof.

- **Revised** - `grade10-site-auction-e2e-US03-TC01-2`, `grade10-site-auction-e2e-US03-TC02-2`, `grade10-site-auction-e2e-US04-TC02-2`, `grade10-site-auction-e2e-US04-TC03-2`, `grade10-site-auction-e2e-US05-TC01-2`, `grade10-site-auction-e2e-US08-TC01-2`, `grade10-site-auction-e2e-US08-TC03-2` and `grade10-site-auction-e2e-US10-TC02-2`: each read a card hold, an authorization or a refused attempt kept in the record, so each moves up a revision and returns to draft. The six that were automated owe their test the new id and the flip back with a Decided by line
- **Deprecated** - `grade10-site-auction-e2e-US09-TC02-1`, a bid failing on an unavailable card capability, and `grade10-site-auction-e2e-US09-TC03-1`, a repeated card authorization event: no bid asks the card
- **Trace changed** - `grade10-site-auction-e2e-US04-TC01-1` traces `grade10-site-auction-auction-US-02` in place of the retired grade10-site-auction-auction-US-03; its steps, results and status are unchanged
- **Contradicted** - none
