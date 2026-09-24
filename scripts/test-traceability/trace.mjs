#!/usr/bin/env node

import { randomUUID } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceExtensions = new Set([
  ".cjs",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",
]);
const skippedDirectories = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".turbo",
  ".vercel",
  "build",
  "coverage",
  "dist",
  "external",
  "node_modules",
  "vendor",
]);

const usage = `Usage:
  pnpm run trace -- init scenario --file <path> --target <exact heading line> --key <semantic-key> [--dry-run]
  pnpm run trace -- init case --file <path> --target <exact case heading line> --covers <scn_id[,scn_id...]> [--dry-run]
  pnpm run trace -- link --file <path> --target <exact test line> (--acceptance <tcase_id@revision> | --supports <scn_id>) [--dry-run]
  pnpm run trace -- validate [--store-root <path>] [--app-root <Grade10 root>]
  pnpm run trace -- report [--store-root <path>] [--app-root <Grade10 root>] [--json]

Mutating commands require one exact file and one exact, unique target line. Markers are inserted immediately above that line. Use --store-root only for an alternate store or isolated fixtures.`;

function fail(message) {
  throw new Error(message);
}

function inside(root, path) {
  const rel = relative(resolve(root), resolve(path));
  return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== "..");
}

function displayPath(path, roots) {
  const resolved = resolve(path);
  for (const root of [roots.appRoot, roots.storeRoot].filter(Boolean)) {
    if (inside(root, resolved)) return relative(root, resolved) || ".";
  }
  return resolved;
}

function walk(root, predicate, current = root) {
  if (!existsSync(current)) return [];
  const found = [];
  const entries = readdirSync(current, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const entry of entries) {
    const path = resolve(current, entry.name);
    if (entry.isDirectory()) {
      if (skippedDirectories.has(entry.name) || entry.name.startsWith("."))
        continue;
      found.push(...walk(root, predicate, path));
    } else if (entry.isFile() && predicate(path)) {
      found.push(path);
    }
  }
  return found;
}

function sourceFiles(storeRoot, appRoot) {
  const specsRoot = resolve(storeRoot, "openspec/specs");
  if (!existsSync(specsRoot))
    fail(`OpenSpec specs directory not found under --store-root: ${specsRoot}`);

  const files = walk(specsRoot, (path) => extname(path) === ".md").map(
    (file) => ({ file, root: storeRoot, kind: "store" }),
  );
  const changesRoot = resolve(storeRoot, "openspec/changes");
  for (const file of walk(changesRoot, (path) => extname(path) === ".md")) {
    if (relative(changesRoot, file).split(sep)[0] === "archive") continue;
    files.push({ file, root: storeRoot, kind: "store" });
  }

  if (appRoot) {
    const appPath = resolve(appRoot);
    if (!existsSync(appPath)) fail(`--app-root does not exist: ${appPath}`);
    files.push(
      ...walk(appPath, (path) => sourceExtensions.has(extname(path))).map(
        (file) => ({ file, root: appPath, kind: "app" }),
      ),
    );
  }
  return files.sort((a, b) => a.file.localeCompare(b.file));
}

function traceComment(line) {
  const html = /^\s*<!--\s*trace:([\s\S]*?)\s*-->\s*$/.exec(line);
  if (html) return { syntax: "html", body: html[1].trim() };
  const lineComment = /^\s*\/\/\s*trace:([^\r\n]*?)\s*$/.exec(line);
  if (lineComment) return { syntax: "line", body: lineComment[1].trim() };
  return null;
}

function attributes(text, issue) {
  const result = {};
  for (const token of text.trim().split(/\s+/).filter(Boolean)) {
    const match = /^([a-z]+)=([^\s]+)$/.exec(token);
    if (!match) {
      issue("marker-shape", `invalid marker field: ${token}`);
      continue;
    }
    const [, key, value] = match;
    if (Object.hasOwn(result, key)) {
      issue("marker-shape", `duplicate marker field: ${key}`);
      continue;
    }
    result[key] = value;
  }
  return result;
}

