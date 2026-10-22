# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-13, tcs-rules r5

## grade10-site-store-e2e-US1: Collector enters a collection and opens a product

**As a** collector,
**I want** to move from a collection on the Store front door to a product's
own page,
**so that** I can inspect the card I chose in the catalogue.

<!-- trace:case id=g10.store-domain.TC-k4u rev=2 covers=g10.store-home.SC-z40,g10.store-home.SC-uh3,g10.store-home.SC-wdv,g10.store-home.SC-j65,g10.store-home.SC-lc4,g10.store-product-listing.SC-aty,g10.store-product-listing.SC-ksc,g10.store-product-listing.SC-o37,g10.store-product-page.SC-wo0,g10.store-product-page.SC-21y -->
### grade10-site-store-e2e-US1-TC1-2: Collection tile leads to its product page

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
* **Trace:** grade10-site-store-home-US-02, grade10-site-store-product-listing-US-02, grade10-site-store-product-page-US-02

**Pre-conditions:**

* `<collection>` is listed on the Store front door and holds `<product>`.
* `<product>` is listed in `<collection>` and is for sale.

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Open the tile for `<collection>`.
3. Check the collection shown as the listing narrowing.
4. Open the card for `<product>`.

**Expected Results:**

* The Store front door renders with `<collection>` as a collection tile.
* The browse listing shows `<collection>` as the narrowing in force.
* Step 4 opens `<product>`'s own product page.

---

## grade10-site-store-e2e-US2: Collector buys a merchandised product from its page

**As a** collector,
**I want** to open a card from the Store front door and add my chosen variant,
**so that** I can buy without returning to the listing.

<!-- trace:case id=g10.store-domain.TC-n5e rev=1 covers=g10.store-home.SC-vsc,g10.store-home.SC-mzp,g10.store-home.SC-o29,g10.store-home.SC-4sf,g10.store-home.SC-u8x,g10.store-home.SC-2ex,g10.store-product-page.SC-jt1,g10.store-product-page.SC-b7g,g10.store-product-page.SC-qmb,g10.store-product-page.SC-tl5 -->
### grade10-site-store-e2e-US2-TC1-1: Merchandised card adds the chosen variant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-product-page-US-03

**Pre-conditions:**

* <product> is in the merchandised row for the first collection the catalogue lists.
* <product> has more than one variant for sale, including <variant>.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A product in the merchandised row with more than one variant for sale |
| <variant> | An available variant different from the variant selected on opening |

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the card for <product> in the merchandised row.
3. Choose <variant> on the product page.
4. Add the chosen variant to the cart.

**Expected Results:**

* The merchandised row offers no way into the cart.
* Step 2 opens <product>'s own product page.
* The cart holds <variant>, not the variant selected on opening, and the page remains at <product>'s address.

---

## grade10-site-store-e2e-US3: Collector checks a sold-out product from the front door

**As a** collector,
**I want** a sold-out card in the merchandised row to remain marked sold out
when I open it,
**so that** I can tell an unavailable card from a broken purchase page.

<!-- trace:case id=g10.store-domain.TC-g62 rev=1 covers=g10.store-home.SC-vsc,g10.store-home.SC-mzp,g10.store-home.SC-o29,g10.store-home.SC-4sf,g10.store-home.SC-u8x,g10.store-home.SC-2ex,g10.store-home.SC-00a,g10.store-home.SC-q66,g10.store-product-page.SC-prx,g10.store-product-page.SC-1p0 -->
### grade10-site-store-e2e-US3-TC1-1: Sold-out card keeps its status on the product page

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-home-US-06, grade10-site-store-product-page-US-04

**Pre-conditions:**

* <product> is in the merchandised row and all its variants are unavailable for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A merchandised product with every variant unavailable for sale |

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the status shown for <product> in the merchandised row.
3. Open the card for <product>.
4. Check the purchase area on the product page.

**Expected Results:**

* The merchandised row marks <product> as sold out and offers no way into the cart.
* Step 3 opens <product>'s own product page.
* The product page keeps every variant priced, labels the purchase action sold out, and offers no control that adds the product.

---

## grade10-site-store-e2e-US4: Member pays at the till with points and a coupon together

**As a** member,
**I want** staff to take my points and my product coupon off one sale,
**so that** both settle once, when I pay.

