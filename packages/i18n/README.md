# @grade10/i18n

Every user-facing string either site renders, named once and answered per brand.

`messages/grade10/en.json` is the vocabulary: a key exists the moment English
answers it, and every other catalog is measured against that shape. Catalogs
are brand-first — `messages/<brand>/<locale>.json` — because the names are
shared across brands and only the values differ. Consumers bring their own
renderer (`use-intl` in the application repositories).

| Brand | Locales | Default |
| --- | --- | --- |
| `grade10` | `en`, `zh-Hant`, `zh-Hans` | `en` |
| `zzz` | `ko` | `ko` |

```ts
import { getMessages, brands, isLocale } from "@grade10/i18n";

getMessages("grade10", "zh-Hant"); // Traditional Chinese over English
getMessages("zzz", "ko");          // Korean, with nothing behind it
```

A brand's default-locale catalog is complete — the typechecker says so, which
is why a missing Korean value fails `pnpm run typecheck` instead of reaching a
page. Every other catalog translates any subset and falls back to its brand's
default key by key. A key no catalog names, or one a catalog misspells, is a
compile error rather than a value nothing ever reads.

Adding a locale: create `messages/<brand>/<locale>.json` and add the tag to
that brand's `locales` in `src/index.ts`. Adding a brand: a directory, a
registry entry, and a complete catalog for its default locale.

ZZZ's catalog lives here as an interim. It moves to `external/zzz-spec` when
that submodule lands (`docs/architecture/multi-product.md` in the application
repository); the brand key is the seam that split cuts along, so it is a move
of one directory rather than a rewrite.

## Translations need native review

`zh-Hant`, `zh-Hans` and `ko` were drafted by engineers, machine-assisted, and
have not been reviewed by a native speaker. Register and terminology are the
risk, not coverage. Review them before either language is promoted as a
supported market, and treat this section as the record of what is outstanding.
