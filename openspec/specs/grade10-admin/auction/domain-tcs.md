# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** reopened · 1/5
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-06
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<g10adm url>` is the Grade10 admin console and `<g10url>` the Grade10 site of the environment under test. `<campaigns url>`, `<listings url>` and `<orders url>` are the console's Auction Campaigns, Listings and Orders pages; `<send log url>` is its letter send log.
* Every listing is priced in USD and closes on the Bid Increments schedule.

## g10adm.auction-dmn.US1: Operator announces an event and puts a lot under it

**As an** auction operator,
**I want** a campaign cover to go public while each lot under it publishes on its own,
**so that** the event is announced without a half-finished lot reaching a collector.

<!-- trace:case id=g10adm.auction-domain.TC-y1d rev=1 -->
### g10adm.auction-dmn.US1-TC1: A published cover leaves an unpublished lot off the catalogue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-03, grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on `<campaigns url>`.
* `<campaign_1>` is created and not published; `<listing_1>` and `<listing_2>` are created, unpublished and under it.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_1>` | A created campaign titled September Slabs (any title of 1 to 200 characters) |
| `<listing_1>` | A created listing under `<campaign_1>` with every required field set, slug `<slug_1>` |
| `<listing_2>` | A second created listing under `<campaign_1>` |
| `<slug_1>` | september-slabs-lot-1 (any unique slug of 1 to 64 lower-case words joined by hyphens) |

**Steps:**

1. Open `<campaign_1>` and publish it.
2. Open `<g10url>/auction`.
3. Open `<listing_1>` from `<listings url>` and publish it.
4. Open `<g10url>/auction` again.
5. Open `<g10url>/auction/listings/<slug_1>`.

**Expected Results:**

* Step 1 shows `<campaign_1>` published.
* Step 2 shows `<campaign_1>`'s cover as a public cover, and neither `<listing_1>` nor `<listing_2>` on the catalogue.
* Step 4 shows `<listing_1>` on the catalogue and still leaves `<listing_2>` off it.
* Step 5 shows `<listing_1>`.

---

## g10adm.auction-dmn.US2: Operator calls the event off and nothing stays live

**As an** auction operator,
**I want** cancelling a campaign to take its listings with it,
**so that** a called-off event leaves nothing a collector can still reach.

<!-- trace:case id=g10adm.auction-domain.TC-t49 rev=4 -->
### g10adm.auction-dmn.US2-TC1: Cancelling a campaign cancels its open lots and releases their addresses

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05, grade10-admin-auction-listing-US-05, grade10-admin-auction-listing-US-73, grade10-admin-auction-listing-US-03, grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on `<campaigns url>`.
* `<campaign_2>` is published and holds `<listing_3>` (published), `<listing_4>` (created), `<draft_sibling>` (draft) and `<closed_control>` (already closed); none but the control has closed.
* The codes of `<listing_3>`, `<listing_4>` and `<draft_sibling>`, and `<closed_control>`'s status, result, code and slug, are noted.
* `<replacement_3>`, `<replacement_4>` and `<replacement_draft>` are complete editable drafts outside `<campaign_2>`, each for its own available unit.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_2>` | A published campaign |
| `<listing_3>` | A published listing under `<campaign_2>`, slug `<slug_3>` |
| `<listing_4>` | A created, unpublished listing under `<campaign_2>`, slug `<slug_4>` |
| `<draft_sibling>` | A saved draft under `<campaign_2>`, slug `<draft_slug>` |
| `<closed_control>` | An already closed listing under `<campaign_2>`, with a recorded result |
| `<slug_3>` | called-off-lot (any unique valid slug) |
| `<slug_4>` | called-off-second-lot (any unique valid slug) |
| `<draft_slug>` | called-off-draft (any unique valid slug) |
| `<replacement_3>`, `<replacement_4>`, `<replacement_draft>` | Drafts with titles different from the cancelled listings |

**Steps:**

1. Open `<campaign_2>` and cancel it.
2. Open `<listing_3>`, `<listing_4>`, `<draft_sibling>` and `<closed_control>` in Listings.
3. Open `<g10url>/auction/listings/<slug_3>`, then `<g10url>/auction`.
4. Save `<replacement_3>` with `<slug_3>`, `<replacement_4>` with `<slug_4>` and `<replacement_draft>` with `<draft_slug>`.
5. Create and publish `<replacement_3>`.
6. Open `<g10url>/auction/listings/<slug_3>`, then `<g10url>/auction/listings/<slug_4>`.
7. Reopen the four original listings in Listings.

**Expected Results:**

* Step 1 shows `<campaign_2>` cancelled.
* Step 2 shows `<listing_3>`, `<listing_4>` and `<draft_sibling>` cancelled, and `<closed_control>` with its noted status, result, code and slug.
* Step 3 shows Page not found, and the catalogue shows neither the campaign's cover nor a cancelled listing.
* Step 4 saves each released slug, and step 5 creates `<replacement_3>` without a collision.
* Step 6 shows `<replacement_3>`, never `<listing_3>`, then Page not found while `<replacement_4>` stays unpublished.
* Step 7: each cancelled listing keeps its noted code and reads cancelled, `<closed_control>` is unchanged, and every replacement carries a code of its own.
* The cancelled listings stay absent from public browse and search.

---

## g10adm.auction-dmn.US3: Operator takes a lot from live to collected

**As an** auction operator,
**I want** a published lot to close into a payment I can collect and ship,
**so that** a won card leaves the sale without me leaving the admin.

<!-- trace:case id=g10adm.auction-domain.TC-dly rev=4 -->
### g10adm.auction-dmn.US3-TC1: A won lot is invoiced, paid by bank transfer, shipped and delivered

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04, post-sale-US-01, post-sale-US-02, post-sale-US-03, post-sale-US-04, post-sale-US-05

**Pre-conditions:**

* `<listing_5>` was published, customer A won it, and its order reads Preparing Invoice with a confirmed delivery address, HKD settlement and bank transfer on FPS.
* admin(holds payment-processing and shipment-processing) is on `<orders url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A closed USD listing won by customer A |
| `<winner email>` | customer A's contact address |
| `<shipping>` | USD10.01 (range: 1–99999 minor units), Shipping & Handling |
| `<insurance>` | USD5.00 (range: 0–99999 minor units) |
| `<transfer reference>` | FPS-20481 (any bank reference) |
| `<proof file>` | transfer-proof.pdf, a readable PDF below 10 MB |
| `<carrier>` | SF Express |
| `<tracking number>` | SF1234567890 (any tracking number) |
| `<delivery proof>` | delivery-proof.pdf, a readable PDF below 10 MB |

