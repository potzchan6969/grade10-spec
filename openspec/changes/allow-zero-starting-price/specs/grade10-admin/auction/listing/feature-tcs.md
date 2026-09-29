# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-admin-auction-listing-US1: Operator saves an unfinished listing and comes back to it

**As an** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

### grade10-admin-auction-listing-US1-TC3-2: Draft refuses a negative or non-whole starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_1>` is a draft in the row's currency with starting price 100000 minor units.

**Test data:**

| Currency | Starting price entered | Why refused |
| --- | --- | --- |
| USD | -1 minor unit (-$0.01) | Negative, one minor unit below the 0 boundary |
| HKD | -1 minor unit (-HK$0.01) | Negative, one minor unit below the 0 boundary |
| JPY | -1 minor unit (-¥1) | Negative, one minor unit below the 0 boundary |
| USD | 0.5 minor units ($0.005) | Not a whole number of minor units |
| JPY | 0.5 minor units (¥0.5) | Not a whole number of minor units |

**Steps:**

1. Open `<listing_1>`.
2. Enter the row's starting price.
3. Save the draft.
4. Reopen `<listing_1>` and read its starting price.

**Expected Results:**

* Step 3 refuses the save.
* Step 4 reads 100000 minor units in the row's currency.
* The listing remains a draft.

### grade10-admin-auction-listing-US1-TC6-1: Draft keeps a starting price of 0 apart from an empty one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_2>` is a draft in `HKD` with a title and no starting price.
* `<listing_3>` is a draft in `HKD` with a title and starting price 100000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A draft, currency `HKD`, starting price empty |
| `<listing_3>` | A draft, currency `HKD`, starting price 100000 minor units |
| Starting price | 0 minor units (HK$0.00) |

**Steps:**

1. Open `<listing_2>`, enter a starting price of 0, and save.
2. Reopen `<listing_2>` and read its starting price.
3. Open `<listing_3>`, clear its starting price, and save.
4. Reopen `<listing_3>` and read its starting price.

**Expected Results:**

* Step 1 saves; the listing remains a draft.
* Step 2 reads 0 minor units `HKD`, not empty.
* Step 3 saves; the listing remains a draft.
* Step 4 reads empty, not 0.

---

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

### grade10-admin-auction-listing-US3-TC21-1: Create accepts a starting price of 0 in each currency

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_4>` is a draft in the row's currency with a title, a slug, a start, a close after both the start and now, one image, and the stock hold its draft took, and no starting price.

**Test data:**

| Currency | Starting price entered | Read-back before saving |
| --- | --- | --- |
| USD | 0 minor units | A formatted zero amount in USD, with USD's decimal places |
| HKD | 0 minor units | A formatted zero amount in HKD, with HKD's decimal places |
| JPY | 0 minor units | A formatted zero amount in JPY, with JPY's decimal places |

**Steps:**

1. Open `<listing_4>`.
2. Enter the row's starting price.
3. Read the starting price's formatted read-back.
4. Create the listing.
5. Reopen `<listing_4>` and read its starting price.

**Expected Results:**

* Step 3 shows the row's read-back; no error on the field.
* Step 4 moves the listing to `created`.
* Step 5 reads 0 minor units in the row's currency.

### grade10-admin-auction-listing-US3-TC22-1: API create refuses a negative or non-whole starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_5>` is a draft in the row's currency with every create requirement set and starting price 0 minor units.

**Test data:**

| Currency | Starting price sent with create |
| --- | --- |
| USD | -1 minor unit |
| HKD | -1 minor unit |
| JPY | -1 minor unit |
| HKD | 0.5 minor units |
| JPY | 0.5 minor units |

**Steps:**

1. Send create for `<listing_5>` to the API with the row's starting price.
2. Read `<listing_5>` from the API.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads the listing as a draft.
* Step 2 reads starting price 0 minor units in the row's currency.

