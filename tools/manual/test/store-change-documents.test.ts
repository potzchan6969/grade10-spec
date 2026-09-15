import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import { readChangeDocuments } from "../src/store/read-change-documents.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { rootsOf } from "../src/store/roots.mts";
import { composeStore } from "../src/store/snapshot.mts";
import { storeEndpoints } from "../src/store/vite-plugin.mts";
import { writeStore } from "./tmp-store";

/** The change page reads a change as its files: which artifacts the schema
 * asks for and which exist, the prose as written, each delta as the contract
 * it proposes. This is that reading, off the fixture store. */

const FIXTURE = fileURLToPath(new URL("../demo-store", import.meta.url));

const [document] = readChangeDocuments(FIXTURE, NO_GIT);

describe("the artifacts a change has", () => {
  it("reads the schema's artifacts in the order it declares them", () => {
    const artifact = (
      id: string,
      generates: string,
      hand: string,
      requires: string[],
      required = true,
    ) => ({ id, generates, hand, requires, required });
    expect(schemaArtifacts(FIXTURE, "grade10-planning")).toEqual([
      artifact("proposal", "proposal.md", "product-manager", []),
      artifact("specs", "specs/**/spec.md", "product-manager", ["proposal"]),
      artifact(
        "user-journeys",
        "specs/**/user-journeys.md",
        "product-manager",
        ["specs"],
      ),
      artifact("test-cases", "specs/**/feature-tcs.md", "product-manager", [
        "user-journeys",
      ]),
      artifact("ui-design", "ui-design.md", "designer", ["specs"], false),
      artifact("tech-design", "tech-design.md", "engineer", ["specs"], false),
      artifact("tasks", "tasks.md", "engineer", ["specs"]),
    ]);
    expect(schemaArtifacts(FIXTURE, "spec-driven")).toBeUndefined();
  });

  it("lists every declared artifact, present or not, in schema order", () => {
    expect(document.id).toBe("add-thing");
    expect(document.dir).toBe("openspec/changes/add-thing");
    expect(document.schema).toBe("grade10-planning");
    expect(document.schemaKnown).toBe(true);
    expect(
      document.artifacts.map(({ name, kind, present }) => ({
        name,
        kind,
        present,
      })),
    ).toEqual([
      { name: "proposal", kind: "doc", present: true },
      { name: "specs", kind: "specs", present: true },
      { name: "user-journeys", kind: "journeys", present: false },
      { name: "test-cases", kind: "cases", present: false },
      { name: "ui-design", kind: "doc", present: false },
      { name: "tech-design", kind: "doc", present: false },
      { name: "tasks", kind: "tasks", present: true },
    ]);
  });

  it("carries a prose artifact's text and path, and never the tasks' text", () => {
    const proposal = document.artifacts[0];
    expect(proposal.path).toBe("openspec/changes/add-thing/proposal.md");
    expect(proposal.text).toContain("## Why");
    const tasks = document.artifacts.find((one) => one.name === "tasks");
    expect(tasks?.path).toBe("openspec/changes/add-thing/tasks.md");
    expect(tasks?.text).toBeUndefined();
    const design = document.artifacts.find((one) => one.name === "tech-design");
    expect(design?.path).toBe("openspec/changes/add-thing/tech-design.md");
    expect(design?.text).toBeUndefined();
  });
});

describe("a delta read as the contract it proposes", () => {
  const [delta] = document.deltas;

  it("keeps the file whole for the full reading", () => {
    expect(delta.spec).toBe("demo-product/alpha");
    expect(delta.path).toBe(
      "openspec/changes/add-thing/specs/demo-product/alpha/spec.md",
    );
    expect(delta.text).toContain("## ADDED Requirements");
    expect(delta.error).toBeUndefined();
  });

  it("reads each delta section's requirements with their scenarios", () => {
    expect(
      delta.sections.map((section) => ({
        kind: section.kind,
        requirements: section.requirements.map((one) => ({
          name: one.name,
          scenarios: one.scenarios.map((scenario) => scenario.id),
        })),
      })),
    ).toEqual([
      {
        kind: "added",
        requirements: [
          { name: "The thing is watched", scenarios: ["alpha-SC-03"] },
        ],
      },
      {
        kind: "modified",
        requirements: [
          { name: "The thing happens once", scenarios: ["alpha-SC-01"] },
        ],
      },
    ]);
    expect(delta.sections[0].requirements[0].text).toBe(
      "The system SHALL let a reader watch the thing.",
    );
  });

  it("reads only the delta named spec.md", () => {
    expect(document.deltas.map((one) => one.spec)).toEqual([
      "demo-product/alpha",
    ]);
  });
});

describe("a change the schema cannot account for", () => {
  const root = writeStore({
    "openspec/changes/loose/.openspec.yaml": "schema: spec-driven\n",
    "openspec/changes/loose/proposal.md": "# Loose\n\n## Why\n\nBecause.\n",
    "openspec/changes/loose/README.md": "# Read me\n\nA note.\n",
    "openspec/changes/loose/tech-design.md": "# Design\n\nA sketch.\n",
    "openspec/changes/bare/proposal.md": "# Bare\n\n## Why\n\nBecause.\n",
  });
  const documents = readChangeDocuments(root, NO_GIT);
  const loose = documents.find((one) => one.id === "loose");
  const bare = documents.find((one) => one.id === "bare");

  it("falls back to the usual order and says the schema is unknown", () => {
    expect(loose?.schema).toBe("spec-driven");
    expect(loose?.schemaKnown).toBe(false);
    expect(
      loose?.artifacts.map(({ name, present }) => `${name}:${present}`),
    ).toEqual([
      "proposal:true",
      "specs:false",
      "user-journeys:false",
      "test-cases:false",
      "ui-design:false",
      "tech-design:true",
      "tasks:false",
      "README:true",
    ]);
  });

  it("lists a file the schema never named, last, as prose", () => {
    const readme = loose?.artifacts.at(-1);
    expect(readme?.kind).toBe("doc");
    expect(readme?.path).toBe("openspec/changes/loose/README.md");
    expect(readme?.text).toContain("A note.");
  });

  it("reads a change with no manifest as naming no schema", () => {
    expect(bare?.schema).toBe("");
    expect(bare?.schemaKnown).toBe(false);
    expect(bare?.artifacts[0]).toMatchObject({
      name: "proposal",
      present: true,
    });
  });
});

