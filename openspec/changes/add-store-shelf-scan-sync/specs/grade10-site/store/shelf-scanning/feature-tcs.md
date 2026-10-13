# grade10-site/store/shelf-scanning Test Cases

**Status:** pending-review · 0/50
**Drafts styled:** 2026-10-13, tcs-rules r5

## Walk 1: Shopkeeper scans the staging shelf with the shop's link

**Starting state:**

- admin(shopkeeper) has `<g10 scan link>` for staging open on a phone, signed in to nothing.
- Every shelf product below is published to the staging store and unchanged for the last 10 minutes.
- Every photo of those products is older than the last hourly photo run.

**Shared test data:**

| Field | Value |
| --- | --- |
| card_multi | A raw card with two variants, the first sold out and the second for sale |
| card_discounted | A raw card with one variant under a running automatic discount |
| card_shared | A raw card whose art the scanner's shared card catalogue also holds |
| sealed_box | A sealed box with a photo |
| slab_consigned | A consigned PSA slab, one of two slabs of the same card the store lists |
| slab_house | A house-stock CGC slab whose product carries its label code |

### Route

1. Point the camera at `<card_multi>`.
   - The scan shows the second variant's price, Available, no count. g10.store-shelf-scanning.US1-TC1
2. Open the product's store page from the scan.
   - The store page link opens `<card_multi>`'s own page. g10.store-shelf-scanning.US2-TC1
   - Title and price match the scan. g10.store-shelf-scanning.US1-TC1
3. Go back to the scanner and point the camera at `<card_discounted>`.
   - The scan price is the discounted price the page shows, with a Sale badge. g10.store-shelf-scanning.US1-TC1
4. Point the camera at `<card_shared>`.
   - The scan names the store product with the store's price. g10.store-shelf-scanning.US1-TC9
5. Point the camera at `<sealed_box>`.
   - The scanner shows its not-recognised message. g10.store-shelf-scanning.US1-TC10
6. Point the camera at the label of `<slab_consigned>`.
   - The scan names this slab's product with its grade and cert. g10.store-shelf-scanning.US3-TC1
   - The scan names the PSA slab's product. g10.store-shelf-scanning.US3-TC2
7. Point the camera at the label of `<slab_house>`.
   - The scan names this slab's product with its grade and cert. g10.store-shelf-scanning.US3-TC1
   - The scan names the CGC slab's product. g10.store-shelf-scanning.US3-TC2
8. Look over the scanner's controls.
   - No control adds a photo. g10.store-shelf-scanning.US7-TC2
   - No scan showed a stock count. g10.store-shelf-scanning.US7-TC4

## g10.store-shelf-scanning.US1: Shopkeeper scans a shelf product and sees what the store sells it as

**As a** shopkeeper on the shop floor,
**I want** to point the scanner at a product on the shelf and see the store's
current title, price and availability for it,
**so that** I can answer a customer without looking the product up, and never
quote a price the store has since changed.

<!-- trace:case id=g10.store-shelf-scanning.TC-66n rev=3 -->
### g10.store-shelf-scanning.US1-TC1: Scan shows the price the product page shows

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
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* The site under test is staging, which carries the store surfaces.
* admin(shopkeeper) has `<g10 scan link>` open on a phone.
* `<product>` is published to the store and unchanged for the last 10 minutes.

**Test data:**

| `<product>` | `<expected item>` | `<availability>` | `<sale badge>` |
| --- | --- | --- | --- |
| A raw card with two variants, the first sold out and the second for sale | the second variant | Available | none |
| A raw card with two variants, both sold out | the first listed variant | Sold out | none |
| A raw card with one variant under a running automatic discount | the one variant, at the price the shopper pays | Available | a Sale badge |
| A raw card with two variants, the first sold out and the second for sale, under a running automatic discount | the second variant, at the price the shopper pays | Available | a Sale badge |

**Steps:**

1. Point the camera at `<product>` on the shelf.
2. Read the title, price and availability the scan shows.
3. Open `<product>`'s page at `<grade10 store url>`.
4. Read the title and price on the page.

**Expected Results:**

* Step 2 names `<product>` and reads `<availability>`, with no count.
* Step 2's price is `<expected item>`'s price.
* Step 2 shows `<sale badge>`.
* Step 4's title and the price it charges match step 2's.

<!-- trace:case id=g10.store-shelf-scanning.TC-cks rev=3 -->
### g10.store-shelf-scanning.US1-TC2: A change the shop reports reaches the scanner within 6 minutes of the save

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, for sale, recognised by the scanner.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<change>` | `<field read>` |
| --- | --- |
| Set the variant's price to a value different from the one on file | price |
| Set the product's title to a value different from the one on file | title |

**Steps:**

1. In the staging shop's admin, open `<card_1>`.
2. Make `<change>` and save; note the time.
3. 360s (6mins) after step 2's time, reload `<g10 scan link>`.
4. Point the camera at `<card_1>`.

**Expected Results:**

* Step 4 shows `<card_1>`'s new `<field read>`.
* Step 4's other details are unchanged.

<!-- trace:case id=g10.store-shelf-scanning.TC-sz9 rev=3 -->
### g10.store-shelf-scanning.US1-TC3: A change only the store's re-read finds reaches the scanner within 11 minutes of the save

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** performance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, held on the scanner.
* The shop's report of product changes does not reach the store.

**Test data:**

| Field | Value |
| --- | --- |
| new price | A price different from `<card_1>`'s on file |

**Steps:**

1. In the staging shop's admin, set `<card_1>`'s price to `<new price>` and save; note the time.
2. 660s (11mins) after step 1's time, read the scanner's item for `<card_1>`.

**Expected Results:**

* Step 2's item carries `<new price>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-k23 rev=2 covers=g10.store-shelf-scanning.SC-dan,g10.store-shelf-scanning.SC-icy -->
### g10.store-shelf-scanning.US1-TC4: Every published product but gift cards is held on the scanner

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<product>` exists in the staging shop in the state its row names, unchanged for the last 10 minutes.
* `<product>` has at least one photo, older than the last hourly photo run.

**Test data:**

| `<product>` | `<held>` |
| --- | --- |
| A raw card published to the store | held |
| A slab published to the store | held |
| A sealed box published to the store | held |
| A comic published to the store | held |
| A merch item published to the store | held |
| A gift card published to the store | not held |
| A draft product, published nowhere | not held |
| A product published to another channel but not the store's | not held |
| A product published to the ZZZ store | not held |

**Steps:**

1. Read the scanner's items for the grade10 store.
2. Read the photos of a held `<product>`'s item and whether each is learned.

**Expected Results:**

* `<product>` is `<held>`.
* A held `<product>` is one item, carrying its store title, price and availability.
* Step 2's item carries `<product>`'s photos, each learned, sealed box, comic and merch alike.

<!-- trace:case id=g10.store-shelf-scanning.TC-1o9 rev=1 covers=g10.store-shelf-scanning.SC-9kw -->
### g10.store-shelf-scanning.US1-TC5: A product the store drops leaves the scanner

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, recognised by the scanner.
* The scanner's shared card catalogue does not hold `<card_1>`'s art.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<drop>` |
| --- |
| Unpublish `<card_1>` from the store's channel |
| Delete `<card_1>` |

**Steps:**

1. In the staging shop's admin, `<drop>`; note the time.
2. 360s (6mins) later, reload `<g10 scan link>`.
3. Point the camera at `<card_1>`.

