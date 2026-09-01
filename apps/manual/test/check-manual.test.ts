import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { formatReport, runChecks } from "../../../scripts/check-manual.mjs";
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
      'manual/index.md — line 5: is "", canonical is "Demo manual, with one blank line too many."',
    ]);
  });

  it("names every reference that resolves to nothing", async () => {
    expect(lines(await result, "reference")).toEqual([
      'manual/products/demo-product/alpha.md — ::changes{spec="demo-product/nowhere"} names no spec on disk and no in-flight change',
      'manual/products/demo-product/alpha.md — ::image{src="assets/missing.svg"} names no file under manual/assets',
      'manual/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} has no requirement `Alpha does nothing`',
      'manual/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} issues no scenario `alpha-SC-99`',
      'manual/products/demo-product/alpha.md — ::spec{id="demo-product/gamma"} names no spec on disk',
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
      "manual/products/demo-product/index.md — product `demo-product` has no page here",
    ]);
  });

  it("refuses a listed product that is neither on disk nor paged", async () => {
    expect(lines(await result, "config")).toEqual([
      "manual/manual.yaml — `ghost` is neither a spec-dir product nor a page-only product with pages under manual/products/ghost/",
    ]);
  });

  it("warns rather than fails on a link, an unshown journey and a bare shelf", async () => {
    const warnings = (await result).findings.filter(
      (one) => one.level === "warn",
    );
    expect(warnings.map((one) => one.rule).sort()).toEqual([
      "figma",
      "journeys",
      "skeleton",
    ]);
  });

  it("names the capability page whose spec has no acceptance shelf", async () => {
    expect(lines(await result, "skeleton")).toEqual([
      "manual/products/demo-product/alpha.md — has a `spec` and neither a `::journeys` nor a `::cases` block — missing its acceptance shelf",
    ]);
  });

  it("exits 1 with the counts in the summary", async () => {
    const root = fixture("broken");
    const report = formatReport(root, await result);
    expect(report.failures).toBe(9);
    expect(report.warnings).toBe(3);
    expect(report.text).toContain("9 failures, 3 warnings");
  });
});

describe("a manual.yaml that lists a product twice", () => {
  it("fails on the duplicate and reads no further config", async () => {
    const result: Result = await runChecks(fixture("duplicate"), NO_GIT);
    expect(lines(result, "config")).toEqual([
      "manual/manual.yaml — lists `demo-product` twice",
    ]);
  });
});

