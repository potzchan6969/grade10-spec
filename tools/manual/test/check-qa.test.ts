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

const SPEC_FILE = "openspec/specs/demo-product/alpha/spec.md";
const JOURNEYS_FILE = "openspec/specs/demo-product/alpha/user-journeys.md";
const CASES_FILE = "openspec/specs/demo-product/alpha/feature-tcs.md";
const PAGE = "docs/prds/products/demo-product/alpha.md";

/** `**Serves:**` sits under the heading and above the steps, so that editing
 * the prose after the dash never reads as a behaviour change. */
const scenario = (id: string, name: string, serves = "alpha-US-01") => [
  `#### Scenario: ${id} - ${name}`,
  ...(serves ? [`**Serves:** ${serves} - the thing`] : []),
  "",
  "- **WHEN** asked",
  "- **THEN** it happens",
  "",
];

/** A story names nothing. The scenarios name it. */
const journey = (id: string) => [
  `### ${id}: Someone does the thing`,
  "",
  "They open alpha and do the thing.",
  "",
];

type ScenarioLine = [id: string, name: string, serves?: string];

const specText = ({
  scenarios = [["alpha-SC-01", "it does the thing"]] as ScenarioLine[],
  featureSet = ["Doing things"],
} = {}) =>
  [
    "# Alpha",
    "",
    "## Purpose",
    "",
    "Alpha exists so the checker has a spec to read.",
    "",
    "## Feature set",
    "",
    ...featureSet.flatMap((group) => [
      `- ${group}`,
      "  - Something: why it is here",
    ]),
    "",
    "## Requirements",
    "",
    "### Requirement: Alpha does things",
    "",
    "Alpha SHALL do the thing when asked.",
    "",
    ...scenarios.flatMap(([id, name, serves]) => scenario(id, name, serves)),
  ].join("\n");

type CaseLine = [id: string, status: string, trace: string];