**Steps:**

1. Open Needs action and find `<listing_5>`'s order.
2. Open the order from its row.
3. Select Send invoice, enter `<shipping>` and `<insurance>` in USD, read the quote preview and confirm.
4. Select Record payment and record a bank transfer with `<transfer reference>` and `<proof file>`.
5. Select Dispatch and record `<carrier>` with `<tracking number>`.
6. Select Confirm delivery and attach `<delivery proof>`.

**Expected Results:**

* Step 1 lists the order as Preparing Invoice, with Send invoice as its primary action.
* Step 2 opens the order at its own address, leading with its status, the rule behind it and one primary action; it shows `<winner email>` as the contact, no Stripe identifier, and HKD settlement by bank transfer on FPS.
* Step 3 takes the amounts in USD, previews the USD lines, then the HKD Subtotal, fee and total with no rate, and the order reads Pending Payment.
* Step 4 sets the order to Preparing Shipment, step 5 to Shipped and step 6 to Delivered.
* The winner stays customer A throughout.

<!-- trace:case id=g10adm.auction-domain.TC-z12 rev=2 covers=none -->
### g10adm.auction-dmn.US3-TC2: A wire request on a closed lot releases the card hold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04, post-sale-US-03

**Pre-conditions:**

* <listing_6> is the listing named in **Test data**.
* admin(holds payment-processing) is on <grade10 auction admin post-sale url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | A published listing, closed with a winner, outcome Awaiting payment, with an open card authorization |

**Steps:**

1. Open <listing_6>.
2. Record that the winner requested wire transfer.
3. Read the authorization state for <listing_6>.

**Expected Results:**

* The outcome becomes Awaiting wire.
* Grade10 marks the winner's authorization for release.
* The authorization is not captured.

---

## g10adm.auction-dmn.US4: Admin protects a lot, an internal bidder wins it, and the card goes back to stock

**As an** auction admin,
**I want** a lot an internal bidder wins to open its internal order, which I invoice, let expire and cancel by hand,
**so that** the card goes back to stock through the same order flow as any unpaid lot.

<!-- trace:case id=g10adm.auction-dmn.TC-sjg rev=6 covers=g10adm.auction-internal-bid.SC-nl0,g10adm.auction-internal-bid.SC-6fc,g10adm.auction-internal-bid.SC-jzh,g10.auction-winner-order.SC-los,g10adm.auction-post-sale.SC-0op -->
### g10adm.auction-dmn.US4-TC2: An internal bidder's win is invoiced, expires and is cancelled, and the stock comes back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01, grade10-admin-auction-internal-bid-US-06, post-sale-US-05, post-sale-US-19, post-sale-US-13

