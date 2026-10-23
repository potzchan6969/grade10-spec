# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** reopened · 1/5
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-06
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite:** grade10-admin-auction-internal-bid-SC-74 — the no-account-suspension assertion is covered by the backend expiry check; the admin cross-feature walk checks overdue status and order letters

## grade10-admin-auction-e2e-US1: Operator announces an event and puts a lot under it

**As an** auction operator,
**I want** a campaign cover to go public while each lot under it publishes on its own,
**so that** the event is announced without a half-finished lot reaching a collector.

<!-- trace:case id=g10adm.auction-domain.TC-y1d rev=1 -->
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

<!-- trace:case id=g10adm.auction-domain.TC-t49 rev=4 -->
### grade10-admin-auction-e2e-US2-TC1-4: Campaign cancellation releases addresses for later lots

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-campaign-US-05, grade10-admin-auction-listing-US-05, grade10-admin-auction-listing-US-73, grade10-admin-auction-listing-US-03, grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin campaigns url>.
* <campaign_2> is published and contains draft, created, published and already closed listings.
* Its draft, created and published listings have not closed.
* The already closed control's status, result, code and slug were recorded.
* <replacement_3> and <replacement_4> are complete editable drafts outside <campaign_2>.
* Both original listing codes were recorded before cancellation.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_2>` | A published campaign |
| `<listing_3>` | A published listing under `<campaign_2>`, slug `<slug_3>` |
| `<listing_4>` | A created unpublished listing under `<campaign_2>`, slug `<slug_4>` |
| `<draft_sibling>` | A saved draft under `<campaign_2>`, with `<draft_slug>` |
| `<draft_slug>` | A distinct valid slug held by `<draft_sibling>` |
| `<closed_control>` | An already closed listing under `<campaign_2>`, with a recorded result and retained slug |
| `<replacement_draft>` | A complete saved draft outside the campaign, for another available inventory unit |
| `<slug_4>` | called-off-second-lot (any distinct valid slug) |
| `<replacement_3>` and `<replacement_4>` | Drafts for separate available inventory units, with different titles from the canceled listings |
| `<slug_3>` | called-off-lot (any unique slug, 1 to 64 lower-case words joined by hyphens) |

**Steps:**

1. Open <campaign_2>.
2. Cancel <campaign_2>.
3. Open <listing_3> in Listings.
4. Open <listing_4> in Listings.
5. Open `<draft_sibling>` in Listings.
6. Open `<closed_control>` in Listings.
7. Open /auction/listings/<slug_3>.
8. Open the auction catalogue.
9. Save <replacement_3> with <slug_3>.
10. Save <replacement_4> with <slug_4>.
11. Save `<replacement_draft>` with `<draft_slug>`.
12. Create <replacement_3>.
13. Publish <replacement_3>.
14. Open /auction/listings/<slug_3>.
15. Open /auction/listings/<slug_4>.
16. Reopen all original siblings in Listings.

**Expected Results:**

* Step 2 shows <campaign_2> canceled.
* Steps 3 to 5 show the published, created and draft siblings canceled.
* Step 6 keeps the closed control's recorded status and result.
* The control's slug and code remain unchanged and reserved.
* Step 7 returns 404 with Page not found.
* Step 8 shows neither the campaign cover nor canceled siblings.
* Steps 9 to 11 save each canceled sibling's released slug.
* Step 12 creates <replacement_3> without collision.
* Step 14 returns <replacement_3>, never <listing_3>.
* Step 15 returns 404 while <replacement_4> remains unpublished.
* Step 16 keeps each canceled sibling's original code and canceled status.
* The closed control is still unchanged.
* Replacement codes differ from the original sibling codes.
* Canceled siblings remain absent from public browse and search.

---

## grade10-admin-auction-e2e-US3: Operator takes a lot from live to collected

**As an** auction operator,
**I want** a published lot to close into a payment I can collect and ship,
**so that** a won card leaves the sale without me leaving the admin.

<!-- trace:case id=g10adm.auction-domain.TC-dly rev=4 -->
### grade10-admin-auction-e2e-US3-TC1-4: A published lot closes and is collected through to delivered

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
* customer A confirmed a delivery address and chose HKD settlement and bank transfer on FPS for <listing_5>'s order, which reads Preparing Invoice.
* admin(holds payment-processing and shipment-processing) is on <grade10 auction admin orders url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published listing that closed with a winner, in USD |
| `<close>` | 5 minutes after publish (any close after the start and after now) |
| `<winner email>` | The winning bidder's contact address |
| `<transfer reference>` | The bank's reference for the winner's transfer |
| `<carrier>` and `<tracking number>` | A carrier name and its tracking number |

**Steps:**

1. Open Needs action on the Orders worklist and find <listing_5>'s order.
2. Open the order from its row.
3. Click Send invoice, enter Shipping & Handling and Insurance in USD, read the quote preview, then confirm the quote.
4. Click Record payment and record a bank transfer settlement with <transfer reference> and one proof file.
5. Click Dispatch and record <carrier> with <tracking number>.
6. Click Confirm delivery and attach the carrier's proof.

**Expected Results:**

* Step 1 lists the order under Needs action as Preparing Invoice, with Send invoice as its primary action.
* Step 2 opens the order at its own address, leading with its status, the rule behind it and one primary action.
* Step 2 shows <winner email> as the winner's contact and no Stripe identifier.
* Step 2 shows the order's HKD settlement and bank transfer on FPS.
* Step 3 takes quote amounts in USD, previews the USD lines, then the HKD Subtotal, fee and total with no conversion rate, and then the order reads Pending Payment.
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

<!-- trace:case id=g10adm.auction-dmn.TC-sjg rev=6 covers=g10adm.auction-internal-bid.SC-nl0,g10adm.auction-internal-bid.SC-6fc,g10adm.auction-internal-bid.SC-jzh,g10.auction-winner-order.SC-los,g10adm.auction-post-sale.SC-0op -->
### grade10-admin-auction-e2e-US4-TC2-6: An internal bidder's win is invoiced, expires and is cancelled, and the stock comes back

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
| `<listing_4>` | A published USD listing for `<product_4>`, starting price `<starting price>`, scheduled close an hour away, extension duration 1800s (30mins) |
| `<product_4>` | A product with `<available before>` units available beside the hold |
| `<held quantity>` | 2 units (any quantity from 1 to 500) |
| `<available before>` | 3 units (any count) |
| `<starting price>` | 10000 minor units (US$100.00) |
| `<user A maximum>` | 10000 minor units (US$100.00) |
| `<internal bidder>` | An active internal bidder profile: name "Harbour Cards", email label harbour@internal.grade10.example |
| `<house billing address>` | A Hong Kong address with every required field: name "Grade10 Stock Room", 4 Test Road, Central, Hong Kong |
| `<house maximum>` | 10100 minor units (US$101.00) |
| `<commit time>` | 10 minutes from now |
| `<final price>` | 10100 minor units (US$101.00), the house maximum |
| `<buyer's premium>` | 2020 minor units (USD20.20) |
| `<shipping>` | 1001 minor units (USD10.01), Shipping & Handling |
| `<transfer fee>` | 0 minor units (USD0.00), bank transfer fee |
| `<note>` | "QA internal order, house win" |
| `<usd sum>` | 13121 minor units (USD131.21), `<final price>` plus `<buyer's premium>` plus `<shipping>` |
| `<invoice subtotal>` | 103000 minor units (HKD1,030.00), `<usd sum>` times 7.85 is 1029.9985, converted once and rounded up to the next cent |

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

