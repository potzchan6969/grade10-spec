import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import { discoverSpecs, readSpecs } from "../src/store/read-specs.mts";
import { writeStore } from "./tmp-store";

const FIXTURE = fileURLToPath(new URL("../demo-store", import.meta.url));

const specs = readSpecs(FIXTURE, NO_GIT);
const alpha = specs.find((spec) => spec.id === "demo-product/alpha");

describe("taxonomy from disk shape", () => {
  it("reads a dir of capability dirs as a product", () => {
    expect(discoverSpecs(FIXTURE).products).toEqual(["demo-product"]);
  });

  it("reads a dir holding spec.md directly as a topic", () => {
    expect(discoverSpecs(FIXTURE).topics).toEqual(["demo-topic"]);
  });

  it("ids a capability as product/capability and a topic bare", () => {
    expect(specs.map((spec) => spec.id)).toEqual([
      "demo-product/alpha",
      "demo-product/broken",
      "demo-topic",
    ]);
  });
});

describe("spec entries", () => {
  it("takes title, purpose and feature set verbatim", () => {
    expect(alpha?.title).toBe("demo-product/alpha Specification");
    expect(alpha?.purpose).toBe(
      "Alpha does one thing, and this fixture is what proves the reader sees it.",
    );
    expect(alpha?.featureSet).toContain("- Doing the thing");
    expect(alpha?.featureSet).toContain("  - Once only:");
  });

  it("reads requirements with their scenario bodies", () => {
    expect(alpha?.requirements.map((one) => one.name)).toEqual([
      "The thing happens once",
      "The thing is written down",
    ]);
    const first = alpha?.requirements[0];
    expect(first?.text).toBe(
      "The system SHALL do the thing exactly once and SHALL refuse a second ask.",
    );
    expect(first?.scenarios[0]).toEqual({
      id: "alpha-SC-01",
      name: "The thing happens",
      serves: ["alpha-US-01"],
      servesProse: "Reader follows the thing end to end",
      text: "**Serves:** alpha-US-01 - Reader follows the thing end to end\n\n- **WHEN** a reader asks for the thing\n- **THEN** the thing happens",
    });
  });

  it("carries a scenario that predates permanent ids without one", () => {
    const scenario = alpha?.requirements[1].scenarios[0];
    expect(scenario?.id).toBeUndefined();
    expect(scenario?.name).toBe("A scenario that predates permanent ids");
  });

  it("reads journeys, which name no scenario of their own", () => {
    expect(alpha?.journeys).toHaveLength(1);
    const journey = alpha?.journeys?.[0];
    expect(journey?.id).toBe("alpha-US-01");
    expect(journey?.title).toBe("Reader follows the thing end to end");
    expect(journey?.text).toContain("**As a** reader,");
  });

  it("reads a sibling feature-tcs.md into traced cases with their status", () => {
    expect(alpha?.testCases).toEqual([
      {
        id: "alpha-TC-01",
        title: "Reader asks for the thing and it happens",
        traces: ["alpha-SC-01"],
        status: "draft",
      },
      {
        id: "alpha-TC-02",
        title: "Reader asks a second time and is refused",
        traces: ["alpha-SC-01", "alpha-SC-02"],
        status: "draft",
      },
    ]);
  });

  it("carries the suite file's own status", () => {
    expect(alpha?.testCasesStatus).toBe("pending-review");
  });

  it("leaves testCases unset where no suite exists", () => {
    const topic = specs.find((spec) => spec.id === "demo-topic");
    expect(topic?.testCases).toBeUndefined();
    expect(topic?.testCasesStatus).toBeUndefined();
  });
});

describe("error containment", () => {
  const broken = specs.find((spec) => spec.id === "demo-product/broken");

  it("contains a malformed spec instead of throwing", () => {
    expect(broken?.error).toEqual({
      file: "openspec/specs/demo-product/broken/spec.md",
      line: 1,
      message: "spec has no `## Purpose`",
    });
  });

  it("keeps whatever parsed before the break", () => {
    expect(broken?.title).toBe("demo-product/broken Specification");
  });
});

const SPEC = "openspec/specs/demo-product/alpha/spec.md";
const JOURNEYS = "openspec/specs/demo-product/alpha/user-journeys.md";
const CASES = "openspec/specs/demo-product/alpha/feature-tcs.md";

const written = (files: Record<string, string>) =>
  readSpecs(writeStore(files), NO_GIT)[0];

const specText = (...scenarios: string[]) =>
  [
    "# Alpha",
    "",
    "## Purpose",
    "",
    "Alpha exists so the reader has something to read.",
    "",
    "## Requirements",
    "",
    "### Requirement: Alpha does things",
    "",
    "Alpha SHALL do the thing.",
    "",
    ...scenarios.flatMap((one) => [
      `#### Scenario: ${one}`,
      "",
      "- **WHEN** asked",
      "- **THEN** it happens",
      "",
    ]),
  ].join("\n");

/** An id is issued once, ever: the ref resolves to one of the pair and the
 * anchor lands on the other, so the file is refused where it was written. */
