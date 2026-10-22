# grade10-site/store/product-page Test Cases

**Status:** pending-review · 0/19
**Drafts styled:** 2026-10-22, tcs-rules r6

## Walk 1: Read and Buy One Product

**Starting state:**

- customer(signed out) is on `<product page url>` on staging, with an empty cart in this browser.
- `<page product>` is available, with a description longer than three lines and at least 3 for sale.
- `<page product>` has 2 picks and shares its world with other cards for sale.

**Shared test data:**

| Field | Value |
| --- | --- |
| `product page url` | The staging site's `/store/products/<page product handle>`. |
| `page product` | An available card with images, badges, a long description, 2 picks, by the recipe "Choose picks on a staging-shop card". |

### Route

1. Read the card from its name to the pick-up line.
   - Record the name, images, price, badges and the one item to buy `g10.store-product-page.US1-TC1`
2. Click the button under the description.
   - Record the description shown in full on the same page `g10.store-product-page.US1-TC2`
3. Read the shipping and pick-up lines, then click the store name.
   - Record the plain shipping text and Store Locator opening `g10.store-product-page.US1-TC6`
4. Press Back, set the quantity to 2 and click Add to cart.
   - Record Adding…, the drawer opening and the reset quantity `g10.store-product-page.US2-TC1`
5. Close the drawer, set the quantity to 1 and click Add to cart again.
   - Record one line at quantity 3 `g10.store-product-page.US2-TC2`
6. Close the drawer and read the rail under the card.
   - Record the heading, the picks first and the card count `g10.store-product-page.US4-TC1`
7. Click a rail card.
   - Record its own page opening, with no cart control in the rail `g10.store-product-page.US4-TC2`

## g10.store-product-page.US1: Read a product

**As a** customer,
**I want** to read one product's name, pictures, price and description,
**so that** I can decide whether to buy it.

<!-- trace:case id=g10.store-product-page.TC-xpc rev=1 -->
### g10.store-product-page.US1-TC1: Product page shows the card and its one item to buy

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US1

**Pre-conditions:**

* `<page product>` is available, with images and badges in the catalogue.

**Test data:**

| Partition | `<page product>` |
| --- | --- |
| One variant | A card with 1 variant for sale. |
| Several variants | A card with 3 variants in the shop, at least one for sale. |

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the card.

**Expected Results:**

* Step 1's address is `/store/products/<page product handle>`.
* Step 2 shows the name, description, images and one price.
* Step 2 shows the catalogue's badges.
* Step 2 offers no size, option or variant choice.
* Step 2 shows no remaining count or scarcity cue.

<!-- trace:case id=g10.store-product-page.TC-vcs rev=1 -->
### g10.store-product-page.US1-TC2: A long description opens in full on the same page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US1

**Pre-conditions:**

* `<page product>` has `<description>`.

**Test data:**

| Partition | `<description>` | `<expected first view>` |
| --- | --- | --- |
| Long | More than three lines at the page's width. | Three lines and a button to read it in full. |
| Short | One line. | The whole description, no button. |

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the description.
3. Click the read-in-full button, where one shows.
4. Read the description and the address bar.

**Expected Results:**

* Step 2 shows `<expected first view>`.
* For the long row, step 4 shows the whole description.
* Step 4's address is unchanged.

<!-- trace:case id=g10.store-product-page.TC-e5z rev=1 -->
### g10.store-product-page.US1-TC6: Shipping and pick-up lines; the store name opens Store Locator

Runs once per row of **Test data**.

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
* **Trace:** g10.store-product-page.US1

**Pre-conditions:**

* `<page product>` and `<other product>` are in the catalogue.

**Test data:**

| Partition | `<lang>` |
| --- | --- |
| Default language | Nothing. |
| Traditional Chinese | `/tc`. |

**Steps:**

1. Navigate to `<lang>/store/products/<page product handle>`.
2. Read the shipping and pick-up lines.
3. Navigate to `<lang>/store/products/<other product handle>`.
4. Read the shipping and pick-up lines.
5. Click the store name in the pick-up line.

**Expected Results:**

* Step 2 says shipping is calculated at checkout.
* Step 2 offers free pick-up at Hong Kong Grade10 Store.
* The shipping fee is plain text, not a link.
* Step 4 reads the same as step 2.
* Step 5 opens Store Locator in the same tab, at `<lang>`.

---

