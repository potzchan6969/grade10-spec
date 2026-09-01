export const ANNOTATION_SCOPES = Object.freeze(["product", "spec"]);

export class AnnotationScopeError extends Error {
  constructor(message, blockers = []) {
    super(message);
    this.name = "AnnotationScopeError";
    this.blockers = blockers.length
      ? blockers
      : [{ kind: "malformed-scope", reason: message }];
  }
}

export function normalizeScope(scope) {
  if (!ANNOTATION_SCOPES.includes(scope))
    throw new AnnotationScopeError("scope must be spec or product");
  return scope;
}

function normalizeNodeId(nodeId) {
  return String(nodeId ?? "")
    .trim()
    .replace(/-/g, ":");
}

function requiredString(value, label) {
  if (typeof value !== "string" || !value.trim())
    throw new AnnotationScopeError(`${label} must be a non-empty string`);
  return value.trim();
}

function scopeKey(fileKey, nodeId) {
  return `${fileKey}:${normalizeNodeId(nodeId)}`;
}

export function buildScopeIndex(baseline) {
  if (!baseline || typeof baseline !== "object")
    throw new AnnotationScopeError("baseline must be an object");
  if (!Array.isArray(baseline.roots))
    throw new AnnotationScopeError("baseline roots must be an array");

  const rootScopes = new Map();
  const rootsByKey = new Map();
  const sourceKeysByRoot = new Map();
  for (const root of baseline.roots) {
    if (!root || typeof root !== "object")
      throw new AnnotationScopeError("baseline roots must contain objects");
    const fileKey = requiredString(root.fileKey, "root fileKey");
    const nodeId = requiredString(normalizeNodeId(root.nodeId), "root nodeId");
    const scope = normalizeScope(root.scope);
    const key = scopeKey(fileKey, nodeId);
    const previous = rootScopes.get(key);
    if (previous && previous !== scope)
      throw new AnnotationScopeError(
        `registered root ${key} has conflicting scopes: ${previous} and ${scope}`,
        [
          {
            kind: "conflicting-root-scope",
            fileKey,
            nodeId,
            scopes: [previous, scope],
          },
        ],
      );
    const sourceKey = JSON.stringify([
      root.kind ?? null,
      root.path ?? null,
      root.label ?? null,
      root.component ?? null,
      root.covers ?? null,
    ]);
    const sourceKeys = sourceKeysByRoot.get(key) ?? new Set();
    if (sourceKeys.has(sourceKey))
      throw new AnnotationScopeError(
        `registered root ${key} contains duplicate source evidence`,
        [
          {
            kind: "duplicate-root-source",
            fileKey,
            nodeId,
          },
        ],
      );
    sourceKeys.add(sourceKey);
    sourceKeysByRoot.set(key, sourceKeys);
    rootScopes.set(key, scope);
    const roots = rootsByKey.get(key) ?? [];
    roots.push(root);
    rootsByKey.set(key, roots);
  }

  return { rootScopes, rootsByKey };
}

export function scopeForRoot(index, fileKey, nodeId) {
  if (!index || !(index.rootScopes instanceof Map))
    throw new AnnotationScopeError("scope index is required");
  const key = scopeKey(
    requiredString(fileKey, "root fileKey"),
    requiredString(normalizeNodeId(nodeId), "root nodeId"),
  );
  const scope = index.rootScopes.get(key);
  if (!scope)
    throw new AnnotationScopeError(`registered root ${key} has no scope`, [
      { kind: "unknown-registered-root", fileKey, nodeId },
    ]);
  return scope;
}

export function scopeForEntry(index, entry) {
  if (!entry || typeof entry !== "object")
    throw new AnnotationScopeError("baseline entry must be an object");
  return scopeForRoot(index, entry.fileKey, entry.sourceRoot);
}

export function projectBaseline(baseline, scope) {
  const requestedScope = normalizeScope(scope);
  const index = buildScopeIndex(baseline);
  const roots = baseline.roots.filter(
    (root) => scopeForRoot(index, root.fileKey, root.nodeId) === requestedScope,
  );
  const entries = Object.fromEntries(
    Object.entries(baseline.entries ?? {}).filter(
      ([, entry]) => scopeForEntry(index, entry) === requestedScope,
    ),
  );
  return { ...baseline, roots, entries };
}