* Step 3 reads Did not win, the lot sold at `<final price>` USD.
* Step 4: the order is flagged internal, buyer House with `<internal bidder>`, winning bid `<final price>` USD, HKD settlement, FPS and Preparing Invoice, with `<house billing address>` as its delivery and billing address.
* At Step 4, exactly one internal order exists. Its invoice status is `not_issued`, no invoice has been issued, and its method is `bank_transfer` on `fps`.
* The order does not enter Awaiting Setup and neither the winner nor operator chooses settlement currency or rail.
* Step 5: the operator's quote takes USD inputs of 1001 minor units for Shipping & Handling and 0 for the transfer fee, previews the USD lines, then the HKD Subtotal, fee and total with no conversion rate, names HKD settlement and bank transfer on FPS, and the invoice status becomes `pending`.
* After Step 5 the order page lists the USD winning bid of 10100, the USD premium of 2020 and USD shipping of 1001 minor units, then the HKD Subtotal `<invoice subtotal>`: their sum `<usd sum>` converted once. The transfer fee is zero, so the Total is 103000 minor units in HKD. The order reads Pending Payment and its deadline is 7 calendar days after the send.
* Step 6: the order reads Payment Overdue, the invoice Expired.
* Step 7: the confirmation says no letter is sent, and the order then reads Cancelled.
* Step 8 reads `<available before>` plus `<held quantity>`.
* Step 9 holds no won, address, invoice, payment or other order-letter row for this order addressed to any recipient, from the close through invoice send, expiry and cancellation.

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

