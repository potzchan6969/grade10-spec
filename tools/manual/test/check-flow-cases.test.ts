import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/**
 * Neighbouring flows under one title are one flow's cases, and the reader
 * picks between them by name — so each names its own, no two name the same,
 * and a lone flow names none.
 */
const PAGE = "docs/prds/products/demo/alpha.md";

const flow = (title: string, named?: string) =>
  `:::flow{title="${title}"${named === undefined ? "" : ` case="${named}"`}}\n\n## *Store* — **Order recorded**\n\nWhat happens.\n\n:::`;

async function caseLines(flows: string[]) {
  const root = writeStore({
    [PAGE]: `---\ntitle: Alpha\n---\n\n${flows.join("\n\n")}\n`,
  });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule === "case")
    .map((one: { reason: string }) => one.reason)
    .sort();
}

describe("flows sharing one title", () => {
  it("says nothing where every case is named once", async () => {
    expect(
      await caseLines([
        flow("Pricing", "Normal"),
        flow("Pricing", "Nothing itemised"),
      ]),
    ).toEqual([]);
  });

  it("names the flow that sits with others and names no case", async () => {
    expect(
      await caseLines([flow("Pricing"), flow("Pricing", "Nothing itemised")]),
    ).toEqual([
      '::flow{title="Pricing"} sits with other flows under its title and names no case',
    ]);
  });

  it("names a case used twice", async () => {
    expect(
      await caseLines([flow("Pricing", "Normal"), flow("Pricing", "Normal")]),
    ).toEqual(['::flow{title="Pricing"} names the case `Normal` twice']);
  });

  it("refuses a case on a flow that stands alone", async () => {
    expect(await caseLines([flow("Pricing", "Normal")])).toEqual([
      '::flow{title="Pricing"} names the case `Normal` but stands alone',
    ]);
  });

  it("refuses two same-titled flows that sit apart", async () => {
    expect(
      await caseLines([
        flow("Pricing", "Normal"),
        flow("Pricing", "Nothing itemised"),
        "::children",
        flow("Pricing", "A custom sale"),
      ]),
    ).toEqual([
      '::flow{title="Pricing"} names the case `A custom sale` but stands alone',
      "two flows titled `Pricing` sit apart on this page, so their steps share ids",
    ]);
  });
});
