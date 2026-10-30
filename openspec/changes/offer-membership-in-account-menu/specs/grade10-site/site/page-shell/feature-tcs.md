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

<!-- trace:case id=g10.site-page-shell.TC-1su rev=3 covers=g10.site-page-shell.SC-m3w,g10.site-page-shell.SC-u71,g10.site-page-shell.SC-n9c,g10.site-page-shell.SC-3y1,g10.site-page-shell.SC-y2l,g10.site-page-shell.SC-m6b,g10.site-page-shell.SC-79q,g10.site-page-shell.SC-o1v,g10.site-page-shell.SC-90t,g10.site-page-shell.SC-3sh -->
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

* A collector with no profile image is signed in on `<build>`.
* The site's language is `<language>`, chosen in the language control.

**Test data:**

| `<build>` | `<language>` | `<items>` | `<membership>` |
| --- | --- | --- | --- |
| UAT | English | My Auctions, Sign Out | not offered |
| production | English | My Auctions, Sign Out | not offered |
| staging | English | Profile, Membership, My Orders, My Auctions, Sign Out | labelled "Membership" |
| staging | Traditional Chinese | Profile, Membership, My Orders, My Auctions, Sign Out | labelled 會員 |
| staging | Simplified Chinese | Profile, Membership, My Orders, My Auctions, Sign Out | labelled 会员 |

**Steps:**

1. Open the auction.
2. Select the account control, and read the menu.
3. Open an auction listing, then the store where carried, then select Profile and Membership in the account menu where offered, reading the account control on each page.

**Expected Results:**

* Step 2 shows a small avatar with the sign-in email's initial, above the sign-in email.
* Both sit above `<items>`, in that order and nothing else: no KYC.
* Every item reads in `<language>`, and Membership is `<membership>`; in English the last reads Sign Out, in Title Case.
* Step 3 names the same collector on every page, Profile with their name and email, and no other person.

<!-- trace:case id=g10.site-page-shell.TC-k3w rev=1 covers=g10.site-page-shell.SC-gnd,g10.site-page-shell.SC-th1,g10.site-page-shell.SC-agf -->
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
| Store | the account page and the membership page | My Orders, My Auctions, Sign Out | My Orders at `/store/my-orders` |
| the account page and the membership page | Store | Profile, Membership, My Auctions, Sign Out | the account page at `/profile` |

**Steps:**

1. Open the auction.
2. Select the account control, and read the menu.
3. Select the first item under the email.

**Expected Results:**

* Step 2 lists `<items>` under the email, in that order and nothing else.
* Step 3 opens `<first opens>`, not the not-found surface.

<!-- trace:case id=g10.site-page-shell.TC-asx rev=1 covers=g10.site-page-shell.SC-70a,g10.site-page-shell.SC-lcs,g10.site-page-shell.SC-e9z,g10.site-page-shell.SC-04a,g10.site-page-shell.SC-vsh -->
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

<!-- trace:case id=g10.site-page-shell.TC-r8d rev=1 covers=g10.site-page-shell.SC-ju2 -->
### g10.site-page-shell.US3-TC9: Membership stays offered and opens while the loyalty programme cannot answer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
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

## Settled

* Signed-in account entry opens a menu, the sign-in email with its small avatar
  above the items, offering My Auctions and Sign Out on auction launch, Profile
  first wherever the account page is carried, Membership right after it
  wherever the membership page is carried, and My Orders ahead of My Auctions
  once Store answers - not the account page directly; Sign Out is offered from
  that menu and from the account page wherever it is carried.
* Membership follows the membership page by the rule Profile follows: the menu
  offers it wherever that page is carried, whatever the loyalty programme
  answers, and opens on it where the account page is withheld.
* Membership opens `/membership` for every signed-in collector: every account is
  a member, so no collector is sent to a join page or elsewhere, and the page
  shows its own state (Q7).
* The grade10 account menu offers no Submissions: the site supplies none, so the
  menu holds Profile, Membership, My Orders, My Auctions and Sign Out, each where
  its page is carried, and nothing else; whether the shared header keeps an
  unnamed Submissions item is the follow-up site-chrome change's (Q6).

## Reconciliation

**Run:** 2026-10-30, QA2; read QA1's blind cases in this suite, Dev's page-shell `spec.md` delta, `tech-design.md`, `tasks.md`, `proposal.md` and `decisions.md`, the durable page-shell `spec.md` and `feature-tcs.md`, the Page Shell, Site Header and Footer, Membership and Carried Surfaces PRD pages, and grade10's `apps/frontend/grade10/src/chrome/shell/SiteShell.tsx` read-only; QA1 read the frozen anchors without the requirements, scenarios or technical design, and Dev drafted without QA1, as `/planning-dev` runs them. On the human's decision that this change keeps only the page-shell half, the site-chrome delta was set aside: no site-chrome scenario is linked or reconciled here.

