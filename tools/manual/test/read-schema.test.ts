import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findStoreRoot } from "../src/store/disk.mts";
import {
  applyPerspectives,
  schemaArtifacts,
} from "../src/store/read-schema.mts";
import { writeStore } from "./tmp-store";

/**
 * The schema holds the order the artifacts are written in and the set each
 * one's text is drawn from. The two are not the same list: the blind suite is
 * written without sight of the requirements, and the tech design is drawn
 * beside the UI design rather than from it — so `upstream` is its own key,
 * and a reader that inferred it from the order would put every suite behind
 * its own requirements.
 */

const storeRoot = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));
const planning = schemaArtifacts(storeRoot, "grade10-planning") ?? [];
const byId = new Map(planning.map((one) => [one.id, one]));

describe("the planning schema's order", () => {
  it("draws the tech design before the requirements", () => {
    expect(planning.map((one) => one.id)).toEqual([
      "proposal",
      "decisions",
      "user-journeys",
      "ui-design",
      "tech-design",
      "specs",
      "test-cases",
      "tasks",
    ]);
  });

  it("builds the tech design on the decisions and the journeys", () => {
    expect(byId.get("tech-design")?.requires).toEqual([
      "decisions",
      "user-journeys",
    ]);
  });
});

describe("what each artifact is drawn from", () => {
  it("draws the proposal from nothing", () => {
    expect(byId.get("proposal")?.upstream).toEqual([]);
  });

  it("draws the requirements from both designs", () => {
    expect(byId.get("specs")?.upstream).toEqual([
      "proposal",
      "decisions",
      "user-journeys",
      "ui-design",
      "tech-design",
    ]);
  });

  it("never draws the blind suite from the requirements", () => {
    expect(byId.get("test-cases")?.upstream).not.toContain("specs");
  });

  it("never draws the tech design from the UI design", () => {
    expect(byId.get("tech-design")?.upstream).not.toContain("ui-design");
  });

  it("draws the task list from everything before it", () => {
    expect(byId.get("tasks")?.upstream).toEqual([
      "proposal",
      "decisions",
      "user-journeys",
      "ui-design",
      "tech-design",
      "specs",
      "test-cases",
    ]);
  });
});

/**
 * The readers a round may dispatch are data beside each artifact's teammate,
 * and a task group's sit on the schema's `apply:` block. One reader answers
 * both, so no round carries a second copy of the table.
 */
const TRIGGERS = [
  "always",
  "surface",
  "schema",
  "export",
  "system",
  "migration",
  "flag",
  "money",
  "deploy",
  "copy",
];

describe("the readers each artifact may summon", () => {
  it("reads the perspectives beside every artifact that has them", () => {
    expect(byId.get("ui-design")?.perspectives).toEqual([
      { name: "design", when: ["surface"], agent: ".claude/agents/design.md" },
      { name: "reader", when: ["copy"], agent: ".claude/agents/reader.md" },
      { name: "simpler", when: ["always"], agent: ".claude/agents/simpler.md" },
    ]);
  });

  it("leaves the requirements and the cases to the two blind readings", () => {
    expect(byId.get("specs")?.perspectives).toEqual([]);
    expect(byId.get("test-cases")?.perspectives).toEqual([]);
  });

  it("reads a task group's readers off the apply block", () => {
    expect(
      applyPerspectives(storeRoot, "grade10-planning").map(({ name }) => name),
    ).toEqual(["build", "qa", "operations", "simpler"]);
  });

  it("gives every artifact but those two the reader of the simpler thing", () => {
    for (const artifact of planning) {
      if (artifact.id === "specs" || artifact.id === "test-cases") continue;
      expect(
        artifact.perspectives.map(({ name }) => name),
        `${artifact.id} is read for the simpler thing`,
      ).toContain("simpler");
    }
  });

  it("dispatches a reader that exists, on a `when` a draft can summon", () => {
    const entries = [
      ...planning.flatMap(({ perspectives }) => perspectives),
      ...applyPerspectives(storeRoot, "grade10-planning"),
    ];
    expect(entries.length).toBeGreaterThan(0);
    for (const { name, when, agent } of entries) {
      expect(when.length, `${name} carries a \`when\``).toBeGreaterThan(0);
      for (const trigger of when) expect(TRIGGERS).toContain(trigger);
      expect(existsSync(join(storeRoot, agent)), `${agent} resolves`).toBe(
        true,
      );
    }
  });
});

describe("a schema that says nothing about it", () => {
  it("reads an artifact with no upstream key as drawn from nothing", () => {
    const root = writeStore({
      "openspec/schemas/bare/schema.yaml": [
        "name: bare",
        "artifacts:",
        "  - id: proposal",
        "    generates: proposal.md",
        "    requires: []",
        "",
      ].join("\n"),
    });

    expect(schemaArtifacts(root, "bare")?.[0].upstream).toEqual([]);
  });

  it("reads an artifact with no readers as one a round reads for itself", () => {
    const root = writeStore({
      "openspec/schemas/bare/schema.yaml": [
        "name: bare",
        "artifacts:",
        "  - id: proposal",
        "    generates: proposal.md",
        "    requires: []",
        "",
      ].join("\n"),
    });

    expect(schemaArtifacts(root, "bare")?.[0].perspectives).toEqual([]);
    expect(applyPerspectives(root, "bare")).toEqual([]);
  });

  it("keeps the teammate a schema names, and reads the readers beside it", () => {
    const root = writeStore({
      "openspec/schemas/read/schema.yaml": [
        "name: read",
        "artifacts:",
        "  - id: proposal",
        "    generates: proposal.md",
        "    teammate: product-manager",
        "    requires: []",
        "    upstream: []",
        "    perspectives:",
        "      - name: backend",
        "        when: always",
        "        agent: backend",
        "",
      ].join("\n"),
    });
    const [artifact] = schemaArtifacts(root, "read") ?? [];

    expect(artifact.teammate).toBe("product-manager");
    expect(artifact.upstream).toEqual([]);
    // One trigger written as one word is one trigger: a `when` is a list
    // whatever the schema spells it as.
    expect(artifact.perspectives).toEqual([
      { name: "backend", when: ["always"], agent: "backend" },
    ]);
  });
});