**Expected Results:**

* Step 3 does not name `<card_1>`.
* Step 3 shows the scanner's not-recognised message.

<!-- trace:case id=g10.store-shelf-scanning.TC-yj1 rev=1 covers=g10.store-shelf-scanning.SC-r9i -->
### g10.store-shelf-scanning.US1-TC6: An item changed on the scanner is put back to the store's version

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, held on the scanner.
* The scanner's item for `<card_1>` has been given a title and price the store does not carry.

**Steps:**

1. In the staging shop's admin, change a different product, so the store's copy of the catalogue moves.
2. 360s (6mins) later, read the scanner's item for `<card_1>`.

**Expected Results:**

* Step 2's item carries the store's title and price for `<card_1>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-8xh rev=1 -->
### g10.store-shelf-scanning.US1-TC7: A product with nothing moved is not written again

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` and `<card_2>` are raw cards published to the staging store, held on the scanner, their photos learned.

**Steps:**

1. Note the last write of the scanner's items for `<card_1>` and `<card_2>`.
2. In the staging shop's admin, change `<card_2>`'s price.
3. 360s (6mins) later, read both items and the scanner's photo queue.

**Expected Results:**

* `<card_2>`'s item carries the new price.
* `<card_1>`'s item shows no write since step 1.
* No photo of `<card_1>` is queued to be learned again.

<!-- trace:case id=g10.store-shelf-scanning.TC-4sb rev=1 -->
### g10.store-shelf-scanning.US1-TC8: Production's scanner shows the store's answer before the store opens there

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* Production does not carry the store surfaces.
* `<card_1>` is a raw card published to the production store, for sale, its photos learned.
* admin(shopkeeper) has `<g10 scan link>` for production open on a phone.

**Steps:**

1. Point the camera at `<card_1>` on the shop's shelf.
2. Read the scan.
3. In the production shop's admin, read `<card_1>`'s title and price.

**Expected Results:**

* Step 2 names `<card_1>` and reads Available.
* Step 2's title and price match step 3's.

<!-- trace:case id=g10.store-shelf-scanning.TC-c6t rev=2 -->
### g10.store-shelf-scanning.US1-TC9: The store's product is named over the shared card catalogue

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
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_shared>` is a raw card published to the staging store, `<availability>`, its photos learned.
* The scanner's shared card catalogue holds a card with `<card_shared>`'s art.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<availability>` | `<reads>` |
| --- | --- |
| for sale | Available |
| sold out | Sold out |

**Steps:**

1. Point the camera at `<card_shared>`.
2. Read the scan.

**Expected Results:**

* Step 2 names the store product `<card_shared>`.
* Step 2's price is the store's price, not the shared catalogue's.
* Step 2 reads `<reads>`, the store's answer, with no count.

<!-- trace:case id=g10.store-shelf-scanning.TC-9ks rev=1 covers=g10.store-shelf-scanning.SC-z1x -->
### g10.store-shelf-scanning.US1-TC10: A product the scanner cannot yet recognise reads as unknown

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<object>` is on the shelf; a published `<object>` has photos older than the last hourly run.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<object>` |
| --- |
| A sealed box published to the store |
| A merch item published to the store |
| A comic published to the store |
| An object no store product shows, as the baseline |

**Steps:**

1. Point the camera at `<object>` and hold it steady.
2. Read the scanner.

**Expected Results:**

* Step 2 shows the scanner's not-recognised message.
* Step 2 is the same as for the baseline object.

<!-- trace:case id=g10.store-shelf-scanning.TC-u71 rev=1 covers=g10.store-shelf-scanning.SC-s7a -->
### g10.store-shelf-scanning.US1-TC11: A new product's photos are recognisable within the hour

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_new>` is a raw card not yet in the `<environment>` shop, on the shelf.
* admin(shopkeeper) has `<g10 scan link>` for `<environment>` open on a phone.

**Test data:**

| `<environment>` |
| --- |
| staging |
| production |

**Steps:**

1. In the `<environment>` shop's admin, publish `<card_new>` to the store with a photo; note the time.
2. 3600s (1h) after the publish, plus 360s (6mins), reload `<g10 scan link>`.
3. Point the camera at `<card_new>`.

**Expected Results:**

* Step 3 names `<card_new>` with its title, price and availability.

<!-- trace:case id=g10.store-shelf-scanning.TC-xta rev=1 covers=g10.store-shelf-scanning.SC-c8l -->
### g10.store-shelf-scanning.US1-TC12: A replaced or dropped photo is learned at the next hourly run

Runs once per row of **Test data**.

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
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, recognised by the scanner from `<old photo>`.
* `<old photo>` and `<new photo>` show visibly different copies of `<card_1>`'s art.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<photo change>` | `<new photo outcome>` | `<old photo outcome>` |
| --- | --- | --- |
| Replace `<old photo>` with `<new photo>` | names `<card_1>` | does not name `<card_1>` |
| Add `<new photo>` beside `<old photo>` | names `<card_1>` | names `<card_1>` |
| Remove `<old photo>`, leaving `<new photo>` already learned | names `<card_1>` | does not name `<card_1>` |

**Steps:**

1. In the staging shop's admin, make `<photo change>` on `<card_1>`; note the time.
2. After the first hourly photo run that starts 360s (6mins) or more past the save, reload `<g10 scan link>`.
3. Point the camera at a print of `<new photo>`.
4. Point the camera at a print of `<old photo>`.

**Expected Results:**

* Step 3 `<new photo outcome>`.
* Step 4 `<old photo outcome>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-3sh rev=1 -->
### g10.store-shelf-scanning.US1-TC13: An hour with no new photo does no work

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* No photo of any store product changed since the last hourly photo run, on `<environment>`.

**Test data:**

| `<environment>` |
| --- |
| staging |
| production |

**Steps:**

1. Wait for the next hourly photo run on `<environment>`.
2. Read that run's record.

**Expected Results:**

* Step 2's run learned no photo and rebuilt nothing.

<!-- trace:case id=g10.store-shelf-scanning.TC-mg3 rev=1 covers=g10.store-shelf-scanning.SC-cz6 -->
### g10.store-shelf-scanning.US1-TC14: A photo that failed to learn is tried again after 24 hours

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* A photo of `<card_1>`, a published staging card, failed to learn at an hourly run.
* The cause of the failure is gone.

**Steps:**

1. Read the scanner's record of that photo at the hourly runs over the next 86400s (24h).
2. Read it again at the first hourly run past 86400s (24h) after the failure.

**Expected Results:**

* Step 1 shows the photo left failed, not retried every hour.
* Step 2 shows the photo learned.

<!-- trace:case id=g10.store-shelf-scanning.TC-47l rev=3 covers=g10.store-shelf-scanning.SC-hdf -->
### g10.store-shelf-scanning.US1-TC15: An open scanner picks up a change without being reopened

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
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, recognised by the scanner.
* The shop's report of product changes `<report>` the store.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone, in the foreground.

**Test data:**

| `<report>` | `<item bound>` | `<open scanner bound>` | `<new price>` |
| --- | --- | --- | --- |
| reaches | 360s (6mins) | 480s (8mins) | A price different from `<card_1>`'s on file |
| does not reach | 660s (11mins) | 780s (13mins) | A price different from `<card_1>`'s on file |

**Steps:**

1. Point the camera at `<card_1>`; read the price.
2. In the staging shop's admin, set `<card_1>`'s price to `<new price>` and save; note the time.
3. `<item bound>` past step 2's time, read the scanner's item for `<card_1>`.
4. Without reloading or leaving the scanner, wait `<open scanner bound>` past step 2's time.
5. Point the camera at `<card_1>`.

**Expected Results:**

* Step 1 shows the price on file.
* Step 3's item carries `<new price>`.
* Step 5 shows `<new price>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-2et rev=1 covers=g10.store-shelf-scanning.SC-hdf -->
### g10.store-shelf-scanning.US1-TC16: Returning to the scanner picks up a change at once

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
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, recognised by the scanner.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| new price | A price different from `<card_1>`'s on file |

