---
title: Commerce
spec: grade10-site/commerce/commerce
order: 1
---

How the storefronts sell: Shopify is each brand's product catalog, a payment provider collects the money, and every order of record lives in that store's own Postgres. Where account data lives: [Account Data](/platform/account-data).

## Parts

### Three source-only libs

- `@grade10/shopify-backend` is the transport toolkit; `@grade10/store-service` is the order machine. `@grade10/stripe-backend` is the auction's, not the store's
- The order machine's main barrel is worker-less, so a node lane can load it
- Each brand's worker is assembled from `@grade10/store-service/worker` by `createStoreWorker`; `apps/backend/<brand>/store` carries brand config only

### The order machine talks to a port, never a provider

- `@grade10/store-service` calls a `PaymentProvider` port; the one adapter lives in `src/adapters/shopify/`
- The toolkits stay ignorant of orders; the order machine stays ignorant of whose API answered

### Providers are an ordered registry

- Each brand's list in `packages/app-env` is ordered: the first takes new checkouts, the rest stay bound
- Every order records `payment_provider` at checkout and keeps it forever, so old orders reconcile and refund through whoever took their money
- Both brands name `["shopify"]` today. The registry is what would let a second provider arrive without moving a live order, which is the only reason it survives with one

## Catalog

### Display and pricing are different reads

- **Display** — the listing, its filter panel, the collections and a product's page answer over tRPC (`catalog.*`), read from the Storefront API on every request; nothing caches them since the public GET routes went, and the tags the product webhook still purges are tags no response publishes
- **A narrowing** — Shopify's own `search` narrows and counts by the facets the shop configured in Search & Discovery, trusted only when Shopify advertises the facet back; free text, the latest order and a shop with the facets unconfigured walk the whole catalogue through the worker instead, once per distinct query, and refuse past 5,000 products
- ❓ **The catalogue projection** — the listing, its count and its sidebar answer from the catalogue cut to what a query narrows, orders and counts on, held in the worker and rebuilt from Shopify 5 minutes after it was built, behind a response; a page hydrates the products it lists by id and keeps them 5 minutes; a collection and a product's page are one Shopify read a minute. On staging a narrowed listing answers in 0.2–0.4 s where it took 1.6–3.5 s — [the design note](/references/store-catalogue-index). Engineering confirms the release
- ❓ **A queryable index** — when a catalogue outgrows what one worker holds, the same projection lands in the store's own database and answers in one round trip; the design note carries it. Engineering, on a measured ceiling
- Checkout pricing always fetches live from the Storefront API — a cache can never set a charge amount
- Availability is checked when the cart is priced: a variant that does not
  sell rejects, and a cart asking past a count the catalog exposes
  (`quantityAvailable`, needs the product-inventory scope on the Storefront
  token) rejects before an order exists. A zero or missing count does not
  bound the cart — that is a shop selling untracked or on purpose past
  empty. The provider's clamp is the backstop: the quantity Shopify actually
  accepted is compared against the quantity asked for, and a cart Shopify
  shortened is refused rather than sold

### A copy the shop can always rebuild

- **Shopify down** — checkout down, and the listing with it
- ❓ **Derived, never authored** — every copy of the projection is what a Storefront read answered, and the next build rewrites it, so it is dropped and rebuilt rather than repaired; the shop stays the catalogue's owner, and no price or stock anyone pays on comes from it
- ❓ **Rebuilt by age, never fed** — nothing feeds the projection row by row, so a shop edit reaches the listing within 5 minutes and a card's price and stock within the same; a product's own page reads live
- ❓ **Never refused for a copy** — a worker holding no projection answers a facet, a price order or an unnarrowed latest from Shopify while it builds one; free text and a narrowed latest wait for the build, which is faster than the walk it replaced. A worker holding one keeps listing while Shopify is down
- The catalog client's error outcomes carry the query name, so the tail worker's metrics show exactly which reads are failing

### Money arrives as decimal strings

- Converted to integer minor units by string math over an ISO 4217 exponent table
- An unknown currency throws rather than guessing an exponent

### Shopify config per brand

- Shop domain, private Storefront token (`Shopify-Storefront-Private-Token`), API version pin, and the custom app's client secret for webhook HMAC (base64 over the raw body)
- A store charging through Shopify adds an Admin API token

## Checkout

### Priced server-side

- Client-supplied amounts never exist; a client names only variants, quantities, and site-relative redirect paths
- `createCheckout` prices every line live from the catalog

### The customer is created before first use

- Created once at the provider, ref stored in `payment_customers` before first use — a provider is never asked to match by email
- A provider with no customer concept answers `ensureCustomer` with `none` and nothing is stored

