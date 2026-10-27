import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { formatReport, runChecks } from "../check/check-manual.mjs";
import { NO_GIT } from "../src/store/git.mts";
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

  it("--quiet drops the note the default report keeps", async () => {
    const root = fixture("clean");
    const outcome = await runChecks(root, NO_GIT);
    const loud = formatReport(root, outcome).text;
    const quiet = formatReport(root, outcome, { quiet: true }).text;
    expect(loud).toContain("note:");
    expect(quiet).not.toContain("note:");
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
      'docs/prds/products/demo-product/alpha.md — ::image{src="assets/missing.svg"} names no file under docs/prds/assets',
    ]);
  });

  /** `demo-product/gamma` exists only as `add-gamma`'s delta: a ribbon may
   * point at it, a `::spec` block that would render it may not, and
   * `demo-product/nowhere` is a typo either way. */
  it("names the product landing that is missing", async () => {
    expect(lines(await result, "page")).toEqual([
      "docs/prds/products/demo-product/index.md — product `demo-product` has no page here",
    ]);
  });

  it("refuses a listed product with no pages", async () => {
    expect(lines(await result, "config")).toEqual([
      "docs/prds/manual.yaml — `ghost` has no pages under docs/prds/products/ghost/",
    ]);
  });

  it("warns rather than fails on a link, and on a walked capability with no suite", async () => {
    const warnings = (await result).findings.filter(
      (one) => one.level === "warn",
    );
    expect(warnings.map((one) => one.rule).sort()).toEqual(["figma"]);
  });

  /** The hatch is granted by this rule staying quiet, so what it says is the
   * only place a change that owes a second reading is named. */
  /** Asked of the delta as well as of the store it folds into: the anchor a
   * scenario meant is findable while its author is still here. */
  it("exits 1 with the counts in the summary", async () => {
    const root = fixture("broken");
    const report = formatReport(root, await result);
    expect(lines(await result, "reference")).toHaveLength(1);
    expect(report.failures).toBe(4);
    expect(report.warnings).toBe(1);
    expect(report.text).toContain("4 failures, 1 warning");
  });

  it("--quiet keeps only lines the default report already prints, and drops WARN", async () => {
    const root = fixture("broken");
    const outcome = await result;
    const loudReport = formatReport(root, outcome);
    const quietReport = formatReport(root, outcome, { quiet: true });
    expect(quietReport.failures).toBe(4);
    expect(quietReport.warnings).toBe(1);
    expect(loudReport.text).toContain("WARN");
    expect(quietReport.text).not.toContain("WARN");
    expect(quietReport.text).toContain("FAIL");
    expect(quietReport.text).toContain("4 failures, 1 warning");
    for (const line of quietReport.text
      .split("\n")
      .filter((one) => one.length > 0)) {
      expect(loudReport.text).toContain(line);
    }
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

const NOBODY =
  "## User journeys\n\n**Walked by:** nobody on their own — a policy every product inherits\n";

/** A story names no scenario. The scenarios name the story, through their own
 * `**Serves:**`, and the join runs through that anchor. */
/** A journeys file holds stories, or says nobody walks the capability: the
 * exemption is written down, so a missing file is an omission and never a
 * decision. */
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

describe("a 🚧 line", () => {
  it("stands on the page alone: the mark is the record, no change is asked to deliver it", async () => {
    const result: Result = await runChecks(
      writeStore({
        "docs/prds/products/demo-product/alpha.md":
          "---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\n## Rules\n\n- 🚧 **Refunds** — the points come back\n",
        "openspec/specs/demo-product/alpha/spec.md": spec(
          "Alpha",
          requirement("Alpha does things", "alpha-SC-01", "the thing"),
        ),
        "openspec/specs/demo-product/alpha/user-journeys.md": NOBODY,
      }),
      NO_GIT,
    );
    expect(result.findings.filter((one) => one.reason.includes("🚧"))).toEqual(
      [],
    );
  });
});

/** The record rules read the change's marks and its application design. */