### grade10-admin-auction-listing-US3-TC23-1: API create with no starting price is refused, not stored as 0

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_6>` is a draft in `USD` with every create requirement set except the starting price, which is empty.

**Test data:**

| Starting price in the create request |
| --- |
| Field absent |
| Field present, null |
| Field present, an empty string |

**Steps:**

1. Send create for `<listing_6>` to the API with the row's starting price.
2. Read `<listing_6>` from the API.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads the listing as a draft.
* Step 2 reads the starting price empty, not 0.

### grade10-admin-auction-listing-US3-TC24-1: Operator lowers a created listing's starting price to 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_7>` is created and unpublished, currency `JPY`, starting price 1000000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A created, unpublished listing, currency `JPY`, starting price 1000000 minor units (¥1,000,000) |
| Starting price | 0 minor units |

**Steps:**

1. Open `<listing_7>`.
2. Set the starting price to 0 and save.
3. Reopen `<listing_7>` and read its starting price and status.

**Expected Results:**

* Step 2 saves.
* Step 3 reads 0 minor units `JPY`.
* Step 3 reads the listing as `created`.

---

## grade10-admin-auction-listing-US4: Operator puts a listing in front of collectors

**As an** auction operator,
**I want** to publish a listing now or at a time I set in advance,
**so that** a lot opens at the hour the sale was announced for and reads at its own public address from then on.

### grade10-admin-auction-listing-US4-TC14-1: Listing starting at 0 publishes to its public address

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
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds `auction:operate`) is on <grade10 auction admin listings url>.
* `<listing_8>` is created and unpublished, currency `USD`, starting price 0 minor units, slug `<zero start slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A created, unpublished listing, currency `USD`, starting price 0 minor units, every create requirement set |
| `<zero start slug>` | `no-reserve-charizard-psa-9` |

**Steps:**

1. Open `<listing_8>`.
2. Publish it now.
3. Navigate to <grade10 auction url>/`<zero start slug>`.

**Expected Results:**

* Step 2 moves the listing to `published`.
* Step 3 opens `<listing_8>`'s public page.

### grade10-admin-auction-listing-US4-TC15-1: Published listing refuses a change to a starting price of 0

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_9>` is published, currency `HKD`, starting price 100000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | A published listing, currency `HKD`, starting price 100000 minor units (HK$1,000.00) |
| Starting price | 0 minor units |

**Steps:**

1. Open `<listing_9>`.
2. Set the starting price to 0 and save.
3. Reopen `<listing_9>` and read its starting price.

**Expected Results:**

* Step 2 is refused.
* Step 3 reads 100000 minor units `HKD`.

## Settled

None.

## Reconciliation

**Run:** Blind pass read the listing Purpose and Feature set, the durable and change journeys, the change's proposal and decisions, the Auction Management and Bidding PRD pages, the existing listing suite for id continuity, the grade10-admin/auction domain suite, and the rule documents; it was denied every `## Requirements` section and scenario, `openspec/specs/` beyond the bundle, other changes, and the archive.

- **Joined:** `grade10-admin-auction-listing-US1-TC3-2` decides the revised `grade10-admin-auction-listing-SC-03`; `grade10-admin-auction-listing-US3-TC21-1` decides `grade10-admin-auction-listing-SC-125`; `grade10-admin-auction-listing-US3-TC22-1` decides `grade10-admin-auction-listing-SC-126`.
- **Raised, folded into spec:** a 0 that reads back as 0 and never as empty, folded into `grade10-admin-auction-listing-SC-124`.
- **Raised, folded into spec:** an absent, null or empty price at an API create is refused and never stored as 0 (Q8), as `grade10-admin-auction-listing-SC-127`.
- **Raised, folded into spec:** lowering a created listing to 0, as `grade10-admin-auction-listing-SC-128`.
- **Raised, folded into spec:** a created listing at 0 publishes with no second price check (Q9), as `grade10-admin-auction-listing-SC-129`.
- **Raised, rejected:** none.
- **Raised, escalated:** none from this suite. The run raised Q4 itself - what a lone maximum on a 0 start stands at - and folded the recommendation into `grade10-site/auction/auto-bidding`, held for the product manager.
- **Kept, no new scenario:** `grade10-admin-auction-listing-US4-TC15-1` walks a 0 against the durable rule that a published listing refuses every price write; the boundary is sharper, the rule unchanged.
- **Left to another suite:** the first-bid minimum on a 0 start is `grade10-site/auction/bid-increments`' rule and the lone-maximum price is `grade10-site/auction/auto-bidding`'s, walked in that capability's suite in this change.
- **Uncovered anchors:** none.
