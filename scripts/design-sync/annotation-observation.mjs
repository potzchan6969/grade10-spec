#!/usr/bin/env node

import { createHash } from "node:crypto";

export const OBSERVATION_SCHEMA_VERSION = 2;

export class FigmaObservationUnavailableError extends Error {
  constructor(message, blockers = []) {
    super(message);
    this.name = "FigmaObservationUnavailableError";
    this.blockers = blockers.length
      ? blockers
      : [{ kind: "figma-plugin-api-unavailable", reason: message }];
  }
}

function requiredString(value, label) {
  if (typeof value !== "string" || !value.trim())
    throw new FigmaObservationUnavailableError(
      `${label} must be a non-empty string`,
      [
        {
          kind: "malformed-observation-input",
          reason: `${label} must be a non-empty string`,
        },
      ],
    );
  return value.trim();
}

function normalizeNodeId(value) {
  return String(value ?? "")
    .trim()
    .replace(/-/g, ":");
}

function normalizeText(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n");
}

function optionalString(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return null;
  return value.trim() || null;
}

function annotationProperties(annotation) {
  const properties = annotation?.properties ?? [];
  if (!Array.isArray(properties))
    throw new FigmaObservationUnavailableError(
      "Figma annotation properties must be an array",
      [
        {
          kind: "malformed-figma-evidence",
          reason: "annotation properties must be an array",
        },
      ],
    );
  return [
    ...new Set(
      properties
        .map((property) => property?.type)
        .filter((type) => typeof type === "string" && type.trim())
        .map((type) => type.trim()),
    ),
  ].sort((left, right) => left.localeCompare(right));
}

function normalizeCategory(category) {
  return {
    id: requiredString(category?.id, "annotation category id"),
    label: requiredString(category?.label, "annotation category label"),
    color: optionalString(category?.color),
    isPreset:
      typeof category?.isPreset === "boolean" ? category.isPreset : null,
  };
}

function normalizeSource(source) {
  if (!source || typeof source !== "object") return null;
  return {
    kind: optionalString(source.kind),
    path: optionalString(source.path),
    label: optionalString(source.label),
    component: optionalString(source.component),
    covers: optionalString(source.covers),
  };
}

function sourceKey(source) {
  return JSON.stringify([
    source.kind,
    source.path,
    source.label,
    source.component,
    source.covers,
  ]);
}

function evidenceFor(node) {
  const ancestors = [];
  const seen = new Set();
  let parent = node?.parent ?? null;
  while (parent && typeof parent === "object") {
    const id = normalizeNodeId(parent.id);
    if (!id || seen.has(id)) break;
    seen.add(id);
    ancestors.push({
      nodeId: id,
      name: optionalString(parent.name),
      type: optionalString(parent.type),
    });
    parent = parent.parent ?? null;
  }
  return ancestors;
}

