import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("the package entry", () => {
  /* A fixture on the entry reaches every application, where it can stand in
   * for brand copy on a live page; stories and tests import it by path. */
  it("ships no story fixture", () => {
    const entry = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

    expect(entry.match(/FIXTURE_\w+|fixtures"/g) ?? []).toEqual([]);
  });
});
