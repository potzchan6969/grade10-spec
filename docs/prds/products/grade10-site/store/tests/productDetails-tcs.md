---
title: Store Product Details Test Cases
---

# grade10-site/store/product-page Test Cases

**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/product-page, grade10-site/store/cross-sell, grade10-site/store/discounts

## Background

* `<page url>` is `<g10url>/store/products/<page product handle>`.

## Walk 1: Read and buy one product

**Starting state:**

- customer(signed out) on `<page url>`, with an empty cart in this browser; `<page product>` is for sale, has a description longer than three lines, at least 3 for sale, and 2 picks, by the recipe "Choose picks on a staging-shop card"

### Route

1. Read the card from its name to the pick-up line.
   - The name, images, price, badges and one item to buy `g10.store-product-page.TC1`
2. Select the button under the description.
   - The whole description, on the same page `g10.store-product-page.TC2`
3. Read the shipping and pick-up lines, then select the store name.
   - Plain shipping text, and Store Locator opens `g10.store-product-page.TC9`
4. Go back, set the quantity to 2 and select Add to cart; close the drawer, set 1 and add again.
   - Adding…, the drawer, then one line at 3 `g10.store-product-page.TC6`
5. Close the drawer and read the rail under the card.
   - The heading, the picks first `g10.store-product-page.TC11`
6. Select a rail card.
   - Its own page opens, with no cart control in the rail `g10.store-product-page.TC12`

## product-page: Product Details

<!-- trace:case id=g10.store-product-page.TC-xpc rev=1 -->
### g10.store-product-page.TC1: The page shows the card and its one item to buy

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page

**Pre-conditions:**

* `<page product>` is for sale, with images and badges in the catalogue, and the row's variants.

**Test data:**

| Variants |
| --- |
| one, for sale |
| three in the shop, at least one for sale |

**Steps:**

1. Open `<page url>`.

**Expected Results:**

* The name, description, images, one price and the catalogue's badges, UI matching store-product-page-screens-product-detail--default.
* No size, option or variant choice, and no remaining count or scarcity cue.

<!-- trace:case id=g10.store-product-page.TC-vcs rev=1 -->
### g10.store-product-page.TC2: A long description opens in full on the same page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page

**Pre-conditions:**

* `<page product>` has the row's description.

**Test data:**

| Description | First shown |
| --- | --- |
| longer than three lines at the page's width | three lines, and a button to read it in full |
| ❓ one line - design confirms | the whole description, no button, UI matching store-product-page-blocks-storeproductdescription--short |

**Steps:**

1. Open `<page url>` and read the description.
2. Select the read-in-full button, where one shows.

**Expected Results:**

* Step 1: the row's first view.
* Step 2 shows the whole description, UI matching store-product-page-screens-product-detail--description-expanded, and the address is unchanged.

---

### g10.store-product-page.TC20: A product's title stays as the shop wrote it on a Chinese page

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page

**Pre-conditions:**

* `<product>` is for sale, its title typed in English in the shop, with no translation anywhere.

**Steps:**

1. Open `<g10url>/tc/store/products/<handle>` and read the title.

**Expected Results:**

* The title reads exactly as the shop wrote it, in English, while the page's own words read in Traditional Chinese.

## product-page#free-pick-up: Free Pick-up

<!-- trace:case id=g10.store-product-page.TC-e5z rev=1 -->
### g10.store-product-page.TC9: Every card reads the same shipping and pick-up lines, and the store name opens Store Locator

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page#free-pick-up

**Pre-conditions:**

* `<page product>` and `<other product>` are in the catalogue.

**Test data:**

| Language prefix |
| --- |
| none |
| `/tc` |

**Steps:**

1. Open `<prefix>/store/products/<page product handle>` and read the shipping and pick-up lines.
2. Open `<prefix>/store/products/<other product handle>` and read them again.
3. Select the store name in the pick-up line.

**Expected Results:**

* Steps 1 and 2: shipping is calculated at checkout, and pick-up is free at Hong Kong Grade10 Store; Shipping fee is plain text, not a link.
* Step 3 opens Store Locator in the same tab, in the row's language.

---

## product-page#buy: Buy

<!-- trace:case id=g10.store-product-page.TC-mkn rev=2 -->
### g10.store-product-page.TC6: Add to cart shows Adding…, opens the drawer, and adding again keeps one line

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page#buy

**Pre-conditions:**

* customer(signed out) is on `<page url>`, with an empty cart in this browser; `<page product>` has at least 3 for sale.

**Steps:**

1. Set the quantity to 2 and select Add to cart.
2. Close the drawer, set the quantity to 1 and select Add to cart.

**Expected Results:**

* Step 1 asks for no sign-in; the controls read Adding… while it is pending, UI matching store-product-page-screens-product-detail--add-quantity-pending-then-drawer-opens; then the drawer opens with `<page product>` at 2, the page's quantity resets, and the total includes it.
* Step 2: one line for `<page product>`, at 3.

---

## cross-sell#rail: Rail

<!-- trace:case id=g10.store-product-page.TC-19g rev=1 -->
### g10.store-product-page.TC11: The rail shows picks first, then similar cards, up to six

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#rail/one-rail, cross-sell#rail/never-itself