<!-- trace:case id=g10.store-domain.TC-gdu rev=2 covers=g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc,g10.store-membership.SC-uae,g10.store-membership.SC-a70,g10.store-membership.SC-gga,g10.store-membership.SC-ke5,g10.store-membership.SC-xhs,g10.store-membership.SC-if2,g10.store-membership.SC-8a9,g10.store-membership.SC-vo6,g10.store-discounts.SC-evl,g10.store-discounts.SC-it9,g10.store-discounts.SC-l2h,g10.store-discounts.SC-fc9,g10.store-discounts.SC-q23,g10.store-discounts.SC-3cr,g10.store-discounts.SC-elk,g10.store-discounts.SC-99a,g10.store-discounts.SC-0lx,g10.store-discounts.SC-9j2,g10.store-discounts.SC-8ib,g10.store-discounts.SC-6co,g10.store-discounts.SC-ou8 -->
### grade10-site-store-e2e-US4-TC1-2: Points and a product coupon settle together on one till sale

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-membership-US-02, grade10-site-store-discounts-US-04

**Pre-conditions:**

* No automatic discount is active at the shop.
* admin(shop staff) has a till session open for customer(member holding <product coupon_1> and at least <points> points), on a sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <product coupon_1> | A live product coupon that takes HK$50.00 off <line_1> |
| <points> | 100, worth HK$100.00 |
| <points title> | Deduction from Points, the title the points discount is written under |

**Steps:**

1. Choose <points> points and <product coupon_1> in the member's panel.
2. Tap Apply.
3. Tender the sale.
4. Open the paid order in the staging shop's admin.

**Expected Results:**

* Step 2 puts both on the sale, neither refused for the other.
* The paid order shows a discount titled <points title> taking HK$100.00.
* The paid order shows <product coupon_1>'s code taking HK$50.00.
* The balance drops by exactly <points>, and <product coupon_1> reads spent.

---

## grade10-site-store-e2e-US5: Member identified from a wallet pass spends at the till

**As a** member,
**I want** staff to scan the pass in my phone wallet and take my spend from the right place,
**so that** I am served from my lock screen and a code anybody could photograph never moves my points.

<!-- trace:case id=g10.store-domain.TC-u39 rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv,g10.store-wallet-member-card.SC-nmv,g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc,g10.store-membership.SC-uae,g10.store-membership.SC-a70,g10.store-membership.SC-gga,g10.store-membership.SC-ke5 -->
### grade10-site-store-e2e-US5-TC1-1: Google Wallet pass opens a session that spends points

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-06, grade10-site-store-membership-US-02

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member with a live Google Wallet pass and at least <points> points) is at the counter.
* admin(shop staff) has a sale holding <line_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Scan the member's Google Wallet pass.
2. Apply <points> points from the member's panel.
3. Tender the sale.

**Expected Results:**

* Step 1 opens a session for the member, as a scanned member card does.
* Step 2 applies the points.
* The member's balance drops once, by <points>, when the sale is paid.

<!-- trace:case id=g10.store-domain.TC-n78 rev=1 covers=g10.store-wallet-member-card.SC-g3f,g10.store-membership.SC-a6l,g10.store-membership.SC-6kj,g10.store-membership.SC-wv5,g10.store-membership.SC-jnm,g10.store-membership.SC-7hw,g10.store-membership.SC-qr3,g10.store-membership.SC-r53,g10.store-membership.SC-stn,g10.store-membership.SC-u06,g10.store-membership.SC-wrc,g10.store-membership.SC-uae,g10.store-membership.SC-a70,g10.store-membership.SC-gga,g10.store-membership.SC-ke5 -->
### grade10-site-store-e2e-US5-TC2-1: Apple Wallet pass refuses the spend and the card pays it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-08, grade10-site-store-membership-US-02

**Pre-conditions:**

* No automatic discount is active at the shop.
* customer(member with a live Apple Wallet pass and at least <points> points) is at the counter, member card open on the site.
* admin(shop staff) has a sale holding <line_1> and a session opened from the member's Apple Wallet pass.

**Test data:**

| Field | Value |
| --- | --- |
| <line_1> | One HK$780.00 product |
| <points> | 100, worth HK$100.00 |

**Steps:**

1. Apply <points> points from the member's panel.
2. Scan the member card on the member's phone.
3. Apply <points> points from the member's panel.
4. Tender the sale.

**Expected Results:**

* Step 1 is refused, not hidden.
* Step 3 applies the points.
* The member's balance drops once, by <points>, when the sale is paid.

---

## grade10-site-store-e2e-US6: Collector opens an owned order from Your Orders

**As a** signed-in collector,
**I want** to choose one of my Store orders and inspect its detail,
**so that** the order list and detail page preserve the same order and owner scope.

