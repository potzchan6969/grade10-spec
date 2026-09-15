import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { formatReport, runChecks } from "../check/check-manual.mjs";
import { DEPLOY_RECORD_SINCE } from "../check/record.mjs";
import { NO_GIT, readGitIndex } from "../src/store/git.mts";
import { writeStore } from "./tmp-store";

type Finding = { rule: string; level: string; path: string; reason: string };
type Result = { findings: Finding[]; notes: string[] };

const fixture = (name: string) =>
  fileURLToPath(new URL(`./fixtures/check/${name}`, import.meta.url));

const lines = (result: Result, rule: string) =>
  result.findings
    .filter((one) => one.rule === rule)
    .map((one) => `${one.path} — ${one.reason}`)
    .sort();

describe("a store that tells the truth", () => {
  it("finds nothing to say", async () => {
    const result: Result = await runChecks(fixture("clean"), NO_GIT);
    expect(result.findings).toEqual([]);
  });

  it("says out loud that story ids went unchecked", async () => {
    const result: Result = await runChecks(fixture("clean"), NO_GIT);
    expect(result.notes).toEqual([
      "1 `::story` id not checked — no workbench Storybook index under apps/preview/storybook-static*",
    ]);
  });

  it("exits 0 and counts nothing", async () => {
    const root = fixture("clean");
    const report = formatReport(root, await runChecks(root, NO_GIT));
    expect(report.failures).toBe(0);
    expect(report.warnings).toBe(0);
    expect(report.text).toContain("0 failures, 0 warnings");
  });
});

describe("a store that has drifted", () => {
  const result = (async () => runChecks(fixture("broken"), NO_GIT))();

  it("names the first line a page differs from its canonical form", async () => {
    expect(lines(await result, "canonical")).toEqual([
      'docs/prds/index.md — line 5: is "", canonical is "Demo manual, with one blank line too many."',
    ]);
  });

  it("names every reference that resolves to nothing", async () => {
    expect(lines(await result, "reference")).toEqual([
      'docs/prds/products/demo-product/alpha.md — ::changes{spec="demo-product/nowhere"} names no spec on disk and no in-flight change',
      'docs/prds/products/demo-product/alpha.md — ::image{src="assets/missing.svg"} names no file under docs/prds/assets',
      'docs/prds/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} has no requirement `Alpha does nothing`',
      'docs/prds/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} issues no scenario `alpha-SC-99`',
      'docs/prds/products/demo-product/alpha.md — ::spec{id="demo-product/gamma"} names no spec on disk',
    ]);
  });

  /** `demo-product/gamma` exists only as `add-gamma`'s delta: a ribbon may
   * point at it, a `::spec` block that would render it may not, and
   * `demo-product/nowhere` is a typo either way. */
  it("lets only a ribbon name a capability a change is still introducing", async () => {
    const reasons = lines(await result, "reference").join("\n");
    expect(reasons).not.toContain('::changes{spec="demo-product/gamma"}');
    expect(reasons).toContain('::spec{id="demo-product/gamma"}');
    expect(reasons).toContain('::changes{spec="demo-product/nowhere"}');
  });

  it("names the durable spec no page shows", async () => {
    expect(lines(await result, "unreferenced")).toEqual([
      "openspec/specs/demo-product/beta/spec.md — no page names `demo-product/beta`",
    ]);
  });

  it("names the product landing that is missing", async () => {
    expect(lines(await result, "page")).toEqual([
      "docs/prds/products/demo-product/index.md — product `demo-product` has no page here",
    ]);
  });

  it("refuses a listed product that is neither on disk nor paged", async () => {
    expect(lines(await result, "config")).toEqual([
      "docs/prds/manual.yaml — `ghost` is neither a spec-dir product nor a page-only product with pages under docs/prds/products/ghost/",
    ]);
  });

  it("warns rather than fails on a link, and on a walked capability with no suite", async () => {
    const warnings = (await result).findings.filter(
      (one) => one.level === "warn",
    );
    expect(warnings.map((one) => one.rule).sort()).toEqual([
      "blind",
      "derived",
      "figma",
    ]);
  });

  /** The hatch is granted by this rule staying quiet, so what it says is the
   * only place a change that owes a second reading is named. */
  it("names the change that moves behaviour nothing read independently", async () => {
    expect(lines(await result, "blind")).toEqual([
      "openspec/changes/add-gamma/specs/demo-product/gamma/feature-tcs.md — `add-gamma` moves behaviour in `demo-product/gamma` and no suite reads it independently — run the feature pass, or say which line of behaviour moved if you think none did",
    ]);
  });

  it("names the capabilities that never say who walks them", async () => {
    expect(lines(await result, "walked")).toEqual([
      "openspec/changes/add-gamma/specs/demo-product/gamma/user-journeys.md — missing, and `demo-product/gamma` has no durable journeys: name who walks it, or say `**Walked by:** nobody` and why",
      "openspec/specs/demo-product/beta/user-journeys.md — missing: name who walks `demo-product/beta`, or say `**Walked by:** nobody` and why",
    ]);
  });

  it("exits 1 with the counts in the summary", async () => {
    const root = fixture("broken");
    const report = formatReport(root, await result);
    expect(report.failures).toBe(11);
    expect(report.warnings).toBe(3);
    expect(report.text).toContain("11 failures, 3 warnings");
  });
});

describe("a manual.yaml that lists a product twice", () => {
  it("fails on the duplicate and reads no further config", async () => {
    const result: Result = await runChecks(fixture("duplicate"), NO_GIT);
    expect(lines(result, "config")).toEqual([
      "docs/prds/manual.yaml — lists `demo-product` twice",
    ]);
  });
});

describe("a store with the workbench Storybook built", () => {
  it("checks story ids against the index and says nothing about it", async () => {
    const result: Result = await runChecks(fixture("stories"), NO_GIT);
    expect(lines(result, "story")).toEqual([
      'docs/prds/index.md — ::story{id="blocks-demo--gone"} is not in apps/preview/storybook-static/index.json',
    ]);
    expect(result.notes).toEqual([]);
  });
});

const PURPOSE = "Alpha exists so a page has something to embed.";