**Pre-conditions:**

* `<listing_4>` is published in no campaign, taking bids, holding `<held quantity>` units of `<product_4>`, with no internal bid.
* `<internal bidder>` is an active internal bidder profile holding `<house billing address>`.
* customer A leads `<listing_4>` at `<starting price>` with maximum `<user A maximum>`, and will not bid again.
* The environment's clock can be moved past the payment deadline.
* admin(holds auction:reserve, auction:operate and auction:payment) is on `<listing_4>`'s editor.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A published USD listing for `<product_4>`, its scheduled close an hour away |
| `<product_4>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (range: 1–500) |
| `<available before>` | 3 units (any count) |
| `<starting price>` | USD100.00 (fixed boundary: the USD100 tier) |
| `<user A maximum>` | USD100.00 (fixed equality: `<starting price>`) |
| `<internal bidder>` | An active profile named Harbour Cards, email label harbour@internal.grade10.example |
| `<house billing address>` | Grade10 Stock Room, 4 Test Road, Central, Hong Kong (any complete Hong Kong address) |
| `<house maximum>` | USD101.00 (fixed: one dollar above `<user A maximum>`) |
| `<commit time>` | 10 minutes from now (range: 1–59 minutes, before the close) |
| `<final price>` | USD101.00 (fixed derived): capped at `<house maximum>` |
| `<buyer's premium>` | USD20.20 (fixed derived) |
| `<shipping>` | USD10.01, Shipping & Handling (range: 1–99999 minor units) |
| `<transfer fee>` | USD0.00, the bank transfer fee (fixed boundary) |
| `<note>` | QA internal order, house win |
| `<usd sum>` | USD131.21 (fixed derived): `<final price>` plus `<buyer's premium>` plus `<shipping>` |
| `<invoice subtotal>` | HKD1,030.00 (fixed derived): `<usd sum>` times 7.85, converted once and rounded up to the next cent |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`, pick `<internal bidder>`, and select Save.
2. Wait until `<listing_4>`'s close passes, taking no action.
3. As customer A, open `<listing_4>`'s page.
4. Open `<orders url>`, select All and open `<listing_4>`'s order.
5. Open Send invoice, enter `<shipping>` as Shipping & Handling and `<transfer fee>` as the bank transfer fee, and send.
6. Move the clock past the payment deadline and reload the order.
7. Open Cancel, pick Non-payment, enter `<note>` and confirm.
8. Read `<product_4>`'s available count on its product page.
9. Open `<send log url>`, filter by `<listing_4>` and read the rows from the close onward.

**Expected Results:**

* Step 3 reads Did not win, sold at `<final price>`.
* Step 4: exactly one order exists, flagged internal, buyer House with `<internal bidder>`, winning bid `<final price>`, HKD settlement by bank transfer on FPS, Preparing Invoice, no invoice issued, and `<house billing address>` as its delivery and billing address.
* Step 4: the order never passed through Awaiting Setup, and nobody chose its settlement currency or rail.
* Step 5 previews the USD lines, then the HKD Subtotal, fee and total with no rate, naming HKD settlement by bank transfer on FPS.
* After step 5 the order lists the USD winning bid, premium and shipping, then the HKD Subtotal `<invoice subtotal>`, a Total of HKD1,030.00, Pending Payment, and a deadline 7 calendar days after the send.
* Step 6: the order reads Payment Overdue, its invoice Expired.
* Step 7: the confirmation says no letter is sent, and the order then reads Cancelled.
* Step 8 reads `<available before>` plus `<held quantity>`.
* Step 9 holds no won, address, invoice, payment or other order letter for this order, to any recipient.

<!-- trace:case id=g10adm.auction-domain.TC-98w rev=2 covers=none -->
### g10adm.auction-dmn.US4-TC1: A bought-in lot releases its stock and relists with no internal bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-internal-bid-US-01, grade10-admin-auction-internal-bid-US-06, grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_4>` is published in no campaign, taking bids, holding `<held quantity>` units of `<product_4>`, with no internal bid.
* `<internal bidder>` is an active internal bidder profile in auction admin.
* customer A leads `<listing_4>` at `<starting price>` with maximum `<user A maximum>`, and will not bid again.
* admin(holds auction:reserve and auction:operate) is on `<listing_4>`'s editor from <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A published HKD listing for `<product_4>`, starting price `<starting price>`, scheduled close an hour away, extension duration 1800s (30mins) |
| `<product_4>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |
| `<starting price>` | 400000 minor units (HK$4,000.00) |
| `<user A maximum>` | 500000 minor units (HK$5,000.00) |
| `<internal bidder>` | An active internal bidder profile: name "QA House Four", email label qa-house-four@internal.test |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes from now |
| `<final price>` | 508000 minor units: `<user A maximum>` plus its 8000 increment |
| `<close date>` | The date `<listing_4>`'s close passes |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`, pick `<internal bidder>`, and click Save.
2. Wait until `<commit time>` passes, then read the Internal bid section.
3. Wait until `<listing_4>`'s close passes, taking no action.
4. Reload <grade10 auction admin listings url> and read `<listing_4>`'s row.
5. Open `<listing_4>` and read its status and stock note.
6. Read `<product_4>`'s available count on its product page.
7. Open the lot page for `<listing_4>` as customer A.
8. Click Relist on `<listing_4>`'s row in the Listings table.
9. Read the new draft's form, the Internal bid section included.

