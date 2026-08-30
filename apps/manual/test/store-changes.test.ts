import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import {
  readArchivedChanges,
  readChanges,
} from "../src/store/read-changes.mts";
import { writeStore } from "./tmp-store";

const FIXTURE = fileURLToPath(new URL("./fixtures/store", import.meta.url));

const changes = readChanges(FIXTURE, NO_GIT);
const change = changes[0];

describe("in-flight changes", () => {
  it("reads one entry per change directory, archive aside", () => {
    expect(changes.map((one) => one.id)).toEqual(["add-thing"]);
    expect(change.status).toBe("in-flight");
  });

  it("takes schema and created from .openspec.yaml", () => {
    expect(change.schema).toBe("full-planning");
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

  it("takes the author handle from the proposal's author line", () => {
    expect(change.author).toBe("tester");
  });

  it("counts a task group's checkboxes, nested ones included", () => {
    expect(change.taskGroups).toEqual([
      { title: "Contracts", repo: "grade10-spec", done: 2, total: 3 },
      { title: "Surface", repo: "grade10", done: 0, total: 2 },
      { title: "Review", repo: "", done: 0, total: 0 },
    ]);
  });

  it("reads delta kinds and the requirements each one touches", () => {
    expect(change.deltas).toEqual([
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

  it("strips the archive date prefix from the id", () => {
    expect(archived.map((one) => one.id)).toEqual(["old-thing"]);
    expect(archived[0].status).toBe("archived");
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
  );
  const [delta] = entry.deltas;

  it("names every kind the delta carries", () => {
    expect(delta.kinds).toEqual(["ADDED", "MODIFIED", "RENAMED"]);
    expect(entry.error).toBeUndefined();
  });

  it("skips the group heading and keeps the name as written", () => {
    expect(delta.requirements).toEqual([
      { name: "Stock is counted", kind: "added" },
      { name: "The thing   happens once", kind: "modified" },
      { name: "The thing is written down", kind: "renamed" },
    ]);
  });

  it("records a rename under the name that still exists", () => {
    expect(delta.requirements.map((one) => one.name)).not.toContain(
      "The thing leaves a record",
    );
  });
});

describe("an author line without a date", () => {
  const [entry] = readChanges(
    writeStore({
      "openspec/changes/solo-thing/proposal.md":
        "# Solo thing\n\n**Author:** @solo\n\n## Why\n\nSomebody had to.\n",
    }),
    NO_GIT,
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
  );

  it("names nobody rather than inventing one", () => {
    expect(entry.author).toBeUndefined();
    expect(entry.owners).toEqual([]);
    expect(entry.error).toBeUndefined();
  });
});