- **US3-TC6** (revised, `rev` 3) - kept `draft`. QA2 dropped QA1's `<joined>` column: under Q7 every account is a member, so "has never joined" is a state no tester can arrange, and no row's outcome turned on it. QA2 sharpened the language result with `<membership>` so the label's three readings are asserted, not only "reads in `<language>`", and step 3 now reaches Profile and Membership from the account menu. Linked to `grade10-site-site-page-shell-SC-80` (`SC-90t`, the staging rows) and `grade10-site-site-page-shell-SC-84` (`SC-3sh`); its earlier links stand.
- **US3-TC4** (extended, `rev` 1) - kept. QA1's Membership row asserts the whole of `grade10-site-site-page-shell-SC-81` (`SC-vsh`): `/membership`, for any collector under Q7. Linked.
- **US3-TC8** (new, `rev` 1) - kept `draft` and `manual`. QA2 added the row with Store answering and both the account page and the membership page withheld, the arrangement `grade10-site-site-page-shell-SC-59` (`SC-agf`, `rev` 3) now names and no case reached. Linked to `SC-agf`, `grade10-site-site-page-shell-SC-82` (`SC-gnd`, the account page withheld) and `grade10-site-site-page-shell-SC-63` (`SC-th1`, the membership page withheld), which no durable case linked.
- **US3-TC9** (new, `rev` 1) - kept `draft` and `manual`. Behaviour set to `negative`: its rows are a 500 and a dropped connection, which the classification rules make negative. Linked to `grade10-site-site-page-shell-SC-83` (`SC-ju2`); its arrival at `/membership` is `SC-vsh`, linked on TC4.
- **New, not an extension** - g10.site-page-shell.US3-TC8 - its builds carry a set of pages no lane carries, made only by a gate override, so it is `automation` alone and selects the item the menu opens on; US3-TC6 walks the lanes a tester opens by hand, and its rows would mix runs a person cannot make with runs they can.
- **New, not an extension** - g10.site-page-shell.US3-TC9 - its starting state is a loyalty programme failing every read, which only a stubbed dependency makes, and its risk is that failure reaching the header; US3-TC6 and US3-TC4 run on a programme that answers, by hand as well as by script.
- **Uncovered** - none. Every page-shell scenario the delta adds or modifies has a case: `SC-59` TC8, `SC-80` TC6, `SC-81` TC4, `SC-82` TC8, `SC-83` TC9, `SC-84` TC6. The delta's unchanged scenarios keep their cases, `SC-79` on the durable US3-TC7.
- **Over-claimed cases** - one, repaired: TC6's link to `SC-o1v` rested on a step 3 that opened Profile by no named route; step 3 now selects Profile in the account menu, so the link holds.
- **Contradictions between the readings** - none. Both place Membership right after Profile, open it on `/membership`, keep it offered while the programme fails, and open the menu on it where the account page is withheld. The restated Sign Out label names no language; TC6 holds it to English, as its scenario's title reads.
- **Raised, closed** - both rows QA1 raised close on their recommendation, `decided by the round`; the held test holds neither, since each answer is what the build and the record already say. Q6 (Submissions): the grade10 site supplies none (`SiteShell` passes no `onSubmissions`), so TC6 keeps "nothing else"; the shared header's own unnamed item is deferred to the follow-up site-chrome change, as the non-goals say. Q7 (a collector who has not joined): Membership's opening line, "An account is a member", leaves no such collector, so the item opens `/membership` for all. Each answer is in `## Settled`.
- **Settled, superseded** - two durable `## Settled` lines become untrue when this change folds: "Membership follows the membership page by the rule Profile follows, and a later change offers it; until then the menu never offers it", and the "Signed-in account entry opens a menu" line, which lists the menu without Membership. This suite's `## Settled` restates both. The fold unions `## Settled`, so it keeps the durable lines beside their restatements; they are struck from the folded suite by hand at acceptance.
- **Background** - this suite's `<site>` line adds the membership page to staging. The durable `## Background` already holds the old line twice, and the fold appends a changed paragraph rather than replacing it, so the old line also needs striking at acceptance.
- **Overlap** - Dev flagged `SiteHeader`'s unnamed Submissions item (Q6 defers it) and `restrict-auctions-by-region`, which MODIFIES the site-chrome requirement the site-chrome delta removed and re-added; both go with that delta to the follow-up change.
- **Domain, product and platform suites** - no hit: no `grade10-site/site` domain suite, grade10-site product suite or platform suite exists to trace US-03.
