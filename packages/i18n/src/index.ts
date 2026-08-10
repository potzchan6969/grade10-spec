import en from "../messages/en.json";
import zhHant from "../messages/zh-hant.json";

export const defaultLocale = "en";
export const locales = ["en", "zh-hant"] as const;

export type Locale = (typeof locales)[number];
export type Messages = typeof en;

type MessageTree = { [key: string]: string | MessageTree };

const catalogs: Record<Locale, MessageTree> = { en, "zh-hant": zhHant };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function merge(base: MessageTree, overlay: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    const current = result[key];
    result[key] =
      typeof value === "object" && typeof current === "object"
        ? merge(current, value)
        : value;
  }
  return result;
}

export function getMessages(locale: string): Messages {
  const resolved = isLocale(locale) ? locale : defaultLocale;
  if (resolved === defaultLocale) return en;
  return merge(en, catalogs[resolved]) as Messages;
}
