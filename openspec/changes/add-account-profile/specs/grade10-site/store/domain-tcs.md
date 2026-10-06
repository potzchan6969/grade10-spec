# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-e2e-US7: Member's saved name reaches the till and the pass

**As a** member,
**I want** the name I save on my profile to be the one staff see at the till and the one my wallet pass shows,
**so that** the site, the counter and my phone name me the same way.

### grade10-site-store-e2e-US7-TC1-1: A name saved on the profile shows at the till and on the pass

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
