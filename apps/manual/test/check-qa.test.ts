import { describe, expect, it } from "vitest";
import { runChecks } from "../../../scripts/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

type Finding = { rule: string; level: string; path: string; reason: string };
type Result = { findings: Finding[]; notes: string[] };

const lines = (result: Result, rule: string) =>
  result.findings
    .filter((one) => one.rule === rule)
    .map((one) => `${one.path} — ${one.reason}`)
    .sort();

const SPEC_FILE = "openspec/specs/demo-product/alpha/spec.md";
const CASES_FILE = "openspec/specs/demo-product/alpha/test-cases.md";
const PAGE = "manual/products/demo-product/alpha.md";

const scenario = (id: string, name: string) => [
  `#### Scenario: ${id} - ${name}`,
  "",
  "- **WHEN** asked",
  "- **THEN** it happens",
  "",
];

const journey = (id: string, accepted: string[]) => [
  `### ${id}: Someone does the thing`,
  "",
  "They open alpha and do the thing.",
  "",
  "**Accepted by:**",
  "",
  ...accepted.map((one) => `- ${one}`),
  "",
];

const specText = ({
  scenarios = [["alpha-SC-01", "it does the thing"]] as [string, string][],
  journeys = [] as string[][],
} = {}) =>
  [
    "# Alpha",
    "",
    "## Purpose",
    "",
    "Alpha exists so the checker has a spec to read.",
    "",
    ...(journeys.length > 0
      ? ["## User journeys", "", ...journeys.flat()]
      : []),
    "## Requirements",
    "",
    "### Requirement: Alpha does things",
    "",
    "Alpha SHALL do the thing when asked.",
    "",
    ...scenarios.flatMap(([id, name]) => scenario(id, name)),
  ].join("\n");

type CaseLine = [id: string, status: string, trace: string];

const suiteText = ({
  status = "pending-review",
  covers = [] as [string, string][],
  outOfSuite = [] as string[],
  cases = [["alpha-TC-01", "draft", "alpha-SC-01"]] as CaseLine[],
} = {}) =>
  [
    "# Alpha test cases",
    "",
    `**Status:** ${status}`,
    "",
    ...(outOfSuite.length > 0
      ? [`**Out of suite:** ${outOfSuite.join(", ")}`, ""]
      : []),
    "## alpha-US-01: Someone does the thing",
    "",
    ...(covers.length > 0
      ? [
          "**Covers:**",
          "",
          ...covers.map(([id, title]) => `- \`${id}\` — ${title}`),
          "",
        ]
      : []),
    ...cases.flatMap(([id, caseStatus, trace]) => [
      `### ${id}: Alpha is asked`,
      "",
      "**Properties:**",
      "",
      `- **Status:** ${caseStatus}`,
      `- **Trace:** ${trace}`,
      "",
    ]),
  ].join("\n");

const shown = ['::cases{id="demo-product/alpha"}', ""];

const pageText = (blocks: string[] = shown) =>
  [
    "---",
    "title: Alpha",
    "spec: demo-product/alpha",
    "---",
    "",
    "Alpha, the demo capability.",
    "",
    ...blocks,
  ].join("\n");

const store = ({
  spec = specText(),
  cases,
  page = pageText(),
  extra = {},
}: {
  spec?: string;
  cases?: string;
  page?: string;
  extra?: Record<string, string>;
} = {}) =>
  writeStore({
    "manual/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "manual/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "manual/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    [PAGE]: page,
    [SPEC_FILE]: spec,
    ...(cases === undefined ? {} : { [CASES_FILE]: cases }),
    ...extra,
  });

const check = (root: string): Promise<Result> => runChecks(root, NO_GIT);

/** The integrity of a suite used to be gated on a page having authored a
 * `::cases` block — a documentation choice deciding whether QA's work was
 * checked at all. It is asked of the spec directory now, so deleting the
 * block changes nothing but what a reader sees. */
describe("a case tracing a scenario the spec no longer issues", () => {
  const dead = suiteText({
    cases: [
      ["alpha-TC-01", "actual", "alpha-SC-01"],
      ["alpha-TC-02", "actual", "alpha-SC-46"],
    ],
  });

  it("fails naming the suite file, not the page", async () => {
    const result = await check(store({ cases: dead }));
    expect(lines(result, "trace")).toEqual([
      `${CASES_FILE} — alpha-TC-02 traces \`alpha-SC-46\`, which \`demo-product/alpha\` issues nowhere — retrace it or retire the case`,
    ]);
  });

  it("fails just the same when no page shows the suite", async () => {
    const result = await check(
      store({
        cases: dead,
        page: pageText(['::journeys{id="demo-product/alpha"}', ""]),
      }),
    );
    expect(lines(result, "trace")).toHaveLength(1);
  });

  it("says it once however many pages show the suite", async () => {
    const result = await check(
      store({
        cases: dead,
        page: pageText([...shown, ...shown]),
        extra: {
          "manual/products/demo-product/beta.md": pageText(),
        },
      }),
    );
    expect(lines(result, "trace")).toHaveLength(1);
  });

  it("says nothing when every trace lands", async () => {
    const result = await check(store({ cases: suiteText() }));
    expect(lines(result, "trace")).toEqual([]);
  });
});

