# grade10-admin/auction/listing Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-15, tcs-rules r6

## Walk 1: Relist keeps the shared address through to Publish

**Starting state:**

- admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
- `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>` and `<source_code>`.
- customer A can open `/auction/listings/<shared_slug>` in a second session.

**Shared test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds before Relist |
| `<source_code>` | The listing code of `<unsold_source>` |

### Route

1. Click Relist on `<unsold_source>`'s row and read the Slug field.
   - The editor shows `<shared_slug>` filled in. `g10adm.auction-listing.US9-TC11`
2. Save the Relist draft without changing the slug.
   - The new draft holds `<shared_slug>` and a listing code other than `<source_code>`. `g10adm.auction-listing.US9-TC12`
   - Both listings' activity name the transfer of `<shared_slug>` and the other listing. `g10adm.auction-listing.US9-TC12`
3. As customer A, open `/auction/listings/<shared_slug>` while the successor is still a draft.
   - The address is not found. `g10adm.auction-listing.US4-TC21`
4. Create the successor if needed, then Publish now, and open `/auction/listings/<shared_slug>` again.
   - The page opens the published successor, not `<unsold_source>`. `g10adm.auction-listing.US4-TC22`

## g10adm.auction-listing.US4: Operator puts a listing in front of collectors

**As an** auction operator,
**I want** to publish a listing now or at a time I set in advance,
**so that** a lot opens at the hour the sale was announced for and reads at its own public address from then on.

<!-- trace:case id=g10adm.auction-listing.TC-rlf rev=1 covers=g10adm.auction-listing.SC-359 -->
### g10adm.auction-listing.US4-TC21: Shared address is not found between Relist Save and Publish

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>`.
* A Relist Save from `<unsold_source>` has stored `<successor>` with `<shared_slug>`.
* customer A is on `<g10 site url>` in a second session.

**Test data:**

| `<successor>` state after Relist Save |
| --- |
| Draft, unpublished |
| Created, unpublished |

**Steps:**

1. Bring `<successor>` to the row's state after Relist Save, keeping `<shared_slug>`.
2. As customer A, open `/auction/listings/<shared_slug>`.
3. Read the response and page.
4. Open `<unsold_source>` in admin and confirm it no longer holds `<shared_slug>`.

**Expected Results:**

* Step 2 is not found.
* Step 3 shows Page not found with no Unsold-lot data from `<unsold_source>` and no successor catalogue card.
* Step 4 shows `<unsold_source>` without `<shared_slug>`.

---

<!-- trace:case id=g10adm.auction-listing.TC-rlx rev=1 covers=g10adm.auction-listing.SC-fde -->
### g10adm.auction-listing.US4-TC22: Shared address opens the Relist successor after Publish

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-04

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>` and `<source_code>` before Relist.
* customer A is on `<g10 site url>` in a second session.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds before Relist |
| `<source_code>` | The listing code of `<unsold_source>` |

**Steps:**

1. Click Relist on `<unsold_source>`'s row.
2. Save the Relist draft with `<shared_slug>` unchanged.
3. Create the successor if Create still needs a step, then Publish now.
4. As customer A, open `/auction/listings/<shared_slug>`.
5. Read the lot page's identity against the successor's listing code.
6. Confirm `<unsold_source>` still shows `<source_code>` and no longer answers at `<shared_slug>`.

**Expected Results:**

* Step 4 opens the published successor.
* Step 5 shows the successor's listing code, not `<source_code>`.
* Step 6 leaves `<unsold_source>` closed Unsold under `<source_code>` with no public answer at `<shared_slug>`.
* No second address or redirect is required to reach the successor.

## g10adm.auction-listing.US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing that keeps the lot's public address,
**so that** a card nobody bought goes back on sale without me hunting for its stock, and a shared link still opens the live lot.

<!-- trace:case id=g10adm.auction-listing.TC-rls rev=1 -->
### g10adm.auction-listing.US9-TC11: Relist editor prefills the source slug

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds |

**Steps:**

1. Click Relist on `<unsold_source>`'s row.
2. Read the Slug field on the new draft before Save.
3. Leave the editor without saving.
4. Confirm `<unsold_source>` still holds `<shared_slug>`.

**Expected Results:**

* Step 2 shows `<shared_slug>` filled in.
* Step 2 does not show a new title-and-code slug built from a fresh listing code.
* Step 4 leaves `<unsold_source>` unchanged; nothing was stored.

---

