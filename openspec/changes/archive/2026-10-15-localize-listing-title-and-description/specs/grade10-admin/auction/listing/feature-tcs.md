# grade10-admin/auction/listing Test Cases

**Status:** pending-review · 0/22
**Drafts styled:** 2026-10-14, tcs-rules r5
**Out of suite:** grade10-admin-auction-listing-SC-176 - the listing service's save test, task 2.1 in `tasks.md`, because the editor always names the translations it holds and no route in the console sends an omitted object; grade10-admin-auction-listing-SC-177 - the same test, which saves a named object that holds fewer languages than the stored one; grade10-admin-auction-listing-SC-200, grade10-admin-auction-listing-SC-201 and grade10-admin-auction-listing-SC-202 - the Labs seed tests of task 2.8, because the Labs are a local developer panel the suite does not walk; grade10-admin-auction-listing-SC-203, grade10-admin-auction-listing-SC-204, grade10-admin-auction-listing-SC-205 and grade10-admin-auction-listing-SC-206 - the customer view tests of task 4.6, added after the blind pass; they stay without a case until QA2 or human review writes one; grade10-admin-auction-listing-SC-207 and grade10-admin-auction-listing-SC-208 - the Copy block tests of task 4.1, added after the blind pass

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As an** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

<!-- trace:case id=g10adm.auction-listing.TC-nsg rev=1 covers=g10adm.auction-listing.SC-17a -->
### g10adm.auction-listing.US3-TC30: A draft may start from a Chinese title, but Create needs the English one

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
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_7>` is a draft with every other field Create needs, a Traditional Chinese title and no English title.

**Test data:**

| Field | Value |
| --- | --- |
| listing_7 | A draft with a product, quantity, starting price, slug, window, media and Traditional Chinese title `<traditional title>`, English title empty |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |

**Steps:**

1. Open `<listing_7>`.
2. Click Save.
3. Reload `<listing_7>`.
4. Click Create.
5. Reload `<listing_7>`.
6. Enter `<english title>` as the English title.
7. Click Create.

**Expected Results:**

* Step 2 saves the draft with no English title.
* Step 3 shows the Traditional Chinese title as entered and the English title empty.
* Step 4 refuses Create and names the English title.
* Step 5 shows `<listing_7>` still a draft.
* Step 7 creates the listing.

---

## grade10-admin-auction-listing-US9: Operator lists an unsold lot again

**As an** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

<!-- trace:case id=g10adm.auction-listing.TC-icj rev=1 -->
### g10adm.auction-listing.US9-TC10: Relist opens a draft carrying every written language

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_16>` closed Unsold, its stock is released and it holds `<texts written>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_16 | A listing that closed Unsold with English title `<english title>`, English description `<english description>` and `<texts written>` |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

| texts written |
| --- |
| English, Traditional Chinese and Simplified Chinese, title and description |
| English and Traditional Chinese only |

**Steps:**

1. Click Relist on the row of `<listing_16>`.
2. Read the title and description of each language on the new draft.
3. Click Save.
4. Reload the new draft.
5. Read the title and description of each language.
6. Open `<listing_16>` and read its texts.

**Expected Results:**

* Step 2 shows each text `<listing_16>` holds, in its own language.
* Step 2 shows each language `<listing_16>` left empty still empty.
* Step 5 shows the same texts as step 2.
* Step 6 shows `<listing_16>` unchanged.

---

## g10adm.auction-listing.US75: Operator writes a listing's title and description in each language

**As an** auction operator,
**I want** to enter a listing's title and description in Traditional and Simplified Chinese beside the English,
**so that** collectors who browse in those languages read the lot in their own.

<!-- trace:case id=g10adm.auction-listing.TC-oxb rev=1 covers=g10adm.auction-listing.SC-eo6 -->
### g10adm.auction-listing.US75-TC1: Operator writes all three languages on a listing and reads them back

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_1>` is a draft with a product, quantity, starting price and media, and an English title only.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A draft in USD whose English title is `<english title>` |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

**Steps:**

1. Open `<listing_1>` from Listings.
2. Enter `<english description>` as the English description.
3. Enter `<traditional title>` and `<traditional description>` as the Traditional Chinese title and description.
4. Enter `<simplified title>` and `<simplified description>` as the Simplified Chinese title and description.
5. Click Save.
6. Reload `<listing_1>`.
7. Read the title and description of each language on the form.

