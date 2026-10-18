#!/usr/bin/env node
/**
 * The product pages as the work list: what is being built, what is open,
 * what needs a design, and the cases that prove each page.
 *
 *   pnpm pages:board [prefix] [--build|--open|--design]
 *   pnpm pages:cases <prefix> [--cited <app-dir>] [--tsv]
 *   pnpm pages:check
 *
 * A page is `docs/prds/products/<id>.md`; its cases are its `:::example` and
 * `:::flow` blocks that carry an `id`, plus the rows of
 * `docs/cases/<id>.md`. A case is cited as `<id>#<case>`, for example
 * `grade10-site/loyalty/points#earn-rounding`, and a test that names that
 * string automates it.
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
  openMarksOfPage,
} from "../../tools/manual/src/api/open-marks.ts";
import { parsePage } from "../../tools/manual/src/content/grammar.ts";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
export const PAGES = "docs/prds/products";
export const CASES = "docs/cases";
export const DESIGN = /🎨/;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REF = /\b([a-z0-9-]+(?:\/[a-z0-9-]+)+)#([a-z0-9]+(?:-[a-z0-9]+)*)\b/g;
const SKIP = new Set(["node_modules", ".git", "dist", "build", ".turbo"]);

function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, ext, out);
    else if (ext.some((one) => name.endsWith(one))) out.push(path);
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
    const cases = [];
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
    pages.push({
      id,
      path: rel,
      title: ast.frontmatter.title ?? id,
      building: marksOfPage(page, BUILDING),
      open: openMarksOfPage(page),
      design: marksOfPage(page, DESIGN),
      cases,
      unnamed,
      casesFile: file ? relative(root, file) : null,
      reviewed,
    });
  }
  return { pages, problems };
}

/** FAIL: a case id that is not kebab-case or is used twice on one page, a
 * cases file with no page, a row with no expected outcome. WARN: a page with
 * a cases file that still has examples without an id. */
export function check(root = ROOT) {
  const { pages, problems } = readPages(root);
  const failures = [...problems];
  const warnings = [];
  const known = new Set(pages.map((page) => page.id));
  for (const page of pages) {
    const seen = new Set();
    for (const one of page.cases) {
      const where = one.file ? `${one.file}:${one.line}` : page.path;
      if (!ID.test(one.id)) {
        failures.push(`${where} case id \`${one.id}\` is not kebab-case`);
      }
      if (seen.has(one.id)) {
        failures.push(
          `${where} case id \`${one.id}\` is used twice on ${page.id}`,
        );
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
  return { failures, warnings };
}

/** Every `<page>#<case>` reference in an application's files. */
export function citedRefs(dir) {
  const refs = new Set();
  const files = walk(dir, [".ts", ".tsx", ".js", ".mjs", ".cjs", ".md"]);
  for (const file of files) {
    for (const match of readFileSync(file, "utf8").matchAll(REF)) {
      refs.add(`${match[1]}#${match[2]}`);
    }
  }
  return refs;
}

const short = (text, max = 110) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;
const flat = (text) => text.replace(/\s*\n\s*/g, " ");

function board(pages, mode) {
  const kinds = {
    build: [["🚧", "building"]],
    open: [["❓", "open"]],
    design: [["🎨", "design"]],
  }[mode] ?? [
    ["🚧", "building"],
    ["❓", "open"],
    ["🎨", "design"],
  ];
  const totals = { building: 0, open: 0, design: 0, cases: 0 };
  const out = [];
  for (const page of pages) {
    const lines = [];
    for (const [, key] of kinds) {
      for (const mark of page[key]) {
        totals[key] += 1;
        const where = mark.where ? `${mark.where.title} - ` : "";
        lines.push(`- ${where}${short(flat(mark.text))}`);
      }
    }
    totals.cases += page.cases.length;
    if (lines.length === 0) continue;
    const cases = page.cases.length
      ? ` · ${page.cases.length} cases${page.reviewed ? `, reviewed ${page.reviewed}` : ""}`
      : "";
    out.push(`\n## ${page.id}${cases}\n${page.path}\n`, ...lines);
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

function main(argv) {
  const [command, ...rest] = argv;
  const flags = new Set(rest.filter((arg) => arg.startsWith("--")));
  const at = rest.indexOf("--cited");
  const citedDir = at >= 0 ? rest[at + 1] : null;
  const prefix = rest.find(
    (arg, i) => !arg.startsWith("--") && rest[i - 1] !== "--cited",
  );
  const select = (pages) =>
    prefix ? pages.filter((page) => page.id.startsWith(prefix)) : pages;

  if (command === "check") {
    const { failures, warnings } = check();
    for (const warning of warnings) console.error(`WARN ${warning}`);
    for (const failure of failures) console.error(`FAIL ${failure}`);
    console.error(
      `pages:check: ${failures.length} failure(s), ${warnings.length} warning(s)`,
    );
    return failures.length ? 1 : 0;
  }
  const { pages } = readPages();
  if (command === "board") {
    const mode = ["build", "open", "design"].find((one) =>
      flags.has(`--${one}`),
    );
    process.stdout.write(board(select(pages), mode));
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
    process.stdout.write(
      `${casesTable(select(pages), cited, flags.has("--tsv"))}\n`,
    );
    return 0;
  }
  console.error("usage: pages.mjs board|cases|check — see the file's head");
  return 2;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
