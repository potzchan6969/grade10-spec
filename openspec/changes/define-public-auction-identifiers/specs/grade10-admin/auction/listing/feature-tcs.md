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

* The listing's admin screen shows a listing code.
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

### grade10-admin-auction-listing-US72-TC8-1: Listing code is withheld from an operator without permission to view the listing

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

* A created listing.
* A signed-in operator who may not view listings in the auction Listings section.

**Steps:**

1. Navigate to <grade10 auction admin listings url>.
2. Attempt to open that listing.

**Expected Results:**

* The operator cannot open the listing's admin screen.
* No listing code is disclosed to them.

**Blocked:** Product - whether the listing code needs a view permission separate from whatever already gates a listing's admin screen (this capability's existing requirements gate only writes - price-and-window, publish, call off - never a read); nothing decided this and no such gate is stated for the code.

## Reconciliation

**Run:** Scenario reading from `spec.md` `## Requirements` plus the durable
capability's spec, journeys and PRD; suite reading from the isolated bundle
(Purpose, Feature set, `user-journeys.md`, `decisions.md` including
`## Raised`, the PRD's Listing code bullet, and the durable `feature-tcs.md`
for id continuity, `## Reconciliation` stripped) — the two run without sight
of each other's draft.

| Case | Scenario | Disposition |
| --- | --- | --- |
| `US72-TC1-1` | `SC-87` | Same claim, kept |
| `US72-TC2-1` | `SC-88` | Same claim, kept |
| `US72-TC3-1` | `SC-87` | Real, distinct route (shape assertion) to a scenario the requirement already stated; kept as its own case |
| `US72-TC4-1` | none | Real behaviour (uniqueness) the requirement's "unique-constrained column" implies but no scenario stated; folded in as `SC-91`, case retraced to it |
| `US72-TC5-1` | `SC-90` | Same claim, kept |
| `US72-TC6-1` | `SC-90` | Distinct route (call-off vs. close) to the same scenario, kept |
| `US72-TC7-1` | `SC-89` | Same claim, kept |
| `US72-TC8-1` | none | Nobody present can settle it: this capability gates only writes (price-and-window, publish, call off), never a read, and nothing decided whether the code needs a view permission of its own. Kept `draft` with `**Blocked:** Product`; no scenario written |

No contradiction: both readings agree on every point they both covered.

**Raised**, added to `decisions.md`:

- Does the listing code need a view permission separate from whatever
  already gates a listing's admin screen? (blocks `US72-TC8-1`)
- Does the listing code show only on the listing's own admin detail screen,
  or also as a column in the Listings table? (`spec.md`'s requirement scopes
  to the listing's own screen per the journey's wording; the Listings table
  is not covered either way)

Out of scope for this capability's reconciliation (raised by the blind
reading, not carried forward): whether pre-existing listings get a
backfilled code (a migration/tech-design question, not a behaviour this PM
proposal covers per its Non-Goals); a copy-to-clipboard affordance on the
code (a display-mechanism detail, not a stated requirement); an operator-
facing hard delete distinct from call off (no such action exists in this
capability's feature set; `decisions.md` Q12's "deleted entirely" describes a
record-retention case with no operator-facing control here).
