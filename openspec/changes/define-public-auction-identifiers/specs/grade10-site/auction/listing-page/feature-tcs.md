# grade10-site/auction/listing-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-auction-listing-page-US10: Collector quotes a published lot

**As a** collector browsing a listing,
**I want** to reference and share a lot by its title and URL,
**so that** I can discuss it with others and return to it easily.

### grade10-site-auction-listing-page-US10-TC1-1: Listing code absent from the response before scripts run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. View the page's response source before any script runs.
3. Search the source for the lot's listing code.

**Expected Results:**

* The source names the lot by its title.
* The listing code is not found anywhere in the source.

### grade10-site-auction-listing-page-US10-TC2-1: Listing code absent from the page once scripts finish running

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` and let the page finish loading its scripts.
2. View the rendered page and its current source.
3. Search both for the lot's listing code.

**Expected Results:**

* The listing code is not found in the rendered page.
* The listing code is not found in the page's source after scripts have run.

### grade10-site-auction-listing-page-US10-TC3-1: Listing code absent from the shared-link preview

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Fetch the share-preview metadata for `<a published lot's address>`.
2. Search the preview's title, description and url for the lot's listing code.

**Expected Results:**

* The preview's title names the lot and its url is the lot's own address.
* None of the share-preview fields contain the listing code.

### grade10-site-auction-listing-page-US10-TC4-1: Listing code absent from the page title and meta description

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. Read the browser tab title and the page's meta description.

**Expected Results:**

* Neither the tab title nor the meta description contains the listing code.

### grade10-site-auction-listing-page-US10-TC5-1: Listing code absent from the page's embedded data

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. View the page's response source.
3. Search any data embedded in the document, outside the visible text, for the lot's listing code.

**Expected Results:**

* No field in the embedded data carries the listing code.

### grade10-site-auction-listing-page-US10-TC6-1: Listing code absent from the page's own network responses

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` and let the page finish loading.
2. Inspect the responses the page's own client-side requests receive.
3. Search those responses for the lot's listing code.

**Expected Results:**

* None of the page's own network responses contain the listing code.

### grade10-site-auction-listing-page-US10-TC7-1: Listing code does not resolve as a lot address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists and its listing code is known from the admin listing screen.

**Steps:**

1. Open the auction's lot-address path, substituting the lot's listing code for its usual identifier.

**Expected Results:**

* The address does not resolve to that lot's page.
* The site's not-found surface is shown, the same as for any address naming no published lot.

### grade10-site-auction-listing-page-US10-TC8-1: Listing code stays absent regardless of the collector's signed-in state

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>` as a signed-out visitor and search the page and its source for the lot's listing code.
2. Open the same address signed in as a registered collector and repeat the search.

**Expected Results:**

* The listing code appears in neither view.
* The title and address shown are identical in both views.

### grade10-site-auction-listing-page-US10-TC9-1: Listing code stays absent once an order exists on the lot

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. View the page, its source, and its share-preview metadata.
3. Search all three for the lot's listing code, which is now also the order's payment reference.

**Expected Results:**

* None of the three surfaces contain the code.
* The lot is still identified only by its title and its address.

### grade10-site-auction-listing-page-US10-TC10-1: An address naming no lot carries no listing code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-10

**Pre-conditions:**

* The catalogue publishes no lot for `<a lot address naming no published lot>`.

**Steps:**

1. Fetch `<a lot address naming no published lot>`.
2. Search the response, including any error detail, for a listing code.

**Expected Results:**

* Response status is 404.
* No listing code appears anywhere in the response.

---

## grade10-site-auction-listing-page-US11: Collector contacts support about a lot

**As a** collector contacting support about a lot,
**I want** support to quickly identify which lot I'm referring to,
**so that** my inquiry is resolved faster without having to copy listing URLs or titles.

### grade10-site-auction-listing-page-US11-TC1-1: No listing code available on the page for the collector to send

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A published lot exists at its own address.
* The lot's listing code is known from the admin listing screen.

**Steps:**

1. Open `<a published lot's address>`.
2. Search the visible page and its source for the lot's listing code.

**Expected Results:**

* The listing code does not appear anywhere on the page or in its source for the collector to copy.

### grade10-site-auction-listing-page-US11-TC2-1: A listing code known from elsewhere gives no working link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A published lot exists and its listing code is known from a leak or from another surface.

**Steps:**

1. Attempt to open the lot's address by substituting its listing code for the lot's usual identifier.

**Expected Results:**

* The listing code does not resolve to the lot.
* No working link to the lot can be built from the code alone.

### grade10-site-auction-listing-page-US11-TC3-1: Title and address stay the collector's only reference once an order exists

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-11

