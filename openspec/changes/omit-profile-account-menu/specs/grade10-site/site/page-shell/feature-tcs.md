# grade10-site/site/page-shell Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-site-page-shell-US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with its small initial avatar above My
Auctions and Sign Out on auction launch, with Profile first wherever the
account page is carried and My Orders ahead of My Auctions once Store
answers, and no item whose page the site withholds,
**so that** one place in the header takes me where I can go for this launch,
without a second auction-orders link.

<!-- trace:case id=g10.site-page-shell.TC-eek rev=1 covers=g10.site-page-shell.SC-0ao -->
### grade10-site-site-page-shell-US3-TC1-1: A signed-out collector gets Sign In

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer is signed out and on <grade10 site url>.

**Steps:**

1. Read the account entry in the header.
2. Click Sign In.

**Expected Results:**

* Step 1: a primary Sign In button, no account icon.
* Step 2: sign-in opens.

<!-- trace:case id=g10.site-page-shell.TC-bs9 rev=2 covers=none -->
### grade10-site-site-page-shell-US3-TC2-2: A signed-in collector reaches the account menu

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on an answered site surface, and Store answers.

**Steps:**

1. Activate the account control.
2. Inspect the menu.

**Expected Results:**

* The menu offers, in order, Profile, My Orders, My Auctions, and Sign out.
* The menu does not offer KYC.

<!-- trace:case id=g10.site-page-shell.TC-obx rev=2 covers=g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-04a -->
### grade10-site-site-page-shell-US3-TC3-2: Sign Out is offered in the menu and on the account page

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The site is staging, which carries the account page.

**Steps:**

1. Navigate to <grade10 site url><lang>/profile.
2. Read the account page's controls.
3. Click the account control in the header.
4. Read the account menu's items.
5. Click Sign Out in the account menu.

**Expected Results:**

* Step 2: the account page offers Sign Out.
* Step 4: the account menu offers Sign Out.
* Step 5: the header shows Sign In in place of the account control.

<!-- trace:case id=g10.site-page-shell.TC-asx rev=1 covers=g10.site-page-shell.SC-70a -->
### grade10-site-site-page-shell-US3-TC4-1: Activating My Orders opens the collector's orders

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The site is staging, which answers Store.

**Steps:**

1. Click the account control in the header.
2. Click My Orders in the account menu.

**Expected Results:**

* Step 2 opens <grade10 site url><lang>/profile/orders.

<!-- trace:case id=g10.site-page-shell.TC-5jl rev=3 covers=g10.site-page-shell.SC-u71,g10.site-page-shell.SC-79q -->
### grade10-site-site-page-shell-US3-TC5-3: Menu without Store omits My Orders and opens on Profile where the account page is carried

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* The site shell renders for a signed-in collector on a build that carries the account page and withholds Store.

**Steps:**

1. Open the account menu.
2. Read the account menu's items.

**Expected Results:**

* Step 2: the menu lists Profile, My Auctions, then Sign Out, and nothing else.
* Step 2: no My Orders item.

<!-- trace:case id=g10.site-page-shell.TC-1su rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1 -->
### grade10-site-site-page-shell-US3-TC6-1: Auction-launch account menu shows email, avatar, and reduced items

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in as <collector email>) is on <grade10 site url>.
* The site is <lane>, which carries neither Store, the account page nor the membership page.

**Test data:**

| <lane> |
| --- |
| UAT |
| Production |

**Steps:**

1. Click the account control in the header.
2. Read the account menu.

**Expected Results:**

* Step 2: a small initial avatar above <collector email>, both above the items.
* Step 2: My Auctions, then Sign Out, and nothing else.
* Step 2: no Profile, My Orders or Membership item.

<!-- trace:case id=g10.site-page-shell.TC-wll rev=2 covers=g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-3y1 -->
### grade10-site-site-page-shell-US3-TC7-2: Store-launch account menu puts My Orders ahead of My Auctions

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in as <collector email>) is on <grade10 site url>.
* The site is staging, which answers Store.

**Steps:**

1. Click the account control in the header.
2. Read the account menu.

**Expected Results:**

* Step 2: a small initial avatar above <collector email>, both above the items.
* Step 2: My Orders immediately before My Auctions.
* Step 2: Sign Out is the last item.
* Step 2: no KYC item.
* Step 2: no item opening <grade10 my auction orders url>.

<!-- trace:case id=g10.site-page-shell.TC-7s9 rev=1 covers=g10.site-page-shell.SC-m6b -->
### grade10-site-site-page-shell-US3-TC8-1: Sign Out item reads in Title Case

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.

**Steps:**

1. Click the account control in the header.
2. Read the last item in the account menu.

**Expected Results:**

* Step 2: the item reads Sign Out, in Title Case.

