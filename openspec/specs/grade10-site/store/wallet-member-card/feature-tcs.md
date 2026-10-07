# grade10-site/store/wallet-member-card Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4
**Out of suite:** grade10-site-store-wallet-member-card-SC-61, grade10-site-store-wallet-member-card-SC-68, grade10-site-store-wallet-member-card-SC-69, grade10-site-store-wallet-member-card-SC-70, grade10-site-store-wallet-member-card-SC-72, grade10-site-store-wallet-member-card-SC-73, grade10-site-store-wallet-member-card-SC-74

## grade10-site-store-wallet-member-card-US1: Member adds their card to a phone wallet

**As a** loyalty member,
**I want** to add my member card to Google Wallet or Apple Wallet,
**so that** I can scan it at the counter without opening the site.

<!-- trace:case id=g10.store-wallet-member-card.TC-1qq rev=1 covers=g10.store-wallet-member-card.SC-znb,g10.store-wallet-member-card.SC-atm,g10.store-wallet-member-card.SC-58f -->
### grade10-site-store-wallet-member-card-US1-TC1-1: Refreshed pass shows the tier the programme holds now

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
* **Trace:** grade10-site-store-wallet-member-card-US-01

**Pre-conditions:**

* customer(member with a live <wallet> pass) has the pass open on their phone.
* The member's tier changed since the pass last refreshed.

**Test data:**

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Wait for the pass's next refresh.
2. Read the tier the pass shows.

**Expected Results:**

* The pass shows the member's current tier from the programme.

<!-- trace:case id=g10.store-wallet-member-card.TC-plr rev=1 covers=g10.store-wallet-member-card.SC-znb,g10.store-wallet-member-card.SC-atm,g10.store-wallet-member-card.SC-58f -->
### grade10-site-store-wallet-member-card-US1-TC2-1: Adding a second Google Wallet pass ends the first

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
* **Trace:** grade10-site-store-wallet-member-card-US-01

**Pre-conditions:**

* customer(member with a live Google Wallet pass) is on <grade10 membership url>, holding <google pass_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <google pass_1> | The live Google Wallet pass the member holds |
| <google pass_2> | The Google Wallet pass added while <google pass_1> is live |

**Steps:**

1. Ask to add <google pass_2> for the member.
2. Read the member's Google Wallet passes.

**Expected Results:**

* <google pass_1> is ended.
* Exactly one Google Wallet pass is live: <google pass_2>.

<!-- trace:case id=g10.store-wallet-member-card.TC-sb0 rev=1 covers=g10.store-wallet-member-card.SC-znb,g10.store-wallet-member-card.SC-atm,g10.store-wallet-member-card.SC-58f -->
### grade10-site-store-wallet-member-card-US1-TC3-1: Adding a pass with a missing credential names it

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-wallet-member-card-US-01

**Pre-conditions:**

* customer(member) is on <grade10 membership url>.
* The deployment is missing <missing credential> for <wallet>.

**Test data:**

| <wallet> | <missing credential> |
| --- | --- |
| Google Wallet | WALLET_PASS_KEY |
| Apple Wallet | WALLET_APPLE_PASS_KEY |

**Steps:**

1. Ask to add a <wallet> pass for the member.
2. Read the answer.

**Expected Results:**

* The add is refused.
* The refusal names <missing credential>.

---

## grade10-site-store-wallet-member-card-US2: Member scans at the counter after their balance moved

**As a** member whose points or tier changed since they last opened the app,
**I want** my wallet pass to show the current balance and tier,
**so that** staff see the same standing the app would show me.

<!-- trace:case id=g10.store-wallet-member-card.TC-3kt rev=1 covers=g10.store-wallet-member-card.SC-bj5,g10.store-wallet-member-card.SC-rrp -->
### grade10-site-store-wallet-member-card-US2-TC1-1: Due pass shows the new balance after the next lap

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-02

**Pre-conditions:**

* customer(member with a live <wallet> pass) has the pass open on their phone.
* The member's balance changed since the pass last refreshed.
* The pass is due.

**Test data:**

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Wait for the next sweep lap to finish.
2. Read the balance the pass shows.

**Expected Results:**

* The pass shows the member's new balance.

<!-- trace:case id=g10.store-wallet-member-card.TC-2vk rev=1 covers=g10.store-wallet-member-card.SC-bj5,g10.store-wallet-member-card.SC-rrp -->
### grade10-site-store-wallet-member-card-US2-TC2-1: Vendor debt beyond its budget does not hold back a refresh

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-02

**Pre-conditions:**

* customer(member with a live Google Wallet pass), and the pass is due for refresh.
* More ended passes owe Google Wallet a call than one lap's vendor-debt budget covers.

**Steps:**

1. Run one sweep lap.
2. Read whether the member's pass was refreshed.

**Expected Results:**

* The member's pass is refreshed in that lap.

---

## grade10-site-store-wallet-member-card-US3: Member ends one pass and keeps the other

**As a** member holding passes on both wallets,
**I want** ending one to leave the other untouched,
**so that** losing a phone does not cost me both cards.

<!-- trace:case id=g10.store-wallet-member-card.TC-a7s rev=1 covers=g10.store-wallet-member-card.SC-sh7,g10.store-wallet-member-card.SC-83a -->
### grade10-site-store-wallet-member-card-US3-TC1-1: Ended timestamp is present exactly when a pass is not live

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-wallet-member-card-US-03

**Pre-conditions:**

* customer(member) holds a pass in <pass state>.

**Test data:**

| <pass state> | Ended timestamp |
| --- | --- |
| live | absent |
| ended | present |
| erased | present |

**Steps:**

1. Read the pass's stored record.
2. Read its ended timestamp.

**Expected Results:**

* The ended timestamp is as the row states.

<!-- trace:case id=g10.store-wallet-member-card.TC-n97 rev=1 covers=g10.store-wallet-member-card.SC-sh7,g10.store-wallet-member-card.SC-83a -->
### grade10-site-store-wallet-member-card-US3-TC2-1: Ending the Google Wallet pass alone keeps the Apple Wallet pass live

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-03

