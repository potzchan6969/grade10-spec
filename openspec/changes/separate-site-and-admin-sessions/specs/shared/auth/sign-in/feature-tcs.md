# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-auth-sign-in-US8: Collector follows the link and the tab that asked carries on

**As a** collector who asked for a sign-in link and followed it in another tab,
**I want** the tab I asked from to finish what it stopped me doing,
**so that** I am not sent back to press the same thing a second time.

<!-- trace:case id=g10.shared-sign-in.TC-4z2 rev=2 covers=g10.shared-sign-in.SC-neg,g10.shared-sign-in.SC-wiy,g10.shared-sign-in.SC-laa,g10.shared-sign-in.SC-dyk,g10.shared-sign-in.SC-szm,g10.shared-sign-in.SC-lws,g10.shared-sign-in.SC-m9z -->
### shared-auth-sign-in-US8-TC11-2: Dialog on a tab that asked for nothing closes too, on its own side

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* Nobody is signed in on <side url>, with tabs A and C open on it, each showing the sign-in dialog.
* A sign-in link was asked for in tab A only.

**Test data:**

| Side | <side url> | <person email> | <second factor code> |
| --- | --- | --- | --- |
| Site | <grade10 store url> | collector@example.com, an address with an account | None asked |
| Console | <grade10 admin console url> | operator@example.com, the address of an account holding console access | A valid current code from that account's authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A, entering <second factor code> where the console asks for one.
3. Return to tab C.

**Expected Results:**

* Step 2 shows tab A with no sign-in dialog and <person email>'s account signed in.
* Step 3 shows tab C with no sign-in dialog and the same account signed in.

## shared-auth-sign-in-US12: Operator follows a sign-in link and only the console is signed in

**As an** operator,
**I want** a link I asked for from the console to sign in the console and nothing else,
**so that** my shopping session on the site stays as it was, whoever it belongs to.

### shared-auth-sign-in-US12-TC1-1: Link asked from the console signs in the console only

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> holds console access and has requested a sign-in link from the console, which has not been followed.
* Tab A is open on <grade10 admin console url>, showing Check Your Email.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A and enter <operator TOTP code>.
3. In tab C, navigate to <grade10 store url>.

**Expected Results:**

* Step 2 shows <operator account> signed in on the console, unreloaded.
* Step 3 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC2-1: Link asked on the site signs in the site only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 store url> and on <grade10 admin console url>.
* <operator account> holds console access and has requested a sign-in link from the site, which has not been followed.
* Tab A is open on <grade10 store url>, showing Check Your Email.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.
3. In tab C, navigate to <grade10 admin console url>.

**Expected Results:**

* Tab A shows <operator account> signed in on the site, unreloaded.
* Step 3 shows the console's sign-in page, not the console.

### shared-auth-sign-in-US12-TC3-1: Console link leaves the site session untouched

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <collector account> is signed in on <grade10 store url> in tab A, with <cart item> in its cart.
* <collector account> has requested a sign-in link from <grade10 admin console url> and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | A customer account holding `user` only that also holds console access |
| `<cart item>` | A card in <collector account>'s cart |
| `<console TOTP code>` | A valid current code from <collector account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Enter <console TOTP code> on the console.
3. Return to tab A.

**Expected Results:**

* Step 2 opens the console as <collector account>.
* Tab A still names <collector account>, with <cart item> in its cart.
* The site session is the one it was before step 1.