### One transaction, then the provider call

- The order and its items insert in one transaction; the provider checkout is created outside any transaction
- The checkout is created under the deterministic idempotency key `order:<orderId>`
- The order id is stamped wherever the provider will let us search for it later

### Shopify checks out through a cart and a redirect

- The adapter creates a cart from variant ids and redirects to `checkoutUrl`
- Shopify prices its own checkout, so the store's line amounts are a pre-check, not the charge
- `subtotal_minor` is what the store quoted; `total_paid_minor` is what the buyer was charged once payment settled; `goods_minor` is the goods out of that charge
- `order_events.amount_minor` is not the money: it is what the fact earns on — the qualifying goods on a settlement, the goods that came back on a refund. Everything that touches it says `earningMinor`, and analytics reads the order's own money instead. Three readers besides loyalty: a claim copies it into `order_claims.earn_basis_minor`, the stuck-events admin endpoint returns it, and the POS simulator prices a rehearsal's replay off it
- Shopify offers no embedded checkout (`client_secret` is null forever) and no per-cart return URL, so a paid buyer lands on Shopify's order status page

### Points pay through a draft order, not the cart

- A basket with points on it is priced by Shopify as a **draft order** carrying one merchant-applied fixed-amount discount worth exactly the points chosen, and the buyer pays its `invoiceUrl`. Everything else keeps the Storefront cart
- Points buy eligible goods only, capped at `min(chosen, spendable goods)` — never shipping, never tax, and never a gift card, which would mint itself
- The DraftOrder GID is the whole correlation, recorded as `payment_checkout_ref` before the invoice URL leaves the worker. An invoice-completed order carries no `cart_token`, so no webhook can bind it on the token alone — the paid webhook hands the order id it names to the same read the cron sweep runs, and that read settles the sale on the webhook's own round trip. The sweep is the net behind it
- **Nothing is ever held** — the order row records what was promised and no lot moves until settlement. A member starting another checkout retires the open promise instead, so the same points cannot be spent twice
- Capture is on `paid`, keyed on the order, for what the shop says it actually took off. A shop that applied less debits less; a shop that stated nothing debits nothing and says so
- Giving up on an unpaid invoice deletes the draft first. Deleted, it can never collect — which is `canceled`, and `canceled` is where the promise is given back. A draft Shopify refuses to delete has already collected, and the order settles instead
- A return of everything the sale is measured in — the goods the shop states, or the whole charge where it states none — gives every point back, once, keyed on the refund's own id. Only goods a refund states count towards it: an amount an operator types closes money without naming a good, and money is not evidence that one came home. Nothing is prorated either: the discount was spread over every line the shop sold, so no part of the sale carried it. A member who returns everything that earned and keeps a gift card is counted (`store.points_tender.return_held`) and paid back by hand

### Loyalty earns on the goods, not the whole charge

- A paid order's earning is the provider's own lines put through the eligible-goods rule, then this store's priced items, then the goods total the provider stated. Never the charge, and never the goods total where the lines answer: the rule drops a gift card and a grading fee, and the first rung is smaller than the last exactly where it does
- Earning on the charge would pay a buyer for their own delivery and make the rate depend on the shipping they picked; a discount they entered at checkout is theirs and lowers it
- A refund's event carries the goods that came back, priced the way the earn was — a refund of the delivery alone removes no points
- A refund that names no lines — an operator's amount, a total read back off the provider — gets the share of it that the earn basis is of the charge, and never more than the order earned on
- `total_paid_minor` and `refunded_minor` stay the money, and are what finance reads
- A settlement whose currency is not the order's is refused, counted, and never written: the amount is real but the unit is not this order's

### Who a checkout belongs to is decided at the edge, not in the machine

- `createCheckout` takes a user id and an email as arguments and asks nothing about where they came from, so the order machine is already identity-agnostic
- Three things make checkout a signed-in act: `authedProcedure` on the store's checkout procedures, `orders.user_id` being non-null, and `order_events.user_id` — which is the one that leaves the building, since it is the only identity loyalty and analytics ever see
- Guest checkout, if it is ever wanted, is those three plus an ownership proof and a claim flow — not a change to the machine. Matching a provider's customer by email stays out: a buyer types whatever they like into a hosted checkout
- Deferring it is free only while no order exists. Loyalty mints a member for any id handed to it and neither it nor Mixpanel has a merge primitive, so once real orders land, identities a later claim flow would want to reconcile are already accumulating. The store is signed-in-only until that decision is made deliberately
- The checkout URL is a bearer link: Shopify binds no session to it, so whoever holds it can pay, and the order settles to whoever created the cart. Nothing available here closes that, and recording the payer's email would not — it changes no ownership and no read path

