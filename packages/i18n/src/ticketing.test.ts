import { describe, expect, it } from "vitest";
import { brandCatalogs, sharedCatalogs } from "./catalogs.ts";
import { getMessages, localesOf } from "./index.ts";

type Tree = { [key: string]: string | Tree };

const flatten = (tree: Tree, prefix = ""): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((flat, [key, value]) => {
    if (typeof value === "object")
      Object.assign(flat, flatten(value, `${prefix}${key}.`));
    else flat[`${prefix}${key}`] = value;
    return flat;
  }, {});

/** The arguments an ICU message names, and whether it reads at all: braces
 *  balance, and every plural or select has its `other` branch. */
function argumentsOf(message: string): Set<string> {
  const names = new Set<string>();
  let at = 0;

  const body = (depth: number): void => {
    while (at < message.length) {
      const char = message[at];
      if (char === "{") {
        at++;
        argument();
      } else if (char === "}") {
        if (depth === 0) throw new Error(`stray } in ${message}`);
        return;
      } else at++;
    }
    if (depth > 0) throw new Error(`unclosed { in ${message}`);
  };

  const argument = (): void => {
    const end = message.slice(at).search(/[,}]/);
    if (end < 0) throw new Error(`unclosed argument in ${message}`);
    const name = message.slice(at, at + end).trim();
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name))
      throw new Error(`bad argument "${name}" in ${message}`);
    names.add(name);
    at += end;
    if (message[at] === "}") {
      at++;
      return;
    }
    at++;
    const typeEnd = message.slice(at).search(/[,}]/);
    const type = message.slice(at, at + typeEnd).trim();
    at += typeEnd;
    if (type !== "plural" && type !== "select")
      throw new Error(`unknown type "${type}" in ${message}`);
    at++;
    const branches: string[] = [];
    for (;;) {
      while (message[at] === " ") at++;
      if (message[at] === "}") {
        at++;
        break;
      }
      const open = message.indexOf("{", at);
      if (open < 0) throw new Error(`branch without body in ${message}`);
      branches.push(message.slice(at, open).trim());
      at = open + 1;
      body(1);
      at++;
    }
    if (!branches.includes("other"))
      throw new Error(`${type} without other in ${message}`);
  };

  body(0);
  return names;
}

const sorted = (names: Set<string>) => [...names].sort();

const sharedTicketing = (locale: keyof typeof sharedCatalogs) =>
  flatten(sharedCatalogs[locale].ticketing as Tree);
const sharedMail = (locale: keyof typeof sharedCatalogs) =>
  flatten(sharedCatalogs[locale].email.ticketing as Tree);
const brandTicketing = (locale: keyof typeof brandCatalogs.grade10) =>
  flatten(brandCatalogs.grade10[locale].ticketing as Tree);
const brandMail = (locale: keyof typeof brandCatalogs.grade10) =>
  flatten(brandCatalogs.grade10[locale].email.ticketing as Tree);

const otherShared = ["zh-Hant", "zh-Hans", "ko"] as const;
const otherBrand = ["zh-Hant", "zh-Hans"] as const;

describe("the ticketing words", () => {
  /* Every sentence a ticketing screen or mail reads parses, in every
     language, and asks for the same values the English one does — so a page
     that fills the English sentence fills every translation. */
  it.each([
    ...otherShared.map(
      (locale) =>
        [
          "shared screens",
          locale,
          sharedTicketing("en"),
          sharedTicketing(locale),
        ] as const,
    ),
    ...otherShared.map(
      (locale) =>
        ["shared mails", locale, sharedMail("en"), sharedMail(locale)] as const,
    ),
    ...otherBrand.map(
      (locale) =>
        [
          "grade10 screens",
          locale,
          brandTicketing("en"),
          brandTicketing(locale),
        ] as const,
    ),
    ...otherBrand.map(
      (locale) =>
        ["grade10 mails", locale, brandMail("en"), brandMail(locale)] as const,
    ),
  ])(
    "%s in %s ask for what English asks",
    (_layer, _locale, english, translated) => {
      const mismatched = Object.entries(english).flatMap(([key, sentence]) => {
        const wanted = sorted(argumentsOf(sentence));
        const given = translated[key];
        if (given === undefined) return [`${key}: missing`];
        const got = sorted(argumentsOf(given));
        return wanted.join() === got.join()
          ? []
          : [`${key}: ${got.join()} for ${wanted.join()}`];
      });
      expect(mismatched).toEqual([]);
    },
  );

  it.each(localesOf("grade10"))(
    "words every refusal with a title for grade10 in %s",
    (locale) => {
      const { refusals } = getMessages("grade10", locale).ticketing;
      const untitled = Object.entries(refusals)
        .filter(([name]) => name !== "actions")
        .filter(([, words]) => !(words as { title?: string }).title)
        .map(([name]) => name);

      expect(untitled).toEqual([]);
      expect(Object.keys(refusals)).toEqual(
        expect.arrayContaining([
          "notOpenToYouYet",
          "accessLimit",
          "codeUsedUp",
          "generic",
        ]),
      );
    },
  );

  /* Access rules replaced invitations, and the service hands out no
     wristband: neither is promised anywhere a buyer reads. */
  it.each(["en", "zh-Hant", "zh-Hans", "ko"] as const)(
    "promises no invitation and no wristband in %s",
    (locale) => {
      const words = [
        ...Object.entries(sharedTicketing(locale)),
        ...Object.entries(sharedMail(locale)),
      ];
      expect(
        words.filter(([, sentence]) =>
          /wristband|手帶|手带|팔찌/i.test(sentence),
        ),
      ).toEqual([]);
      expect(words.filter(([key]) => /invit/i.test(key))).toEqual([]);
    },
  );

  it("reads a door answer and a promo refusal in English", () => {
    const { door, promo } = getMessages("grade10", "en").ticketing;
    expect(door.answer.admitted.title).toBe("Admitted");
    expect(door.answer.notChecked.line).toBe("Don’t let them in yet.");
    expect(promo.errors.notFound).toBe(
      "We can’t find this code. Check the spelling.",
    );
  });

  it("finds a message that does not parse", () => {
    expect(() => argumentsOf("{count, plural, one {# ticket}}")).toThrow(
      /without other/,
    );
    expect(() => argumentsOf("Hi {name")).toThrow();
    expect(
      sorted(
        argumentsOf(
          "{free} of {count, plural, one {# ticket} other {# tickets}} {fast, select, yes {too} other {}}",
        ),
      ),
    ).toEqual(["count", "fast", "free"]);
  });
});
