#!/usr/bin/env node

import { createHash } from "node:crypto";
import { appendFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

import { fileKeyFrom } from "./values.mjs";

export const ANNOTATION_SCHEMA_VERSION = 2;

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const defaultBaselinePath = resolve(
  repoRoot,
  "scripts/design-sync/annotation-baseline.json",
);
const sourceTrees = [
  resolve(repoRoot, "packages/design-system/src"),
  resolve(repoRoot, "packages/ui/src/blocks"),
];

try {
  process.loadEnvFile(resolve(repoRoot, ".env"));
} catch {
  // CI supplies FIGMA_TOKEN directly; a local .env is only a convenience.
}

export function normalizeNodeId(id) {
  return String(id ?? "")
    .trim()
    .replace("-", ":");
}

export function normalizeText(text) {
  return String(text ?? "").replace(/\r\n?/g, "\n");
}

function sourceKey(source) {
  return [
    source.fileKey,
    source.nodeId,
    source.kind ?? "source",
    source.path ?? "",
    source.label ?? "",
    source.component ?? "",
    source.covers ?? "",
  ].join("|");
}

function nodeKey(fileKey, nodeId) {
  return `${fileKey}:${normalizeNodeId(nodeId)}`;
}

function stableFindingId(fileKey, nodeId, kind, occurrenceIdentity = "") {
  return createHash("sha256")
    .update(
      `${fileKey}:${normalizeNodeId(nodeId)}:${kind}:${occurrenceIdentity}`,
    )
    .digest("hex")
    .slice(0, 16);
}

function canonicalPinnedProperties(properties) {
  if (properties === undefined) return [];
  if (!Array.isArray(properties))
    throw new Error("annotation properties must be an array");
  const types = properties.map((property) => {
    if (
      !property ||
      typeof property !== "object" ||
      typeof property.type !== "string" ||
      !property.type.trim()
    ) {
      throw new Error("annotation property must have a non-empty type");
    }
    return property.type.trim();
  });
  return [...new Set(types)].sort((left, right) => left.localeCompare(right));
}

function annotationOccurrenceFromRaw(annotation) {
  if (!annotation || typeof annotation !== "object")
    throw new Error("annotation must be an object");

  let text = "";
  if (annotation.labelMarkdown !== undefined) {
    if (typeof annotation.labelMarkdown !== "string")
      throw new Error("annotation labelMarkdown must be a string");
    text = annotation.labelMarkdown;
  } else if (annotation.label !== undefined) {
    if (typeof annotation.label !== "string")
      throw new Error("annotation label must be a string");
    text = annotation.label;
  }
  const categoryId =
    annotation.categoryId === undefined || annotation.categoryId === null
      ? null
      : typeof annotation.categoryId === "string" &&
          annotation.categoryId.trim()
        ? annotation.categoryId.trim()
        : (() => {
            throw new Error("annotation categoryId must be a string or null");
          })();
  const pinnedProperties = canonicalPinnedProperties(annotation.properties);
  const normalizedText = normalizeText(text);
  const signature = JSON.stringify({
    text: normalizedText,
    categoryId,
    pinnedProperties,
  });
  return {
    text: normalizedText,
    categoryId,
    pinnedProperties,
    signature,
    structureSignature: JSON.stringify({ categoryId, pinnedProperties }),
  };
}

function annotationOccurrencesFromNode(node) {
  if (node.annotations === undefined) return [];
  if (!Array.isArray(node.annotations))
    throw new Error("node annotations must be an array");
  const occurrences = node.annotations
    .map(annotationOccurrenceFromRaw)
    .sort((left, right) => left.signature.localeCompare(right.signature));
  const ordinals = new Map();
  return occurrences.map((occurrence) => {
    const fingerprint = createHash("sha256")
      .update(occurrence.signature)
      .digest("hex")
      .slice(0, 16);
    const ordinal = (ordinals.get(fingerprint) ?? 0) + 1;
    ordinals.set(fingerprint, ordinal);
    const currentAnnotationKey = `current:${fingerprint}:${ordinal}`;
    return {
      ...occurrence,
      fingerprint,
      currentAnnotationKey,
    };
  });
}

function indexDocument(document) {
  if (!document || typeof document !== "object")
    throw new Error("Figma response has no document object");

  const nodes = new Map();
  const visit = (node, parentId = null) => {
    if (!node || typeof node !== "object" || typeof node.id !== "string")
      throw new Error("Figma document contains a node without an id");
    const id = normalizeNodeId(node.id);
    if (!id) throw new Error("Figma document contains an empty node id");
    if (nodes.has(id)) throw new Error(`duplicate node id ${id}`);
    if (node.children !== undefined && !Array.isArray(node.children))
      throw new Error(`node ${id} children must be an array`);
    nodes.set(id, { node, parentId });
    for (const child of node.children ?? []) visit(child, id);
  };

  visit(document);
  return nodes;
}

function descendants(nodes, rootId) {
  const found = [];
  for (const [id, record] of nodes) {
    let current = id;
    while (current !== null) {
      if (current === rootId) {
        found.push([id, record]);
        break;
      }
      current = nodes.get(current)?.parentId ?? null;
    }
  }
  return found;
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

function uniqueSources(sources) {
  const seen = new Set();
  return sources.filter((source) => {
    const key = sourceKey(source);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeSource(source) {
  const fileKey = String(source.fileKey ?? "").trim();
  const nodeId = normalizeNodeId(source.nodeId ?? source.node);
  if (!fileKey || !nodeId) return null;
  return { ...source, fileKey, nodeId };
}

function normalizeBaselineOccurrence(raw, blockers, entryKey, index) {
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
    sourceRoot: raw.sourceRoot ?? null,
    associations: raw.associations ?? null,
    noImpactReason: raw.noImpactReason ?? null,
  };
}

function normaliseBaselineEntries(baseline, blockers) {
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
        sourceRoot: raw.sourceRoot ?? null,
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
            sourceRoot: raw.sourceRoot ?? null,
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
      sourceRoot: raw.sourceRoot ?? null,
      annotations: annotations.map((annotation) => ({
        ...annotation,
        sourceRoot: annotation.sourceRoot ?? raw.sourceRoot ?? null,
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

function makeFinding({
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
}) {
  const registeredSources = sources.map((source) => ({
    kind: source.kind ?? "registered-source",
    path: source.path ?? null,
    label: source.label ?? null,
    component: source.component ?? null,
    covers: source.covers ?? null,
    fileKey: source.fileKey,
    nodeId: source.nodeId,
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

function compareOccurrences({
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

function blockerForFile(fileKey, blocker) {
  return { fileKey, ...blocker };
}

export function scanAnnotations({
  baseline,
  sources = [],
  documents = {},
  fileUrls = {},
} = {}) {
  const blockers = [];
  const findings = [];
  const scannedSources = [];
  const normalizedBaselineSources = (baseline?.roots ?? [])
    .map(normalizeSource)
    .filter(Boolean);
  const normalizedSources = uniqueSources(
    [...sources, ...normalizedBaselineSources]
      .map(normalizeSource)
      .filter(Boolean),
  );
  const entries = normaliseBaselineEntries(baseline, blockers);
  const fileKeys = new Set([
    ...normalizedSources.map((source) => source.fileKey),
    ...entries.map((entry) => entry.fileKey),
  ]);
  if (fileKeys.size === 0) {
    blockers.push({
      kind: "no-registered-surfaces",
      reason: "no Code Connect, audit, or explicit baseline roots were found",
    });
  }

  for (const fileKey of [...fileKeys].sort()) {
    const fileSources = normalizedSources.filter(
      (source) => source.fileKey === fileKey,
    );
    const loaded = documents[fileKey];
    const document = loaded?.document ?? loaded;
    if (!document || loaded?.error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: loaded?.kind ?? "figma-unreadable",
          reason: loaded?.error ?? "Figma document was not provided",
        }),
      );
      for (const source of fileSources)
        scannedSources.push({ ...source, status: "blocked" });
      continue;
    }

    let nodes;
    try {
      nodes = indexDocument(document);
    } catch (error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: "malformed-response",
          reason: error instanceof Error ? error.message : String(error),
        }),
      );
      for (const source of fileSources)
        scannedSources.push({ ...source, status: "blocked" });
      continue;
    }

    const sourcesByNode = new Map();
    for (const source of fileSources) {
      const root = nodes.get(source.nodeId);
      if (!root) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "root-unresolvable",
            nodeId: source.nodeId,
            reason: "registered source root cannot be resolved",
          }),
        );
        scannedSources.push({ ...source, status: "blocked" });
        continue;
      }
      scannedSources.push({
        ...source,
        status: "scanned",
        nodeName: root.node.name ?? "(unnamed node)",
      });
      for (const [id] of descendants(nodes, source.nodeId)) {
        const current = sourcesByNode.get(id) ?? [];
        current.push(source);
        sourcesByNode.set(id, current);
      }
    }

    const fileEntries = entries.filter(
      (candidate) => candidate.fileKey === fileKey,
    );
    const entriesForNode = new Map(
      fileEntries.map((entry) => [entry.nodeId, entry]),
    );
    const candidateNodeIds = new Set([
      ...sourcesByNode.keys(),
      ...entriesForNode.keys(),
    ]);
    for (const nodeId of [...candidateNodeIds].sort()) {
      const entry = entriesForNode.get(nodeId) ?? null;
      const record = nodes.get(nodeId);
      if (!record) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "orphaned-baseline-node",
            nodeId,
            reason: "baseline node cannot be resolved",
          }),
        );
        continue;
      }
      let currentOccurrences;
      try {
        currentOccurrences = annotationOccurrencesFromNode(record.node);
      } catch (error) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "malformed-response",
            nodeId,
            reason: error instanceof Error ? error.message : String(error),
          }),
        );
        continue;
      }
      const nodeSources = sourcesByNode.get(nodeId) ?? [];
      findings.push(
        ...compareOccurrences({
          oldOccurrences: entry?.annotations ?? [],
          currentOccurrences,
          fileKey,
          fileUrl: fileUrls[fileKey] ?? nodeSources[0]?.fileUrl,
          node: record.node,
          nodeId,
          sources: nodeSources,
          baselineEntry: entry,
        }),
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
    status,
    scannedSources,
    blockers,
    findings,
  };
}

