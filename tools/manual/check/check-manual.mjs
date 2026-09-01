#!/usr/bin/env node
/*
 * CHECK: the manual against the store it describes.
 *
 *   pnpm check:manual [store-root]
 *
 * The manual restates nothing — it points at specs, changes, images and
 * stories. Every one of those pointers can rot without anyone noticing, so
 * this walks them all and says so out loud.
 *
 * FAIL = a page lies about the store: it does not parse, it is not the
 *        canonical text the editor would write back, a reference names
 *        nothing on disk, a durable spec has no page, a product or topic has
 *        no landing page, or a store file the readers could not parse. One
 *        family is about acceptance: a case tracing a scenario the spec does
 *        not issue, an approved suite holding a draft, a journey accepted by
 *        a scenario its own spec never issued. One is aimed at
 *        `openspec archive` rather than at a page: a durable spec carrying a
 *        heading the fold would absorb, and every way an in-flight delta
 *        breaks the fold — a heading it cannot carry, a heading no durable
 *        requirement answers to, one requirement two changes both fold, an
 *        id issued twice, a page selector a fold is about to move out from
 *        under. Exits 1.
 * WARN = hygiene with no broken pointer behind it: a page committed before
 *        the specs it embeds, named requirement by requirement, a `[[ref]]`
 *        in prose that names nothing, a `::figma` link off figma.com, a spec
 *        whose journeys or test cases no page shows, a scenario no case
 *        traces, a suite quoting wording the spec has since moved, a delta
 *        section the fold discards, a delta-introduced capability no page
 *        documents. Exits 0.
 *
 * The readers in ../src are the only parser — this script never
 * grows a second one, so the check and the app can never disagree.
 *
 * One rule family per module in this directory; this file reads the
 * store once and hands the same context to each of them.
 */
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { walkFiles } from "../src/store/disk.mts";
import { NO_GIT, readGitIndex } from "../src/store/git.mts";
import { readChanges } from "../src/store/read-changes.mts";
import { readManualConfig } from "../src/store/read-manual.mts";
import { discoverSpecs, readSpecs } from "../src/store/read-specs.mts";
import {
  createContext,
  createReport,
  MANUAL_YAML,
  message,
  plural,
  RULES,
  readStoryIndex,
} from "./context.mjs";
import { checkDeltas } from "./deltas.mjs";
import { checkPages, checkSkeleton, readPages } from "./pages.mjs";
import { checkAcceptance } from "./qa.mjs";
import {
  checkCoverage,
  checkDependencies,
  checkSpecShape,
  checkStoreErrors,
  checkTaxonomy,
  checkUnwritten,
} from "./shape.mjs";
import { checkStale } from "./stale.mjs";

const EMPTY_CONFIG = {
  storybookBase: "",
  groups: [],
  platform: [],
  guides: [],
};

/** Pure over `root` and the git index; `git` is injectable so a fixture can
 * pin commit dates. */
export async function runChecks(root, git) {
  const index = git ?? (await gitIndex(root));
  const report = createReport();
  const { findings, notes, add } = report;

  let config = EMPTY_CONFIG;
  try {
    config = readManualConfig(root);
  } catch (cause) {
    // The reader names the file it refused; the path column already does.
    add("config", MANUAL_YAML, message(cause).replace(`${MANUAL_YAML} `, ""));
  }

  const shape = discoverSpecs(root);
  const specs = new Map(readSpecs(root, index).map((spec) => [spec.id, spec]));
  const changes = readChanges(root, index);

  const paths = walkFiles(root, join(root, "manual"), ".md");
  const pages = readPages(root, paths, index, add);

  const ctx = createContext(root, report, {
    specs,
    changes,
    stories: readStoryIndex(root, add),
  });

  checkPages(ctx, pages);

  if (!ctx.stories && ctx.storyIds.size > 0) {
    notes.push(
      `${plural(ctx.storyIds.size, "`::story` id")} not checked — no workbench Storybook index under apps/preview/storybook-static*`,
    );
  }

  checkCoverage(ctx, shape);
  checkUnwritten(ctx, changes, shape);
  checkAcceptance(ctx, shape);
  checkTaxonomy(root, config, shape, paths, add);
  checkSkeleton(ctx, pages);

  const folded = checkSpecShape(root, shape, add);
  checkDeltas(ctx, { changes, shape, pages });
  checkStoreErrors(specs, changes, folded, add);
  checkDependencies(root, changes, add);

  await checkStale(root, pages, specs, shape.dirs, index, add);

  return { findings, notes };
}

export function formatReport(root, result) {
  const lines = [`manual check — ${root}`];
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

function byPathThenReason(a, b) {
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  if (a.reason === b.reason) return 0;
  return a.reason < b.reason ? -1 : 1;
}

async function gitIndex(root) {
  if (!existsSync(join(root, ".git"))) return NO_GIT;
  return readGitIndex(root, ["openspec", "manual"]);
}

if (import.meta.main) {
  const root = process.argv[2]
    ? resolve(process.argv[2])
    : resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
  const { text, failures } = formatReport(root, await runChecks(root));
  console.log(text);
  process.exitCode = failures > 0 ? 1 : 0;
}
