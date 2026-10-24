# shared/auth/sign-in Test Cases

**Status:** pending-review · 0/29
**Drafts styled:** 2026-10-24, tcs-rules r7
**Reviewed:** 2026-09-25, tcs-rules r4, lapsed 2026-09-25
**Out of suite (api):** shared-auth-sign-in-SC-34

## Background

* Every tab a case names is open in one browser on one device, unless the case names another device.
* A tab is returned to as the person left it, never reloaded.
* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.

## Walk 1: A collector signs in by email on the site

**Starting state:**

- customer(collector) signed out on `<g10url>`, with a second tab open on the same site

**Shared test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | an address with an account |

### Route

1. Open sign-in, enter `<collector email>` and select **Sign In with Email**.
   - The dialog reads **Check Your Email**, the address on its own line, **Resend** counting down `shared.auth-sign-in.US7-TC1`
2. Follow the link in the second tab, then return to the first.
   - The dialog has closed and the collector is signed in `shared.auth-sign-in.US8-TC1`
3. Sign out, then follow the same link again.
   - The brand home, signed out, with the toast that the link no longer works `shared.auth-sign-in.US6-TC1`

## Walk 2: An operator signs in to the console beside the site

**Starting state:**

- staff(operator) whose role holds `user:create`, signed in on `<g10url>` as a customer account, signed out on `<console url>`

**Shared test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | the operator's console address |

### Route

1. On `<console url>`, ask for a link for `<operator email>` and follow it in a new tab.
   - The console is signed in as the operator, and the site is still the customer's `shared.auth-sign-in.US12-TC1`
2. Open a test winner's page, select **Email sign-in link** beside it, and follow the customer's link in another browser that holds no session.
   - The site is signed in as the customer, and the operator's console session is unchanged `shared.auth-sign-in.US12-TC5`

## shared.auth-sign-in.US1: Collector asks for and follows a sign-in link

**As a** collector,
**I want** a link emailed to the address I submit to sign me in once,
**so that** I reach my account without a password, and a used or expired link cannot.

<!-- trace:case id=g10.shared-sign-in.TC-2hq rev=2 -->
### shared.auth-sign-in.US1-TC1: An emailed link signs the collector in

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

| Address | Signs in to |
| --- | --- |
| an address with an account | that account |
| an address never used before | a new account |
| an address with an account, typed with a space before and after | that account |

**Steps:**

1. Open sign-in.
2. Enter the address and select **Sign In with Email** twice quickly.
3. Open the sign-in email and follow its link.

**Expected Results:**

* Step 1: UI matching account-sign-in-blocks-signinemailform--default; no code field, and no screen says magic link.
* Step 2: one request runs, UI matching account-sign-in-blocks-signinemailform--link-request-running; one email arrives; the dialog reads the same for both rows.
* Step 3: the site shows the row's account signed in.

<!-- trace:case id=g10.shared-sign-in.TC-vri rev=2 -->
### shared.auth-sign-in.US1-TC2: A link signs in at any time within its five minutes, and the email says so

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
* **Trace:** Emailed link

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`, the site set to the row's language.

**Test data:**

| Language | Link followed |
| --- | --- |
| English | the first, about four minutes after its send, after the resend countdown ended |
| Chinese (Traditional) | the resent one, about four minutes after the resend and more than five after the first send |

**Steps:**

1. Ask for a link; for the second row, select **Resend** when it turns on.
2. Read the newest sign-in email.
3. Follow the row's link.
4. Wait ten minutes and open the account page.

**Expected Results:**

* Step 2: the email says the link lasts five minutes, written with a digit, in the row's language.
* Step 3: signed in.
* Step 4: still signed in.

<!-- trace:case id=g10.shared-sign-in.TC-p0g rev=2 -->
### shared.auth-sign-in.US1-TC3: The email step refuses a send that cannot go out

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
* **Trace:** shared-auth-sign-in-US-01

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`.

**Test data:**

| Address entered | Prepared |
| --- | --- |
| an address with an account | the environment's mail sending is made to fail |
| nothing | - |
| three spaces | - |
| `collector.example.com`, with no `@` | - |
| `collector@example`, with no `.` in the domain | - |
| a 255-character address | - |

**Steps:**

1. Open sign-in.
2. Enter the row's address and select **Sign In with Email**.

**Expected Results:**

* The dialog stays on the email step with an error, UI matching account-sign-in-blocks-signinemailform--error-state.
* What was entered is still in the field; no email arrives, and nobody is signed in.

---

## shared.auth-sign-in.US3: Collector signs in with Google when the brand offers it

