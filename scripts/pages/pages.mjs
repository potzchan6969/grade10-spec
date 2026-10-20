#!/usr/bin/env node
import { execFileSync } from "node:child_process";
/**
 * The product pages as the work list: what is being built, what is open,
 * which 🚧 line has a story, and the ids that prove each page.
 *
 *   pnpm pages:board [prefix] [--build|--open|--design|--work]
 *   pnpm pages:cases <prefix> [--cited <app-dir>] [--tsv]
 *   pnpm pages:check [--base <ref>]
 *   node scripts/pages/pages.mjs gate <app-dir> [--allow <file>] [--seed]
 *
 * A page is `docs/prds/products/<id>.md`. Its ids are the rules that end in
 * `{#id}`, its `:::example` and `:::flow` blocks that carry an `id`, and the
 * rows of `docs/cases/<id>.md`. An id is cited as `<page>#<id>`, for example
 * `grade10-site/loyalty/points#earn-once`, in a test's title.
 *
 * The manual's own readers parse the pages, so the board and the manual can
 * never read one page two ways.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BUILDING,
  marksOfPage,
  OPEN,
  openMarksOfPage,
} from "../../tools/manual/src/api/open-marks.ts";
import { parsePage } from "../../tools/manual/src/content/grammar.ts";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
export const PAGES = "docs/prds/products";
export const CASES = "docs/cases";
export const OPEN_WORK = "Open work";
export const ALWAYS = "Always";
export const AGENTS_LIMIT = 150;
/** Retired OpenSpec ids and changes, and the pages that now hold them. */
export const RETIRED = "openspec/retired.tsv";
export const RETIRED_CHANGES = "openspec/retired-changes.tsv";
const CHANGES = "openspec/changes";
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** A rule's explicit id, as `tools/manual/src/content/rule-ids.ts` hides it. */
const RULE_ID = /\{#([^}\s]*)\}/g;
const HAS_RULE_ID = /\{#[^}\s]*\}/;
const REF = /\b([a-z0-9-]+(?:\/[a-z0-9-]+)+)#([a-z0-9]+(?:-[a-z0-9]+)*)\b/g;
/** A line that opens a test: its title is where a test cites an id. */
const TEST_CALL =
  /\b(?:it|test|describe)(?:\.(?:only|describe|each\([^)]*\)))?\s*\(/;
const SKIPPED =
  /\b(?:x(?:it|test|describe)|(?:it|test|describe)\.(?:skip|todo|fixme))\b/;
const TEST_FILE =
  /(?:\.(?:test|spec|e2e)\.[cm]?[jt]sx?$)|(?:\/(?:__tests__|e2e)\/.+\.[cm]?[jt]sx?$)/;
const SKIP = new Set(["node_modules", ".git", "dist", "build", ".turbo"]);

function walk(dir, ext, out = [], top = dir) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      // a submodule - this repository inside the application - is not its tests
      if (path !== top && existsSync(join(path, ".git"))) continue;
      walk(path, ext, out, top);
    } else if (ext.some((one) => name.endsWith(one))) out.push(path);
  }
  return out;
}

/** `grade10-site/loyalty/points` for its page or its cases file. */
export function pageId(base, path) {
  return relative(base, path)
    .replace(/\\/g, "/")
    .replace(/\.md$/, "")
    .replace(/\/index$/, "");
}