function checkFields(record, expected, issue) {
  const actual = Object.keys(record);
  for (const field of expected) {
    if (!Object.hasOwn(record, field)) issue("marker-shape", `missing ${field}`);
  }
  for (const field of actual) {
    if (!expected.includes(field))
      issue("marker-shape", `unexpected field: ${field}`);
  }
}

function validId(type, id) {
  return new RegExp(`^${type}_[a-z0-9][a-z0-9_-]*$`).test(id ?? "");
}

function positiveRevision(value) {
  return /^\d+$/.test(value ?? "") && Number(value) > 0;
}

function semanticKey(value) {
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value ?? "");
}

function positionalKey(value) {
  return /^(?:[a-z0-9]+-)*(?:us|sc|tc)-\d+(?:-[a-z0-9]+)*$/i.test(
    value ?? "",
  );
}

function parseTraceGraph({ storeRoot = scriptRoot, appRoot = null } = {}) {
  const roots = { storeRoot: resolve(storeRoot), appRoot: appRoot && resolve(appRoot) };
  const issues = [];
  const scenarios = [];
  const cases = [];
  const tests = [];
  const sources = sourceFiles(roots.storeRoot, roots.appRoot);

  for (const source of sources) {
    const text = readFileSync(source.file, "utf8");
    const lines = text.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const comment = traceComment(lines[index]);
      if (!comment) continue;
      const line = index + 1;
      const issue = (code, message) =>
        issues.push({ code, message, file: source.file, line });
      const nextLine = lines[index + 1] ?? "";

      if (comment.syntax === "html") {
        if (source.kind !== "store" || extname(source.file) !== ".md") {
          issue("marker-location", "scenario and case markers belong in store markdown");
          continue;
        }
        const marker = /^([a-z]+)(?:\s+([\s\S]*))?$/.exec(comment.body);
        if (!marker || !["scenario", "case"].includes(marker[1])) {
          issue("marker-kind", `unknown markdown trace marker: ${comment.body}`);
          continue;
        }
        const [, type, rawFields = ""] = marker;
        const fields = attributes(rawFields, issue);
        const expected = type === "scenario" ? ["id", "key", "rev"] : ["id", "rev", "covers"];
        checkFields(fields, expected, issue);
        const record = {
          type,
          id: fields.id ?? "",
          revision: fields.rev ?? "",
          file: source.file,
          line,
          key: fields.key ?? null,
          covers: [],
        };
        if (!validId(type === "scenario" ? "scn" : "tcase", record.id))
          issue("invalid-id", `invalid ${type} id: ${record.id || "(empty)"}`);
        if (!positiveRevision(record.revision))
          issue("invalid-revision", `revision must be a positive integer: ${record.revision || "(empty)"}`);

        if (type === "scenario") {
          if (!semanticKey(record.key))
            issue("invalid-key", `key must be a lower-case semantic slug: ${record.key ?? "(empty)"}`);
          if (positionalKey(record.key))
            issue("positional-key", `key cannot be a positional US, SC, or TC id: ${record.key}`);
          if (!/^\s*####\s+Scenario:\s+\S/.test(nextLine))
            issue("marker-adjacency", "scenario marker must sit immediately above a scenario heading");
          scenarios.push(record);
        } else {
          const rawCovers = fields.covers ?? "";
          record.covers = rawCovers.split(",").filter(Boolean);
          if (!record.covers.length)
            issue("marker-shape", "case marker must cover at least one scenario id");
          if (new Set(record.covers).size !== record.covers.length)
            issue("duplicate-cover", "case marker repeats a covered scenario id");
          for (const id of record.covers) {
            if (!validId("scn", id)) issue("invalid-reference", `invalid covered scenario id: ${id}`);
          }
          if (!/^\s*###\s+\S/.test(nextLine))
            issue("marker-adjacency", "case marker must sit immediately above a case heading");
          cases.push(record);
        }
        continue;
      }

      if (source.kind !== "app" || !sourceExtensions.has(extname(source.file))) {
        issue("marker-location", "test link markers belong in application source comments");
        continue;
      }
      if (!nextLine.trim() || /^\s*(?:\/\/|\/\*|\*|<!--)/.test(nextLine))
        issue("marker-adjacency", "test marker must sit immediately above its test target");
      const [kind, ...rest] = comment.body.split("=");
      const value = rest.join("=");
      if (!["acceptance", "supports"].includes(kind) || !value) {
        issue("marker-kind", `unknown test trace marker: ${comment.body}`);
        continue;
      }
      if (kind === "acceptance") {
        const match = /^(tcase_[a-z0-9][a-z0-9_-]*)@(\d+)$/.exec(value);
        if (!match) {
          issue("invalid-reference", `acceptance must use tcase_id@revision: ${value}`);
          tests.push({ type: kind, value, file: source.file, line });
        } else {
          if (!positiveRevision(match[2]))
            issue("invalid-revision", `acceptance revision must be positive: ${match[2]}`);
          tests.push({
            type: kind,
            caseId: match[1],
            revision: match[2],
            file: source.file,
            line,
          });
        }
      } else {
        if (!validId("scn", value))
          issue("invalid-reference", `supports must name a scenario id: ${value}`);
        tests.push({ type: kind, scenarioId: value, file: source.file, line });
      }
    }
  }

  const byScenario = groupBy(scenarios, (record) => record.id);
  const byCase = groupBy(cases, (record) => record.id);
  duplicateIssues(byScenario, "scenario", issues);
  duplicateIssues(byCase, "case", issues);

  for (const record of cases) {
    for (const id of record.covers) {
      if (!byScenario.has(id))
        issues.push({ code: "unresolved-reference", message: `case ${record.id} covers unknown scenario ${id}`, file: record.file, line: record.line });
    }
  }

  for (const test of tests) {
    if (test.type === "acceptance" && test.caseId) {
      const matches = byCase.get(test.caseId) ?? [];
      if (matches.length === 0) {
        issues.push({ code: "unresolved-reference", message: `test accepts unknown case ${test.caseId}`, file: test.file, line: test.line });
      } else if (matches.length === 1 && test.revision !== matches[0].revision) {
        issues.push({ code: "stale-acceptance", message: `test accepts ${test.caseId}@${test.revision}, current case revision is ${matches[0].revision}`, file: test.file, line: test.line });
      }
    }
    if (test.type === "supports" && !byScenario.has(test.scenarioId)) {
      issues.push({ code: "unresolved-reference", message: `test supports unknown scenario ${test.scenarioId}`, file: test.file, line: test.line });
    }
  }

  const linkedScenarioIds = new Set(
    cases.flatMap((record) => record.covers.filter((id) => byScenario.has(id))),
  );
  for (const test of tests) {
    if (test.type === "supports" && byScenario.has(test.scenarioId))
      linkedScenarioIds.add(test.scenarioId);
  }
  const linkedCaseIds = new Set(
    tests
      .filter((test) => test.type === "acceptance" && test.caseId)
      .filter((test) => {
        const matchingCases = byCase.get(test.caseId) ?? [];
        return matchingCases.length === 1 && test.revision === matchingCases[0].revision;
      })
      .map((test) => test.caseId),
  );
  const unlinked = {
    scenarios: scenarios.filter((record) => !linkedScenarioIds.has(record.id)),
    cases: cases.filter((record) => !linkedCaseIds.has(record.id)),
  };

  return {
    roots,
    scenarios,
    cases,
    tests,
    issues,
    unlinked,
    links: validLinkCount(scenarios, cases, tests, byScenario, byCase),
  };
}

function groupBy(items, getKey) {
  const grouped = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }
  return grouped;
}

