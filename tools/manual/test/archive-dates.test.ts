import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { byShipped, shippedDate } from "../src/api/derive";
import { monthKey } from "../src/api/time";
import { readGitIndex } from "../src/store/git.mts";
import { readArchivedChanges } from "../src/store/read-changes.mts";
import { changeEntry } from "./manual-fixture";
import { writeStore } from "./tmp-store";

/** When a shipped change shipped. The archive directory's `YYYY-MM-DD-` prefix
 * is the record; the commits under it are not, and a rebase or a bulk
 * migration proves it by rewriting every one of them to this morning. */

const PROPOSAL = [
  "# Gift cards",
  "",
  "## Why",
  "",
  "Nobody can buy one for a friend.",
  "",
].join("\n");

function committedStore(): string {
  const root = writeStore({
    "openspec/changes/archive/2025-12-20-gift-cards/proposal.md": PROPOSAL,
  });
  const run = (...args: string[]) => execFileSync("git", args, { cwd: root });
  run("init", "--quiet", ".");
  run("add", "-A");
  run(
    "-c",
    "user.email=manual@test",
    "-c",
    "user.name=manual",
    "commit",
    "--quiet",
    "-m",
    "archive gift cards",
  );
  return root;
}

describe("dating the archive", () => {
  it("takes the shipped day from the directory, not from the commit", async () => {
    const root = committedStore();
    const git = await readGitIndex(root, ["openspec"]);
    const [entry] = readArchivedChanges(root, git);

    expect(entry.shippedOn).toBe("2025-12-20");
    // The commit is today's — which is exactly what must not be shown.
    expect(entry.lastMoved).not.toBe("2025-12-20");
    expect(shippedDate(entry)).toBe("2025-12-20");
  });

  it("falls back to movement for a directory nobody dated", () => {
    const undated = changeEntry("gift-cards", [], {
      status: "archived",
      lastMoved: "2026-02-05T10:00:00.000Z",
    });

    expect(undated.shippedOn).toBeUndefined();
    expect(shippedDate(undated)).toBe("2026-02-05T10:00:00.000Z");
  });

  it("orders the timeline newest shipped first", () => {
    const moved = "2026-06-01T00:00:00.000Z";
    const entries = [
      changeEntry("older", [], { shippedOn: "2026-01-05", lastMoved: moved }),
      changeEntry("newer", [], { shippedOn: "2026-03-11", lastMoved: moved }),
    ];

    expect([...entries].sort(byShipped).map((one) => one.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("heads a shipped day with the month it names, in any timezone", () => {
    expect(monthKey("2026-09-01")).toBe(
      new Date(2026, 8, 1).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      }),
    );
  });
});
