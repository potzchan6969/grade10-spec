# grade10-site/auction/auction Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-25, tcs-rules r4
**Out of suite:** `grade10-site-auction-watchlist-SC-04` — signed-out watch from catalogue cards

## grade10-site-auction-auction-US6: Collector reads Featured on the catalogue

**As a** collector opening `/auction`,
**I want** the operator's Featured slides when any are set — front page image, title,
status, countdown, current bid and Bid Now —,
**so that** the lots the house leads with are what I meet first.

### grade10-site-auction-auction-US6-TC01-1: One Featured slide shows front page image title status countdown bid and Bid Now

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Exactly one complete Featured slot is set for a published Active lot with its front page image.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published Active lot bound to the only complete Featured slot |
| `<front page image>` | The front page image uploaded for that slot |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the single slide.

**Expected Results:**

* Featured band is present with one slide.
* The slide shows `<front page image>` as banner and slab, the lot title, LIVE BIDDING with a live status dot, relative Ends in, the current bid, and Bid Now.

### grade10-site-auction-auction-US6-TC02-1: Current bid rolls when the served amount increases

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured lot>` visible.
* The served current bid for `<featured lot>` is `<bid before>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published Active lot on a complete Featured slide |
| `<bid before>` | The current bid amount shown on the slide |
| `<bid after>` | A **higher** served current bid for the same lot after first paint |

**Steps:**

1. Read the current bid on the Featured slide after first paint.
2. Let the served current bid for `<featured lot>` become `<bid after>`.
3. Read the current bid on the Featured slide.

**Expected Results:**

* Step 1 shows `<bid before>`.
* Step 3 shows `<bid after>` with a rolling number as the amount increases.

### grade10-site-auction-auction-US6-TC03-1: Client countdown uses served close or open by lot status

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* One complete Featured slot is set for the row's lot.

**Test data:**

| Lot status | Served time | Countdown |
| --- | --- | --- |
| Active | Served close | Relative Ends in to the served close |
| Upcoming | Served open | Relative Opens in to the served open; UPCOMING with no live status dot; View Auction; no money |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the countdown and status chrome on the Featured slide.

**Expected Results:**

* The countdown matches the row (Ends in or Opens in).
* Upcoming shows UPCOMING with no live status dot and View Auction, and shows no starting bid or money amount.

### grade10-site-auction-auction-US6-TC04-1: Three Featured slides appear in operator order

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* Three complete Featured slots are set in operator order `<lot A>`, `<lot B>`, `<lot C>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published Active or Upcoming lot in Featured slot 1 |
| `<lot B>` | Published Active or Upcoming lot in Featured slot 2 |
| `<lot C>` | Published Active or Upcoming lot in Featured slot 3 |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured slides from first to last.

**Expected Results:**

* Featured shows three slides in order `<lot A>`, then `<lot B>`, then `<lot C>`.

### grade10-site-auction-auction-US6-TC05-1: Incomplete Featured slot is not shown

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* The only Featured slot holds an eligible lot and no front page image, or a front page image and no lot.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read whether a Featured band is present.

**Expected Results:**

* No Featured band is shown.
* All auctions is the catalogue content below the page chrome.

---

## grade10-site-auction-auction-US7: Collector advances Featured slides

**As a** collector on `/auction` with more than one Featured slide,
**I want** to move between slides with the progress control, and on a small
viewport also with stage previous/next or a horizontal swipe,
**so that** I can reach every curated lot without leaving the band.

### grade10-site-auction-auction-US7-TC01-1: Progress advances between two Featured slides

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Two complete Featured slots are set for `<lot A>` then `<lot B>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published lot in Featured slot 1 |
| `<lot B>` | Published lot in Featured slot 2 |

**Steps:**

1. Read the visible Featured lot.
2. Activate the progress control to advance to the next slide.
3. Read the visible Featured lot.

**Expected Results:**

* Step 1 shows `<lot A>`.
* Step 3 shows `<lot B>`.
* Progress dots are present for the two slides.

### grade10-site-auction-auction-US7-TC04-1: On a small viewport, stage next advances between two Featured slides

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` at a small viewport (below `md`).
* Two complete Featured slots are set for `<lot A>` then `<lot B>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published lot in Featured slot 1 |
| `<lot B>` | Published lot in Featured slot 2 |

**Steps:**

1. Read the visible Featured lot.
2. Activate stage next on the Featured image.
3. Read the visible Featured lot.

**Expected Results:**

* Step 1 shows `<lot A>`.
* Step 3 shows `<lot B>`.
* The stage image pages horizontally to `<lot B>`.
* Progress dots mark `<lot B>` current.

### grade10-site-auction-auction-US7-TC02-1: Progress reaches every slide when three are set

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Three complete Featured slots are set for `<lot A>`, `<lot B>`, `<lot C>` in that order.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published lot in Featured slot 1 |
| `<lot B>` | Published lot in Featured slot 2 |
| `<lot C>` | Published lot in Featured slot 3 |

