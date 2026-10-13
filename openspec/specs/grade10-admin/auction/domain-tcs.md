# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** reopened · 2/4
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-06
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-admin-auction-e2e-US1: Operator announces an event and puts a lot under it

**As an** auction operator,
**I want** a campaign cover to go public while each lot under it publishes on its own,
**so that** the event is announced without a half-finished lot reaching a collector.

<!-- trace:case id=g10adm.auction-domain.TC-y1d rev=1 covers=g10adm.auction-campaign.SC-99d,g10adm.auction-campaign.SC-f38,g10adm.auction-campaign.SC-2n2,g10adm.auction-campaign.SC-k5l,g10adm.auction-campaign.SC-ymm,g10adm.auction-campaign.SC-l3i,g10adm.auction-listing.SC-30a,g10adm.auction-listing.SC-9oe,g10adm.auction-listing.SC-4f0,g10adm.auction-listing.SC-2d5,g10adm.auction-listing.SC-o1z,g10adm.auction-listing.SC-fcs,g10adm.auction-listing.SC-del,g10adm.auction-listing.SC-7xn,g10adm.auction-listing.SC-kr8,g10adm.auction-listing.SC-cdt,g10adm.auction-listing.SC-yrj,g10adm.auction-listing.SC-83t,g10adm.auction-listing.SC-usa,g10adm.auction-listing.SC-gj3 -->
### grade10-admin-auction-e2e-US1-TC1-1: Published cover leaves an unpublished lot off the catalogue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-03, grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin campaigns url>.
* <campaign_1> is created and not published.
* <listing_1> and <listing_2> are created, unpublished, and under <campaign_1>.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_1>` | A created campaign titled September Slabs (any title of 1 to 200 characters) |
| `<listing_1>` | A created listing under `<campaign_1>`, every required field set, slug `<slug_1>` |
| `<listing_2>` | A second created listing under `<campaign_1>`, slug `<slug_2>` |
| `<slug_1>` | september-slabs-lot-1 (any unique slug, 1 to 64 lower-case words joined by hyphens) |
| `<slug_2>` | september-slabs-lot-2 (any unique slug, 1 to 64 lower-case words joined by hyphens) |

**Steps:**

1. Open <campaign_1>.
2. Publish <campaign_1>.
3. Open <grade10 auction url>.
4. Open <listing_1> from <grade10 auction admin listings url>.
5. Publish <listing_1>.
6. Open <grade10 auction url>.
7. Open /auction/listings/<slug_1>.

**Expected Results:**

* Step 2 shows <campaign_1> moved to published.
* Step 3 shows the cover for <campaign_1> as a public cover.
* Step 3 leaves <listing_1> off the catalogue.
* Step 3 leaves <listing_2> off the catalogue.
* Step 6 shows <listing_1> on the catalogue.
* Step 6 leaves <listing_2> off the catalogue.
* Step 7 returns <listing_1>.

---

## grade10-admin-auction-e2e-US2: Operator calls the event off and nothing stays live

**As an** auction operator,
**I want** cancelling a campaign to take its listings with it,
**so that** a called-off event leaves nothing a collector can still reach.

<!-- trace:case id=g10adm.auction-domain.TC-t49 rev=1 covers=g10adm.auction-campaign.SC-p3b,g10adm.auction-campaign.SC-fwq,g10adm.auction-campaign.SC-tka,g10adm.auction-campaign.SC-8dq,g10adm.auction-campaign.SC-z8a,g10adm.auction-campaign.SC-uv1,g10adm.auction-campaign.SC-2l6,g10adm.auction-listing.SC-pfl,g10adm.auction-listing.SC-2px,g10adm.auction-listing.SC-oc9,g10adm.auction-listing.SC-e1b,g10adm.auction-listing.SC-f4v,g10adm.auction-listing.SC-j48,g10adm.auction-listing.SC-ysx,g10adm.auction-listing.SC-lj7,g10adm.auction-listing.SC-tjj,g10adm.auction-listing.SC-ztg,g10adm.auction-listing.SC-8zz -->
### grade10-admin-auction-e2e-US2-TC1-1: Cancelling a published campaign cancels its published lots

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05, grade10-admin-auction-listing-US-05

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin campaigns url>.
* <campaign_2> is published, with <listing_3> and <listing_4> published under it.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_2>` | A published campaign |
| `<listing_3>` | A published listing under `<campaign_2>`, slug `<slug_3>` |
| `<listing_4>` | A second published listing under `<campaign_2>` |
| `<slug_3>` | called-off-lot (any unique slug, 1 to 64 lower-case words joined by hyphens) |

**Steps:**

