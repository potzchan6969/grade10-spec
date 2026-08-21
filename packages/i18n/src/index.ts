import { brandCatalogs, sharedCatalogs } from "./catalogs.ts";

/**
 * The vocabulary: every user-facing string either site renders, named once.
 *
 * Two halves make it. The words no brand claims are answered once per
 * language in `shared`; the words that say something about a brand are the
 * brand's, and English grade10 is where they are enumerated because it is the
 * brand that speaks every language the platform has. A key exists the moment
 * one of those two answers it, and every catalog is measured against the
 * shape they make together.
 *
 * The shared half is deliberately partial: a wordmark, an attribution line
 * and a surface's title have no brand-neutral answer worth writing, and a
 * placeholder there is copy that never renders — or worse, one brand's name
 * on another brand's page when an override is forgotten. What each layer is
 * made of — one file per namespace — is `catalogs.ts`.
 */
export type Messages = typeof sharedCatalogs.en &
  typeof brandCatalogs.grade10.en;

/** Which languages a brand speaks, and which it falls back to. */
export const brands = {
  grade10: { locales: ["en", "zh-Hant", "zh-Hans"], defaultLocale: "en" },
  zzz: { locales: ["ko"], defaultLocale: "ko" },
} as const;

export type Brand = keyof typeof brands;

/** The locales one brand speaks. */
export type LocaleOf<B extends Brand> = (typeof brands)[B]["locales"][number];

/** Every locale this package ships, across every brand. */
export type Locale = LocaleOf<Brand>;

export const locales = [
  "en",
  "zh-Hant",
  "zh-Hans",
  "ko",
] as const satisfies readonly Locale[];

/**
 * A catalog measured against the vocabulary: no key the vocabulary does not
 * name, and a string wherever it names one. Every key may be omitted — another
 * layer answers it instead. A catalog with an unknown or mistyped key is a
 * compile error rather than a value nothing ever reads.
 */
type Overlay<Vocabulary, Catalog> = {
  [K in keyof Catalog]: K extends keyof Vocabulary
    ? Vocabulary[K] extends string
      ? Catalog[K] extends string
        ? string
        : never
      : Catalog[K] extends string
        ? never
        : Overlay<Vocabulary[K], Catalog[K]>
    : never;
};

/** A translation of any subset of the vocabulary. */
const overlay = <const C extends Overlay<Messages, C>>(catalog: C): C =>
  catalog;

/**
 * Every layer, measured against the vocabulary one catalog at a time — a key
 * no catalog may name is a compile error in the file that wrote it. Named
 * here rather than mapped over the tables, because a check that walks them
 * measures the union of the catalogs instead of each of them, and an unknown
 * key survives it.
 *
 * The `satisfies` clauses are what keep this list honest: a language a brand
 * gains, or one the platform gains, is missing from here until it is added.
 *
 * That the layers together answer everything is not something a type says
 * readably; `src/resolution.test.ts` says it instead, naming the brand, the
 * key and the language when they do not.
 */
const shared = {
  en: overlay(sharedCatalogs.en),
  "zh-Hant": overlay(sharedCatalogs["zh-Hant"]),
  "zh-Hans": overlay(sharedCatalogs["zh-Hans"]),
  ko: overlay(sharedCatalogs.ko),
} satisfies Record<Locale, unknown>;

const owned = {
  grade10: {
    en: overlay(brandCatalogs.grade10.en),
    "zh-Hant": overlay(brandCatalogs.grade10["zh-Hant"]),
    "zh-Hans": overlay(brandCatalogs.grade10["zh-Hans"]),
  },
  zzz: { ko: overlay(brandCatalogs.zzz.ko) },
} satisfies { [B in Brand]: Record<LocaleOf<B>, unknown> };

type MessageTree = { [key: string]: string | MessageTree };

/** The language every layer is measured against, and the one a partial
 * translation falls back to. */
const VOCABULARY_LOCALE = "en";

const layer = (
  catalogs: Record<string, unknown>,
  locale: string,
): MessageTree => (catalogs[locale] as MessageTree | undefined) ?? {};

export function localesOf<B extends Brand>(brand: B): readonly LocaleOf<B>[] {
  return brands[brand].locales;
}

export function defaultLocaleOf<B extends Brand>(brand: B): LocaleOf<B> {
  return brands[brand].defaultLocale;
}

export function isLocale<B extends Brand>(
  brand: B,
  value: string,
): value is LocaleOf<B> {
  return (brands[brand].locales as readonly string[]).includes(value);
}

function merge(base: MessageTree, overlaid: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(overlaid)) {
    const current = result[key];
    result[key] =
      typeof value === "object" && typeof current === "object"
        ? merge(current, value)
        : value;
  }
  return result;
}

/**
 * One brand's copy in one language, from the two layers that answer it.
 *
 * Four merges, each overriding the one before: the vocabulary's own language,
 * the vocabulary in the language asked for, what the brand says for itself,
 * and what the brand says for itself in that language. Language before brand,
 * because a brand states its own words in every language it speaks — so the
 * only thing the brand layer can override is a sentence written in the same
 * language, and the only thing that ever falls back across languages is a
 * translation a brand chose to leave partial.
 *
 * A locale the brand does not speak reads as its default. A raw key is not
 * among the outcomes: whatever no layer answered is what the coverage test
 * refuses to let ship.
 */
export function getMessages(brand: Brand, locale: string): Messages {
  const fallback = brands[brand].defaultLocale;
  const active = isLocale(brand, locale) ? locale : fallback;
  const brandLayer = owned[brand] as Record<string, unknown>;

  return merge(
    merge(
      merge(layer(shared, VOCABULARY_LOCALE), layer(shared, active)),
      layer(brandLayer, fallback),
    ),
    layer(brandLayer, active),
  ) as Messages;
}
