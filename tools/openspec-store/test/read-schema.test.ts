import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findStoreRoot } from "../../manual/src/store/disk.mts";
import { NO_GIT } from "../../manual/src/store/git.mts";
import { readChanges } from "../src/read-changes.mts";
import { bugPerspectives, schemaArtifacts } from "../src/read-schema.mts";
import { TRIGGERS } from "../src/types.ts";
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
 * A bug's two rounds read their readers off the schema's `bug:` block, and
 * nothing else in the schema dispatches one. `TRIGGERS` itself lives once, in
 * `../src/types.ts`.
 */
describe("the readers a bug round may summon", () => {
  const bug = bugPerspectives(storeRoot, "grade10-planning");

  it("gives both rounds the simpler thing", () => {
    for (const round of [bug.diagnosis, bug.fix])
      expect(round.map(({ name }) => name)).toContain("simpler");
  });

  it("dispatches a reader that exists, on a `when` a bug can summon", () => {
    const entries = [...bug.diagnosis, ...bug.fix];
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

describe("an id the schema issues nowhere", () => {
  const schemaWith = (key: string, id: string) =>
    writeStore({
      "openspec/schemas/typo/schema.yaml": [
        "name: typo",
        "artifacts:",
        "  - id: proposal",
        "    generates: proposal.md",
        "    requires: []",
        "    upstream: []",
        "  - id: decisions",
        "    generates: decisions.md",
        `    ${key}:`,
        `      - ${id}`,
        "",
      ].join("\n"),
    });

  it.each(["requires", "upstream"])("is refused in `%s:`", (key) => {
    const root = schemaWith(key, "proposals");

    expect(() => schemaArtifacts(root, "typo")).toThrow(
      new RegExp(
        `\`decisions\` names \`proposals\` in \`${key}:\`, which this schema issues nowhere`,
      ),
    );
  });

  it("reads an id the schema does issue, in either list", () => {
    const root = schemaWith("upstream", "proposal");

    expect(schemaArtifacts(root, "typo")?.[1].upstream).toEqual(["proposal"]);
  });

  it("is reported against the change that names the schema", () => {
    const root = writeStore({
      "openspec/schemas/typo/schema.yaml": [
        "name: typo",
        "artifacts:",
        "  - id: proposal",
        "    generates: proposal.md",
        "    upstream:",
        "      - proposals",
        "",
      ].join("\n"),
      "openspec/changes/typo-probe/.openspec.yaml": "schema: typo\n",
      "openspec/changes/typo-probe/proposal.md":
        "# Typo probe\n\n## Why\n\nSo the schema is read.\n",
    });
    const [entry] = readChanges(root, NO_GIT, null);

    // The change is read, with the schema's own file named: nothing claims it
    // owes an artifact while the schema cannot be trusted about them.
    expect(entry.error?.file).toBe("openspec/schemas/typo/schema.yaml");
    expect(entry.error?.message).toContain("issues nowhere");
    expect(entry.written).toEqual([]);
  });
});

describe("an entry the schema left half written", () => {
  const schemaWith = (...lines: string[]) =>
    writeStore({
      "openspec/schemas/holed/schema.yaml": [
        "name: holed",
        "artifacts:",
        ...lines,
        "",
      ].join("\n"),
    });

  // Skipped until now, so a schema that misspelled `generates` answered with
  // one artifact fewer and nothing said which: the worklists would show the
  // artifact owed by nobody and the round would read it against nothing.
  it("refuses an artifact entry with no `id:`", () => {
    const root = schemaWith("  - generates: proposal.md");

    expect(() => schemaArtifacts(root, "holed")).toThrow(
      /openspec\/schemas\/holed\/schema\.yaml/,
    );
  });

  it("refuses an artifact entry with no `generates:`", () => {
    const root = schemaWith("  - id: proposal");

    expect(() => schemaArtifacts(root, "holed")).toThrow(
      /`proposal` carries no `generates:`/,
    );
  });

  const bugWith = (...lines: string[]) =>
    writeStore({
      "openspec/schemas/holed/schema.yaml": [
        "name: holed",
        "artifacts: []",
        "bug:",
        "  diagnosis:",
        "    perspectives:",
        ...lines,
        "",
      ].join("\n"),
    });

  it("refuses a perspective missing `name:`, `agent:` or `when:`", () => {
    const root = bugWith("      - name: simpler", "        when: always");

    expect(() => bugPerspectives(root, "holed")).toThrow(
      /`bug\.diagnosis` carries a `perspectives:` entry missing `name:`, `agent:` or `when:`/,
    );
  });

  it("refuses a `when` outside the triggers", () => {
    const root = bugWith(
      "      - name: simpler",
      "        when: [pricing]",
      "        agent: .claude/agents/simpler.md",
    );

    expect(() => bugPerspectives(root, "holed")).toThrow(
      /`bug\.diagnosis`'s perspective `simpler` names `pricing` in `when:`, which is no trigger/,
    );
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

  it("reads a schema with no bug block as one whose rounds summon nobody", () => {
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

    expect(bugPerspectives(root, "bare")).toEqual({ diagnosis: [], fix: [] });
  });

  it("keeps the teammate a schema names", () => {
    const root = writeStore({
      "openspec/schemas/read/schema.yaml": [
        "name: read",
        "artifacts:",
        "  - id: proposal",
        "    generates: proposal.md",
        "    teammate: product-manager",
        "    requires: []",
        "    upstream: []",
        "",
      ].join("\n"),
    });
    const [artifact] = schemaArtifacts(root, "read") ?? [];

    expect(artifact.teammate).toBe("product-manager");
    expect(artifact.upstream).toEqual([]);
  });
});
