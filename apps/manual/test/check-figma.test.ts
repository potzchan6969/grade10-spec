import { describe, expect, it } from "vitest";
import { runChecks } from "../../../scripts/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/**
 * A figma.com host was the only thing this rule asserted, which let a made-up
 * link ship as a real card. Where the nightly design-sync report exists it
 * knows the file it read, every node a link can name in it, and every set it
 * checked — so the same rule now holds a card to all three.
 */
const FILE = "GW2WL6JcWok5ypUrUFi9bU";
const url = (node?: string) =>
  `https://www.figma.com/design/${FILE}/Grade10-DS-2026${node ? `?node-id=${node}` : ""}`;

const REPORT = {
  generatedAt: "2026-08-30T01:00:00.000Z",
  file: FILE,
  sets: { "Cart Drawer": "warn" },
  nodes: { "4735-6493": "Cart Drawer", "4171-9023": "Store" },
};

const PAGE = "manual/products/demo/alpha.md";

async function figmaLines(cards: string[], report: unknown = REPORT) {
  const root = writeStore({
    [PAGE]: `---\ntitle: Alpha\n---\n\n${cards.join("\n\n")}\n`,
    ...(report ? { ".design-sync/report.json": JSON.stringify(report) } : {}),
  });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule === "figma")
    .map((one: { reason: string }) => one.reason)
    .sort();
}

describe("a figma card against the design-sync report", () => {
  it("says nothing about a frame the report knows", async () => {
    expect(
      await figmaLines([`::figma{url="${url("4735-6493")}" title="Cart"}`]),
    ).toEqual([]);
  });

  /** The one drift a designer causes most often, and nothing anywhere noticed
   * it before: the host was all this rule ever asserted. */
  it("names a frame the design file no longer holds", async () => {
    const lines = await figmaLines([
      `::figma{url="${url("9999-1")}" title="Gone"}`,
    ]);

    expect(lines[0]).toContain("node 9999-1 is in no page, frame or component");
  });

  it("names a url pointing into some other Figma file", async () => {
    const lines = await figmaLines([
      '::figma{url="https://www.figma.com/design/abc/Store" title="Made up"}',
    ]);

    expect(lines[0]).toContain(`is in Figma file abc, not ${FILE}`);
  });

  it("holds a hand-named set to the sets the report actually checked", async () => {
    const lines = await figmaLines([
      `::figma{url="${url("4171-9023")}" title="Store page" set="Ghost"}`,
    ]);

    expect(lines).toEqual([
      '::figma{set="Ghost"} is not a component set the design-sync report checked',
    ]);
  });

  it("accepts a hand-named set the report carries", async () => {
    expect(
      await figmaLines([
        `::figma{url="${url("4171-9023")}" title="Store page" set="Cart Drawer"}`,
      ]),
    ).toEqual([]);
  });

  it("still refuses a link that is not figma.com at all", async () => {
    expect(
      await figmaLines(['::figma{url="https://example.com/x" title="Nope"}']),
    ).toEqual(['::figma{url="https://example.com/x"} is not a figma.com link']);
  });

  /** A store that has never run the check leaves every figma card unchecked,
   * the same way an unbuilt Storybook index leaves every story id unchecked. */
  it("checks nothing beyond the host when there is no report", async () => {
    expect(
      await figmaLines(
        [
          `::figma{url="${url("9999-1")}" title="Gone"}`,
          `::figma{url="${url()}" title="Whole file" set="Ghost"}`,
        ],
        null,
      ),
    ).toEqual([]);
  });

  it("says nothing about a url naming no node at all", async () => {
    expect(
      await figmaLines([`::figma{url="${url()}" title="The file"}`]),
    ).toEqual([]);
  });
});