describe("a store with the workbench Storybook built", () => {
  it("checks story ids against the index and says nothing about it", async () => {
    const result: Result = await runChecks(fixture("stories"), NO_GIT);
    expect(lines(result, "story")).toEqual([
      'manual/index.md — ::story{id="blocks-demo--gone"} is not in apps/preview/storybook-static/index.json',
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
    "## Requirements",
    "",
    ...requirements.flatMap((one) => [...one, ""]),
  ].join("\n");

const proposal = (title: string) =>
  `# ${title}\n\n## Why\n\nSomething had to move.\n`;

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

/** The shelf warning is aimed at capability pages only, and either acceptance
 * block answers it — including one nested inside a container. */
describe("the acceptance shelf a capability page keeps", () => {
  const shelved = (blocks: string) =>
    `---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nAlpha.\n\n${blocks}\n`;

  const store = (alpha: string, extra: Record<string, string> = {}) =>
    writeStore({
      "manual/manual.yaml":
        "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
      "manual/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
      "manual/products/demo-product/index.md":
        "---\ntitle: Demo product\nspec: demo-product/alpha\n---\n\nThe landing.\n",
      "manual/products/demo-product/alpha.md": alpha,
      "openspec/specs/demo-product/alpha/spec.md": spec(
        "Alpha",
        requirement("Alpha does things", "alpha-SC-01", "the thing"),
      ),
      ...extra,
    });

  it("says nothing when the page shows its cases", async () => {
    const root = store(shelved('::cases{id="demo-product/alpha"}'));
    expect(lines(await runChecks(root, NO_GIT), "skeleton")).toEqual([]);
  });

  it("says nothing when the page shows its journeys", async () => {
    const root = store(shelved('::journeys{id="demo-product/alpha"}'));
    expect(lines(await runChecks(root, NO_GIT), "skeleton")).toEqual([]);
  });

  it("finds an acceptance block nested in a container", async () => {
    const root = store(
      shelved(
        ':::callout{kind="note"}\nStill a shelf.\n\n::cases{id="demo-product/alpha"}\n:::',
      ),
    );
    expect(lines(await runChecks(root, NO_GIT), "skeleton")).toEqual([]);
  });

  it("leaves a landing page and a platform page alone", async () => {
    const root = store(shelved('::cases{id="demo-product/alpha"}'), {
      "manual/platform/demo-topic.md":
        "---\ntitle: Topic\nspec: demo-topic\n---\n\nA topic page.\n",
      "openspec/specs/demo-topic/spec.md": spec(
        "Topic",
        requirement("Topic does things", "topic-SC-01", "the thing"),
      ),
    });
    expect(lines(await runChecks(root, NO_GIT), "skeleton")).toEqual([]);
  });

  it("warns on a capability page carrying a spec and neither block", async () => {
    const root = store(
      "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\nAlpha, with no shelf.\n",
    );
    expect(lines(await runChecks(root, NO_GIT), "skeleton")).toEqual([
      "manual/products/demo-product/alpha.md — has a `spec` and neither a `::journeys` nor a `::cases` block — missing its acceptance shelf",
    ]);
  });

  it("leaves a capability page with no spec alone", async () => {
    const root = store("---\ntitle: Alpha\n---\n\nProse only, no contract.\n");
    expect(lines(await runChecks(root, NO_GIT), "skeleton")).toEqual([]);
  });

  /** A `warning` is hand-written judgment that rots silently; the name and
   * date are what let a reader ask whether it is still true, and whose it is. */
  it("warns on a warning callout nobody signed", async () => {
    const root = store(
      shelved(
        '::cases{id="demo-product/alpha"}\n\n:::callout{kind="warning"}\nDrifted.\n:::',
      ),
    );
    expect(lines(await runChecks(root, NO_GIT), "callout")).toEqual([
      'manual/products/demo-product/alpha.md — a `warning` callout carries who wrote it and when — `:::callout{kind="warning" author="@handle" date="YYYY-MM-DD"}`',
    ]);
  });

  it("says nothing for a signed warning, or an unsigned note", async () => {
    const root = store(
      shelved(
        '::cases{id="demo-product/alpha"}\n\n:::callout{kind="warning" author="@echo" date="2026-08-30"}\nDrifted, and owned.\n:::\n\n:::callout{kind="note"}\nJust an aside.\n:::',
      ),
    );
    expect(lines(await runChecks(root, NO_GIT), "callout")).toEqual([]);
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
) =>
  writeStore({
    "openspec/specs/demo-product/alpha/spec.md": ALPHA,
    [`openspec/changes/${id}/proposal.md`]: proposal(id),
    [`openspec/changes/${id}/specs/demo-product/alpha/spec.md`]: delta,
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
        "## User journeys",
        "",
        "### alpha-US-01: Someone counts",
        "",
        "**Accepted by:** alpha-SC-03",
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
    );
    expect(lines(await runChecks(root, NO_GIT), "heading")).toEqual([]);
    expect(lines(await runChecks(root, NO_GIT), "delta")).toEqual([]);
  });
});

/** `buildSpecSkeleton` rebuilds a spec's head from Purpose alone, for a spec
 * the change creates as much as one it updates. */
describe("a delta carrying sections the fold discards", () => {
  const root = changing(
    "journeyed",
    [
      "## Feature set",
      "",
      "- counting",
      "",
      "## User journeys",
      "",
      "### alpha-US-07: Someone counts",
      "",
      "**Accepted by:** alpha-SC-03",
      "",
      "### alpha-US-08: Someone recounts",
      "",
      "**Accepted by:** alpha-SC-03",
      "",
      "## ADDED Requirements",
      "",
      ...requirement("Alpha counts things", "alpha-SC-03", "count"),
      "",
    ].join("\n"),
  );

  it("names the section and the ids it holds, and only warns", async () => {
    const result: Result = await runChecks(root, NO_GIT);
    expect(lines(result, "fold")).toEqual([
      "openspec/changes/journeyed/specs/demo-product/alpha/spec.md — `## Feature set` — the fold carries Purpose and Requirements only, so archiving drops it",
      "openspec/changes/journeyed/specs/demo-product/alpha/spec.md — `## User journeys` holding alpha-US-07, alpha-US-08 — the fold carries Purpose and Requirements only, so archiving drops it",
    ]);
    expect(
      result.findings.filter(
        (one) => one.rule === "fold" && one.level !== "warn",
      ),
    ).toEqual([]);
  });

  it("says nothing about a delta that is requirements only", async () => {
    const plain = changing(
      "plain",
      `## ADDED Requirements\n\n${requirement("Alpha counts things", "alpha-SC-03", "count").join("\n")}\n`,
    );
    expect(lines(await runChecks(plain, NO_GIT), "fold")).toEqual([]);
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
        "## ADDED Requirements\n\n### Requirement: Beta was here\n\n**Accepted by:** beta-SC-01\n",
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
        "## User journeys",
        "",
        "### alpha-US-09: Someone counts",
        "",
        "**Accepted by:** alpha-SC-03, alpha-SC-03",
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
      "manual/manual.yaml":
        "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
      "manual/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
      "manual/products/demo-product/index.md":
        "---\ntitle: Demo product\n---\n\nThe landing.\n",
      "manual/products/demo-product/alpha.md": [
        "---",
        "title: Alpha",
        "spec: demo-product/alpha",
        "---",
        "",
        "Alpha.",
        "",
        '::spec{id="demo-product/alpha" requirement="Alpha keeps a record"}',
        "",
        '::journeys{id="demo-product/alpha"}',
        "",
      ].join("\n"),
    });

  it("fails a selector a REMOVED delta deletes", async () => {
    const root = paged(
      "## REMOVED Requirements\n\n### Requirement: Alpha keeps a record\n",
    );
    expect(lines(await runChecks(root, NO_GIT), "fuse")).toEqual([
      'manual/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} selects `Alpha keeps a record`, which `moving` removes — the archive would leave this page naming nothing',
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
      'manual/products/demo-product/alpha.md — ::spec{id="demo-product/alpha"} selects `Alpha keeps a record`, which `moving` renames to `Alpha keeps the record` — point the selector at the new name',
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
    "manual/manual.yaml",
    "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
  );
  write("manual/index.md", "---\ntitle: Demo\n---\n\nA store with a past.\n");
  write(
    "manual/products/demo-product/index.md",
    "---\ntitle: Demo product\n---\n\nThe one product on disk.\n",
  );
  write(
    "manual/products/demo-product/alpha.md",
    page("Alpha", "demo-product/alpha"),
  );
  write(
    "manual/products/demo-product/moved.md",
    page("Moved", "demo-product/moved"),
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
  git(["add", "-A"]);
  git(["commit", "--quiet", "-m", "the specs"], "2026-02-01T00:00:00+00:00");

  // Never committed, so it has no baseline to be stale against.
  write(
    "manual/products/demo-product/fresh.md",
    page("Fresh", "demo-product/alpha"),
  );
  return root;
}

describe("a page committed before the specs it embeds", () => {
  it("names what changed, reports a moved spec as moved, and only warns", async () => {
    const root = stalenessRepo();
    const result: Result = await runChecks(
      root,
      await readGitIndex(root, ["openspec", "manual"]),
    );

    expect(lines(result, "stale")).toEqual([
      "manual/products/demo-product/alpha.md — last committed 2026-01-01; `demo-product/alpha` has since added `Alpha does more`, changed `Alpha does things`, removed `Alpha keeps a record`",
      "manual/products/demo-product/moved.md — last committed 2026-01-01; `demo-product/moved` spec moved since this page was committed",
    ]);
    expect(result.findings.every((one) => one.level === "warn")).toBe(true);
  });
});

describe("a manifest naming its blockers", () => {
  const manifest = (dependsOn: string) =>
    `schema: pm-planning\ncreated: 2026-08-01\ndepends_on:\n  - ${dependsOn}\n`;
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
