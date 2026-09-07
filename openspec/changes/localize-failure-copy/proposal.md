# Say a failure in the collector's language

**Author:** @sean - 2026-09-07

## Why

A Korean collector whose bid fails reads *"Server error. Please try again in a
few moments."* — in English. So does a Traditional Chinese one. Every failure
notice on either brand's site is English, because the shared data layer holds
the words rather than the catalogs.

- **Eight English strings sit in a package.**
  `packages/utils/src/apiCalls/errors.ts` builds each failure's message from a
  hardcoded constant — network, server, request, sign-in, forbidden,
  not-found, decode, unknown.
- **Nineteen collector-facing views render one straight to screen**, across
  doc-sign, vault, loyalty, auction and the store.
- **It contradicts a shipped requirement.** `shared/localization` already
  says every user-facing string comes from the brand's catalogs and that no
  surface carries its own hardcoded copy, the surfaces both brands share
  included. The code never caught up.
- **Raw server text reaches the screen too.** A 4xx that is not 401, 403 or
  404 renders the technical detail instead — `checkout.create: CASE_NOT_FOUND`,
  or a payment provider's `No such customer: 'cus_1'`. Untranslated, and it
  tells a collector nothing they can act on.
- **The leak is widening.** Three of the eight strings — sign-in, forbidden,
  not-found — were added after the problem was first spotted.

**Metric:** locales a failure notice renders in, from one (English) to four
(`en`, `zh-Hant`, `zh-Hans`, `ko`).

## What Changes

- **Split the judgement from the words.** The platform decides what *kind* of
  failure this is and names that kind; the catalogs answer it in each locale.
  That a 502 is an outage while a 409 is a refusal the backend chose is one
  decision, taken once — five surfaces each re-deciding it is how one of them
  ends up wrong.
- **Give the shared vocabulary a failure namespace**, answered in every locale
  of both brands, so an unanswered kind fails the build like any other key.
- **Stop rendering what the server said.** Every failure renders the catalog's
  words for its kind; the call that failed and the server's own text stay in
  the technical account, for logs.
- **Hold the admin consoles to the same kinds**, answered in their own
  English. The console carve-out keeps them out of the catalogs, but sharing
  the classification is what lets the shared package hold no copy at all.

## Capabilities

### Modified Capabilities

- `shared/localization` — gains a requirement that a failure notice's words
  come from the catalogs, chosen by a failure kind the platform classifies
  once and every surface reuses.

## Impact

- **Nineteen collector-facing views** stop rendering English on a Chinese or
  Korean page — doc-sign, vault, loyalty, auction, the store.
- **`@grade10/i18n`** gains the failure keys, answered in `en`, `zh-Hant`,
  `zh-Hans` and `ko`.
- **The application repository's shared data layer** stops holding user-facing
  copy; roughly seventy admin call sites move to the same kinds with inline
  English.
- **`docs/prds/platform/shared/localization.md`** — the page renders the
  capability and follows it.
- **No backend, contract, or database change.** What a server sends is
  untouched; only what a person reads moves.

## Non-goals

- **Specific refusal reasons.** *"Email has already been taken"* and
  *"100 points requested, short by 50"* become the generic request failure
  here. Giving a backend a coded reason with a catalog key of its own is worth
  doing, and is not this change.
- **Translating the admin consoles.** The carve-out stands; operators read
  English.
- **Content a merchant or seller typed.** It renders as authored, as the
  capability already states.
- **How a failure notice looks.** Placement, tone, and the retry affordance
  are untouched.

## Open questions

- ❓ **Whether a refused-for-sign-in failure should render words at all**,
  rather than taking the collector to sign in. Today it reads *"Please sign in
  to continue."* beside a page offering no way to. No collector-facing surface
  acts on the status. *Owner: whoever owns the sign-in surface.*
