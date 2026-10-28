import type { SuiteEntry } from "./types";

/** One test case as its suite writes it: what it traces, and the body a
 * tester walks — pre-conditions, data, steps and expected results. */
export type TestCase = {
  id: string;
  title: string;
  severity?: string;
  traces: CaseTrace[];
  body: string;
  /** The suite's path, for a link to the file. */
  suite: string;
};

/** `page#section/rule`: the page as a store path, and the section and the
 * rule as the anchors a heading and a bold name read as. */
export type CaseTrace = { page: string; section?: string; rule?: string };

/** The cases that trace one page: each section's by its heading's anchor,
 * and those tracing the page as a whole. */
export type PageCases = {
  bySection: Map<string, { testCase: TestCase; rules: string[] }[]>;
  page: TestCase[];
};

const CASE_HEADING = /^#{3,4}\s+(\S+\.TC\d+):\s*(.+?)\s*$/;
const CASE_END = /^(#{2,4}\s|<!--\s*trace:case)/;
const PROPERTY = /^\s*[-*]\s+\*\*([^*]+?):\*\*\s*(.*)$/;
const TRACE = /^([a-z0-9-]+)(?:#([a-z0-9-]+)(?:\/([a-z0-9-]+))?)?$/;
const CLASSIFICATION = /^\*\*Classification:\*\*\s*$/;

/** A suite under `tests/` traces the pages one level up, beside it otherwise. */
function pagesDirOf(suitePath: string): string {
  const dir = suitePath.slice(0, suitePath.lastIndexOf("/"));
  return dir.endsWith("/tests") ? dir.slice(0, -"/tests".length) : dir;
}

/** The body a tester reads: the case without its classification list. */
function bodyOf(lines: string[]): string {
  const out: string[] = [];
  let skipping = false;
  for (const line of lines) {
    if (CLASSIFICATION.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (line.trim() === "" || PROPERTY.test(line)) continue;
      skipping = false;
    }
    out.push(line);
  }
  return out.join("\n").trim();
}

/** Every live case in one suite. A retired case is history, not a check. */
export function readSuite(suite: SuiteEntry): TestCase[] {
  const base = pagesDirOf(suite.path);
  const lines = suite.source.split("\n");
  const cases: TestCase[] = [];

  for (let at = 0; at < lines.length; at += 1) {
    const heading = CASE_HEADING.exec(lines[at]);
    if (!heading) continue;
    let end = at + 1;
    while (end < lines.length && !CASE_END.test(lines[end])) end += 1;
    const body = lines.slice(at + 1, end);
    const properties = new Map<string, string>();
    for (const line of body) {
      const property = PROPERTY.exec(line);
      if (property) properties.set(property[1], property[2].trim());
    }
    at = end - 1;
    if (properties.has("Retired")) continue;

    const traces: CaseTrace[] = [];
    for (const target of (properties.get("Trace") ?? "").split(",")) {
      const trace = TRACE.exec(target.trim());
      if (!trace) continue;
      traces.push({
        page: `${base}/${trace[1]}.md`,
        ...(trace[2] ? { section: trace[2] } : {}),
        ...(trace[3] ? { rule: trace[3] } : {}),
      });
    }
    cases.push({
      id: heading[1],
      title: heading[2],
      ...(properties.has("Severity")
        ? { severity: properties.get("Severity") }
        : {}),
      traces,
      body: bodyOf(body),
      suite: suite.path,
    });
  }
  return cases;
}

/** The cases that trace one page, grouped as the page's sections are. */
export function casesOfPage(suites: SuiteEntry[], pagePath: string): PageCases {
  const bySection: PageCases["bySection"] = new Map();
  const page: TestCase[] = [];
  for (const suite of suites) {
    for (const testCase of readSuite(suite)) {
      const sections = new Map<string, string[]>();
      let wholePage = false;
      for (const trace of testCase.traces) {
        if (trace.page !== pagePath) continue;
        if (!trace.section) {
          wholePage = true;
          continue;
        }
        const rules = sections.get(trace.section) ?? [];
        if (trace.rule) rules.push(trace.rule);
        sections.set(trace.section, rules);
      }
      for (const [section, rules] of sections) {
        const listed = bySection.get(section) ?? [];
        listed.push({ testCase, rules });
        bySection.set(section, listed);
      }
      if (wholePage && sections.size === 0) page.push(testCase);
    }
  }
  return { bySection, page };
}
