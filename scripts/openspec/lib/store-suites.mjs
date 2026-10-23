// The Grade10 store's test cases (tcs-rules r7). The store's sources of truth
// are its PRD pages and Storybook, so its cases live only in the PRD folder,
// one file per page, and trace PRD sections rather than openspec anchors.
// docs/governance/specs-to-test-cases.md, **Store**.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

export const STORE_PRD = join(
  "docs",
  "prds",
  "products",
  "grade10-site",
  "store",
);
export const STORE_TESTS = join(STORE_PRD, "tests");

/** A store suite under openspec - durable or in a change - which the rules
 *  refuse: the PRD folder is the only home. */
export const STORE_IN_OPENSPEC =
  /^openspec\/(?:specs|changes\/(?!archive\/)[^/]+\/specs)\/grade10-site\/store\//;

/** Every test file in the store's PRD folder. */
export function storeSuites(root) {
  const dir = join(root, STORE_TESTS);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith("-tcs.md"))
    .sort()
    .map((name) => join(dir, name));
}

/** A heading's anchor, the way the manual and GitHub write one. */
export function headingAnchor(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

/** The anchors of a PRD page's headings, or null when the page is missing. */
function pageAnchors(root, page, cache) {
  if (cache.has(page)) return cache.get(page);
  const file = join(root, STORE_PRD, `${page}.md`);
  const anchors = existsSync(file)
    ? new Set(
        readFileSync(file, "utf8")
          .split("\n")
          .map((line) => /^#{1,6}\s+(.*)$/.exec(line))
          .filter(Boolean)
          .map((m) => headingAnchor(m[1])),
      )
    : null;
  cache.set(page, anchors);
  return anchors;
}

const REQUIRED = [
  "Severity",
  "Priority",
  "Status",
  "Behaviour",
  "Type",
  "Suites",
  "Automation status",
  "Testability",
  "Trace",
];
const CASE_HEADING = /^#{3,4}\s+(\S+?):\s/;
const PROPERTY = /^[*-]\s+\*\*([\w ]+?):\*\*\s*(.*?)\s*$/;
const STATUS_LINE =
  /^\*\*Status:\*\*\s*([\w-]+)(?:\s*·\s*(\d+)\s*\/\s*(\d+))?\s*$/;

/** Check one store suite; `report(severity, line, message)`. */
export function checkStoreSuite(root, file, report, cache = new Map()) {
  const rel = relative(root, file);
  const lines = readFileSync(file, "utf8").split("\n");

  const capabilities = lines.find((l) => /^\*\*Capabilities:\*\*/.test(l));
  if (!capabilities)
    report(
      "error",
      1,
      "store suite carries no `**Capabilities:**` line — name every grade10-site/store capability this page's cases cover",
    );
  else
    for (const name of capabilities
      .replace(/^\*\*Capabilities:\*\*/, "")
      .split(",")
      .map((s) => s.trim().replace(/^`|`$/g, ""))
      .filter(Boolean)) {
      if (!existsSync(join(root, "openspec", "specs", name)))
        report(
          "error",
          lines.indexOf(capabilities) + 1,
          `\`**Capabilities:**\` names \`${name}\`, which no capability under openspec/specs holds`,
        );
    }

  const cases = [];
  let current = null;
  lines.forEach((line, i) => {
    const heading = CASE_HEADING.exec(line);
    if (heading && /-?TC-?\d+/.test(heading[1])) {
      current = { id: heading[1], line: i + 1, props: new Map() };
      cases.push(current);
      return;
    }
    if (/^#{2,4}\s/.test(line)) {
      current = null;
      return;
    }
    const prop = current && PROPERTY.exec(line);
    if (prop) current.props.set(prop[1], { value: prop[2], line: i + 1 });
  });

  const seen = new Set();
  for (const tc of cases) {
    if (seen.has(tc.id))
      report("error", tc.line, `case \`${tc.id}\` is defined twice`);
    seen.add(tc.id);
    for (const name of REQUIRED)
      if (!tc.props.has(name))
        report(
          "error",
          tc.line,
          `case \`${tc.id}\` is missing its **${name}** property`,
        );
    if (tc.props.has("Layer"))
      report(
        "error",
        tc.props.get("Layer").line,
        `case \`${tc.id}\` carries a **Layer:** line — every case is a GUI walk (tcs-rules r7)`,
      );
    const trace = tc.props.get("Trace");
    if (!trace) continue;
    for (const target of trace.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)) {
      const section = /^([a-z0-9-]+)#([\p{L}\p{N}-]+)$/u.exec(target);
      if (!section) {
        report(
          "warning",
          trace.line,
          `case \`${tc.id}\` traces \`${target}\`, an openspec anchor — a store case traces a PRD section, \`<page>#<heading-anchor>\``,
        );
        continue;
      }
      const anchors = pageAnchors(root, section[1], cache);
      if (anchors === null)
        report(
          "error",
          trace.line,
          `case \`${tc.id}\` traces \`${target}\`, but ${STORE_PRD}/${section[1]}.md does not exist`,
        );
      else if (!anchors.has(section[2]))
        report(
          "error",
          trace.line,
          `case \`${tc.id}\` traces \`${target}\`, but ${section[1]}.md has no heading with that anchor`,
        );
    }
  }

  const statusIndex = lines.findIndex((l) => /^\*\*Status:\*\*/.test(l));
  const status = statusIndex >= 0 ? STATUS_LINE.exec(lines[statusIndex]) : null;
  if (!status) {
    report("error", 1, "store suite carries no `**Status:**` line");
    return { rel, cases: cases.length };
  }
  const statusOf = (tc) => tc.props.get("Status")?.value;
  const active = cases.filter((tc) => statusOf(tc) !== "deprecated");
  const actual = active.filter((tc) => statusOf(tc) === "actual").length;
  if (
    status[2] !== undefined &&
    (Number(status[2]) !== actual || Number(status[3]) !== active.length)
  )
    report(
      "error",
      statusIndex + 1,
      `status says ${status[2]}/${status[3]}, but its cases are ${actual}/${active.length} actual/(total - deprecated)`,
    );
  return { rel, cases: cases.length };
}