### shared-auth-sign-in-US12-TC4-1: Console link signs in its own account beside a different site account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <collector account> is signed in on <grade10 store url> in tab A.
* admin is signed out on <grade10 admin console url>.
* <operator account>, a different account, has requested a sign-in link from the console and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector account>` | A customer account holding `user` only |
| `<operator account>` | A different account holding console access |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Enter <operator TOTP code> on the console.
3. Return to tab A.

**Expected Results:**

* Step 1 shows no different-account toast.
* Step 2 opens the console as <operator account>.
* Tab A still names <collector account>.

### shared-auth-sign-in-US12-TC5-1: Different-account choice on the console is judged on the console session

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* <operator account B> is signed in on <grade10 store url> in the same browser.
* A sign-in link for <operator account B>, requested from the console, is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access, signed in on the console |
| `<operator account B>` | A different account holding console access, signed in on the site |

**Steps:**

1. Follow that link in a new tab.

**Expected Results:**

* The console's own sign-in page states inline that the person is signed in with a different account and names <operator account B>'s email.
* The inline choice offers Switch and Stay.
* No toast shows.
* The console session and the site session are both unchanged.

### shared-auth-sign-in-US12-TC6-1: A site session as a different account raises no mismatch on a console link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* <collector account> is signed in on <grade10 store url> in the same browser.
* A sign-in link for <operator account A>, requested from the console, is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access, signed in on the console |
| `<collector account>` | A customer account holding `user` only |

**Steps:**

1. Follow that link in a new tab.

**Expected Results:**

* No different-account toast shows.
* The console session and the site session are both unchanged.

### shared-auth-sign-in-US12-TC7-1: Switch on the console ends the console session only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> in tab A.
* <collector account> is signed in on <grade10 store url> in tab B.
* The console's own sign-in page is showing the inline different-account choice, offering Switch and Stay, after following a link for <operator account C>, requested from the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access |
| `<collector account>` | A customer account holding `user` only |
| `<operator account C>` | A different account holding console access |
| `<operator TOTP code>` | A valid current code from <operator account C>'s authenticator |

**Steps:**

1. Activate Switch.
2. Enter <operator TOTP code> on the console.
3. Return to tab B.

**Expected Results:**

* Step 1 ends <operator account A>'s console session.
* Step 2 opens the console as <operator account C>.
* Tab B still names <collector account>.

### shared-auth-sign-in-US12-TC8-1: Console link followed with no console tab open still signs in the console

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> requested a sign-in link from the console on another device, and no tab is waiting on this device.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email on this device.
2. Enter <operator TOTP code> on the console.
3. Navigate to <grade10 store url>.

**Expected Results:**

* Step 2 opens the console as <operator account>.
* Step 3 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC9-1: Waiting console tab carries on while a signed-out site tab does not

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on both surfaces.
* Tab A is on <grade10 admin console url>, showing Check Your Email, after requesting a link for <operator account>.
* Tab B is on <grade10 store url>, signed out, in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link in tab C.
2. Return to tab A and enter <operator TOTP code>.
3. Return to tab B.

**Expected Results:**

* Tab A shows <operator account> signed in on the console, and the Check Your Email dialog is gone.
* Tab B still shows nobody signed in, unreloaded.

### shared-auth-sign-in-US12-TC10-1: ZZZ console link signs in the ZZZ console only

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <zzz admin console url> and on <zzz store url>.
* <zzz operator account> has requested a sign-in link from the ZZZ console and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<zzz operator account>` | An account holding console access on ZZZ |
| `<zzz operator TOTP code>` | A valid current code from <zzz operator account>'s authenticator |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Enter <zzz operator TOTP code> on the ZZZ console.
3. In tab C, navigate to <zzz store url>.

**Expected Results:**

* Step 2 opens the ZZZ console as <zzz operator account>.
* Step 3 shows nobody signed in on the ZZZ site.

### shared-auth-sign-in-US12-TC11-1: Resend from the console keeps the console as the surface that asked

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> has requested a sign-in link from the console and Resend has turned on.
* Tab A is open on <grade10 admin console url>, showing Check Your Email.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |
| `<operator TOTP code>` | A valid current code from <operator account>'s authenticator |

**Steps:**

1. In tab A, activate Resend.
2. Follow the unused, unexpired link the resend sent in tab B.
3. Return to tab A and enter <operator TOTP code>.
4. In tab C, navigate to <grade10 store url>.

**Expected Results:**

* Step 3 shows <operator account> signed in on the console.
* Step 4 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC12-1: A link asked from the console that names a site location lands on the console

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of an account holding console access |
| `<site location>` | A page of <grade10 store url> |

**Steps:**

1. Ask for a sign-in link as the console for <operator email>, naming <site location> as the location to return to.
2. Follow the unused, unexpired link.

**Expected Results:**

* Step 2 ends on <grade10 admin console url>, not on <site location>.
* The site has no signed-in person.

### shared-auth-sign-in-US12-TC13-1: Console session as a different account is kept when a console link is followed

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* A sign-in link for <operator account B>, requested from the console, is unused and unexpired.
* <collector account> is signed in on <grade10 store url> in the same browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access, signed in on the console |
| `<operator account B>` | A different account holding console access |
| `<collector account>` | A customer account holding `user` only |

**Steps:**

1. Follow that link in a new tab and make no choice there.
2. Reload the console tab.
3. Reload <grade10 store url>.

**Expected Results:**

* Step 2 still shows <operator account A> on the console.
* No console session exists for <operator account B>.
* Step 3 still names <collector account>.

### shared-auth-sign-in-US12-TC14-1: Google sign-in on the console signs in the console only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Google

**Pre-conditions:**