function duplicateIssues(grouped, type, issues) {
  for (const [id, records] of grouped) {
    if (id && records.length > 1) {
      for (const record of records) {
        issues.push({ code: "duplicate-id", message: `duplicate ${type} id ${id} (${records.length} records)`, file: record.file, line: record.line });
      }
    }
  }
}

function validLinkCount(scenarios, cases, tests, byScenario, byCase) {
  let count = 0;
  for (const record of cases) {
    for (const id of record.covers) if (byScenario.has(id)) count += 1;
  }
  for (const test of tests) {
    if (test.type === "supports" && byScenario.has(test.scenarioId)) count += 1;
    if (test.type === "acceptance" && test.caseId) {
      const records = byCase.get(test.caseId) ?? [];
      if (records.length === 1 && test.revision === records[0].revision) count += 1;
    }
  }
  return count;
}

function issueLine(issue, roots) {
  return `  ${displayPath(issue.file, roots)}:${issue.line} [${issue.code}] ${issue.message}`;
}

function summarize(graph) {
  const { scenarios, cases, tests, issues, unlinked } = graph;
  const lines = [
    `Trace validation: ${issues.length ? "FAIL" : "PASS"}`,
    `Scenarios: ${scenarios.length}`,
    `Cases: ${cases.length}`,
    `Test markers: ${tests.length}`,
    `Links: ${graph.links}`,
    `Unlinked scenarios: ${unlinked.scenarios.length}`,
    `Unlinked cases: ${unlinked.cases.length}`,
  ];
  if (issues.length) lines.push("Issues:", ...issues.map((issue) => issueLine(issue, graph.roots)));
  const unlinkedLines = [
    ...unlinked.scenarios.map((record) => `  scenario ${record.id} key=${record.key} rev=${record.revision} at ${displayPath(record.file, graph.roots)}:${record.line}`),
    ...unlinked.cases.map((record) => `  case ${record.id} rev=${record.revision} at ${displayPath(record.file, graph.roots)}:${record.line}`),
  ];
  if (unlinkedLines.length) lines.push("Unlinked records:", ...unlinkedLines);
  return lines.join("\n");
}

