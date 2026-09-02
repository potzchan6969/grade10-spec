import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runChecks } from "../check/check-manual.mjs";
import { findStoreRoot } from "../src/store/disk.mts";
import { NO_GIT } from "../src/store/git.mts";
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

describe("the manual as it stands", () => {
  it("carries no reference the store cannot answer", async () => {
    const root = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));

    expect(refs(await runChecks(root, NO_GIT))).toEqual([]);
  });
});