**Expected Results:**

* Step 5 saves the draft.
* Step 7 shows the English title and description as entered.
* Step 7 shows the Traditional Chinese title and description as entered.
* Step 7 shows the Simplified Chinese title and description as entered.

<!-- trace:case id=g10adm.auction-listing.TC-foq rev=1 covers=g10adm.auction-listing.SC-ze7 -->
### g10adm.auction-listing.US75-TC2: English alone is enough to create a listing

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_2>` is a draft with every field Create needs and an English title, and no Traditional or Simplified Chinese text.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2 | A draft in USD with an English title, a product, quantity, starting price, slug, window and media |

**Steps:**

1. Open `<listing_2>` from Listings.
2. Click Create.
3. Reload `<listing_2>`.
4. Read the title and description of each language on the form.

**Expected Results:**

* Step 2 creates the listing.
* Step 4 shows the English title as entered.
* Step 4 shows the Traditional Chinese title and description empty.
* Step 4 shows the Simplified Chinese title and description empty.

<!-- trace:case id=g10adm.auction-listing.TC-i3w rev=1 -->
### g10adm.auction-listing.US75-TC3: Translation at the length limits is accepted

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_1>` is a draft with an English title and no Traditional or Simplified Chinese text.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A draft in USD whose English title is `<english title>` |
| english title | Charizard PSA 10 |

| language | title text | description text |
| --- | --- | --- |
| Traditional Chinese | 200 Chinese characters (the title limit) | 4000 characters (the description limit) |
| Simplified Chinese | 1 Chinese character (the lower bound) | 1 character (any text under the limit) |

**Steps:**

1. Open `<listing_1>`.
2. Enter `<title text>` as the title and `<description text>` as the description of `<language>`.
3. Click Save.
4. Reload `<listing_1>`.
5. Read the title and description of `<language>`.

**Expected Results:**

* Step 3 saves the draft.
* Step 5 shows `<title text>` with every character kept.
* Step 5 shows `<description text>` with every character kept.

<!-- trace:case id=g10adm.auction-listing.TC-56j rev=1 -->
### g10adm.auction-listing.US75-TC4: Translation beyond the length limits is refused

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_1>` is a draft with an English title and no Traditional or Simplified Chinese text.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A draft in USD whose English title is `<english title>` |
| english title | Charizard PSA 10 |

| field | text | why refused |
| --- | --- | --- |
| Traditional Chinese title | 201 Chinese characters | One above the 200 limit |
| Simplified Chinese title | 200 Chinese characters followed by 1 space | The limit counts the characters as typed, so the space makes 201 |
| Traditional Chinese description | 4001 characters | One above the 4,000 limit |
| Simplified Chinese description | 3999 characters followed by 2 spaces | The limit counts the characters as typed, so the spaces make 4001 |

**Steps:**

1. Open `<listing_1>`.
2. Enter `<text>` in `<field>`.
3. Click Save.
4. Reload `<listing_1>`.
5. Read `<field>`.

**Expected Results:**

* Step 3 refuses the save and names `<field>`.
* Step 5 shows `<field>` empty.

<!-- trace:case id=g10adm.auction-listing.TC-hhy rev=1 covers=g10adm.auction-listing.SC-i3e -->
### g10adm.auction-listing.US75-TC5: Blank translation counts as not written

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_3>` is a draft with an English title and description and a written Traditional Chinese title and description.

**Test data:**

| Field | Value |
| --- | --- |
| listing_3 | A draft in USD with `<english title>`, `<english description>`, `<traditional title>` and `<traditional description>` |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

| field | input |
| --- | --- |
| Traditional Chinese title | Cleared to empty |
| Traditional Chinese title | 3 spaces |
| Traditional Chinese description | 3 spaces |

**Steps:**

1. Open `<listing_3>`.
2. Set `<field>` to `<input>`.
3. Click Save.
4. Reload `<listing_3>`.
5. Open the Copy block and choose Traditional Chinese.

**Expected Results:**

* Step 3 saves the draft.
* Step 5 shows the English text for `<field>`, marked as the fallback.
* Step 5 shows the other Traditional Chinese text still as written, not marked.

