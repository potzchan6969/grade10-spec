# shared/auth/session Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (api):** shared-auth-session-SC-34
**Out of suite (non-GUI):** shared-auth-session-SC-07, shared-auth-session-SC-08, shared-auth-session-SC-10

## Background

* `<g10url>` is the Grade10 site, `<zzz url>` the ZZZ site and `<console url>` the Grade10 console of the environment under test.
* Who the site names on its pages is walked in the page shell's suite; these cases hold the session's own flows across tabs, devices, brands and the console.
* Every tab a case names is open in one browser on one device unless the case names another. A tab is returned to as it was left, never reloaded unless a step says so, and raises no toast or message about the session.
* `<collector A>` and `<collector B>` hold `user` only; `<operator account>` holds console access, with an authenticator for its second factor.

## Walk 1: Tabs keep up with whoever is signed in

Starting state:

- customer signed out on `<g10url>`, tab A in the background and tab B in front.

Shared test data:

| Field | Value |
| --- | --- |
| collector A | an account with a card it can add to the cart |

### Route

1. In tab B, sign in as `<collector A>` and add a card to the cart; return to tab A.
   - Tab A shows `<collector A>` signed in. `shared.auth-session.US4-TC1`
2. In tab B, sign out; return to tab A.
   - Nobody signed in, none of the cart. `shared.auth-session.US5-TC1`
3. In tab B, sign in as `<collector B>`; return to tab A.
   - `<collector B>`, with none of `<collector A>`'s cart. `shared.auth-session.US6-TC1`

## Walk 2: An operator keeps the site and the console apart

Starting state:

- `<operator account>` signed out on both; tab A on `<g10url>`, tab B on `<console url>` in the background.

Shared test data:

| Field | Value |
| --- | --- |
| operator account | as in the Background |

### Route

1. In tab A, sign in on the site; return to tab B.
   - Still the console's sign-in page. `shared.auth-session.US7-TC1`
2. In tab B, sign in with the second factor; return to tab A.
   - Tab A unchanged, signed in on the site. `shared.auth-session.US7-TC1`

## shared.auth-session.US2: Collector stays signed in across the brand

**As a** collector,
**I want** one sign-in to cover this brand's site and none of another brand,
**so that** I do not sign in twice on the same brand or leak into the other.

<!-- trace:case id=g10.shared-session.TC-lcn rev=2 -->
### shared.auth-session.US2-TC2: A console sign-in reaches no other brand's console

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

* admin is signed in on `<console url>`, with the second factor proved.

**Steps:**

1. Open the ZZZ console.

**Expected Results:**

* It shows the ZZZ console's sign-in page.

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
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with `<tabs>` open on `<g10url>`.

**Test data:**

| `<tabs>` | `<left>` |
| --- | --- |
| tab A on the store | in the background |
| tabs A and B on the store, tab C on the auction | in the background |
| tab A on the store | navigated away, then brought back with Back |
| tab A on the store | discarded by the browser, then selected again |
| window A on the store | in view beside the window signing in, never touched |
| tab A on a page naming no person | in the background; then its cart is opened |

**Steps:**

1. Sign in as `<collector A>` in another tab.
2. Return to each of `<tabs>`.

**Expected Results:**

* Each shows `<collector A>` signed in without a reload; a cart opened from it is `<collector A>`'s, with no sign-in asked.

<!-- trace:case id=g10.shared-session.TC-qc6 rev=2 -->
### shared.auth-session.US4-TC2: A tab keeps what it showed when the sign-in is not its own, or the session cannot be read

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Open tabs

**Pre-conditions:**

* customer is `<before>`, with `<tab>` open.

**Test data:**

| `<before>` | `<tab>` | `<then>` | `<tab shows>` |
| --- | --- | --- | --- |
| signed out everywhere | on `<zzz url>`, same browser | sign in as `<collector A>` on `<g10url>` | nobody signed in |
| signed out everywhere | on `<g10url>`, another browser profile | sign in as `<collector A>` on `<g10url>` in this browser | nobody signed in |
| signed out everywhere | on `<g10url>`, on a phone | sign in as `<collector A>` on a desktop | nobody signed in |
| signed out everywhere | on `<g10url>`, same browser | follow an expired link for `<collector A>` in another tab | nobody signed in, no message about the link |
| signed in as `<collector A>` | on `<g10url>`, its session read answering with an error | leave the tab and return | `<collector A>`, no signed-out state |
| signed in as `<collector A>` | on `<g10url>`, its device offline | leave the tab and return | `<collector A>`, no signed-out state |
| signed in as `<collector A>` | on `<g10url>`, its connection to the auth service cut | leave the tab and return | `<collector A>`, no signed-out state |

