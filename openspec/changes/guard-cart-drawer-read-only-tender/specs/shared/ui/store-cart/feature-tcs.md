# shared/ui/store-cart Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-16, tcs-rules r3.0

## shared-ui-store-cart-US9: Shopper reads tender options without applying them

**As a** shopper,
**I want** to inspect the promo and points context for my cart without applying
either tender,
**so that** I can understand my available options without encountering an action
that cannot change the cart.

### shared-ui-store-cart-US9-TC1-1: Read-only promo context has no mutation controls

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* An open cart has one applicable held promo code and one inapplicable held promo code.
* The application supplies no callback that applies a typed code or selects a held code.

**Steps:**

1. Open the cart's promo-code view.
2. Inspect the held-code details and available controls.

**Expected Results:**

* The applicable and inapplicable held codes remain visible with their supplied details.
* The typed-code input and its Apply control are absent.
* No applicable held code has an Apply control.

### shared-ui-store-cart-US9-TC2-1: Read-only points context has no entry controls

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* An open cart has supplied points balance, basket ceiling, and conversion-rate context.
* The application supplies no points-apply or Use max callback.

**Steps:**

1. Open the points disclosure.
2. Inspect the supplied points context and available controls.

**Expected Results:**

* The balance, basket ceiling, and conversion rate remain visible.
* The points amount input, Apply control, and Use max control are absent.
* No points amount is applied and the cart summary is unchanged.

### shared-ui-store-cart-US9-TC3-1: Interactive callbacks expose their matching actions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* An open cart has typed promo, applicable held-code, and points context.
* The application supplies the matching apply, selection, points, Use max, and removal callbacks.

**Steps:**

1. Open the promo-code view and the points disclosure.
2. Inspect the typed-code, held-code, points, Use max, and removal actions.
3. Activate each available action once.

**Expected Results:**

* Each matching action is present and enabled when its state allows the action.
* Each activation reaches its matching callback once with the supplied code, held-code id, or points amount.
* The drawer keeps display-only context and action availability independent; supplying one callback does not invent or suppress another action.

### shared-ui-store-cart-US9-TC4-1: Missing one callback gates only its action

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* An open cart has every tender context and callback except the callback for one selected action.

**Test data:**

| `<missing callback>` | `<action that is absent>` |
| --- | --- |
| Typed promo apply | Typed-code input and Apply |
| Held-code selection | Applicable held-code Apply |
| Points apply | Points amount input and Apply |
| Use max points | Use max |
| Applied-tender removal | Matching Remove action |

**Steps:**

1. Render the drawer once for each `<missing callback>` row.
2. Inspect the action named in `<action that is absent>` and the other supplied actions.

**Expected Results:**

* The action named in `<action that is absent>` is absent.
* The other supplied actions remain available.
* No missing callback is invoked by rendering or by activating another supplied action.

## Raised

- None — the proposal and feature set settle read-only context, absent actions,
  interactive callback behavior, and independent gating.

## Settled

- None — no earlier review decision is being carried into this change.

## Reconciliation

- **Run:** hand-assembled from the proposal, feature set, user journey, linked
  PRD section, durable capability context, and OpenSpec configuration; isolated
  input SHA-256 `dccd554eeefa6c667e46fccd1ff28c6924b921dc484e9c2e61e019fd04a2811c`.
- **Folded into spec:** `shared-ui-store-cart-SC-26` and `SC-27` cover promo
  display-only and interactive behavior; `SC-28` and `SC-29` cover points
  display-only and interactive behavior; `SC-30` covers independent callback
  gating and the remaining optional tender controls.
- **Uncovered anchors:** none — `shared-ui-store-cart-US-09` is traced by all
  four draft cases.
