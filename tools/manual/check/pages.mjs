/*
 * RULES: a page parses and is canonical, every pointer in it names something
 * on disk, no two of its details anchor alike, and a ledger is written as the
 * block that checks it.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { slugify } from "../src/api/paths.ts";
import { findRequirement } from "../src/api/requirements.ts";
import { fileKeyOf } from "../src/blocks/design-drift.ts";
import {
  PERIOD_COLUMN,
  PROGRESS_COLUMN,
  readExample,
  STEP_COLUMNS,
  TIMELINE_COLUMNS,
} from "../src/blocks/example-shape.ts";
import { parsePage, serializePage } from "../src/content/grammar.ts";
import { readDesignSync } from "../src/store/design-sync.mts";
import { confine, readText } from "../src/store/disk.mts";
import { everyBlock, message, scenarioIds } from "./context.mjs";
import { checkRefs } from "./refs.mjs";

/** A page the grammar refuses never reaches the reference checks — it has no
 * blocks to walk, and its parse error is the finding that matters. */
export function readPages(root, paths, git, add) {
  const pages = [];
  for (const path of paths) {
    const source = readText(join(root, path));
    try {
      const ast = parsePage(source);
      const canonical = serializePage(ast);
      if (canonical !== source) {
        add("canonical", path, firstDifference(source, canonical));
      }
      pages.push({ path, ast, lastCommit: git.commitOf(path) });
    } catch (cause) {
      add("canonical", path, message(cause));
    }
  }
  return pages;
}

export function checkPages(ctx, pages) {
  for (const page of pages) {
    const spec = page.ast.frontmatter.spec;
    if (spec !== undefined) {
      ctx.referenced.add(spec);
      // A page may claim a capability an in-flight change is still writing —
      // that is how an incubating capability gets a page before it lands.
      if (!ctx.specs.has(spec) && !ctx.changing.has(spec)) {
        ctx.add(
          "reference",
          page.path,
          `frontmatter \`spec: ${spec}\` names no spec on disk and no in-flight change`,
        );
      }
    }
    for (const block of everyBlock(page.ast.blocks)) {
      checkBlock(ctx, page.path, block);
    }
    checkDetails(ctx, page);
    checkFlowCases(ctx, page);
    checkLedgers(ctx, page);
    checkRefs(ctx, page);
  }
}

const FENCE = /^(`{3,}|~{3,})/;
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
const TAILS = [
  [],
  [PROGRESS_COLUMN],
  [PERIOD_COLUMN],
  [PROGRESS_COLUMN, PERIOD_COLUMN],
];
const LEDGERS = new Set(
  [STEP_COLUMNS, TIMELINE_COLUMNS].flatMap((columns) =>
    TAILS.map((tail) => [...columns, ...tail].join("|")),
  ),
);

/** Prose a reader meets as prose. An example's own body is the ledger the
 * example block already checks, so it is not one. */
function* looseProse(blocks) {
  for (const block of blocks) {
    if (block.type === "example") continue;
    if (block.type === "prose") yield block;
    else if (Array.isArray(block.body)) yield* looseProse(block.body);
  }
}

/** The ledger columns a table carries, or null. A fenced block is
 * documentation about the grammar rather than a use of it. */
function ledgerColumns(markdown) {
  let fence = null;
  for (const line of markdown.split("\n")) {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      continue;
    }
    const opened = FENCE.exec(line);
    if (opened) {
      fence = opened[1];
      continue;
    }
    const row = TABLE_ROW.exec(line);
    if (row === null) continue;
    const header = row[1]
      .split("|")
      .map((cell) => cell.trim())
      .join("|");
    if (LEDGERS.has(header)) return header.replaceAll("|", " | ");
  }
  return null;
}

/** A hand-written ledger is a worked case nothing holds to its own
 * arithmetic: the example block sums the points, refuses a timeline running
 * backwards, and folds the cases behind one toggle. A warning, never a
 * failure — the table is readable, it just rots the day a rule changes. */
function checkLedgers(ctx, page) {
  for (const block of looseProse(page.ast.blocks)) {
    const columns = ledgerColumns(block.markdown);
    if (columns === null) continue;
    ctx.add(
      "ledger",
      page.path,
      `a \`${columns}\` table is an example's ledger — write it as \`:::example{title="…"}\` and the check holds its balances`,
    );
  }
}

/** The renderer anchors a detail at `detail-<slug of its title>`, so two
 * titles that slug alike on one page take the same anchor and a deep link
 * opens whichever came first. */