## g10.store-product-page.US2: Buy from the product page

**As a** customer,
**I want** to choose a quantity and add the product to my cart,
**so that** I can buy it.

<!-- trace:case id=g10.store-product-page.TC-mkn rev=1 -->
### g10.store-product-page.US2-TC1: Add to cart shows Adding…, opens the drawer and resets quantity

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US2

**Pre-conditions:**

* customer(signed out) is on `/store/products/<page product handle>`, with an empty cart in this browser.
* `<page product>` has at least 2 for sale.

**Steps:**

1. Set the quantity to 2.
2. Click Add to cart.
3. Read the purchase controls while the add is pending.
4. Wait for the add to settle.
5. Read the drawer, the quantity and the cart total.

**Expected Results:**

* Step 2 asks for no sign-in.
* Step 3 shows Adding… on the controls.
* Step 5 shows the cart drawer open, with `<page product>` at quantity 2.
* Step 5 shows the page's quantity reset.
* The cart total includes `<page product>` × 2.

<!-- trace:case id=g10.store-product-page.TC-2w3 rev=1 -->
### g10.store-product-page.US2-TC2: Adding the same product again keeps one line

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
* **Trace:** g10.store-product-page.US2

**Pre-conditions:**

* customer(signed out) is on `/store/products/<page product handle>`.
* The cart holds `<page product>` at quantity 2; the shop has at least 3 for sale.

**Steps:**

1. Set the quantity to 1.
2. Click Add to cart.
3. Read the drawer's lines.

**Expected Results:**

* Step 3 shows one line for `<page product>`.
* That line's quantity is 3 = 2 + 1.

---

## g10.store-product-page.US4: Find another card under this one

**As a** customer,
**I want** to see other cards that go with the one I am reading,
**so that** I find another card worth opening without going back.

<!-- trace:case id=g10.store-product-page.TC-19g rev=1 -->
### g10.store-product-page.US4-TC1: The rail shows picks first, then similar cards, up to six

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` has `<picks>`, by the recipe "Choose picks on a staging-shop card".
* At least 6 other cards for sale share `<page product>`'s world.

**Test data:**

| Partition | `<picks>` | `<expected rail>` |
| --- | --- | --- |
| Some picks | 2 picks, in a known order. | The 2 picks in order, then 4 similar cards. |
| Many picks | 8 picks, in a known order. | The first 6 picks in order. |

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the rail under the card.

**Expected Results:**

* Step 2 is headed You may also like.
* Step 2 shows `<expected rail>`.
* No rail card is `<page product>` itself.
* Nothing names a rail card as chosen or similar.

<!-- trace:case id=g10.store-product-page.TC-6cv rev=1 -->
### g10.store-product-page.US4-TC2: A rail card opens its own page and offers no cart

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
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` shows a rail holding `<rail product>`.

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Inspect every rail card for a cart control.
3. Click the card for `<rail product>`.

**Expected Results:**

* Step 2 finds no cart control in the rail.
* Step 3 opens `/store/products/<rail product handle>`.

---

## Ungrouped

### g10.store-product-page.US1: Read a product

**As a** customer,
**I want** to read one product's name, pictures, price and description,
**so that** I can decide whether to buy it.

<!-- trace:case id=g10.store-product-page.TC-hp9 rev=1 -->
#### g10.store-product-page.US1-TC3: The page strikes sales and names the shop's discounts

Runs once per row of **Test data**.

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
* **Trace:** g10.store-product-page.US1

**Pre-conditions:**

* `<page product>` is for sale at HKD880 (range: any price above HKD100).
* The shop holds only `<shop discount>` for `<page product>`, saved at least 1 minute ago.

**Test data:**

| Partition | `<shop discount>` | `<expected price>` | `<expected strike>` | `<expected badge>` |
| --- | --- | --- | --- | --- |
| Sale price | Compare-at HKD1,000. | HKD880 | HKD1,000 struck | None |
| Product cut, no minimum | 10% off this product. | HKD792 = HKD880 × 0.9 | HKD880 struck | Its title |
| Order cut, no minimum | 10% off each item in the order. | HKD792 = HKD880 × 0.9 | HKD880 struck | Its title |
| Product cut with a minimum | 10% off after buying 2 units. | HKD880 | None | Its title |
| Order cut with a minimum | Spend HKD1,000, save HKD100. | HKD880 | None | Its title |
| Fixed amount once across the order | HKD100 off the order. | HKD880 | None | Its title |
| Buy X get Y | Buy 2, get 1 free. | HKD880 | None | Its title |
| Sale and a product cut | Compare-at HKD1,000 and 10% off this product. | HKD792 = HKD880 × 0.9 | HKD1,000 struck | Its title |

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the price and the badges.