const requirement = (name: string, id: string, then: string) => [
  `### Requirement: ${name}`,
  "",
  `Alpha SHALL ${then}.`,
  "",
  `#### Scenario: ${id} - it does the thing`,
  "**Serves:** Doing things - it does the thing",
  "",
  "- **WHEN** asked",
  `- **THEN** it does ${then}`,
];

const spec = (title: string, ...requirements: string[][]) =>
  [
    `# ${title}`,
    "",
    "## Purpose",
    "",
    PURPOSE,
    "",
    "## Feature set",
    "",
    "- Doing things",
    "  - The thing: so the spec has a map above its requirements",
    "",
    "## Requirements",
    "",
    ...requirements.flatMap((one) => [...one, ""]),
  ].join("\n");

const proposal = (title: string) =>
  `# ${title}\n\n## Why\n\nSomething had to move.\n`;

const NOBODY =
  "## User journeys\n\n**Walked by:** nobody on their own — a policy every product inherits\n";

/** A story names no scenario. The scenarios name the story, through their own
 * `**Serves:**`, and the join runs through that anchor. */
const story = (id: string) =>
  [
    `### ${id}: Collector does the thing`,
    "",
    "**As a** collector,",
    "**I want** the thing,",
    "**so that** it is done.",
  ].join("\n");

/** A journeys file holds stories, or says nobody walks the capability: the
 * exemption is written down, so a missing file is an omission and never a
 * decision. */
describe("who walks a capability", () => {
  const alpha = spec(
    "Alpha",
    requirement("Alpha does things", "alpha-SC-01", "the thing"),
  );

  it("passes stories, and passes the declaration", async () => {
    const root = writeStore({
      "openspec/specs/demo-product/alpha/spec.md": alpha,
      "openspec/specs/demo-product/alpha/user-journeys.md": `## User journeys\n\n${story("alpha-US-01")}\n`,
      "openspec/specs/demo-topic/spec.md": spec(
        "Topic",
        requirement("The topic holds", "demo-topic-SC-01", "it holds"),
      ),
      "openspec/specs/demo-topic/user-journeys.md": NOBODY,
    });
    expect(lines(await runChecks(root, NO_GIT), "walked")).toEqual([]);
  });

  it("fails a section that is neither, and one that is both", async () => {
    const root = writeStore({
      "openspec/specs/demo-product/alpha/spec.md": alpha,
      "openspec/specs/demo-product/alpha/user-journeys.md":
        "## User journeys\n\nSomeone should write these.\n",
      "openspec/specs/demo-product/beta/spec.md": spec(
        "Beta",
        requirement("Beta holds", "beta-SC-01", "it holds"),
      ),
      "openspec/specs/demo-product/beta/user-journeys.md": `${NOBODY}\n${story("beta-US-01")}\n`,
    });
    expect(lines(await runChecks(root, NO_GIT), "walked")).toEqual([
      "openspec/specs/demo-product/alpha/user-journeys.md — holds no story and does not say `**Walked by:** nobody`: one or the other",
      "openspec/specs/demo-product/beta/user-journeys.md — says `**Walked by:** nobody` and holds 1 story: one of the two is wrong",
    ]);
  });

  it("asks a delta only while its capability has no durable journeys", async () => {
    const root = writeStore({
      "openspec/specs/demo-product/alpha/spec.md": alpha,
      "openspec/specs/demo-product/alpha/user-journeys.md": `## User journeys\n\n${story("alpha-US-01")}\n`,
      "openspec/changes/lean/proposal.md": proposal("Lean"),
      "openspec/changes/lean/specs/demo-product/alpha/spec.md":
        "## MODIFIED Requirements\n\n### Requirement: Alpha does things\n\nAlpha SHALL do the thing.\n",
      "openspec/changes/lean/specs/demo-product/gamma/spec.md":
        "## ADDED Requirements\n\n### Requirement: Gamma exists\n\nGamma SHALL exist.\n",
      "openspec/changes/lean/specs/demo-product/gamma/user-journeys.md": NOBODY,
      "openspec/changes/bare/proposal.md": proposal("Bare"),
      "openspec/changes/bare/specs/demo-product/delta/spec.md":
        "## ADDED Requirements\n\n### Requirement: Delta exists\n\nDelta SHALL exist.\n",
      "openspec/changes/bare/specs/demo-product/epsilon/spec.md":
        "## ADDED Requirements\n\n### Requirement: Epsilon exists\n\nEpsilon SHALL exist.\n",
      "openspec/changes/bare/specs/demo-product/epsilon/user-journeys.md":
        "## User journeys\n",
    });
    expect(lines(await runChecks(root, NO_GIT), "walked")).toEqual([
      "openspec/changes/bare/specs/demo-product/delta/user-journeys.md — missing, and `demo-product/delta` has no durable journeys: name who walks it, or say `**Walked by:** nobody` and why",
      "openspec/changes/bare/specs/demo-product/epsilon/user-journeys.md — holds no story and does not say `**Walked by:** nobody`: one or the other",
    ]);
  });
});

/** The fold carries `## Requirements` alone. A durable spec with requirements
 * and no `## Feature set` is an archive that dropped the map and a hand copy
 * nobody made. */
describe("a durable spec with no feature set", () => {
  const root = writeStore({
    "openspec/specs/demo-product/alpha/spec.md": [
      "# Alpha",
      "",
      "## Purpose",
      "",
      PURPOSE,
      "",
      "## Requirements",
      "",
      ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
      "",
    ].join("\n"),
  });

  it("names the spec the fold left mapless", async () => {
    const result: Result = await runChecks(root, NO_GIT);
    expect(lines(result, "map")).toEqual([
      "openspec/specs/demo-product/alpha/spec.md — no `## Feature set`: the fold carries `## Requirements` alone, so a delta's map reaches the durable spec only by hand",
    ]);
  });
});

/** `openspec archive` runs a delta's headings against the durable ones and
 * throws on a name that drifted — with the change merged and the author gone.
 * Both rules here are that failure, moved to PR time. */
