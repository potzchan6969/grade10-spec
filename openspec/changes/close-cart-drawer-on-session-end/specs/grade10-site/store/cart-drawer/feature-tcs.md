# grade10-site/store/cart-drawer Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-10-16, tcs-rules r6

## Walk 1: Sign-out in another tab, then what the collector does next

**Starting state:**

- customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open.
- A second tab 2 of the same browser is open on any Store surface.

**Shared test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |
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

* customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |

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

* customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open.
* The customer's cart holds `<member_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |
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

* customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open.
* The customer's cart holds `<member_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |
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

* customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The environment can end the customer's session on the server without a sign-out press in any tab.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |

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

<!-- trace:case id=g10.store-cart-drawer.TC-g4z rev=1 -->
#### g10.store-cart-drawer.US14-TC5: A guest's open drawer stays open across session reads

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

* customer(guest) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with `<guest_line>` in this browser's cart.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |
| guest_line | An available product line in this browser's guest cart |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. Reload tab 1.
2. Click Cart in the header as soon as the page loads.
3. Wait `<settle_wait>`.
4. Switch to tab 2.
5. Switch back to tab 1.
6. Wait `<settle_wait>`.

**Expected Results:**

* Step 2 opens one drawer over `<surface_address>`.
* The drawer is still open after step 3.
* The drawer is still open after step 6, showing `<guest_line>`.
* No toast or notice appears in steps 1 to 6.

<!-- trace:case id=g10.store-cart-drawer.TC-7jq rev=1 covers=g10.store-cart-drawer.SC-fg7 -->
#### g10.store-cart-drawer.US14-TC6: A switch to another member keeps the drawer open on their cart

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

