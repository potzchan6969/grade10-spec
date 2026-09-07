import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/**
 * The renderer anchors a detail at `detail-<slug of its title>`, so two titles
 * that slug alike on one page take the same anchor and a deep link opens
 * whichever came first.
 */
const PAGE = "docs/prds/products/demo/alpha.md";

const detail = (title: string) =>
  `:::detail{title="${title}"}\n\nWhat is under it.\n\n:::`;

async function detailLines(titles: string[]) {
  const root = writeStore({
    [PAGE]: `---\ntitle: Alpha\n---\n\n${titles.map(detail).join("\n\n")}\n`,
  });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule === "detail")
    .map((one: { reason: string }) => one.reason)
    .sort();
}

describe("two detail blocks on one page", () => {
  it("names the pair that would share an anchor", async () => {
    expect(await detailLines(["Data model", "Data model"])).toEqual([
      '::detail{title="Data model"} and ::detail{title="Data model"} share the anchor `#detail-data-model`',
    ]);
  });

  it("says nothing about two titles that anchor apart", async () => {
    expect(await detailLines(["Data model", "Metrics"])).toEqual([]);
  });

  it("catches titles that differ only in how they are cased", async () => {
    expect(await detailLines(["Code Map", "Code map"])).toEqual([
      '::detail{title="Code Map"} and ::detail{title="Code map"} share the anchor `#detail-code-map`',
    ]);
  });
});
