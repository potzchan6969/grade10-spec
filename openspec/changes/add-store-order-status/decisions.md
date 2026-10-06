## Goals

- A collector reads one badge for where an order stands, and Your Orders and
  Order Details show the same one.
- Every combination Shopify can report reads as one of five badges, never a
  blank one.
- A partly refunded, held or voided order reads as what happened to it.

## Non-Goals

- A pickup badge, until Grade10's Shopify data tells a pickup order from a
  shipped one.
- Notifications: the notification centre owns its own spec and reads this rule
  later.
- Badges beyond the five, and thresholds a merchant sets.
- Carrier-confirmed delivery.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does Completed mean? | Fulfilled, paid and archived; never carrier-confirmed delivery, which the Store does not report | Delivered, a fact the Store holds no carrier confirmation for |
| Q2 | Does this delivery show a pickup badge? | No. The shared pill and its Figma set keep the `pickup` rung, because pickup is a confirmed later phase | Removing the rung, which a later phase would only add back |
| Q3 | How do the badges rank? | One ordered rule: a cancellation or a void first, then a refund unless the order is on hold or scheduled, then fulfilment; every other combination reads Processing | The source PRD's fifteen-step priority list, which resolved badges only, could not produce the notes its own tables showed, and contradicted those tables for a held order carrying a partial refund |
| Q4 | What does a combination no confirmed note fits carry? | Its badge alone | A generic note, which reassures with words nobody confirmed |
| Q5 | Does the rule write the note's words? | No. It names a note identifier, and the message catalogs hold the words in every language and brand | Copy in the rule, pinned to one language and one brand |
| Q6 | Does this change specify notifications? | No. The notification centre is named as a later reader of this rule | Specifying notifications here, ahead of the centre's own spec |
| Q7 | Can a merchant add badges or set thresholds? | No. Five badges, no settings | Merchant-configured badges, which no surface or collector has asked for |
| Q8 | Which facts can move the badge? | Order, payment and fulfilment state. Return state chooses a note only, because the refund already moves the badge and the return explains it - decided by the round | Return state as a fourth badge input, which would let a return with no refund change the badge |
| Q9 | Does Completed need the order paid? | Yes: fulfilled, paid and archived. A fulfilled, archived order not yet paid reads Shipped, as the page and the Completed requirement both say - decided by the round | Fulfilled and archived whatever the payment, which the rule's first draft said and the page did not |
| Q10 | Who says what each shared badge variant means? | Order Status. The shared `OrderHistoryStatus` keeps its six variants and the consumer's label, and this change modifies its requirement to drop the meaning column - decided by the round | Rewording only `completed` before archive, which publishes two contradicting contracts at acceptance and leaves two capabilities defining meaning |
| Q11 | Where does each fact come from, and what does a missing or unknown value read as? | Each fact names its Shopify source and a default; one rule reads any absent or unknown value as that default, without regard to letter case; `RETURNED` alone reads as returned - decided by the round | Lowercase values with no source and two overlapping default clauses that covered payment and fulfilment only |
| Q12 | Does a till sale read differently? | No. It reads through the same rules, and where an order was sold is not an input. The tech design checks how Shopify reports fulfilment and archiving for this shop's counter sales, and comes back to the product manager only if a paid counter sale never reaches fulfilled and archived - decided by the round | Origin as a fifth fact, the interim adapter's rule |
| Q13 | How is canceled spelled? | `canceled` in every value and identifier, as the badge spells it - decided by the round | Shopify's `cancelled` beside the badge's `canceled` |
| Q14 | Does this change show the note under the badge? | ❓ product manager, with the designer on where it sits - options: (a) yes: the page's note lines go 🚧, the designer draws the note state on `OrderHistoryStatus` and the Order Details status, a `ui-design.md` and a catalog-key group are added, and planning reruns from QA2; (b) no, but keep the rule: the three note lines become one 🚧 line saying the rule names one note per confirmed combination and no surface shows it in this delivery, and US-02 is reworded to what the collector gets; (c) no, and defer: the note requirement, US-02 and the partly-refunded and held measurement segment move to the change that adds the slot. Recommended: (a) if the designer can deliver the state before acceptance, otherwise (b) | Keeping the notes in the rule while the page's note lines stay ❓, which acceptance refuses; or shipping note identifiers and catalog keys that no surface renders |
| Q15 | Which orders does the badge cover? | ❓ product manager - recommended: Only orders Shopify holds. Your Orders lists a web checkout once the shop records it, as it already does for till sales, and the rule reads Shopify facts alone; the listing filter belongs to `add-grade10-customer-order-pages` | A pre-Shopify input where a failed or expired checkout reads Canceled and one still paying reads Processing, which adds a fact Shopify does not hold |
| Q16 | Where does a partly refunded order still waiting to ship sit in Your Orders? | ❓ product manager - recommended: Your Orders groups by the order's state, not its badge: past purchases are the orders Shopify has archived or canceled, so an open order stays with the orders needing attention whatever its badge | Grouping by badge, which moves an order still owed items out of the orders needing attention; or Refunded for a full refund only, which drops the refund-first rule |
| Q17 | Where is the source PRD whose thirty confirmed rows the rule reproduces? | ❓ product manager (@jeffffej0909) - recommended: File it under `docs/references/` and link it from the proposal and the page's decisions | Leaving the rows in a commit message, where no reader can check the note table against them |
| Q18 | Does a canceled order that took no money, or already got part of it back, carry `awaiting-refund`? | ❓ product manager (@jeffffej0909) - recommended: No. Note rule 2 covers payment `partially_paid` and `paid` only, unless a confirmed source row names `pending`, `authorized` or `partially_refunded` | Every payment not voided or refunded in full, which tells a collector whose card was only held, or whose money is already on its way back, that a refund is still to come |
| Q19 | Which badge does an order read when it is partly fulfilled, paid and archived? | Shipped. Completed needs every item fulfilled, and the page reads an order fulfilled in part as Shipped - decided by the page | Completed, which concludes an order still owed items |
| Q20 | Does an expired payment read Canceled? | No. It reads Processing with the `payment-expired` note: only a cancellation or a void reads Canceled, as the page says, and Shopify still holds the order open - decided by the page | Canceled, which tells the collector the order is gone while Shopify still holds it open |
| Q21 | Does a canceled order refunded in full carry `awaiting-refund`? | No. The money is already back, so it carries no refund note - decided by the round | `awaiting-refund`, which tells the collector a refund is still to come |
| Q22 | Which note does a held order carrying a partial refund carry? | `on-hold-partial-refund`, one note naming both, since a badge carries at most one note - decided by the round | The hold's note alone, which hides a refund the collector can see on a statement; or the refund's note alone, which hides why nothing ships |
| Q23 | How long may Your Orders and Order Details show different badges for one order? | Only until Your Orders loads again: both derive the badge from one stored row. A payment, refund or cancellation reaches the row within 5 minutes, because Shopify's payment webhook marks the order due for the next 5-minute cron read. A fulfilment, archive or return reaches it within the hour, and only for an order placed in the last 90 days; an older order is read again only after a payment change. The hour holds while the cron's 240 reads an hour cover the open orders; past that it reads the oldest check first and the batch is raised - decided by the round, in the tech design | Your Orders reading Shopify on every load, one Shopify read per order listed |
| Q24 | Does a change to an order Shopify already archived reach the badge within the hour? | ❓ product manager - recommended: No. The hourly read covers the orders Shopify holds open; an archived order is read again on a payment, refund, cancellation or fulfilment change. Reopening it is the only change that moves its badge, and a return moves no note without the refund that already marks it due | Reading every order placed in the last 90 days each hour, archived or not, past the cron's 240 reads an hour; or subscribing to Shopify's order-edit webhook, which fires on every change to an order |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/commerce/order-status | Accept review: the page and the collector's note journey promise a note under the badge, and no surface has a place to show it | Q14 |
| grade10-site/commerce/order-status | Accept review: a web checkout Shopify never recorded is listed in Your Orders and has no Shopify facts to read | Q15 |
| grade10-site/commerce/order-status | Accept review: a partly refunded order still owed items reads Refunded, and Your Orders sorts Refunded into past purchases | Q16 |
| grade10-site/commerce/order-status | Accept review: the source rows the note table claims to reproduce are not in the store | Q17 |
| grade10-site/commerce/order-status | Accept review: `awaiting-refund` reaches a canceled order whose payment is `pending` or `authorized` | Q18 |
| grade10-site/commerce/order-status | QA1 blind pass: an order partly fulfilled, paid and archived fits neither Completed, which needs it fulfilled, nor Shipped, which needs it not yet paid and archived. Which badge does it read? | Q19 |
| grade10-site/commerce/order-status | QA1 blind pass: does a partly paid order count as paid for Completed, or does a fulfilled, archived, partly paid order read Shipped? | Q9 |
| grade10-site/commerce/order-status | QA1 blind pass: an expired payment is neither voided nor paid. Does it read Canceled, like a void, or as an order not yet paid? | Q20 |
| grade10-site/commerce/order-status | QA1 blind pass: does a canceled order whose money already went back in whole carry `awaiting-refund`? | Q21 |
| grade10-site/commerce/order-status | QA1 blind pass: does a canceled order whose money already went back in part carry `awaiting-refund`? | Q18 |
| grade10-site/commerce/order-status | QA1 blind pass: a held order carrying a partial refund reads Processing. Which note does it carry, the hold or the partial refund? | Q22 |
| grade10-site/commerce/order-status | QA1 blind pass: Your Orders reads stored rows and Order Details may read Shopify. How long after a change in Shopify may the two show different badges? | Q23 |
| grade10-site/commerce/order-status | Accept review: the page said the two pages never disagree, Q23 said they may until Your Orders reloads, and neither the page nor a requirement stated how soon a change in Shopify reaches the badge | Q23 |
| grade10-site/commerce/order-status | QA2 reconciliation: the hourly read stops once Shopify archives an order, so an order reopened after archiving keeps Completed, past the hour the page allows for an order placed in the last 90 days | Q24 |
