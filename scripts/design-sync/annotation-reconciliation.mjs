import {
  ANNOTATION_SCHEMA_VERSION,
  compareOccurrences,
  makeFinding,
  normaliseBaselineEntries,
} from "./annotation-core.mjs";
import {
  normalizeObservation,
  ObservationValidationError,
} from "./annotation-snapshot.mjs";

function sourceFromRoot(root, fileUrl) {
  return {
    ...(root.source ?? {}),
    fileKey: root.fileKey,
    nodeId: root.nodeId,
    fileUrl,
    kind: root.source?.kind ?? "registered-source",
    name: root.name,
    type: root.type,
    ancestors: root.ancestors,
  };
}

function blockerForFile(fileKey, blocker) {
  return { fileKey, ...blocker };
}

function orphanFindings({ file, entry, sources }) {
  return entry.annotations.map((occurrence) =>
    makeFinding({
      fileKey: entry.fileKey,
      fileUrl: file?.fileUrl,
      node: undefined,
      nodeId: entry.nodeId,
      kind: "orphaned",
      previous: occurrence,
      current: null,
      sources,
      baselineEntry: entry,
      annotationKey: occurrence.annotationKey,
    }),
  );
}

function blockedResult(blockers, observationDigest = null) {
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    observationSchemaVersion: null,
    observationDigest,
    status: "blocked",
    scannedSources: [],
    blockers,
    findings: [],
  };
}

export class AcceptanceValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AcceptanceValidationError";
  }
}

