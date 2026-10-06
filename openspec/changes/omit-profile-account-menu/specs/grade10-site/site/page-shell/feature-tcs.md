# grade10-site/site/page-shell Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-site-page-shell-US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with its small initial avatar above My
Auctions and Sign Out on auction launch, and My Orders, My Auctions, and Sign
Out once Store answers, with Cart in the bar only once Store answers, and no
item whose page the site withholds,
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

<!-- trace:case id=g10.site-page-shell.TC-bs9 rev=2 covers=g10.site-page-shell.SC-y2l -->
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

<!-- trace:case id=g10.site-page-shell.TC-obx rev=2 covers=g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-59q -->
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

<!-- trace:case id=g10.site-page-shell.TC-5jl rev=2 covers=g10.site-page-shell.SC-0q3 -->
### grade10-site-site-page-shell-US3-TC5-2: Menu without Store omits My Orders and Profile where the account page is carried

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

**Blocked:** Product - Q1 decides whether Profile joins first wherever the account page is carried, or the menu never offers it.

**Pre-conditions:**

* The site shell renders for a signed-in collector on a build that carries the account page and withholds Store.

**Steps:**

1. Open the account menu.
2. Read the account menu's items.

**Expected Results:**

* Step 2: the menu lists My Auctions, then Sign Out, and nothing else.
* Step 2: no My Orders item.
* Step 2: no Profile item.

<!-- trace:case id=g10.site-page-shell.TC-1su rev=1 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-0q3,g10.site-page-shell.SC-sna,g10.site-page-shell.SC-4zh -->
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

1. Read the header bar.
2. Click the account control in the header.
3. Read the account menu.

**Expected Results:**

* Step 1: no Cart control in the bar.
* Step 3: a small initial avatar above <collector email>, both above the items.
* Step 3: My Auctions, then Sign Out, and nothing else.
* Step 3: no Profile, My Orders or Membership item.

<!-- trace:case id=g10.site-page-shell.TC-wll rev=2 covers=g10.site-page-shell.SC-wjc,g10.site-page-shell.SC-4zh -->
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

1. Read the header bar.
2. Click the account control in the header.
3. Read the account menu.

**Expected Results:**

* Step 1: a Cart control in the bar.
* Step 3: a small initial avatar above <collector email>, both above the items.
* Step 3: My Orders immediately before My Auctions.
* Step 3: Sign Out is the last item.
* Step 3: no KYC item.
* Step 3: no item opening <grade10 my auction orders url>.

<!-- trace:case id=g10.site-page-shell.TC-7s9 rev=1 covers=g10.site-page-shell.SC-kyr -->
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

<!-- trace:case id=g10.site-page-shell.TC-atw rev=2 covers=g10.site-page-shell.SC-qby -->
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

<!-- trace:case id=g10.site-page-shell.TC-xbu rev=2 covers=g10.site-page-shell.SC-x1n -->
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

<!-- trace:case id=g10.site-page-shell.TC-fa4 rev=2 covers=g10.site-page-shell.SC-wjc -->
### grade10-site-site-page-shell-US3-TC11-2: Account menu offers no Profile where the account page is carried

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

**Blocked:** Product - Q1 decides whether Profile joins first wherever the account page is carried, or the menu never offers it.

**Pre-conditions:**

* customer(signed in) is on `<grade10 site url>`.
* The site is staging, which carries the account page and answers Store.

**Steps:**

1. Navigate to `<grade10 site url><lang>/profile`.
2. Click the account control in the header.
3. Read the account menu's items.

**Expected Results:**

* Step 1: the account page loads.
* Step 3: no Profile item.
* Step 3: My Orders comes before My Auctions.
* Step 3: Sign Out is the last item.

<!-- trace:case id=g10.site-page-shell.TC-kw9 rev=1 covers=g10.site-page-shell.SC-vo4,g10.site-page-shell.SC-th1 -->
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

## Reconciliation

**Run:** QA1 blind pass, 2026-10-06, for `omit-profile-account-menu`, `grade10-site/site/page-shell`. It rewrote US3-TC3, US3-TC5 and US3-TC11, retired US3-TC2, added a KYC result to US3-TC7, and raised one question, now a row of `decisions.md`'s `## Raised` table. It left no statement of what it read and was denied, so none is claimed here.

**Run:** QA2 reconciliation, 2026-10-06. The blind cases were joined to the delta's scenarios on `grade10-site-site-page-shell-US-03`. Every US3 case is carried in this suite, because each durable marker covered scenarios this change removes; each now covers the scenarios it walks. The journey was corrected to Page Shell · Account Menu, which holds Profile (Q1) and Membership (Q5) open: it names neither, and no case asserts either.

