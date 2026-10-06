#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { cliArgs } from "../openspec/lib/args.mjs";

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
const allowedApps = new Set(["g10", "zzz", "g10adm", "zzzadm"]);

const usage = `Usage:
  pnpm run trace -- init scenario --file <path> --target <exact heading line> --app <g10|zzz|g10adm|zzzadm> --product <slug> --capability <slug> [--dry-run]
  pnpm run trace -- init case --file <path> --target <exact case heading line> --app <g10|zzz|g10adm|zzzadm> --product <slug> --capability <slug> --covers <SC-ref[,SC-ref...]> [--dry-run]
  pnpm run trace -- init batch --manifest <json-file> [--dry-run]
  pnpm run trace -- link --file <path> --target <exact test line> (--acceptance <TC-ref@revision> | --supports <SC-ref>) [--dry-run]
  pnpm run trace -- validate [--store-root <path>] [--app-root <Grade10 root>]
  pnpm run trace -- fold --change <id> [--store-root <path>]
  pnpm run trace -- report [--store-root <path>] [--app-root <Grade10 root>] [--json]

Mutating commands require one exact file and one exact, unique target line. Markers are inserted immediately above that line. Use --store-root only for an alternate store or isolated fixtures. fold validates the pre-archive feature case handover for one active change.`;

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
    if (!Object.hasOwn(record, field))
      issue("marker-shape", `missing ${field}`);
  }
  for (const field of actual) {
    if (!expected.includes(field))
      issue("marker-shape", `unexpected field: ${field}`);
  }
}

const referencePattern =
  /^([a-z][a-z0-9]*)\.([a-z][a-z0-9]*(?:-[a-z0-9]+)+)\.(US|SC|TC)-([0-9a-z]{3})$/i;

function parseReference(value) {
  const match = referencePattern.exec(value ?? "");
  if (!match) return null;
  const [, app, scope, kind, sequence] = match;
  const canonical = `${app.toLowerCase()}.${scope.toLowerCase()}.${kind.toUpperCase()}-${sequence.toLowerCase()}`;
  return {
    app: app.toLowerCase(),
    scope: scope.toLowerCase(),
    kind: kind.toUpperCase(),
    sequence: sequence.toLowerCase(),
    canonical,
  };
}

function canonicalMarkerReference(value, expectedKind, issue, label) {
  const parsed = parseReference(value);
  if (!parsed) {
    issue("invalid-id", `invalid ${label}: ${value || "(empty)"}`);
    return value ?? "";
  }
  if (!allowedApps.has(parsed.app))
    issue(
      "invalid-app",
      `${label} uses unknown app ${parsed.app}; allowed apps are ${[...allowedApps].join(", ")}`,
    );
  if (value !== parsed.canonical)
    issue(
      "noncanonical-id",
      `${label} must use canonical form ${parsed.canonical}: ${value}`,
    );
  if (parsed.kind !== expectedKind)
    issue("invalid-id-kind", `${label} must use ${expectedKind}: ${value}`);
  return parsed.canonical;
}

function normalizeInputReference(value, expectedKind, option) {
  const parsed = parseReference(value);
  if (!parsed)
    fail(
      `${option} must use <app>.<product>-<capability>.${expectedKind}-<3-character-base36-sequence>`,
    );
  if (!allowedApps.has(parsed.app))
    fail(
      `${option} app must be one of ${[...allowedApps].join(", ")}: ${parsed.app}`,
    );
  if (parsed.kind !== expectedKind)
    fail(`${option} must reference a ${expectedKind} id: ${value}`);
  return parsed.canonical;
}

function positiveRevision(value) {
  return /^\d+$/.test(value ?? "") && Number(value) > 0;
}

function caseHeadingRevision(heading) {
  const match = /^\s*###\s+.*?TC\d+-(\d+)\s*:\s*\S/.exec(heading);
  return match && positiveRevision(match[1]) ? match[1] : null;
}

function deprecatedCaseAt(lines, headingIndex) {
  if (!/^\s*###\s+\S/.test(lines[headingIndex] ?? "")) return false;
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    if (/^\s*###\s+\S/.test(lines[index])) break;
    if (
      /^\s*\*\s+(?:\*\*)?Status:(?:\*\*)?\s+deprecated\s*$/i.test(lines[index])
    )
      return true;
  }
  return false;
}

/** The scenarios a case marker covers, read one way by `validate` and `fold`:
 * `covers=none` stands only above a deprecated case, which covers nothing. */
function caseMarkerCovers(rawCovers, lines, markerIndex, issue) {
  const retired =
    rawCovers === "none" && deprecatedCaseAt(lines, markerIndex + 1);
  if (rawCovers === "none" && !retired)
    issue(
      "invalid-empty-coverage",
      "covers=none is allowed only for a deprecated case",
    );
  const ids = retired ? [] : rawCovers.split(",");
  if (ids.some((id) => !id))
    issue(
      "marker-shape",
      "case marker covers must be non-empty comma-delimited scenario ids",
    );
  const covers = ids
    .filter(Boolean)
    .map((id) =>
      canonicalMarkerReference(id, "SC", issue, "covered scenario id"),
    );
  if (new Set(covers).size !== covers.length)
    issue("duplicate-cover", "case marker repeats a covered scenario id");
  if (!/^\s*###\s+\S/.test(lines[markerIndex + 1] ?? ""))
    issue(
      "marker-adjacency",
      "case marker must sit immediately above a case heading",
    );
  return covers;
}

function isSuiteFile(file) {
  return [
    "feature-tcs.md",
    "domain-tcs.md",
    "product-tcs.md",
    "platform-tcs.md",
  ].includes(file.split(sep).at(-1));
}

function caseHeadings(lines) {
  const headings = [];
  for (let index = 0; index < lines.length; index += 1) {
    const revision = caseHeadingRevision(lines[index]);
    if (revision) headings.push({ index, revision });
  }
  return headings;
}

function normalizeSlug(value, option) {
  const normalized = value.toLowerCase();
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(normalized))
    fail(
      `${option} must be a lower-case slug made of letters, numbers, and single hyphens`,
    );
  return normalized;
}

function normalizeApp(value, option) {
  const app = value.toLowerCase();
  if (!allowedApps.has(app))
    fail(`${option} must be one of ${[...allowedApps].join(", ")}`);
  return app;
}

function formatReference(app, product, kind, capability, sequence) {
  return `${app}.${product}-${capability}.${kind}-${sequence}`;
}

function nextSequence(storeRoot, app, product, capability, kind, target) {
  const scope = `${product}-${capability}`;
  const markdownRoots = [
    resolve(storeRoot, "openspec/specs"),
    resolve(storeRoot, "openspec/changes"),
  ];
  const files = markdownRoots.flatMap((root) =>
    walk(root, (path) => extname(path) === ".md"),
  );
  const used = new Set();
  for (const file of files) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const comment = traceComment(line);
      if (comment?.syntax !== "html") continue;
      const marker = /^([a-z]+)(?:\s+([\s\S]*))?$/.exec(comment.body);
      if (!marker || !["scenario", "case"].includes(marker[1])) continue;
      const id = /(?:^|\s)id=([^\s]+)/.exec(marker[2] ?? "")?.[1];
      const parsed = parseReference(id);
      if (parsed?.app === app && parsed.scope === scope) {
        used.add(parsed.sequence);
      }
    }
  }
  return allocateSequence(used, app, product, capability, kind, target);
}

