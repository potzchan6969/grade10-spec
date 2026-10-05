# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-admin-auction-e2e-US1: Operator announces an event and puts a lot under it

**As an** auction operator,
**I want** a campaign cover to go public while each lot under it publishes on its own,
**so that** the event is announced without a half-finished lot reaching a collector.

### grade10-admin-auction-e2e-US1-TC1-1: Published cover leaves an unpublished lot off the catalogue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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

* Step 2 shows <campaign_1> as published.
* Step 3 shows the cover for <campaign_1>.
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

### grade10-admin-auction-e2e-US2-TC1-1: Cancelling a published campaign cancels its published lots

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

* Step 2 shows <campaign_2> as canceled.
* Step 3 shows <listing_3> as canceled.
* Step 4 shows <listing_4> as canceled.
* Step 5 does not return <listing_3>.
* Step 6 shows neither the cover nor the lots.

---

## grade10-admin-auction-e2e-US3: Operator takes a lot from live to collected

**As an** auction operator,
**I want** a published lot to close into a payment I can collect and ship,
**so that** a won card leaves the sale without me leaving the admin.

### grade10-admin-auction-e2e-US3-TC1-1: A published lot closes and is collected through to delivered

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
* **Trace:** grade10-admin-auction-listing-US-04, post-sale-US-01, post-sale-US-02, post-sale-US-03, post-sale-US-04

**Pre-conditions:**

* <listing_5> was published with close <close>, customer A placed a bid, and that close has passed.
* The outcome is Awaiting payment.
* admin(holds payment-processing and shipment-processing) is on <grade10 auction admin post-sale url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published listing that closed with a winner |
| `<close>` | 5 minutes after publish (any close after the start and after now) |
| `<winner email>` | The winning bidder's contact address |

**Steps:**

1. Filter the queue to Awaiting payment.
2. Open <listing_5>.
3. Record payment collected.
4. Record shipment started.
5. Record shipment completed.

**Expected Results:**

* Step 2 shows winner, payment, shipment and trail.
* Step 2 shows <winner email> on the winner block.
* Step 2 shows no Stripe identifier.
* Step 3 sets the outcome to Paid via Manual.
* Step 4 sets the outcome to Shipped.
* Step 5 sets the outcome to Delivered.
* The winner is unchanged.

### grade10-admin-auction-e2e-US3-TC2-1: A wire request on a closed lot releases the card hold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
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
