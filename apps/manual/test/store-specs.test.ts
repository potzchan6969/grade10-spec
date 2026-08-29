import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import { discoverSpecs, readSpecs } from "../src/store/read-specs.mts";

const FIXTURE = fileURLToPath(new URL("./fixtures/store", import.meta.url));

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
      text: "- **WHEN** a reader asks for the thing\n- **THEN** the thing happens",
    });
  });

  it("carries a scenario that predates permanent ids without one", () => {
    const scenario = alpha?.requirements[1].scenarios[0];
    expect(scenario?.id).toBeUndefined();
    expect(scenario?.name).toBe("A scenario that predates permanent ids");
  });

  it("reads journeys with their accepted-by scenario ids", () => {
    expect(alpha?.journeys).toHaveLength(1);
    const journey = alpha?.journeys?.[0];
    expect(journey?.id).toBe("alpha-US-01");
    expect(journey?.title).toBe("Reader follows the thing end to end");
    expect(journey?.text).toContain("**As a** reader,");
    expect(journey?.text).not.toContain("Accepted by");
    expect(journey?.acceptedBy).toEqual(["alpha-SC-01", "alpha-SC-02"]);
  });

  it("reads a sibling test-cases.md into traced cases", () => {
    expect(alpha?.testCases).toEqual([
      {
        id: "alpha-TC-01",
        title: "Reader asks for the thing and it happens",
        traces: ["alpha-SC-01"],
      },
      {
        id: "alpha-TC-02",
        title: "Reader asks a second time and is refused",
        traces: ["alpha-SC-01", "alpha-SC-02"],
      },
    ]);
  });

  it("leaves testCases unset where no suite exists", () => {
    expect(
      specs.find((spec) => spec.id === "demo-topic")?.testCases,
    ).toBeUndefined();
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
