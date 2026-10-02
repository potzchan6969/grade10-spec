# Decisions

## Goals

- Send the current member basket and accepted tender from the drawer to hosted payment.
- Handle the existing checkout responses and show the order after return.
- Integrate the frontend without changing the backend.

## Non-goals

Backend or schema work, new APIs, provider recovery, request idempotency,
duplicate-invoice prevention, old-invoice cancellation and cart-edit reconciliation.
Public guest checkout, an embedded card form and a separate checkout page.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When is the basket read? | Use the drawer's continuous current review and quote; preserve the existing server validation at Pay | A separate checkout page or a new backend validation flow |
| Q2 | Which Shopify flow is used? | Call the existing Draft Order hosted-invoice creation flow for each new Pay submission | An embedded form or a new provider flow |
| Q3 | Who uses public checkout? | The public frontend requires a signed-in member and uses authenticated checkout; existing operator surfaces and backend permissions remain unchanged | A public guest or typed-email frontend |
| Q4 | Where are shipping and tax calculated? | Shopify calculates them; the drawer shows an estimate | Presenting the drawer estimate as the final charge |
| Q5 | Who creates and binds the order? | The existing backend owns order creation and provider references without changes in this plan | New persistence or transaction work |
| Q6 | What happens on another Pay? | A new submission calls the existing creation flow and may produce another invoice; disable the control while the current frontend request is pending | Reusing an invoice by intent or promising server deduplication |
| Q7 | Who settles payment? | Existing webhook, reconciliation and order-read behavior remains unchanged; the frontend reads its results | A new backend settlement path |
| Q8 | What happens to the cart? | Keep existing paid-transition cleanup: remove whole matching variant lines and clear cart tender; frontend refreshes the resulting cart | Quantity subtraction or reconciliation of edits made during payment |
| Q9 | Who owns carrier rates? | Existing carrier configuration and behavior remain unchanged | Carrier implementation work in this change |
| Q10 | Where does confirmation return? | A static Grade10 Your Orders link on Shopify Thank You and Order status; reuse existing order surfaces | A purchase-specific link or a new checkout page |
| Q11 | Does reload reuse an intent? | No frontend intent persistence or replay is required; a later Pay is a new submission | A same-session purchase recovery contract |
| Q12 | What happens on refusal? | Present the existing named-line refusal or error and allow a fresh submission when the basket is ready | New backend refusal recovery |
| Q13 | What happens on response loss? | Show the existing failure or settling outcome; do not claim the frontend recovers the prior invoice or prevents duplicates | Provider lookup or dispatch recovery work |
| Q14 | What happens on a worker crash? | Keep the current backend behavior; no dispatch state, deadline or operator recovery flow is added | A new state machine |
| Q15 | What happens to an earlier payable invoice? | Ignore it for this integration. Each new Pay uses the existing creation flow; no cancellation or retirement is added | Waiting for the earlier invoice to close |
| Q16 | What happens to edits during payment? | The invoice fixes the purchase; edits during payment are ignored and existing cart cleanup is unchanged | Repricing the invoice or preserving added quantity through new backend logic |
| Q17 | What is the delivery scope? | Frontend integration only. Logic absent from the existing backend is not added now | The previous backend intent/replay/recovery plan |
| Q18 | What if no matching order is returned? | Keep the existing order list, loading, error/Retry and empty/Shop now states; do not invent an order or add purchase recovery | A new return-specific missing-order flow |

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
