# grade10-site/site/page-shell Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-14, tcs-rules r5

## grade10-site-site-page-shell-US2: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
with only the account entry and the cart count updating once it does,
**so that** I can start navigating immediately without chrome appearing or
disappearing under me.

<!-- trace:case id=g10.site-page-shell.TC-ev5 rev=4 covers=g10.site-page-shell.SC-yxt -->
### grade10-site-site-page-shell-US2-TC2-4: The session's arrival changes only the account entry and the cart count

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-02

**Pre-conditions:**

* customer's session is <session>, and the session read is held before it answers.
* The site answers Store, so the header offers Cart.
* The viewport is <viewport>.

**Test data:**

| `<viewport>` | `<session>` | `<cart count badge>` | `<controls left of the entry>` |
| --- | --- | --- | --- |
| 1280 CSS pixels wide | Signed in, 2 active lines | 2, once the cart review completes | Keep their places |
| 1280 CSS pixels wide | Signed in, no active lines | none | Keep their places |
| 1280 CSS pixels wide | Signed out, 1 active line in this browser's cart | 1, once the cart review completes | The language control, and search where the build answers it, move left by Sign In's width less 40 CSS pixels; every other control keeps its place |
| 375 CSS pixels wide | Signed out, 1 active line in this browser's cart | 1, once the cart review completes | Keep their places |

**Steps:**

1. Navigate to <grade10 site url>.
2. Record the position of every header control, the placeholder in the account entry's place included.
3. Release the held session read.
4. Wait for the cart review to complete, then record the position of every header control again.

**Expected Results:**

* Step 3: the account entry matches <session> - the account icon signed in, Sign In signed out - in the placeholder's place.
* Between steps 2 and 4, no chrome control appears or disappears other than the count badge.
* The Cart control keeps its place and shows <cart count badge>.
* <controls left of the entry>.

---

## grade10-site-site-page-shell-US9: Collector is not offered Sign In before their session answers

**As a** collector,
**I want** the header to hold the account entry's place until my session has
answered,
**so that** I am never offered Sign In while I am already signed in.

<!-- trace:case id=g10.site-page-shell.TC-lir rev=1 covers=g10.site-page-shell.SC-3s6 -->
### grade10-site-site-page-shell-US9-TC1-1: The account entry's place holds a placeholder until the session answers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer's session is <session>, and the session read is held before it answers.
* The site answers Store, so the header offers Cart.
* The viewport is <viewport>.

**Test data:**

| `<viewport>` | `<session>` |
| --- | --- |
| 1280 CSS pixels wide | Signed in |
| 375 CSS pixels wide | Signed in |
| 1280 CSS pixels wide | Signed out, with no session in this browser |

**Steps:**

1. Navigate to <grade10 site url>.
2. Look at the header while the session read is held.

**Expected Results:**

* A round placeholder 40 CSS pixels across sits in the account entry's place.
* At 375 CSS pixels wide, the placeholder sits in the bar beside Cart.
* Neither Sign In nor the account icon shows.

<!-- trace:case id=g10.site-page-shell.TC-nms rev=1 covers=g10.site-page-shell.SC-gua -->
### grade10-site-site-page-shell-US9-TC2-1: The placeholder offers nothing to press

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read is held before it answers.
* The site answers Store, so the header offers Cart.
* The viewport is 1280 CSS pixels wide.

**Steps:**

1. Navigate to <grade10 site url>.
2. Click the placeholder in the account entry's place.
3. Put keyboard focus on the first control in the header, then press Tab until focus reaches Cart.

**Expected Results:**

* Step 2: nothing opens - no sign-in and no account menu - and the page stays as it was.
* Step 3: focus never rests on the placeholder.

<!-- trace:case id=g10.site-page-shell.TC-an4 rev=1 covers=g10.site-page-shell.SC-0lr -->
### grade10-site-site-page-shell-US9-TC3-1: The placeholder is not read aloud

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read is held before it answers.
* A screen reader is running.

**Steps:**

1. Navigate to <grade10 site url>.
2. Move through the header with the screen reader's reading keys, from its first control to its last.
3. Inspect the header in the browser's accessibility tree.

**Expected Results:**

