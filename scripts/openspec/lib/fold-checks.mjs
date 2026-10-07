import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { deltaSections } from "../../../tools/manual/src/store/read-changes.mts";

const CASE_LINE = /^###\s+(\S+-TC\d+)-(\d+)\b[:\s-]*(.*)$/i;
const CASE_MARKER = /<!--\s*trace:case id=(\S+)/;
const SUITE_FILE = /-tcs\.md$/;
const SPECS = "openspec/specs/";

/** Each `<id>-TC<n>` a suite holds, whatever its revision, with the title it
 *  carries and the id of the trace marker directly above it. */
export function casesOf(text) {
  const lines = text.split("\n");
  const cases = new Map();
  lines.forEach((line, at) => {
    const found = CASE_LINE.exec(line);
    if (!found) return;
    let above = at - 1;
    while (above >= 0 && !lines[above].trim()) above -= 1;
    cases.set(found[1], {
      title: found[3].trim(),
      marker: CASE_MARKER.exec(lines[above] ?? "")?.[1] ?? null,
    });
  });
  return cases;
}

export function purposeOf(text) {
  return deltaSections(text).find((section) => section.heading === "Purpose")
    ?.raw;
}

function suiteFindings(path, durable, folded) {
  const before = casesOf(durable);
  const after = casesOf(folded);
  const findings = [];
  for (const [number, one] of before) {
    const kept = after.get(number);
    if (!kept)
      findings.push({
        rule: "fold:lost-case",
        level: "fail",
        detail: `${path}: durable case ${number} is gone from the folded suite; carry it in the change's suite or retire it on purpose`,
      });
    else if (kept.title !== one.title && !one.marker)
      findings.push({
        rule: "fold:retitled-case",
        level: "warn",
        detail: `${path}: ${number} is retitled "${one.title}" -> "${kept.title}" and has no durable trace marker to show it is the same case; confirm it is, or give the new case the next unused TC number`,
      });
    else if (kept.title !== one.title && kept.marker !== one.marker)
      findings.push({
        rule: "fold:retitled-case",
        level: "fail",
        detail: `${path}: ${number} is retitled "${one.title}" -> "${kept.title}" without its durable trace marker ${one.marker}; a new case takes the next unused TC number`,
      });
  }
  return findings;
}

/** A delta's `## Purpose` replaces the capability's whole Purpose. Widening it
 *  keeps the durable text and is a finding to read; anything that drops the
 *  durable text writes a change-scoped Purpose over what the capability is
 *  for, and fails, unless the change's record says why the durable Purpose
 *  no longer holds under `purpose_rewritten.<capability>`. */
function purposeFinding(path, durable, folded, deltaText, rewritten) {
  if (purposeOf(deltaText) === undefined) return [];
  const before = purposeOf(durable)?.trim();
  const after = purposeOf(folded)?.trim();
  if (!before || before === after) return [];
  const capability = path.slice(SPECS.length, -"/spec.md".length);
  const why = lineOf(rewritten?.[capability]);
  const finding = (level, detail) => [
    { rule: "fold:purpose", level, detail: `${path}: ${detail}` },
  ];
  if (after?.includes(before))
    return finding(
      "warn",
      "the delta's Purpose extends the durable Purpose; read the folded text",
    );
  if (why)
    return finding(
      "warn",
      `the delta's Purpose replaces the durable Purpose - purpose_rewritten: ${why}`,
    );
  return finding(
    "fail",
    `the delta's Purpose replaces the durable Purpose; keep the capability's Purpose and say what the change does in the proposal, or say why the durable Purpose no longer holds as \`purpose_rewritten.${capability}\` in the change's .openspec.yaml`,
  );
}

const lineOf = (value) =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

/** The fold's own checks over what `prepareAcceptance` produced: a durable
 *  case lost or retitled under its id, and a Purpose the delta replaced. */
export function foldChecks(prepared) {
  const findings = [];
  const changeDir = join(
    prepared.root,
    "openspec",
    "changes",
    prepared.changeId,
  );
  const record = join(changeDir, ".openspec.yaml");
  const rewritten = existsSync(record)
    ? YAML.parse(readFileSync(record, "utf8"))?.purpose_rewritten
    : undefined;
  for (const [path, folded] of prepared.outputs) {
    const durablePath = join(prepared.root, path);
    if (!existsSync(durablePath)) continue;
    const durable = readFileSync(durablePath, "utf8");
    if (SUITE_FILE.test(path))
      findings.push(...suiteFindings(path, durable, folded));
    else if (path.endsWith("/spec.md")) {
      const delta = join(changeDir, "specs", path.slice(SPECS.length));
      if (existsSync(delta))
        findings.push(
          ...purposeFinding(
            path,
            durable,
            folded,
            readFileSync(delta, "utf8"),
            rewritten,
          ),
        );
    }
  }
  return findings;
}
