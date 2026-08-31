#!/usr/bin/env node

import { createHash } from "node:crypto";

export const ANNOTATION_SCHEMA_VERSION = 2;

export function normalizeNodeId(id) {
  return String(id ?? "")
    .trim()
    .replace("-", ":");
}

export function normalizeText(text) {
  return String(text ?? "").replace(/\r\n?/g, "\n");
}

function nodeKey(fileKey, nodeId) {
  return `${fileKey}:${normalizeNodeId(nodeId)}`;
}

function normalizeSourceRoot(sourceRoot) {
  return sourceRoot === undefined || sourceRoot === null
    ? null
    : normalizeNodeId(sourceRoot);
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => key !== "baselineDigest")
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function digestFor(value) {
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(canonicalize(value)))
    .digest("hex")}`;
}

/** Digest of the accepted baseline, excluding its optional pin marker. */
export function baselineDigestFor(baseline) {
  return digestFor(baseline ?? null);
}

function stableFindingId(fileKey, nodeId, kind, occurrenceIdentity = "") {
  return createHash("sha256")
    .update(
      `${fileKey}:${normalizeNodeId(nodeId)}:${kind}:${occurrenceIdentity}`,
    )
    .digest("hex")
    .slice(0, 16);
}

function sourceAssociation(source) {
  const registeredName = source.component ?? source.covers;
  if (!registeredName) return null;
  return {
    kind: "registered-component",
    name: registeredName,
    fileKey: source.fileKey,
    nodeId: source.nodeId,
    path: source.path ?? null,
  };
}

export function normalizeBaselineOccurrence(raw, blockers, entryKey, index) {
  if (!raw || typeof raw !== "object") {
    blockers.push({
      kind: "malformed-baseline",
      entryKey,
      reason: `annotation ${index + 1} is not an object`,
    });
    return null;
  }
  if (typeof raw.annotationKey !== "string" || !raw.annotationKey.trim()) {
    blockers.push({
      kind: "malformed-baseline",
      entryKey,
      reason: `annotation ${index + 1} needs annotationKey`,
    });
    return null;
  }
  if (typeof raw.text !== "string") {
    blockers.push({
      kind: "malformed-baseline",
      entryKey,
      reason: `annotation ${index + 1} needs text`,
    });
    return null;
  }
  const categoryId =
    raw.categoryId === undefined || raw.categoryId === null
      ? null
      : typeof raw.categoryId === "string" && raw.categoryId.trim()
        ? raw.categoryId.trim()
        : null;
  if (raw.categoryId !== undefined && raw.categoryId !== null && !categoryId) {
    blockers.push({
      kind: "malformed-baseline",
      entryKey,
      reason: `annotation ${index + 1} categoryId must be a string or null`,
    });
    return null;
  }
  if (!Array.isArray(raw.pinnedProperties)) {
    blockers.push({
      kind: "malformed-baseline",
      entryKey,
      reason: `annotation ${index + 1} pinnedProperties must be an array`,
    });
    return null;
  }
  const pinnedProperties = [];
  for (const property of raw.pinnedProperties) {
    if (typeof property !== "string" || !property.trim()) {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: `annotation ${index + 1} pinnedProperties must contain non-empty strings`,
      });
      return null;
    }
    pinnedProperties.push(property.trim());
  }
  const normalizedText = normalizeText(raw.text);
  const canonicalProperties = [...new Set(pinnedProperties)].sort(
    (left, right) => left.localeCompare(right),
  );
  return {
    annotationKey: raw.annotationKey.trim(),
    text: normalizedText,
    categoryId,
    pinnedProperties: canonicalProperties,
    signature: JSON.stringify({
      text: normalizedText,
      categoryId,
      pinnedProperties: canonicalProperties,
    }),
    structureSignature: JSON.stringify({
      categoryId,
      pinnedProperties: canonicalProperties,
    }),
    sourceRoot: normalizeSourceRoot(raw.sourceRoot),
    associations: raw.associations ?? null,
    noImpactReason: raw.noImpactReason ?? null,
  };
}

export function normaliseBaselineEntries(baseline, blockers) {
  if (!baseline || typeof baseline !== "object") {
    blockers.push({
      kind: "malformed-baseline",
      reason: "baseline is not an object",
    });
    return [];
  }
  if (baseline.schemaVersion !== 1 && baseline.schemaVersion !== 2) {
    blockers.push({
      kind: "malformed-baseline",
      reason: "expected schemaVersion 1 or 2",
    });
  }
  if (!baseline.entries || typeof baseline.entries !== "object") {
    blockers.push({
      kind: "malformed-baseline",
      reason: "entries must be an object",
    });
    return [];
  }

  if (baseline.schemaVersion !== 1 && baseline.schemaVersion !== 2) return [];

  const entries = [];
  for (const [entryKey, raw] of Object.entries(baseline.entries)) {
    if (!raw || typeof raw !== "object") {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: "entry is not an object",
      });
      continue;
    }
    const fileKey = String(raw.fileKey ?? entryKey.split(":")[0] ?? "").trim();
    const nodeId = normalizeNodeId(
      raw.nodeId ?? entryKey.slice(fileKey.length + 1),
    );
    if (!fileKey || !nodeId) {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: "entry needs fileKey and nodeId",
      });
      continue;
    }
    if (entryKey !== nodeKey(fileKey, nodeId)) {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: `entry key must be ${nodeKey(fileKey, nodeId)}`,
      });
      continue;
    }
    if (baseline.schemaVersion === 1) {
      if (typeof raw.text !== "string") {
        blockers.push({
          kind: "malformed-baseline",
          entryKey,
          reason: "schema-version-1 entry needs text",
        });
        continue;
      }
      entries.push({
        fileKey,
        nodeId,
        key: nodeKey(fileKey, nodeId),
        sourceRoot: normalizeSourceRoot(raw.sourceRoot),
        annotations: [
          {
            annotationKey: "legacy-1",
            text: normalizeText(raw.text),
            categoryId: null,
            pinnedProperties: [],
            signature: JSON.stringify({
              text: normalizeText(raw.text),
              categoryId: null,
              pinnedProperties: [],
            }),
            structureSignature: JSON.stringify({
              categoryId: null,
              pinnedProperties: [],
            }),
            sourceRoot: normalizeSourceRoot(raw.sourceRoot),
            associations: raw.associations ?? null,
            noImpactReason: raw.noImpactReason ?? null,
          },
        ],
      });
      continue;
    }

    if (Object.hasOwn(raw, "text")) {
      blockers.push({
        kind: "partly-migrated-baseline",
        entryKey,
        reason: "schema-version-2 entry must use annotations",
      });
      continue;
    }
    if (!Array.isArray(raw.annotations)) {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: "schema-version-2 entry annotations must be an array",
      });
      continue;
    }
    const annotations = raw.annotations
      .map((annotation, index) =>
        normalizeBaselineOccurrence(annotation, blockers, entryKey, index),
      )
      .filter(Boolean);
    if (
      new Set(annotations.map((annotation) => annotation.annotationKey))
        .size !== annotations.length
    ) {
      blockers.push({
        kind: "malformed-baseline",
        entryKey,
        reason: "annotationKey values must be unique within a node",
      });
      continue;
    }
    entries.push({
      fileKey,
      nodeId,
      key: nodeKey(fileKey, nodeId),
      sourceRoot: normalizeSourceRoot(raw.sourceRoot),
      annotations: annotations.map((annotation) => ({
        ...annotation,
        sourceRoot:
          annotation.sourceRoot ?? normalizeSourceRoot(raw.sourceRoot),
      })),
    });
  }
  return entries;
}

function nodeLink(fileUrl, fileKey, nodeId) {
  const normalizedId = normalizeNodeId(nodeId).replace(":", "-");
  try {
    const url = new URL(
      fileUrl ?? `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
    );
    url.searchParams.set("node-id", normalizedId);
    return url.toString();
  } catch {
    return `https://www.figma.com/design/${fileKey}/Grade10-DS-2026?node-id=${normalizedId}`;
  }
}

