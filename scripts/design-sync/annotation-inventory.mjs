import {
  normaliseBaselineEntries,
  normalizeNodeId,
} from "./annotation-core.mjs";
import {
  buildScopeIndex,
  normalizeScope,
  scopeForEntry,
  scopeForRoot,
} from "./annotation-scope.mjs";

export const ANNOTATION_INVENTORY_SCHEMA_VERSION = 1;

function canonicalFileUrl(root, fileKey) {
  try {
    const url = new URL(
      root.fileUrl ?? `https://www.figma.com/design/${fileKey}`,
    );
    url.searchParams.delete("node-id");
    url.hash = "";
    return url.toString();
  } catch {
    return `https://www.figma.com/design/${fileKey}`;
  }
}

function registrationFromRoot(root) {
  return {
    nodeId: normalizeNodeId(root.nodeId),
    kind: root.kind ?? null,
    path: root.path ?? null,
    label: root.label ?? null,
    component: root.component ?? null,
    covers: root.covers ?? null,
  };
}

function registrationSortKey(registration) {
  return JSON.stringify([
    registration.nodeId,
    registration.kind,
    registration.path,
    registration.label,
    registration.component,
    registration.covers,
  ]);
}

export function buildInventory({ baseline, scope } = {}) {
  const requestedScope = normalizeScope(scope);
  const index = buildScopeIndex(baseline);
  const files = new Map();

  for (const root of baseline.roots) {
    if (scopeForRoot(index, root.fileKey, root.nodeId) !== requestedScope)
      continue;
    const file = files.get(root.fileKey) ?? {
      fileKey: root.fileKey,
      fileUrls: new Set(),
      registrations: [],
      trackedNodeIds: new Set(),
    };
    file.fileUrls.add(canonicalFileUrl(root, root.fileKey));
    file.registrations.push(registrationFromRoot(root));
    files.set(root.fileKey, file);
  }

  const baselineBlockers = [];
  const entries = normaliseBaselineEntries(baseline, baselineBlockers);
  if (baselineBlockers.length)
    throw new Error(
      `baseline entries are malformed: ${baselineBlockers[0].reason}`,
    );
  for (const entry of entries) {
    if (scopeForEntry(index, entry) !== requestedScope) continue;
    const file = files.get(entry.fileKey);
    if (file) file.trackedNodeIds.add(normalizeNodeId(entry.nodeId));
  }

  return {
    schemaVersion: ANNOTATION_INVENTORY_SCHEMA_VERSION,
    scope: requestedScope,
    files: [...files.values()]
      .map((file) => ({
        fileKey: file.fileKey,
        fileUrl: [...file.fileUrls].sort()[0],
        registrations: file.registrations.sort((left, right) =>
          registrationSortKey(left).localeCompare(registrationSortKey(right)),
        ),
        trackedNodeIds: [...file.trackedNodeIds].sort(),
      }))
      .sort((left, right) => left.fileKey.localeCompare(right.fileKey)),
  };
}

export const inventoryForScope = buildInventory;
