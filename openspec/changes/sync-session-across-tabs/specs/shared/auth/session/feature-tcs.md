# shared/auth/session Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## Background

* Every tab a case names is open in one browser on one device, unless the case names another device.
* A tab is returned to as the person left it, never reloaded.

## shared-auth-session-US4: Collector returns to a tab they left and it knows they signed in

**As a** collector,
**I want** the tab I left behind to know I signed in somewhere else,
**so that** I do not reload it or ask for a second link to get back to what I was doing.

### shared-auth-session-US4-TC1-1: Tab left open shows the collector signed in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with tab A open on <grade10 store url>.
* Tab A is in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.
* Nothing in tab A is reloaded to get there.

### shared-auth-session-US4-TC2-1: Every open tab of the brand picks the session up

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out.
* Tabs A and B are open on <grade10 store url>, tab C on <grade10 auction url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> in tab D.
2. Return to tabs A, B and C in turn.

**Expected Results:**

* Each of tabs A, B and C shows the collector signed in.

### shared-auth-session-US4-TC3-1: Another brand's tab stays signed out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out on both brands.
* Tab A is open on <zzz store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> on Grade10 in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still shows nobody signed in.

### shared-auth-session-US4-TC4-1: Another device's tab stays signed out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out on a phone and on a desktop.
* The phone has a tab open on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> on the desktop.
2. Return to the phone's tab.

**Expected Results:**

* The phone's tab still shows nobody signed in.

### shared-auth-session-US4-TC5-1: Restored tab shows the session that arrived

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with tab A open on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<tab state>` | How tab A is left |
| --- | --- |
| back-forward cache | navigated away in tab A, then back to <grade10 store url> |
| discarded | left until the browser discards tab A, then reopened |

**Steps:**

1. Leave tab A in <tab state>.
2. Sign in as <collector email> in tab B.
3. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.

### shared-auth-session-US4-TC6-1: Tab kept visible throughout is not left stale

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with window A on <grade10 store url> beside window B on the same site.
* Window A stays visible and untouched throughout.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> in window B.
2. Watch window A without touching it.

**Expected Results:**

* Window A shows the collector signed in.

### shared-auth-session-US4-TC7-1: Surface naming no person still carries the session

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
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with tab A open on <grade10 page naming no person>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> in tab B.
2. Return to tab A.
3. Open the cart from tab A.

**Expected Results:**

* Tab A opens the collector's own cart.
* Tab A does not ask them to sign in.

### shared-auth-session-US4-TC8-1: Nothing is announced when the session arrives

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with tab A open on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.
* Tab A raises no toast or message about the session.

### shared-auth-session-US4-TC9-1: Failed link follow leaves the other tab signed out

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
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed out, with tab A open on <grade10 store url>.
* An expired sign-in link for <collector email> is to hand.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the expired link in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still shows nobody signed in.
* Tab A raises no message about the link.

### shared-auth-session-US4-TC10-1: Tab that cannot read the session keeps what it last knew

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* customer is signed in as <collector email>, with tab A open on <grade10 store url>.
* Tab A is under <read failure>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

| `<read failure>` | How it is produced |
| --- | --- |
| session read errors | the session read is mocked to return a 500 for tab A |
| device offline | network conditions are manipulated to take tab A offline |

**Steps:**

1. Leave tab A and return to it, so it reads the session again.

**Expected Results:**

* Tab A still shows the collector signed in.
* Tab A does not show them signed out.

### shared-auth-session-US4-TC11-1: Console tab proves the second factor before showing anything

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* admin is signed out, with tab A open on <grade10 admin url>.
* The second factor is not proved in this browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, an address with a console account |

**Steps:**

1. Sign in as <operator email> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows no console surface.
* The arriving session alone unlocks nothing.

---

## shared-auth-session-US5: Collector returns to a tab they left and it knows they signed out

**As a** collector,
**I want** the tab I left behind to know my session has ended,
**so that** it stops offering me things every request behind it would refuse.

### shared-auth-session-US5-TC1-1: Tab left open shows the collector signed out

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in on Grade10, with tab A open on <grade10 store url>.
* Tab A is in the background.

**Steps:**

1. Sign out in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.
* Tab A offers no signed-in surface.

### shared-auth-session-US5-TC2-1: A session that ran out reads as one they ended

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in on Grade10, with tab A open on <grade10 store url>.
* The session is seeded to run out while tab A is in the background.

**Steps:**

1. Wait until the session has run out.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.

### shared-auth-session-US5-TC3-1: Ended session takes the person's things off the tab

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in on Grade10 with <listing> in their cart.
* Tab A is open on <grade10 store url>, showing the cart count.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | a card listing in the collector's cart |

**Steps:**

1. Sign out in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows none of that person's cart, watchlist or orders.

### shared-auth-session-US5-TC4-1: Every open tab of the brand shows signed out

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in on Grade10.
* Tabs A and B are open on <grade10 store url>, tab C on <grade10 auction url>.

**Steps:**

1. Sign out in tab D.
2. Return to tabs A, B and C in turn.

**Expected Results:**

* Each of tabs A, B and C shows nobody signed in.

### shared-auth-session-US5-TC5-1: Two changes before the return show the last one

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
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed out, with tab A open on <grade10 store url>, in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Sign in as <collector email> in tab B.
2. Sign out in tab B.
3. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.

### shared-auth-session-US5-TC6-1: Signing out here does not sign out another browser

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
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in as the same person on a phone and on a desktop.
* The phone has a tab open on <grade10 store url>.

**Steps:**

1. Sign out on the desktop.
2. Return to the phone's tab.

**Expected Results:**

* The phone's tab still shows the collector signed in.

### shared-auth-session-US5-TC7-1: Signing out of one brand leaves the other brand alone

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
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in on Grade10 and on ZZZ in one browser.
* Tab A is open on <zzz store url>.

**Steps:**

1. Sign out of Grade10 in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still shows the collector signed in on ZZZ.

### shared-auth-session-US5-TC8-1: Nothing is announced when the session ends

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in on Grade10, with tab A open on <grade10 store url>.

**Steps:**

1. Sign out in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.
* Tab A raises no toast or message about the session.

### shared-auth-session-US5-TC9-1: Tab sitting on a signed-in-only page when the session ends

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-session-US-05

**Pre-conditions:**

* customer is signed in on Grade10, with tab A open on <signed-in-only page>.

**Test data:**

| Field | Value |
| --- | --- |
| `<signed-in-only page>` | the collector's orders list, which only they may read |

**Steps:**

1. Sign out in tab B.
2. Return to tab A.
3. Dismiss the sign-in ask.

**Expected Results:**

* Tab A shows none of that person's orders.
* Tab A asks the collector to sign in, exactly as it does when that address is opened with no session.
* Dismissing the ask leaves tab A on the front door.

## shared-auth-session-US6: Collector who signs in after somebody else sees their own things

**As a** collector signing in on a browser somebody else has just used,
**I want** every open tab to show me, with my own cart, watchlist and orders,
**so that** I never act on the last person's things and they never see mine.

### shared-auth-session-US6-TC1-1: Tab shows whoever is signed in now

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10, with tab A open on <grade10 store url>, in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector B email>` | collector-b@example.com, a second address with an account |

