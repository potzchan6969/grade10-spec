import grade10En from "../messages/grade10/en.json";
import grade10ZhHans from "../messages/grade10/zh-Hans.json";
import grade10ZhHant from "../messages/grade10/zh-Hant.json";
import zzzKo from "../messages/zzz/ko.json";

/**
 * The vocabulary: every user-facing string either site renders, named once.
 * grade10's English catalog is its type, so a key exists the moment English
 * answers it and every other catalog is measured against this shape.
 */
export type Messages = typeof grade10En;

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
 * name, and a string wherever it names one. Every key may be omitted — the
 * brand's default locale answers it instead. A catalog with an unknown or
 * mistyped key is a compile error rather than a value nothing ever reads.
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
 * A brand's default-locale catalog: complete, because nothing sits behind it.
 * A brand that speaks one language has only this one, which is why a missing
 * Korean value fails `pnpm run typecheck` rather than reaching a page.
 */
const complete = <const C extends Overlay<Messages, C>>(
  catalog: C & Messages,
): C => catalog;

const catalogs = {
  grade10: {
    en: complete(grade10En),
    "zh-Hant": overlay(grade10ZhHant),
    "zh-Hans": overlay(grade10ZhHans),
  },
  zzz: { ko: complete(zzzKo) },
};

type MessageTree = { [key: string]: string | MessageTree };

const treeOf = (brand: Brand, locale: string): MessageTree | undefined =>
  (catalogs[brand] as Record<string, MessageTree>)[locale];

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
 * One brand's copy in one language. A locale the brand does not speak reads as
 * its default, and a key the requested locale omits falls back key by key —
 * so a partial translation renders what it has and English (or the brand's
 * own default) everywhere else, never a raw key.
 */
export function getMessages(brand: Brand, locale: string): Messages {
  const fallback = brands[brand].defaultLocale;
  const base = treeOf(brand, fallback) as MessageTree;
  if (!isLocale(brand, locale) || locale === fallback) return base as Messages;
  return merge(base, treeOf(brand, locale) ?? {}) as Messages;
}
