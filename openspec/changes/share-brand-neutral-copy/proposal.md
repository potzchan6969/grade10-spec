# Copy a feature owns, written once

**Author:** @seankcw - 2026-08-21

## Why

The vocabulary is 202 keys. Twenty-four of them say something about a brand —
the wordmark, the attribution, the region and its currency, each surface's
title and description, the sign-in and profile descriptions, the vault and
authentication lines, the login email's subject. The other 178 say nothing
about any brand at all: "Verification code", "Back to the store", "No bids
yet", "Enter a valid amount", every error a shared feature slice renders.

Those 178 are written once per brand per language anyway, because a brand's
catalog is required to answer the whole vocabulary. Two brands and four
languages already means the same sentence translated in two places, drifting
independently; a third brand means re-translating 178 strings that have
nothing to do with it, and ZZZ's Korean and grade10's Korean would answer
"Verification code" separately for the rest of the platform's life.

The strings belong to the feature that renders them — the sign-in flow, the
store listing, the bid panel — and a feature is shared across brands by
design. Only what names a brand is the brand's.

**Metric:** brand-neutral keys stated more than once, from 178 today to zero.
**Acceptance signal:** adding a brand costs a translation of what that brand
calls itself, not of the platform.

## What Changes

- **A shared answer under every brand.** The vocabulary gains one set of
  brand-neutral values per language. A brand's catalogs state only what that
  brand says differently, and everything else resolves to the shared answer
  in the language being read.
- **A brand's own words stay complete.** What a brand overrides, it overrides
  in every language it speaks — twenty-odd keys — so a page never mixes one
  brand's name into another language's sentence, and the build says so before
  it ships.
- **Nothing a collector reads changes.** Every rendered string keeps the value
  it has today; this is where a value is written, not what it says.

## Non-Goals

- **New copy, or new languages.** The set of keys and the set of locales are
  what they are.
- **Moving copy out of this repository.** Catalogs stay here; the change is
  the layer under the brands, not the repository above them.
- **Per-feature catalog files.** Namespaces already group copy by the surface
  that renders it, and a translator works across a whole language at once —
  splitting a language across feature-owned directories is a different
  proposal, and not this one.
- **A translation-management system.** Still engineer-drafted, still reviewed
  by native speakers as follow-up.

## Capabilities

### Modified Capabilities

- `localization`: where a string's value is written, and what a brand is
  required to answer. The vocabulary, the fallback between languages, and the
  rule that no raw key ever renders are unchanged.

The requirement this delta modifies arrives with `add-site-localization`,
which is delivered but not yet archived — so this change is planned against
it and lands after it, on a vocabulary that already exists.

## Impact

- **`packages/i18n`** — `messages/shared/<locale>/<namespace>.json` joins the
  brand directories; each brand keeps only its own answers. `getMessages`
  resolves one more layer. The exported surface — `getMessages`, `brands`,
  `isLocale`, `Messages` — is unchanged, so nothing that consumes it moves.
- **The application repository** — a submodule bump and nothing else. No
  component, page, or worker reads a catalog directly; they name keys, and a
  key resolves the same way it did.
- **ZZZ's eventual move to `external/zzz-spec`** changes shape: the brand
  takes its own answers, and the shared layer stays here as something that
  repository depends on. Smaller to move, and coupled where it was not —
  stated here rather than discovered then.
