import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT, readGitIndex } from "../src/store/git.mts";
import {
  archivedDeltaFiles,
  readArchivedChanges,
  readChanges,
  readIssuedIds,
} from "../src/store/read-changes.mts";
import { writeStore } from "./tmp-store";

/** What a change carries beyond its counts: who owns it, when it is due, what
 * it waits on, what it cites, which line is open, and what its delta will
 * say. Every one of them is read off a file that has to exist anyway. */

const FIXTURE = fileURLToPath(new URL("./fixtures/store", import.meta.url));

const PROPOSAL = [
  "# Gift cards",
  "",
  "**Author:** @echo - 2026-08-30",
  "",
  "## Why",
  "",
  "Nobody can buy one for a friend.",
  "",
  "## References",
  "",
  "- `grade10-store/loyalty`",
  "- `loyalty-SC-89`",
  "- A purchase earns points",
  "",
].join("\n");

const TASKS = [
  "## 1. Contracts (grade10-spec) (owner: @tagged)",
  "",
  "- [x] 1.1 Publish the contract",
  "- [ ] 1.2 Adopt it (owner: @picker)",
  "",
].join("\n");

function changeWith(manifest: string, extra: Record<string, string> = {}) {
  const [entry] = readChanges(
    writeStore({
      "openspec/changes/gift-cards/.openspec.yaml": manifest,
      "openspec/changes/gift-cards/proposal.md": PROPOSAL,
      ...extra,
    }),
    NO_GIT,
  );
  return entry;
}

describe("the manifest a board reads", () => {
  const entry = changeWith(
    [
      "schema: grade10-planning",
      "created: 2026-08-20",
      "target: 2026-09-15",
      "owners:",
      "  - echo",
      '  - "@echo"',
      "depends_on:",
      "  - revise-loyalty-programme-rules",
      "  - add-shopify-membership-pos",
      "",
    ].join("\n"),
    { "openspec/changes/gift-cards/tasks.md": TASKS },
  );

  it("names the owners the yaml declares before the ones the tasks tag", () => {
    expect(entry.owners).toEqual(["echo", "tagged", "picker"]);
  });

  it("carries the target date and the dependencies as written", () => {
    expect(entry.target).toBe("2026-09-15");
    expect(entry.dependsOn).toEqual([
      "revise-loyalty-programme-rules",
      "add-shopify-membership-pos",
    ]);
    expect(entry.error).toBeUndefined();
  });

  it("takes a single owner and a bare date the same way", () => {
    const single = changeWith("owner: solo\ntarget: 2026-09-15\n");
    expect(single.owners).toEqual(["solo"]);
    expect(single.target).toBe("2026-09-15");
  });

  it("names nobody and waits on nothing when the manifest says nothing", () => {
    const bare = changeWith("schema: grade10-planning\n");
    expect(bare.owners).toEqual([]);
    expect(bare.target).toBeUndefined();
    expect(bare.dependsOn).toBeUndefined();
  });

  /** Two in-flight changes have no manifest at all, and the board still has
   * to draw them. */
  it("survives a change with no manifest", () => {
    const [entry] = readChanges(
      writeStore({ "openspec/changes/gift-cards/proposal.md": PROPOSAL }),
      NO_GIT,
    );
    expect(entry.error).toBeUndefined();
    expect(entry.owners).toEqual([]);
    expect(entry.created).toBe("2026-08-30");
  });
});

describe("what a proposal cites", () => {
  it("reads the References bullets back, ids and headings alike", () => {
    expect(changeWith("schema: grade10-planning\n").cites).toEqual([
      "grade10-store/loyalty",
      "loyalty-SC-89",
      "A purchase earns points",
    ]);
  });

  it("names none when the proposal has no References", () => {
    const [entry] = readChanges(
      writeStore({
        "openspec/changes/quiet/proposal.md":
          "# Quiet\n\n## Why\n\nNothing to point at.\n",
      }),
      NO_GIT,
    );
    expect(entry.cites).toBeUndefined();
  });
});

/** The archive shares the change type, and the heavy fields would grow its
 * payload for a board that has no reader for them. */
