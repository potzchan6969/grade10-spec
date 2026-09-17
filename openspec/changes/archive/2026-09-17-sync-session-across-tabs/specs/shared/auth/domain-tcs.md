# shared/auth Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## shared-auth-e2e-US7: Collector follows a link in one tab and the tab they left carries on

**As a** collector,
**I want** the tab I asked from to sign me in and finish what it stopped me doing once I follow the link elsewhere,
**so that** one sign-in finishes the thing I was in the middle of, on every tab of the brand.

### shared-auth-e2e-US7-TC1-1: Link followed in a second tab signs the first in and completes its refused add

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08, shared-auth-session-US-04

**Pre-conditions:**

* A customer is not signed in, with tab A open on <listing> and tab C open on <grade10 store url>.
* The customer was refused the add to the cart on <listing> in tab A and asked for a sign-in link at <collector email> there.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.
3. Open tab C.

**Expected Results:**

* Tab A no longer shows the sign-in dialog and names the collector.
* <listing> is in the collector's cart, without the add being activated a second time.
* Tab C names the collector too, without being reloaded.