/** The `## ` heading each top-level block sits under. */
function sectioned(blocks) {
  let section = "";
  const out = [];
  for (const block of blocks) {
    if (block.type === "prose") {
      for (const line of block.markdown.split("\n")) {
        const heading = line.match(/^##\s+(.+?)\s*$/);
        if (heading) section = heading[1];
      }
    }
    out.push({ block, section });
  }
  return out;
}

/** The unticked `- [ ]` items of a page's `Open work` detail: the blocked
 * or human work a 🚧 line still waits on - an enrolment, a credential, a
 * staging walk - that no test or code change closes. */
export function openWork(ast) {
  const items = [];
  for (const block of ast.blocks) {
    if (block.type !== "detail" || block.title !== OPEN_WORK) continue;
    for (const item of block.body) {
      if (item.type !== "prose") continue;
      for (const line of item.markdown.split("\n")) {
        const open = line.match(/^\s*[-*] \[ \] (.+)$/);
        if (open) items.push({ text: open[1], where: { title: OPEN_WORK } });
      }
    }
  }
  return items;
}

/** The rules of a page that end in `{#id}`: the id, the section, the line's
 * text without it, and whether the line is 🚧 or ❓. */
export function ruleIds(page) {
  const rules = [];
  for (const mark of marksOfPage(page, HAS_RULE_ID)) {
    const text = mark.text.replace(RULE_ID, "").replace(/\s+/g, " ").trim();
    for (const [, id] of mark.text.matchAll(RULE_ID)) {
      rules.push({
        id,
        section: mark.where?.title ?? "",
        text,
        building: BUILDING.test(mark.text),
        open: OPEN.test(mark.text) || /^❓|\bTBC\b/.test(text),
      });
    }
  }
  return rules;
}

/** The `## ` sections of a page that cite a `::story` or `::figma`. */
function storied(ast) {
  const found = new Set();
  for (const { block, section } of sectioned(ast.blocks)) {
    const inside = (one) =>
      one.type === "story" ||
      one.type === "figma" ||
      ("body" in one && one.body.some(inside));
    if (inside(block)) found.add(section);
  }
  return found;
}

/** One cases file: its sign-off and its rows, each with the line it sits on. */
export function parseCases(text) {
  const lines = text.split("\n");
  const reviewed = text.match(/^reviewed:\s*(.+)$/m)?.[1]?.trim() ?? null;
  const rows = [];
  const errors = [];
  let section = "";
  let columns = null;
  lines.forEach((line, at) => {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      section = heading[1];
      columns = null;
      return;
    }
    if (!/^\s*\|/.test(line)) {
      columns = null;
      return;
    }
    const cells = line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim());
    if (!columns) {
      columns = cells.map((cell) => cell.toLowerCase());
      if (!columns.includes("id")) {
        errors.push({
          line: at + 1,
          text: "a cases table needs an `Id` column",
        });
      }
      return;
    }
    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) return;
    const row = Object.fromEntries(
      columns.map((name, i) => [name, cells[i] ?? ""]),
    );
    rows.push({
      id: row.id.replace(/`/g, ""),
      section,
      given: row.given ?? "",
      when: row.when ?? "",
      expect: row.then ?? "",
      tags: (row.tags ?? "").split(/[,\s]+/).filter(Boolean),
      line: at + 1,
    });
  });
  return { reviewed, rows, errors };
}

/** Every product page with its marks and its cases. */
export function readPages(root = ROOT) {
  const base = join(root, PAGES);
  const casesBase = join(root, CASES);
  const pages = [];
  const problems = [];
  for (const path of walk(base, [".md"])) {
    const rel = relative(root, path);
    const id = pageId(base, path);
    let ast;
    try {
      ast = parsePage(readFileSync(path, "utf8"));
    } catch {
      continue; // `pnpm check:manual` names a page that does not parse
    }
    const page = { path: rel, ast };
    const rules = ruleIds(page);
    const cases = rules.map((rule) => ({
      id: rule.id,
      section: rule.section,
      given: "",
      when: "",
      expect: rule.text,
      tags: rule.building ? ["building"] : [],
      source: "rule",
    }));
    for (const { block, section } of sectioned(ast.blocks)) {
      if (block.type !== "example" && block.type !== "flow") continue;
      if (block.id === undefined) continue;
      cases.push({
        id: block.id,
        section,
        given: block.tier ? `${block.tier} member` : "",
        when: block.case ? `${block.title} - ${block.case}` : block.title,
        expect: `the ${block.type} on the page`,
        tags: [],
        source: block.type,
      });
    }
    const unnamed = ast.blocks.filter(
      (block) => block.type === "example" && block.id === undefined,
    ).length;
    const casesPath = join(casesBase, `${id}.md`);
    const indexCases = join(casesBase, id, "index.md");
    const file = existsSync(casesPath)
      ? casesPath
      : existsSync(indexCases)
        ? indexCases
        : null;
    let reviewed = null;
    if (file) {
      const parsed = parseCases(readFileSync(file, "utf8"));
      reviewed = parsed.reviewed;
      for (const error of parsed.errors) {
        problems.push(`${relative(root, file)}:${error.line} ${error.text}`);
      }
      for (const row of parsed.rows) {
        cases.push({ ...row, source: "cases", file: relative(root, file) });
      }
    }
    const stories = storied(ast);
    const building = marksOfPage(page, BUILDING);
    pages.push({
      id,
      path: rel,
      title: ast.frontmatter.title ?? id,
      building,
      open: openMarksOfPage(page),
      design: building.map((mark) => ({
        ...mark,
        text: `${stories.has(mark.where?.title ?? "") ? "story" : "none"} · ${mark.text}`,
      })),
      rules,
      work: openWork(ast),
      cases,
      unnamed,
      casesFile: file ? relative(root, file) : null,
      reviewed,
    });
  }
  return { pages, problems };
}

/** The rule ids of every page as a ref ever was at `base`, read from git. */
/** A tab-separated file as rows keyed by its header; none when absent. */
function readTsv(path) {
  if (!existsSync(path)) return [];
  const [head, ...lines] = readFileSync(path, "utf8").trimEnd().split("\n");
  const keys = head.split("\t");
  return lines
    .filter((line) => line.trim())
    .map((line, at) => {
      const cells = line.split("\t");
      return {
        line: at + 2,
        ...Object.fromEntries(keys.map((key, i) => [key, cells[i] ?? ""])),
      };
    });
}

/** Each page a still-open OpenSpec change names in its proposal, with the
 * changes naming it: its 🚧 lines may be that change's work. */
export function openChanges(root = ROOT) {
  const byPage = new Map();
  const dir = join(root, CHANGES);
  if (!existsSync(dir)) return byPage;
  for (const change of readdirSync(dir)) {
    const proposal = join(dir, change, "proposal.md");
    if (change === "archive" || !existsSync(proposal)) continue;
    const text = readFileSync(proposal, "utf8");
    const named = new Set(
      [
        ...text.matchAll(/products\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\.md/g),
        ...text.matchAll(/\/p\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)/g),
      ].map(([, id]) => id.replace(/\/index$/, "")),
    );
    for (const id of named) byPage.set(id, [...(byPage.get(id) ?? []), change]);
  }
  return byPage;
}

function rulesAt(root, base) {
  let listed;
  try {
    listed = execFileSync(
      "git",
      ["ls-tree", "-r", "--name-only", base, PAGES],
      {
        cwd: root,
        encoding: "utf8",
      },
    );
  } catch {
    return null;
  }
  const out = new Map();
  for (const path of listed.split("\n").filter((one) => one.endsWith(".md"))) {
    try {
      const text = execFileSync("git", ["show", `${base}:${path}`], {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 1 << 26,
      });
      const ast = parsePage(text);
      out.set(pageId(PAGES, path), ruleIds({ path, ast }));
    } catch {
      // a page that did not parse at the base has no ids to keep
    }
  }
  return out;
}

/** FAIL: an id that is not kebab-case or is used twice on one page, a cases
 * file with no page, a row with no expected outcome. WARN: a page with a
 * cases file that still has examples without an id; given a `base`, a rule
 * id the base had and the page no longer holds, and an unmarked rule whose
 * promise changed under the same id. FAIL: `AGENTS.md` past its limit. */
export function check(root = ROOT, { base } = {}) {
  const { pages, problems } = readPages(root);
  const failures = [...problems];
  const warnings = [];
  const known = new Set(pages.map((page) => page.id));
  for (const page of pages) {
    const seen = new Set();
    for (const one of page.cases) {
      const where = one.file ? `${one.file}:${one.line}` : page.path;
      if (!ID.test(one.id)) {
        failures.push(`${where} id \`${one.id}\` is not kebab-case`);
      }
      if (seen.has(one.id)) {
        failures.push(`${where} id \`${one.id}\` is used twice on ${page.id}`);
      }
      seen.add(one.id);
      if (one.source === "cases" && !one.expect) {
        failures.push(`${where} case \`${one.id}\` has no Then`);
      }
    }
    if (page.casesFile && page.unnamed > 0) {
      warnings.push(
        `${page.path} has a cases file and ${page.unnamed} example(s) without an id`,
      );
    }
  }
  for (const file of walk(join(root, CASES), [".md"])) {
    const id = pageId(join(root, CASES), file);
    if (!known.has(id) && relative(join(root, CASES), file) !== "README.md") {
      failures.push(`${relative(root, file)} names no page: ${PAGES}/${id}.md`);
    }
  }
  const agents = join(root, "AGENTS.md");
  if (existsSync(agents)) {
    const lines = readFileSync(agents, "utf8").trimEnd().split("\n").length;
    if (lines > AGENTS_LIMIT) {
      failures.push(
        `AGENTS.md is ${lines} lines, over ${AGENTS_LIMIT} - it is a map; a new rule becomes a check or replaces one`,
      );
    }
  }
  const holds = new Map(
    pages.map((page) => [page.id, new Set(page.cases.map((one) => one.id))]),
  );
  for (const row of readTsv(join(root, RETIRED))) {
    if (row.now.startsWith("dropped:")) continue;
    for (const ref of row.now.split(/\s+/).filter(Boolean)) {
      const [id, one] = ref.split("#");
      if (!holds.get(id)?.has(one)) {
        failures.push(
          `${RETIRED}:${row.line} ${row.id} names ${ref}, which no page holds`,
        );
      }
    }
  }
  for (const row of readTsv(join(root, RETIRED_CHANGES))) {
    for (const id of row.pages.split(/\s+/).filter(Boolean)) {
      if (!known.has(id)) {
        failures.push(
          `${RETIRED_CHANGES}:${row.line} ${row.change} names no page ${id}`,
        );
      }
    }
  }
  const before = base ? rulesAt(root, base) : null;
  if (before) {
    const now = new Map(pages.map((page) => [page.id, page]));
    for (const [id, rules] of before) {
      const page = now.get(id);
      const held = new Map((page?.rules ?? []).map((rule) => [rule.id, rule]));
      const ids = new Set(page?.cases.map((one) => one.id) ?? []);
      for (const rule of rules) {
        const ref = `${id}#${rule.id}`;
        if (!ids.has(rule.id)) {
          warnings.push(
            `${ref} vanished since ${base} - a test citing it will fail the application's gate`,
          );
          continue;
        }
        const after = held.get(rule.id);
        const live = !rule.building && !rule.open;
        if (after && live && after.text !== rule.text) {
          warnings.push(
            `${ref} is live and its text changed since ${base} - a new promise takes a new id; a copy fix keeps it`,
          );
        }
      }
    }
  }
  return { failures, warnings };
}