function checkDetails(ctx, page) {
  const seen = new Map();
  for (const block of everyBlock(page.ast.blocks)) {
    if (block.type !== "detail") continue;
    const anchor = slugify(block.title);
    const earlier = seen.get(anchor);
    if (earlier === undefined) {
      seen.set(anchor, block);
      continue;
    }
    ctx.add(
      "detail",
      page.path,
      `${label(earlier, "title")} and ${label(block, "title")} share the anchor \`#detail-${anchor}\``,
    );
  }
}

/** Neighbouring flows under one title are one flow's cases, and the reader
 * picks between them by name — so each names its own, no two name the same,
 * and a flow that stands alone names none. Two same-titled flows apart on a
 * page are refused outright: their steps would answer to the same ids. */
function checkFlowCases(ctx, page) {
  const flows = page.ast.blocks.filter((block) => block.type === "flow");
  const runs = [];
  for (const block of page.ast.blocks) {
    const last = runs.at(-1);
    if (block.type !== "flow") continue;
    if (last && last.at(-1) === previous(page.ast.blocks, block)) {
      last.push(block);
    } else {
      runs.push([block]);
    }
  }

  for (const run of runs) {
    const named = new Map();
    for (const block of run) {
      if (run.length === 1 && block.case !== undefined) {
        ctx.add(
          "case",
          page.path,
          `${label(block, "title")} names the case \`${block.case}\` but stands alone`,
        );
      }
      if (run.length > 1 && block.case === undefined) {
        ctx.add(
          "case",
          page.path,
          `${label(block, "title")} sits with other flows under its title and names no case`,
        );
      }
      if (block.case !== undefined && named.has(block.case)) {
        ctx.add(
          "case",
          page.path,
          `${label(block, "title")} names the case \`${block.case}\` twice`,
        );
      }
      named.set(block.case, block);
    }
  }

  const titles = new Map();
  for (const block of flows) {
    const run = runs.find((one) => one.includes(block));
    const earlier = titles.get(block.title);
    if (earlier !== undefined && earlier !== run) {
      ctx.add(
        "case",
        page.path,
        `two flows titled \`${block.title}\` sit apart on this page, so their steps share ids`,
      );
    }
    titles.set(block.title, run);
  }
}

/** The block before this one, or null where it opens the page. */
function previous(blocks, block) {
  const at = blocks.indexOf(block);
  return at <= 0 ? null : blocks[at - 1];
}

function checkBlock(ctx, path, block) {
  const { add, specs } = ctx;
  switch (block.type) {
    case "spec": {
      ctx.referenced.add(block.id);
      const spec = specs.get(block.id);
      if (!spec) {
        add("reference", path, `${label(block, "id")} names no spec on disk`);
        break;
      }
      if (
        block.requirement !== undefined &&
        !findRequirement(spec.requirements, block.requirement)
      ) {
        add(
          "reference",
          path,
          `${label(block, "id")} has no requirement \`${block.requirement}\``,
        );
      }
      if (
        block.scenario !== undefined &&
        !scenarioIds(spec).has(block.scenario)
      ) {
        add(
          "reference",
          path,
          `${label(block, "id")} issues no scenario \`${block.scenario}\``,
        );
      }
      if (block.story !== undefined && !journeyIds(spec).has(block.story)) {
        add(
          "reference",
          path,
          `${label(block, "id")} issues no story \`${block.story}\``,
        );
      }
      break;
    }
    // What a page can get wrong about a suite is the id it names; whether the
    // suite itself holds together is asked of the store directory, so it is
    // asked once and asked even where no page shows it.
    case "cases": {
      ctx.cased.add(block.id);
      if (!specs.has(block.id)) {
        add("reference", path, `${label(block, "id")} names no spec on disk`);
      }
      break;
    }
    case "example": {
      const read = readExample(block);
      if ("problem" in read) {
        add("example", path, `${label(block, "title")}: ${read.problem}`);
      }
      break;
    }
    case "changes": {
      // A ribbon may point at a capability that is still being introduced, so
      // an in-flight change's deltas resolve it as well as a durable spec.
      if (specs.has(block.spec) || ctx.changing.has(block.spec)) break;
      add(
        "reference",
        path,
        `${label(block, "spec")} names no spec on disk and no in-flight change`,
      );
      break;
    }
    case "image": {
      const assets = `${ctx.roots.manual}/assets`;
      const file = confine(ctx.roots.content, assets, block.src);
      if (typeof file !== "string") {
        add("reference", path, `${label(block, "src")}: ${file.error}`);
      } else if (!existsSync(file)) {
        add(
          "reference",
          path,
          `${label(block, "src")} names no file under ${assets}`,
        );
      }
      break;
    }
    case "story": {
      ctx.storyIds.add(block.id);
      if (ctx.stories && !ctx.stories.ids.has(block.id)) {
        add(
          "story",
          path,
          `${label(block, "id")} is not in ${ctx.stories.file}`,
        );
      }
      break;
    }
    case "figma": {
      checkFigma(ctx, path, block);
      break;
    }
    // A `warning` callout needs no rule here: its signature — whose judgment,
    // and when — is derived from git at build, and explicit `author`/`date`
    // attributes are format-checked by the grammar itself.
    default:
      break;
  }
}

