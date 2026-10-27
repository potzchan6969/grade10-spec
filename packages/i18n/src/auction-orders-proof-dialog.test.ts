import { describe, expect, it } from "vitest";
import { sharedCatalogs } from "./catalogs.ts";
import { locales } from "./index.ts";

const flatten = (value: object, prefix = ""): [string, string][] =>
  Object.entries(value).flatMap(([key, entry]) =>
    typeof entry === "object" && entry !== null
      ? flatten(entry, `${prefix}${key}.`)
      : [[`${prefix}${key}`, String(entry)]],
  );

const english = new Map(flatten(sharedCatalogs.en.auctionOrders.proofDialog));
const translated = locales.filter((locale) => locale !== "en");

describe("Submit Payment Proof dialog words", () => {
  it.each(translated)("translates every proofDialog key for %s", (locale) => {
    const words = flatten(sharedCatalogs[locale].auctionOrders.proofDialog);
    expect(words.map(([key]) => key).sort()).toEqual(
      [...english.keys()].sort(),
    );
    for (const [key, word] of words) {
      expect(word, key).not.toBe(english.get(key));
    }
  });
});
