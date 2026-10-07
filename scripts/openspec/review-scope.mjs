#!/usr/bin/env node
/**
 * Build the compact, deterministic input map for a fresh planning review.
 *
 * The map is deliberately derived from the active change and the fold's own
 * contract targets. It is a starting index only: callers expand to the full
 * sources when it says the index is incomplete or contains an overlap.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { contractTargets } from "./lib/acceptance.mjs";

const CONTRACT_FILES = new Set([
  "proposal.md",
  "decisions.md",
  "ui-design.md",
  "tech-design.md",
  "tasks.md",
  "spec.md",
  "user-journeys.md",
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
]);
const DELTA_HEADING = /^##\s+(ADDED|MODIFIED|REMOVED|RENAMED) Requirements\s*$/;
const REQUIREMENT = /^###\s+Requirement:\s*(.+?)\s*$/;
const PRD_REF = /docs\/prds\/[\w./-]+\.md(?:#([\w-]+))?/g;

function walk(root, dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walk(root, file, found);
    else if (CONTRACT_FILES.has(entry.name))
      found.push(relative(root, file).replaceAll("\\", "/"));
  }
  return found;
}

function walkMarkdown(root, dir, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(root, file, found);
    else if (entry.name.endsWith(".md"))
      found.push(relative(root, file).replaceAll("\\", "/"));
  }
  return found;
}

function capabilityOf(changeId, path) {
  const prefix = `openspec/changes/${changeId}/specs/`;
  return path.startsWith(prefix) && path.endsWith("/spec.md")
    ? path.slice(prefix.length, -"/spec.md".length)
    : null;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function sectionLine(text, anchor) {
  const lines = text.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(lines[index]);
    if (match && slug(match[2]) === anchor) return index + 1;
  }
  return null;
}

function frontmatter(text) {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") return { closed: true, spec: null };
  const end = lines.findIndex(
    (line, index) => index > 0 && line.trim() === "---",
  );
  if (end < 0) return { closed: false, spec: null };
  for (let index = 1; index < end; index += 1) {
    const match = /^spec:\s*(\S+)\s*$/.exec(lines[index]);
    if (match) return { closed: true, line: index + 1, spec: match[1] };
  }
  return { closed: true, spec: null };
}

function requirements(root, changeId, sourcePaths) {
  const found = [];
  for (const path of sourcePaths) {
    if (!capabilityOf(changeId, path)) continue;
    const lines = readFileSync(join(root, path), "utf8").split("\n");
    let kind = null;
    for (let index = 0; index < lines.length; index += 1) {
      const delta = DELTA_HEADING.exec(lines[index]);
      if (delta) {
        kind = delta[1];
        continue;
      }
      if (/^##\s+/.test(lines[index])) {
        kind = null;
        continue;
      }
      const requirement = REQUIREMENT.exec(lines[index]);
      if (!requirement || !kind) continue;
      found.push({
        capability: capabilityOf(changeId, path),
        kind,
        name: requirement[1],
        path,
        line: index + 1,
      });
    }
  }
  return found.sort(
    (left, right) =>
      left.path.localeCompare(right.path) ||
      left.line - right.line ||
      left.name.localeCompare(right.name),
  );
}

function pageLines(root, sourcePaths, capabilities) {
  const refs = new Map();
  for (const path of sourcePaths) {
    const text = readFileSync(join(root, path), "utf8");
    for (const match of text.matchAll(PRD_REF)) {
      const file = match[0].split("#")[0];
      const anchor = match[1] ?? null;
      const key = `${file}#${anchor ?? ""}`;
      if (refs.has(key)) continue;
      if (!existsSync(join(root, file))) {
        refs.set(key, { anchor, file, line: null, missing: true });
        continue;
      }
      const line = anchor
        ? sectionLine(readFileSync(join(root, file), "utf8"), anchor)
        : 1;
      const page = { anchor, file, line };
      if (anchor && line === null) page.missing = true;
      refs.set(key, page);
    }
  }
  const prdRoot = join(root, "docs", "prds");
  let frontmatterCoverageIncomplete = !existsSync(prdRoot);
  const frontmatterCapabilities = new Set();
  for (const path of walkMarkdown(root, prdRoot)) {
    const metadata = frontmatter(readFileSync(join(root, path), "utf8"));
    if (!metadata.closed) {
      frontmatterCoverageIncomplete = true;
      continue;
    }
    if (!metadata.spec || !capabilities.has(metadata.spec)) continue;
    frontmatterCapabilities.add(metadata.spec);
    const key = `${path}#`;
    if (!refs.has(key))
      refs.set(key, { anchor: null, file: path, line: metadata.line });
  }
  return {
    pages: [...refs.values()].sort(
      (left, right) =>
        left.file.localeCompare(right.file) ||
        (left.anchor ?? "").localeCompare(right.anchor ?? ""),
    ),
    frontmatterCapabilities,
    frontmatterCoverageIncomplete,
  };
}

function allRequirements(root, changeId) {
  const changes = join(root, "openspec", "changes");
  const found = [];
  if (!existsSync(changes)) return found;
  for (const entry of readdirSync(changes, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "archive") continue;
    const id = entry.name;
    for (const path of walk(root, join(changes, id))) {
      const capability = capabilityOf(id, path);
      if (!capability) continue;
      const lines = readFileSync(join(root, path), "utf8").split("\n");
      let kind = null;
      for (let index = 0; index < lines.length; index += 1) {
        const delta = DELTA_HEADING.exec(lines[index]);
        if (delta) {
          kind = delta[1];
          continue;
        }
        if (/^##\s+/.test(lines[index])) {
          kind = null;
          continue;
        }
        const requirement = REQUIREMENT.exec(lines[index]);
        if (requirement && kind)
          found.push({
            change: id,
            capability,
            kind,
            name: requirement[1],
            path,
            line: index + 1,
          });
      }
    }
  }
  return found.filter((one) => one.change !== changeId);
}

function overlaps(root, changeId, changed) {
  const others = allRequirements(root, changeId);
  const found = [];
  for (const requirement of changed) {
    const matches = others.filter(
      (one) =>
        one.capability === requirement.capability &&
        one.name === requirement.name,
    );
    if (matches.length === 0) continue;
    found.push({
      capability: requirement.capability,
      requirement: requirement.name,
      current: {
        change: changeId,
        kind: requirement.kind,
        line: requirement.line,
        path: requirement.path,
      },
      other: matches.map(({ change, kind, line, path }) => ({
        change,
        kind,
        line,
        path,
      })),
    });
  }
  return found.sort(
    (left, right) =>
      left.capability.localeCompare(right.capability) ||
      left.requirement.localeCompare(right.requirement),
  );
}

export function buildReviewScope(root, changeId) {
  const dir = join(root, "openspec", "changes", changeId);
  const sourcePaths = walk(root, dir).filter(
    (path) => !path.endsWith("/rounds.md"),
  );
  const changedRequirements = requirements(root, changeId, sourcePaths);
  const capabilities = new Set(
    sourcePaths
      .map((path) => capabilityOf(changeId, path))
      .filter((capability) => capability !== null),
  );
  const pageIndex = pageLines(root, sourcePaths, capabilities);
  const pages = pageIndex.pages;
  const expansionReasons = [];
  for (const file of [
    "proposal.md",
    "decisions.md",
    "tasks.md",
    ".openspec.yaml",
  ]) {
    if (!existsSync(join(dir, file)))
      expansionReasons.push(`required artifact is missing: ${file}`);
  }
  const record = existsSync(join(dir, ".openspec.yaml"))
    ? readFileSync(join(dir, ".openspec.yaml"), "utf8")
    : "";
  if (
    !existsSync(join(dir, "tech-design.md")) &&
    !/^design_waived:\s*\S/m.test(record)
  )
    expansionReasons.push("tech-design.md or a design waiver is not indexed");
  let durableTargets = [];
  try {
    durableTargets = contractTargets(root, changeId);
  } catch (error) {
    expansionReasons.push(`durable target derivation failed: ${error.message}`);
  }
  if (changedRequirements.length === 0)
    expansionReasons.push("no changed requirements were indexed");
  if (pages.length === 0)
    expansionReasons.push("no PRD section or frontmatter links were indexed");
  if (pages.some((page) => page.missing || page.line === null))
    expansionReasons.push("a linked PRD page or section could not be resolved");
  if (pageIndex.frontmatterCoverageIncomplete)
    expansionReasons.push("PRD frontmatter coverage could not be established");
  for (const capability of capabilities) {
    if (!pageIndex.frontmatterCapabilities.has(capability))
      expansionReasons.push(
        `no PRD frontmatter page was indexed for capability: ${capability}`,
      );
  }
  if (durableTargets.length === 0)
    expansionReasons.push("no durable targets were indexed");
  const conflict = overlaps(root, changeId, changedRequirements);
  if (conflict.length > 0)
    expansionReasons.push("overlapping active deltas require both sources");

  return {
    version: 1,
    change: changeId,
    sourcePaths,
    changedRequirements,
    pageLines: pages,
    durableTargets,
    overlaps: conflict,
    expandToFullSources: expansionReasons.length > 0,
    expansionReasons,
  };
}

if (import.meta.main) {
  const [root, changeId] = process.argv.slice(2);
  if (!root || !changeId) {
    console.error(
      "usage: node scripts/openspec/review-scope.mjs <root> <change-id>",
    );
    process.exitCode = 2;
  } else {
    console.log(JSON.stringify(buildReviewScope(root, changeId), null, 2));
  }
}
