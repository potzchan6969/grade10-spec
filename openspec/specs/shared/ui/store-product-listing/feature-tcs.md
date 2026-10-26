# shared/ui/store-product-listing Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-26, tcs-rules r7

## g10.shared-store-product-listing.US1: What the listing search field reports

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/store/product-listing`, which composes the surface
**As a** shopper typing in the listing's search field,
**I want** the field to show the suggestions its surface supplies and to report what I type, commit and pick,
**so that** the page I am on decides what narrows or opens.

<!-- trace:case id=g10.shared-store-product-listing.TC-fds rev=1 -->
### g10.shared-store-product-listing.US1-TC21: Supplied groups and rows are shown, and nothing else

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Listing search suggestions

**Pre-conditions:**

* `ProductFilter` is open in Storybook, drawn as `ProductFilter/Search` → Suggestions.
* The story supplies a product group and a filter group; a product row carries an image and trailing content, and a filter row carries neither.

**Steps:**

1. Focus the search field.
2. Read the groups and rows under the field.
3. Read the product row's image and trailing content, and the filter row's leading and trailing edges.

**Expected Results:**

* The field shows exactly the groups and rows the story supplies, in the order supplied.
* The product row shows its image and its trailing content.
* The filter row shows no image and no trailing content: none is invented.
* No row appears that the story did not supply.

---

<!-- trace:case id=g10.shared-store-product-listing.TC-mwm rev=1 -->
### g10.shared-store-product-listing.US1-TC22: Typing is reported and the field keeps the supplied query

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Listing search suggestions

**Pre-conditions:**

* `FilterPanel` is open in Storybook, drawn as `FilterPanel` → Search Change Is Reported, with the supplied query `pi`.
* The Actions panel is cleared.

**Steps:**

1. Click into the search field.
2. Type one character after `pi`.
3. Read the field and the Actions panel.

**Expected Results:**

* The field still shows `pi`, because the story supplies no new query.
* The Actions panel shows one draft change, carrying the typed value.

---

<!-- trace:case id=g10.shared-store-product-listing.TC-7aw rev=1 -->
### g10.shared-store-product-listing.US1-TC23: Committing with no row picked reports a search commit

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Listing search suggestions

**Pre-conditions:**

* `ProductFilter` is open in Storybook, drawn as `ProductFilter/Search` → Commit, with the supplied query `pi` and no row highlighted.
* The Actions panel is cleared.

**Steps:**

1. Focus the search field.
2. Press Enter without moving to any row.
3. Read the field and the Actions panel.

**Expected Results:**

* The Actions panel shows one search commit carrying `pi`.
* The field still shows `pi` until the story supplies another query.
* No selection is reported.

---

<!-- trace:case id=g10.shared-store-product-listing.TC-lj8 rev=1 -->
### g10.shared-store-product-listing.US1-TC24: A field with nothing to offer still commits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Listing search suggestions

**Pre-conditions:**

* `ProductFilter` is open in Storybook, drawn as the row's **Story**, with the supplied query `pi`.
* The Actions panel is cleared.

**Test data:**

| Story | Panel |
| --- | --- |
| `ProductFilter/Search` → Empty | the empty-suggestions line |
| `ProductFilter/Search` → Groups Omitted | no panel opens |

**Steps:**

1. Focus the search field.
2. Read what the field shows under it.
3. Press Enter.
4. Read the Actions panel.

**Expected Results:**

* The field shows what the row's **Panel** says before the commit.
* The Actions panel shows one search commit carrying `pi`.

---

<!-- trace:case id=g10.shared-store-product-listing.TC-zl0 rev=1 -->
### g10.shared-store-product-listing.US1-TC25: Picking a row reports the pick and does nothing else

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Listing search suggestions

**Pre-conditions:**

* `ProductFilter` is open in Storybook, drawn as `ProductFilter/Search` → Select Suggestion.
* The Actions panel is cleared.

**Steps:**

1. Focus the search field.
2. Click the first product row.
3. Read the Actions panel and the address bar.

**Expected Results:**

* The Actions panel shows one selection, naming that row's suggestion.
* No search commit is reported.
* The address does not change and no filter is applied by the surface.

---

<!-- trace:case id=g10.shared-store-product-listing.TC-h22 rev=1 -->
### g10.shared-store-product-listing.US1-TC26: Every row is reachable and activated by keyboard, with a visible focus

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Listing search suggestions

**Pre-conditions:**

* `ProductFilter` is open in Storybook, drawn as `ProductFilter/Search` → Suggestions.
* The Actions panel is cleared.
* The tester uses the keyboard alone.

**Steps:**

1. Tab into the search field.
2. Press Arrow Down until every row has been focused once.
3. Press Enter on the last focused row.
4. Read the Actions panel.

**Expected Results:**

* Each row, in both groups, takes focus in turn.
* The focused row is visibly marked at each stop.
* Enter on the last row reports one selection naming it.

---

<!-- trace:case id=g10.shared-store-product-listing.TC-g4v rev=1 -->
### g10.shared-store-product-listing.US1-TC27: Pending hits show the searching line and invent no row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Listing search suggestions

**Pre-conditions:**

* `ProductFilter` is open in Storybook, drawn as `ProductFilter/Search` → Pending, with a non-empty query and suggestions marked pending.

**Steps:**

1. Focus the search field.
2. Read what the panel shows.

**Expected Results:**

* The panel shows the searching indication.
* No suggestion row appears.
* The empty-suggestions line does not show.

---

## Settled

## Reconciliation

**Run:** 2026-10-26, drafted after accept-review of `listing-search-suggestions` found the suite absent; read the change's delta, `ui-design.md` and its State table. Not a blind pass.

- **Assumed** - the capability's one section is US1, as `activate-listing-tile-by-name` has it; QA renumbers the cases when both suites fold, since each starts at TC1
- **Walked** - `shared-ui-store-product-listing-SC-67` and `shared-ui-store-product-listing-SC-73` by US1-TC21; `shared-ui-store-product-listing-SC-68` by US1-TC22; `shared-ui-store-product-listing-SC-69` by US1-TC23; `shared-ui-store-product-listing-SC-71` and `shared-ui-store-product-listing-SC-94` by US1-TC24; `shared-ui-store-product-listing-SC-70` by US1-TC25; `shared-ui-store-product-listing-SC-72` by US1-TC26; `shared-ui-store-product-listing-SC-74` by US1-TC27
- **Covers pending** - the delta's SC-67 to SC-74 and SC-94 carry no trace marker yet, so the cases are anchor-only until QA2 mints them
