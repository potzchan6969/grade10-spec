import { describe, expect, it } from "vitest";
import { localeFor, platformLanguageOf } from "./locales.ts";

describe("platformLanguageOf", () => {
  it.each([
    ["en", "en"],
    ["en-US", "en"],
    ["en-GB", "en"],
    ["ko", "ko"],
    ["ko-KR", "ko"],
    ["zh-HK", "zh-Hant"],
    ["zh-TW", "zh-Hant"],
    ["zh-Hant", "zh-Hant"],
    ["zh-Hant-HK", "zh-Hant"],
    ["zh-CN", "zh-Hans"],
    ["zh-Hans", "zh-Hans"],
    ["zh", "zh-Hans"],
  ])("reads %s as %s", (tag, language) => {
    expect(platformLanguageOf(tag)).toBe(language);
  });

  it("hands every tag it maps to the strict rule", () => {
    for (const tag of ["en-US", "zh-HK", "zh-CN", "ko-KR"]) {
      expect(() => localeFor(platformLanguageOf(tag))).not.toThrow();
    }
  });

  it("leaves a tag it does not know alone, so the strict rule names it", () => {
    expect(platformLanguageOf("fr-FR")).toBe("fr-FR");
    expect(() => localeFor(platformLanguageOf("fr-FR"))).toThrow(/"fr-FR"/);
  });
});