1. Open <campaign_2>.
2. Cancel <campaign_2>.
3. Open <listing_3> from <grade10 auction admin listings url>.
4. Open <listing_4> from <grade10 auction admin listings url>.
5. Open /auction/listings/<slug_3>.
6. Open <grade10 auction url>.

**Expected Results:**

* Step 2 shows <campaign_2> moved to canceled.
* Step 3 shows <listing_3> as canceled under the listing cancel rules.
* Step 4 shows <listing_4> as canceled under the listing cancel rules.
* Step 5 does not return <listing_3>.
* Step 6 shows neither the cover nor the lots.

---

## grade10-admin-auction-e2e-US3: Operator takes a lot from live to collected

**As an** auction operator,
**I want** a published lot to close into a payment I can collect and ship,
**so that** a won card leaves the sale without me leaving the admin.

<!-- trace:case id=g10adm.auction-domain.TC-dly rev=2 covers=g10adm.auction-post-sale.SC-88b,g10adm.auction-post-sale.SC-8wv,g10adm.auction-post-sale.SC-ydn,g10adm.auction-post-sale.SC-gks,g10adm.auction-post-sale.SC-8xm,g10adm.auction-post-sale.SC-82s,g10adm.auction-post-sale.SC-7rg -->
### grade10-admin-auction-e2e-US3-TC1-2: A published lot closes and is collected through to delivered

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-auction-listing-US-04, post-sale-US-01, post-sale-US-02, post-sale-US-03, post-sale-US-04, post-sale-US-05

**Pre-conditions:**

* <listing_5> was published with close <close>, customer A placed a bid, and that close has passed.
* customer A confirmed a delivery address and chose bank transfer for <listing_5>'s order, which reads Preparing Invoice.
* admin(holds payment-processing and shipment-processing) is on <grade10 auction admin orders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published listing that closed with a winner, in HKD |
| `<close>` | 5 minutes after publish (any close after the start and after now) |
| `<winner email>` | The winning bidder's contact address |
| `<transfer reference>` | The bank's reference for the winner's transfer |
| `<carrier>` and `<tracking number>` | A carrier name and its tracking number |

**Steps:**

1. Open Needs action on the Orders worklist and find <listing_5>'s order.
2. Open the order from its row.
3. Click Send invoice, enter Shipping & Handling and Insurance, and confirm.
4. Click Record payment and record a bank transfer settlement with <transfer reference> and one proof file.
5. Click Dispatch and record <carrier> with <tracking number>.
6. Click Confirm delivery and attach the carrier's proof.

**Expected Results:**

* Step 1 lists the order under Needs action as Preparing Invoice, with Send invoice as its primary action.
* Step 2 opens the order at its own address, leading with its status, the rule behind it and one primary action.
* Step 2 shows <winner email> as the winner's contact and no Stripe identifier.
* Step 3 shows the payment deadline the send sets, then the order reads Pending Payment.
* Step 4 sets the order to Preparing Shipment.
* Step 5 sets the order to Shipped.
* Step 6 sets the order to Delivered.
* The winner is unchanged.

<!-- trace:case id=g10adm.auction-domain.TC-z12 rev=2 covers=none -->
### grade10-admin-auction-e2e-US3-TC2-2: A wire request on a closed lot releases the card hold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

## grade10-admin-auction-e2e-US4: Admin protects a lot, an internal bidder wins it, and the card goes back to stock

**As an** auction admin,
**I want** a lot an internal bidder wins to open its internal order, which I invoice, let expire and cancel by hand,
**so that** the card goes back to stock through the same order flow as any unpaid lot.

<!-- trace:case id=g10adm.auction-dmn.TC-sjg rev=1 covers=g10adm.auction-internal-bid.SC-dq6,g10adm.auction-internal-bid.SC-nl0,g10adm.auction-internal-bid.SC-6fc,g10adm.auction-internal-bid.SC-77a,g10adm.auction-internal-bid.SC-jzh -->
### grade10-admin-auction-e2e-US4-TC2-1: An internal bidder's win is invoiced, expires and is cancelled, and the stock comes back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-internal-bid-US-01, grade10-admin-auction-internal-bid-US-06, post-sale-US-05, post-sale-US-19, post-sale-US-13

**Pre-conditions:**