describe("what the archive is spared", () => {
  const dir = "openspec/changes/archive/2026-01-02-old-thing";
  const [archived] = readArchivedChanges(
    writeStore({
      [`${dir}/proposal.md`]: "# Old thing\n\n## Why\n\nIt was.\n",
      [`${dir}/tasks.md`]: TASKS,
      [`${dir}/specs/demo-product/alpha/spec.md`]:
        "## ADDED Requirements\n\n### Requirement: A\n\nThe system SHALL a.\n",
    }),
    NO_GIT,
  );

  it("counts its tasks without carrying the lines", () => {
    expect(archived.taskGroups).toEqual([
      {
        num: "1",
        title: "Contracts",
        repo: "grade10-spec",
        owner: "tagged",
        done: 1,
        total: 2,
      },
    ]);
  });

  it("names its delta requirements without carrying the blocks", () => {
    expect(archived.deltas[0].requirements).toEqual([
      { name: "A", kind: "added" },
    ]);
  });

  it("keeps carrying them for a change still in flight", () => {
    const [inFlight] = readChanges(FIXTURE, NO_GIT);
    expect(inFlight.taskGroups[0].tasks).toBeDefined();
    expect(inFlight.deltas[0].requirements[0].text).toBeDefined();
  });
});

/** `readArchivedChanges` drops the date a folder name carries, so an entry id
 * cannot rebuild its own path — the walk is the way back to the files. */
describe("the archive walk", () => {
  it("names each archived delta file against the change that wrote it", () => {
    const root = writeStore({
      "openspec/changes/archive/2026-01-02-old-thing/proposal.md":
        "# Old thing\n\n## Why\n\nIt was.\n",
      "openspec/changes/archive/2026-01-02-old-thing/specs/demo-product/alpha/spec.md":
        "## ADDED Requirements\n\n### Requirement: A\n\nThe system SHALL a.\n",
    });

    expect(archivedDeltaFiles(root)).toEqual([
      {
        change: "old-thing",
        spec: "demo-product/alpha",
        file: "openspec/changes/archive/2026-01-02-old-thing/specs/demo-product/alpha/spec.md",
      },
    ]);
  });
});

describe("the ids a capability has issued", () => {
  const root = writeStore({
    "openspec/changes/gift-cards/specs/grade10-store/loyalty/spec.md":
      "## ADDED Requirements\n\n### Requirement: B\n\n#### Scenario: loyalty-SC-90 - b\n",
    "openspec/changes/archive/2026-01-02-old-thing/specs/grade10-store/loyalty/spec.md":
      "## User journeys\n\n### loyalty-US-12: A story\n\nGone at the fold.\n",
  });

  it("counts the durable text, the in-flight delta and the archive together", () => {
    const issued = readIssuedIds(root, ["loyalty-SC-40", "loyalty-TC-07"]);
    expect(issued.get("loyalty")).toEqual({ sc: 90, us: 12, tc: 7 });
  });

  it("knows nothing about a capability nobody has issued for", () => {
    expect(readIssuedIds(root).get("membership")).toBeUndefined();
  });
});

/** A change that stops at its requirements writes specs and no tasks.md, so a lastMoved keyed to
 * tasks.md reports it as never having moved however much it churns. */
describe("when a change last moved", () => {
  it("answers from any file of the change, not only its tasks.md", async () => {
    const root = writeStore({
      "openspec/changes/gift-cards/proposal.md": PROPOSAL,
      "openspec/changes/gift-cards/specs/grade10-store/loyalty/spec.md":
        "## ADDED Requirements\n\n### Requirement: A\n\nThe system SHALL a.\n",
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
      "the proposal",
    );

    const git = await readGitIndex(root, ["openspec"]);
    const [entry] = readChanges(root, git);

    expect(git.newestUnder("openspec/changes/gift-cards")?.sha).toBe(git.head);
    expect(entry.lastMoved).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(
      git.commitOf("openspec/changes/gift-cards/tasks.md"),
    ).toBeUndefined();
  });
});
