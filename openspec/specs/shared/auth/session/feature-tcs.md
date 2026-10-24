# shared/auth/session Test Cases

**Status:** pending-review · 0/17
**Drafts styled:** 2026-10-24, tcs-rules r7
**Out of suite (api):** shared-auth-session-SC-34

**Out of suite (non-GUI):** shared-auth-session-SC-07, shared-auth-session-SC-08, shared-auth-session-SC-10

## Background

* `<g10url>` is the Grade10 site, `<zzz url>` the ZZZ site, and `<console url>` the Grade10 console of the environment under test.
* Every tab a case names is open in one browser on one device, unless the case names another device.
* A tab is returned to as the person left it, never reloaded, and raises no toast or message about the session.
* `<collector A>` and `<collector B>` are accounts holding `user` only; `<operator account>` holds console access, with an authenticator for its second factor.

## Walk 1: Tabs keep up with whoever is signed in

**Starting state:**

- customer signed out on `<g10url>`, with tab A open in the background and tab B in front

### Route

1. In tab B, sign in as `<collector A>`, add a card to the cart, then return to tab A.
   - Tab A shows `<collector A>` signed in, unreloaded `shared.auth-session.US4-TC1`
2. In tab B, sign out, then return to tab A.
   - Tab A shows nobody signed in, and none of `<collector A>`'s cart `shared.auth-session.US5-TC1`
3. In tab B, sign in as `<collector B>`, then return to tab A.
   - Tab A names `<collector B>`, with none of `<collector A>`'s cart `shared.auth-session.US6-TC1`

## Walk 2: An operator keeps the site and the console apart

**Starting state:**

- `<operator account>` signed out on `<g10url>` and on `<console url>`; tab A on `<g10url>`, tab B on `<console url>` in the background

### Route

1. In tab A, sign in on the site, then return to tab B.
   - Tab B is still the console's sign-in page `shared.auth-session.US7-TC1`
2. In tab B, sign in to the console with the second factor, then return to tab A.
   - Tab A is unchanged, signed in on the site `shared.auth-session.US7-TC4`

## shared.auth-session.US1: Collector is named on every surface they use

**As a** collector,
**I want** a signed-in read to report my id, email, name, and roles, and a signed-out read to report nobody,
**so that** every surface of this brand knows it is me, or that I have not signed in.

<!-- trace:case id=g10.shared-session.TC-yh6 rev=2 -->
### shared.auth-session.US1-TC1: A signed-in collector is named on every page of the brand

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-01

**Pre-conditions:**

* customer is signed in on `<g10url>` as `<collector A>`.

**Test data:**

| Page | Shows |
| --- | --- |
| `<g10url>/profile` | `<collector A>`'s name and email |
| the header on the store | `<collector A>` signed in |
| the header on the auction | `<collector A>` signed in |

**Steps:**

1. Open the row's page.

**Expected Results:**

* The row's page shows the row's person, and nobody else.

---

## shared.auth-session.US2: Collector stays signed in across the brand

**As a** collector,
**I want** one sign-in to cover this brand's site and none of another brand,
**so that** I do not sign in twice on the same brand or leak into the other.

<!-- trace:case id=g10.shared-session.TC-4vh rev=2 -->
### shared.auth-session.US2-TC1: One sign-in covers the brand's site

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-02

**Pre-conditions:**

* customer is signed in on the store on `<g10url>` as `<collector A>`.

**Steps:**

1. Open the auction on `<g10url>`.

**Expected Results:**

* `<collector A>` is signed in there, with no new sign-in.

<!-- trace:case id=g10.shared-session.TC-lcn rev=2 -->
### shared.auth-session.US2-TC2: A sign-in reaches no other brand

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-02

**Pre-conditions:**

* The row's person is signed in on the row's Grade10 surface.

**Test data:**

| Person | Signed in on | Then opened | Shown |
| --- | --- | --- | --- |
| customer | `<g10url>` | `<zzz url>` | nobody signed in |
| admin, with the second factor proved | `<console url>` | the ZZZ console | the ZZZ console's sign-in page |

**Steps:**

1. Open the row's other address.

**Expected Results:**

* The row's outcome.

---

## shared.auth-session.US3: Collector's visits are named as them, not as a device

**As a** collector,
**I want** a signed-in event to name me and an anonymous event to name the device,
**so that** analytics does not mix my account with a browser I have not signed in on.

---

## shared.auth-session.US4: Collector returns to a tab they left and it knows they signed in

**As a** collector,
**I want** the tab I left behind to know I signed in somewhere else,
**so that** I do not reload it or ask for a second link to get back to what I was doing.