describe("a durable spec carrying a group heading", () => {
  const GROUPED = [
    "# Alpha",
    "",
    "## Purpose",
    "",
    PURPOSE,
    "",
    "## Requirements",
    "",
    ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
    "",
    "### Doing more things",
    "",
    ...requirement("Alpha does more", "alpha-SC-02", "more"),
    "",
  ];
  const root = writeStore({
    "openspec/specs/demo-product/alpha/spec.md": GROUPED.join("\n"),
  });

  it("names the heading the fold would swallow", async () => {
    const result: Result = await runChecks(root, NO_GIT);
    expect(lines(result, "grouping")).toEqual([
      `openspec/specs/demo-product/alpha/spec.md — line ${GROUPED.indexOf("### Doing more things") + 1}: \`### Doing more things\` names no requirement; \`openspec archive\` would fold it into the requirement above it`,
    ]);
  });

  it("says it once, not again as a file the readers refused", async () => {
    const result: Result = await runChecks(root, NO_GIT);
    expect(lines(result, "store")).toEqual([]);
  });
});

describe("callout signatures on a capability page", () => {
  const shelved = (blocks: string) =>
    `---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nAlpha.\n\n${blocks}\n`;

  const journeyed = [
    "# Alpha",
    "",
    "## Purpose",
    "",
    PURPOSE,
    "",
    "## Requirements",
    "",
    ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
    "",
  ].join("\n");

  const STORIES = [
    "## User journeys",
    "",
    "### alpha-US-01: Someone does the thing",
    "",
    "They open alpha and do the thing.",
    "",
  ].join("\n");

  const store = (alpha: string, extra: Record<string, string> = {}) =>
    writeStore({
      "docs/prds/manual.yaml":
        "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
      "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
      "docs/prds/products/demo-product/index.md":
        "---\ntitle: Demo product\nspec: demo-product/alpha\n---\n\nThe landing.\n",
      "docs/prds/products/demo-product/alpha.md": alpha,
      "openspec/specs/demo-product/alpha/spec.md": journeyed,
      "openspec/specs/demo-product/alpha/user-journeys.md": STORIES,
      ...extra,
    });

  /** A `warning` signature is derived from git at build, so an unsigned one
   * is not a finding — nothing hand-maintained is missing. */
  it("raises no finding for an unsigned warning callout", async () => {
    const root = store(
      shelved(
        '::cases{id="demo-product/alpha"}\n\n:::callout{kind="warning"}\nDrifted.\n:::',
      ),
    );
    const { findings } = await runChecks(root, NO_GIT);
    expect(findings.filter((one) => one.rule === "callout")).toEqual([]);
  });
});

describe("in-flight deltas against the durable specs", () => {
  const root = writeStore({
    "openspec/specs/demo-product/alpha/spec.md": spec(
      "Alpha",
      requirement("Alpha does things", "alpha-SC-01", "the thing"),
    ),
    "openspec/changes/steady/proposal.md": proposal("Steady"),
    "openspec/changes/steady/specs/demo-product/alpha/spec.md": [
      "## MODIFIED Requirements",
      "",
      ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
      "",
    ].join("\n"),
    "openspec/changes/drifted/proposal.md": proposal("Drifted"),
    "openspec/changes/drifted/specs/demo-product/alpha/spec.md": [
      "## MODIFIED Requirements",
      "",
      "### Requirement: alpha does   things",
      "",
      "Alpha SHALL do the thing.",
      "",
      "## REMOVED Requirements",
      "",
      "### Requirement: Alpha never did this",
      "",
    ].join("\n"),
    "openspec/changes/drifted/specs/demo-product/gamma/spec.md":
      "## MODIFIED Requirements\n\n### Requirement: Gamma does things\n\nGamma SHALL do it.\n",
  });

  it("passes a heading the fold would find, and names the ones it would not", async () => {
    const result: Result = await runChecks(root, NO_GIT);
    expect(lines(result, "delta")).toEqual([
      "openspec/changes/drifted/specs/demo-product/alpha/spec.md — MODIFIED `alpha does   things` spells `Alpha does things` differently, and the fold matches the heading exactly",
      "openspec/changes/drifted/specs/demo-product/alpha/spec.md — REMOVED `Alpha never did this` names no requirement of `demo-product/alpha`",
      "openspec/changes/drifted/specs/demo-product/gamma/spec.md — MODIFIED `Gamma does things`, but `demo-product/gamma` has no durable spec yet — a new spec can only ADD",
    ]);
  });
});

const ALPHA = spec(
  "Alpha",
  requirement("Alpha does things", "alpha-SC-01", "the thing"),
  requirement("Alpha keeps a record", "alpha-SC-02", "write it down"),
);

/** One change, one delta file, against a durable Alpha. */
const changing = (
  id: string,
  delta: string,
  extra: Record<string, string> = {},
  journeys?: string,
) =>
  writeStore({
    "openspec/specs/demo-product/alpha/spec.md": ALPHA,
    [`openspec/changes/${id}/proposal.md`]: proposal(id),
    [`openspec/changes/${id}/specs/demo-product/alpha/spec.md`]: delta,
    ...(journeys === undefined
      ? {}
      : {
          [`openspec/changes/${id}/specs/demo-product/alpha/user-journeys.md`]:
            journeys,
        }),
    ...extra,
  });

/** `openspec archive` reads a delta by its headings and nothing else: a `###`
 * that names no requirement lands in the durable spec verbatim, and a `##` it
 * does not know ends the delta section it interrupts. */
describe("a delta holding a heading the fold cannot carry", () => {
  const LINES = [
    "# Alpha delta",
    "",
    "## ADDED Requirements",
    "",
    "### Cart item contract",
    "",
    ...requirement("Alpha counts things", "alpha-SC-03", "count"),
    "",
    "## Gift card redemption flows",
    "",
    ...requirement("Alpha redeems things", "alpha-SC-04", "redeem"),
    "",
  ];
  const at = (line: string) => LINES.indexOf(line) + 1;

  it("names the group heading and the section heading, with their lines", async () => {
    const root = changing("grouped", LINES.join("\n"));
    expect(lines(await runChecks(root, NO_GIT), "heading")).toEqual([
      `openspec/changes/grouped/specs/demo-product/alpha/spec.md — line ${at("## Gift card redemption flows")}: \`## Gift card redemption flows\` is no delta section, and every requirement under it falls outside the fold`,
      `openspec/changes/grouped/specs/demo-product/alpha/spec.md — line ${at("### Cart item contract")}: \`### Cart item contract\` names no requirement; the fold copies it into the durable spec verbatim, or aborts on it`,
    ]);
  });

  it("leaves a delta whose every heading the fold reads alone", async () => {
    const root = changing(
      "shaped",
      [
        "# Alpha delta",
        "",
        "## Purpose",
        "",
        "Alpha grows.",
        "",
        "## Feature set",
        "",
        "- counting",
        "",
        "## ADDED Requirements",
        "",
        ...requirement("Alpha counts things", "alpha-SC-03", "count"),
        "",
        "## REMOVED Requirements",
        "",
        "### Requirement: Alpha keeps a record",
        "",
        "## RENAMED Requirements",
        "",
        "- FROM: `### Requirement: Alpha does things`",
        "- TO: `### Requirement: Alpha does the thing`",
        "",
      ].join("\n"),
      {},
      [
        "## User journeys",
        "",
        "### alpha-US-01: Someone counts",
        "",
        "They count what alpha counts.",
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "heading")).toEqual([]);
    expect(lines(await runChecks(root, NO_GIT), "delta")).toEqual([]);
  });
});

/** The three lookups `openspec archive` runs that the check was blind to:
 * a rename's source, a name that already exists, and the scenarios a MODIFIED
 * block would replace away. */
describe("the rest of what the fold refuses", () => {
  it("fails a RENAMED FROM naming nothing and passes one that resolves", async () => {
    const root = changing(
      "renaming",
      [
        "## RENAMED Requirements",
        "",
        "- FROM: `### Requirement: Alpha does things`",
        "- TO: `### Requirement: Alpha does the thing`",
        "- FROM: `### Requirement: Alpha never did this`",
        "- TO: `### Requirement: Alpha still does not`",
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "delta")).toEqual([
      "openspec/changes/renaming/specs/demo-product/alpha/spec.md — RENAMED FROM `Alpha never did this` names no requirement of `demo-product/alpha`",
    ]);
  });

  it("fails an ADDED name the durable spec already carries", async () => {
    const root = changing(
      "adding",
      [
        "## ADDED Requirements",
        "",
        ...requirement("Alpha does things", "alpha-SC-03", "the thing again"),
        "",
        ...requirement("Alpha counts things", "alpha-SC-04", "count"),
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "delta")).toEqual([
      "openspec/changes/adding/specs/demo-product/alpha/spec.md — ADDED `Alpha does things` is already a requirement of `demo-product/alpha`, and the fold refuses to add a name that exists",
    ]);
  });

  it("names the scenarios a MODIFIED block would drop, renamed ones included", async () => {
    const root = changing(
      "dropping",
      [
        "## MODIFIED Requirements",
        "",
        "### Requirement: Alpha does things",
        "",
        "Alpha SHALL do the thing.",
        "",
        "#### Scenario: alpha-SC-01 - it does the thing, briskly",
        "",
        "- **WHEN** asked",
        "- **THEN** it does the thing",
        "",
        "### Requirement: Alpha keeps a record",
        "",
        "Alpha SHALL write it down.",
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "delta")).toEqual([
      "openspec/changes/dropping/specs/demo-product/alpha/spec.md — MODIFIED `Alpha does things` drops alpha-SC-01 — a MODIFIED block replaces the whole requirement, so it has to restate every scenario",
      "openspec/changes/dropping/specs/demo-product/alpha/spec.md — MODIFIED `Alpha keeps a record` drops alpha-SC-02 — a MODIFIED block replaces the whole requirement, so it has to restate every scenario",
    ]);
  });
});

/** Both changes archive cleanly; the second writes the first's text away. */
describe("one requirement two changes both fold", () => {
  it("fails both files, naming the other change and its kind", async () => {
    const root = changing(
      "first",
      [
        "## MODIFIED Requirements",
        "",
        ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
        "",
      ].join("\n"),
      {
        "openspec/changes/second/proposal.md": proposal("Second"),
        "openspec/changes/second/specs/demo-product/alpha/spec.md":
          "## REMOVED Requirements\n\n### Requirement: Alpha does things\n",
      },
    );
    expect(lines(await runChecks(root, NO_GIT), "overlap")).toEqual([
      "openspec/changes/first/specs/demo-product/alpha/spec.md — MODIFIED `Alpha does things` is also folded by `second` (REMOVED) — whichever archives second reverts the first",
      "openspec/changes/second/specs/demo-product/alpha/spec.md — REMOVED `Alpha does things` is also folded by `first` (MODIFIED) — whichever archives second reverts the first",
    ]);
  });

  it("says nothing when two changes fold different requirements of one spec", async () => {
    const root = changing(
      "first",
      [
        "## MODIFIED Requirements",
        "",
        ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
        "",
      ].join("\n"),
      {
        "openspec/changes/second/proposal.md": proposal("Second"),
        "openspec/changes/second/specs/demo-product/alpha/spec.md": [
          "## MODIFIED Requirements",
          "",
          ...requirement(
            "Alpha keeps a record",
            "alpha-SC-02",
            "write it down",
          ),
          "",
        ].join("\n"),
      },
    );
    expect(lines(await runChecks(root, NO_GIT), "overlap")).toEqual([]);
  });
});

/**
 * The deploy's gate. A break in files the manual mirrors — a requirement two
 * changes both fold — must not stop the site that exists to point at it; a
 * break in the manual's own pages still must, because that page is what would
 * publish.
 */
describe("page rules only", () => {
  const pagesOnly = { pages: true };

  it("drops a store family the whole check fails on", async () => {
    const root = changing(
      "first",
      [
        "## MODIFIED Requirements",
        "",
        ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
        "",
      ].join("\n"),
      {
        "openspec/changes/second/proposal.md": proposal("Second"),
        "openspec/changes/second/specs/demo-product/alpha/spec.md":
          "## REMOVED Requirements\n\n### Requirement: Alpha does things\n",
      },
    );

    expect(lines(await runChecks(root, NO_GIT), "overlap")).toHaveLength(2);
    const { findings, notes }: Result = await runChecks(
      root,
      NO_GIT,
      pagesOnly,
    );
    expect(lines({ findings, notes }, "overlap")).toEqual([]);
    expect(notes).toContain(
      "store rules not run — page rules only, the deploy's gate; lint runs the rest",
    );
  });

  it("still refuses a page that would publish broken", async () => {
    const { findings }: Result = await runChecks(
      fixture("broken"),
      NO_GIT,
      pagesOnly,
    );
    expect(findings.some((one) => one.rule === "canonical")).toBe(true);
    expect(findings.some((one) => one.rule === "reference")).toBe(true);
  });
});

/** An id is issued once, ever. The fold destroys a delta's journeys, so the
 * archive folder is the only record that an archived change issued one. */
describe("permanent ids across the whole store", () => {
  const issuing = (id: string, ids: string[]) =>
    [
      "## ADDED Requirements",
      "",
      `### Requirement: ${id} does things`,
      "",
      `${id} SHALL do the thing.`,
      "",
      ...ids.flatMap((one) => [
        `#### Scenario: ${one} - it does the thing`,
        "",
        "- **WHEN** asked",
        "- **THEN** it does the thing",
        "",
      ]),
    ].join("\n");

  it("fails two in-flight changes issuing one id, on both files", async () => {
    const root = changing("first", issuing("beta", ["beta-SC-01"]), {
      "openspec/changes/second/proposal.md": proposal("Second"),
      "openspec/changes/second/specs/demo-product/beta/spec.md": issuing(
        "beta",
        ["beta-SC-01"],
      ),
      "openspec/changes/first/specs/demo-product/alpha/spec.md": issuing(
        "beta",
        ["beta-SC-01"],
      ),
    });
    expect(lines(await runChecks(root, NO_GIT), "issued")).toEqual([
      "openspec/changes/first/specs/demo-product/alpha/spec.md — reuses `beta-SC-01`, which `second` also issues — an id is issued once and never freed",
      "openspec/changes/second/specs/demo-product/beta/spec.md — reuses `beta-SC-01`, which `first` also issues — an id is issued once and never freed",
    ]);
  });

  it("fails an id an archived change issued, which the fold left nowhere else", async () => {
    const root = changing("first", issuing("beta", ["beta-SC-01"]), {
      "openspec/changes/archive/2026-01-01-add-beta/proposal.md":
        proposal("Add beta"),
      "openspec/changes/archive/2026-01-01-add-beta/specs/demo-product/beta/spec.md":
        "## ADDED Requirements\n\n### Requirement: Beta was here\n\n#### Scenario: beta-SC-01 - it was here\n\n- **WHEN** asked\n- **THEN** it happened\n",
    });
    expect(lines(await runChecks(root, NO_GIT), "issued")).toEqual([
      "openspec/changes/first/specs/demo-product/alpha/spec.md — reuses `beta-SC-01`, which the archived `add-beta` also issues — an id is issued once and never freed",
    ]);
  });

  it("fails an ADDED requirement issuing an id the durable spec issues", async () => {
    const root = changing(
      "reissuing",
      [
        "## ADDED Requirements",
        "",
        ...requirement("Alpha counts things", "alpha-SC-02", "count"),
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "issued")).toEqual([
      "openspec/changes/reissuing/specs/demo-product/alpha/spec.md — ADDED `Alpha counts things` issues `alpha-SC-02`, which `demo-product/alpha` already issues — an id is issued once and never freed",
    ]);
  });

  it("lets a MODIFIED block restate durable ids and a change repeat its own", async () => {
    const root = changing(
      "restating",
      [
        "## MODIFIED Requirements",
        "",
        ...requirement("Alpha does things", "alpha-SC-01", "the thing"),
        "",
        "## ADDED Requirements",
        "",
        ...requirement("Alpha counts things", "alpha-SC-03", "count"),
        "",
      ].join("\n"),
      {},
      [
        "## User journeys",
        "",
        "### alpha-US-09: Someone counts",
        "",
        "They count what alpha counts, twice over.",
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "issued")).toEqual([]);
  });
});

/** A rename or a removal archives green and turns `main` red: the page still
 * selects the old name, and `check:manual` gates the deploy. */
describe("a page selecting a requirement a change is about to move", () => {
  const paged = (delta: string) =>
    changing("moving", delta, {
      "docs/prds/manual.yaml":
        "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
      "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
      "docs/prds/products/demo-product/index.md":
        "---\ntitle: Demo product\n---\n\nThe landing.\n",
      "docs/prds/products/demo-product/alpha.md": [
        "---",
        "title: Alpha",
        "spec: demo-product/alpha",
        "---",
        "",
        "Alpha.",
        "",
        '::spec{id="demo-product/alpha" requirement="Alpha keeps a record"}',
        "",
        '::cases{id="demo-product/alpha"}',
        "",
      ].join("\n"),
    });

  it("fails a selector a REMOVED delta deletes", async () => {
    const root = paged(
      "## REMOVED Requirements\n\n### Requirement: Alpha keeps a record\n",
    );
    expect(lines(await runChecks(root, NO_GIT), "fuse")).toEqual([
      'docs/prds/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} selects `Alpha keeps a record`, which `moving` removes — the archive would leave this page naming nothing',
    ]);
  });

  it("fails a selector a RENAMED delta moves, and offers the new name", async () => {
    const root = paged(
      [
        "## RENAMED Requirements",
        "",
        "- FROM: `### Requirement: Alpha keeps a record`",
        "- TO: `### Requirement: Alpha keeps the record`",
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "fuse")).toEqual([
      'docs/prds/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} selects `Alpha keeps a record`, which `moving` renames to `Alpha keeps the record` — point the selector at the new name',
    ]);
  });

  it("leaves a selector a MODIFIED delta only rewrites alone", async () => {
    const root = paged(
      [
        "## MODIFIED Requirements",
        "",
        ...requirement("Alpha keeps a record", "alpha-SC-02", "write it down"),
        "",
      ].join("\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "fuse")).toEqual([]);
  });
});

const WHO = {
  GIT_AUTHOR_NAME: "manual",
  GIT_AUTHOR_EMAIL: "manual@test",
  GIT_COMMITTER_NAME: "manual",
  GIT_COMMITTER_EMAIL: "manual@test",
};

const page = (title: string, id: string) =>
  `---\ntitle: ${title}\nspec: ${id}\n---\n\n${title} is a demo capability.\n`;

/** Staleness is the one check that reads history, so it is tested against a
 * real repository: a spec edited under a page that stayed put, and a spec
 * that was not at its current path when the page was written. */
function stalenessRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "manual-stale-"));
  const write = (path: string, text: string) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  const git = (args: string[], date?: string) =>
    execFileSync("git", args, {
      cwd: root,
      env: date
        ? {
            ...process.env,
            ...WHO,
            GIT_AUTHOR_DATE: date,
            GIT_COMMITTER_DATE: date,
          }
        : { ...process.env, ...WHO },
    });

  git(["init", "--quiet", "."]);
  write(
    "docs/prds/manual.yaml",
    "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
  );
  write(
    "docs/prds/index.md",
    "---\ntitle: Demo\n---\n\nA store with a past.\n",
  );
  write(
    "docs/prds/products/demo-product/index.md",
    "---\ntitle: Demo product\n---\n\nThe one product on disk.\n",
  );
  write(
    "docs/prds/products/demo-product/alpha.md",
    page("Alpha", "demo-product/alpha"),
  );
  write(
    "docs/prds/products/demo-product/moved.md",
    page("Moved", "demo-product/moved"),
  );
  // Read against the changed spec and found right: dated by its review.
  write(
    "docs/prds/products/demo-product/reviewed.md",
    "---\ntitle: Reviewed\nspec: demo-product/alpha\nreviewed: 2026-02-01\n---\n\nReviewed is a demo capability.\n",
  );
  write(
    "openspec/specs/demo-product/alpha/spec.md",
    spec(
      "Alpha",
      requirement("Alpha does things", "alpha-SC-01", "the thing"),
      requirement("Alpha keeps a record", "alpha-SC-02", "write it down"),
    ),
  );
  write(
    "openspec/specs/demo-product/elsewhere/spec.md",
    spec("Moved", requirement("Moved does things", "moved-SC-01", "the thing")),
  );
  write(
    "docs/prds/products/demo-product/tidy.md",
    page("Tidy", "demo-product/tidy"),
  );
  write(
    "openspec/specs/demo-product/tidy/spec.md",
    spec(
      "Tidy",
      requirement("Tidy does things", "tidy-SC-01", "the [thing](../old.md)"),
    ),
  );
  // All say who walks them, so the only findings left are the stale ones.
  write("openspec/specs/demo-product/alpha/user-journeys.md", NOBODY);
  write("openspec/specs/demo-product/elsewhere/user-journeys.md", NOBODY);
  write("openspec/specs/demo-product/tidy/user-journeys.md", NOBODY);
  git(["add", "-A"]);
  git(["commit", "--quiet", "-m", "the pages"], "2026-01-01T00:00:00+00:00");

  write(
    "openspec/specs/demo-product/alpha/spec.md",
    spec(
      "Alpha",
      requirement("Alpha does things", "alpha-SC-01", "the thing, and say so"),
      requirement("Alpha does more", "alpha-SC-03", "more"),
    ),
  );
  git([
    "mv",
    "openspec/specs/demo-product/elsewhere",
    "openspec/specs/demo-product/moved",
  ]);
  // A reissued id and a moved link: maintenance, not meaning.
  write(
    "openspec/specs/demo-product/tidy/spec.md",
    spec(
      "Tidy",
      requirement("Tidy does things", "tidy-SC-09", "the [thing](../new.md)"),
    ),
  );
  git(["add", "-A"]);
  git(["commit", "--quiet", "-m", "the specs"], "2026-02-01T00:00:00+00:00");

  // Never committed, so it has no baseline to be stale against.
  write(
    "docs/prds/products/demo-product/fresh.md",
    page("Fresh", "demo-product/alpha"),
  );
  return root;
}

describe("a page committed before the specs it embeds", () => {
  it("names what changed and the commit, reports a moved spec as moved, passes maintenance and a reviewed page, and only warns", async () => {
    const root = stalenessRepo();
    const result: Result = await runChecks(
      root,
      await readGitIndex(root, ["openspec", "docs/prds"]),
    );
    const sha = execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
      cwd: root,
    })
      .toString()
      .trim();

    expect(lines(result, "stale")).toEqual([
      `docs/prds/products/demo-product/alpha.md — last committed 2026-01-01; \`demo-product/alpha\` has since added \`Alpha does more\`, changed \`Alpha does things\`, removed \`Alpha keeps a record\`; last commit \`${sha}\` the specs`,
      `docs/prds/products/demo-product/moved.md — last committed 2026-01-01; \`demo-product/moved\` spec moved since this page was committed; last commit \`${sha}\` the specs`,
    ]);
    expect(result.findings.every((one) => one.level === "warn")).toBe(true);
  });
});

describe("a 🚧 line and the change delivering it", () => {
  const marked =
    "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\n## Rules\n\n- 🚧 **Refunds** — the points come back\n";
  const durable = {
    "docs/prds/products/demo-product/alpha.md": marked,
    "openspec/specs/demo-product/alpha/spec.md": spec(
      "Alpha",
      requirement("Alpha does things", "alpha-SC-01", "the thing"),
    ),
    "openspec/specs/demo-product/alpha/user-journeys.md": NOBODY,
  };

  it("fails the line when no in-flight change touches the page or its spec", async () => {
    const result: Result = await runChecks(writeStore(durable), NO_GIT);
    expect(lines(result, "marks")).toEqual([
      "docs/prds/products/demo-product/alpha.md — 🚧 `Refunds — the points come back` under `Rules` — no in-flight change on `demo-product/alpha` delivers it",
    ]);
    expect(result.findings.find((one) => one.rule === "marks")?.level).toBe(
      "fail",
    );
  });

  it("is satisfied by a delta on the spec, or a proposal linking the section", async () => {
    const byDelta = writeStore({
      ...durable,
      "openspec/changes/build-alpha/proposal.md": proposal("Build alpha"),
      "openspec/changes/build-alpha/specs/demo-product/alpha/spec.md":
        "## MODIFIED Requirements\n\n### Requirement: Alpha does things\n\nAlpha SHALL do the thing.\n",
    });
    expect(lines(await runChecks(byDelta, NO_GIT), "marks")).toEqual([]);

    const byLink = writeStore({
      ...durable,
      "openspec/changes/build-alpha/proposal.md": `${proposal("Build alpha")}\n## References\n\n- [Alpha · Rules](../../../docs/prds/products/demo-product/alpha.md#rules)\n`,
    });
    expect(lines(await runChecks(byLink, NO_GIT), "marks")).toEqual([]);
  });
});