export function inventoryAnnotations({
  sources = [],
  documents = {},
  fileUrls = {},
  fileKeys: requestedFileKeys = [],
  wholeFile = false,
} = {}) {
  const blockers = [];
  const scannedSources = [];
  const annotations = new Map();
  const normalizedSources = uniqueSources(
    sources.map(normalizeSource).filter(Boolean),
  );
  const fileKeys = new Set([
    ...normalizedSources.map((source) => source.fileKey),
    ...requestedFileKeys,
  ]);

  for (const fileKey of [...fileKeys].sort()) {
    const fileSources = normalizedSources.filter(
      (source) => source.fileKey === fileKey,
    );
    const loaded = documents[fileKey];
    const document = loaded?.document ?? loaded;
    if (!document || loaded?.error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: loaded?.kind ?? "figma-unreadable",
          reason: loaded?.error ?? "Figma document was not provided",
        }),
      );
      for (const source of fileSources)
        scannedSources.push({ ...source, status: "blocked" });
      continue;
    }
    let nodes;
    try {
      nodes = indexDocument(document);
    } catch (error) {
      blockers.push(
        blockerForFile(fileKey, {
          kind: "malformed-response",
          reason: error instanceof Error ? error.message : String(error),
        }),
      );
      continue;
    }

    const sourcesByNode = new Map();
    for (const source of fileSources) {
      const root = nodes.get(source.nodeId);
      if (!root) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "root-unresolvable",
            nodeId: source.nodeId,
            reason: "registered source root cannot be resolved",
          }),
        );
        scannedSources.push({ ...source, status: "blocked" });
        continue;
      }
      scannedSources.push({
        ...source,
        status: "scanned",
        nodeName: root.node.name ?? "(unnamed node)",
      });
      for (const [nodeId] of descendants(nodes, source.nodeId)) {
        const current = sourcesByNode.get(nodeId) ?? [];
        current.push(source);
        sourcesByNode.set(nodeId, current);
      }
    }

    const candidates = wholeFile ? nodes : sourcesByNode;
    for (const [nodeId] of candidates) {
      const node = nodes.get(nodeId).node;
      let occurrences;
      try {
        occurrences = annotationOccurrencesFromNode(node);
      } catch (error) {
        blockers.push(
          blockerForFile(fileKey, {
            kind: "malformed-response",
            nodeId,
            reason: error instanceof Error ? error.message : String(error),
          }),
        );
        continue;
      }
      const nodeSources = sourcesByNode.get(nodeId) ?? [];
      for (const occurrence of occurrences) {
        const key = `${nodeKey(fileKey, nodeId)}:${occurrence.currentAnnotationKey}`;
        const current = annotations.get(key) ?? {
          fileKey,
          nodeId,
          nodeName: node.name ?? "(unnamed node)",
          annotationKey: occurrence.currentAnnotationKey,
          text: occurrence.text,
          categoryId: occurrence.categoryId,
          pinnedProperties: occurrence.pinnedProperties,
          nodeLink: nodeLink(
            fileUrls[fileKey] ?? nodeSources[0]?.fileUrl,
            fileKey,
            nodeId,
          ),
          registeredSources: [],
        };
        current.registeredSources.push(
          ...nodeSources.map((source) => ({
            kind: source.kind ?? "registered-source",
            path: source.path ?? null,
            label: source.label ?? null,
            component: source.component ?? null,
            covers: source.covers ?? null,
            fileKey: source.fileKey,
            nodeId: source.nodeId,
          })),
        );
        annotations.set(key, current);
      }
    }
  }

  for (const annotation of annotations.values()) {
    annotation.registeredSources = uniqueSources(annotation.registeredSources);
  }
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    status: blockers.length ? "blocked" : "inventory",
    scannedSources,
    blockers,
    annotations: [...annotations.values()].sort((a, b) =>
      `${a.fileKey}:${a.nodeId}:${a.annotationKey}`.localeCompare(
        `${b.fileKey}:${b.nodeId}:${b.annotationKey}`,
      ),
    ),
  };
}