<!-- trace:case id=g10.shared-session.TC-5ij rev=2 -->
### shared.auth-session.US4-TC1: A tab left open shows the collector signed in once they sign in elsewhere

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with the row's tabs open on `<g10url>`.

**Test data:**

| Tabs left open | How they are left |
| --- | --- |
| tab A on the store | in the background |
| tabs A and B on the store, tab C on the auction | in the background |
| tab A on the store | navigated away, then brought back with Back, not reloaded |
| tab A on the store | discarded by the browser, then selected again, not closed |
| window A on the store | in view beside the window signing in, never touched |
| tab A on a page naming no person | in the background; then its cart is opened |

**Steps:**

1. Sign in as `<collector A>` in another tab.
2. Return to each of the row's tabs.

**Expected Results:**

* Each tab shows `<collector A>` signed in, without a reload; a cart opened from it is `<collector A>`'s, with no sign-in asked.

<!-- trace:case id=g10.shared-session.TC-qc6 rev=2 -->
### shared.auth-session.US4-TC2: A sign-in reaches no tab on another brand, browser or device, and a failed link reaches none

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Open tabs

**Pre-conditions:**

* customer is signed out everywhere, with the row's tab open.

**Test data:**

| Tab left open | Then |
| --- | --- |
| on `<zzz url>`, in the same browser | sign in as `<collector A>` on `<g10url>` |
| on `<g10url>`, in another browser profile | sign in as `<collector A>` on `<g10url>` in this browser |
| on `<g10url>`, on a phone | sign in as `<collector A>` on a desktop |
| on `<g10url>`, in the same browser | follow an expired sign-in link for `<collector A>` in another tab |

**Steps:**

1. Do the row's step.
2. Return to the row's tab.

**Expected Results:**

* The tab still shows nobody signed in, and raises no message about the link.

<!-- trace:case id=g10.shared-session.TC-4w4 rev=2 -->
### shared.auth-session.US4-TC3: A tab that cannot read the session keeps what it last showed

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
* **Trace:** Open tabs

**Pre-conditions:**

* customer is signed in as `<collector A>`, with tab A open on `<g10url>` under the row's failure.

**Test data:**

| Failure |
| --- |
| the session read answers with an error for tab A |
| tab A's device is offline |
| tab A's connection to the auth service is cut |

**Steps:**

1. Leave tab A and return to it, so it reads the session again.
2. Restore the connection, and return to tab A again.

**Expected Results:**

* Step 1: tab A still shows `<collector A>` signed in, and shows no signed-out state.
* Step 2: still signed in.

<!-- trace:case id=g10.shared-session.TC-ptx rev=1 -->
### shared.auth-session.US4-TC4: A console tab shows nothing until the second factor is proved

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* admin is signed out, with tab A open on `<console url>`; no second factor is proved in this browser.

**Steps:**

1. Sign in as `<operator account>` on `<console url>` in tab B, entering no code.
2. Return to tab A.

**Expected Results:**

* Tab A does not show the console; a sign-in page or a second-factor ask is all it shows.

---

## shared.auth-session.US5: Collector returns to a tab they left and it knows they signed out

**As a** collector,
**I want** the tab I left behind to know my session has ended,
**so that** it stops offering me things every request behind it would refuse.

<!-- trace:case id=g10.shared-session.TC-5wd rev=2 -->
### shared.auth-session.US5-TC1: A tab left open shows signed out once the session ends

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in as `<collector A>`, with a card in the cart, and the row's tabs open on `<g10url>` in the background.

**Test data:**

| Tabs left open | How the session ends |
| --- | --- |
| tab A on the store | sign out in another tab |
| tabs A and B on the store, tab C on the auction | sign out in another tab |
| tab A on the store | the session runs out |
| tab A on the store, opened while signed out | sign in, then sign out, in another tab, before returning |
| tab A on `<collector A>`'s orders list | sign out in another tab; then dismiss the sign-in ask |

**Steps:**

1. End the session as the row says.
2. Return to each of the row's tabs.

**Expected Results:**

* Each tab shows nobody signed in, with none of `<collector A>`'s cart, watchlist or orders.
* The orders tab asks for sign-in exactly as that address does with no session; dismissing the ask leaves the tab on the front door.

<!-- trace:case id=g10.shared-session.TC-u40 rev=2 -->
### shared.auth-session.US5-TC2: Signing out leaves another device and the other brand signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in as `<collector A>` on the row's two places.

**Test data:**

| Signed out of | Still signed in |
| --- | --- |
| `<g10url>` on a desktop | `<g10url>` on a phone |
| `<g10url>` | `<zzz url>`, in the same browser |

