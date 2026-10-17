## 1. Purchase identity and reuse (grade10)

- [x] 1.1 Derive the order id from the member's cart, its version and the tender, so concurrent and repeated Pays reach one order through the primary key; a later attempt follows only an unpaid closure: `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-11`
- [x] 1.2 Review the basket live before answering a standing order, and answer a moved line as the review does: `grade10-site-store-checkout-SC-09`
- [x] 1.3 Answer a paid or refunded purchase with `terminal`, including from a tab still showing the cart its payment closed: `grade10-site-store-checkout-SC-19`
- [x] 1.4 Add `terminal` and `recoveryRequired` to the checkout result contract and resolve both to the order page in the storefront

## 2. Dispatch recovery (grade10)

- [x] 2.1 Add `orders.checkout_dispatch` (migration `0059_checkout_dispatch`) and claim the provider call `ready` → `dispatched` so one request asks the provider
- [x] 2.2 Tag every draft with its order and find it again by tag; refuse to guess between two: `grade10-site-store-checkout-SC-10`
- [x] 2.3 Recover a lost answer through the recovery ladder on the next Pay, recording the invoice found: `grade10-site-store-checkout-SC-10`
- [x] 2.4 Close an order whose request stopped before dispatch past the lease and dispatch the next attempt once: `grade10-site-store-checkout-SC-20`
- [x] 2.5 Send a dispatched order nothing names to `manual_review` at the reconcile give-up, hold the member's next Pay with `recoveryRequired`, and add `admin.orders.settleDispatch` to bind or cancel it: `grade10-site-store-checkout-SC-21`

## 3. Durable retirement (grade10)

- [x] 3.1 Bring a member edit's moved-past checkouts due in the edit's own transaction, and retire them in the reconcile pass; a shop review brings nothing due

## 4. Verification (grade10)

- [x] 4.1 PGlite service tests for repeat, concurrency, lost answer, paid replay, changed purchase, unpaid retry, stopped dispatch, manual review, operator bind and cancel, and the edit's due row (`test/services/checkoutIntent.test.ts`); Shopify provider and draft-client tag tests; storefront resolution tests
- [x] 4.2 Regenerate migrations and API docs; run backend, frontend and Shopify suites, type checks and lint
- [ ] 4.3 Operator screen for checkouts under review in store-admin — blocked: needs a design; `admin.orders.settleDispatch` is the API it would call
- [ ] 4.4 Observe a lost Shopify draft answer recovered by tag on the staging shop — blocked: needs staging Shopify access

## 5. The walk (grade10)

- [ ] 5.1 Walk US-01 in the browser: Pay twice, Pay from a second tab, reload after Pay, and Pay from a tab left on a paid cart, each opening one order — blocked: needs a running store worker against a Shopify shop; the PGlite service suite drives the same scenarios against the fake provider
