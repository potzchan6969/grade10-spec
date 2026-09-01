#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { repoRoot } from "./annotation-cli.mjs";
import {
  IMPACT_SCHEMA_VERSION,
  impactExitCodeFor,
  validateImpactReview,
} from "./annotation-impact.mjs";
import { normalizeScope } from "./annotation-scope.mjs";

function blockedResult(reason, { scope = null, report = null, ids = [] } = {}) {
  const observationDigest =
    report?.observationDigest ?? report?.scanner?.observationDigest ?? null;
  return {
    schemaVersion: IMPACT_SCHEMA_VERSION,
    scope,
    observationDigest,
    selectedIds: ids,
    findings: [],
    acceptanceEligibleIds: [],
    planningGroups: [],
    blockedIds: [...ids],
    status: "blocked",
    blockers: [{ kind: "invalid-impact-review", reason }],
    exitCode: 2,
  };
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(resolve(path), "utf8"));
  } catch (error) {
    throw new Error(
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function renderImpactHuman(result) {
  if (result.status === "blocked") {
    return [
      `✗ Impact review blocked (${result.blockers.length} blocker(s)).`,
      ...result.blockers.map((blocker) => `  ${blocker.reason}`),
    ].join("\n");
  }
  const lines = [
    result.status === "planning"
      ? `✗ Impact review found ${result.planningGroups.reduce((count, group) => count + group.findingIds.length, 0)} gap(s) requiring planning.`
      : `✓ Impact review complete for ${result.selectedIds.length} finding(s).`,
    `  acceptance eligible: ${result.acceptanceEligibleIds.join(", ") || "none"}`,
  ];
  for (const group of result.planningGroups)
    lines.push(
      `  planning: ${group.findingIds.join(", ")} → ${group.planningLane} (${group.proposedChangeName})`,
    );
  return lines.join("\n");
}

export async function runCli({
  argv = process.argv.slice(2),
  storeRoot = repoRoot,
} = {}) {
  let values;
  let output;
  let parsedReport = null;
  let parsedIds = [];
  let parsedScope = null;
  try {
    ({ values } = parseArgs({
      args: argv.filter((arg) => arg !== "--"),
      options: {
        ids: { type: "string" },
        json: { type: "boolean", default: false },
        report: { type: "string" },
        review: { type: "string" },
        scope: { type: "string" },
      },
      strict: true,
    }));
    const scope = normalizeScope(values.scope);
    parsedScope = scope;
    if (!values.report) throw new Error("--report is required");
    if (!values.ids) throw new Error("--ids is required");
    if (!values.review) throw new Error("--review is required");
    const ids = values.ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    parsedIds = ids;
    if (!ids.length) throw new Error("--ids must contain at least one ID");
    const report = await readJson(
      resolve(storeRoot, values.report),
      "annotation report",
    );
    parsedReport = report;
    const review = await readJson(
      resolve(storeRoot, values.review),
      "impact review",
    );
    output = validateImpactReview({
      scope,
      report,
      ids,
      review,
      storeRoot,
    });
  } catch (error) {
    const scope =
      parsedScope ??
      (typeof values?.scope === "string" ? values.scope.trim() || null : null);
    const ids = parsedIds.length
      ? parsedIds
      : typeof values?.ids === "string"
        ? values.ids
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        : [];
    output = blockedResult(
      error instanceof Error ? error.message : String(error),
      {
        scope,
        report: parsedReport,
        ids,
      },
    );
  }
  if (values?.json) console.log(JSON.stringify(output, null, 2));
  else console.log(renderImpactHuman(output));
  return impactExitCodeFor(output);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  runCli()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(
        `✗ ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exitCode = 2;
    });
}