<!-- trace:case id=g10.store-domain.TC-3id rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j,g10.store-order-detail.SC-d26,g10.store-order-detail.SC-a2p,g10.store-order-detail.SC-bjc,g10.store-order-detail.SC-0uc,g10.store-order-detail.SC-3mi,g10.store-order-detail.SC-6xb,g10.store-order-detail.SC-ik3,g10.store-order-detail.SC-7ci,g10.store-order-detail.SC-gbw,g10.store-order-detail.SC-cew,g10.store-order-detail.SC-ik7,g10.store-order-detail.SC-4bj,g10.store-order-detail.SC-xz6,g10.store-order-detail.SC-2ah,g10.store-order-detail.SC-4lu,g10.store-order-detail.SC-gzr -->
### grade10-site-store-e2e-US6-TC1-1: View Details preserves the selected order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01, grade10-site-store-order-detail-US-01

**Pre-conditions:**

* customer owns <order> and is signed in.
* <order> appears in the Active or Past group on Your Orders with its Store order id and customer-facing label.

**Test data:**

| Field | Value |
| --- | --- |
| <order> | An owned Store order with a stable Store id and supplied order facts |

**Steps:**

1. Navigate to `/profile/orders`.
2. Check <order>'s summary and customer-facing label.
3. Click View Details for <order>.
4. Check the order detail header and browser address.

**Expected Results:**

* Only <order> appears for the signed-in collector's selected row.
* The summary uses the supplied customer-facing label without replacing the Store id used by the action.
* Step 3 opens `/profile/orders/<order id>`.
* Step 4 shows the same order and does not disclose another order's facts.

---

## grade10-site-store-e2e-US9: Member's saved name reaches the till and the pass

**As a** member,
**I want** the name I save on my profile to be the one staff see at the till and the one my wallet pass shows,
**so that** the site, the counter and my phone name me the same way.

<!-- trace:case id=g10.store-domain.TC-82a rev=1 covers=g10.store-account-profile.SC-zu6,g10.store-membership.SC-e9k,g10.store-wallet-member-card.SC-gvk -->
### grade10-site-store-e2e-US9-TC1-1: A name saved on the profile shows at the till and on the pass

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-account-profile-US-02, grade10-site-store-membership-US-02, grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with a live Google Wallet pass, account named <account name>) is signed in as <signed-in address>, and the pass shows <account name>.
* admin(shop staff) is on <shop_1>'s till.

**Test data:**

| Field | Value |
| --- | --- |
| <account name> | `Kit Lam` |
| <grade10 profile url> | `https://grade10-stg.com/profile` |
| <signed-in address> | `kit.lam@example.com` |
| <new name> | `Kit Collector` |
| <shop_1> | A physical store running the Grade10 till |

**Steps:**

1. Navigate to <grade10 profile url>.
2. Click the edit control.
3. Replace the display name with <new name>.
4. Click the save button.
5. Identify the member by typing <signed-in address> in the till's membership modal.
6. Wait for the first sweep beginning after step 4.
7. Open the pass in Google Wallet.

**Expected Results:**

* Step 4 shows <new name> on the profile.
* Step 5 shows <new name> as the member's name in the modal.
* Step 7 shows <new name> on the pass.

---

## grade10-site-store-e2e-US10: Collector goes from free pick-up to the shop on Google Maps

**As a** collector,
**I want** free pick-up on a card's page to take me to the shop's page and on
to Google Maps,
**so that** the shop I would pick up from is the one I find, in my own
language.

<!-- trace:case id=g10.store-domain.TC-frk rev=1 covers=g10.store-product-page.SC-21b,g10.store-product-page.SC-res,g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-iwa,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr,g10.store-store-locator.SC-gk9,g10.store-store-locator.SC-ca5,g10.store-store-locator.SC-91n,g10.store-store-locator.SC-w6y -->
### grade10-site-store-e2e-US10-TC1-1: Free pick-up leads to the same shop and on to Maps

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-10, grade10-site-store-store-locator-US-01, grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* `<product>` is any card with its one item for sale.

**Test data:**

| `<lang>` | `<language>` |
| --- | --- |
| (none) | English |
| /tc | Traditional Chinese |
| /sc | Simplified Chinese |

**Steps:**

1. Navigate to <grade10 product url> for `<product>` under `<lang>`.
2. Read the store name in the free pick-up claim.
3. Click the store name.
4. Read the store name under Location & Hours.
5. Click the map.
6. Switch to the new tab.

**Expected Results:**

