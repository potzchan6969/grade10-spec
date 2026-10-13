# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** reopened · 1/4
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-06
**Drafts styled:** 2026-10-07, tcs-rules r4

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

## grade10-admin-auction-e2e-US3: Operator takes a lot from live to collected

**As an** auction operator,
**I want** a published lot to close into a payment I can collect and ship,
**so that** a won card leaves the sale without me leaving the admin.

<!-- trace:case id=g10adm.auction-domain.TC-dly rev=3 -->
### grade10-admin-auction-e2e-US3-TC1-3: A published lot closes and is collected through to delivered

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
3. Click Send invoice, enter Shipping & Handling and Insurance in USD, then confirm the quote in HKD.
4. Click Record payment and record a bank transfer settlement with <transfer reference> and one proof file.
5. Click Dispatch and record <carrier> with <tracking number>.
6. Click Confirm delivery and attach the carrier's proof.

**Expected Results:**

* Step 1 lists the order under Needs action as Preparing Invoice, with Send invoice as its primary action.
* Step 2 opens the order at its own address, leading with its status, the rule behind it and one primary action.
* Step 2 shows <winner email> as the winner's contact and no Stripe identifier.
* Step 2 shows the order's HKD settlement and bank transfer on FPS.
* Step 3 takes quote amounts in USD, shows HKD invoice amounts without a conversion rate, then the order reads Pending Payment.
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

## grade10-admin-auction-e2e-US4: Admin protects a lot, an internal bidder wins it, and the card goes back to stock

**As an** auction admin,
**I want** a lot an internal bidder wins to open its internal order, which I invoice, let expire and cancel by hand,
**so that** the card goes back to stock through the same order flow as any unpaid lot.

<!-- trace:case id=g10adm.auction-dmn.TC-sjg rev=5 covers=grade10-admin-auction-internal-bid-SC-71,grade10-admin-auction-internal-bid-SC-73,grade10-admin-auction-internal-bid-SC-75,g10.auction-winner-order.SC-los,grade10-admin-auction-post-sale-SC-253 -->
### grade10-admin-auction-e2e-US4-TC2-5: An internal bidder's win is invoiced, expires and is cancelled, and the stock comes back

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
* Step 5: the operator's quote takes USD inputs of 1001 minor units for Shipping & Handling and 0 for the transfer fee, names HKD settlement and bank transfer on FPS, and the invoice status becomes `pending`.
* The invoice total is 103100 minor units in HKD: the USD winning bid of 10100 converts to 79300, the USD premium of 2020 converts to 15900, and USD shipping of 1001 converts to 7900. The order reads Pending Payment and its deadline is 7 calendar days after the send.
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


## Reconciliation

**Run:** Independent QA2, 2026-10-14. Reconciled the current admin domain cross-feature cases with the changed feature suites, current delta scenarios and durable baseline. Full case ledger and source paths: `openspec/changes/usd-lot-currency-winner-settlement-choice/qa2-admin.md`.

- **Retained:** Existing domain case IDs, revisions and routes remain; active cases stay draft and deprecated history remains deprecated.
- **US3:** The normal winner chooses HKD/FPS before the operator quotes in USD and sends the HKD invoice. This remains distinct from internal winner handling.
- **US4:** The internal winner receives HKD/FPS at close without winner or operator setup. The operator still quotes and sends the invoice, waits for expiry and cancels by hand.
- **Out of suite:** The no-suspension assertion of internal-bid `SC-74` remains assigned to the backend check. No other domain-level scenario is claimed by inference.
- **US4-TC2:** Revision 5 uses the exact shared close fixture: the winning bid is USD 10,100; USD premium is 2,020; and USD shipping is 1,001. The invoice lines convert to HKD 79,300 + 15,900 + 7,900 = HKD 103,100. It keeps the single-order, `not_issued` at close, HKD/FPS, no-setup, operator quote/send, expiry, cancellation, and any-recipient no-letter assertions. It covers internal-bid SC-71, SC-73 and SC-75, winner-order SC-277, and post-sale SC-253. Tasks 6.10 and 11.8 remain the planned implementation verifiers.