<!-- trace:case id=g10adm.auction-listing.TC-rlt rev=1 covers=g10adm.auction-listing.SC-ace,g10adm.auction-listing.SC-eaf,g10adm.auction-listing.SC-c83 -->
### g10adm.auction-listing.US9-TC12: Relist Save transfers the source slug, keeps a distinct listing code, and records activity on both

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>`, `<source_code>` and English title `<source_title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds before Relist |
| `<source_code>` | The listing code of `<unsold_source>` |
| `<source_title>` | The English title of `<unsold_source>` |

**Steps:**

1. Click Relist on `<unsold_source>`'s row.
2. Confirm Slug shows `<shared_slug>`.
3. Click Save.
4. Read the new draft's slug, listing code and English title.
5. Open `<unsold_source>` and read its slug and listing code.
6. Read activity on `<unsold_source>`.
7. Read activity on the new draft.

**Expected Results:**

* Step 3 saves the Relist draft.
* Step 4 shows slug `<shared_slug>`, a listing code other than `<source_code>`, and English title `<source_title>` (not a title-and-new-code slug).
* Step 5 shows `<source_code>` still, with no slug held.
* Step 6 holds an activity entry that names `<shared_slug>` and the new draft by its listing code and English title.
* Step 7 holds an activity entry that names `<shared_slug>` and `<unsold_source>` by `<source_code>` and `<source_title>`.

## Ungrouped

### g10adm.auction-listing.US9: Operator lists an unsold lot again

<!-- trace:case id=g10adm.auction-listing.TC-rlc rev=1 covers=g10adm.auction-listing.SC-d22 -->
#### g10adm.auction-listing.US9-TC13: Relist Save stores a replaced slug and frees the source address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>` and `<source_code>`.
* `<replacement_slug>` is a valid unused slug different from `<shared_slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds before Relist |
| `<source_code>` | The listing code of `<unsold_source>` |
| `<replacement_slug>` | A valid unused slug different from `<shared_slug>` |

**Steps:**

1. Click Relist on `<unsold_source>`'s row.
2. Replace the Slug field with `<replacement_slug>`.
3. Click Save.
4. Read the new draft's slug and listing code.
5. Open `<unsold_source>` and read its slug.
6. Open a separate editable draft and enter `<shared_slug>` in Slug, then leave the field.

**Expected Results:**

* Step 3 saves the Relist draft.
* Step 4 shows `<replacement_slug>` and a listing code other than `<source_code>`.
* Step 5 shows `<unsold_source>` holding no slug.
* Step 6 reports no unavailable-slug error for `<shared_slug>`.

---

<!-- trace:case id=g10adm.auction-listing.TC-u8m rev=1 covers=g10adm.auction-listing.SC-ib3 -->
#### g10adm.auction-listing.US9-TC14: Clearing the Relist slug stores a generated address and frees the source

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>`, `<source_code>` and English title `<source_title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds before Relist |
| `<source_code>` | The listing code of `<unsold_source>` |
| `<source_title>` | The English title of `<unsold_source>` |

**Steps:**

1. Click Relist on `<unsold_source>`'s row.
2. Confirm Slug shows `<shared_slug>`.
3. Clear the Slug field.
4. Click Save.
5. Read the new draft's slug and listing code.
6. Open `<unsold_source>` and read its slug.
7. Open a separate editable draft and enter `<shared_slug>` in Slug, then leave the field.

**Expected Results:**

* Step 4 saves the Relist draft.
* Step 5 shows a title-and-code slug built from `<source_title>` and the new draft's listing code, not `<shared_slug>`.
* Step 5 shows a listing code other than `<source_code>`.
* Step 6 shows `<unsold_source>` holding no slug.
* Step 7 reports no unavailable-slug error for `<shared_slug>`.

<!-- trace:case id=g10adm.auction-listing.TC-rlb rev=1 covers=g10adm.auction-listing.SC-rlb -->
#### g10adm.auction-listing.US9-TC15: Relisted badge on the Unsold source after Relist Save

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, and Relist Save has already stored a successor draft from it.
* `<other_unsold>` closed Unsold, never Relisted.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing whose Relist was saved |
| `<other_unsold>` | An Unsold listing that has never been Relisted |

**Steps:**

1. Open `<unsold_source>`'s listing detail page.
2. Return to the Listings table and find `<unsold_source>`'s row.
3. Find `<other_unsold>`'s row.

**Expected Results:**

* Step 1 shows Relisted beside Unsold in the detail header.
* Step 2 shows Relisted beside Unsold in the Status column.
* Step 3 shows Unsold without Relisted.

### g10adm.auction-listing.US73: Operator keeps a usable listing address while drafting

**As an** auction operator,
**I want** a saved draft to suggest a listing slug from its title and stable code,
**so that** I can start with a distinct public address and learn before Save when a chosen address is already reserved.

<!-- trace:case id=g10adm.auction-listing.TC-rlv rev=1 covers=g10adm.auction-listing.SC-c90 -->
#### g10adm.auction-listing.US73-TC8: Leaving Slug on a Relist draft treats the Unsold source address as available

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it still holds `<shared_slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted, still holding `<shared_slug>` |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds |

**Steps:**

1. Click Relist on `<unsold_source>`'s row.
2. Confirm Slug shows `<shared_slug>`.
3. Leave the Slug field.
4. Read the field-exit availability result.
5. Confirm `<unsold_source>` still holds `<shared_slug>` because Save has not run.

**Expected Results:**

* Step 4 reports `<shared_slug>` available to this Relist draft.
* Step 4 does not name a collision with `<unsold_source>`.
* Step 5 leaves `<unsold_source>` holding `<shared_slug>` until Save.

---

<!-- trace:case id=g10adm.auction-listing.TC-rl9 rev=1 -->
#### g10adm.auction-listing.US73-TC9: Leaving Slug still reports a collision for another retained Unsold address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<unsold_source>` closed Unsold in no campaign, its stock is released, it has never been relisted, and it holds `<shared_slug>`.
* `<other_unsold>` is a different Unsold listing that still holds `<other_slug>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing outside a campaign, stock released, never relisted |
| `<shared_slug>` | The canonical slug `<unsold_source>` holds |
| `<other_unsold>` | A different Unsold listing that still holds its slug |
| `<other_slug>` | The canonical slug `<other_unsold>` holds |

**Steps:**

1. Click Relist on `<unsold_source>`'s row.
2. Replace the Slug field with `<other_slug>`.
3. Leave the Slug field.
4. Read the field-exit availability result.
5. Click Save.

**Expected Results:**

* Step 4 names a collision for `<other_slug>`.
* Step 5 is refused while `<other_slug>` remains held by `<other_unsold>`.
* The Relist exception applies only to `<unsold_source>`'s current slug, not to `<other_unsold>`.

<!-- trace:case id=g10adm.auction-listing.TC-rlw rev=1 covers=g10adm.auction-listing.SC-8b7 -->
#### g10adm.auction-listing.US73-TC10: After Relist Save a second draft cannot take the transferred slug while the Relist draft still holds it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-73

**Pre-conditions:**

* admin(holds auction:operate) is on `<grade10 auction admin listings url>`.
* `<relist_draft>` was saved from Relist on `<unsold_source>` and still holds `<shared_slug>`.
* `<unsold_source>` no longer holds `<shared_slug>`.
* `<other_draft>` is an unrelated draft with no slug yet.

**Test data:**

| Field | Value |
| --- | --- |
| `<unsold_source>` | An Unsold listing that Relist Save already freed of `<shared_slug>` |
| `<relist_draft>` | The Relist draft that still holds `<shared_slug>` |
| `<other_draft>` | An unrelated draft with no slug yet |
| `<shared_slug>` | `umbreon-v-alt` |
| `<other_slug>` | A different available slug for `<relist_draft>` |

**Steps:**

1. On `<other_draft>`, set Slug to `<shared_slug>` and Save.
2. Confirm Save is refused because `<relist_draft>` holds `<shared_slug>`, and `<unsold_source>` still does not hold it.
3. On `<relist_draft>`, replace Slug with `<other_slug>` and Save.
4. On `<other_draft>`, set Slug to `<shared_slug>` and Save.
5. Confirm Save is accepted and `<unsold_source>` still does not hold `<shared_slug>`.

**Expected Results:**

* Step 1–2 refuse `<other_draft>` while `<relist_draft>` holds `<shared_slug>`.
* Step 3 stores `<other_slug>` on `<relist_draft>`.
* Step 4–5 accept `<shared_slug>` on `<other_draft>`; `<unsold_source>` never reserves it again.

---

## Settled

- Transfer activity names the other listing by listing code and English title when present, else the listing id, and always the slug that moved (Q10)
- Clearing the prefilled Relist slug before Save stores the ordinary title-and-code generated slug and still frees the source's former slug (Q11)
- After Relist Save, the Unsold source shows Relisted beside Unsold on its detail header and Listings Status column (Q12)

## Reconciliation

**Run:** QA2, 2026-10-15, in a fresh context for `transfer-relist-listing-slug`. Read this suite's draft cases, the delta `spec.md` (Purpose, Feature set, MODIFIED Relist / slug / generated-slug requirements and scenarios), `user-journeys.md`, `proposal.md`, `decisions.md` with Q1–Q11 and `## Raised`, `tech-design.md` and `tasks.md`. Denied regenerating cases from scenarios. Patched only for landed Q10/Q11: SC-213 and US9-TC12 activity naming; requirement Save empty-slug clause; added SC-217 and draft US9-TC14. Case dispositions were recorded before `covers` links. Every case stays `draft`. It is a statement, not proof.