**Pre-conditions:**

* customer(member with a live Google Wallet pass and a live Apple Wallet pass) is at the till, on <grade10 membership url>.
* admin(shop staff) has the Grade10 extension open at the till.

**Steps:**

1. Click the control that ends the Google Wallet pass.
2. Scan the Apple Wallet pass at the till.

**Expected Results:**

* Step 2 identifies the member.

<!-- trace:case id=g10.store-wallet-member-card.TC-mij rev=1 covers=g10.store-wallet-member-card.SC-sh7,g10.store-wallet-member-card.SC-83a -->
### grade10-site-store-wallet-member-card-US3-TC3-1: Sweep discharges an ended pass's vendor copy

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-03

**Pre-conditions:**

* customer(member) has just ended their Google Wallet pass.

**Steps:**

1. Wait for the sweep's expiry arm to run.
2. Read the calls made to Google Wallet for that pass.

**Expected Results:**

* Google Wallet is called to remove the member's identifying facts.

---

## grade10-site-store-wallet-member-card-US4: Member asks to be erased

**As a** member exercising their right to erasure,
**I want** my wallet passes to stop identifying me and make no further codes,
**so that** deleting my account actually removes what a pass could show
about me.

<!-- trace:case id=g10.store-wallet-member-card.TC-c0s rev=1 covers=g10.store-wallet-member-card.SC-ft5,g10.store-wallet-member-card.SC-fxc -->
### grade10-site-store-wallet-member-card-US4-TC1-1: Erased passes hold no secret and make no code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-04

**Pre-conditions:**

* customer(member with a live Google Wallet pass and a live Apple Wallet pass) has asked to be erased.

**Steps:**

1. Erase the member's passes.
2. Read the stored secret on each pass.

**Expected Results:**

* Each pass's secret is empty, so it makes no code.

<!-- trace:case id=g10.store-wallet-member-card.TC-n45 rev=1 covers=g10.store-wallet-member-card.SC-ft5,g10.store-wallet-member-card.SC-fxc -->
### grade10-site-store-wallet-member-card-US4-TC2-1: Device fetching an erased pass gets nobody's facts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-04

**Pre-conditions:**

* The member's Apple Wallet pass is erased.
* Its device still pulls updates.

**Steps:**

1. Fetch the pass as its device does.
2. Read the pass returned.

**Expected Results:**

* The pass names no member.
* It shows no tier and no balance.

---

## grade10-site-store-wallet-member-card-US5: Operator reads what the sweep costs

**As an** operator watching the platform's health,
**I want** the sweep's dormant reads and vendor-debt discharge to be bounded
and observable,
**so that** a slow vendor or a large dormant base cannot starve the members
who are actively spending.

<!-- trace:case id=g10.store-wallet-member-card.TC-xq7 rev=1 covers=g10.store-wallet-member-card.SC-jfa,g10.store-wallet-member-card.SC-xbm -->
### grade10-site-store-wallet-member-card-US5-TC1-1: Dormant member's passes are read once a day, nothing sent

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
* **Trace:** grade10-site-store-wallet-member-card-US-05

**Pre-conditions:**

* admin(operator) can read the sweep's reads and sends.
* customer(member with no activity) holds a live Google Wallet pass and a live Apple Wallet pass.
* Neither pass is due before its daily floor.

**Steps:**

1. Let 24 hours pass.
2. Read how often the sweep read each pass.
3. Read what the sweep sent each wallet.

**Expected Results:**

* Each pass was read once, by the daily floor.
* Nothing was sent to either wallet.

---

## grade10-site-store-wallet-member-card-US6: Member carries their card in a phone wallet

**As a** member,
**I want** my card in the wallet my phone already has, scannable without signal,
**so that** I am served from my lock screen instead of signing in and waiting for a code with a queue behind me.

<!-- trace:case id=g10.store-wallet-member-card.TC-k5b rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC1-1: Member card page offers the pass and adding it carries the card

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member) is signed in on a phone that has <wallet>.
* The deployment is configured for Google Wallet and Apple Wallet.

**Test data:**

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Navigate to <grade10 membership url>.
2. Click the action that adds a <wallet> pass.
3. Open the pass in <wallet>.

**Expected Results:**

* The action that adds the pass sits beside the card.
* Every word the action shows is the site's own.
* Pass carries name, tier, points to spend, scannable code.

<!-- trace:case id=g10.store-wallet-member-card.TC-bdf rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC2-1: Google Wallet pass with no signal opens a session as the card does

**Classification:**

* **Severity:** critical
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

* customer(member with a live Google Wallet pass) is at the till with no network on their phone, and holds <reward_1>.
* admin(shop staff) has the Grade10 extension open at the till.
* The sale holds a line covering <points to spend>, and the member is the cart's customer.
* The sale carries no other discount.
* No automatic discount is active at the shop.

**Test data:**

| Field | Value |
| --- | --- |
| <points to spend> | Points within the member's balance |
| <reward_1> | A reward the member can collect |

**Steps:**

1. Open the pass in Google Wallet.
2. Scan the code it shows at the till.
3. Spend <points to spend> in that session.
4. Collect <reward_1> in that session.

**Expected Results:**

* The code the pass shows is current.
* A session opens for the member.
* Steps 3 and 4 succeed, as in a QR session.

<!-- trace:case id=g10.store-wallet-member-card.TC-ghv rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC3-1: Apple Wallet pass with no signal opens a session every visit

**Classification:**

* **Severity:** critical
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

* customer(member with a live Apple Wallet pass) is at the till with no network on their phone.
* admin(shop staff) has the Grade10 extension open at the till.

**Steps:**

1. Scan the Apple Wallet pass at the till.
2. Wait for that till session to end.
3. Scan the same pass at the till on a later visit.

**Expected Results:**

* Step 1 opens a session for the member.
* Step 3 opens a session for the member.

<!-- trace:case id=g10.store-wallet-member-card.TC-rk0 rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC4-1: Adding a pass in the other wallet keeps the first identifying

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
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with a live <first wallet> pass) is at the till, on <grade10 membership url> on a phone that has <second wallet>.
* admin(shop staff) has the Grade10 extension open at the till.

