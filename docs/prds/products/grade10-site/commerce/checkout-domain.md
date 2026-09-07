---
title: Checkout Domain
order: 2
---

`checkout.<brand domain>` exists to host Shopify's checkout under our name.
Shopify serves the checkout and nothing else — every other path is redirected
to our own site, so the native storefront it comes with (theme home page,
collections, customer accounts) is never reachable there. A leak is anything
that renders Shopify's own site to a buyer.

Only Cloudflare can answer a request before Shopify does, and that needs the
record proxied — Cloudflare's Orange-to-Orange, which they document for
Shopify. Shopify cannot do it from their side: their URL redirects only fire on
broken URLs, and the one response-level lever they have — a redirect domain —
sends every path to the primary domain rather than per path.

## Values

Read them, never retype them: shop domains live in
`packages/app-env/src/store.ts`, base domains in
`packages/app-env/src/domains.ts`, the storefront in
`packages/app-env/src/sites.ts`, and the paths we redirect to in
`apps/frontend/grade10/src/surfaces.ts`. Nothing on this page is committed
config — every step is the Cloudflare dashboard or the Shopify admin.

| | staging | production |
| --- | --- | --- |
| Cloudflare zone | `grade10-stg.com` | `grade10.com` |
| Host | `checkout.grade10-stg.com` | `checkout.grade10.com` |
| CNAME target | `shops.myshopify.com` | `shops.myshopify.com` |
| Shopify shop | `grade10-staging.myshopify.com` | `grade10-2698.myshopify.com` |
| Everything → | `https://grade10-stg.com/store` | `https://grade10.com/store` |
| Accounts → | `https://grade10-stg.com/profile` | `https://grade10.com/profile` |

ZZZ takes the same shape once its shops exist — base `zzz.9jokes.com` /
`zzz.com`, storefront at `store.zzz.*`.

Run staging first and hold it through one certificate renewal before
production follows. A stalled renewal is the only failure this setup can
cause, and it does not show up on the day you make the change.

## Keep list

The redirects are written as "everything except this list". Get the list wrong
and checkout breaks, so it is the part to review, not the rules.

| Path | Why it has to reach Shopify |
| --- | --- |
| `/checkouts/*` | The hosted checkout, the thank-you page the order-link extension renders on, and the order status page |
| `/cart/c/*` | **The way in.** The Storefront API answers `cart.checkoutUrl` as `https://<shop>/cart/c/<token>`, which 302s into `/checkouts`. `packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts` hands that URL to every buyer |
| `/.well-known/*` | Certificate renewal (`acme-challenge`), Shopify's analytics beacon, the Apple Pay domain association file |
| `/wallets/*`, `/cdn/*`, `/services/*` | What checkout loads and posts to on the shop host rather than on `cdn.shopify.com` |

`/cart/c/*` is why a rule matching `cart` alone cannot ship: it would send
every buyer to the store page instead of to checkout. The last row is
precaution — settle it by watching a real staging checkout in the network tab
and adding anything on this host that comes back 302 to `/store`.

:::flow{title="Standing up the host"}
## *Operator* — **Connect the domain** while the record is DNS only
Shopify proves ownership over plain HTTP on `/.well-known/acme-challenge/*`
and issues the certificate there. A proxy in the way at this point is what
breaks it.

1. Cloudflare → the zone → **DNS → Records → Add record**: type `CNAME`, name
   `checkout`, target `shops.myshopify.com`, proxy status **DNS only**.
   Staging already has this record.
2. Shopify admin → **Settings → Domains → Connect existing domain**, enter the
   host, verify.
3. **Settings → Domains** → click the domain → **Change domain type** →
   **alias**. An alias serves under its own name. A redirect domain 301s every
   path to the primary domain, so nothing on the host serves at all — check
   this even on staging, where the record already exists.
4. Wait until Shopify shows the domain as SSL available. Do not continue
   before it does.

Enterprise zones only: a zone hold blocks Shopify from attaching the hostname
("The hostname is associated with a held zone"). Zone homepage → **Quick
Actions → Zone Hold** → off, or turn off just **Also prevent subdomains**.

## *Operator* — **Proxy the record**
Edit the same CNAME → proxy status **Proxied**. The target does not change.

A small Shopify icon appears beside the record. That icon is O2O engaging —
Cloudflare recognising the target as another Cloudflare zone and running our
zone first, theirs second. If it does not appear, roll back: a proxied record
without O2O is a plain origin fetch and the shop breaks.

## *Operator* — **Leave Always Use HTTPS off**
**SSL/TLS → Edge Certificates → Always Use HTTPS** stays **off**. It redirects
every request including `/.well-known/acme-challenge/*`, the path Shopify
renews the certificate over, so turning it on kills renewal quietly, weeks
later. Rule 4 below enforces HTTPS without touching that path.

## *Operator* — **Create the redirect rules**
**Rules → Overview → Create rule → Redirect Rule** (newer dashboards list
Redirect Rules directly under Rules). Pick **Custom filter expression** for
each. Rules are evaluated top to bottom and the first match wins, so the order
below is the configuration — a catch-all above a specific rule swallows it.

Staging values shown; swap the host and the two targets for production. Set
**preserve query string off** on all of them: a Shopify query string means
nothing on our pages.

Rule 1 — Shopify's customer accounts → our profile:

```
When:   http.host eq "checkout.grade10-stg.com"
        and (http.request.uri.path contains "customer_authentication"
             or starts_with(http.request.uri.path, "/account"))
Then:   static redirect → https://grade10-stg.com/profile
Status: 302
```

`/account*` rides along because it is the same leak — the classic customer
accounts pages, where `customer_authentication` is the new ones. We own
accounts; Shopify's must never render.

Rule 2 — the cart → our store:

```
When:   http.host eq "checkout.grade10-stg.com"
        and starts_with(http.request.uri.path, "/cart")
        and not starts_with(http.request.uri.path, "/cart/")
Then:   static redirect → https://grade10-stg.com/store
Status: 302
```

The exclusion is not optional — see the table above. This rule sends buyers to
the same place the catch-all does; it stays separate so the cart can be given
its own destination later without anyone touching the catch-all.

Rule 3 — everything else → our store:

```
When:   http.host eq "checkout.grade10-stg.com"
        and not starts_with(http.request.uri.path, "/checkouts")
        and not starts_with(http.request.uri.path, "/cart/")
        and not starts_with(http.request.uri.path, "/.well-known/")
        and not starts_with(http.request.uri.path, "/wallets/")
        and not starts_with(http.request.uri.path, "/cdn/")
        and not starts_with(http.request.uri.path, "/services/")
        and not starts_with(http.request.uri.path, "/password")
        and not starts_with(http.request.uri.path, "/api/")
        and not starts_with(http.request.uri.path, "/shopify_pay/")
Then:   static redirect → https://grade10-stg.com/store
Status: 302
```

`starts_with`, never `contains`: a collection called `checkouts-hoodie` would
match `contains "checkouts"` and leak the page this rule exists to hide.

Rule 4 — HTTPS for what is left, minus the validation path:

```
When:   not ssl
        and http.host eq "checkout.grade10-stg.com"
        and not starts_with(http.request.uri.path, "/.well-known/acme-challenge/")
Then:   dynamic redirect → concat("https://", http.host, http.request.uri)
Status: 301
```

Ship rules 1–3 as **302** and promote to 301 only once the destinations have
settled — browsers cache a 301 hard and you cannot take it back. Rule 4 is a
301 from the start; the host will never stop being HTTPS.

Nothing else goes on this host.

## *Operator* — **Verify** the host end to end
```bash
host=checkout.grade10-stg.com

curl -sI "https://$host/" | head -3                              # 302 → /store
curl -sI "https://$host/collections/all" | head -3               # 302 → /store
curl -sI "https://$host/products/anything" | head -3             # 302 → /store
curl -sI "https://$host/cart" | head -3                          # 302 → /store
curl -sI "https://$host/account/login" | head -3                 # 302 → /profile
curl -sI "https://$host/customer_authentication/redirect" | head -3   # 302 → /profile
curl -sI "https://$host/cart/c/test" | head -3                   # Shopify answers
curl -sI "http://$host/.well-known/acme-challenge/x" | head -3   # must NOT redirect
```

Then buy something end to end — staging pays through Bogus Gateway. Watch the
network tab for any request to this host that answers 302 to `/store`; each
one is a keep-list row missing from rule 3. Confirm the thank-you page renders
with the order-link extension on it, and that the link it shows goes to
`/profile/orders/<id>` on our site.

One flow to check on purpose: **click "Log in" inside checkout**. Rule 1 sends
that buyer to our profile page and their checkout is gone. That is the trade we
are making — we own accounts, Shopify does not — but confirm a plain email
checkout never touches `customer_authentication` on its own.

Cart permalinks (`/cart/<variantId>:1?attributes[...]`) are redirected here, so
run that check from [the Shopify verification list](https://github.com/9gag/grade10/blob/main/docs/architecture/shopify-verification.md) against the
`myshopify.com` host, not this one.

Come back to Shopify → **Settings → Domains** a day later, and again after the
next renewal, to confirm the domain still reads SSL available.
:::

## Rollback

Flip the record back to **DNS only**. Every rule stops matching and Shopify
serves the whole host again — one click, no deploy, no code. Do it the moment
Shopify reports a certificate problem.

## Host restrictions

- No Workers, Snippets, Page Rules or Transform Rules. Cloudflare marks each
  as compatible with caution on an O2O hostname: they can block the flow of
  visitors. Workers and Snippets are disabled on `/checkout` outright, so edge
  logic could never sit in a payment path here anyway.
- No cache rules. Caching on a customer zone in front of a SaaS provider is
  discouraged, especially HTML, and a cached checkout page is somebody else's
  order.
- Shopify calls a proxy in front of them unsupported however well Cloudflare
  documents it. That is the trade this page makes: real response-level
  redirects, against a support answer we may not get.

## Backing out of the proxy

The DNS-only fallback is a theme edit — `layout/theme.liquid` emitting a meta
refresh per `request.page_type`. Client-side, not a response code, and it
cannot cover the paths a theme does not render, but it costs nothing and
cannot touch a certificate.

## Reading

- Cloudflare, Shopify O2O guide:
  https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/provider-guides/shopify/
- Cloudflare, O2O product compatibility:
  https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/saas-customers/product-compatibility
- Shopify, domain type and target:
  https://help.shopify.com/en/manual/domains/domain-type
- Shopify, URL redirects (why this cannot be done there):
  https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect
