# grade10-site/auction/notifications-order Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-13, tcs-rules r5

## Ungrouped

### g10.auction-notifications-order.US1: Post-close letters

<!-- trace:case id=g10.auction-notifications-order.TC-cm0 rev=1 -->
#### g10.auction-notifications-order.US1-TC61: Payment received letter lists USD lines then HKD Subtotal, fee and total

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
* **Testability:** manual
* **Trace:** Post-close letters

**Pre-conditions:**

* customer(winner settled in HKD, account language `<letter_language>`) has just paid `<hkd_order_1>` in full by card.
* The winner can open the Payment received letter in `<winner_mailbox>`.

**Test data:**

| Field | Value |
| --- | --- |
| hkd_order_1 | An HKD order paid by card; lines USD150 winning bid, USD30 Buyer's Premium, USD49 Shipping & Handling, USD20 Insurance, USD2 Tax; HKD card rule 3.4% plus HKD2.35 |
| winner_mailbox | The inbox of the winner's registered email address |
| subtotal_1 | HKD1970.35 (fixed: USD251 times 7.85, converted once) |
| fee_1 | HKD71.79 (fixed: the card gross-up of `<subtotal_1>` under the rule, rounded up to the next cent) |
| total_1 | HKD2042.14 (fixed: `<subtotal_1>` plus `<fee_1>`) |

| Row | `<letter_language>` |
| --- | --- |
| English | English |
| Traditional Chinese | Traditional Chinese |

**Steps:**

1. Open the Payment received letter in `<winner_mailbox>`.
2. Read the letter's lines, Subtotal, Payment Processing Fee and Order Total.
3. Open the attached receipt PDF.

**Expected Results:**

* The letter lists Winning Bid, Buyer's Premium, Shipping & Handling, Insurance and Tax in USD, in `<letter_language>`.
* It then shows Subtotal `<subtotal_1>`, fee `<fee_1>` and Order Total `<total_1>` in HKD with two decimals.
* Amounts use English grouping and punctuation whatever the language.
* The letter names no rate.
* The receipt PDF is the only attachment and prints the same Subtotal and Order Total.