/** Every `<page>#<id>` a test title in an application cites, with where:
 * test files only, never a skipped test, never this repository as its
 * submodule. */
export function citedRefs(dir) {
  const refs = new Map();
  for (const file of walk(dir, [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
  ])) {
    const rel = relative(dir, file).replace(/\\/g, "/");
    if (!TEST_FILE.test(`/${rel}`)) continue;
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, at) => {
        if (!TEST_CALL.test(line) || SKIPPED.test(line)) return;
        for (const match of line.matchAll(REF)) {
          const ref = `${match[1]}#${match[2]}`;
          refs.set(ref, [...(refs.get(ref) ?? []), `${rel}:${at + 1}`]);
        }
      });
  }
  return refs;
}

/** The application's CI over its pinned submodule. FAIL: a test citing an
 * id no page holds on a page that exists or under a product this
 * repository names; an `## Always` id no running test cites, unless the
 * allowlist names it; an allowlist entry that is now cited or names no id,
 * so the list only shrinks. */
export function gate(pages, cited, allowed = []) {
  const failures = [];
  const byId = new Map(pages.map((page) => [page.id, page]));
  const products = new Set(pages.map((page) => page.id.split("/")[0]));
  for (const [ref, where] of cited) {
    const [id, one] = ref.split("#");
    const page = byId.get(id);
    if (
      page
        ? page.cases.some((c) => c.id === one)
        : !products.has(id.split("/")[0])
    ) {
      continue;
    }
    failures.push(`${where[0]} cites ${ref}, which no page holds`);
  }
  const allow = new Set(allowed);
  const always = new Set();
  for (const page of pages) {
    for (const rule of page.rules) {
      if (rule.section !== ALWAYS) continue;
      const ref = `${page.id}#${rule.id}`;
      always.add(ref);
      if (!cited.has(ref) && !allow.has(ref)) {
        failures.push(
          `${page.path} ${ref} is an Always rule no running test cites`,
        );
      }
    }
  }
  for (const ref of allow) {
    if (cited.has(ref))
      failures.push(`allowlist: ${ref} is cited now - delete the line`);
    else if (!always.has(ref))
      failures.push(`allowlist: ${ref} names no Always rule - delete the line`);
  }
  return failures;
}

