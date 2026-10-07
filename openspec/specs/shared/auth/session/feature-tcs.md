# shared/auth/session Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

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
**I want** one sign-in to cover this brand's site and none of another brand,
**so that** I do not sign in twice on the same brand or leak into the other.

<!-- trace:case id=g10.shared-session.TC-4vh rev=2 covers=g10.shared-session.SC-pre,g10.shared-session.SC-hvi -->
### shared-auth-session-US2-TC1-2: One sign-in covers the brand's site pages

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

### shared-auth-session-US2-TC3-1: Console sign-in does not cross brands

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

* admin is signed in on <grade10 admin console url> and has proved the second factor.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Navigate to <zzz admin console url>.

**Expected Results:**

* Step 1 opens the console.
* Step 2 shows the ZZZ console's sign-in page, not the console.

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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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
* **Automation status:** automated
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

---

## shared-auth-session-US7: Operator holds a console session apart from their site session

**As an** operator,
**I want** the admin console and the site to keep separate sign-ins that end on their own,
**so that** a site sign-in never opens the console and leaving the site signed in never leaves the console open.

### shared-auth-session-US7-TC1-1: Site sign-in does not open the console

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* admin is signed out on <store url> and on <console url>.
* <operator account> holds console access.
* Tab B is open on <console url>, in the background.

**Test data:**

| Brand | <store url> | <console url> | <operator account> |
| --- | --- | --- | --- |
| Grade10 | <grade10 store url> | <grade10 admin console url> | An account holding console access on Grade10 |
| ZZZ | <zzz store url> | <zzz admin console url> | An account holding console access on ZZZ |

**Steps:**

1. In tab A, sign in on <store url> as <operator account>.
2. Return to tab B.
3. Reload tab B.

**Expected Results:**

* Step 1 shows <operator account> signed in on the site.
* Step 2 shows tab B still signed out of the console, unreloaded.
* Step 3 shows the console's sign-in page, not the console.

### shared-auth-session-US7-TC2-1: Console sign-in does not sign the person in on the site

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
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* admin is signed out on <grade10 store url> and on <grade10 admin console url>.
* <operator account> holds console access.
* Tab B is open on <grade10 store url>, in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. In tab A, sign in on <grade10 admin console url> as <operator email>, entering <operator TOTP code>.
2. Return to tab B.
3. Reload tab B.

**Expected Results:**

* Step 1 opens the console.
* Step 2 shows tab B still showing nobody signed in, unreloaded.
* Step 3 shows nobody signed in on the site.

### shared-auth-session-US7-TC3-1: Site and console hold different accounts at once

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
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* <collector account> is signed in on <grade10 store url> in tab A, in the background, with <cart item> in its cart.
* admin is signed out of the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | A customer account holding `user` only |
| `<cart item>` | A card in <collector account>'s cart |
| `<operator account>` | A different account holding console access |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. In tab B, sign in on <grade10 admin console url> as <operator email>, entering <operator TOTP code>.
2. Return to tab A.

**Expected Results:**

* Step 1 opens the console as <operator account>.
* Step 2 shows tab A still naming <collector account>, with <cart item> in its cart and nothing of <operator account>, unreloaded.

### shared-auth-session-US7-TC4-1: A session that runs out leaves the other surface signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* <operator account> is signed in on <grade10 store url> in tab A and on <grade10 admin console url> in tab B, with the second factor proved.
* <expiring surface> has run out; the other surface's session has not.

**Test data:**

| <expiring surface> | Tab that still shows <operator account> |
| --- | --- |
| The site | Tab B, the console |
| The console | Tab A, the site |

**Steps:**

1. Return to tab A.
2. Return to tab B.

**Expected Results:**

* The tab on <expiring surface> shows nobody signed in.
* The other tab still shows <operator account> signed in, unreloaded.

### shared-auth-session-US7-TC5-1: Recent site sign-in does not satisfy the console's recent sign-in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* <operator account> holds console access and has no second factor.
* <operator account> is signed in on <grade10 admin console url> in tab A, with a console sign-in older than <recent sign-in window>.

**Test data:**

| Field | Value |
| --- | --- |
| `<recent sign-in window>` | 15 minutes, the stated limit |

**Steps:**

1. In tab B, sign in on <grade10 store url> as <operator account>.
2. In tab A, set up a second factor on the console.

**Expected Results:**

* Step 2 is refused and asks them to sign in to the console again.
* No second factor is set up.

