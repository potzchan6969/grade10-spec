import {
  canonicalJson,
  captureLocale,
  isStoryCatalogue,
  PROFILES,
  validateLocale,
  validateManifest,
  validateObjectKey,
} from "./model.mjs";

const INTERNAL_PREFIX = "ui-verification/v1/";
const RUNS_PREFIX = `${INTERNAL_PREFIX}runs/`;
const ASSESSMENTS_PREFIX = `${INTERNAL_PREFIX}assessments/`;
const REFERENCES_PREFIX = `${INTERNAL_PREFIX}references/`;
const REFERENCE_RUNS_PREFIX = `${INTERNAL_PREFIX}reference-runs/`;
const COMMIT = /^[0-9a-f]{40}$/;
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const SHA256 = /^[a-f0-9]{64}$/i;
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const MAX_OBJECT_BYTES = 20 * 1024 * 1024;
const MAX_RECORD_BYTES = 1 * 1024 * 1024;
const MAX_LIST_LIMIT = 100;
const DIMENSIONS = ["layout", "typography", "color", "imagery", "content"];

function localeValue(value, path) {
  return value === undefined ? "en" : validateLocale(value, path);
}

function localeKey(value) {
  return validateLocale(value).toLowerCase();
}

function sameLocale(left, right) {
  return localeKey(left) === localeKey(right);
}

function runLocales(manifest) {
  return (
    manifest.locales ?? [
      ...new Set(manifest.captures.map((capture) => captureLocale(capture))),
    ]
  );
}

function localeMatrix(manifest) {
  return [
    ...new Set(runLocales(manifest).map((locale) => localeKey(locale))),
  ].sort();
}

function carriesLocale(manifest, capture, input) {
  return (
    manifest.locales !== undefined ||
    capture.locale !== undefined ||
    input.locale !== undefined
  );
}

export class ArchiveError extends Error {
  constructor(status, code, message, options) {
    super(message, options);
    this.name = "ArchiveError";
    this.status = status;
    this.code = code;
  }
}

function fail(status, code, message) {
  throw new ArchiveError(status, code, message);
}

function record(value, path) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null)
  ) {
    throw new TypeError(`${path} must be an object`);
  }
  for (const key of Object.keys(value)) {
    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      throw new TypeError(`${path}.${key} is not allowed`);
    }
  }
  return value;
}

function text(value, path, { max = 512, optional = false } = {}) {
  const hasControlCharacter =
    typeof value === "string" &&
    [...value].some((character) => {
      const codePoint = character.codePointAt(0);
      return codePoint < 32 || codePoint === 127;
    });
  if (optional && value === undefined) return "";
  if (
    typeof value !== "string" ||
    value.trim() === "" ||
    value.length > max ||
    hasControlCharacter
  ) {
    throw new TypeError(
      `${path} must be non-empty text of at most ${max} characters`,
    );
  }
  return value;
}

function assertOnlyKeys(value, keys, path) {
  const allowed = new Set(keys);
  const unknown = Object.keys(value).find((key) => !allowed.has(key));
  if (unknown) throw new TypeError(`${path}.${unknown} is not allowed`);
}

function assertId(value, path) {
  if (typeof value !== "string" || !SAFE_ID.test(value)) {
    throw new TypeError(`${path} must be a path-safe identifier`);
  }
  return value;
}

function assertHash(value, path) {
  if (typeof value !== "string" || !SHA256.test(value)) {
    throw new TypeError(`${path} must be a SHA-256 digest`);
  }
  return value.toLowerCase();
}

function asBytes(value, path = "object bytes") {
  if (value instanceof Uint8Array) return new Uint8Array(value);
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  throw new TypeError(`${path} must be a byte array`);
}

function readUint32(bytes, offset) {
  return (
    bytes[offset] * 0x1000000 +
    bytes[offset + 1] * 0x10000 +
    bytes[offset + 2] * 0x100 +
    bytes[offset + 3]
  );
}

