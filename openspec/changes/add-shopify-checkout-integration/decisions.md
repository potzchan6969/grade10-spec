# Decisions

## Goals

- Send the current member basket and accepted tender from the drawer to hosted payment.
- Handle the existing checkout responses and show the order after return.
- Keep one payable invoice per member cart, and clear that cart the moment its invoice is paid.

## Non-goals

New APIs, provider recovery, request idempotency keys and dispatch recovery.
Reconciling a cart edit into an invoice already made. Public guest checkout, an
embedded card form and a separate checkout page.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When is the basket read? | At the two moments `grade10-site/store/cart-validation` states: when the cart opens, and at Pay, the drawer's Proceed to Checkout, where the existing server validation prices the order; the tender quote is the drawer's | A separate checkout page or a new backend validation flow |
| Q2 | Which Shopify flow is used? | Call the existing Draft Order hosted-invoice creation flow for each new Pay submission | An embedded form or a new provider flow |
| Q3 | Who uses public checkout? | The public frontend requires a signed-in member and uses authenticated checkout; existing operator surfaces and backend permissions remain unchanged | A public guest or typed-email frontend |
| Q4 | Where are shipping and tax calculated? | Shopify calculates them; the drawer shows an estimate | Presenting the drawer estimate as the final charge |
| Q5 | Who creates and binds the order? | The existing backend owns order creation and provider references without changes in this plan | New persistence or transaction work |
| Q6 | What happens on another Pay? | A new submission calls creation; on the unchanged cart it returns the cart's open invoice, after a cart edit it creates another. The control stays disabled while the current frontend request is pending | A second payable invoice for the same cart, or reuse keyed on a browser intent |
| Q7 | Who settles payment? | Existing webhook, reconciliation and order-read behavior remains unchanged; the frontend reads its results | A new backend settlement path |
| Q8 | What happens to the cart? | Payment clears the cart the invoice was made from, lines and tender, in the step that records the payment, whichever path learns of it. A cart the collector changed after Pay, or built after an earlier payment, is kept; the store's own review of the cart against the shop (a line lowered to stock, a new price or title) is not a change and does not keep it, decided 2026-10-07; frontend refreshes the resulting cart | Removing matching variant lines from whatever cart the member holds, which emptied a cart built after a late payment |
| Q9 | Who owns carrier rates? | Existing carrier configuration and behavior remain unchanged | Carrier implementation work in this change |
| Q10 | Where does confirmation return? | A static Grade10 Your Orders link on Shopify Thank You and Order status; reuse existing order surfaces | A purchase-specific link or a new checkout page |
| Q11 | Does reload reuse an intent? | No frontend intent persistence or replay is required; a later Pay is a new submission | A same-session purchase recovery contract |
| Q12 | What happens on refusal? | Present the existing named-line refusal or error and allow a fresh submission when the basket is ready | New backend refusal recovery |
| Q13 | What happens on response loss? | Show the existing failure or settling outcome; do not claim the frontend recovers the prior invoice or prevents duplicates | Provider lookup or dispatch recovery work |
| Q14 | What happens on a worker crash? | Keep the current backend behavior; no dispatch state, deadline or operator recovery flow is added | A new state machine |
| Q15 | What happens to an earlier payable invoice? | It stands while the cart is unchanged and is returned by the next Pay. The member's edit that changes the cart discards it at Shopify, after the edit is saved, so it can no longer be paid; later edits find nothing to discard, so Shopify is called at most once per Pay. An invoice the edit could not discard is discarded by the next Pay. The store's own review of the cart, a line lowered to stock or a new price, discards nothing; the next Pay replaces that invoice. Decided 2026-10-07; member edits only decided 2026-10-08 | Leaving it payable beside a new invoice, keeping it payable until the next Pay, or discarding it on the store's review of the cart |
| Q16 | What happens to edits during payment? | The invoice fixes the purchase. An edit makes it a different cart and discards the invoice; an invoice paid before its discard lands keeps the edited cart, and the next Pay makes a new invoice | Repricing the invoice, or a payment emptying the edited cart |
| Q17 | What is the delivery scope? | Frontend integration, plus the backend cart header that Q6, Q8, Q15, Q16 and Q20 need. No intent, replay or dispatch recovery | The previous backend intent/replay/recovery plan |
| Q18 | What if no matching order is returned? | Keep the existing order list, loading, error/Retry and empty/Shop now states; do not invent an order or add purchase recovery | A new return-specific missing-order flow |
| Q19 | Does verification add a shared drawer slot? | Reuse the existing drawer-host threshold message and account action; this integration adds no shared UI export or slot | A new inline drawer contract |
| Q20 | How is a member's cart held? | One active cart per member, counting each change to its lines or tender; an order whose lines are exactly that cart records which cart and which change it was made from. Staging carts are reset, not copied, as the store runs on staging only | Lines keyed by member with no cart of their own, which cannot tell a later cart from the one an invoice bought |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/checkout` | Is same-session intent reuse required? | Q11 |
| `grade10-site/store/checkout` | Is new refusal recovery required? | Q12 |
| `grade10-site/store/checkout` | Is provider-response recovery required? | Q13 |
| `grade10-site/store/checkout` | Is worker-crash recovery required? | Q14 |
| `grade10-site/store/checkout` | Must an earlier payable invoice close before another Pay? | Q15 |
| `grade10-site/store/checkout` | Do edits made during payment change the purchase or cart-release policy? | Q16 |
| `grade10-site/store/checkout` | Does this change add missing backend logic? | Q17 |
| `grade10-site/store/checkout` | Which state appears if Your Orders has no matching purchase? | Q18 |
| `grade10-site/store/checkout` | Does verification add a shared drawer slot? | Q19 |
| `grade10-site/store/checkout` | Must a late payment, through the re-check or an operator sync, leave a cart built afterwards alone? | Q8 |
| `grade10-site/store/checkout` | Does a second Pay on the same unchanged cart create a second invoice? | Q15 |