function allocateSequence(used, app, product, capability, kind, target) {
  const scope = `${product}-${capability}`;
  const seed = `${app}.${scope}.${kind}\0${target}`;
  const digest = createHash("sha256").update(seed).digest();
  const start = digest.readUInt32BE(0) % 36 ** 3;
  for (let offset = 0; offset < 36 ** 3; offset += 1) {
    const candidate = ((start + offset) % 36 ** 3)
      .toString(36)
      .padStart(3, "0");
    if (!/^\d{3}$/.test(candidate) && !used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
  fail(`no trace sequence remains for ${app}.${scope}`);
}

function checkMarkdownMarkerScope(value, currentScope, issue) {
  const parsed = parseReference(value);
  if (!parsed) return currentScope;
  const scope = `${parsed.app}.${parsed.scope}`;
  if (currentScope && currentScope !== scope)
    issue(
      "scope-mismatch",
      `scenario and case marker ids in one Markdown file must share one <app>.<product>-<capability> prefix; found ${currentScope} and ${scope}`,
    );
  return currentScope ?? scope;
}

export function parseTraceGraph({
  storeRoot = scriptRoot,
  appRoot = null,
} = {}) {
  const roots = {
    storeRoot: resolve(storeRoot),
    appRoot: appRoot && resolve(appRoot),
  };
  const issues = [];
  const scenarios = [];
  const cases = [];
  const tests = [];
  const sources = sourceFiles(roots.storeRoot, roots.appRoot);

  for (const source of sources) {
    const text = readFileSync(source.file, "utf8");
    const lines = text.split(/\r?\n/);
    let markerScope = null;
    for (let index = 0; index < lines.length; index += 1) {
      const comment = traceComment(lines[index]);
      if (!comment) continue;
      const line = index + 1;
      const issue = (code, message) =>
        issues.push({ code, message, file: source.file, line });
      const nextLine = lines[index + 1] ?? "";

      if (comment.syntax === "html") {
        if (source.kind !== "store" || extname(source.file) !== ".md") {
          issue(
            "marker-location",
            "scenario and case markers belong in store markdown",
          );
          continue;
        }
        const marker = /^([a-z]+)(?:\s+([\s\S]*))?$/.exec(comment.body);
        if (!marker || !["scenario", "case"].includes(marker[1])) {
          issue(
            "marker-kind",
            `unknown markdown trace marker: ${comment.body}`,
          );
          continue;
        }
        const [, type, rawFields = ""] = marker;
        const fields = attributes(rawFields, issue);
        const expected =
          type === "scenario" ? ["id", "rev"] : ["id", "rev", "covers"];
        checkFields(fields, expected, issue);
        const kind = type === "scenario" ? "SC" : "TC";
        const record = {
          type,
          id: canonicalMarkerReference(
            fields.id ?? "",
            kind,
            issue,
            `${type} id`,
          ),
          revision: fields.rev ?? "",
          file: source.file,
          line,
          covers: [],
        };
        markerScope = checkMarkdownMarkerScope(fields.id, markerScope, issue);
        if (!positiveRevision(record.revision))
          issue(
            "invalid-revision",
            `revision must be a positive integer: ${record.revision || "(empty)"}`,
          );

        if (type === "scenario") {
          if (!/^\s*####\s+Scenario:\s+\S/.test(nextLine))
            issue(
              "marker-adjacency",
              "scenario marker must sit immediately above a scenario heading",
            );
          scenarios.push(record);
        } else {
          record.covers = caseMarkerCovers(
            fields.covers ?? "",
            lines,
            index,
            issue,
          );
          cases.push(record);
        }
        continue;
      }

      if (
        source.kind !== "app" ||
        !sourceExtensions.has(extname(source.file))
      ) {
        issue(
          "marker-location",
          "test link markers belong in application source comments",
        );
        continue;
      }
      if (!nextLine.trim() || /^\s*(?:\/\/|\/\*|\*|<!--)/.test(nextLine))
        issue(
          "marker-adjacency",
          "test marker must sit immediately above its test target",
        );
      const [kind, ...rest] = comment.body.split("=");
      const value = rest.join("=");
      if (!["acceptance", "supports"].includes(kind) || !value) {
        issue("marker-kind", `unknown test trace marker: ${comment.body}`);
        continue;
      }
      if (kind === "acceptance") {
        const match = /^(.+)@(\d+)$/.exec(value);
        if (!match) {
          issue(
            "invalid-reference",
            `acceptance must use <app>.<product>-<capability>.TC-<3-character-base36-sequence>@revision: ${value}`,
          );
          tests.push({ type: kind, value, file: source.file, line });
        } else {
          const caseId = canonicalMarkerReference(
            match[1],
            "TC",
            issue,
            "acceptance case id",
          );
          if (!positiveRevision(match[2]))
            issue(
              "invalid-revision",
              `acceptance revision must be positive: ${match[2]}`,
            );
          tests.push({
            type: kind,
            caseId,
            revision: match[2],
            file: source.file,
            line,
          });
        }
      } else {
        const scenarioId = canonicalMarkerReference(
          value,
          "SC",
          issue,
          "supported scenario id",
        );
        tests.push({ type: kind, scenarioId, file: source.file, line });
      }
    }
  }

  const suiteCaseCounts = { total: 0, marked: 0, unmarked: 0 };
  for (const source of sources) {
    if (source.kind !== "store" || !isSuiteFile(source.file)) continue;
    const lines = readFileSync(source.file, "utf8").split(/\r?\n/);
    for (const heading of caseHeadings(lines)) {
      suiteCaseCounts.total += 1;
      const marker = traceComment(lines[heading.index - 1] ?? "");
      const matchingCase =
        marker?.syntax === "html" && marker.body.startsWith("case ")
          ? cases.find(
              (record) =>
                record.file === source.file && record.line === heading.index,
            )
          : null;
      const issue = (code, message) =>
        issues.push({
          code,
          message,
          file: source.file,
          line: heading.index + 1,
        });
      if (!matchingCase) {
        suiteCaseCounts.unmarked += 1;
        issue(
          "missing-case-marker",
          "every suite case must have an adjacent trace:case marker",
        );
        continue;
      }
      suiteCaseCounts.marked += 1;
      if (matchingCase.revision !== heading.revision)
        issue(
          "case-revision-mismatch",
          `case marker revision ${matchingCase.revision} must match heading revision ${heading.revision}`,
        );
    }
  }

  const byScenario = groupBy(scenarios, (record) => record.id);
  const byCase = groupBy(cases, (record) => record.id);
  duplicateIssues(byScenario, "scenario", issues);
  duplicateIssues(byCase, "case", issues);

  for (const record of cases) {
    for (const id of record.covers) {
      if (!byScenario.has(id))
        issues.push({
          code: "unresolved-reference",
          message: `case ${record.id} covers unknown scenario ${id}`,
          file: record.file,
          line: record.line,
        });
    }
  }

  for (const test of tests) {
    if (test.type === "acceptance" && test.caseId) {
      const matches = byCase.get(test.caseId) ?? [];
      if (matches.length === 0) {
        issues.push({
          code: "unresolved-reference",
          message: `test accepts unknown case ${test.caseId}`,
          file: test.file,
          line: test.line,
        });
      } else if (
        matches.length === 1 &&
        test.revision !== matches[0].revision
      ) {
        issues.push({
          code: "stale-acceptance",
          message: `test accepts ${test.caseId}@${test.revision}, current case revision is ${matches[0].revision}`,
          file: test.file,
          line: test.line,
        });
      }
    }
    if (test.type === "supports" && !byScenario.has(test.scenarioId)) {
      issues.push({
        code: "unresolved-reference",
        message: `test supports unknown scenario ${test.scenarioId}`,
        file: test.file,
        line: test.line,
      });
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
        return (
          matchingCases.length === 1 &&
          test.revision === matchingCases[0].revision
        );
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
    suiteCaseCounts,
    issues,
    unlinked,
    links: validLinkCount(cases, tests, byScenario, byCase),
  };
}

function readCaseMarkers(file, issues) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const records = [];
  let markerScope = null;
  for (let index = 0; index < lines.length; index += 1) {
    const comment = traceComment(lines[index]);
    if (comment?.syntax !== "html") continue;
    const marker = /^([a-z]+)(?:\s+([\s\S]*))?$/.exec(comment.body);
    if (marker?.[1] !== "case") {
      if (comment.body.toLowerCase().startsWith("case")) {
        issues.push({
          code: "marker-kind",
          message: `invalid case marker: ${comment.body}`,
          file,
          line: index + 1,
        });
      }
      continue;
    }

    const line = index + 1;
    const issue = (code, message) => issues.push({ code, message, file, line });
    const fields = attributes(marker[2] ?? "", issue);
    checkFields(fields, ["id", "rev", "covers"], issue);
    const id = canonicalMarkerReference(
      fields.id ?? "",
      "TC",
      issue,
      "case id",
    );
    markerScope = checkMarkdownMarkerScope(fields.id, markerScope, issue);
    const revision = fields.rev ?? "";
    if (!positiveRevision(revision))
      issue(
        "invalid-revision",
        `revision must be a positive integer: ${revision || "(empty)"}`,
      );

    const covers = fields.covers ?? "";
    const canonicalCovers = caseMarkerCovers(covers, lines, index, issue);

    records.push({
      id,
      fields: {
        id: fields.id ?? "",
        rev: revision,
        covers,
      },
      coveredIds: canonicalCovers,
      file,
      line,
    });
  }
  return records;
}

function scenarioIdsUnder(directory, issues = null) {
  const ids = new Set();
  for (const file of walk(directory, (path) => extname(path) === ".md")) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    let markerScope = null;
    for (let index = 0; index < lines.length; index += 1) {
      const comment = traceComment(lines[index]);
      if (comment?.syntax !== "html") continue;
      const marker = /^(scenario|case)\s+([\s\S]+)$/.exec(comment.body);
      if (!marker) continue;
      const fields = {};
      for (const token of marker[2].trim().split(/\s+/).filter(Boolean)) {
        const field = /^([a-z]+)=([^\s]+)$/.exec(token);
        if (field) fields[field[1]] = field[2];
      }
      const line = index + 1;
      const issue = (code, message) =>
        issues?.push({ code, message, file, line });
      markerScope = checkMarkdownMarkerScope(fields.id, markerScope, issue);
      if (marker[1] !== "scenario") continue;
      const parsed = parseReference(fields.id);
      if (
        parsed?.kind === "SC" &&
        allowedApps.has(parsed.app) &&
        fields.id === parsed.canonical &&
        positiveRevision(fields.rev)
      ) {
        ids.add(parsed.canonical);
      }
    }
  }
  return ids;
}

function scenarioIdsInActiveStore(storeRoot) {
  const specsRoot = resolve(storeRoot, "openspec/specs");
  const changesRoot = resolve(storeRoot, "openspec/changes");
  const ids = scenarioIdsUnder(specsRoot);
  if (!existsSync(changesRoot)) return ids;
  for (const entry of readdirSync(changesRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "archive") continue;
    for (const id of scenarioIdsUnder(resolve(changesRoot, entry.name)))
      ids.add(id);
  }
  return ids;
}

function validateFoldHandover({ storeRoot = scriptRoot, changeId }) {
  const roots = { storeRoot: resolve(storeRoot), appRoot: null };
  const specsRoot = resolve(roots.storeRoot, "openspec/specs");
  const changesRoot = resolve(roots.storeRoot, "openspec/changes");
  if (!existsSync(specsRoot))
    fail(`OpenSpec specs directory not found under --store-root: ${specsRoot}`);
  if (!changeId) fail("--change is required");
  if (
    changeId !== changeId.trim() ||
    changeId === "." ||
    changeId === ".." ||
    changeId === "archive" ||
    changeId.includes("/") ||
    changeId.includes("\\")
  ) {
    fail(
      "--change must name one active change directory, not a path or archive directory",
    );
  }
  const changeRoot = resolve(changesRoot, changeId);
  if (!inside(changesRoot, changeRoot) || !existsSync(changeRoot))
    fail(`active change directory not found: ${changeRoot}`);
  const changeSpecsRoot = resolve(changeRoot, "specs");
  if (!existsSync(changeSpecsRoot))
    fail(`change specs directory not found: ${changeSpecsRoot}`);

  const suiteFiles = walk(
    changeSpecsRoot,
    (path) =>
      extname(path) === ".md" && path.split(sep).at(-1) === "feature-tcs.md",
  );
  if (!suiteFiles.length)
    fail(`no capability feature-tcs.md files found for change ${changeId}`);

  const issues = [];
  let caseCount = 0;
  const knownScenarioIds = scenarioIdsInActiveStore(roots.storeRoot);
  for (const activeSuite of suiteFiles) {
    const capabilityRelative = relative(changeSpecsRoot, dirname(activeSuite));
    const capabilityParts = capabilityRelative.split(sep);
    if (capabilityParts.length !== 3) {
      issues.push({
        code: "capability-path",
        message:
          "feature-tcs.md must be under specs/<product>/<domain>/<capability>",
        file: activeSuite,
        line: 1,
      });
      continue;
    }

    const activeCapability = dirname(activeSuite);
    const durableCapability = resolve(specsRoot, capabilityRelative);
    const durableSuite = resolve(durableCapability, "feature-tcs.md");
    const activeCases = readCaseMarkers(activeSuite, issues);
    const durableCases = existsSync(durableSuite)
      ? readCaseMarkers(durableSuite, issues)
      : [];
    caseCount += activeCases.length;

    scenarioIdsUnder(activeCapability, issues);
    scenarioIdsUnder(durableCapability, issues);

    const activeById = groupBy(activeCases, (record) => record.id);
    for (const [id, records] of activeById) {
      if (id && records.length > 1) {
        for (const record of records) {
          issues.push({
            code: "duplicate-source-marker",
            message: `duplicate active case marker ${id} (${records.length} markers)`,
            file: record.file,
            line: record.line,
          });
        }
      }
    }

    const durableById = groupBy(durableCases, (record) => record.id);
    for (const activeCase of activeCases) {
      for (const coveredId of activeCase.coveredIds) {
        if (!knownScenarioIds.has(coveredId)) {
          issues.push({
            code: "unresolved-reference",
            message: `case ${activeCase.id} covers unknown scenario ${coveredId} in the active or durable store`,
            file: activeCase.file,
            line: activeCase.line,
          });
        }
      }

      const targets = durableById.get(activeCase.id) ?? [];
      if (!targets.length) {
        issues.push({
          code: "missing-case",
          message: `durable case marker ${activeCase.id} is missing from ${displayPath(durableSuite, roots)}`,
          file: activeCase.file,
          line: activeCase.line,
        });
        continue;
      }
      if (targets.length > 1) {
        for (const target of targets) {
          issues.push({
            code: "duplicate-target-marker",
            message: `durable case marker ${activeCase.id} appears ${targets.length} times in ${displayPath(durableSuite, roots)}`,
            file: target.file,
            line: target.line,
          });
        }
        continue;
      }

      const [target] = targets;
      for (const field of ["id", "rev", "covers"]) {
        if (activeCase.fields[field] !== target.fields[field]) {
          issues.push({
            code: "case-mismatch",
            message: `durable case marker ${activeCase.id} field ${field} differs: expected ${JSON.stringify(activeCase.fields[field])}, found ${JSON.stringify(target.fields[field])}`,
            file: target.file,
            line: target.line,
          });
        }
      }
    }
  }

  return {
    roots,
    changeId,
    capabilityCount: suiteFiles.length,
    caseCount,
    issues,
  };
}

function summarizeFold(result) {
  const lines = [
    `Trace fold validation: ${result.issues.length ? "FAIL" : "PASS"}`,
    `Change: ${result.changeId}`,
    `Capabilities checked: ${result.capabilityCount}`,
    `Case markers checked: ${result.caseCount}`,
  ];
  if (result.issues.length)
    lines.push(
      "Issues:",
      ...result.issues.map((issue) => issueLine(issue, result.roots)),
    );
  return lines.join("\n");
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
        issues.push({
          code: "duplicate-id",
          message: `duplicate ${type} id ${id} (${records.length} records)`,
          file: record.file,
          line: record.line,
        });
      }
    }
  }
}