**Pre-conditions:**

* A lot's auction has closed with a winning bid, so an order now exists on that lot.

**Steps:**

1. Open the lot's own address on the public listing page.
2. Note its title and address, and search the page for the lot's listing code.

**Expected Results:**

* The title and address are the same a collector would have quoted before the order existed.
* The listing code does not appear on the page.

## Reconciliation

**Run:** the suite pass read the isolated bundle assembled by hand at
`/private/tmp/.../scratchpad/blind-suite-isolated-input.md` (Purpose, Feature
set with the new "Public identifier" group, this capability's
`user-journeys.md` including US-10 and US-11, `decisions.md` with `## Raised`
included, the two PRD sections, and the existing `feature-tcs.md` for id
continuity); it was denied `## Requirements`, `openspec/specs/` beyond the
quoted sections, and `openspec/changes/archive/`. The scenario pass read
`proposal.md`, `decisions.md`, this capability's `user-journeys.md`, the
durable `spec.md`'s full `## Requirements`, and the same two PRD sections; it
did not read `feature-tcs.md` or the suite draft.

| Diff | Disposition |
| --- | --- |
| Suite carried a case for the listing code staying absent once scripts finish running (US10-TC2); no scenario stated it — the scenario draft's "Server-rendered response" bullet only covered the pre-script HTML | Real: the requirement's after-scripts behaviour is undecided by any prior requirement, and the durable "served lot becomes live without blanking" requirement is silent on the listing code. Folded in as `grade10-site-auction-listing-page-SC-25` |
| Suite carried a case for the listing code not resolving as a lot address (US10-TC7, US11-TC2); no scenario stated it | Real: whether the code could double as an alternate lookup key was never proposed or ruled out. Folded in as `grade10-site-auction-listing-page-SC-26` |
| Suite carried a case for the listing code staying absent once an order exists on the lot (US10-TC9, US11-TC3); no scenario stated it | Real, and already settled by decisions.md Q10 ("no auction ID ... is displayed anywhere on grade10-site's public listing pages") and the proposal ("It does not appear on grade10-site's public listing pages"), both unconditional on order state. Folded in as `grade10-site-auction-listing-page-SC-27` |
| Suite carried a case for the listing code staying absent regardless of signed-in state (US10-TC8) | Already covered: `SC-20`'s GIVEN/WHEN never conditions on an actor or auth state, so the rule is already unconditional across signed-in and signed-out visitors. No new scenario; case kept as a boundary check against that existing scenario |
| Suite carried two positive cases on US10 (title/address present in the served response; shared-link preview names the lot by title/address) | Misreading of scope: both duplicate durable `grade10-site-auction-listing-page-SC-01` and `-SC-03`, which already prove a lot's title, description and preview render correctly. Not new behaviour from this change. Dropped |
| Suite carried two positive cases on US11 (title/address together identify exactly one lot; the address a collector quotes reopens the same lot) | Misreading of scope: both duplicate durable `SC-01`/`SC-02`/`SC-05` (two lots answer as two pages; a published lot's address answers). Not new behaviour from this change. Dropped |
| Suite carried a case on US11 for a closed lot still resolving by title and address | Misreading of scope: tests general lot-status resolution (Ended lots stay published), which is `grade10-site/auction/lot-status`'s durable behaviour, not this change's identifier guard. Dropped |
| Scenario draft's `SC-24` (not-found response carries no listing code) reached no suite case | Hole: added `grade10-site-auction-listing-page-US10-TC10-1`, tracing `US-10` — an in-flight delta's suite can only trace journeys this same delta defines, and the durable `US-03` journey (whose not-found requirement this scenario extends) is not part of this delta's `user-journeys.md` |
| Suite's raised question on whether a stale/cached share-preview generated before this change could still surface on a re-share | Nobody decided it — the material is silent on share-preview caching/regeneration. Recorded under `decisions.md`'s `## Raised` |
| Suite's raised question on whether the collector-facing payment reference (Q6) ever appears on the listing page after an order exists | Already settled, not a genuine gap: Q10 and the proposal are unconditional that the listing page never shows the code, in any order state. Resolved directly as `SC-27` rather than raised |
| Suite's raised question on whether signed-in state matters here | Already settled, not a genuine gap: the requirement's rule is stated with no actor qualifier. No row raised |
| Suite's raised question on whether a code-shaped-but-wrong guess is handled differently from an ordinary bad address | Already settled by the durable "An address that names no lot is refused" requirement plus this delta's `SC-26`: a listing code is not wired into the address's lookup at all, so it is refused the same as any other unrecognized address. No row raised |

No contradiction between the two readings arose — both independently concluded
the code must never appear on this capability's public surfaces.