### Case dispositions

| Case | Journey | Disposition |
| --- | --- | --- |
| `g10adm.auction-listing.US4-TC21` | US-04 | **Folded** — covers `grade10-admin-auction-listing-SC-211` (`g10adm.auction-listing.SC-359`). Draft and Created rows share one checking |
| `g10adm.auction-listing.US4-TC22` | US-04 | **Folded** — covers `grade10-admin-auction-listing-SC-212` (`g10adm.auction-listing.SC-fde`) |
| `g10adm.auction-listing.US9-TC11` | US-09 | **Folded in part** — walks Relist slug prefill and leave-without-Save (Q4). Does not assert every THEN of `grade10-admin-auction-listing-SC-135` or `grade10-admin-auction-listing-SC-136`; those stay with the durable Relist suite. No `covers` |
| `g10adm.auction-listing.US9-TC12` | US-09 | **Folded** — covers `grade10-admin-auction-listing-SC-209`, `grade10-admin-auction-listing-SC-213` and `grade10-admin-auction-listing-SC-216` (`SC-ace`, `SC-eaf`, `SC-c83`) on one Relist Save that keeps the prefilled slug. Activity results aligned to Q10 |
| `g10adm.auction-listing.US9-TC13` | US-09 | **Folded** — covers `grade10-admin-auction-listing-SC-210` (`SC-d22`). Replace-and-free path also exercises the free branch of SC-214; held-collision coverage is US73-TC10 |
| `g10adm.auction-listing.US9-TC14` | US-09 | **Folded** — added for Q11; covers `grade10-admin-auction-listing-SC-217` (`SC-ib3`) |
| `g10adm.auction-listing.US73-TC8` | US-73 | **Folded** — covers `grade10-admin-auction-listing-SC-215` (`SC-c90`) |
| `g10adm.auction-listing.US73-TC9` | US-73 | **Cases with no scenario** — Relist field-exit and Save still collide with another Unsold holder (Q7). Related to durable `grade10-admin-auction-listing-SC-122` on a Relist editor; no change scenario states that path. Keep as a guard or fold a Relist-scoped scenario |

### covers links added

| Case marker | covers |
| --- | --- |
| `g10adm.auction-listing.TC-rlf` | `g10adm.auction-listing.SC-359` |
| `g10adm.auction-listing.TC-rlx` | `g10adm.auction-listing.SC-fde` |
| `g10adm.auction-listing.TC-rlt` | `g10adm.auction-listing.SC-ace`, `g10adm.auction-listing.SC-eaf`, `g10adm.auction-listing.SC-c83` |
| `g10adm.auction-listing.TC-rlc` | `g10adm.auction-listing.SC-d22` |
| `g10adm.auction-listing.TC-u8m` | `g10adm.auction-listing.SC-ib3` |
| `g10adm.auction-listing.TC-rlv` | `g10adm.auction-listing.SC-c90` |

### Uncovered / over-claimed / contradictions

- **Uncovered (change scenarios)** — none after US73-TC10 covers `grade10-admin-auction-listing-SC-214` (`SC-8b7`)
- **Partly asserted, not linked** — `grade10-admin-auction-listing-SC-135` and `grade10-admin-auction-listing-SC-136` by US9-TC11 (slug prefill and leave-without-Save only)
- **Carried** — `grade10-admin-auction-listing-SC-135` to `grade10-admin-auction-listing-SC-145`, `grade10-admin-auction-listing-SC-196`, and baseline slug scenarios `grade10-admin-auction-listing-SC-16` to `grade10-admin-auction-listing-SC-23`, `g10adm.auction-listing.SC155`, `g10adm.auction-listing.SC156`, `grade10-admin-auction-listing-SC-118` to `grade10-admin-auction-listing-SC-123`: unchanged carried scenarios; the durable suite holds their cases beside this change's Relist-address cases
- **Over-claimed** — none. US4-TC21 / US4-TC22 add admin identity checks beyond the public THEN; they do not contradict the scenarios
- **Contradictions** — none between a case and a scenario after the Q10/Q11 patches. Tech-design already had empty form slug → generate and activity naming the slug; Q10/Q11 only sharpened the activity label and the cleared-slug path
- **Raised** — nothing new; Q10 and Q11 were already landed. Duplicate Raised rows for those questions were removed

### Anchor coverage

- Journeys `grade10-admin-auction-listing-US-04`, `grade10-admin-auction-listing-US-09` and `grade10-admin-auction-listing-US-73` each hold draft cases
- Feature-set leaves Relist public address, Slug as public key and Generated slug / field exit are walked through those journeys; no case traces a feature-set group alone