**Test data:**

| <first wallet> | <second wallet> |
| --- | --- |
| Google Wallet | Apple Wallet |
| Apple Wallet | Google Wallet |

**Steps:**

1. Click the action that adds a <second wallet> pass.
2. Scan the <first wallet> pass at the till.
3. Scan the <second wallet> pass at the till.

**Expected Results:**

* Step 2 identifies the member.
* Step 3 identifies the member.

<!-- trace:case id=g10.store-wallet-member-card.TC-c4o rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC5-1: Pass words follow the phone's language or the default

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member) is on <grade10 membership url> on a phone that has <wallet>.
* The phone is set to <phone language>.

**Test data:**

| <wallet> | <phone language> | Words read in |
| --- | --- | --- |
| Google Wallet | Traditional Chinese | Traditional Chinese |
| Google Wallet | Japanese | English |
| Apple Wallet | Traditional Chinese | Traditional Chinese |
| Apple Wallet | Japanese | English |

**Steps:**

1. Click the action that adds a <wallet> pass.
2. Open the pass in <wallet>.
3. Read the words beside the name, tier and points.

**Expected Results:**

* Those words read in the row's language.

<!-- trace:case id=g10.store-wallet-member-card.TC-c1t rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC6-1: Pass says when what it shows was current

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
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with a live <wallet> pass) has the pass open on their phone.

**Test data:**

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Read the facts the pass shows.
2. Find when those facts were current.

**Expected Results:**

* The pass says when what it shows was current.

<!-- trace:case id=g10.store-wallet-member-card.TC-kba rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC7-1: Paid till spend reaches both wallets on the next sweep

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-06

**Pre-conditions:**

* customer(member with a live Google Wallet pass and a live Apple Wallet pass) is at the till.
* admin(shop staff) has a till session open for the member from their card on the site.
* The sale holds a line covering <points to spend>, and the member is the cart's customer.
* The sale carries no other discount.
* No automatic discount is active at the shop.
* Whether the spend marks the passes due: <due mark>.

**Test data:**

| Field | Value |
| --- | --- |
| <points to spend> | Points within the member's balance |

| <due mark> |
| --- |
| The spend marks the passes due |
| The spend's own due mark is blocked |

**Steps:**

1. Apply <points to spend> to the sale.
2. Take payment for the sale.
3. Wait for the first sweep beginning after the paid order lands.
4. Read what that sweep sent each wallet.

**Expected Results:**

* Each wallet is sent the points left after the spend.

<!-- trace:case id=g10.store-wallet-member-card.TC-qwt rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC8-1: Unrecorded change makes the pass due at its own instant

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
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

* customer(member with a live Google Wallet pass and a live Apple Wallet pass).
* <unrecorded change> happens before the passes' next daily floor, with nothing written.

**Test data:**

| <unrecorded change> |
| --- |
| Some of the member's points reach their expiry |
| The member's earned tier term runs out |
| An invitation holding the member's tier lapses |

**Steps:**

1. Read when the member's passes are next due.
2. Wait for the first sweep after <unrecorded change> to finish.
3. Read the tier and points that sweep sent each wallet.
4. Navigate to <grade10 membership url>.

**Expected Results:**

* Step 1 reads that change's instant, not the daily floor.
* Step 3's tier and points match what step 4 shows.

<!-- trace:case id=g10.store-wallet-member-card.TC-vfa rev=1 covers=g10.store-wallet-member-card.SC-sp1,g10.store-wallet-member-card.SC-hqf,g10.store-wallet-member-card.SC-szm,g10.store-wallet-member-card.SC-41b,g10.store-wallet-member-card.SC-3bj,g10.store-wallet-member-card.SC-4q3,g10.store-wallet-member-card.SC-7wr,g10.store-wallet-member-card.SC-xeb,g10.store-wallet-member-card.SC-fjc,g10.store-wallet-member-card.SC-95t,g10.store-wallet-member-card.SC-67b,g10.store-wallet-member-card.SC-yzv -->
### grade10-site-store-wallet-member-card-US6-TC9-1: Sweep with more due than it reads reports its oldest

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

* More passes are due than one sweep reads.

**Steps:**

1. Run one sweep.
2. Read what the sweep reports.

**Expected Results:**

* The sweep reports the age of its oldest due pass.

---

## grade10-site-store-wallet-member-card-US7: Member ends a pass they no longer want

**As a** member,
**I want** to end a pass and add a fresh one,
**so that** a phone I no longer have, or a code somebody photographed, stops working the moment I say so.

<!-- trace:case id=g10.store-wallet-member-card.TC-cyi rev=1 covers=g10.store-wallet-member-card.SC-jmq,g10.store-wallet-member-card.SC-e3j,g10.store-wallet-member-card.SC-sys,g10.store-wallet-member-card.SC-oc1 -->
### grade10-site-store-wallet-member-card-US7-TC1-1: Returning member sees the wallets they carry a pass in

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
* **Trace:** grade10-site-store-wallet-member-card-US-07

**Pre-conditions:**

* customer(member with a live Google Wallet pass and a live Apple Wallet pass).
* Both passes were added on an earlier visit.

**Steps:**

1. Navigate to <grade10 membership url>.
2. Read what the page says the member carries.

**Expected Results:**

* The page says the member carries both wallets' passes.
* The action that ends each pass is offered.

<!-- trace:case id=g10.store-wallet-member-card.TC-uwa rev=1 covers=g10.store-wallet-member-card.SC-jmq,g10.store-wallet-member-card.SC-e3j,g10.store-wallet-member-card.SC-sys,g10.store-wallet-member-card.SC-oc1 -->
### grade10-site-store-wallet-member-card-US7-TC2-1: Photographed code presented after its period identifies nobody

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
* **Trace:** grade10-site-store-wallet-member-card-US-07

**Pre-conditions:**

* customer(member with a live Google Wallet pass) is at the till with the pass open on their phone.
* admin(shop staff) has the Grade10 extension open at the till.

**Test data:**

| Field | Value |
| --- | --- |
| <code period> | The fixed period a Google Wallet pass's code changes on |