**Steps:**

1. Point the camera at `<card_1>`; read the price.
2. Switch the phone to another app.
3. In the staging shop's admin, set `<card_1>`'s price to `<new price>`; wait 360s (6mins).
4. Switch the phone back to the scanner.
5. Point the camera at `<card_1>` within 30s.

**Expected Results:**

* Step 1 shows the price on file.
* Step 5 shows `<new price>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-2su rev=2 covers=g10.store-shelf-scanning.SC-92k -->
### g10.store-shelf-scanning.US1-TC17: Two listings of one art are both offered, closest first

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
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_en>` and `<card_jp>` are raw cards published to the staging store, for sale, at different prices.
* Both products' photos show the same art and are learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| card_en | A raw card, one listing of the art |
| card_jp | A raw card, another listing of the same art, say another language |

**Steps:**

1. Point the camera at `<card_en>` and hold it steady.
2. Read the label over the card.
3. Tap the label.
4. Read the sheet.
5. Tap `<card_jp>`'s row.
6. Read the sheet.
7. Tap the back control.
8. Tap `<card_jp>`'s row again.
9. Open the store page link on the sheet.

**Expected Results:**

* Step 2 shows one title and price, and a chip counting 2 matches.
* Step 2 shows no availability chip.
* Step 4 lists `<card_en>` and `<card_jp>`, each with title, price and availability.
* Step 4's first row carries step 2's title and price.
* Step 6 shows `<card_jp>` alone, with its title, price and availability.
* Step 7 lists both products again.
* Step 9 opens `<card_jp>`'s own page at `<grade10 store url>`, not `<card_en>`'s.

<!-- trace:case id=g10.store-shelf-scanning.TC-hbv rev=1 covers=g10.store-shelf-scanning.SC-egb -->
### g10.store-shelf-scanning.US1-TC18: Dismissing the pick sheet chooses neither listing

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_en>` and `<card_jp>` are raw cards published to the staging store whose learned photos show the same art.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Point the camera at `<card_en>`; tap the label.
2. Close the sheet with its close control.
3. Point the camera at `<card_en>` again and read the label.

**Expected Results:**

* Step 2 closes the sheet and the camera view returns.
* Step 3 shows the chip counting 2 matches, not a chosen product.

<!-- trace:case id=g10.store-shelf-scanning.TC-6bi rev=1 covers=g10.store-shelf-scanning.SC-ftn -->
### g10.store-shelf-scanning.US1-TC19: A product with one close match shows without a pick

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
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, for sale, its photos learned.
* No other store product's photos show `<card_1>`'s art.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Point the camera at `<card_1>` and hold it steady.
2. Read the label over the card.
3. Tap the label.

**Expected Results:**

* Step 2 shows `<card_1>`'s title, price and availability chip.
* Step 2 shows no chip counting matches.
* Step 3 shows `<card_1>` alone, with no list to pick from.

<!-- trace:case id=g10.store-shelf-scanning.TC-9qu rev=2 covers=g10.store-shelf-scanning.SC-jar -->
### g10.store-shelf-scanning.US1-TC20: A raw copy of a card the store sells as slabs names the slab's product or offers the pick

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* The store sells `<raw copy>`'s card only as `<slabs>`, published to the staging store, each naming its inventory item, their photos learned.
* `<raw copy>` is an ungraded copy of that card, not in a slab.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<slabs>` | `<label>` | `<on tap>` |
| --- | --- | --- |
| one PSA slab, `<slab_1>` | `<slab_1>`'s title, price and availability chip, with no chip counting matches | `<slab_1>`'s product alone, with no list to pick from |
| two PSA slabs, `<slab_1>` and `<slab_2>`, at different prices | one title and price, and a chip counting 2 matches | a list of `<slab_1>`'s and `<slab_2>`'s products, each with title, price and availability |

**Steps:**

1. Point the camera at `<raw copy>` and hold it steady.
2. Read the label over the card.
3. Tap the label.

**Expected Results:**

* Step 2 shows `<label>`.
* Step 3 shows `<on tap>`.
* Neither step shows a grade or a cert.

<!-- trace:case id=g10.store-shelf-scanning.TC-4xj rev=2 covers=g10.store-shelf-scanning.SC-eqw -->
### g10.store-shelf-scanning.US1-TC21: An automatic discount that starts or ends reaches the scan within 6 minutes

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
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, for sale, recognised by the scanner.
* No automatic discount applies to `<card_1>`, and nothing about it changes in the shop during the case.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| discount | An automatic discount of 10% on `<card_1>`, needing no code |
| next pass | 360s (6mins): the store's next pass, from the save |

**Steps:**

1. In the staging shop's admin, start `<discount>`; note the time.
2. `<next pass>` after step 1's time, reload `<g10 scan link>`.
3. Point the camera at `<card_1>`.
4. In the staging shop's admin, end `<discount>`; note the time.
5. `<next pass>` after step 4's time, reload `<g10 scan link>`.
6. Point the camera at `<card_1>`.

**Expected Results:**

* Step 3's price is the price on file less 10%.
* Step 3 shows a Sale badge.
* Step 6's price is the price on file.
* Step 6 shows no Sale badge.

<!-- trace:case id=g10.store-shelf-scanning.TC-n0i rev=1 covers=g10.store-shelf-scanning.SC-j8j -->
### g10.store-shelf-scanning.US1-TC22: A product with more than 8 photos is learned from its first 8

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store with 9 photos, all showing its art but `<distinct photo>`.
* `<distinct photo>` shows an art no store product and no shared catalogue card shows.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<position>` | `<outcome>` |
| --- | --- |
| 8th, the last learned | names `<card_1>` |
| 9th, the first past the limit | shows the scanner's not-recognised message |

**Steps:**

1. In the staging shop's admin, move `<distinct photo>` to `<position>` in `<card_1>`'s photo order and save; note the time.
2. After the first hourly photo run that starts 360s (6mins) or more past the save, reload `<g10 scan link>`.
3. Point the camera at a print of `<distinct photo>`.
4. Point the camera at a print of `<card_1>`'s first photo.

**Expected Results:**

* Step 3 `<outcome>`.
* Step 4 names `<card_1>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-2z1 rev=1 -->
### g10.store-shelf-scanning.US1-TC23: A scan shows the title in the store's default language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, recognised by the scanner.
* `<card_1>`'s Traditional and Simplified Chinese titles each differ from its title in the store's default language.
* The phone's language is `<phone language>`.

**Test data:**

| `<phone language>` |
| --- |
| Traditional Chinese |
| Simplified Chinese |

**Steps:**

1. Open `<g10 scan link>` for staging on the phone.
2. Point the camera at `<card_1>`; read the title.
3. In the staging shop's admin, read `<card_1>`'s title.

**Expected Results:**

