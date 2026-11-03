#!/usr/bin/env node
/**
 * Move every store case's trace when a PRD page, section or rule is renamed:
 * the `**Trace:**` targets inside `<old>` and the suite headings that file
 * cases under it. A section's rules move with it. A rule renamed on its page
 * also moves the `::phase` blocks that name it, under its section or before
 * the page's first heading; a block under a heading follows a renamed
 * section on its own.
 *
 *   pnpm tcs:retrace product-listing#links product-listing#links-and-back-button
 *   pnpm tcs:retrace cart#points/earning cart#points/points-earned
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  headingAnchor,
  pageSections,
  STORE_PRD,
  storeSuites,
  within,
} from "./lib/store-suites.mjs";

const TARGET = /^[a-z0-9-]+(?:#[\p{L}\p{N}-]+(?:\/[\p{L}\p{N}-]+)?)?$/u;
const TRACE_LINE = /^(\s*[*-]\s+\*\*Trace:\*\*\s*)(.*)$/;
const GROUP_LINE = /^(#{2,3}\s+)([a-z0-9-]+(?:#[\p{L}\p{N}-]+)?)(:\s.*)$/u;

const moved = (target, from, to) =>
  within(target, from) ? to + target.slice(from.length) : target;

/** One suite's text with `from` retraced to `to`, and how many lines moved. */
export function retrace(text, from, to) {
  let lines = 0;
  const out = text.split("\n").map((line) => {
    const trace = TRACE_LINE.exec(line);
    const group = !trace && GROUP_LINE.exec(line);
    const next = trace
      ? trace[1] +
        trace[2]
          .split(",")
          .map((target) => moved(target.trim(), from, to))
          .join(", ")
      : group
        ? group[1] + moved(group[2], from, to) + group[3]
        : line;
    if (next !== line) lines += 1;
    return next;
  });
  return { text: out.join("\n"), lines };
}

const PHASE_LINE = /^(::phase\{.*\brules=")([^"]*)(".*)$/;

/** A page's text with the rule `from` renamed `to` in the `::phase` blocks
 * under the section `section`, or before the page's first heading, and how
 * many block lines moved. Fences and containers hold no placed block. */
export function retraceBlocks(text, section, from, to) {
  let lines = 0;
  let current = "";
  let fence = null;
  let depth = 0;
  const out = text.split("\n").map((line) => {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      return line;
    }
    const opened = /^(`{3,}|~{3,})/.exec(line);
    if (opened) {
      fence = opened[1];
      return line;
    }
    if (/^:::\s*$/.test(line)) depth = 0;
    else if (/^:::[a-z]/.test(line)) depth = 1;
    if (depth > 0) return line;
    const heading = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) current = headingAnchor(heading[1]);
    const block = PHASE_LINE.exec(line);
    if (!block || (current !== "" && current !== section)) return line;
    const rules = block[2].split(",");
    if (!rules.includes(from)) return line;
    lines += 1;
    return `${block[1]}${rules.map((rule) => (rule === from ? to : rule)).join(",")}${block[3]}`;
  });
  return { text: out.join("\n"), lines };
}

/** Where `target` fails to resolve on the pages as they now stand, or null. */
function unresolved(root, target) {
  const [page, rest] = target.split("#");
  const sections = pageSections(root, page);
  if (!sections) return `the page ${page}.md does not exist`;
  if (rest === undefined) return null;
  const [anchor, rule] = rest.split("/");
  if (!sections.has(anchor)) return `${page}.md has no heading \`${anchor}\``;
  if (rule !== undefined && !sections.get(anchor).has(rule))
    return `${page}.md's \`${anchor}\` names no rule \`${rule}\``;
  return null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [from, to] = process.argv.slice(2);
  const shape = (one) => one && TARGET.test(one);
  const depth = (one) => one.split(/[#/]/).length;
  if (!shape(from) || !shape(to) || depth(from) !== depth(to)) {
    console.error(
      "usage: pnpm tcs:retrace <old> <new> — both a page, both `<page>#<section>`, or both `<page>#<section>/<rule>`",
    );
    process.exit(2);
  }
  const root = process.cwd();
  const missing = unresolved(root, to);
  if (missing) {
    console.error(
      `\`${to}\` does not resolve: ${missing} — rename it on the page first`,
    );
    process.exit(1);
  }
  let total = 0;
  for (const file of storeSuites(root)) {
    const { text, lines } = retrace(readFileSync(file, "utf8"), from, to);
    if (lines === 0) continue;
    writeFileSync(file, text);
    total += lines;
    console.log(
      `${relative(root, file)}: ${lines} line${lines === 1 ? "" : "s"}`,
    );
  }
  const [fromPage, fromRest = ""] = from.split("#");
  const [toPage, toRest = ""] = to.split("#");
  const fromRule = fromRest.split("/")[1];
  const [toSection, toRule] = toRest.split("/");
  if (toRule !== undefined && fromRule !== toRule) {
    if (fromPage === toPage) {
      const file = join(root, STORE_PRD, `${toPage}.md`);
      const { text, lines } = retraceBlocks(
        readFileSync(file, "utf8"),
        toSection,
        fromRule,
        toRule,
      );
      if (lines > 0) {
        writeFileSync(file, text);
        total += lines;
        console.log(
          `${relative(root, file)}: ${lines} phase block${lines === 1 ? "" : "s"}`,
        );
      }
    } else {
      console.log(
        `a phase block on ${fromPage}.md naming \`${fromRule}\` stays: the rule left the page, so place its phase on ${toPage}.md by hand`,
      );
    }
  }
  console.log(
    total === 0
      ? `nothing traces \`${from}\``
      : `moved ${total} line${total === 1 ? "" : "s"} from \`${from}\` to \`${to}\``,
  );
}
