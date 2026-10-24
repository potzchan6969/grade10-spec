# shared/auth/sign-in Test Cases

**Status:** pending-review · 0/26
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7
**Out of suite (api):** shared-auth-sign-in-SC-34

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test. A sign-in link lasts five minutes, and a second send for the same address and surface waits a minute.
* Every tab a case names is open in one browser on one device unless the case names another; a tab is returned to as it was left, never reloaded.
* A brand with Google on offers the Google button in the sign-in dialog and the corner prompt; the browser is signed in to Google where a case uses it.

## Walk 1: A collector signs in by email on the site

Starting state:

- customer(collector) signed out on `<g10url>`, a second tab open on the same site.

Shared test data:

| Field | Value |
| --- | --- |
| collector email | an address with an account |

### Route

1. Open sign-in, enter `<collector email>`, and select Sign In with Email.
   - Check Your Email, the address on its own line, Resend counting down. `shared.auth-sign-in.US7-TC1`
2. Follow the link in the second tab; return to the first.
   - The dialog has closed, and the collector is signed in. `shared.auth-sign-in.US8-TC1`
3. Sign out, then follow the same link again.
   - The brand home, signed out, with the toast that the link no longer works. `shared.auth-sign-in.US6-TC1`

## Walk 2: An operator signs in to the console beside the site

Starting state:

- staff(operator) whose role holds `user:create`, signed in on `<g10url>` as a customer account and signed out on `<console url>`.

Shared test data:

| Field | Value |
| --- | --- |
| operator email | the operator's console address |

### Route

1. On `<console url>`, ask for a link for `<operator email>`, and follow it in a new tab.
   - The console signed in as the operator; the site still the customer's. `shared.auth-sign-in.US12-TC1`
2. On a test winner's page, select Email sign-in link; follow the customer's link in a browser holding no session.
   - The site signed in as the customer; the operator's console unchanged. `shared.auth-sign-in.US12-TC5`

## shared.auth-sign-in.US1: Collector asks for and follows a sign-in link

**As a** collector,
**I want** a link emailed to the address I submit to sign me in once,
**so that** I reach my account without a password, and a used or expired link cannot.

<!-- trace:case id=g10.shared-sign-in.TC-2hq rev=2 -->
### shared.auth-sign-in.US1-TC1: One email link signs the collector in to the account its address names, or a new one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`.

**Test data:**

| `<address>` | `<signs in to>` |
| --- | --- |
| an address with an account | that account |
| an address never used before | a new account |
| an address with an account, a space typed before and after | that account |

**Steps:**

1. Open sign-in.
2. Enter `<address>` and select Sign In with Email twice quickly.
3. Follow the link in the email.

**Expected Results:**

* Step 1: UI matching account-sign-in-blocks-signinemailform--default; no code field, and no screen says magic link.
* Step 2: one request runs, UI matching account-sign-in-blocks-signinemailform--link-request-running; one email arrives; the dialog reads the same for every row.
* Step 3 shows `<signs in to>` signed in.

<!-- trace:case id=g10.shared-sign-in.TC-vri rev=2 -->
### shared.auth-sign-in.US1-TC2: A link signs in any time within its five minutes, and the email says so

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
* **Trace:** Emailed link

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`, the site in `<language>`.

**Test data:**

| `<language>` | `<link followed>` |
| --- | --- |
| English | the first, about four minutes after its send, after the resend countdown ended |
| Chinese (Traditional) | the resent one, about four minutes after the resend and over five after the first send |

**Steps:**

1. Ask for a link; for the second row, select Resend when it turns on.
2. Read the newest email, and follow `<link followed>`.
3. Wait ten minutes, and open the account page.

**Expected Results:**

* Step 2: the email says the link lasts 5 minutes, in `<language>`; the link signs in.
* Step 3: still signed in.

<!-- trace:case id=g10.shared-sign-in.TC-p0g rev=2 -->
### shared.auth-sign-in.US1-TC3: The email step refuses an address it cannot send to, keeping what was typed

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`; `<prepared>`.

