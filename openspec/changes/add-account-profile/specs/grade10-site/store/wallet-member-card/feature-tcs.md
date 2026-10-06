# grade10-site/store/wallet-member-card Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-wallet-member-card-US6: Member carries their card in a phone wallet

**As a** member,
**I want** my card in the wallet my phone already has, scannable without signal and naming me as the site does,
**so that** I am served from my lock screen instead of signing in and waiting for a code with a queue behind me.

<!-- trace:case id=g10.store-wallet-member-card.TC-mbs rev=1 covers=g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-fjc -->
### grade10-site-store-wallet-member-card-US6-TC10-1: Pass names the member by the site's one rule

Runs once for each <member state> row on each <wallet>.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with no pass) is signed in as <signed-in address> on a phone that has <wallet>, in the <member state> of the row.
* The deployment is configured for <wallet>.

**Test data:**

| Field | Value |
| --- | --- |
| <signed-in address> | `kit.lam@example.com` |

| <member state> | The pass names |
| --- | --- |
| Saved `Kit Collector` as the display name on the profile; the account is named `Kit Lam` | `Kit Collector` |
| Never saved a profile; the account is named `Kit Lam` | `Kit Lam` |
| Never saved a profile; the account holds no name | `kit.lam` |

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Navigate to <grade10 membership url>.
2. Click the action that adds a <wallet> pass.
3. Open the pass in <wallet>.
4. Read the name on the pass.

**Expected Results:**

* Step 4 reads the row's name.

<!-- trace:case id=g10.store-wallet-member-card.TC-0d5 rev=1 covers=g10.store-wallet-member-card.SC-vzv -->
### grade10-site-store-wallet-member-card-US6-TC11-1: An account-name change reaches the pass within the daily floor

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with a live Google Wallet pass, never saved a profile) has an account named <old name>, and the pass shows <old name>.
* Nothing else the pass shows changes during the run.

**Test data:**

| Field | Value |
| --- | --- |
| <old name> | `Kit Lam` |
| <new name> | `Kit L. Lam` |
| <floor> | 86400s (24h) |

**Steps:**

1. Change the account's name to <new name> in the account service.
2. Read what the sweeps send the wallet until <floor> after step 1.

**Expected Results:**

* Within <floor> of step 1, the wallet is sent the pass naming <new name>.

<!-- trace:case id=g10.store-wallet-member-card.TC-nck rev=1 covers=g10.store-wallet-member-card.SC-nmv -->
### grade10-site-store-wallet-member-card-US6-TC12-1: A name the account service cannot give leaves the pass as it was

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
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with a live Google Wallet pass, never saved a profile, account named <name>) has a pass showing <name> and <old balance>.
* The member's balance has moved to <new balance>, so the pass is due.
* The account service's name lookup is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <name> | `Kit Lam` |
| <old balance> | 1200 points |
| <new balance> | 1100 points |

**Steps:**

1. Wait for the first sweep beginning after the balance moved.
2. Read what that sweep sent the wallet.
3. Restore the account service's name lookup.
4. Wait for the next sweep.
5. Read what that sweep sent the wallet.

**Expected Results:**

* Step 2 finds nothing sent: the pass still shows <name> and <old balance>.
* Step 5 finds the pass sent naming <name> with <new balance>.

<!-- trace:case id=g10.store-wallet-member-card.TC-scs rev=1 covers=g10.store-wallet-member-card.SC-4hb -->
### grade10-site-store-wallet-member-card-US6-TC13-1: Pass is sent an 80-character name whole

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with no pass, saved <long name> as the display name on the profile) is signed in.
* The deployment is configured for <wallet>.

**Test data:**

| Field | Value |
| --- | --- |
| <long name> | 80 Latin characters, the display name's limit |

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Navigate to <grade10 membership url>.
2. Click the action that adds a <wallet> pass.
3. Read the pass the store issues.

**Expected Results:**

* Step 3 names the member <long name>, all 80 characters.