**Steps:**

1. Sign in as <collector B email> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A names collector B as the person signed in.
* Tab A names collector A nowhere.

### shared-auth-session-US6-TC2-1: What the tab shows about the person is theirs

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10, with tab A open on <per-person surface>.
* collector A and collector B each hold different items on that surface.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector B email>` | collector-b@example.com, a second address with an account |

| `<per-person surface>` | What it holds |
| --- | --- |
| the cart | <listing>, which only collector A has added |
| the watchlist | a lot only collector A is watching |
| the orders list | an order only collector A has placed |

**Steps:**

1. Sign in as <collector B email> in tab B.
2. Return to tab A.

**Expected Results:**

* <per-person surface> shows collector B's own items.
* It shows none of collector A's.

### shared-auth-session-US6-TC3-1: Previous person's cart is never shown to the new one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10 with <listing> in their cart.
* Tab A is open on <grade10 store url>, showing the cart count.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | a card listing only collector A has added |
| `<collector B email>` | collector-b@example.com, a second address with an account |

**Steps:**

1. Sign in as <collector B email> in tab B.
2. Return to tab A.
3. Open the cart in tab A.

**Expected Results:**

* <listing> is in no cart tab A shows.
* At no point does tab A show <listing> under collector B.

### shared-auth-session-US6-TC4-1: Per-person data still loading when the person changes

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10, with tab A open on the cart.
* Tab A's cart read is held open by manipulated network conditions.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | a card listing only collector A has added |
| `<collector B email>` | collector-b@example.com, a second address with an account |

**Steps:**

1. Sign in as <collector B email> in tab B.
2. Release collector A's held cart read.
3. Return to tab A.

**Expected Results:**

* Tab A shows collector B's cart.
* <listing> never appears in it.

### shared-auth-session-US6-TC5-1: Same person signing in again keeps the tab theirs

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
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10 with <listing> in their cart.
* Tab A is open on <grade10 store url>, in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing>` | a card listing only collector A has added |
| `<collector A email>` | collector-a@example.com, collector A's address |

**Steps:**

1. Sign in as <collector A email> again in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still names collector A as signed in.
* <listing> is still in their cart.

### shared-auth-session-US6-TC6-1: Every open tab of the brand shows the new person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10.
* Tabs A and B are open on <grade10 store url>, tab C on <grade10 auction url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector B email>` | collector-b@example.com, a second address with an account |

**Steps:**

1. Sign in as <collector B email> in tab D.
2. Return to tabs A, B and C in turn.

**Expected Results:**

* Each of tabs A, B and C names collector B.
* None of them names collector A.

### shared-auth-session-US6-TC7-1: Another device stays with the person signed in there

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
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on a phone and on a desktop.
* The phone has a tab open on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector B email>` | collector-b@example.com, a second address with an account |