**As a** collector,
**I want** Google sign-in when this brand offers it,
**so that** I can use an account I already have, and a brand that does not offer it does not show it.

<!-- trace:case id=g10.shared-sign-in.TC-2dd rev=2 -->
### shared.auth-sign-in.US3-TC1: A verified Google account signs in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**

* customer(collector) is signed out on a brand with Google on, with a verified Google account.

**Test data:**

| Entry |
| --- |
| the Google button in the sign-in dialog |
| the corner prompt |

**Steps:**

1. Choose the Google account through the row's entry.

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
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**

* customer(collector) is signed out on a brand with Google on, with a Google account whose address is unverified.

**Test data:**

| Entry |
| --- |
| the Google button in the sign-in dialog |
| the corner prompt |

**Steps:**

1. Choose the Google account through the row's entry.

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
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-03

**Pre-conditions:**

* customer(collector) is signed out on a brand with Google off, in a browser signed in to Google.

**Steps:**

1. Open the brand's home and wait thirty seconds.
2. Open sign-in.

**Expected Results:**

* Step 1: no corner prompt.
* Step 2: no Google button.

---

## shared.auth-sign-in.US4: Collector keeps one account for one verified address

**As a** collector,
**I want** every successful sign-in at an address to be the same person,
**so that** a later visit, a product-created account, or letter case does not split me.

<!-- trace:case id=g10.shared-sign-in.TC-ary rev=2 -->
### shared.auth-sign-in.US4-TC1: Each sign-in enters the account its address names

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

* customer(collector) signed in once at `<address>`, which holds an order, then signed out.

**Test data:**

| Second sign-in with | Account entered |
| --- | --- |
| `<address>` | the same account, the order listed |
| `<address>` in capitals | the same account, the order listed |
| `<address>` with a new plus-tag | a new account, no order |

**Steps:**

1. Sign in by email with the row's address.
2. Open the account's orders.

**Expected Results:**

* The row's account.

<!-- trace:case id=g10.shared-sign-in.TC-4qd rev=3 -->
### shared.auth-sign-in.US4-TC2: Identity verification creates one account that a later sign-in enters

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-04

**Pre-conditions:**

* customer(guest) is signed out on `<g10url>` with an address that has no account.

**Steps:**

1. Complete checkout's email verification with the address.
2. Sign out, then sign in by email with the same address.

**Expected Results:**

* Step 1: the site shows the person signed in.
* Step 2: the same account, holding the checkout's order.

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
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-05

**Pre-conditions:**

* customer(collector) is signed out.

**Test data:**

| Sign-in opened at | Lands on |
| --- | --- |
| `<g10url>`'s sign-in, naming no return | the brand home |
| `<g10url>`'s sign-in, naming a page of this brand | that page |
| `<g10url>`'s sign-in, naming another site's address | the brand home |

**Steps:**

1. Open the row's sign-in address and ask for a link.
2. Follow the link.

**Expected Results:**

* Signed in, on the row's page.

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
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-06

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`, with the sign-in dialog of the tab that asked still open.

**Test data:**

| Link | How it is prepared | Toast |
| --- | --- | --- |
| used | followed once already | UI matching account-sign-in-blocks-linkfollowtoasts--no-longer-works |
| replaced | a newer link was sent after it | UI matching account-sign-in-blocks-linkfollowtoasts--no-longer-works |
| altered | one character of the link changed | UI matching account-sign-in-blocks-linkfollowtoasts--no-longer-works |
| expired | followed more than five minutes after its send, also with the device clock set back | UI matching account-sign-in-blocks-linkfollowtoasts--expired |
| banned account | the address is banned on the console | UI matching account-sign-in-blocks-linkfollowtoasts--banned, offering no new link |

**Steps:**

1. Follow the row's link.
2. Return to the tab that asked.

**Expected Results:**

* Step 1: the brand home opens signed out, with the row's toast.
* Step 2: the tab that asked still shows its dialog waiting, and nothing it was stopped from is done.

---

## shared.auth-sign-in.US7: Collector confirms the send and can resend

**As a** collector,
**I want** the dialog to say Check Your Email, put the address I used on its
own line, and let me resend after a short wait,
**so that** I know where to look and can ask again without a Back control into
the entry step.

<!-- trace:case id=g10.shared-sign-in.TC-v74 rev=2 -->
### shared.auth-sign-in.US7-TC1: The dialog confirms the send, makes the collector wait, then resends

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
2. Dismiss the dialog, open sign-in again and ask for the same address before the minute ends.
3. Wait until **Resend** turns on and select it.

**Expected Results:**

* Step 1: UI matching account-sign-in-blocks-signinlinksent--resend-cooldown: **Check Your Email**, the address on its own line, no Back control, **Resend** off and counting down.
* Step 2: the dialog opens at the email step; asking again gets a message to wait, and no second email arrives.
* Step 3: a second email arrives and the countdown starts again; the first link no longer works.

---

## shared.auth-sign-in.US8: Collector follows the link and the tab that asked carries on

**As a** collector who asked for a sign-in link and followed it in another tab,
**I want** the tab I asked from to finish what it stopped me doing,
**so that** I am not sent back to press the same thing a second time.

<!-- trace:case id=g10.shared-sign-in.TC-oaf rev=2 -->
### shared.auth-sign-in.US8-TC1: The tab that asked closes its dialog and finishes what it stopped

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`, with a second tab open.