/** Three rules read the change's own record: the 🚧 its deltas derive from,
 * the design its application work needs, and the deploy its archive shipped
 * on. Each has a key in `.openspec.yaml` that stands in for the thing. */
describe("the record a change leaves", () => {
  const durable = {
    "openspec/specs/demo-product/alpha/spec.md": spec(
      "Alpha",
      requirement("Alpha does things", "alpha-SC-01", "the thing"),
    ),
    "openspec/specs/demo-product/alpha/user-journeys.md": NOBODY,
  };
  const page = (line: string) =>
    `---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\n## Rules\n\n- ${line}\n`;
  const MARKED = page("🚧 **Refunds** — the points come back");
  const FLAT = page("**Refunds** — the points come back");
  const delta =
    "## MODIFIED Requirements\n\n### Requirement: Alpha does things\n\nAlpha SHALL do the thing.\n";
  const links = (...bullets: string[]) =>
    `${proposal("Build alpha")}\n## References\n\n${bullets.join("\n")}\n`;
  const RULES_LINK =
    "- [Alpha · Rules](../../../docs/prds/products/demo-product/alpha.md#rules)";

  const carrying = (
    files: Record<string, string>,
    proposalText = links(RULES_LINK),
  ) => ({
    ...durable,
    "openspec/changes/build-alpha/proposal.md": proposalText,
    "openspec/changes/build-alpha/specs/demo-product/alpha/spec.md": delta,
    ...files,
  });

  it("passes a change whose linked section carries a 🚧", async () => {
    const root = writeStore(
      carrying({ "docs/prds/products/demo-product/alpha.md": MARKED }),
    );
    expect(lines(await runChecks(root, NO_GIT), "unmarked")).toEqual([]);
  });

  it("refuses a change that links no section of a PRD", async () => {
    const root = writeStore(
      carrying(
        { "docs/prds/products/demo-product/alpha.md": MARKED },
        proposal("Build alpha"),
      ),
    );
    expect(lines(await runChecks(root, NO_GIT), "unmarked")).toEqual([
      "openspec/changes/build-alpha/proposal.md — links no section of a PRD — mark what this change delivers, or say why in `page_waived`",
    ]);
  });

  it("refuses a change linking a section nothing under it marks", async () => {
    const root = writeStore(
      carrying({ "docs/prds/products/demo-product/alpha.md": FLAT }),
    );
    expect(lines(await runChecks(root, NO_GIT), "unmarked")).toEqual([
      "openspec/changes/build-alpha/proposal.md — no 🚧 line sits under a section it links — mark what this change delivers, or say why in `page_waived`",
    ]);
  });

  /** A mark above the page's first `## ` belongs to no section, so no link can
   * name it — the link is what binds the change to the line. */
  it("refuses a 🚧 sitting above every heading", async () => {
    const root = writeStore(
      carrying({
        "docs/prds/products/demo-product/alpha.md":
          "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\n🚧 **Refunds** — the points come back\n\n## Rules\n\n- **Scope** — every order\n",
      }),
    );
    expect(lines(await runChecks(root, NO_GIT), "unmarked")).toEqual([
      "openspec/changes/build-alpha/proposal.md — no 🚧 line sits under a section it links — mark what this change delivers, or say why in `page_waived`",
    ]);
  });

  it("passes a change whose manifest waives the page", async () => {
    const root = writeStore(
      carrying(
        {
          "docs/prds/products/demo-product/alpha.md": FLAT,
          "openspec/changes/build-alpha/.openspec.yaml":
            'schema: grade10-planning\npage_waived: "predates the page rule"\n',
        },
        proposal("Build alpha"),
      ),
    );
    expect(lines(await runChecks(root, NO_GIT), "unmarked")).toEqual([]);
  });

  /** A key read as absent would waive the rule it answers to, quietly. */
  it("refuses a record key holding anything but text", async () => {
    const root = writeStore(
      carrying({
        "docs/prds/products/demo-product/alpha.md": MARKED,
        "openspec/changes/build-alpha/.openspec.yaml":
          "schema: grade10-planning\ndeploy_waived: true\n",
      }),
    );
    expect(lines(await runChecks(root, NO_GIT), "store")).toEqual([
      "openspec/changes/build-alpha/.openspec.yaml — build-alpha line 1: `deploy_waived` must be a line of text",
    ]);
  });

  const planned = (group: string, files: Record<string, string> = {}) =>
    writeStore(
      carrying({
        "docs/prds/products/demo-product/alpha.md": MARKED,
        "openspec/changes/build-alpha/tasks.md": `## ${group}\n\n- [ ] 1.1 Build it\n`,
        ...files,
      }),
    );

  it("refuses application work with no tech design, tagged or not", async () => {
    expect(
      lines(
        await runChecks(planned("1. Build it (grade10)"), NO_GIT),
        "design",
      ),
    ).toEqual([
      "openspec/changes/build-alpha/tasks.md — group 1 names `grade10`, so the work lands outside this store and has no `tech-design.md` — write it, or say why in `design_waived`",
    ]);
    expect(
      lines(await runChecks(planned("1. Build it"), NO_GIT), "design"),
    ).toEqual([
      "openspec/changes/build-alpha/tasks.md — group 1 names no repository, so the work lands outside this store and has no `tech-design.md` — write it, or say why in `design_waived`",
    ]);
  });

  it("names a product tagged as a repository, rather than asking for a design", async () => {
    expect(
      lines(
        await runChecks(planned("1. Build it (demo-product)"), NO_GIT),
        "design",
      ),
    ).toEqual([
      "openspec/changes/build-alpha/tasks.md — group 1 names `demo-product`, a product under `openspec/specs/`, not a repository — tag the group `(grade10-spec)` for work landing here, or the application's clone name, and keep the product in the title",
    ]);
  });

  it("passes the design written, the work that stays in this store, and the waiver", async () => {
    const written = planned("1. Build it (grade10)", {
      "openspec/changes/build-alpha/tech-design.md":
        "## Context\n\nIt lands here.\n",
    });
    expect(lines(await runChecks(written, NO_GIT), "design")).toEqual([]);

    const here = planned("1. Write the pages (grade10-spec)");
    expect(lines(await runChecks(here, NO_GIT), "design")).toEqual([]);

    const waived = planned("1. Build it (grade10)", {
      "openspec/changes/build-alpha/.openspec.yaml":
        'schema: grade10-planning\ndesign_waived: "predates the design rule"\n',
    });
    expect(lines(await runChecks(waived, NO_GIT), "design")).toEqual([]);
  });

  const EARLIER = new Date(
    Date.parse(`${DEPLOY_RECORD_SINCE}T00:00:00Z`) - 86_400_000,
  )
    .toISOString()
    .slice(0, 10);

  const shipped = (
    on: string,
    files: Record<string, string>,
    group = "1. Build it (grade10)",
  ) =>
    writeStore({
      ...durable,
      [`openspec/changes/archive/${on}-build-alpha/proposal.md`]:
        proposal("Build alpha"),
      [`openspec/changes/archive/${on}-build-alpha/tasks.md`]: `## ${group}\n\n- [x] 1.1 Build it\n`,
      ...files,
    });

  const record = (on: string, body: string) => ({
    [`openspec/changes/archive/${on}-build-alpha/.openspec.yaml`]: `schema: grade10-planning\n${body}`,
  });

  it("refuses an archive recording no deploy", async () => {
    const root = shipped(
      DEPLOY_RECORD_SINCE,
      record(DEPLOY_RECORD_SINCE, "created: 2026-09-01\n"),
    );
    expect(lines(await runChecks(root, NO_GIT), "archived")).toEqual([
      `openspec/changes/archive/${DEPLOY_RECORD_SINCE}-build-alpha/.openspec.yaml — records no deploy — \`pnpm plan shipped build-alpha\` writes \`deployed_at\`, or say who archived it without one in \`deploy_waived\``,
    ]);
  });

  it("refuses an archive carrying no manifest at all", async () => {
    const root = shipped(DEPLOY_RECORD_SINCE, {});
    expect(lines(await runChecks(root, NO_GIT), "archived")).toEqual([
      `openspec/changes/archive/${DEPLOY_RECORD_SINCE}-build-alpha/.openspec.yaml — carries no \`.openspec.yaml\`, so it records no deploy — \`pnpm plan shipped build-alpha\` writes \`deployed_at\`, or say who archived it without one in \`deploy_waived\``,
    ]);
  });

  /** No task group is not "every group lands in this store" — a change that
   * shipped deltas without a task list owes the record like any other. */
  it("refuses an archive carrying deltas and no tasks.md", async () => {
    const dir = `openspec/changes/archive/${DEPLOY_RECORD_SINCE}-build-alpha`;
    const root = writeStore({
      ...durable,
      [`${dir}/proposal.md`]: proposal("Build alpha"),
      [`${dir}/specs/demo-product/alpha/spec.md`]: delta,
      ...record(DEPLOY_RECORD_SINCE, "created: 2026-09-01\n"),
    });
    expect(lines(await runChecks(root, NO_GIT), "archived")).toEqual([
      `${dir}/.openspec.yaml — records no deploy — \`pnpm plan shipped build-alpha\` writes \`deployed_at\`, or say who archived it without one in \`deploy_waived\``,
    ]);
  });

  it("passes the sha, the waiver, work that only lands in this store, and an archive that predates the rule", async () => {
    const at = shipped(
      DEPLOY_RECORD_SINCE,
      record(
        DEPLOY_RECORD_SINCE,
        'deployed_at: "0f1e2d3"\ndeployed_env: "production"\n',
      ),
    );
    expect(lines(await runChecks(at, NO_GIT), "archived")).toEqual([]);

    const waived = shipped(
      DEPLOY_RECORD_SINCE,
      record(DEPLOY_RECORD_SINCE, 'deploy_waived: "@echo, nothing shipped"\n'),
    );
    expect(lines(await runChecks(waived, NO_GIT), "archived")).toEqual([]);

    const here = shipped(
      DEPLOY_RECORD_SINCE,
      record(DEPLOY_RECORD_SINCE, "created: 2026-09-01\n"),
      "1. Write the pages (grade10-spec)",
    );
    expect(lines(await runChecks(here, NO_GIT), "archived")).toEqual([]);

    const earlier = shipped(EARLIER, {});
    expect(lines(await runChecks(earlier, NO_GIT), "archived")).toEqual([]);
  });
});

