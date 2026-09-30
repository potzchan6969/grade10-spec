import { assemble } from "./assemble.ts";
import {
  type Brand,
  defaultLocaleOf,
  isLocale,
  type Locale,
  type LocaleOf,
} from "./brands.ts";
import { brandCatalogs, sharedCatalogs } from "./catalogs.ts";

export {
  type Brand,
  brands,
  defaultLocaleOf,
  isLocale,
  type Locale,
  type LocaleOf,
  localesOf,
} from "./brands.ts";

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
export type Messages<B extends Brand = "grade10"> = typeof sharedCatalogs.en &
  (B extends "grade10"
    ? typeof brandCatalogs.grade10.en
    : typeof brandCatalogs.zzz.ko);

export type ShippedLocale = Locale;

export type ActivityTimeCopy = Messages["dates"];

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

export function resolveShippedLocale<B extends Brand>(
  brand: B,
  input: string,
): LocaleOf<B> {
  return isLocale(brand, input) ? input : defaultLocaleOf(brand);
}

/** One brand's copy in one language; a locale the brand does not speak
 * reads as its default. A raw key is not among the outcomes: whatever no
 * layer answered is what the coverage test refuses to let ship. */
export function getMessages<B extends Brand>(
  brand: B,
  locale: string,
): Messages<B> {
  return assemble(brand, resolveShippedLocale(brand, locale), {
    shared,
    brand: owned[brand],
  });
}