**Test data:**

| Sign-in asked from | Before the link is followed | Asking tab afterwards |
| --- | --- | --- |
| **Add to cart** on a product | nothing | signed in, the product in the cart once |
| the header's sign-in | nothing | signed in, nothing else done |
| **Add to cart** on a product | the tab opens another page | signed in on that page, nothing added |

**Steps:**

1. Select the row's control, then ask for a link (UI matching account-sign-in-screens-sign-in--from-add-to-cart for an add-to-cart row).
2. Do the row's step in between.
3. Follow the link in the second tab.
4. Return to the asking tab.

**Expected Results:**

* Step 4: the dialog has closed without a reload, and the row's outcome.

<!-- trace:case id=g10.shared-sign-in.TC-lnk rev=2 -->
### shared.auth-sign-in.US8-TC2: An action that can no longer be done is refused after sign-in, not skipped

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer(collector) is signed out on `<g10url>`, on a product with one left, with a second tab open.

**Steps:**

1. Select **Add to cart**, then ask for a link.
2. Sell the last one from another account.
3. Follow the link in the second tab.
4. Return to the asking tab.

**Expected Results:**

* Step 4: signed in, told the product can no longer be added; the cart is empty.

<!-- trace:case id=g10.shared-sign-in.TC-3kv rev=2 -->
### shared.auth-sign-in.US8-TC3: Other tabs on the same side close their dialog when the link is followed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer(collector) signed out, with the row's other tab open and the sign-in dialog open in it.
* An asking tab on `<g10url>` has a link waiting.

**Test data:**

| Other tab | Afterwards |
| --- | --- |
| another page of `<g10url>`, which did not ask | dialog closed, signed in |
| another page of `<g10url>`, which also asked, from **Add to cart** | dialog closed, the product added once |
| another site of the same brand | dialog closed, signed in |

**Steps:**

1. Follow the asking tab's link in a third tab.
2. Return to the row's other tab.

**Expected Results:**

* The row's outcome.

<!-- trace:case id=g10.shared-sign-in.TC-j4x rev=2 -->
### shared.auth-sign-in.US8-TC4: Tabs on another brand or the console stay signed out when a site link is followed

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer(collector) signed out, with the row's other tab open and its sign-in open.
* An asking tab on `<g10url>` has a link waiting.

**Test data:**

| Other tab |
| --- |
| a ZZZ site, its sign-in dialog open |
| `<console url>`'s sign-in page |

**Steps:**

1. Follow the asking tab's link in a third tab.
2. Return to the row's other tab.

**Expected Results:**

* The other tab still asks for sign-in and is signed out.

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
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer(collector) is signed in on `<g10url>` as `<account A>`, holding an unused link for `<account B>`.

**Test data:**

| Choice | Afterwards |
| --- | --- |
| **Switch** | signed in as `<account B>` |
| **Stay** | still `<account A>`; the link still works once |
| dismiss the toast | still `<account A>`; the link still works once |

**Steps:**

1. Follow the link for `<account B>`.
2. Wait ten seconds, then make the row's choice.

**Expected Results:**

* Step 1: UI matching account-sign-in-blocks-linkfollowtoasts--different-account, naming `<account B>`'s email; still signed in as `<account A>`.
* Step 2: the toast is still there before the choice; then the row's outcome.

<!-- trace:case id=g10.shared-sign-in.TC-0gq rev=1 -->
### shared.auth-sign-in.US9-TC2: A link for the signed-in account itself asks nothing

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-09

**Pre-conditions:**

* customer(collector) is signed in on `<g10url>` as `<account A>`, holding an unused link for `<account A>`.

**Steps:**

1. Follow the link.

**Expected Results:**

* No toast; still signed in as `<account A>`.

---

## shared.auth-sign-in.US10: Collector sees the wait end when they sign in from another device