function acceptanceError(message) {
  throw new AcceptanceValidationError(message);
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateDecision(decision, finding) {
  if (!isRecord(decision))
    acceptanceError(`decision for ${finding.id} must be an object`);
  const hasAssociations = decision.associations !== undefined;
  const hasNoImpactReason = decision.noImpactReason !== undefined;
  if (hasAssociations === hasNoImpactReason) {
    acceptanceError(
      `decision for ${finding.id} needs exactly one of associations or noImpactReason`,
    );
  }
  if (hasAssociations) {
    if (
      !isRecord(decision.associations) ||
      !Object.keys(decision.associations).length
    )
      acceptanceError(
        `decision for ${finding.id} associations must be a non-empty object`,
      );
    for (const [key, value] of Object.entries(decision.associations)) {
      if (typeof value !== "string" || !value.trim())
        acceptanceError(
          `decision for ${finding.id} association ${key} must be a non-empty string`,
        );
    }
  } else if (
    typeof decision.noImpactReason !== "string" ||
    !decision.noImpactReason.trim()
  ) {
    acceptanceError(
      `decision for ${finding.id} noImpactReason must be non-empty`,
    );
  }
  if (finding.ambiguity) {
    if (finding.kind === "added") {
      if (decision.currentAnnotationKey !== finding.currentAnnotationKey)
        acceptanceError(
          `ambiguous finding ${finding.id} needs its currentAnnotationKey`,
        );
    } else {
      const annotationKey = decision.annotationKey ?? finding.annotationKey;
      if (
        typeof annotationKey !== "string" ||
        (finding.candidateAnnotationKeys &&
          !finding.candidateAnnotationKeys.includes(annotationKey))
      ) {
        acceptanceError(
          `ambiguous finding ${finding.id} needs one candidate annotationKey`,
        );
      }
    }
  }
  if (finding.kind === "orphaned") {
    if (decision.action !== "remove" && decision.action !== "replace")
      acceptanceError(
        `orphaned finding ${finding.id} requires action=remove or action=replace`,
      );
    if (
      decision.action === "replace" &&
      (typeof decision.replacementFindingId !== "string" ||
        !decision.replacementFindingId)
    )
      acceptanceError(
        `orphaned finding ${finding.id} requires replacementFindingId`,
      );
  }
  return decision;
}

function applyDecisionMetadata(occurrence, decision) {
  if (decision.associations !== undefined) {
    return {
      ...occurrence,
      associations: decision.associations,
      noImpactReason: null,
    };
  }
  return {
    ...occurrence,
    associations: null,
    noImpactReason: decision.noImpactReason.trim(),
  };
}

function rawOccurrence(occurrence) {
  const result = {
    annotationKey: occurrence.annotationKey,
    text: occurrence.text,
    categoryId: occurrence.categoryId,
    pinnedProperties: [...occurrence.pinnedProperties],
  };
  if (occurrence.associations !== null && occurrence.associations !== undefined)
    result.associations = occurrence.associations;
  if (
    occurrence.noImpactReason !== null &&
    occurrence.noImpactReason !== undefined
  )
    result.noImpactReason = occurrence.noImpactReason;
  return result;
}

function serializeBaseline(entries, baseline) {
  return {
    ...baseline,
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    entries: Object.fromEntries(
      entries
        .filter((entry) => entry.annotations.length > 0)
        .sort((left, right) => left.key.localeCompare(right.key))
        .map((entry) => [
          entry.key,
          {
            fileKey: entry.fileKey,
            nodeId: entry.nodeId,
            sourceRoot: entry.sourceRoot,
            annotations: entry.annotations.map(rawOccurrence),
          },
        ]),
    ),
  };
}

function acceptedAnnotationKey(currentAnnotationKey, annotations) {
  const suffix = currentAnnotationKey.startsWith("current:")
    ? currentAnnotationKey.slice("current:".length)
    : currentAnnotationKey;
  const used = new Set(
    annotations.map((annotation) => annotation.annotationKey),
  );
  let key = `accepted:${suffix}`;
  let ordinal = 2;
  while (used.has(key)) key = `accepted:${suffix}:${ordinal++}`;
  return key;
}

function findEntry(entries, fileKey, nodeId) {
  return entries.find(
    (entry) => entry.fileKey === fileKey && entry.nodeId === nodeId,
  );
}

function currentOccurrenceFromFinding(finding) {
  return {
    annotationKey: finding.currentAnnotationKey,
    text: finding.currentText ?? "",
    categoryId: finding.currentCategoryId,
    pinnedProperties: finding.currentPinnedProperties ?? [],
    associations: null,
    noImpactReason: null,
  };
}

export function acceptSnapshot({
  baseline,
  snapshot,
  ids = [],
  decisions,
} = {}) {
  if (!Array.isArray(ids) || !ids.length)
    acceptanceError("at least one finding ID must be selected");
  if (new Set(ids).size !== ids.length)
    acceptanceError("selected finding IDs must be unique");
  if (!isRecord(decisions)) acceptanceError("decisions must be an object");

  const diff = scanSnapshot({ baseline, snapshot });
  const blockingKinds = new Set([
    "orphaned-baseline-node",
    "orphaned-baseline",
  ]);
  const blockingEvidence = diff.blockers.filter(
    (blocker) => !blockingKinds.has(blocker.kind),
  );
  if (blockingEvidence.length)
    acceptanceError("observation or baseline evidence is blocked");
  if (decisions.observationDigest !== diff.observationDigest)
    acceptanceError("decision observation digest does not match the snapshot");
  if (!Array.isArray(decisions.decisions))
    acceptanceError("decisions.decisions must be an array");
  const findingsById = new Map(
    diff.findings.map((finding) => [finding.id, finding]),
  );
  const decisionsById = new Map();
  for (const decision of decisions.decisions) {
    if (!isRecord(decision) || typeof decision.findingId !== "string")
      acceptanceError("every decision needs a findingId");
    if (decisionsById.has(decision.findingId))
      acceptanceError(`duplicate decision for ${decision.findingId}`);
    decisionsById.set(decision.findingId, decision);
  }
  for (const id of ids) {
    const finding = findingsById.get(id);
    if (!finding) acceptanceError(`unknown finding ID ${id}`);
    const decision = decisionsById.get(id);
    if (!decision)
      acceptanceError(`missing decision for selected finding ${id}`);
    validateDecision(decision, finding);
  }
  for (const id of decisionsById.keys()) {
    if (!ids.includes(id)) acceptanceError(`decision ${id} was not selected`);
  }

  const baselineBlockers = [];
  const entries = normaliseBaselineEntries(baseline, baselineBlockers);
  if (baselineBlockers.length) acceptanceError("baseline is malformed");
  const replacementIds = new Set(
    ids
      .map((id) => decisionsById.get(id))
      .filter((decision) => decision.action === "replace")
      .map((decision) => decision.replacementFindingId),
  );

  for (const id of ids) {
    const finding = findingsById.get(id);
    const decision = decisionsById.get(id);
    if (finding.kind === "orphaned") {
      const entry = findEntry(entries, finding.fileKey, finding.nodeId);
      if (!entry)
        acceptanceError(`orphaned finding ${id} has no baseline entry`);
      entry.annotations = entry.annotations.filter(
        (annotation) => annotation.annotationKey !== finding.annotationKey,
      );
      continue;
    }
    let entry = findEntry(entries, finding.fileKey, finding.nodeId);
    if (finding.kind === "added") {
      if (!entry) {
        entry = {
          fileKey: finding.fileKey,
          nodeId: finding.nodeId,
          key: `${finding.fileKey}:${finding.nodeId}`,
          sourceRoot: finding.registeredSources[0]?.nodeId ?? null,
          annotations: [],
        };
        entries.push(entry);
      }
      const occurrence = currentOccurrenceFromFinding(finding);
      occurrence.annotationKey = acceptedAnnotationKey(
        finding.currentAnnotationKey,
        entry.annotations,
      );
      entry.annotations.push(applyDecisionMetadata(occurrence, decision));
      continue;
    }
    if (finding.kind === "removed") {
      if (!entry)
        acceptanceError(`removed finding ${id} has no baseline entry`);
      const annotationKey = decision.annotationKey ?? finding.annotationKey;
      entry.annotations = entry.annotations.filter(
        (annotation) => annotation.annotationKey !== annotationKey,
      );
      continue;
    }
    if (finding.kind === "changed") {
      if (!entry)
        acceptanceError(`changed finding ${id} has no baseline entry`);
      const annotation = entry.annotations.find(
        (candidate) => candidate.annotationKey === finding.annotationKey,
      );
      if (!annotation)
        acceptanceError(`changed finding ${id} has no baseline occurrence`);
      annotation.text = finding.currentText;
      annotation.categoryId = finding.currentCategoryId;
      annotation.pinnedProperties = finding.currentPinnedProperties ?? [];
      Object.assign(annotation, applyDecisionMetadata(annotation, decision));
      continue;
    }
    acceptanceError(`finding ${id} cannot be accepted`);
  }

  for (const replacementId of replacementIds) {
    if (!replacementId || !findingsById.has(replacementId))
      acceptanceError("replacementFindingId must name a selected finding");
    if (!ids.includes(replacementId))
      acceptanceError("replacement finding must be selected with its orphan");
    if (findingsById.get(replacementId).kind !== "added")
      acceptanceError("replacement finding must be an added occurrence");
  }
  return {
    status: "accepted",
    observationDigest: diff.observationDigest,
    acceptedIds: ids,
    baseline: serializeBaseline(entries, baseline),
    remaining: scanSnapshot({
      baseline: serializeBaseline(entries, baseline),
      snapshot,
    }),
  };
}

export function scanSnapshot({ baseline, snapshot } = {}) {
  let normalized;
  try {
    normalized = normalizeObservation(snapshot);
  } catch (error) {
    const blockers =
      error instanceof ObservationValidationError
        ? error.blockers
        : [{ kind: "malformed-observation", reason: String(error) }];
    return blockedResult(blockers);
  }

  const blockers = [...normalized.blockers];
  const findings = [];
  const scannedSources = [];
  const baselineBlockers = [];
  const entries = normaliseBaselineEntries(baseline, baselineBlockers);
  blockers.push(...baselineBlockers);
  const filesByKey = new Map(
    normalized.files.map((file) => [file.fileKey, file]),
  );
  const fileKeys = new Set([
    ...filesByKey.keys(),
    ...entries.map((entry) => entry.fileKey),
    ...(baseline?.roots ?? []).map((root) => root.fileKey).filter(Boolean),
  ]);

  for (const fileKey of [...fileKeys].sort()) {
    const file = filesByKey.get(fileKey);
    const fileEntries = entries.filter((entry) => entry.fileKey === fileKey);
    if (!file) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: "missing-observed-file",
          reason: "snapshot did not contain this registered file",
        }),
      );
      for (const entry of fileEntries) {
        findings.push(...orphanFindings({ file: null, entry, sources: [] }));
      }
      continue;
    }

    blockers.push(
      ...file.blockers.map((blocker) => blockerForFile(fileKey, blocker)),
    );
    const sources = file.roots.map((root) =>
      sourceFromRoot(root, file.fileUrl),
    );
    for (const source of sources) {
      scannedSources.push({
        ...source,
        status: "scanned",
        nodeName: source.name ?? "(unnamed node)",
      });
    }
    const nodes = new Map(file.nodes.map((node) => [node.nodeId, node]));
    const entriesForNode = new Map(
      fileEntries.map((entry) => [entry.nodeId, entry]),
    );
    const candidateNodeIds = new Set([
      ...nodes.keys(),
      ...entriesForNode.keys(),
    ]);
    for (const nodeId of [...candidateNodeIds].sort()) {
      const entry = entriesForNode.get(nodeId) ?? null;
      const node = nodes.get(nodeId);
      if (!node) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "orphaned-baseline-node",
            nodeId,
            reason: "baseline node cannot be resolved in the snapshot",
          }),
        );
        findings.push(
          ...orphanFindings({
            file,
            entry,
            sources: sources.filter(
              (source) => source.nodeId === entry.sourceRoot,
            ),
          }),
        );
        continue;
      }
      const nodeSources = node.rootIds
        .map((rootId) => sources.find((source) => source.nodeId === rootId))
        .filter(Boolean);
      findings.push(
        ...compareOccurrences({
          oldOccurrences: entry?.annotations ?? [],
          currentOccurrences: node.annotations,
          fileKey,
          fileUrl: file.fileUrl,
          node: { ...node, ancestors: node.ancestors },
          nodeId,
          sources: nodeSources,
          baselineEntry: entry,
        }).map((finding) => ({
          ...finding,
          observationDigest: normalized.digest,
          ancestorEvidence: node.ancestors,
        })),
      );
    }
  }

  const status = blockers.length
    ? "blocked"
    : findings.length
      ? "drift"
      : "clean";
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    observationSchemaVersion: normalized.schemaVersion,
    observationDigest: normalized.digest,
    status,
    scannedSources,
    blockers,
    findings: findings.map((finding) => ({
      observationDigest: normalized.digest,
      ...finding,
    })),
  };
}

