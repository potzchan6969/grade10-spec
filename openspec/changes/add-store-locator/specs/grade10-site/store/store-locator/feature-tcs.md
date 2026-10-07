# grade10-site/store/store-locator Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-store-locator-US1: Collector finds the Hong Kong shop from chrome

**As a** collector,
**I want** Store Locator in the header or footer to open the Location & Hours
page for the Hong Kong shop,
**so that** I can read the address and hours without hunting for a dead link.

<!-- trace:case id=g10.store-store-locator.TC-93l rev=1 covers=g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr -->
### grade10-site-store-store-locator-US1-TC1-1: Location & Hours answers whole before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* Scripts are turned off in the browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop name>` | Hong Kong Grade10 Store |
| `<shop address>` | 13 Pak Sha Road, Causeway Bay, Hong Kong |
| `<shop hours>` | 11am – 9pm |

**Steps:**

1. Fetch <grade10 store locator url> with scripts turned off.
2. Open <grade10 store locator url> in the browser.
3. Read the content under the Location & Hours heading.

**Expected Results:**

* Step 1 returns status 200.
* Step 1's response holds the heading, the map, `<shop name>`, `<shop address>` and the hours.
* Step 2 shows the map, `<shop name>`, `<shop address>` and the hours.
* The hours say the shop opens `<shop hours>`, every day.
* The page shows one shop and no other.

<!-- trace:case id=g10.store-store-locator.TC-zh8 rev=1 covers=g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr -->
### grade10-site-store-store-locator-US1-TC2-1: Scripts keep the one shop and add no finder

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* Scripts are turned on in the browser.

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Watch the content under Location & Hours until the page finishes loading.
3. Read every control on the page outside the header and footer.

**Expected Results:**

* Step 2: the map, store name, address and hours never go blank.
* Step 3 finds no search field, store list, distance or filter.
* Step 3 finds no store picker.

<!-- trace:case id=g10.store-store-locator.TC-vei rev=1 covers=g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr -->
### grade10-site-store-store-locator-US1-TC3-1: Title and description differ from the store's other pages

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
* **Testability:** automation
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| `<other surface url>` | Surface |
| --- | --- |
| <grade10 store url> | Store home |
| <grade10 browse listing url> | The listing |
| <grade10 product url> | A card's page |

**Steps:**

1. Fetch <grade10 store locator url> with scripts turned off.
2. Read its title and meta description.
3. Fetch `<other surface url>` with scripts turned off.
4. Read its title and meta description.

**Expected Results:**

* Step 2's title differs from step 4's.
* Step 2's meta description differs from step 4's.

<!-- trace:case id=g10.store-store-locator.TC-2pc rev=1 covers=g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr -->
### grade10-site-store-store-locator-US1-TC4-1: Header Store Locator opens the page and marks it

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
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* The browser viewport is 1280 CSS pixels wide, any width above 896 that
  shows the header's full primary nav rather than its compact menu.

**Steps:**

1. Navigate to <grade10 store url>.
2. Read the header's primary nav.
3. Click Store Locator in the header.
4. Read the header's primary nav.

**Expected Results:**

* Step 2: Store Locator sits directly before Help, which ends the primary nav.
* Step 2: Store Locator is not marked as the current page.
* Step 3 opens Store Locator, the Location & Hours heading showing.
* Step 4: Store Locator is marked as the current page.
* Step 4: no other primary-nav item is marked, Store included.

<!-- trace:case id=g10.store-store-locator.TC-jei rev=1 covers=g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr -->
### grade10-site-store-store-locator-US1-TC5-1: Footer Store Locator leads the Help column

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
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Steps:**

1. Navigate to <grade10 store url>.
2. Scroll to the footer.
3. Read the Help column.
4. Click Store Locator in the Help column.

**Expected Results:**

* Step 3: Store Locator is the column's first link, ahead of Docs.
* Step 4 opens Store Locator, the Location & Hours heading showing.

<!-- trace:case id=g10.store-store-locator.TC-cxo rev=1 covers=g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr -->
### grade10-site-store-store-locator-US1-TC6-1: Page reflows at 375 CSS pixels with no sideways scroll

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* The browser viewport is 375 CSS pixels wide.

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Scroll from the top of the page to the footer.
3. Try to scroll sideways.
4. Open the header's compact menu.

**Expected Results:**

* Step 2: one column, the map above the store name, address and hours.
* Step 2: map, name, address and every hours row show whole, none clipped.
* Step 3 moves nothing; the page has no sideways scroll.
* Step 4's menu lists Store Locator directly before Help.

<!-- trace:case id=g10.store-store-locator.TC-y5d rev=1 covers=g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr -->
### grade10-site-store-store-locator-US1-TC7-1: The page reads in the language its prefix names

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-01

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| `<lang>` | `<language>` |
| --- | --- |
| (none) | English |
| /tc | Traditional Chinese |
| /sc | Simplified Chinese |