/** The segments under `<manual>/products/`, or null for a path that is not a
 * product page at all. A product id is one segment in a flat store and two —
 * `<product>/<domain>` — in one that groups specs by application, so both
 * depths are read wherever a page is classified. */
const productPage = (manual, path) => {
  const prefix = `${manual}/products/`;
  if (!path.startsWith(prefix) || !path.endsWith(".md")) return null;
  const rest = path.slice(prefix.length).split("/");
  return rest.length === 2 || rest.length === 3 ? rest : null;
};

/** `<manual>/products/<product>/index.md` — the domain's own page. */
const landingPage = (manual, path) => {
  const rest = productPage(manual, path);
  return rest !== null && rest[rest.length - 1] === "index.md";
};

/** A domain reads as a row in the rail before it reads as a page, and a row
 * with no glyph is the one thing a reader cannot scan for. A warning, never a
 * failure: the page is complete, the rail is just harder to use. */
export function checkIcons(ctx, pages) {
  for (const page of pages) {
    if (!landingPage(ctx.roots.manual, page.path)) continue;
    if (page.ast.frontmatter.icon) continue;
    ctx.add(
      "icon",
      page.path,
      "no `icon` — the domain's rail row has no glyph",
    );
  }
}

const journeyIds = (spec) =>
  new Set((spec.journeys ?? []).map((one) => one.id));

const label = (block, key) => `::${block.type}{${key}="${block[key]}"}`;

function isFigma(url) {
  try {
    const { hostname } = new URL(url);
    return hostname === "figma.com" || hostname.endsWith(".figma.com");
  } catch {
    return false;
  }
}

/**
 * A figma.com host was the only thing asserted here, which let a made-up link
 * ship as a real card. The nightly design-sync report knows the file it read
 * and every set it checked — so where there is a report, a card's url and its
 * `set=` are checkable against it, the same way a `::story` id is checkable
 * against the Storybook index. A node id the report does not know is not
 * flagged here: Figma's own embed still renders it, and a card cannot tell a
 * frame that moved from one this run never reached.
 *
 * Warnings, never failures: the report is a snapshot of a file someone else
 * owns, and a frame that moved this morning is not a broken page.
 */
function checkFigma(ctx, path, block) {
  const { add } = ctx;
  if (!isFigma(block.url)) {
    add("figma", path, `${label(block, "url")} is not a figma.com link`);
    return;
  }

  const report = designSync(ctx);
  if (!report) return;

  if (block.set !== undefined && report.sets[block.set] === undefined) {
    add(
      "figma",
      path,
      `${label(block, "set")} is not a component set the design-sync report checked`,
    );
  }

  const file = fileKeyOf(block.url);
  if (report.file !== undefined && file !== undefined && file !== report.file) {
    add(
      "figma",
      path,
      `${label(block, "url")} is in Figma file ${file}, not ${report.file} — the one every mapping points into`,
    );
  }
}

/** Read once per run, and only where a report exists: a store that has never
 * run the check leaves every figma card unchecked, which is what the note about
 * an unbuilt Storybook index does for story ids. */
function designSync(ctx) {
  if (!("designSync" in ctx)) ctx.designSync = readDesignSync(ctx.roots.store);
  return ctx.designSync;
}

function firstDifference(actual, canonical) {
  const a = actual.split("\n");
  const b = canonical.split("\n");
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if (a[i] === b[i]) continue;
    return `line ${i + 1}: is ${show(a[i])}, canonical is ${show(b[i])}`;
  }
  return "differs from its canonical form";
}

const show = (line) =>
  line === undefined ? "(end of file)" : JSON.stringify(line);