**Test data:**

| `<entered>` | `<prepared>` |
| --- | --- |
| an address with an account | the environment's mail sending made to fail |
| nothing | nothing |
| three spaces | nothing |
| collector.example.com | nothing |
| collector@example | nothing |
| a 255-character address | nothing |

**Steps:**

1. Open sign-in, enter `<entered>`, and select Sign In with Email.

**Expected Results:**

* The dialog stays on the email step with an error, UI matching account-sign-in-blocks-signinemailform--error-state, keeping what was entered; no email arrives and nobody is signed in.

---

## shared.auth-sign-in.US3: Collector signs in with Google when the brand offers it

**As a** collector,
**I want** Google sign-in when this brand offers it,
**so that** I can use an account I already have, and a brand that does not offer it does not show it.

<!-- trace:case id=g10.shared-sign-in.TC-2dd rev=2 -->
### shared.auth-sign-in.US3-TC1: A verified Google account signs in from the button or the corner prompt

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
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**

* customer(collector) is signed out on a brand with Google on, with a verified Google account.

**Test data:**

| `<entry>` |
| --- |
| the Google button in the sign-in dialog |
| the corner prompt |

**Steps:**

1. Choose the Google account through `<entry>`.

**Expected Results:**

* Signed in as the Google account's address, without a reload.

<!-- trace:case id=g10.shared-sign-in.TC-gw0 rev=2 -->
### shared.auth-sign-in.US3-TC2: An unverified Google account does not sign in

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
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**

* customer(collector) is signed out on a brand with Google on, with a Google account whose address is unverified.

**Test data:**

| `<entry>` |
| --- |
| the Google button in the sign-in dialog |
| the corner prompt |

**Steps:**

1. Choose the Google account through `<entry>`.

**Expected Results:**

* Still signed out, and told the account cannot sign in.

<!-- trace:case id=g10.shared-sign-in.TC-rnu rev=2 -->
### shared.auth-sign-in.US3-TC3: A brand with Google off offers no Google sign-in

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**

* customer(collector) is signed out on a brand with Google off.

**Steps:**

1. Open the brand's home and wait thirty seconds.
2. Open sign-in.

**Expected Results:**

* No corner prompt, and no Google button.

---

## shared.auth-sign-in.US4: Collector keeps one account for one verified address

**As a** collector,
**I want** every successful sign-in at an address to be the same person,
**so that** a later visit, a product-created account, or letter case does not split me.

<!-- trace:case id=g10.shared-sign-in.TC-ary rev=2 -->
### shared.auth-sign-in.US4-TC1: Each sign-in enters the account its address names, however it was made

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
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`; `<address>` holds an order, `<made by>`.

**Test data:**

| `<made by>` | `<signs in with>` | `<enters>` |
| --- | --- | --- |
| a sign-in, then a sign-out | `<address>` | the same account, the order listed |
| a sign-in, then a sign-out | `<address>` in capitals | the same account, the order listed |
| a sign-in, then a sign-out | `<address>` with a new plus-tag | a new account, no order |
| checkout's email verification for a guest, then a sign-out | `<address>` | the same account, the checkout's order listed |

**Steps:**

1. Sign in by email with `<signs in with>`, and open the account's orders.

**Expected Results:**

* It enters `<enters>`.

---

## shared.auth-sign-in.US5: Collector is not spammed or sent off-brand

**As a** collector,
**I want** a second email within a minute to wait, and a return only to this brand,
**so that** I am not flooded and not delivered to an untrusted address.

<!-- trace:case id=g10.shared-sign-in.TC-wj2 rev=2 -->
### shared.auth-sign-in.US5-TC1: A link returns only to a page of this brand

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
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**

* customer(collector) is signed out.

**Test data:**

| `<sign-in opened at>` | `<lands on>` |
| --- | --- |
| `<g10url>`'s sign-in, naming no return | the brand home |
| `<g10url>`'s sign-in, naming a page of this brand | that page |
| `<g10url>`'s sign-in, naming another site's address | the brand home |

**Steps:**

1. Open `<sign-in opened at>`, ask for a link, and follow it.

**Expected Results:**

* Signed in, on `<lands on>`.

---

## shared.auth-sign-in.US6: Collector follows a link that cannot sign them in

**As a** collector who opened a sign-in link from email,
**I want** a clear toast on the brand home when that link cannot create a session,
**so that** I know whether to ask for a new link or that I cannot sign in at all.

<!-- trace:case id=g10.shared-sign-in.TC-ryc rev=2 -->
### shared.auth-sign-in.US6-TC1: A link that cannot sign in says why and leaves the session as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`, the dialog of the tab that asked still open.