---

## g10adm.auction-dmn.US5: Operator writes a lot in two languages, a collector reads it, and staff keep quoting the English title

**As an** auction operator,
**I want** to write a lot's title and description in a collector's language, and every staff screen to keep quoting the English title,
**so that** the collector reads the lot in their own language while staff and the collector's support contact name one lot the same way.

<!-- trace:case id=g10adm.auction-dmn.TC-22w rev=1 covers=g10adm.auction-listing.SC-let,g10adm.auction-listing.SC-6es -->
### g10adm.auction-dmn.US5-TC1: A lot written in two languages is read by a collector and quoted by staff in English

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
* **Trace:** grade10-admin-auction-listing-US-75, grade10-admin-auction-listing-US-76, grade10-admin-auction-listing-US-77, post-sale-US-02

**Pre-conditions:**

* admin(holds auction:operate and payment-processing) is on `<grade10 auction admin listings url>`.
* `<listing_1>` is a draft with every field Create needs, `<english title>` and `<english description>`, a close `<close>` after publish, and no Traditional or Simplified Chinese text.
* customer A (signed in, card linked) is on `<g10 site url>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A listing in USD, slug `<slug_1>`, English title `<english title>`, English description `<english description>`, with product, quantity, starting price, window and media |
| slug_1 | the address built from the English title and the listing code |
| close | 5 minutes after publish (any close after the start and after now) |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| traditional fragment | 噴火龍 |

**Steps:**

1. Open `<listing_1>` and enter `<traditional title>` and `<traditional description>` as the Traditional Chinese title and description.
2. Click Save, then Create, then Publish now.
3. As customer A, open the lot page at `/tc/auction/listings/<slug_1>` and read the title and description.
4. As customer A, open the lot page at `/sc/auction/listings/<slug_1>` and read the title and description.
5. As customer A, open the lot page at `/auction/listings/<slug_1>` and read the title and description.
6. As customer A, open the catalogue at `/tc/auction` and read the card of `<listing_1>`.
7. As customer A, place a bid on the lot page at `/tc/auction/listings/<slug_1>`.
8. Wait until `<close>` has passed.
9. As the admin, open Listings, type `<traditional fragment>` in the Listings search and read the row.
10. As the admin, open the order of `<listing_1>` from the Orders worklist and read the lot title.
11. As the admin, open `<listing_1>`, choose Traditional Chinese in the Copy block's language choice and read the title and description.
12. Choose Simplified Chinese in the Copy block's language choice and read the title and description.

**Expected Results:**

* Step 2 publishes the listing.
* Step 3 reads `<traditional title>` and `<traditional description>`.
* Step 4 reads `<english title>` and `<english description>`, with no Traditional Chinese character.
* Step 5 reads `<english title>` and `<english description>`.
* Step 6 reads `<traditional title>` as the card title.
* Step 7 commits the bid.
* Step 9 lists `<listing_1>` once, under `<english title>`.
* Step 10 reads `<english title>`.
* Step 11 shows the Traditional Chinese title and description, not marked as the fallback.
* Step 12 shows `<english title>` and `<english description>`, both marked as the fallback.

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

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - TC-t49@4 fully asserts SC157 on one campaign route with draft, created and published siblings plus a closed control. Every canceled sibling releases its slug; the closed control retains its result and reserved slug. The other 3 inherited cases retain their identities, bodies and classifications.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - TC-t49@4 was re-read and keeps its single link to SC157: draft, created and published siblings release their slugs, replacements save and create with them, and the closed control keeps its result, code and slug. No other scenario is asserted by this route.
- **Coverage** - No uncovered scenario at this level and no over-claim. The case asserts none of the old outcome: the called-off address answers 404 before a replacement is published.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

**Run:** Independent QA2, 2026-10-14. Reconciled the current admin domain cross-feature cases with the changed feature suites, current delta scenarios and durable baseline.

- **Retained:** Existing domain case IDs, revisions and routes remain; active cases stay draft and deprecated history remains deprecated.
- **US3:** The normal winner chooses HKD/FPS before the operator quotes in USD and sends the HKD invoice. This remains distinct from internal winner handling.
- **US4:** The internal winner receives HKD/FPS at close without winner or operator setup. The operator still quotes and sends the invoice, waits for expiry and cancels by hand.
- **Out of suite:** The no-suspension assertion of internal-bid `SC-74` remains assigned to the backend check. No other domain-level scenario is claimed by inference.
- **US4-TC2:** Revision 5 uses the exact shared close fixture: the winning bid is USD 10,100; USD premium is 2,020; and USD shipping is 1,001. The invoice lines convert to HKD 79,300 + 15,900 + 7,900 = HKD 103,100. It keeps the single-order, `not_issued` at close, HKD/FPS, no-setup, operator quote/send, expiry, cancellation, and any-recipient no-letter assertions. It covers internal-bid SC-71, SC-73 and SC-75, winner-order SC-277, and post-sale SC-253. Tasks 6.10 and 11.8 remain the planned implementation verifiers.

**Run:** 2026-10-14, QA2 in a fresh context, after QA1's levels pass (one composed case, written from the domain's journeys and PRD pages and decision 25) and Dev's delta. It read this draft, the durable `domain-tcs.md` it joins, the four delta suites, the scenarios, `decisions.md` and `tasks.md`. The case stays `draft`.

- **Disposition** - `g10adm.auction-dmn.US5-TC1` is kept. It guards the one path no feature case walks: the operator writes a language, the collector reads it, and staff keep quoting the English title. It traces two capabilities of the domain (`grade10-admin-auction-listing-US-75`, `grade10-admin-auction-listing-US-76`, `grade10-admin-auction-listing-US-77` and `post-sale-US-02`), as a domain case must. Its collector steps follow the precedent of the durable `grade10-admin-auction-e2e-US1-TC1-1`
- **Linked** - it asserts `grade10-admin-auction-listing-SC-183` (step 12) and `grade10-admin-auction-listing-SC-185` (step 9). It is not recorded as **Covered at domain** for any scenario: each of those also has a feature case, and the collector reads are the browser route, not the response HTML the site scenarios name
- **Partly asserted** - `grade10-admin-auction-listing-SC-193` by steps 9 and 10 (the table row and the order screen); the invoice screen, the won email and the Slack alert are not read. `grade10-site-auction-listing-page-SC-66` is not asserted: step 7 bids at `/tc` and the case reads no text after it
- **Contradicted** - none
- **Raised** - none of its own
- **Uncovered anchors** - none. The journey `g10adm.auction-dmn.US5` is not named by any walk task: group 8 of `tasks.md` walks the feature journeys but not this domain case, so a task 8.x owes it
- **Shape** - the draft is styled r5 (`g10adm.auction-dmn.US5`) and the durable file r4 (`grade10-admin-auction-e2e-US*`); the journey number 5 follows the durable US4, and the fold joins by number

**Run:** QA1, levels pass for `convert-hkd-order-at-subtotal`, 2026-10-22. It rewrote the two admin domain cases this change moves from the journeys and the domain's PRD pages, before the feature readings, and read no `## Requirements`, no scenario, no `tech-design.md`, no `tasks.md`, no archive and no code. The first blind pass ran on a bundle with empty suites and PRD pages without the product manager's edits, and was resumed on a corrected one. It is the run's own statement, not proof.

