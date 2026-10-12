import { createHash } from "node:crypto";
import { canonicalJson, PROFILES, validateLocale } from "./model.mjs";

const HASH = /^[a-f0-9]{64}$/i;
const DIMENSIONS = ["layout", "typography", "color", "imagery", "content"];
const CRITICAL_CATEGORIES = new Set([
  "wrong_state",
  "missing_control",
  "important_value",
  "clipping",
]);

function record(value, path) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object`);
  }
  return value;
}

function text(value, path) {
  if (typeof value !== "string" || value.trim() === "")
    throw new TypeError(`${path} must be non-empty text`);
  return value;
}

function hash(value, path) {
  if (typeof value !== "string" || !HASH.test(value))
    throw new TypeError(`${path} must be a SHA-256 digest`);
  return value.toLowerCase();
}

function score(value, path) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 100
  ) {
    throw new TypeError(`${path} must be a number from 0 to 100`);
  }
  return value;
}

function validateDimensions(value) {
  const dimensions = record(value, "report.dimensions");
  const unknownCategories = Object.keys(dimensions).filter(
    (key) => !DIMENSIONS.includes(key),
  );
  const normalized = {};
  for (const name of DIMENSIONS) {
    const dimension = record(dimensions[name], `report.dimensions.${name}`);
    if (!Array.isArray(dimension.findings)) {
      throw new TypeError(
        `report.dimensions.${name}.findings must be an array`,
      );
    }
    normalized[name] = {
      score: score(dimension.score, `report.dimensions.${name}.score`),
      findings: dimension.findings.map((finding, index) =>
        text(finding, `report.dimensions.${name}.findings[${index}]`),
      ),
    };
  }
  return { dimensions: normalized, unknownCategories };
}

function validateMismatches(value) {
  if (!Array.isArray(value))
    throw new TypeError("report.criticalMismatches must be an array");
  const unknownCategories = [];
  const criticalMismatches = value.map((entry, index) => {
    const mismatch = record(entry, `report.criticalMismatches[${index}]`);
    const category = text(
      mismatch.category,
      `report.criticalMismatches[${index}].category`,
    );
    const evidence = text(
      mismatch.evidence,
      `report.criticalMismatches[${index}].evidence`,
    );
    if (!CRITICAL_CATEGORIES.has(category)) unknownCategories.push(category);
    return { category, evidence };
  });
  return { criticalMismatches, unknownCategories };
}

export function assessReport({
  report: rawReport,
  expected: rawExpected,
  similarityThreshold = 98,
}) {
  const report = JSON.parse(canonicalJson(rawReport));
  const expected = record(rawExpected, "expected");
  if (report.schemaVersion !== 1)
    throw new TypeError("report.schemaVersion must be 1");
  if (
    Object.hasOwn(report, "confidence") ||
    Object.hasOwn(report, "modelConfidence")
  ) {
    throw new TypeError("report must not provide model confidence");
  }
  for (const field of ["caseId", "targetId", "capturePointId", "profileId"]) {
    if (report[field] !== expected[field])
      throw new TypeError(
        `report.${field} does not match the expected capture`,
      );
  }
  const reportLocale =
    report.locale === undefined
      ? "en"
      : validateLocale(report.locale, "report.locale");
  const expectedLocale =
    expected.locale === undefined
      ? "en"
      : validateLocale(expected.locale, "expected.locale");
  if (reportLocale.toLowerCase() !== expectedLocale.toLowerCase()) {
    throw new TypeError(
      "report.locale does not match the expected capture locale",
    );
  }
  const localeTagged =
    report.locale !== undefined || expected.locale !== undefined;
  if (!Object.hasOwn(PROFILES, report.profileId))
    throw new TypeError("report.profileId is unknown");
  const scorer = record(report.scorer, "report.scorer");
  if (scorer.id !== expected.scorerId)
    throw new TypeError("report.scorer.id does not match the expected scorer");
  if (scorer.version !== expected.scorerVersion)
    throw new TypeError(
      "report.scorer.version does not match the expected scorer version",
    );
  const scorerModel = text(scorer.model, "report.scorer.model");
  if (scorerModel !== text(expected.scorerModel, "expected.scorerModel")) {
    throw new TypeError(
      "report.scorer.model does not match the expected scorer model",
    );
  }
  if (report.rubricVersion !== expected.rubricVersion)
    throw new TypeError(
      "report.rubricVersion does not match the expected rubric",
    );
  if (
    hash(report.contractHash, "report.contractHash") !==
    hash(expected.contractHash, "expected.contractHash")
  ) {
    throw new TypeError(
      "report.contractHash does not match the expected assessment contract",
    );
  }

  const imageHashes = record(report.imageHashes, "report.imageHashes");
  const siteSha256 = hash(imageHashes.site, "report.imageHashes.site");
  const referenceSha256 = hash(
    imageHashes.reference,
    "report.imageHashes.reference",
  );
  if (
    siteSha256 !== hash(expected.siteSha256, "expected.siteSha256") ||
    referenceSha256 !==
      hash(expected.referenceSha256, "expected.referenceSha256")
  ) {
    throw new TypeError(
      "report image hashes do not match the expected capture",
    );
  }
  const similarity = score(report.similarity, "report.similarity");
  if (
    !Number.isFinite(similarityThreshold) ||
    similarityThreshold < 0 ||
    similarityThreshold > 100
  ) {
    throw new TypeError("similarityThreshold must be a number from 0 to 100");
  }
  if (!["captured", "failed"].includes(expected.captureStatus))
    throw new TypeError("expected.captureStatus must be captured or failed");
  if (typeof expected.provenanceVerified !== "boolean")
    throw new TypeError("expected.provenanceVerified must be a boolean");
  if (!Number.isInteger(expected.failureCount) || expected.failureCount < 0)
    throw new TypeError("expected.failureCount must be a non-negative integer");

  const dimensionResult = validateDimensions(report.dimensions);
  const mismatchResult = validateMismatches(report.criticalMismatches);
  const unknownCategories = [
    ...new Set([
      ...dimensionResult.unknownCategories,
      ...mismatchResult.unknownCategories,
    ]),
  ];
  const criticalVeto = mismatchResult.criticalMismatches.length > 0;
  const similarityPass = similarity >= similarityThreshold;
  const captureReady =
    expected.captureStatus === "captured" &&
    expected.provenanceVerified &&
    expected.failureCount === 0;
  const assessmentId = createHash("sha256")
    .update(
      canonicalJson({
        report,
        expected: {
          caseId: expected.caseId,
          targetId: expected.targetId,
          capturePointId: expected.capturePointId,
          profileId: expected.profileId,
          scorerId: expected.scorerId,
          scorerVersion: expected.scorerVersion,
          rubricVersion: expected.rubricVersion,
          contractHash: expected.contractHash,
          siteSha256: expected.siteSha256,
          referenceSha256: expected.referenceSha256,
          captureStatus: expected.captureStatus,
          provenanceVerified: expected.provenanceVerified,
          failureCount: expected.failureCount,
          similarityThreshold,
          ...(localeTagged ? { locale: expectedLocale.toLowerCase() } : {}),
        },
      }),
    )
    .digest("hex");

  return {
    schemaVersion: 1,
    assessmentId,
    caseId: report.caseId,
    targetId: report.targetId,
    capturePointId: report.capturePointId,
    profileId: report.profileId,
    ...(localeTagged ? { locale: expectedLocale } : {}),
    scorer: { id: scorer.id, version: scorer.version, model: scorer.model },
    rubricVersion: report.rubricVersion,
    contractHash: report.contractHash.toLowerCase(),
    imageHashes: { site: siteSha256, reference: referenceSha256 },
    similarity,
    similarityThreshold,
    similarityPass,
    dimensions: dimensionResult.dimensions,
    criticalMismatches: mismatchResult.criticalMismatches,
    criticalVeto,
    unknownCategories,
    unknownCategory: unknownCategories.length > 0,
    provenanceVerified: expected.provenanceVerified,
    failureCount: expected.failureCount,
    autoAcceptCandidate:
      similarityPass &&
      !criticalVeto &&
      unknownCategories.length === 0 &&
      captureReady,
    confidence: null,
    decision: "shadow",
  };
}