**Steps:**

1. Photograph the code the pass shows.
2. Wait more than one <code period> past the end of that code's own period.
3. Scan the photograph at the till.

**Expected Results:**

* Step 3 identifies nobody.

<!-- trace:case id=g10.store-wallet-member-card.TC-h33 rev=1 covers=g10.store-wallet-member-card.SC-jmq,g10.store-wallet-member-card.SC-e3j,g10.store-wallet-member-card.SC-sys,g10.store-wallet-member-card.SC-oc1 -->
### grade10-site-store-wallet-member-card-US7-TC3-1: Code presented twice inside its period is refused the second time

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
* **Trace:** grade10-site-store-wallet-member-card-US-07

**Pre-conditions:**

* customer(member with a live Google Wallet pass) is at the till with the pass open on their phone.
* admin(shop staff) has the Grade10 extension open at the till.

**Steps:**

1. Photograph the code the pass shows.
2. Scan the photograph at the till, inside that code's own period.
3. Scan the photograph again, still inside that period.

**Expected Results:**

* Step 2 opens a session for the member.
* Step 3 is refused.

<!-- trace:case id=g10.store-wallet-member-card.TC-z8r rev=1 covers=g10.store-wallet-member-card.SC-jmq,g10.store-wallet-member-card.SC-e3j,g10.store-wallet-member-card.SC-sys,g10.store-wallet-member-card.SC-oc1 -->
### grade10-site-store-wallet-member-card-US7-TC4-1: Ended pass identifies nobody and a new pass does

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-07

**Pre-conditions:**

* customer(member with a live <wallet> pass) is at the till, on <grade10 membership url>.
* admin(shop staff) has the Grade10 extension open at the till.

**Test data:**

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Click the control that ends the <wallet> pass.
2. Scan a code the ended pass shows at the till.
3. Click the action that adds a <wallet> pass.
4. Scan the new pass at the till.

**Expected Results:**

* Step 2 identifies nobody.
* Step 4 identifies the member.

<!-- trace:case id=g10.store-wallet-member-card.TC-wk2 rev=1 covers=g10.store-wallet-member-card.SC-jmq,g10.store-wallet-member-card.SC-e3j,g10.store-wallet-member-card.SC-sys,g10.store-wallet-member-card.SC-oc1 -->
### grade10-site-store-wallet-member-card-US7-TC5-1: Deleting a pass from the wallet leaves the membership intact

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
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-07

**Pre-conditions:**

* customer(member with a live <wallet> pass) is on <grade10 membership url>.

**Test data:**

| <wallet> |
| --- |
| Google Wallet |
| Apple Wallet |

**Steps:**

1. Note the membership, balance, tier and member card shown.
2. Delete the pass from <wallet> on the phone.
3. Reload <grade10 membership url>.

**Expected Results:**

* Membership, balance, tier and member card are unchanged.

---

## grade10-site-store-wallet-member-card-US8: Member spends points when the pass they carry cannot

**As a** member whose pass carries a durable code,
**I want** the counter to identify me from the pass and take the spend from my card on the site,
**so that** a code anybody could photograph never moves my points, and I still lose no time at the till.

<!-- trace:case id=g10.store-wallet-member-card.TC-lmf rev=1 covers=g10.store-wallet-member-card.SC-g3f -->
### grade10-site-store-wallet-member-card-US8-TC1-1: Apple Wallet session reads the panel but moves no value

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-08

**Pre-conditions:**

* customer(member with a live Apple Wallet pass) is at the till, and holds <reward_1>.
* admin(shop staff) has the Grade10 extension open at the till.
* The sale holds a line covering <points to spend>, and the member is the cart's customer.
* The sale carries no other discount.
* No automatic discount is active at the shop.

**Test data:**

| Field | Value |
| --- | --- |
| <points to spend> | Points within the member's balance |
| <reward_1> | A reward the member can collect |

**Steps:**

1. Scan the Apple Wallet pass at the till.
2. Try to spend <points to spend> in that session.
3. Try to collect <reward_1> in that session.

**Expected Results:**

* The member's panel is read.
* Step 2 is refused, and spending is not hidden.
* Step 3 is refused, and collecting is not hidden.

---

## grade10-site-store-wallet-member-card-US9: Operator ends a member's pass from the console

**As an** operator,
**I want** to end a member's pass from the console when the phone it was on is gone,
**so that** a member who cannot reach their own page is not left with a pass that still identifies them.

<!-- trace:case id=g10.store-wallet-member-card.TC-19a rev=1 covers=g10.store-wallet-member-card.SC-a5e,g10.store-wallet-member-card.SC-7ub,g10.store-wallet-member-card.SC-eyg -->
### grade10-site-store-wallet-member-card-US9-TC1-1: Operator ends one wallet's pass and the other keeps identifying

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(admin, holds store:write, reads the audit trail) is signed in to the admin console.
* customer(member with a live Google Wallet pass and a live Apple Wallet pass) has both passes on a test phone the tester holds, with the site's notifications allowed on it.
* The tester can read the member's email inbox.
* admin(shop staff) has the Grade10 extension open at the till.

**Test data:**

| <ended wallet> | <kept wallet> |
| --- | --- |
| Google Wallet | Apple Wallet |
| Apple Wallet | Google Wallet |

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Click the control that ends the member's <ended wallet> pass.
3. Confirm the ending.
4. Scan the <ended wallet> pass at the till.
5. Scan the <kept wallet> pass at the till.
6. Reload the member's record.
7. On <grade10 admin audit url>, read the newest row for the member.
8. Open the member's email inbox and the test phone's notifications.
9. As the member, navigate to <grade10 membership url>.
10. Click the action that adds a <ended wallet> pass.
11. Scan the new <ended wallet> pass at the till.

**Expected Results:**

* Step 1 names Google Wallet and Apple Wallet.
* Step 4 identifies nobody.
* Step 5 identifies the member.
* Step 6 names <kept wallet> alone.
* Step 7 names the operator, the member, <ended wallet> and step 3's time, and says a pass was ended.
* Step 8 holds no email and no notification about the ending.
* Step 9 shows no <ended wallet> pass carried, and offers adding one.
* Step 11 identifies the member.

