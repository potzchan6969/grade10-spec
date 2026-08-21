# Design: Copy a feature owns, written once

Capability delta: [`localization`](specs/localization/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

`packages/i18n` resolves a string in two steps today: `getMessages(brand,
locale)` reads that brand's default-locale catalog and merges the requested
locale's over it, key by key. Both halves come from the same brand directory,
so a brand that answers nothing still has to answer everything.

The catalogs are one JSON per namespace per brand and locale
(`messages/<brand>/<locale>/<namespace>.json`), assembled in
`src/catalogs.ts` — the only file that names a message file by path. Types do
the enforcing: `Messages` is `typeof grade10En`, a brand's non-default catalogs
are checked as partial overlays of it, and a fallback-less brand's catalog is
checked as complete, which is what makes a missing Korean value a `typecheck`
failure rather than a raw key on a page.

Nothing outside the package reads a catalog. Applications name keys —
`useTranslations("signIn")` — through `@grade10/frontend-intl`, and the
worker-side login mail through `@grade10/email`'s translator. Both take
whatever `getMessages` returns.

## Decisions

### The shared layer is a directory beside the brands, not a brand

`messages/shared/<locale>/<namespace>.json` holds the vocabulary's own
answers; `messages/<brand>/<locale>/<namespace>.json` holds what that brand
says differently. `shared` is not a brand: it has no locale set of its own, no
default, and no entry in the registry — it answers in every locale any brand
speaks, and nothing renders it directly.

*Alternatives:* a `base` brand in the registry, inherited by others — rejected:
it makes "which brand is this page" answerable with something no site is, and
every consumer of `brands` would have to remember to skip it. A per-brand
`extends:` pointer — rejected: one shared layer is the whole hierarchy anyone
has asked for, and a pointer invites a second level nobody wants to debug.

### Resolution is language first, brand second

A string resolves through four layers, each overriding the one before:
the vocabulary's default locale, the vocabulary's requested locale, the
brand's default locale, the brand's requested locale.

The order matters at exactly one point: a key a brand answers in English but
not in Chinese. Taking the brand's English over the vocabulary's Chinese would
put an English sentence on a Chinese page; taking the vocabulary's Chinese
would put a sentence naming no brand — or the wrong one — where the brand
overrode precisely because the wording is its own. Neither is acceptable, so
the spec removes the case: a brand answers a key in every locale it speaks,
and the build fails when it does not. Around twenty keys per brand makes that
cheap to require.

*Alternatives:* brand-first resolution — rejected for the English-sentence-on-
a-Chinese-page outcome above. Letting a brand override one locale only, with
the vocabulary filling the rest — rejected: it reads as working until a
collector sees the other brand's phrasing under this brand's logo.

### Types keep the shape, a test keeps the coverage

`Messages` becomes `typeof sharedEn & typeof grade10En` — the brand-neutral
answers plus the keys a brand has to state, enumerated in the one brand that
speaks every locale — and every file, shared or brand, stays an
`Overlay<Messages, C>`, so an unknown or mistyped key is still a compile error
and the vocabulary is still one type.

The shared layer is deliberately partial. A wordmark, an attribution line and
a surface's title have no brand-neutral answer worth writing: a placeholder
there is copy that never renders in the best case and ships as a brand's name
in the worst, when a brand forgets to override it. So the vocabulary is the
union of what nobody claims and what a brand must claim, and the enumeration
of the second half lives with grade10 because it is the brand that speaks
every locale the platform has.

What types stop doing is completeness across layers. Whether `shared` plus
`zzz` covers every key in Korean is a merge of two partial objects, and
expressing that as a type is a deep-merge generic that fails unreadably when
it fails. A test asserts it instead, one line per rule: every brand and locale resolves
every key, from either layer; a brand that answers a key answers it in all of
its locales; no rendered value falls through to another language.

*Alternatives:* a `DeepMerge` type over the layers — rejected on the error
messages, which are what a compile-time check is for. A runtime scanner at
startup — rejected: a check that runs when a page renders has already
shipped the gap. A complete shared layer with neutral placeholders for the
keys a brand must state — rejected above: it trades a type quirk for copy
nobody ships and a silent failure mode.

### `getMessages` keeps its signature

The package's surface — `getMessages(brand, locale)`, `brands`, `isLocale`,
`localesOf`, `defaultLocaleOf`, `Messages` — does not move. The layer is
inside the merge, so the application repository's only change is the submodule
bump, and no page, component, or worker is touched.

## Risks / Trade-offs

- **A translator's surface splits in two.** Reviewing Korean means the shared
  layer and ZZZ's overlay rather than one directory. Mitigated by the overlay
  being roughly twenty keys, and by both living under `messages/`.
- **ZZZ's move to `external/zzz-spec` gains a dependency.** The brand takes
  its own answers and depends on the shared layer here. Named in the proposal
  rather than discovered when that submodule lands.
- **A brand can no longer be read in one place.** What ZZZ says is now what
  ZZZ overrides plus what it inherits. The demo and the tests read the
  resolved catalog, which is what a page renders, so the resolved view is the
  one anybody reviewing copy should use.

## Migration Plan

One commit in this repository, no data and no application change: move every
value that is identical across brands into `messages/shared/`, leave the rest,
and bump the submodule. The move is mechanical — a key whose brands agree is
shared, a key whose brands differ is theirs — and the coverage test is what
proves nothing was dropped, since every resolved string must equal what it
resolved to before.

## Open Questions

None.
