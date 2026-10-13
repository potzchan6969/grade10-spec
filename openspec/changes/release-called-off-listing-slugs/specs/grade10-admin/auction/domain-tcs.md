# grade10-admin/auction Cross-Feature E2E Test Cases

**Status:** reopened · 0/1
**Reviewed:** 2026-10-05, tcs-rules r4, lapsed 2026-10-06
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-admin-auction-e2e-US2: Operator calls the event off and nothing stays live

**As an** auction operator,
**I want** cancelling a campaign to take its listings with it,
**so that** a called-off event leaves nothing a collector can still reach.

<!-- trace:case id=g10adm.auction-domain.TC-t49 rev=4 covers=g10adm.auction-listing.SC-euk -->
### grade10-admin-auction-e2e-US2-TC1-4: Campaign cancellation releases addresses for later lots

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
* **Trace:** grade10-admin-auction-campaign-US-05, grade10-admin-auction-listing-US-05, grade10-admin-auction-listing-US-73, grade10-admin-auction-listing-US-03, grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on <grade10 auction admin campaigns url>.
* <campaign_2> is published and contains draft, created, published and already closed listings.
* Its draft, created and published listings have not closed.
* The already closed control's status, result, code and slug were recorded.
* <replacement_3> and <replacement_4> are complete editable drafts outside <campaign_2>.
* Both original listing codes were recorded before cancellation.

**Test data:**

| Field | Value |
| --- | --- |
| `<campaign_2>` | A published campaign |
| `<listing_3>` | A published listing under `<campaign_2>`, slug `<slug_3>` |
| `<listing_4>` | A created unpublished listing under `<campaign_2>`, slug `<slug_4>` |
| `<draft_sibling>` | A saved draft under `<campaign_2>`, with `<draft_slug>` |
| `<draft_slug>` | A distinct valid slug held by `<draft_sibling>` |
| `<closed_control>` | An already closed listing under `<campaign_2>`, with a recorded result and retained slug |
| `<replacement_draft>` | A complete saved draft outside the campaign, for another available inventory unit |
| `<slug_4>` | called-off-second-lot (any distinct valid slug) |
| `<replacement_3>` and `<replacement_4>` | Drafts for separate available inventory units, with different titles from the canceled listings |
| `<slug_3>` | called-off-lot (any unique slug, 1 to 64 lower-case words joined by hyphens) |

**Steps:**

1. Open <campaign_2>.
2. Cancel <campaign_2>.
3. Open <listing_3> in Listings.
4. Open <listing_4> in Listings.
5. Open `<draft_sibling>` in Listings.
6. Open `<closed_control>` in Listings.
7. Open /auction/listings/<slug_3>.
8. Open the auction catalogue.
9. Save <replacement_3> with <slug_3>.
10. Save <replacement_4> with <slug_4>.
11. Save `<replacement_draft>` with `<draft_slug>`.
12. Create <replacement_3>.
13. Publish <replacement_3>.
14. Open /auction/listings/<slug_3>.
15. Open /auction/listings/<slug_4>.
16. Reopen all original siblings in Listings.

**Expected Results:**

* Step 2 shows <campaign_2> canceled.
* Steps 3 to 5 show the published, created and draft siblings canceled.
* Step 6 keeps the closed control's recorded status and result.
* The control's slug and code remain unchanged and reserved.
* Step 7 returns 404 with Page not found.
* Step 8 shows neither the campaign cover nor canceled siblings.
* Steps 9 to 11 save each canceled sibling's released slug.
* Step 12 creates <replacement_3> without collision.
* Step 14 returns <replacement_3>, never <listing_3>.
* Step 15 returns 404 while <replacement_4> remains unpublished.
* Step 16 keeps each canceled sibling's original code and canceled status.
* The closed control is still unchanged.
* Replacement codes differ from the original sibling codes.
* Canceled siblings remain absent from public browse and search.

---

## Reconciliation

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - TC-t49@4 fully asserts SC157 on one campaign route with draft, created and published siblings plus a closed control. Every canceled sibling releases its slug; the closed control retains its result and reserved slug. The other 3 inherited cases retain their identities, bodies and classifications.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - TC-t49@4 was re-read and keeps its single link to SC157: draft, created and published siblings release their slugs, replacements save and create with them, and the closed control keeps its result, code and slug. No other scenario is asserted by this route.
- **Coverage** - No uncovered scenario at this level and no over-claim. The case asserts none of the old outcome: the called-off address answers 404 before a replacement is published.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