function validLinkCount(cases, tests, byScenario, byCase) {
  let count = 0;
  for (const record of cases) {
    for (const id of record.covers) if (byScenario.has(id)) count += 1;
  }
  for (const test of tests) {
    if (test.type === "supports" && byScenario.has(test.scenarioId)) count += 1;
    if (test.type === "acceptance" && test.caseId) {
      const records = byCase.get(test.caseId) ?? [];
      if (records.length === 1 && test.revision === records[0].revision)
        count += 1;
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
    `Suite cases checked: ${graph.suiteCaseCounts.total} (unmarked: ${graph.suiteCaseCounts.unmarked})`,
    `Test markers: ${tests.length}`,
    `Links: ${graph.links}`,
    `Unlinked scenarios: ${unlinked.scenarios.length}`,
    `Unlinked cases: ${unlinked.cases.length}`,
  ];
  if (issues.length)
    lines.push(
      "Issues:",
      ...issues.map((issue) => issueLine(issue, graph.roots)),
    );
  const unlinkedLines = [
    ...unlinked.scenarios.map(
      (record) =>
        `  scenario ${record.id} rev=${record.revision} at ${displayPath(record.file, graph.roots)}:${record.line}`,
    ),
    ...unlinked.cases.map(
      (record) =>
        `  case ${record.id} rev=${record.revision} at ${displayPath(record.file, graph.roots)}:${record.line}`,
    ),
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
      suiteCases: graph.suiteCaseCounts.total,
      markedSuiteCases: graph.suiteCaseCounts.marked,
      unmarkedSuiteCases: graph.suiteCaseCounts.unmarked,
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
  const output = [
    "Trace report",
    summarize(graph).replace("Trace validation:", "Validation:"),
  ];
  output.push("Scenarios:");
  for (const record of graph.scenarios)
    output.push(
      `  ${record.id} rev=${record.revision} at ${displayPath(record.file, graph.roots)}:${record.line}`,
    );
  output.push("Cases:");
  for (const record of graph.cases)
    output.push(
      `  ${record.id} rev=${record.revision} covers=${record.covers.join(",")} at ${displayPath(record.file, graph.roots)}:${record.line}`,
    );
  output.push("Tests:");
  for (const record of graph.tests) {
    const target =
      record.type === "acceptance"
        ? `${record.caseId ?? record.value}@${record.revision ?? "?"}`
        : record.scenarioId;
    output.push(
      `  ${record.type} ${target} at ${displayPath(record.file, graph.roots)}:${record.line}`,
    );
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
    fail(
      `exact target is ambiguous in ${file} (${matches.length} matching lines)`,
    );
  return matches[0];
}

function ensureNoAdjacentTrace(lines, index) {
  if (index > 0 && /\btrace:/.test(lines[index - 1]))
    fail(
      "target already has an adjacent trace marker; marker ids and links are immutable",
    );
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
  const rendered =
    syntax === "html"
      ? markerLineForMarkdown(marker, target)
      : markerLineForCode(marker, target);
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
  if (!value)
    fail(
      `--${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)} is required`,
    );
  return value;
}

function checkStoreMarkdownFile(file, storeRoot) {
  if (extname(file) !== ".md")
    fail("scenario and case markers require a Markdown file");
  if (!inside(storeRoot, file))
    fail(`--file must be inside --store-root: ${storeRoot}`);
  const rel = relative(storeRoot, file).split(sep);
  if (rel[0] === "openspec" && rel[1] === "changes" && rel[2] === "archive")
    fail(
      "scenario and case markers cannot be initialized inside openspec/changes/archive",
    );
  if (!(rel[0] === "openspec" && (rel[1] === "specs" || rel[1] === "changes")))
    fail(
      "scenario and case markers belong under openspec/specs or active openspec/changes",
    );
}

function validateReferencesForMutation(storeRoot, referenceType, ids) {
  const graph = parseTraceGraph({ storeRoot });
  const collection =
    referenceType === "scenario" ? graph.scenarios : graph.cases;
  const index = groupBy(collection, (record) => record.id);
  for (const id of ids) {
    const matches = index.get(id) ?? [];
    if (matches.length !== 1)
      fail(
        `${referenceType} reference ${id} must resolve to exactly one marker; found ${matches.length}`,
      );
  }
  return graph;
}

function initialize(kind, values) {
  const storeRoot = resolve(values.storeRoot ?? scriptRoot);
  const file = resolve(requireOption(values, "file"));
  const target = requireOption(values, "target");
  const app = normalizeApp(requireOption(values, "app"), "--app");
  const product = normalizeSlug(requireOption(values, "product"), "--product");
  const capability = normalizeSlug(
    requireOption(values, "capability"),
    "--capability",
  );
  checkStoreMarkdownFile(file, storeRoot);
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  const index = exactTargetIndex(lines, target, file);
  ensureNoAdjacentTrace(lines, index);
  const markerKind = kind === "scenario" ? "SC" : "TC";
  const sequence = nextSequence(
    storeRoot,
    app,
    product,
    capability,
    markerKind,
    target,
  );
  const id = formatReference(app, product, markerKind, capability, sequence);
  let marker;
  if (kind === "scenario") {
    if (!/^\s*####\s+Scenario:\s+\S/.test(target))
      fail("scenario target must be one exact #### Scenario heading line");
    marker = `trace:scenario id=${id} rev=1`;
  } else {
    if (!/^\s*###\s+\S/.test(target))
      fail("case target must be one exact ### case heading line");
    const covers = requireOption(values, "covers")
      .split(",")
      .map((item) => normalizeInputReference(item, "SC", "--covers"));
    if (new Set(covers).size !== covers.length)
      fail("--covers must be a comma-separated list of distinct SC ids");
    validateReferencesForMutation(storeRoot, "scenario", covers);
    const revision = caseHeadingRevision(target) ?? "1";
    marker = `trace:case id=${id} rev=${revision} covers=${covers.join(",")}`;
  }
  insertMarker({ file, target, marker, syntax: "html", dryRun: values.dryRun });
}

function initializeBatch(values) {
  const storeRoot = resolve(values.storeRoot ?? scriptRoot);
  const manifestPath = resolve(requireOption(values, "manifest"));
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!Array.isArray(manifest.records) || manifest.records.length === 0)
    fail("batch manifest must contain a non-empty records array");

  const records = manifest.records.map((input, index) => {
    if (!input || typeof input !== "object" || Array.isArray(input))
      fail(`batch record ${index + 1} must be an object`);
    const key = input.key;
    if (typeof key !== "string" || !key.trim())
      fail(`batch record ${index + 1} requires a non-empty key`);
    if (!["scenario", "case"].includes(input.kind))
      fail(`batch record ${key} kind must be scenario or case`);
    const file = resolve(storeRoot, requireOption(input, "file"));
    checkStoreMarkdownFile(file, storeRoot);
    const target = requireOption(input, "target");
    const app = normalizeApp(requireOption(input, "app"), "--app");
    const product = normalizeSlug(requireOption(input, "product"), "--product");
    const capability = normalizeSlug(
      requireOption(input, "capability"),
      "--capability",
    );
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    const indexInFile = exactTargetIndex(lines, target, file);
    let markerIndex = null;
    let existingId = input.existingId;
    if (input.replaceCovers === true) {
      if (input.kind !== "case" || indexInFile === 0)
        fail(
          `batch record ${key} can replace coverage only on an existing case marker`,
        );
      const adjacent = traceComment(lines[indexInFile - 1]);
      const parsedMarker =
        adjacent?.syntax === "html" && /^case\s+([\s\S]+)$/.exec(adjacent.body);
      const existingFields = parsedMarker
        ? attributes(parsedMarker[1], () => {})
        : null;
      if (!existingFields?.id || !existingFields.rev || !existingFields.covers)
        fail(
          `batch record ${key} does not have an adjacent complete case marker`,
        );
      if (input.existingId && existingFields.id !== input.existingId)
        fail(
          `batch record ${key} existing id does not match the adjacent marker`,
        );
      existingId = existingFields.id;
      if (existingFields.rev !== caseHeadingRevision(target))
        fail(`batch record ${key} existing revision differs from its heading`);
      markerIndex = indexInFile - 1;
    } else {
      ensureNoAdjacentTrace(lines, indexInFile);
    }
    if (input.kind === "scenario" && !/^\s*####\s+Scenario:\s+\S/.test(target))
      fail(`batch scenario ${key} target must be a scenario heading`);
    if (input.kind === "case" && !/^\s*###\s+\S/.test(target))
      fail(`batch case ${key} target must be a case heading`);
    const revision =
      input.kind === "case"
        ? caseHeadingRevision(target)
        : String(input.revision ?? "1");
    if (input.kind === "case" && revision === null)
      fail(
        `batch case ${key} target must end with a positive TC<n>-<v> revision`,
      );
    if (!positiveRevision(revision))
      fail(`batch record ${key} has an invalid revision: ${revision}`);
    const covers = input.kind === "case" ? input.covers : [];
    if (input.kind === "case" && !Array.isArray(covers))
      fail(`batch case ${key} requires a covers array`);
    if (
      input.kind === "case" &&
      covers.length === 0 &&
      !deprecatedCaseAt(lines, indexInFile)
    )
      fail(
        `batch case ${key} may use empty coverage only on a deprecated case`,
      );
    return {
      key,
      kind: input.kind,
      file,
      target,
      indexInFile,
      app,
      product,
      capability,
      revision,
      covers,
      mirrorKey: input.mirrorKey ?? key,
      existingId,
      markerIndex,
    };
  });

  const recordByKey = new Map();
  const targetByLocation = new Map();
  for (const record of records) {
    if (recordByKey.has(record.key))
      fail(`batch manifest repeats key ${record.key}`);
    recordByKey.set(record.key, record);
    const location = `${record.file}\0${record.indexInFile}`;
    if (targetByLocation.has(location))
      fail(
        `batch records ${targetByLocation.get(location)} and ${record.key} target the same heading in ${record.file}`,
      );
    targetByLocation.set(location, record.key);
  }

  const mirrorGroups = groupBy(records, (record) => record.mirrorKey);
  for (const [mirrorKey, group] of mirrorGroups) {
    const first = group[0];
    for (const item of group) {
      if (
        item.kind !== first.kind ||
        item.app !== first.app ||
        item.product !== first.product ||
        item.capability !== first.capability ||
        item.target !== first.target
      )
        fail(`batch mirror group ${mirrorKey} mixes targets, scopes, or kinds`);
      if (item.kind === "case" && item.revision !== first.revision)
        fail(`batch mirror group ${mirrorKey} has differing case revisions`);
    }
  }

  const usedByScope = new Map();
  const markdownRoots = [
    resolve(storeRoot, "openspec/specs"),
    resolve(storeRoot, "openspec/changes"),
  ];
  for (const file of markdownRoots.flatMap((root) =>
    walk(root, (path) => extname(path) === ".md"),
  )) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const comment = traceComment(line);
      if (comment?.syntax !== "html") continue;
      const id = /(?:^|\s)id=([^\s]+)/.exec(comment.body)?.[1];
      const parsed = parseReference(id);
      if (!parsed) continue;
      const key = `${parsed.app}.${parsed.scope}`;
      if (!usedByScope.has(key)) usedByScope.set(key, new Set());
      usedByScope.get(key).add(parsed.sequence);
    }
  }

  const idByMirror = new Map();
  for (const [mirrorKey, group] of [...mirrorGroups].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const first = [...group].sort((a, b) =>
      `${a.file}\0${a.target}`.localeCompare(`${b.file}\0${b.target}`),
    )[0];
    const scopeKey = `${first.app}.${first.product}-${first.capability}`;
    const explicitIds = new Set(
      group.map((item) => item.existingId).filter(Boolean),
    );
    if (explicitIds.size > 1)
      fail(`batch mirror group ${mirrorKey} names more than one existing id`);
    if (explicitIds.size === 1) {
      const [existingId] = explicitIds;
      const expectedKind = first.kind === "scenario" ? "SC" : "TC";
      const parsedId = parseReference(existingId);
      if (
        !parsedId ||
        parsedId.kind !== expectedKind ||
        parsedId.app !== first.app ||
        parsedId.scope !== `${first.product}-${first.capability}`
      )
        fail(
          `batch mirror group ${mirrorKey} existing id has the wrong scope or kind`,
        );
      idByMirror.set(mirrorKey, parsedId.canonical);
      continue;
    }
    if (!usedByScope.has(scopeKey)) usedByScope.set(scopeKey, new Set());
    const sequence = allocateSequence(
      usedByScope.get(scopeKey),
      first.app,
      first.product,
      first.capability,
      first.kind === "scenario" ? "SC" : "TC",
      first.target,
    );
    idByMirror.set(
      mirrorKey,
      formatReference(
        first.app,
        first.product,
        first.kind === "scenario" ? "SC" : "TC",
        first.capability,
        sequence,
      ),
    );
  }

  const graph = parseTraceGraph({ storeRoot });
  const knownScenarioIds = new Set(graph.scenarios.map((record) => record.id));
  for (const [mirrorKey, group] of mirrorGroups) {
    if (!group.some((record) => record.existingId)) continue;
    const recordsOfKind =
      group[0].kind === "scenario" ? graph.scenarios : graph.cases;
    if (
      !recordsOfKind.some((record) => record.id === idByMirror.get(mirrorKey))
    )
      fail(
        `batch mirror group ${mirrorKey} names an id not already in the store`,
      );
  }
  const mirrorById = new Map();
  for (const [mirrorKey, id] of idByMirror) {
    if (mirrorById.has(id))
      fail(
        `batch mirror groups ${mirrorById.get(id)} and ${mirrorKey} claim the same existing id ${id}`,
      );
    mirrorById.set(id, mirrorKey);
  }
  for (const [mirrorKey, group] of mirrorGroups) {
    if (group[0].kind === "scenario")
      knownScenarioIds.add(idByMirror.get(mirrorKey));
  }
  const generatedCases = [];
  for (const record of records) {
    if (record.kind !== "case") continue;
    const covers = record.covers.map((reference) => {
      if (typeof reference !== "string" || !reference)
        fail(`batch case ${record.key} has an invalid covers entry`);
      if (recordByKey.has(reference)) {
        const scenario = recordByKey.get(reference);
        if (scenario.kind !== "scenario")
          fail(
            `batch case ${record.key} covers non-scenario record ${reference}`,
          );
        return idByMirror.get(scenario.mirrorKey);
      }
      return normalizeInputReference(reference, "SC", "batch covers");
    });
    if (new Set(covers).size !== covers.length)
      fail(`batch case ${record.key} repeats a covered scenario`);
    for (const id of covers) {
      if (!knownScenarioIds.has(id))
        fail(`batch case ${record.key} covers unknown scenario ${id}`);
    }
    generatedCases.push({ record, covers });
  }

  const coversByMirror = groupBy(
    generatedCases,
    ({ record }) => record.mirrorKey,
  );
  for (const [mirrorKey, group] of coversByMirror) {
    const expected = group[0].covers.join(",");
    if (group.some(({ covers }) => covers.join(",") !== expected))
      fail(`batch mirror group ${mirrorKey} has different coverage`);
  }

  const plannedScopeByFile = new Map();
  for (const record of records) {
    const scope = `${record.app}.${record.product}-${record.capability}`;
    const current = plannedScopeByFile.get(record.file);
    if (current && current !== scope)
      fail(`batch records in ${record.file} mix marker scopes`);
    plannedScopeByFile.set(record.file, scope);
  }
  for (const [file, expectedScope] of plannedScopeByFile) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const comment = traceComment(lines[index]);
      if (comment?.syntax !== "html") continue;
      const id = /(?:^|\s)id=([^\s]+)/.exec(comment.body)?.[1];
      const parsed = parseReference(id);
      if (!parsed) continue;
      const scope = `${parsed.app}.${parsed.scope}`;
      if (scope !== expectedScope)
        fail(
          `batch markers in ${file} would mix scopes ${expectedScope} and ${scope}`,
        );
    }
  }

  const updates = new Map();
  for (const record of records) {
    if (!updates.has(record.file)) {
      const text = readFileSync(record.file, "utf8");
      updates.set(record.file, {
        oldText: text,
        eol: text.includes("\r\n") ? "\r\n" : "\n",
        lines: text.split(/\r?\n/),
      });
    }
  }
  const coversByKey = new Map(
    generatedCases.map(({ record, covers }) => [record.key, covers]),
  );
  for (const record of [...records].sort((a, b) =>
    a.file === b.file
      ? (b.markerIndex ?? b.indexInFile) - (a.markerIndex ?? a.indexInFile)
      : a.file.localeCompare(b.file),
  )) {
    const id = idByMirror.get(record.mirrorKey);
    const marker =
      record.kind === "scenario"
        ? `trace:scenario id=${id} rev=${record.revision}`
        : `trace:case id=${id} rev=${record.revision} covers=${coversByKey.get(record.key).join(",") || "none"}`;
    const fileUpdate = updates.get(record.file);
    if (record.markerIndex === null) {
      fileUpdate.lines.splice(
        record.indexInFile,
        0,
        markerLineForMarkdown(marker, record.target),
      );
    } else {
      fileUpdate.lines.splice(
        record.markerIndex,
        1,
        markerLineForMarkdown(marker, record.target),
      );
    }
  }

  for (const [file, update] of updates) {
    const nextText = update.lines.join(update.eol);
    console.log(`${values.dryRun ? "DRY RUN" : "Updated"}: ${file}`);
    for (const record of records.filter((item) => item.file === file)) {
      const type = record.kind === "scenario" ? "SC" : "TC";
      const prefix = record.markerIndex === null ? "+" : "~";
      console.log(
        `${prefix} ${type} ${idByMirror.get(record.mirrorKey)} for ${record.target}`,
      );
    }
    update.nextText = nextText;
  }
  if (!values.dryRun) {
    for (const [file, update] of updates) {
      if (readFileSync(file, "utf8") !== update.oldText)
        fail(`file changed while preparing markers: ${file}`);
    }
    for (const [file, update] of updates)
      writeFileSync(file, update.nextText, "utf8");
  }
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
    const match = /^(.+)@(\d+)$/.exec(values.acceptance);
    if (!match || !positiveRevision(match[2]))
      fail(
        "--acceptance must be <app>.<product>-<capability>.TC-<3-character-base36-sequence>@positive-revision",
      );
    const caseId = normalizeInputReference(match[1], "TC", "--acceptance");
    const graph = validateReferencesForMutation(storeRoot, "case", [caseId]);
    const record = graph.cases.find((item) => item.id === caseId);
    if (record.revision !== match[2])
      fail(
        `--acceptance revision ${match[2]} is stale; current ${caseId} revision is ${record.revision}`,
      );
    marker = `trace:acceptance=${caseId}@${match[2]}`;
  } else {
    const scenarioId = normalizeInputReference(
      values.supports,
      "SC",
      "--supports",
    );
    validateReferencesForMutation(storeRoot, "scenario", [scenarioId]);
    marker = `trace:supports=${scenarioId}`;
  }
  insertMarker({ file, target, marker, syntax: "line", dryRun: values.dryRun });
}

function parseCommand(argv) {
  const command = argv[0];
  if (!command || command === "--help" || command === "-h")
    return { command: "help" };
  let kind = null;
  let args = argv.slice(1);
  if (command === "init") {
    kind = args[0];
    args = args.slice(1);
    if (!["scenario", "case", "batch"].includes(kind))
      fail("init requires scenario, case, or batch");
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
      app: { type: "string" },
      appRoot: { type: "string" },
      capability: { type: "string" },
      change: { type: "string" },
      covers: { type: "string" },
      dryRun: { type: "boolean", default: false },
      file: { type: "string" },
      help: { type: "boolean", short: "h", default: false },
      json: { type: "boolean", default: false },
      manifest: { type: "string" },
      product: { type: "string" },
      storeRoot: { type: "string" },
      supports: { type: "string" },
      target: { type: "string" },
    },
    strict: true,
  });
  if (parsed.values.help) return { command: "help" };
  if (parsed.positionals.length)
    fail(`unexpected arguments: ${parsed.positionals.join(" ")}`);
  return { command, kind, values: parsed.values };
}

