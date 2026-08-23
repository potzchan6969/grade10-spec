import { describe, expect, it } from "vitest";
import { brandCatalogs, sharedCatalogs } from "./catalogs.ts";
import type { Brand } from "./index.ts";
import { brands, getMessages, localesOf } from "./index.ts";

type Tree = { [key: string]: string | Tree };

/* The layers are read here the way the package reads them — by brand and by
 * locale, from a table typed per brand — so a test that walks every one of
 * them says which layer it is looking at rather than which literal. */
const layers = (catalogs: unknown): Record<string, Tree> =>
  catalogs as Record<string, Tree>;

const flatten = (tree: Tree, prefix = ""): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((flat, [key, value]) => {
    if (typeof value === "object")
      Object.assign(flat, flatten(value, `${prefix}${key}.`));
    else flat[`${prefix}${key}`] = value;
    return flat;
  }, {});

const brandNames = Object.keys(brands) as Brand[];

/** Every key the vocabulary names, from whichever layer answers it. */
const VOCABULARY = [
  ...new Set(
    brandNames.flatMap((brand) =>
      localesOf(brand).flatMap((locale) =>
        Object.keys(flatten(getMessages(brand, locale) as Tree)),
      ),
    ),
  ),
].sort();

const spoken = brandNames.flatMap((brand) =>
  localesOf(brand).map((locale) => ({ brand, locale })),
);

describe("what a brand and a language answer between them", () => {
  /* Scenario: A brand leaves a key unanswered. Nothing renders a key: every
     one of them is answered brand-neutrally or by the brand itself. */
  it.each(spoken)(
    "answers every key for $brand in $locale",
    ({ brand, locale }) => {
      const resolved = flatten(getMessages(brand, locale) as Tree);
      const unanswered = VOCABULARY.filter(
        (key) => typeof resolved[key] !== "string" || resolved[key] === "",
      );

      expect(unanswered).toEqual([]);
    },
  );

  /* Scenario: A brand's own words are missing a language. What a brand states
     for itself, it states in every language it speaks — otherwise one brand's
     name lands inside another language's sentence. */
  it.each(brandNames)(
    "has %s state its own words in every language it speaks",
    (brand) => {
      const locales = localesOf(brand);
      const stated = Object.fromEntries(
        locales.map((locale) => [
          locale,
          new Set(
            Object.keys(flatten(layers(brandCatalogs[brand])[locale] ?? {})),
          ),
        ]),
      );
      const everywhere = [...new Set(locales.flatMap((l) => [...stated[l]]))];

      for (const locale of locales) {
        const missing = everywhere.filter((key) => !stated[locale].has(key));
        expect({ brand, locale, missing }).toEqual({
          brand,
          locale,
          missing: [],
        });
      }
    },
  );

  /* Scenario: A brand names itself. What a brand states wins over the
     brand-neutral answer, in the language being read. */
  it("renders a brand's own words over the shared ones", () => {
    expect(getMessages("grade10", "en").chrome.wordmark).toBe("Grade10");
    expect(getMessages("zzz", "ko").chrome.wordmark).toBe("ZZZ Store");
  });

  /* Scenario: A brand says nothing of its own. */
  it("renders the shared words where no brand states any", () => {
    const shared = flatten(layers(sharedCatalogs).ko);

    expect(getMessages("zzz", "ko").common.back).toBe(shared["common.back"]);
    expect(
      flatten(layers(brandCatalogs.zzz).ko)["common.back"],
    ).toBeUndefined();
  });
});

/**
 * What the layering is for: a string a feature owns is written once per
 * language however many brands render it, and a brand owes the platform only
 * the words that say something about itself.
 */
describe("what each layer is answerable for", () => {
  const keysIn = (tree: Tree) => new Set(Object.keys(flatten(tree)));

  /* Scenario: A brand says nothing of its own — held as the rule rather than
     one example. A key answered in both layers is a translation written
     twice, which is the cost this shape exists to remove. */
  it.each(brandNames)(
    "has %s restate nothing the shared words answer",
    (brand) => {
      for (const locale of localesOf(brand)) {
        const shared = keysIn(layers(sharedCatalogs)[locale] ?? {});
        const stated = keysIn(layers(brandCatalogs[brand])[locale] ?? {});
        const twice = [...stated].filter((key) => shared.has(key));

        expect({ locale, twice }).toEqual({ locale, twice: [] });
      }
    },
  );

  /* Scenario: A new brand answers only for itself. Every brand owes the same
     keys, so what a new one has to write is knowable before it exists. */
  it("asks every brand for the same words", () => {
    const owed = brandNames.map((brand) => ({
      brand,
      keys: [
        ...keysIn(layers(brandCatalogs[brand])[localesOf(brand)[0]] ?? {}),
      ].sort(),
    }));

    for (const one of owed) expect(one.keys).toEqual(owed[0].keys);
    expect(owed[0].keys.length).toBeLessThan(VOCABULARY.length / 4);
  });

  /* A brand's default language has nothing behind it but the shared words, so
     between them they answer everything — no key falls through to a language
     the collector did not ask for. */
  it.each(brandNames)(
    "answers %s's own language without falling back",
    (brand) => {
      const locale = brands[brand].defaultLocale;
      const answered = new Set([
        ...keysIn(layers(sharedCatalogs)[locale] ?? {}),
        ...keysIn(layers(brandCatalogs[brand])[locale] ?? {}),
      ]);

      expect(VOCABULARY.filter((key) => !answered.has(key))).toEqual([]);
    },
  );
});