**Steps:**

1. Navigate to <grade10 store locator url> under `<lang>`.
2. Read the heading, the store name, the address and the hours.

**Expected Results:**

* URL path is `<lang>/store-locator`.
* The heading reads in `<language>`.
* The store name reads in `<language>`.
* The address reads in `<language>`.
* The hours read in `<language>`, in that language's own format.

---

## grade10-site-store-store-locator-US2: Collector opens Google Maps from the page

**As a** collector,
**I want** activating the map to open Google Maps for the shop,
**so that** I get directions without a second control on the page.

<!-- trace:case id=g10.store-store-locator.TC-ifh rev=1 covers=g10.store-store-locator.SC-gk9,g10.store-store-locator.SC-ca5,g10.store-store-locator.SC-91n,g10.store-store-locator.SC-w6y -->
### grade10-site-store-store-locator-US2-TC1-1: Clicking the map opens the shop on Google Maps in a new tab

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
* **Trace:** grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop address>` | 13 Pak Sha Road, Causeway Bay, Hong Kong |

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Click the map.
3. Switch to the new tab.

**Expected Results:**

* Step 2 opens a new tab; the first tab stays on Store Locator.
* Step 3 shows Google Maps at `<shop address>`.

<!-- trace:case id=g10.store-store-locator.TC-3ij rev=1 covers=g10.store-store-locator.SC-gk9,g10.store-store-locator.SC-ca5,g10.store-store-locator.SC-91n,g10.store-store-locator.SC-w6y -->
### grade10-site-store-store-locator-US2-TC2-1: Only the map, one keyboard stop, leads to Google Maps

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop address>` | 13 Pak Sha Road, Causeway Bay, Hong Kong |

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Press Tab through every stop from the header to the footer.
3. Note each stop's name and where it leads.
4. Move focus back to the map's stop.
5. Press Enter.

**Expected Results:**

* Step 2: the map is one stop; nothing inside the map takes focus.
* Step 3: the map's stop is one named link.
* Step 3: no other stop leads to Google Maps; no Get directions control.
* Step 5 opens Google Maps at `<shop address>` in a new tab.

<!-- trace:case id=g10.store-store-locator.TC-gs0 rev=1 covers=g10.store-store-locator.SC-gk9,g10.store-store-locator.SC-ca5,g10.store-store-locator.SC-91n,g10.store-store-locator.SC-w6y -->
### grade10-site-store-store-locator-US2-TC3-1: The map opens Maps with scripts turned off

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
* **Trace:** grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* Scripts are turned off in the browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop address>` | 13 Pak Sha Road, Causeway Bay, Hong Kong |

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Click the map.
3. Switch to the new tab.

**Expected Results:**

* Step 2 opens a new tab; the first tab stays on Store Locator.
* Step 3 shows Google Maps at `<shop address>`.

<!-- trace:case id=g10.store-store-locator.TC-jof rev=1 covers=g10.store-store-locator.SC-gk9,g10.store-store-locator.SC-ca5,g10.store-store-locator.SC-91n,g10.store-store-locator.SC-w6y -->
### grade10-site-store-store-locator-US2-TC4-1: The map's place opens Maps when Google's map does not load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* The browser blocks requests for the embedded Google map.

**Test data:**

| Field | Value |
| --- | --- |
| `<shop address>` | 13 Pak Sha Road, Causeway Bay, Hong Kong |

**Steps:**

1. Navigate to <grade10 store locator url>.
2. Read the page where the map would show.
3. Click the map's place.
4. Switch to the new tab.

**Expected Results:**

* Step 2: the store name, address and hours still show beside the map's place.
* Step 3 opens a new tab; the first tab stays on Store Locator.
* Step 4 shows Google Maps at `<shop address>`.

## Settled

- The map opens Google Maps before any script runs: its link is in the first response, like the rest of the page.
- When Google's embedded map does not load, the map keeps its place and still opens Google Maps for the shop; how the box looks then is the designer's.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Read: this suite, the change's `domain-tcs.md`, the delta `spec.md` with its scenarios, `tech-design.md`, `ui-design.md`, `decisions.md`, `tasks.md` and the Store Locator, Store Locator Block and Product Details pages. The blind pass recorded no Run line of its own, so what it read is not on record here; its four questions are the blind rows of `decisions.md`'s `## Raised`. A second QA2 run, 2026-10-06 in a fresh context after the accept review's edits, read the same set and the application repository's chrome, footer and product view, and checked each disposition below against the current scenarios. A third QA2 run, 2026-10-06 in a fresh context, read the same set, the application repository's header (`SiteShell.tsx`, `siteContent.ts`) and `grade10-site/site/page-shell`'s Help requirement, and rechecked every disposition. A fourth QA2 run, 2026-10-06 in a fresh context, read the same set, the other open changes' claims on this domain's ids and the application repository's lane gates (`apps/frontend/grade10/src/surfaces.ts`), and rechecked every disposition against the open designer questions. A fifth QA2 run, 2026-10-06 in a fresh context, read the same set, the page's Location & Hours line against `grade10-site-store-store-locator-SC-01`, and the gates' output for the change's ids, and rechecked every disposition.

