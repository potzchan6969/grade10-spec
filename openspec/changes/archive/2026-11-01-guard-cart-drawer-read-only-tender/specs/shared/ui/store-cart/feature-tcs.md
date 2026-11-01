# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-30, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (non-GUI):** shared-ui-store-cart-SC-01, shared-ui-store-cart-SC-22, shared-ui-store-cart-SC-43 - the export set, its types and the retired slot exports, held by `packages/ui/src/index.test.ts` and `pnpm run typecheck`

## Background

* Every outcome a store page shows is walked in the store's cart suite; these cases hold the variants no application renders, walked in the shared UI Storybook.
* `<storybook>` is the shared UI Storybook, served by `pnpm storybook:ui`; the drawer's stories sit under Store/Cart. A story's Controls panel changes the props it passes to the drawer; its Actions panel records each callback the drawer calls.
* A story named in a case opens the drawer on the lines the case's pre-conditions describe.

* `<storybook>` is the shared UI Storybook's Store Cart area. The
  `Store/Cart/Blocks/PromoTicket` stories accept the supplied title, detail,
  code, applicability, detail emphasis and action props.

## shared.ui-store-cart.US9: Shopper reads tender options without applying them

**As a** shopper,
**I want** to inspect the promo and points context for my cart without applying
either tender,
**so that** I can understand my available options without encountering an action
that cannot change the cart.

<!-- trace:case id=g10.shared-store-cart.TC-p7m rev=1 covers=g10.shared-store-cart.SC-ka5 -->
### shared.ui-store-cart.US9-TC1: Read-only promo context stays visible without actions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* The CartDrawer ReadOnlyTenderContext story in `<storybook>` supplies applicable and inapplicable held codes with their labels, details and refusal reasons; promo-state change is supplied to open the view, while typed promo-apply and held-code-selection callbacks are omitted.

**Steps:**

1. Open the CartDrawer ReadOnlyTenderContext story on `<storybook>`.
2. Open the promo-code view; read an applicable code, an inapplicable code, their supplied details and the inapplicable reason.

**Expected Results:**

* The applicable and inapplicable held-code labels and details remain visible, including the inapplicable code's refusal reason.
* Typed promo entry and typed-code Apply are absent, and the applicable held code has no Apply control.

<!-- trace:case id=g10.shared-store-cart.TC-t8c rev=1 covers=g10.shared-store-cart.SC-rxp -->
### shared.ui-store-cart.US9-TC2: Supplied promo callbacks expose and record actions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* The CartDrawerFooter interactive promo story in `<storybook>` supplies an applicable held code and both promo callbacks.

**Test data:**

| Field | Value |
| --- | --- |
| `<typed code>` | SAVE-472 (test input) |

**Steps:**

1. Open the interactive promo story on `<storybook>`.
2. Read the typed promo controls, held-code ticket and Actions panel.
3. Enter `<typed code>` in the typed promo entry.
4. Select the typed promo Apply control.
5. Select the held-code Apply control.

**Expected Results:**

* The typed promo entry and held-code Apply control are available.
* Applying the typed code records only the typed promo callback with `<typed code>`.
* Applying the held code records only held-code selection for the supplied code.

<!-- trace:case id=g10.shared-store-cart.TC-x4j rev=2 covers=g10.shared-store-cart.SC-x7g -->
### shared.ui-store-cart.US9-TC3: Read-only points context stays visible without actions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* The CartDrawer ReadOnlyTenderContext story in `<storybook>` supplies points balance, a distinct basket ceiling and conversion-rate context; points-state change is supplied to open the disclosure, while points-apply and Use max callbacks are omitted.

**Steps:**

1. Open the CartDrawer ReadOnlyTenderContext story on `<storybook>` and record the displayed cart summary.
2. Open the points disclosure; read the supplied points context and available controls.

**Expected Results:**

* The points entry, its Apply control and Use max are absent; no points amount is applied.
* The supplied balance, distinct basket ceiling and conversion rate remain visible, and the cart summary is unchanged.

<!-- trace:case id=g10.shared-store-cart.TC-v2n rev=1 covers=g10.shared-store-cart.SC-q34 -->
### shared.ui-store-cart.US9-TC4: Supplied points callbacks expose and record actions

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* The CartDrawerFooter interactive points story in `<storybook>` supplies a balance and ceiling above `<points amount>`, a rate, and points-apply and Use max callbacks.

**Test data:**

