# shared/auth/session Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-23, tcs-rules r3.0

## Background

* Every tab a case names is open in one browser on one device, unless the case names another device.
* A tab is returned to as the person left it, never reloaded.

## shared-auth-session-US1: Collector is named on every surface they use

**As a** collector,
**I want** a signed-in read to report my id, email, name, and roles, and a signed-out read to report nobody,
**so that** every surface of this brand knows it is me, or that I have not signed in.

<!-- trace:case id=g10.shared-session.TC-frz rev=1 covers=g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6 -->
### shared-auth-session-US1-TC1-1: Signed-in read names id, email, name and roles

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-01

**Pre-conditions:**

* customer is signed in on <grade10 store url>.

**Steps:**

1. Ask a Grade10 product who is calling.

**Expected Results:**

* The product receives that person's user id, email, name, and roles.

<!-- trace:case id=g10.shared-session.TC-u5z rev=1 covers=g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6 -->
### shared-auth-session-US1-TC2-1: Signed-out read reports no person

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-01

**Pre-conditions:**

* customer is not signed in on <grade10 store url>.

**Steps:**

1. Ask a Grade10 product who is calling.

**Expected Results:**

* The product receives no person.

<!-- trace:case id=g10.shared-session.TC-yh6 rev=1 covers=g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6 -->
### shared-auth-session-US1-TC3-1: Another person is asked for by user id

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
* **Trace:** shared-auth-session-US-01

**Pre-conditions:**

* customer is on a Grade10 surface that names another person.

**Steps:**

1. Open the surface that shows that other person.

**Expected Results:**

* The product asks for that person by user id.

<!-- trace:case id=g10.shared-session.TC-3ba rev=1 covers=g10.shared-session.SC-xll,g10.shared-session.SC-yja,g10.shared-session.SC-4uk,g10.shared-session.SC-ol8,g10.shared-session.SC-qd6 -->
### shared-auth-session-US1-TC4-1: Client cannot claim a user on an anonymous event

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-01

**Pre-conditions:**

* customer is not signed in on <grade10 store url>.

**Steps:**

1. Submit an analytics event that names a user id.

**Expected Results:**

* The recorded event is not attributed to that user id.

---

## shared-auth-session-US2: Collector stays signed in across the brand

**As a** collector,
**I want** one sign-in to cover every site of this brand and none of another,
**so that** I do not sign in twice on the same brand or leak into the other.

<!-- trace:case id=g10.shared-session.TC-4vh rev=1 covers=g10.shared-session.SC-pre,g10.shared-session.SC-hvi -->
### shared-auth-session-US2-TC1-1: One sign-in covers every site of the brand

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
* **Trace:** shared-auth-session-US-02

**Pre-conditions:**

* customer is signed in on <grade10 store url>.

**Steps:**

1. Open <grade10 auction url>.

**Expected Results:**

* They are signed in as the same person.

<!-- trace:case id=g10.shared-session.TC-lcn rev=1 covers=g10.shared-session.SC-pre,g10.shared-session.SC-hvi -->
### shared-auth-session-US2-TC2-1: Sign-in does not cross brands

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
* **Trace:** shared-auth-session-US-02

**Pre-conditions:**

* customer is signed in on <grade10 store url>.

**Steps:**

1. Open <zzz store url>.

**Expected Results:**

* They are not signed in there.

---

## shared-auth-session-US3: Collector's visits are named as them, not as a device

**As a** collector,
**I want** a signed-in event to name me and an anonymous event to name the device,
**so that** analytics does not mix my account with a browser I have not signed in on.

<!-- trace:case id=g10.shared-session.TC-c3g rev=1 covers=g10.shared-session.SC-h04,g10.shared-session.SC-nhr,g10.shared-session.SC-4e0 -->
### shared-auth-session-US3-TC1-1: Signed-in event is attributed to the user id

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-03

**Pre-conditions:**

* customer is signed in on <grade10 store url>.

