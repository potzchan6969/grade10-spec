# Site localization

**Author:** @seankcw - 2026-08-19

## Why

Both brands speak English to collectors who don't. The grade10 site serves a
Hong Kong collector base — its store charges HKD — yet every page, every
button, and the login email render in English only, with the document itself
declared `lang="en"`. ZZZ is a Korean-market brand whose entire site,
including the login email its own auth service sends, addresses Korean
collectors in English.

The plumbing already half-exists and proves the intent: the message catalogs
carry a partial Traditional Chinese translation nothing renders, the site
chrome ships a locale switcher no application wires, and the auth service
already reads a locale for the login email that no page ever sets. Crawlable
public pages have since made grade10's marketing, store, and auction
indexable — in English alone, invisible to the Chinese-language search that
its collectors actually use.

**Metric:** share of grade10 sessions rendered in Traditional or Simplified
Chinese, from zero today. **Acceptance signal:** the ZZZ site and its login
email render entirely in Korean, and a Chinese-language search can land a
collector on a Chinese-language grade10 page.

## What Changes

- **Each brand states its languages.** grade10 speaks English (default),
  Traditional Chinese, and Simplified Chinese; ZZZ speaks Korean only. Every
  user-facing string on a brand's site comes from that brand's message
  catalogs — no surface carries its own hardcoded copy.
- **One vocabulary, per-brand voices.** The surfaces both brands share
  (store, sign-in) name their strings once; each brand answers every name in
  its own languages. A brand with a single language has no fallback, so its
  catalog must be complete — a missing string is caught before it ships,
  never shown as a raw key.
- **grade10 resolves the locale, then remembers it.** A first visit follows
  the browser's languages; an explicit pick in the site chrome's locale
  switcher wins from then on, across the whole site and on return visits.
- **grade10's public pages get Chinese addresses.** The public surfaces the
  build writes a document for answer at locale-prefixed addresses (`/tc/...`,
  `/sc/...`, English unprefixed), each serving its copy in that language
  without scripts, declaring its alternates, and appearing in the sitemap —
  composing with crawlable-public-pages rather than reopening it. A surface
  rendered when its address is asked for — a card's page — keeps its one
  address and renders the locale the request carries, since which addresses
  it answers is the catalogue's to say and the build cannot enumerate them.
- **ZZZ simply becomes Korean.** One locale means no switcher, no
  negotiation, no prefixes: every page and the login email render in Korean,
  and the document says so.
- **The login email speaks the page's language.** A sign-in started from a
  Chinese-language page arrives as a Chinese email; ZZZ's arrives in Korean.
  The auth service already accepts the locale — the sites start supplying it.

## Non-Goals

- **Admin panels.** Both stay English; staff tooling is its own decision.
- **Translating commerce content.** Product titles, auction lot names, and
  anything else arriving from a live service render in their source language.
  Catalogs cover the platform's own copy.
- **A server-side language preference.** The locale lives with the browser
  and the address, not on the account. A signed-in collector on a new device
  re-resolves from the browser.
- **Locale-prefixed addresses for ZZZ, session-shaped surfaces, or rendered
  ones.** One-language ZZZ needs none; grade10's profile and sign-in are
  already out of crawler scope and stay unprefixed. A card's page is public
  but rendered per address, so it gains no prefixed variant and no sitemap
  entry — an indexable Chinese address for one card is follow-up work wanting
  a sitemap the worker renders, which `grade10-site/store/product-page` already
  names and this change does not open.
- **Translation tooling.** No translation-management system, no extraction
  pipeline. Translations land engineer-drafted, flagged for native review;
  the review itself is follow-up work, not a requirement here.
- **New date, time, or money behavior.** Those capabilities already accept a
  language input; this change supplies it and adds nothing to them.

## Capabilities

### New Capabilities

- `shared/localization`: which languages each brand speaks, where every user-facing
  string comes from, how a locale is resolved, remembered, and carried in
  public addresses, and which language the login email arrives in.
  Cross-cutting, beside `shared/dates-and-times` and `shared/money-amounts`.

### Modified Capabilities

None. `grade10-site/site/crawlable-pages` keeps every requirement it has — the
localized public addresses extend its guarantees per locale rather than
amending them. `grade10-site/store/product-page` keeps its sitemap requirement
untouched, which is why the prefixes stop at the surfaces the build writes a
document for. `shared/ui/site-chrome` already specifies the locale control
this change finally wires.

## Impact

- **This repository** — `packages/i18n` is restructured brand-first: one
  message vocabulary, catalogs per brand and locale (grade10 en/zh-Hant/
  zh-Hans, zzz ko), a per-brand registry, and completeness enforced for
  fallback-less brands. No design-system or `packages/ui` change: the chrome's
  locale switcher and the primitives it needs already exist.
- **grade10 SPA (`apps/frontend/grade10`)** — locale resolution and
  persistence, the wired switcher, translated rendering everywhere, the
  locale-prefixed public addresses with their prerendered documents, sitemap
  entries, and alternates, and the locale a rendered surface reads off the
  request it is answering.
- **ZZZ SPA (`apps/frontend/zzz`)** — renders from the Korean catalog with a
  Korean document declaration; the display-only locale label in its chrome.
- **Shared frontend packages** — the auth and store feature surfaces render
  their strings through the message vocabulary instead of hardcoded copy.
- **Backend services** — the ZZZ auth service swaps its hardcoded English
  email catalog for the brand's Korean one. That catalog lands in this
  repository's brand-keyed `packages/i18n` as an interim home: ZZZ's copy
  moves to `external/zzz-spec` when that submodule lands, as
  `docs/architecture/multi-product.md` states, and being brand-keyed here is
  what makes that a move rather than a rewrite. The locale seam the auth
  services already expose is unchanged.
- **Deployment** — nothing new ships; the same apps deploy the same way.
