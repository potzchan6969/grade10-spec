import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

type Finding = { rule: string; level: string; path: string; reason: string };

const SPEC_FILE = "openspec/specs/demo-product/alpha/spec.md";
const JOURNEYS_FILE = "openspec/specs/demo-product/alpha/user-journeys.md";

const SPEC = [
  "# Alpha",
  "",
  "## Purpose",
  "",
  "Alpha exists so the checker has a spec to read.",
  "",
  "## Requirements",
  "",
  "### Requirement: Alpha does things",
  "",
  "Alpha SHALL do the thing when asked.",
  "",
  "#### Scenario: alpha-SC-01 - it does the thing",
  "",
  "- **WHEN** asked",
  "- **THEN** it happens",
  "",
].join("\n");

/** One story per role, so a run names every role it objects to at once. */
const journeysText = (roles: string[]) =>
  [
    "## User journeys",
    "",
    ...roles.flatMap((role, i) => [
      `### alpha-US-0${i + 1}: Someone does the thing`,
      "",
      `**As a** ${role},`,
      "**I want** the thing,",
      "**so that** it is done.",
      "",
      "**Accepted by:**",
      "",
      "- `alpha-SC-01` — it does the thing",
      "",
    ]),
  ].join("\n");

const roles = async (given: string[]): Promise<string[]> => {
  const root = writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    [SPEC_FILE]: SPEC,
    [JOURNEYS_FILE]: journeysText(given),
  });
  const result: { findings: Finding[] } = await runChecks(root, NO_GIT);
  return result.findings
    .filter((one) => one.rule === "role")
    .map((one) => one.reason);
};

describe("a journey walked by the system rather than an actor", () => {
  it("names the story whose actor is a piece of software", async () => {
    const found = await roles(["application", "consuming application"]);

    expect(found).toHaveLength(2);
    expect(found[0]).toContain("alpha-US-01 is walked by `application`");
    expect(found[0]).toContain("`application` names the system's side");
    expect(found[1]).toContain("`consuming application`");
  });

  it("warns rather than fails, so an unseen role stays the author's call", async () => {
    const root = writeStore({
      "docs/prds/manual.yaml":
        "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
      "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
      "docs/prds/products/demo-product/index.md":
        "---\ntitle: Demo product\n---\n\nThe landing.\n",
      [SPEC_FILE]: SPEC,
      [JOURNEYS_FILE]: journeysText(["application"]),
    });
    const result: { findings: Finding[] } = await runChecks(root, NO_GIT);

    expect(result.findings.filter((one) => one.rule === "role")).toHaveLength(
      1,
    );
    expect(
      result.findings.filter(
        (one) => one.rule === "role" && one.level !== "warn",
      ),
    ).toEqual([]);
  });

  /** The head noun decides, so the qualifiers a real actor carries — the
   * system it works on, the clause that narrows it — pass untouched. */
  it("leaves a person qualified by the system they work on alone", async () => {
    const found = await roles([
      "backend reviewer",
      "developer running the auction service locally",
      "engineer wiring a console feature to a backend call",
      "operator who can ban",
      "member of shop staff",
      "signed-in collector with no orders",
    ]);

    expect(found).toEqual([]);
  });

  /** An outside agent acting on its own is a role; only software this
   * repository ships is the system's side. */
  it("leaves an external agent alone", async () => {
    const found = await roles(["crawler", "preview fetcher"]);

    expect(found).toEqual([]);
  });
});