**Steps:**

1. Sign out of the row's place.
2. Return to the row's other place.

**Expected Results:**

* It still shows `<collector A>` signed in.

---

## shared.auth-session.US6: Collector who signs in after somebody else sees their own things

**As a** collector signing in on a browser somebody else has just used,
**I want** every open tab to show me, with my own cart, watchlist and orders,
**so that** I never act on the last person's things and they never see mine.

<!-- trace:case id=g10.shared-session.TC-sww rev=2 -->
### shared.auth-session.US6-TC1: Every open tab shows whoever signed in last, with their own things

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer is signed in as `<collector A>`, who has a card in the cart, a watched listing and an order; the row's tabs are open on `<g10url>`.

**Test data:**

| Tabs left open | Signs in next | Shown |
| --- | --- | --- |
| tab A on the store, in the background | `<collector B>` | `<collector B>`, named nowhere as `<collector A>` |
| tabs A and B on the store, tab C on the auction | `<collector B>` | `<collector B>` on each |
| tab A on the cart | `<collector B>` | `<collector B>`'s cart, never `<collector A>`'s card |
| tab A on the watchlist | `<collector B>` | `<collector B>`'s watchlist only |
| tab A on the orders list | `<collector B>` | `<collector B>`'s orders only |
| tab A on the page of `<collector A>`'s order | `<collector B>` | none of that order |
| tab A on the cart, its cart read held in flight, then released | `<collector B>` | `<collector B>`'s cart; `<collector A>`'s card never appears |
| tab A on the store, in the background | `<collector A>` again | `<collector A>`, the card still in the cart |

**Steps:**

1. Sign in as the row's person in another tab.
2. Return to each of the row's tabs.

**Expected Results:**

* The row's outcome, with no toast or message about the change.

<!-- trace:case id=g10.shared-session.TC-3j4 rev=1 -->
### shared.auth-session.US6-TC2: Another device stays with the person signed in there

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer is signed in as `<collector A>` on a phone and on a desktop; the phone has a tab open on `<g10url>`.

**Steps:**

1. Sign in as `<collector B>` on the desktop.
2. Return to the phone's tab.

**Expected Results:**

* The phone's tab still names `<collector A>`.

---

## shared.auth-session.US7: Operator holds a console session apart from their site session

**As an** operator,
**I want** the admin console and the site to keep separate sign-ins that end on their own,
**so that** a site sign-in never opens the console and leaving the site signed in never leaves the console open.

### shared.auth-session.US7-TC1: Signing in on the site or the console leaves the other side as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* The row's sessions; the other side's tab is open in the background.

**Test data:**

| Before | Signed in on | The other tab afterwards |
| --- | --- | --- |
| signed out of both, Grade10 | the site, as `<operator account>` | the console's sign-in page, unreloaded and after a reload |
| signed out of both, ZZZ | the ZZZ site, as a ZZZ operator | the ZZZ console's sign-in page |
| signed out of both, Grade10 | the console, as `<operator account>` with the second factor | the site, nobody signed in, unreloaded and after a reload |
| `<collector A>` on the site, with a card in the cart | the console, as `<operator account>` with the second factor | the site, still `<collector A>`, the card in the cart, nothing of the operator |

**Steps:**

1. Sign in as the row says.
2. Return to the other tab, then reload it.

**Expected Results:**

* The row's outcome.

### shared.auth-session.US7-TC2: A session that runs out leaves the other side signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* `<operator account>` is signed in on `<g10url>` in tab A and on `<console url>` in tab B, with the second factor proved; the row's session has run out, and the other has not.

**Test data:**

| Ran out | Signed out | Still signed in |
| --- | --- | --- |
| the site's | tab A | tab B, the console |
| the console's | tab B | tab A, the site |

**Steps:**

1. Return to tab A, then to tab B.

**Expected Results:**

* The row's tabs, without a reload.

### shared.auth-session.US7-TC3: The console asks for its own second factor and recent sign-in, never the site's

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* `<operator account>` is signed in on `<g10url>` in tab A, just now; the row's console state.

**Test data:**

| Console | Then, in tab B | Shown |
| --- | --- | --- |
| signed out; no second factor proved in this browser | sign in on `<console url>`, entering no code | a second-factor ask, not the console; entering the current code opens it |
| signed in more than 15 minutes ago, with no second factor set | set up a second factor | refused, asking to sign in to the console again; no second factor is set |

**Steps:**

1. Do the row's step in tab B.

**Expected Results:**

* The row's outcome.