### shared-auth-session-US7-TC6-1: Console sign-in asks for the second factor beside a site session

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
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* <operator account> is signed in on <grade10 store url> in tab A.
* No second factor is proved in this browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. In tab B, sign in on <grade10 admin console url> as <operator email>. Enter no TOTP or backup code.
2. Read tab B.
3. In tab B, enter <operator TOTP code>.

**Expected Results:**

* Step 2 does not show the console.
* Step 3 opens the console.

### shared-auth-session-US7-TC7-1: A console tab follows the console's own session

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
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* <operator account> is signed in on <grade10 store url> in tab C.
* admin is signed out of the console, with tab A open on <grade10 admin console url>, in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. In tab B, sign in on <grade10 admin console url> as <operator email>, entering <operator TOTP code>.
2. Return to tab A.
3. Return to tab C.

**Expected Results:**

* Step 1 opens the console.
* Step 2 shows tab A showing <operator account> signed in on the console, unreloaded.
* Step 3 shows tab C unchanged, still showing <operator account> signed in on the site.

### shared-auth-session-US7-TC8-1: A site session that holds a role is refused for a console request

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* <operator account> holds a role that grants <operator action>.
* <operator account> is signed in on the site and has no console session.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator action>` | An operator action the role grants, whose target <target account> is read before and after |
| `<target account>` | An account the action would change |

**Steps:**

1. Request <operator action> as the console, carrying only the site session's credentials.
2. Present the site session's credentials to the console as the console's own, and ask who is calling.

**Expected Results:**

* Step 1 is refused as not signed in.
* <target account> is unchanged.
* Step 2 receives no person.

### shared-auth-session-US7-TC9-1: A console session without the second factor refuses an operator action beside a site session

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-07

**Pre-conditions:**

* <operator account> has a second factor and holds a role that grants <operator action>.
* <operator account> is signed in on the site and on the console, and has not proved the second factor on that console session.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator action>` | An operator action the role grants, whose target <target account> is read before and after |
| `<target account>` | An account the action would change |

**Steps:**

1. Request <operator action> on the console session.

**Expected Results:**

* Step 1 is refused and asks for the second factor.
* <target account> is unchanged.

---

## shared-auth-session-US8: Operator signs in to the console once more after release

**As an** operator who was signed in to the console before release,
**I want** to be asked to sign in to the console again,
**so that** no console session rests on a sign-in made for the site.

### shared-auth-session-US8-TC1-1: Console after release asks for sign-in and the site stays signed in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-08

**Pre-conditions:**

* <operator account> held a signed-in session from before the release, open on the site and on the console.
* The release of this change is live.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Navigate to <grade10 store url>.
3. In a new tab, sign in on <grade10 admin console url> as <operator email>, entering <operator TOTP code>.

**Expected Results:**

* Step 1 shows the console's sign-in page, not the console.
* Step 2 shows <operator account> still signed in on the site.
* Step 3 opens the console.

### shared-auth-session-US8-TC2-1: Customer session survives the release

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-session-US-08

**Pre-conditions:**

* <collector account> held a signed-in session from before the release on <grade10 store url>.
* The release of this change is live.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | A customer account holding `user` only |

**Steps:**

1. Navigate to <grade10 store url>.

**Expected Results:**

* The page shows <collector account> signed in, without a new sign-in.

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
- **Covered at domain** - `shared-auth-session-SC-41`'s site sign-in across pages is walked by `shared-auth-e2e-US2-TC1-1`, which still holds with the site as the surface; the console-against-site lifecycle across session, sign-in, sign-out and sessions is a draft domain case in this change's `domain-tcs.md` (`shared-auth-e2e-US8-TC1-1`), which walks the two sessions started, listed, signed out and ended together by an admin; a ban ending both and the console's release re-sign-in stay with the capabilities' own cases; `shared-auth-session-US-02`'s story is read as the site only, and the domain story `shared-auth-e2e-US2` no longer promises the console, since `shared-auth-e2e-US2-TC1-1` is a durable actual case this change does not touch
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-auth-session-US-02` has `US2-TC1-2`, `US2-TC3-1` and the durable `US2-TC2-1`; `shared-auth-session-US-07` has `US7-TC1-1` to `US7-TC9-1`; `shared-auth-session-US-08` has `US8-TC1-1` and `US8-TC2-1`; every scenario from `shared-auth-session-SC-27` to `shared-auth-session-SC-41` is reached
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk, and `US2-TC1-2` already carries its revised marker
