# @grade10/i18n

Every user-facing string either site renders, named once and answered per brand.

A string is written in one of two places, and the difference is whether it
says anything about a brand.

| Layer | Path | Holds |
| --- | --- | --- |
| Shared | `messages/shared/<locale>/<namespace>.json` | Every key no brand claims — what a feature calls things, written once per language however many brands render it |
| Brand | `messages/<brand>/<locale>/<namespace>.json` | What that brand says for itself: its name, who runs it, where it sells, what each of its surfaces is called |

A brand states its own words in **every language it speaks**, so a page never
carries one brand's name inside another language's sentence. Everything else
it inherits. Adding a brand costs a translation of what that brand calls
itself — around twenty keys — not of the platform.

One file per namespace, because a namespace is what a translator, a reviewer
and a change each work in at once. `src/catalogs.ts` is where those files add
up to the two layers, and the only file naming one by path. Consumers bring
their own renderer (`use-intl` in the application repositories).

| Brand | Locales | Default |
| --- | --- | --- |
| `grade10` | `en`, `zh-Hant`, `zh-Hans` | `en` |
| `zzz` | `ko` | `ko` |

```ts
import { getMessages, brands, isLocale } from "@grade10/i18n";

getMessages("grade10", "zh-Hant"); // Traditional Chinese over English
getMessages("zzz", "ko");          // Korean, with nothing behind it
```

`getMessages` merges four layers, each overriding the one before: the shared
words in English, the shared words in the language asked for, the brand's own
words in its default language, and the brand's own words in that language.
Language before brand, because a brand answers its own keys in every language
it speaks — so the only thing that ever falls back across languages is a
translation a brand chose to leave partial.

A key no catalog names, or one a catalog misspells, is a compile error rather
than a value nothing ever reads: `pnpm run typecheck` measures every layer
against the vocabulary. That the layers *together* answer everything is
`src/resolution.test.ts` — `pnpm run test` — which names the brand, the key
and the language when they do not, and refuses a key answered twice.

Adding a locale: `messages/shared/<locale>/` with a file per namespace, the
brand's own words in `messages/<brand>/<locale>/`, both wired into
`src/catalogs.ts`, and the tag added to that brand's `locales` in
`src/index.ts`. Adding a namespace: a file under `shared` for every language,
one under a brand only where a brand has to say it itself, and a line per
file in `src/catalogs.ts`. Adding a brand: a directory per locale holding
the keys every other brand states — the test names them — plus a registry
entry.

ZZZ's own words live here as an interim. They move to `external/zzz-spec`
when that submodule lands (`docs/architecture/multi-product.md` in the
application repository); the brand key is the seam that split cuts along, so
it is a move of `messages/zzz/` rather than a rewrite — and what moves is the
twenty-odd keys ZZZ states, with the shared layer staying here as something
that repository reads.

## English copy

Every `messages/**/en/**/*.json` value and any English demo copy in
`packages/ui` follows two rules:

| Rule | Example |
| --- | --- |
| Curly apostrophes and quotation marks in rendered text | `We’ll`, `You didn’t win`, `“Starting bid”` — not `We'll`, `didn't`, `"Starting bid"` |
| American English spelling | `authorized`, not `authorised` |

Contractions and possessives use `’` (U+2019). Quoted words or phrases inside a
sentence use `“` and `”` (U+201C/U+201D). JSON file delimiters stay straight
double quotes.

Component `copy` props assembled in consuming applications must follow the same
rules when the locale is English. See
[`ui-component-contracts.md`](../../docs/governance/ui-component-contracts.md).

## Translations need native review

`zh-Hant`, `zh-Hans` and `ko` were drafted by engineers, machine-assisted, and
have not been reviewed by a native speaker. Register and terminology are the
risk, not coverage. Review them before either language is promoted as a
supported market, and treat this section as the record of what is outstanding.