### shared.auth-session.US7-TC4: A console tab follows the console's own session

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* `<operator account>` is signed in on `<g10url>` in tab C; signed out of the console, with tab A open on `<console url>` in the background.

**Steps:**

1. In tab B, sign in on `<console url>` with the current second-factor code.
2. Return to tab A, then to tab C.

**Expected Results:**

* Tab A shows the console signed in, unreloaded.
* Tab C is unchanged, signed in on the site.

---

## shared.auth-session.US8: Operator signs in to the console once more after release

**As an** operator who was signed in to the console before release,
**I want** to be asked to sign in to the console again,
**so that** no console session rests on a sign-in made for the site.

### shared.auth-session.US8-TC1: After release, the console asks its operator to sign in once more

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-session-US-08

**Pre-conditions:**

* `<operator account>` held a session from before the release, open on the site and on the console; the release is live.

**Steps:**

1. Open `<console url>`.
2. Sign in on `<console url>` with the current second-factor code.

**Expected Results:**

* Step 1 shows the console's sign-in page, not the console.
* Step 2 opens the console.

### shared.auth-session.US8-TC2: After release, site sessions carry on

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-session-US-08

**Pre-conditions:**

* The row's account held a session on `<g10url>` from before the release; the release is live.

**Test data:**

| Account |
| --- |
| `<operator account>` |
| `<collector A>` |

**Steps:**

1. Open `<g10url>`.

**Expected Results:**

* The row's account is signed in, without a new sign-in.

## Settled

* Moderating an account (a ban) deciding whether it ends the account's open
  sessions is moderation's own decision; an open tab keeps up with whatever
  the session does either way.
* Whether an arriving collector's session may use a console is the console's
  own rule, not this capability's.
* Whether the console's sign-in shows its own page when signed out is settled by the sign-out and release scenarios: a signed-out console asks for the sign-in, and for the second factor as for any operator.
* The sign-in under 15 minutes old that setting up a second factor asks for is the platform's existing rule for enrolling when an operator has no second factor; the case reads the console session's own age.
* A session an operator held before release stays a live site session and is listed as one; only the console stops honouring it.

## Reconciliation

**Run:** QA2, 2026-10-06, in a fresh context. QA1's blind pass read the Purpose and Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` (its `## Raised` was empty), the Session page and the sign-in, sign-out and sessions pages beside it, the durable suite for id continuity and `shared/auth/domain-tcs.md`, and was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read both readings, `decisions.md`, `tech-design.md`, `tasks.md`, the four deltas, the durable suite, the Session page and the platform's admin-access page. It is a statement, not proof. No case of this change has been accepted or published, so a draft keeps its `<v>` when it is reworded.