export function runCli(argv = process.argv.slice(2)) {
  try {
    const parsed = parseCommand(cliArgs(argv));
    if (parsed.command === "help") {
      console.log(usage);
      return 0;
    }
    const { values } = parsed;
    if (parsed.command === "init") {
      if (parsed.kind === "batch") {
        initializeBatch(values);
        return 0;
      }
      initialize(parsed.kind, values);
      return 0;
    }
    if (parsed.command === "link") {
      linkTest(values);
      return 0;
    }
    if (parsed.command === "fold") {
      const result = validateFoldHandover({
        storeRoot: values.storeRoot ?? scriptRoot,
        changeId: values.change,
      });
      console.log(summarizeFold(result));
      return result.issues.length ? 1 : 0;
    }
    if (parsed.command === "validate" || parsed.command === "report") {
      const graph = parseTraceGraph({
        storeRoot: values.storeRoot ?? scriptRoot,
        appRoot: values.appRoot ?? null,
      });
      if (parsed.command === "report") {
        console.log(
          values.json
            ? JSON.stringify(reportObject(graph), null, 2)
            : renderReport(graph),
        );
      } else {
        console.log(summarize(graph));
      }
      return graph.issues.length ? 1 : 0;
    }
    fail(`unknown command: ${parsed.command}`);
  } catch (error) {
    console.error(
      `✗ ${error instanceof Error ? error.message : String(error)}`,
    );
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