function reportObject(graph) {
  const issueOutput = graph.issues.map((issue) => ({
    ...issue,
    file: displayPath(issue.file, graph.roots),
  }));
  const recordOutput = (records) =>
    records.map((record) => ({
      ...record,
      file: displayPath(record.file, graph.roots),
    }));
  return {
    status: graph.issues.length ? "invalid" : "valid",
    counts: {
      scenarios: graph.scenarios.length,
      cases: graph.cases.length,
      tests: graph.tests.length,
      links: graph.links,
      unlinkedScenarios: graph.unlinked.scenarios.length,
      unlinkedCases: graph.unlinked.cases.length,
    },
    scenarios: recordOutput(graph.scenarios),
    cases: recordOutput(graph.cases),
    tests: recordOutput(graph.tests),
    unlinked: {
      scenarios: recordOutput(graph.unlinked.scenarios),
      cases: recordOutput(graph.unlinked.cases),
    },
    issues: issueOutput,
  };
}

function renderReport(graph) {
  const output = ["Trace report", summarize(graph).replace("Trace validation:", "Validation:")];
  output.push("Scenarios:");
  for (const record of graph.scenarios)
    output.push(`  ${record.id} key=${record.key} rev=${record.revision} at ${displayPath(record.file, graph.roots)}:${record.line}`);
  output.push("Cases:");
  for (const record of graph.cases)
    output.push(`  ${record.id} rev=${record.revision} covers=${record.covers.join(",")} at ${displayPath(record.file, graph.roots)}:${record.line}`);
  output.push("Tests:");
  for (const record of graph.tests) {
    const target = record.type === "acceptance" ? `${record.caseId ?? record.value}@${record.revision ?? "?"}` : record.scenarioId;
    output.push(`  ${record.type} ${target} at ${displayPath(record.file, graph.roots)}:${record.line}`);
  }
  return output.join("\n");
}

function exactTargetIndex(lines, target, file) {
  if (!target || target.includes("\n") || target.includes("\r"))
    fail("--target must be one exact source line");
  const matches = [];
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index] === target) matches.push(index);
  }
  if (matches.length === 0) fail(`exact target was not found in ${file}`);
  if (matches.length > 1)
    fail(`exact target is ambiguous in ${file} (${matches.length} matching lines)`);
  return matches[0];
}

function ensureNoAdjacentTrace(lines, index) {
  if (index > 0 && /\btrace:/.test(lines[index - 1]))
    fail("target already has an adjacent trace marker; marker ids and links are immutable");
}