/** The file status summarises its cases. `approved` over a draft is the file
 * claiming a review that never happened. */
describe("an approved suite holding a draft", () => {
  it("fails naming the drafts", async () => {
    const root = store({
      cases: suiteText({
        status: "approved",
        cases: [
          ["alpha-TC-01", "actual", "alpha-SC-01"],
          ["alpha-TC-02", "draft", "alpha-SC-01"],
        ],
      }),
    });
    expect(lines(await check(root), "authority")).toEqual([
      `${CASES_FILE} — \`**Status:** approved\` over 1 draft case (alpha-TC-02) — a draft must never wear an approved suite's authority`,
    ]);
  });

  it("leaves an approved suite of reviewed and retired cases alone", async () => {
    const root = store({
      cases: suiteText({
        status: "approved",
        cases: [
          ["alpha-TC-01", "actual", "alpha-SC-01"],
          ["alpha-TC-02", "deprecated", "alpha-SC-01"],
        ],
      }),
    });
    expect(lines(await check(root), "authority")).toEqual([]);
  });

  it("leaves a pending-review suite of drafts alone", async () => {
    const root = store({ cases: suiteText() });
    expect(lines(await check(root), "authority")).toEqual([]);
  });
});

/** A count with no names is not a task, and a package-contract scenario no
 * shopper journey reaches is not a hole. */
describe("scenarios no case traces", () => {
  const two = specText({
    scenarios: [
      ["alpha-SC-01", "it does the thing"],
      ["alpha-SC-02", "it says so"],
    ],
  });

  it("warns naming each untraced id", async () => {
    const root = store({ spec: two, cases: suiteText() });
    expect(lines(await check(root), "coverage")).toEqual([
      `${CASES_FILE} — no case traces alpha-SC-02 — cover them, or list them under \`**Out of suite:**\``,
    ]);
  });

  it("subtracts what the suite lists out of suite", async () => {
    const root = store({
      spec: two,
      cases: suiteText({ outOfSuite: ["alpha-SC-02"] }),
    });
    expect(lines(await check(root), "coverage")).toEqual([]);
  });

  it("warns on an out-of-suite id a case does trace", async () => {
    const root = store({
      spec: two,
      cases: suiteText({
        outOfSuite: ["alpha-SC-01", "alpha-SC-02"],
        cases: [["alpha-TC-01", "draft", "alpha-SC-01"]],
      }),
    });
    expect(lines(await check(root), "coverage")).toEqual([
      `${CASES_FILE} — \`alpha-SC-01\` is listed out of suite and alpha-TC-01 traces it — drop it from the list or retire the case`,
    ]);
  });

  it("warns on an out-of-suite id the spec never issued", async () => {
    const root = store({
      cases: suiteText({ outOfSuite: ["alpha-SC-99"] }),
    });
    expect(lines(await check(root), "coverage")).toEqual([
      `${CASES_FILE} — \`alpha-SC-99\` is listed out of suite, and \`demo-product/alpha\` issues no such scenario`,
    ]);
  });
});

/** An id survives a rename by design, so the quoted title is the only thing
 * that can say the words a reviewer approved have moved. */
describe("a suite quoting wording the spec has since changed", () => {
  it("warns with both wordings", async () => {
    const root = store({
      cases: suiteText({ covers: [["alpha-SC-01", "it did the thing"]] }),
    });
    expect(lines(await check(root), "covers")).toEqual([
      `${CASES_FILE} — \`**Covers:**\` quotes \`alpha-SC-01\` as “it did the thing” and the spec now reads “it does the thing” — re-review the cases under it, or update the quote`,
    ]);
  });

  it("says nothing while the quote still matches", async () => {
    const root = store({
      cases: suiteText({ covers: [["alpha-SC-01", "it does the thing"]] }),
    });
    expect(lines(await check(root), "covers")).toEqual([]);
  });

  it("warns on a citation naming a scenario the spec does not issue", async () => {
    const root = store({
      cases: suiteText({ covers: [["alpha-SC-77", "it does the thing"]] }),
    });
    expect(lines(await check(root), "covers")).toEqual([
      `${CASES_FILE} — \`**Covers:**\` names \`alpha-SC-77\`, which \`demo-product/alpha\` issues nowhere`,
    ]);
  });
});

