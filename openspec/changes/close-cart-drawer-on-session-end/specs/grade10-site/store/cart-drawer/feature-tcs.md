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

<!-- trace:case id=g10.store-cart-drawer.TC-uzt rev=1 -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-8ud rev=1 -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-xgb rev=1 -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-7jq rev=1 -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-2iv rev=1 -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-vcl rev=1 -->
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
