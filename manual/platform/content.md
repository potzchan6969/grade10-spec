---
title: Site Content
order: 3
---

Everything a storefront renders that is not a product, an order, or account data: navigation, legal pages, store locations, banners. Two homes, deliberately not three — structural content is code, merchandising content is a Shopify metaobject read like a catalog display read ([Commerce](/platform/commerce)).

## Choosing a home

### Who must be able to change it

- If only an engineer ever will, code is the cheapest correct answer — review, rollback, typecheck, and per-brand separation are already there
- A non-engineer needing to change it on their own schedule is the only thing that buys a store

### What breaks when it is wrong, stale, or unreachable

- A week-old banner is a marketing problem; a dead nav route is a 404; legal wording nobody can prove is a legal problem
- The worse the failure, the closer to code it belongs

### Where each kind lives

| Content | Home | Why |
| --- | --- | --- |
| Navigation, route structure | Code, beside the router | It is routing; a nav entry must typecheck against a real route |
| Legal pages (terms, privacy, returns) | Code | Legal review wants the diff, the approver, and the date git already keeps |
| Store locations | Code, per app | Structured reference data that must render when Shopify is down |
| Banners, campaign slots, product-linked editorial | Shopify metaobject | Merchandising: per-shop, campaign-timed, harmless when briefly stale |
| Translated strings for any of the above | `@grade10/i18n` | One translation pipeline, never two |

## Content in code

### A page owns what only it uses

- Locations live under `apps/frontend/<product>-store/src/pages/locations/` as a typed const, one file per brand
- Separate files in separate apps is the whole multi-brand story — no shop to keep aligned

### Split structured data from copy

- A map URL, a phone number, and coordinates are never translated; an address line or opening-hours prose may be
- The record stays in the app; its translatable strings are keys into the brand's catalog
- An address in `en.json` is a mistake that survives for years

### Legal text and legal acceptance are different records

- The wording lives in code
- Which version a person agreed to is a column on the order or account row that recorded the agreement
- Record acceptance before the first order — reconstructing it afterward is painful

## Content from Shopify

### A content read is a catalog display read

- Public GET routes publish with `edgeCache()` + `cacheTag()`, tag `content:<key>`, `maxAge` 300s
- Metaobject webhooks purge the tag; the TTL is the backstop, so a missed webhook costs minutes

### The browser never calls Shopify

- The Storefront token stays a worker secret
- The storefront reads content through the `ApiClient` port, decoded with the Effect Schema codecs the backend's `contract` module enforces — one definition, both ends checked

### One metaobject client, beside the catalog's

- It lives next to `createShopifyCatalog` in `@grade10/shopify-backend`, instantiated per brand with the same config
- Business outcomes are discriminated unions
- A body the pinned API version cannot read throws `ShopifyDecodeError` naming the query — a deploy fault, not an outcome

### Fail loud

- The purge webhook answers non-2xx when the purge cannot run, so Shopify retries — a webhook whose whole job is the purge must not claim success
- Without `SHOPIFY_PRIVATE_STOREFRONT_TOKEN` in development, the content port binds a fixture, announced in the boot log — chosen explicitly, never a silent fallback

## Q & A

- Why not decide by update frequency?
  - It is close to no signal; who must change it and what breaks when it is wrong are the questions that decide.
- Isn't a locations file the product mirror commerce.md rules out?
  - A mirror copies data Shopify owns and carries sync obligations; these files are the source of truth with nothing to sync against.
- Why does the structured half stay local instead of in the message catalog?
  - Catalog copy lives in the spec submodule, so a wording fix is a pull request there plus a pointer bump here — the right gate for legal text, pure friction for a phone number.
- Why so strict about metaobject decode failures?
  - A metaobject definition edited in the Shopify admin has no diff and no rollback; a loud failure on the next read is the only thing between a renamed field and a blank homepage.
- Why not put everything in Shopify and skip building any admin?
  - Two brands means two shops: metaobject definitions have no export, no migration, and no drift check, so every content type is hand-recreated per shop and diverges on the first added field.
  - Content shape leaves git: no review, no rollback, no atomic deploy pairing a frontend change with the shape it expects.
  - Copy gains a second translation pipeline beside the message catalogs, and nobody knows which one to edit.
  - It routes around our admin: a marketer seated in Shopify admin sits next to orders and customers under a coarser permission model, and the edit never reaches the hash-chained audit trail.
  - None of this argues against metaobjects for merchandising, where each cost is absent or worth paying.

## Open

- An admin-backed content tier — build at roughly twenty locations, or when the first franchise partner owns their own details
- Metaobject webhook topics — tag purge assumes `metaobjects/*` webhooks are on the plan; until confirmed, the TTL is the whole story and an edit takes minutes to appear
- Staging content — grade10 has `grade10-staging`, so a campaign can be staged there; ZZZ still has no shop of its own to stage against