**As a** collector who asked for a sign-in link on one device,
**I want** that device's wait to end once I sign in from another,
**so that** I am not left resending for an address I already used to sign in
elsewhere.

<!-- trace:case id=g10.shared-sign-in.TC-uxi rev=2 -->
### shared.auth-sign-in.US10-TC1: A waiting dialog ends its wait when the address signs in on another device

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer(collector) asked for a link for `<address>` on device 1, on `<g10url>`, in two tabs; one tab is left in the background.

**Test data:**

| On device 2 |
| --- |
| follows device 1's link, before **Resend** turns on |
| signs in with Google as `<address>`, after **Resend** turns on |

**Steps:**

1. Do the row's step on device 2.
2. Look at device 1's front tab, then select the background tab.

**Expected Results:**

* Both tabs end the wait, UI matching account-sign-in-blocks-linkfollowtoasts--settled-elsewhere; device 1 stays signed out.

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
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-10

**Pre-conditions:**

* customer(collector) asked for a link for `<address>` on device 1, on `<g10url>`.

**Test data:**

| On device 2 |
| --- |
| follows a used link for `<address>` |
| signs in as another address |

**Steps:**

1. Do the row's step on device 2.
2. Look at device 1.

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
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* A browser signed in to Google, on a brand with Google on, signed out on the site.

**Test data:**

| Page | Console session |
| --- | --- |
| the home | none |
| checkout | none |
| the home | signed in on `<console url>` |

**Steps:**

1. Open the row's page.
2. Leave the prompt alone for thirty seconds.

**Expected Results:**

* Step 1: the corner prompt shows.
* Step 2: the page is as it was; nobody is signed in.

<!-- trace:case id=g10.shared-sign-in.TC-y7m rev=1 -->
### shared.auth-sign-in.US11-TC2: A person signed in on the site is not offered the corner prompt

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer(collector) is signed in on `<g10url>`, a brand with Google on, in a browser signed in to Google.

**Steps:**

1. Open three pages of the site.

**Expected Results:**

* No corner prompt on any of them.

<!-- trace:case id=g10.shared-sign-in.TC-x2b rev=1 -->
### shared.auth-sign-in.US11-TC3: The page works when Google's prompt cannot load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer(collector) is signed out on a brand with Google on, with Google's script blocked in the browser.

**Steps:**

1. Open the home and select **Add to cart** on a product.

**Expected Results:**

* No corner prompt; the page works and the sign-in dialog opens.

<!-- trace:case id=g10.shared-sign-in.TC-m40 rev=2 -->
### shared.auth-sign-in.US11-TC4: The corner prompt yields to the sign-in dialog

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer(collector) signed out on `<g10url>`, a brand with Google on, the corner prompt showing.

**Steps:**

1. Open sign-in.
2. Close the dialog without signing in.
3. Open three more pages of the site.

**Expected Results:**

* Step 1: the prompt is gone while the dialog is open.
* Step 3: the prompt does not come back for the rest of the visit.

---

## shared.auth-sign-in.US12: Operator follows a sign-in link and only the console is signed in

**As an** operator,
**I want** a link I asked for from the console to sign in the console and nothing else,
**so that** my shopping session on the site stays as it was, whoever it belongs to.

### shared.auth-sign-in.US12-TC1: A sign-in signs in only the side it was asked from

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) has the row's site session, and no console session.

**Test data:**

| Brand | Asked from | Site session before | Followed | Afterwards |
| --- | --- | --- | --- | --- |
| Grade10 | the console, by email | none | in a console tab | console signed in, site signed out |
| Grade10 | the console, by email | another customer account | on another device, no console tab open | console signed in as the operator, site still the customer |
| Grade10 | the console, by email, after one **Resend** | the operator's own account | in a new tab | console signed in, site unchanged |
| Grade10 | the console, opened at an address naming a site page | none | in a new tab | lands on the console, signed in |
| Grade10 | the console, with Google | none | - | console signed in, site signed out |
| Grade10 | the site, by email | none | in a new tab | site signed in, the console asks for sign-in |
| Grade10 | checkout's email verification | none | - | site signed in, the console asks for sign-in |
| ZZZ | the ZZZ console, by email | none | in a new tab | ZZZ console signed in only |

**Steps:**

1. Ask for sign-in from the row's place.
2. Follow the link as the row says.
3. Open the site and the console in new tabs.

**Expected Results:**

* Step 3: the row's outcome; nothing asks which account to keep.

<!-- trace:case id=g10.shared-sign-in.TC-xvi rev=2 -->
### shared.auth-sign-in.US12-TC2: A console link that cannot sign in says why on the console's sign-in page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) is signed out on `<console url>`; the site is signed in as a customer.