<!-- trace:case id=g10adm.auction-listing.TC-kvr rev=1 -->
### g10adm.auction-listing.US75-TC6: Translated title is trimmed on save

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_1>` is a draft with an English title and no Traditional Chinese text.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A draft in USD whose English title is `<english title>` |
| english title | Charizard PSA 10 |
| padded title | 2 spaces, `<traditional title>`, 2 spaces |
| traditional title | 寶可夢 噴火龍 PSA 10 |

**Steps:**

1. Open `<listing_1>`.
2. Enter `<padded title>` as the Traditional Chinese title.
3. Click Save.
4. Reload `<listing_1>`.
5. Read the Traditional Chinese title.

**Expected Results:**

* Step 3 saves the draft.
* Step 5 shows the title without its leading and trailing spaces.

<!-- trace:case id=g10adm.auction-listing.TC-adp rev=1 -->
### g10adm.auction-listing.US75-TC7: Translation can be edited on a draft, created or published listing

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_4>` is in status `<status>` and holds a written Traditional Chinese title.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | A listing in status `<status>` with English title `<english title>` and Traditional Chinese title `<traditional title>` |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| new traditional title | 寶可夢 噴火龍 初版 PSA 10 (any text under the 200 limit) |

| status |
| --- |
| Draft |
| Created |
| Published |

**Steps:**

1. Open `<listing_4>`.
2. Replace the Traditional Chinese title with `<new traditional title>`.
3. Click Save.
4. Reload `<listing_4>`.
5. Read the Traditional Chinese title.

**Expected Results:**

* Step 3 saves the edit.
* Step 5 shows `<new traditional title>`.
* Step 5 shows `<listing_4>` still in status `<status>`.

<!-- trace:case id=g10adm.auction-listing.TC-49e rev=1 covers=g10adm.auction-listing.SC-55h -->
### g10adm.auction-listing.US75-TC8: Writing a translated title leaves the slug and listing code alone

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_5>` is a saved draft whose slug is still the generated value from its English title and code.

**Test data:**

| Field | Value |
| --- | --- |
| listing_5 | A saved draft with English title `<english title>` and the generated slug, unchanged by the operator |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |

**Steps:**

1. Open `<listing_5>` and note its slug and listing code.
2. Enter `<traditional title>` as the Traditional Chinese title.
3. Click Save.
4. Reload `<listing_5>`.
5. Read the slug and listing code.
6. Read the row for `<listing_5>` in Listings.

**Expected Results:**

* Step 5 shows the slug unchanged.
* Step 5 shows the listing code unchanged.
* Step 6 reads the English title.

<!-- trace:case id=g10adm.auction-listing.TC-le3 rev=1 covers=g10adm.auction-listing.SC-kzb -->
### g10adm.auction-listing.US75-TC9: Closed, settled and called-off listings offer no translation controls

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_6>` is in status `<status>` and holds a Traditional Chinese title.

**Test data:**

| Field | Value |
| --- | --- |
| listing_6 | A listing in status `<status>` with English title `<english title>` and Traditional Chinese title `<traditional title>` |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |

| status |
| --- |
| Closed |
| Settled |
| Called off |

**Steps:**

1. Open `<listing_6>`.
2. Look for inputs to edit the Traditional Chinese and Simplified Chinese title and description.

**Expected Results:**

* Step 2 shows no input to edit a translation.
* Step 2 shows no edit control for the English title or description either.
* The Traditional Chinese title is unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-cfb rev=1 covers=g10adm.auction-listing.SC-21e -->
### g10adm.auction-listing.US75-TC10: A translation write to a frozen listing is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(auction operator) is signed in.
* `<listing_6>` is in status `<status>` and holds a Traditional Chinese title.

**Test data:**

| Field | Value |
| --- | --- |
| listing_6 | A listing in status `<status>` with English title `<english title>` and Traditional Chinese title `<traditional title>` |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| new traditional title | 寶可夢 噴火龍 初版 PSA 10 |

| status |
| --- |
| Closed |
| Settled |
| Called off |

**Steps:**

1. Send an update to `<listing_6>` that sets the Traditional Chinese title to `<new traditional title>`.
2. Read `<listing_6>` through the API.