export function exitCodeFor(result) {
  if (result.status === "blocked") return 2;
  if (result.status === "drift") return 1;
  return 0;
}

export function renderHuman(result) {
  if (result.status === "inventory") {
    const lines = [
      `✓ Inventory found ${result.annotations.length} annotation(s).`,
    ];
    for (const annotation of result.annotations)
      lines.push(
        `  ${annotation.nodeLink} ${annotation.annotationKey} ${JSON.stringify(annotation.text)} category=${annotation.categoryId ?? "none"} properties=${JSON.stringify(annotation.pinnedProperties)}`,
      );
    return lines.join("\n");
  }
  if (result.status === "clean") return "✓ No tracked annotations changed.";
  const lines = [
    result.status === "blocked"
      ? `✗ Annotation scan blocked (${result.blockers.length} blocker(s)).`
      : `✗ Annotation drift found (${result.findings.length} finding(s)).`,
  ];
  for (const blocker of result.blockers)
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
    if (finding.currentCategoryId !== null)
      lines.push(`    category: ${finding.currentCategoryId}`);
    if (finding.currentPinnedProperties !== null)
      lines.push(
        `    properties: ${JSON.stringify(finding.currentPinnedProperties)}`,
      );
    if (finding.ambiguity)
      lines.push(`    ambiguity: ${finding.ambiguity.kind}`);
  }
  return lines.join("\n");
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function walk(dir) {
  const { readdir } = await import("node:fs/promises");
  const result = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return result;
    throw error;
  }
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(path)));
    else result.push(path);
  }
  return result;
}

