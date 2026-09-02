# grade10-admin/console/api-docs Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## api-docs-US1: Engineer reads what a procedure needs before wiring a call

**As an** engineer wiring a console or storefront feature to a backend call,
**I want** to open the procedure and read its caller, grant, input and output in one place,
**so that** I wire the call correctly without reading the backend's source.

### api-docs-US1-TC1-1: API docs entry appears under Dev on a staging build

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-01

**Pre-conditions:**
The operator is signed in to <grade10 staging admin url> with a role that opens the console and no other grant.

**Steps:**

1. Navigate to <grade10 staging admin url>.
2. Look at the Dev heading in the sidebar.
3. Click API docs.

**Expected Results:**

* Dev heading lists API docs.
* Step 3 opens the API docs surface with the services rail.

### api-docs-US1-TC2-1: API docs address is not answered on a production build

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-01

**Pre-conditions:**
The operator is signed in to <grade10 production admin url> as an admin.

**Steps:**

1. Navigate to <grade10 production admin url>/api-docs.
2. Look at the sidebar.

**Expected Results:**

* The console's not-found surface renders.
* No Dev heading offers API docs.

### api-docs-US1-TC3-1: Router list shows kind, caller and summaries

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-01

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>.

**Steps:**

1. Click the store service in the rail.
2. Click the checkout router beneath it.
3. Read the procedure rows.

**Expected Results:**

* Every checkout procedure is listed once.
* Each row shows kind, caller, an input summary and an output summary.

### api-docs-US1-TC4-1: Procedure detail shows wire path and bounded fields

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-01

**Pre-conditions:**
The store checkout router is listed on <grade10 staging admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Procedure | checkout.createCheckout |

**Steps:**

1. Click the createCheckout row.
2. Read the header line of the detail panel.
3. Read the Input table.
4. Read the Output table.

**Expected Results:**

* Header shows the dotted path and the wire path the call lands on.
* Input table lists items, spendPoints and couponCodes, with items required and its 1–50 bound shown.
* Output table shows each outcome alternative apart, named by its outcome value.

### api-docs-US1-TC5-1: Elevated procedure shows its grant beside the caller

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-01

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>.

**Steps:**

1. Click the auction service, then the fulfillment router.
2. Click the advance row.
3. Read the caller badges in the detail header.

**Expected Results:**

* Caller reads elevated.
* The grant auction:shipment is shown beside it.

### api-docs-US1-TC6-1: Fresh-session call is told apart from a session call

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-01

**Pre-conditions:**
The store checkout router is listed on <grade10 staging admin url>.

**Steps:**

1. Read the caller of the createCheckout row.
2. Read the caller of the getOrder row.

**Expected Results:**

* createCheckout reads session · fresh.
* getOrder reads session.

---

## api-docs-US2: QA reviewer traces what a grant unlocks

**As a** QA reviewer planning a pass for one operator role,
**I want** to filter every service at once by a grant,
**so that** I see each procedure that role reaches and nothing it does not.

### api-docs-US2-TC1-1: Rail names every service with its procedure count

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-02

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>.

**Steps:**

1. Read the services rail.
2. Click the store service.

**Expected Results:**

* Rail names store, auction, auth, loyalty, vault, appointment and finance, each with a procedure count.
* Store unfolds its routers, each with its own count, the till ladder named apart.

### api-docs-US2-TC2-1: Grant filter narrows every service and the counts follow

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-02

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Filter | auction:settle |

**Steps:**

1. Type auction:settle into the filter.
2. Read the rail counts.
3. Click the auction service and read the listed rows.

**Expected Results:**

* Only procedures requiring auction:settle are listed under every service.
* Rail counts match the narrowed lists.

### api-docs-US2-TC3-1: Path filter narrows the same way as a grant

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-02

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Filter | coupons |

**Steps:**

1. Type coupons into the filter.
2. Read the lists under every service.

**Expected Results:**

* Only procedures whose dotted path contains coupons are listed.
* Rail counts match the narrowed lists.

### api-docs-US2-TC4-1: Filter with no match leaves every service empty

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-02

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>.

**Test data:**

| Field | Value |
| --- | --- |
| Filter | no-such-grant |

**Steps:**

1. Type no-such-grant into the filter.
2. Read the rail and the lists.

**Expected Results:**

* Every service count reads zero and no procedure is listed.
* Clearing the filter restores every list and count.

---

## api-docs-US3: Engineer relies on the page after a contract changed

**As an** engineer who changed a procedure's input,
**I want** the repository to refuse the change until the document is regenerated,
**so that** the page never lags behind the server it describes.

### api-docs-US3-TC1-1: Document lists exactly the mounted procedures

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** api-docs-US-03

**Pre-conditions:**
A checkout of <grade10 repository> at the commit under test, with the store router mounting a known set of procedures.

**Steps:**

1. Produce the store document.
2. Compare its dotted paths with the procedures the router mounts.

**Expected Results:**

* The two sets are equal.
* Every entry carries kind and caller.

### api-docs-US3-TC2-1: Changed input fails the check until regenerated

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-03

**Pre-conditions:**
A checkout of <grade10 repository> with committed documents matching the routers.

**Steps:**

1. Add a required field to one store procedure's input in the router.
2. Run the repository's API docs check.
3. Regenerate the documents.
4. Run the check again.

**Expected Results:**

* Step 2 fails and names the store service and the changed procedure.
* Step 4 passes.

### api-docs-US3-TC3-1: Two runs over unchanged routers are byte-identical

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** api-docs-US-03

**Pre-conditions:**
A checkout of <grade10 repository> with unchanged routers.

**Steps:**

1. Produce every service document.
2. Produce them again.
3. Compare the two sets byte for byte.

**Expected Results:**

* Every pair is identical.

### api-docs-US3-TC4-1: Page names the commit its documents came from

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-03

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>, deployed from a known commit.

**Steps:**

1. Read the header of the surface.

**Expected Results:**

* The header names the commit the documents were produced from.
* It matches the commit the staging console was deployed from.

---

## api-docs-US4: Backend reviewer finds the outputs left undeclared

**As a** backend reviewer,
**I want** each procedure without an output shape marked as such, with a count per service,
**so that** I know where to add one rather than discovering it from a consumer's bug.

### api-docs-US4-TC1-1: Undeclared output is said in the detail and counted on the service

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** api-docs-US-04

**Pre-conditions:**
The API docs surface is open on <grade10 staging admin url>; the auction fulfillment router holds a procedure with no declared output.

**Steps:**

1. Click the auction service, then the fulfillment router.
2. Read the service heading.
3. Click the advance row and read the Output panel.

**Expected Results:**

* Service heading shows how many auction procedures declare no output.
* Output panel says the output is not declared and shows no fields.
