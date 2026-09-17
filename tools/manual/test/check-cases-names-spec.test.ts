import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/**
 * A chapter page names the first capability in its frontmatter and shows
 * every other one under its own section — so a `cases` block, or a `changes`
 * block for one still being introduced, counts as the page naming it.
 */
const SPEC = "openspec/specs/demo/beta/spec.md";
const PAGE = "docs/prds/products/demo/alpha.md";

const spec = [
  "# Beta",
  "",
  "## Purpose",
  "",
  "What beta is for.",
  "",
  "## Requirements",
  "",
  "### Requirement: Beta holds",
  "",
  "The system SHALL hold.",
  "",
  "#### Scenario: It holds",
  "",
  "- **WHEN** asked",
  "- **THEN** it holds",
  "",
].join("\n");

async function unreferenced(body: string) {
  const root = writeStore({
    [SPEC]: spec,
    [PAGE]: `---\ntitle: Alpha\n---\n\n## Shape\n\n${body}\n`,
  });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule === "unreferenced")
    .map((one: { reason: string }) => one.reason);
}

describe("a page naming a capability through its blocks", () => {
  it("counts a cases block as the page naming the spec", async () => {
    expect(await unreferenced('::cases{id="demo/beta"}')).toEqual([]);
  });

  it("counts a changes block as the page naming the spec", async () => {
    expect(await unreferenced('::changes{spec="demo/beta"}')).toEqual([]);
  });

  it("still names a spec neither a block nor the frontmatter reaches", async () => {
    expect(await unreferenced("Prose alone.")).toEqual([
      "no page names `demo/beta`",
    ]);
  });
});
