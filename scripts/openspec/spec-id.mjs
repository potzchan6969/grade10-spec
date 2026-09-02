#!/usr/bin/env node
/**
 * Resolve a permanent id to what it says and everywhere it is named.
 *
 *   pnpm run spec:id loyalty-SC-04        # the scenario, its requirement, its mentions
 *   pnpm run spec:id listing-page-US-01   # the story and the scenarios accepting it
 *   pnpm run spec:id listing-page         # every id that capability issues
 *   pnpm run spec:id loyalty-SC-04 --path # `file:line` alone, for an editor
 *   pnpm run spec:id loyalty-SC-04 --archive   # include archived changes
 *
 * The store asks everyone to cite an id rather than retype a requirement —
 * `openspec/config.yaml` makes that a rule, and the manual renders each id as
 * a link. Outside the manual an id has been a string to grep, which is the
 * whole cost of the convention with none of its use. This closes that: an id
 * in, the block it names out, with the requirement it sits under and every
 * task, suite and page that points at it.
 *
 * An id is defined where a heading carries it and mentioned everywhere else.
 * That rule is deliberately about headings rather than about `-SC-` and
 * `-US-`, so a test case's id resolves the same way without this script
 * having to learn a fourth shape.
 *
 * Zero dependencies: Node built-ins only, matching the other scripts here.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
/** This file's own usage text names ids to show the shape of one. Nobody is
 * citing them, so it reads itself out of its own results. */
const SELF = fileURLToPath(import.meta.url);

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = (s) => c("1", s);
const dim = (s) => c("2", s);
const red = (s) => c("31", s);
const green = (s) => c("32", s);
const yellow = (s) => c("33", s);
const cyan = (s) => c("36", s);

/** Directories that hold no store text, or hold a copy of somebody else's. */
const SKIP = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "storybook-static",
  ".next",
  ".turbo",
  // Its own repository, vendored as a submodule.
  "openspec-viewer",
]);

/** Where a citation can honestly live: prose, config, and the code that names
 * a scenario in a test or a story. */
const EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".yaml",
  ".yml",
  ".ts",
  ".tsx",
  ".mts",
  ".mjs",
  ".js",
  ".jsx",
  ".json",
]);

/** An id is a prefix, a kind, and a number: `listing-page-SC-01`,
 * `listing-page-US-01`. Suites in the store carry a case id as
 * `listing-page-US1-TC1-1` — a shape the spec rules do not describe and the
 * manual's own reader does not match — so the kind's dash and the prefix's
 * case are both optional here. Reading an id nobody governs is better than
 * refusing to look it up. */
const ID_SOURCE = "[A-Za-z0-9][A-Za-z0-9-]*-(?:SC|US|TC)-?\\d+(?:-\\d+)*";
const ID = new RegExp(`^${ID_SOURCE}$`);
/** The same token, found in running text: never a fragment of a longer one. */
const ID_IN_TEXT = new RegExp(
  `(?<![A-Za-z0-9-])${ID_SOURCE}(?![A-Za-z0-9-])`,
  "g",
);
const KIND_SUFFIX = /-(?:SC|US|TC)-?\d.*$/;
const HEADING = /^(#{1,6})\s+(.*)$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".design-sync") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile() && full !== SELF) {
      const dot = entry.name.lastIndexOf(".");
      if (dot > 0 && EXTENSIONS.has(entry.name.slice(dot))) out.push(full);
    }
  }
  return out;
}

/** Every id the store issues in a heading, and every place any id is named.
 * One pass: the walk is the expensive part, and a second query in the same
 * run is not worth a cache file. */
function scan(files) {
  const definitions = new Map(); // id -> [site]
  const mentions = new Map(); // id -> [site]
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (
      !text.includes("-SC-") &&
      !text.includes("-US-") &&
      !text.includes("-TC-")
    ) {
      continue;
    }
    const path = relative(ROOT, file);
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      const found = line.match(ID_IN_TEXT);
      if (!found) return;
      const heading = HEADING.exec(line);
      for (const id of new Set(found)) {
        const site = { path, line: index + 1, text: line, lines, index };
        if (heading) {
          site.level = heading[1].length;
          push(definitions, id, site);
        } else {
          push(mentions, id, site);
        }
      }
    });
  }
  return { definitions, mentions };
}

