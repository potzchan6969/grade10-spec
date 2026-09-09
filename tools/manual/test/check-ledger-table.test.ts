import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

/**
 * A worked case belongs in an example, which sums its points and refuses a
 * timeline that runs backwards. A page that draws the same ledger by hand
 * gets a table nothing holds to its own arithmetic.
 */
const PAGE = "docs/prds/products/demo/alpha.md";

const LEDGER = [
  "| When | Event | Points | Balance |",
  "| --- | --- | --- | --- |",
  "| 2026/01/03 | earn | +15 | 15 |",
].join("\n");

async function ledgerLines(body: string) {
  const root = writeStore({
    [PAGE]: `---\ntitle: Alpha\n---\n\n${body}\n`,
  });
  const { findings } = await runChecks(root, NO_GIT);
  return findings
    .filter((one: { rule: string }) => one.rule === "ledger")
    .map((one: { reason: string }) => one.reason);
}

describe("a ledger a page draws by hand", () => {
  it("names the page that writes one in prose", async () => {
    expect(await ledgerLines(LEDGER)).toEqual([
      'a `When | Event | Points | Balance` table is an example\'s ledger — write it as `:::example{title="…"}` and the check holds its balances',
    ]);
  });

  it("says nothing where the ledger is the example's own", async () => {
    expect(
      await ledgerLines(
        `:::example{title="One earn"}\n- Gengar single $139\n\n${LEDGER}\n:::`,
      ),
    ).toEqual([]);
  });

  it("says nothing about a fenced ledger, which documents the grammar", async () => {
    expect(
      await ledgerLines(`Write it this way:\n\n\`\`\`md\n${LEDGER}\n\`\`\``),
    ).toEqual([]);
  });

  it("leaves a table that is not a ledger alone", async () => {
    expect(
      await ledgerLines(
        "| When | Event | Balance | Earned |\n| --- | --- | --- | --- |\n| 2026/01/03 | earn | 15 | 15 |",
      ),
    ).toEqual([]);
  });

  it("names the steps ledger too", async () => {
    const steps = LEDGER.replace("| When |", "| Step |").replace(
      "| 2026/01/03 |",
      "| Order paid |",
    );
    expect(await ledgerLines(steps)).toEqual([
      'a `Step | Event | Points | Balance` table is an example\'s ledger — write it as `:::example{title="…"}` and the check holds its balances',
    ]);
  });
});