**Expected Results:**

* Step 1 is refused.
* Step 2 shows the Traditional Chinese title unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-sp9 rev=1 -->
### g10adm.auction-listing.US75-TC11: An admin who cannot edit a listing's texts cannot write translations

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-75

**Pre-conditions:**

* admin(can view listings but cannot edit a listing's title and description) is on `<grade10 auction admin listings url>`.
* `<listing_4>` is a draft with an English title.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | A draft with English title `<english title>` |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |

**Steps:**

1. Open `<listing_4>`.
2. Look for inputs to edit the Traditional Chinese and Simplified Chinese title and description.
3. Send an update to `<listing_4>` that sets the Traditional Chinese title to `<traditional title>`.

**Expected Results:**

* Step 2 shows no input to edit a translation.
* Step 3 is refused.
* `<listing_4>` holds no Traditional Chinese title.

---

## g10adm.auction-listing.US76: Operator reads a listing's texts in each language

**As an** auction operator,
**I want** to switch the listing's Copy block between languages and see which ones I have not written,
**so that** I can check what each collector will read and fill the gaps.

<!-- trace:case id=g10adm.auction-listing.TC-v7h rev=1 covers=g10adm.auction-listing.SC-z8j -->
### g10adm.auction-listing.US76-TC1: Copy block switches title and description together and opens in English again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_8>` is a listing with all three languages written.

**Test data:**

| Field | Value |
| --- | --- |
| listing_8 | A listing with `<english title>`, `<english description>`, `<traditional title>`, `<traditional description>`, `<simplified title>` and `<simplified description>` |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |
| simplified title | 宝可梦 喷火龙 PSA 10 |
| simplified description | 1999 年基本系列，正面无瑕。 |

**Steps:**

1. Open `<listing_8>`.
2. Read the title and description in the Copy block.
3. Choose Traditional Chinese in the Copy block's language choice.
4. Read the title and description.
5. Choose Simplified Chinese.
6. Read the title and description.
7. Reload `<listing_8>`.
8. Read the language the Copy block shows.

**Expected Results:**

* Step 2 shows the English title and description, with no fallback mark.
* Step 4 shows the Traditional Chinese title and description together, with no fallback mark.
* Step 6 shows the Simplified Chinese title and description together, with no fallback mark.
* Step 8 shows the Copy block in English again.

<!-- trace:case id=g10adm.auction-listing.TC-x3s rev=1 covers=g10adm.auction-listing.SC-jiz -->
### g10adm.auction-listing.US76-TC2: A language missing one text marks only that text as the fallback

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
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_9>` is a listing with a Traditional Chinese title and no Traditional Chinese description.

**Test data:**

| Field | Value |
| --- | --- |
| listing_9 | A listing with `<english title>`, `<english description>` and `<traditional title>`; no Traditional Chinese description |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

**Steps:**

1. Open `<listing_9>`.
2. Choose Traditional Chinese in the Copy block's language choice.
3. Read the title.
4. Read the description.

**Expected Results:**

* Step 3 shows `<traditional title>`, not marked as the fallback.
* Step 4 shows `<english description>`, marked as the fallback.

<!-- trace:case id=g10adm.auction-listing.TC-7oa rev=1 -->
### g10adm.auction-listing.US76-TC3: A listing with no translations reads English in each Chinese choice

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
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_10>` is a listing written before translations existed, with an English title and description only.

**Test data:**

| Field | Value |
| --- | --- |
| listing_10 | A listing with `<english title>` and `<english description>` only |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |

**Steps:**

1. Open `<listing_10>`.
2. Choose Traditional Chinese in the Copy block's language choice.
3. Read the title and description.
4. Choose Simplified Chinese.
5. Read the title and description.
6. Choose English.
7. Read the title and description.

**Expected Results:**

* Step 3 shows `<english title>` and `<english description>`, both marked as the fallback.
* Step 5 shows `<english title>` and `<english description>`, both marked as the fallback.
* Step 7 shows `<english title>` and `<english description>`, not marked.

<!-- trace:case id=g10adm.auction-listing.TC-tnk rev=1 covers=g10adm.auction-listing.SC-let -->
### g10adm.auction-listing.US76-TC4: Traditional Chinese text is never shown as the Simplified Chinese fallback

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
* **Trace:** grade10-admin-auction-listing-US-76

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_9>` is a listing with Traditional Chinese text and no Simplified Chinese text.

**Test data:**

| Field | Value |
| --- | --- |
| listing_9 | A listing with `<english title>`, `<english description>`, `<traditional title>` and `<traditional description>`; no Simplified Chinese text |
| english title | Charizard PSA 10 |
| english description | 1999 Base Set, clean front. |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional description | 1999 年基本系列，正面無瑕。 |

**Steps:**

1. Open `<listing_9>`.
2. Choose Simplified Chinese in the Copy block's language choice.
3. Read the title and description.

**Expected Results:**

* Step 3 shows `<english title>` and `<english description>`, both marked as the fallback.
* Step 3 shows no Traditional Chinese character.

---

## g10adm.auction-listing.US77: Operator finds a listing by a translated title

**As an** auction operator,
**I want** the Listings search to match a title in any language,
**so that** I find the lot from whichever name a collector or colleague quotes.

<!-- trace:case id=g10adm.auction-listing.TC-lnj rev=1 covers=g10adm.auction-listing.SC-6es,g10adm.auction-listing.SC-orh,g10adm.auction-listing.SC-1x3,g10adm.auction-listing.SC-d0k -->
### g10adm.auction-listing.US77-TC1: Listings search finds a listing by a part of its title in any language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_11>` holds an English, a Traditional Chinese and a Simplified Chinese title, and no other listing's titles contain the fragment.

**Test data:**

| Field | Value |
| --- | --- |
| listing_11 | A listing with English title `Charizard PSA 10`, Traditional Chinese title `寶可夢 Pokémon TCG 噴火龍` and Simplified Chinese title `宝可梦 喷火龙` |

| language typed | fragment | why this row |
| --- | --- | --- |
| English | harizar | Part of an English title, as today |
| Traditional Chinese | 噴火 | Part of a Traditional Chinese title |
| Simplified Chinese | 喷火 | Part of a Simplified Chinese title |
| Latin letters in a translated title | pokémon tcg (lower case) | Matches any case; the Traditional Chinese title is `寶可夢 Pokémon TCG 噴火龍` |

**Steps:**

1. Type `<fragment>` in the Listings search.
2. Read the rows.

**Expected Results:**

* Step 2 lists `<listing_11>` once.
* Step 2 shows its row under the English title.

<!-- trace:case id=g10adm.auction-listing.TC-rxg rev=1 -->
### g10adm.auction-listing.US77-TC2: A listing matching in two languages is listed once

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
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_12>` has English title `Charizard Holo` and Traditional Chinese title `Charizard 噴火龍`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_12 | A listing whose English and Traditional Chinese titles both contain `Charizard` |

**Steps:**

1. Type `Charizard` in the Listings search.
2. Read the rows.

**Expected Results:**

* Step 2 lists `<listing_12>` exactly once.

<!-- trace:case id=g10adm.auction-listing.TC-zkm rev=1 covers=g10adm.auction-listing.SC-4uh -->
### g10adm.auction-listing.US77-TC3: Listings search does not fold Traditional and Simplified Chinese

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
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_13>` has a Traditional Chinese title and no Simplified Chinese title.

**Test data:**

| Field | Value |
| --- | --- |
| listing_13 | A listing with English title `<english title>` and Traditional Chinese title `<traditional title>`; no Simplified Chinese title |
| english title | Charizard PSA 10 |
| traditional title | 寶可夢 噴火龍 PSA 10 |
| traditional fragment | 噴火龍 |
| simplified fragment | 喷火龙 |

**Steps:**

1. Type `<simplified fragment>` in the Listings search.
2. Read the rows.
3. Type `<traditional fragment>` in the Listings search.
4. Read the rows.

**Expected Results:**

* Step 2 does not list `<listing_13>`.
* Step 4 lists `<listing_13>`.

<!-- trace:case id=g10adm.auction-listing.TC-a79 rev=1 covers=g10adm.auction-listing.SC-46l -->
### g10adm.auction-listing.US77-TC4: Listings search matches titles only, not descriptions

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
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_14>` has a Traditional Chinese description containing `<description fragment>` and no title containing it.

**Test data:**

| Field | Value |
| --- | --- |
| listing_14 | A listing whose Traditional Chinese description contains `<description fragment>`; none of its titles do |
| description fragment | 正面無瑕 |

**Steps:**

1. Type `<description fragment>` in the Listings search.
2. Read the rows.

**Expected Results:**

* Step 2 does not list `<listing_14>`.

<!-- trace:case id=g10adm.auction-listing.TC-mob rev=1 -->
### g10adm.auction-listing.US77-TC5: Editing or clearing a translated title moves what the search finds

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
* **Trace:** grade10-admin-auction-listing-US-77

**Pre-conditions:**

* admin(auction operator) is on `<grade10 auction admin listings url>`.
* `<listing_15>` is a listing with Traditional Chinese title `<traditional title>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_15 | A listing with English title `<english title>` and Traditional Chinese title `<traditional title>` |
| english title | Charizard PSA 10 |
| traditional title | 噴火龍 初版 |
| new traditional title | 水箭龜 初版 |
| old fragment | 噴火龍 |
| new fragment | 水箭龜 |

**Steps:**

1. Replace the Traditional Chinese title of `<listing_15>` with `<new traditional title>` and click Save.
2. Type `<old fragment>` in the Listings search and read the rows.
3. Type `<new fragment>` in the Listings search and read the rows.
4. Clear the Traditional Chinese title of `<listing_15>` and click Save.
5. Type `<new fragment>` in the Listings search and read the rows.

**Expected Results:**

* Step 2 does not list `<listing_15>`.
* Step 3 lists `<listing_15>`.
* Step 5 does not list `<listing_15>`.

---

## Reconciliation

**Run:** 2026-10-14, QA2 in a fresh context, after QA1's blind pass (22 draft cases from the frozen anchors, `proposal.md`, `decisions.md` and the domain draft) and Dev's independent delta. It read this suite, the delta's `spec.md` and `user-journeys.md`, `decisions.md` with `## Raised`, `tech-design.md`, `tasks.md`, the [Auction Management](/p/grade10-admin/auction/management#listings) page, and the shipped code in grade10 where a claim needed it. No case was written or reworded from a scenario, and every case stays `draft`. QA1's own bundle line is not in the draft; the planning run adds it.

- **Linked** - `g10adm.auction-listing.US3-TC30` asserts `grade10-admin-auction-listing-SC-175`; `US75-TC1` asserts `grade10-admin-auction-listing-SC-170`; `US75-TC2` asserts `grade10-admin-auction-listing-SC-171`; `US75-TC5` asserts `grade10-admin-auction-listing-SC-174` on its spaces rows; `US75-TC8` asserts `grade10-admin-auction-listing-SC-192`; `US75-TC9` asserts `grade10-admin-auction-listing-SC-195`; `US75-TC10` asserts `grade10-admin-auction-listing-SC-194`; `US76-TC1` asserts `grade10-admin-auction-listing-SC-180`; `US76-TC2` asserts `grade10-admin-auction-listing-SC-182`; `US76-TC4` asserts `grade10-admin-auction-listing-SC-183`; `US77-TC1` asserts `grade10-admin-auction-listing-SC-185`, `grade10-admin-auction-listing-SC-186`, `grade10-admin-auction-listing-SC-187` and `grade10-admin-auction-listing-SC-188`, one row each, on one route and one fixture; `US77-TC3` asserts `grade10-admin-auction-listing-SC-190`; `US77-TC4` asserts `grade10-admin-auction-listing-SC-189`
- **Jointly asserted, not linked** - `grade10-admin-auction-listing-SC-172` is split between `US75-TC3` (the accepted limits) and `US75-TC4` (the refusals); `grade10-admin-auction-listing-SC-173` between `US75-TC6` (the trim) and `US75-TC4` (the typed count). No single case asserts either. Dev may split each scenario by branch, or a case may take the missing branch
- **Partly asserted, not linked** - `grade10-admin-auction-listing-SC-178` by `US75-TC7`: it reads no price or window, and it edits a written title where the scenario writes a first one. `grade10-admin-auction-listing-SC-179` by `US75-TC11`: only the operator without the grant; the other side rests on every case that saves. `grade10-admin-auction-listing-SC-181` by `US76-TC1`: it reads the pair together and not that no second choice exists per field. `grade10-admin-auction-listing-SC-184` by `US76-TC1`: it reloads the same listing and reads no other listing's page. `grade10-admin-auction-listing-SC-196` by `US9-TC10`: its rows are all-written and English-plus-Traditional, so the per-text gap (a Simplified Chinese title with no Simplified Chinese description) is unwalked
- **Uncovered** - `grade10-admin-auction-listing-SC-191` (a draft with only a Chinese title is found): `US3-TC30` makes such a draft and `US77-TC1` to `US77-TC4` search listings that carry an English title, so no case searches it. `grade10-admin-auction-listing-SC-193` (staff and sent texts) is spread over `US75-TC8` and `US77-TC1` (the table row), the domain case (the order screen) and `g10.shared-localization.US1-TC5` (the outbid and won emails): no case reads the invoice screen or the Slack alert, which task 2.1 tests
- **Out of suite** - `grade10-admin-auction-listing-SC-176` and `grade10-admin-auction-listing-SC-177`: the editor's save payload carries the translations it holds (task 4.2), so no console route omits them or names fewer; the service test of task 2.1 is the verifier
- **Carried** - `grade10-admin-auction-listing-SC-45` and `grade10-admin-auction-listing-SC-135` to `grade10-admin-auction-listing-SC-145` are unchanged scenarios; the durable suite holds their cases, and `US9-TC10` walks only the Relist languages beside them
- **Cases with no scenario** - `US76-TC3` (an untranslated listing in each Chinese choice): the requirement's per-text fallback states it and `grade10-admin-auction-listing-SC-182` and `grade10-admin-auction-listing-SC-183` imply it; fold one scenario or keep the case on the requirement. `US77-TC2` (matching in two languages is listed once): `tech-design.md` D8 ORs the arms on one row, so a repeat cannot occur; keep as a guard or drop. `US77-TC5` (an edit or a clear moves what the search finds): real, and the scenarios state only the static find; fold. The Created row of `US75-TC7`: the requirement names `created`, and the scenarios name Published only
- **Over-claimed** - `US75-TC4` expects the refusal to name the field, where the spec says only that the save is refused. `US75-TC9` expects no edit control for the English fields; the requirement says "like its other fields" and no scenario does. `US75-TC11` expects the editor to hide the inputs from an operator without the grant: `tech-design.md` D11 makes it so (`readOnly` is `ended || !mayEdit` in `ListingEditor.tsx`), and no scenario or decision states it. All three are real; fold the third as a scenario and trim or fold the first two
- **Contradicted** - none between a case and a scenario. Between artifacts: the feature set's "a closed or called-off listing" leaves out settled, which the requirement and decision 22 name; `tech-design.md` says `editRefusal` also refuses a lot past its close, where the requirement lets any published listing take translations; and `tech-design.md` says the wire counts the title on the raw string for save and create, where `listings.create` takes `title` as `label` (trim, then count) and only `save` is raw. Decision 17 holds for translations either way, because D3 gives them the raw-string check
- **Raised, settled** - every row this pass raised is landed in `decisions.md` (Q7 to Q40, the human's defaults); the open PM confirmations are Q43 and Q49 in `decisions.md`; no case waits on a row
- **Anchors** - `grade10-admin-auction-listing-US-75`, `grade10-admin-auction-listing-US-76` and `grade10-admin-auction-listing-US-77` each hold cases, and the context journeys `grade10-admin-auction-listing-US-03` and `grade10-admin-auction-listing-US-09` hold `US3-TC30` and `US9-TC10`. The feature-set groups are carried through those journeys; no case traces a group on its own
- **After the human's reply (2026-10-14)** - Dev folded scenarios for the cases that had none: `US76-TC3` is `grade10-admin-auction-listing-SC-197`, `US77-TC5` is `grade10-admin-auction-listing-SC-198`, `US75-TC11` is `grade10-admin-auction-listing-SC-199`. `US77-TC2` is dropped as a guard D8 makes structural. `grade10-admin-auction-listing-SC-191` stays uncovered by a case and is verified by task 2.2. Rows settled in `decisions.md` 32 and 33. The feature-set line still reads "a closed or called-off listing"; it is a frozen anchor and is left as written