| Field | Value |
| --- | --- |
| `<points amount>` | 30 points (fixed test input; balance and ceiling exceed it) |

**Steps:**

1. Open the interactive points story on `<storybook>`.
2. Read the points controls and Actions panel.
3. Enter `<points amount>` in the points entry.
4. Select the points Apply control.
5. Select Use max.

**Expected Results:**

* The points entry, its Apply control and Use max are available.
* The Actions panel records only points-apply with `<points amount>` after Apply.
* The Actions panel records only the Use max callback after Use max.
* The supplied points balance and conversion-rate context remain visible after both actions.

<!-- trace:case id=g10.shared-store-cart.TC-h5q rev=1 covers=g10.shared-store-cart.SC-ufi -->
### shared.ui-store-cart.US9-TC5: A missing callback hides only its owned action

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
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* The CartDrawer callback-matrix story in `<storybook>` supplies an applicable held code with eligibility details, refusal information, points balance, ceiling and rate, and an applied tender.
* For each run, only `<missing callback>` is omitted; all other tender callbacks are supplied.

**Test data:**

| `<missing callback>` | `<owned action>` |
| --- | --- |
| typed promo-apply callback | typed promo entry and its Apply |
| held-code selection callback | held-code Apply |
| points-apply callback | points entry and Apply |
| Use max callback | Use max |
| promo-removal callback | applied promo Remove |
| points-removal callback | applied points Remove |
| promo-state-change callback | promo disclosure trigger |
| points-state-change callback | points disclosure trigger |

**Steps:**

1. Open the callback-matrix story on `<storybook>` with `<missing callback>` omitted.
2. Read the tender controls and supplied promo and points context.
3. Activate one unrelated action whose callback is supplied in that row, where the story provides one, and inspect the Actions panel.

**Expected Results:**

* Only `<owned action>` is absent; actions whose callbacks are supplied remain available.
* The supplied promo and points context remains visible.
* Where an unrelated action is activated, only its matching callback is recorded; the omitted callback has no invocation.

<!-- trace:case id=g10.shared-store-cart.TC-d9b rev=1 -->
### shared.ui-store-cart.US9-TC6: Tender removal records its supplied callback

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-ui-store-cart-US-09

**Pre-conditions:**

* The CartDrawer story in `<storybook>` has an applied tender and supplies the tender-removal callback.

**Steps:**

1. Open the CartDrawer story on `<storybook>`.
2. Read the applied tender and its available controls.
3. Select the tender-removal control.

**Expected Results:**

* The tender-removal control is available.
* The Actions panel records the tender-removal callback.

---

## Settled

- A cart of only sold-out lines is not empty: it lists them with the footer and no count beside the drawer title.
- A cart nobody has read stays loading, never the empty state.
- A cart read empty shows the empty state, even when its price check fails.
- The count beside the drawer title is one per line, whatever its quantity.
- **A code replacing the sale on some lines** - line by line, as the quote supplies each line
- **Sold-out and unavailable lines in the Subtotal** - left out, as the drawer title's count leaves them out
- **A line holding more than one** - the Subtotal counts its price times its quantity; the line shows the price of one
- **A list price equal to the price** - the drawer strikes any list price it is given and compares no amounts
- **A held code picked and then refused** - the lines and the totals stay on the sale and the sheet says why, as for a typed code; its ticket moves apart, muted, with the refusal as its reason and no Apply
- **Removing a replacing code after the sale ended** - the drawer renders the lines it is given; whether the sale still runs is the quote's
- **A line both repriced and on sale** - not the drawer's: it strikes the list price it is given; which price Grade10 supplies is open on the Grade10 Cart Drawer page
- **Whitespace-only alt text** - Q7 retains the supplied non-empty string; only absent or empty alt text uses the item name.
- **Empty picture source** - Q8 uses the existing placeholder.

## Reconciliation

**Run:** 2026-10-30. QA1 drafted six US-09 cases from the isolated input bundle
`/tmp/guard-cart-drawer-read-only-tender-qa1.md` (SHA-256
`6d1231b775b0a1e3fb4db3536dec205659f710b30c2b4636371e23f37835b554`) without
the requirements or Dev findings. QA2 compared those cases with the full
change scenarios, the proposal, the current Cart Drawer PRD and durable spec,
and the relayed read-only Dev findings. Tasks 1.1–2.2 are checked; the shared
code gates typed promo, held Apply, points entry, Use max, tender removal and
disclosures; Storybook read-only and partial-callback states exercise the
corresponding paths, including points disclosure. No tests were run in QA2.

