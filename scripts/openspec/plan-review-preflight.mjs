#!/usr/bin/env node
/**
 * The Dev-to-QA2 mechanical handoff. This runs the pinned strict change
 * validator, then checks the fold-facing Markdown shape and emits the review
 * scope index even when a blocker is found.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { buildReviewScope } from "./review-scope.mjs";

const HERE = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const DELTA_HEADING = /^##\s+(ADDED|MODIFIED|REMOVED|RENAMED) Requirements\s*$/;
const REQUIREMENT = /^###\s+Requirement:\s*(.+?)\s*$/;
const SCENARIO = /^####\s+Scenario:\s+(\S+)/;
const TRACE = /^<!--\s*trace:scenario\s+id=(\S+).*-->\s*$/;
const ALLOWED_ROOTS = new Set([
  "Purpose",
  "Feature set",
  "REMOVED Feature set",
]);
const CONTRACT_FILES = new Set(["spec.md"]);

function walk(root, dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walk(root, file, found);
    else if (CONTRACT_FILES.has(entry.name)) found.push(relative(root, file));
  }
  return found;
}

function structuralIssues(root, changeId) {
  const issues = [];
  const dir = join(root, "openspec", "changes", changeId, "specs");
  for (const path of walk(root, dir)) {
    const text = readFileSync(join(root, path), "utf8");
    const lines = text.split("\n");
    let delta = null;
    let previous = "";
    const seenScenarios = new Set();
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const rootHeading = /^##\s+(.+?)\s*$/.exec(line);
      if (rootHeading) {
        if (!ALLOWED_ROOTS.has(rootHeading[1]) && !DELTA_HEADING.test(line))
          issues.push(
            `${path}:${index + 1} unsupported level-two heading '${rootHeading[1]}'`,
          );
        delta = DELTA_HEADING.exec(line)?.[1] ?? null;
        previous = line;
        continue;
      }
      const requirement = REQUIREMENT.exec(line);
      if (requirement && !delta) {
        issues.push(
          `${path}:${index + 1} requirement is outside a delta section`,
        );
      }
      const scenario = SCENARIO.exec(line);
      if (!scenario) {
        previous = line;
        continue;
      }
      if (seenScenarios.has(scenario[1]))
        issues.push(
          `${path}:${index + 1} scenario ${scenario[1]} is duplicated`,
        );
      seenScenarios.add(scenario[1]);
      const marker = TRACE.exec(previous.trim());
      if (delta === "MODIFIED" && !marker)
        issues.push(
          `${path}:${index + 1} scenario ${scenario[1]} is missing its adjacent trace marker`,
        );
      previous = line;
    }
  }
  return issues;
}

function validateWithCli(root, changeId) {
  const run = spawnSync(
    "pnpm",
    ["run", "validate:changes", changeId, "--strict"],
    { cwd: root, encoding: "utf8", maxBuffer: Infinity },
  );
  return {
    status: run.status ?? 1,
    output: `${run.stdout ?? ""}${run.stderr ?? ""}`.trim(),
  };
}

export function runPreflight(
  root,
  changeId,
  { validate = validateWithCli } = {},
) {
  const scope = buildReviewScope(root, changeId);
  const validation = validate(root, changeId);
  const blockers = [
    ...(validation.status === 0
      ? []
      : [validation.output || "validate:changes refused the change"]),
    ...structuralIssues(root, changeId),
  ];
  return {
    ...scope,
    expandToFullSources: scope.expandToFullSources || blockers.length > 0,
    expansionReasons:
      blockers.length > 0
        ? [
            ...scope.expansionReasons,
            "preflight blockers require full-source review",
          ]
        : scope.expansionReasons,
    status: blockers.length === 0 ? "ready" : "blocked",
    blockers,
    validation: { status: validation.status },
  };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const positional = args.filter((one) => !one.startsWith("--"));
  const [changeId] = positional;
  const rootAt = args.indexOf("--root");
  const root = rootAt < 0 ? HERE : args[rootAt + 1];
  if (!changeId || !root) {
    console.error(
      "usage: pnpm plan:review-preflight <change-id> [--json] [--root <store>]",
    );
    process.exitCode = 2;
  } else {
    const result = runPreflight(root, changeId);
    if (json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log(`${changeId} review preflight: ${result.status}`);
      if (result.blockers.length > 0)
        for (const blocker of result.blockers) console.error(`- ${blocker}`);
      console.log(
        `Scope: ${result.changedRequirements.length} requirements, ${result.pageLines.length} PRD lines, ${result.durableTargets.length} durable targets, ${result.overlaps.length} overlaps`,
      );
      if (result.expandToFullSources)
        console.log(
          `Expand review to full sources: ${result.expansionReasons.join("; ")}`,
        );
    }
    process.exitCode = result.status === "ready" ? 0 : 1;
  }
}
