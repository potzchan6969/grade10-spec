import { calibrateAssessment } from "./calibration.mjs";
import {
  canonicalJson,
  PROFILES,
  validateManifest,
  validateObjectKey,
} from "./model.mjs";

const INTERNAL_PREFIX = "ui-verification/v1/";
const RUNS_PREFIX = `${INTERNAL_PREFIX}runs/`;
const REVIEWS_PREFIX = `${INTERNAL_PREFIX}reviews/`;
const ASSESSMENTS_PREFIX = `${INTERNAL_PREFIX}assessments/`;
const CALIBRATIONS_PREFIX = `${INTERNAL_PREFIX}calibrations/`;
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const SHA256 = /^[a-f0-9]{64}$/i;
const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const MAX_OBJECT_BYTES = 20 * 1024 * 1024;
const MAX_RECORD_BYTES = 1 * 1024 * 1024;
const MAX_LIST_LIMIT = 100;
const DIMENSIONS = ["layout", "typography", "color", "imagery", "content"];

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

async function sha256(bytes) {
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

function reviewPrefix(runId) {
  return `${REVIEWS_PREFIX}${assertId(runId, "runId")}/`;
}

function assessmentPrefix(runId) {
  return runId === undefined
    ? ASSESSMENTS_PREFIX
    : `${ASSESSMENTS_PREFIX}${assertId(runId, "runId")}/`;
}

function calibrationKey(calibrationId) {
  return `${CALIBRATIONS_PREFIX}${assertHash(calibrationId, "calibrationId")}.json`;
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
      entry.profileId === identity.profileId,
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

    async function listRuns({ caseId, cursor, limit } = {}) {
      if (caseId !== undefined) assertId(caseId, "caseId");
      return listJson({
        prefix: RUNS_PREFIX,
        cursor,
        limit,
        resultName: "runs",
        filter: (run) =>
          !caseId || run.catalogue.some((entry) => entry.caseId === caseId),
      });
    }

    async function getCapture(
      runId,
      caseId,
      targetId,
      capturePointId,
      profileId,
    ) {
      const manifest = await getRun(runId);
      if (!manifest) fail(404, "RUN_NOT_FOUND", `run ${runId} was not found`);
      assertId(caseId, "caseId");
      assertId(targetId, "targetId");
      assertId(capturePointId, "capturePointId");
      if (!Object.hasOwn(PROFILES, profileId))
        throw new TypeError("profileId must be a known viewport profile");
      const capture = manifest.captures.find(
        (entry) =>
          entry.caseId === caseId &&
          entry.targetId === targetId &&
          entry.capturePointId === capturePointId &&
          entry.profileId === profileId,
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
          "only captured outcomes can be reviewed or assessed",
        );
      return { manifest, capture };
    }

    async function createReview(inputValue, reviewerValue) {
      const input = record(inputValue, "review");
      assertOnlyKeys(
        input,
        [
          "runId",
          "caseId",
          "targetId",
          "capturePointId",
          "profileId",
          "decision",
          "comment",
        ],
        "review",
      );
      const { manifest, capture } = await getCapture(
        input.runId,
        input.caseId,
        input.targetId,
        input.capturePointId,
        input.profileId,
      );
      if (!["approved", "changes-requested"].includes(input.decision)) {
        throw new TypeError(
          "review.decision must be approved or changes-requested",
        );
      }
      const comment =
        input.comment === undefined
          ? ""
          : text(input.comment, "review.comment", { max: 10000 });
      const reviewer = record(reviewerValue, "reviewer");
      assertOnlyKeys(reviewer, ["subject", "email"], "reviewer");
      const trustedReviewer = {
        subject: text(reviewer.subject, "reviewer.subject", { max: 255 }),
        ...(reviewer.email === undefined
          ? {}
          : { email: text(reviewer.email, "reviewer.email", { max: 320 }) }),
      };
      const review = {
        schemaVersion: 1,
        reviewId: globalThis.crypto.randomUUID(),
        runId: manifest.runId,
        caseId: capture.caseId,
        targetId: capture.targetId,
        capturePointId: capture.capturePointId,
        profileId: capture.profileId,
        capture: {
          inputFingerprint: capture.inputFingerprint,
          siteHash: capture.site.sha256.toLowerCase(),
          referenceHash: capture.reference?.sha256.toLowerCase() ?? null,
        },
        decision: input.decision,
        comment,
        reviewer: trustedReviewer,
        createdAt: new Date().toISOString(),
      };
      const key = `${reviewPrefix(manifest.runId)}${review.reviewId}.json`;
      await putImmutable(key, jsonBytes(review, "review"), "application/json");
      return review;
    }

    async function listReviews({ runId, caseId, cursor, limit } = {}) {
      if (runId !== undefined) assertId(runId, "runId");
      if (caseId !== undefined) assertId(caseId, "caseId");
      return listJson({
        prefix: runId === undefined ? REVIEWS_PREFIX : reviewPrefix(runId),
        cursor,
        limit,
        resultName: "reviews",
        filter: (review) => !caseId || review.caseId === caseId,
      });
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
      if (
        input.runId !== manifest.runId ||
        input.caseId !== capture.caseId ||
        input.targetId !== capture.targetId ||
        input.capturePointId !== capture.capturePointId ||
        input.profileId !== capture.profileId
      ) {
        throw new TypeError(
          "assessment identity does not match the exact archived capture",
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
          "assessment.decision must remain shadow until a separately calibrated policy decides",
        );

      return {
        schemaVersion: 1,
        assessmentId: input.assessmentId.toLowerCase(),
        runId: manifest.runId,
        caseId: capture.caseId,
        targetId: capture.targetId,
        capturePointId: capture.capturePointId,
        profileId: capture.profileId,
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
      const { manifest, capture } = await getCapture(
        input.runId,
        input.caseId,
        input.targetId,
        input.capturePointId,
        input.profileId,
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

    async function listAssessments({ runId, caseId, cursor, limit } = {}) {
      if (runId !== undefined) assertId(runId, "runId");
      if (caseId !== undefined) assertId(caseId, "caseId");
      return listJson({
        prefix: assessmentPrefix(runId),
        cursor,
        limit,
        resultName: "assessments",
        filter: (assessment) => !caseId || assessment.caseId === caseId,
      });
    }

    async function createCalibration(inputValue) {
      const input = record(inputValue, "calibration");
      assertOnlyKeys(
        input,
        ["runId", "assessmentId", "calibration", "policy"],
        "calibration",
      );
      assertId(input.runId, "calibration.runId");
      const assessmentId = assertHash(
        input.assessmentId,
        "calibration.assessmentId",
      );
      const calibrationInput = record(
        input.calibration,
        "calibration.calibration",
      );
      assertOnlyKeys(
        calibrationInput,
        ["schemaVersion", "key", "observations"],
        "calibration.calibration",
      );
      if (calibrationInput.schemaVersion !== 1)
        throw new TypeError("calibration.calibration.schemaVersion must be 1");
      const policy = normalizeCalibrationPolicy(input.policy);
      if (
        !Array.isArray(calibrationInput.observations) ||
        calibrationInput.observations.length > 10000
      ) {
        throw new TypeError(
          "calibration.calibration.observations must be an array of at most 10000 rows",
        );
      }
      const targetAssessment = await findAssessment(input.runId, assessmentId);
      if (!targetAssessment)
        fail(
          404,
          "ASSESSMENT_NOT_FOUND",
          `assessment ${assessmentId} was not found in run ${input.runId}`,
        );
      const { capture } = await getCapture(
        input.runId,
        targetAssessment.caseId,
        targetAssessment.targetId,
        targetAssessment.capturePointId,
        targetAssessment.profileId,
      );
      if (
        targetAssessment.caseId !== capture.caseId ||
        targetAssessment.targetId !== capture.targetId ||
        targetAssessment.capturePointId !== capture.capturePointId ||
        targetAssessment.profileId !== capture.profileId ||
        targetAssessment.imageHashes.site !==
          capture.site.sha256.toLowerCase() ||
        targetAssessment.imageHashes.reference !==
          capture.reference?.sha256.toLowerCase()
      ) {
        fail(
          409,
          "ASSESSMENT_PIN_MISMATCH",
          "stored assessment does not match its sealed capture",
        );
      }

      const recipe = JSON.parse(
        canonicalJson({ calibration: calibrationInput, policy }),
      );
      const allAssessments = await allRecords(listAssessments, "assessments");
      const rows = [];
      const reviewsByRun = new Map();
      const capturesByIdentity = new Map();
      for (const observation of recipe.calibration.observations) {
        record(observation, "calibration observation");
        assertOnlyKeys(
          observation,
          [
            "sourceAssessmentId",
            "sourceRunId",
            "reviewId",
            "reviewerId",
            "siteSha256",
            "referenceSha256",
            "split",
            "independent",
            "humanApproved",
            "similarity",
            "criticalVeto",
            "unknownCategory",
            "provenanceVerified",
            "captureStatus",
          ],
          "calibration observation",
        );
        const sourceAssessmentId = assertHash(
          observation.sourceAssessmentId,
          "observation.sourceAssessmentId",
        );
        const source = allAssessments.find(
          (assessment) => assessment.assessmentId === sourceAssessmentId,
        );
        if (!source)
          fail(
            400,
            "UNKNOWN_SOURCE_ASSESSMENT",
            `calibration source assessment ${sourceAssessmentId} is not archived`,
          );
        if (
          observation.sourceRunId !== undefined &&
          assertId(observation.sourceRunId, "observation.sourceRunId") !==
            source.runId
        ) {
          fail(
            400,
            "CALIBRATION_SOURCE_RUN_MISMATCH",
            "calibration sourceRunId does not match the archived assessment",
          );
        }
        if (
          source.scorer.id !== recipe.calibration.key?.scorerId ||
          source.scorer.version !== recipe.calibration.key?.scorerVersion ||
          source.scorer.model !== recipe.calibration.key?.scorerModel ||
          source.profileId !== recipe.calibration.key?.profileId ||
          source.contractHash !==
            recipe.calibration.key?.contractHash?.toLowerCase() ||
          source.rubricVersion !== recipe.calibration.key?.rubricVersion
        ) {
          fail(
            400,
            "CALIBRATION_SOURCE_KEY_MISMATCH",
            "calibration source assessment does not match the supplied scorer key",
          );
        }
        const sourceCaptureKey = canonicalJson({
          runId: source.runId,
          caseId: source.caseId,
          targetId: source.targetId,
          capturePointId: source.capturePointId,
          profileId: source.profileId,
        });
        let sourceCapture = capturesByIdentity.get(sourceCaptureKey);
        if (!sourceCapture) {
          sourceCapture = (
            await getCapture(
              source.runId,
              source.caseId,
              source.targetId,
              source.capturePointId,
              source.profileId,
            )
          ).capture;
          capturesByIdentity.set(sourceCaptureKey, sourceCapture);
        }
        if (
          sourceCapture.status !== "captured" ||
          sourceCapture.site.sha256.toLowerCase() !== source.imageHashes.site ||
          sourceCapture.reference?.sha256.toLowerCase() !==
            source.imageHashes.reference ||
          sourceCapture.provenance.verified !== source.provenanceVerified ||
          source.failureCount !== 0
        ) {
          fail(
            400,
            "CALIBRATION_SOURCE_CAPTURE_MISMATCH",
            "calibration source assessment is not pinned to a verified successful capture",
          );
        }
        const normalizedObservation = {
          ...observation,
          sourceAssessmentId,
          ...(observation.sourceRunId === undefined
            ? {}
            : {
                sourceRunId: assertId(
                  observation.sourceRunId,
                  "observation.sourceRunId",
                ),
              }),
          ...(observation.reviewId === undefined
            ? {}
            : {
                reviewId: text(observation.reviewId, "observation.reviewId", {
                  max: 128,
                }),
              }),
          reviewerId: text(observation.reviewerId, "observation.reviewerId", {
            max: 255,
          }),
          siteSha256: assertHash(
            observation.siteSha256,
            "observation.siteSha256",
          ),
          referenceSha256: assertHash(
            observation.referenceSha256,
            "observation.referenceSha256",
          ),
        };
        if (
          normalizedObservation.siteSha256 !== source.imageHashes.site ||
          normalizedObservation.referenceSha256 !==
            source.imageHashes.reference ||
          normalizedObservation.similarity !== source.similarity ||
          normalizedObservation.criticalVeto !== source.criticalVeto ||
          normalizedObservation.unknownCategory !== source.unknownCategory ||
          normalizedObservation.provenanceVerified !==
            source.provenanceVerified ||
          normalizedObservation.captureStatus !== sourceCapture.status
        ) {
          fail(
            400,
            "CALIBRATION_OBSERVATION_MISMATCH",
            "calibration observation does not match its archived assessment and capture",
          );
        }
        let sourceReviews = reviewsByRun.get(source.runId);
        if (!sourceReviews) {
          sourceReviews = (
            await allRecords(listReviews, "reviews", { runId: source.runId })
          ).filter(
            (review) =>
              review.caseId === source.caseId &&
              review.targetId === source.targetId &&
              review.capturePointId === source.capturePointId &&
              review.profileId === source.profileId &&
              review.capture.inputFingerprint ===
                sourceCapture.inputFingerprint &&
              review.capture.siteHash === source.imageHashes.site &&
              review.capture.referenceHash === source.imageHashes.reference,
          );
          reviewsByRun.set(source.runId, sourceReviews);
        }
        const reviewerReviews = sourceReviews
          .filter(
            (review) =>
              review.reviewer.subject === normalizedObservation.reviewerId,
          )
          .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
        const latestReview = reviewerReviews[0];
        if (!latestReview)
          fail(
            400,
            "CALIBRATION_REVIEW_REQUIRED",
            `reviewer ${normalizedObservation.reviewerId} has no review for source assessment ${sourceAssessmentId}`,
          );
        if (
          normalizedObservation.reviewId !== undefined &&
          normalizedObservation.reviewId !== latestReview.reviewId
        ) {
          fail(
            400,
            "CALIBRATION_REVIEW_ID_MISMATCH",
            "calibration reviewId must identify the reviewer's latest pinned review",
          );
        }
        const latestDecisionSet = new Set(
          reviewerReviews
            .filter((review) => review.createdAt === latestReview.createdAt)
            .map((review) => review.decision),
        );
        if (latestDecisionSet.size > 1)
          fail(
            409,
            "AMBIGUOUS_CALIBRATION_REVIEW",
            "reviewer has conflicting pinned decisions at the same server timestamp",
          );
        if (
          normalizedObservation.humanApproved !==
          (latestReview.decision === "approved")
        ) {
          fail(
            400,
            "CALIBRATION_REVIEW_MISMATCH",
            "calibration approval label does not match the reviewer's latest pinned review",
          );
        }
        rows.push(normalizedObservation);
      }

      const computed = calibrateAssessment({
        assessment: targetAssessment,
        calibration: { ...recipe.calibration, observations: rows },
        policy,
      });
      const stored = {
        ...computed,
        runId: input.runId,
        rawRecipe: recipe,
      };
      const key = calibrationKey(computed.calibrationId);
      const existing = await readRecord(key, key);
      if (existing) {
        const { createdAt: _createdAt, ...prior } = existing;
        if (canonicalJson(prior) !== canonicalJson(stored))
          fail(
            409,
            "IMMUTABLE_CONFLICT",
            "calibrationId already exists with different content",
          );
        return existing;
      }
      const value = { ...stored, createdAt: new Date().toISOString() };
      await putImmutable(
        key,
        jsonBytes(value, "calibration"),
        "application/json",
      );
      return value;
    }

    async function findAssessment(runId, id) {
      const page = await listAssessments({
        runId,
        caseId: undefined,
        limit: 100,
      });
      let found = page.assessments.find(
        (assessment) => assessment.assessmentId === id,
      );
      let cursor = page.cursor;
      while (!found && cursor) {
        const next = await listAssessments({ runId, limit: 100, cursor });
        found = next.assessments.find(
          (assessment) => assessment.assessmentId === id,
        );
        cursor = next.cursor;
      }
      return found ?? null;
    }

    async function allRecords(listMethod, resultName, options = {}) {
      const values = [];
      let cursor;
      do {
        const page = await listMethod({
          ...options,
          limit: MAX_LIST_LIMIT,
          ...(cursor ? { cursor } : {}),
        });
        values.push(...page[resultName]);
        cursor = page.cursor;
      } while (cursor);
      return values;
    }

    function normalizeCalibrationPolicy(value) {
      const policy = record(value, "calibration.policy");
      assertOnlyKeys(
        policy,
        [
          "labelPolicyVersion",
          "similarityThreshold",
          "confidenceThreshold",
          "minSampleSize",
        ],
        "calibration.policy",
      );
      const normalized = {
        labelPolicyVersion: text(
          policy.labelPolicyVersion,
          "calibration.policy.labelPolicyVersion",
          { max: 128 },
        ),
        ...(policy.similarityThreshold === undefined
          ? {}
          : { similarityThreshold: policy.similarityThreshold }),
        ...(policy.confidenceThreshold === undefined
          ? {}
          : { confidenceThreshold: policy.confidenceThreshold }),
        ...(policy.minSampleSize === undefined
          ? {}
          : { minSampleSize: policy.minSampleSize }),
      };
      if (
        normalized.similarityThreshold !== undefined &&
        (!Number.isFinite(normalized.similarityThreshold) ||
          normalized.similarityThreshold < 98 ||
          normalized.similarityThreshold > 100)
      ) {
        throw new TypeError(
          "calibration.policy.similarityThreshold must be from 98 to 100",
        );
      }
      if (
        normalized.confidenceThreshold !== undefined &&
        (!Number.isFinite(normalized.confidenceThreshold) ||
          normalized.confidenceThreshold < 0.99 ||
          normalized.confidenceThreshold > 1)
      ) {
        throw new TypeError(
          "calibration.policy.confidenceThreshold must be from 0.99 to 1",
        );
      }
      if (
        normalized.minSampleSize !== undefined &&
        (!Number.isInteger(normalized.minSampleSize) ||
          normalized.minSampleSize < 400)
      ) {
        throw new TypeError(
          "calibration.policy.minSampleSize must be at least 400",
        );
      }
      return normalized;
    }

    async function listCalibrations({
      assessmentId,
      profileId,
      scorerId,
      scorerVersion,
      scorerModel,
      contractHash,
      rubricVersion,
      labelPolicyVersion,
      cursor,
      limit,
    } = {}) {
      if (assessmentId !== undefined) assertHash(assessmentId, "assessmentId");
      if (profileId !== undefined && !Object.hasOwn(PROFILES, profileId))
        throw new TypeError("profileId must be a known viewport profile");
      for (const [name, value] of Object.entries({
        scorerId,
        scorerVersion,
        scorerModel,
        contractHash,
        rubricVersion,
        labelPolicyVersion,
      })) {
        if (value !== undefined)
          text(value, name, {
            max:
              name === "contractHash" ? 64 : name === "scorerModel" ? 256 : 128,
          });
      }
      const normalizedHash = contractHash?.toLowerCase();
      return listJson({
        prefix: CALIBRATIONS_PREFIX,
        cursor,
        limit,
        resultName: "calibrations",
        filter: (calibration) =>
          (!assessmentId ||
            calibration.assessmentId === assessmentId.toLowerCase()) &&
          (!profileId || calibration.calibrationKey?.profileId === profileId) &&
          (!scorerId || calibration.calibrationKey?.scorerId === scorerId) &&
          (!scorerVersion ||
            calibration.calibrationKey?.scorerVersion === scorerVersion) &&
          (!scorerModel ||
            calibration.calibrationKey?.scorerModel === scorerModel) &&
          (!normalizedHash ||
            calibration.calibrationKey?.contractHash?.toLowerCase() ===
              normalizedHash) &&
          (!rubricVersion ||
            calibration.calibrationKey?.rubricVersion === rubricVersion) &&
          (!labelPolicyVersion ||
            calibration.calibrationKey?.labelPolicyVersion ===
              labelPolicyVersion),
      });
    }

    return {
      getRun,
      listRuns,
      getObject,
      putObject,
      publish,
      sealRun,
      createReview,
      listReviews,
      createAssessment,
      listAssessments,
      createCalibration,
      listCalibrations,
    };
  };
}

function createFileStore(rootValue) {
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

function createR2Store(bucket) {
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
    async createReview(input) {
      return jsonRequest("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: canonicalJson(input),
      });
    },
    async listReviews(options = {}) {
      return jsonRequest(listPath("/api/reviews", options), { method: "GET" });
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
    async createCalibration(input) {
      return jsonRequest("/api/calibrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: canonicalJson(input),
      });
    },
    async listCalibrations(options = {}) {
      return jsonRequest(listPath("/api/calibrations", options), {
        method: "GET",
      });
    },
  };
}
