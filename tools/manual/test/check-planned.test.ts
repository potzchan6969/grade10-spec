import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

type Finding = { rule: string; level: string; path: string; reason: string };
type Result = { findings: Finding[]; notes: string[] };

const lines = (result: Result, rule: string) =>
  result.findings
    .filter((one) => one.rule === rule)
    .map((one) => `${one.path} — ${one.reason}`)
    .sort();

const CHANGE = "openspec/changes/add-thing";
const DECISIONS = `${CHANGE}/decisions.md`;
const DESIGN = `${CHANGE}/ui-design.md`;

const decisionsText = ({
  raised = ["| demo-product/alpha | Is a scheduled thing open? | Q1 |"],
  section = true,
  decisions = ["| Q1 | Whether to scope it | Scoped | Leaving it open |"],
  title = false,
} = {}) =>
  [
    ...(title ? ["# Decisions: add the thing", ""] : []),
    "## Goals",
    "",
    "- The thing exists.",
    "",
    "## Non-Goals",
    "",
    "- Anything else.",
    "",
    "## Decisions",
    "",
    "| Q | Asked | Decided | Instead of |",
    "| --- | --- | --- | --- |",
    ...decisions,
    "",
    ...(section
      ? [
          "## Raised",
          "",
          "| Capability | Raised | Landed |",
          "| --- | --- | --- |",
          ...raised,
          "",
        ]
      : []),
  ].join("\n");

/** `title` puts a `# ` heading above the sections, which is how most
 * `ui-design.md` files in the store open. `outline` nests every `##` under it,
 * so a reader that filtered the roots for level 2 found no states at all and
 * said nothing about it. */
const designText = (states: string[], title = true) =>
  [
    ...(title ? ["# UI: the thing", ""] : []),
    "## Screens",
    "",
    "- The thing's page: https://figma.example/file/abc",
    "",
    "## States",
    "",
    "### The thing's page",
    "",
    ...states,
    "",
  ].join("\n");

/** A change carrying requirements: the second pass has landed, which is what
 * makes the raised table and the state dispositions due. */
const deltaText = [
  "# Alpha",
  "",
  "## ADDED Requirements",
  "",
  "### Requirement: Alpha does the new thing",
  "",
  "Alpha SHALL do the new thing when asked.",
  "",
  "#### Scenario: alpha-SC-02 - it does the new thing",
  "**Serves:** alpha-US-01 - somebody asking for the new thing",
  "",
  "- **WHEN** asked",
  "- **THEN** it happens",
  "",
].join("\n");

/** `null` omits the file; leaving the key out takes the default. A plain
 * `undefined` would take the default too, which is how a test meaning "no
 * decisions.md" quietly asserts nothing. */
const store = ({
  decisions = decisionsText() as string | null,
  design,
  delta = deltaText as string | null,
  extra = {},
}: {
  decisions?: string | null;
  design?: string;
  delta?: string | null;
  extra?: Record<string, string>;
} = {}) =>
  writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "docs/prds/products/demo-product/alpha.md":
      "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nAlpha, the demo capability.\n",
    "openspec/specs/demo-product/alpha/spec.md": [
      "# Alpha",
      "",
      "## Purpose",
      "",
      "Alpha exists so the checker has a spec to read.",
      "",
      "## Feature set",
      "",
      "- Doing things",
      "  - Something: why it is here",
      "",
      "## Requirements",
      "",
      "### Requirement: Alpha does things",
      "",
      "Alpha SHALL do the thing when asked.",
      "",
      "#### Scenario: alpha-SC-01 - it does the thing",
      "**Serves:** alpha-US-01 - somebody asking for the thing",
      "",
      "- **WHEN** asked",
      "- **THEN** it happens",
      "",
    ].join("\n"),
    "openspec/specs/demo-product/alpha/user-journeys.md": [
      "## User journeys",
      "",
      "### alpha-US-01: Someone does the thing",
      "",
      "**As a** collector,",
      "**I want** to do the thing,",
      "**so that** it is done.",
      "",
    ].join("\n"),
    [`${CHANGE}/.openspec.yaml`]: [
      "schema: grade10-planning",
      "created: 2026-09-18",
      'page_waived: "the fixture is about the raised table"',
      'design_waived: "the fixture is about the raised table"',
      "",
    ].join("\n"),
    [`${CHANGE}/proposal.md`]: [
      "# Add the thing",
      "",
      "## Why",
      "",
      "Alpha cannot do the new thing yet.",
      "",
      "## What changes",
      "",
      "- Alpha does the new thing.",
      "",
    ].join("\n"),
    ...(decisions === null ? {} : { [DECISIONS]: decisions }),
    ...(design === undefined ? {} : { [DESIGN]: design }),
    ...(delta === null
      ? {}
      : { [`${CHANGE}/specs/demo-product/alpha/spec.md`]: delta }),
    ...extra,
  });