<!-- trace:case id=g10.store-wallet-member-card.TC-5v6 rev=1 covers=g10.store-wallet-member-card.SC-7ub -->
### grade10-site-store-wallet-member-card-US9-TC2-1: Record names exactly the wallets carrying a live pass

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write) is signed in to the admin console.
* customer(member holding <member's passes>).

**Test data:**

| <member's passes> | <wallets named> |
| --- | --- |
| No pass, never added | None |
| A live Google Wallet pass only | Google Wallet |
| A live Apple Wallet pass only | Apple Wallet |
| A live Google Wallet pass and an ended Apple Wallet pass | Google Wallet |
| A live Google Wallet pass that replaced an earlier Google Wallet pass | Google Wallet, named once |

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Read the wallets the record names.

**Expected Results:**

* The record names <wallets named>, and no other wallet.
* An ending is offered for each named wallet, and none otherwise.

<!-- trace:case id=g10.store-wallet-member-card.TC-5tw rev=1 covers=g10.store-wallet-member-card.SC-6nw -->
### grade10-site-store-wallet-member-card-US9-TC3-1: Ending a pass no longer live ends nothing and says so

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin A(holds store:write) is signed in to the admin console.
* customer(member with a live Google Wallet pass and a live Apple Wallet pass).

**Test data:**

| <first ending> |
| --- |
| The member, clicking the control that ends the Google Wallet pass on <grade10 membership url> |
| admin B(holds store:write), ending the Google Wallet pass from the member's record |

**Steps:**

1. As admin A, open the member on <grade10 loyalty admin url>.
2. Have <first ending> end the member's Google Wallet pass.
3. As admin A, on the record open since step 1, click the control that ends the Google Wallet pass.
4. Confirm the ending.
5. Read the answer.
6. Reload the member's record.
7. On <grade10 admin audit url>, read the newest row for admin A's ending.

**Expected Results:**

* Step 5 says no Google Wallet pass was held.
* Step 5 reports nothing ended.
* Step 6 names Apple Wallet alone, still offering its ending.
* Step 7 names admin A, the member, Google Wallet and step 4's time, and says nothing was ended.

<!-- trace:case id=g10.store-wallet-member-card.TC-b06 rev=1 covers=g10.store-wallet-member-card.SC-7ub -->
### grade10-site-store-wallet-member-card-US9-TC4-1: Operator without store:write sees no wallets and no ending

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(opens the member's record, does not hold store:write) is signed in to the admin console.
* customer(member with a live Google Wallet pass and a live Apple Wallet pass).

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Read the member's record.

**Expected Results:**

* Step 1 opens the member's record.
* The record names no wallet.
* The record offers no ending.

<!-- trace:case id=g10.store-wallet-member-card.TC-r84 rev=1 covers=g10.store-wallet-member-card.SC-ts9 -->
### grade10-site-store-wallet-member-card-US9-TC5-1: Ending sent without store:write is refused and the pass stays live

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(support, does not hold store:write) has a signed-in admin console session.
* customer(member with a live Google Wallet pass).

**Steps:**

1. In the operator's session, send the request that ends the member's Google Wallet pass.
2. Read the API response.
3. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 2 is refused as forbidden.
* Step 3 shows the member still carries a Google Wallet pass.

<!-- trace:case id=g10.store-wallet-member-card.TC-4pc rev=1 covers=g10.store-wallet-member-card.SC-1an -->
### grade10-site-store-wallet-member-card-US9-TC7-1: Ending the operator declines ends nothing

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write) is signed in to the admin console.
* customer(member with a live Apple Wallet pass).

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Click the control that ends the member's Apple Wallet pass.
3. Read the confirmation.
4. Decline it.
5. Reload the member's record.
6. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 3 names Apple Wallet.
* Step 3 asks for no reason.
* Step 5 still names Apple Wallet, offering its ending.
* Step 6 shows the member still carries an Apple Wallet pass.

<!-- trace:case id=g10.store-wallet-member-card.TC-g2r rev=1 covers=g10.store-wallet-member-card.SC-3il -->
### grade10-site-store-wallet-member-card-US9-TC8-1: Record whose wallets cannot be read says so

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write) is signed in to the admin console.
* customer(member with a live Google Wallet pass).
* The member's wallets cannot be read.

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Read the member's wallets.

**Expected Results:**

* The record says the wallets could not be read.
* The record never says no wallet pass is saved.
* The record offers no ending.

<!-- trace:case id=g10.store-wallet-member-card.TC-7v3 rev=1 covers=g10.store-wallet-member-card.SC-6w0 -->
### grade10-site-store-wallet-member-card-US9-TC9-1: Operator ends a pass on their own member record

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write, is a member with a live Google Wallet pass) is signed in to the admin console.

**Steps:**

1. Open the operator's own member record on <grade10 loyalty admin url>.
2. Click the control that ends the Google Wallet pass.
3. Confirm the ending.
4. Reload the record.
5. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 1 names Google Wallet, offering its ending.
* Step 4 names no wallet.
* Step 5 shows no Google Wallet pass carried.

<!-- trace:case id=g10.store-wallet-member-card.TC-jac rev=1 covers=g10.store-wallet-member-card.SC-a5e -->
### grade10-site-store-wallet-member-card-US9-TC10-1: Shop staff holding store:write ends a member's pass

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(shop staff, holds store:write) is signed in to the admin console.
* customer(member with a live Apple Wallet pass).

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. Click the control that ends the member's Apple Wallet pass.
3. Confirm the ending.
4. Reload the member's record.
5. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 1 names Apple Wallet, offering its ending.
* Step 4 names no wallet.
* Step 5 shows no Apple Wallet pass carried.

<!-- trace:case id=g10.store-wallet-member-card.TC-e3d rev=1 covers=g10.store-wallet-member-card.SC-6nw -->
### grade10-site-store-wallet-member-card-US9-TC11-1: Ending sent for a wallet never added ends nothing

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
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(holds store:write, reads the audit trail) has a signed-in admin console session.
* customer(member with a live Google Wallet pass, who never added an Apple Wallet pass).

