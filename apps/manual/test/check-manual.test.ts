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
});

describe("in-flight deltas against the durable specs", () => {
  const root = writeStore({
    "openspec/specs/demo-product/alpha/spec.md": spec(
      "Alpha",
      requirement("Alpha does things", "alpha-SC-01", "the thing"),
    ),
    "openspec/changes/steady/proposal.md": proposal("Steady"),
    "openspec/changes/steady/specs/demo-product/alpha/spec.md":
      "## MODIFIED Requirements\n\n### Requirement: Alpha does things\n\nAlpha SHALL still do the thing.\n",
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