* `<listing_4>` is published in no campaign, taking bids, holding `<held quantity>` units of `<product_4>`, with no internal bid.
* `<internal bidder>` is an active internal bidder profile in auction admin, holding `<house billing address>`.
* customer A leads `<listing_4>` at `<starting price>` with maximum `<user A maximum>`, and will not bid again.
* The environment's clock can be moved past the payment deadline.
* admin(holds auction:reserve, auction:operate and auction:payment) is on `<listing_4>`'s editor from <grade10 auction admin listings url>.

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
| `<house billing address>` | A Hong Kong address with every required field: name "Grade10 Stock Room", 4 Test Road, Central, Hong Kong |
| `<house maximum>` | 600000 minor units (HK$6,000.00) |
| `<commit time>` | 10 minutes from now |
| `<final price>` | 508000 minor units: `<user A maximum>` plus its 8000 increment |
| `<shipping>` | 0 minor units (HK$0.00), Shipping & Handling |
| `<transfer fee>` | 0 minor units (HK$0.00), bank transfer fee |
| `<note>` | "QA internal order, house win" |

**Steps:**

1. In the Internal bid section, enter `<house maximum>` and `<commit time>`, pick `<internal bidder>`, and click Save.
2. Wait until `<listing_4>`'s close passes, taking no action.
3. Open the lot page for `<listing_4>` as customer A.
4. Open <grade10 auction admin orders url>, select All and open `<listing_4>`'s order.
5. Open Send invoice, enter `<shipping>` as Shipping & Handling and `<transfer fee>` as the bank transfer fee, and send.
6. Move the clock past the payment deadline, then reload the order.
7. Open Cancel, pick Non-payment, enter `<note>` and confirm.
8. Read `<product_4>`'s available count on its product page.
9. Open <grade10 auction send log url>, filter by `<listing_4>` and read the rows from the close.

**Expected Results:**

* Step 3 reads Did not win, the lot sold at `<final price>`.
* Step 4: the order is flagged internal, buyer House with `<internal bidder>`, winning bid `<final price>`, Preparing Invoice, with `<house billing address>` as its delivery and billing address and bank transfer.
* Step 5: the order reads Pending Payment, deadline 7 calendar days after the send.
* Step 6: the order reads Payment Overdue, the invoice Expired.
* Step 7: the confirmation says no letter is sent, and the order then reads Cancelled.
* Step 8 reads `<available before>` plus `<held quantity>`.
* Step 9 holds no row addressed to `<internal bidder>`'s email label.

<!-- trace:case id=g10adm.auction-domain.TC-98w rev=2 covers=none -->
### grade10-admin-auction-e2e-US4-TC1-2: A bought-in lot releases its stock and relists with no internal bid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
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

## Reconciliation

**Run:** QA2 round 6, 2026-10-12. QA1's round-6 levels pass composed the path from every `user-journeys.md` in the domain, the durable `grade10-admin/auction/post-sale` journeys among them, and the domain's PRD pages, without any `## Requirements` section, `tech-design.md` or the archive. Dev's round-6 reading replaced Bought in with the internal bidder's order, and the listing capability left the change. QA2 joined the composed case to the scenarios its journeys accept, after Q48 to Q58 landed. It is a statement, not proof.

- **Retitled** - `grade10-admin-auction-e2e-US4` now reads that an internal bidder wins the lot and its order is invoiced, expired and cancelled by hand, since Bought in and Relist of a bought-in lot are gone (Q5, Q12, Q19, Q48)
- **Deprecated** - `grade10-admin-auction-e2e-US4-TC1-1` to `grade10-admin-auction-e2e-US4-TC1-2`: it proved Bought in, the stock released at the close and Relist with no internal bid, which no scenario states any more. Its id was issued in this change, so it is kept `deprecated` with `covers=none` and its body unchanged
- **Folded in** - `grade10-admin-auction-e2e-US4-TC2-1` (new) walks `grade10-admin-auction-internal-bid-US-01`, `grade10-admin-auction-internal-bid-US-06`, `post-sale-US-05`, `post-sale-US-19` and `post-sale-US-13`, asserting `grade10-admin-auction-internal-bid-SC-01`, `grade10-admin-auction-internal-bid-SC-71`, `grade10-admin-auction-internal-bid-SC-73`, `grade10-admin-auction-internal-bid-SC-74` and `grade10-admin-auction-internal-bid-SC-75`, and the collector's Did not win read of `grade10-site-auction-auction-SC-109`
- **Corrected to the requirement** - the case held a card rule for HKD and sent the invoice with Shipping & Handling only; it now enters a bank transfer fee of 0 (Q52), reads the order Preparing Invoice with `<house billing address>` as both addresses and bank transfer at step 4 (Q53), and reads the cancel confirmation saying no letter is sent at step 7 (Q54). `<house billing address>` names "Grade10 Stock Room", not the internal bidder, so the address cannot name it to staff (Q55)
- **Out of suite** - the no-suspension result of `grade10-admin-auction-internal-bid-SC-74` stays with task 4.1's backend tests, as the feature suite records
- **Rejected** - none
- **Raised** - none
- **Uncovered anchors** - none