export function exitCodeFor(result) {
  if (result.status === "blocked") return 2;
  if (result.status === "drift") return 1;
  return 0;
}

export function renderHuman(result) {
  if (result.status === "clean") return "✓ No tracked annotations changed.";
  const lines = [
    result.status === "blocked"
      ? `✗ Annotation scan blocked (${result.blockers.length} blocker(s)).`
      : `✗ Annotation drift found (${result.findings.length} finding(s)).`,
  ];
  for (const blocker of result.blockers ?? [])
    lines.push(
      `  BLOCKED ${blocker.fileKey ?? ""} ${blocker.nodeId ?? ""} ${blocker.reason}`.trim(),
    );
  for (const finding of result.findings ?? []) {
    lines.push(`  ${finding.kind.toUpperCase()} ${finding.nodeLink}`);
    if (finding.previousText !== null)
      lines.push(`    previous: ${JSON.stringify(finding.previousText)}`);
    if (finding.currentText !== null)
      lines.push(`    current:  ${JSON.stringify(finding.currentText)}`);
    if (finding.annotationKey || finding.currentAnnotationKey)
      lines.push(
        `    annotation: ${finding.annotationKey ?? finding.currentAnnotationKey}`,
      );
    if (
      finding.currentCategoryId !== null ||
      finding.currentCategoryLabel !== null
    )
      lines.push(
        `    category: ${finding.currentCategoryId ?? "none"} (${finding.currentCategoryLabel ?? "Uncategorized"})`,
      );
    if (finding.currentPinnedProperties !== null)
      lines.push(
        `    properties: ${JSON.stringify(finding.currentPinnedProperties)}`,
      );
    if (finding.ambiguity)
      lines.push(`    ambiguity: ${finding.ambiguity.kind}`);
  }
  return lines.join("\n");
}