/** The mirror of the journeys rule: written and shown nowhere is written and
 * lost. */
describe("a suite no page shows", () => {
  it("warns naming the suite file", async () => {
    const root = store({
      cases: suiteText(),
      page: pageText(['::journeys{id="demo-product/alpha"}', ""]),
    });
    expect(lines(await check(root), "suite")).toEqual([
      `${CASES_FILE} — holds 1 test case and no page shows them`,
    ]);
  });

  it("says nothing when a page shows it", async () => {
    const root = store({ cases: suiteText() });
    expect(lines(await check(root), "suite")).toEqual([]);
  });
});

/** A journey is accepted by scenarios; an id resolving to none of the spec's
 * own is a story nothing proves. */
describe("a journey accepted by a scenario the spec never issued", () => {
  it("fails naming the journey, the id and the spec file", async () => {
    const root = store({
      spec: specText({
        journeys: [journey("alpha-US-01", ["alpha-SC-01", "alpha-SC-88"])],
      }),
    });
    expect(lines(await check(root), "accepted")).toEqual([
      `${SPEC_FILE} — alpha-US-01 is accepted by \`alpha-SC-88\`, which this spec issues nowhere`,
    ]);
  });

  it("says nothing when every accepted-by id resolves", async () => {
    const root = store({
      spec: specText({ journeys: [journey("alpha-US-01", ["alpha-SC-01"])] }),
    });
    expect(lines(await check(root), "accepted")).toEqual([]);
  });
});

/** One missing line in QA's file used to blank the capability's contract on
 * every page that embeds it, and switch off the rule aimed at the one thing
 * that fails silently at archive time. */
describe("a suite the reader could not parse", () => {
  const root = store({
    cases: suiteText().replace("**Status:** pending-review\n", ""),
    extra: {
      "openspec/changes/drifted/proposal.md":
        "# Drifted\n\n## Why\n\nSomething had to move.\n",
      "openspec/changes/drifted/specs/demo-product/alpha/spec.md":
        "## MODIFIED Requirements\n\n### Requirement: Alpha does  things\n\nAlpha SHALL do the thing.\n",
    },
  });

  it("names the suite file, not the spec", async () => {
    expect(lines(await check(root), "store")).toEqual([
      `${CASES_FILE} — demo-product/alpha line 1: a test-case file states \`**Status:** pending-review\` or \`approved\` under its title`,
    ]);
  });

  it("still fails the delta heading the fold would not find", async () => {
    expect(lines(await check(root), "delta")).toEqual([
      "openspec/changes/drifted/specs/demo-product/alpha/spec.md — MODIFIED `Alpha does  things` spells `Alpha does things` differently, and the fold matches the heading exactly",
    ]);
  });

  it("asks nothing else of a suite it could not read", async () => {
    const result = await check(root);
    for (const rule of ["trace", "authority", "coverage", "covers", "suite"]) {
      expect(lines(result, rule)).toEqual([]);
    }
  });
});

describe("manual.yaml naming a platform topic", () => {
  it("fails one that is neither a spec dir nor a page", async () => {
    const root = store({
      extra: {
        "manual/manual.yaml":
          "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n\nplatform:\n  - ghost-topic\n",
      },
    });
    expect(lines(await check(root), "config")).toEqual([
      "manual/manual.yaml — `ghost-topic` is neither a spec-dir topic nor a page-only topic with a page at manual/platform/ghost-topic.md",
    ]);
  });

  it("accepts a page-only topic that has its page", async () => {
    const root = store({
      extra: {
        "manual/manual.yaml":
          "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n\nplatform:\n  - paged-topic\n",
        "manual/platform/paged-topic.md":
          "---\ntitle: Paged topic\n---\n\nA topic with a page and no spec yet.\n",
      },
    });
    expect(lines(await check(root), "config")).toEqual([]);
  });
});

/** An index half-written by an interrupted build is one more unreadable
 * store file — never the end of the whole run. */
describe("a Storybook index that is not JSON", () => {
  it("contains it as a store finding and keeps checking", async () => {
    const root = store({
      extra: {
        "apps/preview/storybook-static/index.json": "{ not json",
      },
    });
    const result = await check(root);
    expect(lines(result, "store")).toEqual([
      expect.stringContaining(
        "apps/preview/storybook-static/index.json — the Storybook index is unreadable:",
      ),
    ]);
    expect(lines(result, "canonical")).toEqual([]);
  });
});
