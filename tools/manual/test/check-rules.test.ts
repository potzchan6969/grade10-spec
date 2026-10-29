import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/** A rule is a list item; a bold name opening a paragraph names none, so the
 * `rule` check warns on it. */
const PAGE = "docs/prds/products/demo/alpha.md";

async function ruleLines(body: string) {
  const root = writeStore({ [PAGE]: `---\ntitle: Alpha\n---\n\n${body}\n` });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule === "rule")
    .map((one: { level: string; reason: string }) => [one.level, one.reason]);
}

describe("a rule written as a paragraph", () => {
  it("warns, naming the list item to write", async () => {
    expect(
      await ruleLines(
        "## Orders\n\n**Private address** — only the owner\n\n❓ **No points** — none",
      ),
    ).toEqual([
      [
        "warn",
        "**Private address** opens a paragraph — write it `- **Private address** — …` so its cases can trace it",
      ],
      [
        "warn",
        "**No points** opens a paragraph — write it `- **No points** — …` so its cases can trace it",
      ],
    ]);
  });

  it("passes a list item, a numbered one, a fenced line and a detail's depth", async () => {
    expect(
      await ruleLines(
        [
          "## Orders",
          "",
          "- **Private address** — only the owner",
          "1. **Repriced** — first",
          "",
          "```md",
          "**Fenced** — an example",
          "```",
          "",
          ':::detail{title="Product decisions" for="pm"}',
          "**Not in scope** — filtering",
          ":::",
        ].join("\n"),
      ),
    ).toEqual([]);
  });
});