**Steps:**

1. `<then>`.
2. Return to `<tab>`; for a failure row, restore the connection and return again.

**Expected Results:**

* Each time `<tab>` shows `<tab shows>`.

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

* admin is signed out, tab A open on `<console url>`; no second factor is proved in this browser.

**Steps:**

1. In tab B, sign in as `<operator account>` on `<console url>`, entering no code.
2. Return to tab A.

**Expected Results:**

* Tab A shows no console: only a sign-in page or a second-factor ask.

---

## shared.auth-session.US5: Collector returns to a tab they left and it knows they signed out

**As a** collector,
**I want** the tab I left behind to know my session has ended,
**so that** it stops offering me things every request behind it would refuse.

<!-- trace:case id=g10.shared-session.TC-5wd rev=2 -->
### shared.auth-session.US5-TC1: A tab left open shows signed out once the session ends, with none of the person's things

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
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in as `<collector A>`, a card in the cart, with `<tabs>` open on `<g10url>` in the background.

**Test data:**

| `<tabs>` | `<ends by>` |
| --- | --- |
| tab A on the store | sign out in another tab |
| tabs A and B on the store, tab C on the auction | sign out in another tab |
| tab A on the store | the session running out |
| tab A on the store, opened while signed out | sign in, then sign out, in another tab |
| tab A on `<collector A>`'s orders list | sign out in another tab; then dismiss the sign-in ask |

**Steps:**

1. End the session by `<ends by>`.
2. Return to each of `<tabs>`.

**Expected Results:**

* Each shows nobody signed in, with none of `<collector A>`'s cart, watchlist or orders.
* The orders tab asks for sign-in as that address does with no session; dismissing it leaves the tab on the front door.

<!-- trace:case id=g10.shared-session.TC-u40 rev=2 -->
### shared.auth-session.US5-TC2: Signing out leaves another device and the other brand signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in as `<collector A>` on `<out of>` and `<still in>`.

**Test data:**

| `<out of>` | `<still in>` |
| --- | --- |
| `<g10url>` on a desktop | `<g10url>` on a phone |
| `<g10url>` | `<zzz url>`, same browser |

**Steps:**

1. Sign out of `<out of>`, and return to `<still in>`.

**Expected Results:**

* `<still in>` still shows `<collector A>` signed in.

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
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer is signed in as `<collector A>`, who has a card in the cart, a watched listing and an order; `<tabs>` are open on `<g10url>`.

**Test data:**

| `<tabs>` | `<next>` | `<shown>` |
| --- | --- | --- |
| tab A on the store, in the background | `<collector B>` | `<collector B>`, `<collector A>` named nowhere |
| tabs A and B on the store, tab C on the auction | `<collector B>` | `<collector B>` on each |
| tab A on the cart | `<collector B>` | `<collector B>`'s cart, never `<collector A>`'s card |
| tab A on the watchlist | `<collector B>` | `<collector B>`'s watchlist only |
| tab A on the orders list | `<collector B>` | `<collector B>`'s orders only |
| tab A on `<collector A>`'s order page | `<collector B>` | none of that order |
| tab A on the cart, its cart read held in flight, then released | `<collector B>` | `<collector B>`'s cart; `<collector A>`'s card never appears |
| tab A on the store, in the background | `<collector A>` again | `<collector A>`, the card still in the cart |

**Steps:**

1. Sign in as `<next>` in another tab.
2. Return to each of `<tabs>`.

**Expected Results:**

* Each shows `<shown>`, with no toast or message about the change.

<!-- trace:case id=g10.shared-session.TC-3j4 rev=1 -->
### shared.auth-session.US6-TC2: Another device stays with the person signed in there

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer is signed in as `<collector A>` on a phone and a desktop; the phone has a tab open on `<g10url>`.

**Steps:**

1. Sign in as `<collector B>` on the desktop, and return to the phone's tab.

**Expected Results:**

* The phone's tab still names `<collector A>`.

---

## shared.auth-session.US7: Operator holds a console session apart from their site session

