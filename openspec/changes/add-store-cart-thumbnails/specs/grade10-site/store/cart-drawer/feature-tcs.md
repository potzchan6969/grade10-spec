# grade10-site/store/cart-drawer Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-13, tcs-rules r5

**Out of suite:** grade10-site-store-cart-drawer-SC-36 - reordered, removed and unconfirmed variant-ID joins and quantity guards in Grade10 Group 4.1 frontend runtime tests; grade10-site-store-cart-drawer-SC-39 - guest/member review, basket quote and checkout response compatibility with current and previous production decoders in Grade10 Groups 2.1 and 3.1 runtime tests; grade10-site-store-cart-drawer-SC-40 - malformed picture-field refusal by the current production decoder in Grade10 Group 2.1 contract tests; grade10-site-store-cart-drawer-SC-43 - unavailable-variant field omission and drawer cleanup in Grade10 Group 5.3 review/drawer runtime tests

## Background

* <grade10 store url> is the Grade10 storefront under test.

## g10.store-cart-drawer.US10: Collector recognises products in the reviewed cart

**As a** collector reviewing the current cart,
**I want** its retained lines to show their current product pictures,
**so that** I can recognise what I am buying before I continue.

<!-- trace:case id=g10.store-cart-drawer.TC-q4m rev=1 covers=g10.store-cart-drawer.SC-0d6,g10.store-cart-drawer.SC-0wy -->
### g10.store-cart-drawer.US10-TC1: Member lines show their matching current product pictures

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with 3 retained lines: 2 variants of one product and 1 variant of another.
* The current catalogue has several pictures per product. Each first picture has a distinct URL with query parameters.

**Test data:**

| First product's catalogue alt text | Expected first-line alt attribute |
| --- | --- |
| Card front | Card front |
| two spaces | two spaces |
| absent | The first line's current item name |
| null | The first line's current item name |
| empty string | The first line's current item name |

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review to finish.
3. Inspect each retained line's picture, image URL and alt attribute.
4. Inspect catalogue requests made for this review.
5. Read the line amounts and checkout control.

**Expected Results:**

* Step 3 shows each product's first current picture on its own line.
* Both variants of the same product show its first product picture.
* Each image URL retains its catalogue query parameter.
* No line shows another product's picture.
* The first line's image has **Expected first-line alt attribute**. The other product's supplied non-empty alt text is unchanged.
* Step 4 shows one existing batched live review with no separate product request per line.
* Step 5 keeps reviewed amounts and checkout readiness.

<!-- trace:case id=g10.store-cart-drawer.TC-f9s rev=1 -->
### g10.store-cart-drawer.US10-TC9: Guest lines show their matching current product pictures

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(guest) is on <grade10 store url> with 2 retained cart lines for different products.
* Each product has a distinct first current catalogue picture.

**Steps:**

1. Click Cart in the site header.
2. Wait for the guest cart review to finish.
3. Inspect both retained lines and the checkout control.

**Expected Results:**

* Step 3 shows each first current picture on its matching line.
* No line shows the other product's picture.
* Picture enrichment leaves guest checkout readiness unchanged.

<!-- trace:case id=g10.store-cart-drawer.TC-v8r rev=1 covers=g10.store-cart-drawer.SC-vq6 -->
### g10.store-cart-drawer.US10-TC2: A product without a picture keeps its cart facts

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with <cart_2>.
* The product in <cart_2> has no catalogue picture. A controlled review of the same cart without picture enrichment supplies the comparison facts.

**Test data:**

| Field | Value |
| --- | --- |
| <cart_2> | One retained, available product with a reviewed price and quantity |

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review to finish.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 shows the existing picture placeholder.
* Quantity, status, prices and subtotal match the comparison review.
* The badge count and checkout readiness also match that review.

<!-- trace:case id=g10.store-cart-drawer.TC-p6k rev=1 -->
### g10.store-cart-drawer.US10-TC3: Member legacy review remains usable without picture fields

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with one retained line.
* The member cart review returns a valid legacy response without picture fields.

**Steps:**