* Step 2: the screen reader reads nothing for the placeholder - no label, and no busy or loading status.
* Step 3: the placeholder has no accessible name and no status role, and nothing in the header is marked busy.

<!-- trace:case id=g10.site-page-shell.TC-din rev=1 covers=g10.site-page-shell.SC-31a -->
### grade10-site-site-page-shell-US9-TC4-1: The first answer puts the account entry in the placeholder's place

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer's session is <session>.
* The session read is held for 10 seconds, a slow read that still answers, then answers.

**Test data:**

| `<session>` | `<entry>` | `<never shown>` |
| --- | --- | --- |
| Signed in | The account icon | Sign In |
| Signed out, with no session in this browser | Sign In | The account icon |

**Steps:**

1. Navigate to <grade10 site url>.
2. Watch the account entry until the session read answers, and for 5 seconds after.

**Expected Results:**

* Until the read answers, the placeholder shows.
* When the read answers, <entry> shows in the placeholder's place at once.
* <never shown> never shows.

<!-- trace:case id=g10.site-page-shell.TC-fo4 rev=1 -->
### grade10-site-site-page-shell-US9-TC5-1: A signed-in collector's first paints never show Sign In

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) on a browser whose session is read as usual, with nothing held.
* The browser's developer tools record the page load frame by frame, with screenshots.

**Test data:**

| `<address>` |
| --- |
| <grade10 site url>, opened in a new tab |
| <written page address>, an address the site serves as a page written before any session is read |

**Steps:**

1. Start the recording, then open <address>.
2. Stop the recording once the account icon shows.
3. Step through the recorded frames from the first paint.

**Expected Results:**

* No frame shows Sign In in the header.
* Every frame from the first paint shows the placeholder or the account icon in the account entry's place.
* Once the account icon shows, it stays.

<!-- trace:case id=g10.site-page-shell.TC-79s rev=1 covers=g10.site-page-shell.SC-tah -->
### grade10-site-site-page-shell-US9-TC6-1: A written page holds the placeholder before the app takes over

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* JavaScript is turned off in the browser, so the page shows only what the site wrote.

**Test data:**

| Field | Value |
| --- | --- |
| `<written page address>` | An address the site serves as a page written before any session is read |

**Steps:**

1. Navigate to <written page address>.
2. Look at the header's account entry.

**Expected Results:**

* The placeholder shows in the account entry's place.
* Neither Sign In nor the account icon shows.

<!-- trace:case id=g10.site-page-shell.TC-0r0 rev=1 covers=g10.site-page-shell.SC-qnl -->
### grade10-site-site-page-shell-US9-TC7-1: A failed session read shows Sign In

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read fails with <failure>.

**Test data:**

| `<failure>` |
| --- |
| A 500 server error |
| A dropped connection, with no response |

**Steps:**

1. Navigate to <grade10 site url>.
2. Look at the account entry once the session read has failed.
3. Click Sign In.

**Expected Results:**

* Step 2: Sign In shows in the placeholder's place.
* Step 3: sign-in opens.

<!-- trace:case id=g10.site-page-shell.TC-89t rev=1 covers=g10.site-page-shell.SC-uqh -->
### grade10-site-site-page-shell-US9-TC8-1: A slow session read keeps the placeholder until it answers

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer(signed in) is on a browser whose session read is held until step 4 releases it.

**Test data:**

| Field | Value |
| --- | --- |
| `<wait>` | 60 seconds |

**Steps:**

1. Navigate to <grade10 site url>.
2. Watch the account entry for <wait>.
3. Click Auction in the primary navigation.
4. Release the held session read.

**Expected Results:**

* Step 2: the placeholder stays for the whole <wait>, and Sign In never shows.
* Step 3: the Auction surface opens, with the placeholder still in the account entry's place.
* Step 4: the account icon takes the placeholder's place, and Sign In never shows.

<!-- trace:case id=g10.site-page-shell.TC-zmu rev=1 covers=g10.site-page-shell.SC-gmi -->
### grade10-site-site-page-shell-US9-TC9-1: A later session read keeps the entry already shown

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer's session is <session>, and <grade10 site url> shows <entry> after its first answer.
* The site's next session read will be held before it answers.

**Test data:**

