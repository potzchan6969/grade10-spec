import { createHash } from "node:crypto";

import { normalizeNodeId, normalizeText } from "./annotation-monitor.mjs";

export const ANNOTATION_OBSERVATION_SCHEMA_VERSION = 1;

export class ObservationValidationError extends Error {
  constructor(message, blockers = []) {
    super(message);
    this.name = "ObservationValidationError";
    this.blockers = blockers;
  }
}

function fail(message, blocker = {}) {
  throw new ObservationValidationError(message, [
    { kind: "malformed-observation", reason: message, ...blocker },
  ]);
}

function requiredString(value, label) {
  if (typeof value !== "string" || !value.trim())
    fail(`${label} must be a non-empty string`);
  return value.trim();
}

function optionalString(value, label) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") fail(`${label} must be a string or null`);
  return value.trim() || null;
}

function canonicalPinnedProperties(properties, pinnedProperties) {
  const values = pinnedProperties ?? properties ?? [];
  if (!Array.isArray(values))
    fail("annotation pinnedProperties must be an array");
  const types = values.map((property) => {
    const type = typeof property === "string" ? property : property?.type;
    if (typeof type !== "string" || !type.trim())
      fail("annotation pinned property must have a non-empty type");
    return type.trim();
  });
  return [...new Set(types)].sort((left, right) => left.localeCompare(right));
}

function normalizeEvidence(evidence, label) {
  if (evidence === undefined) return [];
  if (!Array.isArray(evidence)) fail(`${label} must be an array`);
  return evidence
    .map((ancestor) => {
      if (!ancestor || typeof ancestor !== "object")
        fail(`${label} must contain objects`);
      return {
        nodeId: requiredString(
          normalizeNodeId(ancestor.nodeId ?? ancestor.id),
          `${label} nodeId`,
        ),
        name: optionalString(ancestor.name, `${label} name`),
        type: optionalString(ancestor.type, `${label} type`),
      };
    })
    .sort((left, right) => left.nodeId.localeCompare(right.nodeId));
}

