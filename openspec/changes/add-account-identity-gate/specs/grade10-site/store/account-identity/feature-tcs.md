# grade10-site/store/account-identity Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-05, tcs-rules r2

## grade10-site-store-account-identity-US1: Collector verifies their identity from their account

**As a** collector who wants to buy or bid above the bar,
**I want** to verify who I am from my own account page, on my own phone, after reading what will be checked,
**so that** I am recognised wherever Grade10 asks, without a visit and without being asked twice.

### grade10-site-store-account-identity-US1-TC1-1: Unverified account names the bar and offers to verify

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
* **Trace:** grade10-site-store-account-identity-US-01

**Pre-conditions:**

* The user is signed in on `<an unverified account>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<an unverified account>` | An account with no verified identity on file and no check raised |
| `<bar>` | 12000000 HKD minor units (HKD 120,000.00), the bar Grade10 sets on an order's goods and on a bid |

**Steps:**

1. Navigate to `<grade10 account page url>`.
2. Read the identity card.

**Expected Results:**

* The card says the user is not verified.
* The card names `<bar>` as the order value and as the bid value at which a verified identity is asked for.
* The card offers to verify — the agreement to tick and the verify button.

### grade10-site-store-account-identity-US1-TC2-1: Verifying from the account is recognised at a checkout above the bar

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-identity-US-01

**Pre-conditions:**

* The user is signed in on `<an unverified account>`.
* The user's cart holds `<basket above the bar>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<an unverified account>` | An account with no verified identity on file and no check raised |
| `<bar>` | 12000000 HKD minor units (HKD 120,000.00), the bar Grade10 sets on an order's goods and on a bid |
| `<basket above the bar>` | A basket whose goods are worth 12500000 minor units, above `<bar>` |

**Steps:**

1. Navigate to `<grade10 account page url>`.
2. Tick the agreement.
3. Press the verify button.
4. Complete the provider's check with a valid document, on the same device.
5. Read the identity card once the verdict lands.
6. Read the check the account holds.
7. Open the cart drawer.
8. Click the checkout button.

**Expected Results:**

* Step 3 hands the user to the provider's page on the device they are on.
* Step 5: the card reads `verified`.
* The check records the instant the user agreed.
* Step 8 proceeds as any other checkout: the browser is handed to Shopify's checkout page, with no refusal naming `<bar>`.

### grade10-site-store-account-identity-US1-TC3-1: Account page carries no identity field in any standing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-identity-US-01

**Pre-conditions:**

* The user is signed in on an account whose standing, and whose latest check the store raised, are the ones the row names.

**Test data:**

| Standing | Check the store raised | Outcome |
| --- | --- | --- |
| `verified` | None — the vault verified the user at a visit | Nothing about the person is shown or answered |
| `unverified` | In Started | Nothing about the person is shown or answered |
| `unverified` | Declined | Nothing about the person is shown or answered |
| `expired` | None — the vault verified the user on a document that has lapsed | Nothing about the person is shown or answered |

**Steps:**

1. Navigate to `<grade10 account page url>`.
2. Read everything the identity card shows.
3. Read what was answered to the page behind the card.

**Expected Results:**

* The card shows no legal name, date of birth, document type, document number, mask, document image or provider finding.
* None of those is answered to the page.

### grade10-site-store-account-identity-US1-TC4-1: Verify is unavailable until the agreement is ticked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-identity-US-01

**Pre-conditions:**

* The user is signed in on `<an unverified account>` and is on `<grade10 account page url>`.
* The agreement is not ticked.

**Test data:**

| Field | Value |
| --- | --- |
| `<an unverified account>` | An account with no verified identity on file and no check raised |

**Steps:**

1. Try the verify button with the agreement unticked.
2. Send a start for the account by request, carrying no agreement.
3. Read the checks the account holds and the requests that reached the provider.

**Expected Results:**

* The verify button is not available until the agreement is ticked.
* Step 2 starts no check.
* The account holds no check, and nothing reached the provider.

### grade10-site-store-account-identity-US1-TC5-1: Check the provider is deciding is not started twice

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-account-identity-US-01

**Pre-conditions:**

* The user is signed in on an account whose latest check the store raised is in the state the row names.

