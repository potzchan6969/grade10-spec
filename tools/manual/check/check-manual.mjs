#!/usr/bin/env node
/*
 * CHECK: the manual against the store it describes.
 *
 *   pnpm check:manual [store-root] [--pages]
 *
 * The manual restates nothing — it points at specs, changes, images and
 * stories. Every one of those pointers can rot without anyone noticing, so
 * this walks them all and says so out loud.
 *
 * FAIL = a page lies about the store: it does not parse, it is not the
 *        canonical text the editor would write back, a reference names
 *        nothing on disk, two of its details anchor alike, a durable spec has
 *        no page, a product or topic has
 *        no landing page, or a store file the readers could not parse. One
 *        family is about acceptance: a case tracing a scenario the spec does
 *        not issue, an approved suite holding a draft, a journey accepted by
 *        a scenario its own spec never issued, a capability whose journeys
 *        file neither holds a story nor says nobody walks it. One is aimed at
 *        `openspec archive` rather than at a page: a durable spec carrying a
 *        heading the fold would absorb, and every way an in-flight delta
 *        breaks the fold — a heading it cannot carry, a heading no durable
 *        requirement answers to, one requirement two changes both fold, an
 *        id issued twice, a page selector a fold is about to move out from
 *        under. Exits 1.
 * WARN = hygiene with no broken pointer behind it: a page committed before
 *        the specs it embeds, named requirement by requirement, a `[[ref]]`
 *        in prose that names nothing, a `::figma` link off figma.com, a spec
 *        whose test cases no page shows, a scenario no case traces, a suite
 *        quoting wording the spec has since moved, a delta section the fold
 *        discards, a delta-introduced capability no page documents, a domain
 *        with no icon for its rail row. Exits 0.
 *
 * `--pages` keeps the page families and drops the store ones. It is the
 * deploy's gate: a requirement two changes both fold is a break in files the
 * manual mirrors, and the site's job there is to stay up and point at it, not
 * to refuse to publish. Lint runs the whole check on the same push, so every
 * store family still fails the pull request that wrote it.
 *
 * The readers in ../src are the only parser — this script never
 * grows a second one, so the check and the app can never disagree.
 *
 * One rule family per module in this directory; this file reads the
 * store once and hands the same context to each of them.
 */
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { walkFiles } from "../src/store/disk.mts";
import {
  mergeGitIndexes,
  NO_GIT,
  readGitIndex,
  STORE_DIRS,
} from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { readManualConfig } from "../src/store/read-manual.mts";
import { discoverSpecs, readSpecs } from "../src/store/read-specs.mts";
import { resolveRoots, rootsOf } from "../src/store/roots.mts";
import {
  createContext,
  createReport,
  manualYaml,
  message,
  plural,
  RULES,
  readStoryIndex,
} from "./context.mjs";
import { checkDeltas } from "./deltas.mjs";
import { checkIcons, checkPages, readPages } from "./pages.mjs";
import { checkAcceptance } from "./qa.mjs";
import { checkRole } from "./role.mjs";
import {
  checkCoverage,
  checkDependencies,
  checkSpecMap,
  checkSpecShape,
  checkStoreErrors,
  checkTaxonomy,
  checkUnwritten,
} from "./shape.mjs";
import { checkStale } from "./stale.mjs";
import { checkWalked } from "./walked.mjs";

const EMPTY_CONFIG = {
  storybookBase: "",
  groups: [],
  platform: [],
  guides: [],
};

/**
 * Pure over the roots and the git index; `git` is injectable so a fixture can
 * pin commit dates. `target` is the resolved roots, or one directory that is
 * both — the store documenting itself.
 *
 * Which rules run follows who can fix what they find. Page rules — parse,
 * canonical, every pointer resolves, staleness — run everywhere: they are
 * about this repository's own pages. Store rules — coverage, suites,
 * deltas, the fold — run only where the manual and the store share a
 * repository, because a manual mounted elsewhere can neither cause nor fix a
 * hole in the store, and failing its PRs over one would gate the wrong door.
 *
 * `pages` drops the store families on a manual that owns its store too. It is
 * for the deploy, and for nothing else: a spec two changes both fold is a
 * break in files the manual mirrors, and the site's job is to stay up and
 * point at it. Lint runs the whole check on the same push, so the family
 * still fails the pull request that wrote it.
 */