describe("a manifest naming its blockers", () => {
  const manifest = (dependsOn: string) =>
    `schema: grade10-planning\ncreated: 2026-08-01\ndepends_on:\n  - ${dependsOn}\n`;
  const change = (why: string) => `# A change\n\n## Why\n\n${why}\n`;

  it("fails a depends_on naming no change, in flight or archived", async () => {
    const root = writeStore({
      "openspec/changes/add-alpha/.openspec.yaml": manifest("add-ghost"),
      "openspec/changes/add-alpha/proposal.md": change("Alpha."),
    });
    const result: Result = await runChecks(root, NO_GIT);
    expect(lines(result, "depends")).toEqual([
      "openspec/changes/add-alpha/.openspec.yaml — depends_on `add-ghost` names no change, in flight or archived",
    ]);
  });

  it("is satisfied by an in-flight sibling or an archived change", async () => {
    const root = writeStore({
      "openspec/changes/add-alpha/.openspec.yaml": manifest("add-beta"),
      "openspec/changes/add-alpha/proposal.md": change("Alpha."),
      "openspec/changes/add-beta/.openspec.yaml": manifest("add-shipped"),
      "openspec/changes/add-beta/proposal.md": change("Beta."),
      "openspec/changes/archive/2026-07-01-add-shipped/proposal.md":
        change("Shipped."),
    });
    const result: Result = await runChecks(root, NO_GIT);
    expect(lines(result, "depends")).toEqual([]);
  });
});