**Run:** QA2 reconciliation rerun, 2026-10-06, after QA1's third round raised Q14 and the scenarios were renumbered. It corrected every scenario id the table cited, retired US3-TC9, moved US3-TC5 to the unit layer, and named UAT in place of Preview in US3-TC6.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-site-page-shell-US3-TC1-1` | Reached | `grade10-site-site-page-shell-SC-07`; unchanged |
| `grade10-site-site-page-shell-US3-TC2-2` | Retired, `deprecated`, bumped | It put Profile first, which the removed `grade10-site-site-page-shell-SC-17` stated; the Store menu is `grade10-site-site-page-shell-US3-TC7-2`. Its marker names that retired scenario |
| `grade10-site-site-page-shell-US3-TC3-2` | Reached, bumped | `grade10-site-site-page-shell-SC-08` and `grade10-site-site-page-shell-SC-57`. The account page offers Sign Out only on a build that carries it, so the case runs on staging |
| `grade10-site-site-page-shell-US3-TC4-1` | Reached | `grade10-site-site-page-shell-SC-64`; unchanged |
| `grade10-site-site-page-shell-US3-TC5-2` | Raised, blocked, moved to unit | Its no-My-Orders result is `grade10-site-site-page-shell-SC-58`. Its no-Profile result, with the account page carried and Store withheld, is the "never" answer to Q1, and task 3.1 tests that state in `store-shut.test.tsx`. No lane carries the account page and withholds Store (grade10 `src/surfaces.ts:343-399`), so the case runs on the rendered shell with the gates overridden. **Blocked:** Product |
| `grade10-site-site-page-shell-US3-TC6-1` | Reached, lane corrected | `grade10-site-site-page-shell-SC-06`, `grade10-site-site-page-shell-SC-58`, `grade10-site-site-page-shell-SC-60` and `grade10-site-site-page-shell-SC-61` on the auction-launch lanes. "Preview" is no lane in the gate table; the rows are UAT, where the walk runs, and Production |
| `grade10-site-site-page-shell-US3-TC7-2` | Reached, rewritten | The blind reading listed Membership after My Auctions, from the journey; the page holds Membership open (Q5) and no scenario places it, so the result is dropped. Its "no Profile" result needed a lane that answers Store and withholds the account page, which no lane is; it moved to `grade10-site-site-page-shell-US3-TC12-1`. The case runs on staging and walks `grade10-site-site-page-shell-SC-56` and `grade10-site-site-page-shell-SC-61` |
| `grade10-site-site-page-shell-US3-TC8-1` | Reached | `grade10-site-site-page-shell-SC-62`; unchanged |
| `grade10-site-site-page-shell-US3-TC9-2` | Retired, `deprecated`, bumped | The label fallback left this capability with Q14: a signed-in session always carries an email, so the fallback is `SiteHeader`'s alone, walked by `shared-ui-site-chrome-US1-TC17-1`. Its marker named a scenario issued nowhere; it now names the retired `grade10-site-site-page-shell-SC-31` |
| `grade10-site-site-page-shell-US3-TC10-2` | Retired, `deprecated`, bumped | `grade10-site-site-page-shell-SC-34` is removed: the app never supplies Membership, and the page holds its place open (Q5). Q5's answer brings a case back. Its marker names that retired scenario, not `grade10-site-site-page-shell-SC-63`, the opposite outcome, which `grade10-site-site-page-shell-US3-TC12-1` walks |
| `grade10-site-site-page-shell-US3-TC11-2` | Raised, blocked | No Profile where the account page is carried is the "never" answer to Q1; the rest of the case is `grade10-site-site-page-shell-SC-56`. **Blocked:** Product |
| `grade10-site-site-page-shell-US3-TC12-1` | Case added | `grade10-site-site-page-shell-SC-59` and `grade10-site-site-page-shell-SC-63` had no case. No lane answers Store and withholds those pages, so the case runs on the rendered shell with the gates overridden, as task 2.2 does |
| `grade10-site-site-page-shell-US3-TC13-1` | Case added | `grade10-site-site-page-shell-SC-65` had no case, before this change or after it |
| Raised: Membership in the journey once Store answers | Landed as Q5, journey corrected | The journey named Membership once Store answers and "never a Profile item", while the page holds both open. Page Shell is the source, so the journey names neither until Q1 and Q5 are answered |
| Raised: the label fallback without an email | Landed as Q14, settled | The site always has the email, so page-shell drops the fallback with its scenario and `grade10-site-site-page-shell-US3-TC9-2` retires |
| Scenarios | All reached | Every scenario the delta carries has a case asserting its outcome: `grade10-site-site-page-shell-SC-06` to `grade10-site-site-page-shell-SC-08` and `grade10-site-site-page-shell-SC-56` to `grade10-site-site-page-shell-SC-65` |
| Contradictions | None open | Where a case and a scenario state the same behaviour they agree; the two cases that disagree with the page are blocked on Q1 |