- **Agreed** - `shared-auth-session-US7-TC1-1` with `shared-auth-session-SC-27` and `shared-auth-session-SC-39`; `shared-auth-session-US7-TC2-1` with `shared-auth-session-SC-28`; `shared-auth-session-US7-TC3-1` with `shared-auth-session-SC-30`; `shared-auth-session-US7-TC4-1` with `shared-auth-session-SC-31` and `shared-auth-session-SC-32`; `shared-auth-session-US7-TC5-1` with `shared-auth-session-SC-35`; `shared-auth-session-US7-TC6-1` with `shared-auth-session-SC-36` and the sign-in and second factor of `shared-auth-session-SC-37`; `shared-auth-session-US8-TC1-1` with `shared-auth-session-SC-37`; `shared-auth-session-US8-TC2-1` with `shared-auth-session-SC-38`; `shared-auth-session-US2-TC3-1` with `shared-auth-session-SC-29` read on the console
- **Adjusted, by QA2** - `shared-auth-session-US7-TC1-1` now holds a console tab open in the background and reads it unreloaded and then reloaded, joining the open-tab assertion of `shared-auth-session-SC-39` to the open-the-console route of `shared-auth-session-SC-27`, and runs once per row for Grade10 and ZZZ, which absorbs QA1's `US7-TC11-1`, the same steps on another brand; `shared-auth-session-US7-TC2-1` joins QA1's `US7-TC9-1` the same way, a site tab open signed out and read unreloaded before the reload; `shared-auth-session-US7-TC3-1` joins QA1's `US7-TC10-1`, signing the second account in on the console and reading the site tab's person and cart afterwards; `shared-auth-session-US7-TC5-1` names the action `shared-auth-session-SC-35` states, setting up a second factor, the 15-minute window and the refusal that asks them to sign in to the console again, in place of QA1's placeholders, since the platform's admin-access page already states the rule for an operator with no second factor; `US7-TC1-1`, `US7-TC2-1` and `US7-TC5-1` no longer all carry the smoke suite, a journey holding at most one
- **Adjusted, by QA2, a case revised** - `shared-auth-session-US2-TC1-2` carries the durable `US2-TC1-1`'s `trace:case` marker at `rev=2`, since the durable case's title and claim said every site of the brand; its covers list still names the retired shared-auth-session-SC-03 and shared-auth-session-SC-04 and is re-pointed by the trace CLI when the new scenario markers are allocated. It walks the new `shared-auth-session-SC-41`, which QA2 added to the delta because a case stated a sign-in covering the site's other pages and no scenario did
- **Raised, folded into spec** - the page-to-page walk above, as `shared-auth-session-SC-41`; QA1's console-request refusals, which no case could walk through a signed-out console, as the api cases `shared-auth-session-US7-TC8-1` for `shared-auth-session-SC-33` and `shared-auth-session-SC-34` and `shared-auth-session-US7-TC9-1` for the refusal of `shared-auth-session-SC-36`, and a console tab following its own session, which no QA1 case asserted, as `shared-auth-session-US7-TC7-1` for `shared-auth-session-SC-40`
- **Raised, rejected** - QA1's `US7-TC7-1` and `US7-TC8-1`, a console sign-out leaving a site tab and the reverse, are `shared-auth-sign-out-US3-TC1-1` and `shared-auth-sign-out-US3-TC2-1`: the sign-out capability's scenarios state them and the one case owns it. Their one extra assertion, that the other tab raises no message, joined those cases. QA1's `US7-TC11-1` is a row of `US7-TC1-1`, and `US7-TC9-1` and `US7-TC10-1` are joined as above
- **Raised, settled by the artifacts** - the recent sign-in window and the action that asks for it (the platform's admin-access page and `shared-auth-session-SC-35`); whether a signed-out console shows its own sign-in page (the sign-out and release scenarios); whether the console asks for the sign-in or the second factor first at release (`shared-auth-session-SC-37`, the sign-in); what happens to an operator's pre-release shared session (decisions Q3 and `shared-auth-session-SC-38`: it stays a site session). Each is in `## Settled`; none goes to `decisions.md`
- **Raised, settled by the artifacts** - how long the console's session lasts against the site's: the change moves no timing (decisions Non-Goals, `tech-design.md` Non-Goals) and gives the console instance the site's configuration with only the cookie prefix changed (D1), so the console's session lasts as long as the site's does today; the lifetime itself is an existing open line of the Session page (How Long It Lasts), outside this change. The cases name no lifetime, and no row goes to `decisions.md`
- **Left to the durable cases** - `shared-auth-session-SC-01` and `shared-auth-session-SC-02`, which only gained the surface a read is made from: `US1-TC1-1` and `US1-TC2-1` still verify them and are left as they are, since the product they read from sits on one surface; `shared-auth-session-SC-11` to `shared-auth-session-SC-18`, `shared-auth-session-SC-22` and `shared-auth-session-SC-23`, which only name the surface in their wording: `US4-TC1-1` to `US4-TC7-1`, `US4-TC9-1` to `US4-TC11-1` and `US5-TC1-1` to `US5-TC5-1` still verify them, every `actual` one left `actual` because the wording moved nothing they assert, and `US7-TC4-1` adds the surface that runs out. `US4-TC11-1`'s tab B does not say which surface it signs in on; it holds on either and is left for the review to name. `shared-auth-session-SC-29` is left to the durable `US2-TC2-1`, which signs in on a Grade10 page and opens a ZZZ one
- **Covered at domain** - `shared-auth-session-SC-41`'s site sign-in across pages is walked by `shared.auth-dmn.US2-TC1`, which still holds with the site as the surface; the console-against-site lifecycle across session, sign-in, sign-out and sessions is a draft domain case in this change's `domain-tcs.md` (`shared.auth-dmn.US8-TC1`), which walks the two sessions started, listed, signed out and ended together by an admin; a ban ending both and the console's release re-sign-in stay with the capabilities' own cases; `shared-auth-session-US-02`'s story is read as the site only, and the domain story `shared-auth-e2e-US2` no longer promises the console, since `shared.auth-dmn.US2-TC1` is a durable actual case this change does not touch
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-auth-session-US-02` has `US2-TC1-2`, `US2-TC3-1` and the durable `US2-TC2-1`; `shared-auth-session-US-07` has `US7-TC1-1` to `US7-TC9-1`; `shared-auth-session-US-08` has `US8-TC1-1` and `US8-TC2-1`; every scenario from `shared-auth-session-SC-27` to `shared-auth-session-SC-41` is reached
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk, and `US2-TC1-2` already carries its revised marker
