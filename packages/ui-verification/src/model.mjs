const PROFILE_VALUES = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

export const PROFILES = Object.freeze(
  Object.fromEntries(
    Object.entries(PROFILE_VALUES).map(([id, size]) => [
      id,
      Object.freeze(size),
    ]),
  ),
);

const PROFILE_IDS = Object.keys(PROFILES);
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const SAFE_OBJECT_KEY_PART = /^[A-Za-z0-9._-]+$/;
const SHA256 = /^[a-f0-9]{64}$/i;
const FULL_COMMIT = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i;
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z$/;

function fail(path, message) {
  throw new TypeError(`${path} ${message}`);
}

function isRecord(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function requireRecord(value, path) {
  if (!isRecord(value)) fail(path, "must be an object");
  for (const key of Object.keys(value)) {
    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      fail(`${path}.${key}`, "is not allowed");
    }
  }
  return value;
}

function requireId(value, path) {
  if (typeof value !== "string" || !SAFE_ID.test(value)) {
    fail(path, "must be a path-safe identifier");
  }
  return value;
}

function requireText(value, path) {
  if (typeof value !== "string" || value.trim() === "")
    fail(path, "must be a non-empty string");
  return value;
}

function assertJsonValue(value, path, seen = new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail(path, "must contain only finite numbers");
    return;
  }
  if (typeof value !== "object") fail(path, "must contain only JSON values");
  if (seen.has(value)) fail(path, "must not contain cycles");
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      assertJsonValue(entry, `${path}[${index}]`, seen);
    });
  } else {
    requireRecord(value, path);
    for (const [key, entry] of Object.entries(value))
      assertJsonValue(entry, `${path}.${key}`, seen);
  }
  seen.delete(value);
}

export function validateDeclaration(value) {
  const declaration = requireRecord(value, "declaration");
  if (declaration.schemaVersion !== 1)
    fail("declaration.schemaVersion", "must be 1");
  requireId(declaration.caseId, "declaration.caseId");
  requireId(declaration.targetId, "declaration.targetId");
  requireId(declaration.capturePointId, "declaration.capturePointId");
  requireId(declaration.storyId, "declaration.storyId");
  requireText(declaration.label, "declaration.label");
  if (!PROFILE_IDS.includes(declaration.scoreProfile)) {
    fail(
      "declaration.scoreProfile",
      `must be one of ${PROFILE_IDS.join(", ")}`,
    );
  }
  assertJsonValue(declaration.recipe, "declaration.recipe");
  requireRecord(declaration.reference, "declaration.reference");
  requireId(declaration.reference.storyId, "declaration.reference.storyId");
  if (declaration.reference.selector !== undefined) {
    requireText(
      declaration.reference.selector,
      "declaration.reference.selector",
    );
  }
  return declaration;
}

export function validateDeclarations(values) {
  if (!Array.isArray(values)) fail("declarations", "must be an array");
  const seen = new Set();
  for (const [index, value] of values.entries()) {
    const declaration = validateDeclaration(value);
    const identity = declarationIdentity(declaration);
    if (seen.has(identity))
      fail(
        `declarations[${index}]`,
        "duplicates a caseId, targetId, and capturePointId identity",
      );
    seen.add(identity);
  }
  return values;
}

function declarationIdentity(value) {
  return JSON.stringify([value.caseId, value.targetId, value.capturePointId]);
}

function requireSha256(value, path) {
  if (typeof value !== "string" || !SHA256.test(value))
    fail(path, "must be a 64-character SHA-256 digest");
  return value.toLowerCase();
}

function requireCommit(value, path) {
  if (typeof value !== "string" || !FULL_COMMIT.test(value))
    fail(path, "must be a full 40- or 64-character commit");
  return value.toLowerCase();
}

function requireInstant(value, path) {
  if (
    typeof value !== "string" ||
    !ISO_INSTANT.test(value) ||
    !Number.isFinite(Date.parse(value))
  ) {
    fail(path, "must be a valid UTC instant");
  }
  return value;
}

function requireRef(value, path) {
  if (
    typeof value !== "string" ||
    value.trim() === "" ||
    value.length > 1024 ||
    Array.from(value).some(
      (character) =>
        character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  ) {
    fail(path, "must be a non-empty ref without control characters");
  }
  return value;
}

function validateCheckpointRevision(value, path) {
  const revision = requireRecord(value, path);
  requireRef(revision.ref, `${path}.ref`);
  requireCommit(revision.commit, `${path}.commit`);
  return revision;
}

function validateCheckpoint(value) {
  const checkpoint = requireRecord(value, "manifest.checkpoint");
  validateCheckpointRevision(checkpoint.app, "manifest.checkpoint.app");
  validateCheckpointRevision(
    checkpoint.reference,
    "manifest.checkpoint.reference",
  );
  return checkpoint;
}

export function validateObjectKey(value) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > 1024 ||
    value.startsWith("/")
  ) {
    fail("image.key", "must be a relative object key");
  }
  const parts = value.split("/");
  if (
    parts.some(
      (part) =>
        part === "" ||
        part === "." ||
        part === ".." ||
        !SAFE_OBJECT_KEY_PART.test(part),
    )
  ) {
    fail("image.key", "must contain only safe, non-traversing path segments");
  }
  return value;
}

