import type { PageAst } from "../content/grammar.ts";
import {
  outlineOf,
  type PageForUnits,
  type Phase,
  phasesOf,
  type Unit,
  unitsOf,
} from "./phases.ts";
import type { UnitCase } from "./readiness.ts";
import { readSuite, type TestCase } from "./suites.ts";
import type { CaseSummary, SuiteEntry } from "./types.ts";

/**
 * Every page read into its units, and each unit's cases: store sections by
 * the rules their cases trace, capabilities by their suite. The manual reads
 * it from the snapshot; the run sheet and the release command read it from
 * the files, through the same function.
 */
export type ReleaseReading = {
  phases: Phase[];
  pages: Map<string, PageForUnits>;
  units: Unit[];
  casesOf(unit: Unit): UnitCase[];
  /** The store's own cases, by id. */
  storeCases: Map<string, TestCase>;
};

export type PageInput = { path: string; ast: PageAst | null };

/** The directory a suite's cases trace pages in: one level up from `tests/`. */
function pagesDirOf(suitePath: string): string {
  const dir = suitePath.slice(0, suitePath.lastIndexOf("/"));
  return dir.endsWith("/tests") ? dir.slice(0, -"/tests".length) : dir;
}

const dirOf = (path: string) => path.slice(0, path.lastIndexOf("/"));

export function readRelease({
  phases,
  pages,
  suites,
  capabilityCases,
}: {
  phases: Phase[];
  pages: PageInput[];
  suites: SuiteEntry[];
  capabilityCases?: Record<string, CaseSummary[]>;
}): ReleaseReading {
  const tracedDirs = new Set(suites.map((suite) => pagesDirOf(suite.path)));
  const read = new Map<string, PageForUnits>();
  for (const page of pages) {
    if (!page.ast) continue;
    const outline = outlineOf(page.ast);
    read.set(page.path, {
      path: page.path,
      title: page.ast.frontmatter.title,
      ...(page.ast.frontmatter.spec ? { spec: page.ast.frontmatter.spec } : {}),
      outline,
      phases: phasesOf(outline),
      traced: tracedDirs.has(dirOf(page.path)),
    });
  }
  const units = unitsOf([...read.values()]);

  const storeCases = new Map<string, TestCase>();
  for (const suite of suites) {
    for (const one of readSuite(suite)) {
      if (one.status !== "deprecated") storeCases.set(one.id, one);
    }
  }

  /** A store case's place in each unit it traces. */
  const bySectionUnit = new Map<string, UnitCase[]>();
  for (const one of storeCases.values()) {
    const placed = new Map<string, Set<string>>();
    for (const trace of one.traces) {
      const page = read.get(trace.page);
      if (!page || !trace.section) continue;
      const heading = page.outline.headings.find(
        (found) => found.trace === trace.section,
      );
      if (!heading) continue;
      const assignment = page.phases.traced(trace.section, trace.rule);
      if (!assignment) continue;
      const key = `${page.path}#${heading.section}@${assignment.phase}`;
      const rules = placed.get(key) ?? new Set<string>();
      if (trace.rule) rules.add(trace.rule);
      placed.set(key, rules);
    }
    for (const [key, rules] of placed) {
      const listed = bySectionUnit.get(key) ?? [];
      listed.push({
        id: one.id,
        title: one.title,
        ...(one.marker ? { marker: one.marker, rev: one.rev } : {}),
        ...(one.status ? { status: one.status } : {}),
        rules: [...rules],
      });
      bySectionUnit.set(key, listed);
    }
  }

  return {
    phases,
    pages: read,
    units,
    storeCases,
    casesOf: (unit) => {
      if (unit.kind === "section") return bySectionUnit.get(unit.key) ?? [];
      if (!unit.spec) return [];
      return (capabilityCases?.[unit.spec] ?? []).map((one) => ({
        id: one.id,
        ...(one.marker ? { marker: one.marker, rev: one.rev } : {}),
        ...(one.status ? { status: one.status } : {}),
        rules: [],
      }));
    },
  };
}