1. Click Cart in the site header.
2. Wait for the legacy review response.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 shows the existing picture placeholder.
* The line's price, quantity and status remain from the review.
* The cart total and checkout readiness remain from the review.

<!-- trace:case id=g10.store-cart-drawer.TC-t5x rev=1 -->
### g10.store-cart-drawer.US10-TC10: Guest legacy review remains usable without picture fields

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(guest) is on <grade10 store url> with one retained cart line.
* The guest cart review returns a valid legacy response without picture fields.

**Steps:**

1. Click Cart in the site header.
2. Wait for the legacy review response.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 shows the existing picture placeholder.
* The line's price, quantity and status remain from the review.
* The cart total and checkout readiness remain from the review.
<!-- trace:case id=g10.store-cart-drawer.TC-d9w rev=1 covers=g10.store-cart-drawer.SC-4fw -->
### g10.store-cart-drawer.US10-TC4: Restored cart reads the current picture again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with one retained product in the cart.
* A controlled catalogue returns <picture_1> on the first review and <picture_2> after reload.

**Test data:**

| Field | Value |
| --- | --- |
| <picture_1> | The product's first current picture before reload |
| <picture_2> | A different first current picture for the same product after the catalogue changes |

**Steps:**

1. Click Cart in the site header.
2. Wait for review and note the line's picture.
3. Check that the saved member cart intent contains no picture URL or alt text.
4. Reload <grade10 store url>.
5. Click Cart in the site header.
6. Wait for the fresh live review and inspect the line.

**Expected Results:**

* Step 2 shows <picture_1>.
* Step 3 finds variant and quantity intent without picture metadata.
* Step 6 shows <picture_2>, not the earlier picture.
* The retained cart line remains present after reload.

<!-- trace:case id=g10.store-cart-drawer.TC-j2f rev=1 covers=g10.store-cart-drawer.SC-8ty -->
### g10.store-cart-drawer.US10-TC5: Picture facts stay out of cart write intent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* The **Cart owner** is on <grade10 store url> with a retained cart line whose image-free intent receives a picture URL and alt text in its current review.
* The cart line's quantity can be increased.

**Test data:**

| Cart owner | Stored intent |
| --- | --- |
| customer(member) | Member cart |
| customer(guest) | Guest browser cart |

**Steps:**

1. Click Cart in the site header.
2. Wait for review and read the line's picture facts.
3. Increase the line's quantity.
4. Inspect the cart write input, persisted **Stored intent** and the reviewed display facts.
5. Review the cart again.

**Expected Results:**

* Step 2 includes optional picture facts in the reviewed line.
* Step 4 keeps variant and quantity in write input and persisted intent without picture URL or alt text; picture facts appear only in the reviewed display facts.
* Step 5 obtains picture facts from the current review, rather than stored intent.

<!-- trace:case id=g10.store-cart-drawer.TC-c7t rev=1 covers=g10.store-cart-drawer.SC-gzj -->
### g10.store-cart-drawer.US10-TC6: Sold-out line keeps its picture and status

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with a sold-out cart line.
* The product has a current catalogue picture.

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review to finish.
3. Inspect the sold-out line and cart footer.

**Expected Results:**

* Step 3 shows the product's first current picture on its matching sold-out line.
* The line keeps its existing sold-out treatment.
* Prices, quantity, status, count, totals and checkout readiness match the same review without picture enrichment; the picture does not make the line available for checkout.

<!-- trace:case id=g10.store-cart-drawer.TC-h5b rev=1 covers=g10.store-cart-drawer.SC-lbo -->
### g10.store-cart-drawer.US10-TC7: Unresolved review does not present pictures as current

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with a cart line last reviewed with a picture.
* The next cart review has the **Review outcome** in **Test data**.

**Test data:**

| Review outcome | Expected presentation |
| --- | --- |
| Pending | Existing loading presentation |
| Failed catalogue read | Existing unresolved presentation |

**Steps:**

1. Click Cart in the site header.
2. Inspect the drawer before a successful review.
3. For a failed catalogue read, inspect Retry and try Checkout.