function push(map, key, value) {
  const held = map.get(key);
  if (held) held.push(value);
  else map.set(key, [value]);
}

/** What a reader needs to place a definition: which capability, whether the
 * spec is durable or a delta in flight, and which change carries it. */
function origin(path) {
  const parts = path.split(sep);
  if (parts[0] !== "openspec") {
    if (parts[0] === "manual") return { kind: "manual page" };
    return { kind: parts[0] };
  }
  if (parts[1] === "specs") {
    const rest = parts.slice(2);
    const file = rest.pop();
    const capability = rest.join("/");
    if (file === "test-cases.md") {
      return { kind: "test cases", capability, durable: true };
    }
    return { kind: "durable spec", capability, durable: true };
  }
  if (parts[1] !== "changes") return { kind: "openspec" };
  const archived = parts[2] === "archive";
  const change = archived ? parts[3] : parts[2];
  const rest = parts.slice(archived ? 4 : 3);
  if (rest[0] === "specs") {
    const inner = rest.slice(1);
    inner.pop();
    return {
      kind: archived ? "archived delta" : "delta",
      change,
      capability: inner.join("/"),
      archived,
    };
  }
  return {
    kind: `${archived ? "archived change" : "change"} ${rest.join("/")}`,
    change,
    archived,
  };
}

/** The headings above a line, nearest first, one per level. In a spec that is
 * the requirement a scenario sits under and the section it sits in — and in a
 * delta the section names the kind, so `## ADDED Requirements` says what the
 * change does to it without this script parsing the change at all. */
function ancestry(lines, index, level) {
  const found = [];
  let wanted = level - 1;
  for (let i = index - 1; i >= 0 && wanted > 0; i--) {
    const heading = HEADING.exec(lines[i]);
    if (!heading) continue;
    const at = heading[1].length;
    if (at > wanted) continue;
    found.push({ level: at, text: heading[2].trim() });
    wanted = at - 1;
  }
  return found;
}

/** The heading's own block: everything under it until a heading as shallow. */
function block(lines, index, level, limit = 24) {
  const out = [lines[index]];
  for (let i = index + 1; i < lines.length && out.length < limit; i++) {
    const heading = HEADING.exec(lines[i]);
    if (heading && heading[1].length <= level) break;
    out.push(lines[i]);
  }
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  return out;
}

/** Durable first, then a change in flight, then the archive. */
function rank(where) {
  if (where.archived) return 2;
  return where.durable ? 0 : 1;
}

function label(site) {
  const where = origin(site.path);
  if (where.capability && where.change) {
    return `${where.kind} · ${where.capability} · ${where.change}`;
  }
  if (where.capability) return `${where.kind} · ${where.capability}`;
  if (where.change) return where.kind;
  return where.kind;
}

/** Where it is defined, what it sits under, and the block itself. The title
 * line is dropped from the ancestry: a spec's `# <capability> Specification`
 * repeats what the label already said. */
function reportDefinition(site) {
  const at = `${site.path}:${site.line}`;
  console.log(`  ${green(at)}  ${dim(label(site))}`);
  for (const up of ancestry(site.lines, site.index, site.level).reverse()) {
    if (up.level === 1) continue;
    console.log(`  ${dim("under")} ${up.text}`);
  }
  console.log("");
  for (const line of block(site.lines, site.index, site.level)) {
    console.log(`    ${line}`);
  }
  console.log("");
}