**Test data:**

| Link | Console sign-in page says |
| --- | --- |
| expired | the link has expired |
| used | the link no longer works |
| for a banned operator | the account cannot sign in, with no new link offered |

**Steps:**

1. Follow the row's link.
2. Open the site.

**Expected Results:**

* Step 1: the console's sign-in page with the row's message in the page, no toast; still signed out.
* Step 2: the site is still the customer's.

<!-- trace:case id=g10.shared-sign-in.TC-7cx rev=2 -->
### shared.auth-sign-in.US12-TC3: A console link for another operator asks before switching the console

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) is signed in on `<console url>` as `<operator A>`, holding an unused console link for `<operator B>`; the site is signed in as a customer.

**Test data:**

| Choice | Console afterwards |
| --- | --- |
| **Switch** | `<operator B>` |
| **Stay** | `<operator A>` |

**Steps:**

1. Follow the link for `<operator B>`.
2. Make the row's choice.
3. Open the site.

**Expected Results:**

* Step 1: the console's sign-in page names `<operator B>`'s email and offers **Switch** and **Stay**.
* Step 2: the row's console account.
* Step 3: the site is still the customer's.

### shared.auth-sign-in.US12-TC4: Waits and limits on the console and the site run apart

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(operator) is signed out on both `<g10url>` and `<console url>`.

**Steps:**

1. Ask for a site link for `<operator email>`.
2. At once, ask for a console link for the same address.
3. Ask for a second console link before the minute ends.
4. On another device, follow the console link.
5. Look at the site tab.

**Expected Results:**

* Step 2: the console link is sent.
* Step 3: told to wait; no third email.
* Step 4: the console tab's wait ends.
* Step 5: the site tab still waits, and the site link still signs in.

### shared.auth-sign-in.US12-TC5: A site link an operator sends from the console signs in the site only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** Link surface

**Pre-conditions:**

* staff(operator) is signed in on `<console url>` with a role holding `user:create`, on a test winner's page.

**Steps:**

1. Select **Email sign-in link** beside the test winner.
2. Follow the customer's link in another browser that holds no session.
3. Return to the operator's console tab.

**Expected Results:**

* Step 2: the site is signed in as the customer; the console in that browser asks for sign-in.
* Step 3: the operator's console session is unchanged.

### shared.auth-sign-in.US12-TC6: A console role without user:create is offered no site link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* staff(support) is signed in on `<console url>`, on a test winner's page.

**Steps:**

1. Look beside the test winner.

**Expected Results:**

* No **Email sign-in link** action.

## Settled

* Whether a console tab carries on a refused action after its second factor
  belongs to the console's own capability, which specifies no second factor
  at all today.
* An absolute expiry time alongside the link's duration was rejected; the
  duration is the only form the promise takes.
* The confirmation dialog stating the link's lifetime was rejected; the
  promise lives in the email only.
* A lifetime settable per environment or brand was rejected; one lifetime
  applies everywhere.
* A pending, unused, unexpired link stays valid after its address settles
  elsewhere by another method; only the link's own expiry or a later send
  ends it, exactly as before this change.
* A settle on a different brand does not close this brand's wait: grade10
  and zzz run entirely separate auth deployments and databases (no shared
  account, no shared check between them), so a settle on one brand
  affecting the other's wait is not a reachable case for this capability's
  mechanism to guard against.
* Dismissing the wait and reopening sign-in starts fresh: already governed
  by the existing dismiss/reopen contract (opening sign-in again starts at
  the email step); nothing persists across a dismissal that would need
  asserting separately.
* A link asked from the console signs in the console whoever follows it and on whichever device: the token names the surface, so a follow with no console tab open still signs in the console.
* A sign-in link sent before release carries no surface and signs in the site, as every pre-release link did. A token that is malformed, unknown or carries no console prefix reads the same way, so a failed follow of one lands on the brand home with the site's toast.
* The send cap and a new link's replacing earlier links count per address and surface: a console link right after a site link for the same address is sent and does not invalidate it (decisions Q12).
* When an address signs in on one surface, only a wait on the same surface stops; a wait on the other surface keeps running (decisions Q13).
* A failed, expired, banned or different-account console-asked link lands on the console's own sign-in page with an inline message, and the different-account case offers Switch and Stay there; the console has no toasts (decisions Q14).
* A sign-in dialog closes for a session that arrives on its own side: two tabs of the site, or two of the console, close together, and a sign-in on the other side leaves a dialog open (decisions Q11).
* The brand guard that ignores an off-brand location also ignores a location on the other surface, on send and again on follow, so a console link naming a site page lands on the console.
* A link an operator action on the console sends for a customer account asks for the site and signs in the site, not the console: it is the one exception to the asking surface, only an elevated console session whose role holds `user:create` may ask for it, a request with no console session, a role without the grant or a second factor not yet proved is refused and sends nothing, and the sender's console session is left as it was (decisions Q16). The human confirmed the grant 2026-10-06, which the planning run had named from the test-winner action's existing gate in `complete-auction-post-sale`.
* Google's auto-prompt is the site's and reads the session of the surface it shows on, so a console session does not withhold it: a person signed in on the console only is still offered it on the site. The site's SPAs mount the prompt and the console does not; this change adds no console mount, since no decision gives the console one, so there is no console prompt for a site session to withhold or offer.