* Step 2's store name reads in `<language>`.
* Step 3 opens Store Locator; URL contains `<lang>`.
* Step 4's store name is step 2's, word for word.
* Step 5 opens a new tab; the first tab stays on Store Locator.
* Step 6 shows Google Maps at 13 Pak Sha Road, Causeway Bay, Hong Kong.

---

## g10.store-dmn.US11: Shopkeeper scans a shelf product and opens its store page

**As a** shopkeeper,
**I want** the product the scanner names to open on its store page with the
same title, price and availability,
**so that** what I tell a customer at the shelf is what the store sells them
online.

<!-- trace:case id=g10.store-dmn.TC-xk6 rev=2 covers=g10.store-shelf-scanning.SC-n6w -->
### g10.store-dmn.US11-TC1: Scanned product opens its own page with the same answer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-shelf-scanning.US1, g10.store-shelf-scanning.US2, g10.store-shelf-scanning.US3, g10.store-shelf-scanning.US4, grade10-site-store-product-page-US-01, grade10-site-store-product-page-US-04

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* admin(shopkeeper) has the shop's scanner link open on a phone.
* `<product>` is published to the store and on the scanner since its last change.

**Test data:**

| `<product>` | `<availability>` |
| --- | --- |
| A raw card with its one item for sale | Available |
| A card with nothing for sale | Sold out |
| One slab of a card the store lists as two or more slabs, each naming its inventory item | Available |

**Steps:**

1. Point the camera at `<product>` on the shelf, at its label where it is a slab.
2. Read the title, price and availability the scan shows.
3. Open the store page link on the scan.
4. Read the title, price and purchase area on the page.

**Expected Results:**

* Step 2 names `<product>` and reads `<availability>`, with no stock count.
* Step 2 shows grade and cert for the slab row only.
* Step 3 opens `<product>`'s own store page, not another copy's.
* Step 4's title and price match step 2's.
* Step 4's purchase area reads `<availability>`.

## Reconciliation

**Run:** 2026-10-07 · carried US4-TC1-1 with its id, revision and words, so its marker names every scenario that serves `grade10-site-store-discounts-US-04` in this change; the path it walks is unchanged.

**Run:** 2026-10-07 · US4-TC1-1 covers a double tap by the durable scenario's trace id, `g10.store-membership.SC-uae`, in place of SC-uaf, a second id the migration minted for add-account-profile's copy of SC-77. Its revision, words and path are unchanged.

**Run:** 2026-10-07 · US4-TC1-2 carries never-lock-a-coupon's US4-TC1-1, so its marker names every scenario that serves `grade10-site-store-discounts-US-04` in that change, the thirteen it covers; it had named only the three the durable suite covers. It adds this change's points-title scenarios serving `grade10-site-store-membership-US-02`, and covers `g10.store-membership.SC-uae`, the durable id of `grade10-site-store-membership-SC-77`. The path it walks is unchanged.

- **Re-worded** - US1-TC1 opened any product in the collection from the listing; the listing now keeps a sold-out card shut, so `<product>` is for sale; which control opens it is the listing's feature suite's. Its meaning moved, so it is revision 2
- **Raised** - nothing: no other cross-feature path is introduced; a sold-out card from the front door's row stays US3-TC1's, whose row does not sell and so still opens it
- **Shared with** - `add-store-product-status` carries US1-TC1 at revision 1, any product in the collection; the fold refuses that copy once this one lands, so that change rewrites its case against revision 2
- **Identical path** - `pnpm run tcs:validate` warns that US1-TC1-2 and the durable US1-TC1-1 walk one path; they are one case at two revisions, and the fold keeps revision 2 alone

**Run:** 2026-10-06, the domain check of `activate-listing-tile-by-name` at QA2: the change touches `grade10-site/store/product-listing` and `grade10-site/store/product-page`, and US1-TC1 traces both.

**Run:** QA2 on 2026-10-13. US11-TC1 moves to rev 2: its slab row now points
the camera at the slab's label, because Q36 offers a slab whose label is not
read in the pick, without grade or cert. It covers
`g10.store-shelf-scanning.SC27`; the shelf-scanning suite's reconciliation
records the rest.

**Run:** 2026-09-28. The domain reading joined the order-history and
order-detail journeys at their existing View Details handoff. It adds no new
Store read, status rule, or payment behaviour.

| Finding | Disposition |
| --- | --- |
| Your Orders must open the selected owned order detail with the same identity and owner scope | **Folded in:** US6-TC1-1 |
| No other cross-feature path is introduced by this change | **None raised** |