function main() {
  const argv = process.argv.slice(2);
  const flags = new Set(argv.filter((one) => one.startsWith("--")));
  const [query] = argv.filter((one) => !one.startsWith("--"));

  if (!query || flags.has("--help")) {
    console.log(
      "usage: pnpm run spec:id <id|capability> [--path] [--archive]\n\n" +
        "  <id>          a scenario, story or test-case id — prints what it says\n" +
        "  <capability>  a capability's own name — lists every id it issues\n" +
        "  --path        print the definition's `file:line` and nothing else\n" +
        "  --archive     include archived changes in the mentions",
    );
    process.exit(query ? 0 : 2);
  }

  const withArchive = flags.has("--archive");
  const { definitions, mentions } = scan(walk(ROOT));

  const isId = ID.test(query);
  if (!isId) return listCapability(query, definitions);

  const defined = definitions.get(query) ?? [];
  const named = mentions.get(query) ?? [];

  if (!defined.length && !named.length) {
    console.error(`${red("no")} ${bold(query)} in the store`);
    const prefix = query.replace(KIND_SUFFIX, "");
    const near = [...definitions.keys()]
      .filter((one) => one.startsWith(`${prefix}-`))
      .sort();
    if (near.length) {
      console.error(
        `\n${dim(`${prefix} issues:`)} ${near.slice(0, 12).join(", ")}` +
          (near.length > 12 ? dim(` … and ${near.length - 12} more`) : ""),
      );
    }
    process.exit(1);
  }

  if (flags.has("--path")) {
    // The same order the report leads with: what the store says now, then a
    // change proposing to alter it, then the archive. Walk order would answer
    // with the delta, `changes` sorting ahead of `specs`.
    const [first] = [...defined].sort(
      (a, b) => rank(origin(a.path)) - rank(origin(b.path)),
    );
    if (!first) {
      console.error(`${red("no")} heading defines ${bold(query)}`);
      process.exit(1);
    }
    console.log(`${first.path}:${first.line}`);
    return;
  }

  console.log("");
  console.log(bold(query));
  console.log("");

  if (!defined.length) {
    console.log(
      `  ${yellow("no heading defines it")} — named below, but no spec issues it\n`,
    );
  }
  const live = defined.filter((site) => !origin(site.path).archived);
  // What the store says now comes before what a change proposes to make it
  // say; the walk would otherwise lead with the delta, `changes` sorting
  // ahead of `specs`.
  const shown = (live.length ? live : defined).sort(
    (a, b) => rank(origin(a.path)) - rank(origin(b.path)),
  );
  for (const site of shown) reportDefinition(site);

  const inFlight = shown.filter((site) => origin(site.path).kind === "delta");
  if (inFlight.length && shown.some((site) => origin(site.path).durable)) {
    for (const site of inFlight) {
      console.log(
        `  ${yellow("in flight")} — ${origin(site.path).change} carries a delta on it\n`,
      );
    }
  }

  const hidden = [];
  const rows = [];
  for (const site of named) {
    if (!withArchive && origin(site.path).archived) {
      hidden.push(site);
      continue;
    }
    rows.push(site);
  }
  if (rows.length) {
    console.log(`  ${bold("named in")}`);
    // Aligned, but never so far right that the citation itself wraps: an
    // archived change's path is long enough to push every line off a terminal.
    const width = Math.min(
      64,
      Math.max(...rows.map((site) => `${site.path}:${site.line}`.length)),
    );
    for (const site of rows) {
      const at = `${site.path}:${site.line}`.padEnd(width);
      console.log(`    ${cyan(at)}  ${site.text.trim().slice(0, 90)}`);
    }
    console.log("");
  }
  if (hidden.length) {
    console.log(
      `  ${dim(`+${hidden.length} in archived changes — --archive to show`)}\n`,
    );
  }
}

/** A capability's own index: every id it issues, in the order it issues them. */
function listCapability(query, definitions) {
  const issued = [...definitions.entries()]
    .filter(([id]) => id.startsWith(`${query}-`))
    .flatMap(([id, sites]) =>
      sites
        .filter((site) => !origin(site.path).archived)
        .map((site) => ({ id, site })),
    );
  if (!issued.length) {
    console.error(`${red("no")} id starts with ${bold(`${query}-`)}`);
    process.exit(1);
  }
  // The durable spec's own ids first, then whatever a change is adding to
  // them — the same order a reader wants for a single id.
  issued.sort((a, b) => {
    const by = rank(origin(a.site.path)) - rank(origin(b.site.path));
    if (by !== 0) return by;
    if (a.site.path !== b.site.path) {
      return a.site.path.localeCompare(b.site.path);
    }
    return a.site.line - b.site.line;
  });
  console.log("");
  console.log(bold(query));
  console.log("");
  let seen = "";
  for (const { id, site } of issued) {
    if (site.path !== seen) {
      seen = site.path;
      console.log(`  ${dim(site.path)}  ${dim(label(site))}`);
    }
    const title = site.text.replace(HEADING, "$2").replace(/^Scenario:\s*/, "");
    console.log(
      `    ${green(id.padEnd(24))} ${title.replace(`${id} - `, "").replace(`${id}: `, "")}`,
    );
  }
  console.log("");
}

main();