function normalizeCategoryCatalog(categories) {
  if (!Array.isArray(categories)) fail("file categoryCatalog must be an array");
  const seen = new Set();
  return categories
    .map((category) => {
      if (!category || typeof category !== "object")
        fail("category catalog entries must be objects");
      const id = requiredString(category.id, "category id");
      if (seen.has(id)) fail(`duplicate category ID ${id}`);
      seen.add(id);
      const isPreset = category.isPreset ?? category.preset;
      if (isPreset !== undefined && typeof isPreset !== "boolean")
        fail(`category ${id} isPreset must be a boolean`);
      return {
        id,
        label: requiredString(category.label, `category ${id} label`),
        color: optionalString(category.color, `category ${id} color`),
        isPreset: isPreset ?? null,
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}

function normalizeAnnotation(annotation, categoryMap) {
  if (!annotation || typeof annotation !== "object")
    fail("annotation must be an object");
  const textValue =
    annotation.labelMarkdown ?? annotation.label ?? annotation.text ?? "";
  if (typeof textValue !== "string") fail("annotation text must be a string");
  const categoryId =
    annotation.categoryId === undefined || annotation.categoryId === null
      ? null
      : requiredString(annotation.categoryId, "annotation categoryId");
  const category = categoryId ? categoryMap.get(categoryId) : null;
  if (categoryId && !category) {
    throw new ObservationValidationError(
      `category ID ${categoryId} is absent from the file catalog`,
      [{ kind: "unresolved-category", categoryId }],
    );
  }
  const text = normalizeText(textValue);
  const pinnedProperties = canonicalPinnedProperties(
    annotation.properties,
    annotation.pinnedProperties,
  );
  const signature = JSON.stringify({ text, categoryId, pinnedProperties });
  return {
    text,
    categoryId,
    categoryLabel: category?.label ?? "Uncategorized",
    categoryColor: category?.color ?? null,
    categoryIsPreset: category?.isPreset ?? null,
    pinnedProperties,
    signature,
    structureSignature: JSON.stringify({ categoryId, pinnedProperties }),
  };
}

function normalizeSource(source) {
  if (source === undefined || source === null) return null;
  if (typeof source !== "object") fail("root source must be an object");
  return {
    kind: optionalString(source.kind, "root source kind"),
    path: optionalString(source.path, "root source path"),
    label: optionalString(source.label, "root source label"),
    component: optionalString(source.component, "root source component"),
    covers: optionalString(source.covers, "root source covers"),
  };
}

function normalizeRoot(root, fileKey) {
  if (!root || typeof root !== "object")
    fail("registered roots must be objects");
  const nodeId = requiredString(
    normalizeNodeId(root.nodeId ?? root.id),
    "registered root nodeId",
  );
  return {
    fileKey,
    nodeId,
    name: optionalString(root.name, "registered root name"),
    type: optionalString(root.type, "registered root type"),
    ancestors: normalizeEvidence(root.ancestors, "registered root ancestors"),
    source: normalizeSource(root.source),
  };
}

function normalizeNode(node, roots, categoryMap) {
  if (!node || typeof node !== "object") fail("observed nodes must be objects");
  const nodeId = requiredString(
    normalizeNodeId(node.nodeId ?? node.id),
    "observed node nodeId",
  );
  const rootIds = node.rootIds ?? node.registeredRootIds ?? [];
  if (!Array.isArray(rootIds)) fail(`node ${nodeId} rootIds must be an array`);
  const normalizedRootIds = [
    ...new Set(
      rootIds.map((rootId) =>
        requiredString(normalizeNodeId(rootId), `node ${nodeId} rootId`),
      ),
    ),
  ].sort();
  if (!normalizedRootIds.length) return null;
  for (const rootId of normalizedRootIds) {
    if (!roots.has(rootId))
      fail(`node ${nodeId} references unknown root ${rootId}`);
  }
  if (!Array.isArray(node.annotations))
    fail(`node ${nodeId} annotations must be an array`);
  const annotations = node.annotations
    .map((annotation) => normalizeAnnotation(annotation, categoryMap))
    .sort((left, right) => left.signature.localeCompare(right.signature));
  const ordinals = new Map();
  const occurrences = annotations.map((annotation) => {
    const fingerprint = createHash("sha256")
      .update(annotation.signature)
      .digest("hex")
      .slice(0, 16);
    const ordinal = (ordinals.get(fingerprint) ?? 0) + 1;
    ordinals.set(fingerprint, ordinal);
    return {
      ...annotation,
      fingerprint,
      currentAnnotationKey: `current:${fingerprint}:${ordinal}`,
    };
  });
  return {
    nodeId,
    name: optionalString(node.name, `node ${nodeId} name`),
    type: optionalString(node.type, `node ${nodeId} type`),
    rootIds: normalizedRootIds,
    ancestors: normalizeEvidence(node.ancestors, `node ${nodeId} ancestors`),
    annotations: occurrences,
  };
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function digestFor(payload) {
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(canonicalize(payload)))
    .digest("hex")}`;
}

export function observationDigest(snapshot) {
  const { digest: _digest, ...payload } = snapshot;
  return digestFor(payload);
}

export function normalizeObservation(input) {
  if (!input || typeof input !== "object")
    fail("observation must be an object");
  if (input.schemaVersion !== ANNOTATION_OBSERVATION_SCHEMA_VERSION) {
    fail(
      `observation schemaVersion must be ${ANNOTATION_OBSERVATION_SCHEMA_VERSION}`,
    );
  }
  if (!Array.isArray(input.files)) fail("observation files must be an array");
  const fileKeys = new Set();
  const files = input.files
    .map((file) => {
      if (!file || typeof file !== "object")
        fail("observation files must contain objects");
      const fileKey = requiredString(file.fileKey, "file fileKey");
      if (fileKeys.has(fileKey)) fail(`duplicate observation file ${fileKey}`);
      fileKeys.add(fileKey);
      const roots = Array.isArray(file.roots)
        ? file.roots.map((root) => normalizeRoot(root, fileKey))
        : fail(`file ${fileKey} roots must be an array`);
      if (!roots.length) fail(`file ${fileKey} must contain a registered root`);
      const rootIds = new Set(roots.map((root) => root.nodeId));
      if (rootIds.size !== roots.length)
        fail(`file ${fileKey} has duplicate roots`);
      const categoryCatalog = normalizeCategoryCatalog(file.categoryCatalog);
      const categoryMap = new Map(
        categoryCatalog.map((category) => [category.id, category]),
      );
      if (!Array.isArray(file.nodes))
        fail(`file ${fileKey} nodes must be an array`);
      const nodeIds = new Set();
      let nodes;
      try {
        nodes = file.nodes
          .map((node) => normalizeNode(node, rootIds, categoryMap))
          .filter(Boolean)
          .map((node) => {
            if (nodeIds.has(node.nodeId))
              fail(`file ${fileKey} has duplicate node ${node.nodeId}`);
            nodeIds.add(node.nodeId);
            return node;
          })
          .sort((left, right) => left.nodeId.localeCompare(right.nodeId));
      } catch (error) {
        if (error instanceof ObservationValidationError) {
          error.blockers = error.blockers.map((blocker) => ({
            fileKey,
            ...blocker,
          }));
        }
        throw error;
      }
      const blockers = Array.isArray(file.blockers) ? file.blockers : [];
      return {
        fileKey,
        fileUrl: requiredString(file.fileUrl, `file ${fileKey} fileUrl`),
        roots: roots.sort((left, right) =>
          left.nodeId.localeCompare(right.nodeId),
        ),
        categoryCatalog,
        nodes,
        blockers,
      };
    })
    .sort((left, right) => left.fileKey.localeCompare(right.fileKey));

  const snapshot = {
    schemaVersion: ANNOTATION_OBSERVATION_SCHEMA_VERSION,
    files,
    blockers: Array.isArray(input.blockers) ? input.blockers : [],
  };
  const digest = observationDigest(snapshot);
  if (input.digest !== undefined && input.digest !== digest) {
    throw new ObservationValidationError(
      "observation digest does not match normalized payload",
      [
        {
          kind: "stale-observation",
          expectedDigest: digest,
          receivedDigest: input.digest,
        },
      ],
    );
  }
  return { ...snapshot, digest };
}
