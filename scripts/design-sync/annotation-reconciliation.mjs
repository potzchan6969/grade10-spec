import {
  ANNOTATION_SCHEMA_VERSION,
  baselineDigestFor,
  compareOccurrences,
  makeFinding,
  normaliseBaselineEntries,
  normalizeNodeId,
} from "./annotation-core.mjs";
import {
  buildScopeIndex,
  normalizeScope,
  projectBaseline,
  scopeForRoot,
} from "./annotation-scope.mjs";
import {
  normalizeObservation,
  ObservationValidationError,
} from "./annotation-snapshot.mjs";
import {
  normalizeRelatedFiles,
  validateAssociation,
} from "./annotation-store.mjs";

function sourceFromRoot(root, fileUrl, source) {
  return {
    ...source,
    fileKey: root.fileKey,
    nodeId: root.nodeId,
    fileUrl,
    kind: source.kind ?? "registered-source",
    name: root.name,
    type: root.type,
    ancestors: root.ancestors,
  };
}

function sourcesFromRoot(root, fileUrl) {
  return root.sources.map((source) => sourceFromRoot(root, fileUrl, source));
}

function baselineSourcesForFile(baseline, fileKey) {
  return (baseline?.roots ?? [])
    .filter((root) => root?.fileKey === fileKey)
    .map((root) => ({
      fileKey,
      nodeId: normalizeNodeId(root.nodeId),
      fileUrl: root.fileUrl ?? null,
      kind: root.kind ?? "registered-source",
      path: root.path ?? null,
      label: root.label ?? null,
      component: root.component ?? null,
      covers: root.covers ?? null,
      name: root.name ?? null,
      type: root.type ?? null,
      ancestors: root.ancestors ?? [],
    }));
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

function blockedResult(
  blockers,
  observationDigest = null,
  baselineDigest = null,
  scope = null,
) {
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    scope,
    observationSchemaVersion: null,
    observationDigest,
    baselineDigest,
    status: "blocked",
    scannedSources: [],
    skippedRoots: [],
    blockers,
    findings: [],
  };
}

function scopeBlocker({ fileKey, nodeId, scope, registeredScope, kind }) {
  return {
    kind,
    fileKey,
    nodeId,
    scope,
    registeredScope: registeredScope ?? null,
    reason:
      registeredScope === null || registeredScope === undefined
        ? `observed root ${nodeId} is not registered for ${scope} scope`
        : `observed root ${nodeId} is out of scope for ${scope}`,
  };
}