**Test data:**

| `<link>` | `<prepared>` | `<toast>` |
| --- | --- | --- |
| used | followed once already | account-sign-in-blocks-linkfollowtoasts--no-longer-works |
| replaced | a newer link sent after it | account-sign-in-blocks-linkfollowtoasts--no-longer-works |
| altered | one character changed | account-sign-in-blocks-linkfollowtoasts--no-longer-works |
| expired | followed over five minutes after its send, also with the device clock set back | account-sign-in-blocks-linkfollowtoasts--expired |
| for a banned account | the address banned on the console | account-sign-in-blocks-linkfollowtoasts--banned, offering no new link |

**Steps:**

1. Follow `<link>`.
2. Return to the tab that asked.

**Expected Results:**

* Step 1 opens the brand home signed out, UI matching `<toast>`.
* Step 2: that tab's dialog is still waiting, and nothing it was stopped from is done.

---

## shared.auth-sign-in.US7: Collector confirms the send and can resend

**As a** collector,
**I want** the dialog to say Check Your Email, put the address I used on its
own line, and let me resend after a short wait,
**so that** I know where to look and can ask again without a Back control into
the entry step.

<!-- trace:case id=g10.shared-sign-in.TC-v74 rev=2 -->
### shared.auth-sign-in.US7-TC1: The dialog confirms the send, makes the collector wait a minute, then resends

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-07

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`.

**Steps:**

1. Ask for a link.
2. Dismiss the dialog, reopen sign-in, and ask for the same address before the minute ends.
3. Wait until Resend turns on, and select it.

**Expected Results:**

* Step 1: UI matching account-sign-in-blocks-signinlinksent--resend-cooldown: Check Your Email, the address on its own line, no Back control, Resend off and counting down.
* Step 2 opens at the email step; asking again is told to wait, and no second email arrives.
* Step 3: a second email arrives, the countdown restarts, and the first link no longer works.

---

## shared.auth-sign-in.US8: Collector follows the link and the tab that asked carries on

**As a** collector who asked for a sign-in link and followed it in another tab,
**I want** the tab I asked from to finish what it stopped me doing,
**so that** I am not sent back to press the same thing a second time.

<!-- trace:case id=g10.shared-sign-in.TC-oaf rev=2 -->
### shared.auth-sign-in.US8-TC1: The tab that asked closes its dialog and carries on with what it stopped

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`, with a second tab open.

**Test data:**

| `<asked from>` | `<in between>` | `<asking tab afterwards>` |
| --- | --- | --- |
| Add to cart on a product | nothing | signed in, the product in the cart once |
| the header's sign-in | nothing | signed in, nothing else done |
| Add to cart on a product | the tab opens another page | signed in on that page, nothing added |
| Add to cart on the last one of a product | another account buys it | signed in, told the product can no longer be added, the cart empty |

**Steps:**

1. Select `<asked from>`, and ask for a link (UI matching account-sign-in-screens-sign-in--from-add-to-cart from Add to cart).
2. Let `<in between>` happen.
3. Follow the link in the second tab, and return to the asking tab.

**Expected Results:**

* The dialog has closed without a reload, and the tab reads `<asking tab afterwards>`.

<!-- trace:case id=g10.shared-sign-in.TC-3kv rev=2 -->
### shared.auth-sign-in.US8-TC3: Other tabs of the same side close their dialog when the link is followed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer(collector) is signed out, `<other tab>` open with its sign-in dialog open; an asking tab on `<g10url>` has a link waiting.