**Steps:**

1. Sign in as <collector B email> on the desktop.
2. Return to the phone's tab.

**Expected Results:**

* The phone's tab still names collector A.

### shared-auth-session-US6-TC8-1: Page holding one person's record does not stay on screen

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10, with tab A open on <collector A order>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector A order>` | the page of an order only collector A placed |
| `<collector B email>` | collector-b@example.com, a second address with an account |

**Steps:**

1. Sign in as <collector B email> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows collector B none of that order.

### shared-auth-session-US6-TC9-1: Nothing is announced when the person changes

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-06

**Pre-conditions:**

* customer A is signed in on Grade10, with tab A open on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector B email>` | collector-b@example.com, a second address with an account |

**Steps:**

1. Sign in as <collector B email> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A names collector B.
* Tab A raises no toast or message about the change.

---

## Raised

* **A tab nobody returns to** — the freshness bound is "no later than when the person returns to it". Nothing says what a tab kept visible and untouched shows, or whether a tab that is never returned to may stay stale indefinitely.
* **A session read that fails** — nothing places a failed or offline read on either side: the tab keeps what it showed, shows signed out, or retries.
* **A ban landing on an open session** — the input says a banned account's link follow creates no session, and says nothing about a ban that lands while a session is open, or what an open tab then shows.
* **A signed-in-only page under the person who left** — when the session ends or becomes somebody else while a tab sits on the orders list or one order's page, nothing says where that tab goes: refusal, brand home, or the page emptied.
* **The console tab beyond the second factor** — the input says a console tab proves the second factor before showing anything. It does not say what happens when the arriving session is a collector with no console access at all.
* **Same person, new session** — person A → person A is never named. The suite assumes the tab carries on unchanged; nothing decides whether per-person data is read again.
* **How many times the tab may act** — the input says the surface carries on. It does not say the completion happens once, which is the risk when two tabs asked or the person presses again.

## Reconciliation

**Run:** 2026-09-15 · two independent readings of the same anchors · isolated input `1bdd004470a0c9d4` · the suite pass read no `## Requirements`, no `openspec/specs/` beyond Purpose and Feature set, and nothing under `openspec/changes/archive/`.

* **Raised, escalated → folded into spec** — *A session read that fails*. The largest hole the blind pass found, and nobody had decided it: a wrong answer here signs people out on a flaky network. The author settled it — a surface that cannot reach the service goes on showing what it last knew, and only an answer that nobody is signed in signs it out. Folded as a new requirement with `shared-auth-session-SC-25` and `SC-26`. `US4-TC10-1` was recast onto the direction that bites: a signed-in tab whose read fails must stay signed in, which the original case did not exercise.
* **Raised, escalated → folded into spec** — *A tab nobody returns to*. The freshness bound was keyed on returning, so it said nothing about a tab kept visible — the two-monitor case the change's own story lives in. Settled as keeping up promptly for a surface of the same site whether the person left it or not, with the return bound standing everywhere else. Folded into the keeping-up requirement and `shared-auth-session-SC-22`; `US4-TC6-1` unblocked.
* **Raised, escalated → folded into spec** — *A signed-in-only page under the person who left*. Settled as answering exactly as that surface answers somebody arriving with no session, so nothing new is invented for a state that already has an answer. Folded as `shared-auth-session-SC-24`; `US5-TC9-1` unblocked and given the ask-then-front-door expectation.
* **Raised, escalated → folded into spec** — *Same person, new session*. Never named in the state list. Settled as nothing visibly changing, and folded as `shared-auth-session-SC-23` so a tab cannot flicker through signed-out on the way. Walked by `US6-TC5-1`.
* **Raised, out of scope** — *A ban landing on an open session*. Whether moderating an account ends the sessions it already holds is moderation's decision, not this change's; an open tab keeps up with whatever the session does either way. `US5-TC10-1` was dropped and the boundary recorded as a non-goal on the proposal.
* **Raised, out of scope** — *The console tab beyond the second factor*. Whether an arriving collector session may use a console is the console's own rule. Recorded as a non-goal; `US4-TC11-1` keeps the second-factor expectation the proposal already states.
* **Raised, escalated → folded into spec** — *How many times the tab may act*. Recorded here because this capability's pass raised it; the rule landed in `shared/auth/sign-in` as `SC-57`, since carrying an action on is that capability's.
* **Adjudicated** — the scenario reading extended per-person data to a session that *ends*, not only one that changes hands. Kept, because a signed-out surface showing that person's orders is the same defect — but the requirement now says in terms that ceasing to show is not the surface-owned cleanup a confirmed sign-out runs, which stays `shared/auth/sign-out`'s. Without that sentence the two capabilities contradict each other on a session that merely ran out.
* **Uncovered anchors** — none.
* **Contradicted** — none.