**Test data:**

| Check state | Outcome |
| --- | --- |
| Submitted | The card says the provider is deciding; no second check |
| Stalled | The card says the provider is deciding; no second check |

**Steps:**

1. Navigate to `<grade10 account page url>`.
2. Read the identity card.
3. Press the offer to check again.
4. Read the checks the account holds.

**Expected Results:**

* The card says the provider is deciding and offers to check again.
* Step 3 starts no second check: the account holds one check, still in the state the row names.

### grade10-site-store-account-identity-US1-TC6-1: Declined account is told the counter is another way, and not why

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-account-identity-US-01

**Pre-conditions:**

* The user is signed in on `<a declined account>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a declined account>` | An account whose latest check the store raised is Declined, its standing `unverified` |

**Steps:**

1. Navigate to `<grade10 account page url>`.
2. Read everything the identity card shows.

**Expected Results:**

* The card says the check could not be completed online.
* The card names the counter as another way, and offers to try again.
* The card shows no reason for the decline.

### grade10-site-store-account-identity-US1-TC7-1: Trying again after a decline raises a new check

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
* **Trace:** grade10-site-store-account-identity-US-01

**Pre-conditions:**

* The user is signed in on `<a declined account>` and is on `<grade10 account page url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a declined account>` | An account whose latest check the store raised is Declined, its standing `unverified` |

**Steps:**

1. Press the offer to try again.
2. Read the checks the account holds.

**Expected Results:**

* Step 1 raises a new check for the account.
* The user is handed to the provider's page.

---

## grade10-site-store-account-identity-US2: Collector verified at a vault visit is recognised on the site

**As a** collector who verified for a vault visit,
**I want** the site to recognise that verification on my account,
**so that** I am not asked for my passport again to buy or bid.

### grade10-site-store-account-identity-US2-TC1-1: Vault-verified account reads verified until the document's expiry

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
* **Trace:** grade10-site-store-account-identity-US-02

**Pre-conditions:**

* The user is signed in on `<a vault-verified account>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a vault-verified account>` | An account the vault verified at a visit, on a document valid until `<document expiry>`; no check raised by the store |
| `<document expiry>` | The day that document stops being valid, after today |

**Steps:**

1. Navigate to `<grade10 account page url>`.
2. Read the identity card.

**Expected Results:**

* The card says the user is verified.
* The card names `<document expiry>` as the day the document stops being valid.
* The card offers no check to start.

### grade10-site-store-account-identity-US2-TC2-1: Pressing verify on a vault-verified account raises no check

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-account-identity-US-02

**Pre-conditions:**

* The user is signed in on `<a vault-verified account>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a vault-verified account>` | An account the vault verified at a visit, on a document valid until `<document expiry>`; no check raised by the store |
| `<document expiry>` | The day that document stops being valid, after today |

**Steps:**

1. Send a start for the account by request, as the user, with the agreement given.
2. Read the answer.
3. Read the checks the account holds and the requests that reached the provider.

**Expected Results:**

* The answer says the user is verified.
* No check is raised for the account, and nothing reached the provider.

### grade10-site-store-account-identity-US2-TC3-1: Lapsed account verifies again on a current document

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
* **Trace:** grade10-site-store-account-identity-US-02

**Pre-conditions:**

* The user is signed in on `<a lapsed account>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a lapsed account>` | An account the vault verified at a visit, on a document that expired before today; its standing reads `expired` |
| `<a current document>` | A document of the user's, valid past today |

**Steps:**

1. Navigate to `<grade10 account page url>`.
2. Read the identity card.
3. Tick the agreement.
4. Press the verify button.
5. Complete the provider's check with `<a current document>`, on the same device.
6. Read the identity card once the verdict lands.

**Expected Results:**

* Step 2: the card reads `expired` and offers to verify again.
* Step 6: the card reads `verified`, until `<a current document>`'s expiry.

**Out of suite:**

- `grade10-site-store-account-identity-SC-04` — No journey lists it: a brand with no identity store is ZZZ's deployment, and no Grade10-site journey reaches its account page.
- `grade10-site-store-account-identity-SC-11` — No journey lists it: an account's erasure runs with no surface of this capability behind it, so no collector journey walks the check being ended.
