#!/usr/bin/env node
/**
 * The fast checks a push to `main` owes, chosen by the paths it sends. Each
 * one runs in seconds, so this gate can stand in front of every push:
 *
 *   node scripts/push-main/gate.mjs                 paths in origin/main...HEAD
 *   node scripts/push-main/gate.mjs <base> <head>   paths in base..head
 *
 * `push-main.mjs` runs it before pushing, and the pre-push hook runs it for a
 * push to `main` that did not come through a gated tool. Exit 1 names every
 * check that failed; exit 2 means the gate itself could not run.
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { classify } from "./paths.mjs";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

const COMMANDS = {
  biome: (paths) => {
    const present = paths.filter((path) => existsSync(join(ROOT, path)));
    if (!present.length) return null;
    return [
      "pnpm",
      [
        "exec",
        "biome",
        "check",
        "--no-errors-on-unmatched",
        "--files-ignore-unknown=true",
        ...present,
      ],
    ];
  },
  changes: (_, check) => [
    "node",
    [
      "scripts/openspec/validate-changes.mjs",
      "--strict",
      ...(check.change ? [check.change] : []),
    ],
  ],
  "test-cases": () => ["node", ["scripts/openspec/validate-test-cases.mjs"]],
  manual: () => ["node", ["tools/manual/check/check-manual.mjs"]],
  parity: () => ["bash", ["scripts/agent-platform/check-parity.sh"]],
};

export function changedPaths(base, head) {
  const range = head ? `${base}..${head}` : `${base}...HEAD`;
  const ran = spawnSync("git", ["diff", "--name-only", range], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (ran.status !== 0) {
    throw new Error(`git diff ${range} failed: ${ran.stderr.trim()}`);
  }
  return ran.stdout.split("\n").filter(Boolean);
}

/** Runs every check the paths owe and returns the ids of those that failed. */
export function runGate(paths, { log = console.error } = {}) {
  if (!existsSync(join(ROOT, "node_modules"))) {
    throw new Error(
      "the gate needs this store's dependencies: run `pnpm install` first",
    );
  }
  const failed = [];
  for (const check of classify(paths).checks) {
    const command = COMMANDS[check.id](paths, check);
    if (!command) continue;
    const [program, args] = command;
    const label = check.change ? `${check.id} ${check.change}` : check.id;
    const started = Date.now();
    const ran = spawnSync(program, args, { cwd: ROOT, encoding: "utf8" });
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    if (ran.status === 0) {
      log(`  ok    ${label} (${seconds}s)`);
      continue;
    }
    failed.push(label);
    log(`  FAIL  ${label} (${seconds}s)`);
    log(`${ran.stdout}${ran.stderr}`.trim().split("\n").slice(-25).join("\n"));
  }
  return failed;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [base = "origin/main", head] = process.argv.slice(2);
  try {
    const paths = changedPaths(base, head);
    if (!paths.length) process.exit(0);
    const failed = runGate(paths);
    if (failed.length) {
      console.error(`gate: ${failed.join(", ")} failed`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`gate: ${error.message}`);
    process.exit(2);
  }
}
