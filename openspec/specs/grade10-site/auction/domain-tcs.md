# grade10-site/auction Cross-Feature E2E Test Cases

**Status:** approved
**Reviewed:** 2026-09-04, tcs-rules r2

## grade10-site-auction-e2e-US01: Operator publishes a gallery a collector can shop

**As an** operator with catalogue grant,
**I want** the images and alt text I confirm on a draft listing to be what the
catalogue and the listing page show,
**so that** a collector shops the card I photographed rather than a placeholder.

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
**so that** the card I looked at is the card my hold is taken against.

### grade10-site-auction-e2e-US03-TC01-1: Gallery study leads to an accepted first bid

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
* **Trace:** grade10-site-auction-listing-media-US-05, grade10-site-auction-auction-US-02, grade10-site-auction-auction-US-03

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

**Expected Results:**

* The gallery walks in order at thumb, detail and zoom sizes.
* The bid is accepted and one hold for <bid amount> stands against <card>.
* Highest bid reads <bid amount>, the bid count reads 1, and Recent Bids shows the user's own bid as You.

### grade10-site-auction-e2e-US03-TC02-1: Bid below the next increment is refused and explained

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
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* A user is signed in with <card> saved and is on <listing_4>.
* <listing_4> is live, its current bid is <current bid> and its increment is <increment>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A live listing with bids, in HKD |
| `<current bid>` | 480000 minor units |
| `<increment>` | 25000 minor units |
| `<bid amount>` | 495000 minor units, below <current bid> plus <increment> |

**Steps:**

1. Enter <bid amount> in the bid field and select **Place Bid**.
2. Navigate to <grade10 bids url> and expand <listing_4>.

**Expected Results:**

* The bid is refused, naming <current bid> plus <increment> as the minimum.
* Highest bid stays <current bid>, the bid count is unchanged, and no hold is taken.
* The refusal reads as a private event with a minimum reason, and no provider message appears.

---

## grade10-site-auction-e2e-US04: Collector commits a maximum and is bid to the lead

**As a** collector,
**I want** one hold for the maximum I commit and Grade10 to bid for me,
**so that** I keep the lead without sitting on the page and without a second
card check.

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
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-03

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

### grade10-site-auction-e2e-US04-TC02-1: Auto-bid raises the leader without a second card check

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-auto-bidding-US-05, grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* <listing_6> is live, its current bid is <leader price> and its increment is <increment>.
* User A leads <listing_6> with a committed maximum of <user A maximum>, authorized against <card>.
* User B is signed in with <card> saved and is on <listing_6>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units |
| `<increment>` | 25000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<user B maximum>` | 555000 minor units, below <user A maximum> |

**Steps:**

1. As user B, set a maximum of <user B maximum> and confirm.
2. As user A, open <listing_6> and read Highest bid, Your maximum and Recent Bids.
3. As user A, navigate to <grade10 bids url> and expand <listing_6>.

**Expected Results:**

* Highest bid reads <user B maximum> plus <increment> and user A still leads.
* User A's hold stays at <user A maximum> and no further card authorization is taken for the raise.
* The bid count includes the raise, and the history shows it as placed on user A's behalf rather than as a manual bid.

### grade10-site-auction-e2e-US04-TC03-1: Lowering a maximum is refused and the lead holds

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
* **Trace:** grade10-site-auction-auto-bidding-US-01, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-bidding-history-US-02

**Pre-conditions:**

* <listing_6> is live and its current bid is <leader price>.
* User A leads <listing_6> with a committed maximum of <user A maximum> and is on it.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<lower maximum>` | 300000 minor units, below <user A maximum> |

**Steps:**

1. Select **Raise**, enter <lower maximum> and confirm.
2. Navigate to <grade10 bids url> and expand <listing_6>.

**Expected Results:**

* The commitment is refused and Your maximum still reads <user A maximum>.
* Highest bid and the leader are unchanged, and the hold stays at <user A maximum>.
* The refusal is recorded as a private event with a safe reason.

---

## grade10-site-auction-e2e-US05: Collector learns they were outbid and finds it in their bids

**As a** collector,
**I want** losing the lead to show on the lot and in my bids index,
**so that** I can see I was outbid, what the next bid must clear, and that my
hold is being let go.

### grade10-site-auction-e2e-US05-TC01-1: Outbid standing reaches the lot page and the bids index

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-03, grade10-site-auction-auto-bidding-US-02, grade10-site-auction-bidding-history-US-01

**Pre-conditions:**

