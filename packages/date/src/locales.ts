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
 * The platform's language for a tag with a region or script on it, such as the
 * `en-US` or `zh-HK` a date picker's locale carries: `en`, `ko`, `zh-Hant` for
 * Hong Kong, Taiwan, Macau or an explicit Hant, and `zh-Hans` for the rest of
 * Chinese. A tag it cannot place comes back as it was, so `localeFor` stops on
 * it by name.
 */
export function platformLanguageOf(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower === "en" || lower.startsWith("en-")) return "en";
  if (lower === "ko" || lower.startsWith("ko-")) return "ko";
  if (lower === "zh" || lower.startsWith("zh-")) {
    return /(^|-)(hant|hk|tw|mo)(-|$)/.test(lower) ? "zh-Hant" : "zh-Hans";
  }
  return tag;
}

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