**Steps:**

1. Read the visible Featured lot.
2. Advance with the progress control until each remaining slide has been shown.
3. Read each visible Featured lot after each advance.

**Expected Results:**

* The visible lots are `<lot A>`, then `<lot B>`, then `<lot C>` without leaving the Featured band.

### grade10-site-auction-auction-US7-TC03-1: A single Featured slide needs no multi-dot advance

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Exactly one complete Featured slot is set.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured progress control.

**Expected Results:**

* The single slide is shown.
* There is no multi-dot advance among slides.
* Stage previous/next is not required.

---

## grade10-site-auction-auction-US8: Collector opens a Featured lot

**As a** collector on a Featured slide,
**I want** Bid Now when the lot is Active, or View Auction when it is Upcoming,
to open that lot's details page,
**so that** I land on the lot the catalogue led with.

### grade10-site-auction-auction-US8-TC01-1: Bid Now opens an Active lot details page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured lot>` visible.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published **Active** lot on the visible Featured slide |
| `<lot page url>` | That lot's details page address |

**Steps:**

1. Activate Bid Now on the Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<lot page url>` — the details page for `<featured lot>`.

### grade10-site-auction-auction-US8-TC03-1: View Auction opens an Upcoming lot details page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<upcoming lot>` visible.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming lot on the visible Featured slide |
| `<lot page url>` | That lot's details page address |

**Steps:**

1. Activate View Auction on the Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<lot page url>` — the details page for `<upcoming lot>`.

### grade10-site-auction-auction-US8-TC02-1: Bid Now on a later Active slide opens that slide's lot

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
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with two complete Featured slides for `<lot A>` then `<lot B>`.
* The progress control has advanced so `<lot B>` is visible.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published **Active** lot in Featured slot 1 |
| `<lot B>` | Published **Active** lot in Featured slot 2 |
| `<lot B page url>` | `<lot B>`'s details page address |

**Steps:**

1. Activate Bid Now on the visible Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<lot B page url>` — the details page for `<lot B>`, not `<lot A>`.

---

## grade10-site-auction-auction-US9: Collector watches from an All auctions card

**As a** signed-in collector reading All auctions,
**I want** the watch control on a card to watch or unwatch that lot the same way as on the lot page and My Auctions,
**so that** I do not learn a second watch rule on the catalogue.

### grade10-site-auction-auction-US9-TC01-1: Watch on from an All auctions card

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in, not watching `<open lot>`) is on `<grade10 auction catalogue url>`.
* `<open lot>` appears on an All auctions card and is not closed.

**Test data:**

| Field | Value |
| --- | --- |
| `<open lot>` | A published Active or Upcoming lot on an All auctions card |

**Steps:**

1. Activate watch on the All auctions card for `<open lot>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open lot>` is watched.

**Expected Results:**

* The card shows the watched state.
* `<open lot>` is watched the same way as from the lot page and My Auctions.

### grade10-site-auction-auction-US9-TC02-1: Watch off from an All auctions card

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
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in, watching `<open lot>`) is on `<grade10 auction catalogue url>`.
* `<open lot>` appears on an All auctions card and is not closed.

**Test data:**

| Field | Value |
| --- | --- |
| `<open lot>` | A published Active or Upcoming lot the collector already watches |

**Steps:**

1. Activate watch off on the All auctions card for `<open lot>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open lot>` remains watched.

**Expected Results:**

* The card shows the unwatched state.
* `<open lot>` is no longer watched, same as unwatching from the lot page or My Auctions.

### grade10-site-auction-auction-US9-TC03-1: Closed lot card shows no watch control

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
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in) is on `<grade10 auction catalogue url>`.
* `<closed lot>` appears on an All auctions card.

**Test data:**

| Field | Value |
| --- | --- |
| `<closed lot>` | A closed lot visible in All auctions |

**Steps:**

1. Find the All auctions card for `<closed lot>`.
2. Read whether a watch control is present on that card.

**Expected Results:**

* The closed lot card shows no watch control.

---

## grade10-site-auction-auction-US5: Collector reads the catalogue in one order

**As a** collector,
**I want** All auctions to lead with the lots I can bid on, soonest to close first, and to keep that order as I read on — below Featured when Featured is present, with no category section —,
**so that** what I can still bid on is in front of me and reading further never shows me a lot twice or skips one.

### grade10-site-auction-auction-US5-TC5-1: Empty Featured leaves All auctions only

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
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* No complete Featured slot is set.
* At least one lot is visible in All auctions.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the page sections.

**Expected Results:**

* No Featured band is present.
* All auctions is shown with lots in the catalogue resting order.

### grade10-site-auction-auction-US5-TC6-1: Catalogue shows no category chrome

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
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Featured may be present or absent.