| `<session>` | `<entry>` | `<re-read>` |
| --- | --- | --- |
| Signed out | Sign In | Switch to another browser tab, then back |
| Signed in | The account icon | Switch to another browser tab, then back |
| Signed in | The account icon | Click Auction in the primary navigation |

**Steps:**

1. <re-read>.
2. Watch the account entry while the session read is held.
3. Release the held session read.

**Expected Results:**

* Step 2: <entry> stays in place, and the placeholder does not show.
* Step 3: <entry> still shows.

<!-- trace:case id=g10.site-page-shell.TC-v1f rev=1 covers=g10.site-page-shell.SC-nuz -->
### grade10-site-site-page-shell-US9-TC10-1: Signing in or out after the first answer does not bring the placeholder back

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer is <before> on <grade10 site url>, and the header shows the entry from the page's first answer.

**Test data:**

| `<before>` | `<action>` | `<after>` |
| --- | --- | --- |
| Signed in | Click the account icon, then Sign Out in the account menu | Sign In |
| Signed out | Click Sign In and complete sign-in | The account icon |

**Steps:**

1. <action>.
2. Watch the account entry until it shows <after>.

**Expected Results:**

* The account entry shows <after>.
* No page that has already shown Sign In or the account icon shows the placeholder again.

<!-- trace:case id=g10.site-page-shell.TC-an5 rev=1 covers=g10.site-page-shell.SC-ra1 -->
### grade10-site-site-page-shell-US9-TC11-1: A later session read that fails keeps the entry already shown

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-09

**Pre-conditions:**

* customer is signed in, and <grade10 site url> shows the account icon after the session's first answer.
* The site's next session read will answer with <answer>.

**Test data:**

| `<answer>` | `<entry>` |
| --- | --- |
| A server error (500) | The account icon |
| A dropped connection | The account icon |
| No session, as after signing out in another browser | Sign In |

**Steps:**

1. Switch to another browser tab, then back.
2. Watch the account entry until the session read has answered.

**Expected Results:**

* Step 2: <entry> shows, and the placeholder does not show at any point.

## Settled

* Cart is absent until the site answers the Store cart drawer, then appears on
  every surface it answers, including Auction; visibility does not depend on
  session state.
* The author chose to retain the last verified same-member count while a refresh is pending, including after failed cart updates; failed review hides the badge. Initial unknown counts and previous-member counts remain hidden.
* A later session read that fails keeps the account entry already shown; a
  later read that returns no session shows Sign In.
* What Cart opens before the session first answers is the cart's own rule; the
  account placeholder holds only the account entry.
* When the session arrives, only the language and search controls on the wide
  header may move, and only by the account entry's change in width; the
  centred primary navigation, Cart and the compact bar stay where they are.

## Reconciliation

- **Run** - QA1 blind pass, 2026-10-14. Read: the method (`spec-to-tcs` skill, `specs-to-test-cases.md` at `tcs_rules_rev` 5, `writing.md`); the change's `proposal.md`, `decisions.md` (goals, non-goals, Q1-Q7, empty `## Raised`) and `ui-design.md`; page-shell's durable `## Purpose` and `## Feature set`, the change's feature-set outline, the durable and change `user-journeys.md`; the existing `feature-tcs.md` with its `## Reconciliation` stripped; the Page Shell and Site Header and Footer PRDs; the `openspec/config.yaml` context. Denied: every `## Requirements` section, scenario text, `tech-design.md`, `tasks.md`, `openspec/specs/` beyond the supplied sections, and `openspec/changes/archive/`. Not supplied: `tcs-conventions.md` and the `grade10-site/site` domain suite.

