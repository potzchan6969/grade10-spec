import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/** The other check-manual test calls the checker in-process, where vitest has
 * already transformed the TypeScript it imports. CI runs it as `node
 * scripts/check-manual.mjs`, which reaches those same files through Node's own
 * type stripping — so run it that way at least once. */

const SCRIPT = fileURLToPath(
  new URL("../../../scripts/check-manual.mjs", import.meta.url),
);
const CLEAN = fileURLToPath(new URL("./fixtures/check/clean", import.meta.url));

describe("the checker as CI runs it", () => {
  it("walks a clean store under plain node and exits 0", () => {
    const run = spawnSync(process.execPath, [SCRIPT, CLEAN], {
      encoding: "utf8",
    });

    expect(run.error).toBeUndefined();
    expect(`${run.stdout}${run.stderr}`).toContain("0 failures, 0 warnings");
    expect(run.status).toBe(0);
  });
});
