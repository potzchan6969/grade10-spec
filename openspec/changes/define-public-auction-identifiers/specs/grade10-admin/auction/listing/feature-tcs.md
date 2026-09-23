# grade10-admin/auction/listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-admin-auction-listing-US72: Operator reads a listing's code to act on a quoted reference

**As an** auction operator,
**I want** to see a listing's code on its admin screen,
**so that** I can match a support, finance or reconciliation request that quotes the code (or the payment reference built from it) back to the right listing and order.

### grade10-admin-auction-listing-US72-TC1-1: Operator sees the code on a newly created listing

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
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator is on <grade10 auction admin listings url>.
* `<listing_1>` is a draft with every required create field set.

**Steps:**

1. Open `<listing_1>`.
2. Create the listing.

**Expected Results:**

* The Listings table and listing detail screen show the same listing code.
* The code is present with no further operator action.

### grade10-admin-auction-listing-US72-TC2-1: A draft listing shows no listing code yet

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator has a draft listing that has not yet been created.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that draft.

**Expected Results:**

* The draft's admin screen shows no listing code.

### grade10-admin-auction-listing-US72-TC3-1: Listing code matches its fixed two-letter-prefix shape

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator has a created listing.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Read the listing code shown.

**Expected Results:**

* The code is exactly 5 characters.
* Its first two characters are letters only, drawn from `ABCDEFGHJKMNPQRSTVWXYZ`, with no digit.
* Its remaining three characters are drawn from the full Crockford Base32 charset `0123456789ABCDEFGHJKMNPQRSTVWXYZ`.

### grade10-admin-auction-listing-US72-TC4-1: Two listings receive distinct codes

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
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* An authorized operator is on <grade10 auction admin listings url>.
* `<listing_1>` and `<listing_2>` are drafts, each with every required create field set.

**Steps:**

1. Create `<listing_1>`.
2. Create `<listing_2>`.
3. Read the listing code shown on each listing's admin screen.

**Expected Results:**

* `<listing_1>` and `<listing_2>` show different listing codes.

### grade10-admin-auction-listing-US72-TC5-1: A closed listing keeps its original listing code

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A closed listing whose code was `<listing code>` when it was created.
* An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the closed listing.

**Expected Results:**

* The admin screen still shows `<listing code>`.

### grade10-admin-auction-listing-US72-TC6-1: A called-off listing keeps its original listing code

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A listing called off before close, whose code was `<listing code>` when it was created.
* An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open the called-off listing.

**Expected Results:**

* The admin screen still shows `<listing code>`.

### grade10-admin-auction-listing-US72-TC7-1: Listing code has no editable control on the form or the API

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
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A created listing whose code is `<listing code>`.
* An authorized operator.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Open that listing.
3. Check the listing code for an editable input control.
4. Send an API write setting the listing code to a different value.

**Expected Results:**

* The listing code renders as read-only text, not an editable field.
* The API write is refused.
* The listing code remains `<listing code>`.

### grade10-admin-auction-listing-US72-TC8-1: Listing code follows existing admin listing access

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A created listing whose code is `LK423`.
* One signed-in operator has existing listing-admin read access.
* Another signed-in operator lacks that existing access.

**Steps:**

1. As the authorized operator, read `LK423` in the Listings table and listing detail screen.
2. As the other operator, attempt to open those same surfaces, including a request that names `LK423`.

**Expected Results:**

* The authorized operator sees `LK423` in both the Listings table and detail screen.
* The other operator receives the ordinary listing-access denial and cannot read private listing data.
* Knowing `LK423` does not grant or broaden admin access; no separate code permission is evaluated.

### grade10-admin-auction-listing-US72-TC9-1: Allocation retries a projected collision

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A newly created listing's 5-character candidate collides with an active code or retained reservation.

**Steps:**

1. Create the listing.
2. Read its code on the admin screen.

**Expected Results:**

* Allocation retries atomically.
* The stored code has the required shape and differs from the colliding code.

### grade10-admin-auction-listing-US72-TC10-1: A retained listing-code reservation is never allocated again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A retained reservation holds the previously issued code `LK423`.

**Steps:**

1. Create a later listing.
2. Read its allocated code.

**Expected Results:**

* `LK423` remains unavailable.
* The later listing receives a different code.

### grade10-admin-auction-listing-US72-TC11-1: Cancel preserves the canonical URL and does not release it

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
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* A published listing has canonical URL `<listing_url>` and code `<listing_code>`.

**Steps:**

1. Call the listing off.
2. Open `<listing_url>` directly.
3. Search for the listing in browse and search.
4. Attempt to create another listing with the same canonical URL.

**Expected Results:**

* `<listing_url>` still serves the called-off listing's public page.
* The listing is absent from browse and search.
* The canonical URL and `<listing_code>` remain permanently reserved.
* A later listing cannot claim `<listing_url>`.


## Reconciliation

**Run:** Scenario reading from `spec.md` `## Requirements` plus the durable
capability's spec, journeys and PRD; suite reading from the isolated bundle
(Purpose, Feature set, `user-journeys.md`, `decisions.md` including
`## Raised`, the PRD's Listing code bullet, and the durable `feature-tcs.md`
for id continuity, `## Reconciliation` stripped) — the two run without sight
of each other's draft.

| Case | Scenario | Disposition |
| --- | --- | --- |
| `US72-TC1-1` | `SC-87` | Same claim, expanded to both the Listings table and detail screen, kept |
| `US72-TC2-1` | `SC-88` | Same claim, kept |
| `US72-TC3-1` | `SC-87` | Real, distinct route (shape assertion) to a scenario the requirement already stated; kept as its own case |
| `US72-TC4-1` | none | Real behaviour (uniqueness) the requirement's "unique-constrained column" implies but no scenario stated; folded in as `SC-91`, case retraced to it |
| `US72-TC5-1` | `SC-90` | Same claim, kept |
| `US72-TC6-1` | `SC-90` | Distinct route (call-off vs. close) to the same scenario, kept |
| `US72-TC7-1` | `SC-89` | Same claim, kept |
| `US72-TC8-1` | `SC-94` | Folded in: existing listing-admin read access controls the code; knowing it cannot grant access or private data. |
| `US72-TC9-1` | `SC-92` | Folded in: projection collision retry is implementation-backed behavior required by the allocation rule. |
| `US72-TC10-1` | `SC-93` | Folded in: permanent reservation includes deleted listings. |

No contradiction: both readings agree on every point they both covered.

**Settled**, added to `decisions.md`: the code is visible in both the Listings
table and detail screen under existing listing-admin read access; knowing it
cannot grant access or private data.

The called-off address case is part of this identifier change because the
canonical URL is a permanent listing reference. It replaces the former
`US5-TC7-1` expectation that call off rewrites and releases the slug.

Out of scope for this capability's reconciliation (raised by the blind
reading, not carried forward): whether pre-existing listings get a
backfilled code (a migration/tech-design question, not a behaviour this PM
proposal covers per its Non-Goals); a copy-to-clipboard affordance on the
code (a display-mechanism detail, not a stated requirement); an operator-
facing hard delete distinct from call off (no such action exists in this
capability's feature set; `decisions.md` Q12's "deleted entirely" describes a
record-retention case with no operator-facing control here).
