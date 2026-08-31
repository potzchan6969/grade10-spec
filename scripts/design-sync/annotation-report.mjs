#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";

export const REPORT_SCHEMA_VERSION = 1;

function normalizeHandle(handle) {
  return String(handle ?? "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();
}

function nodeIdFromUrl(value) {
  try {
    const url = new URL(value);
    const nodeId = url.searchParams.get("node-id");
    if (!nodeId) return null;
    const parts = nodeId.replace(/-/g, ":").split(":");
    if (parts.length !== 2 || parts.some((part) => !/^\d+$/.test(part)))
      return null;
    const path = url.pathname.split("/").filter(Boolean);
    const fileIndex = path.findIndex(
      (part) => part === "design" || part === "file",
    );
    if (fileIndex === -1) return null;
    const fileKey =
      path[fileIndex + 2] === "branch"
        ? path[fileIndex + 3]
        : path[fileIndex + 1];
    return fileKey ? { fileKey, nodeId: parts.join(":") } : null;
  } catch {
    return null;
  }
}

function nodeKey(fileKey, nodeId) {
  return `${fileKey}:${String(nodeId).replace(/-/g, ":")}`;
}

function exactReferencesForFinding(finding) {
  const references = new Set([nodeKey(finding.fileKey, finding.nodeId)]);
  for (const source of finding.registeredSources ?? [])
    if (source.fileKey && source.nodeId)
      references.add(nodeKey(source.fileKey, source.nodeId));
  for (const evidence of finding.associationEvidence ?? []) {
    if (evidence.kind !== "reviewed-baseline" || !evidence.sourceRoot) continue;
    references.add(nodeKey(finding.fileKey, evidence.sourceRoot));
  }
  return references;
}

function proposalAuthor(proposal) {
  return normalizeHandle(/\*\*Author:\*\*\s*@?([\w.-]+)/i.exec(proposal)?.[1]);
}

function parseTaskGroups(tasks) {
  if (typeof tasks !== "string") return [];
  const groups = [];
  for (const line of tasks.split("\n")) {
    const match =
      /^##\s+(\d+)\.\s*(.+?)(?:\s+\(owner:\s*@?([\w.-]+)\))?\s*$/i.exec(line);
    if (!match) continue;
    groups.push({
      number: match[1],
      title: match[2].trim(),
      owner: normalizeHandle(match[3]),
    });
  }
  return groups;
}

function taskGroupNumber(value) {
  const match = /^(\d+)/.exec(String(value ?? ""));
  return match?.[1] ?? null;
}

async function walkMarkdown(root, current = root) {
  let entries;
  try {
    entries = await readdir(current, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const path = resolve(current, entry.name);
    if (entry.isDirectory()) files.push(...(await walkMarkdown(root, path)));
    else if (entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

export async function loadActiveChanges(storeRoot) {
  const changesRoot = resolve(storeRoot, "openspec/changes");
  let entries;
  try {
    entries = await readdir(changesRoot, { withFileTypes: true });
  } catch (error) {
    throw new Error(
      `OpenSpec changes could not be read: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const changes = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "archive") continue;
    const changeRoot = resolve(changesRoot, entry.name);
    const proposalPath = resolve(changeRoot, "proposal.md");
    const tasksPath = resolve(changeRoot, "tasks.md");
    let proposal = "";
    let tasks = "";
    try {
      proposal = await readFile(proposalPath, "utf8");
    } catch {
      // An incomplete active change is still visible as unassigned evidence.
    }
    try {
      tasks = await readFile(tasksPath, "utf8");
    } catch {
      // PM-planning changes legitimately have no tasks.md.
    }

    const artifacts = [];
    for (const path of await walkMarkdown(changeRoot)) {
      const text = await readFile(path, "utf8");
      const references = [];
      for (const match of text.matchAll(/https?:\/\/[^\s)\]">]+/g)) {
        const reference = nodeIdFromUrl(match[0].replace(/[.,;:!?]+$/, ""));
        if (reference) references.push(reference);
      }
      artifacts.push({
        path: relative(storeRoot, path),
        references,
      });
    }
    changes.push({
      id: entry.name,
      proposalAuthor: proposalAuthor(proposal),
      artifacts,
      taskGroups: parseTaskGroups(tasks),
    });
  }
  return changes.sort((a, b) => a.id.localeCompare(b.id));
}

export function findExactAssociations(finding, changes) {
  const references = exactReferencesForFinding(finding);
  const matches = (finding.registeredSources ?? [])
    .filter((source) => source.component || source.covers)
    .map((source) => ({
      changeId: null,
      taskGroup: null,
      artifact: source.path ?? null,
      node: { fileKey: source.fileKey, nodeId: source.nodeId },
      kind: "registered-component",
      evidence: `registered component ${source.component ?? source.covers} covers exact Figma node ${finding.fileKey}:${finding.nodeId}`,
    }));
  for (const change of changes) {
    for (const artifact of change.artifacts ?? []) {
      for (const reference of artifact.references ?? []) {
        if (!references.has(nodeKey(reference.fileKey, reference.nodeId)))
          continue;
        matches.push({
          changeId: change.id,
          taskGroup: null,
          artifact: artifact.path,
          node: reference,
          kind: "openspec-artifact",
          evidence: `${artifact.path} references exact Figma node ${reference.fileKey}:${reference.nodeId}`,
        });
      }
    }
  }
  return matches;
}

function mergeReviewedAssociation(finding, changes, matches) {
  const reviewed = finding.associations;
  if (
    !reviewed ||
    typeof reviewed !== "object" ||
    Object.keys(reviewed).length === 0
  )
    return matches;
  if (!reviewed.change) {
    const details = [reviewed.capability, reviewed.taskGroup]
      .filter(Boolean)
      .join(", ");
    return [
      ...matches,
      {
        changeId: null,
        taskGroup: reviewed.taskGroup ?? null,
        artifact: null,
        node: null,
        kind: "reviewed-baseline",
        evidence: `reviewed baseline association${details ? ` (${details})` : ""}`,
      },
    ];
  }
  const change = changes.find((candidate) => candidate.id === reviewed.change);
  if (!change) {
    return [
      ...matches,
      {
        changeId: reviewed.change,
        taskGroup: reviewed.taskGroup ?? null,
        artifact: null,
        node: null,
        kind: "reviewed-baseline",
        evidence: "reviewed baseline association (active change not found)",
        stale: true,
      },
    ];
  }
  const existing = matches.find((match) => match.changeId === change.id);
  if (existing) {
    existing.taskGroup = reviewed.taskGroup ?? existing.taskGroup;
    existing.evidence = `${existing.evidence}; reviewed baseline association`;
    return matches;
  }
  return [
    ...matches,
    {
      changeId: change.id,
      taskGroup: reviewed.taskGroup ?? null,
      artifact: null,
      node: null,
      kind: "reviewed-baseline",
      evidence: "reviewed baseline association",
    },
  ];
}

function mergeReviewedCandidateAssociations(finding, changes, matches) {
  for (const candidate of finding.associationCandidates ?? []) {
    const reviewed = candidate?.associations;
    if (
      !reviewed ||
      typeof reviewed !== "object" ||
      Object.keys(reviewed).length === 0
    )
      continue;
    const candidateChange = changes.find(
      (change) => change.id === reviewed.change,
    );
    const candidateMatch = {
      changeId: reviewed.change ?? null,
      taskGroup: reviewed.taskGroup ?? null,
      artifact: null,
      node: null,
      kind: "reviewed-baseline-candidate",
      annotationKey: candidate.annotationKey ?? null,
      evidence: `reviewed baseline candidate ${candidate.annotationKey ?? "(unknown occurrence)"}`,
      stale: Boolean(reviewed.change && !candidateChange),
    };
    const existing = matches.find(
      (match) =>
        match.changeId === candidateMatch.changeId &&
        match.kind !== "registered-component",
    );
    if (existing) {
      existing.taskGroup = existing.taskGroup ?? candidateMatch.taskGroup;
      existing.evidence = `${existing.evidence}; ${candidateMatch.evidence}`;
    } else {
      matches.push(candidateMatch);
    }
  }
  return matches;
}

function resolveAssociation(finding, changes, explicitAssociations) {
  const matches = explicitAssociations
    ? explicitAssociations.map((match) => ({ ...match }))
    : findExactAssociations(finding, changes);
  const withReviewed = mergeReviewedCandidateAssociations(
    finding,
    changes,
    mergeReviewedAssociation(finding, changes, matches),
  );
  const changeIds = [
    ...new Set(
      withReviewed
        .map((match) => match.changeId)
        .filter((changeId) => changeId),
    ),
  ].sort();
  const stale = withReviewed.some((match) => match.stale);
  return {
    status: stale
      ? "stale"
      : finding.ambiguity
        ? "ambiguous"
        : changeIds.length > 1
          ? "ambiguous"
          : changeIds.length || withReviewed.length
            ? "exact"
            : "none",
    changeIds,
    matches: withReviewed,
    evidence: withReviewed.map((match) => match.evidence),
  };
}

function groupOwner(change, taskGroup) {
  if (!taskGroup) return null;
  const number = taskGroupNumber(taskGroup);
  const matches = (change?.taskGroups ?? []).filter(
    (group) => group.number === number,
  );
  if (matches.length !== 1) return null;
  return normalizeHandle(matches[0].owner);
}

function ownershipFor({ association, changes, currentHandle }) {
  if (
    !currentHandle ||
    association.status !== "exact" ||
    association.changeIds.length !== 1
  )
    return "Unassigned or untracked";
  const change = changes.find(
    (candidate) => candidate.id === association.changeIds[0],
  );
  const match = association.matches.find(
    (candidate) => candidate.changeId === change?.id,
  );
  const owner = groupOwner(change, match?.taskGroup);
  if (owner)
    return owner === currentHandle ? "My assigned work" : "Owned by others";
  if (normalizeHandle(change?.proposalAuthor) === currentHandle)
    return "Authored by me";
  return "Unassigned or untracked";
}

function recommendationFor(finding, association) {
  if (association.status === "ambiguous")
    return "Manually choose the owning OpenSpec change; do not infer it from similar prose.";
  if (association.status === "stale")
    return "Repair the stale baseline/OpenSpec association before accepting the annotation.";
  if (association.status === "none")
    return "Review as a requirement, UI state, technical note, visual note, or no-impact clarification.";
  if (finding.kind === "removed")
    return "Confirm the node removal, then update the reviewed baseline if the decision is accepted.";
  return "Review the exact Figma/OpenSpec evidence, then update the requirement or reviewed baseline as appropriate.";
}

function reportFinding(finding, association, ownershipGroup) {
  return {
    ...finding,
    association,
    ownershipGroup,
    recommendation: recommendationFor(finding, association),
  };
}

export function buildReport({
  scanner,
  currentHandle,
  changes = [],
  findingAssociations,
} = {}) {
  const identityHandle = normalizeHandle(currentHandle);
  const identity = identityHandle
    ? { handle: identityHandle, resolved: true, note: null }
    : {
        handle: null,
        resolved: false,
        note: "Personal ownership grouping could not be determined because the planning identity was unresolved.",
      };
  const groups = {
    "My assigned work": [],
    "Owned by others": { count: 0, owners: [], findings: [] },
    "Authored by me": [],
    "Unassigned or untracked": [],
  };
  for (const finding of scanner?.findings ?? []) {
    const association = resolveAssociation(
      finding,
      changes,
      findingAssociations?.[finding.id],
    );
    const ownershipGroup = ownershipFor({
      association,
      changes,
      currentHandle: identityHandle,
    });
    const item = reportFinding(finding, association, ownershipGroup);
    if (ownershipGroup === "Owned by others")
      groups[ownershipGroup].findings.push(item);
    else groups[ownershipGroup].push(item);
  }
  groups["Owned by others"].count = groups["Owned by others"].findings.length;
  groups["Owned by others"].owners = [
    ...new Set(
      groups["Owned by others"].findings.flatMap((finding) =>
        finding.association.matches
          .map((match) => {
            const change = changes.find(
              (candidate) => candidate.id === match.changeId,
            );
            return groupOwner(change, match.taskGroup);
          })
          .filter(Boolean),
      ),
    ),
  ].sort();
  const findingsCount = (scanner?.findings ?? []).length;
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    status: scanner?.status ?? "blocked",
    identity,
    summary: {
      findings: findingsCount,
      blockers: (scanner?.blockers ?? []).length,
      skippedRoots: (scanner?.skippedRoots ?? []).length,
    },
    blockers: scanner?.blockers ?? [],
    skippedRoots: scanner?.skippedRoots ?? [],
    groups,
    scanner: {
      status: scanner?.status ?? "blocked",
      observationDigest: scanner?.observationDigest ?? null,
      baselineDigest: scanner?.baselineDigest ?? null,
      scannedSources: scanner?.scannedSources ?? [],
    },
  };
}

function formatCategory(id, label) {
  return `${label} (${id ?? "none"})`;
}

function fenceTicks(text) {
  const runs = String(text).match(/`+/g) ?? [];
  const longest = runs.reduce((max, run) => Math.max(max, run.length), 0);
  return "`".repeat(Math.max(3, longest + 1));
}

function renderAnnotationSection(title, text) {
  if (text == null) return [`**${title}**`, "", "_(none)_"];
  const body = String(text);
  if (body.length === 0) return [`**${title}**`, "", "_(empty)_"];
  const ticks = fenceTicks(body);
  return [`**${title}**`, "", `${ticks}text`, body, ticks];
}

function renderFinding(finding) {
  const previousCategoryId = finding.previousCategoryId ?? null;
  const currentCategoryId = finding.currentCategoryId ?? null;
  const previousCategoryLabel =
    finding.previousCategoryLabel ??
    (previousCategoryId === null ? "Uncategorized" : "unknown");
  const currentCategoryLabel =
    finding.currentCategoryLabel ??
    (currentCategoryId === null ? "Uncategorized" : "unknown");
  const previousCategory = formatCategory(
    previousCategoryId,
    previousCategoryLabel,
  );
  const currentCategory = formatCategory(
    currentCategoryId,
    currentCategoryLabel,
  );
  const categoryValue =
    previousCategory === currentCategory
      ? currentCategory
      : `${previousCategory} → ${currentCategory}`;
  const name = String(finding.nodeName ?? "(unnamed)").replace(/\s+/g, " ");
  const figma = finding.nodeLink
    ? `[Open in Figma](${finding.nodeLink})`
    : "Figma link unavailable";
  const lines = [
    `### ${name}`,
    "",
    `\`${finding.id}\` · ${finding.kind} · ${figma}`,
    "",
    `**Category:** ${categoryValue}`,
    "",
    ...renderAnnotationSection("Previous annotation", finding.previousText),
    "",
    ...renderAnnotationSection("Current annotation", finding.currentText),
    "",
  ];
  if (finding.annotationKey || finding.currentAnnotationKey)
    lines.push(
      `- Annotation key: \`${finding.annotationKey ?? finding.currentAnnotationKey}\``,
    );
  lines.push(
    `- Pinned properties: \`${JSON.stringify(finding.previousPinnedProperties ?? [])}\` → \`${JSON.stringify(finding.currentPinnedProperties ?? [])}\``,
  );
  lines.push(
    `- Ambiguity: ${finding.ambiguity ? `${finding.ambiguity.kind} — ${finding.ambiguity.reason}` : "none"}`,
  );
  if (finding.registeredSources?.length) {
    lines.push("- Registered roots:");
    for (const source of finding.registeredSources) {
      const sourceName =
        source.component ?? source.covers ?? source.label ?? "registered root";
      const path = source.path ? ` (${source.path})` : "";
      lines.push(
        `  - ${sourceName} — ${source.fileKey ?? finding.fileKey}:${source.nodeId ?? "unknown"}${path}`,
      );
    }
  } else lines.push("- Registered roots: none");
  if (finding.ancestorEvidence?.length) {
    lines.push("- Ancestors:");
    for (const ancestor of finding.ancestorEvidence)
      lines.push(
        `  - ${ancestor.nodeId} — ${ancestor.name ?? "(unnamed)"}${ancestor.type ? ` [${ancestor.type}]` : ""}`,
      );
  } else lines.push("- Ancestors: none");
  lines.push(`- Association: ${finding.association.status}`);
  lines.push(`- Ownership: ${finding.ownershipGroup}`);
  if (
    finding.association.matches.length ||
    finding.association.evidence.length
  ) {
    lines.push("- OpenSpec evidence:");
    for (const match of finding.association.matches) {
      const taskGroup = match.taskGroup ? ` task group ${match.taskGroup}` : "";
      const target = match.changeId
        ? `change ${match.changeId}${taskGroup}`
        : "registered component";
      lines.push(`  - ${target} — ${match.evidence}`);
    }
    if (!finding.association.matches.length)
      for (const evidence of finding.association.evidence)
        lines.push(`  - ${evidence}`);
  } else lines.push("- OpenSpec evidence: none");
  lines.push(`- **Next:** ${finding.recommendation}`);
  return lines.join("\n");
}

function renderSkippedRoots(skippedRoots) {
  if (!skippedRoots?.length) return [];
  const lines = ["\n## Skipped registered roots"];
  for (const root of skippedRoots) {
    const name =
      root.name ??
      root.source?.component ??
      root.source?.label ??
      "registered root";
    const path = root.source?.path ? ` (${root.source.path})` : "";
    lines.push(
      `- ${name} — ${root.fileKey ?? ""}:${root.nodeId ?? "unknown"}${path}`,
    );
    if (root.reason) lines.push(`  reason: ${root.reason}`);
  }
  return lines;
}

export function renderReport(report, { compact = false } = {}) {
  const skippedRoots = report.skippedRoots ?? [];
  if (
    report.status === "clean" &&
    report.summary.findings === 0 &&
    report.summary.blockers === 0 &&
    !skippedRoots.length
  )
    return "✓ No tracked annotations changed.";
  const lines = [
    report.status === "blocked"
      ? `✗ Annotation scan blocked (${report.summary.blockers} blocker(s)).`
      : report.status === "clean"
        ? "✓ No tracked annotations changed."
        : `✗ Annotation drift found (${report.summary.findings} finding(s)).`,
  ];
  if (report.identity?.note) lines.push(`  ${report.identity.note}`);
  for (const blocker of report.blockers ?? [])
    lines.push(
      `  blocked: ${blocker.fileKey ?? ""} ${blocker.nodeId ?? ""} ${blocker.reason}`.trim(),
    );
  for (const groupName of [
    "My assigned work",
    "Owned by others",
    "Authored by me",
    "Unassigned or untracked",
  ]) {
    const group = report.groups[groupName];
    const findings = Array.isArray(group) ? group : group.findings;
    lines.push(`\n## ${groupName}`);
    if (groupName === "Owned by others" && group.count)
      lines.push(
        `${group.count} finding(s), owned by ${group.owners.map((owner) => `@${owner}`).join(", ") || "unknown owners"}.`,
      );
    if (!findings.length) {
      lines.push("(none)");
      continue;
    }
    if (compact && groupName === "Owned by others") {
      lines.push(
        `${group.count} finding(s), owned by ${group.owners.map((owner) => `@${owner}`).join(", ") || "unknown owners"}.`,
      );
      continue;
    }
    for (const finding of findings) {
      lines.push("");
      lines.push(renderFinding(finding));
    }
  }
  lines.push(...renderSkippedRoots(skippedRoots));
  return lines.join("\n");
}

export class ReconciliationSelectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ReconciliationSelectionError";
  }
}

function requiredString(value, label) {
  if (typeof value !== "string" || !value.trim())
    throw new ReconciliationSelectionError(
      `${label} must be a non-empty string`,
    );
  return value.trim();
}

export function buildReconciliationReport(input = {}) {
  const report = buildReport(input);
  return {
    ...report,
    scope: input.scope ?? input.scanner?.scope ?? null,
    observationDigest: input.scanner?.observationDigest ?? null,
    baselineDigest: input.scanner?.baselineDigest ?? null,
    observationSchemaVersion: input.scanner?.observationSchemaVersion ?? null,
  };
}

export function selectFindings(report, ids) {
  if (!report || report.status === "blocked")
    throw new ReconciliationSelectionError(
      "blocked evidence cannot be selected for reconciliation",
    );
  if (!Array.isArray(ids) || !ids.length)
    throw new ReconciliationSelectionError("select at least one finding ID");
  if (new Set(ids).size !== ids.length)
    throw new ReconciliationSelectionError(
      "selected finding IDs must be unique",
    );
  const findings = [
    ...(report.groups?.["My assigned work"] ?? []),
    ...(report.groups?.["Authored by me"] ?? []),
    ...(report.groups?.["Unassigned or untracked"] ?? []),
    ...(report.groups?.["Owned by others"]?.findings ?? []),
  ];
  const byId = new Map(findings.map((finding) => [finding.id, finding]));
  return ids.map((id) => {
    const finding = byId.get(id);
    if (!finding)
      throw new ReconciliationSelectionError(`unknown finding ID ${id}`);
    return finding;
  });
}

export function validateDecisionCollection(report, ids, decisions) {
  const selected = selectFindings(report, ids);
  if (!decisions || typeof decisions !== "object" || Array.isArray(decisions))
    throw new ReconciliationSelectionError("decisions must be an object");
  const values = Array.isArray(decisions.decisions) ? decisions.decisions : [];
  if (
    new Set(values.map((decision) => decision?.findingId)).size !==
    values.length
  )
    throw new ReconciliationSelectionError(
      "decisions must contain one entry per finding ID",
    );
  const byId = new Map(
    values.map((decision) => [decision?.findingId, decision]),
  );
  for (const finding of selected) {
    const decision = byId.get(finding.id);
    if (!decision)
      throw new ReconciliationSelectionError(
        `missing decision for selected finding ${finding.id}`,
      );
    const hasAssociation = decision.associations !== undefined;
    const hasNoImpact = decision.noImpactReason !== undefined;
    if (hasAssociation === hasNoImpact)
      throw new ReconciliationSelectionError(
        `decision for ${finding.id} needs exactly one of associations or noImpactReason`,
      );
    if (
      hasAssociation &&
      (!decision.associations ||
        typeof decision.associations !== "object" ||
        Array.isArray(decision.associations) ||
        !Object.keys(decision.associations).length)
    )
      throw new ReconciliationSelectionError(
        `decision for ${finding.id} associations must be a non-empty object`,
      );
    if (
      hasNoImpact &&
      (typeof decision.noImpactReason !== "string" ||
        !decision.noImpactReason.trim())
    )
      throw new ReconciliationSelectionError(
        `decision for ${finding.id} noImpactReason must be non-empty`,
      );
    if (finding.association?.status === "ambiguous") {
      if (finding.kind === "added") {
        if (decision.currentAnnotationKey !== finding.currentAnnotationKey)
          throw new ReconciliationSelectionError(
            `ambiguous finding ${finding.id} needs its currentAnnotationKey`,
          );
      } else if (
        typeof decision.annotationKey !== "string" ||
        (finding.candidateAnnotationKeys &&
          !finding.candidateAnnotationKeys.includes(decision.annotationKey))
      ) {
        throw new ReconciliationSelectionError(
          `ambiguous finding ${finding.id} needs one candidate annotationKey`,
        );
      }
    }
  }
  for (const decision of values)
    if (!ids.includes(decision?.findingId))
      throw new ReconciliationSelectionError(
        `decision ${decision?.findingId ?? "(unknown)"} was not selected`,
      );
  return selected.map((finding) => ({
    finding,
    decision: byId.get(finding.id),
  }));
}

export function buildReconciliationPlan({
  report,
  selectedIds,
  decisions,
  relatedFiles = [],
} = {}) {
  if (!report?.observationDigest)
    throw new ReconciliationSelectionError(
      "report is missing its observation digest",
    );
  if (decisions?.observationDigest !== report.observationDigest)
    throw new ReconciliationSelectionError(
      "decision observation digest does not match the report",
    );
  validateDecisionCollection(report, selectedIds, decisions);
  if (
    !Array.isArray(relatedFiles) ||
    relatedFiles.some(
      (file) =>
        typeof file !== "string" ||
        !file.trim() ||
        file.startsWith("/") ||
        file.split("/").includes(".."),
    )
  )
    throw new ReconciliationSelectionError(
      "related OpenSpec files must be relative paths without traversal",
    );
  return {
    scope: report.scope ?? null,
    observationDigest: report.observationDigest,
    baselineDigest: report.baselineDigest ?? null,
    acceptedIds: [...selectedIds],
    decisions,
    relatedFiles: [...new Set(relatedFiles)].sort(),
  };
}

export function verifyReconciliation({ before, after, acceptedIds = [] } = {}) {
  if (!before || before.status === "blocked")
    throw new ReconciliationSelectionError(
      "verification needs complete pre-acceptance evidence",
    );
  const beforeIds = new Set(
    (before.findings ?? []).map((finding) => finding.id),
  );
  const afterIds = new Set(
    (after?.findings ?? []).map((finding) => finding.id),
  );
  for (const id of acceptedIds) {
    if (!beforeIds.has(id))
      throw new ReconciliationSelectionError(
        `accepted finding ${id} was not in the selected report`,
      );
    if (afterIds.has(id))
      throw new ReconciliationSelectionError(
        `accepted ${id} remains after reconciliation`,
      );
  }
  for (const id of beforeIds) {
    if (!acceptedIds.includes(id) && !afterIds.has(id))
      throw new ReconciliationSelectionError(
        `unselected finding ${id} disappeared after reconciliation`,
      );
  }
  const remainingIds = [...afterIds].sort();
  return {
    status: after?.blockers?.length
      ? "blocked"
      : remainingIds.length
        ? "partial"
        : "clean",
    remainingIds,
    blockers: after?.blockers ?? [],
  };
}

export function acceptanceCommand({
  storeRoot,
  snapshotPath,
  scope,
  ids,
  decisionsPath,
}) {
  requiredString(storeRoot, "store root");
  requiredString(snapshotPath, "snapshot path");
  requiredString(scope, "scope");
  requiredString(decisionsPath, "decisions path");
  if (!Array.isArray(ids) || !ids.length)
    throw new ReconciliationSelectionError(
      "acceptance needs selected finding IDs",
    );
  return {
    command: "pnpm",
    args: [
      "figma:annotations:accept",
      "--scope",
      scope,
      "--snapshot",
      snapshotPath,
      "--ids",
      ids.join(","),
      "--decisions",
      decisionsPath,
    ],
    cwd: resolve(storeRoot),
  };
}

export function scopedCommitPlan({
  storeRoot,
  acceptedFiles,
  status,
  confirmed = false,
} = {}) {
  if (!confirmed) return { status: "confirmation-required" };
  if (!storeRoot || !Array.isArray(acceptedFiles) || !acceptedFiles.length)
    throw new ReconciliationSelectionError(
      "a confirmed commit needs an exact file allowlist",
    );
  if (status?.overlap || status?.unrelated)
    throw new ReconciliationSelectionError(
      "unrelated or overlapping standalone-store changes block the commit",
    );
  if (
    acceptedFiles.some(
      (file) =>
        typeof file !== "string" ||
        !file.trim() ||
        file.startsWith("/") ||
        file.split("/").includes(".."),
    )
  )
    throw new ReconciliationSelectionError(
      "commit allowlist must contain relative paths without traversal",
    );
  const files = [...new Set(acceptedFiles)].sort();
  return {
    status: "ready",
    cwd: resolve(storeRoot),
    files,
    commands: {
      stage: ["git", "add", "--", ...files],
      inspect: ["git", "diff", "--cached", "--", ...files],
      commit: [
        "git",
        "commit",
        "-m",
        "docs(base): reconcile Figma annotations",
      ],
    },
    pushes: false,
    modifiesFigma: false,
    advancesSubmodule: false,
    opensPullRequest: false,
  };
}