function validateImage(value, path, dimensions) {
  const image = requireRecord(value, path);
  validateObjectKey(image.key);
  requireSha256(image.sha256, `${path}.sha256`);
  if (image.width !== dimensions.width || image.height !== dimensions.height) {
    fail(
      path,
      `must be a full ${dimensions.width}x${dimensions.height} viewport image`,
    );
  }
  return image;
}

function validateRegion(value, path, image) {
  const region = requireRecord(value, path);
  const { x, y, width, height } = region;
  if (
    ![x, y, width, height].every(Number.isFinite) ||
    x < 0 ||
    y < 0 ||
    width <= 0 ||
    height <= 0
  ) {
    fail(
      path,
      "must have finite non-negative coordinates and positive dimensions",
    );
  }
  if (x + width > image.width || y + height > image.height)
    fail(path, "must fit inside its viewport image");
  return region;
}

function validateProvenance(value, path, manifest, status) {
  const provenance = requireRecord(value, path);
  if (typeof provenance.verified !== "boolean")
    fail(`${path}.verified`, "must be a boolean");
  const appCommit = requireCommit(provenance.appCommit, `${path}.appCommit`);
  const referenceCommit = requireCommit(
    provenance.referenceCommit,
    `${path}.referenceCommit`,
  );
  requireInstant(provenance.capturedAt, `${path}.capturedAt`);
  if (appCommit !== manifest.checkpoint.app.commit.toLowerCase()) {
    fail(`${path}.appCommit`, "must match the run checkpoint app commit");
  }
  if (referenceCommit !== manifest.checkpoint.reference.commit.toLowerCase()) {
    fail(
      `${path}.referenceCommit`,
      "must match the run checkpoint reference commit",
    );
  }
  if (status !== "captured" && provenance.verified) {
    fail(
      `${path}.verified`,
      "must be false for failed and not-selected outcomes",
    );
  }
  if (provenance.reusedFrom !== undefined) {
    if (status !== "captured")
      fail(`${path}.reusedFrom`, "is allowed only for a captured outcome");
    if (!provenance.verified)
      fail(`${path}.reusedFrom`, "requires verified capture provenance");
    const reusedFrom = requireRecord(
      provenance.reusedFrom,
      `${path}.reusedFrom`,
    );
    requireId(reusedFrom.runId, `${path}.reusedFrom.runId`);
    if (reusedFrom.runId === manifest.runId)
      fail(`${path}.reusedFrom.runId`, "must identify an earlier run");
    if (
      requireCommit(reusedFrom.appCommit, `${path}.reusedFrom.appCommit`) !==
      appCommit
    ) {
      fail(
        `${path}.reusedFrom.appCommit`,
        "must match the verified original app commit",
      );
    }
    if (
      requireCommit(
        reusedFrom.referenceCommit,
        `${path}.reusedFrom.referenceCommit`,
      ) !== referenceCommit
    ) {
      fail(
        `${path}.reusedFrom.referenceCommit`,
        "must match the verified original reference commit",
      );
    }
    if (
      requireInstant(reusedFrom.capturedAt, `${path}.reusedFrom.capturedAt`) !==
      provenance.capturedAt
    ) {
      fail(
        `${path}.reusedFrom.capturedAt`,
        "must preserve the original capture time",
      );
    }
  }
  return provenance;
}

function validateFailure(value, path) {
  const failure = requireRecord(value, path);
  requireText(failure.message, `${path}.message`);
  if (failure.code !== undefined) requireText(failure.code, `${path}.code`);
  return failure;
}

