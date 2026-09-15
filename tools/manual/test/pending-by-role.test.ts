import { describe, expect, it } from "vitest";
import { pendingByRole } from "../src/api/derive";
import type { ChangeEntry, Delta, SchemaArtifact } from "../src/api/types";
import { changeEntry } from "./manual-fixture";
import { realStore } from "./real-store";

/** What each hand owes, derived from the artifacts a change has written
 * against the ones its schema declares — never stored, never assigned. */

const delta: Delta = { spec: "demo/alpha", kinds: ["ADDED"], requirements: [] };

const ARTIFACTS: SchemaArtifact[] = [
  {
    id: "proposal",
    generates: "proposal.md",
    role: "product-manager",
    requires: [],
    required: true,
  },
  {
    id: "specs",
    generates: "specs/**/spec.md",
    role: "product-manager",
    requires: ["proposal"],
    required: true,
  },
  {
    id: "ui-design",
    generates: "ui-design.md",
    role: "designer",
    requires: ["specs"],
    required: false,
  },
  {
    id: "tasks",
    generates: "tasks.md",
    role: "engineer",
    requires: ["specs"],
    required: true,
  },
];

const owed = (changes: ChangeEntry[]) =>
  pendingByRole(changes, ARTIFACTS).map((one) => [
    one.role,
    one.items.map((item) => item.artifact),
  ]);

describe("what each hand still owes", () => {
  it("asks the hand that writes an artifact for the one it has not written", () => {
    const change = changeEntry("idea", [], { written: ["proposal"] });
    expect(owed([change])).toEqual([["product-manager", ["specs"]]]);
  });

  it("waits for what an artifact is built on before asking for it", () => {
    // `tasks` requires `specs`; nothing owes a plan for requirements nobody
    // has written.
    const change = changeEntry("idea", [], { written: ["proposal"] });
    const roles = pendingByRole([change], ARTIFACTS);
    expect(roles.find((one) => one.role === "engineer")).toBeUndefined();
  });

  it("asks the engineer once the specs are written", () => {
    const change = changeEntry("specified", [delta]);
    expect(owed([change])).toEqual([["engineer", ["tasks"]]]);
  });

  it("never derives an optional artifact as owed", () => {
    const change = changeEntry("specified", [delta]);
    const roles = pendingByRole([change], ARTIFACTS);
    expect(roles.find((one) => one.role === "designer")).toBeUndefined();
  });

  it("shows an optional artifact the change says it is waiting for", () => {
    const change = changeEntry("specified", [delta], {
      awaiting: [{ artifact: "ui-design", why: "nothing draws the banner" }],
    });
    const designer = pendingByRole([change], ARTIFACTS).find(
      (one) => one.role === "designer",
    );
    expect(designer?.items[0].why).toBe("nothing draws the banner");
  });

  it("honours a waiver rather than asking for what was excused", () => {
    const change = changeEntry("tooling", [], {
      written: ["proposal"],
      skipSpecs: true,
    });
    expect(owed([change])).toEqual([]);
  });

  it("reads the oldest change first — a worklist is read from the top", () => {
    const old = changeEntry("old", [delta], { created: "2026-01-01" });
    const recent = changeEntry("recent", [delta], { created: "2026-06-01" });
    const [engineer] = pendingByRole([recent, old], ARTIFACTS);
    expect(engineer.items.map((item) => item.change.id)).toEqual([
      "old",
      "recent",
    ]);
  });
});

describe("against the store as it stands", () => {
  it("names a role for every artifact the planning schema declares", () => {
    const artifacts = realStore.snapshot.artifacts;
    expect(artifacts.length).toBeGreaterThan(0);
    expect(artifacts.filter((one) => one.role === undefined)).toEqual([]);
  });

  it("owes nothing to a hand the schema does not name", () => {
    const roles = new Set(realStore.snapshot.artifacts.map((one) => one.role));
    for (const { role } of pendingByRole(
      realStore.snapshot.changes,
      realStore.snapshot.artifacts,
    )) {
      expect(roles.has(role)).toBe(true);
    }
  });
});
