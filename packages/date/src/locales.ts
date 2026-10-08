import type { Locale } from "date-fns";
import { enUS, ko as koKR, zhCN, zhHK } from "date-fns/locale";

/**
 * The languages the platform can word a date in, mirroring the catalogs
 * `@grade10/i18n` ships. It grows when a catalog does, in the same commit -
 * a test holds the two lists to one list.
 *
 * Only these are imported. date-fns publishes some two hundred locales, and a
 * registry of all of them would be carried by every bundle that shows a date.
 */
const LOCALES: Record<string, Locale> = {
  en: enUS,
  "zh-hant": zhHK,
  "zh-hans": zhCN,
  ko: koKR,
};

/**
 * A tag nothing recognizes is a mistake in the code that passed it, not a
 * preference to shrug at. Matched without case, because a BCP-47 tag is:
 * `zh-Hant` is how the catalogs spell it, and the same tag reaches here off a
 * cookie or an address prefix that may have lowercased it.
 */
export function localeFor(tag: string): Locale {
  const locale = LOCALES[tag.toLowerCase()];
  if (!locale) {
    throw new Error(
      `@grade10/date: no words for language "${tag}" - add its catalog and its date-fns locale together`,
    );
  }
  return locale;
}