function validateCapture(value, path, manifest, definitions) {
  const capture = requireRecord(value, path);
  const identity = {
    caseId: requireId(capture.caseId, `${path}.caseId`),
    targetId: requireId(capture.targetId, `${path}.targetId`),
    capturePointId: requireId(capture.capturePointId, `${path}.capturePointId`),
  };
  const definition = definitions.get(declarationIdentity(identity));
  if (!definition) fail(path, "must match a catalogue case");
  if (!PROFILE_IDS.includes(capture.profileId))
    fail(`${path}.profileId`, `must be one of ${PROFILE_IDS.join(", ")}`);
  if (!["captured", "failed", "not-selected"].includes(capture.status)) {
    fail(`${path}.status`, "must be captured, failed, or not-selected");
  }
  requireSha256(capture.inputFingerprint, `${path}.inputFingerprint`);
  validateProvenance(
    capture.provenance,
    `${path}.provenance`,
    manifest,
    capture.status,
  );
  const size = PROFILES[capture.profileId];
  if (definition.status === "retired" && capture.status !== "not-selected") {
    fail(`${path}.status`, "must be not-selected for a retired catalogue case");
  }

  if (capture.status === "captured") {
    const site = validateImage(capture.site, `${path}.site`, size);
    if (capture.profileId === definition.scoreProfile) {
      validateImage(capture.reference, `${path}.reference`, size);
    } else if (capture.reference !== undefined) {
      validateImage(capture.reference, `${path}.reference`, size);
    }
    const hasSiteRegion = capture.siteRegion !== undefined;
    const hasReferenceRegion = capture.referenceRegion !== undefined;
    if (hasSiteRegion !== hasReferenceRegion)
      fail(path, "must provide both score regions or neither");
    if (hasSiteRegion) {
      if (
        capture.profileId !== definition.scoreProfile ||
        capture.reference === undefined
      ) {
        fail(
          path,
          "score regions are allowed only on the scored profile with a reference image",
        );
      }
      validateRegion(capture.siteRegion, `${path}.siteRegion`, site);
      validateRegion(
        capture.referenceRegion,
        `${path}.referenceRegion`,
        capture.reference,
      );
    }
    if (capture.failure !== undefined)
      fail(`${path}.failure`, "is not allowed for a captured outcome");
  } else {
    if (capture.site !== undefined || capture.reference !== undefined) {
      fail(path, "failed and not-selected outcomes cannot contain images");
    }
    if (
      capture.siteRegion !== undefined ||
      capture.referenceRegion !== undefined
    ) {
      fail(
        path,
        "failed and not-selected outcomes cannot contain score regions",
      );
    }
    if (capture.status === "failed")
      validateFailure(capture.failure, `${path}.failure`);
    else if (capture.failure !== undefined)
      fail(`${path}.failure`, "is not allowed for a not-selected outcome");
  }
  return capture;
}

export function validateManifest(value) {
  const manifest = requireRecord(value, "manifest");
  if (manifest.schemaVersion !== 1) fail("manifest.schemaVersion", "must be 1");
  requireId(manifest.runId, "manifest.runId");
  requireInstant(manifest.createdAt, "manifest.createdAt");
  validateCheckpoint(manifest.checkpoint);
  if (!Array.isArray(manifest.catalogue))
    fail("manifest.catalogue", "must be an array");
  if (!Array.isArray(manifest.captures))
    fail("manifest.captures", "must be an array");

  const definitions = new Map();
  for (const [index, entry] of manifest.catalogue.entries()) {
    const path = `manifest.catalogue[${index}]`;
    const declaration = validateDeclaration(entry);
    if (!["active", "retired"].includes(entry.status))
      fail(`${path}.status`, "must be active or retired");
    const identity = declarationIdentity(declaration);
    if (definitions.has(identity))
      fail(`${path}`, "duplicates a catalogue case identity");
    definitions.set(identity, entry);
  }

  if (manifest.captures.length !== definitions.size * PROFILE_IDS.length) {
    fail(
      "manifest.captures",
      `must contain exactly 3 outcomes for each catalogue case`,
    );
  }
  const profilesByCase = new Map();
  for (const [index, capture] of manifest.captures.entries()) {
    const path = `manifest.captures[${index}]`;
    validateCapture(capture, path, manifest, definitions);
    const identity = declarationIdentity(capture);
    const profiles = profilesByCase.get(identity) ?? new Set();
    if (profiles.has(capture.profileId))
      fail(path, "duplicates a viewport outcome for its catalogue case");
    profiles.add(capture.profileId);
    profilesByCase.set(identity, profiles);
  }
  for (const [identity, profiles] of profilesByCase) {
    if (
      profiles.size !== PROFILE_IDS.length ||
      PROFILE_IDS.some((profile) => !profiles.has(profile))
    ) {
      fail(
        "manifest.captures",
        `case ${identity} must include desktop, tablet, and mobile outcomes`,
      );
    }
  }
  return manifest;
}

function canonicalValue(value, path, ancestors) {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail(path, "must contain only finite numbers");
    return value;
  }
  if (typeof value !== "object") fail(path, "must contain only JSON values");
  if (ancestors.has(value)) fail(path, "must not contain cycles");
  ancestors.add(value);
  let normalized;
  if (Array.isArray(value)) {
    normalized = value.map((entry, index) =>
      canonicalValue(entry, `${path}[${index}]`, ancestors),
    );
  } else {
    requireRecord(value, path);
    normalized = Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [
          key,
          canonicalValue(value[key], `${path}.${key}`, ancestors),
        ]),
    );
  }
  ancestors.delete(value);
  return normalized;
}

export function canonicalJson(value) {
  return JSON.stringify(canonicalValue(value, "value", new Set()));
}

export async function fingerprint(value) {
  if (!globalThis.crypto?.subtle)
    throw new Error("Web Crypto SHA-256 is unavailable");
  const bytes = new TextEncoder().encode(canonicalJson(value));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
