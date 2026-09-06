---
title: Identity
spec: grade10-site/store/account-identity
order: 8
---

A collector verifies who they are once, from their own account, and is
recognised wherever Grade10 asks: at a checkout or a bid of **HKD 120,000** or
more, and at a vault visit.

- **Where they stand** — verified until a day, expired, or not yet; read from
  the identity store the day the page is opened, whichever product verified them
- **The bar** — the order value and the bid value that ask for a verified
  identity, in the store's currency
- **Verify** — read what the provider will check, tick the agreement, press
  verify, and finish on the provider's page on this device; the result lands on
  its own
- **URL** — `grade10.com/profile`, the account page; the card is on it

:::flow{title="Verifying from the account"}
# On the account page

## Collector — Read what will be checked
The provider checks the ID document and takes a short selfie; Grade10 keeps the
document and the result, and uses it across its services; erasure on request.

## Collector — Tick the agreement and press Verify
Nothing reaches the provider before the box is ticked.

## Grade10 — Recognise a check already passed
A collector the vault verified is told so, and nothing is started.

# On the provider's page

## Collector — Complete the check
On this device, in the provider's own page.

## Provider — Decide
In its own time; the collector may close the page.

# Back at Grade10

## Grade10 — Apply the verdict
Under the two refusals every verified identity is held to.

## Collector — Read the account page
Verified, until the document's expiry.
:::

- **Nothing about the person** — the card names a standing and a day; no name,
  birth date, document or finding reaches the site
- **Declined** — the card says the check could not be completed online, names
  the counter as another way, and offers to try again; the reason stays with
  an operator
- **Erased with the account** — a check ends, keeps nothing about the person,
  and the provider is told to erase its copies

:::detail{title="Product decisions" for="pm"}
The store is the second host of a hosted check, after the vault, and the
first place a person verifies with nobody else involved.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Buying or bidding above the bar | Verifies once, from the account, and is not asked at the next high-value purchase. |
| Collector | Verified for a vault visit | Recognised on the site with no second ceremony. |
| Compliance | A sale above the bar | The account behind it holds a verified identity, with consent on record. |

**Not in scope.** Verifying a guest. Any identity field on the site.
Inviting by email from the store. Sanctions and watchlist screening.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Verified above the bar | Share of orders and bids at or above the bar placed by a verified collector. | Product |
| Recognised | Share of verifications reused rather than repeated. | Product |
| Drop-off | Share of checks started from the account that never decide. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The bar | Decided | HKD 120,000.00 on an order's goods and on a bid — the value at which a Hong Kong dealer in high-value goods has to know its customer. One value per brand. | Product |
| Consent | Decided | Explicit, on the page that starts the check, stamped on the check; the text names the document and face check, what is kept, reuse across Grade10, and erasure. A DPIA is completed before production. | Compliance |
| Reuse | Decided | One consent covers every Grade10 service; a check passed anywhere counts everywhere. | Compliance |
| Where the gate stands | Decided | At the storefront, before an order is written or the auction hears of a bid. | Engineering |
| Guests | Decided | Above the bar a guest signs in; a standing belongs to an account. | Product |
| ZZZ | Decided | Verifies nobody and gates nothing until a ZZZ product verifies somebody. | Product |

**Risks.** A collector reaching the bar for the first time at checkout meets a
verification they did not plan for; the card on the account page and the
recognition of a vault check are what keep that a one-time cost.
:::

:::detail{title="For engineers" for="engineer"}
- **The host** — `packages/grade10-store/backend/src/identity/`: the
  account as the case, the published lifecycle, the gate, the sweeps, the
  erasure
- **The card** — `@grade10/store-frontend/identity`, one slice; every word a
  prop until the application's submodule carries the `identity` catalogue
- **The gates** — `checkout.createCheckout`, `createCheckoutWithEmail` and
  `auction.placeBid` in the store's tRPC routers, on `identityGates` from
  `@grade10/app-env`
:::
