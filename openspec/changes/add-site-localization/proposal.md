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
already reads a locale for the login email that no page ever sets. The
crawlable-public-pages change is about to make grade10's marketing, store,
and auction indexable — in English alone, invisible to the Chinese-language
search that its collectors actually use.

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
- **grade10's public pages get Chinese addresses.** The public surfaces
  answer at locale-prefixed addresses (`/tc/...`, `/sc/...`, English
  unprefixed), each serving its copy in that language without scripts,
  declaring its alternates, and appearing in the sitemap — composing with
  crawlable-public-pages rather than reopening it.
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
- **Locale-prefixed addresses for ZZZ or for session-shaped surfaces.**
  One-language ZZZ needs none; grade10's profile and sign-in are already out
  of crawler scope and stay unprefixed.
- **Translation tooling.** No translation-management system, no extraction
  pipeline. Translations land engineer-drafted, flagged for native review;
  the review itself is follow-up work, not a requirement here.
- **New date, time, or money behavior.** Those capabilities already accept a
  language input; this change supplies it and adds nothing to them.

## Capabilities

### New Capabilities

- `localization`: which languages each brand speaks, where every user-facing
  string comes from, how a locale is resolved, remembered, and carried in
  public addresses, and which language the login email arrives in.
  Cross-cutting, beside `dates-and-times` and `money-amounts`.

### Modified Capabilities

None. `grade10-site/crawlable-pages` (in flight) keeps every requirement it
has — the localized public addresses extend its guarantees per locale rather
than amending them, and this change depends on it landing first.
`shared-ui/site-chrome` already specifies the locale control this change
finally wires.

## Impact

- **This repository** — `packages/i18n` is restructured brand-first: one
  message vocabulary, catalogs per brand and locale (grade10 en/zh-Hant/
  zh-Hans, zzz ko), a per-brand registry, and completeness enforced for
  fallback-less brands. No design-system or `packages/ui` change: the chrome's
  locale switcher and the primitives it needs already exist.
- **grade10 SPA (`apps/frontend/grade10`)** — locale resolution and
  persistence, the wired switcher, translated rendering everywhere, and the
  locale-prefixed public addresses with their prerendered documents, sitemap
  entries, and alternates.
- **ZZZ SPA (`apps/frontend/zzz`)** — renders from the Korean catalog with a
  Korean document declaration; the display-only locale label in its chrome.
- **Shared frontend packages** — the auth and store feature surfaces render
  their strings through the message vocabulary instead of hardcoded copy.
- **Backend services** — the ZZZ auth service swaps its hardcoded English
  email catalog for the brand's Korean one. The locale seam the auth services
  already expose is unchanged.
- **Deployment** — nothing new ships; the same apps deploy the same way.