const short = (text, max = 110) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;
const flat = (text) => text.replace(/\s*\n\s*/g, " ");
/** A line as the board prints it: its ids first, as `#id`. */
const shown = (text) => {
  const ids = [...text.matchAll(RULE_ID)].map(([, id]) => `#${id}`);
  const rest = text.replace(RULE_ID, "").trim();
  return ids.length ? `${ids.join(" ")} ${rest}` : rest;
};

function board(pages, mode, changes = new Map()) {
  const kinds = {
    build: [["🚧", "building"]],
    open: [["❓", "open"]],
    design: [["🚧", "design"]],
    work: [["☐", "work"]],
  }[mode] ?? [
    ["🚧", "building"],
    ["❓", "open"],
    ["☐", "work"],
  ];
  const totals = { building: 0, open: 0, design: 0, work: 0, cases: 0 };
  const out = [];
  for (const page of pages) {
    const lines = [];
    for (const [, key] of kinds) {
      for (const mark of page[key]) {
        totals[key] += 1;
        const where = mark.where ? `${mark.where.title} - ` : "";
        lines.push(`- ${where}${short(shown(flat(mark.text)))}`);
      }
    }
    totals.cases += page.cases.length;
    if (lines.length === 0) continue;
    const cases = page.cases.length
      ? ` · ${page.cases.length} cases${page.reviewed ? `, reviewed ${page.reviewed}` : ""}`
      : "";
    const open = changes.get(page.id);
    const owned = open
      ? `\nOpen OpenSpec change: ${open.join(", ")} - its 🚧 lines may be that change's; run its legacy round, not page-build`
      : "";
    out.push(`\n## ${page.id}${cases}\n${page.path}${owned}\n`, ...lines);
  }
  const summary = kinds
    .map(([mark, key]) => `${mark} ${totals[key]}`)
    .join(" · ");
  return `${summary} · ${totals.cases} cases${out.join("\n")}\n`;
}

