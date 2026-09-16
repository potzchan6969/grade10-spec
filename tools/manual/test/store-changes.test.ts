import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import {
  readArchivedChanges,
  readChanges,
} from "../src/store/read-changes.mts";
import { writeStore } from "./tmp-store";

const FIXTURE = fileURLToPath(new URL("../demo-store", import.meta.url));

const changes = readChanges(FIXTURE, NO_GIT, null);
const change = changes[0];

describe("in-flight changes", () => {
  it("reads one entry per change directory, archive aside", () => {
    expect(changes.map((one) => one.id)).toEqual(["add-thing"]);
    expect(change.status).toBe("in-flight");
  });

  it("takes schema and created from .openspec.yaml", () => {
    expect(change.schema).toBe("grade10-planning");
    expect(change.created).toBe("2026-01-01");
  });

  it("takes title and why from the proposal", () => {
    expect(change.title).toBe("Add the thing");
    expect(change.why).toBe(
      "Nothing does the thing yet, so nobody can tell whether it happened.",
    );
  });

  it("collects owners from (owner: @handle) tags, once each", () => {
    expect(change.owners).toEqual(["tester", "other"]);
  });

  it("reads an owner tag the way task-ownership.md defines it", () => {
    const root = writeStore({
      "openspec/specs/demo/alpha/spec.md":
        "# Alpha\n\n## Purpose\n\nA.\n\n## Requirements\n",
      "openspec/changes/tagged/proposal.md":
        "# Tagged\n\n## Why\n\nOwners are written by hand.\n",
      "openspec/changes/tagged/tasks.md": [
        "## 1. Contracts (grade10-spec) (owner: alice.b)",
        "",
        "- [ ] 1.1 Publish it",
        "",
        "## 2. Surface (grade10) (owner: unassigned)",
        "",
        "- [ ] 2.1 Render it",
        "",
        "## 3. Verify (grade10) (owner: @Alice.B)",
        "",
        "- [ ] 3.1 Check it",
        "",
      ].join("\n"),
    });
    const [entry] = readChanges(root, NO_GIT, null);
    expect(entry.owners).toEqual(["alice.b"]);
    expect(
      entry.taskGroups.map(({ title, repo, owner }) => ({
        title,
        repo,
        owner,
      })),
    ).toEqual([
      { title: "Contracts", repo: "grade10-spec", owner: "alice.b" },
      { title: "Surface", repo: "grade10", owner: undefined },
      { title: "Verify", repo: "grade10", owner: "alice.b" },
    ]);
  });

  it("takes the author handle from the proposal's author line", () => {
    expect(change.author).toBe("tester");
  });

  it("counts a task group's checkboxes, nested ones included", () => {
    expect(
      change.taskGroups.map(({ title, repo, done, total }) => ({
        title,
        repo,
        done,
        total,
      })),
    ).toEqual([
      { title: "Contracts", repo: "grade10-spec", done: 2, total: 3 },
      { title: "Surface", repo: "grade10", done: 0, total: 2 },
      { title: "Review", repo: "", done: 0, total: 0 },
    ]);
  });

  /** "2 of 3" is only useful if it can say which one is open. */
  it("carries every checkbox line, numbering and all", () => {
    expect(change.taskGroups[0].tasks).toEqual([
      { text: "1.1 Publish the contract.", done: true },
      { text: "1.2 Adopt it.", done: false },
      {
        text: "1.3 A nested checkbox still counts toward this group.",
        done: true,
      },
    ]);
    expect(change.taskGroups[2].tasks).toEqual([]);
  });

  it("reads delta kinds and the requirements each one touches", () => {
    expect(
      change.deltas.map((delta) => ({
        ...delta,
        requirements: delta.requirements.map(({ name, kind }) => ({
          name,
          kind,
        })),
      })),
    ).toEqual([
      {
        spec: "demo-product/alpha",
        kinds: ["ADDED", "MODIFIED"],
        requirements: [
          { name: "The thing is watched", kind: "added" },
          { name: "The thing happens once", kind: "modified" },
        ],
      },
    ]);
  });

  /** The delta block is the only place the app can read what a change will
   * say — 157 of the store's in-flight delta requirements are ADDED, so
   * without it they are rendered nowhere. */
  it("carries each requirement's delta block, heading first", () => {
    const [added, modified] = change.deltas[0].requirements;
    expect(added.text).toContain("### Requirement: The thing is watched");
    expect(added.text).toContain("#### Scenario:");
    expect(
      modified.text?.startsWith("### Requirement: The thing happens once"),
    ).toBe(true);
  });

  /** `draft-spec.md` sits beside the delta in the fixture: a file that merely
   * ends in `spec.md` is a different file, and reading it invents a spec. */
  it("reads the delta named spec.md, not everything ending in it", () => {
    expect(change.deltas.map((delta) => delta.spec)).not.toContain(
      "demo-product/alpha/draft",
    );
    expect(change.error).toBeUndefined();
  });

  it("has no error", () => {
    expect(change.error).toBeUndefined();
  });
});