function collectNodes(root) {
  const nodes = [root];
  if (typeof root?.findAll === "function") {
    nodes.push(...root.findAll(() => true));
  } else {
    const visit = (node) => {
      for (const child of node?.children ?? []) {
        nodes.push(child);
        visit(child);
      }
    };
    visit(root);
  }
  const seen = new Set();
  return nodes.filter((node) => {
    const id = normalizeNodeId(node?.id);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function normalizedAnnotation(annotation, categoryMap) {
  const categoryId =
    annotation?.categoryId === undefined || annotation?.categoryId === null
      ? null
      : requiredString(annotation.categoryId, "annotation categoryId");
  const category = categoryId ? categoryMap.get(categoryId) : null;
  if (categoryId && !category)
    throw new FigmaObservationUnavailableError(
      `annotation category ${categoryId} is missing from the file catalog`,
      [{ kind: "unresolved-category", categoryId }],
    );
  const text = normalizeText(
    annotation?.labelMarkdown ?? annotation?.label ?? "",
  );
  const pinnedProperties = annotationProperties(annotation);
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

function normalizedRoot(root, fileKey) {
  const nodeId = requiredString(
    normalizeNodeId(root?.nodeId ?? root?.id),
    "registered root nodeId",
  );
  const configuredSources = Array.isArray(root?.sources)
    ? root.sources
    : [root?.source ?? root];
  const sources = configuredSources.map((source) => normalizeSource(source));
  if (sources.some((source) => !source))
    throw new FigmaObservationUnavailableError(
      `registered root ${nodeId} has malformed source evidence`,
      [
        {
          kind: "malformed-observation-input",
          fileKey,
          nodeId,
          reason: "registered root sources must be objects",
        },
      ],
    );
  return {
    fileKey,
    nodeId,
    name: optionalString(root?.name),
    type: optionalString(root?.type),
    ancestors: Array.isArray(root?.ancestors) ? root.ancestors : [],
    sources,
  };
}

function trackedNodeIds(file, fileKey) {
  if (file?.trackedNodeIds === undefined) return new Set();
  if (!Array.isArray(file.trackedNodeIds))
    throw new FigmaObservationUnavailableError(
      `file ${fileKey} trackedNodeIds must be an array`,
      [
        {
          kind: "malformed-observation-input",
          fileKey,
          reason: "trackedNodeIds must be an array",
        },
      ],
    );
  return new Set(
    file.trackedNodeIds.map((nodeId) =>
      requiredString(normalizeNodeId(nodeId), "tracked nodeId"),
    ),
  );
}

function observationFileUrl(file, fileKey) {
  return requiredString(
    file?.fileUrl ?? `https://www.figma.com/design/${fileKey}`,
    `file ${fileKey} fileUrl`,
  );
}

/**
 * Capture one registered Figma file through a read-only Plugin API adapter.
 * The adapter is intentionally injected so every harness can provide its own
 * Plugin API bridge while the observation shape and safety rules stay fixed.
 */

function inventoryRoots(file) {
  const registrations = Array.isArray(file?.registrations)
    ? file.registrations
    : [];
  const roots = new Map();
  for (const registration of registrations) {
    const nodeId = requiredString(
      normalizeNodeId(registration?.nodeId),
      "registered root nodeId",
    );
    const source = normalizeSource(registration);
    if (!source)
      throw new FigmaObservationUnavailableError(
        `registered root ${nodeId} has malformed source evidence`,
      );
    const root = roots.get(nodeId) ?? { nodeId, sources: [] };
    const key = sourceKey(source);
    if (root.sources.some((candidate) => sourceKey(candidate) === key))
      throw new FigmaObservationUnavailableError(
        `registered root ${nodeId} contains duplicate source evidence`,
        [
          {
            kind: "malformed-observation-input",
            fileKey: file.fileKey,
            nodeId,
            reason: "duplicate root source",
          },
        ],
      );
    root.sources.push(source);
    roots.set(nodeId, root);
  }
  return [...roots.values()];
}

export async function observeRegisteredFile({ figma, file } = {}) {
  if (!figma || typeof figma.getNodeByIdAsync !== "function")
    throw new FigmaObservationUnavailableError(
      "Figma Plugin API access is unavailable (getNodeByIdAsync is required)",
    );
  if (
    !figma.annotations ||
    typeof figma.annotations.getAnnotationCategoriesAsync !== "function"
  )
    throw new FigmaObservationUnavailableError(
      "Figma Plugin API access is unavailable (annotation category catalog is required)",
    );
  const fileKey = requiredString(
    file?.fileKey ?? figma.fileKey,
    "file fileKey",
  );
  if (figma.fileKey && figma.fileKey !== fileKey)
    throw new FigmaObservationUnavailableError(
      `Figma file key ${figma.fileKey} does not match registered file ${fileKey}`,
      [{ kind: "wrong-figma-file", fileKey, receivedFileKey: figma.fileKey }],
    );
  const configuredRoots = Array.isArray(file?.registrations)
    ? inventoryRoots(file)
    : Array.isArray(file?.roots)
      ? file.roots
      : [];
  if (!configuredRoots.length)
    throw new FigmaObservationUnavailableError(
      "at least one registered root is required",
      [
        {
          kind: "malformed-observation-input",
          reason: "at least one registered root is required",
        },
      ],
    );
  const trackedIds = trackedNodeIds(file, fileKey);

  let rawCategories;
  try {
    rawCategories = await figma.annotations.getAnnotationCategoriesAsync();
  } catch (error) {
    throw new FigmaObservationUnavailableError(
      `Figma annotation category catalog could not be read: ${error instanceof Error ? error.message : String(error)}`,
      [{ kind: "category-catalog-unreadable", fileKey, reason: String(error) }],
    );
  }
  if (!Array.isArray(rawCategories))
    throw new FigmaObservationUnavailableError(
      "Figma annotation category catalog is malformed",
      [
        {
          kind: "malformed-figma-evidence",
          fileKey,
          reason: "category catalog must be an array",
        },
      ],
    );
  const categoryCatalog = rawCategories
    .map(normalizeCategory)
    .sort((a, b) => a.id.localeCompare(b.id));
  const categoryMap = new Map(
    categoryCatalog.map((category) => [category.id, category]),
  );
  const rootGroups = new Map();
  for (const configuredRoot of configuredRoots) {
    const root = normalizedRoot(configuredRoot, fileKey);
    const group = rootGroups.get(root.nodeId) ?? {
      ...root,
      sources: [],
      sourceKeys: new Set(),
    };
    for (const source of root.sources) {
      const key = sourceKey(source);
      if (group.sourceKeys.has(key))
        throw new FigmaObservationUnavailableError(
          `registered root ${root.nodeId} contains duplicate source evidence`,
          [
            {
              kind: "malformed-observation-input",
              fileKey,
              nodeId: root.nodeId,
              reason: "duplicate root source",
            },
          ],
        );
      group.sourceKeys.add(key);
      group.sources.push(source);
    }
    if (!group.name && root.name) group.name = root.name;
    if (!group.type && root.type) group.type = root.type;
    if (!group.ancestors.length && root.ancestors.length)
      group.ancestors = root.ancestors;
    rootGroups.set(root.nodeId, group);
  }

  const roots = [];
  const skippedRoots = [];
  const nodesById = new Map();
  for (const group of rootGroups.values()) {
    let node;
    try {
      node = await figma.getNodeByIdAsync(group.nodeId);
    } catch (error) {
      throw new FigmaObservationUnavailableError(
        `registered root ${group.nodeId} could not be read: ${error instanceof Error ? error.message : String(error)}`,
        [
          {
            kind: "registered-root-unreadable",
            fileKey,
            nodeId: group.nodeId,
            reason: String(error),
          },
        ],
      );
    }
    if (!node) {
      skippedRoots.push({
        fileKey,
        nodeId: group.nodeId,
        name: group.name,
        type: group.type,
        ancestors: group.ancestors,
        sources: group.sources,
        reason: "registered root could not be resolved",
      });
      continue;
    }
    roots.push({
      fileKey,
      nodeId: group.nodeId,
      name: group.name ?? optionalString(node.name),
      type: group.type ?? optionalString(node.type),
      ancestors: group.ancestors.length ? group.ancestors : evidenceFor(node),
      sources: group.sources,
    });
    let candidates;
    try {
      candidates = collectNodes(node);
    } catch (error) {
      throw new FigmaObservationUnavailableError(
        `registered root ${group.nodeId} could not be traversed: ${error instanceof Error ? error.message : String(error)}`,
        [
          {
            kind: "registered-root-unreadable",
            fileKey,
            nodeId: group.nodeId,
            reason: String(error),
          },
        ],
      );
    }
    for (const candidate of candidates) {
      const nodeId = normalizeNodeId(candidate.id);
      const rawAnnotations = candidate.annotations ?? [];
      if (!Array.isArray(rawAnnotations))
        throw new FigmaObservationUnavailableError(
          `node ${nodeId} annotations are malformed`,
          [
            {
              kind: "malformed-figma-evidence",
              fileKey,
              nodeId,
              reason: "annotations must be an array",
            },
          ],
        );
      const annotations = rawAnnotations
        .map((annotation) => normalizedAnnotation(annotation, categoryMap))
        .sort((left, right) => left.signature.localeCompare(right.signature));
      const evidence = {
        nodeId,
        name: optionalString(candidate.name),
        type: optionalString(candidate.type),
        ancestors: evidenceFor(candidate),
        annotations,
      };
      const existing = nodesById.get(nodeId);
      if (existing) {
        const previousEvidence = JSON.stringify({
          name: existing.name,
          type: existing.type,
          ancestors: existing.ancestors,
          annotations: existing.annotations,
        });
        const currentEvidence = JSON.stringify({
          name: evidence.name,
          type: evidence.type,
          ancestors: evidence.ancestors,
          annotations: evidence.annotations,
        });
        if (previousEvidence !== currentEvidence)
          throw new FigmaObservationUnavailableError(
            `node ${nodeId} was observed inconsistently across registered roots`,
            [
              {
                kind: "inconsistent-node-observation",
                fileKey,
                nodeId,
                reason: "repeated node evidence differs",
              },
            ],
          );
        if (!existing.rootIds.includes(group.nodeId))
          existing.rootIds.push(group.nodeId);
        continue;
      }
      nodesById.set(nodeId, {
        ...evidence,
        rootIds: [group.nodeId],
      });
    }
  }
  if (!roots.length)
    throw new FigmaObservationUnavailableError(
      skippedRoots.length === 1
        ? `registered root ${skippedRoots[0].nodeId} could not be resolved`
        : "no registered root could be resolved",
      skippedRoots.map((root) => ({
        kind: "unresolved-registered-root",
        fileKey,
        nodeId: root.nodeId,
      })),
    );
  for (const root of [...roots, ...skippedRoots])
    root.sources.sort((left, right) =>
      sourceKey(left).localeCompare(sourceKey(right)),
    );
  const nodes = [...nodesById.values()]
    .filter(
      (node) => node.annotations.length > 0 || trackedIds.has(node.nodeId),
    )
    .map((node) => {
      const annotations = node.annotations.sort((left, right) =>
        left.signature.localeCompare(right.signature),
      );
      const ordinals = new Map();
      return {
        ...node,
        rootIds: [...new Set(node.rootIds)].sort(),
        annotations: annotations.map((annotation) => {
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
        }),
      };
    })
    .sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  const snapshot = {
    schemaVersion: OBSERVATION_SCHEMA_VERSION,
    files: [
      {
        fileKey,
        fileUrl: observationFileUrl(file, fileKey),
        roots: roots.sort((a, b) => a.nodeId.localeCompare(b.nodeId)),
        skippedRoots: skippedRoots.sort((a, b) =>
          a.nodeId.localeCompare(b.nodeId),
        ),
        categoryCatalog,
        nodes,
        blockers: [],
      },
    ],
    blockers: [],
  };
  return snapshot;
}

export async function observeRegisteredFiles({
  figma,
  inventory,
  files = [],
} = {}) {
  const configuredFiles = Array.isArray(inventory?.files)
    ? inventory.files
    : files;
  if (!Array.isArray(configuredFiles) || !configuredFiles.length)
    throw new FigmaObservationUnavailableError(
      "at least one registered Figma file is required",
      [
        {
          kind: "malformed-observation-input",
          reason: "at least one registered Figma file is required",
        },
      ],
    );
  const observations = [];
  for (const file of configuredFiles) {
    const adapter =
      typeof figma === "function"
        ? await figma(file)
        : (figma?.[file.fileKey] ?? figma);
    observations.push(await observeRegisteredFile({ figma: adapter, file }));
  }
  const merged = {
    schemaVersion: OBSERVATION_SCHEMA_VERSION,
    files: observations.flatMap((observation) => observation.files),
    blockers: observations.flatMap((observation) => observation.blockers),
  };
  return merged;
}

export function blockedObservation(error) {
  const blockers = error?.blockers?.length
    ? error.blockers
    : [
        {
          kind: "figma-plugin-api-unavailable",
          reason: error instanceof Error ? error.message : String(error),
        },
      ];
  return {
    schemaVersion: OBSERVATION_SCHEMA_VERSION,
    files: [],
    blockers,
  };
}