**Steps:**

1. In the operator's session, send the request that ends the member's Apple Wallet pass.
2. Read the API response.
3. On <grade10 admin audit url>, read the newest row for the member.
4. As the member, navigate to <grade10 membership url>.

**Expected Results:**

* Step 2 says no Apple Wallet pass was held, and nothing ended.
* Step 3 names the operator, the member, Apple Wallet and step 1's time, and says nothing was ended.
* Step 4 shows the member still carries a Google Wallet pass.

<!-- trace:case id=g10.store-wallet-member-card.TC-doc rev=1 covers=g10.store-wallet-member-card.SC-7ub -->
### grade10-site-store-wallet-member-card-US9-TC12-1: Wallets read without store:write is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(support, does not hold store:write) has a signed-in admin console session.
* customer(member with a live Google Wallet pass).

**Steps:**

1. In the operator's session, send the request that reads the member's wallets.
2. Read the API response.

**Expected Results:**

* Step 2 is refused as forbidden.
* Step 2 names no wallet.

<!-- trace:case id=g10.store-wallet-member-card.TC-it3 rev=1 covers=g10.store-wallet-member-card.SC-p9m -->
### grade10-site-store-wallet-member-card-US9-TC13-1: Ending ends a pass the member added after the record opened

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-wallet-member-card-US-09

**Pre-conditions:**

* admin(admin, holds store:write, reads the audit trail) is signed in to the admin console.
* customer(member with a live Google Wallet pass) has it on a test phone the tester holds.
* admin(shop staff) has the Grade10 extension open at the till.

**Steps:**

1. Open the member on <grade10 loyalty admin url>.
2. As the member, navigate to <grade10 membership url>, end the Google Wallet pass, and add a new one.
3. In the record opened at step 1, click the control that ends the member's Google Wallet pass.
4. Confirm the ending.
5. Scan the new Google Wallet pass at the till.
6. On <grade10 admin audit url>, read the newest row for the member.

**Expected Results:**

* Step 1 names Google Wallet.
* Step 5 identifies nobody.
* Step 6 says a pass was ended.

## Settled

- **An ending the audit trail fails to record** - the [Audit Trail](/p/grade10-admin/audit)'s rule for every elevated act: the act does not pass unrecorded. Its case is the platform's, not this suite's. The shipped ladder does not hold it yet: it appends after the act commits (`packages/worker/src/trpc.ts:429-444` in grade10), so a failed write fails the request with the pass already ended. That gap is in every elevated mutation, and is a grade10 bug for the bug rounds
- **A reason for an operator ending** - none typed; the cause is always the lost phone
- **A message to the member** - none; the member asked for the ending, and their own page shows the wallet no longer held
- **An attempt that ended nothing** - recorded on the audit trail as ending nothing
- **An ending refused for want of `store:write`** - not recorded; an elevated action refused for want of a permission never runs, so the store's trail writes nothing ([Audit Trail](/p/grade10-admin/audit))
- **An ending on the operator's own record** - allowed, as on any other member's
- **Confirming the ending** - the record asks, naming the wallet; declining ends nothing
- **An ending that fails before the store answers** - the console's confirm stays open with the failure, and the record goes on naming the wallet; a retry after an ending that did land says no pass was held. Its case is the shared confirm's, not this suite's
- **Proving a member saves a pass** - the save is US-06's, walked by `grade10-site-store-wallet-member-card-US6-TC1-1` on each wallet in staging

## Reconciliation

**Run:** 2026-10-06, QA1 blind feature pass in a fresh context. It read the delta's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md` with its `## Raised`, the [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) and [Audit Trail](/p/grade10-admin/audit) pages, `openspec/config.yaml`'s `context`, this suite above `## Reconciliation` with its `## Settled`, and the durable `grade10-site/store/domain-tcs.md`. It was denied every `## Requirements` section, `tech-design.md`, `tasks.md`, this section below this line, and `openspec/changes/archive/`. No change has a `ui-design.md`. It joined one result to `grade10-site-store-wallet-member-card-US9-TC5-1`, added no case, and raised R10 and R11.

**Run:** 2026-10-06, QA2 in a fresh context, after the QA1 pass above, against the shipped code in grade10 at `d38e0e7e93`. It read this suite, the delta's scenarios and feature set, `decisions.md`, `tech-design.md`, `tasks.md`, the [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) and [Audit Trail](/p/grade10-admin/audit) pages, the durable suite, the store domain suite, and the shipped code in grade10. Every case and every scenario is reconciled below, the Configuration group's included.

