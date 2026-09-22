import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { findStoreRoot } from "../src/store/disk.mts";
import { NO_GIT } from "../src/store/git.mts";
import { demoSchema } from "./demo-schema";
import { findingsOf, recordStoreFiles } from "./record-store";
import { writeStore } from "./tmp-store";

type Finding = { rule: string; path: string; reason: string };
type Result = { findings: Finding[]; notes: string[] };

const refs = (result: Result) =>
  result.findings
    .filter((one) => one.rule === "ref")
    .map((one) => `${one.path} — ${one.reason}`)
    .sort();

const spec = (title: string, id: string, scenarios: string[]) =>
  [
    `# ${title}`,
    "",
    "## Purpose",
    "",
    `${title} exists so a page has something to cite.`,
    "",
    "## Requirements",
    "",
    `### Requirement: ${title} does things`,
    "",
    `${title} SHALL do the thing.`,
    "",
    ...scenarios.flatMap((scenario) => [
      `#### Scenario: ${scenario} - ${id} keeps its place`,
      "",
      "- **WHEN** asked",
      "- **THEN** it does the thing",
      "",
    ]),
  ].join("\n");

/** Both specs issue `navigation-SC-01`, the collision the store already has. */
const store = (pages: Record<string, string>) =>
  writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "openspec/specs/demo-product/alpha/spec.md": spec("Alpha", "alpha", [
      "alpha-SC-01",
      "navigation-SC-01",
    ]),
    "openspec/specs/demo-product/beta/spec.md": spec("Beta", "beta", [
      "navigation-SC-01",
    ]),
    ...pages,
  });

const capability = (body: string) =>
  `---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\n${body}\n`;

const alpha = (body: string) =>
  store({ "docs/prds/products/demo-product/alpha.md": capability(body) });

describe("a reference the store cannot answer", () => {
  it("names the page, the reference as written, and why it failed", async () => {
    const result: Result = await runChecks(
      alpha("Alpha cites [[alpha-SC-99]]."),
      NO_GIT,
    );

    expect(refs(result)).toEqual([
      "docs/prds/products/demo-product/alpha.md — `[[alpha-SC-99]]`: nothing named `alpha-SC-99`",
    ]);
  });

  it("says how to qualify an id two specs answer to", async () => {
    const root = store({
      "docs/prds/guides/writing.md":
        "---\ntitle: Writing\n---\n\nCite it as [[navigation-SC-01]].\n",
    });

    expect(refs(await runChecks(root, NO_GIT))).toEqual([
      "docs/prds/guides/writing.md — `[[navigation-SC-01]]`: `navigation-SC-01` lives in `demo-product/alpha` and `demo-product/beta` — qualify it as `[[<spec>#navigation-SC-01]]`",
    ]);
  });

  it("reads the prose inside a container, where a decision cites one", async () => {
    const result: Result = await runChecks(
      alpha(':::callout{kind="decision"}\nWe kept [[alpha-SC-99]].\n:::'),
      NO_GIT,
    );

    expect(refs(result)).toEqual([
      "docs/prds/products/demo-product/alpha.md — `[[alpha-SC-99]]`: nothing named `alpha-SC-99`",
    ]);
  });

  it("says nothing about an id the page's own spec issues", async () => {
    const result: Result = await runChecks(
      alpha("Alpha cites [[navigation-SC-01]] and [[alpha-SC-01]]."),
      NO_GIT,
    );

    expect(refs(result)).toEqual([]);
  });
});

describe("where the check must not look", () => {
  it("leaves a fenced block inside prose alone", async () => {
    const result: Result = await runChecks(
      alpha("Write it like this:\n\n```\n[[alpha-SC-99]]\n```"),
      NO_GIT,
    );

    expect(refs(result)).toEqual([]);
  });

  it("leaves an inline code span alone", async () => {
    const result: Result = await runChecks(
      alpha("Write `[[alpha-SC-99]]` to cite it."),
      NO_GIT,
    );

    expect(refs(result)).toEqual([]);
  });

  it("finds one on the line after a fence closes", async () => {
    const result: Result = await runChecks(
      alpha("```\n[[alpha-SC-98]]\n```\n\nThen [[alpha-SC-99]] for real."),
      NO_GIT,
    );

    expect(refs(result)).toEqual([
      "docs/prds/products/demo-product/alpha.md — `[[alpha-SC-99]]`: nothing named `alpha-SC-99`",
    ]);
  });
});

/** Checked once at import: the run grows with the store, so a case that waits
 * for it fails on the clock rather than on the references. */
const live = await runChecks(
  findStoreRoot(fileURLToPath(new URL(".", import.meta.url))),
  NO_GIT,
);

describe("the manual as it stands", () => {
  it("carries no reference the store cannot answer", () => {
    expect(refs(live)).toEqual([]);
  });
});

/** A page is written before the delta: the change declares the capability as
 * a `specs/<capability>/` directory holding its journeys, and the page's
 * `spec:` resolves to it before any `spec.md` exists beside them. */
describe("a page written first for a capability an in-flight change declares", () => {
  const SCHEMA = demoSchema(["proposal", "specs"]);
  const files = (extra: Record<string, string>) =>
    recordStoreFiles({
      change: "page-first",
      schema: SCHEMA,
      record: "awaiting:\n  specs: the requirements come after the journeys\n",
      title: "Page first",
      files: {
        "docs/prds/products/demo-product/gamma.md":
          "---\ntitle: Gamma\nspec: demo-product/gamma\n---\n\nGamma exists so a page has something to cite.\n",
        ...extra,
      },
    });

  it("shared-planning-agent-rounds-SC-100 - resolves the page's spec to the journeys the change holds, with no delta yet", async () => {
    const found = await findingsOf(
      files({
        "openspec/changes/page-first/specs/demo-product/gamma/user-journeys.md":
          "## ADDED User journeys\n\n### gamma-US-01: Collector browses\n\n**As a** collector,\n**I want** the grid,\n**so that** I can browse.\n",
      }),
      "reference",
    );
    expect(found).toEqual([]);
  });

  it("shared-planning-agent-rounds-SC-100 - still refuses a page whose spec no change declares", async () => {
    const found = await findingsOf(files({}), "reference");
    expect(found).toHaveLength(1);
    expect(found[0].reason).toContain(
      "names no spec on disk and no in-flight change",
    );
  });
});
