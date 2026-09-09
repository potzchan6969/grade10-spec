# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-09, tcs-rules r3.0

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

* admin(holds `auction:operate`) is on <grade10 auction admin campaigns url>.
* `<campaign_1>` is created and not yet published.
* `<listing_1>` and `<listing_2>` sit under `<campaign_1>`, both created and unpublished.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_1>` | A created campaign, title "September Slabs" |
| `<listing_1>` | A created listing under `<campaign_1>`, every required field set |
| `<listing_2>` | A second created listing under `<campaign_1>` |

**Steps:**

1. Publish `<campaign_1>`.
2. Navigate to <grade10 auction url> and read the catalogue.
3. Publish `<listing_1>` from <grade10 auction admin listings url>.
4. Read the catalogue again.

**Expected Results:**

* Step 1 moves `<campaign_1>` to `published` and shows it as a public catalogue cover.
* After step 1 neither `<listing_1>` nor `<listing_2>` is on the catalogue.
* Step 3 puts `<listing_1>` on the catalogue at its own address, `<listing_2>` still absent.

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

* admin(holds `auction:operate`) is on <grade10 auction admin campaigns url>.
* `<campaign_2>` is published with `<listing_3>` and `<listing_4>` published under it.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_2>` | A published campaign |
| `<listing_3>` | A published listing under `<campaign_2>`, slug `<slug_3>` |
| `<listing_4>` | A second published listing under `<campaign_2>` |

**Steps:**

1. Cancel `<campaign_2>`.
2. Read the state of `<listing_3>` and `<listing_4>`.
3. Navigate to `<slug_3>`'s public address.
4. Read the catalogue at <grade10 auction url>.

**Expected Results:**

* `<campaign_2>` moves to `canceled`.
* `<listing_3>` and `<listing_4>` move to `canceled` under the listing cancel rules.
* `<slug_3>`'s previous public address no longer returns that listing.
* Neither the cover nor its lots remain on the catalogue.

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

* `<listing_5>` is published and has a winning bid at its close.
* admin(holds payment-processing and shipment-processing) is on <grade10 auction admin post-sale url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A published listing that closed with a winner |
| `<winner email>` | The winning bidder's contact address |

**Steps:**

1. Filter the queue to `<listing_5>`'s outcome and open it.
2. Record payment collected.
3. Record shipment started, then shipment completed.

**Expected Results:**

* The detail shows the winner, the payment, the shipment and the trail together.
* `<winner email>` is the contact, with no Stripe identifier shown.
* The outcome moves Paid via Manual, then Shipped, then Delivered.
* The winner is unchanged throughout.

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

* `<listing_6>` is published, closed with a winner, and in Awaiting payment.
* The winner still holds an open card authorization on `<listing_6>`.
* admin(holds payment-processing) is on <grade10 auction admin post-sale url>.

**Steps:**

1. Open `<listing_6>`.
2. Record that the winner requested wire transfer.
3. Read the authorization state for `<listing_6>`.

**Expected Results:**

* The outcome becomes Awaiting wire.
* Grade10 marks the winner's authorization for release.
* The authorization is not captured.
