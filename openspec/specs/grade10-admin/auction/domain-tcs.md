# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** reopened · 1/5
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<g10adm url>` is the Grade10 admin console and `<g10url>` the Grade10 site of the environment under test; Campaigns, Listings, Orders and the send log are the console's auction pages.
* Every listing is priced in USD, whole dollars, on the Bid Increments schedule: the step is +USD10 from USD100, +USD25 from USD200 and +USD500 from USD5,000.
* An HKD order converts its USD lines to HKD once, at 7.85, a fraction of a cent rounding up; the buyer's premium is 20% of the winning bid.

## g10adm.auction-dmn.US1: Operator announces an event and puts a lot under it

**As an** auction operator,
**I want** a campaign cover to go public while each lot under it publishes on its own,
**so that** the event is announced without a half-finished lot reaching a collector.

<!-- trace:case id=g10adm.auction-domain.TC-y1d rev=1 -->
### g10adm.auction-dmn.US1-TC1: A published cover goes public while its unpublished lots stay off the catalogue

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

* admin(holds auction:operate) is on Campaigns; `<campaign>` is created, unpublished, and holds created, unpublished `<listing_1>` and `<listing_2>`.

**Steps:**

1. Publish `<campaign>`, then open `<g10url>/auction`.
2. Publish `<listing_1>` from Listings, then reopen `<g10url>/auction` and `<listing_1>`'s address.

**Expected Results:**

* Step 1 shows the campaign's cover, and neither listing.
* Step 2 shows `<listing_1>` on the catalogue and at its address; `<listing_2>` stays off.

---

## g10adm.auction-dmn.US2: Operator calls the event off and nothing stays live

**As an** auction operator,
**I want** cancelling a campaign to take its listings with it,
**so that** a called-off event leaves nothing a collector can still reach.

<!-- trace:case id=g10adm.auction-domain.TC-t49 rev=4 -->
### g10adm.auction-dmn.US2-TC1: Cancelling a campaign takes its open lots off the site and frees their addresses

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05, grade10-admin-auction-listing-US-05, grade10-admin-auction-listing-US-73, grade10-admin-auction-listing-US-03, grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on Campaigns; published `<campaign>` holds `<listing_3>` (published, slug `<slug_3>`), `<listing_4>` (created), a draft and `<closed lot>` (closed, with a result); their codes are noted.
* `<replacement>` is a complete draft outside `<campaign>`.

**Steps:**

1. Cancel `<campaign>`, and open each of its listings in Listings.
2. Open `<g10url>/auction/listings/<slug_3>` and `<g10url>/auction`.
3. Save `<replacement>` with `<slug_3>`, create and publish it, and reopen `<slug_3>`'s address.

**Expected Results:**

* Step 1: the campaign and its three open listings read cancelled, each keeping its code; `<closed lot>` keeps its status, result, code and slug.
* Step 2 shows Page not found, and the catalogue holds neither the cover nor a cancelled listing.
* Step 3 saves and publishes without a collision, and the address opens `<replacement>`, with a code of its own.

---

## g10adm.auction-dmn.US3: Operator takes a lot from live to collected

**As an** auction operator,
**I want** a published lot to close into a payment I can collect and ship,
**so that** a won card leaves the sale without me leaving the admin.

<!-- trace:case id=g10adm.auction-domain.TC-dly rev=4 -->
### g10adm.auction-dmn.US3-TC1: A won lot is invoiced, paid by bank transfer, shipped and delivered from the admin

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04, post-sale-US-01, post-sale-US-02, post-sale-US-03, post-sale-US-04, post-sale-US-05

**Pre-conditions:**

* customer A won `<listing_5>` at USD101; its order reads Preparing Invoice, address confirmed, HKD settlement by bank transfer on FPS.
* admin(holds payment and shipment processing) is on Orders.

**Steps:**

1. Open Needs action and the order.
2. Send the invoice with Shipping & Handling USD10.01.
3. Record a bank transfer, reference FPS-20481, with a PDF proof.
4. Dispatch with SF Express and tracking number SF1234567890.
5. Confirm delivery with a PDF proof.

**Expected Results:**

* Step 1 lists the order as Preparing Invoice with Send invoice as its primary action; the order shows customer A's email as the contact, no Stripe identifier, and HKD by bank transfer on FPS.
* Step 2 previews Winning Bid USD101.00, Buyer's Premium USD20.20 and Shipping & Handling USD10.01, then the HKD Subtotal HKD1,030.00, with no rate; the order reads Pending Payment.
* Steps 3, 4 and 5 move the order to Preparing Shipment, Shipped and Delivered; the winner stays customer A.

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
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-internal-bid-US-01, grade10-admin-auction-internal-bid-US-06, post-sale-US-05, post-sale-US-19, post-sale-US-13

**Pre-conditions:**

* `<listing_4>` holds 2 units of `<product>`, which has 3 more available, and closes in an hour; customer A leads at USD100 with a maximum of USD100.
* `<internal bidder>` is an active profile named Harbour Cards, billing Grade10 Stock Room, 4 Test Road, Central, Hong Kong.
* admin(holds auction:reserve, auction:operate and auction:payment) is on `<listing_4>`'s editor.

**Steps:**

1. Set an internal bid of USD105 committing in 10 minutes, as `<internal bidder>`, and Save.
2. Let the close pass; as customer A, open the listing.
3. Open the order from Orders.
4. Send the invoice with Shipping & Handling USD10.01 and a bank transfer fee of 0.
5. Move the clock past the payment deadline, then cancel the order for Non-payment.
6. Read `<product>`'s available count, and the send log for `<listing_4>` from the close.

**Expected Results:**

* Step 2 reads Did not win, sold at USD105 (fixed derived: capped at the internal bid, below USD100 plus the USD10 step).
* Step 3: one order, flagged internal, buyer House with `<internal bidder>`, winning bid USD105, HKD by bank transfer on FPS, Preparing Invoice, the billing address as its delivery and billing address; it never read Awaiting Setup.
* Step 4: the order reads Pending Payment with a 7-day deadline; step 5 reads Payment Overdue, then Cancelled after a confirmation saying no letter is sent.
* Step 6 reads 5 available, and no order letter to anyone.

---

## g10adm.auction-dmn.US5: Operator writes a lot in two languages, a collector reads it, and staff keep quoting the English title

**As an** auction operator,
**I want** to write a lot's title and description in a collector's language, and every staff screen to keep quoting the English title,
**so that** the collector reads the lot in their own language while staff and the collector's support contact name one lot the same way.

<!-- trace:case id=g10adm.auction-dmn.TC-22w rev=1 covers=g10adm.auction-listing.SC-let,g10adm.auction-listing.SC-6es -->
### g10adm.auction-dmn.US5-TC1: A lot written in two languages reads in the collector's language and stays English for staff

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-listing-US-75, grade10-admin-auction-listing-US-76, grade10-admin-auction-listing-US-77, post-sale-US-02

**Pre-conditions:**

* admin(holds auction:operate and payment processing) is on Listings; `<listing_1>` is a complete draft titled Charizard PSA 10, described "1999 Base Set, clean front.", closing 5 minutes after publish.
* customer A(signed in, card linked) is on `<g10url>` in a second session.

**Steps:**

1. Enter the Traditional Chinese title 寶可夢 噴火龍 PSA 10 and description "1999 年基本系列，正面無瑕。", then Save, Create and Publish now.
2. As customer A, open the listing under `/tc`, `/sc` and no prefix, and its card under `/tc/auction`.
3. As customer A, bid under `/tc` and let the close pass.
4. As admin, search Listings for 噴火龍, and open the order from Orders.

**Expected Results:**

* Step 2: `/tc` and its card read the Traditional Chinese title and description; `/sc` and no prefix read the English ones, with no Traditional Chinese character.
* Step 4: the search lists `<listing_1>` once, under Charizard PSA 10, and the order names it Charizard PSA 10.