* customer A(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open on `<member_a_line>`.
* customer B(member) can sign in and holds a cart with `<member_b_line>` and no `<member_a_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |
| member_a_line | An available product line in customer A's cart only |
| member_b_line | An available product line in customer B's cart only |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. In tab 2, sign out.
2. In tab 2, sign in as customer B.
3. Switch to tab 1.
4. Wait up to `<settle_wait>` for the drawer to show `<member_b_line>`.

**Expected Results:**

* Step 4 shows the drawer still open over `<surface_address>`, with `<member_b_line>`.
* The drawer shows no `<member_a_line>`.
* No toast, notice or sign-in prompt appears in steps 3 and 4.

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

* customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The next session read of tab 1 can be held in flight and then answered with the customer's own session.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |

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

* customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open and its cart read held in flight.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |

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

<!-- trace:case id=g10.store-cart-drawer.TC-vcl rev=1 covers=g10.store-cart-drawer.SC-w1i,g10.store-cart-drawer.SC-gey -->
#### g10.store-cart-drawer.US14-TC9: Checkout meeting an expired session leaves no drawer behind the dialog

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

* customer(signed-in member) has tab 1 open at `<surface_address>` on `<grade10 store url>`, with the cart drawer open on `<member_line>`.
* The customer's session ended on the server after tab 1 last read it, so tab 1 still shows the member's drawer.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | The address of the Store surface that tab 1 shows |
| member_line | An available product line in the signed-in customer's cart |

**Steps:**

1. Click the member's checkout button in the drawer.
2. Wait for the sign-in dialog.
3. Sign in as the same customer in the dialog.
4. Wait for the dialog to close.
5. Click Cart in the header.

**Expected Results:**

* Step 2 opens the sign-in dialog, with no cart drawer open behind it.
* No cart drawer is open at step 4, and tab 1 is at `<surface_address>`.
* Step 5 opens one drawer that shows `<member_line>`.

## Settled

- **When the close shows** - the drawer is gone once the tab shows the person signed out, which is when its header shows Sign In; it is never open beside that header (Q6)
- **A sign-out and a sign-in between** - the drawer follows what the open tab reads: any reading of nobody closes it, one member read and then another with none between leaves it open, and the same member signing out and in follows the same rule; a person who switches member by signing out and in elsewhere finds the drawer closed, because the open tab keeps up promptly and reads nobody between (Q7)
- **A session read that fails** - not the end of a session; the drawer stays open (Q8)
- **A guest who becomes a member in another tab** - the guest's drawer stays open and shows the member's cart once the tab shows the member (Q9)
- **Work in flight at the close** - the drawer closes like any other close; the request already sent ends as it would, and its late answer changes nothing in a drawer opened afterwards (Q10)
- **Signing in from the guest drawer** - a sign-in started from the drawer's own Sign in link reopens the drawer; a sign-in the collector does not start from an open drawer leaves it closed (Q11)
- **Every surface** - the close holds on every surface the drawer opens over; a surface that itself needs a session makes its own sign-in ask (Q12)
- **What checkout asks next** - when a tab whose session has ended presses Proceed to Checkout, the drawer closes; whether the collector then meets a sign-in dialog or checks out as a guest is checkout's to say, not this suite's (Q14)

## Reconciliation

**Run:** QA1, 2026-10-16, as the planning run reports it. The blind pass wrote the nine cases from the Feature set, the journey, the proposal, `decisions.md` as it stood before Q6 and the Cart Drawer page; it was denied every `## Requirements` section, `tech-design.md` and `tasks.md`. It is a statement, not proof. Its seven raised questions landed as Q6 to Q12.

**Run:** QA2, 2026-10-16, in a fresh context. Read the nine cases, the delta `spec.md` (one requirement, nine scenarios), `decisions.md` through Q13, `tech-design.md`, `tasks.md`, the proposal, the journey and the Cart Drawer page. To judge the surfaces and the checkout the cases name, it also read the durable `shared/auth/session`, `grade10-site/store/cart-drawer` and `grade10-site/store/checkout` specs, the Checkout page and the in-flight `add-shopify-checkout-integration` delta. It read no application code and wrote no case and no scenario. After the two readings: the journey id moved from US11 to US14 (a substitution), Q6 to Q13 landed, `g10.store-cart-drawer.SC54` and the clause "or cannot read" were added, and `g10.store-cart-drawer.SC53` gained "has not opened the cart since". Dev saw QA1's seven raised rows through `pnpm check:manual` after it wrote its three artifacts and says it changed nothing in response. `## Walk 1` is unchanged.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `g10.store-cart-drawer.US14-TC1` | Joined: the close on a sign-out in another tab, Sign In in the header with no drawer beside it, no message | `g10.store-cart-drawer.SC46`, `g10.store-cart-drawer.SC48` |
| `g10.store-cart-drawer.US14-TC2` | Kept `draft`: real behaviour no scenario states, a drawer opened after the close is a guest's with nothing of the member's; a scenario is owed in `spec.md` | none |
| `g10.store-cart-drawer.US14-TC3` | Joined: signing in again through the header, with the cart not opened between, leaves the drawer closed; its last step is beyond the scenario | `g10.store-cart-drawer.SC53` |
| `g10.store-cart-drawer.US14-TC4` | Joined: the same close when the session expires, no message | `g10.store-cart-drawer.SC47`, `g10.store-cart-drawer.SC48` |
| `g10.store-cart-drawer.US14-TC5` | Kept `draft`: reaches the first-read state by timing only, so no link until a case holds the first read | none |
| `g10.store-cart-drawer.US14-TC6` | Joined, and contradicted on its route (see Contradicted) | `g10.store-cart-drawer.SC51` |
| `g10.store-cart-drawer.US14-TC7` | Joined: the drawer stays open while the read is held and after it answers | `g10.store-cart-drawer.SC50` |
| `g10.store-cart-drawer.US14-TC8` | Kept `draft`: real in part (Q10), with no scenario and no task | none |
| `g10.store-cart-drawer.US14-TC9` | Joined: checkout meeting an expired session shows the dialog and a closed drawer, and signing in leaves it closed | `g10.store-cart-drawer.SC52`, `g10.store-cart-drawer.SC53` |

| Scenario | Cases |
| --- | --- |
| `g10.store-cart-drawer.SC46` | `g10.store-cart-drawer.US14-TC1` |
| `g10.store-cart-drawer.SC47` | `g10.store-cart-drawer.US14-TC4` |
| `g10.store-cart-drawer.SC48` | `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` |
| `g10.store-cart-drawer.SC49` | none |
| `g10.store-cart-drawer.SC50` | `g10.store-cart-drawer.US14-TC7` |
| `g10.store-cart-drawer.SC51` | `g10.store-cart-drawer.US14-TC6` |
| `g10.store-cart-drawer.SC52` | `g10.store-cart-drawer.US14-TC9` |
| `g10.store-cart-drawer.SC53` | `g10.store-cart-drawer.US14-TC3`, `g10.store-cart-drawer.US14-TC9` |
| `g10.store-cart-drawer.SC54` | none |
| Uncovered | `g10.store-cart-drawer.SC49`, `g10.store-cart-drawer.SC54` |

- **Anchors** - the journey `g10.store-cart-drawer.US14` is traced by all nine cases. The Feature set group Session end has a case under each leaf: Member signed out by `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` and `g10.store-cart-drawer.US14-TC9`; Silent close by `g10.store-cart-drawer.US14-TC1` and `g10.store-cart-drawer.US14-TC4`; Drawer kept by `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC7`. No leaf names a session still being read or unreadable, so `g10.store-cart-drawer.SC50` and `g10.store-cart-drawer.SC54` sit under Drawer kept by reading; an anchor edit would restart both readings, so the wording is left
- **Uncovered scenarios** - `g10.store-cart-drawer.SC49`: `g10.store-cart-drawer.US14-TC5` asserts the same result, but its Step 2 (press Cart as soon as the page loads) does not hold the tab's first session read, so a pass can come from a press after the read answered, which is another state. The link waits for a case that holds the first read in flight, as `g10.store-cart-drawer.US14-TC7` holds a re-read; Q2 and Q3 give the state. `g10.store-cart-drawer.SC54`: no blind case, since the scenario came after QA1. A case written from Q8 by a fresh blind pass closes it; blocking the session request is an established setup. The other disposition is **Out of suite** naming the component test of task 2.1, which the tasks already plan; a case is preferred, since a tester can make this state
- **Over-claimed** - assertions no scenario of this change states:
  - `g10.store-cart-drawer.US14-TC2` in full: backed by the durable rule that a signed-out Cart press opens the same drawer, by `shared/auth/session` (a surface whose session ended shows nobody's things), by Q10 and by the last clause of task 2.1
  - `g10.store-cart-drawer.US14-TC8` in full: Q10 backs "closes like any other close"; that a late answer does not bring the drawer back is implied, not decided. The clause Q10 does state, a late answer reaching a drawer opened afterwards, no case walks
  - `g10.store-cart-drawer.US14-TC3` Step 6 and `g10.store-cart-drawer.US14-TC9` Step 5: Cart opening the member's cart after signing in rests on the durable cart-open rules
  - `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC8` and `g10.store-cart-drawer.US14-TC9`: "still at `<surface_address>`" rests on the durable rule that closing keeps the address
  - `g10.store-cart-drawer.US14-TC1` and `g10.store-cart-drawer.US14-TC4`: "the backdrop is gone" sharpens "the drawer closes"; no scenario or decision names the backdrop
  - `g10.store-cart-drawer.US14-TC5` Steps 4 to 6: a guest's drawer through a later return to the tab; the requirement's "no session stays open" backs it, no scenario states it
  - `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC6`, `g10.store-cart-drawer.US14-TC7` and `g10.store-cart-drawer.US14-TC8`: "no sign-in prompt" holds only on a surface that needs no session (see Contradicted)
- **Contradicted** - none is resolved by this run:
  - `g10.store-cart-drawer.US14-TC6` against Q7 and `shared/auth/session`: the case signs out and then in as customer B in tab 2 while tab 1 is out of view, and expects tab 1's drawer still open on B's cart. Q7 closes the drawer on any reading of nobody, and `shared/auth/session` has a tab of this browser keep up promptly with a session that changed in another tab, so tab 1 can read the signed-out step before B signs in; the drawer is then closed and the case fails on a conforming product. Q6 words the same timing as "when the person returns to it", under which the case passes. The material does not say which holds; asked as a raised row. The link to `g10.store-cart-drawer.SC51` stands because a pass would show the direct reading. Task 4.1's switch route is this route
  - The surfaces: `g10.store-cart-drawer.US14-TC1` and `g10.store-cart-drawer.US14-TC4` bind `<surface_address>` to "the Store surface that tab 1 shows" and tab 2 to "any Store surface", and five cases expect no sign-in prompt. Q12 has a surface that needs a session make its own sign-in ask when the session ends, so on such a surface that result fails for a reason this change does not own. `g10.store-cart-drawer.SC48` names "a surface that needs no session". No decision is open: the repair is to bind the address to such a surface, and it comes from Q12, so it belongs to a fresh blind pass and not to this one. With that binding the links to `g10.store-cart-drawer.SC48` hold as written
  - The spec against the durable checkout: `g10.store-cart-drawer.SC52` and the second paragraph of the requirement name a sign-in dialog "that `grade10-site/store/checkout` asks for". The durable checkout spec and the Checkout page have a collector with no session check out as a guest and not be asked to sign in; "asked to sign in" stands only in the older in-flight `add-shopify-checkout-integration` delta. `g10.store-cart-drawer.US14-TC9` follows the scenario and Q5. Asked as a raised row
  - No contradiction: `g10.store-cart-drawer.US14-TC3` against "has not opened the cart since". The case signs in through the header with no Cart press between, so the new clause leaves it inside the scenario. A sign-in from the drawer's own Sign in link (Q11) is walked by no case
- **Raised, escalated** - QA1's seven rows landed as Q6 to Q12. Q6 is the Sign In header clause of `g10.store-cart-drawer.SC46`. Q7 is `g10.store-cart-drawer.SC51` for the direct reading and `g10.store-cart-drawer.SC46` for a reading of nobody between, walked for the same member by `g10.store-cart-drawer.US14-TC3`. Q8 is `g10.store-cart-drawer.SC54`, added after QA1 with no case. Q9, Q10 and Q12 are decisions with no scenario. Q11 narrowed `g10.store-cart-drawer.SC53`. Q13 came from a Dev question. The answers are in `## Settled`
- **Raised by QA2** - two rows in `decisions.md` `## Raised`, landed nowhere yet: when an open tab learns of a sign-out in another tab, which decides the switch route; and where the sign-in dialog at an expired checkout is asked for
- **Decisions with no scenario** - Q9 (a guest who becomes a member in another tab), Q10 (work in flight), the reopen of Q11 (stated on the Cart Drawer page and in `add-store-guest-checkout`, in no scenario here) and Q12 (the requirement names no surface; the only scenario that does qualifies it). Q13 changes nothing, so it needs none
- **Automation only** - `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC8` and `g10.store-cart-drawer.US14-TC9` plan `automation` alone: each needs a state a person cannot make (a session ended on the server, a read held in flight, a session that ended after the tab last read it), as `tcs-conventions` asks. None is eligible for a manual run. Task 4.1's walk names routes for `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC2`, `g10.store-cart-drawer.US14-TC3`, `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC9`, and none for `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC7` or `g10.store-cart-drawer.US14-TC8`. Task 2.1's component tests cover the first-read guest and the pending read, and both cases are layer `e2e`. Nothing in the tasks decides `g10.store-cart-drawer.US14-TC8`. Task 4.2 flips only what the walk decides, so those three stay `manual` in Automation status, which is the backlog the governance names
- **Manual** - no `### Manual` table is written: no test exists to credit, and task 4.2 owes the rows after the walk
- **Domain suite** - leaves nothing to a domain case: `grade10-site/store/domain-tcs.md` traces no cart drawer journey, so no domain case walks this path
- **Out of suite** - none
- **Tasks and requirement** - every scenario is named in a task and every clause of the requirement has a scenario. Not covered: `g10.store-cart-drawer.SC54` has no case, and `g10.store-cart-drawer.SC49` has none that holds its state; Q9, Q10, Q12 and the reopen of Q11 have no scenario and no task, and only `g10.store-cart-drawer.US14-TC8` touches Q10; the last clause of task 2.1 (Cart pressed again after the close starts a fresh review on the browser's cart) has no scenario and only `g10.store-cart-drawer.US14-TC2` behind it; tasks 4.1 and 4.2 name no decider for `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC7` or `g10.store-cart-drawer.US14-TC8`; tasks 1.1 to 1.3 are documents and make no scenario pass
