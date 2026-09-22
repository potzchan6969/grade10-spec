# grade10-site/store/wallet-member-card Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-wallet-member-card-US1: Member adds their card to a phone wallet

**As a** loyalty member,
**I want** to add my member card to Google Wallet or Apple Wallet,
**so that** I can scan it at the counter without opening the site.

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