- **Agreed** - `grade10-site-store-wallet-member-card-SC-38` and `grade10-site-store-wallet-member-card-SC-65` are walked by US9-TC1: the ending, the audit row, no message, the new pass and the other wallet left identifying; US9-TC10 walks `grade10-site-store-wallet-member-card-SC-38` for shop staff, who hold `store:write` (Q2). `grade10-site-store-wallet-member-card-SC-63` by US9-TC2 for the wallets named, by US9-TC1's reload for a wallet leaving the list, and by US9-TC4 for an operator without `store:write`. `grade10-site-store-wallet-member-card-SC-62` by US9-TC5. `grade10-site-store-wallet-member-card-SC-64` by US9-TC3 for a pass ended first elsewhere and US9-TC11 for a wallet never added. `grade10-site-store-wallet-member-card-SC-66` by US9-TC7, `grade10-site-store-wallet-member-card-SC-67` by US9-TC8, `grade10-site-store-wallet-member-card-SC-71` by US9-TC9
- **Raised, landed** - an ending that fails before the store answers (Q23: the shared confirm stays open with the failure); a pass added after the record opened (Q24: the ending holds to the wallet); a typed reason (Q14: none); a message to the member (Q15: none); an operator ending a pass on their own record (Q17: allowed, now `grade10-site-store-wallet-member-card-SC-71`); which case proves a member saving a pass (Q19: the durable `grade10-site-store-wallet-member-card-US6-TC1-1`, walked in staging by task 8.3); an ending refused for want of `store:write` (Q20: not recorded, as for every refused elevated action outside the identity trail). No case changed
- **Raised, folded into spec** - an attempt that ended nothing is recorded as ending nothing (Q16), stated in the requirement and `grade10-site-store-wallet-member-card-SC-64`; US9-TC3 and US9-TC11 read the audit row. The record asks the operator to confirm, naming the wallet, and declining ends nothing (Q18, from the shipped console), stated as `grade10-site-store-wallet-member-card-SC-66`; US9-TC1 and US9-TC3 confirm their ending
- **Rejected** - US9-TC6, dropped: it held that an ending the audit trail cannot record does not take effect. The [Audit Trail](/p/grade10-admin/audit) page states that rule for every elevated act - a failed write fails the request rather than letting the action pass unrecorded - so its case is the platform's, not this capability's; the shipped ladder's gap is under Settled
- **Rejected, QA1's join** - US9-TC5 read the audit trail for no row after the refused ending. An elevated action refused for want of a permission never runs, so its trail writes nothing: the [Audit Trail](/p/grade10-admin/audit) page's rule for every elevated action, and Q20. Its case is the platform's, as for US9-TC6, so the step is dropped; Settled names it
- **Contradicted** - none: where a case and a scenario state the same behaviour they agree
- **Found by neither reading** - a record whose wallets cannot be read says so and never that none are held: shipped in grade10's console and its test, folded as `grade10-site-store-wallet-member-card-SC-67`. A request for the member's wallets without `store:write` is refused as forbidden: decided in Q5 and the technical design, which moves the read from `store:read` to `store:write` (task 2.4), and tested by task 2.1, but stated by no scenario and walked by no case. Folded into the requirement and `grade10-site-store-wallet-member-card-SC-63`, walked by US9-TC12. Three lines of the page's Launch Check that no scenario proved: a check naming each missing secret, now `grade10-site-store-wallet-member-card-SC-68`, which leaves both Google secrets unset; Grade10 passing before its issuer is recorded, now in `grade10-site-store-wallet-member-card-SC-69` beside ZZZ; and each wallet's secrets expected only where that wallet's issuer is recorded, which task 5.10 relies on when Google is enrolled weeks before Apple, folded as `grade10-site-store-wallet-member-card-SC-72`. No scenario proved `WALLET_APPLE_APNS_KEY` expected where an APNs key id is recorded, folded as `grade10-site-store-wallet-member-card-SC-73`
- **Cases added after a reconciliation** - US9-TC7 (`grade10-site-store-wallet-member-card-SC-66`), US9-TC8 (`grade10-site-store-wallet-member-card-SC-67`) and US9-TC12 (`grade10-site-store-wallet-member-card-SC-63`), written from the scenarios, so they are not blind. US9-TC9 to US9-TC11 record no reading of their own
- **Out of suite** - `grade10-site-store-wallet-member-card-SC-61`, `grade10-site-store-wallet-member-card-SC-68` to `grade10-site-store-wallet-member-card-SC-70` and `grade10-site-store-wallet-member-card-SC-72` to `grade10-site-store-wallet-member-card-SC-74` serve the Configuration group, which no journey walks: the launch check is a command only Engineering runs. They are decided by grade10's tests, task 3.1 - `scripts/secrets/status.test.mjs`, `packages/utils/test/config.test.ts` and the store backend's `walletPassSecrets` test - and run against every deployed store worker by task 7.1
- **Carried, not this change's** - `grade10-site-store-wallet-member-card-SC-12` is carried word for word in the modified requirement and walked by the durable `grade10-site-store-wallet-member-card-US1-TC3-1`
- **Levels** - the store domain suite traces US-06 and US-08, so the capability is a hit there. Its two cases walk a pass to a spend at the till, and this change moves no requirement on that path, so the proposal carries `No domain impact` and `No platform impact` lines rather than a domain case
- **Corrected** - US9-TC1 read only the member's email for a message about the ending; the site also reaches a member by notification on their phone, so step 8 now reads both. `grade10-site-store-wallet-member-card-SC-65` served US-09 under a title the journey does not carry; it now names the journey's own. US9-TC5 and US9-TC12 asked for an operator who reads the store without `store:write`, a role nobody holds: staff and admins hold both. They now sign in as support, which holds neither and is refused at the store's API. US9-TC4 cannot take support: the Members section needs `loyalty:read`, which support lacks (`apps/admin/grade10/src/sections.ts:134` and `packages/grade10-auth/contracts/src/schemas.ts:123-155` in grade10), and every role that opens a member's record holds `store:write`. It states the condition alone, plans `automation`, and is decided by the console's test, which mounts the record for such an operator; task 8.2 no longer walks it. US9-TC8 asserts no ending on an unreadable record, which the console's test did not: task 1.3 now adds that assertion before flipping it, as it adds the named-no-wallet one for US9-TC4. US9-TC1's manual row credited the store's suite with the whole audit row; it proves the operator, the wallet and the time, and the row's member subject and outcome are task 2's. No case moved

**Run:** 2026-10-06, QA2 rerun after the acceptance review's fixes, in the fix round. It read this suite, the delta's scenarios and feature set, `decisions.md`, `tasks.md`, the [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) page, the chain's add-account-profile delta on this capability, and `applePush.ts`, `deps.ts` and `membership.ts` in grade10 at `d38e0e7e93`.

- **Corrected** - the push key follows the worker's own rule (`applePush.ts:170-185` in grade10): it is expected wherever the Apple issuer is recorded and no `WALLET_APPLE_APNS` client certificate is bound, so `grade10-site-store-wallet-member-card-SC-70` proves a bound certificate expects no key, and `grade10-site-store-wallet-member-card-SC-61` that neither push credential fails, naming both
- **Renumbered** - this change's new scenarios take ids above every id add-account-profile issues for this capability, up to SC-60: the twelve that sat below it are now `grade10-site-store-wallet-member-card-SC-62` to `grade10-site-store-wallet-member-card-SC-73`, each keeping its trace id
- **Found by neither reading** - no scenario proved a missing Apple signing secret named, though the requirement names Apple's four: now `grade10-site-store-wallet-member-card-SC-74`, out of suite with the Configuration group and decided by task 3.1
- **Agreed** - every Configuration scenario serves the feature set's Launch check; no case's covers moved, and no case changed