* Step 2's title is step 3's title.

<!-- trace:case id=g10.store-shelf-scanning.TC-30a rev=2 -->
### g10.store-shelf-scanning.US1-TC24: A raw card beside a slab of the same art offers the pick without grade or cert

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
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* `<card_raw>` is a raw card and `<slab_1>` a PSA slab of the same card, both published to the staging store, for sale, at different prices.
* `<slab_1>` names its inventory item, which carries a grade and cert.
* Both products' photos show the same art and are learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Point the camera at `<card_raw>` and hold it steady.
2. Read the label over the card.
3. Tap the label.
4. Read the sheet.
5. Tap `<slab_1>`'s row.

**Expected Results:**

* Step 2 shows one title and price, and a chip counting 2 matches.
* Step 2 shows no grade chip and no cert chip.
* Step 4 lists `<card_raw>` and `<slab_1>`, each with title, price and availability.
* Step 4's first row carries step 2's title and price.
* No row in step 4 shows a grade or a cert.
* Step 5 shows `<slab_1>` alone, with its title, price and availability, and no grade or cert.

<!-- trace:case id=g10.store-shelf-scanning.TC-dx2 rev=1 -->
### g10.store-shelf-scanning.US1-TC25: A pass with nothing changed in the shop publishes no new catalogue

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* Every product published to the staging store is held on the scanner, its photos learned.
* Nothing in the staging shop or inventory changes during the case.

**Test data:**

| Field | Value |
| --- | --- |
| two passes | 600s (10mins): two of the store's 5-minute passes |

**Steps:**

1. Read the version of the scanner's catalogue for the grade10 store; note the time.
2. `<two passes>` after step 1's time, read the version again.
3. Read the scanner's photo queue.

**Expected Results:**

* Step 2's version is step 1's.
* Step 3 holds no photo of a store product queued since step 1.

<!-- trace:case id=g10.store-shelf-scanning.TC-gu0 rev=1 -->
### g10.store-shelf-scanning.US1-TC26: The hourly photo run stops when its model differs from the scanner's

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-shelf-scanning.US1

**Pre-conditions:**

* The hourly photo run's model on staging differs from the scanner's.
* A new photo of `<card_1>`, a raw card published to the staging store, waits to be learned.

**Steps:**

1. Wait for the next hourly photo run on staging.
2. Read that run's record.

**Expected Results:**

* Step 2's run failed, naming the model mismatch, before preparing any photo to learn.
* Step 2's run learned no photo and rebuilt nothing.

---

## g10.store-shelf-scanning.US2: Shopkeeper opens a scanned product's store page

**As a** shopkeeper on the shop floor,
**I want** to open the store page of the product the scanner names,
**so that** I can show the customer its photos and details or help them buy
it online.

<!-- trace:case id=g10.store-shelf-scanning.TC-zzt rev=1 covers=g10.store-shelf-scanning.SC-t17,g10.store-shelf-scanning.SC-n6w,g10.store-shelf-scanning.SC-nae -->
### g10.store-shelf-scanning.US2-TC1: The store page link shows only where the store is carried

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US2

**Pre-conditions:**

* `<card_1>` is a raw card published to the `<environment>` store, recognised by the scanner.
* admin(shopkeeper) has `<g10 scan link>` for `<environment>` open on a phone.

**Test data:**

| `<environment>` | `<store carried>` | `<link>` |
| --- | --- | --- |
| staging | carried | shown, and opens `<card_1>`'s own page at `<grade10 store url>` |
| production | not carried | absent |

**Steps:**

1. Point the camera at `<card_1>`.
2. Look for the store page link on the scan.
3. Where shown, open the link.

**Expected Results:**

* Step 1 names `<card_1>` with title, price and availability.
* Step 2's link is `<link>`.
* Step 3 opens the page with no sign-in asked.

<!-- trace:case id=g10.store-shelf-scanning.TC-d64 rev=1 -->
### g10.store-shelf-scanning.US2-TC2: The store page link follows an address the shop changed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US2

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, recognised by the scanner.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| new handle | A product handle different from `<card_1>`'s on file, used by no other product |

**Steps:**

1. In the staging shop's admin, set `<card_1>`'s handle to `<new handle>`; note the time.
2. 360s (6mins) later, reload `<g10 scan link>`.
3. Point the camera at `<card_1>`.
4. Open the store page link.

**Expected Results:**

* Step 4 opens `<grade10 store url>/store/products/<new handle>`.
* Step 4's page is `<card_1>`'s.

<!-- trace:case id=g10.store-shelf-scanning.TC-fp5 rev=1 -->
### g10.store-shelf-scanning.US2-TC3: The store page link of a picked listing opens that listing

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
* **Trace:** g10.store-shelf-scanning.US2

**Pre-conditions:**

* `<card_en>` and `<card_jp>` are raw cards published to the staging store, at different prices, whose learned photos show the same art.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Point the camera at `<card_en>`; tap the label.
2. Tap `<card_jp>`'s row on the sheet.
3. Open the store page link on the sheet.
4. Read the title and price on the page.

**Expected Results:**

* Step 3 opens `<card_jp>`'s own page at `<grade10 store url>`, not `<card_en>`'s.
* Step 4's title and price match `<card_jp>`'s row.

---

## g10.store-shelf-scanning.US3: Shopkeeper scans a slab and sees its own listing

**As a** shopkeeper on the shop floor,
**I want** the scanner, reading a slab's label, to name the one store product
that sells that slab, with its grade and cert,
**so that** I quote the price of the copy in my hand, not another copy of the
same card.

<!-- trace:case id=g10.store-shelf-scanning.TC-4dg rev=1 covers=g10.store-shelf-scanning.SC-qhd -->
### g10.store-shelf-scanning.US3-TC1: A slab's label names its own product with grade and cert

Runs once per row of **Test data**.

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
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* The store lists two slabs of one card, `<slab_1>` and `<slab_2>`, at different prices.
* `<slab_1>` is `<kind>`, and its inventory item carries a PSA grade and cert.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<kind>` |
| --- |
| a consigned slab |
| a house-stock slab whose product carries its label code |

**Steps:**

1. Point the camera at `<slab_1>`'s label.
2. Read the scan.

**Expected Results:**

* Step 2 names `<slab_1>`'s product, not `<slab_2>`'s.
* Step 2's price is `<slab_1>`'s.
* Step 2's grade and cert match `<slab_1>`'s inventory item.

<!-- trace:case id=g10.store-shelf-scanning.TC-06a rev=1 -->
### g10.store-shelf-scanning.US3-TC2: Each grader the scanner reads names the slab's product

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab>` is published to the staging store and names its inventory item.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<slab>` |
| --- |
| A PSA slab |
| A BGS slab |
| A CGC slab |
| An SGC slab |
| A TAG slab |

**Steps:**

1. Point the camera at `<slab>`'s label.
2. Read the scan.

**Expected Results:**

* Step 2 names `<slab>`'s product.
* Step 2 shows the grade and cert of `<slab>`'s inventory item.

<!-- trace:case id=g10.store-shelf-scanning.TC-8bk rev=1 covers=g10.store-shelf-scanning.SC-j9i -->
### g10.store-shelf-scanning.US3-TC3: A slab of a grader the scanner does not read is recognised by its photos

Runs once per row of **Test data**.

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
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab>` is published to the staging store, names its inventory item, and its photos are learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<slab>` |
| --- |
| A PCGS slab |
| An NGC slab |

**Steps:**

1. Point the camera at `<slab>` and hold it steady.
2. Read the scan.
3. Open the Datadog monitor on `store.shelf_scan.unit_missing`.
4. Search the store's Datadog logs from its last pass for `<slab>`'s product.

**Expected Results:**

* Step 2 names `<slab>`'s product, with title, price and availability.
* Step 2 shows no grade and no cert.
* Step 3's monitor is raised.
* Step 4's log names `<slab>`'s product as held without a unit.

<!-- trace:case id=g10.store-shelf-scanning.TC-jz1 rev=1 covers=g10.store-shelf-scanning.SC-6to -->
### g10.store-shelf-scanning.US3-TC4: Two products carrying one cert both lose grade and cert

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab_a>` and `<slab_b>` are published to the staging store, each naming an inventory item with the same PSA cert.
* Both products' photos are learned, each showing a different card's art.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Point the camera at the label of the slab carrying that cert.
2. Point the camera at `<slab_a>`'s front and hold it steady.
3. Point the camera at `<slab_b>`'s front and hold it steady.
4. Open the Datadog monitor on `store.shelf_scan.unit_missing`.
5. Search the store's Datadog logs from its last pass for both products.