export async function runChecks(
  target,
  git,
  { pages: pagesOnly = false } = {},
) {
  const roots = typeof target === "string" ? rootsOf(target) : target;
  const index = git ?? (await gitIndex(roots));
  const report = createReport();
  const { findings, notes, add } = report;

  let config = EMPTY_CONFIG;
  try {
    config = readManualConfig(roots);
  } catch (cause) {
    // The reader names the file it refused; the path column already does.
    const named = manualYaml(roots);
    add("config", named, message(cause).replace(`${named} `, ""));
  }

  const shape = discoverSpecs(roots.store);
  const specs = new Map(
    readSpecs(roots.store, index).map((spec) => [spec.id, spec]),
  );
  const changes = readChanges(roots.store, index);

  const paths = walkFiles(
    roots.content,
    join(roots.content, roots.manual),
    ".md",
  );
  const pages = readPages(roots.content, paths, index, add);

  const ctx = createContext(roots, report, {
    specs,
    changes,
    stories: readStoryIndex(roots.store, add),
  });

  checkPages(ctx, pages);

  if (!ctx.stories && ctx.storyIds.size > 0) {
    notes.push(
      `${plural(ctx.storyIds.size, "`::story` id")} not checked — no workbench Storybook index under apps/preview/storybook-static*`,
    );
  }

  checkTaxonomy(ctx.roots, config, shape, paths, add);
  checkIcons(ctx, pages);
  await checkStale(roots.store, pages, specs, shape.dirs, index, add);

  if (roots.own && pagesOnly) {
    notes.push(
      "store rules not run — page rules only, the deploy's gate; lint runs the rest",
    );
  } else if (roots.own) {
    checkCoverage(ctx, shape);
    checkUnwritten(ctx, changes, shape);
    checkAcceptance(ctx, shape);
    checkWalked(ctx, shape, changes);
    checkRole(ctx, shape);
    const folded = checkSpecShape(roots.store, shape, add);
    checkSpecMap(roots.store, shape, add);
    checkDeltas(ctx, { changes, shape, pages });
    checkStoreErrors(specs, changes, folded, add);
    checkDependencies(roots.store, changes, add);
  } else {
    notes.push(
      `store rules not run — the store's own repository answers for ${roots.store}`,
    );
  }

  return { findings, notes };
}

export function formatReport(target, result) {
  const lines = [`manual check — ${label(target)}`];
  for (const rule of RULES) {
    const found = result.findings
      .filter((one) => one.rule === rule.key)
      .sort(byPathThenReason);
    if (found.length === 0) continue;
    lines.push("", `${rule.level.toUpperCase()}  ${rule.title}`);
    for (const one of found) lines.push(`      ${one.path} — ${one.reason}`);
  }
  for (const note of result.notes) lines.push("", `note: ${note}`);

  const failures = result.findings.filter((one) => one.level === "fail").length;
  const warnings = result.findings.length - failures;
  lines.push(
    "",
    `${plural(failures, "failure")}, ${plural(warnings, "warning")}`,
  );
  return { text: lines.join("\n"), failures, warnings };
}

function label(target) {
  if (typeof target === "string") return target;
  return target.own
    ? target.content
    : `${target.content} (store: ${target.store})`;
}

function byPathThenReason(a, b) {
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  if (a.reason === b.reason) return 0;
  return a.reason < b.reason ? -1 : 1;
}

/** Commit info is decoration here as everywhere: a root that is not a git
 * repository checks fine, it just cannot date its pages. */
async function gitIndex(roots) {
  const at = (root, dirs) =>
    existsSync(join(root, ".git"))
      ? readGitIndex(root, dirs, roots.manual)
      : NO_GIT;
  if (roots.own) return at(roots.store, [...STORE_DIRS, roots.manual]);
  return mergeGitIndexes(
    await at(roots.store, STORE_DIRS),
    await at(roots.content, [roots.manual]),
    roots.manual,
  );
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const pages = args.includes("--pages");
  const where = args.find((one) => !one.startsWith("--"));
  const roots = where ? rootsOf(resolve(where)) : resolveRoots();
  const { text, failures } = formatReport(
    roots,
    await runChecks(roots, undefined, { pages }),
  );
  console.log(text);
  process.exitCode = failures > 0 ? 1 : 0;
}