export function makeFinding({
  fileKey,
  fileUrl,
  node,
  nodeId,
  kind,
  previous,
  current,
  sources,
  baselineEntry,
  annotationKey = null,
  ambiguity = null,
  candidateAnnotationKeys = null,
  associationCandidates = null,
  identityHint = null,
  ancestorEvidence = null,
}) {
  const registeredSources = sources.map((source) => ({
    kind: source.kind ?? "registered-source",
    path: source.path ?? null,
    label: source.label ?? null,
    component: source.component ?? null,
    covers: source.covers ?? null,
    fileKey: source.fileKey,
    nodeId: source.nodeId,
    name: source.name ?? null,
    type: source.type ?? null,
    ancestors: source.ancestors ?? [],
  }));
  const effectiveAssociations = ambiguity
    ? null
    : (previous?.associations ?? null);
  const evidence = [
    ...(previous && !ambiguity
      ? [
          {
            kind: "reviewed-baseline",
            fileKey,
            nodeId,
            annotationKey: previous.annotationKey,
            sourceRoot:
              previous.sourceRoot ?? baselineEntry?.sourceRoot ?? null,
            associations: previous.associations ?? null,
            noImpactReason: previous.noImpactReason ?? null,
          },
        ]
      : []),
    ...(associationCandidates ?? []).map((candidate) => ({
      kind: "reviewed-baseline-candidate",
      fileKey,
      nodeId,
      annotationKey: candidate.annotationKey,
      associations: candidate.associations ?? null,
      noImpactReason: candidate.noImpactReason ?? null,
    })),
    ...sources.map(sourceAssociation).filter(Boolean),
  ];
  const hasAssociation =
    Boolean(effectiveAssociations) ||
    sources.some((source) => source.component || source.covers);
  const previousAnnotation = previous
    ? {
        text: previous.text,
        categoryId: previous.categoryId,
        pinnedProperties: previous.pinnedProperties,
      }
    : null;
  const currentAnnotation = current
    ? {
        text: current.text,
        categoryId: current.categoryId,
        pinnedProperties: current.pinnedProperties,
      }
    : null;
  const currentAnnotationKey = current?.currentAnnotationKey ?? null;
  const identity =
    identityHint ??
    annotationKey ??
    currentAnnotationKey ??
    `${kind}:${ambiguity?.kind ?? "none"}:${candidateAnnotationKeys?.join(",") ?? ""}`;

  return {
    id: stableFindingId(fileKey, nodeId, kind, identity),
    fileKey,
    nodeId,
    nodeLink: nodeLink(fileUrl, fileKey, nodeId),
    nodeName: node?.name ?? "(unnamed node)",
    kind,
    annotationKey,
    currentAnnotationKey,
    previousText: previous?.text ?? null,
    currentText: current?.text ?? null,
    previousCategoryId: previous?.categoryId ?? null,
    currentCategoryId: current?.categoryId ?? null,
    previousCategoryLabel: previous?.categoryLabel ?? null,
    currentCategoryLabel:
      current?.categoryLabel ??
      (current?.categoryId === null ? "Uncategorized" : null),
    previousCategoryColor: previous?.categoryColor ?? null,
    currentCategoryColor: current?.categoryColor ?? null,
    previousCategoryIsPreset: previous?.categoryIsPreset ?? null,
    currentCategoryIsPreset: current?.categoryIsPreset ?? null,
    previousPinnedProperties: previous?.pinnedProperties ?? null,
    currentPinnedProperties: current?.pinnedProperties ?? null,
    previousAnnotation,
    currentAnnotation,
    ambiguity,
    candidateAnnotationKeys,
    registeredSources,
    associations: effectiveAssociations,
    associationCandidates,
    associationEvidence: evidence,
    ancestorEvidence: ancestorEvidence ?? node?.ancestors ?? null,
    classification: ambiguity
      ? "ambiguous"
      : hasAssociation
        ? "associated"
        : "untracked",
  };
}