**Run:** 2026-10-06, QA2 in a fresh context, after the rerun above. It read this suite, the delta's scenarios and feature set, `decisions.md` with its `## Raised`, `tasks.md`, the [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) page, the add-account-profile branch's delta on this capability, and `admin.ts:473-501` and `schemas.ts:150` in grade10 at `d38e0e7e93`.

- **Agreed** - every case and scenario as the runs above leave them. Each scenario this change adds is covered by a case's trace marker or listed out of suite, and each case traces US-09. US9-TC5 and US9-TC12 sign in as support, which holds no `store:` grant, so both are refused at the store's API
- **Agreed, read from the pass's state** - US9-TC5, US9-TC7, US9-TC9 and US9-TC10 read whether the pass is live from the member's page, not from a scan at the till. Only a live pass identifies anybody, so the page shows the scenario's outcome; US9-TC1 scans at the till
- **Ids** - `grade10-site-store-wallet-member-card-SC-38` keeps the id this change issued on main. `grade10-site-store-wallet-member-card-SC-61` to `grade10-site-store-wallet-member-card-SC-74` sit above SC-60, the highest id the add-account-profile branch issues for this capability. Every trace id is the capability's own, except `grade10-site-store-wallet-member-card-SC-12`'s, carried with its requirement
- **Raised** - nothing new; R1 stays open for Design and R2 for Product. No case changed

**Run:** 2026-10-07, QA2 in a fresh context, after the scenario for an ending of a pass added after the record opened and its case landed. It read this suite, the delta's Purpose, feature set and scenarios, `decisions.md` with its `## Raised`, `tasks.md`, the [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card) page, the stack's branches above this one, and `passes.ts:125-188` and `MemberCardSection.tsx:86-110` in grade10.

- **Agreed** - `grade10-site-store-wallet-member-card-SC-75` is walked by US9-TC13: the record opened before the new pass, the new pass identifying nobody after the ending, and the audit row saying a pass was ended. Q24, which the first QA2 run lists as landed, is now stated by the requirement and this scenario, so Settled no longer lists it
- **Agreed, the member's path** - US9-TC13's member ends the pass before adding a new one. The member's page offers no save in a wallet already held (`apps/frontend/grade10/src/pages/membership/sections/MemberCardSection.tsx:95` in grade10), so ending first is how a member reaches the scenario's new pass
- **Agreed, the anchors' wording** - the Purpose's operator sentence and the Launch check's "secret or record" move no case's covers: the record is the APNs key id, named by `grade10-site-store-wallet-member-card-SC-61`, out of suite with the Configuration group
- **Ids** - `grade10-site-store-wallet-member-card-SC-75` sits above SC-60, the highest id add-account-profile issues for this capability, and above every id another branch in the stack issues for it. US-09 and its US9 cases are this change's alone. The trace ids `SC-p9m` and `TC-it3` are issued nowhere else
- **Raised** - nothing new. R1 is handed to draw-wallet-save-artwork as Q12, and Q21, Product's, is deferred to the first change adding a second brand that issues a pass. No case changed

### Manual

No case is decided by an automated test yet. The tests that prove part of each, in these words:

- the store's suite - `packages/grade10-store/backend/src/testing/suites/posGateway.ts`, in the application repository
- the console's test - `apps/admin/grade10/src/pages/members/MembersPage.test.tsx`, in the application repository
- the grant test - `packages/grade10-store/backend/test/trpc/routers/walletGrants.test.ts`, in the application repository, task 2.1
- the walk - `apps/frontend/grade10/e2e/tests/admin/wallet-pass-ending.spec.ts`, in the application repository, task 8.2

| Manual | Why |
| --- | --- |
| `grade10-site-store-wallet-member-card-US9-TC1-1` | the store's suite proves the ending, the operator, the wallet and the time on the audit row, and the other wallet left live; the member as the row's subject and its outcome are task 2's; to be walked in the walk; a person scans both passes at a staging till, task 8.3 |
| `grade10-site-store-wallet-member-card-US9-TC2-1` | the store's suite proves the wallets held and none; the console's test proves no ending offered for none; to be walked in the walk |
| `grade10-site-store-wallet-member-card-US9-TC3-1` | the store's suite proves the nothing-held answer; the console's line and the audit outcome are task 2's; a person ends the pass from a second session first |
| `grade10-site-store-wallet-member-card-US9-TC4-1` | the console's test proves no ending offered without `store:write`; flipped once task 1.3 links it, asserting it names no wallet either |
| `grade10-site-store-wallet-member-card-US9-TC5-1` | the store's suite proves the refusal and the pass still identifying; flipped once task 1.3 links it |
| `grade10-site-store-wallet-member-card-US9-TC7-1` | the console's test for a declined confirmation is task 2's; to be walked in the walk |
| `grade10-site-store-wallet-member-card-US9-TC8-1` | the console's test proves an unreadable wallet is never called empty; flipped once task 1.3 links it, asserting it offers no ending either |
| `grade10-site-store-wallet-member-card-US9-TC9-1` | the store's suite for an ending on the operator's own record is task 2's; a person signs in as an operator who is also a member |
| `grade10-site-store-wallet-member-card-US9-TC10-1` | a person signs in as shop staff; which roles hold `store:write` is the console's role table, which no test here reads |
| `grade10-site-store-wallet-member-card-US9-TC11-1` | the store's suite for the nothing-held answer and its audit outcome is task 2's; flipped once task 2.5 links it |
| `grade10-site-store-wallet-member-card-US9-TC12-1` | the grant test, which fails until the read needs `store:write`, and the store's suite for a `support` operator's refused read are task 2's; flipped on the grant test once task 2.5 links it |
| `grade10-site-store-wallet-member-card-US9-TC13-1` | the store's suite for an ending after a new pass was added is task 2's; flipped once task 2.5 links it |