**Steps:**

1. Trigger a product analytics event for that visit.

**Expected Results:**

* The event is attributed to that person's user id.

<!-- trace:case id=g10.shared-session.TC-luw rev=1 covers=g10.shared-session.SC-h04,g10.shared-session.SC-nhr,g10.shared-session.SC-4e0 -->
### shared-auth-session-US3-TC2-1: Anonymous event is attributed to the device

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-03

**Pre-conditions:**

* customer is not signed in on <grade10 store url>.

**Steps:**

1. Trigger a product analytics event for that visit.

**Expected Results:**

* The event is attributed to the device.
* It is not attributed to a user id.

<!-- trace:case id=g10.shared-session.TC-e7o rev=1 covers=g10.shared-session.SC-h04,g10.shared-session.SC-nhr,g10.shared-session.SC-4e0 -->
### shared-auth-session-US3-TC3-1: Sign-in links the device to the person

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-03

**Pre-conditions:**

* customer is not signed in on <grade10 store url>.
* Analytics events were recorded against this device while unsigned.

**Steps:**

1. Sign in as that collector on this device.
2. Trigger a product analytics event for that visit.

**Expected Results:**

* The later event is attributed to that person.
* It still names that device.

---

## shared-auth-session-US4: Collector returns to a tab they left and it knows they signed in

**As a** collector,
**I want** the tab I left behind to know I signed in somewhere else,
**so that** I do not reload it or ask for a second link to get back to what I was doing.

<!-- trace:case id=g10.shared-session.TC-5ij rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC1-1: Tab left open shows the collector signed in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
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
* Tab A raises no toast or message about the session.

<!-- trace:case id=g10.shared-session.TC-h79 rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC2-1: Every open tab of the brand picks the session up

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
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

<!-- trace:case id=g10.shared-session.TC-qc6 rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
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

1. Sign in as <collector email> on <grade10 store url> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still shows nobody signed in.

<!-- trace:case id=g10.shared-session.TC-ev0 rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC4-1: Another device's tab stays signed out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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

