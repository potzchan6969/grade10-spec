# shared/auth/session Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

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

---

## Settled

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