**Expected Results:**

* Step 1 names neither product by the label.
* Step 2 names `<slab_a>` with no grade and no cert.
* Step 3 names `<slab_b>` with no grade and no cert.
* Step 4's monitor is raised.
* Step 5's log names both products as held without a unit.

<!-- trace:case id=g10.store-shelf-scanning.TC-f0a rev=1 covers=g10.store-shelf-scanning.SC-y2o -->
### g10.store-shelf-scanning.US3-TC5: A grade corrected in inventory reaches the scanner

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab_1>` is a consigned PSA slab published to the staging store, recognised by its label.
* Nothing about `<slab_1>`'s product changes in the shop during the case.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| new grade | A grade different from `<slab_1>`'s inventory item on file |
| next pass | 360s (6mins): the store's pass, which reads inventory every time |

**Steps:**

1. In inventory, set `<slab_1>`'s item grade to `<new grade>`; note the time.
2. `<next pass>` after step 1's time, reload `<g10 scan link>`.
3. Point the camera at `<slab_1>`'s label.

**Expected Results:**

* Step 3 names `<slab_1>`'s product with `<new grade>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-i60 rev=2 covers=g10.store-shelf-scanning.SC-owc -->
### g10.store-shelf-scanning.US3-TC6: A slab read by its label never offers a pick

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab_1>` and `<slab_2>` are PSA slabs of one card published to the staging store, each naming its inventory item.
* `<card_raw>` is a raw card of the same card published to the staging store.
* All three products' photos show the same art and are learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Point the camera at `<slab_1>`'s label.
2. Read the label over the slab.
3. Tap the label.

**Expected Results:**

* Step 2 names `<slab_1>`'s product, with a grade chip and a cert chip matching `<slab_1>`'s inventory item.
* Step 2 shows no chip counting matches.
* Step 3 shows `<slab_1>`'s product alone, with its grade and cert, and no list to pick from.

<!-- trace:case id=g10.store-shelf-scanning.TC-esc rev=2 covers=g10.store-shelf-scanning.SC-2ly -->
### g10.store-shelf-scanning.US3-TC7: A slab whose cert the scanner cannot read is recognised by its photos

Runs once per row of **Test data**.

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
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab_1>` is a PSA slab published to the staging store, naming its inventory item, its photos learned.
* `<slab_1>`'s inventory item carries `<unreadable cert>`.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<unreadable cert>` |
| --- |
| A PSA cert of 25 digits, one past the longest the scanner reads |
| A PSA cert of 3 digits, one short of the shortest the scanner reads |
| A PSA cert of 8 digits with a slash among them |

**Steps:**

1. Point the camera at `<slab_1>`'s front and hold it steady.
2. Read the scan.
3. Open the Datadog monitor on `store.shelf_scan.unit_missing`.
4. Search the store's Datadog logs from its last pass for `<slab_1>`'s product.

**Expected Results:**

* Step 2 names `<slab_1>`'s product, with title, price and availability.
* Step 2 shows no grade and no cert.
* Step 3's monitor is raised.
* Step 4's log names `<slab_1>`'s product as held without a unit.

<!-- trace:case id=g10.store-shelf-scanning.TC-hjq rev=2 -->
### g10.store-shelf-scanning.US3-TC8: Two slabs of one card matched by their photos are both offered without grade or cert

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab_1>` and `<slab_2>` are `<slabs>` of one card published to the staging store, at different prices, each naming its inventory item.
* Both products' photos show the same art and are learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<slabs>` | `<view>` |
| --- | --- |
| PSA slabs | `<slab_1>`'s front with its label covered |
| PCGS slabs | `<slab_1>`'s front, label in view |

**Steps:**

1. Point the camera at `<view>` and hold it steady.
2. Read the label over the slab.
3. Tap the label.
4. Read the sheet.

**Expected Results:**

* Step 2 shows one title and price, and a chip counting 2 matches.
* Step 2 shows no grade chip and no cert chip.
* Step 4 lists `<slab_1>` and `<slab_2>`, each with title, price and availability.
* Step 4's first row carries step 2's title and price.
* No row in step 4 shows a grade or a cert.

<!-- trace:case id=g10.store-shelf-scanning.TC-1jq rev=1 -->
### g10.store-shelf-scanning.US3-TC9: A graded product naming no inventory item is recognised by its photos

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
* **Trace:** g10.store-shelf-scanning.US3

**Pre-conditions:**

* `<slab_house>`'s product is a house-stock slab published to the staging store, its collectible type a graded one.
* `<slab_house>`'s product names no inventory item: no label code is written on it.
* `<slab_house>`'s photos are learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Point the camera at `<slab_house>`'s front and hold it steady.
2. Read the scan.
3. Open the Datadog monitor on `store.shelf_scan.unit_missing`.
4. Search the store's Datadog logs from its last pass for `<slab_house>`'s product.

**Expected Results:**

* Step 2 names `<slab_house>`'s product, with title, price and availability.
* Step 2 shows no grade and no cert.
* Step 3's monitor is raised.
* Step 4's log names `<slab_house>`'s product as held without a unit.

---

## g10.store-shelf-scanning.US4: Shopkeeper scans a sold-out product and is told it is sold out

**As a** shopkeeper on the shop floor,
**I want** a product the store has sold out of to still be named, and to read
Sold out as soon as the store does,
**so that** I can tell a customer it is gone rather than that the scanner does
not know it.

<!-- trace:case id=g10.store-shelf-scanning.TC-1jf rev=1 covers=g10.store-shelf-scanning.SC-c6s -->
### g10.store-shelf-scanning.US4-TC1: A product the shop stops selling still names and reads Sold out

Runs once per row of **Test data**.

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
* **Trace:** g10.store-shelf-scanning.US4

**Pre-conditions:**