<!-- trace:case id=g10.site-page-shell.TC-atw rev=2 covers=none -->
### grade10-site-site-page-shell-US3-TC9-2: Account menu label falls back when no sign-in email is supplied

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The header receives no sign-in email for the session.

**Steps:**

1. Click the account control in the header.
2. Read the account menu.

**Expected Results:**

* Step 2: the account label shows in place of an email.
* Step 2: My Auctions and Sign Out are still listed.

<!-- trace:case id=g10.site-page-shell.TC-xbu rev=2 covers=none -->
### grade10-site-site-page-shell-US3-TC10-2: Activating Membership invokes its handler without opening a withheld route

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in, on a surface once Store answers, Membership handler and copy supplied) is on the site.

**Steps:**

1. Open the account menu.
2. Activate Membership.

**Expected Results:**

* The supplied Membership handler is invoked.
* The browser does not navigate to `/membership`, `/join`, or any other membership address.

<!-- trace:case id=g10.site-page-shell.TC-fa4 rev=3 covers=g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-79q,g10.site-page-shell.SC-o1v -->
### grade10-site-site-page-shell-US3-TC11-3: Account menu opens on Profile, which opens the account page

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The site is staging, which carries the account page and answers Store.

**Steps:**

1. Click the account control in the header.
2. Read the account menu's items.
3. Click Profile in the account menu.

**Expected Results:**

* Step 2: Profile is the first item.
* Step 2: My Orders comes before My Auctions.
* Step 2: Sign Out is the last item.
* Step 3 opens the account page at <grade10 site url><lang>/profile.

<!-- trace:case id=g10.site-page-shell.TC-kw9 rev=1 covers=g10.site-page-shell.SC-agf,g10.site-page-shell.SC-th1 -->
### grade10-site-site-page-shell-US3-TC12-1: Store menu leaves out the account and membership pages a build withholds

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* The site shell renders for a signed-in collector on a build that answers Store and withholds the account page and the membership page.

**Steps:**

1. Open the account menu.
2. Read the account menu's items.

**Expected Results:**

* Step 2: the menu lists My Orders, My Auctions, then Sign Out, and nothing else.
* Step 2: no Profile item.
* Step 2: no Membership item.

<!-- trace:case id=g10.site-page-shell.TC-74a rev=1 covers=g10.site-page-shell.SC-lcs -->
### grade10-site-site-page-shell-US3-TC13-1: Activating My Auctions opens My Auctions

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
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.

**Steps:**

1. Click the account control in the header.
2. Click My Auctions in the account menu.

**Expected Results:**

* Step 2 opens My Auctions at <grade10 site url><lang>/auction/watchlist.

## grade10-site-site-page-shell-US5: Collector locates the current surface in the navigation

**As a** collector,
**I want** the navigation item owning the address I am on to be marked, and
none marked when no item owns it,
**so that** I can tell where I am in the site without guessing.

<!-- trace:case id=g10.site-page-shell.TC-pm3 rev=2 covers=g10.site-page-shell.SC-xiu -->
### grade10-site-site-page-shell-US5-TC2-2: Unlisted surface marks no navigation item

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-05

**Pre-conditions:**

* customer(signed in) is on <grade10 site url>.
* The site is staging, which carries the account page.

**Steps:**

1. Navigate to <grade10 site url><lang>/profile.
2. Read the header navigation.

**Expected Results:**

* Step 2: no navigation item is marked as the current page.

## Settled

* Signed-in account entry opens a menu, the sign-in email with its small
  initial avatar above the items, offering My Auctions and Sign Out on auction
  launch, Profile first wherever the account page is carried, and My Orders
  ahead of My Auctions once Store answers - not the account page directly;
  Sign Out is offered from that menu and from the account page wherever it is
  carried.
* Membership follows the membership page by the rule Profile follows, and a
  later change offers it; until then the menu never offers it.
* The menu offers no item whose page the site withholds: My Orders, Profile or
  Membership.
* The account label in place of the sign-in email is `SiteHeader`'s alone: a
  signed-in collector always has an email.

## Reconciliation

**Run:** QA1 blind pass, 2026-10-06, for `omit-profile-account-menu`, `grade10-site/site/page-shell`. It rewrote US3-TC3, US3-TC5 and US3-TC11, retired US3-TC2, added a KYC result to US3-TC7, and raised one question, now a row of `decisions.md`'s `## Raised` table. It left no statement of what it read and was denied, so none is claimed here.

**Run:** QA2 reconciliation, 2026-10-06. The blind cases were joined to the delta's scenarios on `grade10-site-site-page-shell-US-03`. Every US3 case is carried in this suite, because each durable marker covered scenarios this change removes; each now covers the scenarios it walks. The journey was corrected to Page Shell · Account Menu, which holds Profile (Q1) and Membership (Q5) open: it names neither, and no case asserts either.

