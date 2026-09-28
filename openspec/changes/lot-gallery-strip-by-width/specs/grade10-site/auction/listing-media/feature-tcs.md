# grade10-site/auction/listing-media Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-28, tcs-rules r3.0

## grade10-site-auction-listing-media-US5: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

### grade10-site-auction-listing-media-US5-TC2-1: Details gallery uses thumb, detail, and zoom

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
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_20> is published with two gallery images.
* The details gallery is wide enough for a left rail beside the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_20>` | A published auction listing with two gallery images |

**Steps:**

1. Navigate to <listing_20 public url>.
2. Check the thumbnail rail, the main frame, and zoom.

**Expected Results:**

* The thumbnail rail requests size `thumb`.
* The main frame requests size `detail`.
* Zoom requests size `zoom`.

### grade10-site-auction-listing-media-US5-TC8-1: Wide details gallery shows a left rail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_28> is published with two or more gallery images.
* The details gallery is wide enough for a left rail beside the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_28>` | A published auction listing with two or more gallery images |

**Steps:**

1. Navigate to <listing_28 public url>.
2. Check the gallery for a thumbnail rail beside the main frame.

**Expected Results:**

* A thumbnail rail is shown beside the main frame.

### grade10-site-auction-listing-media-US5-TC9-1: Stacked details gallery hides the rail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* <listing_29> is published with two or more gallery images.
* The details gallery is stacked and not wide enough for a left rail beside
  the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_29>` | A published auction listing with two or more gallery images |

**Steps:**

1. Navigate to <listing_29 public url> at a stacked gallery width.
2. Check for a thumbnail rail, previous/next.

**Expected Results:**

* No thumbnail rail is shown.
* Previous and next remain available.

## Settled

- Wide enough means the gallery can place a left rail beside the main frame;
  the implementation threshold stays in code.
- Stacked several-image galleries hide the rail; previous/next and progress
  remain.
- Named size `thumb` applies when the rail is shown; `detail` and `zoom`
  still apply to the main frame.

## Reconciliation

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md (US-05), proposal.md, decisions.md (goals, non-goals,
Q1–Q4, empty Raised), PRD Media Gallery strip lines, and durable
feature-tcs.md for id continuity with Reconciliation stripped. Denied:
every Requirements section, openspec/specs/ beyond those excerpts,
openspec/changes/archive/.

| Finding | Disposition |
| --- | --- |
| Details gallery uses thumb, detail, and zoom when a rail is shown | Folded as covered by `grade10-site-auction-listing-media-SC-22` / `grade10-site-auction-listing-media-US5-TC2-1` |
| Wide details gallery shows a left rail | Folded as covered by `grade10-site-auction-listing-media-SC-29` / `grade10-site-auction-listing-media-US5-TC8-1` |
| Stacked details gallery hides the rail, keeps previous/next | Folded as covered by `grade10-site-auction-listing-media-SC-30` / `grade10-site-auction-listing-media-US5-TC9-1` |
| One / empty / order cases already in the durable suite | Covered by durable `US5-TC5-1` through `US5-TC7-1` — unchanged by this change |
| Raised questions from the blind pass | None — Q1–Q4 already settled width rule, stacked replacement, ListingGallery carve-out, and unnamed threshold |