export async function discoverSources() {
  const files = (await Promise.all(sourceTrees.map(walk))).flat();
  const sources = [];
  const fileUrls = {};
  for (const path of files) {
    if (path.endsWith(".figma.ts")) {
      const text = await readFile(path, "utf8");
      const url = /^\/\/\s*url=(\S+)/m.exec(text)?.[1];
      const fileKey = url ? fileKeyFrom(url) : null;
      const nodeId = url
        ? normalizeNodeId(/node-id=([^&]+)/.exec(url)?.[1])
        : "";
      if (fileKey && nodeId) {
        const source = {
          fileKey,
          nodeId,
          fileUrl: url,
          kind: "code-connect",
          path: path.slice(repoRoot.length + 1),
          component: /^\/\/\s*component=(.+)$/m.exec(text)?.[1]?.trim() ?? null,
        };
        sources.push(source);
        fileUrls[fileKey] = url.replace(/[?&]node-id=[^&]+/, "");
      }
    }
    if (path.endsWith("audit.json")) {
      let entries;
      try {
        entries = JSON.parse(await readFile(path, "utf8"));
      } catch {
        continue;
      }
      if (!Array.isArray(entries)) continue;
      for (const entry of entries) {
        const fileKey = fileKeyFrom(entry.node ?? "");
        const nodeId = normalizeNodeId(
          /node-id=([^&]+)/.exec(entry.node ?? "")?.[1],
        );
        if (!fileKey || !nodeId) continue;
        sources.push({
          fileKey,
          nodeId,
          fileUrl: entry.node,
          kind: "audit",
          path: path.slice(repoRoot.length + 1),
          label: entry.label ?? null,
          covers: entry.covers ?? null,
        });
        fileUrls[fileKey] = entry.node.replace(/[?&]node-id=[^&]+/, "");
      }
    }
  }
  return { sources: uniqueSources(sources), fileUrls };
}

