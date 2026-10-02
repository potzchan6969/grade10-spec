# grade10-site/site/navigation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-site-navigation-US6: Collector follows a link to a surface that needs an account

**As a** collector without a session,
**I want** to be asked to sign in where I am standing rather than taken to the
surface first,
**so that** dismissing the ask leaves me reading what I was reading, and
signing in puts me on the surface I asked for.

### grade10-site-site-navigation-US6-TC1-2: Link to the bidding history asks in place, then lands it

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
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* customer is signed out and is on <grade10 store url>.

**Steps:**

1. Follow a link to <grade10 bidding history url>.
2. Read the address bar.
3. Complete sign-in in the dialog.

**Expected Results:**

* The sign-in dialog opens over the store, which stays rendered.
* Step 2 shows the store's address, not the bidding history's.
* The dialog closes and the bidding history renders at <grade10 bidding history url>.

---

### grade10-site-site-navigation-US6-TC2-2: Dismissing the ask leaves the collector reading the store

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
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* customer is signed out, scrolled partway down <grade10 store url>, and has
  been asked to sign in after following a link to
  <grade10 bidding history url>.

**Steps:**

1. Dismiss the sign-in dialog.
2. Read the address bar.

**Expected Results:**

* The store renders, still scrolled where it was.
* Step 2 shows the store's address.
* The bidding history does not render.

---

### grade10-site-site-navigation-US6-TC3-2: A dismissed ask leaves no entry to go back to

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
* **Trace:** grade10-site-site-navigation-US-06

**Pre-conditions:**

* customer is signed out and reached <grade10 store url> from
  <grade10 marketing url>.

**Steps:**

1. Follow a link to <grade10 bidding history url>.
2. Dismiss the sign-in dialog.
3. Press the browser's Back.

**Expected Results:**

* <grade10 marketing url> renders.
* The bidding history's address is never reached.

---

## grade10-site-site-navigation-US7: Collector opens a surface that needs an account at its own address

**As a** collector arriving from a bookmark, a mailed link or the back button,
**I want** the address I asked for to stay the address I am at while I sign in,
**so that** what I came for is what renders the moment I have a session,
without being sent anywhere else first.

### grade10-site-site-navigation-US7-TC1-2: The bidding history's own address asks there and renders there

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
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* customer is signed out.

**Steps:**

1. Navigate to <grade10 bidding history url>.
2. Read the address bar.
3. Complete sign-in in the dialog.

**Expected Results:**

* The sign-in dialog opens and the surface shows nothing of its own.
* Step 2 shows <grade10 bidding history url>, uncorrected.
* The bidding history renders at that same address, with no navigation in between.

---

### grade10-site-site-navigation-US7-TC2-2: Back onto a surface that asks is answered there

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
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* customer was signed in on <grade10 bidding history url>, then navigated to
  <grade10 store url> and signed out there.

**Steps:**

1. Press the browser's Back.
2. Read the address bar.

**Expected Results:**

* Step 2 shows <grade10 bidding history url>.
* The sign-in dialog opens over it.

---

### grade10-site-site-navigation-US7-TC3-2: Leaving the ask at the bidding history's address lands the brand home

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
* **Trace:** grade10-site-site-navigation-US-07

**Pre-conditions:**

* customer is signed out and reached <grade10 bidding history url> from
  outside the site.

**Steps:**

1. Dismiss the sign-in dialog.
2. Read the address bar.
3. Press the browser's Back.

**Expected Results:**

* <grade10 marketing url> renders.
* Step 2 shows the brand home's address, not the bidding history's.
* Step 3 leaves the site, never returning to the bidding history.

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `ROUTES.bids` and the navigation tests. It is a statement, not proof.

- **Raised** - none
- **Revised** - `grade10-site-site-navigation-US6-TC1-2`, `grade10-site-site-navigation-US6-TC2-2`, `grade10-site-site-navigation-US6-TC3-2`, `grade10-site-site-navigation-US7-TC1-2`, `grade10-site-site-navigation-US7-TC2-2`, `grade10-site-site-navigation-US7-TC3-2` ask at the bidding history in place of the vault (Q8); `<v>` moves, since the surface verified changed. Where the link to it sits is left to review
- **Contradicted** - none
- **Uncovered anchors** - none