<!-- trace:case id=g10.shared-session.TC-qph rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC5-1: Restored tab shows the session that arrived

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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
| back-forward cache | In tab A, leave <grade10 store url> by navigating away, then use Back. Tab A stays open. Do not use reload. |
| discarded | Tab A stays in the tab strip. The browser discards its page process (Chrome: chrome://discards). Click that same tab. Do not close it. |

**Steps:**

1. Leave tab A in <tab state>.
2. Sign in as <collector email> in tab B.
3. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.

<!-- trace:case id=g10.shared-session.TC-2eh rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC6-1: Tab kept visible throughout is not left stale

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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

<!-- trace:case id=g10.shared-session.TC-ndh rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC7-1: Surface naming no person still carries the session

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
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

<!-- trace:case id=g10.shared-session.TC-05a rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC8-1: Nothing is announced when the session arrives

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
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

<!-- trace:case id=g10.shared-session.TC-egh rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC9-1: Failed link follow leaves the other tab signed out

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
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

<!-- trace:case id=g10.shared-session.TC-4w4 rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC10-1: Tab that cannot read the session keeps what it last knew

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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

<!-- trace:case id=g10.shared-session.TC-ptx rev=1 covers=g10.shared-session.SC-fnz,g10.shared-session.SC-fmt,g10.shared-session.SC-lgf,g10.shared-session.SC-hc7,g10.shared-session.SC-sqp -->
### shared-auth-session-US4-TC11-1: Console tab proves the second factor before showing anything

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-04

**Pre-conditions:**

* admin is signed out, with tab A open on <grade10 admin url>.
* No second factor is proved in this browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, an address with a console account |

**Steps:**

1. Sign in as <operator email> in tab B. Do not enter a TOTP or backup code in any tab.
2. Return to tab A.

**Expected Results:**

* Tab A still does not show the console.
* A sign-in page or a second-factor prompt is allowed.
* The session arriving in tab A does not open the console.

---

## shared-auth-session-US5: Collector returns to a tab they left and it knows they signed out

**As a** collector,
**I want** the tab I left behind to know my session has ended,
**so that** it stops offering me things every request behind it would refuse.

<!-- trace:case id=g10.shared-session.TC-5wd rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

* customer is signed in on <grade10 store url>, with tab A open on <grade10 store url>.
* Tab A is in the background.

**Steps:**

1. Sign out in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.
* Tab A offers no signed-in surface.

<!-- trace:case id=g10.shared-session.TC-zuj rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

* customer is signed in on <grade10 store url>, with tab A open on <grade10 store url>.
* The session is seeded to run out while tab A is in the background.

**Steps:**

1. Wait until the session has run out.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.

<!-- trace:case id=g10.shared-session.TC-i92 rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

* customer is signed in on <grade10 store url> with <listing> in their cart.
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

<!-- trace:case id=g10.shared-session.TC-8jg rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

* customer is signed in on <grade10 store url>.
* Tabs A and B are open on <grade10 store url>, tab C on <grade10 auction url>.

**Steps:**

1. Sign out in tab D.
2. Return to tabs A, B and C in turn.

**Expected Results:**

* Each of tabs A, B and C shows nobody signed in.

<!-- trace:case id=g10.shared-session.TC-9fb rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

<!-- trace:case id=g10.shared-session.TC-u40 rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

<!-- trace:case id=g10.shared-session.TC-wea rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

* customer is signed in on <grade10 store url> and on <zzz store url> in one browser.
* Tab A is open on <zzz store url>.

**Steps:**

1. Sign out of <grade10 store url> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still shows the collector signed in on <zzz store url>.

<!-- trace:case id=g10.shared-session.TC-3z8 rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

* customer is signed in on <grade10 store url>, with tab A open on <grade10 store url>.

**Steps:**

1. Sign out in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.
* Tab A raises no toast or message about the session.

<!-- trace:case id=g10.shared-session.TC-0sf rev=1 covers=g10.shared-session.SC-n9f,g10.shared-session.SC-lp3,g10.shared-session.SC-etz,g10.shared-session.SC-bc8,g10.shared-session.SC-35o -->
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

* customer is signed in on <grade10 store url>, with tab A open on <signed-in-only page>.

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

---

## shared-auth-session-US6: Collector who signs in after somebody else sees their own things

**As a** collector signing in on a browser somebody else has just used,
**I want** every open tab to show me, with my own cart, watchlist and orders,
**so that** I never act on the last person's things and they never see mine.

<!-- trace:case id=g10.shared-session.TC-sww rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url>, with tab A open on <grade10 store url>, in the background.

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

<!-- trace:case id=g10.shared-session.TC-lmu rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url>, with tab A open on <per-person surface>.
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

<!-- trace:case id=g10.shared-session.TC-7oa rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url> with <listing> in their cart.
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

<!-- trace:case id=g10.shared-session.TC-d1l rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url>, with tab A open on the cart.
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

<!-- trace:case id=g10.shared-session.TC-iip rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url> with <listing> in their cart.
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

<!-- trace:case id=g10.shared-session.TC-l8l rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url>.
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

<!-- trace:case id=g10.shared-session.TC-3j4 rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

<!-- trace:case id=g10.shared-session.TC-j80 rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url>, with tab A open on <collector A order>.

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

<!-- trace:case id=g10.shared-session.TC-d62 rev=1 covers=g10.shared-session.SC-pyv,g10.shared-session.SC-4mx,g10.shared-session.SC-ekp -->
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

* customer A is signed in on <grade10 store url>, with tab A open on <grade10 store url>.

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

## Settled

* Moderating an account (a ban) deciding whether it ends the account's open
  sessions is moderation's own decision; an open tab keeps up with whatever
  the session does either way.
* Whether an arriving collector's session may use a console is the console's
  own rule, not this capability's.