**Run:** QA2 reconciliation rerun, 2026-10-06, after QA1's third round raised Q14 and the scenarios were renumbered. It corrected every scenario id the table cited, retired US3-TC9, moved US3-TC5 to the unit layer, and named UAT in place of Preview in US3-TC6.

**Run:** QA2 reconciliation, third run, 2026-10-06, after Page Shell · Account Menu gained its Withheld pages line and the proposal became neutral on Q1. Every case and scenario was joined again; no disposition moved. It dropped the journeys file's context journeys, which no scenario or case of this change anchors on.

**Run:** QA2 reconciliation, fourth run, 2026-10-06, after the acceptance review's third round. The journey dropped its Cart clause, so `grade10-site-site-page-shell-US3-TC6-1` and `grade10-site-site-page-shell-US3-TC7-2` dropped their Cart results and keep their versions. The three deprecated cases cover none. The two durable Settled lines this change makes false are struck by hand at acceptance. No other disposition moved.

**Run:** QA2 reconciliation, fifth run, 2026-10-06, after the deltas' feature sets kept only the lines they change (Q12). The anchor `grade10-site-site-page-shell-US-03` did not move, and every case and scenario was joined again; no disposition moved. The Context journeys row now gives its reason without the suite warning, which the gate no longer issues for a context journey.

**Run:** QA2 reconciliation, sixth run, 2026-10-06, after the acceptance review's fourth round. `grade10-site-site-page-shell-SC-14` names the account page in place of the profile, so `grade10-site-site-page-shell-US5-TC2-2` follows it, and the journeys file restates `grade10-site-site-page-shell-US-05` as context. `## Settled` drops the line that said Profile and Membership wait on Product: an open question is never settled, and `decisions.md` Q1 and Q5 hold it.

**Run:** QA2 reconciliation, seventh run, 2026-10-06, in a fresh context. Every case and scenario was joined again on `grade10-site-site-page-shell-US-03` and `grade10-site-site-page-shell-US-05`, and every lane and address a case names was checked against grade10 `src/surfaces.ts`. `grade10-site-site-page-shell-US5-TC2-2` walks the unlisted surface alone, so its marker drops `grade10-site-site-page-shell-SC-13`, which the durable `grade10-site-site-page-shell-US5-TC1-1` walks. No disposition moved.

