# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-store-product-page-US13: Collector shares a card and the preview shows it

**As a** collector,
**I want** a product link I pass on to unfurl with the card's own picture, whole,
**so that** whoever receives it sees the card rather than a text-only preview
or one with its edges cut off.

### grade10-site-store-product-page-US13-TC1-1: Product address unfurls with the card's first catalogue image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists with two or more images in the shop's own order.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Check the response for `og:image`.

**Expected Results:**

* `og:image` names the card's first catalogue image, not a later one.
* That image is the same photograph the card's own page shows first.

### grade10-site-store-product-page-US13-TC2-1: Declared size matches what is actually delivered

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card with at least one image exists.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Read `og:image:width` and `og:image:height`.
3. Fetch the `og:image` URL and measure the delivered image.

**Expected Results:**

* `og:image:width` is `1200` and `og:image:height` is `630`.
* The image actually delivered at that URL is 1200 by 630 pixels.

### grade10-site-store-product-page-US13-TC3-1: Card sits whole inside the box, padded white and never cropped

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists whose first image's own aspect ratio differs from
1200 by 630.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Fetch the `og:image` and inspect the full frame.

**Expected Results:**

* The whole card is visible in the frame — no edge, corner, or label is cut off.
* The leftover space is filled solid white, not a blurred or extended copy of
  the photograph.

### grade10-site-store-product-page-US13-TC4-1: Card with no catalogue image carries no og:image at all

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists with no image attached.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Check the response for `og:image`.

**Expected Results:**

* No `og:image` tag is present — not an empty value, not a placeholder URL.
* Title, description and `og:url` are unaffected.

### grade10-site-store-product-page-US13-TC5-1: Card shape reads wide when a picture is present

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card with at least one image exists.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Read `twitter:card`.

**Expected Results:**

* `twitter:card` is `summary_large_image`.

### grade10-site-store-product-page-US13-TC6-1: Card shape reads small when no picture is present

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists with no image attached.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Read `twitter:card`.

**Expected Results:**

* `twitter:card` is `summary`.

### grade10-site-store-product-page-US13-TC7-1: Alt text names the card, and is absent when the picture is

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
Two catalogued cards exist: one whose image carries its own alt text, one
whose image carries none.

**Steps:**

1. Navigate to each card's own address with JavaScript disabled.
2. Read `og:image:alt` on each.

**Expected Results:**

* Where the image has its own alt text, `og:image:alt` is that text.
* Where it has none, `og:image:alt` is the card's name.

### grade10-site-store-product-page-US13-TC8-1: Two cards each unfurl with their own picture, never the other's

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
Two catalogued cards exist, each with its own distinct first image.

**Steps:**

1. Navigate to card A's address with JavaScript disabled and note `og:image`.
2. Navigate to card B's address with JavaScript disabled and note `og:image`.

**Expected Results:**

* Card A's `og:image` is card A's own first image; card B's is card B's own.
* Neither response's picture, size, or shape declaration leaks into the
  other's.

### grade10-site-store-product-page-US13-TC9-1: A small original is enlarged to fill the box

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists whose first image's native resolution is smaller
than 1200 by 630 in at least one dimension.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Fetch the `og:image` and measure the delivered pixel dimensions.

**Expected Results:**

* The delivered image is exactly 1200 by 630, enlarged from its native size
  rather than left smaller inside more padding.

## Settled

## Reconciliation

**Run:** The blind pass read this capability's `## Purpose` (unchanged) and
`## Feature set` (this change's "Shared link picture" leaf), the new
`user-journeys.md` entry (`US-13`) alongside the durable journeys for
context, the change's goals/non-goals and the PRD's `Product decisions`
Decided rows (`docs/prds/products/grade10-site/store/product-page.md`), and
the durable `feature-tcs.md` for id continuity. It was denied `spec.md`'s
Requirements section, `proposal.md`, `design.md`'s own Decisions/Risks
prose, and `openspec/changes/archive/`. There was no prior suite for this
journey, so there was no existing suite for id continuity beyond the
capability's other groups.

- **Raised, folded into spec** — the blind pass's case that a catalogue
  image narrower than the box is enlarged to fill it, rather than left at
  native size inside more padding, is real behaviour (`design.md`'s own
  Risks/Trade-offs section states it) that no scenario had asserted. Folded
  as `grade10-site-store-product-page-SC-32`.
- **Raised, rejected** — a case asserting the share picture resolves through
  the same CDN address as the catalogue image rather than a separately
  generated asset. That is an implementation contract
  (`sizedImageUrl`/`shareImage`, "One sizing rail" in the PRD's decisions),
  not an externally observable product behaviour a preview fetcher meets;
  it is the unit test's job, already covered by this change's own task 1.1.
  Dropped.
- **Raised, escalated** — whether a catalogue image that exists but fails to
  load or transform from the CDN falls back to no `og:image` or something
  else is not stated anywhere in the material (goals, non-goals, decisions,
  or requirement text). Landed as a ❓ on
  `docs/prds/products/grade10-site/store/product-page.md`'s `Product
  decisions` block.
- **Uncovered anchors** — none; `SC-30` through `SC-32` are each reached by
  at least one case above (`SC-30` by `TC1-1`, `TC2-1`, `TC3-1`, `TC5-1`,
  `TC7-1`, `TC8-1`; `SC-31` by `TC4-1`, `TC6-1`, `TC7-1`; `SC-32` by
  `TC9-1`).
- **Contradicted** — none; both readings agreed on every point they both
  stated. The blind pass's tag-vocabulary questions (which meta tags carry
  the size and shape) and its question about a shape declaration being
  X-specific are both already settled by the existing requirement text
  (`og:image:width`/`height`/`alt` and `twitter:card`, stated for every
  surface, not one fetcher) — not a disagreement, just material the blind
  pass was correctly denied.