function markerLineForMarkdown(marker, target) {
  const indent = /^\s*/.exec(target)?.[0] ?? "";
  return `${indent}<!-- ${marker} -->`;
}

function markerLineForCode(marker, target) {
  const indent = /^\s*/.exec(target)?.[0] ?? "";
  return `${indent}// ${marker}`;
}

function insertMarker({ file, target, marker, syntax, dryRun }) {
  const oldText = readFileSync(file, "utf8");
  const eol = oldText.includes("\r\n") ? "\r\n" : "\n";
  const lines = oldText.split(/\r?\n/);
  const index = exactTargetIndex(lines, target, file);
  ensureNoAdjacentTrace(lines, index);
  const rendered = syntax === "html" ? markerLineForMarkdown(marker, target) : markerLineForCode(marker, target);
  const nextLines = [...lines.slice(0, index), rendered, ...lines.slice(index)];
  const newText = nextLines.join(eol);
  const prefix = dryRun ? "DRY RUN" : "Updated";
  console.log(`${prefix}: ${file}:${index + 1}`);
  console.log(`+ ${rendered.trim()}`);
  if (dryRun) return;
  if (readFileSync(file, "utf8") !== oldText)
    fail(`file changed while preparing marker: ${file}`);
  writeFileSync(file, newText, "utf8");
}

function requireOption(values, key) {
  const value = values[key];
  if (!value) fail(`--${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)} is required`);
  return value;
}

function checkStoreMarkdownFile(file, storeRoot) {
  if (extname(file) !== ".md") fail("scenario and case markers require a Markdown file");
  if (!inside(storeRoot, file)) fail(`--file must be inside --store-root: ${storeRoot}`);
  const rel = relative(storeRoot, file).split(sep);
  if (rel[0] === "openspec" && rel[1] === "changes" && rel[2] === "archive")
    fail("scenario and case markers cannot be initialized inside openspec/changes/archive");
  if (!(rel[0] === "openspec" && (rel[1] === "specs" || rel[1] === "changes")))
    fail("scenario and case markers belong under openspec/specs or active openspec/changes");
}

function validateReferencesForMutation(storeRoot, referenceType, ids) {
  const graph = parseTraceGraph({ storeRoot });
  const collection = referenceType === "scenario" ? graph.scenarios : graph.cases;
  const index = groupBy(collection, (record) => record.id);
  for (const id of ids) {
    const matches = index.get(id) ?? [];
    if (matches.length !== 1)
      fail(`${referenceType} reference ${id} must resolve to exactly one marker; found ${matches.length}`);
  }
  return graph;
}