**Test data:**

| `<other tab>` | `<afterwards>` |
| --- | --- |
| another page of `<g10url>`, which did not ask | dialog closed, signed in |
| another page of `<g10url>`, which asked from Add to cart | dialog closed, the product added once |
| another site of the same brand | dialog closed, signed in |

**Steps:**

1. Follow the asking tab's link in a third tab, and return to `<other tab>`.

**Expected Results:**

* It reads `<afterwards>`.

<!-- trace:case id=g10.shared-sign-in.TC-j4x rev=2 -->
### shared.auth-sign-in.US8-TC4: Tabs on another brand or the console stay signed out when a site link is followed

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer(collector) is signed out, `<other tab>` open with its sign-in open; an asking tab on `<g10url>` has a link waiting.

**Test data:**

| `<other tab>` |
| --- |
| a ZZZ site, its sign-in dialog open |
| `<console url>`'s sign-in page |

**Steps:**

1. Follow the asking tab's link in a third tab, and return to `<other tab>`.

**Expected Results:**

* It still asks for sign-in, signed out.

---

## shared.auth-sign-in.US9: Collector follows a link meant for a different account

**As a** collector already signed in,
**I want** a clear choice when a sign-in link is meant for another account,
**so that** I am not switched without asking, and can Switch or Stay.

<!-- trace:case id=g10.shared-sign-in.TC-19a rev=2 -->
### shared.auth-sign-in.US9-TC1: A link for another account asks before switching

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
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer(collector) is signed in on `<g10url>` as `<account A>`, holding an unused link for `<account B>`.

**Test data:**

| `<choice>` | `<afterwards>` |
| --- | --- |
| Switch | signed in as `<account B>` |
| Stay | still `<account A>`; the link still works once |
| dismiss the toast | still `<account A>`; the link still works once |

**Steps:**

1. Follow the link.
2. Wait ten seconds, then make `<choice>`.

**Expected Results:**

* Step 1: UI matching account-sign-in-blocks-linkfollowtoasts--different-account, naming `<account B>`'s email; still `<account A>`.
* Step 2: the toast is still there before the choice; then `<afterwards>`.

<!-- trace:case id=g10.shared-sign-in.TC-0gq rev=1 -->
### shared.auth-sign-in.US9-TC2: A link for the signed-in account itself asks nothing

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer(collector) is signed in on `<g10url>` as `<account A>`, holding an unused link for `<account A>`.

**Steps:**

1. Follow the link.

**Expected Results:**

* No toast; still `<account A>`.

---

## shared.auth-sign-in.US10: Collector sees the wait end when they sign in from another device

**As a** collector who asked for a sign-in link on one device,
**I want** that device's wait to end once I sign in from another,
**so that** I am not left resending for an address I already used to sign in
elsewhere.

<!-- trace:case id=g10.shared-sign-in.TC-uxi rev=2 -->
### shared.auth-sign-in.US10-TC1: A waiting dialog ends its wait when its address signs in on another device

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer(collector) asked for a link for `<address>` on device 1, on `<g10url>`, in two tabs, one in the background.

**Test data:**

| `<on device 2>` |
| --- |
| follows device 1's link, before Resend turns on |
| signs in with Google as `<address>`, after Resend turns on |

**Steps:**

1. Do `<on device 2>`.
2. Look at device 1's front tab, then select its background tab.

**Expected Results:**

* Both end the wait, UI matching account-sign-in-blocks-linkfollowtoasts--settled-elsewhere; device 1 stays signed out.

<!-- trace:case id=g10.shared-sign-in.TC-1jo rev=2 -->
### shared.auth-sign-in.US10-TC2: A waiting dialog keeps waiting when no sign-in for its address happens

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer(collector) asked for a link for `<address>` on device 1, on `<g10url>`.

**Test data:**

| `<on device 2>` |
| --- |
| follows a used link for `<address>` |
| signs in as another address |