**Run:** 2026-10-14, QA2. A fresh reader joined QA1's blind cases and Dev's scenarios on `grade10-site-site-page-shell-US-02` and `grade10-site-site-page-shell-US-09`, read against the Session section of the Page Shell PRD, the Account Entry section of the Site Header and Footer PRD, `decisions.md` Q1 to Q10, `ui-design.md`, `tech-design.md` and `tasks.md`. After QA1 the coordinator wrote `grade10-site-site-page-shell-US9-TC11-1` from Q8 and reworded the `Stable layout` feature-set leaf to name the language and search controls (Q10), both non-anchor clarifications. A case links a scenario only where its route, starting state and checks assert every THEN; four do. No domain, product or platform suite traces either journey: `grade10-site/site` holds no `domain-tcs.md`.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-US2-TC2-4` | Revised by QA1 from the durable `US2-TC2-3`. Its wide rows assert every THEN of `grade10-site-site-page-shell-SC-05`, moving only the language and search controls, by Sign In's width less 40 CSS pixels, as Q10 names them. Its 375 CSS pixel row keeps every control in place, which the requirement and Q10 state and no scenario does | Reached: covers `grade10-site-site-page-shell-SC-05`. The 375 row folds into that scenario (Dev) |
| `grade10-site-site-page-shell-US9-TC1-1` | A round placeholder 40 CSS pixels across at both widths, signed in or out, beside Cart at 375, with neither Sign In nor the account icon. It does not walk the inert and silent clause, which TC2-1 and TC3-1 walk. Beside Cart is the requirement's Both widths paragraph, not a scenario's | Reached in part: `grade10-site-site-page-shell-SC-68`. Links once that scenario splits and its THEN names Cart (Dev) |
| `grade10-site-site-page-shell-US9-TC2-1` | A click and a Tab pass on the wide header: nothing opens, and focus never rests on the placeholder | Reached in part: the inert clause of `grade10-site-site-page-shell-SC-68`. Links to the scenario that clause becomes (Dev) |
| `grade10-site-site-page-shell-US9-TC3-1` | A screen reader reads nothing for the placeholder, and the accessibility tree gives it no name or status role, with nothing busy | Reached in part: the silent clause of `grade10-site-site-page-shell-SC-68`. Links to the scenario that clause becomes (Dev) |
| `grade10-site-site-page-shell-US9-TC4-1` | Signed in, a read held 10 seconds: the placeholder until the answer, then the account icon in its place, and Sign In never. Signed out, Sign In in its place at once, the THEN of `grade10-site-site-page-shell-SC-05`. No check of the other controls | Reached in part: `grade10-site-site-page-shell-SC-70` all but its last AND. Links once that AND goes (Dev) |
| `grade10-site-site-page-shell-US9-TC5-1` | Frames recorded from the first paint, signed in: no Sign In, only the placeholder or the account icon, and the icon stays. Its written-page row is the scripts taking the written page over | Reached in part: `grade10-site-site-page-shell-SC-70` all but its last AND, and the last AND of `grade10-site-site-page-shell-SC-69`. Links once both edits land (Dev) |
| `grade10-site-site-page-shell-US9-TC6-1` | With JavaScript off, the written page shows the placeholder and neither Sign In nor the account icon. It cannot reach the scripts taking the page over | Reached in part: `grade10-site-site-page-shell-SC-69` all but its last AND. Links once that AND is its own scenario (Dev) |
| `grade10-site-site-page-shell-US9-TC7-1` | A 500 and a dropped connection on the first read each show Sign In in the placeholder's place, and Sign In opens sign-in | Reached: covers `grade10-site-site-page-shell-SC-71` |
| `grade10-site-site-page-shell-US9-TC8-1` | A read held 60 seconds keeps the placeholder with no Sign In, but the read is never released, so the account icon arriving after it is not asserted. Step 3 opens Auction with the placeholder still in place, which the requirement's Placeholder row implies and no scenario states | Reached in part: `grade10-site-site-page-shell-SC-73`. Links once the case releases the read (QA1) and the scenario states the move to another surface (Dev) |
| `grade10-site-site-page-shell-US9-TC9-1` | Back to the tab signed out and signed in, and on to Auction signed in: the entry stays while the read is held, the placeholder never shows, and the same session leaves the entry as it was. A move between surfaces may start no read; the results hold either way | Reached: covers `grade10-site-site-page-shell-SC-72` |
| `grade10-site-site-page-shell-US9-TC10-1` | Signing out from the account menu, and signing in through Sign In, after the first answer: the entry changes and the placeholder never returns. `grade10-site-site-page-shell-SC-72` keeps the placeholder away on a read, not on signing in or out, and the case does not walk its read under way | Behaviour no scenario states, and real (Q3, the requirement's Once paragraph): folds as a new scenario (Dev) |
| `grade10-site-site-page-shell-US9-TC11-1` | Written by the coordinator after QA1 from Q8, not by the blind pass. A later 500 or dropped read keeps the account icon with no placeholder; a later read with no session shows Sign In | Reached: covers `grade10-site-site-page-shell-SC-74` |
| `grade10-site-site-page-shell-SC-04` | Unchanged; no case in this suite asserts it | Durable `grade10-site-site-page-shell-US2-TC1-1` holds it |
| `grade10-site-site-page-shell-SC-05` | `grade10-site-site-page-shell-US2-TC2-4` asserts every THEN | Reached |
| `grade10-site-site-page-shell-SC-68` | The placeholder, its inertness and its silence are three cases, US9-TC1-1, US9-TC2-1 and US9-TC3-1; none asserts all three | Uncovered as one scenario: Dev splits it |
| `grade10-site-site-page-shell-SC-69` | US9-TC6-1 asserts the written page and US9-TC5-1 the scripts taking it over; neither asserts both | Uncovered as one scenario: Dev splits its last AND |
| `grade10-site-site-page-shell-SC-70` | US9-TC4-1 and US9-TC5-1 assert the account icon with no Sign In; only US2-TC2-4 checks that nothing else moves, and not from the first paint | Uncovered as one scenario: Dev drops its last AND, which `grade10-site-site-page-shell-SC-05` states for the account icon |
| `grade10-site-site-page-shell-SC-71` | `grade10-site-site-page-shell-US9-TC7-1` asserts every THEN | Reached |
| `grade10-site-site-page-shell-SC-72` | `grade10-site-site-page-shell-US9-TC9-1` asserts every THEN | Reached |
| `grade10-site-site-page-shell-SC-73` | US9-TC8-1 asserts the minute; no case asserts the answer after it | Uncovered: US9-TC8-1 releases the read (QA1) |
| `grade10-site-site-page-shell-SC-74` | `grade10-site-site-page-shell-US9-TC11-1` asserts every THEN | Reached |
| `Stable layout` feature-set leaf | Reworded by the coordinator after QA1 to name the language and search controls (Q10); no journey moved | No case reads a feature-set line; none moves |
| Raised: a later read that fails | Landed as Q8 | `grade10-site-site-page-shell-US9-TC11-1` walks it; settled above |
| Raised: Cart before the first answer | Landed as Q9: not this change's | No case asserts what Cart opens before the first answer; settled above |
| Raised: which controls move | Landed as Q10 | The feature-set leaf names them and `grade10-site-site-page-shell-SC-05` does not yet (contradicted readings); settled above |
| Uncovered anchors | `grade10-site-site-page-shell-US-02` has US2-TC2-4; `grade10-site-site-page-shell-US-09` has eleven cases | None |
| Over-claimed cases | No marker this run wrote names a scenario its case does not assert whole. The durable `grade10-site-site-page-shell-US2-TC1-1` marker still names `grade10-site-site-page-shell-SC-05`, which it does not assert | Legacy marker, valid; narrowing it means carrying the case here |
| Contradicted readings | `grade10-site-site-page-shell-SC-05` moves "the controls to the account entry's left", the reading Q10 refused, while US2-TC2-4 keeps the primary navigation in place. The requirement's state table shows the account icon only after a signed-in latest read, while its Once paragraph, `grade10-site-site-page-shell-SC-74` and US9-TC11-1 keep it after a later failed read | Settled by Q10 and Q8: Dev rewords both; no Raised row |

**Run:** 2026-10-14, QA2 second reading, narrow. It read the repair to the first reading and what it touches: `grade10-site-site-page-shell-SC-68` naming Cart, with `grade10-site-site-page-shell-SC-75` and `grade10-site-site-page-shell-SC-76` split out of it; `grade10-site-site-page-shell-SC-77` split out of `grade10-site-site-page-shell-SC-69`; `grade10-site-site-page-shell-SC-70` without its last AND; `grade10-site-site-page-shell-SC-73` gaining the move to another surface; `grade10-site-site-page-shell-SC-78`; `grade10-site-site-page-shell-SC-05` naming the language and search controls; the requirement's state table; US9-TC8-1 releasing the held read; and the tasks and lanes citing the new scenarios. It read grade10's sign-in dialog (`apps/frontend/grade10/src/chrome/SignInOverlay.tsx` and `SignInFlow`) for whether signing in leaves the page. Findings the repair did not touch are carried forward.

| Case or scenario | Reading | Disposition |
| --- | --- | --- |
| `grade10-site-site-page-shell-US9-TC1-1` | Unchanged; the scenario now asks for Cart beside the placeholder in the compact bar, which the case's 375 row asserts | Reached: covers `grade10-site-site-page-shell-SC-68` |
| `grade10-site-site-page-shell-US9-TC2-1` | Unchanged; "the page stays as it was" holds the address the scenario names | Reached: covers `grade10-site-site-page-shell-SC-75` |
| `grade10-site-site-page-shell-US9-TC3-1` | Unchanged: the screen reader reads no label and no busy or loading status for the placeholder | Reached: covers `grade10-site-site-page-shell-SC-76` |
| `grade10-site-site-page-shell-US9-TC4-1` | Unchanged; the scenario dropped the other controls, which US2-TC2-4 walks under `grade10-site-site-page-shell-SC-05` | Reached: covers `grade10-site-site-page-shell-SC-70` |
| `grade10-site-site-page-shell-US9-TC5-1` | Every frame may show "the placeholder or the account icon", so an account icon shown before the session read answers, from a session the browser remembered, passes it. That is the risk `grade10-site-site-page-shell-SC-77` holds, and a non-goal; the placeholder coming before the account icon in `grade10-site-site-page-shell-SC-70` is not asserted either. The first reading's promise of these links was too lenient | Reached in part: `grade10-site-site-page-shell-SC-70` and `grade10-site-site-page-shell-SC-77`. Links once the case asserts the placeholder until the session read's response and the account icon only after it (QA1) |
| `grade10-site-site-page-shell-US9-TC6-1` | Unchanged; the scenario now ends at Sign In not appearing | Reached: covers `grade10-site-site-page-shell-SC-69` |
| `grade10-site-site-page-shell-US9-TC8-1` | Now held until step 4: a minute of placeholder with no Sign In, Auction opening with the placeholder still in place, and the account icon taking its place once the read is released | Reached: covers `grade10-site-site-page-shell-SC-73` |
| `grade10-site-site-page-shell-US9-TC10-1` | Unchanged. It keeps the placeholder away on the page where the collector signs in or out, "no page that has already shown Sign In or the account icon". The magic link lands on a new page, which the reload rule starts at the placeholder; Google signs in without leaving the page. The scenario reads on that page | Reached: covers `grade10-site-site-page-shell-SC-78`. "On that page" in the scenario would say so (Dev, optional) |
| `grade10-site-site-page-shell-US2-TC2-4`, `grade10-site-site-page-shell-US9-TC7-1`, `grade10-site-site-page-shell-US9-TC9-1`, `grade10-site-site-page-shell-US9-TC11-1` | Untouched by the repair; `grade10-site-site-page-shell-SC-05` now names the language and search controls and keeps every other control in place, as US2-TC2-4's rows assert | Reached as recorded above |
| `grade10-site-site-page-shell-SC-77` | Only US9-TC5-1 walks the scripts taking a written page over, and it does not hold the placeholder until the answer | Uncovered: US9-TC5-1's repair (QA1) |
| `grade10-site-site-page-shell-SC-04`, `grade10-site-site-page-shell-SC-05`, `grade10-site-site-page-shell-SC-68` to `grade10-site-site-page-shell-SC-76`, `grade10-site-site-page-shell-SC-78` | Each has a case that asserts every THEN; `grade10-site-site-page-shell-SC-04` stays with the durable `grade10-site-site-page-shell-US2-TC1-1` | Reached |
| The requirement's state table | The Account icon and Sign In rows now read the latest read that did not fail, as Q8 decides. Sign In's "or the first read failed" stays true after a later read finds the collector signed in, when the Account icon row holds as well | Dev: "or every read so far has failed" |
| Uncovered anchors | Unchanged | None |
| Over-claimed cases | Each marker names only scenarios its case asserts whole; the durable US2-TC1-1 legacy marker stands as recorded above | None |
| Contradicted readings | `grade10-site-site-page-shell-SC-05` and the state table now agree with Q10, Q8 and the cases | None |