const check = (root: string): Promise<Result> => runChecks(root, NO_GIT);

describe("the raised table in decisions.md", () => {
  it("passes a row that landed on a decision the file issues", async () => {
    const result = await check(store());
    expect(lines(result, "raised")).toEqual([]);
    expect(lines(result, "asking")).toEqual([]);
  });

  it("passes a row deferred to a ❓ on a page", async () => {
    const result = await check(
      store({
        decisions: decisionsText({
          raised: [
            "| demo-product/alpha | Is a scheduled thing open? | ❓ on the alpha page |",
          ],
        }),
      }),
    );
    expect(lines(result, "raised")).toEqual([]);
  });

  it("fails a row that landed nowhere", async () => {
    const result = await check(
      store({
        decisions: decisionsText({
          raised: ["| demo-product/alpha | Is a scheduled thing open? |  |"],
        }),
      }),
    );
    expect(lines(result, "raised")).toEqual([
      `${DECISIONS} — \`Is a scheduled thing open?\` landed nowhere — close it as a \`Decisions\` row here, or as a ❓ on the capability's PRD`,
    ]);
  });

  it("fails a row landing on a decision the table never issued", async () => {
    const result = await check(
      store({
        decisions: decisionsText({
          raised: ["| demo-product/alpha | Is a scheduled thing open? | Q9 |"],
        }),
      }),
    );
    expect(lines(result, "raised")).toEqual([
      `${DECISIONS} — \`Is a scheduled thing open?\` landed on \`Q9\`, which the \`## Decisions\` table issues nowhere`,
    ]);
  });

  it("fails a change whose requirements landed with no raised table at all", async () => {
    const result = await check(
      store({ decisions: decisionsText({ section: false }) }),
    );
    expect(lines(result, "raised")).toEqual([
      `${DECISIONS} — carries no \`## Raised\` table, and the requirements have landed — say what the blind pass could not settle, or that it settled everything`,
    ]);
  });

  it("warns on an empty table rather than passing it", async () => {
    const result = await check(
      store({ decisions: decisionsText({ raised: [] }) }),
    );
    expect(lines(result, "asking")).toEqual([
      `${DECISIONS} — \`## Raised\` is empty — a second reading that asks nothing has either stopped being blind or stopped being a different reading`,
    ]);
  });

  it("reads the tables under a `# ` title", async () => {
    const result = await check(
      store({ decisions: decisionsText({ title: true }) }),
    );
    expect(lines(result, "raised")).toEqual([]);
    expect(lines(result, "asking")).toEqual([]);
  });

  it("asks nothing of a change written before decisions.md existed", async () => {
    const result = await check(store({ decisions: null }));
    expect(lines(result, "raised")).toEqual([]);
    expect(lines(result, "asking")).toEqual([]);
  });

  it("asks nothing while the requirements are still to come", async () => {
    const result = await check(
      store({ decisions: decisionsText({ section: false }), delta: null }),
    );
    expect(lines(result, "raised")).toEqual([]);
  });
});

describe("the design states a change draws", () => {
  it("passes a state closed by the scenario it became", async () => {
    const result = await check(
      store({
        design: designText([
          "- **Empty** — `alpha-US-01` — `alpha-SC-02`",
          "- **Error** — `alpha-US-01` — `alpha-SC-02`",
        ]),
      }),
    );
    expect(lines(result, "dressed")).toEqual([]);
  });

  it("passes a state closed by an out-of-suite line", async () => {
    const result = await check(
      store({
        design: designText(
          [
            "- **Offline** — `alpha-US-01` — **Out of suite:** the shell's banner",
          ],
          false,
        ),
      }),
    );
    expect(lines(result, "dressed")).toEqual([]);
  });

  it("fails a state the requirements left open", async () => {
    const result = await check(
      store({ design: designText(["- **Empty** — `alpha-US-01`"]) }),
    );
    expect(lines(result, "dressed")).toEqual([
      `${DESIGN} — \`**Empty** — \`alpha-US-01\`\` names no scenario and no \`**Out of suite:**\` — the requirements pass closes every state bullet`,
    ]);
  });

  it("finds the states under a `# ` title, which is how the store writes them", async () => {
    const result = await check(
      store({ design: designText(["- **Empty** — `alpha-US-01`"], true) }),
    );
    expect(lines(result, "dressed")).toEqual([
      `${DESIGN} — \`**Empty** — \`alpha-US-01\`\` names no scenario and no \`**Out of suite:**\` — the requirements pass closes every state bullet`,
    ]);
  });

  it("reads a state wrapped over two lines as one state", async () => {
    const result = await check(
      store({
        design: designText([
          "- **Empty** — `alpha-US-01` —",
          "  `alpha-SC-02`",
        ]),
      }),
    );
    expect(lines(result, "dressed")).toEqual([]);
  });
});