### A settlement is bound to the cart that paid for it

- Shopify copies cart attributes onto the order, and a cart permalink lets a shopper write one, so the order id on a webhook is a claim
- The claim is honoured only for an order whose recorded checkout ref carries the event's `cart_token` — the handle Shopify minted when this store created the cart

## Orders

### One machine, every path

- States: `pending → processing → paid | failed | canceled | expired`, plus `paid → refunded` and `expired → paid`
- Transitions are idempotent single UPDATEs guarded by the current status
- Every path — synchronous confirm, webhook, reconcile, refund — goes through the same transition functions

### The recovery ladder is the only entry to repair

1. The recorded payment ref
2. The recorded checkout ref
3. Inside the provider's key-replay window (Shopify reports 0, so this rung never runs), a re-issue under the same `order:<id>` key returns the same object
4. Past the window, a search by order id
5. Found nothing: never re-mint — re-issuing a key past the replay window is how a buyer gets charged twice, so it is forbidden by construction

- The key accelerates recovery; the order-id index guarantees it

### Shopify climbs the ladder with two rungs empty

- It issues no idempotency key, so that rung reports 0; it indexes no custom attribute, so there is no order-id search
- The cart id is recorded before the buyer is handed a checkout URL, so an order with no recorded ref is one whose cart nobody could have paid
- The checkout-ref rung asks the Admin API, not the cart: `cart_token` is the one handle Shopify keeps on an order
- An unpaid cart says nothing the store's own expiry clock does not — and that clock is the store's, not Shopify's, which holds the cart on its own terms

### Webhooks accelerate, never gatekeep

- Each provider event is normalized by its adapter into a `PaymentEvent`, checked against `payment_events` for `(provider, event_id)`, applied, and only then recorded — so an event that fails midway is retried rather than deduped away. Every step it takes is idempotent, so a concurrent redelivery does the work twice and changes the order once
- Losing an event costs latency, not correctness
- An order edited after payment is heard as news, never as a settlement. Nothing follows `paid`, and the edit body states the edit's own money rather than what the buyer now owes — so the store records the divergence and leaves the recorded charge alone. A merchant's decision is not a number for a webhook to overwrite

### The reconcile cron repairs what webhooks missed

- `runReconcilePass` runs every 5 minutes and claims stale orders by `attempts`/`next_attempt_at` UPDATE — the claim is the lock
- Each claimed order resolves through the ladder, backs off exponentially, and gives up to `expired` after the cap
- Giving up stops the polling; it does not close the order. `expired` is the store's own conclusion, so `expired → paid` stays legal and a provider that collects later than the store waited still settles it. `canceled` is somebody deciding the order is over, and nothing reopens it
- Events older than 30 days are pruned
- A read of a stale pending order reconciles on the spot through the same ladder

### The money facts a settlement queues are drained by whoever settled it

- `order_events` rows are written in the transaction that changes the status, so the fact exists if the order moved. Delivery is a separate, at-least-once pass
- Three things ask the queue to move, and all three defer it on a connection of their own so nothing waits on a consumer: the provider webhook, the reconcile pass, and a buyer's own read of their order. Every settlement path drains what it queued — a `refunded` transition queues a claw-back exactly as `paid` queues an earn, and `queuesOrderEvent` is the one place that says which do
- Deferring only accelerates: the row is durable and the cron reaches it regardless, so a drain that never runs costs a buyer one tick, never their points
- Retries double from a minute to an hour; past the twelfth attempt the drain stops offering a row. `storeAdmin.orderEvents.retryStuck` is how a person hands them back once whatever refused them is fixed — it rewinds the count, so a released row gets the whole ladder again

### What to watch

Two failures lose money without moving a single failure counter: Shopify
refusing to answer the reconcile pass, and webhooks that stop arriving. Both
present as a quiet dashboard, because reconcile absorbs the settlements and
nothing counts a settlement landing.

- `commerce.order.settled` — fired where the webhook, the reconcile pass and a
  buyer's own page read all converge, and only when the guarded UPDATE matched.
  **Alert when the rate is zero.** This is the one monitor that catches money
  no longer landing, whatever the cause
- `commerce.order_event.undelivered` — the drain gauge, emitted every pass
  including zero. **Alert above a backlog threshold**, and above one refused
  fact's whole ladder: a row that keeps its place climbs for about six hours
  before it parks, holding `commerce.order_event.backlog_age_seconds` up with
  it, so a tighter threshold pages somebody for one sale. A stuck loyalty or
  analytics write is invisible otherwise
