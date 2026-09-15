import { describe, expect, it } from "vitest";
import { pendingByHand } from "../src/api/derive";
import type { ChangeEntry, Delta, SchemaArtifact } from "../src/api/types";
import { changeEntry } from "./manual-fixture";
import { realStore } from "./real-store";

/** What each hand owes, derived from the artifacts a change has written
 * against the ones its schema declares — never stored, never assigned. */

const delta: Delta = { spec: "demo/alpha", kinds: ["ADDED"], requirements: [] };

const artifact = (
  id: string,
  generates: string,
  hand: string,
  requires: string[],
  required = true,
): SchemaArtifact => ({ id, generates, hand, requires, required });

/** The real chain, three deep: every row on the live board comes off
 * `test-cases`, which nothing reaches until the journeys are written. */
const SCHEMAS: Record<string, SchemaArtifact[]> = {
  demo: [
    artifact("proposal", "proposal.md", "product-manager", []),
    artifact("specs", "specs/**/spec.md", "product-manager", ["proposal"]),
    artifact("user-journeys", "specs/**/user-journeys.md", "product-manager", [
      "specs",
    ]),
    artifact("test-cases", "specs/**/feature-tcs.md", "product-manager", [
      "user-journeys",
    ]),
    artifact("ui-design", "ui-design.md", "designer", ["specs"], false),
    artifact("tasks", "tasks.md", "engineer", ["specs"]),
  ],
};

const on = (id: string, deltas: Delta[], fields: Partial<ChangeEntry> = {}) =>
  changeEntry(id, deltas, { schema: "demo", ...fields });

const owed = (changes: ChangeEntry[]) =>
  pendingByHand(changes, SCHEMAS).map((one) => [
    one.hand,
    one.items.map((item) => item.artifact),
  ]);

describe("what each hand still owes", () => {
  it("asks the hand that writes an artifact for the one it has not written", () => {
    expect(owed([on("idea", [], { written: ["proposal"] })])).toEqual([
      ["product-manager", ["specs"]],
      ["designer", []],
      ["engineer", []],
    ]);
  });

  it("waits for what an artifact is built on before asking for it", () => {
    const written = ["proposal", "specs"];
    expect(owed([on("specified", [delta], { written })])).toEqual([
      ["product-manager", ["user-journeys"]],
      ["designer", []],
      ["engineer", ["tasks"]],
    ]);
  });

  it("asks for the suite only once the journeys are written", () => {
    const written = ["proposal", "specs", "user-journeys"];
    expect(owed([on("walked", [delta], { written })])).toEqual([
      ["product-manager", ["test-cases"]],
      ["designer", []],
      ["engineer", ["tasks"]],
    ]);
  });

  it("never derives an optional artifact as owed", () => {
    const written = ["proposal", "specs", "user-journeys", "test-cases"];
    expect(owed([on("drawn", [delta], { written })])).toEqual([
      ["product-manager", []],
      ["designer", []],
      ["engineer", ["tasks"]],
    ]);
  });

  it("shows an optional artifact the change says it is waiting for", () => {
    const change = on("specified", [delta], {
      written: ["proposal", "specs"],
      awaiting: [{ artifact: "ui-design", why: "nothing draws the banner" }],
    });
    const designer = pendingByHand([change], SCHEMAS).find(
      (one) => one.hand === "designer",
    );
    expect(designer?.items).toEqual([
      { change, artifact: "ui-design", why: "nothing draws the banner" },
    ]);
  });

  it("carries the change's own words on an artifact it would owe anyway", () => {
    const change = on("idea", [], {
      written: ["proposal"],
      awaiting: [{ artifact: "specs", why: "legal has not answered" }],
    });
    const [pm] = pendingByHand([change], SCHEMAS);
    expect(pm.items).toEqual([
      { change, artifact: "specs", why: "legal has not answered" },
    ]);
  });

  it("holds a waiver to what it waives, and to what stood on it", () => {
    // `skip_specs` says no behaviour moves, so no requirements are owed — and
    // `tasks`, which stands on them, is still owed rather than suppressed.
    const change = on("tooling", [], {
      written: ["proposal"],
      skipSpecs: "no capability moves",
    });
    expect(owed([change])).toEqual([
      ["product-manager", []],
      ["designer", []],
      ["engineer", ["tasks"]],
    ]);
  });

  it("lets a change speak over its own waiver", () => {
    const change = on("tooling", [], {
      written: ["proposal"],
      skipSpecs: "no capability moves",
      awaiting: [{ artifact: "specs", why: "the refactor may move a rule" }],
    });
    const [pm] = pendingByHand([change], SCHEMAS);
    expect(pm.items.map((item) => item.artifact)).toEqual(["specs"]);
  });

  it("leaves a change on a schema this store cannot read alone", () => {
    const change = changeEntry("foreign", [delta], { schema: "full-planning" });
    expect(owed([change])).toEqual([
      ["product-manager", []],
      ["designer", []],
      ["engineer", []],
    ]);
  });

  it("names every hand the schemas declare, so an idle one is still answered", () => {
    expect(owed([])).toEqual([
      ["product-manager", []],
      ["designer", []],
      ["engineer", []],
    ]);
  });

  it("reads the oldest change first — a worklist is read from the top", () => {
    const written = ["proposal", "specs"];
    const old = on("old", [delta], { written, created: "2026-01-01" });
    const recent = on("recent", [delta], { written, created: "2026-06-01" });
    const engineer = pendingByHand([recent, old], SCHEMAS).find(
      (one) => one.hand === "engineer",
    );
    expect(engineer?.items.map((item) => item.change.id)).toEqual([
      "old",
      "recent",
    ]);
  });
});

describe("against the store as it stands", () => {
  const artifacts = realStore.snapshot.schemas["grade10-planning"];

  it("names a role for every artifact the planning schema declares", () => {
    expect(artifacts?.length).toBeGreaterThan(0);
    expect(artifacts?.filter((one) => one.hand === undefined)).toEqual([]);
  });

  it("reads the chain and the optional artifacts off the schema file", () => {
    const byId = new Map(artifacts?.map((one) => [one.id, one]));
    expect(byId.get("test-cases")?.requires).toEqual(["user-journeys"]);
    expect(byId.get("ui-design")?.required).toBe(false);
    expect(byId.get("tasks")?.required).toBe(true);
  });

  it("asks no hand for an artifact the change has already written", () => {
    for (const { items } of pendingByHand(
      realStore.snapshot.changes,
      realStore.snapshot.schemas,
    )) {
      for (const item of items) {
        expect(item.change.written).not.toContain(item.artifact);
      }
    }
  });
});