function casesTable(pages, cited, tsv) {
  const head = ["Case", "Section", "Given", "When", "Then", "Tags"];
  if (cited) head.push("Automated");
  const rows = [];
  for (const page of pages) {
    for (const one of page.cases) {
      const ref = `${page.id}#${one.id}`;
      const row = [
        ref,
        one.section,
        one.given,
        one.when,
        one.expect,
        one.tags.join(" "),
      ];
      if (cited) row.push(cited.has(ref) ? "yes" : "no");
      rows.push(row.map(flat));
    }
  }
  if (tsv) return [head, ...rows].map((row) => row.join("\t")).join("\n");
  const line = (row) =>
    `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`;
  return [line(head), line(head.map(() => "---")), ...rows.map(line)].join(
    "\n",
  );
}

/** The ref a push lands on, when this checkout knows it. */
function defaultBase() {
  try {
    execFileSync("git", ["rev-parse", "--verify", "--quiet", "origin/main"], {
      cwd: ROOT,
      stdio: "ignore",
    });
    return "origin/main";
  } catch {
    return undefined;
  }
}

function main(argv) {
  const [command, ...rest] = argv;
  const flags = new Set(rest.filter((arg) => arg.startsWith("--")));
  const at = rest.indexOf("--cited");
  const citedDir = at >= 0 ? rest[at + 1] : null;
  const prefix = rest.find(
    (arg, i) =>
      !arg.startsWith("--") &&
      !["--cited", "--base", "--allow"].includes(rest[i - 1]),
  );
  const select = (pages) =>
    prefix ? pages.filter((page) => page.id.startsWith(prefix)) : pages;

  if (command === "check") {
    const at = rest.indexOf("--base");
    const base = at >= 0 ? rest[at + 1] : defaultBase();
    const { failures, warnings } = check(ROOT, { base });
    for (const warning of warnings) console.error(`WARN ${warning}`);
    for (const failure of failures) console.error(`FAIL ${failure}`);
    console.error(
      `pages:check: ${failures.length} failure(s), ${warnings.length} warning(s)`,
    );
    return failures.length ? 1 : 0;
  }
  const { pages } = readPages();
  if (command === "board") {
    const mode = ["build", "open", "design", "work"].find((one) =>
      flags.has(`--${one}`),
    );
    process.stdout.write(board(select(pages), mode, openChanges()));
    return 0;
  }
  if (command === "cases") {
    if (!prefix) {
      console.error(
        "pages:cases needs a page or a prefix, e.g. grade10-site/loyalty/points",
      );
      return 2;
    }
    const cited = citedDir ? citedRefs(citedDir) : null;
    if (cited) {
      for (const failure of gate(pages, cited)) {
        if (failure.endsWith("which no page holds"))
          console.error(`WARN ${failure}`);
      }
    }
    process.stdout.write(
      `${casesTable(select(pages), cited, flags.has("--tsv"))}\n`,
    );
    return 0;
  }
  if (command === "gate") {
    if (!prefix) {
      console.error("pages.mjs gate needs the application's directory");
      return 2;
    }
    const allowAt = rest.indexOf("--allow");
    const allowed =
      allowAt >= 0
        ? readFileSync(rest[allowAt + 1], "utf8")
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith("//"))
        : [];
    const cited = citedRefs(prefix);
    if (flags.has("--seed")) {
      // The first allowlist: every Always id no running test cites today.
      const seed = pages.flatMap((page) =>
        page.rules
          .filter((rule) => rule.section === ALWAYS)
          .map((rule) => `${page.id}#${rule.id}`)
          .filter((ref) => !cited.has(ref)),
      );
      process.stdout.write(`${seed.join("\n")}\n`);
      return 0;
    }
    const failures = gate(pages, cited, allowed);
    for (const failure of failures) console.error(`FAIL ${failure}`);
    console.error(`pages:gate: ${failures.length} failure(s)`);
    return failures.length ? 1 : 0;
  }
  console.error(
    "usage: pages.mjs board|cases|check|gate — see the file's head",
  );
  return 2;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