**Pre-conditions:**

* `<page product>` has the row's picks, by the recipe "Choose picks on a staging-shop card"; at least 6 other cards for sale share its world.

**Test data:**

| Picks | Rail |
| --- | --- |
| 2, in a known order | the 2 picks in order, then 4 similar cards |
| 8, in a known order | the first 6 picks in order |

**Steps:**

1. Open `<page url>` and read the rail under the card.

**Expected Results:**

* Headed You may also like, holding the row's cards, UI matching store-cross-sell-blocks-storeproductrelatedrail--picks-and-similar.
* `<page product>` is not in it, and nothing names a card as chosen or similar.

<!-- trace:case id=g10.store-product-page.TC-6cv rev=1 -->
### g10.store-product-page.TC12: A rail card opens its own page and offers no cart

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#rail/opens-the-card

**Pre-conditions:**

* `<page product>` shows a rail holding `<rail product>`.

**Steps:**

1. Open `<page url>` and look for a cart control in the rail.
2. Select `<rail product>`'s card.

**Expected Results:**

* Step 1 finds none.
* Step 2 opens `/store/products/<rail product handle>`.

---

## Ungrouped

### product-page: Product Details

<!-- trace:case id=g10.store-product-page.TC-p02 rev=1 -->
#### g10.store-product-page.TC3: A sold-out product says so, keeps its price, and cannot be added

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page

**Pre-conditions:**

* `<sold-out product>` has nothing for sale, by the recipe "Sell a card out".

**Steps:**

1. Open `/store/products/<sold-out product handle>` and read the card and its purchase controls.
2. Try to add it, then open Cart from the header.

**Expected Results:**

* Step 1: sold out, with its price, UI matching store-product-page-screens-product-detail--sold-out.
* Step 2: the cart holds no line for it.

#### g10.store-product-page.TC4: A shared link to a card previews with its first picture

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page

**Pre-conditions:**

* customer can paste a link into a chat app that shows link previews.

**Test data:**

| Card | Preview |
| --- | --- |
| pictured | the wide preview, with the card's first picture fitted whole and padded white |
| with no picture in the catalogue | the small preview, with no picture |

**Steps:**

1. Paste the row's card's page address into the chat and read its preview.

**Expected Results:**

* The row's preview, naming the card.

---

### product-page#unknown-product-address: Unknown product address

<!-- trace:case id=g10.store-product-page.TC-48a rev=2 -->
#### g10.store-product-page.TC5: An address that is no card shows the store's own not-found state

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page#unknown-product-address/unknown-product-address

**Pre-conditions:**

* No card has the handle `no-such-card-<today's date>`.

**Test data:**

| Address | Shown | Its action |
| --- | --- | --- |
| `/store/products/no-such-card-<today's date>` | the store's not-found state inside the store's frame, in the page's language, UI matching store-product-page-screens-product-detail--unknown-product-address | Browse the store opens the product listing in the same tab |
| `/no-such-page-<today's date>`, outside any owned surface | the site's not-found page | Home |

**Steps:**

1. Open the row's address.
2. Select the row's action.

**Expected Results:**

* Step 1: the row's page. Step 2: the row's action works.

---

### product-page#buy: Buy

<!-- trace:case id=g10.store-product-page.TC-xf6 rev=1 -->
#### g10.store-product-page.TC7: A quantity past the shop's stock is taken, then filled short in the cart

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page#buy

**Pre-conditions:**

* customer(signed out) is on `/store/products/<short product handle>`, with an empty cart; `<short product>` has 2 for sale.

**Steps:**

1. Set the quantity to 3, one more than the stock, and select Add to cart.
2. Wait for the drawer, then read the line.

**Expected Results:**

* Step 1 takes 3, with no cap or stock message, UI matching store-product-page-blocks-storeproductpurchasepanel--quantity-beyond-browse-count.
* Step 2: the line holds 2, and says the store changed it.

<!-- trace:case id=g10.store-product-page.TC-fft rev=2 -->
#### g10.store-product-page.TC8: An add reaches the member's own cart

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-page#buy

**Pre-conditions:**

* customer, a member with an empty cart, is on `<page url>` as the row says.

**Test data:**

| Adds while | Then |
| --- | --- |
| signed in | signs in as the same member in another browser |
| signed out | signs in as the member in this browser |

**Steps:**

1. Select Add to cart.
2. Do the row's step, then open Cart from the header.

**Expected Results:**

* The cart lists `<page product>` at 1.

---

### discounts#where-each-shows: Where Each Shows

<!-- trace:case id=g10.store-product-page.TC-hp9 rev=1 -->
#### g10.store-product-page.TC10: The page strikes sales and names the shop's discounts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#where-each-shows/named

**Pre-conditions:**

* `<page product>` is for sale at HKD880 (any price above HKD100); the shop holds only the row's discount for it, saved at least a minute ago.

**Test data:**