async function loadDocuments(fileKeys, dumpPath, token) {
  const documents = {};
  if (dumpPath) {
    const dump = await readJson(resolve(repoRoot, dumpPath), "Figma dump");
    if (dump.files && typeof dump.files === "object") return dump.files;
    const dumpKey = dump.fileKey ?? dump.key ?? fileKeys[0];
    if (dumpKey) documents[dumpKey] = dump;
    else for (const fileKey of fileKeys) documents[fileKey] = dump;
    return documents;
  }
  if (!token) {
    for (const fileKey of fileKeys)
      documents[fileKey] = {
        kind: "missing-credential",
        error: "FIGMA_TOKEN is not set",
      };
    return documents;
  }
  for (const fileKey of fileKeys) {
    try {
      const response = await fetch(
        `https://api.figma.com/v1/files/${fileKey}`,
        {
          headers: { "X-Figma-Token": token },
        },
      );
      if (!response.ok) {
        documents[fileKey] = {
          kind: "figma-request-failed",
          error: `Figma REST ${response.status} ${response.statusText}`,
        };
        continue;
      }
      documents[fileKey] = await response.json();
    } catch (error) {
      documents[fileKey] = {
        kind: "figma-request-failed",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  return documents;
}

export async function runCli({
  argv = process.argv.slice(2),
  env = process.env,
} = {}) {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: {
      json: { type: "boolean", default: false },
      inventory: { type: "boolean", default: false },
      baseline: { type: "string", default: defaultBaselinePath },
      dump: { type: "string" },
    },
    strict: true,
  });
  const discovered = await discoverSources();
  const baselinePath = resolve(repoRoot, values.baseline);
  let baseline;
  try {
    baseline = await readJson(baselinePath, "annotation baseline");
  } catch (error) {
    baseline = {
      schemaVersion: ANNOTATION_SCHEMA_VERSION,
      roots: discovered.sources,
      entries: {},
    };
    if (!values.inventory) {
      const result = {
        schemaVersion: ANNOTATION_SCHEMA_VERSION,
        status: "blocked",
        scannedSources: [],
        blockers: [{ kind: "missing-baseline", reason: error.message }],
        findings: [],
      };
      if (values.json) console.log(JSON.stringify(result, null, 2));
      else console.log(renderHuman(result));
      return exitCodeFor(result);
    }
  }
  const fileKeys = [
    ...new Set([
      ...discovered.sources.map((source) => source.fileKey),
      ...(baseline.roots ?? []).map((source) => source.fileKey),
      ...Object.values(baseline.entries ?? {}).map((entry) => entry.fileKey),
    ]),
  ];
  const documents = await loadDocuments(
    fileKeys,
    values.dump ?? env.FIGMA_DUMP,
    env.FIGMA_TOKEN,
  );
  const result = scanAnnotations({
    baseline,
    sources: discovered.sources,
    documents,
    fileUrls: discovered.fileUrls,
  });
  const output = values.inventory
    ? inventoryAnnotations({
        sources: discovered.sources,
        documents,
        fileUrls: discovered.fileUrls,
        fileKeys,
        wholeFile: true,
      })
    : result;
  if (values.json) console.log(JSON.stringify(output, null, 2));
  else console.log(renderHuman(output));
  if (env.GITHUB_STEP_SUMMARY) {
    await appendFile(env.GITHUB_STEP_SUMMARY, `${renderHuman(output)}\n`);
  }
  return exitCodeFor(output);
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
