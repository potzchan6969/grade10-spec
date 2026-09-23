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