- **Folded** - `grade10-site-store-store-locator-US1-TC1-1` to `grade10-site-store-store-locator-SC-01`, `grade10-site-store-store-locator-SC-02` and the shop facts; `grade10-site-store-store-locator-US1-TC3-1` to `grade10-site-store-store-locator-SC-03`; `grade10-site-store-store-locator-US1-TC4-1` to `grade10-site-store-store-locator-SC-06` and `grade10-site-store-store-locator-SC-08`, gaining the scenario's Store left unmarked on Store Locator; `grade10-site-store-store-locator-US1-TC5-1` to `grade10-site-store-store-locator-SC-07`; `grade10-site-store-store-locator-US1-TC6-1` to `grade10-site-store-store-locator-SC-09`, its map-above-the-details line from `ui-design.md`'s Narrow state; `grade10-site-store-store-locator-US1-TC7-1` to `grade10-site-store-store-locator-SC-10`, with English and Simplified Chinese as rows beside it; `grade10-site-store-store-locator-US2-TC1-1` to `grade10-site-store-store-locator-SC-04`; `grade10-site-store-store-locator-US2-TC2-1` to `grade10-site-store-store-locator-SC-05` and the block's `shared-ui-store-locator-SC-05`
- **Folded into spec** - `grade10-site-store-store-locator-US1-TC2-1`'s content never going blank once scripts start had no scenario; the requirement now says scripts never hide it again, proved by `grade10-site-store-store-locator-SC-11`. It is the failure the proposal names: the first-paint reveal hides the content until a script runs. Its no-finder results fold to `grade10-site-store-store-locator-SC-02` beside `grade10-site-store-store-locator-US1-TC1-1`
- **Corrected** - the header placement. Help is itself the primary nav's last item (`grade10-site/site/page-shell`; grade10 `apps/frontend/grade10/src/chrome/SiteShell.tsx:141-151`), so "the last primary-nav item, directly before Help" could not hold. The page, the feature-set leaf, the Placement requirement, `grade10-site-store-store-locator-SC-06`, `ui-design.md`, Q6, the proposal and `grade10-site-store-store-locator-US1-TC4-1` now read directly before Help, which ends the primary nav. No behaviour moves, so the case and the scenario keep their revisions
- **Corrected** - the map in the first response. The page and the requirement put the map in the first response with the heading, name, address and hours; `grade10-site-store-store-locator-SC-01` and `grade10-site-store-store-locator-US1-TC1-1`'s response result named everything but the map, and now name it too. Both are unaccepted drafts, so they keep their revisions
- **Raised, answered** - the map before scripts run (Q17): `grade10-site-store-store-locator-SC-12`, reached by the new `grade10-site-store-store-locator-US2-TC3-1`
- **Raised, answered** - the map when Google's embedded map does not load (Q18): `grade10-site-store-store-locator-SC-13`, reached by the new `grade10-site-store-store-locator-US2-TC4-1`, which asserts what happens and not how the box looks
- **Settled for now** - one hours row a day, Monday first (Q16), and the map's box keeping its size and muted background with no message when the embedded map does not load (Q19), both handed to draw-store-locator-page. `grade10-site-store-store-locator-US1-TC1-1` reads the shop's hours every day, as the page's shop fact states them, and no case asserts how the rows or the box are drawn
- **Answered at accept review** - the address (Q9) and the translated address and hours (Q11): `grade10-site-store-store-locator-SC-10` now reads the address and the hours in the collector's language, and `grade10-site-store-store-locator-US1-TC7-1` reads them under each prefix, at `store-locator`. It is an unaccepted draft, so it keeps its revision
- **Covered at domain** - `grade10-site-store-e2e-US8-TC1-1` walks `grade10-site-store-store-locator-SC-10`'s store name reading as the free pick-up claim's, in each language
- **Out of suite** - Store Locator's Open Graph tags, which the Store Locator page promises: `grade10-site-site-crawlable-pages-SC-06` binds every public surface, and grade10's `apps/frontend/grade10/src/surfaces.test.ts` holds it for marketing, store and auction only, so task 2.2 runs that test over every prerendered surface
- **Contradicted** - none: no case and scenario state opposite outcomes
- **Uncovered anchors** - none: both journeys carry cases, and the root groups Location & Hours, Map to Maps, Chrome reach and Narrow width are each reached
- **Cases added after the reconciliation** - `grade10-site-store-store-locator-US2-TC3-1` and `grade10-site-store-store-locator-US2-TC4-1`, written by this run from the folded scenarios, so they are not blind