* `<product>` is published to the staging store, for sale, recognised by the scanner.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<product>` | `<stock change>` | `<availability>` |
| --- | --- | --- |
| A raw card the shop stops selling at zero | Set its only variant's count to 0 | Sold out |
| A house-stock slab the shop stops selling at zero | Set its only variant's count to 0 | Sold out |
| A raw card the shop keeps selling past zero | Set its only variant's count to 0 | Available |

**Steps:**

1. In the staging shop's admin, `<stock change>` on `<product>`; note the time.
2. 360s (6mins) later, reload `<g10 scan link>`.
3. Point the camera at `<product>`.
4. Open `<product>`'s page at `<grade10 store url>`.

**Expected Results:**

* Step 3 names `<product>` and reads `<availability>`, with no count.
* Step 3's price is the price on file.
* Step 4's purchase area reads `<availability>`.

<!-- trace:case id=g10.store-shelf-scanning.TC-5zg rev=1 covers=g10.store-shelf-scanning.SC-2r0 -->
### g10.store-shelf-scanning.US4-TC2: A product brought back reads Available again

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US4

**Pre-conditions:**

* `<card_1>` is a raw card published to the staging store, sold out, recognised by the scanner and reading Sold out.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. In the staging shop's admin, set `<card_1>`'s variant count to 1; note the time.
2. 360s (6mins) later, reload `<g10 scan link>`.
3. Point the camera at `<card_1>`.

**Expected Results:**

* Step 3 names `<card_1>` and reads Available, with no count.

<!-- trace:case id=g10.store-shelf-scanning.TC-bzc rev=1 covers=g10.store-shelf-scanning.SC-9xz -->
### g10.store-shelf-scanning.US4-TC3: A sold consigned slab leaves rather than reading Sold out

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-shelf-scanning.US4

**Pre-conditions:**

* `<slab_1>` is a consigned PSA slab published to the staging store, recognised by its label.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Steps:**

1. Buy `<slab_1>` through the staging store's checkout; note the time.
2. Once the store no longer lists `<slab_1>`, wait 360s (6mins) and reload `<g10 scan link>`.
3. Point the camera at `<slab_1>`'s label.

**Expected Results:**

* Step 3 does not name `<slab_1>`'s product.
* Step 3 shows no Sold out for `<slab_1>`'s product.

---

## g10.store-shelf-scanning.US7: Shopkeeper opens the scanner from the shop's link

**As a** shopkeeper,
**I want** to open the scanner from one link the shop keeps bookmarked or
printed,
**so that** I can start scanning without signing in.

<!-- trace:case id=g10.store-shelf-scanning.TC-htc rev=1 covers=g10.store-shelf-scanning.SC-jxn -->
### g10.store-shelf-scanning.US7-TC1: The shop's link opens the scanner without signing in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US7

**Pre-conditions:**

* The phone is signed in to nothing and is outside the team's Cloudflare Access.
* `<card_1>` is a raw card published to the `<environment>` store, its photos learned.

**Test data:**

| `<environment>` | `<way in>` |
| --- | --- |
| staging | The bookmarked `<g10 scan link>` |
| staging | The printed QR code of `<g10 scan link>` |
| production | The bookmarked `<g10 scan link>` |

**Steps:**

1. Open the scanner by `<way in>`.
2. Allow the camera.
3. Point the camera at `<card_1>`.

**Expected Results:**

* Step 1 opens the scanner at the site's `/scan`, with no sign-in asked.
* Step 3 names `<card_1>` from the `<environment>` store.

<!-- trace:case id=g10.store-shelf-scanning.TC-foj rev=2 -->
### g10.store-shelf-scanning.US7-TC2: The shop's link scans but cannot add photos

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US7

**Pre-conditions:**

* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.
* `<card_1>` is a raw card published to the staging store, recognised by the scanner.

**Test data:**

| Field | Value |
| --- | --- |
| link key | The key in `<g10 scan link>` for staging |
| new photo | A photo of `<card_1>`'s art the scanner does not hold |

**Steps:**

1. Point the camera at `<card_1>`.
2. Look over the scan and every control the scanner offers.
3. Send the scanner `<new photo>` for `<card_1>`'s item with `<link key>`.
4. Read the API response.
5. Read the scanner's photos for `<card_1>`'s item.

**Expected Results:**

* Step 1 names `<card_1>`.
* Step 2 finds no control that adds or replaces a photo.
* Step 4 refuses the photo.
* Step 5 shows `<card_1>`'s photos unchanged.

<!-- trace:case id=g10.store-shelf-scanning.TC-dci rev=2 -->
### g10.store-shelf-scanning.US7-TC4: A scan shows nothing the store page does not

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US7

**Pre-conditions:**

* `<product>` is published to the staging store, recognised by the scanner.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| `<product>` |
| --- |
| A raw card with a count of 7 for sale |
| A raw card with a count of 0, sold out |
| A raw card with a count of 7 under a running automatic discount |
| A house-stock PSA slab with a count of 1, scanned by its label |

**Steps:**

1. Point the camera at `<product>`, at its label where it is a slab.
2. Read every value the scan shows.
3. Open `<product>`'s page at `<grade10 store url>`.

**Expected Results:**

* Step 2 shows no stock count.
* Each value at step 2 but grade, cert and Sale badge reads on the page at step 3.

<!-- trace:case id=g10.store-shelf-scanning.TC-w7l rev=2 covers=g10.store-shelf-scanning.SC-3yv -->
### g10.store-shelf-scanning.US7-TC5: Rotating the scanner's key retires the old link

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-shelf-scanning.US7

**Pre-conditions:**

* `<old link>` is `<g10 scan link>` for staging under its current key, bookmarked on a phone.
* `<card_1>` is a raw card published to the staging store, recognised by the scanner.

**Test data:**

| Field | Value |
| --- | --- |
| unknown key link | `<g10 scan link>` for staging with its key replaced by a value the scanner never issued |

**Steps:**

1. Rotate the staging scanner's key.
2. Open `<old link>` on the phone.
3. Open `<unknown key link>` on the phone.
4. As admin(shopkeeper), scan the new QR code admin(shop manager) hands out.
5. Point the camera at `<card_1>`.

**Expected Results:**

* Step 2 does not open a working scanner.
* Step 2 shows the same refusal as step 3.
* Step 4 opens the scanner with no sign-in asked.
* Step 5 names `<card_1>`.

---

## g10.store-shelf-scanning.US6: Stock keeper names the inventory item a house-stock slab's product sells

**As a** stock keeper on the shop's staff,
**I want** to write the slab's label code on the house-stock product that
sells it,
**so that** the scanner names that product, with its grade and cert, when a
shopkeeper scans that slab.

<!-- trace:case id=g10.store-shelf-scanning.TC-auf rev=1 covers=g10.store-shelf-scanning.SC-l0k -->
### g10.store-shelf-scanning.US6-TC1: A label code on a house-stock product names it on the scanner

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
* **Trace:** g10.store-shelf-scanning.US6

**Pre-conditions:**

* `<slab_house>` is a house-stock PSA slab registered in inventory, carrying `<label code>`.
* `<slab_house>`'s product is published to the staging store with no label code written.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| label code | The label code of `<slab_house>`'s inventory item |
| label code field | The product metafield `custom.slab_label_code` |

**Steps:**

1. As admin(stock keeper), in the staging shop's admin, open `<slab_house>`'s product.
2. Write `<label code>` in `<label code field>` and save; note the time.
3. 360s (6mins) later, as admin(shopkeeper), reload `<g10 scan link>`.
4. Point the camera at `<slab_house>`'s label.

**Expected Results:**

* Step 4 names `<slab_house>`'s product.
* Step 4 shows the grade and cert of `<slab_house>`'s inventory item.

<!-- trace:case id=g10.store-shelf-scanning.TC-nhw rev=1 -->
### g10.store-shelf-scanning.US6-TC2: A label code no inventory item carries leaves the slab without grade or cert

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
* **Trace:** g10.store-shelf-scanning.US6

**Pre-conditions:**

* `<slab_house>`'s product is a house-stock slab published to the staging store, its photos learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| unknown code | A label code no inventory item carries |
| label code field | The product metafield `custom.slab_label_code` |

**Steps:**

1. As admin(stock keeper), in the staging shop's admin, write `<unknown code>` in `<slab_house>`'s `<label code field>` and save.
2. 360s (6mins) later, as admin(shopkeeper), reload `<g10 scan link>`.
3. Point the camera at `<slab_house>`'s front and hold it steady.
4. Open the Datadog monitor on `store.shelf_scan.unit_missing`.
5. Search the store's Datadog logs from its last pass for `<slab_house>`'s product.

**Expected Results:**

* Step 3 names `<slab_house>`'s product with no grade and no cert.
* Step 4's monitor is raised.
* Step 5's log names `<slab_house>`'s product as held without a unit.

<!-- trace:case id=g10.store-shelf-scanning.TC-ff9 rev=1 covers=g10.store-shelf-scanning.SC-6to -->
### g10.store-shelf-scanning.US6-TC3: A label code another product already names leaves both without grade or cert

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US6

**Pre-conditions:**

* `<slab_a>` is a house-stock slab's product published to the staging store, carrying `<label code>` and recognised by its label.
* `<slab_b>` is another house-stock slab's product published to the staging store with no label code, its photos learned.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| label code | The label code of `<slab_a>`'s inventory item |
| label code field | The product metafield `custom.slab_label_code` |

**Steps:**

1. As admin(stock keeper), in the staging shop's admin, write `<label code>` in `<slab_b>`'s `<label code field>` and save.
2. 360s (6mins) later, as admin(shopkeeper), reload `<g10 scan link>`.
3. Point the camera at `<slab_a>`'s label.
4. Point the camera at `<slab_a>`'s front and hold it steady.
5. Point the camera at `<slab_b>`'s front and hold it steady.
6. Open the Datadog monitor on `store.shelf_scan.unit_missing`.
7. Search the store's Datadog logs from its last pass for both products.

**Expected Results:**

* Step 3 names neither product by the label.
* Step 4 names `<slab_a>` with no grade and no cert.
* Step 5 names `<slab_b>` with no grade and no cert.
* Step 6's monitor is raised.
* Step 7's log names both products as held without a unit.

<!-- trace:case id=g10.store-shelf-scanning.TC-wdb rev=1 -->
### g10.store-shelf-scanning.US6-TC4: Changing the label code moves the product to the new item

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-shelf-scanning.US6

**Pre-conditions:**

* `<slab_house>`'s product is published to the staging store, carrying `<old code>` and recognised by `<slab_old>`'s label.
* `<slab_new>` is a house-stock slab registered in inventory under `<new code>`, with a different grade and cert, named by no product.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| old code | The label code of `<slab_old>`'s inventory item |
| new code | The label code of `<slab_new>`'s inventory item |
| label code field | The product metafield `custom.slab_label_code` |

**Steps:**

1. As admin(stock keeper), in the staging shop's admin, replace `<old code>` with `<new code>` in `<slab_house>`'s `<label code field>` and save.
2. 360s (6mins) later, as admin(shopkeeper), reload `<g10 scan link>`.
3. Point the camera at `<slab_new>`'s label.
4. Point the camera at `<slab_old>`'s label.

**Expected Results:**

* Step 3 names `<slab_house>`'s product with `<slab_new>`'s grade and cert.
* Step 4 does not name `<slab_house>`'s product.

<!-- trace:case id=g10.store-shelf-scanning.TC-fjq rev=1 -->
### g10.store-shelf-scanning.US6-TC5: Correcting a label code restores grade and cert and clears the alert

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
* **Trace:** g10.store-shelf-scanning.US6

**Pre-conditions:**

* `<slab_house>`'s product is a house-stock slab published to the staging store, carrying `<unknown code>`.
* `<slab_house>`'s product is the only staging product held without a unit.
* The Datadog monitor on `store.shelf_scan.unit_missing` is raised.
* admin(shopkeeper) has `<g10 scan link>` for staging open on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| unknown code | A label code no inventory item carries |
| label code | The label code of `<slab_house>`'s inventory item |
| label code field | The product metafield `custom.slab_label_code` |

**Steps:**

1. As admin(stock keeper), in the staging shop's admin, replace `<unknown code>` with `<label code>` in `<slab_house>`'s `<label code field>` and save.
2. 360s (6mins) later, as admin(shopkeeper), reload `<g10 scan link>`.
3. Point the camera at `<slab_house>`'s label.
4. Open the Datadog monitor on `store.shelf_scan.unit_missing`.

**Expected Results:**

* Step 3 names `<slab_house>`'s product with its inventory item's grade and cert.
* Step 4's monitor is no longer raised.

## Reconciliation

**Run:** QA2 on 2026-10-13, in a fresh context, at source `3d61a7c4f`
against the anchors frozen at `1aa2f37f9`. The journeys and the domain suite
are unchanged since the freeze. One feature-set line changed after it:
`Following the store's mirror` moved from 5 and 10 minutes to 6 and 11
(Q35), so QA1's third blind pass re-read the outline with that line and
US1-TC2 and US1-TC3 moved to rev 3. Read the anchors, these 48 cases, the
domain suite, `spec.md` with its 43 scenarios, `decisions.md`, `ui-design.md`,
`tech-design.md`, `tasks.md` and the Shelf Scanning page. The scenarios
gained their `trace:scenario` markers in this run so cases can link them.

