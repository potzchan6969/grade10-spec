import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
// @ts-expect-error - the checker is a plain-JS CLI at the store root.
import { formatReport, runChecks } from "../../../scripts/check-manual.mjs";
import type { CommitInfo } from "../src/api/types.ts";
import { NO_GIT } from "../src/store/git.mts";

type Finding = { rule: string; level: string; path: string; reason: string };
type Result = { findings: Finding[]; notes: string[] };

const fixture = (name: string) =>
  fileURLToPath(new URL(`./fixtures/check/${name}`, import.meta.url));

const lines = (result: Result, rule: string) =>
  result.findings
    .filter((one) => one.rule === rule)
    .map((one) => `${one.path} — ${one.reason}`)
    .sort();

/** Commit dates the fixture's own history cannot supply: every spec moves
 * after every page. */
const SPECS_AHEAD = {
  head: "0".repeat(40),
  commitOf: (path: string): CommitInfo => ({
    sha: "0".repeat(40),
    date: path.endsWith("spec.md")
      ? "2026-02-01T00:00:00+00:00"
      : "2026-01-01T00:00:00+00:00",
  }),
};

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

  it("warns rather than fails on a link and an unshown journey", async () => {
    const warnings = (await result).findings.filter(
      (one) => one.level === "warn",
    );
    expect(warnings.map((one) => one.rule).sort()).toEqual([
      "figma",
      "journeys",
    ]);
  });

  it("exits 1 with the counts in the summary", async () => {
    const root = fixture("broken");
    const report = formatReport(root, await result);
    expect(report.failures).toBe(9);
    expect(report.warnings).toBe(2);
    expect(report.text).toContain("9 failures, 2 warnings");
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

describe("a page committed before the specs it embeds", () => {
  it("warns without failing", async () => {
    const result: Result = await runChecks(fixture("clean"), SPECS_AHEAD);
    expect(lines(result, "stale")).toEqual([
      "manual/platform/demo-topic.md — last committed 2026-01-01; demo-topic changed after it",
      "manual/products/demo-product/alpha.md — last committed 2026-01-01; demo-product/alpha changed after it",
    ]);
    expect(result.findings.every((one) => one.level === "warn")).toBe(true);
  });
});