describe("a delta with a title, journeys, and a suite beside it", () => {
  const root = writeStore({
    "openspec/changes/rich/proposal.md": "# Rich\n\n## Why\n\nBecause.\n",
    "openspec/changes/rich/specs/demo-product/beta/spec.md": [
      "# Beta — delta",
      "",
      "## Purpose",
      "",
      "Beta exists.",
      "",
      "## Feature set",
      "",
      "- Watching",
      "",
      "## ADDED Requirements",
      "",
      "### Group of rows",
      "",
      "#### Requirement: Beta is watched",
      "",
      "Beta SHALL be watchable.",
      "",
      "##### Scenario: beta-SC-01 - It is watched",
      "",
      "- **WHEN** watched",
      "- **THEN** recorded",
      "",
      "## RENAMED Requirements",
      "",
      "- FROM: `### Requirement: Old name`",
      "- TO: `### Requirement: New name`",
      "",
    ].join("\n"),
    "openspec/changes/rich/specs/demo-product/beta/user-journeys.md": [
      "## User journeys",
      "",
      "### beta-US-01: A reader watches",
      "",
      "**As a** reader, **I want** to watch.",
      "",
    ].join("\n"),
    "openspec/changes/rich/specs/demo-product/beta/feature-tcs.md": [
      "# Beta test cases",
      "",
      "**Status:** pending-review",
      "",
      "## beta-US-01: A reader watches",
      "",
      "### beta-TC-01: Watching records",
      "",
      "- **Status:** draft",
      "- **Trace:** beta-SC-01",
      "",
    ].join("\n"),
  });
  const [rich] = readChangeDocuments(root, NO_GIT);
  const [delta] = rich.deltas;

  it("reads title, purpose, feature set and journeys", () => {
    expect(delta.title).toBe("Beta — delta");
    expect(delta.purpose).toBe("Beta exists.");
    expect(delta.featureSet).toBe("- Watching");
    expect(delta.journeys?.map((one) => one.id)).toEqual(["beta-US-01"]);
  });

  it("reads rows under a group heading, and a rename as its pair", () => {
    expect(delta.sections[0].requirements.map((one) => one.name)).toEqual([
      "Beta is watched",
    ]);
    expect(delta.sections[0].requirements[0].scenarios[0].id).toBe(
      "beta-SC-01",
    );
    expect(delta.sections[1]).toEqual({
      kind: "renamed",
      requirements: [],
      renames: [{ from: "Old name", to: "New name" }],
    });
  });

  it("carries the suite beside the delta", () => {
    expect(delta.suite?.status).toBe("pending-review");
    expect(delta.suite?.cases.map((one) => one.id)).toEqual(["beta-TC-01"]);
    expect(delta.suiteError).toBeUndefined();
  });
});

describe("a delta the reader cannot parse", () => {
  const root = writeStore({
    "openspec/changes/broken/proposal.md": "# Broken\n\n## Why\n\nBecause.\n",
    "openspec/changes/broken/specs/demo-product/gamma/spec.md": [
      "## ADDED Requirements",
      "",
      "### Requirement: Gamma",
      "",
      "Gamma SHALL exist.",
      "",
      "#### Not a scenario heading",
      "",
      "Text.",
      "",
    ].join("\n"),
    "openspec/changes/broken/specs/demo-product/gamma/feature-tcs.md":
      "# Gamma cases\n\nNo status line.\n",
  });
  const [broken] = readChangeDocuments(root, NO_GIT);
  const [delta] = broken.deltas;

  it("keeps the text and says what broke, without taking the suite with it", () => {
    expect(delta.error?.file).toBe(
      "openspec/changes/broken/specs/demo-product/gamma/spec.md",
    );
    expect(delta.error?.message).toContain("a scenario heading is");
    expect(delta.text).toContain("Gamma SHALL exist.");
    expect(delta.suiteError?.message).toContain("**Status:**");
    expect(delta.suite).toBeUndefined();
  });
});

describe("the document over the wire", () => {
  const root = writeStore({
    "docs/prds/manual.yaml": "storybookBase: https://storybook.example\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "openspec/changes/one/proposal.md": "# One\n\n## Why\n\nBecause.\n",
  });
  const artifacts = async () => composeStore(rootsOf(root), NO_GIT);
  const endpoints = storeEndpoints(rootsOf(root), artifacts);

  it("rides the store beside the snapshot and the archive", async () => {
    const store = await artifacts();
    expect(store.documents.map((one) => one.id)).toEqual(["one"]);
  });

  it("answers /api/change/<id> with one change, and 404 for one not in flight", async () => {
    const found = await endpoints({ path: "/api/change/one" });
    expect(found).toMatchObject({ kind: "json", status: 200 });
    expect((found as { body: { id: string } }).body.id).toBe("one");

    const missing = await endpoints({ path: "/api/change/never" });
    expect(missing).toMatchObject({ kind: "json", status: 404 });
  });
});