**Expected Results:**

* Step 2 shows **Expected presentation**, not the old picture as current.
* Cart amounts and checkout readiness stay unresolved; no unavailable-product result replaces the failed review.
* For the failed catalogue-read row, Step 3 retains the existing Retry behavior and Checkout guard.

<!-- trace:case id=g10.store-cart-drawer.TC-m3n rev=1 covers=g10.store-cart-drawer.SC-h93 -->
### g10.store-cart-drawer.US10-TC8: Failed picture resource leaves accepted cart facts intact

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with one retained reviewed line.
* The line's supplied picture URL returns a failed image resource.

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review and picture request.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 keeps the reviewed line, quantity, status and amount.
* The cart total and checkout readiness remain from the accepted review; the browser image failure does not change cart review into a failure.

## Reconciliation

**Run:** 2026-10-13. QA1 drafted the ten cases from the frozen `/tmp/add-store-cart-thumbnails-qa1` anchor bundle without requirements, scenarios, technical design or archive material. QA2 compared them with this change's requirements, decisions Q1-Q8, UI design, approved thumbnail reference, technical design and tasks. The case dispositions were decided before the scenario links were added.

| Case | Disposition |
| --- | --- |
| `g10.store-cart-drawer.US10-TC1` / `TC-q4m` | Retain the blind member route. Add one batch/request check, several catalogue pictures per product and alt partitions supported by the current-product Feature set and Q2/Q7. Fully asserts SC-34 and SC-41. |
| `g10.store-cart-drawer.US10-TC9` / `TC-f9s` | Retain the blind guest route under Q5. It checks guest picture pairing and readiness, but does not claim all of SC-34's first-image, URL and batch assertions. |
| `g10.store-cart-drawer.US10-TC2` / `TC-v8r` | Retain the blind missing-picture route. Compare quantity, status, prices, subtotal, badge and readiness with the same review without enrichment. Fully asserts SC-35. |
| `g10.store-cart-drawer.US10-TC3` / `TC-p6k` | Retain the blind member legacy-response route. Its rendered fallback is narrower than SC-39's complete transport and decoder matrix, assigned to runtime tests. |
| `g10.store-cart-drawer.US10-TC10` / `TC-t5x` | Retain the blind guest legacy-response route under Q5. Its rendered fallback is narrower than SC-39's complete transport and decoder matrix, assigned to runtime tests. |
| `g10.store-cart-drawer.US10-TC4` / `TC-d9w` | Retain the blind restore route. Check image-free member intent and the second current picture after reload and fresh review. Fully asserts SC-37. |
| `g10.store-cart-drawer.US10-TC5` / `TC-j2f` | Retain the blind intent route. Group member and guest storage partitions under the same review/edit/check, then verify write inputs and persisted intent remain image-free. Fully asserts SC-44. |
| `g10.store-cart-drawer.US10-TC6` / `TC-c7t` | Retain the blind sold-out route. Check first picture, existing treatment and unchanged money, quantity, count, status, totals and readiness. Fully asserts SC-42. |
| `g10.store-cart-drawer.US10-TC7` / `TC-h5b` | Retain the blind pending/failed partition. Add failed-read Retry, Checkout and no-unavailable-result checks. The failed row fully asserts SC-38; the pending row remains an anchor check. |
| `g10.store-cart-drawer.US10-TC8` / `TC-m3n` | Retain the blind browser resource-failure route. Check that review stays accepted and cart facts and readiness do not change. Fully asserts SC-45. |