| Discount | Price | Struck | Badge |
| --- | --- | --- | --- |
| compare-at HKD1,000 | HKD880 | HKD1,000 | none |
| 10% off this product | HKD792 = HKD880 × 0.9 | HKD880 | its title |
| 10% off each item in the order | HKD792 = HKD880 × 0.9 | HKD880 | its title |
| 10% off after buying 2 units | HKD880 | none | its title |
| spend HKD1,000, save HKD100 | HKD880 | none | its title |
| HKD100 off the order | HKD880 | none | its title |
| buy 2, get 1 free | HKD880 | none | its title |
| compare-at HKD1,000 and 10% off this product | HKD792 = HKD880 × 0.9 | HKD1,000 | its title |

**Steps:**

1. Open `<page url>` and read the price and badges.

**Expected Results:**

* The row's price, strike and badge.

---

### cross-sell#rail: Rail

<!-- trace:case id=g10.store-product-page.TC-ygo rev=1 -->
#### g10.store-product-page.TC13: When nothing can show, there is no rail and no space for one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#rail/nothing-to-show-no-rail, cross-sell#rail/switched-off, cross-sell#rail/a-rail-the-store-cannot-compose

**Pre-conditions:**

* `<page product>` is in the row's state.

**Test data:**

| State |
| --- |
| no picks, and no other card shares its world, language or type, by the recipe "A card sharing nothing" |
| 2 picks, and the rail switched off for this brand and environment |
| 2 picks, and the store's copy of the catalogue cannot be read |

**Steps:**

1. Open `<page url>` and read the area under the card.

**Expected Results:**

* No rail and no empty space for one; the card shows whole.

<!-- trace:case id=g10.store-product-page.TC-qur rev=2 -->
#### g10.store-product-page.TC14: The rail arrives with the card, and the card does not move

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#rail/arrives-with-the-card

**Pre-conditions:**

* `<page product>` shows a rail.

**Steps:**

1. With page scripts off, open `<page url>`.
2. Turn scripts on and reload, watching the card as the page loads.

**Expected Results:**

* Step 1 shows the rail's cards.
* Step 2 shows no placeholder where the rail goes, and the card does not move.

<!-- trace:case id=g10.store-product-page.TC-xb8 rev=1 -->
#### g10.store-product-page.TC15: On a narrow screen the rail is one row that scrolls

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#rail

**Pre-conditions:**

* `<page product>` shows a rail of 6 cards; customer uses a browser 375px wide.

**Steps:**

1. Open `<page url>` and read the rail.
2. Scroll the rail sideways.

**Expected Results:**

* Step 1: one row, part of the next card showing, UI matching store-cross-sell-blocks-storeproductrelatedrail--narrow.
* Step 2 reaches the sixth card.

#### g10.store-product-page.TC17: A sold-out similar card is left out of the rail

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#rail/sold-out

**Pre-conditions:**

* `<sold-out similar>` shares `<page product>`'s world, is no pick of it, and is sold out.

**Steps:**

1. Open `<page url>` and read the rail.

**Expected Results:**

* `<sold-out similar>` is not in it.

---

### cross-sell#picks: Picks

<!-- trace:case id=g10.store-product-page.TC-psw rev=2 -->
#### g10.store-product-page.TC16: A sold-out pick stays in the rail, says so and still opens

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#picks

**Pre-conditions:**

* `<page product>` is sold out, by the recipe "Sell a card out"; `<sold-out pick>`, one of its picks, is sold out too.

**Steps:**

1. Open `<page url>` and read the rail.
2. Select `<sold-out pick>`'s card.

**Expected Results:**

* Step 1: a rail under the sold-out card, holding `<sold-out pick>` marked sold out, UI matching store-cross-sell-blocks-storeproductrelatedrail--sold-out-pick-opens.
* Step 2 opens `/store/products/<sold-out pick handle>`.

<!-- trace:case id=g10.store-product-page.TC-ait rev=1 -->
#### g10.store-product-page.TC18: A pick changed in Shopify reaches the rail within a minute

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#picks

**Pre-conditions:**

* `<page product>` has picks `<pick A>` and `<pick B>`, in that order; admin is in the shop's admin.

**Test data:**

| Change | Rail starts with |
| --- | --- |
| put `<pick B>` before `<pick A>` | `<pick B>`, then `<pick A>` |
| delete `<pick B>` from the catalogue | `<pick A>` alone |
| make the card's picks unreadable to the store | no picks; similar cards fill it |

**Steps:**

1. Make the row's change and save.
2. Wait 60 seconds, then open `<page url>` and read the rail.

**Expected Results:**

* The rail starts as the row says.

---

### cross-sell#similar-cards: Similar Cards

<!-- trace:case id=g10.store-product-page.TC-2dx rev=1 -->
#### g10.store-product-page.TC19: Similar cards weigh the world, then the language, then the type

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cross-sell#similar-cards

**Pre-conditions:**

* `<page product>` has no picks, by the recipe "A card with chosen facts, on the staging shop".
* The catalogue holds `<same world>`, `<same language>` and `<same type>`, each sharing only that fact, and `<newer same world>`, sharing only the world and newer than `<same world>`.

**Steps:**

1. Open `<page url>` and read the rail's cards in order.

**Expected Results:**

* `<newer same world>`, then `<same world>`, then `<same language>`, then `<same type>`.