function validateSnapshotScope(snapshot, scopeIndex, scope) {
  const blockers = [];
  const seen = new Set();
  const checkRoot = (fileKey, nodeId, kind) => {
    const normalizedNodeId = normalizeNodeId(nodeId);
    const key = `${fileKey}:${normalizedNodeId}:${kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    let registeredScope;
    try {
      registeredScope = scopeForRoot(scopeIndex, fileKey, normalizedNodeId);
    } catch {
      blockers.push(
        scopeBlocker({
          fileKey,
          nodeId: normalizedNodeId,
          scope,
          registeredScope: null,
          kind,
        }),
      );
      return;
    }
    if (registeredScope !== scope)
      blockers.push(
        scopeBlocker({
          fileKey,
          nodeId: normalizedNodeId,
          scope,
          registeredScope,
          kind: "out-of-scope-root",
        }),
      );
  };
  for (const file of snapshot.files) {
    for (const root of file.roots)
      checkRoot(file.fileKey, root.nodeId, "out-of-scope-root");
    for (const root of file.skippedRoots)
      checkRoot(file.fileKey, root.nodeId, "out-of-scope-skipped-root");
    for (const node of file.nodes)
      for (const rootId of node.rootIds)
        checkRoot(file.fileKey, rootId, "out-of-scope-node-root");
  }
  return blockers;
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

function validateDecision(decision, finding, { storeRoot } = {}) {
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
    try {
      validateAssociation(decision.associations, { storeRoot });
    } catch (error) {
      acceptanceError(
        `decision for ${finding.id} has an invalid association: ${error instanceof Error ? error.message : String(error)}`,
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
  scope,
  ids = [],
  decisions,
  storeRoot,
} = {}) {
  if (!Array.isArray(ids) || !ids.length)
    acceptanceError("at least one finding ID must be selected");
  if (new Set(ids).size !== ids.length)
    acceptanceError("selected finding IDs must be unique");
  if (!isRecord(decisions)) acceptanceError("decisions must be an object");

  const diff = scanSnapshot({ baseline, snapshot, scope });
  if (diff.blockers.length)
    acceptanceError("observation or baseline evidence is blocked");
  if (decisions.observationDigest !== diff.observationDigest)
    acceptanceError("decision observation digest does not match the snapshot");
  if (decisions.baselineDigest !== diff.baselineDigest)
    acceptanceError(
      "decision baseline digest does not match the accepted baseline",
    );
  if (
    decisions.relatedFiles !== undefined ||
    decisions.relatedOpenSpec !== undefined
  ) {
    try {
      normalizeRelatedFiles(
        decisions.relatedFiles ?? decisions.relatedOpenSpec,
        { storeRoot },
      );
    } catch (error) {
      acceptanceError(error instanceof Error ? error.message : String(error));
    }
  }
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
    validateDecision(decision, finding, { storeRoot });
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
      scope,
    }),
  };
}

export function scanSnapshot({ baseline, snapshot, scope } = {}) {
  let requestedScope = null;
  let comparisonBaseline = baseline;
  let scopeIndex = null;
  let normalized;
  try {
    if (scope !== undefined) {
      requestedScope = normalizeScope(scope);
      scopeIndex = buildScopeIndex(baseline);
      comparisonBaseline = projectBaseline(baseline, requestedScope);
    }
    normalized = normalizeObservation(snapshot);
  } catch (error) {
    const blockers =
      error instanceof ObservationValidationError
        ? error.blockers
        : (error?.blockers ?? [
            { kind: "malformed-observation", reason: String(error) },
          ]);
    return blockedResult(
      blockers,
      null,
      baselineDigestFor(baseline),
      requestedScope,
    );
  }

  if (requestedScope) {
    try {
      const scopeBlockers = validateSnapshotScope(
        normalized,
        scopeIndex,
        requestedScope,
      );
      if (scopeBlockers.length)
        return blockedResult(
          scopeBlockers,
          normalized.digest,
          baselineDigestFor(baseline),
          requestedScope,
        );
    } catch (error) {
      return blockedResult(
        error?.blockers ?? [{ kind: "malformed-scope", reason: String(error) }],
        normalized.digest,
        baselineDigestFor(baseline),
        requestedScope,
      );
    }
  }

  const blockers = [...normalized.blockers];
  const findings = [];
  const scannedSources = [];
  const baselineBlockers = [];
  const entries = normaliseBaselineEntries(
    comparisonBaseline,
    baselineBlockers,
  );
  blockers.push(...baselineBlockers);
  const skippedRoots = [];
  const filesByKey = new Map(
    normalized.files.map((file) => [file.fileKey, file]),
  );
  const fileKeys = new Set([
    ...filesByKey.keys(),
    ...entries.map((entry) => entry.fileKey),
    ...(comparisonBaseline?.roots ?? [])
      .map((root) => root.fileKey)
      .filter(Boolean),
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
        const baselineSources = baselineSourcesForFile(
          comparisonBaseline,
          fileKey,
        );
        findings.push(
          ...orphanFindings({
            file: null,
            entry,
            sources: baselineSources.filter(
              (source) => source.nodeId === entry.sourceRoot,
            ),
          }),
        );
      }
      continue;
    }

    blockers.push(
      ...file.blockers.map((blocker) => blockerForFile(fileKey, blocker)),
    );
    const resolvedRootSources = file.roots.flatMap((root) =>
      sourcesFromRoot(root, file.fileUrl),
    );
    const sourcesByRoot = new Map(
      [...file.roots, ...file.skippedRoots].map((root) => [
        root.nodeId,
        sourcesFromRoot(root, file.fileUrl),
      ]),
    );
    for (const source of resolvedRootSources) {
      scannedSources.push({
        ...source,
        status: "scanned",
        nodeName: source.name ?? "(unnamed node)",
      });
    }
    skippedRoots.push(...file.skippedRoots);
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
        findings.push(
          ...orphanFindings({
            file,
            entry,
            sources: sourcesByRoot.get(entry.sourceRoot) ?? [],
          }),
        );
        continue;
      }
      const nodeSources = node.rootIds.flatMap(
        (rootId) => sourcesByRoot.get(rootId) ?? [],
      );
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
    scope: requestedScope,
    observationDigest: normalized.digest,
    baselineDigest: baselineDigestFor(baseline),
    status,
    scannedSources,
    skippedRoots: skippedRoots.sort((left, right) =>
      `${left.fileKey}:${left.nodeId}`.localeCompare(
        `${right.fileKey}:${right.nodeId}`,
      ),
    ),
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
  const skippedRoots = result.skippedRoots ?? [];
  if (result.status === "clean" && !skippedRoots.length)
    return "✓ No tracked annotations changed.";
  const lines = [
    result.status === "blocked"
      ? `✗ Annotation scan blocked (${result.blockers.length} blocker(s)).`
      : result.status === "clean"
        ? "✓ No tracked annotations changed."
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
  if (skippedRoots.length) {
    lines.push("Skipped registered roots:");
    for (const root of skippedRoots) {
      const name = root.name ?? "registered root";
      lines.push(
        `  SKIPPED ${root.fileKey ?? ""} ${root.nodeId ?? ""} ${name} ${root.reason ?? ""}`.trim(),
      );
      for (const source of root.sources ?? []) {
        const provenance = [
          source.kind,
          source.path,
          source.label ?? source.component ?? source.covers,
        ]
          .filter(Boolean)
          .join(" ");
        lines.push(`    source: ${provenance}`.trim());
      }
    }
  }
  return lines.join("\n");
}