**Steps:**

1. Do `<on device 2>`, and look at device 1.

**Expected Results:**

* Device 1 still waits, with no message.

---

## shared.auth-sign-in.US11: Collector is offered Google sign-in without opening the dialog

**As a** collector, signed out, on a brand that offers Google sign-in,
**I want** Google's own prompt to offer my account without me opening sign-in
first,
**so that** I can sign in with a tap, and it never shows at the same time as
a sign-in dialog I already opened.

<!-- trace:case id=g10.shared-sign-in.TC-6rq rev=2 -->
### shared.auth-sign-in.US11-TC1: The corner prompt is offered on any page to a person signed out on the site

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on the site of a brand with Google on; the console is `<console>`.

**Test data:**

| `<page>` | `<console>` |
| --- | --- |
| the home | signed out |
| checkout | signed out |
| the home | signed in on `<console url>` |

**Steps:**

1. Open `<page>`, and leave the prompt alone for thirty seconds.

**Expected Results:**

* The corner prompt shows; the page stays as it was, nobody signed in.

<!-- trace:case id=g10.shared-sign-in.TC-y7m rev=1 -->
### shared.auth-sign-in.US11-TC2: No corner prompt for a person signed in, or where Google's prompt cannot load

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is on `<g10url>`, a brand with Google on, `<state>`.

**Test data:**

| `<state>` | `<then>` |
| --- | --- |
| signed in | open three pages |
| signed out, with Google's script blocked | open the home and select Add to cart on a product |

**Steps:**

1. `<then>`.

**Expected Results:**

* No corner prompt shows; the pages work, and Add to cart opens the sign-in dialog.

<!-- trace:case id=g10.shared-sign-in.TC-m40 rev=2 -->
### shared.auth-sign-in.US11-TC4: The corner prompt yields to the sign-in dialog for the rest of the visit

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on `<g10url>`, a brand with Google on, the corner prompt showing.

**Steps:**

1. Open sign-in; close it without signing in.
2. Open three more pages.

**Expected Results:**

* Step 1: the prompt is gone while the dialog is open.
* Step 2: it does not come back.

---

## shared.auth-sign-in.US12: Operator follows a sign-in link and only the console is signed in

**As an** operator,
**I want** a link I asked for from the console to sign in the console and nothing else,
**so that** my shopping session on the site stays as it was, whoever it belongs to.

<!-- trace:case id=g10.shared-sign-in.TC-rwo rev=1 -->
### shared.auth-sign-in.US12-TC1: A sign-in signs in only the side it was asked from

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) has `<site before>` on the site and no console session.

**Test data:**

| `<asked from>` | `<site before>` | `<followed>` | `<afterwards>` |
| --- | --- | --- | --- |
| the console, by email | none | in a console tab | console signed in, site signed out |
| the console, by email | another customer account | on another device, no console tab open | console signed in as the operator, site still the customer |
| the console, by email, after one Resend | the operator's own account | in a new tab | console signed in, site unchanged |
| the console, opened at an address naming a site page | none | in a new tab | on the console, signed in |
| the console, with Google | none | not applicable | console signed in, site signed out |
| the site, by email | none | in a new tab | site signed in, the console asks for sign-in |
| checkout's email verification | none | not applicable | site signed in, the console asks for sign-in |
| the ZZZ console, by email | none | in a new tab | ZZZ console signed in only |

**Steps:**

1. Ask for sign-in from `<asked from>`, and follow as `<followed>` says.
2. Open the site and the console in new tabs.

**Expected Results:**

* Step 2 reads `<afterwards>`, and nothing asks which account to keep.

<!-- trace:case id=g10.shared-sign-in.TC-xvi rev=2 -->
### shared.auth-sign-in.US12-TC2: A console link that cannot sign in says why on the console's sign-in page

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) is signed out on `<console url>`; the site is signed in as a customer.

**Test data:**

| `<link>` | `<page says>` |
| --- | --- |
| expired | the link has expired |
| used | the link no longer works |
| for a banned operator | the account cannot sign in, with no new link offered |

