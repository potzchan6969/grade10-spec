# grade10-site/store/cart-drawer Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-13, tcs-rules r5

## Walk 1: Sign-out in another tab, then what the collector does next

**Starting state:**

- customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
- A second tab 2 of the same browser is open on any Store surface.

**Shared test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |
| settle_wait | 10 seconds, longer than a routine session read |

### Route

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
   - The drawer and its backdrop are gone, no toast, notice or sign-in prompt appeared, and tab 1 is still at `<surface_address>`. `g10.store-cart-drawer.US14-TC1`
4. Take one branch from the state after step 3.
   a. Click Cart in the header, then wait `<settle_wait>`.
      - One guest drawer opens over `<surface_address>`, shows no `<member_line>`, and is still open after the wait. `g10.store-cart-drawer.US14-TC2`
   b. From the starting state, repeat steps 1 to 3, sign in as the same customer through the header's Sign In control, wait for the header to show the signed-in state, then click Cart.
      - No drawer opened while signing in, and Cart opens one drawer that shows `<member_line>`. `g10.store-cart-drawer.US14-TC3`

## g10.store-cart-drawer.US14: Collector returns to a tab whose session ended with the cart open

**As a** collector,
**I want** the cart drawer I left open to be gone when I come back to a tab whose session has ended,
**so that** I am not left looking at an empty cart beside a header that says Sign In.

<!-- trace:case id=g10.store-cart-drawer.TC-uzt rev=1 covers=g10.store-cart-drawer.SC-jq7,g10.store-cart-drawer.SC-53j -->
### g10.store-cart-drawer.US14-TC1: Drawer closes without a message after sign-out in another tab

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.

**Expected Results:**

* Step 3 shows Sign In in the header, with no cart drawer open beside it.
* The drawer's backdrop is gone from the page.
* No toast, notice or sign-in prompt appears in steps 2 and 3.
* Tab 1 is still at `<surface_address>`.

<!-- trace:case id=g10.store-cart-drawer.TC-79i rev=1 -->
### g10.store-cart-drawer.US14-TC2: Cart opens a guest drawer after the session ended elsewhere

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* The customer's cart holds `<member_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
4. Click Cart in the header.
5. Wait `<settle_wait>`.

**Expected Results:**

* Step 4 opens one drawer over `<surface_address>`, with no sign-in dialog.
* The drawer shows no `<member_line>` and offers no points.
* The drawer is still open after step 5.

<!-- trace:case id=g10.store-cart-drawer.TC-8ud rev=1 covers=g10.store-cart-drawer.SC-gey -->
### g10.store-cart-drawer.US14-TC3: Signing in again does not reopen the closed drawer

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* The customer's cart holds `<member_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
4. Sign in as the same customer through the header's Sign In control.
5. Wait for the header to show the signed-in state.
6. Click Cart in the header.

**Expected Results:**

* No cart drawer is open at any point in steps 4 and 5.
* Step 6 opens one drawer that shows `<member_line>`.

---

## Ungrouped

### g10.store-cart-drawer.US14: Collector returns to a tab whose session ended with the cart open

<!-- trace:case id=g10.store-cart-drawer.TC-xgb rev=1 covers=g10.store-cart-drawer.SC-7ep,g10.store-cart-drawer.SC-53j -->
#### g10.store-cart-drawer.US14-TC4: Drawer closes without a message when the session expires

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The environment can end the customer's session on the server without a sign-out press in any tab.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. Switch to tab 2.
2. End the customer's session by expiry.
3. Switch to tab 1.
4. Wait for the header to show Sign In.

**Expected Results:**

* Step 4 shows Sign In in the header, with no cart drawer open beside it.
* The drawer's backdrop is gone from the page.
* No toast, notice or sign-in prompt appears in steps 3 and 4.
* Tab 1 is still at `<surface_address>`.

<!-- trace:case id=g10.store-cart-drawer.TC-g4z rev=2 -->
#### g10.store-cart-drawer.US14-TC5: A guest's open drawer stays open across later session reads

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(guest) has tab 1 open at `<surface_address>`, with `<guest_line>` in this browser's cart.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| guest_line | An available product line in this browser's guest cart |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. Click Cart in the header.
2. Wait `<settle_wait>`.
3. Switch to tab 2.
4. Switch back to tab 1.
5. Wait `<settle_wait>`.

**Expected Results:**