Every case traces a journey in scope, and every journey has a case. No case
is a misreading and none is dropped. 29 cases fully assert at least one
scenario and carry `covers`; 19 assert part of one, or behaviour no scenario
states, and carry none. 30 scenarios are covered and 13 are not.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| US1-TC1 | Partial: no row holds a sold-out first variant and a running discount together | `g10.store-shelf-scanning.SC25` partly; the both-sold-out row is the product page's first listed variant, which no scenario states |
| US1-TC2 | Partial: asserts the item at 6 minutes; the open scanner at 8 is US1-TC15's | `g10.store-shelf-scanning.SC8` partly |
| US1-TC3 | Partial: asserts the item at 11 minutes; the open scanner at 13 is US1-TC15's | `g10.store-shelf-scanning.SC9` partly |
| US1-TC4 | Covers; also asserts that drafts, other channels and the ZZZ store are not held, as the requirement states | `g10.store-shelf-scanning.SC1`, `g10.store-shelf-scanning.SC2`; `g10.store-shelf-scanning.SC18` partly, photos not asserted |
| US1-TC5 | Covers | `g10.store-shelf-scanning.SC4` |
| US1-TC6 | Covers | `g10.store-shelf-scanning.SC6` |
| US1-TC7 | Partial: another product changes in the same pass, so it cannot assert that no new version is published | `g10.store-shelf-scanning.SC7` partly |
| US1-TC8 | Partial: does not assert that no store page shows | `g10.store-shelf-scanning.SC10` partly; US2-TC1 covers it |
| US1-TC9 | Partial: does not assert the store's availability | `g10.store-shelf-scanning.SC17` partly |
| US1-TC10 | Covers | `g10.store-shelf-scanning.SC19` |
| US1-TC11 | Covers | `g10.store-shelf-scanning.SC20` |
| US1-TC12 | Covers | `g10.store-shelf-scanning.SC22` |
| US1-TC13 | Partial: asserts nothing learned or rebuilt, not that the run stops before preparing to learn | `g10.store-shelf-scanning.SC21` partly |
| US1-TC14 | Covers | `g10.store-shelf-scanning.SC23` |
| US1-TC15 | Covers the in-view route | `g10.store-shelf-scanning.SC29`; the open-scanner halves of `g10.store-shelf-scanning.SC8` and `g10.store-shelf-scanning.SC9` |
| US1-TC16 | Covers the return route | `g10.store-shelf-scanning.SC29` |
| US1-TC17 | Covers; the picked view does not assert the store page link | `g10.store-shelf-scanning.SC36`; `g10.store-shelf-scanning.SC37` partly |
| US1-TC18 | Covers | `g10.store-shelf-scanning.SC38` |
| US1-TC19 | Covers | `g10.store-shelf-scanning.SC35` |
| US1-TC20 | Covers with its one-slab row; the two-slab row is Q36's pick for a raw copy | `g10.store-shelf-scanning.SC39` |
| US1-TC21 | Covers | `g10.store-shelf-scanning.SC33` |
| US1-TC22 | Covers | `g10.store-shelf-scanning.SC40` |
| US1-TC23 | Real, stated by the requirement's Title row and Q24; no scenario states it | None |
| US1-TC24 | Partial: does not assert closest first | `g10.store-shelf-scanning.SC41` partly |
| US2-TC1 | Covers, staging row and production row | `g10.store-shelf-scanning.SC10`, `g10.store-shelf-scanning.SC27`, `g10.store-shelf-scanning.SC28` |
| US2-TC2 | Real, the store's copy decides every field; no scenario states a changed address | None |
| US2-TC3 | Partial: asserts the picked listing's link, not its availability | `g10.store-shelf-scanning.SC37` partly |
| US3-TC1 | Covers with its consigned row | `g10.store-shelf-scanning.SC11` |
| US3-TC2 | Real, stated by the requirement's Graders; no scenario names BGS, SGC or TAG | None |
| US3-TC3 | Covers | `g10.store-shelf-scanning.SC15` |
| US3-TC4 | Covers the shared-cert route | `g10.store-shelf-scanning.SC16` |
| US3-TC5 | Covers | `g10.store-shelf-scanning.SC13` |
| US3-TC6 | Covers | `g10.store-shelf-scanning.SC43` |
| US3-TC7 | Covers | `g10.store-shelf-scanning.SC34` |
| US3-TC8 | Partial: does not assert closest first | `g10.store-shelf-scanning.SC42` partly |
| US4-TC1 | Covers | `g10.store-shelf-scanning.SC3` |
| US4-TC2 | Covers with a count of 1; the return to Available is the requirement's | `g10.store-shelf-scanning.SC26` |
| US4-TC3 | Covers | `g10.store-shelf-scanning.SC5` |
| US7-TC1 | Covers | `g10.store-shelf-scanning.SC30` |
| US7-TC2 | Partial: the scanner offers no way; the service's refusal is US7-TC3's | `g10.store-shelf-scanning.SC31` partly |
| US7-TC3 | Partial: the service refuses; the scanner's controls are US7-TC2's | `g10.store-shelf-scanning.SC31` partly |
| US7-TC4 | Real, stated by the link requirement's "shows only what the store shows publicly" and Q13; no scenario states it | None |
| US7-TC5 | Covers | `g10.store-shelf-scanning.SC32` |
| US6-TC1 | Covers, with a PSA slab for the scenario's CGC | `g10.store-shelf-scanning.SC12` |
| US6-TC2 | Real, the No known unit row "Names no item"; its route writes an unknown code, not the graded product with none | None |
| US6-TC3 | Covers the shared-item route | `g10.store-shelf-scanning.SC16` |
| US6-TC4 | Real, the unit is the item whose code the product names; no scenario states a changed code | None |
| US6-TC5 | Real, Q28's monitor clears once none is held; no scenario states it | None |

