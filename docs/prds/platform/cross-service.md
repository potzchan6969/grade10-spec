---
title: Cross-Service Work
order: 3
---

What every backend-to-backend edge in this repo is, and which shape a new one takes. The rule a caller follows is in [the backend conventions](https://github.com/9gag/grade10/blob/main/docs/conventions/backend.md); this file is the map and the worked example.

There is no message bus and no Cloudflare Queue. An edge is a service binding, and a queue here is a state row with `attempts` and `next_attempt_at` that a cron re-reads.

## The edges

Twenty-three bindings: eight are auth, nine are a gateway's, and the taxonomy below is about the other six — the only cross-service decisions this platform has actually made.

| Caller | Callee | Entrypoint | Shape |
| --- | --- | --- | --- |
| store | loyalty | `CommerceEntrypoint` | Tell-push, and Ask for the join |
| loyalty | store | `MembershipEntrypoint` | Ask |
| store | auction | `Grade10AuctionService` | Ask, and Tell-pull for push |
| zzz store | auction | `ZzzAuctionService` | the same, one brand over |
| vault | appointment | `VaultAppointmentService` | Ask |
| vault | e-kyc | `VaultKycService` | Ask |
| every service but auth | auth | default | Ask |
| each brand's gateway | that brand's services | default | routing, not an edge |

auth binds nothing — it is the sink of the graph, not its root.

## Shapes

### Ask when the caller cannot answer its own request

Synchronous RPC, inside the request. The answer is renderable: a refusal is a value the surface draws, never a 500. The auction router, `resolveBrowsingSession` and the POS acts are all this.

### Tell-push when the fact is the caller's and the consumer must not miss it

The fact is written in the same transaction as the state change that made it true, and delivery is a separate at-least-once pass claimed off the row. The consumer is a function the brand supplies, so the producing library never names it — `order_events` is the worked example ([Commerce](/p/grade10-site/commerce/commerce)).

Two things a queued consumer must get right, and the compiler holds it to both: it answers a total verdict, so a refusal it swallowed cannot read as a delivery; and it answers `unreachable` for a fault about the deployment rather than the row, so a binding nobody wired does not burn every queued fact's ladder before somebody notices.

### Tell-pull when the producer must not hold a binding to the consumer

The consumer's cron claims; the producer stamps as it hands over. At most once by design, so it is paired with a durable second channel or the loss is accepted. `claimDuePushNotifications` is the live one: the storefront owns the origin, the keypair and the subscriptions, and the auction owns none of them ([Auction Service](/platform/auction-service)).

The reason is not that a cycle is impossible — store and loyalty are one, and it is declared in [the membership and POS plan](/references/shopify-membership-pos). It is that a cycle costs a deploy-order coupling, and pulling also makes the brand split structural: a storefront that never calls gets nothing, with no flag naming it.

## The same call, opposite policies

These two are the poles of the refusal rule, and they disagree on purpose.

```ts
// packages/grade10-store/backend/src/services/loyalty/sink.ts
// A queued money fact. A refusal is a fault, or the drain marks it delivered
// and the points are gone; a fault about the deployment stops the pass.
throw new Error(`loyalty refused ${event.kind}: ${code} — ${result.error}`);
return "unreachable";

// packages/loyalty/backend/src/shopify/pos/loyalty.ts
// A till, mid-sale. A fault is a value, or a counter dies over another
// worker's outage — the refusal renders as a card the staff can read.
return { ok: false, code: "UNREACHABLE", error: message };
```

## Adding one

1. Put the surface in the callee's `contracts` package, with a `*ServiceBinding()` narrowing; the entrypoint class `implements` it, so drift breaks the owning package's build.
2. Mint a **new named entrypoint** if the surface grants something — the binding is the grant.
3. Add the binding to the caller's `wrangler.jsonc` in every environment block, and run `cf-typegen`.
4. Test it with an auxiliary worker, not a function binding: `serviceBindings` declared as functions are fetch-only and cannot serve RPC ([Testing Lanes](/platform/testing)).
5. If it is a new service rather than a new edge, register it in `packages/app-env` ([frontend-backend conventions](https://github.com/9gag/grade10/blob/main/docs/conventions/frontend-backend.md)).

## Q & A

- Why is the retry curve shared but the attempt cap not?
  - The curve is arithmetic every claim agreed on already. The cap is how many times *this* queue is willing to ask, which is its own policy — and a shared one would make retuning the store's delivery silently retune loyalty's fulfilment.
- Why does a queued consumer answer `unreachable` instead of throwing?
  - A throw is about the row and costs it a rung. A binding that is missing, or a programme whose currency disagrees with the store's, is about neither this row nor any other — so nothing should pay for it.