* <listing_6> is live, its current bid is <leader price> and its increment is <increment>.
* User A leads <listing_6> with a committed maximum of <user A maximum> and holds the only active authorization on it.
* User B is signed in with <card> saved and is on <listing_6>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A live listing led by user A, in HKD |
| `<leader price>` | 530000 minor units |
| `<increment>` | 25000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<user B maximum>` | 900000 minor units, above <user A maximum> |

**Steps:**

1. As user B, set a maximum of <user B maximum> and confirm.
2. As user A, open <listing_6> and read the bid panel.
3. As user A, navigate to <grade10 bids url> and read the Active list.

**Expected Results:**

* User A reads Outbid, with Your maximum still <user A maximum> and Highest bid at <user A maximum> plus <increment>.
* User A's authorization is marked for release and user A no longer holds the top authorization on the lot.
* <listing_6> appears once under Active with outbid standing, its price and currency code, and its latest activity time.

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
**I want** a bid accepted in the last minutes to move the close on the page and
in my history,
**so that** the time I read and the time I am judged by are the same.

### grade10-site-auction-e2e-US07-TC01-1: Late auto-bid extends the close on the live page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02, grade10-site-auction-auto-bidding-US-05, grade10-site-auction-listing-page-US-04

**Pre-conditions:**

* <listing_8> is live, its current bid is <leader price>, and its recorded close is <bid time> away.
* User A leads <listing_8> with a committed maximum of <user A maximum>, with room left under that maximum, and is on it.
* User B is signed in with <card> saved.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A live listing led by user A, closing inside its extension window |
| `<extension window>` / `<extension duration>` | 1800 seconds (30 minutes) each |
| `<bid time>` | 5 minutes before the recorded close, inside <extension window> |
| `<new time left>` | 30 minutes, one <extension duration> from the accepted bid |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<user B maximum>` | 555000 minor units, below <user A maximum> |

**Steps:**

1. As user A, read Time left.
2. As user B, set a maximum of <user B maximum> and confirm at <bid time>.
3. As user A, read Time left again on the open page.
4. Wait one full <extension duration> with no further bid.

**Expected Results:**

* Grade10 raises user A's bid on their behalf, and Time left reads <new time left>, marked auto-extended.
* The time on screen continues from what was served rather than contradicting it.
* Step 4 closes the lot; no further bid is placed on either standing maximum in the meantime.

### grade10-site-auction-e2e-US07-TC02-1: Extension cap holds while the bid is still accepted

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
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

---

## grade10-site-auction-e2e-US08: Collector's private bidding facts stay private

**As a** collector,
**I want** my maximum and my refused attempts kept to my own account,
**so that** a rival, a signed-out visitor, or another storefront reads none of
them.

### grade10-site-auction-e2e-US08-TC01-1: Rival reads the price but never the leader's maximum

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-02, grade10-site-auction-auction-US-02, grade10-site-auction-bidding-history-US-04

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
* Recent Bids names other users by listing pseudonym only, with no card or authorization facts.
* The signed-out reader gets no private history and no maximum.

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

---

## grade10-site-auction-e2e-US09: Collector meets a lot or a payment path that is not there

**As a** collector,
**I want** a dead lot address and a card path that cannot run to say so plainly,
**so that** I am never shown an empty page or told a bid stands that was never
placed.

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

### grade10-site-auction-e2e-US09-TC02-1: Unavailable card capability fails the bid explicitly

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

### grade10-site-auction-e2e-US09-TC03-1: A repeated card authorization event changes the lot once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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
* A user is signed in with <card> saved and is on <grade10 auction url>.

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

### grade10-site-auction-e2e-US10-TC02-1: Roam competing maxima and the closing minutes for one hour

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
* **Trace:** grade10-site-auction-auto-bidding-US-03, grade10-site-auction-auction-US-03, grade10-site-auction-bidding-history-US-03

**Pre-conditions:**

* <listing_5> is live, its increment is <increment>, and its extension policy is <extension window> and <extension duration>.
* User A and user B are signed in on separate sessions with <card> saved, both on <listing_5>.
* Network manipulation is available to delay a bid response.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A live listing with no bids, in HKD |
| `<increment>` | 25000 minor units |
| `<extension window>` / `<extension duration>` | 1800 seconds each |

**Steps:**

1. Trade maxima — equal, one <increment> apart, far above, far below — including two submitted at the same moment.
2. Delay one user's authorization response, then submit the other's before it lands.
3. Push into the extension window repeatedly, then let one full <extension duration> pass.
4. Read each user's standing and their <grade10 bids url> history after every exchange.

**Expected Results:**

* Highest bid is never above the leader's maximum and is never reached through a ladder of intermediate bids.
* An equal later maximum is accepted, does not take the lead, and is not reported as a refusal.
* A delayed lower authorization is released rather than becoming the current bid.
* Each user reads only their own maximum, and every standing change is explained by an event in their own history.
* Every surprise is written up with the amounts, the order, and the timing that produced it.