describe("a spec issuing one id twice", () => {
  it("refuses two scenarios wearing one id", () => {
    const entry = written({
      [SPEC]: specText("alpha-SC-01 - it happens", "alpha-SC-01 - it repeats"),
    });
    expect(entry.error?.message).toMatch(
      /scenario `alpha-SC-01` is issued twice, at line 13 and line 18/,
    );
  });

  it("refuses two journeys wearing one id", () => {
    const entry = written({
      [SPEC]: [
        "# Alpha",
        "",
        "## Purpose",
        "",
        "Alpha exists.",
        "",
        "## Requirements",
        "",
        "### Requirement: Alpha does things",
        "",
        "Alpha SHALL do the thing.",
        "",
      ].join("\n"),
      [JOURNEYS]: [
        "## User journeys",
        "",
        "### alpha-US-01: Someone does the thing",
        "",
        "They do the thing.",
        "",
        "### alpha-US-01: Someone does it again",
        "",
        "They do it again.",
        "",
      ].join("\n"),
    });
    expect(entry.journeysError?.message).toMatch(
      /story `alpha-US-01` is issued twice, at line 3 and line 7/,
    );
  });

  it("keeps the requirements that parsed before the refusal", () => {
    const entry = written({
      [SPEC]: specText("alpha-SC-01 - it happens", "alpha-SC-01 - it repeats"),
    });
    expect(entry.requirements.map((one) => one.name)).toEqual([
      "Alpha does things",
    ]);
  });
});

/** One missing line in a QA file used to blank the engineering contract on
 * every page that embeds the spec. The suite gets its own channel. */
describe("a suite the reader refuses beside a spec that parsed", () => {
  const entry = written({
    [SPEC]: specText("alpha-SC-01 - it happens"),
    [CASES]: "# Alpha test cases\n\n## alpha-US-01: Someone does the thing\n",
  });

  it("hangs the refusal on the suite, never on the spec", () => {
    expect(entry.error).toBeUndefined();
    expect(entry.testCasesError).toEqual({
      file: CASES,
      line: 1,
      message:
        "a test-case file states `**Status:** pending-review`, `in-review` or `approved` under its title",
    });
  });

  it("leaves the spec's own content whole", () => {
    expect(entry.requirements[0].scenarios[0].id).toBe("alpha-SC-01");
    expect(entry.testCases).toBeUndefined();
    expect(entry.testCasesStatus).toBeUndefined();
  });
});

/** A durable file writes `## User journeys`; a change's file writes the delta
 * sections instead, and both are one reader's to read. Knowing only the durable
 * heading refused every change's journeys file, and the refusal was dropped —
 * so the schema's own template passed the `walked` gate by parsing as nothing. */
describe("the shape a change's journeys file is written in", () => {
  const story = (id: string, title: string) =>
    [
      `### ${id}: ${title}`,
      "",
      "**As a** collector,",
      "**I want** the thing,",
      "**so that** it is done.",
      "",
    ].join("\n");

  const journeys = (body: string) =>
    written({ [SPEC]: specText("alpha-SC-01 - it happens"), [JOURNEYS]: body });

  it("reads the delta sections, restated and added alike", () => {
    const entry = journeys(
      [
        "## Context user journeys",
        "",
        story("alpha-US-01", "Someone does the thing"),
        "## ADDED User journeys",
        "",
        story("alpha-US-02", "Someone does another thing"),
        "## MODIFIED User journeys",
        "",
        story("alpha-US-03", "Someone does the third thing"),
      ].join("\n"),
    );
    expect(entry.journeysError).toBeUndefined();
    expect(entry.journeys?.map((one) => one.id)).toEqual([
      "alpha-US-01",
      "alpha-US-02",
      "alpha-US-03",
    ]);
  });

  it("holds a file whose delta sections are all empty", () => {
    const entry = journeys(
      [
        "## Context user journeys",
        "",
        "## ADDED User journeys",
        "",
        "## MODIFIED User journeys",
        "",
        "## REMOVED User journeys",
        "",
      ].join("\n"),
    );
    expect(entry.journeysError).toBeUndefined();
    expect(entry.journeys).toEqual([]);
  });

  it("leaves a removed journey out of the ones the capability holds", () => {
    const entry = journeys(
      [
        "## ADDED User journeys",
        "",
        story("alpha-US-02", "Someone does another thing"),
        "## REMOVED User journeys",
        "",
        story("alpha-US-01", "Someone did the thing"),
        "**Reason:** the thing went away.",
        "",
      ].join("\n"),
    );
    expect(entry.journeys?.map((one) => one.id)).toEqual(["alpha-US-02"]);
  });

  it("refuses one id issued under two of the sections", () => {
    const entry = journeys(
      [
        "## Context user journeys",
        "",
        story("alpha-US-01", "Someone does the thing"),
        "## MODIFIED User journeys",
        "",
        story("alpha-US-01", "Someone does the thing differently"),
      ].join("\n"),
    );
    expect(entry.journeysError?.message).toMatch(
      /story `alpha-US-01` is issued twice, at line 3 and line 11/,
    );
  });

  it("refuses a file whose headings no reader knows", () => {
    const entry = journeys(`## Journeys\n\n${story("alpha-US-01", "A thing")}`);
    expect(entry.journeysError).toEqual({
      file: JOURNEYS,
      line: 1,
      message:
        "a journeys file needs a `## User journeys` heading, or the `## ADDED User journeys` sections a change writes",
    });
  });
});