* Grade10 offers Google sign-in.
* admin is signed out on <grade10 admin console url> and on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<google account>` | A Google account with a verified email, whose address belongs to an account holding console access |
| `<operator TOTP code>` | A valid current code from that account's authenticator |

**Steps:**

1. On <grade10 admin console url>, choose Google and complete it with <google account>.
2. Enter <operator TOTP code> on the console.
3. In tab B, navigate to <grade10 store url>.

**Expected Results:**

* Step 2 opens the console as the account for <google account>'s address.
* Step 3 shows nobody signed in on the site.

### shared-auth-sign-in-US12-TC15-1: A product's verified-email sign-in is the site's and never the console's

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
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds console access and is signed out on <grade10 admin console url> and on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding console access |

**Steps:**

1. A Grade10 product that has verified <operator account>'s email signs that account in.
2. Ask who is calling as the site.
3. Ask who is calling as the console.

**Expected Results:**

* Step 2 receives <operator account>.
* Step 3 receives no person.

### shared-auth-sign-in-US12-TC16-1: A console link right after a site link for the same address is sent and the site link stays alive

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> asked for a sign-in link from <grade10 store url> less than a minute ago, and it is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Ask for a sign-in link for <operator email> on <grade10 admin console url>.
2. Follow the link asked from <grade10 store url>.
3. Navigate to <grade10 admin console url>.

**Expected Results:**

* Step 1 sends the link and does not tell them to wait.
* Step 2 signs in <operator account> on the site.
* Step 3 shows nobody signed in on the console.

### shared-auth-sign-in-US12-TC17-1: A second console link in a minute is told to wait

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <operator account> asked for a sign-in link from <grade10 admin console url> less than a minute ago, and it is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Ask again for a sign-in link for <operator email> on <grade10 admin console url>.

**Expected Results:**

* Step 1 sends no second email and tells them to wait.

### shared-auth-sign-in-US12-TC18-1: A sign-in on one surface stops only that surface's wait and leaves the other surface's wait running

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on both surfaces.
* Tab A is on <grade10 admin console url>, showing Check Your Email, after requesting a link for <operator account>.
* Tab B is on <grade10 store url>, showing Check Your Email, after requesting a link for <operator account>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Follow the unused, unexpired link asked from <grade10 store url> in tab C.
2. Return to tab B.
3. Return to tab A.
4. In tab B, open sign-in again and request a link for <operator email>, waiting out the resend wait if it shows.
5. Follow the unused, unexpired link asked from <grade10 admin console url> in tab C.
6. Return to tab B.
7. Return to tab A.

**Expected Results:**

* Step 2 shows tab B no longer waiting, with the message that sign-in completed on another device.
* Step 3 shows tab A still on Check Your Email, with no such message.
* Step 4 sends a link for the site without ending tab A's wait.
* Step 6 shows tab B still on Check Your Email, with no such message.
* Step 7 shows tab A no longer waiting, with the message that sign-in completed on another device.

### shared-auth-sign-in-US12-TC19-1: A failed console link lands on the console's sign-in page with an inline message

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* A sign-in link asked from <grade10 admin console url> for <operator account> has expired.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator email>` | operator@example.com, the address of <operator account> |

**Steps:**

1. Follow the expired link.

**Expected Results:**

* Step 1 lands on the console's own sign-in page.
* The page states inline that the link has expired.
* No toast shows.
* Nobody is signed in on the console or the site.

### shared-auth-sign-in-US12-TC20-1: A banned account's console link says inline that they cannot sign in

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* admin is signed out on <grade10 admin console url> and on <grade10 store url>.
* <banned operator account> is banned, and a sign-in link asked from <grade10 admin console url> for its address is unused and unexpired.

**Test data:**

| Field | Value |
| --- | --- |
| `<banned operator account>` | An account holding console access that an admin has banned |

**Steps:**

1. Follow that link.

**Expected Results:**

* Step 1 lands on the console's own sign-in page.
* The page states inline that they cannot sign in and does not invite them to request another link.
* No toast shows.
* Nobody is signed in on the console or the site.

### shared-auth-sign-in-US12-TC21-1: Stay on the console's inline choice keeps the console session

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
* **Trace:** shared-auth-sign-in-US-12

**Pre-conditions:**

* <operator account A> is signed in on <grade10 admin console url> with the second factor proved.
* The console's own sign-in page is showing the inline different-account choice, offering Switch and Stay, after following a link for <operator account C>, requested from the console.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account A>` | An account holding console access |
| `<operator account C>` | A different account holding console access |

**Steps:**

1. Activate Stay.

**Expected Results:**

* Step 1 keeps <operator account A> signed in on the console.
* <operator account C> is not entered.

