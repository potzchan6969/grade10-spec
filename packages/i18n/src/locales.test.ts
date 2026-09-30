import { describe, expect, it } from "vitest";
import packageJson from "../package.json";
import { type Brand, brands, getMessages, localesOf } from "./index.ts";

const exportsMap: Record<string, string> = packageJson.exports;

const spoken = (Object.keys(brands) as Brand[]).flatMap((brand) =>
  localesOf(brand).map((locale) => [brand, locale] as const),
);

/* One brand in one language, importable on its own: the subpath a console
   takes so the other languages never reach its bundle. */
describe.each(spoken)("@grade10/i18n/%s/%s", (brand, locale) => {
  const subpath = `./${brand}/${locale}`;

  it("is exported from its own module", () => {
    expect(exportsMap[subpath]).toBe(`./src/locales/${brand}/${locale}.ts`);
  });

  it("equals getMessages for the same brand and language", async () => {
    const entry = await import(`./locales/${brand}/${locale}.ts`);
    expect(entry.messages).toEqual(getMessages(brand, locale));
  });
});

it("exports a subpath for no language a brand does not speak", () => {
  const narrow = Object.keys(exportsMap).filter(
    (subpath) => subpath !== "." && !subpath.startsWith("./messages/"),
  );
  expect(narrow.sort()).toEqual(
    spoken.map(([brand, locale]) => `./${brand}/${locale}`).sort(),
  );
});
