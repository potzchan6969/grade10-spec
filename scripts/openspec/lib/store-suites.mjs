// The Grade10 store's test cases (tcs-rules r7). The store's sources of truth
// are its PRD pages and Storybook, so its cases live only in the PRD folder,
// one file per page, and trace PRD rules or sections rather than openspec
// anchors. A store case carries no review state.
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

const RULE = /^\s*[-*]\s+(?:(🚧|❓)\s*)?\*\*([^*]+?)\*\*/u;

/** A PRD page's sections, `anchor -> Map(rule anchor -> { name, open, line })`,
 *  or null when the page is missing. A rule is a bullet's bold name under a
 *  heading, at any depth, outside fenced code and `:::` blocks other than a
 *  callout; `open` marks a ❓ rule. */
export function pageSections(root, page, cache = new Map()) {
  if (cache.has(page)) return cache.get(page);
  const file = join(root, STORE_PRD, `${page}.md`);
  if (!existsSync(file)) {
    cache.set(page, null);
    return null;
  }
  const sections = new Map();
  let rules = null;
  let fenced = false;
  let block = 0;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/^```/.test(line)) fenced = !fenced;
      if (fenced) return;
      if (/^:::\w/.test(line)) {
        if (!/^:::callout\b/.test(line)) block += 1;
        return;
      }
      if (/^:::\s*$/.test(line)) {
        block = Math.max(0, block - 1);
        return;
      }
      const heading = /^#{1,6}\s+(.*)$/.exec(line);
      // A flow step's heading is an anchor too, but holds no rules.
      if (heading && block > 0) {
        sections.set(headingAnchor(heading[1]), new Map());
        return;
      }
      if (block > 0) return;
      if (heading) {
        rules = new Map();
        sections.set(headingAnchor(heading[1]), rules);
        return;
      }
      const rule = rules && RULE.exec(line);
      if (rule)
        rules.set(headingAnchor(rule[2]), {
          name: rule[2],
          open: rule[1] === "❓",
          line: i + 1,
        });
    });
  cache.set(page, sections);
  return sections;
}

const REQUIRED = [
  "Severity",
  "Priority",
  "Behaviour",
  "Type",
  "Suites",
  "Automation status",
  "Testability",
  "Trace",
];
const CASE_HEADING = /^#{3,4}\s+(\S+?):\s/;
const GROUP = /^#{2,3}\s+([a-z0-9-]+(?:#[\p{L}\p{N}-]+)?):\s/u;
const RETRACE =
  "if it was renamed, `pnpm tcs:retrace <old> <new>` moves every trace";

/** Whether a trace target sits inside `scope`: the page, or the section and
 *  its rules. */
export const within = (target, scope) =>
  target === scope ||
  target.startsWith(`${scope}${scope.includes("#") ? "/" : "#"}`);
const PROPERTY = /^[*-]\s+\*\*([\w ]+?):\*\*\s*(.*?)\s*$/;

/** Check one store suite; `report(severity, line, message)`. Each live case's
 *  resolved traces are added to `traced`, `page -> Set(target)`, for
 *  `checkRuleCoverage`. */
export function checkStoreSuite(
  root,
  file,
  report,
  cache = new Map(),
  traced = new Map(),
) {
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
  let group = null;
  lines.forEach((line, i) => {
    const heading = CASE_HEADING.exec(line);
    if (heading && /-?TC-?\d+/.test(heading[1])) {
      current = { id: heading[1], line: i + 1, props: new Map(), group };
      cases.push(current);
      return;
    }
    if (/^#{2,4}\s/.test(line)) {
      current = null;
      // `## <page>#<section>: Title` files the cases below it; any other
      // heading - a walk, the background, Ungrouped - files none.
      if (!/^####/.test(line)) group = GROUP.exec(line)?.[1] ?? null;
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
    if (tc.props.has("Status"))
      report(
        "warning",
        tc.props.get("Status").line,
        `case \`${tc.id}\` carries a **Status:** line — a store case carries no review state; a retired one carries **Retired:** <date> - <why>`,
      );
    if (tc.props.has("Layer"))
      report(
        "error",
        tc.props.get("Layer").line,
        `case \`${tc.id}\` carries a **Layer:** line — every case is a GUI walk (tcs-rules r7)`,
      );
    const trace = tc.props.get("Trace");
    if (!trace) continue;
    const targets = trace.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (tc.group && !targets.some((target) => within(target, tc.group)))
      report(
        "error",
        trace.line,
        `case \`${tc.id}\` sits under \`${tc.group}\` but traces ${targets.map((t) => `\`${t}\``).join(", ")} — move it under the heading of what it traces, or trace what it sits under`,
      );
    for (const target of targets) {
      // `<page>#<section>/<rule>`, `<page>#<section>`, or `<page>` alone for
      // the page's opening rules.
      const section =
        /^([a-z0-9-]+)(?:#([\p{L}\p{N}-]+)(?:\/([\p{L}\p{N}-]+))?)?$/u.exec(
          target,
        );
      if (!section) {
        report(
          "warning",
          trace.line,
          `case \`${tc.id}\` traces \`${target}\`, an openspec anchor — a store case traces a PRD rule, \`<page>#<section>/<rule>\`, a section, \`<page>#<section>\`, or \`<page>\` for its opening rules`,
        );
        continue;
      }
      const [, page, anchor, rule] = section;
      const sections = pageSections(root, page, cache);
      if (sections === null) {
        report(
          "error",
          trace.line,
          `case \`${tc.id}\` traces \`${target}\`, but ${STORE_PRD}/${page}.md does not exist — ${RETRACE}`,
        );
        continue;
      }
      if (anchor !== undefined && !sections.has(anchor)) {
        report(
          "error",
          trace.line,
          `case \`${tc.id}\` traces \`${target}\`, but ${page}.md has no heading with that anchor — ${RETRACE}`,
        );
        continue;
      }
      if (rule !== undefined && !sections.get(anchor).has(rule)) {
        report(
          "error",
          trace.line,
          `case \`${tc.id}\` traces \`${target}\`, but ${page}.md's \`${anchor}\` names no rule with that anchor — ${RETRACE}`,
        );
        continue;
      }
      if (tc.props.has("Retired")) continue;
      if (
        anchor !== undefined &&
        rule === undefined &&
        [...sections.get(anchor).values()].some(({ open }) => !open)
      )
        report(
          "warning",
          trace.line,
          `case \`${tc.id}\` traces the section \`${target}\`, which names rules — trace each rule it walks, the one it proves first`,
        );
      if (!traced.has(page)) traced.set(page, new Set());
      traced
        .get(page)
        .add(anchor === undefined ? "" : `${anchor}/${rule ?? ""}`);
    }
  }

  const statusIndex = lines.findIndex((l) => /^\*\*Status:\*\*/.test(l));
  if (statusIndex >= 0)
    report(
      "warning",
      statusIndex + 1,
      "store suite carries a `**Status:**` line — a store suite carries no review state; run results live in the run sheet",
    );
  return { rel, cases: cases.length };
}

/** Every named rule a live case does not trace, on a page that any case
 *  traces by a rule: a page is held to rule coverage once it is traced at
 *  that depth. A ❓ rule is not yet a rule and is skipped.
 *  `report(page, line, message)`. */
export function checkRuleCoverage(root, traced, report, cache = new Map()) {
  for (const [page, targets] of [...traced].sort()) {
    if (![...targets].some((t) => /\/./.test(t))) continue;
    const sections = pageSections(root, page, cache);
    if (!sections) continue;
    for (const [anchor, rules] of sections)
      for (const [rule, { name, open, line }] of rules)
        if (!open && !targets.has(`${anchor}/${rule}`))
          report(
            page,
            line,
            `rule **${name}** (\`${page}#${anchor}/${rule}\`) has no case — a live store case traces it`,
          );
  }
}