- `commerce.order_event.stuck` — events the drain has stopped offering after
  the attempt cap. Not a retry problem; only a person clears these, through
  `storeAdmin.orderEvents.retryStuck`, and they are excluded from the backlog
  age so one dead row cannot hide every real delay behind it
- `store.loyalty.unbound` — a store that declares a loyalty consumer and finds
  no binding. **Alert on any.** The fact stays queued rather than being marked
  delivered, so the backlog gauge rises with it
- `store.loyalty.unreachable` / `store.loyalty.mismatch` — the loyalty worker
  did not answer, or answered with a programme whose currency or basis is not
  the one this store sells in. **Alert on any**: both are deployment faults and
  neither clears itself
- `commerce.order_event.unreachable_abort` — a drain that stopped early on one
  of those. **Alert on any.** No row is parked and no rung is spent, which is
  the point — so `stuck` stays flat and this is the only signal that the queue
  is not moving
- `commerce.reconcile.provider_error` — a provider that would not answer.
  Dashboard, not an alert, until launch traffic shows the normal throttle floor
- `store.shopify_webhook.received` — flat while checkouts keep being created
  is the deleted-subscription signal, and tells "not arriving" apart from
  "arriving and failing"
- `commerce.order.abandoned` — one per abandoned cart, so at any normal
  abandonment rate this is the store's highest-volume counter. Read it as a
  ratio against checkouts created; alerting on the value pages on a good day
- `store.payment_webhook.unbound_claim` — a settlement claim with nothing
  corroborating it. Rising alone is an attack or a payload change, with
  reconcile covering the settlement; rising alongside `commerce.order.abandoned`
  means `cart_token` is gone platform-wide and the binding needs replacing
- `store.points_tender.unstated` / `store.points_tender.short` — a settled order whose points discount the shop states as missing, or as less than was promised. **Alert on any.** Both are the instrument misfiring on a sale a person has to find: `short` debits what the shop actually took and delivers; `unstated` debits nothing and keeps the fact queued, since the discount is re-read every pass and a delivered fact would leave the promise standing with nothing to reverse it
- `commerce.order.settlement_refused` — the shop says a sale collected and the row will not take it. On a points order (`points:true`) the promise is held against a sale nobody captured, so alert on that tag rather than on the counter
- `store.points_tender.release_failed` — a dead order that could not give its points back. **Alert on any**; the member is short until somebody releases it from the admin surface
- `commerce.order.amount_drift` — an order this store settled that the shop no
  longer states the same way: a merchant editing it after payment, or the
  webhook and the cron settling it with different charges. Every one is money
  recorded differently from what the shop holds, so each wants a person, not a
  threshold — dashboard until the normal rate is known

Emitting is not watching. Ship the first two as monitors and leave the rest on
a dashboard until there is a baseline — an alert that fires on a good day gets
muted, and a muted alert is worse than none.

### Refunds run the same ladder

- Key `refund:<orderId>`; refunds only move `paid → refunded`
- Money can come back in parts, which the status cannot hold: the order carries the running total, and each refund's own share goes out as an event
- A `PaymentRefundFact` names whether the provider reported a running total or only this refund's part, and the goods out of it — guessing would take money off the wrong order
- The event row's unique `source_ref` is the idempotency key for the money, so a delta is as safe to redeliver as a total
- A refund is named by the provider's own refund id on every path — this store's refund, the webhook, the reconcile pass — through one recorder. The pass reads the refunds the provider lists rather than minting a ref of its own, so whichever path arrives second records nothing; money the provider states a total for but names no refund behind is counted (`commerce.reconcile.unnamed_refund`) and not recorded, because a ref minted here is one nothing else will ever carry
- Refunds recorded before that rule — under `reconcile:<orderId>:<total>` — stand as they are: which of the provider's refunds they cover cannot be told, so a further refund on such an order is refused and counted (`commerce.order.refund_unkeyed_history`) rather than recorded twice
- The goods total only ever climbs — it is the sum of every delta emitted, and the per-line and pro-rated arms answer different numbers for the same money, so a lower answer arriving second would let the refund after it re-emit goods a claw-back already took
- Neither running total passes what the order took: the gross stops at the charge, the goods at what the earn was written on — `goods_minor` where the provider split it out and the store's own quote where it did not, which is the only bound an order with no split has. The excess is said out loud and counted (`commerce.order.refund_over_ceiling`, tagged by basis), the way a charge that no longer matches is
- Shopify offers no refund idempotency key: the adapter writes the caller's key as the refund note and looks for it on the order first, so a retry after a lost response finds its own refund