| Source in `spec.md` | Complete asserting case or verifier |
| --- | --- |
| `grade10-site-store-cart-drawer-SC-34` (`SC-0d6`) | `g10.store-cart-drawer.US10-TC1` |
| `grade10-site-store-cart-drawer-SC-35` (`SC-vq6`) | `g10.store-cart-drawer.US10-TC2` |
| `grade10-site-store-cart-drawer-SC-36` (`SC-toh`) | Grade10 Group 4.1 frontend runtime tests - variant-ID join, removed and unconfirmed lines, quantity and checkout guards |
| `grade10-site-store-cart-drawer-SC-37` (`SC-4fw`) | `g10.store-cart-drawer.US10-TC4` |
| `grade10-site-store-cart-drawer-SC-42` (`SC-gzj`) | `g10.store-cart-drawer.US10-TC6` |
| `grade10-site-store-cart-drawer-SC-43` (`SC-3lt`) | Grade10 Group 5.3 review/drawer runtime tests - picture-field omission and unavailable-line cleanup |
| `grade10-site-store-cart-drawer-SC-44` (`SC-8ty`) | `g10.store-cart-drawer.US10-TC5` |
| `grade10-site-store-cart-drawer-SC-38` (`SC-lbo`) | `g10.store-cart-drawer.US10-TC7`, failed-read row |
| `grade10-site-store-cart-drawer-SC-45` (`SC-h93`) | `g10.store-cart-drawer.US10-TC8` |
| `grade10-site-store-cart-drawer-SC-39` (`SC-ier`) | Grade10 Groups 2.1 and 3.1 production-decoder and response-path runtime tests - both schema versions and all four response paths |
| `grade10-site-store-cart-drawer-SC-40` (`SC-2yu`) | Grade10 Group 2.1 current production-decoder contract tests - null and non-string picture fields |
| `grade10-site-store-cart-drawer-SC-41` (`SC-0wy`) | `g10.store-cart-drawer.US10-TC1` |

- **Anchor coverage** - All ten cases trace the collector's current-cart journey and Product pictures Feature set. The guest cases follow the existing guest transport journey, without changing drawer access policy.
- **Out of suite runtime verification** - SC-36, SC-39, SC-40 and SC-43 are named above because their full decoder, serializer, join or cleanup assertions require runtime tests. Partial browser cases do not receive those scenario links. Groups 2.1, 3.1, 4.1 and 5.3 own the respective evidence.
- **Overclaims** - The original member and guest legacy cases establish visible fallback but not the full SC-39 compatibility matrix. The guest picture case does not assert all SC-34 terms. They remain anchor-covered without those links. The thumbnail's `aria-hidden` frame means the member alt check reads the DOM attribute, not an accessible image name.
- **Uncovered scenarios** - None after the four explicit runtime verifiers. No opposite case/scenario behavior or further product decision was found.
- **Lifecycle** - All ten cases remain draft/manual. No tests, browser walk, deployment or human QA classification occurred in this planning pass.

### Manual

| Manual | Why |
| --- | --- |
| `g10.store-cart-drawer.US10-TC1` | To be walked in Group 5.1's seeded browser regression after Groups 2-4 land; the batch and decoder assertions also need Groups 2.1 and 3.1 runtime tests. |
| `g10.store-cart-drawer.US10-TC9` | To be walked in Group 5.4's signed-out drawer check and guest transport tests. |
| `g10.store-cart-drawer.US10-TC2` | To be walked in Group 5.1's seeded browser regression with Group 3.1's unchanged-facts test. |
| `g10.store-cart-drawer.US10-TC3` | To be walked with the member legacy fixture in Group 4.1 and the production decoders in Group 2.1. |
| `g10.store-cart-drawer.US10-TC10` | To be walked with the guest legacy fixture in Group 4.1 and the production decoders in Group 2.1. |
| `g10.store-cart-drawer.US10-TC4` | To be walked in Group 5.1's restored-cart browser regression and Group 3.1's image-free intent test. |
| `g10.store-cart-drawer.US10-TC5` | To be walked in Group 3.1's member/guest intent and write-input tests. |
| `g10.store-cart-drawer.US10-TC6` | To be walked in Group 5.1's sold-out browser regression and Group 3.1's unchanged-facts test. |
| `g10.store-cart-drawer.US10-TC7` | To be walked in Group 5.1's failed-review browser regression and Group 4.1's pending/failure fixture tests. |
| `g10.store-cart-drawer.US10-TC8` | To be walked in Group 5.3's failed-image browser check after an accepted review. |
