# grade10-admin/auction/listing Test Cases

**Status:** reopened · 0/4
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

<!-- trace:case id=g10adm.auction-listing.TC-yjr rev=4 covers=g10adm.auction-listing.SC-jx5,g10adm.auction-listing.SC-yml -->
### grade10-admin-auction-listing-US3-TC13-4: Create can reuse a canceled listing's original slug

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<original_listing>` is called off, previously used `<released_slug>`, and retains `<original_code>`.
* `<replacement>` is a complete saved draft with a different slug.
* admin(holds auction:operate) is on the Listings page.
* `<original_bidder>` placed accepted bids on `<original_listing>` before call off.
* Its original bidder history was recorded before replacement Save/Create.

Runs once per row of **Test data**.

**Test data:**

| `<original_listing>` | `<released_slug>` | `<original_code>` | `<replacement>` |
| --- | --- | --- | --- |
| A listing called off during this release | Its original valid slug | Its reserved code | A complete draft for another available unit |
| A listing called off before this release | Its original valid slug | Its reserved code | A complete draft for another available unit |

**Steps:**

1. Open `<replacement>`.
2. Enter `<released_slug>` in the slug field.
3. Leave the slug field.
4. Click Save.
5. Create the replacement.
6. Open `<original_listing>` in Listings.
7. Read its status and code.
8. As `<original_bidder>`, open My Auctions.
9. Read `<original_listing>`'s row and bid history.
10. Open the public address for `<released_slug>`.
11. Inspect its response and page.

**Expected Results:**

* Step 3 reports no unavailable-slug error.
* Step 4 saves `<released_slug>`.
* Step 5 creates `<replacement>` without collision.
* Step 7 shows canceled and `<original_code>`.
* `<original_listing>` no longer holds `<released_slug>`.
* The replacement's code differs from `<original_code>`.
* Step 9 retains the original listing identity and accepted bid history.
* The row says the original bidder's card was not charged.
* The original row has no navigation to `<replacement>`.
* Save/Create did not move history to the replacement.
* Step 10 returns 404 while the created replacement is unpublished.
* Step 11 shows Page not found with no original-lot data.
* The canceled original is not publicly exposed by Save/Create.

---

## grade10-admin-auction-listing-US5: Operator calls a listing off before it closes

**As an** auction operator,
**I want** to withdraw a lot at any point up to its close,
**so that** a consignor who pulls out or a card that fails authentication leaves the sale cleanly.

<!-- trace:case id=g10adm.auction-listing.TC-z2r rev=4 covers=g10adm.auction-listing.SC-xck,g10adm.auction-listing.SC-ysx -->
### grade10-admin-auction-listing-US5-TC7-4: Call off releases the original slug for saving

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** none
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-05

**Pre-conditions:**

* admin(holds the grant to call off listings) is on `<grade10 auction admin listings url>`.
* `<cancel_slug_listing>` is published, has not closed, and holds `<reserved_slug>`.
* `<reuse_slug_draft>` is a separate editable draft with a different saved slug.
* `<original_bidder>` has recorded accepted bids on `<cancel_slug_listing>`.
* `<original_code>` and the original account history were recorded before call off.

**Test data:**

| Field | Value |
| --- | --- |
| cancel_slug_listing | A published listing that has not closed |
| reserved_slug | The canonical slug already held by `<cancel_slug_listing>` |
| reuse_slug_draft | A saved draft holding a different slug |

**Steps:**

1. Open `<cancel_slug_listing>`.
2. Call it off.
3. Open `<reuse_slug_draft>` from Listings.
4. Enter `<reserved_slug>` in its slug field.
5. Leave the slug field.
6. Click Save.
7. Open the original public address for `<reserved_slug>`.
8. Search the auction catalogue for the original listing title.
9. Reopen `<cancel_slug_listing>` in admin.
10. As `<original_bidder>`, open My Auctions.
11. Read the original listing's row and bid history.

**Expected Results:**

* Step 2 shows `<cancel_slug_listing>` as canceled.
* Step 5 reports no unavailable-slug error.
* Step 6 saves `<reserved_slug>` on `<reuse_slug_draft>`.
* Step 7 returns 404 with Page not found, never the canceled lot.
* Step 8 finds no canceled lot in browse or search.
* Step 9 shows canceled with `<original_code>` unchanged and reserved.
* Step 11 retains the original listing and accepted bid history.
* The row says the card was not charged.
* The original account row has no link to the new holder.
* `<cancel_slug_listing>` stays canceled.

---

## grade10-admin-auction-listing-US72: Operator reads a listing's code to act on a quoted reference

**As an** auction operator,
**I want** to see a listing's code on its admin screen,
**so that** I can match a support, finance or reconciliation request that quotes the code (or the payment reference built from it) back to the right listing and order.

<!-- trace:case id=g10adm.auction-listing.TC-1jo rev=3 -->
### grade10-admin-auction-listing-US72-TC11-3: Call off keeps its code after address reuse

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-72

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<called_off_listing>` was published with `<original_slug>` and `<listing_code>`, then called off.
* `<later_listing>` is a complete editable draft with a different saved slug.