## Failure rules

### Only transport failure throws

- Business outcomes are discriminated unions
- A wire body the pinned API version cannot decode throws naming the query — a deploy fault, not an outcome
- Missing config throws naming the variable (`STORE_CURRENCY`, storefront origin, provider keys); staging and production fail loudly at first use, never degrade quietly
- Work that would hold a resource checks first: the reconcile cron calls `payments.assertReady()` before it opens a database connection

### No network call inside a database transaction

- Ever — this is why the checkout's provider call sits outside the order insert

### Webhooks verify before anything else

- Routes read the raw body first and verify the signature over those exact bytes
- Verifying needs the webhook secret and nothing else; the provider's API client is built on first API call, so a bad signature answers for the signature rather than failing on credentials it never touches
- A Shopify purge that cannot run answers non-2xx so Shopify retries — a webhook whose whole job is the purge must not claim success

## Development

### Dev without Shopify credentials

- No `SHOPIFY_PRIVATE_STOREFRONT_TOKEN` binds the fixture catalog — announced in the boot log, chosen explicitly, never a silent fallback
- `/dev/setup` seeds a paid and a pending demo order from it

### Tests run the real machine against fakes

- `FakeShopifyCommerce` sits behind the real adapter: scriptable outcomes, "call landed, response lost", a cart the fake turns into a paid order, and stock it will not sell past
- The fixture catalog drives the pglite lane; the cron and webhook routes smoke in the workers lane
- `FakePaymentProvider` covers the order machine itself — the parts that are true of any provider, and the second provider a registry with one binding would otherwise never exercise
- `FakePaymentProvider` drives the order machine with no toolkit at all, for specs that are not about a provider

## Frontends

### Two client ports, one schema

- The storefront webs own vertical slices (catalog, cart, checkout, profile) over a `ProcedureClient` for tRPC — the catalogue, cart, checkout and orders alike
- Each datasource decodes with the Effect Schema codecs the backend's `contract` module also enforces server-side, so a stale bundle against a newer router surfaces as a typed decode error naming the call
- The cart is client-owned (localStorage) until pricing rules demand a server cart; checkout re-prices everything server-side regardless

## Provisioning per brand

### Every brand

- A Shopify Dev Dashboard app (`read_products`) per shop, supplying the client id and client secret; webhook subscriptions registered via the Admin GraphQL API using a token traded for those credentials, never the admin UI
- A Headless sales channel installed per shop supplies the private Storefront token — a separate mechanism from the app, since custom apps stopped issuing static tokens themselves
- Secrets land as wrangler secrets; shop domain, client id, and version pins are vars

### Charging through Shopify adds

- `read_orders` and `write_orders` scopes, plus subscriptions for `orders/paid`, `orders/cancelled`, `refunds/create`, and `orders/edited`
- The Admin API has no deploy-time token: the worker trades `SHOPIFY_APP_CLIENT_ID` (var) and `SHOPIFY_APP_SECRET` (secret) for a token that expires in ~24h, cached and refreshed per isolate (`clientCredentialsToken.ts`)
- The Admin token stays off every path a shopper can reach; only the refund and reconcile paths touch the Admin API

## Q & A

- ❓ Why keep a catalogue index when the store does not own the catalogue?
  - A listing narrows, counts, orders and searches over the whole catalogue in one answer, and Shopify's own search answers only some of those shapes correctly; the rest walked the catalogue through the worker on every request. A copy the shop rewrites at will is the one store that answers every shape in one local round trip, and checkout never reads it.
- Why Checkout Sessions instead of raw PaymentIntents?
  - One server surface serves hosted, embedded, and Payment Element frontends; the UX can change without a backend change.
- Why does a refund's event carry the goods rather than the money that moved?
  - Loyalty earned on the goods, so a claw-back priced on the whole refund takes back points the tax and the delivery never paid for. The money stays on the order, as `refunded_minor`, which is what finance reads.

## Deferred

- Verifying the shop itself. Several behaviours only a real store can answer, and each one changes code rather than confidence: [the Shopify verification list](https://github.com/9gag/grade10/blob/main/docs/architecture/shopify-verification.md) says what they are, what each answer changes, and how to capture a real payload from a browser
- Cutting a brand over to Shopify — the adapter is built and both stores can bind it; it waits until that brand's app carries the order scopes and subscriptions
- Auction backend migrating onto `@grade10/stripe-backend` — it holds funds rather than charging them, so the commerce payment port does not fit and should not be forced on it
- Server cart and saved cards — each waits for the product need; nothing in the schema blocks them
