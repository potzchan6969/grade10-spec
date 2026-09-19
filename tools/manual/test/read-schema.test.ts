import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findStoreRoot } from "../src/store/disk.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
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

  it("keeps the teammate a schema names, and tolerates the readers beside it", () => {
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
  });
});