**Steps:**

1. Read the catalogue page for category chrome.

**Expected Results:**

* There is no Categories heading, no category tiles, and no busy filter chrome.
* The only sections are Featured when set, then All auctions.

### grade10-site-auction-auction-US5-TC7-1: Empty All auctions still shows Featured when slots are set

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
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set.
* No lots are available for All auctions.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the All auctions area.

**Expected Results:**

* Featured still shows the curated slide or slides.
* All auctions shows a message that there are no auctions.

### grade10-site-auction-auction-US5-TC8-1: Featured lots also appear in All auctions resting order

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
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set for `<featured lot>`.
* `<featured lot>` is among the lots a collector can see.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published lot that fills a complete Featured slot |

**Steps:**

1. Read the Featured band for `<featured lot>`.
2. Read All auctions for `<featured lot>` and the list order.

**Expected Results:**

* `<featured lot>` appears in Featured and again in All auctions.
* All auctions keeps the catalogue resting order below Featured, with no duplicate within the list and no skipped visible lot.

### grade10-site-auction-auction-US5-TC9-1: Catalogue address stays indexable at /auction without category query

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
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the document canonical and share address.

**Expected Results:**

* Canonical and share address are `/auction` with no category query.

### grade10-site-auction-auction-US5-TC10-1: More All auctions lots load on scroll

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
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* All auctions holds more lots than the first batch shows.

**Steps:**

1. Read the first batch of All auctions cards.
2. Scroll near the end of the shown lots.
3. Wait for the next batch.

**Expected Results:**

* Step 2 shows Boneyard skeleton cards below the lots already shown, or the next batch lands without pagination controls.
* Step 3 shows additional lots below the first batch.
* Lots from step 1 stay visible.
* The combined list stays in the catalogue resting order.
* No pagination controls appear.

### grade10-site-auction-auction-US5-TC11-1: An Upcoming All auctions card shows no money

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
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* An Upcoming lot is among All auctions.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming lot on All auctions |

**Steps:**

1. Find `<upcoming lot>` on All auctions.
2. Read its card for money and countdown.

**Expected Results:**

* The card shows no starting bid and no money amount.
* The card shows Opens in from the served open.

## Settled

- Progress advances by the progress control; on a small viewport stage previous/next and horizontal swipe also advance. CarouselProgress auto-play is allowed presentation, not a separate product rule for this change
- One Featured slide need not offer multi-dot advance or stage previous/next; progress may be absent or a single item
- A Featured lot that is no longer Active or Upcoming leaves the public Featured band at read time; the admin slot remains until cleared or replaced
- One lot may not occupy two Featured slots
- Signed-out watch on catalogue cards is owned by `grade10-site/auction/watchlist` (offer sign-in)
- An operator may replace a filled slot in place; clearing first is not required
- A slot missing lot or front page image is incomplete, may be saved in admin, and is not shown on `/auction`

## Reconciliation

**Run:** Blind suite from `.round/blind-input` (Purpose/Feature set, journeys, proposal, decisions, ui-design without scenario dispositions, PRD Catalogue/Featured excerpts, existing site feature-tcs with Reconciliation stripped). Denied: `openspec/specs/` requirements, archive, and any `## Requirements`. Scenario pass read `.round/scenario-input` including durable site requirements and tech-design; denied all feature-tcs and blind drafts.

### Raised, folded
- Empty All auctions with Featured still present → `grade10-site-auction-auction-SC-41`
- Catalogue address `/auction` with no category query → `grade10-site-auction-auction-SC-42`
- Featured absent when no complete eligible slide (including Ended-at-read) → `grade10-site-auction-auction-SC-30`
- Incomplete slot not shown → `grade10-admin-auction-featured-SC-02` (site coverage via SC-30)
- Same lot in two slots refused → `grade10-admin-auction-featured-SC-06`
- Replace in place → stated on fill requirement; covered by fill scenarios
- View Auction on Upcoming Featured → `grade10-site-auction-auction-SC-58`
- Bid rolls only on increase after first paint → `grade10-site-auction-auction-SC-32`
- All auctions infinite scroll and load-more skeletons → `grade10-site-auction-auction-SC-59`, `SC-60`
- Upcoming hides money on Featured and All auctions → `grade10-site-auction-auction-SC-33`, `SC-61`

### Raised, rejected
- Auto-advance as a required product behaviour — journey and decisions name collector advance (progress; on small viewports stage previous/next or swipe); auto-play is CarouselProgress presentation only
- Signed-out watch behaviour on All auctions cards — already required by `grade10-site/auction/watchlist`; not restated here

### Uncovered anchors
- **Out of suite:** signed-out watch from catalogue — `grade10-site/auction/watchlist` feature suite (`grade10-site-auction-watchlist-SC-04`)
