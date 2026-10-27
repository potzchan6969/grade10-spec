#!/usr/bin/env node
/*
 * CHECK: the manual against the pages it renders.
 *
 *   pnpm check:manual [store-root] [--quiet] [--fix]
 *
 * The manual reads only docs/prds/: its pages, their images, and the
 * workbench Storybook index. Nothing here reads a change or a test case.
 *
 * FAIL = a page does not parse, is not the canonical text the editor would
 *        write back, points at an image or reference that does not exist, or
 *        a product or topic has no landing page. Exits 1.
 * WARN = hygiene with no broken pointer behind it: a `[[ref]]` in prose that
 *        names nothing, a `::figma` link off figma.com, a page past the
 *        budget in docs/prds/guides/writing-the-manual.md, a mark read as words.
 *        Exits 0.
 *
 * The readers in ../src are the only parser — this script never grows a second
 * one, so the check and the app can never disagree.
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
import { readManualConfig, readPageShape } from "../src/store/read-manual.mts";
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
import { checkCopy } from "./copy.mjs";
import { checkDense } from "./dense.mjs";
import { checkMarkInProse } from "./marks.mjs";
import { checkIcons, checkPages, readPages } from "./pages.mjs";
import { checkTaxonomy } from "./shape.mjs";

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
 */
export async function runChecks(target, git, { fix = false } = {}) {
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

  const paths = walkFiles(
    roots.content,
    join(roots.content, roots.manual),
    ".md",
  );
  const pages = readPages(roots.content, paths, index, add);

  const ctx = createContext(roots, report, {
    pages,
    stories: readStoryIndex(roots.store, add),
  });

  checkPages(ctx, pages);
  checkMarkInProse(ctx, pages);
  checkDense(ctx, pages);

  if (!ctx.stories && ctx.storyIds.size > 0) {
    notes.push(
      `${plural(ctx.storyIds.size, "`::story` id")} not checked — no workbench Storybook index under apps/preview/storybook-static*`,
    );
  }

  checkTaxonomy(ctx.roots, config, readPageShape(roots), add);
  checkIcons(ctx, pages);

  const rewritten = checkCopy(roots.store, [roots.manual], add, { fix });
  if (rewritten > 0) {
    notes.push(
      `${plural(rewritten, "copy citation")} rewritten to the words the catalogs hold`,
    );
  }

  return { findings, notes };
}

export function formatReport(target, result, { quiet = false } = {}) {
  const lines = [`manual check — ${label(target)}`];
  for (const rule of RULES) {
    if (quiet && rule.level !== "fail") continue;
    const found = result.findings
      .filter((one) => one.rule === rule.key)
      .sort(byPathThenReason);
    if (found.length === 0) continue;
    lines.push("", `${rule.level.toUpperCase()}  ${rule.title}`);
    for (const one of found) lines.push(`      ${one.path} — ${one.reason}`);
  }
  if (!quiet) for (const note of result.notes) lines.push("", `note: ${note}`);

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
  const quiet = args.includes("--quiet");
  const fix = args.includes("--fix");
  const where = args.find((one) => !one.startsWith("--"));
  const roots = where ? rootsOf(resolve(where)) : resolveRoots();
  const { text, failures } = formatReport(
    roots,
    await runChecks(roots, undefined, { fix }),
    { quiet },
  );
  console.log(text);
  process.exitCode = failures > 0 ? 1 : 0;
}
