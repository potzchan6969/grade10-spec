import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  acceptanceGate,
  formatFindings,
  prepareAcceptance,
  requirementBlocks,
  runPnpm,
} from "./acceptance.mjs";
import { purposeOf } from "./fold-checks.mjs";

/** One change through the gate `spec:accept` holds it to. A change that
 *  cannot even be folded reports that as its one failure. */
export function preflightChange(root, changeId, command = runPnpm) {
  try {
    const prepared = prepareAcceptance(root, changeId);
    const { failures, warnings } = acceptanceGate(prepared, command);
    return { changeId, prepared, failures, warnings };
  } catch (error) {
    return {
      changeId,
      prepared: null,
      failures: [{ rule: "fold", detail: error.message }],
      warnings: [],
    };
  }
}

export function formatPreflight(results) {
  const lines = [];
  if (results.length > 1) {
    lines.push(
      "| Change | Result | Failures | Warnings |",
      "| --- | --- | --- | --- |",
    );
    for (const one of results)
      lines.push(
        `| ${one.changeId} | ${one.failures.length === 0 ? "ready" : "refused"} | ${one.failures.length} | ${one.warnings.length} |`,
      );
    lines.push("");
  }
  for (const one of results) {
    const { prepared } = one;
    lines.push(
      one.failures.length === 0
        ? `${one.changeId} is ready to fold and accept.`
        : `${one.changeId} would be refused by spec:accept:`,
    );
    if (one.failures.length > 0) lines.push(formatFindings(one.failures));
    if (one.warnings.length > 0) {
      lines.push("Warnings:", formatFindings(one.warnings));
    }
    if (prepared) {
      lines.push(
        `Fingerprint: ${prepared.fingerprint}`,
        `Baseline: ${prepared.baselineFingerprint}`,
        `Durable files to write: ${prepared.outputs.size}`,
        ...[...prepared.outputs.keys()].map((path) => `  ${path}`),
      );
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

/** A unified diff of two texts: changed lines with `context` lines around
 *  them, hunks marked `@@`. Texts here are single requirements, so a plain
 *  longest-common-subsequence walk is enough. */
export function unifiedDiff(before, after, context = 2) {
  const a = before.split("\n");
  const b = after.split("\n");
  const table = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i -= 1)
    for (let j = b.length - 1; j >= 0; j -= 1)
      table[i][j] =
        a[i] === b[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      ops.push(` ${a[i]}`);
      i += 1;
      j += 1;
    } else if (
      j < b.length &&
      (i === a.length || table[i][j + 1] > table[i + 1][j])
    ) {
      ops.push(`+${b[j]}`);
      j += 1;
    } else {
      ops.push(`-${a[i]}`);
      i += 1;
    }
  }
  const keep = ops.map((op, at) =>
    ops
      .slice(Math.max(0, at - context), at + context + 1)
      .some((near) => near[0] !== " "),
  );
  const out = [];
  ops.forEach((op, at) => {
    if (keep[at]) out.push(op);
    else if (out.at(-1) !== "@@") out.push("@@");
  });
  return out.join("\n");
}

function requirementDiffs(durable, folded) {
  const before = requirementBlocks(durable);
  const after = requirementBlocks(folded);
  const render = (name, block) =>
    block ? `### Requirement: ${name}\n\n${block.raw}` : "";
  const diffs = [];
  for (const name of new Set([...before.keys(), ...after.keys()])) {
    const was = render(name, before.get(name));
    const now = render(name, after.get(name));
    if (was !== now)
      diffs.push({
        name,
        diff: unifiedDiff(was, now),
        status: !before.has(name)
          ? "added"
          : !after.has(name)
            ? "removed"
            : "modified",
      });
  }
  return diffs;
}

function decisionRows(root, changeId) {
  const path = join(root, "openspec", "changes", changeId, "decisions.md");
  if (!existsSync(path)) return [];
  const section = /^## Decisions\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(
    readFileSync(path, "utf8"),
  );
  return (section?.[1] ?? "")
    .split("\n")
    .filter((line) => line.startsWith("|"));
}

function prdLines(prepared) {
  return prepared.snapshots
    .filter((one) => one.role === "prd-source")
    .map((one) => ({
      path: one.path,
      lines: one.content
        .split("\n")
        .filter((line) => /🚧|❓/u.test(line))
        .map((line) => line.trim()),
    }))
    .filter((one) => one.lines.length > 0);
}

function changePacket(root, result) {
  const { changeId, prepared } = result;
  const out = [`## ${changeId}`, ""];
  out.push(
    "### Gate",
    "",
    result.failures.length === 0 && result.warnings.length === 0
      ? "Passed with no findings."
      : [formatFindings(result.failures), formatFindings(result.warnings)]
          .filter(Boolean)
          .join("\n"),
    "",
  );
  if (!prepared) return out;
  out.push("### Folded minus durable", "");
  for (const [path, folded] of prepared.outputs) {
    if (!path.endsWith("/spec.md")) continue;
    const durablePath = join(root, path);
    const durable = existsSync(durablePath)
      ? readFileSync(durablePath, "utf8")
      : "";
    out.push(
      `#### ${path.replace(/^openspec\/specs\//, "").replace(/\/spec\.md$/, "")}`,
      "",
    );
    if (purposeOf(durable) !== purposeOf(folded))
      out.push(
        "Purpose",
        "```diff",
        unifiedDiff(purposeOf(durable) ?? "", purposeOf(folded) ?? ""),
        "```",
        "",
      );
    const diffs = requirementDiffs(durable, folded);
    if (diffs.length === 0 && purposeOf(durable) === purposeOf(folded))
      out.push("No requirement changes.", "");
    for (const one of diffs)
      out.push(`${one.status}: ${one.name}`, "```diff", one.diff, "```", "");
  }
  out.push("### PRD lines in scope", "");
  const prd = prdLines(prepared);
  if (prd.length === 0) out.push("None.", "");
  for (const one of prd)
    out.push(`${one.path}`, ...one.lines.map((l) => `- ${l}`), "");
  out.push("### Decisions", "");
  const rows = decisionRows(root, changeId);
  out.push(...(rows.length > 0 ? rows : ["None."]), "");
  return out;
}

/** The review packet: for each change, the gate's findings and only what a
 *  reviewer must read - touched requirements as diffs, the PRD lines the
 *  change cites that still carry a mark, and its decisions. */
export function buildPacket(root, results) {
  return `${[
    "# Acceptance review packet",
    "",
    ...results.flatMap((one) => changePacket(root, one)),
  ]
    .join("\n")
    .trimEnd()}\n`;
}