**Applied:** 2026-10-07, the product owner's answers to Q1, Q5 and Q13; not a QA2 reading, which reruns on them. Profile joins first wherever the account page is carried, so `grade10-site-site-page-shell-SC-66` and `grade10-site-site-page-shell-SC-67` are added, `grade10-site-site-page-shell-US3-TC5-3` and `grade10-site-site-page-shell-US3-TC11-3` are unblocked and rewritten, and the journey names Profile. Membership follows its page and a later change offers it, so `## Settled` says so.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-site-page-shell-US3-TC1-1` | Reached | `grade10-site-site-page-shell-SC-07`; unchanged |
| `grade10-site-site-page-shell-US3-TC2-2` | Retired, `deprecated`, bumped | It put Profile first, which the removed `grade10-site-site-page-shell-SC-17` stated; the Store menu is `grade10-site-site-page-shell-US3-TC7-2`. Its marker covers none, so a retired case never reads as coverage of `grade10-site-site-page-shell-SC-56` |
| `grade10-site-site-page-shell-US3-TC3-2` | Reached, bumped | `grade10-site-site-page-shell-SC-08` and `grade10-site-site-page-shell-SC-57`. The account page offers Sign Out only on a build that carries it, so the case runs on staging |
| `grade10-site-site-page-shell-US3-TC4-1` | Reached | `grade10-site-site-page-shell-SC-64`; unchanged |
| `grade10-site-site-page-shell-US3-TC5-3` | Rewritten on Q1, moved to unit | Its no-My-Orders result is `grade10-site-site-page-shell-SC-58`. With the account page carried, Profile is first (`grade10-site-site-page-shell-SC-66`), so the no-Profile result became a Profile-first result, and task 3.1 tests that state in `store-shut.test.tsx`. No lane carries the account page and withholds Store (grade10 `src/surfaces.ts:343-399`), so the case runs on the rendered shell with the gates overridden |
| `grade10-site-site-page-shell-US3-TC6-1` | Reached, lane corrected | `grade10-site-site-page-shell-SC-06`, `grade10-site-site-page-shell-SC-58`, `grade10-site-site-page-shell-SC-60` and `grade10-site-site-page-shell-SC-61` on the auction-launch lanes. "Preview" is no lane in the gate table; the rows are UAT, where the walk runs, and Production. Its no-Cart result left with the journey's Cart clause: `grade10-site-site-page-shell-US-04` and `grade10-site-site-page-shell-US-06` own Cart |
| `grade10-site-site-page-shell-US3-TC7-2` | Reached, rewritten | The blind reading listed Membership after My Auctions, from the journey; Membership follows its own page and a later change offers it (Q5), and no scenario places it, so the result is dropped. Its "no Profile" result needed a lane that answers Store and withholds the account page, which no lane is; it moved to `grade10-site-site-page-shell-US3-TC12-1`. The case runs on staging and walks `grade10-site-site-page-shell-SC-56` and `grade10-site-site-page-shell-SC-61`. Its Cart result left with the journey's Cart clause |
| `grade10-site-site-page-shell-US3-TC8-1` | Reached | `grade10-site-site-page-shell-SC-62`; unchanged |
| `grade10-site-site-page-shell-US3-TC9-2` | Retired, `deprecated`, bumped | The label fallback left this capability with Q14: a signed-in session always carries an email, so the fallback is `SiteHeader`'s alone, walked by `shared-ui-site-chrome-US1-TC17-1`. Its marker covers none: the retired `grade10-site-site-page-shell-SC-31` leaves the spec at the fold |
| `grade10-site-site-page-shell-US3-TC10-2` | Retired, `deprecated`, bumped | `grade10-site-site-page-shell-SC-34` is removed: the app never supplies Membership, and a later change offers it (Q5) with its own case. Its marker covers none, not `grade10-site-site-page-shell-SC-63`, the opposite outcome, which `grade10-site-site-page-shell-US3-TC12-1` walks |
| `grade10-site-site-page-shell-US3-TC11-3` | Rewritten on Q1 | On staging, which carries the account page, Profile is first and opens it (`grade10-site-site-page-shell-SC-66`, `grade10-site-site-page-shell-SC-67`); the rest of the case is `grade10-site-site-page-shell-SC-56` |
| `grade10-site-site-page-shell-US3-TC12-1` | Case added | `grade10-site-site-page-shell-SC-59` and `grade10-site-site-page-shell-SC-63` had no case. No lane answers Store and withholds those pages, so the case runs on the rendered shell with the gates overridden, as task 2.2 does |
| `grade10-site-site-page-shell-US3-TC13-1` | Case added | `grade10-site-site-page-shell-SC-65` had no case, before this change or after it |
| Raised: Membership in the journey once Store answers | Landed as Q5, journey corrected | The journey named Membership once Store answers and "never a Profile item". Page Shell is the source: the journey names Profile first wherever the account page is carried (Q1), and not Membership, which a later change offers (Q5) |
| Raised: the label fallback without an email | Landed as Q14, settled | The site always has the email, so page-shell drops the fallback with its scenario and `grade10-site-site-page-shell-US3-TC9-2` retires |
| Settled: the menu's Membership lines | Retracted | The durable suite settled Membership once Store answers, in two lines, while Membership follows its own page and a later change offers it (Q5). The fold has no rule that removes a durable Settled line, so acceptance strikes both from the durable suite by hand: the line that reads "plus Profile once carried, My Orders and Membership once Store answers", and the line that opens "The account menu's item order under every combination of {Profile carried, Store answers}". This suite's own menu line holds neither phrase. `## Settled` states the menu this change settles, its withheld pages, Membership and the label fallback (Q14) |
| Journey: Cart in the bar | Dropped | No scenario serving `grade10-site-site-page-shell-US-03` states Cart; `grade10-site-site-page-shell-US-04` and `grade10-site-site-page-shell-US-06` own it, so the clause and the two Cart results left |
| Context journeys | Dropped, one restated | No scenario or case of this change anchors on US-01, US-02, US-04, US-06 or US-07. `grade10-site-site-page-shell-SC-13` and `grade10-site-site-page-shell-SC-14` serve `grade10-site-site-page-shell-US-05`, so the journeys file restates it as context beside `grade10-site-site-page-shell-US-03`, which the change modifies |
| `grade10-site-site-page-shell-US5-TC2-2` | Rewritten, bumped | `grade10-site-site-page-shell-SC-14` now reads "the account page". The case opens the account page on staging, which carries it, in place of `<grade10 profile url>`. It asserts no marked item and nothing about a listed surface, so its marker covers `grade10-site-site-page-shell-SC-14` alone |
| Settled: Profile and Membership wait on Product | Dropped, then restated | A Settled line is read as answered by the next blind pass, so an open question never sits there. Q1 and Q5 are now answered: `## Settled` places Profile in the menu line and states Membership's rule |
| Scenarios | All reached | Every scenario the delta carries has a case asserting its outcome: `grade10-site-site-page-shell-SC-06` to `grade10-site-site-page-shell-SC-08`, `grade10-site-site-page-shell-SC-13`, `grade10-site-site-page-shell-SC-14` and `grade10-site-site-page-shell-SC-56` to `grade10-site-site-page-shell-SC-67` |
| Contradictions | None | Where a case and a scenario state the same behaviour they agree |