<!-- trace:case id=g10.store-wallet-member-card.TC-nh4 rev=1 covers=g10.store-wallet-member-card.SC-nmv,g10.store-wallet-member-card.SC-92j -->
### grade10-site-store-wallet-member-card-US6-TC14-1: A saved name refreshes the pass through an account-service outage

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
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer A(member with a live Google Wallet pass, saved <saved name> as the display name on the profile) has a pass showing <saved name> and <old balance>.
* customer B(member with a live Google Wallet pass, never saved a profile, account named <B's name>) has a pass showing <B's name> and <old balance>.
* Both members' balances have moved to <new balance>, so both passes are due on the same sweep.
* The account service's name lookup is mocked to fail.

**Test data:**

| Field | Value |
| --- | --- |
| <saved name> | `Kit Collector` |
| <B's name> | `Mika Tan` |
| <old balance> | 1200 points |
| <new balance> | 1100 points |

**Steps:**

1. Wait for the first sweep beginning after the balances moved.
2. Read what that sweep sent the wallet.
3. Restore the account service's name lookup.
4. Wait for the next sweep.
5. Read what that sweep sent the wallet.

**Expected Results:**

* Step 2 finds customer A's pass sent naming <saved name> with <new balance>.
* Step 2 finds nothing sent for customer B: the pass still shows <B's name> and <old balance>.
* Step 5 finds customer B's pass sent naming <B's name> with <new balance>.

## Settled

- A pass carries the member's name whole; how the wallet app fits a long name is the wallet's.
- A pass whose member has a name saved on the profile is refreshed with it through an account-service outage, whoever else its lap holds; only a pass the service cannot name waits for a later lap, staying as it was meanwhile.

## Reconciliation

**Run:** 2026-10-06, second QA2 reconciliation in a fresh context, after the round added `grade10-site-store-wallet-member-card-SC-42` and `grade10-site-store-wallet-member-card-SC-43`. Read: this suite, the delta `spec.md` and `user-journeys.md`, the durable wallet suite for the cases the carried scenarios already have, the domain suite `grade10-site/store/domain-tcs.md` in this change, `proposal.md`, `decisions.md`, `tech-design.md`, `tasks.md`, the Member Card in a Wallet page, and the application repository's wallet sweep and pass builders. The blind pass recorded no Run line of its own, so its bundle is not stated here.

- **Raised, settled by the round** — a long name on the pass (Q22): the store carries the name whole, as `packages/wallet-pass/src/google.ts` and `packages/wallet-pass/src/apple/pkpass.ts` already do, `grade10-site-store-wallet-member-card-SC-43`, walked by US6-TC13; a saved name through an outage (Q21): the lap names its members one by one, `grade10-site-store-wallet-member-card-SC-42`, walked by US6-TC14
- **Rewritten to the spec** — US6-TC10 runs on Apple Wallet as well as Google Wallet, since `grade10-site-store-wallet-member-card-SC-18` names the same rule for the Apple pass; US6-TC14 dropped its "no other pass is due" pre-condition and gains a member the service cannot name on the same sweep, as `grade10-site-store-wallet-member-card-SC-42` states; the second `## Settled` line, which let a pass with a saved name wait a lap on its batch, now says what Q21 decided
- **Rejected** — none
- **Contradicted** — none left: the `## Settled` line and US6-TC14's pre-condition were the only ones, both rewritten above
- **Cases added after the reconciliation** — US6-TC13 (`grade10-site-store-wallet-member-card-SC-43`), US6-TC14 (`grade10-site-store-wallet-member-card-SC-42`): written from the decisions the blind pass raised, so they are not blind
- **Carried unchanged** — the two modified requirements change only the name each pass carries; their other scenarios keep their durable cases
- **Covered at domain** — `grade10-site-store-wallet-member-card-SC-40`, a name saved on the profile reaches the pass on the next lap: `grade10-site-store-e2e-US7-TC1-1` saves the name and reads it on the pass after the first sweep
- **Uncovered** — none

| Scenario | Reached by |
| --- | --- |
| `grade10-site-store-wallet-member-card-SC-13` | US6-TC10, durable US6-TC1 |
| `grade10-site-store-wallet-member-card-SC-14` | durable US6-TC2 |
| `grade10-site-store-wallet-member-card-SC-15` | durable US7-TC2, US7-TC3 |
| `grade10-site-store-wallet-member-card-SC-16` | durable US6-TC2 |
| `grade10-site-store-wallet-member-card-SC-17` | durable US7-TC5 |
| `grade10-site-store-wallet-member-card-SC-18` | US6-TC10, durable US6-TC1 |
| `grade10-site-store-wallet-member-card-SC-19` | durable US6-TC3 |
| `grade10-site-store-wallet-member-card-SC-20` | durable US8-TC1 |
| `grade10-site-store-wallet-member-card-SC-39` | US6-TC12, US6-TC14 |
| `grade10-site-store-wallet-member-card-SC-40` | covered at domain |
| `grade10-site-store-wallet-member-card-SC-41` | US6-TC11 |
| `grade10-site-store-wallet-member-card-SC-42` | US6-TC14 |
| `grade10-site-store-wallet-member-card-SC-43` | US6-TC13 |