describe("archived changes", () => {
  const archived = readArchivedChanges(FIXTURE, NO_GIT);

  it("strips the archive date prefix from the id, and keeps it as the shipped day", () => {
    expect(archived.map((one) => one.id)).toEqual(["old-thing"]);
    expect(archived[0].status).toBe("archived");
    expect(archived[0].shippedOn).toBe("2026-01-02");
  });

  it("falls back to the author line for created, and the id for a title", () => {
    expect(archived[0].created).toBe("2025-12-20");
    expect(archived[0].title).toBe("Old thing");
    expect(archived[0].author).toBe("tester");
  });

  it("accepts `## Why now` as the rationale", () => {
    expect(archived[0].why).toBe(
      "The old thing had to move before the new thing could.",
    );
  });

  it("survives a change with no .openspec.yaml", () => {
    expect(archived[0].schema).toBe("");
    expect(archived[0].error).toBeUndefined();
  });

  it("keeps the follow-ons an archived proposal named", () => {
    expect(archived[0].followOns).toEqual([
      "The new thing, which this move was for.",
    ]);
  });
});

/** What a change said would come next — read like the citations beside it, and
 * left out entirely by a proposal that named none. */
describe("follow-on changes", () => {
  it("reads the bullets, a wrapped one folded back into a single item", () => {
    expect(change.followOns).toEqual([
      "**The thing happens twice**, for the collectors who asked for a second one the same day.",
      "A record anyone can read back.",
    ]);
  });

  it("names none when the proposal has no such section", () => {
    const [entry] = readChanges(
      writeStore({
        "openspec/changes/quiet-thing/proposal.md":
          "# Quiet thing\n\n## Why\n\nIt says nothing about what comes after.\n",
      }),
      NO_GIT,
      null,
    );
    expect(entry.followOns).toBeUndefined();
  });

  it("leaves prose after the list out of the last bullet", () => {
    const [entry] = readChanges(
      writeStore({
        "openspec/changes/wordy-thing/proposal.md": [
          "# Wordy thing",
          "",
          "## Why",
          "",
          "It has more to say than a list.",
          "",
          "## Follow-on changes",
          "",
          "- The one thing that follows,",
          "  written across two lines.",
          "",
          "None of these are scheduled.",
          "",
        ].join("\n"),
      }),
      NO_GIT,
      null,
    );
    expect(entry.followOns).toEqual([
      "The one thing that follows, written across two lines.",
    ]);
  });
});

/** `openspec/config.yaml` tells authors to group requirements under a plain
 * `###` heading, and openspec ignores those when it folds. A reader that took
 * them for requirements would badge a group name nobody wrote — and the
 * durable reader, which refuses them, must never see one. */
