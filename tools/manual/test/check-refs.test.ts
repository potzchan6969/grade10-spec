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

const store = (pages: Record<string, string>) =>
  writeStore({
    "docs/prds/manual.yaml":
      "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
    "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
    "docs/prds/products/demo-product/index.md":
      "---\ntitle: Demo product\n---\n\nThe landing.\n",
    "docs/prds/products/demo-product/beta.md":
      "---\ntitle: Beta\nspec: demo-product/beta\n---\n\nBeta.\n",
    ...pages,
  });

const capability = (body: string) =>
  `---\ntitle: Alpha\nspec: demo-product/alpha\n---\n\n${body}\n`;

const alpha = (body: string) =>
  store({ "docs/prds/products/demo-product/alpha.md": capability(body) });

describe("a reference no page answers", () => {
  it("names the page, the reference as written, and why it failed", async () => {
    const result: Result = await runChecks(
      alpha("Alpha cites [[alpha-SC-99]]."),
      NO_GIT,
    );

    expect(refs(result)).toEqual([
      "docs/prds/products/demo-product/alpha.md — `[[alpha-SC-99]]`: no page documents `alpha-SC-99`",
    ]);
  });

  it("reads the prose inside a container, where a decision cites one", async () => {
    const result: Result = await runChecks(
      alpha(':::callout{kind="decision"}\nWe kept [[alpha-SC-99]].\n:::'),
      NO_GIT,
    );

    expect(refs(result)).toEqual([
      "docs/prds/products/demo-product/alpha.md — `[[alpha-SC-99]]`: no page documents `alpha-SC-99`",
    ]);
  });

  it("resolves a capability another page documents", async () => {
    const result: Result = await runChecks(
      alpha("Alpha leans on [[demo-product/beta]]."),
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
      "docs/prds/products/demo-product/alpha.md — `[[alpha-SC-99]]`: no page documents `alpha-SC-99`",
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
  it("carries no reference no page answers", () => {
    expect(refs(live)).toEqual([]);
  });
});