| Case | Disposition |
| --- | --- |
| `shared.ui-store-cart.US9-TC1` | Retain as draft/manual. Use the composed read-only drawer route; it supplies a disclosure-state callback to open the promo view while withholding tender-mutation callbacks. The case now explicitly checks an applicable and an inapplicable code, their details and refusal, and the absent typed and held-code actions. It fully asserts `g10.shared-store-cart.SC-ka5`. |
| `shared.ui-store-cart.US9-TC2` | Retain as draft/manual. The interactive promo walk exposes both controls and checks that each action records only its matching callback. It fully asserts `g10.shared-store-cart.SC-rxp`. |
| `shared.ui-store-cart.US9-TC3` | Retain as draft/manual. The composed read-only drawer walk checks points disclosure, absent entry/Apply/Use max, visible balance, a distinct basket ceiling and rate, no applied amount, and an unchanged summary. Its Storybook play assertion verifies the separate ceiling value, so it fully asserts `g10.shared-store-cart.SC-x7g`. |
| `shared.ui-store-cart.US9-TC4` | Retain as draft/manual. The interactive points walk records the points-apply and Use max callbacks independently and checks that the supplied balance and rate remain visible. It fully asserts `g10.shared-store-cart.SC-q34`. |
| `shared.ui-store-cart.US9-TC5` | Retain as draft/manual. The parameterized partial-callback walk now includes separate promo/points removal and disclosure callbacks, as well as typed promo, held selection, points Apply and Use max; it checks the owned action is absent and any unrelated action used records only its callback. It fully asserts `g10.shared-store-cart.SC-ufi`. |
| `shared.ui-store-cart.US9-TC6` | Retain as draft/manual as the distinct full-drawer walk for invoking a supplied tender-removal callback. It does not link to a scenario because no added scenario asserts the positive removal path by itself; it complements the missing-callback rows in TC5. |

| Scenario | Complete asserting case |
| --- | --- |
| `g10.shared-store-cart.SC-ka5` | `shared.ui-store-cart.US9-TC1` |
| `g10.shared-store-cart.SC-rxp` | `shared.ui-store-cart.US9-TC2` |
| `g10.shared-store-cart.SC-x7g` | `shared.ui-store-cart.US9-TC3` |
| `g10.shared-store-cart.SC-q34` | `shared.ui-store-cart.US9-TC4` |
| `g10.shared-store-cart.SC-ufi` | `shared.ui-store-cart.US9-TC5` |

- **Anchor coverage** - TC1–TC6 remain grouped under the new `US-09` journey. No live US-09 case existed to extend; the read-only and interactive promo/points paths, callback matrix and full-drawer removal route have distinct outcomes or routes.
- **Follow-up evidence** - The read-only Storybook fixture supplies the distinct label `Up to 600 pts. can be used for this basket.` alongside the 1,200-point balance and conversion rate. Its play asserts all three values. The focused Storybook Vitest file passed 17/17 tests after this update; before the fixture change, the new ceiling assertion failed as expected.
- **Over-claimed cases** - TC6 proves the supplied removal callback path but does not claim coverage of a missing-callback scenario.
- **Contradictions** - None found between QA1, the change scenarios, the PRD/durable contract and the Dev findings.
- **Decisions** - QA1 raised no product question. The PRD's Tender Actions rule already settles callback-gated actions and retained display context, so `decisions.md` has no source-backed non-held row to close.
- **Lifecycle** - Existing case IDs, revisions, draft status and manual automation status are preserved. No execution or human review credit is claimed.

### Manual

| Manual | Why |
| --- | --- |
| `shared.ui-store-cart.US9-TC1` | A person checks the supplied held-code labels, details and refusal in the shared UI Storybook. |
| `shared.ui-store-cart.US9-TC2` | A person enters a typed promo and applies a held code while checking the corresponding callback records. |
| `shared.ui-store-cart.US9-TC3` | A person opens the read-only points disclosure and checks its display context and unchanged summary. |
| `shared.ui-store-cart.US9-TC4` | A person applies points and uses the maximum while checking the corresponding callback records. |
| `shared.ui-store-cart.US9-TC5` | A person walks each missing-callback row and checks action availability and callback isolation. |
| `shared.ui-store-cart.US9-TC6` | A person removes a supplied applied tender in the full drawer and checks its callback record. |