### shared-auth-sign-in-US12-TC22-1: A site link an operator action sends signs in the site and not the console

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin` and is signed in on <grade10 admin console url> with the second factor proved.
* <customer account> is signed out on <grade10 store url> and on <grade10 admin console url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |
| `<site location>` | A page of <grade10 store url> |

**Steps:**

1. As the console, with <operator account>'s session, ask for a sign-in link for the site to <customer email>, naming <site location> as the location to return to.
2. Follow the unused, unexpired link with a client that holds no cookies.
3. Ask who is calling as the site.
4. Ask who is calling as the console.

**Expected Results:**

* Step 2 ends on <site location>, not on <grade10 admin console url>.
* Step 3 receives <customer account>.
* Step 4 receives no person.

### shared-auth-sign-in-US12-TC23-1: Following an operator action's site link keeps the console session in place

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin` and is signed in on <grade10 admin console url> with the second factor proved, in one client.
* <customer account> is signed out on <grade10 store url>.
* An operator action asked for a sign-in link for the site to <customer email> and it has not been followed.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. In the client holding the console session, follow the unused, unexpired link.
2. Ask who is calling as the site.
3. Ask who is calling as the console.

**Expected Results:**

* Step 2 receives <customer account>.
* Step 3 receives <operator account>.

### shared-auth-sign-in-US12-TC24-1: A site link asked for with no console session is refused

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
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin`, is signed in on <grade10 store url>, and is signed out on <grade10 admin console url>.
* <customer account> has received no sign-in email since the case began.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. As the console, presenting only <operator account>'s site session, ask for a sign-in link for the site to <customer email>.
2. Read the mail sent to <customer email>.

**Expected Results:**

* Step 1 is refused as not signed in.
* Step 2 shows no sign-in email.

### shared-auth-sign-in-US12-TC25-1: A site link asked for by a console role without user:create is refused

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
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `support` only and is signed in on <grade10 admin console url> with the second factor proved.
* <customer account> has received no sign-in email since the case began.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account whose only operator role is `support`, which holds no `user:create` |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. As the console, with <operator account>'s console session, ask for a sign-in link for the site to <customer email>.
2. Read the mail sent to <customer email>.

**Expected Results:**

* Step 1 is refused as not allowed.
* Step 2 shows no sign-in email.

### shared-auth-sign-in-US12-TC26-1: A site link asked for with an unproved second factor is refused

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
* **Trace:** Link surface

**Pre-conditions:**

* <operator account> holds `admin`, has a second factor set up, and is signed in on <grade10 admin console url> without having proved it on this session.
* <customer account> has received no sign-in email since the case began.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding `admin`, which holds `user:create`, with a second factor set up |
| `<customer account>` | A customer account holding `user` only |
| `<customer email>` | The address of <customer account> |

**Steps:**

1. As the console, with <operator account>'s console session, ask for a sign-in link for the site to <customer email>.
2. Read the mail sent to <customer email>.

**Expected Results:**

* Step 1 is refused and asks for the second factor.
* Step 2 shows no sign-in email.

### shared-auth-sign-in-US12-TC27-1: A console session does not withhold Google's prompt on the site

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
* **Trace:** Google

**Pre-conditions:**

* Grade10 offers Google sign-in.
* <operator account> is signed in on <grade10 admin console url> only, with the second factor proved where the console asks for it, and signed out on <grade10 store url>.
* No sign-in dialog is open.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding console access, with a second factor set up |

**Steps:**

1. Navigate to <grade10 store url> in the same browser, without opening the sign-in dialog.
2. Read the page.

**Expected Results:**

* Google's own corner prompt appears offering sign-in.
* No sign-in dialog is open.

---

## Settled

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
- **Covered at domain** - the site's link sign-in, which this change leaves as it was, is walked by `shared-auth-e2e-US2-TC1-1`; the console-against-site lifecycle across session, sign-in and sessions is a draft domain case in this change's `domain-tcs.md` (`shared-auth-e2e-US8-TC1-1`)
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-auth-sign-in-US-12` has `US12-TC1-1` to `US12-TC21-1`; every scenario from `shared-auth-sign-in-SC-91` to `shared-auth-sign-in-SC-112`, and `shared-auth-sign-in-SC-114`, is reached, shared-auth-sign-in-SC-113 being retired; the `Google` group has `US12-TC14-1` and `US12-TC27-1` beside the durable `US3-TC1-1` to `US3-TC3-1`, and the `Link surface` group has `US12-TC15-1` and `US12-TC22-1` to `US12-TC26-1`; `shared-auth-sign-in-US-08` has `US8-TC11-2` beside the durable `US8-TC1-1` to `US8-TC10-1`. `shared-auth-sign-in-SC-51` is walked by `US8-TC11-2` but not joined to it through an anchor, since it serves the `Emailed link` group and the case traces the journey; the durable suite held the same gap and this change leaves it
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk; `shared-auth-sign-in-US8-TC11-2` carries the durable marker revised to `rev=2`, as `shared-auth-session-US2-TC1-2` does, and `shared-auth-sign-in-SC-50` and `shared-auth-sign-in-SC-51` carry the durable markers they already had, as the other modified scenarios do