**Steps:**

1. Follow `<link>`.
2. Open the site.

**Expected Results:**

* Step 1 shows the console's sign-in page with `<page says>` in the page, no toast; still signed out.
* Step 2: the site is still the customer's.

<!-- trace:case id=g10.shared-sign-in.TC-7cx rev=2 -->
### shared.auth-sign-in.US12-TC3: A console link for another operator asks before switching the console

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) is signed in on `<console url>` as `<operator A>`, holding an unused console link for `<operator B>`; the site is signed in as a customer.

**Test data:**

| `<choice>` | `<console afterwards>` |
| --- | --- |
| Switch | `<operator B>` |
| Stay | `<operator A>` |

**Steps:**

1. Follow the link, and make `<choice>`.
2. Open the site.

**Expected Results:**

* Step 1: the console's sign-in page names `<operator B>`'s email and offers Switch and Stay; then the console is `<console afterwards>`.
* Step 2: the site is still the customer's.

<!-- trace:case id=g10.shared-sign-in.TC-vz1 rev=1 -->
### shared.auth-sign-in.US12-TC4: Waits and send limits on the console and the site run apart

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) is signed out on both `<g10url>` and `<console url>`.

**Steps:**

1. Ask for a site link for the operator's address, then at once a console link for it.
2. Ask for a second console link before the minute ends.
3. On another device, follow the console link; look at the site tab.

**Expected Results:**

* Step 1 sends both.
* Step 2 is told to wait; no third email.
* Step 3: the console tab's wait ends; the site tab still waits, and the site link still signs in.

<!-- trace:case id=g10.shared-sign-in.TC-41r rev=1 -->
### shared.auth-sign-in.US12-TC5: A site link an operator sends from the console signs in the site only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Link surface

**Pre-conditions:**

* staff(operator) is signed in on `<console url>` with a role holding `user:create`, on a test winner's page.

**Steps:**

1. Select Email sign-in link beside the test winner.
2. Follow the customer's link in another browser holding no session.
3. Return to the operator's console tab.

**Expected Results:**

* Step 2 signs in the site as the customer; the console in that browser asks for sign-in.
* Step 3: the operator's console session is unchanged.

<!-- trace:case id=g10.shared-sign-in.TC-7kf rev=1 -->
### shared.auth-sign-in.US12-TC6: A console role without user:create is offered no site link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(support) is signed in on `<console url>`, on a test winner's page.

**Steps:**

1. Look beside the test winner.

**Expected Results:**

* No Email sign-in link action.

## Settled

* Whether a console tab carries on a refused action after its second factor belongs to the console's own capability.
* The link's duration is the only form its promise takes, stated in the email only, with one lifetime everywhere.
* A pending link stays valid after its address signs in elsewhere by another method; only its expiry or a later send ends it.
* The two brands run separate auth, so a sign-in on one never ends the other's wait.
* Dismissing the wait and reopening sign-in starts again at the email step.
* A link asked from the console signs in the console whoever follows it, on any device. A link sent before release, or a token with no console prefix, signs in the site, and a failed follow lands on the brand home with the site's toast.
* The send cap and a new link's replacing earlier links count per address and surface (decisions Q12); a sign-in stops only a wait on its own surface (Q13).
* A console-asked link that fails, is expired or banned, or is for another account lands on the console's own sign-in page with an inline message; the console has no toasts (Q14).
* A sign-in dialog closes only for a session that arrives on its own side (Q11). An off-brand or other-surface return location is ignored on send and on follow.
* A link an operator sends from the console for a customer signs in the site; only an elevated console session whose role holds `user:create` may send it, and the sender's console session is left as it was (Q16).
* The corner prompt is the site's and reads the site's session, so a console session does not withhold it; the console has no prompt.

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US1-TC1` walks a link sign-in naming the collector until sign-out; `shared.auth-dmn.US7-TC1` walks the asking tab opening the page it was refused; `shared.auth-dmn.US8-TC1` walks a site sign-in and a console sign-in starting apart