describe("a delta that groups, renames, and spaces its headings", () => {
  const [entry] = readChanges(
    writeStore({
      "openspec/changes/group-thing/proposal.md":
        "# Group thing\n\n## Why\n\nThe delta groups what it adds.\n",
      "openspec/changes/group-thing/specs/demo-product/alpha/spec.md": [
        "## ADDED Requirements",
        "",
        "### Product stock",
        "",
        "---",
        "",
        "### Requirement: Stock is counted",
        "",
        "The system SHALL count the stock.",
        "",
        "## MODIFIED Requirements",
        "",
        "### Requirement:   The thing   happens once  ",
        "",
        "The system SHALL do the thing exactly once.",
        "",
        "## RENAMED Requirements",
        "",
        "- FROM: `### Requirement: The thing is written down`",
        "- TO: `### Requirement: The thing leaves a record`",
        "",
      ].join("\n"),
    }),
    NO_GIT,
    null,
  );
  const [delta] = entry.deltas;

  it("names every kind the delta carries", () => {
    expect(delta.kinds).toEqual(["ADDED", "MODIFIED", "RENAMED"]);
    expect(entry.error).toBeUndefined();
  });

  it("skips the group heading and keeps the name as written", () => {
    expect(
      delta.requirements.map(({ name, kind }) => ({ name, kind })),
    ).toEqual([
      { name: "Stock is counted", kind: "added" },
      { name: "The thing   happens once", kind: "modified" },
      { name: "The thing is written down", kind: "renamed" },
    ]);
  });

  it("records a rename under the name that still exists, and says where it lands", () => {
    expect(delta.requirements.map((one) => one.name)).not.toContain(
      "The thing leaves a record",
    );
    expect(delta.requirements[2].to).toBe("The thing leaves a record");
    expect(delta.requirements[2].text).toBeUndefined();
  });
});

describe("a promoted change carrying its suites", () => {
  const [entry] = readChanges(
    writeStore({
      "openspec/changes/promoted-thing/.openspec.yaml":
        "schema: grade10-planning\npromoted_by: '@devon'\ncreated: 2026-01-01\n",
      "openspec/changes/promoted-thing/proposal.md":
        "# Promoted thing\n\n**Author:** @priya - 2026-01-01\n\n## Why\n\nIt was time.\n",
      "openspec/changes/promoted-thing/specs/demo-product/alpha/spec.md":
        "## ADDED Requirements\n\n### Requirement: A\n\nThe system SHALL a.\n",
      "openspec/changes/promoted-thing/specs/demo-product/alpha/feature-tcs.md":
        [
          "# Alpha test cases",
          "",
          "**Status:** pending-review",
          "",
          "### alpha-TC-01: It happens",
          "",
          "- **Status:** actual",
          "- **Trace:** alpha-SC-01",
          "",
          "### alpha-TC-02: It happens again",
          "",
          "- **Status:** draft",
          "- **Trace:** alpha-SC-01",
          "",
        ].join("\n"),
    }),
    NO_GIT,
    null,
  );

  it("names the promoter from .openspec.yaml", () => {
    expect(entry.promotedBy).toBe("devon");
  });

  it("counts the suite beside each delta", () => {
    expect(entry.suites).toEqual([
      {
        spec: "demo-product/alpha",
        status: "pending-review",
        cases: { draft: 1, actual: 1, deprecated: 0, total: 2 },
      },
    ]);
  });

  /** The suite is QA's file: one it cannot parse stays its own finding and
   * never takes the change's card down. */
  it("contains a malformed suite as the suite's own error", () => {
    const [broken] = readChanges(
      writeStore({
        "openspec/changes/broken-suite/proposal.md":
          "# Broken suite\n\n## Why\n\nStill readable.\n",
        "openspec/changes/broken-suite/specs/demo-product/alpha/spec.md":
          "## ADDED Requirements\n\n### Requirement: A\n\nThe system SHALL a.\n",
        "openspec/changes/broken-suite/specs/demo-product/alpha/feature-tcs.md":
          "# No status here\n",
      }),
      NO_GIT,
      null,
    );

    expect(broken.error).toBeUndefined();
    expect(broken.suites?.[0].error?.message).toContain("**Status:**");
  });
});

describe("an author line without a date", () => {
  const [entry] = readChanges(
    writeStore({
      "openspec/changes/solo-thing/proposal.md":
        "# Solo thing\n\n**Author:** @solo\n\n## Why\n\nSomebody had to.\n",
    }),
    NO_GIT,
    null,
  );

  it("still names the author, and leaves created unknown", () => {
    expect(entry.author).toBe("solo");
    expect(entry.created).toBe("");
  });
});

describe("a proposal with no author line", () => {
  const [entry] = readChanges(
    writeStore({
      "openspec/changes/anon-thing/proposal.md":
        "# Anon thing\n\n## Why\n\nNobody signed it.\n",
    }),
    NO_GIT,
    null,
  );

  it("names nobody rather than inventing one", () => {
    expect(entry.author).toBeUndefined();
    expect(entry.owners).toEqual([]);
    expect(entry.error).toBeUndefined();
  });
});
