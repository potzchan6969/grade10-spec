#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import {
  buildReconciliationReport,
  loadActiveChanges,
  renderReport,
} from "./annotation-report.mjs";
import { normalizeScope } from "./annotation-scope.mjs";

function blockedReport(reason, scope = null) {
  return buildReconciliationReport({
    scope,
    scanner: {
      schemaVersion: 2,
      scope,
      status: "blocked",
      blockers: [{ kind: "invalid-input", reason }],
      findings: [],
      skippedRoots: [],
      scannedSources: [],
    },
  });
}

async function readMineOutput(path) {
  if (!path) return "";
  try {
    return await readFile(resolve(path), "utf8");
  } catch {
    return "";
  }
}

export async function runCli({ argv = process.argv.slice(2) } = {}) {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: {
      all: { type: "boolean", default: false },
      compact: { type: "boolean", default: false },
      json: { type: "boolean", default: false },
      mine: { type: "string" },
      scanner: { type: "string" },
      scope: { type: "string" },
      store: { type: "string" },
    },
    strict: true,
  });
  let scope = null;
  let report;
  try {
    scope = normalizeScope(values.scope);
    if (!values.scanner) throw new Error("--scanner is required");
    if (!values.store) throw new Error("--store is required");
    const scanner = JSON.parse(await readFile(resolve(values.scanner), "utf8"));
    if (scanner.scope !== scope)
      throw new Error("scanner scope does not match requested scope");
    const changes = await loadActiveChanges(resolve(values.store));
    const mine = await readMineOutput(values.mine);
    const currentHandle = /^\s*@?([\w.-]+)\s*$/m.exec(mine)?.[1] ?? null;
    report = buildReconciliationReport({
      scanner,
      scope,
      currentHandle,
      changes,
    });
  } catch (error) {
    report = blockedReport(
      error instanceof Error ? error.message : String(error),
      scope,
    );
  }
  if (values.json) console.log(JSON.stringify(report, null, 2));
  else
    console.log(
      renderReport(report, { compact: values.compact && !values.all }),
    );
  return report.status === "blocked" ? 2 : report.status === "drift" ? 1 : 0;
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