| Scenario | Disposition |
| --- | --- |
| `g10.store-shelf-scanning.SC7` | Uncovered: US1-TC7 partly |
| `g10.store-shelf-scanning.SC8` | Uncovered: split between US1-TC2 and US1-TC15 |
| `g10.store-shelf-scanning.SC9` | Uncovered: split between US1-TC3 and US1-TC15 |
| `g10.store-shelf-scanning.SC14` | Uncovered: no case walks a graded product that names no item (Q32) |
| `g10.store-shelf-scanning.SC17` | Uncovered: US1-TC9 partly |
| `g10.store-shelf-scanning.SC18` | Uncovered: US1-TC4 partly |
| `g10.store-shelf-scanning.SC21` | Uncovered: US1-TC13 partly |
| `g10.store-shelf-scanning.SC24` | Uncovered: no case walks a run whose model differs |
| `g10.store-shelf-scanning.SC25` | Uncovered: US1-TC1 partly |
| `g10.store-shelf-scanning.SC31` | Uncovered: split between US7-TC2 and US7-TC3 |
| `g10.store-shelf-scanning.SC37` | Uncovered: split between US1-TC17 and US2-TC3 |
| `g10.store-shelf-scanning.SC41` | Uncovered: US1-TC24 partly |
| `g10.store-shelf-scanning.SC42` | Uncovered: US3-TC8 partly |
| Every other scenario | Covered by the cases above |

- **Contradiction, fixed** - `g10.store-dmn.TC-xk6` pointed the camera at a
  slab of a card listed as two slabs and expected its grade, cert and own
  page. Q36 settles that a slab whose label is not read is offered in the
  pick without grade or cert, so the step now points at the slab's label.
  The case moves to rev 2 and covers `g10.store-shelf-scanning.SC27`
- **Contradictions, none open** - no other case disagrees with a scenario,
  the Shelf Scanning page, `decisions.md` or `ui-design.md`
- **Over-claimed, none** - no case carried `covers` before this run, and
  every link added here is fully asserted
- **Raised, none** - every gap above is a case or scenario repair; nothing
  waits on a decision
- **Repairs owed to the cases** - US1-TC1 adds a running discount to the
  first row; US1-TC7 changes no product in its pass and reads the store
  collection's version; US1-TC9 asserts availability; US1-TC4 asserts the
  photos of the box, comic and merch rows; US1-TC13 asserts the run stops
  before preparing to learn; US1-TC15 reads the scanner's item at 6 and 11
  minutes; US1-TC17 asserts the picked view's store page link; US1-TC24 and
  US3-TC8 assert that the sheet's first row is the label's product; a case
  walks `g10.store-shelf-scanning.SC14`, and one walks
  `g10.store-shelf-scanning.SC24` or names its verifier as Out of suite
- **Repairs owed to the scenarios** - `g10.store-shelf-scanning.SC31` asks
  for a check in the scanner and one in the service; split it, or join
  US7-TC2 and US7-TC3. Fold a scenario for each real behaviour above that
  none states, or leave its case without `covers`
- **Tasks** - every scenario but `g10.store-shelf-scanning.SC30` is named by
  a tests task; task 8.1 walks US7 on a phone outside Access, which should
  name `g10.store-shelf-scanning.SC30`. Each group has tests before code and a
  verify step, and group 8 is the end-to-end walk of all six journeys
