# grade10-site/auction/listing-media Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-auction-listing-media-US5: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

<!-- trace:case id=g10.auction-listing-media.TC-3vh rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
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

<!-- trace:case id=g10.auction-listing-media.TC-pls rev=1 covers=g10.auction-listing-media.SC-5tk -->
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

<!-- trace:case id=g10.auction-listing-media.TC-pbt rev=1 covers=g10.auction-listing-media.SC-cd3 -->
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
* Carousel progress remains available.

<!-- trace:case id=g10.auction-listing-media.TC-ic0 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC6-2: One image has no thumbnail strip or navigation

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* <listing_24> is published with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_24>` | A published listing with one gallery image |

**Steps:**

1. Navigate to <listing_24 public url>.
2. Check the gallery controls.

**Expected Results:**

* The image is shown.
* No thumbnail rail, previous control, or next control is shown.

<!-- trace:case id=g10.auction-listing-media.TC-l76 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### grade10-site-auction-listing-media-US5-TC7-2: No images still shows the listing without navigation

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* <listing_25> is published without gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | A published listing with no gallery images |

**Steps:**

1. Navigate to <listing_25 public url>.
2. Check the gallery and the listing page.

**Expected Results:**

* The gallery has no image and no previous or next control.
* The listing title and bid panel remain visible.

## Settled

- Wide enough means the gallery can place a left rail beside the main frame;
  the implementation threshold stays in code.
- Stacked several-image galleries hide the rail; previous/next and progress
  remain.
- Named size `thumb` applies when the rail is shown; `detail` and `zoom`
  still apply to the main frame.
- A one-image details gallery has no rail or previous/next. An empty details
  gallery has no image or previous/next while the listing page remains.

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
| Stacked details gallery hides the rail, keeps previous/next and progress | Folded as covered by `grade10-site-auction-listing-media-SC-30` / `grade10-site-auction-listing-media-US5-TC9-1` |
| One details image has no rail or previous/next | Revised durable `grade10-site-auction-listing-media-US5-TC6-1` as `TC6-2`, keeping trace id `g10.auction-listing-media.TC-ic0` at rev 2, for `grade10-site-auction-listing-media-SC-27` |
| Empty details gallery leaves the listing visible without previous/next | Revised durable `grade10-site-auction-listing-media-US5-TC7-1` as `TC7-2`, keeping trace id `g10.auction-listing-media.TC-l76` at rev 2, for `grade10-site-auction-listing-media-SC-28` |
| Details order | Covered by durable `grade10-site-auction-listing-media-SC-26` / `US5-TC5-1` — unchanged by this change |
| Raised questions from the blind pass | None — Q1–Q4 already settled width rule, stacked replacement, ListingGallery carve-out, and unnamed threshold |

**Uncovered anchors:** none after the stated scenario and case patches.