**Expected Results:**

* Step 2 shows the internal bid committed at `<commit time>`.
* Step 4: the row reads Bought in and offers Relist.
* Step 5 says the stock was released on `<close date>`.
* Step 6 reads `<available before>` plus `<held quantity>`.
* Step 7 reads Did not win, the lot sold at `<final price>`.
* Step 9 shows the editor filled in for `<product_4>`, quantity `<held quantity>`, starting price `<starting price>`, with no window.
* Step 9: the Internal bid section holds no amount and no time.

---

## g10adm.auction-dmn.US5: Operator writes a lot in two languages, a collector reads it, and staff keep quoting the English title

**As an** auction operator,
**I want** to write a lot's title and description in a collector's language, and every staff screen to keep quoting the English title,
**so that** the collector reads the lot in their own language while staff and the collector's support contact name one lot the same way.

<!-- trace:case id=g10adm.auction-dmn.TC-22w rev=1 covers=g10adm.auction-listing.SC-let,g10adm.auction-listing.SC-6es -->
### g10adm.auction-dmn.US5-TC1: A lot written in two languages is read by a collector and quoted by staff in English

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75, grade10-admin-auction-listing-US-76, grade10-admin-auction-listing-US-77, post-sale-US-02

**Pre-conditions:**

* admin(holds auction:operate and payment-processing) is on `<listings url>`.
* `<listing_1>` is a draft with every field Create needs, `<english title>` and `<english description>`, a close 5 minutes after publish, and no Chinese text.
* customer A(signed in, card linked) is on `<g10url>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A USD listing, slug `<slug_1>` |
| `<slug_1>` | The address built from the English title and the listing code |
| `<english title>` | Charizard PSA 10 |
| `<english description>` | 1999 Base Set, clean front. |
| `<traditional title>` | 寶可夢 噴火龍 PSA 10 |
| `<traditional description>` | 1999 年基本系列，正面無瑕。 |
| `<traditional fragment>` | 噴火龍 |

**Steps:**

1. Open `<listing_1>` and enter `<traditional title>` and `<traditional description>` as the Traditional Chinese title and description.
2. Select Save, then Create, then Publish now.
3. As customer A, open `<g10url>/tc/auction/listings/<slug_1>`.
4. As customer A, open `<g10url>/sc/auction/listings/<slug_1>`.
5. As customer A, open `<g10url>/auction/listings/<slug_1>`.
6. As customer A, open `<g10url>/tc/auction` and read `<listing_1>`'s card.
7. As customer A, place a bid on `<g10url>/tc/auction/listings/<slug_1>` and wait until the close has passed.
8. As admin, type `<traditional fragment>` in the Listings search.
9. As admin, open `<listing_1>`'s order from Orders and read the lot title.
10. As admin, open `<listing_1>` and choose Traditional Chinese, then Simplified Chinese, in the Copy block's language choice.

**Expected Results:**

* Step 2 publishes the listing.
* Step 3 reads `<traditional title>` and `<traditional description>`.
* Step 4 reads `<english title>` and `<english description>`, with no Traditional Chinese character.
* Step 5 reads `<english title>` and `<english description>`.
* Step 6's card is titled `<traditional title>`.
* Step 7 commits the bid.
* Step 8 lists `<listing_1>` once, under `<english title>`.
* Step 9 reads `<english title>`.
* Step 10 shows the Traditional Chinese title and description unmarked, then `<english title>` and `<english description>` marked as the fallback for Simplified Chinese.
