import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { readDesignSync } from "../src/store/design-sync.mts";

/**
 * The design-sync check itself needs Figma; its plugin-dump fallback does not,
 * so the report the manual reads is testable offline. The dump names four sets
 * that reach the four verdicts against this repository's own components:
 * `Table Cell` has a code component and nothing to disagree about, `Separator`
 * has one but no usable description, `Nowhere / Ghost` has no code component at
 * all, and the node id `4200:155` is Product Card's Code Connect template,
 * whose getEnum axes the dump's empty properties cannot answer.
 */
const SCRIPT = fileURLToPath(
  new URL("../../../scripts/design-sync/check-components.mjs", import.meta.url),
);
const DUMP = fileURLToPath(
  new URL("./fixtures/design-sync/dump.json", import.meta.url),
);

function run(args: string[]) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: "utf8",
    env: { ...process.env, FIGMA_DUMP: DUMP, GITHUB_STEP_SUMMARY: "" },
  });
}

const store = () => mkdtempSync(join(tmpdir(), "design-sync-"));

describe("the design-sync report", () => {
  const root = store();
  const written = run(["--report", join(root, ".design-sync", "report.json")]);

  it("keys the verdict by component set, as the checker names them", () => {
    const report = JSON.parse(
      readFileSync(join(root, ".design-sync", "report.json"), "utf8"),
    );

    expect(report.sets).toEqual({
      "Nowhere / Ghost": "warn",
      "Product Card": "fail",
      Separator: "skipped",
      "Table Cell": "ok",
    });
    expect(Date.parse(report.generatedAt)).not.toBeNaN();
  });

  it("writes the shape the snapshot reader accepts, at the path it looks in", () => {
    expect(readDesignSync(root)?.sets["Product Card"]).toBe("fail");
  });

  /** A chip reading "design drift" says nothing anyone can act on. These are
   * the run's own lines — the same strings the console and the job summary
   * print, so a card can never say something the run did not. */
  it("carries why each set got its verdict, in the checker's own words", () => {
    expect(readDesignSync(root)?.messages).toEqual({
      "Nowhere / Ghost": [
        "Nowhere / Ghost: no code component (looked for src/components/**/nowhereghost.tsx or ghost.tsx)",
      ],
      "Product Card": [
        "packages/ui/src/blocks/store-product-listing/product-card.figma.ts: getEnum('soldOut') but Product Card has no such VARIANT property",
      ],
    });
  });

  /** A plugin dump carries no document, so this run cannot say which node ids
   * exist. Writing an empty map would tell the manual every frame in the file
   * had been deleted. */
  it("says nothing about node ids when the source cannot say", () => {
    const written = readDesignSync(root);

    expect(written?.nodes).toBeUndefined();
    expect(written?.file).toBeUndefined();
  });

  it("writes it even on a run that ends in errors — that is the run worth badging", () => {
    expect(written.status).toBe(1);
  });

  it("changes nothing without the flag", () => {
    const quiet = run([]);

    expect(quiet.stdout).not.toContain("report:");
    expect(readDesignSync(store())).toBeUndefined();
  });

  it("refuses --report with no path", () => {
    const finished = run(["--report"]);

    expect(finished.status).toBe(1);
    expect(finished.stderr).toContain("--report needs a path");
  });
});
