# grade10-site/site/page-shell Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-30, tcs-rules r7

## Background

* `<site>` is the Grade10 site: staging answers Store and carries the account page and the membership page; UAT and production, the auction launch, carry neither Store, the account page nor the membership page. A wide viewport is 1280 CSS pixels; a narrow one 375.
* A held session read is the session request paused by the tester until released; a cart review is the basket read the header's count waits on.

## g10.site-page-shell.US3: Collector reaches account destinations from the header

**As a** collector,
**I want** Sign In when I am signed out, and when I am signed in an account
menu that shows my sign-in email with my avatar - my profile image where I
chose one, else the initial of my email - above My
Auctions and Sign Out on auction launch, with Profile first wherever the
account page is carried, Membership next wherever the membership page is
carried, and My Orders ahead of My Auctions once Store answers, and no item
whose page the site withholds,
**so that** one place in the header takes me where I can go for this launch.

<!-- trace:case id=g10.site-page-shell.TC-1su rev=3 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-79q,g10.site-page-shell.SC-o1v -->
### g10.site-page-shell.US3-TC6: The account menu shows the email and avatar, offering only what this build carries

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector with no profile image, who `<joined>`, is signed in on `<build>`.
* The site's language is `<language>`, chosen in the language control.

**Test data:**

| `<build>` | `<joined>` | `<language>` | `<items>` |
| --- | --- | --- | --- |
| UAT | has never joined the loyalty programme | English | My Auctions, Sign Out |
| production | has never joined the loyalty programme | English | My Auctions, Sign Out |
| staging | has joined the loyalty programme | English | Profile, Membership, My Orders, My Auctions, Sign Out |
| staging | has never joined the loyalty programme | Traditional Chinese | Profile, Membership, My Orders, My Auctions, Sign Out |
| staging | has never joined the loyalty programme | Simplified Chinese | Profile, Membership, My Orders, My Auctions, Sign Out |

**Steps:**

1. Open the auction.
2. Select the account control, and read the menu.
3. Open an auction listing, then the store, Profile and Membership where carried, reading the account control on each.

**Expected Results:**

* Step 2 shows a small avatar with the sign-in email's initial, above the sign-in email.
* Both sit above `<items>`, in that order and nothing else: no KYC.
* Every item reads in `<language>`; in English the last reads Sign Out, in Title Case.
* Step 3 names the same collector on every page, Profile with their name and email, and no other person.

<!-- trace:case id=g10.site-page-shell.TC-k3w rev=1 -->
### g10.site-page-shell.US3-TC8: Each gated account item is omitted on its own, the order kept

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* The site is a build made to carry `<carried>` and withhold `<withheld>`, a set no lane carries.
* A collector with no profile image is signed in on that build.

**Test data:**

| `<carried>` | `<withheld>` | `<items>` | `<first opens>` |
| --- | --- | --- | --- |
| the membership page and Store | the account page | Membership, My Orders, My Auctions, Sign Out | the membership page at `/membership` |
| the account page and Store | the membership page | Profile, My Orders, My Auctions, Sign Out | the account page at `/profile` |
| the account page and the membership page | Store | Profile, Membership, My Auctions, Sign Out | the account page at `/profile` |

**Steps:**

1. Open the auction.
2. Select the account control, and read the menu.
3. Select the first item under the email.

**Expected Results:**

* Step 2 lists `<items>` under the email, in that order and nothing else.
* Step 3 opens `<first opens>`, not the not-found surface.

<!-- trace:case id=g10.site-page-shell.TC-asx rev=1 covers=g10.site-page-shell.SC-70a,g10.site-page-shell.SC-lcs,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-04a -->
### g10.site-page-shell.US3-TC4: Each account menu item opens its destination

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on staging, the account menu open.

**Test data:**

| `<item>` | `<opens>` |
| --- | --- |
| Profile | the account page at `/profile`, which also offers Sign Out |
| Membership | the membership page at `/membership` |
| My Orders | `/store/my-orders` |
| My Auctions | `/auction/my-auctions` |
| Sign Out | sign-out, the header then showing Sign In |

**Steps:**

1. Select `<item>` in the account menu.

**Expected Results:**

* It opens `<opens>`.

<!-- trace:case id=g10.site-page-shell.TC-r8d rev=1 -->
### g10.site-page-shell.US3-TC9: Membership stays offered and opens while the loyalty programme cannot answer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-page-shell-US-03

**Pre-conditions:**

* A collector is signed in on staging.
* Every read of the loyalty programme answers `<failure>`.

**Test data:**

| `<failure>` |
| --- |
| a 500 server error |
| a dropped connection |

**Steps:**

1. Open the auction.
2. Select the account control, and read the menu.
3. Select Membership.

**Expected Results:**

* Step 2 lists Profile, Membership, My Orders, My Auctions, Sign Out, as when the programme answers.
* Step 3 opens the membership page at `/membership`, not the not-found surface.