function occurrenceGroups(occurrences, field) {
  const groups = new Map();
  for (const occurrence of occurrences) {
    const key = occurrence[field];
    const group = groups.get(key) ?? [];
    group.push(occurrence);
    groups.set(key, group);
  }
  return groups;
}

function sameAssociations(left, right) {
  return (
    JSON.stringify({
      associations: left.associations ?? null,
      noImpactReason: left.noImpactReason ?? null,
    }) ===
    JSON.stringify({
      associations: right.associations ?? null,
      noImpactReason: right.noImpactReason ?? null,
    })
  );
}

function structureChangeFor(occurrence, opposite) {
  return opposite.filter(
    (candidate) =>
      candidate.text === occurrence.text &&
      candidate.structureSignature !== occurrence.structureSignature,
  );
}

export function compareOccurrences({
  oldOccurrences,
  currentOccurrences,
  fileKey,
  fileUrl,
  node,
  nodeId,
  sources,
  baselineEntry,
}) {
  const findings = [];
  const oldBySignature = occurrenceGroups(oldOccurrences, "signature");
  const currentBySignature = occurrenceGroups(currentOccurrences, "signature");
  const unmatchedOld = [];
  const unmatchedCurrent = [];

  const exactSignatures = new Set([
    ...oldBySignature.keys(),
    ...currentBySignature.keys(),
  ]);
  for (const signature of [...exactSignatures].sort()) {
    const oldGroup = [...(oldBySignature.get(signature) ?? [])].sort((a, b) =>
      a.annotationKey.localeCompare(b.annotationKey),
    );
    const currentGroup = [...(currentBySignature.get(signature) ?? [])].sort(
      (a, b) => a.currentAnnotationKey.localeCompare(b.currentAnnotationKey),
    );
    const matched = Math.min(oldGroup.length, currentGroup.length);
    unmatchedOld.push(...oldGroup.slice(matched));
    unmatchedCurrent.push(...currentGroup.slice(matched));
  }

  const oldByStructure = occurrenceGroups(unmatchedOld, "structureSignature");
  const currentByStructure = occurrenceGroups(
    unmatchedCurrent,
    "structureSignature",
  );
  const structures = new Set([
    ...oldByStructure.keys(),
    ...currentByStructure.keys(),
  ]);

  for (const structure of [...structures].sort()) {
    const oldGroup = [...(oldByStructure.get(structure) ?? [])].sort((a, b) =>
      a.annotationKey.localeCompare(b.annotationKey),
    );
    const currentGroup = [...(currentByStructure.get(structure) ?? [])].sort(
      (a, b) => a.currentAnnotationKey.localeCompare(b.currentAnnotationKey),
    );

    if (oldGroup.length === 1 && currentGroup.length === 1) {
      findings.push(
        makeFinding({
          fileKey,
          fileUrl,
          node,
          nodeId,
          kind: "changed",
          previous: oldGroup[0],
          current: currentGroup[0],
          sources,
          baselineEntry,
          annotationKey: oldGroup[0].annotationKey,
        }),
      );
      continue;
    }

    const oldStructureChanges = oldGroup.flatMap((occurrence) =>
      structureChangeFor(occurrence, unmatchedCurrent),
    );
    const currentStructureChanges = currentGroup.flatMap((occurrence) =>
      structureChangeFor(occurrence, unmatchedOld),
    );
    const oldKeys = oldGroup.map((occurrence) => occurrence.annotationKey);
    const ambiguous = oldGroup.length > 0 && currentGroup.length > 0;
    const ambiguityKind =
      oldStructureChanges.length || currentStructureChanges.length
        ? "structure-changed"
        : ambiguous
          ? "multiple-unmatched"
          : null;
    const ambiguity = ambiguityKind
      ? {
          kind: ambiguityKind,
          reason:
            ambiguityKind === "structure-changed"
              ? "annotation structure changed; text is not used to pair occurrences"
              : "more than one unmatched occurrence shares the same structural signature",
        }
      : null;
    const candidates = oldGroup.map((occurrence) => ({
      annotationKey: occurrence.annotationKey,
      associations: occurrence.associations ?? null,
      noImpactReason: occurrence.noImpactReason ?? null,
    }));

    for (const occurrence of oldGroup) {
      const duplicateCountDecrease =
        oldBySignature.get(occurrence.signature)?.length >
        (currentBySignature.get(occurrence.signature)?.length ?? 0);
      const duplicateCandidates =
        oldBySignature.get(occurrence.signature) ?? [];
      const duplicateAmbiguous =
        duplicateCountDecrease &&
        duplicateCandidates.some(
          (candidate) => !sameAssociations(candidate, duplicateCandidates[0]),
        );
      const removedAmbiguity = duplicateAmbiguous
        ? {
            kind: "duplicate-count-decrease",
            reason:
              "duplicate occurrences have different baseline associations, so the removed occurrence cannot be identified",
          }
        : ambiguity;
      const removedCandidates = duplicateAmbiguous
        ? duplicateCandidates.map((candidate) => ({
            annotationKey: candidate.annotationKey,
            associations: candidate.associations ?? null,
            noImpactReason: candidate.noImpactReason ?? null,
          }))
        : ambiguous
          ? candidates
          : null;
      findings.push(
        makeFinding({
          fileKey,
          fileUrl,
          node,
          nodeId,
          kind: "removed",
          previous: occurrence,
          current: null,
          sources,
          baselineEntry,
          annotationKey: duplicateAmbiguous ? null : occurrence.annotationKey,
          ambiguity: removedAmbiguity,
          candidateAnnotationKeys:
            removedCandidates?.map((candidate) => candidate.annotationKey) ??
            null,
          associationCandidates: removedCandidates,
          identityHint: duplicateAmbiguous ? occurrence.annotationKey : null,
        }),
      );
    }
    for (const occurrence of currentGroup) {
      const currentAmbiguity = ambiguity
        ? {
            ...ambiguity,
          }
        : null;
      findings.push(
        makeFinding({
          fileKey,
          fileUrl,
          node,
          nodeId,
          kind: "added",
          previous: null,
          current: occurrence,
          sources,
          baselineEntry,
          annotationKey: occurrence.currentAnnotationKey,
          ambiguity: currentAmbiguity,
          candidateAnnotationKeys: ambiguous ? oldKeys : null,
          associationCandidates: ambiguous ? candidates : null,
        }),
      );
    }
  }
  return findings;
}