**Run:** QA1, second blind pass, 2026-10-22. It sharpened `US4-TC2-6` to read the lines and the Total on the order page after the send, with the same denials. It is the run's own statement, not proof.

**Run:** QA2, second reconciliation pass, 2026-10-22, in a fresh context. It read both cases against the post-sale and internal-bid deltas and recomputed the figures: 10100 plus 2020 plus 1001 is 13121 minor USD units, which converts once to 103000 at 7.85. It is a statement, not proof.

- **`grade10-admin-auction-e2e-US3-TC1-4`** (`TC-dly@4`) - step 3 reads the quote preview and the case names no amount; it carries no scenario link, as before
- **`grade10-admin-auction-e2e-US4-TC2-6`** (`TC-sjg@6`) - the figures move from 103100 to 103000 with the USD sum and the Subtotal stated, and the check after the send now reads the order page (decisions Q29). Its links stay: `grade10-admin-auction-post-sale-SC-253`, `grade10-admin-auction-internal-bid-SC-71`, `SC-73` and `SC-75`, and `winner-order-SC-277`. QA2 rewrote them from their display forms to the machine ids, which the trace check could not read; the meaning is unchanged. SC-73 now states 103000 (decisions Q30), so the case and the scenario agree
- **Stale text** - the `US4-TC2` paragraph of the durable suite's `## Reconciliation` (durable line 492) repeats the 103100 result and its per-line conversions; it is refreshed when `/tcs-review` next prepares the suite
- **Raised** - none
- **Contradictions** - none