**As an** operator,
**I want** the admin console and the site to keep separate sign-ins that end on their own,
**so that** a site sign-in never opens the console and leaving the site signed in never leaves the console open.

<!-- trace:case id=g10.shared-session.TC-v6y rev=1 -->
### shared.auth-session.US7-TC1: Signing in on one side brings that side's tabs along and leaves the other as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* `<before>`; a tab of each side is open in the background.

**Test data:**

| `<before>` | `<signed in on>` | `<same side's tab>` | `<other side's tab>` |
| --- | --- | --- | --- |
| signed out of both, Grade10 | the site, as `<operator account>` | signed in | the console's sign-in page, before and after a reload |
| signed out of both, ZZZ | the ZZZ site, as a ZZZ operator | signed in | the ZZZ console's sign-in page |
| signed out of both, Grade10 | the console, as `<operator account>` with the second factor | the console, signed in | the site, nobody signed in, before and after a reload |
| `<collector A>` on the site, a card in the cart | the console, as `<operator account>` with the second factor | the console, signed in | the site, still `<collector A>` with the card, nothing of the operator |

**Steps:**

1. Sign in on `<signed in on>` in a third tab.
2. Return to the same side's tab, then the other side's; reload the other.

**Expected Results:**

* The same side's tab shows `<same side's tab>` without a reload; the other shows `<other side's tab>`.

<!-- trace:case id=g10.shared-session.TC-pil rev=1 -->
### shared.auth-session.US7-TC2: A session that runs out leaves the other side signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* `<operator account>` is signed in on `<g10url>` in tab A and `<console url>` in tab B; `<ran out>` has run out and the other has not.

**Test data:**

| `<ran out>` | `<signed out>` | `<still in>` |
| --- | --- | --- |
| the site's | tab A | tab B, the console |
| the console's | tab B | tab A, the site |

**Steps:**

1. Return to tab A, then tab B.

**Expected Results:**

* `<signed out>` shows signed out and `<still in>` signed in, without a reload.

<!-- trace:case id=g10.shared-session.TC-tab rev=1 -->
### shared.auth-session.US7-TC3: The console asks for its own second factor and a recent console sign-in, never the site's

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

* `<operator account>` signed in on `<g10url>` in tab A just now; the console is `<console>`.

**Test data:**

| `<console>` | `<in tab B>` | `<shown>` |
| --- | --- | --- |
| signed out; no second factor proved in this browser | sign in on `<console url>`, entering no code | a second-factor ask, not the console; the current code opens it |
| signed in over 15 minutes ago, no second factor set | set up a second factor | refused, asking to sign in to the console again; none is set |

**Steps:**

1. Do `<in tab B>`.

**Expected Results:**

* It shows `<shown>`.

---

## shared.auth-session.US8: Operator signs in to the console once more after release

**As an** operator who was signed in to the console before release,
**I want** to be asked to sign in to the console again,
**so that** no console session rests on a sign-in made for the site.

<!-- trace:case id=g10.shared-session.TC-j3l rev=1 -->
### shared.auth-session.US8-TC1: After release, the console asks its operator to sign in once more

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-08

**Pre-conditions:**

* `<operator account>` held a session from before the release, open on the site and the console; the release is live.

**Steps:**

1. Open `<console url>`.
2. Sign in there with the current second-factor code.

**Expected Results:**

* Step 1 shows the console's sign-in page, not the console; step 2 opens it.

<!-- trace:case id=g10.shared-session.TC-8ev rev=1 -->
### shared.auth-session.US8-TC2: After release, site sessions carry on

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-08

**Pre-conditions:**

* `<account>` held a session on `<g10url>` from before the release; the release is live.

**Test data:**

| `<account>` |
| --- |
| `<operator account>` |
| `<collector A>` |

**Steps:**

1. Open `<g10url>`.

**Expected Results:**

* `<account>` is signed in, with no new sign-in.

## Settled

* Whether a ban ends the account's open sessions is moderation's decision; an open tab follows whatever the session does.
* Whether an arriving collector's session may use a console is the console's own rule.
* A signed-out console asks for its sign-in, and the second factor as for any operator.
* Setting up a second factor needs a console sign-in under 15 minutes old, read from the console session's own age.
* A session held before release stays a live site session, listed as one; only the console stops honouring it.

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US2-TC1` walks one sign-in covering the store and the auction and reaching no other brand; `shared.auth-dmn.US8-TC1` walks an operator's site and console sessions starting and ending apart