**Expected Results:**

* Step 2 shows `<expected price>`.
* Step 2 matches `<expected strike>`.
* Step 2's badges include `<expected badge>`.

<!-- trace:case id=g10.store-product-page.TC-p02 rev=1 -->
#### g10.store-product-page.US1-TC4: A sold-out product says so, keeps its price, cannot be added

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US1

**Pre-conditions:**

* `<sold-out product>` has nothing for sale, by the recipe "Sell a card out".

**Steps:**

1. Navigate to `/store/products/<sold-out product handle>`.
2. Read the card and its purchase controls.
3. Try to add `<sold-out product>` to the cart.
4. Open Cart from the site header.

**Expected Results:**

* Step 2 says `<sold-out product>` is sold out.
* Step 2 shows its price.
* Step 4 shows no line for `<sold-out product>`.

<!-- trace:case id=g10.store-product-page.TC-48a rev=1 -->
#### g10.store-product-page.US1-TC5: An address that is not a card answers 404

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
* **Trace:** g10.store-product-page.US1

**Pre-conditions:**

* No product in the catalogue has the handle `<unknown handle>`.

**Test data:**

| Field | Value |
| --- | --- |
| `unknown handle` | `no-such-card-<today's date>`. |

**Steps:**

1. Navigate to `/store/products/<unknown handle>`.
2. Inspect the document response in browser developer tools.
3. Read the page.

**Expected Results:**

* Step 2's status is 404.
* Step 3 shows the site's not-found page.

---

### g10.store-product-page.US2: Buy from the product page

**As a** customer,
**I want** to choose a quantity and add the product to my cart,
**so that** I can buy it.

<!-- trace:case id=g10.store-product-page.TC-xf6 rev=1 -->
#### g10.store-product-page.US2-TC3: A quantity past the shop's stock is taken, then filled short

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
* **Trace:** g10.store-product-page.US2

**Pre-conditions:**

* customer(signed out) is on `/store/products/<short product handle>`, with an empty cart.
* `<short product>` has `<stock>` for sale.

**Test data:**

| Field | Value |
| --- | --- |
| `stock` | 2 (fixed: one fewer than the ask). |
| `ask` | 3 (fixed: `<stock>` + 1). |

**Steps:**

1. Set the quantity to `<ask>`.
2. Click Add to cart.
3. Wait for the drawer's read to finish.
4. Read the line for `<short product>`.

**Expected Results:**

* Step 1 accepts `<ask>`, with no cap or stock message.
* Step 4 shows `<stock>`.
* Step 4 says the store changed the line.

<!-- trace:case id=g10.store-product-page.TC-fft rev=1 -->
#### g10.store-product-page.US2-TC4: A member's add writes the store-kept cart

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
* **Trace:** g10.store-product-page.US2

**Pre-conditions:**

* customer(signed-in member) is on `/store/products/<page product handle>`, with an empty cart.

**Steps:**

1. Click Add to cart.
2. Sign in as the same member in another browser.
3. Open Cart from the site header there.

**Expected Results:**

* Step 3 lists `<page product>` at quantity 1.

---

### g10.store-product-page.US3: Share a product link

**As a** customer,
**I want** a pasted product address to preview the card,
**so that** the person I send it to recognises it before opening.

<!-- trace:case id=g10.store-product-page.TC-tvm rev=1 -->
#### g10.store-product-page.US3-TC1: A shared link previews the first picture, whole, on a wide card

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US3

**Pre-conditions:**

* `<shared product>` is in the catalogue as its row describes.

**Test data:**

| Partition | `<shared product>` | `<expected preview>` |
| --- | --- | --- |
| Pictured | A card with 2 images in a known shop order. | The first image, fitted whole on white, as the wide card. |
| Narrow picture | A card whose first image is narrower than the preview box. | That image enlarged to fill the box, as the wide card. |
| No picture | A card with no image. | No picture, as the small card. |

**Steps:**

1. Read the API response for `/store/products/<shared product handle>`, without running scripts.
2. Paste the address into a chat that unfurls links.
3. Read the preview.