**Test data:**

| Field | Value |
| --- | --- |
| called_off_listing | A called-off listing retained in admin |
| original_slug | Its former public slug |
| listing_code | Its permanent allocated code |
| later_listing | A draft for a separate available inventory unit |

**Steps:**

1. Open `<later_listing>`.
2. Enter `<original_slug>` in its slug field.
3. Click Save.
4. Create `<later_listing>`.
5. Read its listing code.
6. Open `<called_off_listing>`.
7. Read its listing code.

**Expected Results:**

* Step 3 saves the released slug on `<later_listing>`.
* Step 5 shows a code different from `<listing_code>`.
* Step 7 still shows `<listing_code>`.
* `<called_off_listing>` stays canceled.

---

## grade10-admin-auction-listing-US73: Operator keeps a usable listing address while drafting

**As an** auction operator,
**I want** a saved draft to suggest a listing slug from its title and stable code,
**so that** I can start with a distinct public address and learn before Save when a chosen address is already reserved.

<!-- trace:case id=g10adm.auction-listing.TC-wrn rev=2 covers=g10adm.auction-listing.SC-ejg -->
### grade10-admin-auction-listing-US73-TC7-2: Competing reuse saves leave only one slug holder

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin A and admin B hold auction:operate in separate sessions.
* A called-off listing has released `<original_slug>`.
* `<draft_a>` and `<draft_b>` are saved complete drafts with different slugs.
* Each admin is editing one draft, before either Save occurs.
* Both Save actions can be submitted concurrently in the two independent contexts.

**Test data:**

| Field | Value |
| --- | --- |
| original_slug | The called-off listing's original valid slug |
| draft_a and draft_b | Complete drafts for separate available units, with different titles |

**Steps:**

1. In both contexts, enter `<original_slug>`.
2. In both contexts, leave the slug field.
3. Submit both Save actions concurrently, without awaiting either response.
4. Read both Save results.
5. Reopen both drafts.
6. Create the draft whose Save succeeded.
7. Publish that draft.
8. Open the address for `<original_slug>`.

**Expected Results:**

* Step 2 reports the released slug available in both contexts.
* Step 4 contains exactly one successful Save and one unavailable-slug refusal.
* Either draft can succeed; exactly one holds `<original_slug>`.
* Step 5 keeps the refused draft's original saved slug unchanged.
* The called-off listing stays canceled with its original code.
* Step 8 returns the successful holder only.
* It returns neither the refused draft nor the called-off listing.

---

## Reconciliation

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - All 21 listing scenarios have complete routes. TC-z2r@4 drives call off, released-slug field exit/Save, public refusal, browse/search removal and retained code/history. TC-yjr@4 saves and creates from earlier and current called-off rows, then checks the original code/history and public refusal. TC-wrn@2 submits both Saves concurrently, checks one holder and preserves the refused draft's stored slug. The campaign route TC-t49@4 covers SC157. Each covers link asserts the whole scenario without combining cases.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - Of 21 listing scenarios, 6 changed or new ones are linked here: SC-21 and SC156 to TC-yjr@4 (save, create and the original code and bidder history on earlier and current called-off rows), SC155 and SC-42 to TC-z2r@4 (field exit, Save, public 404, browse and search removal, retained code and history), SC158 to TC-wrn@2. SC157 is linked at domain to TC-t49@4. TC-1jo@3 (US72-TC11) stays unlinked: it checks the saved slug, a different code and the retained original code, but not field-exit availability (SC155), the created status or bidder history (SC156). The other 15 scenarios are unchanged durable copies that inherited durable cases cover; this suite does not claim them.
- **Coverage** - No scenario in this delta is uncovered. No over-claimed case: each `covers` link was re-read against its steps and results. No case asserts the old outcome; durable US3-TC13 and US5-TC7 are superseded by TC-yjr@4 and TC-z2r@4. Finding for the spec owner: the heading of SC-42 still says the cancel rewrites the slug, which the requirement and tech design retire. Gap: the requirement says a collector receives a closed or settled listing at its slug, but SC-16 proves only a published one; the closed route is asserted by site listing-page TC-90g with no scenario.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
