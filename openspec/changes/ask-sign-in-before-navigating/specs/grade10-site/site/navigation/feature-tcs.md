# grade10-site/site/navigation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3

## grade10-site-site-navigation-US6: Collector follows a link to a surface that needs an account

**As a** collector without a session,
**I want** to be asked to sign in where I am standing rather than taken to the
surface first,
**so that** dismissing the ask leaves me reading what I was reading, and
signing in puts me on the surface I asked for.

### grade10-site-site-navigation-US6-TC1-1: Link to the vault asks in place, then lands it

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

1. Click the header link to <grade10 vault url>.
2. Read the address bar.
3. Complete sign-in in the dialog.

**Expected Results:**

* The sign-in dialog opens over the store, which stays rendered.
* Step 2 shows the store's address, not the vault's.
* The dialog closes and the vault renders at <grade10 vault url>.

### grade10-site-site-navigation-US6-TC2-1: Dismissing the ask leaves the collector reading the store

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
  been asked to sign in after clicking the header link to <grade10 vault url>.

**Steps:**

1. Dismiss the sign-in dialog.
2. Read the address bar.

**Expected Results:**

* The store renders, still scrolled where it was.
* Step 2 shows the store's address.
* The vault does not render.

### grade10-site-site-navigation-US6-TC3-1: A dismissed ask leaves no entry to go back to

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

1. Click the header link to <grade10 vault url>.
2. Dismiss the sign-in dialog.
3. Press the browser's Back.

**Expected Results:**

* <grade10 marketing url> renders.
* The vault's address is never reached.

---

## grade10-site-site-navigation-US7: Collector opens a surface that needs an account at its own address

**As a** collector arriving from a bookmark, a mailed link or the back button,
**I want** the address I asked for to stay the address I am at while I sign in,
**so that** what I came for is what renders the moment I have a session,
without being sent anywhere else first.

### grade10-site-site-navigation-US7-TC1-1: The vault's own address asks there and renders there

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

1. Navigate to <grade10 vault url>.
2. Read the address bar.
3. Complete sign-in in the dialog.

**Expected Results:**

* The sign-in dialog opens and the surface shows nothing of its own.
* Step 2 shows <grade10 vault url>, uncorrected.
* The vault renders at that same address, with no navigation in between.

### grade10-site-site-navigation-US7-TC2-1: Back onto a surface that asks is answered there

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

* customer was signed in on <grade10 vault url>, then navigated to
  <grade10 store url> and signed out there.

**Steps:**

1. Press the browser's Back.
2. Read the address bar.

**Expected Results:**

* Step 2 shows <grade10 vault url>.
* The sign-in dialog opens over it.

### grade10-site-site-navigation-US7-TC3-1: Leaving the ask at the vault's address lands the brand home

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

* customer is signed out and reached <grade10 vault url> from outside the site.

**Steps:**

1. Dismiss the sign-in dialog.
2. Read the address bar.
3. Press the browser's Back.

**Expected Results:**

* <grade10 marketing url> renders.
* Step 2 shows the brand home's address, not the vault's.
* Step 3 leaves the site, never returning to the vault.

---

## grade10-site-site-navigation-US8: Collector opens a surface that asks nothing of them

**As a** collector with no session, or none yet answered,
**I want** a surface that is public, that invites me to sign in in its own
words, or that my link's own secret opens, to render as asked,
**so that** I am not stopped by a dialog in front of something I could already
read.

### grade10-site-site-navigation-US8-TC1-1: A collector's own visits opens and invites sign-in itself

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
* **Trace:** grade10-site-site-navigation-US-08

**Pre-conditions:**

* customer is signed out and is on <grade10 store url>.

**Steps:**

1. Navigate to <grade10 my visits url>.
2. Read the page.

**Expected Results:**

* That surface renders at <grade10 my visits url>.
* It invites the collector to sign in, in its own words.
* No sign-in dialog opens in front of it.

### grade10-site-site-navigation-US8-TC2-1: A booking's private link opens for someone with no account

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
* **Trace:** grade10-site-site-navigation-US-08

**Pre-conditions:**

* customer holds <a booking's private link> and has no account on the site.

**Steps:**

1. Open <a booking's private link>.

**Expected Results:**

* The surface that link names renders.
* No sign-in dialog opens before it.

### grade10-site-site-navigation-US8-TC3-1: A public surface renders before the session answers

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
* **Trace:** grade10-site-site-navigation-US-08

**Pre-conditions:**

* The session request is delayed so it has not yet answered.

**Steps:**

1. Navigate to <grade10 store url>.

**Expected Results:**

* The store renders without waiting for the session.