function crc32(bytes, start, end) {
  let crc = 0xffffffff;
  for (let index = start; index < end; index += 1) {
    crc ^= bytes[index];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunkName(bytes, offset) {
  return String.fromCharCode(
    bytes[offset],
    bytes[offset + 1],
    bytes[offset + 2],
    bytes[offset + 3],
  );
}

function parsePng(value) {
  const bytes = asBytes(value);
  if (bytes.byteLength > MAX_OBJECT_BYTES) {
    fail(413, "OBJECT_TOO_LARGE", "PNG objects cannot exceed 20 MiB");
  }
  if (
    bytes.byteLength < 57 ||
    PNG_SIGNATURE.some((byte, index) => bytes[index] !== byte)
  ) {
    fail(400, "INVALID_PNG", "object must be a complete PNG image");
  }

  let offset = PNG_SIGNATURE.length;
  let width = 0;
  let height = 0;
  let seenHeader = false;
  let seenImageData = false;
  let closedImageData = false;
  let seenEnd = false;

  while (offset < bytes.byteLength) {
    if (seenEnd || offset + 12 > bytes.byteLength) {
      fail(400, "INVALID_PNG", "PNG has trailing or truncated chunk data");
    }
    const length = readUint32(bytes, offset);
    const typeOffset = offset + 4;
    const dataOffset = offset + 8;
    const chunkEnd = dataOffset + length;
    const nextOffset = chunkEnd + 4;
    if (length > MAX_OBJECT_BYTES || nextOffset > bytes.byteLength) {
      fail(400, "INVALID_PNG", "PNG has a truncated chunk");
    }
    const type = chunkName(bytes, typeOffset);
    const declaredCrc = readUint32(bytes, chunkEnd);
    const actualCrc = crc32(bytes, typeOffset, chunkEnd);
    if (declaredCrc !== actualCrc) {
      fail(400, "INVALID_PNG", `PNG ${type} chunk has an invalid CRC`);
    }

    if (!seenHeader && (type !== "IHDR" || length !== 13)) {
      fail(400, "INVALID_PNG", "PNG must begin with a 13-byte IHDR chunk");
    }
    if (type === "IHDR") {
      if (seenHeader || offset !== PNG_SIGNATURE.length || length !== 13) {
        fail(
          400,
          "INVALID_PNG",
          "PNG must contain exactly one leading IHDR chunk",
        );
      }
      width = readUint32(bytes, dataOffset);
      height = readUint32(bytes, dataOffset + 4);
      const depth = bytes[dataOffset + 8];
      const colorType = bytes[dataOffset + 9];
      const depthByType = {
        0: [1, 2, 4, 8, 16],
        2: [8, 16],
        3: [1, 2, 4, 8],
        4: [8, 16],
        6: [8, 16],
      };
      if (
        width === 0 ||
        height === 0 ||
        width * height > 4_194_304 ||
        !depthByType[colorType]?.includes(depth) ||
        bytes[dataOffset + 10] !== 0 ||
        bytes[dataOffset + 11] !== 0 ||
        bytes[dataOffset + 12] > 1
      ) {
        fail(
          400,
          "INVALID_PNG",
          "PNG has unsupported dimensions or IHDR fields",
        );
      }
      seenHeader = true;
    } else if (type === "IDAT") {
      if (!seenHeader || closedImageData) {
        fail(400, "INVALID_PNG", "PNG image data chunks are out of order");
      }
      seenImageData = true;
    } else if (type === "IEND") {
      if (length !== 0 || !seenImageData) {
        fail(
          400,
          "INVALID_PNG",
          "PNG must end after image data with an empty IEND chunk",
        );
      }
      seenEnd = true;
    } else {
      if (seenImageData) closedImageData = true;
      if (type === "IHDR") fail(400, "INVALID_PNG", "PNG cannot repeat IHDR");
      if (/^[A-Z]/.test(type) && type !== "PLTE") {
        fail(
          400,
          "INVALID_PNG",
          `PNG contains unsupported critical chunk ${type}`,
        );
      }
    }

    offset = nextOffset;
  }

  if (
    !seenHeader ||
    !seenImageData ||
    !seenEnd ||
    offset !== bytes.byteLength
  ) {
    fail(400, "INVALID_PNG", "PNG must contain IHDR, IDAT, and IEND chunks");
  }
  return { width, height };
}

export async function sha256(bytes) {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    asBytes(bytes),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function bytesEqual(left, right) {
  if (left.byteLength !== right.byteLength) return false;
  let difference = 0;
  for (let index = 0; index < left.byteLength; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}

function publicObjectKey(value) {
  const key = validateObjectKey(value);
  const parts = key.split("/");
  if (
    parts.length < 3 ||
    parts[0] !== "ui-verification" ||
    !SAFE_ID.test(parts[1]) ||
    !key.endsWith(".png")
  ) {
    throw new TypeError(
      "image.key must be a PNG under ui-verification/<runId>/",
    );
  }
  return key;
}

function objectRunId(key) {
  return publicObjectKey(key).split("/")[1];
}

function runKey(runId) {
  return `${RUNS_PREFIX}${assertId(runId, "runId")}.json`;
}

function assessmentPrefix(runId) {
  return runId === undefined
    ? ASSESSMENTS_PREFIX
    : `${ASSESSMENTS_PREFIX}${assertId(runId, "runId")}/`;
}

function jsonBytes(value, path) {
  const bytes = new TextEncoder().encode(canonicalJson(value));
  if (bytes.byteLength > MAX_RECORD_BYTES) {
    fail(413, "RECORD_TOO_LARGE", `${path} cannot exceed 1 MiB`);
  }
  return bytes;
}

function parseJson(bytes, path) {
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (cause) {
    throw new ArchiveError(
      500,
      "CORRUPT_ARCHIVE",
      `${path} contains invalid JSON`,
      { cause },
    );
  }
}

function artifactEntries(manifest) {
  const artifacts = new Map();
  for (const capture of manifest.captures) {
    if (capture.status !== "captured") continue;
    const expectedRunId =
      capture.provenance.reusedFrom?.runId ?? manifest.runId;
    for (const image of [capture.site, capture.reference].filter(Boolean)) {
      const key = publicObjectKey(image.key);
      if (objectRunId(key) !== expectedRunId) {
        throw new TypeError(
          `${key} must be stored under its capture provenance run`,
        );
      }
      const prior = artifacts.get(key);
      if (
        prior &&
        (prior.sha256.toLowerCase() !== image.sha256.toLowerCase() ||
          prior.width !== image.width ||
          prior.height !== image.height)
      ) {
        throw new TypeError(
          `${key} is referenced with conflicting image metadata`,
        );
      }
      artifacts.set(key, image);
    }
  }
  return artifacts;
}

function captureForIdentity(manifest, identity) {
  return manifest.captures.find(
    (entry) =>
      entry.caseId === identity.caseId &&
      entry.targetId === identity.targetId &&
      entry.capturePointId === identity.capturePointId &&
      entry.profileId === identity.profileId &&
      sameLocale(captureLocale(entry), captureLocale(identity)),
  );
}

function sameImage(left, right) {
  if (left === undefined || right === undefined) return left === right;
  return Boolean(
    left.key === right.key &&
      left.sha256.toLowerCase() === right.sha256.toLowerCase() &&
      left.width === right.width &&
      left.height === right.height,
  );
}

async function validateReuse(manifest, getRun) {
  const checked = new Set();
  for (const capture of manifest.captures) {
    const sourceRunId = capture.provenance.reusedFrom?.runId;
    if (!sourceRunId || checked.has(sourceRunId)) continue;
    checked.add(sourceRunId);
    const source = await getRun(sourceRunId);
    if (!source) {
      fail(
        409,
        "MISSING_REUSE_SOURCE",
        `reused capture source ${sourceRunId} is not archived`,
      );
    }
    if (
      canonicalJson(localeMatrix(source)) !==
      canonicalJson(localeMatrix(manifest))
    ) {
      fail(
        409,
        "INVALID_REUSE_SOURCE",
        "reused captures require the same locale matrix as their source run",
      );
    }
    for (const reused of manifest.captures.filter(
      (entry) => entry.provenance.reusedFrom?.runId === sourceRunId,
    )) {
      const prior = captureForIdentity(source, reused);
      if (
        prior?.status !== "captured" ||
        !prior.provenance.verified ||
        prior.caseId !== reused.caseId ||
        prior.targetId !== reused.targetId ||
        prior.capturePointId !== reused.capturePointId ||
        prior.inputFingerprint !== reused.inputFingerprint ||
        prior.provenance.capturedAt !== reused.provenance.capturedAt ||
        prior.provenance.appCommit.toLowerCase() !==
          reused.provenance.reusedFrom.appCommit.toLowerCase() ||
        prior.provenance.referenceCommit.toLowerCase() !==
          reused.provenance.reusedFrom.referenceCommit.toLowerCase() ||
        !sameImage(prior.site, reused.site) ||
        !sameImage(prior.reference, reused.reference)
      ) {
        fail(
          409,
          "INVALID_REUSE_SOURCE",
          "reused capture does not match a verified archived capture",
        );
      }
    }
  }
}

function normalizeObjectInputs(objects, expected) {
  if (!Array.isArray(objects)) throw new TypeError("objects must be an array");
  const normalized = new Map();
  for (const [index, entry] of objects.entries()) {
    record(entry, `objects[${index}]`);
    assertOnlyKeys(entry, ["key", "bytes"], `objects[${index}]`);
    const key = publicObjectKey(entry.key);
    const artifact = expected.get(key);
    if (!artifact)
      throw new TypeError(
        `objects[${index}].key is not referenced by the manifest`,
      );
    if (normalized.has(key))
      throw new TypeError(`objects[${index}].key is duplicated`);
    const bytes = asBytes(entry.bytes, `objects[${index}].bytes`);
    normalized.set(key, { bytes, artifact });
  }
  return normalized;
}

function storeFactory(createStore) {
  return function createArchiveWithStore() {
    const store = createStore();

    async function readRecord(key, path) {
      const bytes = await store.get(key);
      return bytes === null ? null : parseJson(bytes, path);
    }

    async function getRun(runId) {
      const value = await readRecord(runKey(runId), `run ${runId}`);
      if (value === null) return null;
      return validateManifest(value);
    }

    async function putImmutable(key, bytes, contentType) {
      const copied = asBytes(bytes);
      if (await store.create(key, copied, contentType))
        return { created: true };
      const existing = await store.get(key);
      if (existing === null)
        fail(
          409,
          "WRITE_RACE",
          "archive object disappeared during an immutable write",
        );
      if (!bytesEqual(existing, copied))
        fail(
          409,
          "IMMUTABLE_CONFLICT",
          `${key} already exists with different bytes`,
        );
      return { created: false };
    }

    async function putObject(key, value) {
      publicObjectKey(key);
      const bytes = asBytes(value);
      parsePng(bytes);
      return putImmutable(key, bytes, "image/png");
    }

    async function verifyManifestObjects(manifest) {
      const artifacts = artifactEntries(manifest);
      await validateReuse(manifest, getRun);
      for (const [key, artifact] of artifacts) {
        const bytes = await store.get(key);
        if (bytes === null)
          fail(
            409,
            "MISSING_IMAGE",
            `manifest image ${key} has not been uploaded`,
          );
        const actualHash = await sha256(bytes);
        if (actualHash !== artifact.sha256.toLowerCase()) {
          fail(
            400,
            "IMAGE_HASH_MISMATCH",
            `manifest image ${key} does not match its SHA-256`,
          );
        }
        const dimensions = parsePng(bytes);
        if (
          dimensions.width !== artifact.width ||
          dimensions.height !== artifact.height
        ) {
          fail(
            400,
            "IMAGE_DIMENSION_MISMATCH",
            `manifest image ${key} has unexpected PNG dimensions`,
          );
        }
      }
    }

    async function publish(manifestValue, objectInputs) {
      const manifest = validateManifest(
        JSON.parse(canonicalJson(manifestValue)),
      );
      const existing = await getRun(manifest.runId);
      const manifestBytes = jsonBytes(manifest, "manifest");
      const artifacts = artifactEntries(manifest);
      const objects = normalizeObjectInputs(objectInputs, artifacts);

      for (const [key, value] of objects) {
        const digest = await sha256(value.bytes);
        if (digest !== value.artifact.sha256.toLowerCase()) {
          fail(
            400,
            "IMAGE_HASH_MISMATCH",
            `uploaded image ${key} does not match its SHA-256`,
          );
        }
        const dimensions = parsePng(value.bytes);
        if (
          dimensions.width !== value.artifact.width ||
          dimensions.height !== value.artifact.height
        ) {
          fail(
            400,
            "IMAGE_DIMENSION_MISMATCH",
            `uploaded image ${key} has unexpected PNG dimensions`,
          );
        }
      }
      if (
        existing &&
        !bytesEqual(jsonBytes(existing, "stored manifest"), manifestBytes)
      ) {
        fail(
          409,
          "IMMUTABLE_CONFLICT",
          `run ${manifest.runId} already exists with different content`,
        );
      }

      for (const [key, value] of objects)
        await putImmutable(key, value.bytes, "image/png");
      await verifyManifestObjects(manifest);
      await putImmutable(
        runKey(manifest.runId),
        manifestBytes,
        "application/json",
      );
      return manifest;
    }

    async function sealRun(manifestValue) {
      return publish(manifestValue, []);
    }

    async function getObject(key) {
      publicObjectKey(key);
      const bytes = await store.get(key);
      if (bytes === null) return null;
      parsePng(bytes);
      return bytes;
    }

    async function listJson({
      prefix,
      cursor,
      limit = 50,
      filter,
      keep,
      resultName,
    }) {
      if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIST_LIMIT) {
        throw new TypeError(
          `limit must be an integer from 1 to ${MAX_LIST_LIMIT}`,
        );
      }
      if (
        cursor !== undefined &&
        (typeof cursor !== "string" || cursor.length > 2048)
      ) {
        throw new TypeError("cursor must be at most 2048 characters");
      }
      const page = await store.list(prefix, cursor, limit);
      const values = [];
      for (const key of page.keys) {
        // A key left out is never read, however large its record.
        if (keep && !keep(key)) continue;
        const value = await readRecord(key, key);
        if (value !== null && (!filter || filter(value))) values.push(value);
      }
      values.sort((left, right) =>
        String(right.createdAt ?? "").localeCompare(
          String(left.createdAt ?? ""),
        ),
      );
      const result = { [resultName]: values };
      if (page.cursor !== undefined) result.cursor = page.cursor;
      return result;
    }

    // With `storyRuns`, a story catalogue run is read only when it is one of
    // those ids: the parts of the newest declaration, not every deploy's.
    async function listRuns({ caseId, locale, cursor, limit, storyRuns } = {}) {
      if (caseId !== undefined) assertId(caseId, "caseId");
      if (
        storyRuns !== undefined &&
        (!Array.isArray(storyRuns) ||
          storyRuns.some((runId) => typeof runId !== "string"))
      )
        throw new TypeError("storyRuns must be an array of run ids");
      const requestedLocale =
        locale === undefined ? undefined : localeValue(locale, "locale");
      const kept = storyRuns && new Set(storyRuns);
      return listJson({
        prefix: RUNS_PREFIX,
        cursor,
        limit,
        keep: kept
          ? (key) => {
              const runId = key.slice(RUNS_PREFIX.length, -".json".length);
              return !isStoryCatalogue({ runId }) || kept.has(runId);
            }
          : undefined,
        resultName: "runs",
        filter: (run) =>
          (!caseId || run.catalogue.some((entry) => entry.caseId === caseId)) &&
          (requestedLocale === undefined ||
            runLocales(run).some((value) =>
              sameLocale(value, requestedLocale),
            )),
      });
    }

    async function getCapture(
      runId,
      caseId,
      targetId,
      capturePointId,
      profileId,
      locale = "en",
    ) {
      const manifest = await getRun(runId);
      if (!manifest) fail(404, "RUN_NOT_FOUND", `run ${runId} was not found`);
      assertId(caseId, "caseId");
      assertId(targetId, "targetId");
      assertId(capturePointId, "capturePointId");
      if (!Object.hasOwn(PROFILES, profileId))
        throw new TypeError("profileId must be a known viewport profile");
      const requestedLocale = localeValue(locale, "locale");
      const capture = manifest.captures.find(
        (entry) =>
          entry.caseId === caseId &&
          entry.targetId === targetId &&
          entry.capturePointId === capturePointId &&
          entry.profileId === profileId &&
          sameLocale(captureLocale(entry), requestedLocale),
      );
      if (!capture)
        fail(
          404,
          "CAPTURE_NOT_FOUND",
          "the requested capture was not found in this run",
        );
      if (capture.status !== "captured")
        fail(
          409,
          "CAPTURE_NOT_REVIEWABLE",
          "only captured outcomes can be assessed",
        );
      return { manifest, capture };
    }

    function normalizeAssessment(inputValue, manifest, capture) {
      const input = record(inputValue, "assessment");
      const fields = [
        "runId",
        "schemaVersion",
        "assessmentId",
        "caseId",
        "targetId",
        "capturePointId",
        "profileId",
        "locale",
        "scorer",
        "rubricVersion",
        "contractHash",
        "imageHashes",
        "similarity",
        "similarityThreshold",
        "similarityPass",
        "dimensions",
        "criticalMismatches",
        "criticalVeto",
        "unknownCategories",
        "unknownCategory",
        "provenanceVerified",
        "failureCount",
        "autoAcceptCandidate",
        "confidence",
        "decision",
      ];
      assertOnlyKeys(input, fields, "assessment");
      const requestedLocale = localeValue(input.locale, "assessment.locale");
      if (
        input.runId !== manifest.runId ||
        input.caseId !== capture.caseId ||
        input.targetId !== capture.targetId ||
        input.capturePointId !== capture.capturePointId ||
        input.profileId !== capture.profileId ||
        !sameLocale(requestedLocale, captureLocale(capture))
      ) {
        throw new TypeError(
          "assessment identity does not match the exact archived capture",
        );
      }
      const definition = manifest.catalogue.find(
        (entry) =>
          entry.caseId === capture.caseId &&
          entry.targetId === capture.targetId &&
          entry.capturePointId === capture.capturePointId,
      );
      if (input.profileId !== definition.scoreProfile) {
        throw new TypeError(
          "assessment.profileId must match the catalogue scoreProfile",
        );
      }
      if (input.schemaVersion !== 1)
        throw new TypeError("assessment.schemaVersion must be 1");
      assertHash(input.assessmentId, "assessment.assessmentId");
      const scorer = record(input.scorer, "assessment.scorer");
      assertOnlyKeys(scorer, ["id", "version", "model"], "assessment.scorer");
      const normalizedScorer = {
        id: text(scorer.id, "assessment.scorer.id", { max: 128 }),
        version: text(scorer.version, "assessment.scorer.version", {
          max: 128,
        }),
        model: text(scorer.model, "assessment.scorer.model", { max: 256 }),
      };
      const rubricVersion = text(
        input.rubricVersion,
        "assessment.rubricVersion",
        { max: 128 },
      );
      const contractHash = assertHash(
        input.contractHash,
        "assessment.contractHash",
      );
      const hashes = record(input.imageHashes, "assessment.imageHashes");
      assertOnlyKeys(hashes, ["site", "reference"], "assessment.imageHashes");
      if (!capture.reference)
        throw new TypeError(
          "assessment requires the scored profile's archived reference image",
        );
      const imageHashes = {
        site: assertHash(hashes.site, "assessment.imageHashes.site"),
        reference: assertHash(
          hashes.reference,
          "assessment.imageHashes.reference",
        ),
      };
      if (
        imageHashes.site !== capture.site.sha256.toLowerCase() ||
        imageHashes.reference !== capture.reference.sha256.toLowerCase()
      ) {
        throw new TypeError(
          "assessment image hashes do not match the archived capture",
        );
      }
      if (capture.provenance.verified !== input.provenanceVerified) {
        throw new TypeError(
          "assessment provenanceVerified does not match the archived capture",
        );
      }
      if (
        !Number.isFinite(input.similarity) ||
        input.similarity < 0 ||
        input.similarity > 100
      ) {
        throw new TypeError("assessment.similarity must be from 0 to 100");
      }
      if (
        !Number.isFinite(input.similarityThreshold) ||
        input.similarityThreshold < 0 ||
        input.similarityThreshold > 100
      ) {
        throw new TypeError(
          "assessment.similarityThreshold must be from 0 to 100",
        );
      }
      if (
        typeof input.similarityPass !== "boolean" ||
        input.similarityPass !== input.similarity >= input.similarityThreshold
      ) {
        throw new TypeError(
          "assessment.similarityPass does not match its threshold",
        );
      }
      const dimensions = record(input.dimensions, "assessment.dimensions");
      assertOnlyKeys(dimensions, DIMENSIONS, "assessment.dimensions");
      const normalizedDimensions = {};
      for (const name of DIMENSIONS) {
        const dimension = record(
          dimensions[name],
          `assessment.dimensions.${name}`,
        );
        assertOnlyKeys(
          dimension,
          ["score", "findings"],
          `assessment.dimensions.${name}`,
        );
        if (
          !Number.isFinite(dimension.score) ||
          dimension.score < 0 ||
          dimension.score > 100 ||
          !Array.isArray(dimension.findings) ||
          dimension.findings.some(
            (finding) => typeof finding !== "string" || finding.length > 2000,
          )
        ) {
          throw new TypeError(
            `assessment.dimensions.${name} has invalid score or findings`,
          );
        }
        normalizedDimensions[name] = {
          score: dimension.score,
          findings: [...dimension.findings],
        };
      }
      if (!Array.isArray(input.criticalMismatches))
        throw new TypeError("assessment.criticalMismatches must be an array");
      const criticalMismatches = input.criticalMismatches.map(
        (mismatch, index) => {
          record(mismatch, `assessment.criticalMismatches[${index}]`);
          assertOnlyKeys(
            mismatch,
            ["category", "evidence"],
            `assessment.criticalMismatches[${index}]`,
          );
          return {
            category: text(
              mismatch.category,
              `assessment.criticalMismatches[${index}].category`,
              { max: 128 },
            ),
            evidence: text(
              mismatch.evidence,
              `assessment.criticalMismatches[${index}].evidence`,
              { max: 2000 },
            ),
          };
        },
      );
      if (input.criticalVeto !== criticalMismatches.length > 0)
        throw new TypeError(
          "assessment.criticalVeto does not match its mismatches",
        );
      if (
        !Array.isArray(input.unknownCategories) ||
        input.unknownCategories.some(
          (category) => typeof category !== "string" || category.length > 128,
        )
      ) {
        throw new TypeError(
          "assessment.unknownCategories must be an array of names",
        );
      }
      const unknownCategories = [...new Set(input.unknownCategories)];
      if (input.unknownCategory !== unknownCategories.length > 0)
        throw new TypeError(
          "assessment.unknownCategory does not match its categories",
        );
      if (!Number.isInteger(input.failureCount) || input.failureCount < 0)
        throw new TypeError(
          "assessment.failureCount must be a non-negative integer",
        );
      if (
        input.confidence !== null &&
        (!Number.isFinite(input.confidence) ||
          input.confidence < 0 ||
          input.confidence > 1)
      ) {
        throw new TypeError(
          "assessment.confidence must be null or a value from 0 to 1",
        );
      }
      const candidate =
        input.similarityPass &&
        !input.criticalVeto &&
        !input.unknownCategory &&
        capture.provenance.verified &&
        input.failureCount === 0 &&
        capture.status === "captured";
      if (
        typeof input.autoAcceptCandidate !== "boolean" ||
        input.autoAcceptCandidate !== candidate
      ) {
        throw new TypeError(
          "assessment.autoAcceptCandidate does not match the capture and scoring gates",
        );
      }
      if (input.decision !== "shadow")
        throw new TypeError(
          "assessment.decision must remain shadow: scores are advisory",
        );

      return {
        schemaVersion: 1,
        assessmentId: input.assessmentId.toLowerCase(),
        runId: manifest.runId,
        caseId: capture.caseId,
        targetId: capture.targetId,
        capturePointId: capture.capturePointId,
        profileId: capture.profileId,
        ...(carriesLocale(manifest, capture, input)
          ? { locale: captureLocale(capture) }
          : {}),
        scorer: normalizedScorer,
        rubricVersion,
        contractHash,
        imageHashes,
        similarity: input.similarity,
        similarityThreshold: input.similarityThreshold,
        similarityPass: input.similarityPass,
        dimensions: normalizedDimensions,
        criticalMismatches,
        criticalVeto: input.criticalVeto,
        unknownCategories,
        unknownCategory: input.unknownCategory,
        provenanceVerified: input.provenanceVerified,
        failureCount: input.failureCount,
        autoAcceptCandidate: input.autoAcceptCandidate,
        confidence: input.confidence,
        decision: "shadow",
      };
    }

    async function createAssessment(inputValue) {
      const input = record(inputValue, "assessment");
      if (input.createdAt !== undefined)
        throw new TypeError("assessment.createdAt is server-owned");
      const requestedLocale = Object.hasOwn(input, "locale")
        ? localeValue(input.locale, "assessment.locale")
        : "en";
      const { manifest, capture } = await getCapture(
        input.runId,
        input.caseId,
        input.targetId,
        input.capturePointId,
        input.profileId,
        requestedLocale,
      );
      const assessment = normalizeAssessment(input, manifest, capture);
      const key = `${assessmentPrefix(manifest.runId)}${assessment.assessmentId}.json`;
      const existing = await readRecord(key, key);
      if (existing) {
        const { createdAt: _createdAt, ...prior } = existing;
        if (canonicalJson(prior) !== canonicalJson(assessment))
          fail(
            409,
            "IMMUTABLE_CONFLICT",
            "assessmentId already exists with different content",
          );
        return existing;
      }
      const stored = { ...assessment, createdAt: new Date().toISOString() };
      await putImmutable(
        key,
        jsonBytes(stored, "assessment"),
        "application/json",
      );
      return stored;
    }

    async function listAssessments({
      runId,
      caseId,
      locale,
      cursor,
      limit,
    } = {}) {
      if (runId !== undefined) assertId(runId, "runId");
      if (caseId !== undefined) assertId(caseId, "caseId");
      const requestedLocale =
        locale === undefined ? undefined : localeValue(locale, "locale");
      return listJson({
        prefix: assessmentPrefix(runId),
        cursor,
        limit,
        resultName: "assessments",
        filter: (assessment) =>
          (!caseId || assessment.caseId === caseId) &&
          (requestedLocale === undefined ||
            sameLocale(captureLocale(assessment), requestedLocale)),
      });
    }

    function referenceKey(referenceId) {
      return `${REFERENCES_PREFIX}${assertId(referenceId, "referenceId")}.json`;
    }

    function approver(value) {
      const person = record(value, "approver");
      assertOnlyKeys(person, ["subject", "email"], "approver");
      return {
        subject: text(person.subject, "approver.subject", { max: 255 }),
        ...(person.email === undefined
          ? {}
          : { email: text(person.email, "approver.email", { max: 320 }) }),
      };
    }

    // A reference the workbench captured from the live story: its own PNG and
    // record, apart from any site run, so an approval can name exact bytes.
    async function createReference(inputValue, bytesValue, capturedBy) {
      const input = record(inputValue, "reference");
      assertOnlyKeys(
        input,
        [
          "caseId",
          "targetId",
          "capturePointId",
          "profileId",
          "locale",
          "storyId",
          "selector",
          "region",
          "commit",
          "ref",
          "verified",
          "browser",
        ],
        "reference",
      );
      assertId(input.caseId, "reference.caseId");
      assertId(input.targetId, "reference.targetId");
      assertId(input.capturePointId, "reference.capturePointId");
      if (!Object.hasOwn(PROFILES, input.profileId))
        throw new TypeError(
          "reference.profileId must be a known viewport profile",
        );
      if (typeof input.commit !== "string" || !COMMIT.test(input.commit))
        throw new TypeError("reference.commit must be a full lowercase commit");
      if (typeof input.verified !== "boolean")
        throw new TypeError("reference.verified must be a boolean");
      const bytes = asBytes(bytesValue, "reference image");
      const size = parsePng(bytes);
      const viewport = PROFILES[input.profileId];
      if (size.width !== viewport.width || size.height !== viewport.height)
        throw new TypeError(
          `reference image must be ${viewport.width}x${viewport.height} at ${input.profileId}`,
        );
      const region = record(input.region, "reference.region");
      assertOnlyKeys(region, ["x", "y", "width", "height"], "reference.region");
      for (const name of ["x", "y", "width", "height"]) {
        if (!Number.isInteger(region[name]) || region[name] < 0)
          throw new TypeError(
            `reference.region.${name} must be a whole number`,
          );
      }
      if (
        region.width === 0 ||
        region.height === 0 ||
        region.x + region.width > size.width ||
        region.y + region.height > size.height
      )
        throw new TypeError("reference.region must lie inside the image");
      const referenceId = `reference-${globalThis.crypto.randomUUID()}`;
      const key = `ui-verification/${referenceId}/reference.png`;
      await putImmutable(key, bytes, "image/png");
      const value = {
        schemaVersion: 1,
        referenceId,
        caseId: input.caseId,
        targetId: input.targetId,
        capturePointId: input.capturePointId,
        profileId: input.profileId,
        locale: captureLocale({
          locale: localeValue(input.locale, "reference.locale"),
        }),
        storyId: text(input.storyId, "reference.storyId", { max: 255 }),
        selector:
          input.selector === undefined || input.selector === null
            ? null
            : text(input.selector, "reference.selector", { max: 1024 }),
        commit: input.commit,
        ref: text(input.ref, "reference.ref", { max: 255 }),
        verified: input.verified,
        browser: text(input.browser, "reference.browser", { max: 128 }),
        image: { key, sha256: await sha256(bytes), ...size },
        region: {
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height,
        },
        capturedBy: approver(capturedBy),
        capturedAt: new Date().toISOString(),
      };
      await putImmutable(
        referenceKey(referenceId),
        jsonBytes(value, "reference"),
        "application/json",
      );
      return value;
    }

    async function getReference(referenceId) {
      return readRecord(referenceKey(referenceId), "reference");
    }

    async function listReferences({ caseId, cursor, limit } = {}) {
      if (caseId !== undefined) assertId(caseId, "caseId");
      return listJson({
        prefix: REFERENCES_PREFIX,
        cursor,
        limit,
        resultName: "references",
        filter: (reference) => !caseId || reference.caseId === caseId,
      });
    }

    // A finished capture run, full or focused, as the coordinator closed it.
    async function createReferenceRun(value) {
      const run = record(value, "reference run");
      assertId(run.runId, "reference run.runId");
      if (!["full", "focused"].includes(run.lane))
        throw new TypeError("reference run.lane must be full or focused");
      if (!["succeeded", "failed", "superseded"].includes(run.state))
        throw new TypeError(
          "reference run.state must be succeeded, failed or superseded",
        );
      await putImmutable(
        `${REFERENCE_RUNS_PREFIX}${run.runId}.json`,
        jsonBytes(run, "reference run"),
        "application/json",
      );
      return run;
    }

    async function listReferenceRuns({ cursor, limit } = {}) {
      return listJson({
        prefix: REFERENCE_RUNS_PREFIX,
        cursor,
        limit,
        resultName: "runs",
      });
    }

    return {
      getRun,
      listRuns,
      getObject,
      putObject,
      publish,
      sealRun,
      createAssessment,
      listAssessments,
      createReference,
      getReference,
      listReferences,
      createReferenceRun,
      listReferenceRuns,
    };
  };
}

export function createFileStore(rootValue) {
  if (typeof rootValue !== "string" || rootValue.trim() === "") {
    throw new TypeError("archive root must be a non-empty path");
  }
  const path = import("node:path");
  const absoluteRootPromise = path.then(({ resolve }) => resolve(rootValue));
  let fsContextPromise;

  async function context() {
    if (!fsContextPromise) {
      fsContextPromise = Promise.all([
        import("node:fs/promises"),
        path,
        absoluteRootPromise,
      ]).then(async ([fs, pathModule, rootPath]) => {
        await fs.mkdir(rootPath, { recursive: true, mode: 0o700 });
        const root = await fs.realpath(rootPath);
        return { fs, path: pathModule, root };
      });
    }
    return fsContextPromise;
  }

  async function safePath(key, { createParents = false } = {}) {
    const { fs, path: pathModule, root } = await context();
    const parts = key.split("/");
    let parent = root;
    for (const part of parts.slice(0, -1)) {
      parent = pathModule.join(parent, part);
      try {
        const info = await fs.lstat(parent);
        if (info.isSymbolicLink() || !info.isDirectory()) {
          fail(
            400,
            "UNSAFE_ARCHIVE_PATH",
            "archive path components must be real directories",
          );
        }
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
        if (!createParents) return null;
        await fs.mkdir(parent, { mode: 0o700 }).catch((mkdirError) => {
          if (mkdirError?.code !== "EEXIST") throw mkdirError;
        });
      }
    }
    const realParent = await fs.realpath(parent);
    const relativeParent = pathModule.relative(root, realParent);
    if (
      relativeParent.startsWith("..") ||
      pathModule.isAbsolute(relativeParent)
    ) {
      fail(
        400,
        "UNSAFE_ARCHIVE_PATH",
        "archive paths must remain inside the configured root",
      );
    }
    return {
      fs,
      path: pathModule,
      root,
      parent,
      file: pathModule.join(parent, parts.at(-1)),
    };
  }

  return {
    get root() {
      return absoluteRootPromise;
    },
    async get(key) {
      const target = await safePath(key);
      if (!target) return null;
      try {
        const info = await target.fs.lstat(target.file);
        if (info.isSymbolicLink() || !info.isFile())
          fail(
            400,
            "UNSAFE_ARCHIVE_PATH",
            "archive objects must be regular files",
          );
        const realFile = await target.fs.realpath(target.file);
        const relativeFile = target.path.relative(target.root, realFile);
        if (
          relativeFile.startsWith("..") ||
          target.path.isAbsolute(relativeFile)
        ) {
          fail(
            400,
            "UNSAFE_ARCHIVE_PATH",
            "archive objects must remain inside the configured root",
          );
        }
        return new Uint8Array(await target.fs.readFile(realFile));
      } catch (error) {
        if (error?.code === "ENOENT") return null;
        throw error;
      }
    },
    async create(key, bytes) {
      const target = await safePath(key, { createParents: true });
      const temporary = `${target.file}.tmp-${globalThis.crypto.randomUUID()}`;
      let handle;
      try {
        handle = await target.fs.open(temporary, "wx", 0o600);
        await handle.writeFile(bytes);
        await handle.sync();
        await handle.close();
        handle = null;
        try {
          await target.fs.link(temporary, target.file);
          return true;
        } catch (error) {
          if (error?.code === "EEXIST") return false;
          throw error;
        }
      } finally {
        if (handle) await handle.close();
        await target.fs.unlink(temporary).catch((error) => {
          if (error?.code !== "ENOENT") throw error;
        });
      }
    },
    async list(prefix, cursor, limit) {
      const { fs, path: pathModule, root } = await context();
      const prefixParts = prefix.endsWith("/")
        ? prefix.slice(0, -1).split("/")
        : prefix.split("/");
      let start = root;
      for (const part of prefixParts) {
        start = pathModule.join(start, part);
        try {
          const info = await fs.lstat(start);
          if (info.isSymbolicLink() || !info.isDirectory()) {
            fail(
              400,
              "UNSAFE_ARCHIVE_PATH",
              "archive list prefixes must be real directories",
            );
          }
        } catch (error) {
          if (error?.code === "ENOENT") return { keys: [] };
          throw error;
        }
      }
      const keys = [];
      async function walk(directory, relativeDirectory) {
        const entries = await fs.readdir(directory, { withFileTypes: true });
        entries.sort((left, right) => left.name.localeCompare(right.name));
        for (const entry of entries) {
          const fullPath = pathModule.join(directory, entry.name);
          const info = await fs.lstat(fullPath);
          if (info.isSymbolicLink())
            fail(
              400,
              "UNSAFE_ARCHIVE_PATH",
              "archive listing encountered a symbolic link",
            );
          const relativeKey = `${relativeDirectory}/${entry.name}`;
          if (info.isDirectory()) await walk(fullPath, relativeKey);
          else if (info.isFile() && relativeKey.startsWith(prefix))
            keys.push(relativeKey);
        }
      }
      await walk(start, prefix.endsWith("/") ? prefix.slice(0, -1) : prefix);
      keys.sort();
      const after = cursor ? keys.filter((key) => key > cursor) : keys;
      const pageKeys = after.slice(0, limit);
      return {
        keys: pageKeys,
        ...(after.length > limit ? { cursor: pageKeys.at(-1) } : {}),
      };
    },
  };
}

export function createR2Store(bucket) {
  if (
    !bucket ||
    typeof bucket.put !== "function" ||
    typeof bucket.get !== "function" ||
    typeof bucket.list !== "function"
  ) {
    throw new TypeError("ARCHIVE must be an R2 bucket binding");
  }
  return {
    async get(key) {
      const object = await bucket.get(key);
      return object ? new Uint8Array(await object.arrayBuffer()) : null;
    },
    async create(key, bytes, contentType) {
      const object = await bucket.put(key, bytes, {
        onlyIf: { etagDoesNotMatch: "*" },
        httpMetadata: { contentType },
      });
      return object !== null;
    },
    async list(prefix, cursor, limit) {
      const page = await bucket.list({
        prefix,
        ...(cursor ? { cursor } : {}),
        limit,
      });
      return {
        keys: page.objects.map((object) => object.key),
        ...(page.truncated && page.cursor ? { cursor: page.cursor } : {}),
      };
    },
  };
}

export function createArchive(root) {
  const archive = storeFactory(() => createFileStore(root))();
  Object.defineProperty(archive, "root", { value: root, enumerable: true });
  return archive;
}

export function createR2Archive(bucket) {
  return storeFactory(() => createR2Store(bucket))();
}

export function createHttpArchive(
  endpoint,
  {
    token,
    accessClientId,
    accessClientSecret,
    fetcher = globalThis.fetch,
  } = {},
) {
  if ((accessClientId === undefined) !== (accessClientSecret === undefined)) {
    throw new TypeError(
      "accessClientId and accessClientSecret must be provided together",
    );
  }
  if (
    accessClientId !== undefined &&
    (typeof accessClientId !== "string" ||
      accessClientId.trim() === "" ||
      typeof accessClientSecret !== "string" ||
      accessClientSecret.trim() === "")
  ) {
    throw new TypeError(
      "accessClientId and accessClientSecret must be non-empty strings",
    );
  }
  const baseUrl = new URL(endpoint);
  if (!["http:", "https:"].includes(baseUrl.protocol))
    throw new TypeError("archive endpoint must use HTTP or HTTPS");
  if (typeof fetcher !== "function")
    throw new TypeError("fetcher must be a function");

  async function request(path, options = {}) {
    const headers = new Headers(options.headers ?? {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (accessClientId !== undefined) {
      headers.set("Cf-Access-Client-Id", accessClientId);
      headers.set("Cf-Access-Client-Secret", accessClientSecret);
    }
    const response = await fetcher(new URL(path, baseUrl), {
      ...options,
      redirect: "error",
      headers,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ArchiveError(
        response.status,
        body.code ?? "REMOTE_ERROR",
        body.error ?? `archive request failed with ${response.status}`,
      );
    }
    return response;
  }

  async function jsonRequest(path, options) {
    return (await request(path, options)).json();
  }

  function listPath(path, options = {}) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(options))
      if (value !== undefined) query.set(key, String(value));
    return `${path}${query.size ? `?${query}` : ""}`;
  }

  return {
    async publish(manifest, objects) {
      for (const object of objects) {
        await request(listPath("/api/objects", { key: object.key }), {
          method: "PUT",
          headers: { "Content-Type": "image/png" },
          body: asBytes(object.bytes),
        });
      }
      return jsonRequest("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: canonicalJson(manifest),
      });
    },
    async getRun(runId) {
      const response = await request(
        `/api/runs/${encodeURIComponent(assertId(runId, "runId"))}`,
        { method: "GET" },
      ).catch((error) => {
        if (error.status === 404) return null;
        throw error;
      });
      return response ? response.json() : null;
    },
    async listRuns(options = {}) {
      return jsonRequest(listPath("/api/runs", options), { method: "GET" });
    },
    async getObject(key) {
      const response = await request(listPath("/api/objects", { key }), {
        method: "GET",
      }).catch((error) => {
        if (error.status === 404) return null;
        throw error;
      });
      return response ? new Uint8Array(await response.arrayBuffer()) : null;
    },
    async createAssessment(input) {
      return jsonRequest("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: canonicalJson(input),
      });
    },
    async listAssessments(options = {}) {
      return jsonRequest(listPath("/api/assessments", options), {
        method: "GET",
      });
    },
    async listReferences(options = {}) {
      return jsonRequest(listPath("/api/references", options), {
        method: "GET",
      });
    },
    async listReferenceRuns(options = {}) {
      return jsonRequest(listPath("/api/reference-runs", options), {
        method: "GET",
      });
    },
  };
}