## Reconciliation

**Run:** QA2, 2026-10-06, in a fresh context. QA1's blind pass read the Purpose and Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` (its `## Raised` was empty), the Session and Sign-In pages, the durable suite for id continuity and `shared/auth/domain-tcs.md`, and was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read both readings, `decisions.md`, `tech-design.md`, `tasks.md`, the delta and the durable suite. It is a statement, not proof. No case of this change has been accepted or published, so a draft keeps its `<v>` when it is reworded.

- **Agreed** - `shared-auth-sign-in-US12-TC1-1` with `shared-auth-sign-in-SC-91`; `shared-auth-sign-in-US12-TC2-1` with `shared-auth-sign-in-SC-92`; `shared-auth-sign-in-US12-TC3-1` with `shared-auth-sign-in-SC-91`, the site session left as it was; `shared-auth-sign-in-US12-TC4-1` with `shared-auth-sign-in-SC-96`; `shared-auth-sign-in-US12-TC6-1` with `shared-auth-sign-in-SC-69` read on the console and `shared-auth-sign-in-SC-96`; `shared-auth-sign-in-US12-TC8-1` with `shared-auth-sign-in-SC-91`; `shared-auth-sign-in-US12-TC9-1` with `shared-auth-sign-in-SC-91` and the durable followed-elsewhere rule; `shared-auth-sign-in-US12-TC10-1` with `shared-auth-sign-in-SC-91` on ZZZ, one case for the second brand
- **Adjusted, by QA2** - `shared-auth-sign-in-US12-TC3-1` and `shared-auth-sign-in-US12-TC7-1` named `<operator TOTP code>` from an account the case does not hold; TC3 now takes the code from `<collector account>` and TC7 from `<operator account C>`, the account each one signs in on the console
- **Adjusted, by QA2 (review)** - `shared-auth-sign-in-US12-TC18-1` walked only the site half of the pair; it now also signs in the console while a site wait runs, so `shared-auth-sign-in-SC-102` is reached by a step and not by the title alone
- **Adjusted, by QA2, a case revised** - `shared-auth-sign-in-US8-TC11-2` revises the durable `US8-TC11-1`, whose pre-condition read "tabs A and C open on the same brand" and so claimed more than the re-scoped `shared-auth-sign-in-SC-51` states: two tabs on the same side, the site or the console. It runs once per row for the site and for the console, goes back to `draft` as the durable case was `actual`, and carries the durable case's `trace:case` marker at `rev=2` with its `covers` list as it was, since `pnpm run accept:preflight` refuses a revised case that reuses a durable case's id without it; no marker is allocated for it
- **Adjusted, by QA2 (second pass)** - `shared-auth-sign-in-SC-110` and `shared-auth-sign-in-US12-TC24-1` now name an account whose role holds `user:create`, so the missing console session is the one thing that refuses the request, and both say no console session where they said no elevated one, a wording `shared-auth-sign-in-SC-111` and `shared-auth-sign-in-SC-112` now share; `shared-auth-sign-in-US12-TC22-1` and `shared-auth-sign-in-US12-TC23-1` name `admin` and its grant where they said any console access, which `support` also holds and which the requirement refuses
- **Raised, folded into spec** - a console session as a different account when a console link is followed, which `shared-auth-sign-in-US12-TC5-1` and `shared-auth-sign-in-US12-TC7-1` asserted and no scenario stated: `shared-auth-sign-in-SC-98`, which holds what decisions Q8 settles (the console's own session is judged, kept, and no console session is made for the link's account) and leaves the choice's presentation to the raised row below; its case is `shared-auth-sign-in-US12-TC13-1`. Scenarios no QA1 case walked: `shared-auth-sign-in-SC-93` by `shared-auth-sign-in-US12-TC11-1`; `shared-auth-sign-in-SC-97` by the api case `shared-auth-sign-in-US12-TC12-1`; `shared-auth-sign-in-SC-94` by `shared-auth-sign-in-US12-TC14-1`; `shared-auth-sign-in-SC-95` by the api case `shared-auth-sign-in-US12-TC15-1`
- **Raised, rejected** - none
- **Raised, settled by the artifacts** - whether a link followed with no console tab open still signs in the console, and what a link sent before release signs in (the token's prefix, decisions Q8 and `shared-auth-sign-in-SC-91`). Each is in `## Settled`; none goes to `decisions.md`
- **Raised, answered 2026-10-06** - the three rows below were put to the human and landed as decisions Q12 to Q14: the send cap and supersession count per address and surface, so `shared-auth-sign-in-SC-99` and `shared-auth-sign-in-SC-100`, walked by `shared-auth-sign-in-US12-TC16-1` and `shared-auth-sign-in-US12-TC17-1`; a wait stops only for a sign-in on the same surface, so `shared-auth-sign-in-SC-101` and `shared-auth-sign-in-SC-102`, walked by `shared-auth-sign-in-US12-TC18-1`; a failed or different-account console-asked link lands on the console's sign-in page with an inline message, so `shared-auth-sign-in-SC-103`, walked by `shared-auth-sign-in-US12-TC19-1`, `shared-auth-sign-in-SC-104`, walked by `shared-auth-sign-in-US12-TC20-1`, `shared-auth-sign-in-SC-105`, walked by `shared-auth-sign-in-US12-TC5-1`, `shared-auth-sign-in-SC-106`, walked by `shared-auth-sign-in-US12-TC7-1`, and `shared-auth-sign-in-SC-107`, walked by `shared-auth-sign-in-US12-TC21-1`, with `shared-auth-sign-in-US12-TC5-1` and `shared-auth-sign-in-US12-TC7-1` reworded from a toast to the inline choice. The cases are new drafts; no case was `actual`.
- **Raised after QA2, answered 2026-10-06** - which surface a link signs in when a console operator sends it for a customer account, as the test-winner flow in `complete-auction-post-sale` does: the site, the one exception to decisions Q8 and `shared-auth-sign-in-SC-91` (decisions Q16). The new scenarios are `shared-auth-sign-in-SC-108`, walked by `shared-auth-sign-in-US12-TC22-1`, `shared-auth-sign-in-SC-109`, walked by `shared-auth-sign-in-US12-TC23-1`, and `shared-auth-sign-in-SC-110`, walked by `shared-auth-sign-in-US12-TC24-1`. The cases are new drafts, written by the author from the answer: no fresh blind pass was run for them, and none was `actual`
- **Raised after QA2, the grant confirmed 2026-10-06** - which elevated console session may ask for a site link: one whose role holds `user:create`, the grant the test-winner action already needs, named by the planning run from `complete-auction-post-sale` and confirmed by the human (decisions Q16). It adds `shared-auth-sign-in-SC-111`, walked by `shared-auth-sign-in-US12-TC25-1`, for a role without the grant, refused as not allowed, and `shared-auth-sign-in-SC-112`, walked by `shared-auth-sign-in-US12-TC26-1`, for a second factor not yet proved, refused with the ask for it. Both are new drafts; no case was `actual`
- **Written after the blind pass, reconciled here** - `shared-auth-sign-in-SC-108` to `shared-auth-sign-in-SC-112` with `shared-auth-sign-in-US12-TC22-1` to `shared-auth-sign-in-US12-TC26-1`, written from the human's answer Q16, the grant named by the planning run and confirmed by the human; and the re-scope of `shared-auth-sign-in-SC-51` with `shared-auth-sign-in-US8-TC11-2`, written at the human's direction to read the dialog requirement against decisions Q11 to Q13. QA1's blind pass never saw them, so none of them has a blind reading beside it; QA2 reconciled them against the delta, `decisions.md`, `tech-design.md` D2 and D5, `tasks.md` 4.1, 4.3 and 4.11 and the durable suite in this fresh context, in a second pass the same day as the run above. It is a statement, not proof
- **Raised, as escalated** - three rows in `decisions.md`'s `## Raised`: whether the send cap and link supersession are per address or per address and surface; whether a wait ends when the address signs in on the other surface; where a failed or mismatched console-asked link lands and how the console says so. `shared-auth-sign-in-US12-TC5-1` and `shared-auth-sign-in-US12-TC7-1` assume a Switch and Stay choice on the console and were reworded when the third was answered
- **Adjusted, by QA2 (review), same-side wording** - the GIVENs and WHENs of `shared-auth-sign-in-SC-70` to `shared-auth-sign-in-SC-78` now name the sign-in, the follow or the settle as on another device on the same side as the waiting surface, or on the side the link was asked from, so none reads as a settle across the brand or across surfaces. Their ids and markers are as they were
- **Raised after QA2, the auto-prompt's reading** - `shared-auth-sign-in-SC-86` read "a person who already has a session" with no surface, so a console session could be read as withholding the prompt on the site. The requirement is modified: it is the site's prompt, `shared-auth-sign-in-SC-80` to `shared-auth-sign-in-SC-90` carry their markers, `shared-auth-sign-in-SC-86` reads "a site session", and `shared-auth-sign-in-SC-114`, a console session on the site, is new. `shared-auth-sign-in-US12-TC27-1` walks it, with one row, the person signed in on the console only visiting the site; it is a new draft with no blind reading beside it, and no case was `actual`. The first draft also had shared-auth-sign-in-SC-113, a site session on a console page that offers the prompt, and a console row in the case. Both were removed before acceptance: only the site's SPAs mount the prompt, the console does not, and no decision in `decisions.md` adds a console mount, so the scenario described a surface that does not exist. shared-auth-sign-in-SC-113 is retired and its id is not reused. The durable `US11-TC3-1` still holds on the site and is left as it is
- **Adjusted, by QA2 (review), loose wording** - `shared-auth-sign-in-SC-23` and its requirement now say the site, "on this brand's site", with `shared-auth-sign-in-SC-21` to `shared-auth-sign-in-SC-25` carried with their markers. The durable case `US4-TC6-1`, "Trusted product signs the person in on this brand", still holds on the site and is left as it is
- **Left to the durable cases** - `shared-auth-sign-in-SC-31` and `shared-auth-sign-in-SC-32`, whose wording only gained the surface: `US5-TC1-1` and `US5-TC3-1` still verify them and are left as they are; `shared-auth-sign-in-SC-63` to `shared-auth-sign-in-SC-69`, the site's mismatch, by `US9-TC1-1` to `US9-TC7-1`; the settled-elsewhere wait by `US10-TC1-1` to `US10-TC9-1`, whose scenarios gained only the same-side wording and whose `US10-TC6-1` reads "every surface waiting" on the site's own surfaces and stays as it is, since the wait is now scoped to the same surface (decisions Q13); `shared-auth-sign-in-SC-37` to `shared-auth-sign-in-SC-41`, whose GIVEN now says the link was asked from the site, by the customer cases `US6-TC1-1` to `US6-TC5-1`, which stay as they are because the wording moved nothing they assert; `shared-auth-sign-in-SC-50`, by `US8-TC1-1`, which holds on either side; and `US8-TC7-1`, whose "another site of the brand" is a page of the one customer site, so it still holds, stays `actual` and `automated`, and is not touched
- **Covered at domain** - the site's link sign-in, which this change leaves as it was, is walked by `shared.auth-dmn.US2-TC1`; the console-against-site lifecycle across session, sign-in and sessions is a draft domain case in this change's `domain-tcs.md` (`shared.auth-dmn.US8-TC1`)
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-auth-sign-in-US-12` has `US12-TC1-1` to `US12-TC21-1`; every scenario from `shared-auth-sign-in-SC-91` to `shared-auth-sign-in-SC-112`, and `shared-auth-sign-in-SC-114`, is reached, shared-auth-sign-in-SC-113 being retired; the `Google` group has `US12-TC14-1` and `US12-TC27-1` beside the durable `US3-TC1-1` to `US3-TC3-1`, and the `Link surface` group has `US12-TC15-1` and `US12-TC22-1` to `US12-TC26-1`; `shared-auth-sign-in-US-08` has `US8-TC11-2` beside the durable `US8-TC1-1` to `US8-TC10-1`. `shared-auth-sign-in-SC-51` is walked by `US8-TC11-2` but not joined to it through an anchor, since it serves the `Emailed link` group and the case traces the journey; the durable suite held the same gap and this change leaves it
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk; `shared-auth-sign-in-US8-TC11-2` carries the durable marker revised to `rev=2`, as `shared-auth-session-US2-TC1-2` does, and `shared-auth-sign-in-SC-50` and `shared-auth-sign-in-SC-51` carry the durable markers they already had, as the other modified scenarios do


- **Assumed** - an email address has one `@`, a domain containing a `.`, and at most 254 characters; a required field holding nothing or only spaces is refused; spaces around a typed email address are ignored; after a refused submit, what was typed stays (Common Rules). They ride on `shared.auth-sign-in.US1-TC1` and `shared.auth-sign-in.US1-TC3`
