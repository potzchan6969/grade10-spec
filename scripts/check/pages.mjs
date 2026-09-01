/*
 * RULES: a page parses and is canonical, every pointer in it names something
 * on disk, and a capability page keeps its acceptance shelf.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { findRequirement } from "../../apps/manual/src/api/requirements.ts";
import {
  fileKeyOf,
  nodeIdOf,
} from "../../apps/manual/src/blocks/design-drift.ts";
import {
  parsePage,
  serializePage,
} from "../../apps/manual/src/content/grammar.ts";
import { readDesignSync } from "../../apps/manual/src/store/design-sync.mts";
import { confine, readText } from "../../apps/manual/src/store/disk.mts";
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
      if (!ctx.specs.has(spec)) {
        ctx.add(
          "reference",
          page.path,
          `frontmatter \`spec: ${spec}\` names no spec on disk`,
        );
      }
    }
    for (const block of everyBlock(page.ast.blocks)) {
      checkBlock(ctx, page.path, block);
    }
    checkRefs(ctx, page);
  }
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
    case "journeys": {
      ctx.journeyed.add(block.id);
      if (!specs.has(block.id)) {
        add("reference", path, `${label(block, "id")} names no spec on disk`);
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
      const file = confine(ctx.root, "manual/assets", block.src);
      if (typeof file !== "string") {
        add("reference", path, `${label(block, "src")}: ${file.error}`);
      } else if (!existsSync(file)) {
        add(
          "reference",
          path,
          `${label(block, "src")} names no file under manual/assets`,
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
    // A `warning` is the manual saying the store is wrong about itself —
    // hand-written judgment that rots silently. A name and a date are what
    // let a reader ask whether it is still true, and whose it is to settle.
    case "callout": {
      if (block.kind !== "warning") break;
      if (block.author !== undefined && block.date !== undefined) break;
      add(
        "callout",
        path,
        'a `warning` callout carries who wrote it and when — `:::callout{kind="warning" author="@handle" date="YYYY-MM-DD"}`',
      );
      break;
    }
    default:
      break;
  }
}

const CAPABILITY_PAGE = /^manual\/products\/[^/]+\/(?!index\.md$)[^/]+\.md$/;

/** The shelf every capability page keeps in the same order ends in acceptance,
 * and a page that states a contract without it leaves QA nothing to read. A
 * warning, never a failure: the shelf is a habit, not a pointer that rotted. */
export function checkSkeleton(pages, add) {
  for (const page of pages) {
    if (!CAPABILITY_PAGE.test(page.path)) continue;
    if (page.ast.frontmatter.spec === undefined) continue;
    const shelved = [...everyBlock(page.ast.blocks)].some(
      (block) => block.type === "journeys" || block.type === "cases",
    );
    if (shelved) continue;
    add(
      "skeleton",
      page.path,
      "has a `spec` and neither a `::journeys` nor a `::cases` block — missing its acceptance shelf",
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
 * ship as a real card. The nightly design-sync report knows the file it read,
 * every node a link can name in it, and every set it checked — so where there
 * is a report, a card's url and its `set=` are checkable against it, the same
 * way a `::story` id is checkable against the Storybook index.
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
    return;
  }

  const node = nodeIdOf(block.url);
  if (node === undefined || report.nodes === undefined) return;
  if (report.nodes[node] === undefined) {
    add(
      "figma",
      path,
      `${label(block, "url")}: node ${node} is in no page, frame or component of ${report.file ?? "the design file"} — it was deleted or renumbered`,
    );
  }
}

/** Read once per run, and only where a report exists: a store that has never
 * run the check leaves every figma card unchecked, which is what the note about
 * an unbuilt Storybook index does for story ids. */
function designSync(ctx) {
  if (!("designSync" in ctx)) ctx.designSync = readDesignSync(ctx.root);
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
