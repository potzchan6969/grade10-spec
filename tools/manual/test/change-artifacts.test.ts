import { describe, expect, it } from "vitest";
import {
  artifactLabel,
  artifactMeaning,
  deltaIds,
  missingArtifacts,
  resolveTab,
  tabForHash,
} from "../src/api/change-artifacts";
import type { ChangeDocument } from "../src/api/types";

/** The change page's tabs are the change's own files, named for who reads
 * them; which one opens follows the URL, and a permanent id opens the
 * requirements wherever the link was copied from. */

const document: ChangeDocument = {
  id: "pos",
  dir: "openspec/changes/pos",
  schema: "full-planning",
  schemaKnown: true,
  artifacts: [
    { name: "proposal", kind: "doc", present: true, text: "# Pos" },
    { name: "specs", kind: "specs", present: true },
    { name: "design", kind: "doc", present: false },
    {
      name: "ui",
      kind: "doc",
      present: false,
      path: "openspec/changes/pos/ui.md",
    },
    { name: "tasks", kind: "tasks", present: true },
  ],
  deltas: [
    {
      spec: "demo-product/alpha",
      path: "openspec/changes/pos/specs/demo-product/alpha/spec.md",
      text: "",
      journeys: [
        { id: "alpha-US-06", title: "A story", text: "", acceptedBy: [] },
      ],
      sections: [
        {
          kind: "added",
          requirements: [
            {
              name: "A per-unit reward",
              text: "",
              scenarios: [{ id: "alpha-SC-65", name: "One debit", text: "" }],
            },
          ],
        },
      ],
      suite: {
        status: "pending-review",
        cases: [
          {
            id: "alpha-TC-09",
            title: "It debits",
            traces: [],
            status: "draft",
          },
        ],
      },
    },
  ],
};

describe("what each artifact is called", () => {
  it("names the five artifacts for who reads them", () => {
    expect(
      ["proposal", "specs", "design", "ui", "tasks"].map(artifactLabel),
    ).toEqual(["Product", "Requirements", "Tech Design", "UI", "Tasks"]);
  });

  it("says what each is for", () => {
    expect(artifactMeaning("proposal")).toContain("PM-driven proposal");
    expect(artifactMeaning("specs")).toContain("detailed illustration");
    expect(artifactMeaning("design")).toContain("high-level design");
    expect(artifactMeaning("ui")).toContain("visual plan");
    expect(artifactMeaning("tasks")).toContain("agent-driven implementation");
  });

  it("reads an artifact the schema added out of its id, and describes it with nothing", () => {
    expect(artifactLabel("risk-register")).toBe("Risk Register");
    expect(artifactMeaning("risk-register")).toBeUndefined();
  });
});

describe("which tab opens", () => {
  it("opens the tab the URL names, when the change has it", () => {
    expect(resolveTab(document, "tasks")).toBe("tasks");
  });

  it("falls back to the first artifact for a tab this change lacks", () => {
    expect(resolveTab(document, "design")).toBe("proposal");
    expect(resolveTab(document, null)).toBe("proposal");
  });

  it("answers null for a change with nothing written", () => {
    expect(
      resolveTab({ ...document, artifacts: [], deltas: [] }, "proposal"),
    ).toBeNull();
  });
});

describe("where a deep link lands", () => {
  it("opens the requirements for a scenario, a story, a row, or a case", () => {
    for (const hash of [
      "#alpha-SC-65",
      "#alpha-US-06",
      "#req-a-per-unit-reward",
      "#alpha-TC-09",
    ]) {
      expect(tabForHash(document, hash)).toBe("specs");
    }
  });

  it("leaves any other hash to the tab it was written for", () => {
    expect(tabForHash(document, "#proposal-why")).toBeNull();
    expect(tabForHash(document, "")).toBeNull();
  });

  it("names every id the requirements reading renders", () => {
    expect([...deltaIds(document)]).toEqual([
      "alpha-US-06",
      "req-a-per-unit-reward",
      "alpha-SC-65",
      "alpha-TC-09",
    ]);
  });
});

describe("what is still to write", () => {
  it("names the declared artifacts nobody has written", () => {
    expect(missingArtifacts(document).map((one) => one.name)).toEqual([
      "design",
      "ui",
    ]);
  });

  it("claims nothing when the schema is unknown", () => {
    expect(missingArtifacts({ ...document, schemaKnown: false })).toEqual([]);
  });
});