const suiteText = ({
  status = "pending-review",
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
    "## alpha-US1: Someone does the thing",
    "",
    ...cases.flatMap(([id, caseStatus, trace]) => [
      `### ${id}: Alpha is asked`,
      "",
      "**Classification:**",
      "",
      `* **Status:** ${caseStatus}`,
      "* **Automation status:** manual",
      `* **Trace:** ${trace}`,
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

/** The stories beside the spec, as their own file. */
const journeysText = (journeys: string[][]) =>
  ["## User journeys", "", ...journeys.flat()].join("\n");

/** The routing declaration a capability nobody walks carries in place of
 * stories: its anchors are its feature set groups. It is not an exemption —
 * the capability still owes a suite. */
const nobodyWalksText = [
  "## User journeys",
  "",
  "**Walked by:** nobody on their own - the capabilities that inherit it walk it.",
].join("\n");

const store = ({
  spec = specText(),
  journeys,
  cases,
  page = pageText(),
  extra = {},
}: {
  spec?: string;
  journeys?: string;
  cases?: string;
  page?: string;
  extra?: Record<string, string>;
} = {}) =>
  writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    [PAGE]: page,
    [SPEC_FILE]: spec,
    ...(journeys === undefined ? {} : { [JOURNEYS_FILE]: journeys }),
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
        page: pageText([]),
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
          "docs/prds/products/demo-product/beta.md": pageText(),
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

/** A case walks an anchor and reaches every scenario serving the same one —
 * the join runs through the anchor, and neither file names the other. */
describe("a case tracing the anchor it walks", () => {
  const two = specText({
    scenarios: [
      ["alpha-SC-01", "it does the thing"],
      ["alpha-SC-02", "it says so"],
    ],
  });
  const both = journeysText([journey("alpha-US-01")]);

  it("lands, and covers every scenario serving that anchor", async () => {
    const root = store({
      spec: two,
      journeys: both,
      cases: suiteText({
        cases: [["alpha-US1-TC1-1", "actual", "alpha-US-01"]],
      }),
    });
    const result = await check(root);
    expect(lines(result, "trace")).toEqual([]);
    expect(lines(result, "coverage")).toEqual([]);
  });

  it("fails on a journey the spec never told", async () => {
    const root = store({
      spec: two,
      cases: suiteText({
        cases: [["alpha-US1-TC1-1", "actual", "alpha-US-09"]],
      }),
    });
    expect(lines(await check(root), "trace")).toEqual([
      `${CASES_FILE} — alpha-US1-TC1-1 traces \`alpha-US-09\`, which \`demo-product/alpha\` issues nowhere — retrace it or retire the case`,
    ]);
  });

  it("leaves a scenario no case reaches for the coverage rule", async () => {
    const root = store({
      spec: specText({
        scenarios: [
          ["alpha-SC-01", "it does the thing"],
          // Serving a feature set group no case walks: reachable behaviour
          // the suite has not covered.
          ["alpha-SC-02", "it says so", "Doing things"],
        ],
      }),
      journeys: journeysText([journey("alpha-US-01")]),
      cases: suiteText({
        cases: [["alpha-US1-TC1-1", "actual", "alpha-US-01"]],
      }),
    });
    expect(lines(await check(root), "coverage")).toEqual([
      `${CASES_FILE} — no case traces alpha-SC-02 — cover them, or list them under \`**Out of suite:**\``,
    ]);
  });
});

/** A deprecated case is history, not coverage. A coverage number that cannot
 * go down when a case is retired is decoration. */
describe("coverage when a scenario loses its last living case", () => {
  it("reopens the hole a retired case leaves", async () => {
    const root = store({
      cases: suiteText({
        cases: [["alpha-TC-01", "deprecated", "alpha-SC-01"]],
      }),
    });
    expect(lines(await check(root), "coverage")).toEqual([
      `${CASES_FILE} — no case traces alpha-SC-01 — cover them, or list them under \`**Out of suite:**\``,
    ]);
  });

  it("counts a living case beside a retired one", async () => {
    const root = store({
      cases: suiteText({
        cases: [
          ["alpha-TC-01", "deprecated", "alpha-SC-01"],
          ["alpha-TC-02", "actual", "alpha-SC-01"],
        ],
      }),
    });
    expect(lines(await check(root), "coverage")).toEqual([]);
  });
});

/** Written and shown nowhere is written and lost. */
describe("a suite no page shows", () => {
  it("warns naming the suite file", async () => {
    const root = store({
      cases: suiteText(),
      page: pageText([]),
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

/** A scenario names the anchor it serves; one resolving to neither a journey
 * nor a feature set group is a scenario standing under nothing. */
describe("a scenario serving an anchor the spec does not offer", () => {
  it("fails naming the scenario, the anchor and the spec", async () => {
    const root = store({
      spec: specText({
        scenarios: [["alpha-SC-01", "it does the thing", "alpha-US-99"]],
      }),
    });
    expect(lines(await check(root), "serves")).toEqual([
      `${SPEC_FILE} — alpha-SC-01 → \`alpha-US-99\`, which is neither a journey nor a feature set group of \`demo-product/alpha\``,
    ]);
  });

  it("says nothing when the anchor is a journey", async () => {
    const root = store({ journeys: journeysText([journey("alpha-US-01")]) });
    expect(lines(await check(root), "serves")).toEqual([]);
  });

  it("says nothing when the anchor is a feature set group", async () => {
    const root = store({
      spec: specText({
        scenarios: [["alpha-SC-01", "it does the thing", "Doing things"]],
      }),
      journeys: nobodyWalksText,
    });
    expect(lines(await check(root), "serves")).toEqual([]);
  });
});

/** Every scenario written before `**Serves:**` existed carries no line. That
 * is a warning until the store is migrated, not a failure — failing on it now
 * would bury every other finding behind the backlog. */
describe("a scenario carrying no Serves line", () => {
  it("warns once for the capability, not once per scenario", async () => {
    const root = store({
      spec: specText({
        scenarios: [
          ["alpha-SC-01", "it does the thing", ""],
          ["alpha-SC-02", "it says so", ""],
        ],
      }),
    });
    expect(lines(await check(root), "anchorless")).toEqual([
      `${SPEC_FILE} — 2 scenarios with no \`**Serves:**\` line (alpha-SC-01, alpha-SC-02)`,
    ]);
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
      `${CASES_FILE} — demo-product/alpha line 1: \`Alpha test cases\` has no \`**Status:**\``,
    ]);
  });

  it("still fails the delta heading the fold would not find", async () => {
    expect(lines(await check(root), "delta")).toEqual([
      "openspec/changes/drifted/specs/demo-product/alpha/spec.md — MODIFIED `Alpha does  things` spells `Alpha does things` differently, and the fold matches the heading exactly",
    ]);
  });

  it("asks nothing else of a suite it could not read", async () => {
    const result = await check(root);
    for (const rule of ["trace", "authority", "coverage", "suite"]) {
      expect(lines(result, rule)).toEqual([]);
    }
  });
});

describe("manual.yaml naming a platform topic", () => {
  it("fails one that is neither a spec dir nor a page", async () => {
    const root = store({
      extra: {
        "docs/prds/manual.yaml":
          "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n\nplatform:\n  - ghost-topic\n",
      },
    });
    expect(lines(await check(root), "config")).toEqual([
      "docs/prds/manual.yaml — `ghost-topic` is neither a spec-dir topic nor a page-only topic with a page at docs/prds/platform/ghost-topic.md",
    ]);
  });

  it("accepts a page-only topic that has its page", async () => {
    const root = store({
      extra: {
        "docs/prds/manual.yaml":
          "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n\nplatform:\n  - paged-topic\n",
        "docs/prds/platform/paged-topic.md":
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

/** Both anchor rules are asked of a delta as well as of the store it folds
 * into. Asked of the durable store alone, they first spoke a release after the
 * change had merged — and the anchor a scenario meant is gone with its author.
 */
describe("a delta's scenarios and the anchors they name", () => {
  const CHANGE = "openspec/changes/probe";
  const DELTA = `${CHANGE}/specs/demo-product/alpha/spec.md`;

  const delta = (scenarios: ScenarioLine[], head: string[] = []) =>
    store({
      journeys: journeysText([journey("alpha-US-01")]),
      extra: {
        [`${CHANGE}/.openspec.yaml`]:
          'schema: demo-planning\ncreated: 2026-09-15\npage_waived: "a probe"\n',
        [`${CHANGE}/proposal.md`]: "# Probe\n\n## Why\n\nTo be read.\n",
        [DELTA]: [
          ...head,
          "## ADDED Requirements",
          "",
          "### Requirement: Alpha does another thing",
          "",
          "Alpha SHALL do the other thing.",
          "",
          ...scenarios.flatMap(([id, name, serves]) =>
            scenario(id, name, serves),
          ),
        ].join("\n"),
      },
    });

  it("resolves an anchor the durable capability holds and the delta does not restate", async () => {
    const root = delta([["alpha-SC-02", "it does the other thing"]]);
    expect(lines(await check(root), "serves")).toEqual([]);
    expect(lines(await check(root), "anchorless")).toEqual([]);
  });

  it("resolves a group of a feature set the delta writes itself", async () => {
    const root = delta(
      [["alpha-SC-02", "it does the other thing", "Doing other things"]],
      [
        "## Feature set",
        "",
        "- Doing other things",
        "  - Something: why it is here",
        "",
      ],
    );
    expect(lines(await check(root), "serves")).toEqual([]);
  });

  it("names an anchor the capability offers nowhere", async () => {
    const root = delta([
      ["alpha-SC-02", "it does the other thing", "alpha-US-99"],
    ]);
    expect(lines(await check(root), "serves")).toEqual([
      `${DELTA} — alpha-SC-02 → \`alpha-US-99\`, which is neither a journey nor a feature set group of \`demo-product/alpha\``,
    ]);
  });

  it("names a delta scenario standing under nothing, once for the file", async () => {
    const root = delta([
      ["alpha-SC-02", "it does the other thing", ""],
      ["alpha-SC-03", "it says so", ""],
    ]);
    expect(lines(await check(root), "anchorless")).toEqual([
      `${DELTA} — 2 scenarios with no \`**Serves:**\` line (alpha-SC-02, alpha-SC-03)`,
    ]);
  });
});

/** A rule sits on the journey somebody walks, and the walk is often somebody
 * else's — the operator's queue reaches a status the collector's capability
 * derives. Before the qualified form, such a rule took a feature set group,
 * which names a part of the map and nobody who meets the rule, or a
 * hand-written note in a journeys file that named no scenario. */
describe("a scenario serving another capability's journey", () => {
  const BETA = "openspec/specs/demo-product/beta";
  const beta = {
    [`${BETA}/spec.md`]: [
      "# Beta",
      "",
      "## Purpose",
      "",
      "Beta exists so a scenario has somewhere else to point.",
      "",
      "## Feature set",
      "",
      "- Doing beta things",
      "  - Something: why it is here",
      "",
    ].join("\n"),
    [`${BETA}/user-journeys.md`]: journeysText([journey("beta-US-01")]),
  };

  const withBeta = (serves: string) =>
    store({
      journeys: journeysText([journey("alpha-US-01")]),
      spec: specText({
        scenarios: [["alpha-SC-01", "it does the thing", serves]],
      }),
      extra: beta,
    });

  it("resolves when that capability issues the journey", async () => {
    const root = withBeta("demo-product/beta#beta-US-01");
    expect(lines(await check(root), "serves")).toEqual([]);
  });

  it("names a journey the other capability issues nowhere", async () => {
    const root = withBeta("demo-product/beta#beta-US-99");
    expect(lines(await check(root), "serves")).toEqual([
      `${SPEC_FILE} — alpha-SC-01 → \`demo-product/beta#beta-US-99\`, which \`demo-product/beta\` issues nowhere`,
    ]);
  });

  it("names a capability the store does not hold", async () => {
    const root = withBeta("demo-product/gamma#gamma-US-01");
    expect(lines(await check(root), "serves")).toEqual([
      `${SPEC_FILE} — alpha-SC-01 → \`demo-product/gamma#gamma-US-01\`, whose capability \`demo-product/gamma\` is not one this store holds`,
    ]);
  });

  /** Retiring a journey is the far capability's own work, and the anchor is
   * written on a file it does not own. Answering live journeys alone put the
   * red in the retirer's pull request, pointing at somebody else's spec —
   * while `archive:preflight` refuses that same retirement unless it leaves
   * the tombstone, because an issued id is permanent and archived suites still
   * trace it. */
  describe("once that capability retires the journey", () => {
    const tombstoned = (serves: string) =>
      store({
        journeys: journeysText([journey("alpha-US-01")]),
        spec: specText({
          scenarios: [["alpha-SC-01", "it does the thing", serves]],
        }),
        extra: {
          ...beta,
          [`${BETA}/user-journeys.md`]: [
            journeysText([journey("beta-US-01")]),
            "## Retired",
            "",
            "- `beta-US-02` - Someone does the other thing · removed in `drop-the-other-thing` · 2026-09-17",
            "",
          ].join("\n"),
        },
      });

    it("resolves the anchor standing on it", async () => {
      const root = tombstoned("demo-product/beta#beta-US-02");
      expect(lines(await check(root), "serves")).toEqual([]);
    });

    it("still refuses an id no tombstone names", async () => {
      const root = tombstoned("demo-product/beta#beta-US-03");
      expect(lines(await check(root), "serves")).toEqual([
        `${SPEC_FILE} — alpha-SC-01 → \`demo-product/beta#beta-US-03\`, which \`demo-product/beta\` issues nowhere`,
      ]);
    });
  });
});

/** The anchor says where the rule sits; the prose after it says what the walk
 * was. A group anchor is the one that most needs the line — it names a part of
 * the map and nobody who meets the rule — so a line repeating the group name
 * back carries nothing at all, and a line that stops at the anchor carries the
 * same nothing. */
describe("`**Serves:**` prose that never names the walk", () => {
  const served = (serves: string) =>
    store({
      journeys: journeysText([journey("alpha-US-01")]),
      spec: [
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
        `**Serves:** ${serves}`,
        "",
        "- **WHEN** asked",
        "- **THEN** it happens",
        "",
      ].join("\n"),
    });

  it("fails a group anchor whose prose is the group name again", async () => {
    const root = served("Doing things - doing things");
    expect(lines(await check(root), "restates")).toEqual([
      `${SPEC_FILE} — alpha-SC-01 → \`Doing things\` repeats the group name after the dash — say what the walk is instead`,
    ]);
  });

  it("passes a group anchor whose prose names the walk", async () => {
    const root = served("Doing things - anybody reaching alpha from the rail");
    expect(lines(await check(root), "restates")).toEqual([]);
  });

  it("asks nothing of a journey anchor, whose title is not its id", async () => {
    const root = served("alpha-US-01 - alpha-US-01");
    expect(lines(await check(root), "restates")).toEqual([]);
  });

  /** The stricter case of the same line. A group name says which part of the
   * map the rule sits in and nobody who meets it, so prose that repeats it
   * says nothing — and prose that is not written at all says nothing in fewer
   * words. A rule catching only the first passes the line it exists to catch. */
  it("fails a group anchor that stops at the anchor", async () => {
    const root = served("Doing things");
    expect(lines(await check(root), "restates")).toEqual([
      `${SPEC_FILE} — alpha-SC-01 → \`Doing things\` names the group and stops — say what the walk is after a dash`,
    ]);
  });

  it("fails a group anchor whose prose is punctuation", async () => {
    const root = served("Doing things - ...");
    expect(lines(await check(root), "restates")).toEqual([
      `${SPEC_FILE} — alpha-SC-01 → \`Doing things\` names the group and stops — say what the walk is after a dash`,
    ]);
  });

  it("asks nothing of a bare journey anchor, which has named who already", async () => {
    const root = served("alpha-US-01");
    expect(lines(await check(root), "restates")).toEqual([]);
  });
});