**Expected Results:**

* Step 1's head names `<expected preview>`'s picture, where one exists, and its card shape.
* Step 3 shows `<expected preview>`, nothing cropped.

---

### g10.store-product-page.US4: Find another card under this one

**As a** customer,
**I want** to see other cards that go with the one I am reading,
**so that** I find another card worth opening without going back.

<!-- trace:case id=g10.store-product-page.TC-psw rev=1 -->
#### g10.store-product-page.US4-TC3: Sold-out picks stay and open; sold-out similar cards are left out

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
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` is sold out, by the recipe "Sell a card out".
* `<sold-out pick>` is one of its picks and sold out.
* `<sold-out similar>` shares its world, has no pick link and is sold out.

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the rail.
3. Click the card for `<sold-out pick>`.

**Expected Results:**

* Step 2 shows a rail under the sold-out card.
* Step 2 shows `<sold-out pick>`, saying it is sold out.
* Step 2 leaves out `<sold-out similar>`.
* Step 3 opens `/store/products/<sold-out pick handle>`.

<!-- trace:case id=g10.store-product-page.TC-ygo rev=1 -->
#### g10.store-product-page.US4-TC4: No rail and no empty space when nothing can show

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` is in the state `<rail state>` describes.

**Test data:**

| Partition | `<rail state>` |
| --- | --- |
| Nothing to show | No picks, and no other card shares its world, language or type, by the recipe "A card sharing nothing". |
| Switched off | 2 picks; the rail is switched off for this brand and environment. |
| Catalogue copy not to hand | 2 picks; the store's copy of the catalogue cannot be read. |

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the area under the card.

**Expected Results:**

* Step 2 shows no rail and no empty space for one.
* The card shows whole.

<!-- trace:case id=g10.store-product-page.TC-2dx rev=1 -->
#### g10.store-product-page.US4-TC5: Similar cards weigh world, then language, then type

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` has no picks, by the recipe "A card with chosen facts, on the staging shop".
* The catalogue holds `<same world>`, `<same language>` and `<same type>`, each sharing only that fact.
* `<newer same world>` shares only the world and is newer than `<same world>`.

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the rail's cards in order.

**Expected Results:**

* `<newer same world>` lists before `<same world>`.
* `<same world>` lists before `<same language>`.
* `<same language>` lists before `<same type>`.

<!-- trace:case id=g10.store-product-page.TC-ait rev=1 -->
#### g10.store-product-page.US4-TC6: A pick changed in Shopify reaches the rail within a minute

Runs once per row of **Test data**.

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
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` has picks `<pick A>` and `<pick B>`, in that order.
* admin is in the staging shop's admin.

**Test data:**

| Partition | `<pick change>` | `<expected picks>` |
| --- | --- | --- |
| Reorder | Put `<pick B>` before `<pick A>`. | `<pick B>`, then `<pick A>`. |
| Pick deleted | Delete `<pick B>` from the catalogue. | `<pick A>` alone. |
| Picks unreadable | Make the card's picks unreadable to the store. | No picks; similar cards fill the rail. |

**Steps:**

1. Make `<pick change>` and save.
2. Wait 60 seconds past the save.
3. Navigate to `/store/products/<page product handle>`.
4. Read the rail.

**Expected Results:**

* Step 4 starts with `<expected picks>`.

<!-- trace:case id=g10.store-product-page.TC-qur rev=1 -->
#### g10.store-product-page.US4-TC7: The rail is in the response and the card does not move

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` shows a rail.
* customer uses a browser with page JavaScript disabled.

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Inspect the document response in browser developer tools.
3. Enable JavaScript and reload, recording layout shifts.

**Expected Results:**

* Step 2's response HTML holds the rail's cards.
* Step 3 shows no placeholder where the rail goes.
* Step 3 records no shift of the card.

<!-- trace:case id=g10.store-product-page.TC-xb8 rev=1 -->
#### g10.store-product-page.US4-TC8: On a narrow screen the rail is one row that scrolls

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-product-page.US4

**Pre-conditions:**

* `<page product>` shows a rail of 6 cards.
* customer uses a browser emulating a phone.

**Steps:**

1. Navigate to `/store/products/<page product handle>`.
2. Read the rail.
3. Scroll the rail sideways.

**Expected Results:**

* Step 2 shows one row, part of the next card showing.
* Step 3 reaches the sixth card.