* Step 1 opens one drawer over `<surface_address>`.
* The drawer is still open after step 2.
* The drawer is still open after step 5, showing `<guest_line>`.
* No toast or notice appears in steps 1 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-7jq rev=2 covers=g10.store-cart-drawer.SC-jq7,g10.store-cart-drawer.SC-gey -->
#### g10.store-cart-drawer.US14-TC6: Switching member closes the drawer; Cart then opens the new cart

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer A(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open on `<member_a_line>`.
* customer B(member) can sign in and holds a cart with `<member_b_line>` and no `<member_a_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_a_line | An available product line in customer A's cart only |
| member_b_line | An available product line in customer B's cart only |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1 and wait, for at most `<settle_wait>`, until its header shows Sign In.
3. In tab 2, sign in as customer B through the header's Sign In control.
4. Switch to tab 1.
5. Wait `<settle_wait>`.
6. Click Cart in the header.
7. Wait `<settle_wait>`.

**Expected Results:**

* Step 2 shows tab 1's header with Sign In and no cart drawer, before customer B signs in.
* Step 5 shows no cart drawer and no drawer backdrop, with tab 1 still at `<surface_address>`.
* No toast, notice or sign-in prompt appears in steps 2, 4 and 5.
* Step 6 opens one drawer over `<surface_address>`.
* The drawer shows no `<member_a_line>` at any point from step 6 on.
* The drawer shows `<member_b_line>` after step 7.

<!-- trace:case id=g10.store-cart-drawer.TC-2iv rev=1 covers=g10.store-cart-drawer.SC-dd4 -->
#### g10.store-cart-drawer.US14-TC7: A session read in flight leaves the drawer open

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The next session read of tab 1 can be held in flight and then answered with the customer's own session.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. Switch to tab 2.
2. Switch back to tab 1, holding the session read in flight.
3. Look at tab 1.
4. Answer the session read with the same customer's session.
5. Look at tab 1.

**Expected Results:**

* Step 3 shows the drawer still open over `<surface_address>`.
* Step 5 shows the drawer still open.
* No toast, notice or sign-in prompt appears in steps 2 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-d71 rev=1 -->
#### g10.store-cart-drawer.US14-TC8: A drawer with a read in flight still closes with the session

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open and its cart read held in flight.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
4. Answer the held cart read.
5. Look at tab 1.

**Expected Results:**

* Step 3 shows no cart drawer open, with the cart read still unanswered.
* Step 5 shows no cart drawer open and the page still at `<surface_address>`.
* No toast, notice or sign-in prompt appears in steps 2 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-vcl rev=2 covers=g10.store-cart-drawer.SC-w1i,g10.store-cart-drawer.SC-gey -->
#### g10.store-cart-drawer.US14-TC9: Checkout meeting an expired session leaves the drawer closed

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open on `<member_line>`.
* The customer's session ended on the server after tab 1 last read it, so tab 1 still shows the member's drawer.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |

**Steps:**

1. Click the member's checkout button in the drawer.
2. Close whatever checkout shows over the page, if anything.
3. Wait for the header to show Sign In.
4. Sign in as the same customer through the header's Sign In control.
5. Wait for the header to show the signed-in state.

**Expected Results:**

* Step 3 shows Sign In in the header, with no cart drawer open beside it.
* No cart drawer is open at any point in steps 4 and 5.
* What checkout asks of the collector after step 1 is checkout's to say and is not checked here.

<!-- trace:case id=g10.store-cart-drawer.TC-e57 rev=1 covers=g10.store-cart-drawer.SC-fg7 -->
#### g10.store-cart-drawer.US14-TC10: Reading a new member directly keeps the drawer open on their cart

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer A(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open on `<member_a_line>`.
* customer B(member) holds a cart with `<member_b_line>` and no `<member_a_line>`.
* A second tab 2 of the same browser is open on any Store surface.
* The next session read of tab 1 can be held in flight and then answered with customer B's session, so tab 1 reads customer A and then customer B with no reading of nobody between.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_a_line | An available product line in customer A's cart only |
| member_b_line | An available product line in customer B's cart only |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. Switch to tab 2.
2. Switch back to tab 1, holding the session read in flight.
3. Answer the session read with customer B's session.
4. Wait up to `<settle_wait>` for the drawer to show `<member_b_line>`.

**Expected Results:**

* The drawer stays open over `<surface_address>` throughout steps 2 to 4.
* Step 4 shows `<member_b_line>` in the drawer.
* The drawer shows no `<member_a_line>` at any point after step 3.
* No toast, notice or sign-in prompt appears in steps 2 to 4.

<!-- trace:case id=g10.store-cart-drawer.TC-p9t rev=1 covers=g10.store-cart-drawer.SC-l85 -->
#### g10.store-cart-drawer.US14-TC11: A guest's drawer stays open when the first session read answers nobody

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(guest) has tab 1 open at `<surface_address>`, with `<guest_line>` in this browser's cart.
* The first session read of tab 1 after a reload can be held in flight and then answered with nobody signed in.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| guest_line | An available product line in this browser's guest cart |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. Reload tab 1, holding its first session read in flight.
2. Click Cart in the header.
3. Look at tab 1.
4. Answer the held session read with nobody signed in.
5. Wait `<settle_wait>`.

**Expected Results:**

* Step 2 opens one drawer over `<surface_address>`.
* Step 3 shows the drawer still open.
* Step 5 shows the drawer still open, showing `<guest_line>`.
* No toast or notice appears in steps 1 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-38f rev=1 covers=g10.store-cart-drawer.SC-tpw -->
#### g10.store-cart-drawer.US14-TC12: A failed session read leaves a member's drawer open

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The next session request of tab 1 can be made to fail with `<session_failure>`, by blocking it or by answering it with an error.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| settle_wait | 10 seconds, longer than a routine session read |

| `<session_failure>` |
| --- |
| the service unreachable |
| a 500 error answer |

**Steps:**

1. Switch to tab 2.
2. Switch back to tab 1, making its session request fail with `<session_failure>`.
3. Wait `<settle_wait>`.

**Expected Results:**

* Step 2's session request fails with `<session_failure>`.
* Step 3 shows the drawer still open over `<surface_address>`.

## Settled

- **When the close shows** - the drawer is gone once the tab shows the person signed out, which is when its header shows Sign In. A tab keeps up promptly with a sign-out in another tab of this browser, and no later than the person's return in every other case, such as expiry; the drawer is never open beside that header (Q6)
- **A sign-out and a sign-in between** - the drawer follows what the open tab reads: any reading of nobody closes it, and one member read and then another with none between leaves it open on the new member's cart; the same member signing out and in follows the same rule. A person who switches member by signing out and in elsewhere finds the drawer closed, because the open tab keeps up promptly and reads nobody between (Q4, Q7)
- **A session read that fails** - not the end of a session; the drawer stays open (Q8)
- **A guest who becomes a member in another tab** - the guest's drawer stays open and shows the member's cart once the tab shows the member (Q9)
- **Work in flight at the close** - the drawer closes like any other close; the request already sent ends as it would, and its late answer changes nothing in a drawer opened afterwards (Q10)
- **Signing in from the guest drawer** - a sign-in started from the drawer's own Sign in link reopens the drawer; a sign-in the collector does not start from an open drawer leaves it closed (Q11)
- **Every surface** - the close holds on every surface the drawer opens over; a surface that itself needs a session makes its own sign-in ask (Q12)
- **What checkout asks next** - when a tab whose session has ended presses Proceed to Checkout, the drawer closes; whether the collector then meets a sign-in dialog or checks out as a guest is checkout's to say, not this suite's (Q14)
- **Reading the expired-checkout case** - the case reads the drawer and the header only where the tab stays on its surface; on a path that takes the tab to the hosted invoice there is no drawer to read (Q15)

## Reconciliation

**Run:** QA1, 2026-10-16, as the planning run reports it. The blind pass wrote `g10.store-cart-drawer.US14-TC1` to `g10.store-cart-drawer.US14-TC9` from the Feature set, the journey, the proposal, `decisions.md` as it stood before Q6 and the Cart Drawer page; it was denied every `## Requirements` section, `tech-design.md` and `tasks.md`. Its seven raised questions landed as Q6 to Q12. A narrow refresh followed, as the planning run reports it: it bound the shared address to a page that asks for no session, rewrote `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC9` at rev 2 and added `g10.store-cart-drawer.US14-TC10` to `g10.store-cart-drawer.US14-TC12`; its one raised row landed as Q15. Both are statements, not proof.

**Run:** QA2, 2026-10-16, first pass, in a fresh context. Read the nine cases, the delta `spec.md`, `decisions.md`, `tech-design.md`, `tasks.md`, the proposal, the journey and the Cart Drawer page, and for context the durable `shared/auth/session`, `grade10-site/store/cart-drawer` and `grade10-site/store/checkout` specs, the Checkout page and the in-flight `add-shopify-checkout-integration` delta. It read no application code and wrote no case and no scenario. Dev saw QA1's seven raised rows through `pnpm check:manual` after it wrote its three artifacts and says it changed nothing in response.

**Run:** QA2, 2026-10-16, delta pass at `28a522a99`, in a fresh context. Reconciled the diff of the change and the Checkout page since the first pass against the twelve cases, the scenarios and `decisions.md` through Q15. Moved: the requirement's second paragraph and the scenario for checkout meeting an expired session no longer name a sign-in dialog (Q14); the switch scenario's WHEN is the tab's next reading being a different member with no reading of nobody between; Q6 follows `shared/auth/session`, Q7 adds that a two-step switch is met by a closed drawer, and Q14 and Q15 landed; the cases changed as the QA1 refresh above says.

**Run:** QA2, 2026-10-16, final read at `2c054fa00` with the uncommitted edits to `spec.md`, `tasks.md` and the Cart page, in a fresh context. Re-read what the acceptance review's repairs moved against the cases and every `covers` link, and wrote no case and no scenario. Moved: the requirement says a tab reads a direct switch and keeps the drawer open, and a tab that reads nobody between two members closes it (Q4 and Q7, option A); the second paragraph gives a close for a session end precedence over the redirecting state and the failed state that restores Checkout, names no sign-in dialog, and keeps "without having opened the cart since"; the trigger is another tab of this site in this browser; the header stamp is the durable `tcs-rules r5`; `g10.store-cart-drawer.US14-TC6` waits for Sign In in tab 1 and links the sign-out and no-reopen scenarios; tasks 3.1, 3.2 and 4.1 assert no dialog. The scenarios and the Feature set are unchanged. `## Walk 1` is unchanged except that its shared address is the front door.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `g10.store-cart-drawer.US14-TC1` | Joined: the close on a sign-out in another tab, Sign In in the header with no drawer beside it, no message. The address is a page that asks for no session, so the result is read on the surface the silent-close scenario names | `g10.store-cart-drawer.SC46`, `g10.store-cart-drawer.SC48` |
| `g10.store-cart-drawer.US14-TC2` | Kept `draft`, no link: a drawer opened after the close is a guest's with nothing of the member's. That rests on the durable rule that a signed-out Cart press opens the same drawer and on `shared/auth/session`; the acceptance review rules no scenario is owed here | none |
| `g10.store-cart-drawer.US14-TC3` | Joined: signing in again through the header, with the cart not opened between, leaves the drawer closed; its last step is beyond the scenario | `g10.store-cart-drawer.SC53` |
| `g10.store-cart-drawer.US14-TC4` | Joined: the same close when the session expires, no message, on the same page | `g10.store-cart-drawer.SC47`, `g10.store-cart-drawer.SC48` |
| `g10.store-cart-drawer.US14-TC5` (rev 2) | Kept `draft`, no link: claims only a guest's drawer staying open through later reads, which the requirement's sentence on a collector with no session states; the first-read state moved to `g10.store-cart-drawer.US14-TC11`. No scenario is owed | none |
| `g10.store-cart-drawer.US14-TC6` (rev 2) | Joined, and in line with Q7 option A: the two-step switch closes the drawer. Step 2 waits until tab 1's header shows Sign In, so the sign-out scenario's close and header result are asserted before the second member signs in. Steps 3 to 5 then assert that signing in again opens no drawer; the sign-in is by a second customer in the other tab, which the no-reopen scenario does not distinguish from "the collector signs in again", and the result it states, the drawer stays closed, is the one asserted. Cart opening the new member's cart rests on `shared/auth/session` | `g10.store-cart-drawer.SC46`, `g10.store-cart-drawer.SC53` |
| `g10.store-cart-drawer.US14-TC7` | Joined: the drawer stays open while the read is held and after it answers | `g10.store-cart-drawer.SC50` |
| `g10.store-cart-drawer.US14-TC8` | Kept `draft`: real in part (Q10), with no scenario and no task | none |
| `g10.store-cart-drawer.US14-TC9` (rev 2) | Joined: checkout meeting an expired session leaves no drawer beside Sign In, and signing in through the header leaves it closed. It asserts no dialog or guest checkout, matching the reworded scenarios | `g10.store-cart-drawer.SC52`, `g10.store-cart-drawer.SC53` |
| `g10.store-cart-drawer.US14-TC10` (new) | Joined, and in line with Q7 option A: the tab reads one member and then another with no reading of nobody between, so the drawer stays open and shows only the new member's lines | `g10.store-cart-drawer.SC51` |
| `g10.store-cart-drawer.US14-TC11` (new) | Joined: Cart pressed while the first session read is held, the read answers nobody, the drawer stays open on the browser's cart | `g10.store-cart-drawer.SC49` |
| `g10.store-cart-drawer.US14-TC12` (new) | Joined, both rows: a read that fails, by an unreachable service or a 500 answer, leaves the drawer open | `g10.store-cart-drawer.SC54` |

| Scenario | Cases |
| --- | --- |
| `g10.store-cart-drawer.SC46` | `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC6` |
| `g10.store-cart-drawer.SC47` | `g10.store-cart-drawer.US14-TC4` |
| `g10.store-cart-drawer.SC48` | `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` |
| `g10.store-cart-drawer.SC49` | `g10.store-cart-drawer.US14-TC11` |
| `g10.store-cart-drawer.SC50` | `g10.store-cart-drawer.US14-TC7` |
| `g10.store-cart-drawer.SC51` | `g10.store-cart-drawer.US14-TC10` |
| `g10.store-cart-drawer.SC52` | `g10.store-cart-drawer.US14-TC9` |
| `g10.store-cart-drawer.SC53` | `g10.store-cart-drawer.US14-TC3`, `g10.store-cart-drawer.US14-TC6`, `g10.store-cart-drawer.US14-TC9` |
| `g10.store-cart-drawer.SC54` | `g10.store-cart-drawer.US14-TC12` |
| Uncovered | none |

- **Anchors** - the journey `g10.store-cart-drawer.US14` is traced by all twelve cases. The Feature set group Session end has a case under each leaf: Member signed out by `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC9`; Silent close by `g10.store-cart-drawer.US14-TC1` and `g10.store-cart-drawer.US14-TC4`; Drawer kept by `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` and `g10.store-cart-drawer.US14-TC12`. No leaf names a session still being read or unreadable, so `g10.store-cart-drawer.SC50` and `g10.store-cart-drawer.SC54` sit under Drawer kept by reading. The leaf also reads "a drawer open across a switch from one member to another, stay open" without the requirement's qualifier: it is true of the direct reading `g10.store-cart-drawer.US14-TC10` walks, and `g10.store-cart-drawer.US14-TC6` walks the two-step switch the requirement closes. An anchor edit would restart both readings, so the wording is left alone
- **Uncovered scenarios** - none. Each link holds because the case reaches the state the scenario names: `g10.store-cart-drawer.US14-TC10` and `g10.store-cart-drawer.US14-TC11` hold the read in flight, `g10.store-cart-drawer.US14-TC12` makes the request fail, `g10.store-cart-drawer.US14-TC6` waits for Sign In before the second member signs in, and `g10.store-cart-drawer.US14-TC1` and `g10.store-cart-drawer.US14-TC4` sit on a page that asks for no session
- **Beyond the scenarios** - assertions no scenario of this change states:
  - `g10.store-cart-drawer.US14-TC2` in full: backed by the durable rule that a signed-out Cart press opens the same drawer, by `shared/auth/session` (a surface whose session ended shows nobody's things), by Q10 and by the last clause of task 2.1
  - `g10.store-cart-drawer.US14-TC5` in full: backed by the requirement's "no session stays open"; no scenario walks a later read
  - `g10.store-cart-drawer.US14-TC6` in part: Cart opening the new member's cart after signing in rests on `shared/auth/session` (a surface keeps none of the earlier person's things); the closed drawer is stated by the requirement's clause that a tab reading nobody between two members closes it, carried through the sign-out and no-reopen scenarios
  - `g10.store-cart-drawer.US14-TC8` in full: Q10 backs "closes like any other close"; that a late answer does not bring the drawer back is implied, not decided, and the clause Q10 does state, a late answer reaching a drawer opened afterwards, no case walks
  - `g10.store-cart-drawer.US14-TC3` Step 6: Cart opening the member's cart after signing in rests on the durable cart-open rules
  - `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` and `g10.store-cart-drawer.US14-TC8`: "still at `<surface_address>`" rests on the durable rule that closing keeps the address; "the backdrop is gone" in `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` and `g10.store-cart-drawer.US14-TC6` sharpens "the drawer closes"
- **Contradicted** - none remains. Resolved since the first pass:
  - the unpinned surface against Q12: the address is a page that asks for no session
  - the switch case against Q6, Q7 and `shared/auth/session`: `g10.store-cart-drawer.US14-TC6` waits for Sign In in tab 1 before the second member signs in, so it expects the closed drawer Q7 option A states, and `g10.store-cart-drawer.US14-TC10` expects the open drawer only for the direct reading
  - the expired-checkout dialog against the durable checkout: the requirement and the scenario name no dialog, and tasks 3.1, 3.2 and 4.1 assert none
  - task 4.1 citing the direct-switch scenario for the two-step route: it cites it no longer
  - the two-step switch stated by no scenario: the requirement's first paragraph now states it, and `g10.store-cart-drawer.US14-TC6` carries it through the sign-out and no-reopen scenarios
  - the durable "remain open until the hosted invoice" against the close at checkout: the requirement's second paragraph now gives a close for a session end precedence over it and over the failed state
  - no contradiction: `g10.store-cart-drawer.US14-TC3` against "has not opened the cart since", and `g10.store-cart-drawer.US14-TC9` against the reworded scenarios. A sign-in from the drawer's own Sign in link (Q11) is walked by no case
- **Weak points** - `g10.store-cart-drawer.US14-TC9` Step 2 says to close "whatever checkout shows over the page, if anything" and does not exclude the drawer, so a tester who finds the drawer still open could close it there and Step 3 would pass wrongly. Q15 limits the case to a path where the tab stays on its surface, and nothing in its steps says what to do on a path that leaves it. Task 4.1's two-step route does not say to wait for Sign In in tab 1 before the second member signs in, as `g10.store-cart-drawer.US14-TC6` does, so a quick walk can meet the direct reading, which keeps the drawer open and conforms to Q7. Both are wording for the next pass
- **Raised, escalated** - QA1's seven rows landed as Q6 to Q12; the refresh's row landed as Q15; the two rows QA2 raised in the first pass landed as Q6, which now follows `shared/auth/session`, and Q14, which is an open row in the Checkout page's decisions block for its owner. Q13 came from a Dev question. The answers are in `## Settled`
- **Raised by this pass** - none
- **Decisions with no scenario** - Q9 (a guest who becomes a member in another tab), Q10 (work in flight), the reopen of Q11 (stated on the Cart Drawer page and in `add-store-guest-checkout`, in no scenario here), Q12 (the requirement names no surface; the only scenario that does qualifies it, so no case closes a drawer on a surface that needs a session or on Auction). Q13 changes nothing, and Q14 and Q15 limit what the suite reads
- **Automation only** - `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC8`, `g10.store-cart-drawer.US14-TC9`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` and `g10.store-cart-drawer.US14-TC12` plan `automation` alone: each needs a state a person cannot make (a session ended on the server, a read held in flight or made to fail, a session that ended after the tab last read it), as `tcs-conventions` asks. None is eligible for a manual run. Task 4.1's walk names routes for `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC2`, `g10.store-cart-drawer.US14-TC3`, `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC9`, and none for `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC8`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` or `g10.store-cart-drawer.US14-TC12`. Task 2.1's component tests cover the scenarios behind `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` and `g10.store-cart-drawer.US14-TC12`, and those cases are layer `e2e`. Nothing in the tasks decides `g10.store-cart-drawer.US14-TC5` or `g10.store-cart-drawer.US14-TC8`. Task 4.2 flips only what the walk decides, so the rest stay `manual` in Automation status, which is the backlog the governance names
- **Manual** - no `### Manual` table is written: no test exists to credit, and task 4.2 owes the rows after the walk
- **Domain suite** - leaves nothing to a domain case: `grade10-site/store/domain-tcs.md` traces no cart drawer journey, so no domain case walks this path
- **Out of suite** - none
- **Tasks and requirement** - every scenario is named in a task, and every clause of the requirement has a scenario except one. Not covered: the second paragraph's precedence of a session-end close over the redirecting state and the failed state is walked only on the path where checkout answers nobody, by `g10.store-cart-drawer.SC52` and `g10.store-cart-drawer.US14-TC9`; a session that ends in another tab while checkout creation is in flight, or after a refusal restored Checkout, has no scenario, case or task; Q9, Q10, Q12 and the reopen of Q11 have no scenario and no task of their own, and only `g10.store-cart-drawer.US14-TC8` touches Q10; the last clause of task 2.1 (Cart pressed again after the close starts a fresh review on the browser's cart) has no scenario and only `g10.store-cart-drawer.US14-TC2` behind it; tasks 4.1 and 4.2 name no decider for `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC8`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` or `g10.store-cart-drawer.US14-TC12` beyond the component tests; tasks 1.1 to 1.3 are documents and make no scenario pass
