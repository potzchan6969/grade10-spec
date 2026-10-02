# grade10-site/auction/winner-order Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## winner-order-US1: Winner settles a won lot

**As a** winner,
**I want** to tell Grade10 where to ship and how I will pay, then pay the invoice it sends me,
**so that** the lot I won becomes mine inside a deadline I can see, priced for where it is actually going.

<!-- trace:case id=g10.auction-winner-order.TC-0p6 rev=2 covers=g10.auction-winner-order.SC-6nv,g10.auction-winner-order.SC-33a,g10.auction-winner-order.SC-awt,g10.auction-winner-order.SC-6if,g10.auction-winner-order.SC-w9w,g10.auction-winner-order.SC-k0e,g10.auction-winner-order.SC-4lu,g10.auction-winner-order.SC-yzf,g10.auction-winner-order.SC-2zt,g10.auction-winner-order.SC-uii,g10.auction-winner-order.SC-a2i,g10.auction-winner-order.SC-ifg,g10.auction-winner-order.SC-r65,g10.auction-winner-order.SC-la2,g10.auction-winner-order.SC-d5v,g10.auction-winner-order.SC-eq0,g10.auction-winner-order.SC-0vs,g10.auction-winner-order.SC-wah,g10.auction-winner-order.SC-0ex,g10.auction-winner-order.SC-rbe,g10.auction-winner-order.SC-l0b,g10.auction-winner-order.SC-sko,g10.auction-winner-order.SC-h7y,g10.auction-winner-order.SC-k1a,g10.auction-winner-order.SC-1hb,g10.auction-winner-order.SC-yc1,g10.auction-winner-order.SC-9nm,g10.auction-winner-order.SC-9ea,g10.auction-winner-order.SC-1d9,g10.auction-winner-order.SC-d74,g10.auction-winner-order.SC-gqs,g10.auction-winner-order.SC-11o,g10.auction-winner-order.SC-fm0,g10.auction-winner-order.SC-wsm,g10.auction-winner-order.SC-41c,g10.auction-winner-order.SC-ncd,g10.auction-winner-order.SC-uet,g10.auction-winner-order.SC-08s,g10.auction-winner-order.SC-es5,g10.auction-winner-order.SC-zit,g10.auction-winner-order.SC-pt5,g10.auction-winner-order.SC-12a,g10.auction-winner-order.SC-p5b,g10.auction-winner-order.SC-5r2,g10.auction-winner-order.SC-f6t,g10.auction-winner-order.SC-a0z,g10.auction-winner-order.SC-lth,g10.auction-winner-order.SC-41a,g10.auction-winner-order.SC-5xb,g10.auction-winner-order.SC-lyz,g10.auction-winner-order.SC-42u,g10.auction-winner-order.SC-nl8,g10.auction-winner-order.SC-f86,g10.auction-winner-order.SC-pgh,g10.auction-winner-order.SC-12v,g10.auction-winner-order.SC-km1 -->
### winner-order-US1-TC5-2: The winner's card holds nothing from bidding and one fresh charge settles

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-01

**Pre-conditions:**

* customer A(card linked) leads `<lot_1>`, bidding on the card on file.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot taking bids, led by customer A, closing within a minute |
| `<card>` | The card provider's test card `4242 4242 4242 4242`, any future expiry, any CVC |

**Steps:**

1. Wait for `<lot_1>` to close.
2. Read customer A's authorizations and charges for `<lot_1>` at the card provider.
3. Once the invoice for `<lot_1>` is sent, pay it by card through hosted Checkout with `<card>`.
4. Read customer A's card transactions for `<lot_1>` again.

**Expected Results:**

* Step 2 shows no authorization and no charge for `<lot_1>`.
* Step 3 opens hosted Checkout for the invoice total.
* Step 4 shows one charge, for the invoice total.

---

## winner-order-US6: Losing bidder gets their hold back when the lot closes

**As a** bidder who did not win,
**I want** the card hold my bids put there lifted as soon as the lot closes,
**so that** losing an auction does not leave my money reserved until the
authorization expires on its own.

### winner-order-US6-TC1-1: A losing bidder's card hold is released at the close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-06

**Pre-conditions:**

* customer A holds a card authorization for their bid on <lot_1>.
* customer B leads <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, bid on by customer A and led by customer B, about to close |

**Steps:**

1. Let <lot_1> close with customer B winning.
2. Read the authorization for customer A and <lot_1> at the card provider.

**Expected Results:**

* customer A's authorization is released, not left to expire.
* No charge is captured on customer A's card.

### winner-order-US6-TC2-1: Every hold a losing bidder's bids placed is released

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-06

**Pre-conditions:**

* customer A bid on <lot_1> more than once, each bid authorized on their card.
* customer B leads <lot_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot taking bids, with several bids from customer A, led by customer B, about to close |

**Steps:**

1. Let <lot_1> close with customer B winning.
2. Read every authorization for customer A and <lot_1> at the card provider.

**Expected Results:**

* No authorization for customer A and <lot_1> is left held.

## Settled

- A bid holds nothing on the card, so the close releases and captures nothing: the winner pays the invoice through hosted Checkout, and a losing bidder reads on My Auctions that their card was not charged (decisions Q1, Q2).

## Reconciliation

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `winner-order-SC-15` and `winner-order-SC-35` by `winner-order-US1-TC5-2`: nothing was held from bidding, and one charge pays the invoice through hosted Checkout; `winner-order-SC-26` and `winner-order-SC-27` lose the hold release only, and their coverage is as on main
- **Revised** - `winner-order-US1-TC5-2`: QA1 kept the id, but the case no longer reads a hold released, so it moves up a revision; its marker drops `winner-order-SC-12`, `winner-order-SC-13` and `winner-order-SC-14`
- **Deprecated** - `winner-order-US6-TC1-1` and `winner-order-US6-TC2-1`, with `winner-order-US-06`; a losing bidder reads that their card was not charged on My Auctions, `grade10-site-auction-account-record-US4-TC1-2`
- **Raised** - none
- **Contradicted** - none
- **Uncovered anchors** - none