function initialize(kind, values) {
  const storeRoot = resolve(values.storeRoot ?? scriptRoot);
  const file = resolve(requireOption(values, "file"));
  const target = requireOption(values, "target");
  checkStoreMarkdownFile(file, storeRoot);
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const index = exactTargetIndex(lines, target, file);
  ensureNoAdjacentTrace(lines, index);
  const id = `${kind === "scenario" ? "scn" : "tcase"}_${randomUUID()}`;
  let marker;
  if (kind === "scenario") {
    if (!/^\s*####\s+Scenario:\s+\S/.test(target))
      fail("scenario target must be one exact #### Scenario heading line");
    const key = requireOption(values, "key");
    if (!semanticKey(key) || positionalKey(key))
      fail("--key must be a lower-case semantic slug, not a positional US, SC, or TC id");
    marker = `trace:scenario id=${id} key=${key} rev=1`;
  } else {
    if (!/^\s*###\s+\S/.test(target) || !/-TC\d+-\d+\s*:/i.test(target))
      fail("case target must be one exact ### case heading line with a case id");
    const covers = requireOption(values, "covers").split(",");
    if (covers.some((item) => !item) || new Set(covers).size !== covers.length)
      fail("--covers must be a comma-separated list of distinct scn_ ids");
    if (covers.some((item) => !validId("scn", item)))
      fail("--covers may contain only scn_ ids");
    validateReferencesForMutation(storeRoot, "scenario", covers);
    marker = `trace:case id=${id} rev=1 covers=${covers.join(",")}`;
  }
  insertMarker({ file, target, marker, syntax: "html", dryRun: values.dryRun });
}

function linkTest(values) {
  const file = resolve(requireOption(values, "file"));
  const target = requireOption(values, "target");
  if (!sourceExtensions.has(extname(file)))
    fail("test link markers require an application source file");
  const storeRoot = resolve(values.storeRoot ?? scriptRoot);
  const hasAcceptance = Boolean(values.acceptance);
  const hasSupport = Boolean(values.supports);
  if (hasAcceptance === hasSupport)
    fail("choose exactly one of --acceptance or --supports");

  let marker;
  if (hasAcceptance) {
    const match = /^(tcase_[a-z0-9][a-z0-9_-]*)@(\d+)$/.exec(values.acceptance);
    if (!match || !positiveRevision(match[2]))
      fail("--acceptance must be tcase_id@positive-revision");
    const graph = validateReferencesForMutation(storeRoot, "case", [match[1]]);
    const record = graph.cases.find((item) => item.id === match[1]);
    if (record.revision !== match[2])
      fail(`--acceptance revision ${match[2]} is stale; current ${match[1]} revision is ${record.revision}`);
    marker = `trace:acceptance=${values.acceptance}`;
  } else {
    if (!validId("scn", values.supports)) fail("--supports must be a scn_ id");
    validateReferencesForMutation(storeRoot, "scenario", [values.supports]);
    marker = `trace:supports=${values.supports}`;
  }
  insertMarker({ file, target, marker, syntax: "line", dryRun: values.dryRun });
}

function parseCommand(argv) {
  const command = argv[0];
  if (!command || command === "--help" || command === "-h") return { command: "help" };
  let kind = null;
  let args = argv.slice(1);
  if (command === "init") {
    kind = args[0];
    args = args.slice(1);
    if (!["scenario", "case"].includes(kind))
      fail("init requires scenario or case");
  }
  const normalizedArgs = args.map((arg) => {
    if (!arg.startsWith("--")) return arg;
    const equals = arg.indexOf("=");
    const option = equals === -1 ? arg.slice(2) : arg.slice(2, equals);
    const value = equals === -1 ? "" : arg.slice(equals);
    const camelOption = option.replace(/-([a-z])/g, (_match, letter) =>
      letter.toUpperCase(),
    );
    return `--${camelOption}${value}`;
  });
  const parsed = parseArgs({
    args: normalizedArgs,
    options: {
      acceptance: { type: "string" },
      appRoot: { type: "string" },
      covers: { type: "string" },
      dryRun: { type: "boolean", default: false },
      file: { type: "string" },
      help: { type: "boolean", short: "h", default: false },
      json: { type: "boolean", default: false },
      key: { type: "string" },
      storeRoot: { type: "string" },
      supports: { type: "string" },
      target: { type: "string" },
    },
    strict: true,
  });
  if (parsed.values.help) return { command: "help" };
  if (parsed.positionals.length) fail(`unexpected arguments: ${parsed.positionals.join(" ")}`);
  return { command, kind, values: parsed.values };
}

export function runCli(argv = process.argv.slice(2)) {
  try {
    const parsed = parseCommand(argv);
    if (parsed.command === "help") {
      console.log(usage);
      return 0;
    }
    const { values } = parsed;
    if (parsed.command === "init") {
      initialize(parsed.kind, values);
      return 0;
    }
    if (parsed.command === "link") {
      linkTest(values);
      return 0;
    }
    if (parsed.command === "validate" || parsed.command === "report") {
      const graph = parseTraceGraph({
        storeRoot: values.storeRoot ?? scriptRoot,
        appRoot: values.appRoot ?? null,
      });
      if (parsed.command === "report") {
        console.log(values.json ? JSON.stringify(reportObject(graph), null, 2) : renderReport(graph));
      } else {
        console.log(summarize(graph));
      }
      return graph.issues.length ? 1 : 0;
    }
    fail(`unknown command: ${parsed.command}`);
  } catch (error) {
    console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
    console.error(usage);
    return 2;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  process.exitCode = runCli();
}
